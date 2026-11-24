import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ThemeConfig {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textDim: string;
  border: string;
}

export const THEMES: ThemeConfig[] = [
  { name: 'Midnight Rose (Default)', primary: '#0e0810', secondary: '#150c17', accent: '#e9a2b8', background: '#0e0810', surface: '#1e1220', text: '#f6ece1', textDim: '#cbbcb0', border: '#e9a2b8' },
  { name: 'Deep Ocean', primary: '#0a1628', secondary: '#0f2a4a', accent: '#00d4ff', background: '#0a1628', surface: '#112d4a', text: '#e8f4fd', textDim: '#8ab4d6', border: '#00d4ff' },
  { name: 'Forest Shadow', primary: '#0d1b0d', secondary: '#1a3d1a', accent: '#4ade80', background: '#0d1b0d', surface: '#1a3d1a', text: '#dcfce7', textDim: '#86efac', border: '#4ade80' },
  { name: 'Royal Purple', primary: '#1a0a2e', secondary: '#2d1a4a', accent: '#c084fc', background: '#1a0a2e', surface: '#2d1a4a', text: '#f5e6ff', textDim: '#d8b4fe', border: '#c084fc' },
  { name: 'Crimson Velvet', primary: '#2d0a0a', secondary: '#4a1a1a', accent: '#f87171', background: '#2d0a0a', surface: '#4a1a1a', text: '#fee2e2', textDim: '#fca5a5', border: '#f87171' },
  { name: 'Golden Amber', primary: '#2e1d0a', secondary: '#4a3d1a', accent: '#fbbf24', background: '#2e1d0a', surface: '#4a3d1a', text: '#fef3c7', textDim: '#fcd34d', border: '#fbbf24' },
  { name: 'Cyberpunk Neon', primary: '#0f0f1a', secondary: '#1a1a2e', accent: '#ff00ff', background: '#0f0f1a', surface: '#1a1a2e', text: '#ffffff', textDim: '#cccccc', border: '#ff00ff' },
  { name: 'Sunset Coral', primary: '#2d1510', secondary: '#4a2a20', accent: '#fb923c', background: '#2d1510', surface: '#4a2a20', text: '#fff7ed', textDim: '#fed7aa', border: '#fb923c' },
  { name: 'Arctic Ice', primary: '#f0f9ff', secondary: '#e0f2fe', accent: '#0ea5e9', background: '#f0f9ff', surface: '#ffffff', text: '#0c4a6e', textDim: '#0369a1', border: '#0ea5e9' },
  { name: 'Monochrome Dark', primary: '#0a0a0a', secondary: '#1a1a1a', accent: '#ffffff', background: '#0a0a0a', surface: '#1a1a1a', text: '#ffffff', textDim: '#a3a3a3', border: '#ffffff' },
  { name: 'Monochrome Light', primary: '#fafafa', secondary: '#f5f5f5', accent: '#000000', background: '#fafafa', surface: '#ffffff', text: '#000000', textDim: '#525252', border: '#000000' },
  { name: 'Blood Moon', primary: '#1a0505', secondary: '#2d0a0a', accent: '#dc2626', background: '#1a0505', surface: '#2d0a0a', text: '#fecaca', textDim: '#ef4444', border: '#dc2626' },
  { name: 'Emerald Dream', primary: '#051a0a', secondary: '#0a2d15', accent: '#10b981', background: '#051a0a', surface: '#0a2d15', text: '#d1fae5', textDim: '#6ee7b7', border: '#10b981' },
  { name: 'Violet Dusk', primary: '#160a24', secondary: '#2a1a4a', accent: '#a855f7', background: '#160a24', surface: '#2a1a4a', text: '#f3e8ff', textDim: '#c084fc', border: '#a855f7' },
  { name: 'Sandy Beige', primary: '#1f1a15', secondary: '#2d261f', accent: '#d4a574', background: '#1f1a15', surface: '#2d261f', text: '#fdf8f3', textDim: '#e8d5c4', border: '#d4a574' },
  { name: 'Rose Gold', primary: '#1a0d10', secondary: '#2d1a20', accent: '#e8b4b8', background: '#1a0d10', surface: '#2d1a20', text: '#fff0f3', textDim: '#f8c8d8', border: '#e8b4b8' },
  { name: 'Slate Professional', primary: '#0f172a', secondary: '#1e293b', accent: '#64748b', background: '#0f172a', surface: '#1e293b', text: '#f1f5f9', textDim: '#94a3b8', border: '#64748b' },
  { name: 'Berry Wine', primary: '#1a0510', secondary: '#2d0a20', accent: '#ec4899', background: '#1a0510', surface: '#2d0a20', text: '#fce7f3', textDim: '#f472b6', border: '#ec4899' },
  { name: 'Terracotta', primary: '#1f0d08', secondary: '#3d1a10', accent: '#ea580c', background: '#1f0d08', surface: '#3d1a10', text: '#fff7ed', textDim: '#fb923c', border: '#ea580c' },
  { name: 'Obsidian', primary: '#050505', secondary: '#0d0d0d', accent: '#3f3f46', background: '#050505', surface: '#0d0d0d', text: '#e4e4e7', textDim: '#a1a1aa', border: '#3f3f46' },
  { name: 'Pearl White', primary: '#fafafa', secondary: '#f5f5f5', accent: '#71717a', background: '#fafafa', surface: '#ffffff', text: '#18181b', textDim: '#71717a', border: '#71717a' },
  { name: 'Matrix Green', primary: '#000a00', secondary: '#001a00', accent: '#00ff41', background: '#000a00', surface: '#001a00', text: '#00ff41', textDim: '#00cc33', border: '#00ff41' },
  { name: 'Lavender Mist', primary: '#140a1f', secondary: '#24153a', accent: '#c4b5fd', background: '#140a1f', surface: '#24153a', text: '#ede9fe', textDim: '#a78bfa', border: '#c4b5fd' },
  { name: 'Solar Flare', primary: '#1f1005', secondary: '#3d250a', accent: '#fde047', background: '#1f1005', surface: '#3d250a', text: '#fefce8', textDim: '#fde047', border: '#fde047' },
];

