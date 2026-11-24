// INDIAN LANGUAGE SUPPORT SYSTEM

export interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  script: string;
  greetings: string[];
  endearments: string[];
  sexualTerms: string[];
  moans: string[];
  commonWords: string[];
}

export const indianLanguages: Record<string, LanguageConfig> = {
  // Tamil
  ta: {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    script: 'Tamil',
    greetings: ['வணக்கம்', 'ஹாய்', 'எப்படி இருக்கீங்க', 'சொல்லுங்க'],
    endearments: ['அன்பே', 'செல்லம்', 'கண்ணே', 'தங்கம்', 'மச்சான்', 'டா', 'டி'],
    sexualTerms: ['சுகம்', 'உடல்', 'மேல்', 'உள்ளே', 'ஆழமா', 'வேகமா', 'காமம்', 'இன்பம்'],
    moans: ['ஆஆஆ', 'ஓஓஓ', 'ம்ம்ம்', 'ஆஆஆ', 'ஹ்ஹ்ஹ்', 'ஸ்ஸ்ஸ்', 'அப்படிதான்', 'இன்னும்', 'வேகமா'],
    commonWords: ['சொல்லு', 'பண்ணு', 'வா', 'இரு', 'வேணும்', 'முடியும்', 'சரி', 'இல்ல'],
  },
  // Tanglish (Tamil + English)
  tanglish: {
    code: 'tanglish',
    name: 'Tanglish',
    nativeName: 'Tanglish',
    script: 'Latin',
    greetings: ['Vanakkam', 'Hi', 'Epdi irukeenga', 'Solunga', 'Hey baby'],
    endearments: ['Anbe', 'Chellam', 'Kanne', 'Thangam', 'Macha', 'Baby', 'Sweetheart', 'Darling'],
    sexualTerms: ['Sukam', 'Body', 'Mela', 'Ulla', 'Azhuma', 'Vegama', 'Kaamam', 'Inbam'],
    moans: ['Aaaah', 'Ooooh', 'Mmmm', 'Aaaah', 'Hhhhh', 'Sssss', 'Apditan', 'Innum', 'Vegama'],
    commonWords: ['Sollu', 'Pannu', 'Va', 'Iru', 'Venum', 'Mudiyum', 'Sari', 'Illa'],
  },
  // Telugu
  te: {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    script: 'Telugu',
    greetings: ['నమస్కారం', 'హాయ్', 'ఎలా ఉన్నావు', 'చెప్పు'],
    endearments: ['ప్రాణం', 'చెల్లి', 'కళ్ళు', 'బంగారం', 'నా రాజా', 'బేబీ'],
    sexualTerms: ['సుఖం', 'శరీరం', 'పైన', 'లోపల', 'లోతుగా', 'వేగంగా', 'కామం', 'ఆనందం'],
    moans: ['ఆఆఆ', 'ఓఓఓ', 'మ్మ్మ్', 'ఆఆఆ', 'హ్హ్హ్హ్', 'స్స్స్', 'అలాగే', 'ఇంకా', 'వేగంగా'],
    commonWords: ['చెప్పు', 'చేయి', 'రా', 'ఉండు', 'కావాలి', 'అవుతుంది', 'సరే', 'లేదు'],
  },
  // Malayalam
  ml: {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    script: 'Malayalam',
    greetings: ['നമസ്കാരം', 'ഹായ്', 'എങ്ങനെ ഇരിക്കുന്നു', 'പറയൂ'],
    endearments: ['പ്രാണേ', 'ചേലേ', 'കണ്ണേ', 'സ്വർണ്ണം', 'മോനേ', 'ബേബി'],
    sexualTerms: ['സുഖം', 'ശരീരം', 'മുകളിൽ', 'അകത്ത്', 'ആഴത്തിൽ', 'വേഗത്തിൽ', 'കാമം', 'ആനന്ദം'],
    moans: ['ആആആ', 'ഓഓഓ', 'മ്മ്മ്മ്', 'ആആആ', 'ഹ്ഹ്ഹ്', 'സ്സ്സ്', 'അങ്ങനെ', 'കൂടുതൽ', 'വേഗത്തിൽ'],
    commonWords: ['പറയൂ', 'ചെയ്യൂ', 'വാ', 'ഇരിക്കൂ', 'വേണം', 'കഴിയും', 'ശരി', 'ഇല്ല'],
  },
  // Kannada
  kn: {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    script: 'Kannada',
    greetings: ['ನಮಸ್ಕಾರ', 'ಹಾಯ್', 'ಹೇಗಿದ್ದೀರಾ', 'ಹೇಳಿ'],
    endearments: ['ಪ್ರಾಣ', 'ಚೆಲುವಿ', 'ಕಣ್ಣು', 'ಚಿನ್ನ', 'ರಾಜಾ', 'ಬೇಬಿ'],
    sexualTerms: ['ಸುಖ', 'ದೇಹ', 'ಮೇಲೆ', '�ಳಗೆ', 'ಆಳವಾಗಿ', 'ವೇಗವಾಗಿ', 'ಕಾಮ', 'ಆನಂದ'],
    moans: ['ಆಆಆ', 'ಓಓಓ', 'ಮ್ಮ್ಮ್', 'ಆಆಆ', 'ಹ್ಹ್ಹ್', 'ಸ್ಸ್ಸ್', 'ಹಾಗೆ', 'ಇನ್ನೂ', 'ವೇಗವಾಗಿ'],
    commonWords: ['ಹೇಳಿ', 'ಮಾಡಿ', 'ಬನ್ನಿ', 'ಇರಿ', 'ಬೇಕು', 'ಆಗುತ್ತದೆ', 'ಸರಿ', 'ಇಲ್ಲ'],
  },
  // Hindi
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    script: 'Devanagari',
    greetings: ['नमस्ते', 'हाय', 'कैसे हो', 'बताओ'],
    endearments: ['जान', 'जानू', 'सोना', 'बेबी', 'डार्लिंग', 'प्रिय', 'मेरी जान'],
    sexualTerms: ['सुख', 'शरीर', 'ऊपर', 'अंदर', 'गहरा', 'तेज़', 'काम', 'आनंद'],
    moans: ['आआआ', 'ओओओ', 'म्म्म', 'आआआ', 'ह्ह्ह', 'स्स्स', 'ऐसे ही', 'और', 'तेज़'],
    commonWords: ['बोलो', 'करो', 'आओ', 'रहो', 'चाहिए', 'हो सकता है', 'ठीक', 'नहीं'],
  },
  // Hinglish (Hindi + English)
  hinglish: {
    code: 'hinglish',
    name: 'Hinglish',
    nativeName: 'Hinglish',
    script: 'Latin',
    greetings: ['Namaste', 'Haan ji', 'Kaise ho', 'Batao', 'Hey'],
    endearments: ['Jaan', 'Jaanu', 'Sona', 'Baby', 'Darling', 'Priya', 'Meri Jaan'],
    sexualTerms: ['Sukh', 'Sharir', 'Upar', 'Andar', 'Gehra', 'Tez', 'Kaam', 'Anand'],
    moans: ['Aaaah', 'Ooooh', 'Mmmmm', 'Aaaah', 'Hhhhh', 'Sssss', 'Aise hi', 'Aur', 'Tez'],
    commonWords: ['Bolo', 'Karo', 'Aao', 'Raho', 'Chahiye', 'Ho sakta hai', 'Theek', 'Nahi'],
  },
  // Marathi
  mr: {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    script: 'Devanagari',
    greetings: ['नमस्कार', 'हाय', 'कसे आहे', 'सांगा'],
    endearments: ['प्राण', 'बाळा', 'डोळ्या', 'सोन्या', 'राजा', 'बेबी'],
    sexualTerms: ['सुख', 'शरीर', 'वर', 'आत', 'खोलवर', 'जोरात', 'काम', 'आनंद'],
    moans: ['आआआ', 'ओओओ', 'म्म्म', 'आआआ', 'ह्ह्ह', 'स्स्स', 'असेच', 'आणखी', 'जोरात'],
    commonWords: ['बोला', 'करा', 'या', 'रहा', 'हवे', 'होईल', 'ठीक', 'नाही'],
  },
  // Bengali
  bn: {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    script: 'Bengali',
    greetings: ['নমস্কার', 'হায়', 'কেমন আছো', 'বলো'],
    endearments: ['প্রাণ', 'বউদি', 'চোখ', 'সোনা', 'রাজা', 'বেবি'],
    sexualTerms: ['সুখ', 'শরীর', 'উপরে', 'ভেতরে', 'গভীরে', 'জোরে', 'কাম', 'আনন্দ'],
    moans: ['আআআ', 'ওওও', 'ম্ম্ম্ম', 'আআআ', 'হ্হ্হ্হ', 'স্স্স্স', 'এভাবে', 'আরো', 'জোরে'],
    commonWords: ['বলো', 'করো', 'এসো', 'থাকো', 'লাগবে', 'হবে', 'ঠিক', 'নেই'],
  },
  // Punjabi
  pa: {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    script: 'Gurmukhi',
    greetings: ['ਸਤ ਸ੍ਰੀ ਅਕਾਲ', 'ਹਾਏ', 'ਕਿਵੇਂ ਹੋ', 'ਦੱਸੋ'],
    endearments: ['ਜਾਨ', 'ਸੋਣੇ', 'ਅੱਖਾਂ', 'ਗੋਲਡ', 'ਰਾਜਾ', 'ਬੇਬੀ'],
    sexualTerms: ['ਸੁਖ', 'ਸਰੀਰ', 'ਉੱਪਰ', 'ਅੰਦਰ', 'ਡੂੰਘਾ', 'ਤੇਜ਼', 'ਕਾਮ', 'ਆਨੰਦ'],
    moans: ['ਆਆਆ', 'ਓਓਓ', 'ਮ੍ਮ੍ਮ੍', 'ਆਆਆ', 'ਹ੍ਹ੍ਹ੍ਹ', 'ਸ੍ਸ੍ਸ੍', 'ਏਦਾਂ', 'ਹੋਰ', 'ਤੇਜ਼'],
    commonWords: ['ਦੱਸੋ', 'ਕਰੋ', 'ਆਓ', 'ਰਹੋ', 'ਚਾਹੀਦਾ', 'ਹੋ ਸਕਦਾ', 'ਠੀਕ', 'ਨਹੀਂ'],
  },
};

