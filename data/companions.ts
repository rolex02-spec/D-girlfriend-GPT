/**
 * data/companions.ts — catalog adapter.
 *
 * Maps girlfriend-gpt's character database (lib/characters/database.ts,
 * 82 fictional adults aged 21–25 across 34 countries) onto the Companion
 * shape the catalog UI expects. The database module imports only types,
 * so this file renders safely on the server and in the browser alike.
 *
 * Custom companions designed in the Customise Studio live in localStorage
 * (client only) and are merged in by the catalog and chat at usage time.
 */
import { characters } from "@/lib/characters/database";
import type { CharacterConfig } from "@/lib/types";

export const ARCHETYPES = [
  "Warm & Nurturing",
  "Playful & Witty",
  "Calm & Grounded",
  "Adventurous & Bold",
  "Artistic & Dreamy",
  "Intellectual & Curious",
  "Confident & Ambitious",
  "Gentle & Reserved",
  "Spirited & Passionate",
  "Grounded & Loyal",
] as const;

export type Archetype = (typeof ARCHETYPES)[number];

export interface Companion {
  id: string;
  name: string;
  age: number;
  country: string;
  city: string;
  languages: string[];
  archetype: Archetype;
  interests: string[];
  style: string;
  backstory: string;
  greeting: string;
  /** Illustration palette — used by the procedural portrait renderer. */
  skin: string;
  hair: string;
  /** 0 bun · 1 long waves · 2 bob · 3 ponytail · 4 curls · 5 braid */
  hairStyle: number;
  /** Background hue (0–360) for the card artwork. */
  hue: number;
  featured?: boolean;
  /** Portrait image (local path, or a data: URL for AI-generated customs). */
  portrait?: string;
}

/* ── Language codes → display names ─────────────────────────────────── */

const LANGUAGE_NAMES: Record<string, string> = {
  ar: "Arabic", de: "German", el: "Greek", en: "English", es: "Spanish",
  fil: "Filipino", fr: "French", id: "Indonesian", it: "Italian",
  ja: "Japanese", kn: "Kannada", ko: "Korean", ml: "Malayalam",
  pt: "Portuguese", ru: "Russian", si: "Sinhala", ta: "Tamil",
  tanglish: "Tanglish", te: "Telugu", th: "Thai", tl: "Tagalog",
  ur: "Urdu", vi: "Vietnamese", zh: "Chinese",
};

function languageName(code: string): string {
  const base = code.split("-")[0].toLowerCase();
  return (
    LANGUAGE_NAMES[base] ??
    LANGUAGE_NAMES[code.toLowerCase()] ??
    code.charAt(0).toUpperCase() + code.slice(1)
  );
}

/* ── Personality → archetype (deterministic scoring) ────────────────── */

function archetypeFor(c: CharacterConfig): Archetype {
  const p = c.personality;
  const scores: Array<[Archetype, number]> = [
    ["Warm & Nurturing", p.agreeableness * 2 + p.extraversion + (10 - p.neuroticism)],
    ["Playful & Witty", p.playfulness * 2 + p.extraversion + p.directness],
    ["Calm & Grounded", (10 - p.neuroticism) * 2 + p.conscientiousness + (10 - p.extraversion)],
    ["Adventurous & Bold", p.extraversion + p.openness + (10 - p.conscientiousness) + p.directness],
    ["Artistic & Dreamy", p.openness * 2 + p.verbosity + (10 - p.directness)],
    ["Intellectual & Curious", p.conscientiousness * 2 + p.openness + p.verbosity],
    ["Confident & Ambitious", p.dominance * 2 + p.extraversion + p.conscientiousness],
    ["Gentle & Reserved", (10 - p.extraversion) * 2 + p.agreeableness + (10 - p.directness)],
    ["Spirited & Passionate", p.romanticLevel * 2 + p.playfulness + p.dominance],
    ["Grounded & Loyal", p.agreeableness * 2 + p.conscientiousness + p.possessiveness],
  ];
  return scores.reduce((best, cur) => (cur[1] > best[1] ? cur : best))[0];
}

function styleFor(c: CharacterConfig): string {
  const p = c.personality;
  const vibe =
    p.formality <= 3 ? "Easygoing and casual" : p.formality >= 7 ? "Poised and thoughtful" : "Warm and natural";
  const talk =
    p.playfulness >= 6 ? "loves to tease" : p.directness >= 6 ? "says it straight" : "keeps it sincere";
  const flow = p.verbosity >= 6 ? "talks freely" : "chooses words carefully";
  return `${vibe}, ${talk}, ${flow}`;
}

