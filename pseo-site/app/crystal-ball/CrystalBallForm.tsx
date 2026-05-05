"use client";

import { useState } from "react";

type FormStatus = "idle" | "submitting" | "ok" | "error";

export default function CrystalBallForm() {
  const [handle, setHandle] = useState("");
  const [email, setEmail] = useState("");
  const [orgUrl, setOrgUrl] = useState("");
  const [thesis, setThesis] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setMessage(null);

    const cleanedOrg = orgUrl
      .trim()
      .replace(/^https?:\/\/(www\.)?github\.com\//i, "")
      .replace(/\/$/, "");

    if (!email.trim() || !cleanedOrg || !handle.trim() || !thesis.trim()) {
      setStatus("error");
      setMessage("All fields are required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStatus("error");
      setMessage("Please use a valid email.");
      return;
    }
    if (cleanedOrg.length < 1 || cleanedOrg.length > 80) {
      setStatus("error");
      setMessage("Org should be a GitHub handle like 'supabase' or 'supabase/supabase'.");
      return;
    }

    try {
      const res = await fetch("/api/crystal-ball/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          handle: handle.trim(),
          email: email.trim().toLowerCase(),
          org: cleanedOrg,
          thesis: thesis.trim(),
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `HTTP ${res.status}`);
      }
      setStatus("ok");
      setMessage(
        "Submitted. Check your inbox in ~30 seconds for the confirmation. We review picks within 24 hours.",
      );
      setHandle("");
      setEmail("");
      setOrgUrl("");
      setThesis("");
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong — please email signal@gitdealflow.com directly.",
      );
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-5 space-y-2">
        <p className="text-emerald-300 font-semibold text-base">
          Pick received ✓
        </p>
        <p className="text-emerald-100/80 text-sm leading-relaxed">{message}</p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setMessage(null);
          }}
          className="text-emerald-300 hover:text-emerald-200 text-xs underline decoration-dotted underline-offset-4 mt-1"
        >
          Submit another pick
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label
          htmlFor="cb-handle"
          className="text-xs font-medium text-gray-300 uppercase tracking-wider"
        >
          Forecaster handle
        </label>
        <input
          id="cb-handle"
          type="text"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder="@your_handle (public on leaderboard)"
          maxLength={32}
          className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 focus:border-sky-500 focus:outline-none text-gray-100 text-sm placeholder-gray-600"
          disabled={status === "submitting"}
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="cb-email"
          className="text-xs font-medium text-gray-300 uppercase tracking-wider"
        >
          Email
        </label>
        <input
          id="cb-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com (private — for grading notifications)"
          maxLength={200}
          className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 focus:border-sky-500 focus:outline-none text-gray-100 text-sm placeholder-gray-600"
          disabled={status === "submitting"}
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="cb-org"
          className="text-xs font-medium text-gray-300 uppercase tracking-wider"
        >
          GitHub org or repo
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-sm pointer-events-none">
            github.com/
          </span>
          <input
            id="cb-org"
            type="text"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            value={orgUrl}
            onChange={(e) => setOrgUrl(e.target.value)}
            placeholder="supabase or supabase/supabase"
            maxLength={80}
            className="w-full pl-28 pr-4 py-3 rounded-lg bg-slate-900 border border-slate-700 focus:border-sky-500 focus:outline-none text-gray-100 font-mono text-sm placeholder-gray-600"
            disabled={status === "submitting"}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="cb-thesis"
          className="text-xs font-medium text-gray-300 uppercase tracking-wider"
        >
          One-line thesis
        </label>
        <textarea
          id="cb-thesis"
          value={thesis}
          onChange={(e) => setThesis(e.target.value)}
          placeholder="Why this org, in one sentence. (e.g. 'Hiring spike + 3 new infra repos + LinkedIn says they hired a fundraise advisor')"
          maxLength={300}
          rows={2}
          className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 focus:border-sky-500 focus:outline-none text-gray-100 text-sm placeholder-gray-600 resize-y"
          disabled={status === "submitting"}
        />
        <p className="text-gray-500 text-xs">
          {thesis.length}/300. Public on the leaderboard.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-baseline pt-1">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 disabled:cursor-wait text-slate-950 font-semibold text-base transition-colors"
        >
          {status === "submitting" ? "Submitting…" : "Predict — 90-day window"}
        </button>
        <p className="text-gray-500 text-xs leading-relaxed">
          One pick per email per week. We grade post-hoc against public
          funding news.
        </p>
      </div>

      {status === "error" && message ? (
        <p className="text-rose-400 text-sm" role="alert">
          {message}
        </p>
      ) : null}
    </form>
  );
}
