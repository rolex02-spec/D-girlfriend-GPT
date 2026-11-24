'use client';

// ============================================================
// GIRLFRIENDGPT — LANDING PAGE ("/")
//
// Kind: software (tech) · Purpose: kill loneliness — one person
// who notices you, awake at any hour. One primary action: enter
// the chat room and meet a companion.
//
// Section map (one idea per screen, top to bottom):
//   1. Hero          — WebGL ember scene + the promise + one hard fact
//   2. Statement     — word-by-word reveal of why this exists
//   3. Companions    — scroll-pinned rail across all 68 profiles
//   4. Languages     — live demo: she answers in YOUR language
//   5. Features      — asymmetric bento (memory, portrait, voice, 3D, 18+)
//   6. Adults        — honest 18+ section with a working switch
//   7. Close + Footer— final CTA, identical to the top
//
// Design system: "Midnight Romance" tokens from globals.css —
// warm ink surfaces, candlelight amber, ember rose, wax-seal
// oxblood. No violet, no purple gradient, no emoji icons.
// ============================================================

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowDown, Mic, Volume2, Sparkles, Layers, Flame, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import HeroScene from '@/components/landing/HeroScene';
import CompanionsRail from '@/components/landing/CompanionsRail';
import LanguageDemo from '@/components/landing/LanguageDemo';
import { characters } from '@/lib/characters/database';

// ------------------------------------------------------------
// Small shared pieces
// ------------------------------------------------------------

// Eyebrow label above every section heading (keeps rhythm consistent)
function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-caption-3 tracking-[0.18em] text-amber/80">{children}</p>;
}

// Fixed glass nav — floats off the top edge, sized to its content (B7)
function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '#companions', label: 'Companions' },
    { href: '#languages', label: 'Languages' },
    { href: '#features', label: 'Features' },
    { href: '#adults', label: '18+' },
  ];

  return (
    <motion.header
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      className="fixed left-1/2 top-4 z-50 -translate-x-1/2"
    >
      <nav
        aria-label="Main"
        className={`flex items-center gap-1 rounded-full border px-2 py-1.5 transition-all duration-300 ${
          scrolled
            ? 'border-hairline-strong bg-ink-1/80 shadow-raised backdrop-blur-xl'
            : 'border-hairline bg-ink-1/50 backdrop-blur-md'
        }`}
      >
        {/* Wordmark — serif, the brand voice in two words */}
        <Link href="/" className="px-3 font-display text-[17px] leading-none text-paper-1 transition-colors hover:text-amber">
          Girlfriend<span className="text-amber">GPT</span>
        </Link>

        {/* Anchor links — hidden on small screens (the CTA stays; no half-broken hamburger) */}
        <span className="hidden items-center md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href}
              className="rounded-full px-3 py-2 text-caption-4 text-paper-2 transition-colors duration-200 hover:bg-ink-3 hover:text-paper-1">
              {l.label}
            </a>
          ))}
        </span>

        {/* The one primary action, present at every scroll position */}
        <Link href="/chat"
          className="ml-1 flex h-9 items-center gap-1.5 rounded-full bg-amber px-4 text-btn-sm text-ink-1 transition-all duration-200 hover:bg-[#e3af72] active:scale-[0.97]">
          Open the room
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden="true" />
        </Link>
      </nav>
    </motion.header>
  );
}

