'use client';

import { useState } from 'react';
import { useChatStore } from '@/store/chatStore';
import { Loader2, SlidersHorizontal } from 'lucide-react';

export default function CharacterSidebar() {
  const {
    selectedCharacter,
    emotionState,
    nsfwMode,
    characterImageUrl,
    isGeneratingImage,
    setShowCustomize,
  } = useChatStore();
  const [imgError, setImgError] = useState(false);

  if (!selectedCharacter) return null;

  const app = selectedCharacter.appearance;
  const pers = selectedCharacter.personality;

  const seal = (size: number) => (
    <span
      aria-hidden="true"
      className="flex items-center justify-center rounded-full bg-seal text-[#f2e6da] shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.18),inset_0_-2px_3px_rgba(0,0,0,0.35)]"
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.4),
        fontFamily: 'var(--font-serif), Georgia, serif',
        lineHeight: 1,
      }}
    >
      {selectedCharacter.name[0]}
    </span>
  );

  return (
    <aside className="hidden w-[280px] flex-shrink-0 flex-col overflow-y-auto border-r border-hairline bg-ink-0 lg:flex">
      {/* Letterhead */}
      <div className="border-b border-hairline p-6 text-center">
        {isGeneratingImage ? (
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full border border-hairline bg-ink-2">
            <Loader2 aria-hidden="true" className="h-6 w-6 animate-spin text-paper-3" strokeWidth={1.5} />
          </div>
        ) : characterImageUrl && !imgError ? (
          <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full border border-hairline">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={characterImageUrl}
              alt={`Portrait of ${selectedCharacter.name}`}
              className="h-full w-full object-cover"
              onLoad={() => setImgError(false)}
              onError={() => setImgError(true)}
            />
          </div>
        ) : (
          <div className="mx-auto mb-4 flex justify-center">{seal(96)}</div>
        )}

        <h3 className="font-display mt-1 text-[23px] leading-tight text-paper-1">
          {selectedCharacter.name}
        </h3>
        <p className="mt-1 text-[12px] text-paper-3">
          {selectedCharacter.age} · {selectedCharacter.country}
          {selectedCharacter.region ? ` · ${selectedCharacter.region}` : ''}
        </p>

        <button
          onClick={() => setShowCustomize(true)}
          className="mt-4 flex h-9 w-full items-center justify-center gap-2 rounded-[10px] border border-hairline bg-ink-2 text-[13px] font-medium text-paper-2 transition-colors duration-150 hover:border-hairline-strong hover:text-paper-1"
        >
          <SlidersHorizontal aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
          Customize appearance
        </button>
      </div>

      {/* Appearance */}
      <section className="border-b border-hairline p-5">
        <h4 className="flex items-center gap-2 text-[11px] font-medium tracking-[0.08em] text-paper-3"><span aria-hidden="true" className="h-px w-4 bg-amber/50" />Appearance</h4>
        <dl className="mt-3 space-y-2 text-[13px]">
          {[
            ['Eyes', `${app.eyeColor} ${app.eyeShape}`],
            ['Hair', `${app.hairColor} ${app.hairStyle}`],
            ['Skin', app.skinTone],
            ['Height', app.height],
            ['Body', app.bodyType],
            ['Bust', app.bustSize],
            ['Waist', app.waistSize],
            ['Hips', app.hipSize],
            ['Ass', app.assSize],
          ].map(([label, value]) => (
            <div key={label as string} className="flex items-baseline justify-between gap-4">
              <dt className="flex-shrink-0 text-paper-3">{label}</dt>
              <dd className="text-right text-paper-1">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Personality */}
      <section className="border-b border-hairline p-5">
        <h4 className="flex items-center gap-2 text-[11px] font-medium tracking-[0.08em] text-paper-3"><span aria-hidden="true" className="h-px w-4 bg-amber/50" />Personality</h4>
        <ul className="mt-3 space-y-2">
          {Object.entries(pers)
            .filter(([key]) => !['interests', 'kinks'].includes(key))
            .map(([key, value]) => (
              <li key={key} className="flex items-center gap-3">
                <span className="w-24 flex-shrink-0 text-[11px] capitalize leading-tight text-paper-3">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span
                  aria-hidden="true"
                  className="h-[3px] flex-1 overflow-hidden rounded-full bg-ink-3"
                >
                  <span
                    className="block h-full rounded-full bg-paper-2/60"
                    style={{ width: `${(value as number) * 10}%` }}
                  />
                </span>
                <span className="w-5 text-right text-[11px] tabular-nums text-paper-2">
                  {value as number}
                </span>
              </li>
            ))}
        </ul>
      </section>

      {/* Interests */}
      <section className="border-b border-hairline p-5">
        <h4 className="flex items-center gap-2 text-[11px] font-medium tracking-[0.08em] text-paper-3"><span aria-hidden="true" className="h-px w-4 bg-amber/50" />Interests</h4>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {pers.interests.map((interest) => (
            <span
              key={interest}
              className="flex h-7 items-center rounded-md border border-hairline px-2.5 text-[11px] text-paper-2"
            >
              {interest}
            </span>
          ))}
        </div>
      </section>

      {/* 18+ traits — shown only when 18+ mode is on */}
      {nsfwMode && (
        <section className="border-b border-hairline p-5">
          <h4 className="flex items-center gap-2 text-[11px] font-medium tracking-[0.08em] text-paper-3"><span aria-hidden="true" className="h-px w-4 bg-amber/50" />18+ traits</h4>
          <dl className="mt-3 space-y-2 text-[13px]">
            {[
              ['Dirty talk', pers.dirtyTalk],
              ['Tease level', pers.teaseLevel],
              ['Dominance', pers.dominance],
              ['Submissiveness', pers.submissiveness],
            ].map(([label, value]) => (
              <div key={label as string} className="flex items-baseline justify-between gap-4">
                <dt className="text-paper-3">{label}</dt>
                <dd className="tabular-nums text-paper-1">{value}/10</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* Emotional state */}
      <section className="p-5">
        <h4 className="flex items-center gap-2 text-[11px] font-medium tracking-[0.08em] text-paper-3"><span aria-hidden="true" className="h-px w-4 bg-amber/50" />Emotional state</h4>
        <dl className="mt-3 space-y-2 text-[13px]">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-paper-3">Mood</dt>
            <dd className="capitalize text-paper-1">{emotionState.mood}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-paper-3">Affection</dt>
            <dd className="tabular-nums text-paper-1">{emotionState.affection}%</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-paper-3">Trust</dt>
            <dd className="tabular-nums text-paper-1">{emotionState.trust}%</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-paper-3">Current</dt>
            <dd className="capitalize text-paper-1">{emotionState.current}</dd>
          </div>
        </dl>
      </section>
    </aside>
  );
}
