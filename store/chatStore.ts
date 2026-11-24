import { create } from 'zustand';
import { CharacterConfig, Appearance } from '../lib/types';
import { EmotionState } from '../lib/emotions';
import { getDefaultProvider, getDefaultModel } from '../lib/llm/provider';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  emotion?: string;
  timestamp: Date;
}

interface BodySettings {
  bust?: string;
  waist?: string;
  hips?: string;
  height?: string;
  bodyType?: string;
  ass?: string;
  legLength?: string;
  hairLength?: string;
  hairColor?: string;
  eyeColor?: string;
  eyeSize?: string;
  skinTone?: string;
  ethnicity?: string;
}

interface ChatStore {
  // Character
  selectedCharacter: CharacterConfig | null;
  setSelectedCharacter: (character: CharacterConfig) => void;

  // Body Customization
  bodySettings: BodySettings;
  setBodySettings: (settings: Partial<BodySettings>) => void;
  updateAppearance: (updates: Partial<Appearance> | BodySettings) => void;

  // Image Generation
  characterImageUrl: string | null;
  isGeneratingImage: boolean;
  generateCharacterImage: (prompt?: string) => Promise<void>;
  setCharacterImageUrl: (url: string | null) => void;

  // Messages
  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;

  // Emotion
  emotionState: EmotionState;
  setEmotionState: (state: EmotionState) => void;

