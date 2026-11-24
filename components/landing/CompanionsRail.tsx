'use client';

// ============================================================
// COMPANIONS RAIL — the scroll-driven signature moment.
//
// On desktop the section pins to the viewport and vertical
// scrolling drags 68 companion cards horizontally (1:1 with
// scroll progress). On touch widths it degrades to a native
// snap-scroll row, because scroll-jacking on mobile is hostile.
//
// Every card is clickable: it selects the companion in the
// zustand store and drops the reader into the chat room with
// her already chosen — zero dead ends.
// ============================================================

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight, Globe } from 'lucide-react';
import { characters } from '@/lib/characters/database';
import { CharacterConfig } from '@/lib/types';
import { useChatStore } from '@/store/chatStore';
import AvatarFallback from '@/components/ui/CharacterAvatarFallback';

// Native-language label for the small chip on each card
const LANG_LABELS: Record<string, string> = {
  en: 'English', ja: '日本語', ko: '한국어', th: 'ไทย', tl: 'Filipino', id: 'Bahasa',
  vi: 'Tiếng Việt', zh: '中文', 'zh-TW': '中文', 'zh-HK': '粵語', ru: 'Русский',
  pt: 'Português', es: 'Español', de: 'Deutsch', fr: 'Français', ar: 'العربية',
  tr: 'Türkçe', hi: 'हिन्दी', ur: 'اردو', si: 'සිංහල', bn: 'বাংলা', ne: 'नेपाली',
  my: 'မြန်မာ', km: 'ខ្មែរ', lo: 'ລາວ', ms: 'Bahasa Melayu', mn: 'Монгол',
  kk: 'Қазақша', fa: 'فارسی', el: 'Ελληνικά', it: 'Italiano', am: 'አማርኛ',
  sw: 'Kiswahili', ta: 'தமிழ்', te: 'తెలుగు', ml: 'മലയാളം', kn: 'ಕನ್ನಡ',
  mr: 'मराठी', tanglish: 'Tanglish', hinglish: 'Hinglish',
};

// One companion card — 3D tilt on hover lives in .card-3d (globals.css)
function CompanionCard({ character, index, onPick }: { character: CharacterConfig; index: number; onPick: () => void }) {
  return (
    <motion.button
      onClick={onPick}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: Math.min(index, 8) * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className="group relative w-[280px] shrink-0 snap-start overflow-hidden rounded-2xl border border-hairline bg-ink-2 p-5 text-left card-3d sm:w-[300px]"
      aria-label={`Chat with ${character.name}, ${character.age}, ${character.country}`}
    >
      {/* Hover wash — warm light spills across the card */}
      <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: 'linear-gradient(140deg, rgba(217,160,91,0.14) 0%, transparent 45%, rgba(196,104,90,0.10) 100%)' }} />

      {/* Index + 18+ tag */}
      <span className="relative z-10 flex items-center justify-between">
        <span className="font-display-sm text-[12px] tabular-nums text-amber/85">{String(index + 1).padStart(2, '0')}</span>
        {character.nsfwAllowed && (
          <span className="rounded-md border border-hairline px-1.5 py-0.5 text-[10px] font-medium leading-none text-paper-3">18+</span>
        )}
      </span>

      {/* Portrait + identity */}
      <span className="relative z-10 mt-4 flex items-center gap-3.5">
        <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-hairline">
          {character.imageUrl ? (
            <img
              src={character.imageUrl}
              alt={character.name}
              className="h-full w-full object-cover"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          ) : (
            <AvatarFallback character={character} size={56} />
          )}
        </span>
        <span className="min-w-0">
          <span className="font-display block truncate text-[22px] leading-none text-paper-1">{character.name}</span>
          <span className="mt-1.5 block truncate text-[12px] text-paper-3">{character.age} · {character.region || character.country} · {character.nationality}</span>
        </span>
      </span>

      {/* She speaks this language */}
      <span className="relative z-10 mt-3 inline-flex items-center gap-1.5 rounded-full border border-amber/25 bg-amber/10 px-2.5 py-1 text-[11px] font-medium text-amber/90">
        <Globe className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />
        {LANG_LABELS[character.language] || character.language}
      </span>

      {/* Two lines of who she is */}
      <p className="relative z-10 mt-3 line-clamp-2 min-h-[2.6em] text-[13px] leading-snug text-paper-2">{character.backstory}</p>

      {/* Personality meter line + arrow that steps on hover */}
      <span className="relative z-10 mt-4 flex w-full items-center justify-between border-t border-hairline pt-3 text-[11px] tabular-nums text-paper-3">
        <span>Romance {character.personality.romanticLevel} · Play {character.personality.playfulness} · Spice {character.personality.dirtyTalk}</span>
        <ArrowRight className="h-3.5 w-3.5 text-amber opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" strokeWidth={1.75} aria-hidden="true" />
      </span>
    </motion.button>
  );
}

