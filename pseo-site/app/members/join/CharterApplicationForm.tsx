"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * Charter Cohort application form.
 *
 * Brunson Expert Secrets §1 Ch 4 (Mass Movement Vehicle) — the entry ritual.
 * Brunson DotCom Secrets Ch 23 (Application Funnel) — async-only equivalent
 * of the phone-close, anonymity-preserving.
 *
 * Posts to /api/charter-application; the founder receives the application
 * via Resend at signal@gitdealflow.com and replies within 48 hours.
 */

interface FormState {
  handle: string;
  email: string;
  archetype: string;
  thesis: string;
  check_size: string;
  sectors: string;
  why_charter: string;
}

const INITIAL: FormState = {
  handle: "",
  email: "",
  archetype: "",
  thesis: "",
  check_size: "",
  sectors: "",
  why_charter: "",
};

const CHECK_SIZE_OPTIONS = [
  "€5k – €25k angel checks",
  "€25k – €100k active angel",
  "€100k – €500k syndicate lead",
  "€500k – €2m small-fund principal",
  "€2m+ mid-fund partner",
] as const;

const ARCHETYPE_OPTIONS = [
  { value: "charter-1", label: "AI Infrastructure Angel" },
  { value: "charter-2", label: "Dev Tools Syndicate Lead" },
  { value: "charter-3", label: "Technical SaaS Scout" },
  { value: "charter-4", label: "Data Infrastructure Partner" },
  { value: "other", label: "Other / I'll describe my own" },
] as const;

type Status = "idle" | "submitting" | "success" | "error";

interface Props {
  /** Pre-selected archetype handle from query param. */
  initialArchetype?: string;
}

