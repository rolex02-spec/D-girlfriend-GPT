export interface EmotionState {
  current: string;
  intensity: number;
  history: { emotion: string; timestamp: Date }[];
  affection: number;
  trust: number;
  arousal: number;
  mood: string;
}

const EMOTION_RESPONSES: Record<string, string[]> = {
  happy: ['😊', '😄', '💕', '🥰', '✨'],
  sad: ['😢', '😔', '💔', '🥺', '💙'],
  angry: ['😤', '💢', '😡', '🔥', '😠'],
  shy: ['😊', '🫣', '🙈', '💕', '💗'],
  flirty: ['😏', '💋', '🔥', '💕', '😈'],
  loving: ['❤️', '🥰', '💕', '💗', '😍'],
  excited: ['🎉', '✨', '💫', '⭐', '🌟'],
  jealous: ['😒', '💢', '👀', '🤨', '😤'],
  confused: ['🤔', '❓', '😶', '🫠', '💭'],
  neutral: ['🙂', '😊', '💭', '✨', '🌸'],
  // NSFW Emotions
  horny: ['🔥', '😈', '💦', '😫', '🤤'],
  aroused: ['💋', '🔥', '💦', '😈', '😫'],
  lustful: ['😏', '💋', '🔥', '😈', '🤤'],
  pleasured: ['😫', '💕', '💦', '😍', '✨'],
  orgasmic: ['💫', '✨', '🔥', '😍', '💦'],
  submissive: ['🥺', '💧', '💋', '🙈', '💗'],
  eager: ['😈', '🔥', '💋', '😫', '🤤'],
  dominant: ['😈', '💋', '🔥', '😏', '👑'],
  teasing: ['😏', '💋', '😈', '💕', '✨'],
};

export function getEmotionEmoji(emotion: string): string {
  const emojis = EMOTION_RESPONSES[emotion] || EMOTION_RESPONSES.neutral;
  return emojis[Math.floor(Math.random() * emojis.length)];
}

export function detectUserEmotion(message: string): string {
  const lower = message.toLowerCase();

  // NSFW emotions
  if (lower.includes('fuck') || lower.includes('sex') || lower.includes('cock') || lower.includes('pussy')) return 'horny';
  if (lower.includes('suck') || lower.includes('blowjob') || lower.includes('dick')) return 'horny';
  if (lower.includes('cum') || lower.includes('orgasm') || lower.includes('cumming')) return 'aroused';
  if (lower.includes('ride') || lower.includes('on top') || lower.includes('cowgirl')) return 'eager';
  if (lower.includes('spank') || lower.includes('choke') || lower.includes('rough')) return 'dominant';
  if (lower.includes('please') || lower.includes('yes master') || lower.includes('harder')) return 'submissive';
  if (lower.includes('touch yourself') || lower.includes('masturbate') || lower.includes('jerk off')) return 'teasing';
  if (lower.includes('strip') || lower.includes('undress') || lower.includes('take off')) return 'teasing';

  // Regular emotions
  if (lower.includes('love you') || lower.includes('miss you') || lower.includes('💕')) return 'loving';
  if (lower.includes('hate') || lower.includes('stupid') || lower.includes('damn')) return 'angry';
  if (lower.includes('sad') || lower.includes('depressed') || lower.includes('lonely')) return 'sad';
  if (lower.includes('happy') || lower.includes('great') || lower.includes('awesome')) return 'happy';
  if (lower.includes('hot') || lower.includes('sexy') || lower.includes('want you')) return 'flirty';
  if (lower.includes('bored') || lower.includes('whatever')) return 'neutral';

  return 'neutral';
}

export function updateEmotionState(
  currentState: EmotionState,
  userMessage: string,
  aiResponse: string,
  responseEmotion: string
): EmotionState {
  const userEmotion = detectUserEmotion(userMessage);

  let newAffection = currentState.affection;
  let newTrust = currentState.trust;
  let newArousal = currentState.arousal;

  // NSFW emotion updates
  if (userEmotion === 'horny') newArousal = Math.min(100, newArousal + 15);
  if (userEmotion === 'aroused') newArousal = Math.min(100, newArousal + 20);
  if (userEmotion === 'eager') newArousal = Math.min(100, newArousal + 10);
  if (userEmotion === 'dominant') newArousal = Math.min(100, newArousal + 12);
  if (userEmotion === 'submissive') {
    newArousal = Math.min(100, newArousal + 8);
    newTrust = Math.min(100, newTrust + 5);
  }
  if (userEmotion === 'teasing') newArousal = Math.min(100, newArousal + 10);

  // Regular emotion updates
  if (userEmotion === 'loving') newAffection = Math.min(100, newAffection + 5);
  if (userEmotion === 'angry') newAffection = Math.max(0, newAffection - 3);
  if (userEmotion === 'flirty') newArousal = Math.min(100, newArousal + 10);

  // NSFW response emotion updates
  if (responseEmotion === 'horny') newArousal = Math.min(100, newArousal + 10);
  if (responseEmotion === 'aroused') newArousal = Math.min(100, newArousal + 15);
  if (responseEmotion === 'lustful') newArousal = Math.min(100, newArousal + 12);
  if (responseEmotion === 'pleasured') newArousal = Math.min(100, newArousal + 20);
  if (responseEmotion === 'orgasmic') {
    newArousal = Math.min(100, newArousal + 25);
    newAffection = Math.min(100, newAffection + 5);
  }
  if (responseEmotion === 'submissive') {
    newTrust = Math.min(100, newTrust + 5);
    newArousal = Math.min(100, newArousal + 8);
  }

  // Regular response emotion updates
  if (responseEmotion === 'loving') newAffection = Math.min(100, newAffection + 3);
  if (responseEmotion === 'flirty') newArousal = Math.min(100, newArousal + 5);

  // Decay arousal over time if no sexual activity
  if (!['horny', 'aroused', 'lustful', 'pleasured', 'orgasmic'].includes(userEmotion) &&
      !['horny', 'aroused', 'lustful', 'pleasured', 'orgasmic'].includes(responseEmotion)) {
    newArousal = Math.max(0, newArousal - 2);
  }

  // Determine overall mood
  let mood = 'neutral';
  if (newAffection > 70 && newArousal > 70) mood = 'passionate';
  else if (newArousal > 80) mood = 'very aroused';
  else if (newArousal > 50) mood = 'aroused';
  else if (newAffection > 70) mood = 'loving';
  else if (newAffection > 50) mood = 'affectionate';
  if (newAffection < 30) mood = 'distant';
  if (newTrust < 30) mood = 'guarded';

  return {
    current: responseEmotion,
    intensity: responseEmotion === 'neutral' ? 3 : 7,
    history: [
      ...currentState.history.slice(-10),
      { emotion: responseEmotion, timestamp: new Date() },
    ],
    affection: newAffection,
    trust: newTrust,
    arousal: newArousal,
    mood,
  };
}
