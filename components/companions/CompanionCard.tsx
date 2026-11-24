/**
 * CompanionCard — catalog tile. The whole tile is a link to the profile.
 * Every portrait is an illustration (SVG or AI-generated); captions say so.
 */
import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import CompanionAvatar from "@/components/avatar/CompanionAvatar";
import type { Companion } from "@/data/companions";

export default function CompanionCard({ c }: { c: Companion }) {
  return (
    <Link
      href={`/companions/${c.id}`}
      className="companion-card group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-ink-3 focus-visible:outline-rose"
      aria-label={`Meet ${c.name}, fictional companion, ${c.age} years old, ${c.city}, ${c.country}`}
    >
      <div className="relative h-56 overflow-hidden">
        {c.portrait ? (
          c.portrait.startsWith("data:") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={c.portrait}
              alt={`AI-generated illustration of ${c.name}, a fictional character`}
              className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-[1.1s] group-hover:scale-105"
            />
          ) : (
            <Image
              src={c.portrait}
              alt={`AI-generated illustration of ${c.name}, a fictional character`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover object-top transition-transform duration-[1.1s] group-hover:scale-105"
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
            className="transition-transform duration-[1.1s] group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-3 via-ink-3/20 to-transparent" />
        <span className="absolute right-3 top-3 rounded-full border border-white/15 bg-black/45 px-2.5 py-1 text-[10px] font-bold tracking-widest text-cream/90 backdrop-blur-sm">
          18+ · {c.age}
        </span>
        {c.featured && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-gold/40 bg-black/45 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-gold backdrop-blur-sm">
            <Sparkles size={10} aria-hidden="true" /> Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-xl leading-tight text-cream">{c.name}</h3>
        <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-cream-dim">
          {c.city}{c.country ? `, ${c.country}` : ""}
        </p>
        <p className="mt-2 line-clamp-1 text-[11px] italic text-gold/85">{c.archetype}</p>

        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {c.languages.slice(0, 3).map((l) => (
            <span key={l} className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-cream-dim">
              {l}
            </span>
          ))}
        </div>

        <p className="mt-2.5 line-clamp-2 text-xs leading-5 text-cream-dim/90">{c.interests.slice(0, 3).join(" · ")}</p>

        <span className="mt-auto pt-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-rose/80 transition-colors group-hover:text-rose">
          Meet {c.name.split(" ")[0]} →
        </span>
      </div>
    </Link>
  );
}