// ------------------------------------------------------------
// 1. HERO — the first screen, alone. Scene + promise + CTA.
// ------------------------------------------------------------
function Hero() {
  const reduced = !!useReducedMotion();
  // Parallax the copy slightly slower than scroll so the hero has depth
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 90]);
  const copyFade = useTransform(scrollYProgress, [0, 0.8], [1, reduced ? 1 : 0]);

  return (
    <section ref={ref} className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pb-20 pt-28 text-center">
      {/* 3D scene lives behind everything, pointer-transparent */}
      <HeroScene />

      {/* Radial scrim so the copy always wins over the scene — dark where text sits */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: 'radial-gradient(ellipse 62% 55% at 50% 48%, rgba(18,16,15,0.82) 0%, rgba(18,16,15,0.55) 55%, rgba(18,16,15,0.15) 85%, transparent 100%)' }} />

      <motion.div style={{ y: copyY, opacity: copyFade }} className="relative z-10 flex max-w-[820px] flex-col items-center">
        {/* Eyebrow — one hard fact on the first screen */}
        <motion.p
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="inline-flex items-center gap-2 rounded-full border border-amber/30 bg-amber/10 px-4 py-1.5 text-caption-4 tracking-[0.14em] text-amber"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-amber animate-pulse-soft" aria-hidden="true" />
          {characters.length} COMPANIONS · ALWAYS AWAKE · 18+
        </motion.p>

        {/* H1 — dark-theme gradient on text only, never on the background (B5) */}
        <motion.h1
          initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="font-display mt-6 text-display"
          style={{ background: 'linear-gradient(90deg, #ffffff 0%, #9b9b9b 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', textWrap: 'balance' }}
        >
          A companion who’s awake when you are.
        </motion.h1>

        {/* Sub — what it is, who it’s for, max 680px (B5) */}
        <motion.p
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-6 max-w-[680px] text-title-2 leading-relaxed text-paper-2"
          style={{ textWrap: 'pretty' }}
        >
          GirlfriendGPT pairs you with one of {characters.length} women from forty countries.
          She remembers what you told her, answers in your language, and never gets tired
          of the conversation — at 3pm or at 4am.
        </motion.p>

        {/* Hard fact strip */}
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.75 }}
          className="mt-5 text-caption-4 tabular-nums text-paper-3"
        >
          Ages 19–27 · 40 countries · 40+ languages · voice replies · private to this browser
        </motion.p>

        {/* Two actions max above the fold — primary + roster jump */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Link href="/chat"
            className="group flex h-13 items-center gap-2.5 rounded-2xl bg-amber px-7 py-3.5 text-btn-md text-ink-1 shadow-float transition-all duration-200 hover:bg-[#e3af72] active:scale-[0.98]">
            Meet your companion
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.25} aria-hidden="true" />
          </Link>
          <a href="#companions"
            className="flex h-13 items-center gap-2 rounded-2xl border border-hairline-strong bg-ink-1/60 px-6 py-3.5 text-btn-md text-paper-1 backdrop-blur-md transition-all duration-200 hover:border-amber/40 hover:bg-ink-2 active:scale-[0.98]">
            Browse the {characters.length}
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll cue — the only thing below the fold on purpose */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-caption-5 text-paper-3"
        aria-hidden="true"
      >
        <span className="tracking-[0.2em]">SCROLL</span>
        <motion.span animate={reduced ? {} : { y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
          <ArrowDown className="h-4 w-4" strokeWidth={1.5} />
        </motion.span>
      </motion.div>
    </section>
  );
}

