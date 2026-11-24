/**
 * Footer — carries the non-negotiable honesty label: companions are fiction,
 * replies can be wrong, nothing here is medical or crisis care.
 */
import Link from "next/link";
import { Heart, ShieldCheck, LifeBuoy } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-[#0b060d]">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="flex items-center gap-2">
              <Heart size={18} className="fill-rose text-rose" aria-hidden="true" />
              <span className="font-display text-lg text-cream">Girlfriend-GPT</span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-6 text-cream-dim">
              Warm, emotionally intelligent conversation with <em>fictional</em> adult AI
              companions — designed to comfort, not to capture.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-gold">
              <ShieldCheck size={14} aria-hidden="true" />
              <span>Adults only · 18+ · Consent-first</span>
            </div>
          </div>

          <nav className="md:col-span-2" aria-label="Explore">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cream-dim">Explore</p>
            <ul className="mt-3 space-y-2 text-sm text-cream-dim">
              <li><Link className="hover:text-cream" href="/companions">Companions</Link></li>
              <li><Link className="hover:text-cream" href="/create">Customise</Link></li>
              <li><Link className="hover:text-cream" href="/settings">Settings &amp; data</Link></li>
              <li><Link className="hover:text-cream" href="/privacy">Privacy</Link></li>
            </ul>
          </nav>

          <nav className="md:col-span-2" aria-label="Trust">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cream-dim">Trust</p>
            <ul className="mt-3 space-y-2 text-sm text-cream-dim">
              <li><Link className="hover:text-cream" href="/safety">Safety &amp; policy</Link></li>
              <li><Link className="hover:text-cream" href="/safety#report">Report an issue</Link></li>
              <li><Link className="hover:text-cream" href="/safety#honesty">What we won&apos;t claim</Link></li>
            </ul>
          </nav>

          <div className="md:col-span-4">
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-cream-dim">
              <LifeBuoy size={13} aria-hidden="true" /> In a hard moment
            </p>
            <p className="mt-3 text-sm leading-6 text-cream-dim">
              A companion is not a crisis service. If you may hurt yourself or someone
              else, please contact your local emergency number now, or find a free,
              confidential helpline at{" "}
              <a className="text-rose underline underline-offset-2 hover:text-cream" href="https://findahelpline.com" target="_blank" rel="noreferrer">
                findahelpline.com
              </a>
              . In the US &amp; Canada you can call or text <strong className="text-cream">988</strong>.
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-white/5 pt-6 text-[11px] leading-5 text-cream-dim/80">
          <p className="max-w-4xl">
            <strong className="text-cream-dim">The honest fine print.</strong> Every companion on
            Girlfriend-GPT is a fictional AI character. They are not real people, not licensed
            therapists, and cannot verify anything they say about the real world. Portraits are
            illustrations or AI-generated artwork of fictional characters — never photographs of
            real humans. Conversations may contain mistakes or made-up facts. Age confirmation
            is a self-declaration, not legal identity verification. Adults only; never use with
            or on behalf of minors.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <span>© {new Date().getFullYear()} Girlfriend-GPT · All companions fictional</span>
            <span className="rounded-md border border-white/10 px-2 py-1 text-[10px] tracking-widest text-cream-dim">18+ ADULTS ONLY</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
