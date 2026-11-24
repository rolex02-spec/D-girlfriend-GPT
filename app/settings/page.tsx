/**
 * /settings — privacy center & data controls.
 * Export (JSON download), erase (confirmed delete), age-consent status,
 * and a plain-language inventory of what this build actually stores.
 * No dark patterns: delete is one click away, same size as export.
 */
"use client";

import { useEffect, useState } from "react";
import {
  Download, Trash2, ShieldCheck, ShieldAlert, Database, Cookie,
  Users, MessagesSquare, Loader2, AlertTriangle, Check, Info, Sparkles,
} from "lucide-react";

export default function SettingsPage() {
  const [convoCount, setConvoCount] = useState<number | null>(null);
  const [customCount, setCustomCount] = useState<number | null>(null);
  const [ageVerified, setAgeVerified] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteResult, setDeleteResult] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    try {
      let threads = 0;
      let customs = 0;
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        if (!k) continue;
        if (k.startsWith("ggpt_chat_")) threads++;
        if (k.startsWith("ggpt_custom_")) customs++;
      }
      try {
        const raw = window.localStorage.getItem("ggpt_customs");
        if (raw) {
          const arr = JSON.parse(raw);
          if (Array.isArray(arr)) customs = Math.max(customs, arr.length);
        }
      } catch { /* ignore */ }
      setConvoCount(threads);
      setCustomCount(customs);
      setAgeVerified(window.localStorage.getItem("ggpt_age_18") === "yes");
    } catch {
      setConvoCount(0);
      setCustomCount(0);
      setAgeVerified(false);
    }
    setLoading(false);
  }, []);

  const exportEverything = () => {
    try {
      const bundle: Record<string, unknown> = { exportedAt: new Date().toISOString(), threads: {}, reports: [] };
      const threads = bundle.threads as Record<string, unknown>;
      const reports: unknown[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        if (!k || !k.startsWith("ggpt_")) continue;
        try {
          const v = JSON.parse(window.localStorage.getItem(k) ?? "null");
          if (k.startsWith("ggpt_chat_")) threads[k.slice("ggpt_chat_".length)] = v;
          else if (k === "ggpt_reports") reports.push(...(Array.isArray(v) ? v : []));
          else bundle[k] = v;
        } catch {
          bundle[k] = window.localStorage.getItem(k);
        }
      }
      bundle.reports = reports;
      const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "girlfriend-gpt-my-data.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setDeleteError("Couldn't build the export — this browser's storage is unavailable.");
    }
  };

  const deleteEverything = () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      const doomed: string[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        if (k && k.startsWith("ggpt_")) doomed.push(k);
      }
      doomed.forEach((k) => window.localStorage.removeItem(k));
      setDeleteResult(`Gone. ${doomed.length} item(s) — your threads, custom companions, reports and age confirmation — were permanently erased from this browser. This browser is now a stranger again.`);
      setConvoCount(0);
      setCustomCount(0);
      setAgeVerified(false);
    } catch {
      setDeleteError("This browser's storage is unavailable — nothing was deleted.");
    } finally {
      setDeleting(false);
    }
  };

  const canDelete = confirmText.trim().toUpperCase() === "DELETE" && !deleting;

  return (
    <div className="relative mx-auto max-w-4xl px-4 pb-20 pt-24 sm:px-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-rose">Settings &amp; privacy</p>
      <h1 className="mt-3 font-display text-4xl font-light text-cream sm:text-5xl">Your data,<br /><span className="text-aurora">on the table.</span></h1>
      <p className="mt-4 max-w-xl text-sm leading-6 text-cream-dim">
        No dark patterns and no mystery boxes. Here is everything this build stores about you,
        how long it stays, and how to make it disappear — immediately.
      </p>

      {/* Status tiles */}
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          { icon: MessagesSquare, label: "Conversations", value: loading ? "…" : String(convoCount ?? 0) },
          { icon: Sparkles, label: "Custom companions", value: loading ? "…" : String(customCount ?? 0) },
          { icon: ageVerified ? ShieldCheck : ShieldAlert, label: "Age confirmation", value: loading ? "…" : ageVerified ? "Logged 18+" : "Not yet" },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="glass-soft rounded-2xl p-5">
            <Icon size={18} className="text-rose" aria-hidden="true" />
            <p className="mt-2 font-display text-2xl text-cream">{value}</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-cream-dim">{label}</p>
          </div>
        ))}
      </div>

      {/* What we store */}
      <section className="glass mt-8 rounded-3xl p-6 sm:p-7" aria-labelledby="store-heading">
        <h2 id="store-heading" className="flex items-center gap-2 font-display text-2xl text-cream"><Database size={18} className="text-gold" aria-hidden="true" /> Exactly what&apos;s stored</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-[12px] leading-6">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-[0.2em] text-cream-dim">
                <th className="pb-2 pr-4">Stored</th><th className="pb-2 pr-4">Why</th><th className="pb-2">Kept until</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-cream-dim">
              {[
                ["Conversation threads + messages", "So you can resume right where you left off", "You delete them, or everything"],
                ["Custom companions you design", "They're yours to talk with again", "You delete them, or everything"],
                ["Age-confirmation flag (this browser)", "Gates the 18+ switch and the entry screen", "You delete everything"],
                ["Safety reports you file", "Kept for your own records in this build", "You delete everything"],
                ["Model & voice preferences", "Remembers how you like replies", "You delete everything"],
              ].map(([a, b, c]) => (
                <tr key={a}>
                  <td className="py-2.5 pr-4 align-top font-medium text-cream">{a}</td>
                  <td className="py-2.5 pr-4 align-top">{b}</td>
                  <td className="py-2.5 align-top">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 space-y-2 text-[11px] leading-5 text-cream-dim/85">
          <p className="flex items-start gap-2"><Cookie size={13} className="mt-0.5 shrink-0 text-gold/80" aria-hidden="true" />Everything lives in this browser&apos;s local storage. No accounts, no server-side profile, no ad pixels, no cross-site trackers, no fingerprinting in this build.</p>
          <p className="flex items-start gap-2"><Info size={13} className="mt-0.5 shrink-0 text-gold/80" aria-hidden="true" />Clearing site data for this page erases the same things the button below does — but it also forgets your age confirmation, so you&apos;d meet the gate again. The delete button here is the deliberate route. We don&apos;t claim anonymity we can&apos;t verify, and we don&apos;t sell data because there&apos;s no ad profile to sell.</p>
        </div>
      </section>

      {/* Export */}
      <section className="glass mt-6 flex flex-col items-start justify-between gap-4 rounded-3xl p-6 sm:flex-row sm:items-center" aria-labelledby="export-heading">
        <div>
          <h2 id="export-heading" className="flex items-center gap-2 font-display text-xl text-cream"><Download size={17} className="text-rose" aria-hidden="true" /> Take your data with you</h2>
          <p className="mt-1.5 max-w-md text-[12px] leading-5 text-cream-dim">A complete, readable JSON export: every conversation thread with its messages, custom companions, reports, and preferences — assembled in your browser and downloaded directly.</p>
        </div>
        <button onClick={exportEverything} className="btn-ghost inline-flex shrink-0 items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold text-cream">
          <Download size={15} aria-hidden="true" /> Export JSON
        </button>
      </section>

      {/* Delete */}
      <section className="mt-6 rounded-3xl border border-rose/25 bg-rose/[0.05] p-6 sm:p-7" aria-labelledby="delete-heading">
        <h2 id="delete-heading" className="flex items-center gap-2 font-display text-xl text-rose"><Trash2 size={17} aria-hidden="true" /> The erase everything button</h2>
        <p className="mt-1.5 max-w-xl text-[12px] leading-5 text-cream-dim">
          Instant and irreversible in this browser. Erases your conversation threads, every message,
          your custom companions, your reports and your age confirmation — then forgets this
          browser. Type <strong className="text-cream">DELETE</strong> to arm the button.
        </p>
        {deleteResult ? (
          <p role="status" className="mt-4 flex items-start gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs leading-5 text-emerald-300"><Check size={15} className="mt-0.5 shrink-0" aria-hidden="true" />{deleteResult}</p>
        ) : (
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="sr-only" htmlFor="delete-confirm">Type DELETE to confirm</label>
            <input
              id="delete-confirm"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE"
              autoComplete="off"
              className="field h-12 w-44 rounded-xl px-4 text-center text-sm font-bold uppercase tracking-[0.3em] text-cream"
              aria-describedby="delete-hint"
            />
            <button
              onClick={deleteEverything}
              disabled={!canDelete}
              aria-describedby="delete-hint"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-rose/50 bg-rose/15 px-6 text-sm font-bold text-rose transition-all hover:bg-rose/25 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {deleting ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Trash2 size={16} aria-hidden="true" />}
              {deleting ? "Erasing…" : "Erase everything"}
            </button>
          </div>
        )}
        {deleteError && <p role="alert" className="mt-3 flex items-center gap-2 text-[11px] text-rose"><AlertTriangle size={13} aria-hidden="true" />{deleteError}</p>}
        <p id="delete-hint" className="mt-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-cream-dim/60"><Users size={11} aria-hidden="true" /> Nobody at Girlfriend-GPT can recover erased data</p>
      </section>
    </div>
  );
}
