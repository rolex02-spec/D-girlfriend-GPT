/**
 * /safety — content policy, honesty commitments, crisis guidance.
 * Anchors: #report  ·  #honesty  ·  #adult-mode
 */
import type { Metadata } from "next";
import Link from "next/link";
import {
  Flag, ShieldCheck, HeartHandshake, Flame, BookOpenCheck, ArrowRight,
  LifeBuoy, Pause, RotateCcw, LogOut, EyeOff,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Safety & content policy",
  description: "How Girlfriend-GPT keeps adults safe: consent-first adult mode, hard limits, report tools, honesty about AI and RAG, crisis guidance, and what we will never generate.",
};

export default function SafetyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 pb-20 pt-24 sm:px-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-rose">Safety &amp; policy</p>
      <h1 className="mt-3 font-display text-4xl font-light leading-[1.05] text-cream sm:text-5xl">Warm is good.<br /><span className="text-aurora">Safe is mandatory.</span></h1>

      {/* Hard limits */}
      <section className="glass mt-8 rounded-3xl border-rose/25 p-6 sm:p-7" aria-labelledby="limits-heading">
        <h2 id="limits-heading" className="flex items-center gap-2 font-display text-2xl text-cream"><ShieldCheck size={20} className="text-rose" aria-hidden="true" /> Hard limits — never crossed</h2>
        <ul className="mt-4 grid gap-3 text-[13px] leading-6 text-cream-dim sm:grid-cols-2">
          {[
            "No character is ever under 18 — every companion and custom character is an adult (21–25).",
            "No sexual content involving minors, or minors in any romanticized scenario. Ever.",
            "No coercion, non-consent, blackmail, or 'persuasion' framing. Consent is the scene, not a detail.",
            "No real people — living, dead, or 'inspired by'. All characters are invented fiction.",
            "No incest dynamics. Not as edge cases, not as jokes, not as anything.",
            "No medical, legal, financial or crisis advice presented as professional fact.",
          ].map((t) => (
            <li key={t} className="flex items-start gap-2 rounded-2xl bg-white/[0.03] p-3">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose" aria-hidden="true" />
              {t}
            </li>
          ))}
        </ul>
      </section>

      {/* Adult mode */}
      <section id="adult-mode" className="glass-soft mt-6 scroll-mt-28 rounded-3xl p-6 sm:p-7" aria-labelledby="adult-heading">
        <h2 id="adult-heading" className="flex items-center gap-2 font-display text-2xl text-cream"><Flame size={20} className="text-gold" aria-hidden="true" /> Adult roleplay mode, precisely</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-[13px] leading-6 text-cream-dim">
          <li><strong className="text-cream">Eligibility:</strong> you confirm 18+ in the gate and again in the toggle. That is age confirmation, not legal identity verification — providers in regulated jurisdictions must add verified checks before paid adult features.</li>
          <li><strong className="text-cream">Cast:</strong> fictional adults only — you, and a character you chose. Consent is mutual, in-fiction, and can be withdrawn by simply stopping; the companion treats &ldquo;no&rdquo; (and its cousins) as a hard stop.</li>
          <li><strong className="text-cream">Ceiling:</strong> provider-connected replies remain bound by that provider&apos;s usage policies. When a boundary is reached, the scene fades to black or redirects — by design, not malfunction.</li>
          <li><strong className="text-cream">Control:</strong> pause, reset, leave and report are one tap away in every chat, forever.</li>
        </ol>
      </section>

      {/* Honesty */}
      <section id="honesty" className="scroll-mt-28">
        <div className="glass-soft mt-6 rounded-3xl p-6 sm:p-7">
          <h2 className="flex items-center gap-2 font-display text-2xl text-cream"><BookOpenCheck size={20} className="text-emerald-400" aria-hidden="true" /> Honesty commitments</h2>
          <ul className="mt-4 space-y-2 text-[13px] leading-6 text-cream-dim">
            <li>· Companions are AI characters. Ask directly and they will tell you so.</li>
            <li>· We do <strong className="text-cream">not</strong> claim retrieval-augmented generation eliminates hallucinations. This build grounds characters on their own fictional dossiers — nothing more — and the model is instructed to say &ldquo;I don&apos;t know&rdquo; rather than improvise facts.</li>
            <li>· Any future factual lookup (e.g. showtimes, bus routes) will be labelled as retrieved fact, separated from roleplay — never blended silently.</li>
            <li>· Portraits are illustrations or AI-generated artwork of fictional characters, labelled as such — never presented as photographs, never based on real people.</li>
            <li>· If the AI provider is unreachable, the interface says so plainly instead of pretending — we never simulate a connected model.</li>
          </ul>
        </div>
      </section>

      {/* Pause / reset / leave */}
      <section className="mt-6 grid gap-3 sm:grid-cols-3" aria-label="Your controls">
        {[
          { icon: Pause, t: "Pause", d: "Freeze the thread. Resume tonight, next week, never — no countdown, no guilt copy." },
          { icon: RotateCcw, t: "Reset", d: "Wipe every message, keep the companion. Fresh first night, instantly." },
          { icon: LogOut, t: "Leave", d: "Step away. Your thread waits under this browser until you choose to erase it." },
        ].map(({ icon: Icon, t, d }) => (
          <div key={t} className="glass-soft rounded-2xl p-5 text-center">
            <Icon size={18} className="mx-auto text-gold" aria-hidden="true" />
            <h3 className="mt-2 font-display text-lg text-cream">{t}</h3>
            <p className="mt-1 text-[11px] leading-5 text-cream-dim">{d}</p>
          </div>
        ))}
      </section>

      {/* Report */}
      <section id="report" className="glass-soft mt-6 scroll-mt-28 rounded-3xl p-6 sm:p-7" aria-labelledby="report-heading">
        <h2 id="report-heading" className="flex items-center gap-2 font-display text-2xl text-cream"><Flag size={20} className="text-rose" aria-hidden="true" /> Reporting a problem</h2>
        <p className="mt-2 max-w-2xl text-[13px] leading-6 text-cream-dim">
          The flag button lives in every chat header, always. Reports land in a review queue
          with your anonymous session id attached — enough to investigate, not enough to know you.
          Typical turnarounds aren&apos;t promised falsely; genuine safety issues preempt everything else.
        </p>
        <p className="mt-3 flex items-start gap-2 text-[12px] leading-6 text-gold/90">
          <LifeBuoy size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
          A report is not an emergency channel. If anyone — including you — may be in immediate
          danger, contact your local emergency services first, then flag us.
        </p>
        <Link href="/companions" className="btn-candle mt-5 inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold">Go keep company <ArrowRight size={15} aria-hidden="true" /></Link>
      </section>

      {/* Crisis */}
      <section className="mt-6 rounded-3xl border border-amber-400/20 bg-amber-400/5 p-6" aria-label="Crisis support">
        <h2 className="flex items-center gap-2 font-display text-xl text-amber-200"><HeartHandshake size={19} aria-hidden="true" /> If tonight is heavier than a chat can hold</h2>
        <p className="mt-2 text-[13px] leading-6 text-amber-100/80">
          Companions can listen, but they cannot carry crises. Please reach a trained human:
          <strong className="text-amber-100"> 988</strong> (US &amp; Canada, call or text),
          <strong className="text-amber-100"> Samaritans 116 123</strong> (UK &amp; Ireland),
          or <a className="underline underline-offset-2 hover:text-amber-50" href="https://findahelpline.com" target="_blank" rel="noreferrer">findahelpline.com</a> for
          your country. You deserve more than autocomplete.
        </p>
        <p className="mt-3 flex items-center gap-2 text-[11px] text-amber-100/60"><EyeOff size={12} aria-hidden="true" /> Girlfriend-GPT is not a medical, psychological or legal service.</p>
      </section>
    </div>
  );
}