  // Settings
  nsfwMode: boolean;
  toggleNsfwMode: () => void;
  voiceEnabled: boolean;
  toggleVoice: () => void;
  selectedProvider: string;
  setSelectedProvider: (provider: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;

  // UI
  isTyping: boolean;
  setIsTyping: (typing: boolean) => void;
  showCharacterSelect: boolean;
  setShowCharacterSelect: (show: boolean) => void;
  showCustomize: boolean;
  setShowCustomize: (show: boolean) => void;
}

const defaultBodySettings: BodySettings = {
  bust: '80',
  waist: '62',
  hips: '88',
  height: '165',
  bodyType: 'curvy',
  ass: 'round',
  legLength: 'long',
  hairLength: 'long',
  hairColor: 'black',
  eyeColor: 'brown',
  eyeSize: 'large',
  skinTone: 'light',
  ethnicity: 'asian',
};

export const useChatStore = create<ChatStore>((set, get) => ({
  // Character
  selectedCharacter: null,
  setSelectedCharacter: (character) => set({ selectedCharacter: character, characterImageUrl: character.imageUrl || null, showCharacterSelect: false }),

  // Body Customization
  bodySettings: defaultBodySettings,
  setBodySettings: (settings) => set((state) => ({ bodySettings: { ...state.bodySettings, ...settings } })),

  updateAppearance: (updates: Partial<Appearance> | BodySettings) => {
    const { selectedCharacter } = get();
    if (!selectedCharacter) return;

    if ('bodyType' in updates || 'hairColor' in updates || 'skinTone' in updates) {
      const bodyUpdates = updates as BodySettings;
      const appearanceUpdates: Partial<Appearance> = {};

      if (bodyUpdates.height) {
        const h = parseInt(bodyUpdates.height);
        if (h <= 155) appearanceUpdates.height = 'petite';
        else if (h <= 165) appearanceUpdates.height = 'average';
        else if (h <= 175) appearanceUpdates.height = 'tall';
        else appearanceUpdates.height = 'very_tall';
      }

      if (bodyUpdates.bodyType) appearanceUpdates.bodyType = bodyUpdates.bodyType as Appearance['bodyType'];
      if (bodyUpdates.hairLength) appearanceUpdates.hairLength = bodyUpdates.hairLength as Appearance['hairLength'];
      if (bodyUpdates.hairColor) appearanceUpdates.hairColor = bodyUpdates.hairColor;
      if (bodyUpdates.eyeColor) appearanceUpdates.eyeColor = bodyUpdates.eyeColor;
      if (bodyUpdates.eyeSize) appearanceUpdates.eyeSize = bodyUpdates.eyeSize as Appearance['eyeSize'];
      if (bodyUpdates.skinTone) appearanceUpdates.skinTone = bodyUpdates.skinTone;

      if (bodyUpdates.bust) {
        const b = parseInt(bodyUpdates.bust);
        if (b >= 95) appearanceUpdates.bustSize = 'very_large';
        else if (b >= 85) appearanceUpdates.bustSize = 'large';
        else if (b >= 75) appearanceUpdates.bustSize = 'medium';
        else if (b >= 65) appearanceUpdates.bustSize = 'small';
        else appearanceUpdates.bustSize = 'flat';
      }

      if (bodyUpdates.waist) {
        const w = parseInt(bodyUpdates.waist);
        if (w <= 60) appearanceUpdates.waistSize = 'slim';
        else if (w <= 70) appearanceUpdates.waistSize = 'average';
        else appearanceUpdates.waistSize = 'wide';
      }

      if (bodyUpdates.hips) {
        const hp = parseInt(bodyUpdates.hips);
        if (hp >= 105) appearanceUpdates.hipSize = 'very_wide';
        else if (hp >= 95) appearanceUpdates.hipSize = 'wide';
        else if (hp >= 80) appearanceUpdates.hipSize = 'average';
        else appearanceUpdates.hipSize = 'narrow';
      }

      if (bodyUpdates.ass) {
        const assMap: Record<string, Appearance['assSize']> = { small: 'small', round: 'medium', big: 'large', huge: 'very_large' };
        appearanceUpdates.assSize = assMap[bodyUpdates.ass] || 'medium';
      }

      if (bodyUpdates.legLength) appearanceUpdates.legLength = bodyUpdates.legLength as Appearance['legLength'];

      set({
        selectedCharacter: { ...selectedCharacter, appearance: { ...selectedCharacter.appearance, ...appearanceUpdates } },
        bodySettings: { ...get().bodySettings, ...bodyUpdates },
      });
    } else {
      const appearanceUpdates = updates as Partial<Appearance>;
      set({ selectedCharacter: { ...selectedCharacter, appearance: { ...selectedCharacter.appearance, ...appearanceUpdates } } });
    }
  },

  // Image Generation
  characterImageUrl: null,
  isGeneratingImage: false,
  generateCharacterImage: async (prompt?: string) => {
    const { bodySettings, nsfwMode } = get();
    set({ isGeneratingImage: true });
    try {
      console.log('Generating image with settings:', bodySettings);
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt || 'beautiful woman, portrait photo', bodySettings, style: 'realistic', isNsfw: nsfwMode }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Image generation failed');
      }
      const data = await response.json();
      console.log('Image generated successfully, URL length:', data.imageUrl?.length);
      set({ characterImageUrl: data.imageUrl, isGeneratingImage: false });
    } catch (error) {
      console.error('Image generation error:', error);
      set({ isGeneratingImage: false });
    }
  },
  setCharacterImageUrl: (url: string | null) => set({ characterImageUrl: url }),

  // Messages
  messages: [],
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),

  // Emotion
  emotionState: {
    current: 'neutral',
    intensity: 5,
    history: [],
    affection: 50,
    trust: 50,
    arousal: 0,
    mood: 'neutral',
  },
  setEmotionState: (state) => set({ emotionState: state }),

  // Settings
  nsfwMode: false,
  toggleNsfwMode: () => set((state) => ({ nsfwMode: !state.nsfwMode })),
  voiceEnabled: false,
  toggleVoice: () => set((state) => ({ voiceEnabled: !state.voiceEnabled })),
  selectedProvider: getDefaultProvider(),
  setSelectedProvider: (provider) => set({ selectedProvider: provider }),
  selectedModel: getDefaultModel(),
  setSelectedModel: (model) => set({ selectedModel: model }),

  // UI
  isTyping: false,
  setIsTyping: (typing) => set({ isTyping: typing }),
  showCharacterSelect: false, // Default false for unified room
  setShowCharacterSelect: (show) => set({ showCharacterSelect: show }),
  showCustomize: false,
  setShowCustomize: (show) => set({ showCustomize: show }),
}));