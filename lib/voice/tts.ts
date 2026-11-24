import { VoiceConfig } from '../types';

// Free voice options for each language
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
  'ja-JP': [
    { id: 'ja-JP-NanamiNeural', name: 'Nanami (Cute)', gender: 'female' },
    { id: 'ja-JP-AoiNeural', name: 'Aoi (Sweet)', gender: 'female' },
    { id: 'ja-JP-MayuNeural', name: 'Mayu (Gentle)', gender: 'female' },
    { id: 'ja-JP-NamiNeural', name: 'Nami (Warm)', gender: 'female' },
  ],
  'ko-KR': [
    { id: 'ko-KR-SunHiNeural', name: 'SunHi (Friendly)', gender: 'female' },
    { id: 'ko-KR-JiMinNeural', name: 'JiMin (Sweet)', gender: 'female' },
    { id: 'ko-KR-YuJinNeural', name: 'YuJin (Gentle)', gender: 'female' },
  ],
  'zh-CN': [
    { id: 'zh-CN-XiaoxiaoNeural', name: 'Xiaoxiao (Sweet)', gender: 'female' },
    { id: 'zh-CN-XiaoyiNeural', name: 'Xiaoyi (Gentle)', gender: 'female' },
    { id: 'zh-CN-XiaochenNeural', name: 'Xiaochen (Warm)', gender: 'female' },
  ],
  'es-ES': [
    { id: 'es-ES-ElviraNeural', name: 'Elvira (Warm)', gender: 'female' },
    { id: 'es-ES-AbrilNeural', name: 'Abril (Sweet)', gender: 'female' },
  ],
  'es-MX': [
    { id: 'es-MX-DaliaNeural', name: 'Dalia (Friendly)', gender: 'female' },
    { id: 'es-MX-JorgeNeural', name: 'Jorge (Warm)', gender: 'female' },
  ],
  'fr-FR': [
    { id: 'fr-FR-DeniseNeural', name: 'Denise (Gentle)', gender: 'female' },
    { id: 'fr-FR-EloiseNeural', name: 'Eloise (Sweet)', gender: 'female' },
  ],
  'de-DE': [
    { id: 'de-DE-KatjaNeural', name: 'Katja (Friendly)', gender: 'female' },
    { id: 'de-DE-AmalaNeural', name: 'Amala (Gentle)', gender: 'female' },
  ],
  'pt-BR': [
    { id: 'pt-BR-FranciscaNeural', name: 'Francisca (Excited)', gender: 'female' },
    { id: 'pt-BR-AntonioNeural', name: 'Antonio (Warm)', gender: 'female' },
  ],
  'hi-IN': [
    { id: 'hi-IN-SwaraNeural', name: 'Swara (Sweet)', gender: 'female' },
    { id: 'hi-IN-MadhurNeural', name: 'Madhur (Gentle)', gender: 'female' },
  ],
  'ru-RU': [
    { id: 'ru-RU-SvetlanaNeural', name: 'Svetlana (Friendly)', gender: 'female' },
    { id: 'ru-RU-DariyaNeural', name: 'Dariya (Gentle)', gender: 'female' },
  ],
  'th-TH': [
    { id: 'th-TH-PremwadeeNeural', name: 'Premwadee (Sweet)', gender: 'female' },
    { id: 'th-TH-NeelaratNeural', name: 'Neelarat (Gentle)', gender: 'female' },
  ],
  'vi-VN': [
    { id: 'vi-VN-HoaiMyNeural', name: 'Hoai My (Gentle)', gender: 'female' },
    { id: 'vi-VN-ThuMinhNeural', name: 'Thu Minh (Sweet)', gender: 'female' },
  ],
  'id-ID': [
    { id: 'id-ID-GadisNeural', name: 'Gadis (Gentle)', gender: 'female' },
    { id: 'id-ID-ArdiNeural', name: 'Ardi (Warm)', gender: 'female' },
  ],
  'tl-PH': [
    { id: 'fil-PH-BlessicaNeural', name: 'Blessica (Sweet)', gender: 'female' },
    { id: 'fil-PH-AngeloNeural', name: 'Angelo (Warm)', gender: 'female' },
  ],
  'tr-TR': [
    { id: 'tr-TR-EmelNeural', name: 'Emel (Friendly)', gender: 'female' },
    { id: 'tr-TR-AhmetNeural', name: 'Ahmet (Warm)', gender: 'female' },
  ],
  'ar-EG': [
    { id: 'ar-EG-SalmaNeural', name: 'Salma (Friendly)', gender: 'female' },
    { id: 'ar-EG-HodaNeural', name: 'Hoda (Gentle)', gender: 'female' },
  ],
};

export async function textToSpeech(
  text: string,
  voiceConfig: VoiceConfig
): Promise<ArrayBuffer | null> {
  try {
    // Use Edge TTS (free Microsoft service)
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
    console.error('TTS Error:', error);
    return null;
  }
}

// Browser-based fallback TTS
export function browserTTS(text: string, voiceConfig: VoiceConfig): void {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voiceConfig.language;
    utterance.rate = 1 + (voiceConfig.rate / 100);
    utterance.pitch = 1 + (voiceConfig.pitch / 100);
    utterance.volume = voiceConfig.volume / 100;

    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang === voiceConfig.language);
    if (matchingVoice) utterance.voice = matchingVoice;

    window.speechSynthesis.speak(utterance);
  }
}
