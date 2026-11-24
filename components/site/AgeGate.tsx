/**
 * AgeGate — adults-only interstitial.
 *
 * Shown once per browser (localStorage flag) until the visitor confirms
 * they are 18+. Confirmation is stored locally only — there is no account
 * system and no server-side consent log in this build. Note plainly:
 * self-declaration is NOT identity verification or proof of legal compliance.
 * Operators in regulated jurisdictions must integrate a real age-verification
 * provider (see README, "Compliance decisions").
 */
"use client";

import { useEffect, useRef, useState } from "react";
import { ShieldAlert, Heart } from "lucide-react";

export default function AgeGate() {
  const [checked, setChecked] = useState(true); // assume hidden until we know
  const enterRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    try {
      setChecked(window.localStorage.getItem("ggpt_age_18") === "yes");
    } catch {
      setChecked(false);
    }
  }, []);

  // Trap focus lightly: move focus to the confirm button when the gate shows.
  useEffect(() => {
    if (!checked) enterRef.current?.focus();
  }, [checked]);

  if (checked) return null;

  const confirm = () => {
    try {
      window.localStorage.setItem("ggpt_age_18", "yes");
      // Dispatch custom event for same-tab listeners (e.g., ChatClient settings)
      window.dispatchEvent(new CustomEvent("ggpt-age-confirmed", { detail: { confirmed: true } }));
    } catch {
      /* storage unavailable — still allow this session */
    }
    setChecked(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#080409]/92 p-5 backdrop-blur-md"
    >
      <div className="glass w-full max-w-md rounded-3xl p-8 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-rose to-wine">
          <Heart size={26} className="fill-[#2a0f1c] text-[#2a0f1c]" aria-hidden="true" />
        </div>
        <h1 id="age-gate-title" className="mt-5 font-display text-2xl text-cream">
          Before we begin…
        </h1>
        <p className="mt-3 text-sm leading-6 text-cream-dim">
          Girlfriend-GPT is an <strong className="text-cream">adults-only</strong> space for
          conversation and fictional roleplay with AI characters. All companions are adults
          (21–25), fictional, and consenting. AI companions are{" "}
          <strong className="text-cream">not real people</strong>.
        </p>
        <div className="mt-4 flex items-start gap-2 rounded-2xl border border-gold/25 bg-gold/5 p-3 text-left text-xs leading-5 text-gold/90">
          <ShieldAlert size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>
            Age confirmation here is a self-declaration, not identity verification, and is not
            legal compliance advice. Some jurisdictions require verified age checks — we say so
            plainly rather than pretend otherwise.
          </span>
        </div>
        <div className="mt-6 flex flex-col gap-3">
          <button
            ref={enterRef}
            onClick={confirm}
            className="btn-candle rounded-xl px-5 py-3 text-sm font-bold"
          >
            I am 18 or older — enter
          </button>
          <a
            href="https://www.google.com"
            className="rounded-xl px-5 py-2.5 text-xs font-medium text-cream-dim underline-offset-4 hover:text-cream hover:underline"
          >
            I&apos;m under 18 — take me away
          </a>
        </div>
      </div>
    </div>
  );
}
