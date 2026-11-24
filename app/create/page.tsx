/**
 * /create — the Customise Studio.
 *
 * Two-pane: live illustrated preview (SVG, instant) on the left, editor on
 * the right. Optional AI portrait generation goes through /api/generate-portrait
 * (server-side key, labelled output, rate-limited) — never from the client.
 *
 * Every custom companion is an adult by construction, fictional, and labelled
 * AI-generated everywhere it appears.
 */
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles, Wand2, Loader2, ShieldCheck, User, Palette, ScrollText,
  Info, Check, ArrowRight, ChevronDown,
} from "lucide-react";
import CompanionAvatar from "@/components/avatar/CompanionAvatar";
import { ARCHETYPES, buildCustomCompanion, saveCustomCompanion, type Archetype } from "@/data/companions";

/* ── Option sets: broad, non-ranked, respectfully labelled ─────────────── */
const SKIN_TONES = [
  { label: "Porcelain", value: "#f6d8c9" }, { label: "Sand", value: "#eac4a4" },
  { label: "Honey", value: "#d8a377" }, { label: "Amber", value: "#c98e63" },
  { label: "Toffee", value: "#a9764e" }, { label: "Bronze", value: "#8a5636" },
  { label: "Deep umber", value: "#5d3a21" }, { label: "Ebony", value: "#3f2712" },
];
const HAIR_COLORS = [
  { label: "Soft black", value: "#17120f" }, { label: "Espresso", value: "#241812" },
  { label: "Deep brown", value: "#3a241a" }, { label: "Chestnut", value: "#6b3f22" },
  { label: "Copper", value: "#8a3a1c" }, { label: "Auburn", value: "#a03e1e" },
  { label: "Golden", value: "#c9853e" }, { label: "Silver", value: "#d8d3cd" },
];
const HAIR_STYLES = [
  { label: "Soft bun", value: 0 }, { label: "Long waves", value: 1 }, { label: "Sleek bob", value: 2 },
  { label: "High ponytail", value: 3 }, { label: "Natural curls", value: 4 }, { label: "Side braid", value: 5 },
];
const EYE_COLORS = ["Brown", "Amber", "Hazel", "Green", "Gray", "Blue", "Near-black"];
const BODY_TYPES = [
  { label: "Petite", value: "petite" }, { label: "Balanced", value: "balanced" },
  { label: "Athletic", value: "athletic" }, { label: "Curvy", value: "curvy" }, { label: "Tall & lean", value: "tall lean" },
];
const HUES = [
  { label: "Rose", value: 335 }, { label: "Wine", value: 285 }, { label: "Ember", value: 15 }, { label: "Marigold", value: 45 },
  { label: "Jade", value: 160 }, { label: "Teal", value: 192 }, { label: "Indigo", value: 250 }, { label: "Plum", value: 0 },
];
const LANGUAGES = ["English", "Tamil", "Thanglish", "Malayalam", "Telugu", "Kannada", "Hindi", "Sinhala", "Mandarin Chinese", "Japanese", "Korean", "Russian", "Spanish", "French", "Portuguese", "Italian", "German", "Arabic", "Other"];

