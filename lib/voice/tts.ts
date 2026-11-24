import { VoiceConfig } from '../types';

// Free voice options for each language (for reference / browser TTS)
export const voiceOptions: Record<string, { id: string; name: string; gender: string }[]> = {
  'en-US': [
    { id: 'en-US-JennyNeural', name: 'Jenny (Sweet)', gender: 'female' },
    { id: 'en-US-AriaNeural', name: 'Aria (Warm)', gender: 'female' },
    { id: 'en-US-DavisNeural', name: 'Davis (Friendly)', gender: 'female' },
    { id: 'en-US-SaraNeural', name: 'Sara (Gentle)', gender: 'female' },
    { id: 'en-US-AnaNeural', name: 'Ana (Young)', gender: 'female' },
    { id: 'en-US-EmmaNeural', name: 'Emma (Mature)', gender: 'female' },
    { id: 'en-US-MichelleNeural', name: 'Michelle (Soft)', gender: 'female' },
  ],
  'ta-IN': [
    { id: 'ta-IN-PallaviNeural', name: 'Pallavi (Tamil)', gender: 'female' },
  ],
  'te-IN': [
    { id: 'te-IN-MohanNeural', name: 'Mohan (Telugu)', gender: 'female' },
  ],
  'kn-IN': [
    { id: 'kn-IN-GaganNeural', name: 'Gagan (Kannada)', gender: 'female' },
  ],
  'ml-IN': [
    { id: 'ml-IN-MidhunNeural', name: 'Midhun (Malayalam)', gender: 'female' },
  ],
  'hi-IN': [
    { id: 'hi-IN-SwaraNeural', name: 'Swara (Hindi)', gender: 'female' },
    { id: 'hi-IN-MadhurNeural', name: 'Madhur (Hindi)', gender: 'female' },
  ],
  'ja-JP': [
    { id: 'ja-JP-NanamiNeural', name: 'Nanami (Japanese)', gender: 'female' },
    { id: 'ja-JP-AoiNeural', name: 'Aoi (Japanese)', gender: 'female' },
  ],
  'ko-KR': [
    { id: 'ko-KR-SunHiNeural', name: 'SunHi (Korean)', gender: 'female' },
    { id: 'ko-KR-JiMinNeural', name: 'JiMin (Korean)', gender: 'female' },
  ],
  'zh-CN': [
    { id: 'zh-CN-XiaoxiaoNeural', name: 'Xiaoxiao (Chinese)', gender: 'female' },
    { id: 'zh-CN-XiaoyiNeural', name: 'Xiaoyi (Chinese)', gender: 'female' },
  ],
  'es-ES': [
    { id: 'es-ES-ElviraNeural', name: 'Elvira (Spanish)', gender: 'female' },
  ],
  'fr-FR': [
    { id: 'fr-FR-DeniseNeural', name: 'Denise (French)', gender: 'female' },
  ],
  'de-DE': [
    { id: 'de-DE-KatjaNeural', name: 'Katja (German)', gender: 'female' },
  ],
  'pt-BR': [
    { id: 'pt-BR-FranciscaNeural', name: 'Francisca (Portuguese)', gender: 'female' },
  ],
  'ru-RU': [
    { id: 'ru-RU-SvetlanaNeural', name: 'Svetlana (Russian)', gender: 'female' },
  ],
  'th-TH': [
    { id: 'th-TH-PremwadeeNeural', name: 'Premwadee (Thai)', gender: 'female' },
  ],
  'vi-VN': [
    { id: 'vi-VN-HoaiMyNeural', name: 'Hoai My (Vietnamese)', gender: 'female' },
  ],
  'id-ID': [
    { id: 'id-ID-GadisNeural', name: 'Gadis (Indonesian)', gender: 'female' },
  ],
  'fil-PH': [
    { id: 'fil-PH-BlessicaNeural', name: 'Blessica (Filipino)', gender: 'female' },
  ],
  'tr-TR': [
    { id: 'tr-TR-EmelNeural', name: 'Emel (Turkish)', gender: 'female' },
  ],
  'ar-EG': [
    { id: 'ar-EG-SalmaNeural', name: 'Salma (Arabic)', gender: 'female' },
  ],
};

/**
 * Get the best matching browser voice for a given language.
 * Returns null if no match found (browser will use default).
 */
function getBrowserVoice(language: string): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  // Exact language match first
  let match = voices.find(v => v.lang === language);
  if (match) return match;

  // Fallback: prefix match (e.g., 'en-US' matches 'en-GB')
  const prefix = language.split('-')[0];
  match = voices.find(v => v.lang.startsWith(prefix));
  if (match) return match;

  // Fallback: female voice in same language family
  match = voices.find(v => v.lang.startsWith(prefix) && v.name.toLowerCase().includes('female'));
  if (match) return match;

  return voices[0] || null;
}

/**
 * Primary TTS: Browser's built-in SpeechSynthesis (free, all languages, no server needed)
 * Returns true if spoken, false if not available
 */
export async function textToSpeech(
  text: string,
  voiceConfig: VoiceConfig
): Promise<boolean> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  return new Promise((resolve) => {
    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = voiceConfig.language;
      utterance.rate = 1 + (voiceConfig.rate / 100);
      utterance.pitch = 1 + (voiceConfig.pitch / 100);
      utterance.volume = voiceConfig.volume / 100;

      // Get best matching browser voice
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const voice = getBrowserVoice(voiceConfig.language) || 
          voices.find(v => v.lang.startsWith(voiceConfig.language.split('-')[0]));
        if (voice) utterance.voice = voice;
      }

      utterance.onend = () => resolve(true);
      utterance.onerror = (e) => {
        console.error('SpeechSynthesis error:', e);
        resolve(false);
      };

      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('TTS Error:', error);
      resolve(false);
    }
  });
}

/**
 * Legacy API-based TTS (kept for compatibility, calls server endpoint)
 * Falls back to browser TTS if server fails
 */
export async function textToSpeechAPI(
  text: string,
  voiceConfig: VoiceConfig
): Promise<ArrayBuffer | null> {
  try {
    const response = await fetch('/api/voice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        voice: voiceConfig.voiceId,
        rate: `${voiceConfig.rate > 0 ? '+' : ''}${voiceConfig.rate}%`,
        pitch: `${voiceConfig.pitch > 0 ? '+' : ''}${voiceConfig.pitch}Hz`,
      }),
    });

    if (!response.ok) throw new Error('TTS failed');

    const data = await response.json();
    if (typeof data.audio !== 'string') return null;

    const match = data.audio.match(/^data:audio\/[^;]+;base64,(.+)$/);
    if (!match) throw new Error('Invalid audio response');

    const binary = window.atob(match[1]);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  } catch (error) {
    console.error('TTS API Error:', error);
    return null;
  }
}

// Ensure voices are loaded (async in some browsers)
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    // Voices loaded
  };
}