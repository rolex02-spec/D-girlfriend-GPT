'use client';

// ============================================================
// LANGUAGE DEMO — proves the promise instead of claiming it.
//
// A real chat-window mock (not a screenshot) cycles through
// ten languages. Each round: the user line appears, she types
// her answer character-by-character in the SAME language, then
// holds for reading before moving on. Clicking a language chip
// jumps straight to it and stops the auto-cycle — the reader
// stays in control.
// ============================================================

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Send, Mic, Sparkles } from 'lucide-react';

type Exchange = {
  code: string;
  label: string;
  flaglessRegion: string; // region word, no emoji flags (emoji are banned as icons)
  you: string;
  her: string;
  gloss: string; // one-line English gloss so non-speakers get the feeling
};

// Real, everyday exchanges — short, warm, the way people actually text
const EXCHANGES: Exchange[] = [
  { code: 'ta', label: 'Tamil', flaglessRegion: 'Chennai', you: 'என்ன பண்ணிட்டு இருக்க?', her: 'ஒன்னும் இல்ல… உங்களைப் பத்தி யோசிச்சிட்டு இருந்தேன்.', gloss: '“What are you up to?” — “Nothing… I was thinking about you.”' },
  { code: 'hi', label: 'Hindi', flaglessRegion: 'Delhi', you: 'कैसी हो?', her: 'अच्छी हूँ… तुम बताओ, दिन कैसा रहा?', gloss: '“How are you?” — “Good… you tell me, how was your day?”' },
  { code: 'ru', label: 'Russian', flaglessRegion: 'Moscow', you: 'Как дела?', her: 'Хорошо. Скучаю по тебе, честно говоря.', gloss: '“How are things?” — “Fine. I miss you, honestly.”' },
  { code: 'zh', label: 'Chinese', flaglessRegion: 'Shanghai', you: '你在干嘛？', her: '在想你呀。你呢，今天累不累？', gloss: '“What are you doing?” — “Thinking about you. And you — tired today?”' },
  { code: 'si', label: 'Sinhala', flaglessRegion: 'Colombo', you: 'කොහොමද ඉන්නේ?', her: 'හොඳයි. ඔයාව දැක්ක නිසා තව හොඳයි.', gloss: '“How are you?” — “Fine. Better now that I’ve seen you.”' },
  { code: 'ml', label: 'Malayalam', flaglessRegion: 'Kochi', you: 'സുഖമാണോ?', her: 'സുഖം… നിങ്ങൾ പറയൂ, ഇന്ന് എങ്ങനെയുണ്ടായിരുന്നു?', gloss: '“Are you well?” — “I am… you tell me, how was your day?”' },
  { code: 'te', label: 'Telugu', flaglessRegion: 'Hyderabad', you: 'ఎలా ఉన్నావ్?', her: 'బాగున్నా… నువ్వు చెప్పు, రేపు కలుద్దామా?', gloss: '“How are you?” — “Doing well… you say, shall we meet tomorrow?”' },
  { code: 'kn', label: 'Kannada', flaglessRegion: 'Bengaluru', you: 'ಹೇಗಿದ್ದೀಯಾ?', her: 'ಚೆನ್ನಾಗಿದ್ದೀನಿ… ನೀವು ಹೇಗಿದ್ದೀರಿ, ತಿಂಡಿ ಆಯ್ತಾ?', gloss: '“How are you?” — “I’m well… how are you, have you eaten?”' },
  { code: 'ar', label: 'Arabic', flaglessRegion: 'Dubai', you: 'كيف حالك؟', her: 'بخير… وحشتني، صراحة.', gloss: '“How are you?” — “Fine… I missed you, honestly.”' },
  { code: 'en', label: 'English', flaglessRegion: 'London', you: 'Long day?', her: 'The longest. Tell me about yours — I’m listening.', gloss: '“Long day?” — “The longest. Tell me about yours — I’m listening.”' },
];

// How long each round holds before switching (ms)
const TYPE_SPEED = 38;      // per character while she "types"
const HOLD_MS = 3200;       // reading time after she finishes
const USER_PAUSE_MS = 700;  // beat between her line and the next user line

