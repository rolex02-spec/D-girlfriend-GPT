export interface Appearance {
  // Face
  faceShape: 'oval' | 'round' | 'heart' | 'square' | 'long' | 'diamond';
  skinTone: string;
  skinColor: string;

  // Eyes
  eyeShape: 'almond' | 'round' | 'hooded' | 'monolid' | 'upturned' | 'downturned' | 'wide';
  eyeSize: 'small' | 'medium' | 'large' | 'very_large';
  eyeColor: string;
  eyeLashes: 'short' | 'medium' | 'long' | 'very_long';
  eyebrows: 'thin' | 'medium' | 'thick' | 'arched' | 'straight' | 'rounded';

  // Hair
  hairColor: string;
  hairStyle: 'straight' | 'wavy' | 'curly' | 'coily' | 'bob' | 'ponytail' | 'bun' | 'pigtails' | 'twin_tails' | 'long_loose' | 'short_pixie' | 'braids' | 'locs' | 'weave' | 'hijab';
  hairLength: 'short' | 'medium' | 'long' | 'very_long';
  hairHighlights?: string;

  // Body
  height: 'petite' | 'short' | 'average' | 'tall' | 'very_tall';
  bodyType: 'slim' | 'athletic' | 'average' | 'curvy' | 'voluptuous' | 'muscular' | 'soft';
  bustSize: 'flat' | 'small' | 'medium' | 'large' | 'very_large';
  bustShape: 'rounded' | 'teardrop' | 'wide' | 'narrow' | 'asymmetric';
  waistSize: 'slim' | 'average' | 'wide';
  hipSize: 'narrow' | 'average' | 'wide' | 'very_wide';
  assSize: 'flat' | 'small' | 'medium' | 'large' | 'very_large';
  assShape: 'round' | 'heart' | 'square' | 'wide';
  legLength: 'short' | 'average' | 'long' | 'very_long';

  // Additional
  bodyHair: 'none' | 'light' | 'moderate';
  beautyMarks?: string[];
  tattoos?: string[];
  piercings?: string[];
}

export interface PersonalityTraits {
  // Core
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;

  // Emotional
  romanticLevel: number;
  possessiveness: number;
  jealousy: number;
  clinginess: number;
  playfulness: number;
  dominance: number;
  submissiveness: number;

  // Communication
  dirtyTalk: number;
  teaseLevel: number;
  directness: number;
  formality: number;
  verbosity: number;

  // Interests
  interests: string[];
  kinks?: string[];
}

export interface NSFWConfig {
  enabled: boolean;
  level: 'soft' | 'medium' | 'hard' | 'extreme';
  favoritePositions: string[];
  favoriteActs: string[];
  limits?: string[];
  turnOns: string[];
  turnOffs?: string[];
  bondageInterest: number;    // 0-10
  roughness: number;          // 0-10
  exhibitionism: number;      // 0-10
  submissive: number;         // 0-10
  dominant: number;           // 0-10
}

export interface VoiceConfig {
  provider: 'edge-tts' | 'browser';
  voiceId: string;
  rate: number;
  pitch: number;
  volume: number;
  style?: string;
  language: string;
}

export interface CharacterConfig {
  id: string;
  name: string;
  age: number;
  country: string;
  region: string;
  language: string;
  nationality: string;
  greeting: string;
  appearance: Appearance;
  personality: PersonalityTraits;
  voice: VoiceConfig;
  backstory: string;
  nsfwAllowed: boolean;
  imageUrl?: string;
  nsfwConfig?: NSFWConfig;
  relationships?: {
    boyfriend?: string;
    petNames?: string[];
    insults?: string[];
    insultNames?: string[];
  };
}

// NSFW Conversation Types
export interface NSFWMessage {
  role: 'user' | 'assistant';
  content: string;
  mood?: 'horny' | 'loving' | 'dominant' | 'submissive' | 'playful' | 'teasing';
  act?: string;
  position?: string;
}

export interface SexualScenario {
  id: string;
  name: string;
  description: string;
  dialogue: string[];
  position?: string;
  acts: string[];
  mood: string;
}
