import { CharacterConfig, NSFWConfig } from '../types';

// NSFW profiles based on personality
const nsfwProfiles: Record<string, NSFWConfig> = {
  // Submissive types
  submissive: {
    enabled: true,
    level: 'medium',
    favoritePositions: ['missionary', 'spooning', 'cowgirl'],
    favoriteActs: ['blowjob', 'handjob', 'cunnilingus', 'missionary'],
    turnOns: ['being dominated', 'hair pulling', 'spanking', 'dirty talk'],
    bondageInterest: 4,
    roughness: 3,
    exhibitionism: 2,
    submissive: 9,
    dominant: 1,
  },
  // Dominant types
  dominant: {
    enabled: true,
    level: 'extreme',
    favoritePositions: ['cowgirl', 'reverse_cowgirl', 'face_sitting'],
    favoriteActs: ['facefuck', 'riding', 'domination', 'riding_reverse'],
    turnOns: ['being in control', 'riding', 'face sitting', 'making him cum'],
    bondageInterest: 7,
    roughness: 7,
    exhibitionism: 5,
    submissive: 2,
    dominant: 9,
  },
  // Wild types
  wild: {
    enabled: true,
    level: 'extreme',
    favoritePositions: ['doggy', 'standing', 'legs_up', 'wheelbarrow'],
    favoriteActs: ['deepthroat', 'anal', 'gangbang', 'squirting', 'double_penetration'],
    turnOns: ['rough sex', 'multiple positions', 'being filled', 'group play'],
    bondageInterest: 6,
    roughness: 8,
    exhibitionism: 8,
    submissive: 5,
    dominant: 5,
  },
  // Romantic types
  romantic: {
    enabled: true,
    level: 'medium',
    favoritePositions: ['missionary', 'lotus', 'spooning'],
    favoriteActs: ['cunnilingus', 'sex', 'handjob', 'mutual_masturbation'],
    turnOns: ['eye contact', 'slow sex', 'kissing during sex', 'cumming together'],
    bondageInterest: 2,
    roughness: 2,
    exhibitionism: 1,
    submissive: 5,
    dominant: 5,
  },
  // Tease types
  tease: {
    enabled: true,
    level: 'extreme',
    favoritePositions: ['cowgirl', 'reverse_cowgirl', 'edge_of_bed'],
    favoriteActs: ['strip_tease', 'edging', 'blowjob', 'titjob'],
    turnOns: ['teasing', 'edging', 'making him beg', 'slow buildup'],
    bondageInterest: 5,
    roughness: 4,
    exhibitionism: 7,
    submissive: 4,
    dominant: 6,
  },
  // Innocent types
  innocent: {
    enabled: true,
    level: 'soft',
    favoritePositions: ['missionary', 'spooning', 'cowgirl'],
    favoriteActs: ['handjob', 'blowjob', 'sex'],
    turnOns: ['gentle sex', 'being kissed', 'cuddling after', 'romance'],
    bondageInterest: 1,
    roughness: 1,
    exhibitionism: 1,
    submissive: 7,
    dominant: 2,
  },
  // Party types
  party: {
    enabled: true,
    level: 'extreme',
    favoritePositions: ['doggy', 'standing', 'cowgirl', 'wheelbarrow'],
    favoriteActs: ['deepthroat', 'sex', 'squirting', 'cum_on_body'],
    turnOns: ['fun sex', 'wild positions', 'loud sex', 'multiple orgasms'],
    bondageInterest: 4,
    roughness: 6,
    exhibitionism: 7,
    submissive: 4,
    dominant: 6,
  },
};

// Get NSFW profile based on character personality
export function getNsfwProfile(character: CharacterConfig): NSFWConfig {
  const trait = character.personality;

  // Determine profile based on personality traits
  if (trait.submissiveness >= 7) return nsfwProfiles.submissive;
  if (trait.dominance >= 7) return nsfwProfiles.dominant;
  if (trait.playfulness >= 8 && trait.teaseLevel >= 7) return nsfwProfiles.tease;
  if (trait.romanticLevel >= 8 && trait.dirtyTalk <= 4) return nsfwProfiles.romantic;
  if (trait.playfulness >= 7 && trait.extraversion >= 8) return nsfwProfiles.party;

  // Default based on dirty talk level
  if (trait.dirtyTalk >= 7) return nsfwProfiles.wild;
  if (trait.dirtyTalk >= 5) return nsfwProfiles.tease;
  return nsfwProfiles.innocent;
}

// Add NSFW config to all characters
export function addNsfwConfigs(characters: CharacterConfig[]): CharacterConfig[] {
  return characters.map((char) => ({
    ...char,
    nsfwConfig: char.nsfwAllowed ? getNsfwProfile(char) : undefined,
  }));
}
