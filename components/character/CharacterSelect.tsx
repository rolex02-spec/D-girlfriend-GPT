'use client';

import { useState, useEffect } from 'react';
import { Search, ArrowDown, ArrowUpRight, Loader2 } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { characters } from '@/lib/characters/database';
import { CharacterConfig } from '@/lib/types';

const ORDER = new Map(characters.map((c, i) => [c.id, String(i + 1).padStart(2, '0')]));

function WaxSeal({ initial, size = 48 }: { initial: string; size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="flex flex-shrink-0 items-center justify-center rounded-full bg-seal leading-none text-seal-text shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.22),inset_0_-2px_4px_rgba(0,0,0,0.4)]"
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.42),
        fontFamily: 'var(--font-display), Georgia, serif',
        color: 'var(--seal-text)',
      }}
    >
      {initial}
    </span>
  );
}

function WaxSealEmblem() {
  return (
    <svg
      viewBox="0 0 320 320"
      role="img"
      aria-label="A wax seal bearing the letter G"
      className="w-56 sm:w-64 lg:w-full lg:max-w-[380px] drop-shadow-[0_24px_48px_rgba(0,0,0,0.55)]"
    >
      <defs>
        <radialGradient id="wax" cx="42%" cy="38%" r="75%">
          <stop offset="0%" stopColor="#a8543f" />
          <stop offset="55%" stopColor="#8f4234" />
          <stop offset="100%" stopColor="#6f332a" />
        </radialGradient>
        <filter id="roughEdge" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="3" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="11" xChannelSelector="R" yChannelSelector="G" result="disp" />
        </filter>
      </defs>
      <g filter="url(#roughEdge)">
        <circle cx="160" cy="156" r="112" fill="url(#wax)" />
        <circle cx="216" cy="243" r="14" fill="url(#wax)" />
        <circle cx="238" cy="262" r="6" fill="url(#wax)" />
      </g>
      <circle cx="160" cy="156" r="84" fill="none" stroke="#5f2a22" strokeWidth="2" strokeDasharray="3 6" opacity="0.9" />
      <text x="160" y="215" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="132" fill="#f2e6da" opacity="0.96">
        G
      </text>
    </svg>
  );
}

function MidnightAtmosphere() {
  const dust = [...Array(18)].map((_, i) => {
    const size = Math.random() * 2 + 1;
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const delay = Math.random() * -18;
    const duration = Math.random() * 8 + 14;
    const tx = (Math.random() - 0.5) * 120;
    const ty = (Math.random() - 0.5) * 80;
    return (
      <span
        key={i}
        className="absolute rounded-full bg-amber/40"
        style={{
          width: size,
          height: size,
          left: `${left}%`,
          top: `${top}%`,
          animation: `float-dust ${duration}s ease-in-out infinite`,
          animationDelay: `${delay}s`,
          opacity: 0,
          '--tx': `${tx}px`,
          '--ty': `${ty}px`,
        } as React.CSSProperties}
      />
    );
  });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse 80% 60% at 15% 25%, rgba(217, 160, 91, 0.08) 0%, transparent 70%),
          radial-gradient(ellipse 60% 40% at 85% 15%, rgba(196, 104, 90, 0.06) 0%, transparent 60%),
          radial-gradient(ellipse 100% 80% at 50% 100%, rgba(18, 16, 15, 0.9) 0%, transparent 50%),
          linear-gradient(180deg, rgba(18, 16, 15, 0) 0%, rgba(18, 16, 15, 0.3) 40%, rgba(18, 16, 15, 0.6) 70%, #12100f 100%)
        `,
      }}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float-dust {
            0% { transform: translate(0, 0) scale(1); opacity: 0; }
            10% { opacity: 0.4; }
            90% { opacity: 0.2; }
            100% { transform: translate(var(--tx), var(--ty)) scale(0.5); opacity: 0; }
          }
        `,
      }} />
      {dust}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 200px 60px rgba(18,16,15,0.8)',
        }}
      />
    </div>
  );
}

