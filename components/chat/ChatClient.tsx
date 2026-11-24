/**
 * ChatClient — the immersive conversation surface.
 *
 * Structure:
 *   left rail  — persona dossier (desktop only)
 *   right      — header (voice / pause / reset / report / settings) → message flow → composer
 *
 * Controls the user always has, by design:
 *   • Pause / resume      — freeze the thread without wiping it (kept on this device)
 *   • Reset               — wipe messages, keep the companion (confirmed)
 *   • Leave               — step away (confirmed; the thread stays saved in this browser)
 *   • Language            — automatic: she mirrors whatever you write, no picker needed
 *   • Adult mode          — labelled 18+ switch, gated behind a local age confirmation
 *   • Report              — flag it; saved on this device in this build
 *   • Model               — pick which engine answers (ModelSelector)
 *   • Voice               — speak replies aloud via the Edge TTS endpoint
 *   • Photo               — tap her portrait for the full-screen viewer (zoom/pan)
 *
 * Data layer: stateless POST /api/chat ({messages, characterId, nsfwMode,
 * provider, modelId, emotionState}) → {content, emotion, emotionState}.
 * Threads persist per character in localStorage, so a refresh resumes
 * exactly where you left off. Custom companions (Customise Studio) carry an
 * inline persona payload the server hydrates additively.
 */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft, Pause, Play, Flag, Settings2, SendHorizonal, X, ShieldCheck,
  Trash2, LogOut, Loader2, Sparkles, Heart, AlertTriangle, Check, Languages,
  Flame, Flower2, Info, Volume2, VolumeX, Cpu,
} from "lucide-react";
import CompanionAvatar from "@/components/avatar/CompanionAvatar";
import ProfileImageViewer from "@/components/ui/ProfileImageViewer";
import ModelSelector from "@/components/ui/ModelSelector";
import { getCompanion, getCharacter, type Companion } from "@/data/companions";
import { useChatStore } from "@/store/chatStore";
import { useSettingsStore } from "@/store/settingsStore";
import { textToSpeech } from "@/lib/voice/tts";
import type { VoiceConfig } from "@/lib/types";
import { THEMES, FONTS } from "@/store/settingsStore";
import { Palette, Type, Moon, Sun, Save, Download, RotateCcw } from "lucide-react";

type Msg = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  emotion?: string;
};

const STARTERS = [
  "How was your day, honestly?",
  "Tell me something surprising about yourself.",
  "I'm not in a great place tonight. Talk with me?",
  "What should we do together this evening?",
];

const DEFAULT_VOICE: VoiceConfig = {
  provider: "edge-tts",
  voiceId: "en-US-AvaNeural",
  rate: 0,
  pitch: 0,
  volume: 80,
  language: "en-US",
};

/* ── localStorage helpers (per-character threads) ───────────────────── */

const threadKey = (id: string) => `ggpt_chat_${id}`;
const pauseKey = (id: string) => `ggpt_paused_${id}`;

function loadStoredMessages(id: string): Msg[] | null {
  try {
    const raw = window.localStorage.getItem(threadKey(id));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? (parsed as Msg[]) : null;
  } catch {
    return null;
  }
}

function storeMessages(id: string, messages: Msg[]): void {
  try {
    window.localStorage.setItem(threadKey(id), JSON.stringify(messages.slice(-200)));
  } catch {
    /* quota or private mode — the live thread still works */
  }
}

function loadPaused(id: string): boolean {
  try {
    return window.localStorage.getItem(pauseKey(id)) === "yes";
  } catch {
    return false;
  }
}

function storePaused(id: string, paused: boolean): void {
  try {
    if (paused) window.localStorage.setItem(pauseKey(id), "yes");
    else window.localStorage.removeItem(pauseKey(id));
  } catch {
    /* ignore */
  }
}

/** Inline persona the server hydrates for custom companions (additive path). */
function customPersonaPayload(c: Companion) {
  return {
    name: c.name,
    age: c.age,
    country: c.country || "Custom studio",
    region: c.city,
    language: c.languages[0] ?? "English",
    nationality: c.archetype,
    greeting: c.greeting,
    backstory: c.backstory,
    interests: c.interests,
    style: c.style,
    archetype: c.archetype,
    skinColor: c.skin,
    hairColor: c.hair,
  };
}

