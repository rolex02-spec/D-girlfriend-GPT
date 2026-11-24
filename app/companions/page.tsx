/**
 * /companions — the catalog. Server-rendered shell + client filter island.
 */
import type { Metadata } from "next";
import { Suspense } from "react";
import { COMPANIONS } from "@/data/companions";
import CatalogClient from "@/components/companions/CatalogClient";

export const metadata: Metadata = {
  title: "Companions",
  description:
    "Browse 82 fictional adult AI companions across 34 countries — filter by language, archetype, age and mood. Every character is an adult (21–25), fictional, and respectfully written.",
};

export default function CompanionsPage() {
  return (
    <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-8">
      {/* Ambient glows */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-wine/30 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-72 h-96 w-96 rounded-full bg-rose-deep/10 blur-3xl" />

      <header className="relative max-w-3xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-rose">The constellation</p>
        <h1 className="mt-3 font-display text-4xl font-light leading-[1.05] text-cream sm:text-5xl">
          Eighty-two lives,<br /><span className="text-aurora">all invented — all adults.</span>
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-6 text-cream-dim">
          Names, countries, languages and heartbreaks — every one fictional, every one written to
          be respected. Filter by where a person is from, what they speak, or simply the mood
          you&apos;re in.
        </p>
      </header>

      <div className="relative mt-8">
        <Suspense fallback={<div className="glass h-40 animate-pulse rounded-2xl" />}>
          <CatalogClient companions={COMPANIONS} />
        </Suspense>
      </div>
    </div>
  );
}