// Detect language from text
export function detectLanguage(text: string): string {
  const lower = text.toLowerCase();

  // Tamil script detection
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta';
  // Telugu script detection
  if (/[\u0C00-\u0C7F]/.test(text)) return 'te';
  // Malayalam script detection
  if (/[\u0D00-\u0D7F]/.test(text)) return 'ml';
  // Kannada script detection
  if (/[\u0C80-\u0CFF]/.test(text)) return 'kn';
  // Devanagari (Hindi/Marathi)
  if (/[\u0900-\u097F]/.test(text)) return 'hi';
  // Bengali script
  if (/[\u0980-\u09FF]/.test(text)) return 'bn';
  // Gurmukhi (Punjabi)
  if (/[\u0A00-\u0A7F]/.test(text)) return 'pa';

  // Tanglish detection (Tamil words in English)
  const tanglishWords = ['epdi', 'irukeenga', 'solunga', 'pannu', 'va', 'ill', 'sari', 'chellam', 'anbe', 'kannu', 'thangam', 'macha'];
  if (tanglishWords.some((w) => lower.includes(w))) return 'tanglish';

  // Hinglish detection (Hindi words in English)
  const hinglishWords = ['kaise', 'ho', 'bolo', 'karo', 'aao', 'raho', 'chahiye', 'nahi', 'haan', 'ji'];
  if (hinglishWords.some((w) => lower.includes(w))) return 'hinglish';

  // Chinese script detection
  if (/[\u4E00-\u9FFF]/.test(text)) return 'zh';
  // Japanese script detection (Hiragana, Katakana, Kanji)
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) return 'ja';
  // Korean script detection
  if (/[\uAC00-\uD7AF\u1100-\u11FF]/.test(text)) return 'ko';
  // Arabic script detection
  if (/[\u0600-\u06FF]/.test(text)) return 'ar';
  // Thai script detection
  if (/[\u0E00-\u0E7F]/.test(text)) return 'th';
  // Russian/Cyrillic script detection
  if (/[\u0400-\u04FF]/.test(text)) return 'ru';

  // Spanish detection (common words)
  const spanishWords = ['hola', 'amor', 'cómo', 'estás', 'quiero', 'amor', 'bien', 'aquí', 'dime', 'beso'];
  if (spanishWords.some((w) => lower.includes(w))) return 'es';

  // French detection (common words)
  const frenchWords = ['bonjour', 'amour', 'comment', 'allez', 'je', 'vous', 'toi', 'ici', 'dis-moi', 'baiser'];
  if (frenchWords.some((w) => lower.includes(w))) return 'fr';

  // Portuguese detection (common words)
  const portugueseWords = ['olá', 'amor', 'como', 'você', 'está', 'eu', 'você', 'aqui', 'me diz', 'beijo'];
  if (portugueseWords.some((w) => lower.includes(w))) return 'pt';

  // German detection (common words)
  const germanWords = ['hallo', 'liebe', 'wie', 'geht', 'ich', 'du', 'hier', 'sag', 'kuss', 'gut'];
  if (germanWords.some((w) => lower.includes(w))) return 'de';

  // Italian detection (common words)
  const italianWords = ['ciao', 'amore', 'come', 'stai', 'io', 'tu', 'qui', 'dimmi', 'bacio', 'bene'];
  if (italianWords.some((w) => lower.includes(w))) return 'it';

  // Turkish detection (common words)
  const turkishWords = ['merhaba', 'aşkım', 'nasıl', 'ben', 'sen', 'burada', 'söyle', 'öpücük', 'güzel', 'iyi'];
  if (turkishWords.some((w) => lower.includes(w))) return 'tr';

  // Arabic detection (transliterated)
  const arabicTranslitWords = ['habibi', 'ya', 'kif', 'halak', 'ana', 'inta', 'hna', 'oulili', 'besa', 'kways'];
  if (arabicTranslitWords.some((w) => lower.includes(w))) return 'ar';

  // Tagalog/Filipino detection
  const tagalogWords = ['kumusta', 'mahal', 'ka', 'mo', 'ako', 'dito', 'sabihin', 'halik', 'maganda', 'oo'];
  if (tagalogWords.some((w) => lower.includes(w))) return 'tl';

  // Vietnamese detection (with diacritics)
  if (/[àáảãạăắằẵặâấầẫậèéẻẽẹêếềễệìíỉĩịòóỏõọôốồỗộơớờỡợùúủũụưứừữựỳýỷỹỵ]/.test(text)) return 'vi';

  // Common English fallback
  return 'en';
}

