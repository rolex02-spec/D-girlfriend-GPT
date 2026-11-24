'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Star, Globe, ChevronDown, Cake } from 'lucide-react';

// Human-readable language names for the small "speaks" chip on each card —
// kept in sync with the labels used by the chat header and the landing demo.
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

// The full allowed age band — every companion on the roster sits inside it
const AGE_OPTIONS = [19, 20, 21, 22, 23, 24, 25, 26, 27];
import { useChatStore } from '@/store/chatStore';
import { characters } from '@/lib/characters/database';
import { CharacterConfig } from '@/lib/types';
import AvatarFallback from '@/components/ui/CharacterAvatarFallback';

const ORDER = new Map(characters.map((c, i) => [c.id, String(i + 1).padStart(2, '0')]));

function CharacterCard({ character, index, onSelect }: { character: CharacterConfig; index: number; onSelect: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const { selectedCharacter } = useChatStore();
  const isSelected = selectedCharacter?.id === character.id;

  return (
    <motion.button
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02, rotateY: isHovered ? 3 : 0, transition: { duration: 0.25 } }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative group w-full rounded-2xl border border-hairline bg-ink-2 p-5 text-left overflow-hidden card-3d"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isSelected || isHovered ? 0.12 : 0 }}
        className="absolute inset-0 bg-gradient-to-br from-amber/20 via-transparent to-amber/10"
      />

      <div className="relative z-10 flex w-full items-start justify-between">
        <span className="font-display-sm text-[12px] tabular-nums text-amber/85">{ORDER.get(character.id)}</span>
        {character.nsfwAllowed && (
          <span className="rounded-md border border-hairline px-1.5 py-0.5 text-[10px] font-medium leading-none text-paper-3">18+</span>
        )}
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border-2 border-hairline shadow-lg">
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
        </div>
        <span className="min-w-0 flex-1">
          <span className="font-display block text-[22px] leading-none text-paper-1 truncate">{character.name}</span>
          <span className="mt-1.5 block text-[12px] text-paper-3 truncate">
            {character.age} · {character.country} · <span className="text-amber/80">{LANG_LABELS[character.language] || character.language}</span>
          </span>
        </span>
      </div>

      <p className="mt-4 line-clamp-2 min-h-[2.6em] text-[13px] leading-snug text-paper-2">{character.backstory}</p>

      <div className="mt-auto w-full border-t border-hairline pt-3">
        <div className="flex w-full items-center justify-between gap-3">
          <span className="text-[11px] tabular-nums text-paper-3">
            Romance {character.personality.romanticLevel} · Playful {character.personality.playfulness} · Dirty {character.personality.dirtyTalk}
          </span>
          <motion.span
            className="flex h-6 w-6 items-center justify-center rounded-full bg-ink-1 text-amber opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-[-2px]"
            whileHover={{ scale: 1.1 }}
          >
            <Star className="h-3.5 w-3.5" strokeWidth={1.75} />
          </motion.span>
        </div>
      </div>

      {isSelected && (
        <motion.div className="absolute inset-0 border-2 border-amber/50 rounded-2xl pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
      )}
    </motion.button>
  );
}

