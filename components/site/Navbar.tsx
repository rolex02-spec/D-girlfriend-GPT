/**
 * Site-wide navigation. Sticky, keyboard-accessible, with a proper mobile
 * disclosure menu (Escape closes, focus returns to the trigger).
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, Heart } from "lucide-react";

const LINKS = [
  { href: "/companions", label: "Companions" },
  { href: "/create", label: "Customise" },
  { href: "/safety", label: "Safety" },
  { href: "/privacy", label: "Privacy" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Close the mobile menu on route change and on Escape.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mt-3 flex h-14 items-center justify-between rounded-2xl border border-white/10 bg-ink/70 px-4 shadow-[0_10px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:px-5">
          {/* Brand */}
          <Link
            href="/"
            aria-label="Girlfriend-GPT home"
            className="group flex items-center gap-2.5 rounded-lg"
          >
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-rose via-rose-deep to-wine shadow-[0_0_18px_rgba(233,162,184,0.4)] transition-transform duration-300 group-hover:scale-105">
              <Heart size={16} strokeWidth={2.4} className="fill-[#2a0f1c] text-[#2a0f1c]" aria-hidden="true" />
            </span>
            <span className="font-display text-[1.15rem] leading-none tracking-tight text-cream">
              Girlfriend<span className="text-aurora">-GPT</span>
            </span>
            <span
              className="ml-1 hidden rounded-md border border-gold/40 bg-gold/10 px-1.5 py-0.5 text-[10px] font-bold tracking-widest text-gold sm:inline-block"
              title="Adults only"
            >
              18+
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {LINKS.map((l) => {
              const active = pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active ? "bg-white/5 text-rose" : "text-cream-dim hover:text-cream"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
            <Link
              href="/companions"
              className="btn-candle ml-2 rounded-xl px-4 py-2 text-sm font-bold"
            >
              Meet them
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            ref={btnRef}
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-cream md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div
            id="mobile-menu"
            className="mt-2 rounded-2xl border border-white/10 bg-ink-2/95 p-3 backdrop-blur-xl md:hidden"
          >
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="block rounded-xl px-4 py-3 text-base font-medium text-cream hover:bg-white/5"
              >
                {l.label}
              </Link>
            ))}
            <Link href="/settings" className="block rounded-xl px-4 py-3 text-base font-medium text-cream hover:bg-white/5">
              Privacy &amp; data
            </Link>
            <div className="mt-2 border-t border-white/5 px-4 pt-3 text-xs text-cream-dim">
              Adults only · All companions are fictional AI characters
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