export default function CharacterSelect() {
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const { setSelectedCharacter, setShowCharacterSelect } = useChatStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const countries = [...new Set(characters.map((c) => c.country))].sort();

  const filtered = characters.filter((c) => {
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      c.name.toLowerCase().includes(query) ||
      c.country.toLowerCase().includes(query);
    const matchesCountry = !selectedCountry || c.country === selectedCountry;
    return matchesSearch && matchesCountry;
  });

  const handleSelect = (character: CharacterConfig) => {
    setSelectedCharacter(character);
    setShowCharacterSelect(false);
  };

  const isFiltering = search.trim() !== '' || selectedCountry !== null;
  const names = characters.map((c) => c.name);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-ink-1">
        <div className="absolute inset-0" style={{ background: '#12100f' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-clip bg-ink-1 text-paper-1">
      {/* Bar over the fold — wordmark only */}
      <header className="absolute inset-x-0 top-0 z-20 flex h-16 items-center justify-between px-6 md:px-10 animate-fade-rise">
        <a href="#top" className="flex items-center gap-2.5">
          <WaxSeal initial="G" size={26} />
          <span className="text-[15px] font-medium tracking-[0.02em] text-paper-1">GirlfriendGPT</span>
        </a>
        <span className="text-[11px] font-medium tabular-nums tracking-[0.18em] text-paper-3">
          {characters.length} COMPANIONS
        </span>
      </header>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden">
        <MidnightAtmosphere />

        {/* Monumental numeral — typographic backdrop */}
        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute -right-6 top-1/2 hidden -translate-y-1/2 font-display text-[clamp(14rem,30vw,28rem)] leading-none text-transparent lg:block"
          style={{ WebkitTextStroke: '1.5px rgba(217,160,91,0.14)' }}
        >
          68
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-[1500px] flex-1 items-center gap-10 px-6 pb-16 pt-24 md:px-10 lg:grid-cols-[1.15fr_1fr] lg:gap-6 lg:pt-20">
          {/* Copy */}
          <div className="stagger-enter max-w-2xl">
            <p className="flex items-center gap-2.5 text-[11px] font-medium tracking-[0.24em] text-amber delay-1">
              <span aria-hidden="true" className="h-px w-8 bg-amber/60" />
              GIRLFRIENDGPT · THE MIDNIGHT HOUR
            </p>

            <h1 className="font-display mt-6 max-w-xl text-balance text-[clamp(2.55rem,5.6vw,4.6rem)] leading-[1.02] text-paper-1 delay-2">
              Everyone wants someone to talk to,{' '}
              <span className="text-amber">after midnight.</span>
            </h1>

            <p className="mt-7 max-w-md text-[17px] leading-snug text-paper-2 delay-3">
              Sixty-eight fictional companions — each with her own story,
              temperament, and pace. Choose the one you want to speak to.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-6 delay-4">
              <a
                href="#companions"
                className="group flex h-12 items-center gap-4 rounded-full bg-paper-1 pl-7 pr-2 text-[14px] font-semibold text-ink-1 transition-colors duration-200 hover:bg-[#f6efe3] focus-visible:outline-amber btn-press"
              >
                <span>Meet the companions</span>
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-1 text-amber transition-transform duration-300 ease-out group-hover:translate-y-0.5"
                >
                  <ArrowDown className="h-4 w-4" strokeWidth={1.75} />
                </span>
              </a>
              <span className="text-[11px] font-medium tracking-[0.2em] text-paper-3">
                18+ · FICTIONAL
              </span>
            </div>

            <p className="mt-9 text-[13px] text-paper-3 delay-5">Written, voiced, and waiting.</p>
          </div>

          {/* The emblem */}
          <div className="relative mx-auto flex flex-col items-center justify-center py-4 lg:justify-self-end delay-3">
            <WaxSealEmblem />
            <p className="rule-ornament mt-8 justify-center text-[10px] font-medium tracking-[0.3em] text-amber/75">
              <span className="whitespace-nowrap">ONE SEAL · ONE COMPANION</span>
            </p>
          </div>
        </div>

        {/* Names wall — a ticker of the sixty-eight */}
        <div className="relative z-10 border-t border-hairline bg-ink-0/70 py-4 animate-fade-rise delay-5" aria-hidden="true">
          <div className="overflow-hidden">
            <div className="animate-marquee flex w-max whitespace-nowrap">
              {[...names, ...names].map((name, i) => (
                <span key={i} className="mr-10 font-display-sm text-[15px] text-amber/45">
                  {name}
                  <span className="ml-10 text-paper-3/40">◆</span>
                </span>
              ))}
            </div>
          </div>
        </div>
        <span className="sr-only">Sixty-eight fictional companions</span>
      </section>

      {/* ── The companions ───────────────────────────────── */}
      <section id="companions" className="relative scroll-mt-8 px-6 pb-20 pt-16 md:px-10">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex flex-wrap items-end justify-between gap-6 animate-fade-rise">
            <div>
              <p className="flex items-center gap-2.5 text-[11px] font-medium tracking-[0.24em] text-amber">
                <span aria-hidden="true">◆</span> THE COMPANIONS
              </p>
              <h2 className="font-display mt-3 text-[clamp(2.1rem,4.6vw,3.3rem)] leading-[0.98] text-paper-1">
                Choose your
                <br />
                companion.
              </h2>
            </div>
            <p className="max-w-[250px] text-[13px] leading-snug text-paper-3">
              Real stories, written and voiced. Start with the one whose
              story catches you.
            </p>
          </div>

          {/* Search */}
          <div className="relative mt-9 max-w-xl animate-fade-rise-sm">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-paper-3"
              strokeWidth={1.5}
            />
            <input
              type="text"
              aria-label="Search by name or country"
              placeholder="Search by name or country"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 w-full rounded-full border border-hairline bg-ink-2 pl-11 pr-5 text-[15px] text-paper-1 placeholder:text-paper-3 focus:border-amber/50 focus:outline-none transition-colors duration-200"
            />
          </div>

          {/* Country filters — one scrollable row */}
          <div
            className="no-scrollbar -mx-6 mt-5 flex flex-nowrap gap-2 overflow-x-auto px-6 pb-1 md:-mx-10 md:px-10 animate-fade-rise-sm delay-1"
            role="group"
            aria-label="Filter by country"
          >
            <button
              onClick={() => setSelectedCountry(null)}
              aria-pressed={!selectedCountry}
              className={`h-9 flex-shrink-0 rounded-full border px-4 text-[12px] font-medium transition-colors duration-150 btn-press ${
                !selectedCountry
                  ? 'border-transparent bg-amber-soft text-amber'
                  : 'border-hairline bg-ink-2 text-paper-2 hover:border-hairline-strong hover:text-paper-1'
              }`}
            >
              All
            </button>
            {countries.map((country) => (
              <button
                key={country}
                onClick={() => setSelectedCountry(selectedCountry === country ? null : country)}
                aria-pressed={selectedCountry === country}
                className={`h-9 flex-shrink-0 rounded-full border px-4 text-[12px] transition-colors duration-150 btn-press ${
                  selectedCountry === country
                    ? 'border-transparent bg-amber-soft text-amber'
                    : 'border-hairline bg-ink-2 text-paper-2 hover:border-hairline-strong hover:text-paper-1'
                }`}
              >
                {country}
              </button>
            ))}
          </div>

          {isFiltering && (
            <p className="mt-5 text-[11px] tabular-nums tracking-wide text-paper-3 animate-fade-rise-sm delay-2" role="status">
              Showing {filtered.length} of {characters.length}
            </p>
          )}

          {/* Grid */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 stagger-enter">
            {filtered.map((character, idx) => (
              <button
                key={character.id}
                onClick={() => handleSelect(character)}
                className="group relative flex h-full flex-col rounded-2xl border border-hairline bg-ink-2 p-5 text-left card-lift"
                style={{ animationDelay: `${Math.min(idx, 11) * 40}ms` }}
              >
                <div className="flex w-full items-start justify-between">
                  <span className="font-display-sm text-[12px] tabular-nums text-amber/85">
                    {ORDER.get(character.id)}
                  </span>
                  {character.nsfwAllowed && (
                    <span className="rounded-md border border-hairline px-1.5 py-0.5 text-[10px] font-medium leading-none text-paper-3">
                      18+
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-4">
                  <WaxSeal initial={character.name[0]} size={48} />
                  <span className="min-w-0">
                    <span className="font-display block text-[22px] leading-none text-paper-1">
                      {character.name}
                    </span>
                    <span className="mt-1.5 block text-[12px] text-paper-3">
                      {character.age} · {character.country}
                    </span>
                  </span>
                </div>

                <p className="mt-4 line-clamp-2 min-h-[2.6em] text-[13px] leading-snug text-paper-2">
                  {character.backstory}
                </p>

                <div className="mt-auto w-full border-t border-hairline pt-3">
                  <div className="flex w-full items-center justify-between gap-3">
                    <span className="text-[11px] tabular-nums text-paper-3">
                      Romance {character.personality.romanticLevel} · Playful{' '}
                      {character.personality.playfulness} · Dirty talk {character.personality.dirtyTalk}
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-4 w-4 -translate-x-1 translate-y-1 text-amber opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="mt-16 text-center animate-fade-rise">
              <p className="font-display text-[24px] text-paper-2">Nothing answers to that name.</p>
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedCountry(null);
                }}
                className="mt-6 h-11 rounded-full border border-hairline bg-ink-2 px-6 text-[13px] font-medium text-paper-1 transition-colors duration-150 hover:border-hairline-strong hover:bg-ink-3 btn-press"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Colophon */}
      <footer className="border-t border-hairline px-6 py-6 md:px-10 animate-fade-rise-sm">
        <div className="mx-auto flex w-full max-w-[1500px] flex-wrap items-center justify-between gap-3 text-[11px] text-paper-3">
          <span>
            <span className="font-display text-[13px] text-paper-2">GirlfriendGPT</span>
            {'  '}— a private room for the midnight hour
          </span>
          <span>All companions are fictional · 18+</span>
        </div>
      </footer>
    </div>
  );
}