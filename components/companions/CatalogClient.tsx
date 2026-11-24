/**
 * CatalogClient — client-side filtering for the companion catalog.
 * Filters: search · country · language · age band · archetype · sort.
 * State is local (fast, private) and mirrored to the URL query string so a
 * filtered view can be shared or bookmarked.
 */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, Users } from "lucide-react";
import CompanionCard from "./CompanionCard";
import {
  ARCHETYPES,
  COUNTRIES,
  LANGUAGES,
  loadCustomCompanions,
  type Companion,
} from "@/data/companions";

type AgeBand = "any" | "21-22" | "23-24" | "25-25";
type Sort = "featured" | "name" | "age-asc" | "age-desc";

export default function CatalogClient({ companions }: { companions: Companion[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [country, setCountry] = useState(searchParams.get("country") ?? "any");
  const [language, setLanguage] = useState(searchParams.get("language") ?? "any");
  const [age, setAge] = useState<AgeBand>((searchParams.get("age") as AgeBand) ?? "any");
  const [archetype, setArchetype] = useState(searchParams.get("archetype") ?? "any");
  const [sort, setSort] = useState<Sort>((searchParams.get("sort") as Sort) ?? "featured");

  // Custom companions live in localStorage (client only) — merge them in
  // alongside the built-in catalog. Remounting this island (navigating back
  // from the studio) picks up newly saved ones.
  const [customs, setCustoms] = useState<Companion[]>([]);
  useEffect(() => {
    setCustoms(loadCustomCompanions());
  }, []);
  const all = useMemo(() => (customs.length ? [...customs, ...companions] : companions), [customs, companions]);

  // Mirror filters into the URL (replace, not push — no history spam).
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (country !== "any") params.set("country", country);
    if (language !== "any") params.set("language", language);
    if (age !== "any") params.set("age", age);
    if (archetype !== "any") params.set("archetype", archetype);
    if (sort !== "featured") params.set("sort", sort);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [query, country, language, age, archetype, sort, pathname, router]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = all.filter((c) => {
      if (country !== "any" && c.country !== country) return false;
      if (language !== "any" && !c.languages.includes(language)) return false;
      if (age !== "any") {
        const [lo, hi] = age.split("-").map(Number);
        if (c.age < lo || c.age > hi) return false;
      }
      if (archetype !== "any" && c.archetype !== archetype) return false;
      if (q) {
        const hay = [
          c.name, c.country, c.city, c.archetype,
          ...c.languages, ...c.interests, c.backstory, c.style,
        ].join(" ").toLowerCase();
        if (!q.split(/\s+/).every((token) => hay.includes(token))) return false;
      }
      return true;
    });
    switch (sort) {
      case "name": out = [...out].sort((a, b) => a.name.localeCompare(b.name)); break;
      case "age-asc": out = [...out].sort((a, b) => a.age - b.age); break;
      case "age-desc": out = [...out].sort((a, b) => b.age - a.age); break;
      default: out = [...out].sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false));
    }
    return out;
  }, [all, query, country, language, age, archetype, sort]);

  const hasFilters =
    query || country !== "any" || language !== "any" || age !== "any" || archetype !== "any";

  const clear = () => {
    setQuery(""); setCountry("any"); setLanguage("any"); setAge("any"); setArchetype("any"); setSort("featured");
  };

  const selectClass =
    "field h-11 rounded-xl px-3 text-sm text-cream appearance-none bg-no-repeat pr-8 " +
    "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23cbbcb0%22 stroke-width=%222%22%3E%3Cpath d=%22m6 9 6 6 6-6%22/%3E%3C/svg%3E')] bg-[length:1rem] bg-[position:right_0.6rem_center]";

  return (
    <div>
      {/* Filter bar */}
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-cream-dim">
          <SlidersHorizontal size={12} aria-hidden="true" /> Find your person
          {hasFilters && (
            <button onClick={clear} className="ml-auto inline-flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1 text-[10px] text-rose hover:border-rose/40">
              <X size={11} aria-hidden="true" /> Clear all
            </button>
          )}
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-6">
          <label className="relative sm:col-span-2 lg:col-span-2">
            <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-cream-dim" aria-hidden="true" />
            <span className="sr-only">Search companions</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, interest, city…"
              className="field h-11 w-full rounded-xl pl-10 pr-4 text-sm text-cream"
              type="search"
              aria-label="Search companions"
            />
          </label>
          <select value={country} onChange={(e) => setCountry(e.target.value)} className={selectClass} aria-label="Filter by country">
            <option value="any">All countries</option>
            {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className={selectClass} aria-label="Filter by language">
            <option value="any">All languages</option>
            {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <select value={age} onChange={(e) => setAge(e.target.value as AgeBand)} className={selectClass} aria-label="Filter by age">
            <option value="any">All ages (21–25)</option>
            <option value="21-22">21 – 22</option>
            <option value="23-24">23 – 24</option>
            <option value="25-25">25</option>
          </select>
          <select value={archetype} onChange={(e) => setArchetype(e.target.value)} className={selectClass} aria-label="Filter by personality">
            <option value="any">All personalities</option>
            {ARCHETYPES.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-xs text-cream-dim" aria-live="polite">
            <Users size={13} aria-hidden="true" />
            <strong className="text-cream">{filtered.length}</strong> of {all.length} companions
          </p>
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={`${selectClass} h-9 text-xs`} aria-label="Sort companions">
            <option value="featured">Sort: Featured first</option>
            <option value="name">Sort: Name A–Z</option>
            <option value="age-asc">Sort: Age youngest first</option>
            <option value="age-desc">Sort: Age oldest first</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 xl:grid-cols-4">
          {filtered.map((c) => <CompanionCard key={c.id} c={c} />)}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <p className="font-display text-2xl text-cream">No one matches — yet.</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-cream-dim">
            Loosen a filter, or <a href="/create" className="text-rose underline underline-offset-4 hover:text-cream">customise your own companion</a> — the studio builds one to your exact taste.
          </p>
          <button onClick={clear} className="btn-ghost mt-6 rounded-xl px-6 py-3 text-sm font-semibold text-cream">Clear filters</button>
        </div>
      )}

      <p className="mt-8 text-center text-[10px] uppercase tracking-[0.2em] text-cream-dim/60">
        Every portrait on this page is an illustration or AI-generated artwork of a fictional character — never a photograph of a real person.
      </p>
    </div>
  );
}