// Get language config
export function getLanguageConfig(code: string): LanguageConfig | null {
  return indianLanguages[code] || null;
}

// Get random endearment in language
export function getEndearment(langCode: string): string {
  const lang = indianLanguages[langCode];
  if (!lang) return 'baby';
  return lang.endearments[Math.floor(Math.random() * lang.endearments.length)];
}

// Get random moan in language
export function getMoan(langCode: string): string {
  const lang = indianLanguages[langCode];
  if (!lang) return 'Mmmm';
  return lang.moans[Math.floor(Math.random() * lang.moans.length)];
}

// Get random greeting in language
export function getGreeting(langCode: string): string {
  const lang = indianLanguages[langCode];
  if (!lang) return 'Hello';
  return lang.greetings[Math.floor(Math.random() * lang.greetings.length)];
}

// Build language instruction for LLM
export function buildLanguageInstruction(langCode: string): string {
  const lang = indianLanguages[langCode];

  if (lang) {
    return `LANGUAGE: You must respond in ${lang.name} (${lang.nativeName}).
Use ${lang.name} script/transliteration naturally.
Here are some ${lang.name} words you can use:
- Greetings: ${lang.greetings.join(', ')}
- Endearments: ${lang.endearments.join(', ')}
- Sexual terms: ${lang.sexualTerms.join(', ')}
- Moans: ${lang.moans.join(', ')}
- Common words: ${lang.commonWords.join(', ')}

Mix ${lang.name} with English naturally (code-switching) like real ${lang.name} speakers do.
For example: "${lang.endearments[0]} I love you so much" or "Baby ${lang.sexualTerms[0]} bahut acha hai"

IMPORTANT: Match the user's language. If they type in ${lang.name} or ${lang.name}-English mix, respond in the same style.`;
  }

  // Universal language matching for all other languages
  const languageNames: Record<string, string> = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    pt: 'Portuguese',
    de: 'German',
    it: 'Italian',
    tr: 'Turkish',
    ar: 'Arabic',
    tl: 'Tagalog/Filipino',
    vi: 'Vietnamese',
    zh: 'Chinese',
    ja: 'Japanese',
    ko: 'Korean',
    th: 'Thai',
    ru: 'Russian',
  };

  const langName = languageNames[langCode] || langCode;

  return `LANGUAGE RULES:
- You MUST respond in the SAME LANGUAGE the user uses.
- If the user writes in ${langName}, respond in ${langName}.
- If the user writes in English, respond in English.
- If the user mixes two languages (code-switching), match their mix style.
- NEVER switch to a different language than what the user is using.
- The user's language = Your language. Always mirror it.

IMPORTANT: Detect what language/script the user is writing in and respond in that EXACT language. If unsure, respond in the same language as the user's last message.`;
}