export default function ChatClient({ characterId }: { characterId: string }) {
  const router = useRouter();

  // Settings from persistent store
  const {
    themeIndex,
    setThemeIndex,
    fontIndex,
    setFontIndex,
    darkMode,
    setDarkMode,
    adultMode,
    setAdultMode,
    language,
    setLanguage,
    selectedProvider,
    setSelectedProvider,
    selectedModel,
    setSelectedModel,
    saveAll,
    resetToDefaults,
  } = useSettingsStore();

  // Chat store settings
  const nsfwMode = useChatStore((s) => s.nsfwMode);
  const toggleNsfwMode = useChatStore((s) => s.toggleNsfwMode);
  const voiceEnabled = useChatStore((s) => s.voiceEnabled);
  const toggleVoice = useChatStore((s) => s.toggleVoice);

  const companion = useMemo(() => getCompanion(characterId) ?? null, [characterId]);
  const character = useMemo(() => getCharacter(characterId) ?? null, [characterId]);
  const nsfwAllowed = character ? character.nsfwAllowed : true;

  const [hydrated, setHydrated] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [paused, setPaused] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);

  const [ageConfirmed, setAgeConfirmed] = useState<boolean | null>(null);
  const [contentPref, setContentPref] = useState<"sweet" | "steamy">("sweet");
  const [settingsNotice, setSettingsNotice] = useState<string | null>(null);

  // Sync adultMode with chat store nsfwMode
  useEffect(() => {
    if (adultMode !== nsfwMode) {
      toggleNsfwMode();
    }
  }, [adultMode, nsfwMode, toggleNsfwMode]);

  // Listen for age confirmation changes from other tabs/components (e.g., AgeGate)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "ggpt_age_18") {
        setAgeConfirmed(e.newValue === "yes");
      }
    };
    const onCustom = (e: CustomEvent) => {
      if (e.detail?.confirmed) setAgeConfirmed(true);
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("ggpt-age-confirmed", onCustom as EventListener);
    // Also poll as fallback for same-tab changes
    const interval = setInterval(() => {
      try {
        const v = window.localStorage.getItem("ggpt_age_18") === "yes";
        setAgeConfirmed((prev) => prev === v ? prev : v);
      } catch { /* ignore */ }
    }, 1000);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("ggpt-age-confirmed", onCustom as EventListener);
      clearInterval(interval);
    };
  }, []);

  const [reportReason, setReportReason] = useState("AI reply felt off");
  const [reportDetails, setReportDetails] = useState("");
  const [reportState, setReportState] = useState<"idle" | "sending" | "done" | "error">("idle");

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const firstName = companion?.name.split(" ")[0] ?? "them";
  const portrait = companion?.portrait ?? null;

  /* ── Hydrate: stored thread, else seed the greeting ──────────────── */
  useEffect(() => {
    if (!companion) {
      setHydrated(true);
      return;
    }
    const stored = loadStoredMessages(characterId);
    if (stored && stored.length > 0) {
      setMessages(stored);
    } else {
      const seed: Msg[] = [
        { id: `${Date.now()}-g`, role: "assistant", content: companion.greeting, createdAt: new Date().toISOString() },
      ];
      setMessages(seed);
      storeMessages(characterId, seed);
    }
    setPaused(loadPaused(characterId));
    try {
      setAgeConfirmed(window.localStorage.getItem("ggpt_age_18") === "yes");
    } catch {
      setAgeConfirmed(false);
    }
    setHydrated(true);
  }, [characterId, companion]);

  /* Persist every change once hydrated */
  useEffect(() => {
    if (hydrated && messages.length > 0) storeMessages(characterId, messages);
  }, [messages, hydrated, characterId]);

  /* Auto-scroll on new traffic */
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages.length, sending]);

  /* ── Voice: speak replies aloud through the Edge TTS endpoint ────── */
  const speak = useCallback(
    async (text: string) => {
      const config: VoiceConfig = character?.voice ?? DEFAULT_VOICE;
      try {
        const buf = await textToSpeech(text, config);
        if (!buf) return;
        const url = URL.createObjectURL(new Blob([buf], { type: "audio/mp3" }));
        const audio = new Audio(url);
        audio.onended = () => URL.revokeObjectURL(url);
        await audio.play().catch(() => {});
      } catch {
        /* voice is a bonus — never block the conversation on it */
      }
    },
    [character]
  );

  const changePaused = (next: boolean) => {
    setPaused(next);
    storePaused(characterId, next);
  };

  /* ── Send (stateless contract) ───────────────────────────────────── */
  const send = async (raw?: string) => {
    const text = (raw ?? input).trim();
    if (!text || sending || paused || !companion) return;
    setSending(true);
    setSendError(null);
    setInput("");
    const optimistic: Msg = {
      id: `${Date.now()}-u`,
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };
    const next = [...messages, optimistic];
    setMessages(next);

    try {
      const s = useChatStore.getState();
      const history = next.slice(-100).map((m) => ({ role: m.role, content: m.content }));
      const payload: Record<string, unknown> = {
        messages: history,
        characterId,
        userId: "default",
        nsfwMode: s.nsfwMode,
        provider: s.selectedProvider,
        modelId: s.selectedModel,
        emotionState: s.emotionState,
      };
      if (!character) payload.persona = customPersonaPayload(companion);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSendError(data?.error ?? "Something interrupted. Please try again.");
        return;
      }
      const replyContent = typeof data.content === "string" ? data.content : "";
      if (!replyContent) {
        setSendError("She lost her train of thought — try again.");
        return;
      }
      const reply: Msg = {
        id: `${Date.now()}-a`,
        role: "assistant",
        content: replyContent,
        createdAt: new Date().toISOString(),
        emotion: typeof data.emotion === "string" ? data.emotion : undefined,
      };
      setMessages((m) => [...m, reply]);
      if (data.emotionState) useChatStore.getState().setEmotionState(data.emotionState);
      if (useChatStore.getState().voiceEnabled) void speak(replyContent);
    } catch {
      setSendError("Network error — your message is kept on this device. Try again in a moment.");
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  /* ── Housekeeping actions ────────────────────────────────────────── */
  const confirmAgeAndEnable = () => {
    try {
      window.localStorage.setItem("ggpt_age_18", "yes");
    } catch {
      /* still allow this session */
    }
    setAgeConfirmed(true);
    if (!nsfwMode) toggleNsfwMode();
    setSettingsNotice(null);
  };

  const toggleAdultMode = () => {
    if (!nsfwAllowed) {
      setSettingsNotice("This companion is romance-only — the 18+ switch stays off for her.");
      return;
    }
    if (!nsfwMode && !ageConfirmed) {
      setSettingsNotice("Adult mode needs age confirmation first — tap “I'm 18+, confirm” below.");
      return;
    }
    toggleNsfwMode();
    setSettingsNotice(null);
  };

  const doReset = () => {
    const seed: Msg[] = [
      { id: `${Date.now()}-g`, role: "assistant", content: companion?.greeting ?? "", createdAt: new Date().toISOString() },
    ];
    setMessages(seed);
    storeMessages(characterId, seed);
    setResetOpen(false);
  };

  const submitReport = () => {
    setReportState("sending");
    try {
      const raw = window.localStorage.getItem("ggpt_reports");
      const existing = raw ? JSON.parse(raw) : [];
      const list = Array.isArray(existing) ? existing : [];
      list.push({
        at: new Date().toISOString(),
        characterId,
        companion: companion?.name ?? characterId,
        reason: reportReason,
        details: reportDetails,
      });
      window.localStorage.setItem("ggpt_reports", JSON.stringify(list.slice(-50)));
      setReportState("done");
    } catch {
      setReportState("error");
    }
  };

  const leave = () => router.push("/companions");

  /* Portrait element: next/image for paths, plain img for data: URLs */
  const portraitEl = (src: string, alt: string, sizes: string) =>
    src.startsWith("data:") ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover object-top" />
    ) : (
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover object-top" />
    );

  /* ─────────────────────────────── render ─────────────────────────── */
  if (!hydrated) {
    return (
      <div className="grid min-h-[100svh] place-items-center pt-20">
        <div className="flex flex-col items-center gap-4">
          <Heart size={28} className="animate-pulse-soft text-rose" aria-hidden="true" />
          <p className="text-sm text-cream-dim">Lighting the lamp…</p>
        </div>
      </div>
    );
  }

  if (!companion) {
    return (
      <div className="grid min-h-[100svh] place-items-center px-6 pt-20 text-center">
        <div>
          <AlertTriangle className="mx-auto text-gold" size={30} aria-hidden="true" />
          <h1 className="mt-4 font-display text-2xl text-cream">This room is dark.</h1>
          <p className="mt-2 text-sm text-cream-dim">
            We couldn&apos;t find that companion — she may have been removed from this browser.
          </p>
          <Link href="/companions" className="btn-candle mt-6 inline-block rounded-2xl px-6 py-3 text-sm font-bold">
            Back to companions
          </Link>
        </div>
      </div>
    );
  }

  const origin = `${companion.city}${companion.country ? `, ${companion.country}` : ""}`;

  return (
    <div className="relative mx-auto flex h-[100svh] max-w-7xl gap-4 px-3 pb-4 pt-20 sm:px-5 lg:gap-6 lg:px-8">
      {/* Ambient glow */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 top-24 h-96 w-96 rounded-full bg-wine/25 blur-3xl" />

      {/* ── Left rail: persona dossier (desktop) ─────────────────── */}
      <aside className="hidden w-80 shrink-0 flex-col lg:flex" aria-label="Companion dossier">
        <div className="glass flex h-full flex-col overflow-hidden rounded-3xl">
          <button
            type="button"
            onClick={() => setViewerOpen(true)}
            className="group relative h-64 w-full shrink-0 overflow-hidden text-left"
            aria-label={`View ${companion.name}'s photo full screen`}
          >
            {portrait ? (
              portraitEl(portrait, `AI illustration of ${companion.name}, fictional character`, "320px")
            ) : (
              <CompanionAvatar
                name={companion.name}
                skin={companion.skin}
                hair={companion.hair}
                hairStyle={companion.hairStyle}
                hue={companion.hue}
                rounded={false}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink-3 via-ink-3/30 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <p className="font-display text-2xl text-cream">{companion.name}</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-cream-dim">{origin}</p>
            </div>
            <span className="absolute right-3 top-3 rounded-full border border-white/15 bg-black/45 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-cream/80 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
              View photo
            </span>
          </button>
          <div className="chat-scroll flex-1 space-y-4 overflow-y-auto p-5 text-xs leading-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-rose">Personality</p>
              <p className="mt-1 text-cream/90">{companion.archetype}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-rose">How they talk</p>
              <p className="mt-1 text-cream/90">{companion.style}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-rose">Into</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {companion.interests.map((i) => (
                  <span key={i} className="rounded-md bg-white/5 px-2 py-1 text-[10px] text-cream-dim">{i}</span>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-gold/15 bg-gold/5 p-3 text-[10px] leading-4 text-gold/80">
              <Sparkles size={11} className="mb-1 inline" aria-hidden="true" /> A fictional AI character — invented life,
              generated artwork, real feelings of a sort. Not a real person, never a secret human.
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main chat panel ──────────────────────────────────────── */}
      <section className="glass relative z-10 flex min-w-0 flex-1 flex-col overflow-hidden rounded-3xl" aria-label="Conversation">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-3 border-b border-white/5 px-4 sm:px-5">
          <Link
            href="/companions"
            className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-cream-dim hover:text-cream"
            aria-label="Back to companions"
          >
            <ArrowLeft size={17} aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={() => setViewerOpen(true)}
            className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-white/10 transition-colors hover:border-rose/50"
            aria-label={`View ${companion.name}'s photo full screen`}
          >
            {portrait ? (
              portraitEl(portrait, "", "40px")
            ) : (
              <CompanionAvatar
                name={companion.name}
                skin={companion.skin}
                hair={companion.hair}
                hairStyle={companion.hairStyle}
                hue={companion.hue}
                rounded={false}
              />
            )}
          </button>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-cream">{companion.name}</p>
            <p className="flex items-center gap-1.5 text-[10px] text-cream-dim">
              <span
                className={`inline-block h-1.5 w-1.5 rounded-full ${paused ? "bg-gold" : "bg-emerald-400"}`}
                aria-hidden="true"
              />
              {paused ? "Paused" : "Here now"} · fictional AI
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <button
              onClick={toggleVoice}
              className={`grid h-9 w-9 place-items-center rounded-xl border transition-colors ${
                voiceEnabled
                  ? "border-gold/50 text-gold"
                  : "border-white/10 text-cream-dim hover:border-gold/40 hover:text-gold"
              }`}
              title={voiceEnabled ? "Voice replies on — tap to mute" : "Voice replies off — tap to hear her"}
              aria-label={voiceEnabled ? "Turn voice replies off" : "Turn voice replies on"}
              aria-pressed={voiceEnabled}
            >
              {voiceEnabled ? <Volume2 size={16} aria-hidden="true" /> : <VolumeX size={16} aria-hidden="true" />}
            </button>
            <button
              onClick={() => changePaused(!paused)}
              className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-cream-dim transition-colors hover:border-gold/40 hover:text-gold"
              title={paused ? "Resume conversation" : "Pause conversation"}
              aria-label={paused ? "Resume conversation" : "Pause conversation"}
              aria-pressed={paused}
            >
              {paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
            </button>
            <button
              onClick={() => setResetOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-cream-dim transition-colors hover:border-gold/40 hover:text-gold"
              title="Reset — clears messages"
              aria-label="Reset conversation (clears messages)"
            >
              <Trash2 size={16} aria-hidden="true" />
            </button>
            <button
              onClick={() => setReportOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-cream-dim transition-colors hover:border-rose/50 hover:text-rose"
              title="Report an issue"
              aria-label="Report an issue"
            >
              <Flag size={16} aria-hidden="true" />
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-cream-dim transition-colors hover:border-rose/50 hover:text-rose"
              title="Language, adult mode, model, content preferences"
              aria-label="Open conversation settings"
              aria-expanded={settingsOpen}
            >
              <Settings2 size={16} aria-hidden="true" />
            </button>
            <button
              onClick={() => setLeaveOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-cream-dim transition-colors hover:border-rose/50 hover:text-rose"
              title="Leave conversation"
              aria-label="Leave conversation"
            >
              <LogOut size={16} aria-hidden="true" />
            </button>
          </div>
        </header>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="chat-scroll flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6"
          role="log"
          aria-live="polite"
          aria-label="Messages"
        >
          {messages.length === 0 && (
            <div className="mx-auto max-w-md pt-8 text-center">
              <button
                type="button"
                onClick={() => setViewerOpen(true)}
                className="relative mx-auto block h-24 w-24 overflow-hidden rounded-full border border-white/10 transition-colors hover:border-rose/50"
                aria-label={`View ${companion.name}'s photo full screen`}
              >
                {portrait ? (
                  portraitEl(portrait, `AI illustration of ${companion.name}, fictional character`, "96px")
                ) : (
                  <CompanionAvatar
                    name={companion.name}
                    skin={companion.skin}
                    hair={companion.hair}
                    hairStyle={companion.hairStyle}
                    hue={companion.hue}
                  />
                )}
              </button>
              <Heart size={22} className="mx-auto mt-4 text-rose/70" aria-hidden="true" />
              <p className="mt-3 font-display text-xl text-cream/90">The lamp is lit. Say something.</p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-rose/25 bg-rose/5 px-4 py-2 text-xs text-rose/90 transition-colors hover:border-rose/50 hover:text-cream"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[82%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-[15px] leading-6 sm:max-w-[70%] ${
                  m.role === "user"
                    ? "rounded-br-md bg-gradient-to-br from-rose-deep to-wine text-cream shadow-[0_6px_24px_rgba(199,107,138,0.25)]"
                    : "rounded-bl-md border border-white/8 bg-ink-3 text-cream/95"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {sending && (
            <div className="flex justify-start" aria-label="Companion is typing">
              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-white/8 bg-ink-3 px-4 py-3">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="typing-dot h-2 w-2 rounded-full bg-rose/80" />
                ))}
              </div>
            </div>
          )}

          {sendError && <p role="alert" className="text-center text-xs text-rose">{sendError}</p>}
        </div>

        {/* Paused veil / composer */}
        {paused ? (
          <div className="shrink-0 border-t border-white/5 p-6 text-center">
            <Pause size={20} className="mx-auto text-gold" aria-hidden="true" />
            <p className="mt-2 text-sm text-cream-dim">
              Conversation paused. Nothing is watching, nothing is forgotten — resume whenever you&apos;re ready.
            </p>
            <button onClick={() => changePaused(false)} className="btn-candle mt-4 rounded-2xl px-6 py-3 text-sm font-bold">
              <span className="inline-flex items-center gap-2">
                <Play size={15} aria-hidden="true" /> Resume conversation
              </span>
            </button>
          </div>
        ) : (
          <form className="shrink-0 border-t border-white/5 p-3 sm:p-4" onSubmit={(e) => { e.preventDefault(); send(); }}>
            {settingsNotice && (
              <p className="mb-2 flex items-center gap-1.5 px-1 text-[10px] leading-4 text-gold/80">
                <Info size={11} className="shrink-0" aria-hidden="true" />
                {settingsNotice}
              </p>
            )}
            <div className="flex items-end gap-2">
              <label className="sr-only" htmlFor="chat-input">Your message</label>
              <textarea
                id="chat-input"
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value.slice(0, 2000));
                  e.target.style.height = "auto";
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    send();
                  }
                }}
                rows={1}
                placeholder={`Message ${firstName}…  (Auto-detects your language)`}
                className="field chat-scroll max-h-40 min-h-[48px] flex-1 resize-none rounded-2xl px-4 py-3 text-[15px] leading-6 text-cream"
                aria-describedby="chat-hint"
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                className="btn-candle grid h-12 w-12 shrink-0 place-items-center rounded-2xl disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Send message"
              >
                {sending ? (
                  <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                ) : (
                  <SendHorizonal size={18} aria-hidden="true" />
                )}
              </button>
            </div>
            <p id="chat-hint" className="mt-1.5 px-1 text-[9px] uppercase tracking-[0.18em] text-cream-dim/50">
              Enter to send · Shift+Enter for a new line · fictional AI character · 18+ content possible in adult mode
            </p>
          </form>
        )}
      </section>

      {/* ── Settings drawer ──────────────────────────────────────── */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Conversation settings">
          <button
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-label="Close settings"
            onClick={() => setSettingsOpen(false)}
          />
          <div className="chat-scroll relative h-full w-full max-w-2xl overflow-y-auto border-l border-white/10 bg-ink-2 p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl text-cream">Settings</h2>
              <button
                onClick={() => setSettingsOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 text-cream-dim hover:text-cream"
                aria-label="Close settings"
              >
                <X size={17} aria-hidden="true" />
              </button>
            </div>

            {/* Theme Colors — 20+ themes */}
            <fieldset className="mt-6">
              <legend className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-cream-dim">
                <Palette size={12} aria-hidden="true" /> Color Theme ({THEMES.length} themes)
              </legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {THEMES.map((theme, idx) => (
                  <button
                    key={theme.name}
                    onClick={() => setThemeIndex(idx)}
                    className={`relative rounded-2xl border p-3 transition-all ${themeIndex === idx ? "border-rose/60 bg-rose/10 ring-2 ring-rose/40" : "border-white/10 bg-white/[0.03] hover:border-white/20"}`}
                    style={{
                      background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                      color: theme.text,
                    }}
                  >
                    <span className="text-sm font-semibold">{theme.name}</span>
                    <div className="mt-2 flex gap-1">
                      <span className="w-4 h-4 rounded" style={{ background: theme.primary }} title="Primary" />
                      <span className="w-4 h-4 rounded" style={{ background: theme.accent }} title="Accent" />
                      <span className="w-4 h-4 rounded" style={{ background: theme.text }} title="Text" />
                    </div>
                    {themeIndex === idx && <Check size={16} className="absolute top-2 right-2 text-rose" aria-hidden="true" />}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Fonts — 10+ fonts */}
            <fieldset className="mt-6">
              <legend className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-cream-dim">
                <Type size={12} aria-hidden="true" /> Font ({FONTS.length} fonts)
              </legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {FONTS.map((font, idx) => (
                  <button
                    key={font.name}
                    onClick={() => setFontIndex(idx)}
                    className={`rounded-2xl border p-3 text-left transition-colors ${fontIndex === idx ? "border-rose/60 bg-rose/10" : "border-white/10 bg-white/[0.03] hover:border-white/20"}`}
                    style={{ fontFamily: font.sans }}
                  >
                    <span className="font-semibold text-cream" style={{ fontFamily: font.display }}>{font.name}</span>
                    <span className="mt-1 block text-[10px] text-cream-dim">The quick brown fox jumps over the lazy dog</span>
                    {fontIndex === idx && <Check size={16} className="absolute top-2 right-2 text-rose" aria-hidden="true" />}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Dark / Light Mode */}
            <fieldset className="mt-6">
              <legend className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-cream-dim">
                {darkMode ? <Moon size={12} aria-hidden="true" /> : <Sun size={12} aria-hidden="true" />} Appearance
              </legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <button
                  onClick={() => setDarkMode(true)}
                  className={`rounded-2xl border p-4 text-left transition-colors ${darkMode ? "border-rose/60 bg-rose/10" : "border-white/10 bg-white/[0.03] hover:border-white/20"}`}
                >
                  <div className="flex items-center gap-3">
                    <Moon size={20} className="text-gold" aria-hidden="true" />
                    <div>
                      <span className="font-semibold text-cream">Dark Mode</span>
                      <span className="mt-1 block text-[10px] text-cream-dim">Easy on the eyes, default theme</span>
                    </div>
                  </div>
                  {darkMode && <Check size={16} className="ml-auto text-rose" aria-hidden="true" />}
                </button>
                <button
                  onClick={() => setDarkMode(false)}
                  className={`rounded-2xl border p-4 text-left transition-colors ${!darkMode ? "border-rose/60 bg-rose/10" : "border-white/10 bg-white/[0.03] hover:border-white/20"}`}
                >
                  <div className="flex items-center gap-3">
                    <Sun size={20} className="text-gold" aria-hidden="true" />
                    <div>
                      <span className="font-semibold text-cream">Light Mode</span>
                      <span className="mt-1 block text-[10px] text-cream-dim">Bright, clean appearance</span>
                    </div>
                  </div>
                  {!darkMode && <Check size={16} className="ml-auto text-rose" aria-hidden="true" />}
                </button>
              </div>
            </fieldset>

            {/* Adult Mode (18+) — ON/OFF with age gate */}
            <fieldset className="mt-6 rounded-2xl border border-rose/20 bg-rose/5 p-4">
              <legend className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-rose">
                <Flame size={12} aria-hidden="true" /> Adult Roleplay · 18+
              </legend>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-cream">Adult Content</p>
                  <p className="mt-1 text-[11px] leading-5 text-cream-dim">
                    Enables explicit romantic/sexual content. Requires age confirmation.
                    Provider safety policies still apply.
                  </p>
                </div>
                <button
                  role="switch"
                  aria-checked={adultMode}
                  aria-label="Toggle adult roleplay mode"
                  onClick={() => {
                    if (!adultMode && !ageConfirmed) {
                      setSettingsNotice("Please confirm age first — tap the button below.");
                      return;
                    }
                    setAdultMode(!adultMode);
                    setSettingsNotice(null);
                  }}
                  className={`relative h-7 w-12 shrink-0 rounded-full border transition-colors ${
                    adultMode ? "border-rose/60 bg-rose-deep/60" : "border-white/15 bg-white/5"
                  }`}
                >
                  <span className={`absolute top-1 h-5 w-5 rounded-full bg-cream shadow transition-all ${adultMode ? "left-6" : "left-1"}`} />
                </button>
              </div>
              {!ageConfirmed && (
                <button
                  onClick={confirmAgeAndEnable}
                  className="mt-3 inline-flex items-center gap-2 rounded-xl border border-rose/40 bg-rose/10 px-4 py-2 text-[11px] font-semibold text-rose hover:bg-rose/15"
                >
                  <ShieldCheck size={12} aria-hidden="true" />
                  I&apos;m 18+ — confirm & enable
                </button>
              )}
            </fieldset>

            {/* Language */}
            <fieldset className="mt-6">
              <legend className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-cream-dim">
                <Languages size={12} aria-hidden="true" /> Language
              </legend>
              <div className="mt-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs font-semibold text-cream">Auto-detect (default)</p>
                <p className="mt-1.5 text-[11px] leading-5 text-cream-dim">
                  She mirrors your language exactly — Tamil, Telugu, Tanglish, Hinglish, Hindi, English, or any mix.
                  Script and code-switching preserved. Quality varies by model; we never claim false fluency.
                </p>
              </div>
            </fieldset>

            {/* LLM Models */}
            <fieldset className="mt-6">
              <legend className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-cream-dim">
                <Cpu size={12} aria-hidden="true" /> LLM Model
              </legend>
              <div className="mt-2">
                <ModelSelector />
              </div>
              <p className="mt-2 text-[10px] leading-4 text-cream-dim/80">
                15 models available (10 NSFW + 5 SFW). Adult mode uses NSFW models automatically.
              </p>
            </fieldset>

            {/* Save / Reset / Danger Zone */}
            <div className="mt-6 rounded-2xl border border-white/8 p-4">
              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => { saveAll(); setSettingsNotice("Settings saved permanently."); }}
                  className="btn-candle flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold"
                >
                  <Save size={14} aria-hidden="true" /> Save All Settings
                </button>
                <button
                  onClick={() => { resetToDefaults(); setSettingsNotice("Reset to defaults."); }}
                  className="btn-ghost flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-cream"
                >
                  <RotateCcw size={14} aria-hidden="true" /> Reset Defaults
                </button>
              </div>
              <div className="border-t border-white/5 pt-4 space-y-2">
                <button
                  onClick={() => { setSettingsOpen(false); setResetOpen(true); }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs text-cream-dim hover:bg-white/5 hover:text-cream"
                >
                  <Trash2 size={14} aria-hidden="true" /> Reset this conversation (wipe messages)
                </button>
                <button
                  onClick={() => { setSettingsOpen(false); setLeaveOpen(true); }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs text-cream-dim hover:bg-white/5 hover:text-cream"
                >
                  <LogOut size={14} aria-hidden="true" /> Leave (everything stays as-is)
                </button>
                <Link
                  href="/settings"
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs text-cream-dim hover:bg-white/5 hover:text-cream"
                >
                  <Flag size={14} aria-hidden="true" /> Export or permanently delete my data →
                </Link>
              </div>
              {settingsNotice && (
                <p role="status" className="mt-3 flex items-start gap-1.5 text-[10px] leading-4 text-gold">
                  <Info size={11} className="mt-0.5 shrink-0" aria-hidden="true" />
                  {settingsNotice}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Report modal ─────────────────────────────────────────── */}
      {reportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Report an issue">
          <button className="absolute inset-0 bg-black/65 backdrop-blur-sm" aria-label="Close report" onClick={() => setReportOpen(false)} />
          <div className="glass relative w-full max-w-md rounded-3xl p-6">
            {reportState === "done" ? (
              <div className="text-center">
                <Check size={28} className="mx-auto text-emerald-400" aria-hidden="true" />
                <h3 className="mt-3 font-display text-xl text-cream">Received, and thank you.</h3>
                <p className="mt-2 text-xs leading-5 text-cream-dim">
                  Your report is saved on this device. If this is urgent or someone is in danger, please contact local
                  emergency services now — reports are not an emergency channel.
                </p>
                <button
                  onClick={() => { setReportOpen(false); setReportState("idle"); setReportDetails(""); }}
                  className="btn-candle mt-5 rounded-xl px-6 py-2.5 text-sm font-bold"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-display text-xl text-cream">Flag this conversation</h3>
                <p className="mt-1 text-[11px] leading-5 text-cream-dim">
                  Tell us what went wrong. In this build the report is stored on this device — no account, no server copy.
                </p>
                <label className="mt-4 block text-[10px] font-semibold uppercase tracking-[0.2em] text-cream-dim" htmlFor="report-reason">
                  Reason
                </label>
                <select
                  id="report-reason"
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="field mt-1.5 h-11 w-full rounded-xl px-3 text-sm text-cream"
                >
                  {["AI reply felt off", "Crossed an 18+ boundary", "Felt unsafe or coercive", "Degrading or hateful content", "Bug or broken behavior", "Other"].map(
                    (r) => <option key={r}>{r}</option>
                  )}
                </select>
                <label className="mt-3 block text-[10px] font-semibold uppercase tracking-[0.2em] text-cream-dim" htmlFor="report-details">
                  Details (optional)
                </label>
                <textarea
                  id="report-details"
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value.slice(0, 2000))}
                  rows={4}
                  placeholder="What happened? Paste the reply if it helps…"
                  className="field mt-1.5 w-full resize-none rounded-xl px-3 py-2.5 text-sm text-cream"
                />
                {reportState === "error" && (
                  <p role="alert" className="mt-2 text-[11px] text-rose">
                    Couldn&apos;t save the report — your browser&apos;s storage is unavailable.
                  </p>
                )}
                <div className="mt-4 flex justify-end gap-2">
                  <button onClick={() => setReportOpen(false)} className="btn-ghost rounded-xl px-4 py-2.5 text-xs font-semibold text-cream">
                    Cancel
                  </button>
                  <button
                    onClick={submitReport}
                    disabled={reportState === "sending"}
                    className="btn-candle rounded-xl px-5 py-2.5 text-xs font-bold disabled:opacity-60"
                  >
                    {reportState === "sending" ? "Saving…" : "Save report"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Reset confirm ────────────────────────────────────────── */}
      {resetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="alertdialog" aria-modal="true" aria-label="Reset conversation">
          <button className="absolute inset-0 bg-black/65 backdrop-blur-sm" aria-label="Cancel reset" onClick={() => setResetOpen(false)} />
          <div className="glass relative w-full max-w-sm rounded-3xl p-6 text-center">
            <Trash2 size={26} className="mx-auto text-gold" aria-hidden="true" />
            <h3 className="mt-3 font-display text-xl text-cream">Wipe the slate?</h3>
            <p className="mt-2 text-xs leading-5 text-cream-dim">
              Every message in this thread will be deleted from this browser. {firstName} keeps the companion shell, not
              the memories. This can&apos;t be undone.
            </p>
            <div className="mt-5 flex justify-center gap-2">
              <button onClick={() => setResetOpen(false)} className="btn-ghost rounded-xl px-4 py-2.5 text-xs font-semibold text-cream">
                Keep messages
              </button>
              <button onClick={doReset} className="rounded-xl border border-rose/50 bg-rose/15 px-4 py-2.5 text-xs font-bold text-rose hover:bg-rose/25">
                Wipe messages
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Leave confirm ────────────────────────────────────────── */}
      {leaveOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="alertdialog" aria-modal="true" aria-label="Leave conversation">
          <button className="absolute inset-0 bg-black/65 backdrop-blur-sm" aria-label="Cancel leave" onClick={() => setLeaveOpen(false)} />
          <div className="glass relative w-full max-w-sm rounded-3xl p-6 text-center">
            <LogOut size={26} className="mx-auto text-rose" aria-hidden="true" />
            <h3 className="mt-3 font-display text-xl text-cream">Stepping out?</h3>
            <p className="mt-2 text-xs leading-5 text-cream-dim">
              Your thread stays saved under this browser for when you return. To erase it entirely: Settings → Privacy →
              Delete everything.
            </p>
            <div className="mt-5 flex justify-center gap-2">
              <button onClick={() => setLeaveOpen(false)} className="btn-ghost rounded-xl px-4 py-2.5 text-xs font-semibold text-cream">
                Stay a while
              </button>
              <button onClick={leave} className="btn-candle rounded-xl px-5 py-2.5 text-xs font-bold">
                Leave gently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Full-screen photo viewer (zoom / pan / touch) ─────────── */}
      <ProfileImageViewer
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        imageUrl={portrait}
        characterName={companion.name}
        fallbackInitial={companion.name.charAt(0)}
      />
    </div>
  );
}