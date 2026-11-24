/**
 * Faq — accordion with proper aria wiring and reduced-motion-safe chevron.
 */
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const ITEMS: { q: string; a: string }[] = [
  {
    q: "Are companions real people?",
    a: "No. Every companion is a fictional AI character — a written personality and generated artwork, never a real person, never a secret profile someone else controls. When you ask, they'll tell you that honestly in-character.",
  },
  {
    q: "Is this verified-age or self-declared 18+?",
    a: "Today it's a self-declaration (age confirmation), not identity proof — we say so plainly. Launching paid adult features in regulated markets requires integrating a real age-verification provider; that's listed on our compliance page and not yet wired to a vendor.",
  },
  {
    q: "Do you store my conversations?",
    a: "Yes — so you can resume them. They tie to an anonymous browser cookie, not your name or email. You can export everything or delete everything from Settings → Privacy, any time.",
  },
  {
    q: "How accurate is the AI?",
    a: "Companions are excellent at warmth and terrible at guaranteed facts. They may improvise. Nothing they say is medical, legal or financial advice, and factual questions about the real world deserve a real source, not a character's best guess.",
  },
  {
    q: "Can I use Tamil, Thanglish, Sinhala, Mandarin, Russian…?",
    a: "Yes — with the caveat we print everywhere: coverage and quality vary by language and by model. Write whatever you naturally speak and set language to Auto; your companion mirrors you, code-switching included. We never claim fluency we can't back up.",
  },
  {
    q: "What is the adult roleplay mode, exactly?",
    a: "An optional, clearly-labelled 18+ switch for verified-of-age sessions. Everyone involved — you, the character — is an adult, fictional and consenting. Hard limits always apply: no minors, no coercion, no non-consent, no real people. Fade-to-black whenever the provider's policies or our lines are reached.",
  },
  {
    q: "How do I pause, reset, or leave?",
    a: "Every chat has Pause (freeze the thread), Reset (wipe messages but keep the companion) and Leave (step away). Your data is yours — Settings lets you export or erase it entirely.",
  },
  {
    q: "Can I report a problem?",
    a: "Yes — the flag button in every chat files a report to the safety queue. If someone is in immediate danger, contact your local emergency services first; a report is not an emergency channel.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number>(0);
  return (
    <div className="divide-y divide-white/5 rounded-2xl border border-white/10 bg-white/[0.02]">
      {ITEMS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              className="flex w-full items-center justify-between gap-6 px-5 py-5 text-left"
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${i}`}
              id={`faq-button-${i}`}
              onClick={() => setOpen(isOpen ? -1 : i)}
            >
              <span className="font-medium text-cream">{item.q}</span>
              <ChevronDown
                size={18}
                aria-hidden="true"
                className={`shrink-0 text-rose transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isOpen && (
              <div
                id={`faq-panel-${i}`}
                role="region"
                aria-labelledby={`faq-button-${i}`}
                className="px-5 pb-5 text-sm leading-6 text-cream-dim"
              >
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