export default function CharacterSelectModal() {
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  // Age band filter: null = all ages, otherwise an exact age from 19–27
  const [selectedAge, setSelectedAge] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const { setSelectedCharacter, setShowCharacterSelect } = useChatStore();

  useEffect(() => { setMounted(true); }, []);

  const countries = [...new Set(characters.map((c) => c.country))].sort();

  const filtered = characters.filter((c) => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q);
    const matchesCountry = !selectedCountry || c.country === selectedCountry;
    const matchesAge = selectedAge === null || c.age === selectedAge;
    return matchesSearch && matchesCountry && matchesAge;
  });

  const names = characters.map((c) => c.name);

  if (!mounted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-0/95 backdrop-blur-sm">
        <div className="animate-pulse-soft h-12 w-12 rounded-full border-4 border-amber/30 border-t-transparent" />
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-ink-0/95 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-hairline bg-ink-1 shadow-float"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-seal text-seal-text shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.22),inset_0_-2px_4px_rgba(0,0,0,0.4)]">
                <Star className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <span className="font-display text-h6 text-paper-1">Choose Companion</span>
            </div>
            <motion.button
              onClick={() => setShowCharacterSelect(false)}
              className="p-2 rounded-xl text-paper-3 hover:text-paper-1 hover:bg-ink-3 transition-colors btn-press"
              whileTap={{ scale: 0.9 }}
              aria-label="Close"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </motion.button>
          </div>

          {/* Search */}
          <div className="relative px-6 py-4 border-b border-hairline">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-paper-3" strokeWidth={1.5} />
            <input
              type="text"
              aria-label="Search by name or country"
              placeholder="Search by name or country"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 w-full rounded-full border border-hairline bg-ink-2 pl-11 pr-5 text-[15px] text-paper-1 placeholder:text-paper-3 focus:border-amber/50 focus:outline-none transition-colors"
            />
          </div>

          {/* Country Filters */}
          <div className="no-scrollbar -mx-6 flex flex-nowrap gap-2 overflow-x-auto px-6 pb-2 border-b border-hairline" role="group" aria-label="Filter by country">
            <motion.button
              onClick={() => setSelectedCountry(null)}
              aria-pressed={!selectedCountry}
              className="h-9 flex-shrink-0 rounded-full border px-4 text-[12px] font-medium transition-colors btn-press"
              whileTap={{ scale: 0.95 }}
            >
              All
            </motion.button>
            {countries.map((country) => (
              <motion.button
                key={country}
                onClick={() => setSelectedCountry(selectedCountry === country ? null : country)}
                aria-pressed={selectedCountry === country}
                className="h-9 flex-shrink-0 rounded-full border px-4 text-[12px] transition-colors btn-press"
                whileTap={{ scale: 0.95 }}
              >
                <Globe className="h-3.5 w-3.5 mr-1.5" strokeWidth={1.5} />
                {country}
              </motion.button>
            ))}
          </div>

          {/* Age band — 19 to 27, the full roster range (chip row, scrollable) */}
          <div className="no-scrollbar -mx-6 flex flex-nowrap gap-2 overflow-x-auto px-6 py-3 border-b border-hairline" role="group" aria-label="Filter by age">
            <span className="flex flex-shrink-0 items-center gap-1.5 pr-1 text-[11px] font-medium uppercase tracking-wider text-paper-3">
              <Cake className="h-3.5 w-3.5" strokeWidth={1.5} /> Age
            </span>
            <motion.button
              onClick={() => setSelectedAge(null)}
              aria-pressed={selectedAge === null}
              className="h-8 flex-shrink-0 rounded-full border px-3.5 text-[12px] transition-colors btn-press"
              whileTap={{ scale: 0.95 }}
            >
              All
            </motion.button>
            {AGE_OPTIONS.map((age) => (
              <motion.button
                key={age}
                onClick={() => setSelectedAge(selectedAge === age ? null : age)}
                aria-pressed={selectedAge === age}
                className={`h-8 flex-shrink-0 rounded-full border px-3.5 text-[12px] tabular-nums transition-colors btn-press ${
                  selectedAge === age ? 'border-amber/60 bg-amber/15 text-amber' : 'border-hairline text-paper-2'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {age}
              </motion.button>
            ))}
          </div>

          {/* Live result count — always visible so the grid never feels broken */}
          <p className="mx-6 mt-3 text-[11px] tabular-nums tracking-wide text-paper-3" role="status">
            Showing {filtered.length} of {characters.length} companions
            {selectedAge !== null && ` · age ${selectedAge}`}
            {selectedCountry && ` · ${selectedCountry}`}
          </p>

          {/* Grid */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 stagger-enter">
              <AnimatePresence>
                {filtered.map((character, idx) => (
                  <CharacterCard key={character.id} character={character} index={idx} onSelect={() => { setSelectedCharacter(character); setShowCharacterSelect(false); }} />
                ))}
              </AnimatePresence>
            </div>

            {filtered.length === 0 && (
              <motion.div className="mt-16 text-center animate-fade-rise">
                <p className="font-display text-[24px] text-paper-2">Nothing answers to that name.</p>
                <motion.button
                  onClick={() => { setSearch(''); setSelectedCountry(null); setSelectedAge(null); }}
                  className="mt-6 h-11 rounded-full border border-hairline bg-ink-2 px-6 text-[13px] font-medium text-paper-1 transition-colors btn-press"
                  whileTap={{ scale: 0.95 }}
                >
                  Clear filters
                </motion.button>
              </motion.div>
            )}
          </div>

          {/* Names Marquee */}
          <div className="border-t border-hairline bg-ink-0/70 py-3 px-6" aria-hidden="true">
            <div className="overflow-hidden">
              <div className="animate-marquee flex w-max whitespace-nowrap">
                {[...names, ...names].map((name, i) => (
                  <span key={i} className="mr-10 font-display-sm text-[14px] text-amber/45">{name}<span className="ml-10 text-paper-3/40">◆</span></span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}