const HAIR_STYLE_INDEX: Record<string, number> = {
  bun: 0, long_loose: 1, long: 1, straight: 1, wavy: 1, weave: 1,
  bob: 2, short_pixie: 2,
  ponytail: 3,
  curly: 4, coily: 4, pigtails: 4, twin_tails: 4,
  braids: 5, locs: 5,
  hijab: 0,
};

function hairStyleIndex(style: string): number {
  return HAIR_STYLE_INDEX[style] ?? 1;
}

/** FNV-1a hash → stable 0–359 background hue per character. */
function hashHue(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h) % 360;
}

/* ── The catalog ────────────────────────────────────────────────────── */

export function toCompanion(c: CharacterConfig, index: number): Companion {
  return {
    id: c.id,
    name: c.name,
    age: c.age,
    country: c.country,
    city: c.region,
    languages: Array.from(new Set([languageName(c.language), "English"])),
    archetype: archetypeFor(c),
    interests: c.personality.interests,
    style: styleFor(c),
    backstory: c.backstory,
    greeting: c.greeting,
    skin: c.appearance.skinColor,
    hair: c.appearance.hairColor,
    hairStyle: hairStyleIndex(c.appearance.hairStyle),
    hue: hashHue(c.id),
    featured: index % 10 === 3,
    portrait: c.imageUrl,
  };
}

export const COMPANIONS: Companion[] = characters.map(toCompanion);

export const TOTAL_COMPANIONS = COMPANIONS.length;

export const COUNTRIES = Array.from(new Set(COMPANIONS.map((c) => c.country))).sort();

export const LANGUAGES = Array.from(new Set(COMPANIONS.flatMap((c) => c.languages))).sort();

export function getCompanion(id: string): Companion | undefined {
  return COMPANIONS.find((c) => c.id === id) ?? getCustomCompanion(id);
}

/** Full config for built-in characters (voice, NSFW gating). */
export function getCharacter(id: string): CharacterConfig | undefined {
  return characters.find((c) => c.id === id);
}

/* ── Custom companions (localStorage, client only) ──────────────────── */

export const CUSTOM_STORAGE_KEY = "ggpt_customs";

export function loadCustomCompanions(): Companion[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CUSTOM_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Companion[]) : [];
  } catch {
    return [];
  }
}

export function getCustomCompanion(id: string): Companion | undefined {
  return loadCustomCompanions().find((c) => c.id === id);
}

export function saveCustomCompanion(c: Companion): void {
  if (typeof window === "undefined") return;
  try {
    const existing = loadCustomCompanions();
    window.localStorage.setItem(
      CUSTOM_STORAGE_KEY,
      JSON.stringify([...existing.filter((x) => x.id !== c.id), c])
    );
  } catch {
    /* storage unavailable — the studio still works for this session */
  }
}

export function removeCustomCompanions(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CUSTOM_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export interface CustomCompanionInput {
  name: string;
  archetype: Archetype;
  language: string;
  origin: string;
  interests: string;
  style: string;
  backstory: string;
  skinTone: string;
  hairColor: string;
  hairStyle: number;
  hue: number;
  portrait?: string;
}

/** Build a Companion from the Customise Studio form (adult by construction). */
export function buildCustomCompanion(input: CustomCompanionInput): Companion {
  const name = input.name.trim();
  const first = name.split(" ")[0] || "You";
  const interests = (input.interests || "late-night walks, honest questions, playlists at midnight")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 6);

  return {
    id: `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    name,
    age: 22, // adult by construction — the studio never makes minors
    country: "",
    city: input.origin.trim() || "Your invention",
    languages: [input.language && input.language !== "auto" ? input.language : "English"],
    archetype: input.archetype,
    interests,
    style: input.style.trim() || "warm, curious, attentive — listens twice before speaking once",
    backstory:
      input.backstory.trim() ||
      `${first} is a fictional adult you composed in the Customise Studio — origin, temperament and humour all yours to define.`,
    greeting: `Hi — I'm ${first}. You wrote me, so you already know how this starts: say something.`,
    skin: input.skinTone,
    hair: input.hairColor,
    hairStyle: input.hairStyle,
    hue: input.hue,
    portrait: input.portrait,
  };
}
