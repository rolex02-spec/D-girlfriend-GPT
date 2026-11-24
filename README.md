# D-girlfriend-GPT

> **A fictional AI companion platform for adults — honest by design, private by default, multilingual by default.**

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-Multi--Model-purple)](https://openrouter.ai/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 🌟 Overview

**Girlfriend-GPT** is a Next.js 16 application that lets you chat with **fictional adult AI companions** — written personalities, not real people. Every character is an adult (21–25), fictional, and clearly labelled as AI. The project emphasizes **honesty, privacy, and multilingual support** out of the box.

### Core Philosophy
- **Honest by design** — No fake humans, no hidden operators, no false fluency claims
- **Private by default** — Everything lives in your browser (localStorage), no server database for chats
- **Multilingual by default** — Write in Tamil, Telugu, Tanglish, Hinglish, Hindi, English, or any mix — she mirrors you
- **Adult content is opt-in** — 18+ toggle requires age confirmation, provider safety policies still apply

---

## ✨ Features

### 👥 **Companion Catalog (82 Characters)**
- 82 fictional adult companions across **34 countries**, **58 languages**
- Filter by country, language, age band (21–25), personality archetype (10 types)
- Each companion has: backstory, interests, speaking style, unique portrait
- All portraits are AI-generated illustrations — never real people

### 🎨 **Customise Studio** (`/create`)
- Build your own companion: name, archetype, origin, interests, speaking style, backstory
- **Full body customization**: breast size/shape, butt size/shape, waist, hips, leg length, body type
- Skin tone, hair color/style, eye color, portrait ambience (22 color themes)
- Optional AI portrait generation via Pollinations.ai (free, Flux model)
- Download generated portraits

### 💬 **Immersive Chat** (`/chat/[id]`)
- **Left rail**: Companion dossier (personality, style, interests, backstory)
- **Message flow**: WhatsApp-style bubbles, typing indicators, emotion tags
- **Header controls**: Voice TTS, pause/resume, reset, report, leave, settings (⚙️)
- **Full-screen portrait viewer** with zoom/pan/touch
- **Per-character localStorage threads** — refresh resumes exactly where you left off

### 🔊 **Voice TTS (58+ Languages)**
- Browser `SpeechSynthesis` — free, offline, no server needed
- Auto-selects best matching voice for companion's language
- Works for all 82+ girls in their native languages

### 🌍 **Language Mirroring (58+ Languages)**
| Language | Code | Example |
|----------|------|---------|
| English | `en` | Hello, how are you? |
| Tamil | `ta` | வணக்கம், நீங்கள் எப்படி இருக்கீர்கள்? |
| Telugu | `te` | హలో, మీరు ఎలా ఉన్నారు? |
| Tanglish | `tanglish` | Vanakkam, neenga epdi irukeenga? |
| Malayalam | `ml` | നമസ്കാരം, സുഖമാണോ? |
| Kannada | `kn` | ನಮಸ್ಕಾರ, ಹೇಗಿದ್ದೀರಾ? |
| Hindi | `hi` | नमस्ते, आप कैसे हैं? |
| Hinglish | `hinglish` | Namaste, aap kaise ho? |
| Japanese | `ja` | こんにちは、お元気ですか？ |
| Korean | `ko` | 안녕하세요, 잘 지내세요? |
| Chinese | `zh` | 你好，你好吗？ |
| Spanish | `es` | Hola, ¿cómo estás? |
| French | `fr` | Bonjour, comment ça va ? |
| German | `de` | Hallo, wie geht's? |
| Arabic | `ar` | مرحبا، كيف حالك؟ |
| Russian | `ru` | Привет, как дела? |
| Portuguese | `pt` | Olá, como vai você? |
| Italian | `it` | Ciao, come stai? |
| Thai | `th` | สวัสดีครับ คุณเป็นอย่างไร? |
| Vietnamese | `vi` | Xin chào, bạn khỏe không? |

**Rules enforced in system prompt:**
- Reply in the **exact same language** as user
- Preserve **code-switching** (e.g., Tanglish → Tanglish)
- Preserve **script** (Devanagari, Tamil, etc.)
- Never default to English unless user writes in English

### 🔞 **Adult Mode (18+)**
- Toggle in settings drawer (⚙️ → Adult Roleplay)
- Requires **"I'm 18+" confirmation** (stored in localStorage)
- Uses NSFW-capable models automatically when enabled
- Provider safety policies still apply (content fades to black at boundaries)
- **Romance dial**: Sweet & gentle / Steamy (18+)

### 🛡️ **Safety & Privacy**
| Feature | Implementation |
|---------|----------------|
| **No server chat DB** | All messages in `localStorage` (`ggpt_chat_{id}`) |
| **No cookies** | Zero cookies set by app |
| **Age gate** | `ggpt_age_18` localStorage flag |
| **Custom companions** | Stored in `ggpt_customs` localStorage |
| **Reports** | `ggpt_reports` localStorage (device-only) |
| **Export/Delete** | Settings → Privacy → Export JSON / Delete all |

### 🎨 **Theming (22 Themes + 12 Fonts)**
- **22 color themes**: Midnight Rose, Deep Ocean, Forest Shadow, Royal Purple, Crimson Velvet, Golden Amber, Cyberpunk Neon, Sunset Coral, Arctic Ice, Monochrome Dark/Light, Blood Moon, Emerald Dream, Violet Dusk, Sandy Beige, Rose Gold, Slate Professional, Berry Wine, Terracotta, Obsidian, Pearl White, Matrix Green, Lavender Mist, Solar Flare
- **12 font pairs**: Fraunces+Inter, Playfair+Source Sans, Merriweather+Open Sans, Cormorant+Lato, Libre Baskerville+Montserrat, Spectral+Roboto, DM Serif+DM Sans, IBM Plex Serif+Sans, Source Serif+Sans, Noto Serif+Sans, Georgia+Arial, Times+Helvetica
- Dark/Light mode toggle
- All persisted in localStorage, applied on app load

---

## 🤖 **LLM Models (15 Total — All Free via OpenRouter)**

### NSFW (10) — Uncensored
| Model | ID | Best For |
|-------|-----|----------|
| **MythoMax L2 13B** | `gryphe/mythomax-l2-13b` | **Best overall roleplay** ⭐ |
| **Dolphin 2.9 Llama3 8B** | `cognitivecomputations/dolphin-2.9-llama3-8b` | Uncensored, instruction-tuned |
| **Llama 3.1 70B** | `meta-llama/llama-3.1-70b-instruct` | Highest quality |
| **Mixtral 8x7B** | `mistralai/mixtral-8x7b-instruct` | MoE, creative |
| **Llama 3.1 8B** | `meta-llama/llama-3.1-8b-instruct` | **Default NSFW** |
| **Llama 3.2 3B** | `meta-llama/llama-3.2-3b-instruct` | Fast |
| **Llama 3.2 11B Vision** | `meta-llama/llama-3.2-11b-vision-instruct` | Multimodal input |
| **Mistral 7B** | `mistralai/mistral-7b-instruct` | Strong reasoning |
| **Toppy M 7B** | `undi95/toppy-m-7b` | Creative writing |
| **Euryale 7B** | `sao10k/l3-euryale-7b` | Roleplay & creative |

### SFW (5) — Content Filters Apply
| Model | ID | Best For |
|-------|-----|----------|
| **GPT-4o Mini** | `openai/gpt-4o-mini` | **Best overall SFW** ⭐ |
| **Gemini 1.5 Flash** | `google/gemini-flash-1.5` | Multimodal, 1M context |
| **Claude 3 Haiku** | `anthropic/claude-3-haiku` | Natural writing |
| **GPT-3.5 Turbo** | `openai/gpt-3.5-turbo` | Classic, reliable |
| **Phi-3 Mini** | `microsoft/phi-3-mini-128k-instruct` | Efficient, 128k context |

### 🔑 **Multi-Key Auto-Rotation (3 Keys)**
```env
OPENROUTER_API_KEY_1=sk-or-v1-xxx...
OPENROUTER_API_KEY_2=sk-or-v1-xxx...
OPENROUTER_API_KEY_3=sk-or-v1-xxx...
```
- **429 rate limit** → immediate key rotation + retry same request
- **401 auth failure** → rotate to next key
- **Success** → resets failure counter
- **1-hour cooldown** → exhausted keys auto-reset
- Logs: `[Attempt 1] Calling model (key: 1/3)`

---

## 🖼️ **Image Generation (Free, No API Key)**
- **Pollinations.ai** (Flux model) — free, no key required
- Endpoint: `/api/generate-image`
- Styles: `portrait`, `fullbody`, `anime`, `realistic`, `fantasy`
- NSFW toggle: `isNsfw: true`
- Used in: Customise Studio portraits, chat companion images

---

## 🚀 **Quick Start**

### Prerequisites
- Node.js 18+
- pnpm / npm / yarn
- OpenRouter API key(s) → [openrouter.ai/keys](https://openrouter.ai/keys)

### Installation
```bash
# Clone
git clone https://github.com/rolex02-spec/D-girlfriend-GPT.git
cd D-girlfriend-GPT

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your OpenRouter keys:
# OPENROUTER_API_KEY_1=sk-or-v1-xxx...
# OPENROUTER_API_KEY_2=sk-or-v1-xxx...
# OPENROUTER_API_KEY_3=sk-or-v1-xxx...

# Run development server
npm run dev

# Open http://localhost:3000
```

### Production Build
```bash
npm run build
npm start
```

---

## 📁 **Project Structure**

```
girlfriend-gpt/
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # Stateless chat API (multi-key rotation)
│   │   ├── generate-image/route.ts # Pollinations image proxy
│   │   ├── voice/route.ts         # Edge TTS fallback (unused)
│   │   └── characters/route.ts    # Character catalog API
│   ├── chat/[id]/page.tsx         # Chat page (SSR + client ChatClient)
│   ├── companions/page.tsx        # Catalog (SSG + client filter)
│   ├── companions/[id]/page.tsx   # Profile (SSG + client customs)
│   ├── create/page.tsx            # Customise Studio
│   ├── settings/page.tsx          # Privacy, export, delete
│   ├── privacy/page.tsx           # Privacy policy
│   ├── safety/page.tsx            # Safety policy
│   ├── layout.tsx                 # Root layout (fonts, providers)
│   ├── page.tsx                   # Landing page
│   └── globals.css                # Design tokens + legacy compat
├── components/
│   ├── chat/ChatClient.tsx        # Main chat UI (600+ lines)
│   ├── companions/                # CatalogClient, CompanionCard, StartConversationButton
│   ├── avatar/CompanionAvatar.tsx # SVG procedural avatar
│   ├── ui/ProfileImageViewer.tsx  # Full-screen zoom/pan
│   ├── ui/ModelSelector.tsx       # 15-model dropdown
│   ├── landing/                   # HeroScene, ScrollFX, Faq
│   └── site/                      # Navbar, Footer, AgeGate
├── store/
│   ├── chatStore.ts               # Zustand: messages, nsfwMode, voice, emotion
│   └── settingsStore.ts           # Zustand + persist: theme, font, darkMode, adultMode
├── data/companions.ts             # Catalog adapter (CharacterConfig → Companion)
├── lib/
│   ├── llm/provider.ts            # Multi-key rotation, 15 models, RAG, system prompt
│   ├── voice/tts.ts               # Browser SpeechSynthesis TTS
│   ├── characters/database.ts     # 82 CharacterConfig entries
│   ├── types.ts                   # TypeScript interfaces
│   └── emotions.ts                # Emotion state machine
└── public/images/characters/      # 120 character portraits
```

---

## ⚙️ **Configuration**

### Environment Variables (`.env.local`)
```env
# Database (optional - for Prisma if used)
DATABASE_URL="file:./dev.db"

# OpenRouter API Keys (1 required, 3 for rotation)
OPENROUTER_API_KEY_1=sk-or-v1-xxx...
OPENROUTER_API_KEY_2=sk-or-v1-xxx...
OPENROUTER_API_KEY_3=sk-or-v1-xxx...

# Legacy fallback
OPENROUTER_API_KEY=sk-or-v1-xxx...

# Optional: JWT/Encryption
JWT_SECRET="your-32-char-secret"
ENCRYPTION_KEY="your-32-char-hex-key"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

---

## 🛡️ **Safety & Compliance**

### Hard Limits (Enforced in System Prompt)
- ❌ No minors (all characters 21–25, custom companions adult by construction)
- ❌ No non-consent, coercion, blackmail
- ❌ No real people (living, dead, or "inspired by")
- ❌ No incest dynamics
- ❌ No medical/legal/financial/crisis advice as fact
- ✅ Provider safety policies respected (content fades to black)

### Age Verification
- **Self-declaration only** — not legal identity verification
- Stored in `localStorage` (`ggpt_age_18`)
- Regulated jurisdictions **must add verified age checks** before paid adult features

### Data Practices
- **No accounts** — no email, phone, payment data
- **No analytics** — no tracking, no ads, no fingerprinting
- **Local-first** — everything in browser `localStorage`
- **Export/Delete** — one click in Settings → Privacy

---

## 🧪 **Testing**

```bash
# Lint
npm run lint

# Build (verifies types + SSG)
npm run build

# Security audit
npm audit
```

---

## 📝 **License**

MIT License — see [LICENSE](LICENSE) for details.

---

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 🙏 **Acknowledgments**

- **OpenRouter** — Unified API for 100+ models
- **Pollinations.ai** — Free image generation
- **Next.js Team** — React framework
- **Tailwind CSS** — Utility-first styling
- **Zustand** — Lightweight state management
- **Lucide** — Beautiful icons
- **Framer Motion** — Smooth animations

---

## ⚠️ **Disclaimer**

> **This is a fictional AI companion platform for adults (18+).**
> - All characters are **fictional adults (21–25)**, not real people
> - AI companions are **clearly labelled as AI** everywhere they appear
> - Adult content is **opt-in**, requires age confirmation, and respects provider safety policies
> - **No medical, legal, or crisis advice** — if things get heavy, talk to a human professional
> - **Self-declared age ≠ legal age verification** — regulated jurisdictions must add verified checks

**Use responsibly. Be kind. Remember: they're not real, but the feelings can be.**

---

<p align="center">
  Made with 💕 for the quiet hours.
</p>