export const FONTS = [
  { name: 'Fraunces + Inter (Default)', display: '"Fraunces", Georgia, serif', sans: '"Inter", system-ui, sans-serif' },
  { name: 'Playfair Display + Source Sans', display: '"Playfair Display", Georgia, serif', sans: '"Source Sans Pro", system-ui, sans-serif' },
  { name: 'Merriweather + Open Sans', display: '"Merriweather", Georgia, serif', sans: '"Open Sans", system-ui, sans-serif' },
  { name: 'Cormorant Garamond + Lato', display: '"Cormorant Garamond", Georgia, serif', sans: '"Lato", system-ui, sans-serif' },
  { name: 'Libre Baskerville + Montserrat', display: '"Libre Baskerville", Georgia, serif', sans: '"Montserrat", system-ui, sans-serif' },
  { name: 'Spectral + Roboto', display: '"Spectral", Georgia, serif', sans: '"Roboto", system-ui, sans-serif' },
  { name: 'DM Serif Display + DM Sans', display: '"DM Serif Display", Georgia, serif', sans: '"DM Sans", system-ui, sans-serif' },
  { name: 'IBM Plex Serif + IBM Plex Sans', display: '"IBM Plex Serif", Georgia, serif', sans: '"IBM Plex Sans", system-ui, sans-serif' },
  { name: 'Source Serif Pro + Source Sans', display: '"Source Serif Pro", Georgia, serif', sans: '"Source Sans Pro", system-ui, sans-serif' },
  { name: 'Noto Serif + Noto Sans', display: '"Noto Serif", Georgia, serif', sans: '"Noto Sans", system-ui, sans-serif' },
  { name: 'Georgia + Arial (System)', display: 'Georgia, serif', sans: 'Arial, system-ui, sans-serif' },
  { name: 'Times + Helvetica (System)', display: '"Times New Roman", serif', sans: 'Helvetica, system-ui, sans-serif' },
];

interface SettingsState {
  // Theme
  themeIndex: number;
  setThemeIndex: (index: number) => void;
  
  // Font
  fontIndex: number;
  setFontIndex: (index: number) => void;
  
  // Mode
  darkMode: boolean;
  setDarkMode: (enabled: boolean) => void;
  
  // Adult mode
  adultMode: boolean;
  setAdultMode: (enabled: boolean) => void;
  
  // Language preference
  language: string;
  setLanguage: (lang: string) => void;
  
  // LLM Model
  selectedProvider: string;
  setSelectedProvider: (provider: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  
  // Save all settings
  saveAll: () => void;
  
  // Reset to defaults
  resetToDefaults: () => void;
}

const defaultSettings = {
  themeIndex: 0,
  fontIndex: 0,
  darkMode: true,
  adultMode: false,
  language: 'auto',
  selectedProvider: 'openrouter',
  selectedModel: 'meta-llama/llama-3.1-8b-instruct',
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      ...defaultSettings,
      
      setThemeIndex: (index) => set({ themeIndex: index }),
      setFontIndex: (index) => set({ fontIndex: index }),
      setDarkMode: (enabled) => set({ darkMode: enabled }),
      setAdultMode: (enabled) => set({ adultMode: enabled }),
      setLanguage: (lang) => set({ language: lang }),
      setSelectedProvider: (provider) => set({ selectedProvider: provider }),
      setSelectedModel: (model) => set({ selectedModel: model }),
      
      saveAll: () => {
        // Settings are auto-persisted via zustand persist middleware
        console.log('Settings saved:', get());
      },
      
      resetToDefaults: () => set(defaultSettings),
    }),
    {
      name: 'ggpt_settings',
      partialize: (state) => ({
        themeIndex: state.themeIndex,
        fontIndex: state.fontIndex,
        darkMode: state.darkMode,
        adultMode: state.adultMode,
        language: state.language,
        selectedProvider: state.selectedProvider,
        selectedModel: state.selectedModel,
      }),
    }
  )
);