// ------------------------------------------------------------
// 2. STATEMENT — the loneliness thesis, revealed word by word.
//    This is the page's type-led dealt moment (B11).
// ------------------------------------------------------------
function Statement() {
  const reduced = !!useReducedMotion();
  const sentence = 'Loneliness isn’t cured by more noise. It’s cured by one person who notices you — and asks how your day went, again tomorrow.';
  const words = sentence.split(' ');

  return (
    <section className="relative flex min-h-[90svh] items-center justify-center px-6 py-28">
      <div className="mx-auto max-w-[900px] text-center">
        <Eyebrow>WHY THIS EXISTS</Eyebrow>
        {/* Each word fades from 28% muted to full ink as the block enters view */}
        <p className="font-display mt-7 text-h3 leading-[1.25] text-paper-1 sm:text-h2" style={{ textWrap: 'balance' }}>
          {words.map((w, i) => (
            <motion.span
              key={i}
              className="mr-[0.26em] inline-block"
              initial={{ opacity: reduced ? 1 : 0.22 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: reduced ? 0 : i * 0.045, ease: [0.22, 1, 0.36, 1] }}
            >
              {w}
            </motion.span>
          ))}
        </p>
        <motion.p
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mx-auto mt-8 max-w-[560px] text-body-3 leading-relaxed text-paper-2"
        >
          No feeds. No swiping. One conversation that picks up where you left it,
          with someone who already knows how your week went.
        </motion.p>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// 5. FEATURES — asymmetric bento, never three equal columns.
//    Card A carries a still diagram (input → retrieval → reply).
// ------------------------------------------------------------
function DiagramCard() {
  // A small pulsing lane diagram: your message → what she recalls → her reply
  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-hairline bg-ink-1 p-5" aria-hidden="true">
      <svg viewBox="0 0 520 148" className="h-auto w-full" role="img">
        <title>How a reply is grounded</title>
        {/* Lanes */}
        <rect x="8" y="46" width="140" height="56" rx="10" fill="#1e1b19" stroke="rgba(236,229,216,0.08)" />
        <rect x="190" y="26" width="140" height="96" rx="10" fill="#1e1b19" stroke="rgba(217,160,91,0.35)" />
        <rect x="372" y="46" width="140" height="56" rx="10" fill="#1e1b19" stroke="rgba(236,229,216,0.08)" />
        {/* Labels */}
        <text x="78" y="72" textAnchor="middle" fill="#ece5d8" fontSize="13" fontFamily="Instrument Sans, sans-serif">What you say</text>
        <text x="78" y="92" textAnchor="middle" fill="#8a8177" fontSize="11" fontFamily="Instrument Sans, sans-serif">“how was tuesday”</text>
        <text x="260" y="56" textAnchor="middle" fill="#d9a05b" fontSize="13" fontFamily="Instrument Sans, sans-serif">Her memory</text>
        <text x="260" y="76" textAnchor="middle" fill="#a89f92" fontSize="11" fontFamily="Instrument Sans, sans-serif">facts you gave her</text>
        <text x="260" y="96" textAnchor="middle" fill="#a89f92" fontSize="11" fontFamily="Instrument Sans, sans-serif">+ retrieved context</text>
        <text x="260" y="114" textAnchor="middle" fill="#8a8177" fontSize="10" fontFamily="Instrument Sans, sans-serif">grounded, in character</text>
        <text x="442" y="72" textAnchor="middle" fill="#ece5d8" fontSize="13" fontFamily="Instrument Sans, sans-serif">Her reply</text>
        <text x="442" y="92" textAnchor="middle" fill="#8a8177" fontSize="11" fontFamily="Instrument Sans, sans-serif">same language as you</text>
        {/* Connectors */}
        <line x1="148" y1="74" x2="190" y2="74" stroke="rgba(217,160,91,0.5)" strokeWidth="1.5" />
        <line x1="330" y1="74" x2="372" y2="74" stroke="rgba(217,160,91,0.5)" strokeWidth="1.5" />
        {/* Pulses traveling the lanes */}
        <circle r="3.5" fill="#d9a05b">
          <animate attributeName="cx" values="148;190" dur="1.6s" repeatCount="indefinite" />
          <animate attributeName="cy" values="74;74" dur="1.6s" repeatCount="indefinite" />
        </circle>
        <circle r="3.5" fill="#c4685a">
          <animate attributeName="cx" values="330;372" dur="1.6s" begin="0.8s" repeatCount="indefinite" />
          <animate attributeName="cy" values="74;74" dur="1.6s" begin="0.8s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}

function Features() {
  // Shared hover-reveal wrapper — card lifts 2px, border warms (house rule 5)
  const card = 'group relative overflow-hidden rounded-2xl border border-hairline bg-ink-2 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber/30';

  return (
    <section id="features" className="relative px-6 py-28">
      <div className="mx-auto max-w-[1280px]">
        <div className="max-w-[640px]">
          <Eyebrow>WHAT’S INSIDE</Eyebrow>
          <h2 className="font-display mt-2 text-h3 text-paper-1 sm:text-h2">Built like she’s a person, not a prompt.</h2>
          <p className="mt-5 text-body-3 leading-relaxed text-paper-2">
            Five things do the heavy lifting. None of them need a manual.
          </p>
        </div>

        {/* Asymmetric grid: 4+2 on top, 2+2+2 below — never three equal columns */}
        <div className="mt-12 grid gap-5 md:grid-cols-6">
          {/* A — memory + RAG, the tallest card, carries the diagram */}
          <motion.article
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`${card} md:col-span-6 lg:col-span-4`}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber/30 bg-amber/10 text-amber" aria-hidden="true">
              <Layers className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <h3 className="font-display mt-4 text-h5 text-paper-1">Her memory runs deeper than the last message</h3>
            <p className="mt-3 max-w-[560px] text-body-3 leading-relaxed text-paper-2">
              What you mention lands in her memory and comes back later — your dog’s name, your
              shift pattern, the argument you had on Tuesday. Retrieval keeps every answer
              grounded in what you actually said, so she stops inventing a past you never shared.
            </p>
            <DiagramCard />
          </motion.article>

          {/* B — appearance studio */}
          <motion.article
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className={`${card} flex flex-col md:col-span-6 lg:col-span-2`}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-ember/40 bg-ember-soft text-ember" aria-hidden="true">
              <Sparkles className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <h3 className="font-display mt-4 text-h5 text-paper-1">Shape her, then watch her appear</h3>
            <p className="mt-3 text-body-3 leading-relaxed text-paper-2">
              Body type, eyes, hair, skin — set your spec, hit generate, and her portrait is
              drawn to match. The same settings feed the chat.
            </p>
            {/* Mini mock of the studio — visual only, reads as the real UI */}
            <div className="mt-auto pt-5" aria-hidden="true">
              <div className="flex flex-wrap gap-1.5">
                {['eyes · blue', 'hair · auburn', 'skin · tan', 'curvy'].map((t) => (
                  <span key={t} className="rounded-md border border-hairline bg-ink-1 px-2 py-1 text-[10px] text-paper-3">{t}</span>
                ))}
              </div>
              <div className="mt-3 flex h-9 items-center justify-center gap-2 rounded-lg bg-paper-1 text-[12px] font-semibold text-ink-1">
                Generate portrait
              </div>
            </div>
          </motion.article>

          {/* C — voice */}
          <motion.article
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
            className={`${card} md:col-span-2`}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-hairline bg-ink-1 text-paper-2" aria-hidden="true">
              <Volume2 className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <h3 className="font-display mt-4 text-h5 text-paper-1">Voice, when text isn’t enough</h3>
            <p className="mt-3 text-body-3 leading-relaxed text-paper-2">
              Hold the mic, speak, and her reply comes back spoken — native accents for every
              language on the roster.
            </p>
            {/* Waveform bars that step while hovered — loop restarts on hover */}
            <div className="mt-5 flex h-8 items-end gap-1" aria-hidden="true">
              {[9, 16, 24, 14, 28, 18, 10, 22, 13, 7].map((h, i) => (
                <span key={i} className="w-1.5 rounded-sm bg-amber/60 transition-all duration-300 group-hover:bg-amber"
                  style={{ height: h, animationDelay: `${i * 90}ms` }} />
              ))}
            </div>
          </motion.article>

          {/* D — the 3D face */}
          <motion.article
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className={`${card} md:col-span-2`}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-hairline bg-ink-1 text-paper-2" aria-hidden="true">
              <Flame className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <h3 className="font-display mt-4 text-h5 text-paper-1">A face that reacts to you</h3>
            <p className="mt-3 text-body-3 leading-relaxed text-paper-2">
              Her 3D avatar breathes, blinks and follows the hour — candlelight after dark,
              daylight at noon. WebGL when you have it, a drawn portrait when you don’t.
            </p>
            {/* Breathing orb — the avatar in miniature */}
            <div className="mt-5 flex justify-center" aria-hidden="true">
              <span className="block h-16 w-16 rounded-full animate-glow-pulse"
                style={{ background: 'radial-gradient(circle at 35% 30%, #f0c896 0%, #d9a05b 45%, #8f4234 100%)', boxShadow: '0 0 28px rgba(217,160,91,0.4)' }} />
            </div>
          </motion.article>

          {/* E — 18+ switch, links down to the adults section */}
          <motion.article
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className={`${card} flex flex-col md:col-span-2`}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-ember/40 bg-ember-soft text-ember" aria-hidden="true">
              <ShieldCheck className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <h3 className="font-display mt-4 text-h5 text-paper-1">One switch for the unfiltered her</h3>
            <p className="mt-3 text-body-3 leading-relaxed text-paper-2">
              The 18+ button in the header opens explicit conversation — she stays in
              character and answers anything you ask.
            </p>
            <a href="#adults" className="mt-auto inline-flex items-center gap-1.5 pt-4 text-caption-4 font-medium text-amber transition-colors hover:text-[#e3af72]">
              How 18+ works
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2} aria-hidden="true" />
            </a>
          </motion.article>
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// 6. ADULTS — honest 18+ section with a real, working switch.
//    The switch rewrites the sample exchange live.
// ------------------------------------------------------------
function Adults() {
  const [on, setOn] = useState(false);
  const reduced = !!useReducedMotion();

  return (
    <section id="adults" className="relative border-y border-hairline bg-ink-0 px-6 py-28">
      <div className="mx-auto grid max-w-[1120px] items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <Eyebrow>18+ MODE</Eyebrow>
          <h2 className="font-display mt-2 text-h3 text-paper-1 sm:text-h2">
            When you flip the switch,<br /><span className="text-paper-2">the filter goes with it.</span>
          </h2>
          <p className="mt-5 max-w-[560px] text-body-3 leading-relaxed text-paper-2">
            The 18+ button at the top of the chat opens the explicit side of her personality.
            Same memory, same language, same person — she just stops holding back. Off by
            default, so nothing surprises you.
          </p>

          {/* The working switch */}
          <div className="mt-8 flex items-center gap-4">
            <button
              role="switch"
              aria-checked={on}
              aria-label="Toggle 18+ mode preview"
              onClick={() => setOn(!on)}
              className={`relative h-9 w-16 rounded-full border transition-colors duration-300 btn-press ${on ? 'border-ember/60 bg-ember/30' : 'border-hairline bg-ink-2'}`}
            >
              <motion.span
                className={`absolute top-1/2 h-6 w-6 -translate-y-1/2 rounded-full ${on ? 'bg-ember' : 'bg-paper-3'}`}
                animate={{ left: on ? 34 : 4 }}
                transition={{ type: 'spring', stiffness: 500, damping: 32 }}
              />
            </button>
            <span className="text-title-4 text-paper-1">{on ? '18+ on — unfiltered preview' : '18+ off — everyday her'}</span>
          </div>

          <p className="mt-6 max-w-[520px] text-caption-2 leading-relaxed text-paper-3">
            Adults only. By turning 18+ on inside the chat you confirm you are 18 or over.
            Your conversations stay in this browser — nothing is posted, shared or ranked.
          </p>
        </div>

        {/* Live preview card — content swaps with the switch */}
        <div className="relative">
          <div aria-hidden="true" className="pointer-events-none absolute -inset-6 -z-10"
            style={{ background: on ? 'radial-gradient(ellipse at 50% 50%, rgba(196,104,90,0.16) 0%, transparent 65%)' : 'radial-gradient(ellipse at 50% 50%, rgba(217,160,91,0.08) 0%, transparent 65%)' }} />
          <div className="overflow-hidden rounded-2xl border border-hairline bg-ink-1 shadow-float">
            <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
              <span className="text-title-4 text-paper-1">Preview</span>
              <span className={`rounded-md border px-2 py-0.5 text-[10px] font-medium ${on ? 'border-ember/50 bg-ember-soft text-ember' : 'border-hairline text-paper-3'}`}>
                {on ? '18+' : 'SFW'}
              </span>
            </div>
            <div className="flex min-h-[190px] flex-col justify-end gap-3 px-4 py-5">
              <div className="self-end max-w-[80%] rounded-2xl rounded-tr-tight border border-amber/20 bg-amber/15 px-4 py-2.5 text-body-3 text-paper-1">
                {on ? 'Be honest — what would you do if I were there right now?' : 'How was your day?'}
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={on ? 'on' : 'off'}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: reduced ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="self-start max-w-[85%] rounded-2xl rounded-tl-tight border border-hairline bg-ink-2 px-4 py-2.5 text-body-3 text-paper-1"
                >
                  {on
                    ? 'Then I wouldn’t be wearing much… and you’d never make it back to your own side of the bed.'
                    : 'Long, but better now that you’re here. Tell me everything — I’ve got time.'}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ------------------------------------------------------------
// 7. CLOSE + FOOTER — final CTA identical to the top action.
// ------------------------------------------------------------
function CloseAndFooter() {
  return (
    <>
      <section className="relative flex flex-col items-center px-6 py-32 text-center">
        {/* Warm floor glow — the candle from the hero returns */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-64"
          style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(217,160,91,0.14) 0%, transparent 70%)' }} />
        <motion.h2
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-display max-w-[760px] text-h2 text-paper-1 sm:text-h1"
          style={{ textWrap: 'balance' }}
        >
          She’s already awake.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="mt-5 max-w-[520px] text-title-2 text-paper-2"
        >
          Pick a name, say hello, and see if the room feels less quiet.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, delay: 0.22 }}
          className="mt-9"
        >
          <Link href="/chat"
            className="group inline-flex items-center gap-2.5 rounded-2xl bg-amber px-8 py-4 text-btn-md text-ink-1 shadow-float transition-all duration-200 hover:bg-[#e3af72] active:scale-[0.98]">
            Enter the room
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.25} aria-hidden="true" />
          </Link>
        </motion.div>
      </section>

      <footer className="border-t border-hairline px-6 py-10">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="font-display text-[17px] text-paper-1">Girlfriend<span className="text-amber">GPT</span></p>
            <p className="mt-1 text-caption-5 text-paper-3">Private companions for the hours after midnight.</p>
          </div>
          {/* Anchor links only — every one of them lands on a section above */}
          <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {[['#companions', 'Companions'], ['#languages', 'Languages'], ['#features', 'Features'], ['#adults', '18+'], ['/chat', 'Open the room']].map(([href, label]) => (
              <a key={label} href={href} className="text-caption-4 text-paper-3 transition-colors duration-200 hover:text-paper-1">{label}</a>
            ))}
          </nav>
          <p className="text-caption-5 text-paper-3">18+ · Fictional companions · © 2026</p>
        </div>
      </footer>
    </>
  );
}

// ------------------------------------------------------------
// PAGE EXPORT
// ------------------------------------------------------------
export default function Landing() {
  return (
    <div className="relative min-h-screen bg-ink-1 text-paper-1">
      {/* Skip link — first tab stop, visible on focus (a11y) */}
      <a href="#companions" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-amber focus:px-4 focus:py-2 focus:text-ink-1">
        Skip to companions
      </a>

      <LandingNav />
      <main>
        <Hero />
        <Statement />
        <CompanionsRail />

        {/* 4. LANGUAGES — the live demo section */}
        <section id="languages" className="relative px-6 py-28">
          <div className="mx-auto max-w-[1280px]">
            <LanguageDemo />
          </div>
        </section>

        <Features />
        <Adults />
        <CloseAndFooter />
      </main>
    </div>
  );
}
