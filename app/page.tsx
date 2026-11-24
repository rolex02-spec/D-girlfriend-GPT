/**
 * Girlfriend-GPT — landing page.
 *
 * Server component shell; interactivity is delegated to small client
 * islands (HeroScene canvas, ScrollFX, Faq). Data comes from the static
 * fictional catalog — no fake "real people" anywhere by construction.
 */
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Moon,
  MessagesSquare,
  Paintbrush,
  Lock,
  Pause,
  Flag,
  UserRound,
  Stethoscope,
  BookOpenCheck,
  Check,
  Star,
} from "lucide-react";
import HeroScene from "@/components/landing/HeroScene";
import ScrollFX from "@/components/landing/ScrollFX";
import Faq from "@/components/landing/Faq";
import CompanionAvatar from "@/components/avatar/CompanionAvatar";
import { COMPANIONS, COUNTRIES, LANGUAGES, ARCHETYPES } from "@/data/companions";

const featured = COMPANIONS.filter((c) => c.featured);
const tickerNames = COMPANIONS.map((c) => c.name.split(" ")[0]).join("  ·  ");

export default function HomePage() {
  return (
    <>
      <ScrollFX />

      {/* ───────────────────────── HERO ───────────────────────── */}
      <section className="relative flex min-h-[100svh] items-center overflow-hidden">
        {/* Candlelit atmosphere — CSS only (no photographic assets in this build) */}
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(60% 55% at 78% 30%, rgba(87,40,74,0.55) 0%, transparent 65%), radial-gradient(45% 45% at 18% 78%, rgba(216,162,74,0.14) 0%, transparent 70%), radial-gradient(90% 90% at 50% 120%, rgba(199,107,138,0.18) 0%, transparent 60%)",
          }}
        />
        <HeroScene />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pt-28 pb-24 sm:px-8 lg:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="max-w-2xl lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-rose/25 bg-rose/8 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-rose">
                <Moon size={12} aria-hidden="true" /> 18+ · Fictional AI companions
              </div>

              <h1 className="mt-6 font-display text-[clamp(2.6rem,7.2vw,4.6rem)] font-light leading-[1.02] tracking-tight text-cream">
                A companion for
                <br />
                <span className="text-aurora font-normal italic">the quiet hours.</span>
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-8 text-cream-dim">
                Girlfriend-GPT pairs you with warm, emotionally intelligent{" "}
                <strong className="text-cream">fictional</strong> AI companions — written
                personalities, not people. Eighty-two characters, thirty-four countries,
                fifty-eight languages, and one honest promise: never pretending to be human.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link href="/companions" className="btn-candle group inline-flex items-center gap-2 rounded-2xl px-7 py-4 text-base font-bold">
                  Meet your companions
                  <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </Link>
                <Link href="/create" className="btn-ghost inline-flex items-center gap-2 rounded-2xl px-7 py-4 text-base font-semibold text-cream">
                  <Paintbrush size={18} aria-hidden="true" /> Customise one
                </Link>
              </div>

              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-cream-dim">
                {[
                  "Adults 21–25, all fictional",
                  "Your data: export or erase, anytime",
                  "Pause · reset · leave, anytime",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-1.5">
                    <Check size={13} className="text-gold" aria-hidden="true" /> {t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Floating portrait trio — labelled fictional */}
            <div className="relative hidden h-[480px] lg:col-span-5 lg:block">
              {featured.slice(0, 3).map((c, i) => {
                const pos = [
                  "left-0 top-16 rotate-[-7deg] z-10",
                  "left-40 top-0 rotate-[3deg] z-20",
                  "left-64 top-44 rotate-[9deg] z-10",
                ][i];
                return (
                  <figure
                    key={c.id}
                    className={`animate-floaty absolute ${pos} w-44 xl:w-52`}
                    style={{ animationDelay: `${i * 1.4}s` }}
                  >
                    <div className="glass overflow-hidden rounded-2xl p-1.5">
                      {c.portrait ? (
                        <Image
                          src={c.portrait}
                          alt={`AI-generated illustration of ${c.name}, a fictional character`}
                          width={280}
                          height={340}
                          className="h-52 w-full rounded-xl object-cover xl:h-60"
                        />
                      ) : (
                        <CompanionAvatar {...c} className="h-52 w-full rounded-xl xl:h-60" />
                      )}
                      <figcaption className="px-1.5 pb-1.5 pt-2 text-center">
                        <span className="block text-sm font-semibold text-cream">{c.name.split(" ")[0]}, {c.age}</span>
                        <span className="block text-[10px] uppercase tracking-widest text-cream-dim/70">AI illustration · fiction</span>
                      </figcaption>
                    </div>
                  </figure>
                );
              })}
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute inset-x-0 bottom-5 z-10 flex justify-center">
          <div className="flex flex-col items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-cream-dim/70">
            <span>Scroll</span>
            <span className="h-8 w-px bg-gradient-to-b from-rose/70 to-transparent" />
          </div>
        </div>
      </section>

      {/* ─────────────────── COMPANION NAME TICKER ─────────────────── */}
      <div className="relative overflow-hidden border-y border-white/5 bg-ink-2/60 py-3" aria-hidden="true">
        <div className="animate-marquee flex w-max whitespace-nowrap font-display text-sm italic tracking-wide text-cream-dim/60">
          <span className="pr-8">{tickerNames}</span>
          <span className="pr-8">{tickerNames}</span>
        </div>
      </div>

      {/* ─────────────────── STATS STRIP ─────────────────── */}
      <section className="relative border-b border-white/5">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-white/5 px-5 sm:grid-cols-4 sm:px-8">
          {[
            [String(COMPANIONS.length), "fictional companions"],
            [`${COUNTRIES.length}`, "countries & cultures"],
            [`${LANGUAGES.length}`, "languages spoken"],
            [String(ARCHETYPES.length), "personality archetypes"],
          ].map(([n, label]) => (
            <div key={label} className="px-4 py-8 text-center sm:py-10">
              <div className="font-display text-3xl text-aurora sm:text-4xl">{n}</div>
              <div className="mt-1.5 text-[10px] uppercase tracking-[0.18em] text-cream-dim">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────── HOW IT WORKS ─────────────────── */}
      <section className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <p data-reveal className="text-[11px] font-semibold uppercase tracking-[0.25em] text-rose">How it works</p>
        <h2 data-reveal className="mt-3 max-w-2xl font-display text-4xl font-light leading-tight text-cream">
          Three steps between you and <em className="text-aurora">better company.</em>
        </h2>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            {
              n: "01",
              icon: MessagesSquare,
              title: "Browse, don't scroll",
              body: "Filter eighty-two fictional adults by country, language, age and personality. Every profile is a person-shaped story — backstory, voice, small human details — written to be respected, not fetishised.",
              cta: { label: "Open the catalog", href: "/companions" },
            },
            {
              n: "02",
              icon: Paintbrush,
              title: "Make them yours",
              body: "Or skip the shelf entirely: name them, choose skin tone, hair, eyes and build, set the vibe — then watch a labelled, fictional portrait come together before you ever say a word.",
              cta: { label: "Open the studio", href: "/create" },
            },
            {
              n: "03",
              icon: Moon,
              title: "Talk — on your terms",
              body: "Auto-detect your language or pin nothing and let mirroring do the work. Pause, reset, leave. A clearly labelled 18+ switch you control, with age confirmation first. Always.",
              cta: { label: "See how chat works", href: "/safety" },
            },
          ].map(({ n, icon: Icon, title, body, cta }) => (
            <div key={n} data-reveal className="glass group rounded-3xl p-6">
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-rose/25 to-wine/40 text-rose">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <span className="font-display text-3xl text-white/10 transition-colors duration-300 group-hover:text-rose/30">{n}</span>
              </div>
              <h3 className="mt-5 font-display text-2xl text-cream">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-cream-dim">{body}</p>
              <Link href={cta.href} className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-gold hover:text-cream">
                {cta.label} <ArrowRight size={12} aria-hidden="true" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────── FEATURED COMPANIONS ─────────────────── */}
      <section className="relative border-y border-white/5 bg-ink-2/40 py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p data-reveal className="text-[11px] font-semibold uppercase tracking-[0.25em] text-rose">Tonight&apos;s constellation</p>
              <h2 data-reveal className="mt-3 max-w-xl font-display text-4xl font-light leading-tight text-cream">Three lives, invented — <em className="text-aurora">warm anyway.</em></h2>
            </div>
            <Link href="/companions" className="btn-ghost inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-cream">
              All {COMPANIONS.length} companions <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((c) => (
              <Link
                key={c.id}
                href={`/companions/${c.id}`}
                data-reveal
                className="companion-card group relative overflow-hidden rounded-3xl border border-white/10 bg-ink-3"
                aria-label={`Meet ${c.name}, fictional companion, ${c.age}, ${c.country}`}
              >
                {c.portrait && (
                  <Image
                    src={c.portrait}
                    alt={`AI-generated illustration of ${c.name}, a fictional character`}
                    width={640}
                    height={560}
                    className="h-80 w-full object-cover object-top transition-transform duration-[1.2s] group-hover:scale-[1.04]"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h3 className="font-display text-2xl text-cream">{c.name}, {c.age}</h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-cream-dim">{c.city}, {c.country}</p>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-cream/80">{c.backstory}</p>
                  <p className="mt-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold/90">
                    <Sparkles size={11} aria-hidden="true" /> AI illustration · fictional character
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── LANGUAGES ─────────────────── */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <p data-reveal className="text-[11px] font-semibold uppercase tracking-[0.25em] text-rose">Speak your own tongue</p>
        <h2 data-reveal className="mt-3 font-display text-4xl font-light leading-tight text-cream">Write like you talk.<br /><span className="text-aurora">தமிழ் · తెలుగు · മലയാളം · हिंदी</span></h2>
        <p data-reveal className="mt-4 max-w-2xl text-sm leading-6 text-cream-dim">
          Set your companion to <strong className="text-cream">Auto</strong> and write whatever
          you actually speak — they&apos;ll mirror you. Honest caveat, printed because it matters:
          quality varies by language and by model, and we never claim fluency we can&apos;t back up.
        </p>
        <div data-reveal className="mt-8 flex max-w-4xl flex-wrap gap-2">
          {LANGUAGES.slice(0, 36).map((l) => (
            <span key={l} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-cream-dim transition-colors hover:border-rose/40 hover:text-cream">
              {l}
            </span>
          ))}
        </div>
      </section>

      {/* ─────────────────── PROMISE BAND + QUOTE ─────────────────── */}
      <section
        className="relative h-[420px] overflow-hidden border-y border-white/5"
        style={{
          background:
            "radial-gradient(70% 90% at 85% 20%, rgba(199,107,138,0.22) 0%, transparent 60%), radial-gradient(55% 75% at 10% 90%, rgba(216,162,74,0.14) 0%, transparent 65%), linear-gradient(160deg, #150c17 0%, #0e0810 55%, #1e1220 100%)",
        }}
        aria-hidden="false"
      >
        {/* Candle glow */}
        <div aria-hidden="true" className="absolute right-[14%] top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-gold/20 blur-3xl" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-5 sm:px-8">
          <blockquote className="max-w-lg">
            <p className="font-display text-3xl font-light leading-snug text-cream">
              &ldquo;Company for the nights the world goes quiet — honestly labelled, always optional, entirely yours.&rdquo;
            </p>
            <footer className="mt-5 text-xs uppercase tracking-[0.25em] text-gold">The Girlfriend-GPT promise</footer>
          </blockquote>
        </div>
      </section>

      {/* ─────────────────── HONESTY BY DESIGN ─────────────────── */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <p data-reveal className="text-[11px] font-semibold uppercase tracking-[0.25em] text-rose">Honest by design</p>
        <h2 data-reveal className="mt-3 max-w-2xl font-display text-4xl font-light leading-tight text-cream">What we <em className="text-aurora">won&apos;t</em> pretend.</h2>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            {
              icon: UserRound,
              title: "Not a real person",
              body: "Every companion is fiction — authored personality, generated illustration, no hidden human puppeteering. Ask them directly and they'll say so.",
            },
            {
              icon: Stethoscope,
              title: "Not a therapist",
              body: "Comfort, yes. Care plans, diagnosis, crisis coverage — no. If things get heavy, your companion will tell you to talk to a human professional, and mean it.",
            },
            {
              icon: BookOpenCheck,
              title: "Not omniscient",
              body: "Characters improvise. Their answers can be wrong, their memories of your life are chat-history deep, and factual questions deserve real sources.",
            },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} data-reveal className="rounded-3xl border border-white/8 bg-white/[0.02] p-6">
              <Icon size={22} className="text-gold" aria-hidden="true" />
              <h3 className="mt-4 font-display text-xl text-cream">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-cream-dim">{body}</p>
            </div>
          ))}
        </div>

        {/* Safety controls row */}
        <div data-reveal className="glass mt-8 grid gap-4 rounded-3xl p-6 sm:grid-cols-3">
          {[
            { icon: Pause, text: "Pause any thread — resume it days later exactly where you left off." },
            { icon: Flag, text: "Flag button in every chat routes to a human review queue." },
            { icon: Lock, text: "Export or permanently erase everything, from Settings → Privacy." },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-start gap-3 text-sm leading-6 text-cream-dim">
              <Icon size={17} className="mt-0.5 shrink-0 text-rose" aria-hidden="true" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────── FAQ ─────────────────── */}
      <section className="mx-auto max-w-4xl px-5 pb-20 sm:px-8">
        <p data-reveal className="text-center text-[11px] font-semibold uppercase tracking-[0.25em] text-rose">Fair questions</p>
        <h2 data-reveal className="mt-3 text-center font-display text-4xl font-light text-cream">Asked before I said <em className="text-aurora">it.</em></h2>
        <div data-reveal className="mt-10">
          <Faq />
        </div>
      </section>

      {/* ─────────────────── FINAL CTA ─────────────────── */}
      <section className="relative overflow-hidden border-t border-white/5 py-24 text-center">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(199,107,138,0.28),transparent)] blur-3xl" />
        <Star className="absolute left-[18%] top-16 hidden animate-pulse-soft text-rose/50 md:block" size={18} aria-hidden="true" />
        <Star className="absolute right-[20%] top-32 hidden animate-pulse-soft text-gold/60 md:block" size={13} style={{ animationDelay: "1.1s" }} aria-hidden="true" />
        <Heart className="absolute bottom-20 left-[24%] hidden text-rose/40 md:block" size={15} aria-hidden="true" />
        <div className="relative mx-auto max-w-2xl px-5">
          <h2 className="font-display text-[clamp(2.2rem,6vw,3.6rem)] font-light leading-[1.05] text-cream">
            Someone to talk to,<br /><span className="text-aurora italic">on your terms.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-cream-dim">
            No accounts. No pretending. No fine print you can&apos;t read. Just a fictional
            companion who&apos;s glad you opened the door.
          </p>
          <Link href="/companions" className="btn-candle mt-8 inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-base font-bold">
            Choose your companion <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <p className="mt-4 flex items-center justify-center gap-2 text-[11px] text-cream-dim/70">
            <ShieldCheck size={12} aria-hidden="true" /> Adults only · Fictional characters · Data export &amp; deletion anytime
          </p>
        </div>
      </section>
    </>
  );
}