export default function CompanionsRail() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const reduced = !!useReducedMotion();

  const [overflow, setOverflow] = useState(0);   // px of horizontal travel needed
  const [mode, setMode] = useState<'pin' | 'swipe'>('pin');

  // Pick the interaction model from viewport width (re-measures on rotate/resize)
  useEffect(() => {
    const pick = () => setMode(window.innerWidth >= 768 ? 'pin' : 'swipe');
    pick();
    window.addEventListener('resize', pick);
    return () => window.removeEventListener('resize', pick);
  }, []);

  // Measure how far the track overflows its viewport (re-runs when mode swaps)
  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      const viewport = viewportRef.current;
      if (!track || !viewport) return;
      setOverflow(Math.max(0, track.scrollWidth - viewport.clientWidth));
    };
    measure();
    // Second pass after fonts/avatars settle — layout shifts otherwise
    const t1 = setTimeout(measure, 400);
    const t2 = setTimeout(measure, 1200);
    window.addEventListener('resize', measure);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', measure);
    };
  }, [mode]);

  // Scroll progress across the pinned section → horizontal translation
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  // Travel factor: the section is only TRAVEL× as tall as the rail is wide,
  // so the rail glides ~1/TRAVEL× faster than the scroll. At 1:1 (factor 1)
  // 68 cards would demand a 21,000px scroll marathon; 0.4 keeps the full
  // roster reachable in ~10 screens while staying 1:1-predictable.
  const TRAVEL = 0.4;
  // Full travel across the (shortened) pinned distance — weighted, predictable
  const x = useTransform(scrollYProgress, [0, 1], [0, -overflow]);
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Select her and enter the room — the card IS the call to action
  const pick = (c: CharacterConfig) => {
    useChatStore.getState().setSelectedCharacter(c);
    router.push('/chat');
  };

  const track = (
    <div ref={trackRef} className={`flex w-max gap-5 ${mode === 'swipe' ? 'snap-x snap-mandatory overflow-x-auto px-6 pb-4' : ''}`}>
      {characters.map((c, i) => (
        <CompanionCard key={c.id} character={c} index={i} onPick={() => pick(c)} />
      ))}
    </div>
  );

  return (
    <div
      ref={sectionRef}
      id="companions"
      className="relative"
      style={mode === 'pin' ? { height: `calc(100vh + ${Math.round(overflow * TRAVEL)}px)` } : undefined}
    >
      {/* Pinned viewport (desktop) or plain block (mobile) */}
      <div
        ref={viewportRef}
        className={mode === 'pin' ? 'sticky top-0 flex h-screen flex-col justify-center overflow-hidden' : 'py-8'}
      >
        {/* Section heading — always top-aligned, one idea per screen */}
        <div className="mx-auto flex w-full max-w-[1280px] items-end justify-between gap-6 px-6 pb-8">
          <div>
            <p className="text-caption-3 tracking-[0.18em] text-amber/80">THE ROSTER</p>
            <h2 className="font-display mt-2 text-h3 text-paper-1 sm:text-h2">
              {characters.length} women. <span className="text-paper-2">One of them is your type.</span>
            </h2>
          </div>
          <p className="hidden max-w-[280px] text-right text-body-6 text-paper-3 md:block">
            Ages 19 to 27, forty countries, every language on the list. Scroll across — tap anyone to start talking.
          </p>
        </div>

        {/* The rail itself */}
        {mode === 'pin' ? (
          <motion.div style={{ x: reduced ? 0 : x }} className="will-change-transform">
            {track}
          </motion.div>
        ) : (
          // Mobile: wrap in a container that constrains the snap-scroll so it
          // never inflates the document's scrollWidth. The inner track is still
          // snappable, but overflow is contained.
          <div className="overflow-hidden">
            {track}
          </div>
        )}

        {/* Progress hairline — shows how much roster is left to travel */}
        {mode === 'pin' && (
          <div className="mx-auto mt-8 h-px w-full max-w-[1280px] bg-hairline">
            <motion.div className="h-px origin-left bg-amber" style={{ scaleX: reduced ? 1 : progress }} />
          </div>
        )}
      </div>
    </div>
  );
}