export default function CharterApplicationForm({ initialArchetype }: Props) {
  const [form, setForm] = useState<FormState>({
    ...INITIAL,
    archetype: initialArchetype ?? "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [errMsg, setErrMsg] = useState<string>("");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrMsg("");
    try {
      const res = await fetch("/api/charter-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        let message = `HTTP ${res.status}`;
        try {
          const j = text ? JSON.parse(text) : null;
          if (j?.error) message = j.error;
        } catch {}
        throw new Error(message);
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrMsg(err instanceof Error ? err.message : "Network error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-emerald-700/40 bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-4">
        <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">
          Application received
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
          Thanks — your charter application is in the founder&rsquo;s queue.
        </h2>
        <p className="text-gray-300 text-base leading-relaxed">
          You&rsquo;ll hear back inside 48 business hours. The reply comes from{" "}
          <code className="text-emerald-300 bg-slate-950/50 px-1.5 py-0.5 rounded text-sm">
            signal@gitdealflow.com
          </code>{" "}
          — add it to your contacts so the draft profile doesn&rsquo;t hit
          Promotions.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            href="/manifesto"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-sm transition-colors"
          >
            Read the manifesto while you wait
          </Link>
          <Link
            href="/members"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-emerald-700/50 bg-emerald-950/30 hover:bg-emerald-900/30 text-emerald-200 font-semibold text-sm transition-colors"
          >
            ← Back to the Charter Cohort
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 space-y-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="space-y-1.5 block">
          <span className="text-gray-200 text-sm font-semibold">
            Handle <span className="text-rose-400">*</span>
          </span>
          <input
            type="text"
            required
            maxLength={40}
            value={form.handle}
            onChange={(e) => update("handle", e.target.value)}
            placeholder="@your-pseudonym (or real name — your call)"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-gray-100 text-sm placeholder:text-gray-600 focus:border-amber-600 focus:outline-none"
          />
          <span className="text-gray-500 text-xs">
            Pseudonymous handles welcome — same anonymity rule as the founder.
          </span>
        </label>

        <label className="space-y-1.5 block">
          <span className="text-gray-200 text-sm font-semibold">
            Verifiable email <span className="text-rose-400">*</span>
          </span>
          <input
            type="email"
            required
            maxLength={200}
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@domain.com"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-gray-100 text-sm placeholder:text-gray-600 focus:border-amber-600 focus:outline-none"
          />
          <span className="text-gray-500 text-xs">
            Never published — used only to verify and reply.
          </span>
        </label>
      </div>

      <label className="space-y-1.5 block">
        <span className="text-gray-200 text-sm font-semibold">
          Archetype <span className="text-rose-400">*</span>
        </span>
        <select
          required
          value={form.archetype}
          onChange={(e) => update("archetype", e.target.value)}
          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-gray-100 text-sm focus:border-amber-600 focus:outline-none"
        >
          <option value="">Pick one…</option>
          {ARCHETYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-1.5 block">
        <span className="text-gray-200 text-sm font-semibold">
          Check-size band <span className="text-rose-400">*</span>
        </span>
        <select
          required
          value={form.check_size}
          onChange={(e) => update("check_size", e.target.value)}
          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-gray-100 text-sm focus:border-amber-600 focus:outline-none"
        >
          <option value="">Pick one…</option>
          {CHECK_SIZE_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-1.5 block">
        <span className="text-gray-200 text-sm font-semibold">
          Sectors you track <span className="text-rose-400">*</span>
        </span>
        <input
          type="text"
          required
          maxLength={200}
          value={form.sectors}
          onChange={(e) => update("sectors", e.target.value)}
          placeholder="AI infrastructure, dev tools, data infra, fintech…"
          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-gray-100 text-sm placeholder:text-gray-600 focus:border-amber-600 focus:outline-none"
        />
        <span className="text-gray-500 text-xs">
          Comma-separated. 1–4 sectors recommended.
        </span>
      </label>

      <label className="space-y-1.5 block">
        <span className="text-gray-200 text-sm font-semibold">
          Public thesis <span className="text-rose-400">*</span>
        </span>
        <textarea
          required
          maxLength={1000}
          rows={5}
          value={form.thesis}
          onChange={(e) => update("thesis", e.target.value)}
          placeholder="2–4 sentences. The angle you write from. What you're looking for that the warm-intro flow doesn't surface."
          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-gray-100 text-sm placeholder:text-gray-600 focus:border-amber-600 focus:outline-none resize-y"
        />
        <span className="text-gray-500 text-xs">
          Goes on your public profile page. You can edit later.
        </span>
      </label>

      <label className="space-y-1.5 block">
        <span className="text-gray-200 text-sm font-semibold">
          Why charter, why now? (optional)
        </span>
        <textarea
          maxLength={800}
          rows={3}
          value={form.why_charter}
          onChange={(e) => update("why_charter", e.target.value)}
          placeholder="What about the methodology drew you to apply? Optional — helps the founder write the welcome reply."
          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-gray-100 text-sm placeholder:text-gray-600 focus:border-amber-600 focus:outline-none resize-y"
        />
      </label>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:bg-amber-700/50 disabled:cursor-not-allowed text-white font-semibold text-base shadow-lg shadow-amber-500/30 transition-colors"
        >
          {status === "submitting" ? "Sending…" : "Submit charter application"}
        </button>
        <Link
          href="/members"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-base transition-colors"
        >
          ← Back to the cohort
        </Link>
      </div>

      {status === "error" && errMsg && (
        <p
          role="alert"
          className="text-rose-300 text-sm bg-rose-950/30 border border-rose-700/40 rounded-lg px-3 py-2"
        >
          {errMsg}. You can also email{" "}
          <a
            href="mailto:signal@gitdealflow.com"
            className="text-rose-200 underline"
          >
            signal@gitdealflow.com
          </a>{" "}
          directly.
        </p>
      )}

      <p className="text-gray-500 text-xs leading-relaxed pt-2 border-t border-slate-800">
        Anonymity rule: real name never required. The handle you choose is
        what appears on /members/{"{handle}"} after approval. If you change
        your mind later, the seat is renamable on request.
      </p>
    </form>
  );
}
