/**
 * CompanionProfile — full profile body for one companion.
 *
 * Client component so custom companions (Customise Studio, stored in
 * localStorage) resolve after mount, while built-ins render immediately
 * from the static catalog during SSR — no hydration mismatch either way.
 */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, ArrowLeft, MapPin, Cake, Sparkles, Quote,
  MessageCircle, ShieldCheck, Heart, Globe, AlertTriangle, Loader2,
} from "lucide-react";
import CompanionAvatar from "@/components/avatar/CompanionAvatar";
import CompanionCard from "@/components/companions/CompanionCard";
import StartConversationButton from "@/components/companions/StartConversationButton";
import { COMPANIONS, getCompanion, type Companion } from "@/data/companions";

export default function CompanionProfile({ id }: { id: string }) {
  const isCustom = id.startsWith("custom-");

  // Built-ins: pure static data, safe to resolve during SSR and hydration.
  const builtin = isCustom ? null : (COMPANIONS.find((c) => c.id === id) ?? null);
  // Customs: localStorage only exists in the browser — resolve after mount.
  const [custom, setCustom] = useState<Companion | null>(null);
  const [checked, setChecked] = useState(!isCustom);

  useEffect(() => {
    if (!isCustom || checked) return;
    setCustom(getCompanion(id) ?? null);
    setChecked(true);
  }, [id, isCustom, checked]);

  const c = isCustom ? custom : builtin;

  if (!c && isCustom && !checked) {
    return (
      <div className="grid min-h-[60vh] place-items-center pt-24 text-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={24} className="animate-spin text-rose" aria-hidden="true" />
          <p className="text-sm text-cream-dim">Opening the dossier…</p>
        </div>
      </div>
    );
  }

  if (!c) {
    return (
      <div className="grid min-h-[60vh] place-items-center px-6 pt-24 text-center">
        <div>
          <AlertTriangle className="mx-auto text-gold" size={30} aria-hidden="true" />
          <h1 className="mt-4 font-display text-2xl text-cream">This profile is gone.</h1>
          <p className="mt-2 text-sm text-cream-dim">
            We couldn&apos;t find that companion — she may have been removed from this browser.
          </p>
          <Link href="/companions" className="btn-candle mt-6 inline-block rounded-2xl px-6 py-3 text-sm font-bold">
            Back to companions
          </Link>
        </div>
      </div>
    );
  }

  const related = COMPANIONS.filter(
    (o) => o.id !== c.id && (o.archetype === c.archetype || o.languages.some((l) => c.languages.includes(l)))
  ).slice(0, 3);

  const firstName = c.name.split(" ")[0];

  return (
    <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-8">
      <Link href="/companions" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-cream-dim transition-colors hover:text-cream">
        <ArrowLeft size={13} aria-hidden="true" /> Back to the constellation
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-12">
        {/* ── Portrait column ── */}
        <div className="lg:col-span-5">
          <div className="glass sticky top-24 overflow-hidden rounded-[2rem] p-2">
            <div className="relative overflow-hidden rounded-[1.6rem]">
              <div className="relative h-[480px] w-full sm:h-[560px]">
                {c.portrait ? (
                  c.portrait.startsWith("data:") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={c.portrait}
                      alt={`AI-generated illustration of ${c.name}, a fictional character`}
                      className="absolute inset-0 h-full w-full object-cover object-top"
                    />
                  ) : (
                    <Image
                      src={c.portrait}
                      alt={`AI-generated illustration of ${c.name}, a fictional character`}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      className="object-cover object-top"
                    />
                  )
                ) : (
                  <CompanionAvatar
                    name={c.name}
                    skin={c.skin}
                    hair={c.hair}
                    hairStyle={c.hairStyle}
                    hue={c.hue}
                    rounded={false}
                  />
                )}
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-black/50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-gold backdrop-blur-sm">
                  <Sparkles size={10} aria-hidden="true" /> AI illustration · fictional
                </span>
                <h1 className="mt-3 font-display text-4xl leading-none text-cream">{c.name}</h1>
                <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-cream-dim">
                  <span className="inline-flex items-center gap-1.5"><Cake size={12} aria-hidden="true" /> {c.age} years — adult</span>
                  <span className="inline-flex items-center gap-1.5"><MapPin size={12} aria-hidden="true" /> {c.city}{c.country ? `, ${c.country}` : ""}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Details column ── */}
        <div className="lg:col-span-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-rose">{c.archetype}</p>
          <blockquote className="mt-4 flex gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-5">
            <Quote size={18} className="mt-1 shrink-0 text-gold/70" aria-hidden="true" />
            <p className="font-display text-lg italic leading-7 text-cream/90">&ldquo;{c.greeting}&rdquo;</p>
          </blockquote>

          <section className="mt-6" aria-labelledby="backstory-heading">
            <h2 id="backstory-heading" className="text-[11px] font-semibold uppercase tracking-[0.25em] text-cream-dim">Her story (invented, with love)</h2>
            <p className="mt-2 max-w-2xl text-[15px] leading-7 text-cream/90">{c.backstory}</p>
          </section>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="glass-soft rounded-2xl p-5">
              <h3 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-cream-dim"><Globe size={12} aria-hidden="true" /> Languages</h3>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {c.languages.map((l) => (
                  <span key={l} className="rounded-lg border border-rose/20 bg-rose/5 px-2.5 py-1 text-xs text-rose/90">{l}</span>
                ))}
              </div>
              <p className="mt-3 text-[10px] leading-4 text-cream-dim/80">Set Auto in chat to have her mirror your language. Quality varies; we never claim false fluency.</p>
            </div>

            <div className="glass-soft rounded-2xl p-5">
              <h3 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-cream-dim"><MessageCircle size={12} aria-hidden="true" /> How she talks</h3>
              <p className="mt-3 text-sm leading-6 text-cream/85">{c.style}</p>
            </div>
          </div>

          <div className="glass-soft mt-4 rounded-2xl p-5">
            <h3 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-cream-dim"><Heart size={12} aria-hidden="true" /> What lights her up</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {c.interests.map((i) => (
                <span key={i} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-cream/85">{i}</span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 border-t border-white/5 pt-6">
            <StartConversationButton companionId={c.id} companionFirstName={firstName} />
            <p className="mt-4 flex items-start gap-2 text-[10px] leading-4 text-cream-dim/75">
              <ShieldCheck size={12} className="mt-0.5 shrink-0 text-gold/80" aria-hidden="true" />
              {firstName} is a fictional AI character, not a real person. Conversations are saved in
              this browser&apos;s local storage until you export or delete them in Settings → Privacy.
              Adult mode is optional, always labelled, and always requires age confirmation.
            </p>
          </div>
        </div>
      </div>

      {/* ── Related ── */}
      {related.length > 0 && (
        <section className="mt-16" aria-labelledby="related-heading">
          <div className="flex items-center justify-between gap-4">
            <h2 id="related-heading" className="font-display text-2xl text-cream">Kindred spirits</h2>
            <Link href="/companions" className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-rose hover:text-cream">
              Browse all <ArrowRight size={12} aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {related.map((r) => <CompanionCard key={r.id} c={r} />)}
          </div>
        </section>
      )}
    </div>
  );
}
