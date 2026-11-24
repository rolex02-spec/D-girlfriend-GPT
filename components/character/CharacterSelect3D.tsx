'use client';

import { useState, useEffect } from 'react';
import { Search, ArrowDown, ArrowUpRight, Loader2, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/store/chatStore';
import { characters } from '@/lib/characters/database';
import { CharacterConfig } from '@/lib/types';
import CharacterAvatar3D from '../ui/CharacterAvatar3D';

const ORDER = new Map(characters.map((c, i) => [c.id, String(i + 1).padStart(2, '0')]));

// 3D Card component for each character
function CharacterCard3D({ 
  character, 
  index 
}: { 
  character: CharacterConfig; 
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const { setSelectedCharacter, setShowCharacterSelect } = useChatStore();
  const { selectedCharacter } = useChatStore();
  const isSelected = selectedCharacter?.id === character.id;
  
  return (
    <motion.button
      onClick={() => {
        setSelectedCharacter(character);
        setShowCharacterSelect(false);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ 
        scale: 1.02,
        rotateY: isHovered ? 5 : 0,
        transition: { duration: 0.3 }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="relative group w-full rounded-2xl border border-hairline bg-ink-2 p-5 text-left overflow-hidden card-3d-hover"
    >
      {/* Gradient overlay when selected/hovered */}
      <AnimatePresence>
        {(isSelected || isHovered) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-amber/20 via-transparent to-amber/10"
          />
        )}
      </AnimatePresence>
      
      <div className="relative z-10 flex w-full items-start justify-between">
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
        {/* 3D Avatar */}
        <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-hairline shadow-lg">
          <CharacterAvatar3D 
            character={character} 
            className="h-full w-full"
            interactive={false}
          />
        </div>
        
        <span className="min-w-0 flex-1">
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
      
      {/* Hover glow effect */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.05 }}
            exit={{ opacity: 0 }}
            className="absolute -inset-px rounded-2xl"
            style={{
              background: 'linear-gradient(45deg, transparent, rgba(217, 160, 90, 0.1), transparent)'
            }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export default function CharacterSelect3D() {
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

  const isFiltering = search.trim() !== '' || selectedCountry !== null;
  const names = characters.map((c) => c.name);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-ink-1">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 30%, rgba(217, 160, 90, 0.05) 0%, transparent 70%)' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-clip bg-ink-1 text-paper-1">
      {/* Animated background particles */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-amber/5"
              style={{
                width: Math.random() * 4 + 2 + 'px',
                height: Math.random() * 4 + 2 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
              }}
              animate={{
                opacity: [0, 0.5, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>
      </div>

      {/* Bar over the fold */}
      <header className="absolute inset-x-0 top-0 z-20 flex h-16 items-center justify-between px-6 md:px-10 animate-fade-rise">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-seal text-seal-text shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.22),inset_0_-2px_4px_rgba(0,0,0,0.4)]">
            <Star className="h-5 w-5" strokeWidth={1.5} />
          </span>
          <span className="text-[15px] font-medium tracking-[0.02em] text-paper-1">GirlfriendGPT</span>
        </a>
        <span className="text-[11px] font-medium tabular-nums tracking-[0.18em] text-paper-3">
          {characters.length} COMPANIONS
        </span>
      </header>

      {/* Hero Section with 3D background */}
      <section id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden">
        {/* 3D Particle background */}
        <div className="absolute inset-0 -z-10">
          <div className="relative h-full w-full">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-amber/10"
                style={{
                  width: Math.random() * 3 + 1 + 'px',
                  height: Math.random() * 3 + 1 + 'px',
                  left: Math.random() * 100 + '%',
                  top: Math.random() * 100 + '%',
                }}
                animate={{
                    y: [0, -20, 0],
                    opacity: [0, 0.3, 0],
                  }}
                transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
              />
            ))}
          </div>
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
              <span className="text-amber bg-amber/10 px-2 py-1 rounded-md">after midnight.</span>
            </h1>

            <p className="mt-7 max-w-md text-[17px] leading-snug text-paper-2 delay-3">
              Sixty-eight fictional companions — each with her own story,
              temperament, and pace. Choose the one you want to speak to.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-6 delay-4">
              <motion.a
                href="#companions"
                className="group flex h-12 items-center gap-4 rounded-full bg-paper-1 pl-7 pr-2 text-[14px] font-semibold text-ink-1 transition-colors duration-200 hover:bg-[#f6efe3] focus-visible:outline-amber btn-press"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Meet the companions</span>
                <motion.span
                  aria-hidden="true"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-1 text-amber transition-transform duration-300 ease-out group-hover:translate-y-0.5"
                  whileHover={{ y: [0, -2, 0] }}
                >
                  <ArrowDown className="h-4 w-4" strokeWidth={1.75} />
                </motion.span>
              </motion.a>
              <span className="text-[11px] font-medium tracking-[0.2em] text-paper-3">
                18+ · FICTIONAL
              </span>
            </div>

            <p className="mt-9 text-[13px] text-paper-3 delay-5">Written, voiced, and waiting.</p>
          </div>

          {/* The emblem with 3D effect */}
          <div className="relative mx-auto flex flex-col items-center justify-center py-4 lg:justify-self-end delay-3">
            <div className="relative h-32 w-32">
              <motion.div 
                className="absolute inset-0 rounded-full bg-gradient-to-br from-amber/30 to-seal"
                animate={{ 
                  boxShadow: [
                    '0 0 20px rgba(217, 160, 90, 0.3)',
                    '0 0 40px rgba(217, 160, 90, 0.6)',
                    '0 0 20px rgba(217, 160, 90, 0.3)',
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <div className="flex h-full w-full items-center justify-center rounded-full bg-seal text-seal-text text-3xl font-bold">
                G
              </div>
            </div>
            <p className="rule-ornament mt-8 justify-center text-[10px] font-medium tracking-[0.3em] text-amber/75">
              <span className="whitespace-nowrap">ONE SEAL · ONE COMPANION</span>
            </p>
          </div>
        </div>

        {/* Names wall */}
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

      {/* The companions */}
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

          {/* Country filters */}
          <div
            className="no-scrollbar -mx-6 mt-5 flex flex-nowrap gap-2 overflow-x-auto px-6 pb-1 md:-mx-10 md:px-10 animate-fade-rise-sm delay-1"
            role="group"
            aria-label="Filter by country"
          >
            <motion.button
              onClick={() => setSelectedCountry(null)}
              aria-pressed={!selectedCountry}
              className="h-9 flex-shrink-0 rounded-full border px-4 text-[12px] font-medium transition-colors duration-150 btn-press"
              whileTap={{ scale: 0.95 }}
            >
              All
            </motion.button>
            {countries.map((country) => (
              <motion.button
                key={country}
                onClick={() => setSelectedCountry(selectedCountry === country ? null : country)}
                aria-pressed={selectedCountry === country}
                className="h-9 flex-shrink-0 rounded-full border px-4 text-[12px] transition-colors duration-150 btn-press"
                whileTap={{ scale: 0.95 }}
              >
                {country}
              </motion.button>
            ))}
          </div>

          {isFiltering && (
            <p className="mt-5 text-[11px] tabular-nums tracking-wide text-paper-3 animate-fade-rise-sm delay-2" role="status">
              Showing {filtered.length} of {characters.length}
            </p>
          )}

          {/* Grid with 3D cards */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 stagger-enter">
            <AnimatePresence>
              {filtered.map((character, idx) => (
                <CharacterCard3D key={character.id} character={character} index={idx} />
              ))}
            </AnimatePresence>
          </div>

          {filtered.length === 0 && (
            <motion.div className="mt-16 text-center animate-fade-rise">
              <p className="font-display text-[24px] text-paper-2">Nothing answers to that name.</p>
              <motion.button
                onClick={() => {
                  setSearch('');
                  setSelectedCountry(null);
                }}
                className="mt-6 h-11 rounded-full border border-hairline bg-ink-2 px-6 text-[13px] font-medium text-paper-1 transition-colors duration-150 hover:border-hairline-strong hover:bg-ink-3 btn-press"
                whileTap={{ scale: 0.95 }}
              >
                Clear filters
              </motion.button>
            </motion.div>
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