export default function LanguageDemo() {
  const reduced = !!useReducedMotion();
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState('');        // characters of her reply revealed so far
  const [phase, setPhase] = useState<'user' | 'typing' | 'done'>('user');
  const [auto, setAuto] = useState(true);        // false once the reader takes over
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const current = EXCHANGES[idx];
  const full = current.her;

  // Clear any pending timer on unmount / index change (no leaks, no ghost typing)
  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  // Orchestrate one round: user line → her typing → hold → next language
  useEffect(() => {
    setTyped('');
    setPhase('user');

    if (reduced) {
      // Reduced motion: show the finished exchange, no typing animation
      setTyped(full);
      setPhase('done');
      return;
    }

    const t1 = setTimeout(() => setPhase('typing'), USER_PAUSE_MS);
    return () => clearTimeout(t1);
  }, [idx, full, reduced]);

  // Character-by-character reveal while phase === 'typing'
  useEffect(() => {
    if (phase !== 'typing') return;
    if (typed.length >= full.length) {
      setPhase('done');
      return;
    }
    const t = setTimeout(() => setTyped(full.slice(0, typed.length + 1)), TYPE_SPEED);
    return () => clearTimeout(t);
  }, [phase, typed, full]);

  // Auto-advance only after she finishes typing AND the reader hasn't taken over
  useEffect(() => {
    if (phase !== 'done' || !auto || reduced) return;
    timerRef.current = setTimeout(() => setIdx((i) => (i + 1) % EXCHANGES.length), HOLD_MS);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [phase, auto, reduced]);

  // Reader clicks a chip → jump there, stop the carousel
  const pick = (i: number) => {
    setAuto(false);
    setIdx(i);
  };

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      {/* LEFT: the claim, with the language chips as proof-of-choice */}
      <div>
        <p className="text-caption-3 tracking-[0.18em] text-amber/80">ANY LANGUAGE</p>
        <h2 className="font-display mt-2 text-h3 text-paper-1 sm:text-h2">
          Text her in Tamil.<br />
          <span className="text-paper-2">She answers in Tamil.</span>
        </h2>
        <p className="mt-5 max-w-[520px] text-body-3 leading-relaxed text-paper-2">
          She mirrors the language you write in — script, idiom and all. English, Thanglish,
          Hindi, Tamil, Malayalam, Telugu, Kannada, Sinhala, Chinese, Russian and forty more
          are native to the roster.
        </p>

        {/* Chip wall — clicking takes control of the demo */}
        <div className="mt-7 flex flex-wrap gap-2" role="group" aria-label="Preview a language">
          {EXCHANGES.map((e, i) => (
            <button
              key={e.code}
              onClick={() => pick(i)}
              aria-pressed={i === idx}
              className={`h-9 rounded-full border px-3.5 text-[12px] font-medium transition-all duration-200 btn-press ${
                i === idx
                  ? 'border-amber/60 bg-amber/15 text-amber'
                  : 'border-hairline bg-ink-2 text-paper-2 hover:border-hairline-strong hover:text-paper-1'
              }`}
            >
              {e.label}
            </button>
          ))}
        </div>
        <p className="mt-4 text-caption-5 text-paper-3" role="status">
          {auto ? 'Now cycling — tap any language to hold it.' : `Held on ${current.label} — auto-cycle off.`}
        </p>
      </div>

      {/* RIGHT: the live product mock — a real chat window, not a picture of one */}
      <div className="relative">
        {/* Soft ground glow behind the frame */}
        <div aria-hidden="true" className="pointer-events-none absolute -inset-8 -z-10 opacity-70"
          style={{ background: 'radial-gradient(ellipse at 60% 40%, rgba(217,160,91,0.12) 0%, transparent 65%)' }} />

        <div className="overflow-hidden rounded-2xl border border-hairline bg-ink-1 shadow-float" role="region" aria-label={`Chat example in ${current.label}`}>
          {/* Window chrome: her identity + live dot */}
          <div className="flex items-center justify-between border-b border-hairline bg-ink-0/80 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-seal font-display text-[14px] text-seal-text"
                style={{ boxShadow: 'inset 0 1.5px 1px rgba(255,255,255,0.22), inset 0 -2px 4px rgba(0,0,0,0.4)' }}>
                {current.label[0]}
              </span>
              <div className="leading-tight">
                <p className="text-title-4 text-paper-1">{current.label} speaker</p>
                <p className="text-caption-5 text-paper-3">{current.flaglessRegion} · replies in {current.label}</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-caption-5 text-ok">
              <span className="h-1.5 w-1.5 rounded-full bg-ok animate-pulse-soft" aria-hidden="true" />
              awake
            </span>
          </div>

          {/* Message area — fixed height so the frame never jumps between rounds */}
          <div className="flex min-h-[240px] flex-col justify-end gap-3 px-4 py-5">
            <AnimatePresence mode="wait">
              <motion.div key={`u-${idx}-${phase === 'user' ? 'in' : 'seen'}`}
                initial={{ opacity: 0, y: 12, x: 16 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="self-end max-w-[80%]"
              >
                <div className="rounded-2xl rounded-tr-tight border border-amber/20 bg-amber/15 px-4 py-2.5 text-body-3 text-paper-1">
                  {current.you}
                </div>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div key={`h-${idx}`}
                initial={{ opacity: 0, y: 12, x: -16 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="self-start max-w-[85%]"
              >
                <div className="rounded-2xl rounded-tl-tight border border-hairline bg-ink-2 px-4 py-2.5 text-body-3 text-paper-1">
                  {typed}
                  {phase === 'typing' && <span className="ml-0.5 inline-block w-2 animate-pulse-soft text-amber">▋</span>}
                </div>
                {/* Gloss line: what it means, for everyone else */}
                {phase === 'done' && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
                    className="mt-2 max-w-[95%] text-caption-5 italic text-paper-3">
                    {current.gloss}
                  </motion.p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Input bar — the real controls, disabled because this is a demo */}
          <div className="flex items-center gap-2 border-t border-hairline bg-ink-0/60 px-3 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl text-paper-3" aria-hidden="true"><Mic className="h-4 w-4" strokeWidth={1.5} /></span>
            <span className="flex-1 rounded-xl border border-hairline bg-ink-2 px-3.5 py-2.5 text-body-6 text-paper-3">
              Message her in any language…
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber text-ink-1" aria-hidden="true"><Send className="h-4 w-4" strokeWidth={2} /></span>
          </div>
        </div>

        {/* Floating "RAG" note — accuracy, attached to the demo it explains */}
        <div className="absolute -bottom-5 left-4 hidden items-center gap-2 rounded-full border border-hairline bg-ink-2 px-3.5 py-2 text-caption-5 text-paper-2 shadow-raised sm:flex">
          <Sparkles className="h-3.5 w-3.5 text-amber" strokeWidth={1.75} aria-hidden="true" />
          Memory + retrieval keep her answers on the facts you gave her
        </div>
      </div>
    </div>
  );
}
