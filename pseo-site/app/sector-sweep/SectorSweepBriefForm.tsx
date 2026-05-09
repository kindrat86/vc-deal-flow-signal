"use client";

import { useState } from "react";

/**
 * SectorSweepBriefForm — async setter for the €1,997 Custom Sector Sweep.
 *
 * Brunson DotCom Secrets Ch 23 (Application Funnel) + Expert Secrets Ch 16
 * (Magic Script). Replaces the live phone-close with a 5-question written
 * intake to preserve the founder anonymity rule. Submission emails the
 * brief to signal@gitdealflow.com via /api/sector-sweep-brief; reply lands
 * in the prospect's inbox inside 24 business hours.
 */

interface FormState {
  contact_name: string;
  email: string;
  fund_or_role: string;
  sector: string;
  thesis: string;
  three_orgs: string;
  decision_window: string;
  why_sweep: string;
}

const INITIAL: FormState = {
  contact_name: "",
  email: "",
  fund_or_role: "",
  sector: "",
  thesis: "",
  three_orgs: "",
  decision_window: "",
  why_sweep: "",
};

type Status = "idle" | "submitting" | "success" | "error";

export default function SectorSweepBriefForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
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
      const res = await fetch("/api/sector-sweep-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `HTTP ${res.status}`);
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrMsg(err instanceof Error ? err.message : "Unknown error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border-2 border-emerald-500/60 bg-emerald-950/30 p-6 sm:p-7 space-y-3">
        <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">
          Brief received
        </p>
        <h3 className="text-xl font-bold text-gray-100">
          Thanks. We&rsquo;ll reply inside 24 business hours.
        </h3>
        <p className="text-gray-300 text-sm leading-relaxed">
          The brief landed at{" "}
          <code className="bg-slate-800 px-1.5 py-0.5 rounded text-emerald-300 text-xs">
            signal@gitdealflow.com
          </code>
          . Our async response — 1-page fit assessment, tailored table of
          contents, personal Stripe buy link, and an honest &ldquo;don&rsquo;t
          buy this&rdquo; note if it&rsquo;s the wrong fit — lands in your
          inbox at <strong className="text-gray-100">{form.email}</strong>{" "}
          inside 24 business hours.
        </p>
        <p className="text-gray-400 text-xs leading-relaxed">
          If you don&rsquo;t see a reply within 36 hours, check your spam
          folder for messages from{" "}
          <code className="bg-slate-800 px-1 py-0.5 rounded">
            signal@gitdealflow.com
          </code>
          , or reply to your most recent Acceleration Watch digest with the
          word &ldquo;BRIEF&rdquo; — that loops the same inbox.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-7 space-y-5"
      aria-label="Sector Sweep brief intake"
    >
      {/* Q1 — contact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block space-y-1.5">
          <span className="text-gray-300 text-sm font-semibold">
            Your name
          </span>
          <input
            type="text"
            required
            maxLength={120}
            value={form.contact_name}
            onChange={(e) => update("contact_name", e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-gray-100 text-sm focus:border-amber-500 focus:outline-none"
            placeholder="First last"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-gray-300 text-sm font-semibold">
            Reply email
          </span>
          <input
            type="email"
            required
            maxLength={120}
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-gray-100 text-sm focus:border-amber-500 focus:outline-none"
            placeholder="you@fund.com"
          />
        </label>
      </div>

      <label className="block space-y-1.5">
        <span className="text-gray-300 text-sm font-semibold">
          Fund / firm / personal role
        </span>
        <input
          type="text"
          maxLength={200}
          value={form.fund_or_role}
          onChange={(e) => update("fund_or_role", e.target.value)}
          className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-gray-100 text-sm focus:border-amber-500 focus:outline-none"
          placeholder="e.g. Partner at [Fund], scout for [Fund], solo angel writing 5–10/yr"
        />
      </label>

      {/* Q2 — sector */}
      <label className="block space-y-1.5">
        <span className="text-gray-300 text-sm font-semibold">
          1. Which sector do you want the Sweep on?
        </span>
        <span className="text-gray-500 text-xs leading-relaxed block">
          E.g. AI infrastructure (GPU orchestration / serving), developer
          tools (build pipelines, IDE), data infrastructure (warehousing /
          ETL), fintech infra, climate tech / energy, robotics, etc. Be as
          specific as you&rsquo;d be in an IC memo.
        </span>
        <textarea
          required
          maxLength={600}
          rows={2}
          value={form.sector}
          onChange={(e) => update("sector", e.target.value)}
          className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-gray-100 text-sm focus:border-amber-500 focus:outline-none resize-y"
          placeholder="e.g. AI inference infrastructure — companies operating GPU clusters as a service for LLM serving, with focus on US + EU"
        />
      </label>

      {/* Q3 — thesis */}
      <label className="block space-y-1.5">
        <span className="text-gray-300 text-sm font-semibold">
          2. What&rsquo;s your investment thesis on this sector?
        </span>
        <span className="text-gray-500 text-xs leading-relaxed block">
          Two to four sentences. What do you believe is going to happen in
          the next 12–24 months that the consensus is wrong about? What
          shape of company are you trying to back?
        </span>
        <textarea
          required
          maxLength={1500}
          rows={4}
          value={form.thesis}
          onChange={(e) => update("thesis", e.target.value)}
          className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-gray-100 text-sm focus:border-amber-500 focus:outline-none resize-y"
          placeholder="e.g. Inference is going to commoditize the model layer; the winners are the ones who own the GPU-as-a-service primitive with sub-100ms latency at sub-$0.001/1K-token cost. Looking for pre-seed / seed teams already running production workloads, not roadmap decks."
        />
      </label>

      {/* Q4 — three orgs */}
      <label className="block space-y-1.5">
        <span className="text-gray-300 text-sm font-semibold">
          3. Three orgs you&rsquo;re already tracking in this sector (optional)
        </span>
        <span className="text-gray-500 text-xs leading-relaxed block">
          Helps us calibrate &ldquo;new to you&rdquo; vs &ldquo;known&rdquo;
          when we draft the three pre-Crunchbase breakouts. GitHub org names
          or company URLs, comma-separated. Skip if you&rsquo;d rather we
          start from zero.
        </span>
        <textarea
          maxLength={500}
          rows={2}
          value={form.three_orgs}
          onChange={(e) => update("three_orgs", e.target.value)}
          className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-gray-100 text-sm focus:border-amber-500 focus:outline-none resize-y"
          placeholder="e.g. modal-labs, anyscale, runpod-io"
        />
      </label>

      {/* Q5 — decision window */}
      <label className="block space-y-1.5">
        <span className="text-gray-300 text-sm font-semibold">
          4. When are you actually deploying capital into this sector?
        </span>
        <span className="text-gray-500 text-xs leading-relaxed block">
          Helps us prioritize the delivery clock. The Sweep delivers in 14
          days regardless, but if you have a partner meeting next month it
          shapes how we structure the breakouts.
        </span>
        <select
          required
          value={form.decision_window}
          onChange={(e) => update("decision_window", e.target.value)}
          className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-gray-100 text-sm focus:border-amber-500 focus:outline-none"
        >
          <option value="">Select a window</option>
          <option value="this-quarter">This quarter (next 90 days)</option>
          <option value="this-half">This half (90–180 days)</option>
          <option value="this-year">This calendar year (180–365 days)</option>
          <option value="exploring">
            Exploring — no capital deployment timeline yet
          </option>
          <option value="post-sweep">
            Decision contingent on what the Sweep surfaces
          </option>
        </select>
      </label>

      {/* Q6 — why sweep */}
      <label className="block space-y-1.5">
        <span className="text-gray-300 text-sm font-semibold">
          5. Why a written Sweep instead of the weekly Dashboard?
        </span>
        <span className="text-gray-500 text-xs leading-relaxed block">
          Honest answer is fine. &ldquo;I want a one-shot artefact for an IC
          memo&rdquo; is a great answer. So is &ldquo;I want to see if the
          methodology is real before committing to monthly.&rdquo; Helps us
          write the fit assessment at the right altitude.
        </span>
        <textarea
          required
          maxLength={1000}
          rows={3}
          value={form.why_sweep}
          onChange={(e) => update("why_sweep", e.target.value)}
          className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-gray-100 text-sm focus:border-amber-500 focus:outline-none resize-y"
          placeholder="e.g. Need a written artefact for the next IC. Don't have the bandwidth for a weekly subscription right now; one deep-dive on this sector will tell me whether the methodology is worth more attention."
        />
      </label>

      {status === "error" && (
        <div className="rounded-lg border border-rose-700 bg-rose-950/30 p-3 text-rose-300 text-sm">
          {errMsg ||
            "Something went wrong submitting the brief. Email signal@gitdealflow.com directly with the same answers and we&rsquo;ll respond inside 24 hours."}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 disabled:cursor-not-allowed text-slate-950 font-bold text-base transition-colors"
      >
        {status === "submitting" ? "Submitting…" : "Submit the brief →"}
      </button>

      <p className="text-gray-500 text-xs leading-relaxed">
        By submitting you agree the brief lands at signal@gitdealflow.com
        and is used solely to write the fit assessment + buy-link reply.
        No mailing-list opt-in, no analytics tracking on this form. Reply
        STOP to any future email if you do end up on the Acceleration Watch
        and want off.
      </p>
    </form>
  );
}