export default function CreatePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [archetype, setArchetype] = useState<string>(ARCHETYPES[0]);
  const [origin, setOrigin] = useState("");
  const [language, setLanguage] = useState("English");
  const [interests, setInterests] = useState("");
  const [style, setStyle] = useState("");
  const [backstory, setBackstory] = useState("");
  const [skinTone, setSkinTone] = useState(SKIN_TONES[3].value);
  const [hairColor, setHairColor] = useState(HAIR_COLORS[1].value);
  const [hairStyle, setHairStyle] = useState(1);
  const [eyeColor, setEyeColor] = useState("Brown");
  const [bodyType, setBodyType] = useState("balanced");
  const [hue, setHue] = useState(335);

  const [aiBusy, setAiBusy] = useState(false);
  const [aiImage, setAiImage] = useState<string | null>(null);
  const [aiNotice, setAiNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ready = name.trim().length >= 2;
  const hairLabel = useMemo(() => HAIR_STYLES.find((h) => h.value === hairStyle)?.label.toLowerCase() ?? "wavy hair", [hairStyle]);

  const generatePortrait = async () => {
    setAiBusy(true);
    setAiNotice(null);
    setAiImage(null);
    try {
      const skinLabel = SKIN_TONES.find((s) => s.value === skinTone)?.label.toLowerCase() ?? "warm";
      const hairColorLabel = HAIR_COLORS.find((h) => h.value === hairColor)?.label.toLowerCase() ?? "dark";
      const prompt = [
        `portrait of ${name.trim() || "a fictional adult woman"}, ${skinLabel} skin, ${hairLabel} ${hairColorLabel} hair, ${eyeColor.toLowerCase()} eyes, ${bodyType} build`,
        "face focus, soft candlelight, elegant, tasteful, high detail",
      ].join(", ");
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, style: "portrait", isNsfw: false }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAiNotice(data?.error ?? "The provider couldn't generate that. Try again later.");
        return;
      }
      setAiImage(data.imageUrl);
      setAiNotice(data.notice ?? "AI-generated artwork of a fictional character — not a photograph of a real person.");
    } catch {
      setAiNotice("Network error while contacting the image provider.");
    } finally {
      setAiBusy(false);
    }
  };

  const createCompanion = () => {
    if (!ready || busy) return;
    setBusy(true);
    setError(null);
    try {
      const companion = buildCustomCompanion({
        name: name.trim(),
        archetype: archetype as Archetype,
        language: language === "auto" ? "auto" : language,
        origin: origin.trim(),
        interests: interests.trim(),
        style: style.trim(),
        backstory: backstory.trim(),
        skinTone,
        hairColor,
        hairStyle,
        hue,
        portrait: aiImage ?? undefined,
      });
      saveCustomCompanion(companion);
      router.push(`/chat/${companion.id}`);
    } catch {
      setError("Couldn't save your companion in this browser. Check that local storage is enabled and try again.");
      setBusy(false);
    }
  };

  const sectionTitle = (icon: React.ReactNode, text: string) => (
    <h2 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-rose">
      <span className="text-gold">{icon}</span>{text}
    </h2>
  );

  const swatch = (
    label: string, selected: boolean, onClick: () => void, inner: React.ReactNode, key?: string
  ) => (
    <button
      key={key ?? label}
      onClick={onClick}
      aria-pressed={selected}
      title={label}
      className={`group flex flex-col items-center gap-1.5 rounded-2xl border p-2 transition-all ${selected ? "border-rose/60 bg-rose/10 shadow-[0_0_20px_rgba(233,162,184,0.15)]" : "border-white/8 bg-white/[0.03] hover:border-white/20"}`}
    >
      {inner}
      <span className="text-[9px] font-medium uppercase tracking-wider text-cream-dim group-hover:text-cream">{label}</span>
    </button>
  );

  return (
    <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-8">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-16 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-wine/25 blur-3xl" />

      <header className="relative max-w-3xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-rose">The customise studio</p>
        <h1 className="mt-3 font-display text-4xl font-light leading-[1.05] text-cream sm:text-5xl">Write someone<br /><span className="text-aurora">worth talking to.</span></h1>
        <p className="mt-4 max-w-xl text-sm leading-6 text-cream-dim">
          Name them, shape them, choose their light. Every custom companion is an adult, fictional,
          and labelled AI — a character you authored, not a person who isn&apos;t there.
        </p>
      </header>

      <div className="relative mt-10 grid gap-8 lg:grid-cols-12">
        {/* ── Live preview ── */}
        <div className="lg:col-span-5">
          <div className="glass sticky top-24 overflow-hidden rounded-[2rem] p-5">
            {sectionTitle(<User size={13} aria-hidden="true" />, "Live portrait — fictional")}
            <div className="mt-4 overflow-hidden rounded-3xl border border-white/10">
              <div className="relative mx-auto aspect-[5/6] max-h-[430px] w-full">
                <CompanionAvatar
                  name={name.trim() || "Your companion"}
                  skin={skinTone}
                  hair={hairColor}
                  hairStyle={hairStyle}
                  hue={hue}
                  rounded={false}
                />
                {aiImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={aiImage}
                    alt={`AI-generated fictional portrait of ${name.trim() || "your companion"}`}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                  <div>
                    <p className="font-display text-2xl leading-none text-cream">{name.trim() || "Your companion"}</p>
                    <p className="mt-1 text-[9px] uppercase tracking-[0.22em] text-cream-dim">{origin.trim() || "Your invention"}</p>
                  </div>
                  <span className="rounded-md bg-black/60 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.2em] text-gold">AI · Fictional</span>
                </div>
              </div>
            </div>

            {/* What will be generated — plain language, before submit */}
            <div className="mt-4 rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-[11px] leading-5 text-cream-dim">
              <p className="flex items-center gap-1.5 font-semibold text-cream"><Info size={12} aria-hidden="true" /> What you&apos;re about to make</p>
              <ul className="mt-1.5 list-disc space-y-0.5 pl-4">
                <li>An illustrated (or AI-generated, if configured) portrait of an <strong>adult fictional character</strong>.</li>
                <li>A persona: <strong>{archetype}</strong>, speaking <strong>{language}</strong>, with your described backstory.</li>
                <li>Nobody real is depicted, imitated or identifiable.</li>
              </ul>
            </div>

            {/* Optional AI portrait */}
            <button
              onClick={generatePortrait}
              disabled={aiBusy}
              className="btn-ghost mt-3 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-xs font-semibold text-cream disabled:opacity-60"
            >
              {aiBusy ? <Loader2 size={14} className="animate-spin" aria-hidden="true" /> : <Wand2 size={14} aria-hidden="true" />}
              {aiBusy ? "Rendering portrait…" : "Generate AI portrait (optional)"}
            </button>
            {aiNotice && (
              <p role="status" className="mt-2 rounded-xl border border-gold/20 bg-gold/5 p-2.5 text-[10px] leading-4 text-gold/90">{aiNotice}</p>
            )}

            {error && <p role="alert" className="mt-3 rounded-xl border border-rose/30 bg-rose/10 p-3 text-[11px] text-rose">{error}</p>}

            {/* Submit */}
            <button
              onClick={createCompanion}
              disabled={!ready || busy}
              className="btn-candle mt-3 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-base font-bold disabled:cursor-not-allowed disabled:opacity-40"
            >
              {busy ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : <Sparkles size={18} aria-hidden="true" />}
              {busy ? "Opening the door…" : `Meet ${name.trim().split(" ")[0] || "them"}`}
              {!busy && <ArrowRight size={16} aria-hidden="true" />}
            </button>
            <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-[9px] uppercase tracking-[0.2em] text-cream-dim/70">
              <ShieldCheck size={10} aria-hidden="true" /> Adult · Fictional · Yours to erase in Settings
            </p>
          </div>
        </div>

        {/* ── Editor ── */}
        <div className="space-y-7 lg:col-span-7">
          {/* Identity */}
          <section>
            {sectionTitle(<ScrollText size={13} aria-hidden="true" />, "Who are they?")}
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="sr-only">Name</span>
                <input value={name} onChange={(e) => setName(e.target.value.slice(0, 60))} placeholder="Her name — e.g. Adaeze “Zaza” Okafor" className="field h-12 w-full rounded-xl px-4 text-base text-cream" aria-label="Companion name" />
              </label>
              <div className="relative">
                <select value={archetype} onChange={(e) => setArchetype(e.target.value)} className="field h-12 w-full appearance-none rounded-xl px-4 pr-10 text-sm text-cream" aria-label="Personality archetype">
                  {ARCHETYPES.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-cream-dim" aria-hidden="true" />
              </div>
              <div className="relative">
                <select value={language} onChange={(e) => setLanguage(e.target.value)} className="field h-12 w-full appearance-none rounded-xl px-4 pr-10 text-sm text-cream" aria-label="Primary language">
                  {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-cream-dim" aria-hidden="true" />
              </div>
              <input value={origin} onChange={(e) => setOrigin(e.target.value.slice(0, 120))} placeholder="Origin — “Banjara Hills, Hyderabad” or “a station town near Lisbon”" className="field h-12 w-full rounded-xl px-4 text-sm text-cream" aria-label="Origin and setting" />
              <input value={interests} onChange={(e) => setInterests(e.target.value.slice(0, 200))} placeholder="Interests — comma separated" className="field h-12 w-full rounded-xl px-4 text-sm text-cream" aria-label="Interests" />
              <input value={style} onChange={(e) => setStyle(e.target.value.slice(0, 140))} placeholder="How they talk — “soft-spoken, devastating one-liners”" className="field h-12 w-full rounded-xl px-4 text-sm text-cream sm:col-span-2" aria-label="Conversation style" />
              <textarea value={backstory} onChange={(e) => setBackstory(e.target.value.slice(0, 900))} rows={3} placeholder="Her story in two or three lines — invented freely. The more specific, the warmer the conversation." className="field w-full resize-none rounded-xl px-4 py-3 text-sm leading-6 text-cream sm:col-span-2" aria-label="Backstory" />
            </div>
          </section>

          {/* Appearance */}
          <section>
            {sectionTitle(<Palette size={13} aria-hidden="true" />, "How they look — your taste, respectfully")}

            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-cream-dim">Skin tone</p>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {SKIN_TONES.map((t) => swatch(t.label, skinTone === t.value, () => setSkinTone(t.value),
                <span className="h-8 w-8 rounded-full border border-black/40" style={{ background: t.value }} />))}
            </div>

            <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-cream-dim">Hair colour</p>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {HAIR_COLORS.map((t) => swatch(t.label, hairColor === t.value, () => setHairColor(t.value),
                <span className="h-8 w-8 rounded-full border border-black/40" style={{ background: t.value }} />))}
            </div>

            <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-cream-dim">Hair style</p>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {HAIR_STYLES.map((t) => swatch(t.label, hairStyle === t.value, () => setHairStyle(t.value),
                <span className="grid h-8 w-8 place-items-center rounded-full bg-white/5 text-xs font-bold text-cream-dim">{t.value + 1}</span>))}
            </div>

            <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-cream-dim">Eye colour</p>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {EYE_COLORS.map((t) => swatch(t, eyeColor === t, () => setEyeColor(t),
                <span className="h-8 w-8 rounded-full border border-white/10 bg-gradient-to-br from-[#3a2a1e] to-black" />))}
            </div>

            <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-cream-dim">Silhouette <span className="normal-case text-cream-dim/60">(for generated artwork — no ranking, no judgement)</span></p>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {BODY_TYPES.map((t) => swatch(t.label, bodyType === t.value, () => setBodyType(t.value),
                <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-rose/25 to-wine/40 text-[10px] font-bold text-rose">{t.label[0]}</span>))}
            </div>

            <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-cream-dim">Portrait ambience</p>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {HUES.map((t) => swatch(t.label, hue === t.value, () => setHue(t.value),
                <span className="h-8 w-8 rounded-full border border-black/40" style={{ background: `hsl(${t.value} 45% 40%)` }} />))}
            </div>
          </section>

          <p className="flex items-start gap-2 rounded-2xl border border-white/8 bg-white/[0.02] p-4 text-[10px] leading-5 text-cream-dim/80">
            <Check size={12} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
            Respect in the details: bodies are described, never graded. Features never reference ethnicity,
            disability, or any real individual. Custom companions are adults (the system doesn&apos;t make minors),
            fictional, and erased with you from Settings → Privacy.
          </p>
        </div>
      </div>
    </div>
  );
}
