"use client";

import { useEffect, useState } from "react";

const reasons = [
  ["not_using", "I'm not using it"],
  ["too_expensive", "Too expensive"],
  ["too_complex", "Too complex"],
  ["missing_features", "Missing features"],
  ["switched_service", "Switched service"],
  ["low_quality", "Low quality"],
  ["other", "Other"],
] as const;

type Reason = (typeof reasons)[number][0];

type Result = { message: string; portalUrl?: string };

export default function CancelFlow() {
  const [reason, setReason] = useState<Reason | null>(null);
  const [sector, setSector] = useState("");
  const [geography, setGeography] = useState("");
  const [checkSize, setCheckSize] = useState("");
  const [thesis, setThesis] = useState("");
  const [feedback, setFeedback] = useState("");
  const [stayReason, setStayReason] = useState("");
  const [followUpOk, setFollowUpOk] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    void fetch("/api/cancel", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "start" }) });
  }, []);

  async function send(action: "accept_save" | "continue") {
    if (!reason) return;
    setBusy(true);
    setResult(null);
    try {
      const response = await fetch("/api/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reason, sector, geography, checkSize, thesis, feedback, stayReason, followUpOk }),
      });
      const body = await response.json() as Result & { error?: string };
      if (!response.ok) throw new Error(body.error || "That did not work. Please try again.");
      if (body.portalUrl) window.location.assign(body.portalUrl);
      else setResult(body);
    } catch (error) {
      setResult({ message: error instanceof Error ? error.message : "That did not work. Please try again." });
    } finally {
      setBusy(false);
    }
  }

  const tailored = reason === "too_complex" || reason === "missing_features";
  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:py-20">
      <p className="text-sm font-semibold uppercase tracking-widest text-sky-300">Before you cancel</p>
      <h1 className="mt-3 text-3xl font-bold text-gray-100">What would make GitDealFlow useful again?</h1>
      <p className="mt-3 text-gray-400">Choose the closest reason. You can still continue to Stripe and cancel at the end of this period.</p>

      <fieldset className="mt-8 space-y-3">
        <legend className="sr-only">Cancellation reason</legend>
        {reasons.map(([value, label]) => (
          <label key={value} className={`flex cursor-pointer items-center rounded-lg border px-4 py-3 transition ${reason === value ? "border-sky-400 bg-sky-950/40" : "border-slate-700 bg-slate-900/40 hover:border-slate-500"}`}>
            <input type="radio" name="reason" value={value} checked={reason === value} onChange={() => setReason(value)} className="mr-3" />
            <span className="text-sm text-gray-100">{label}</span>
          </label>
        ))}
      </fieldset>

      {reason === "not_using" && (
        <section className="mt-6 rounded-xl border border-sky-500/30 bg-sky-950/20 p-5">
          <h2 className="font-semibold text-sky-200">Pause for 30 days</h2>
          <p className="mt-2 text-sm leading-6 text-gray-300">We will pause billing for 30 days. Before access restarts, we will email one current signal in the sector you choose.</p>
          <label className="mt-4 block text-sm text-gray-200">Sector for that signal<input value={sector} onChange={(event) => setSector(event.target.value)} className="mt-2 w-full rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-gray-100" placeholder="For example, fintech or developer tools" /></label>
          <button disabled={busy || !sector.trim()} onClick={() => void send("accept_save")} className="mt-4 rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50">Pause 30 days</button>
        </section>
      )}

      {reason === "too_expensive" && (
        <section className="mt-6 rounded-xl border border-sky-500/30 bg-sky-950/20 p-5">
          <h2 className="font-semibold text-sky-200">One month at €37</h2>
          <p className="mt-2 text-sm leading-6 text-gray-300">Use GitDealFlow for one more month at €37. After that, the subscription returns to €49 per month. This is a one-time save, not a permanent discount.</p>
          <button disabled={busy} onClick={() => void send("accept_save")} className="mt-4 rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50">Use one month at €37</button>
        </section>
      )}

      {tailored && (
        <section className="mt-6 rounded-xl border border-sky-500/30 bg-sky-950/20 p-5">
          <h2 className="font-semibold text-sky-200">Get one tailored starting point</h2>
          <p className="mt-2 text-sm text-gray-300">Tell us what you are trying to find. We will send one starting point instead of asking you to search the whole panel.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input value={sector} onChange={(event) => setSector(event.target.value)} className="rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-gray-100" placeholder="Sector" />
            <input value={geography} onChange={(event) => setGeography(event.target.value)} className="rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-gray-100" placeholder="Geography" />
            <input value={checkSize} onChange={(event) => setCheckSize(event.target.value)} className="rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-gray-100" placeholder="Check size" />
            <input value={thesis} onChange={(event) => setThesis(event.target.value)} className="rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-gray-100" placeholder="Thesis" />
          </div>
          <button disabled={busy || !sector.trim()} onClick={() => void send("accept_save")} className="mt-4 rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50">Send my starting point</button>
        </section>
      )}

      {reason && (
        <section className="mt-6 space-y-5 rounded-xl border border-slate-700 bg-slate-900/40 p-5">
          <label className="block text-sm font-medium text-gray-200">What should we improve? Optional.<textarea value={feedback} onChange={(event) => setFeedback(event.target.value)} className="mt-2 min-h-24 w-full rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-gray-100" maxLength={2000} /></label>
          <label className="block text-sm font-medium text-gray-200">What would have made you stay for one more month? Optional.<textarea value={stayReason} onChange={(event) => setStayReason(event.target.value)} className="mt-2 min-h-24 w-full rounded-md border border-slate-600 bg-slate-950 px-3 py-2 text-gray-100" maxLength={2000} /></label>
          <label className="flex gap-3 text-sm text-gray-300"><input type="checkbox" checked={followUpOk} onChange={(event) => setFollowUpOk(event.target.checked)} /> May we ask two follow-up questions?</label>
          <p className="text-sm text-gray-400">There is no pressure. You can cancel cleanly below.</p>
        </section>
      )}

      {result && <p role="status" className="mt-5 rounded-md border border-sky-500/30 bg-sky-950/20 p-3 text-sm text-sky-100">{result.message}</p>}
      <button disabled={busy || !reason} onClick={() => void send("continue")} className="mt-8 w-full rounded-md border border-slate-500 px-4 py-3 text-sm font-semibold text-gray-100 transition hover:border-slate-300 disabled:opacity-50">Continue cancelling</button>
      <a href="/dashboard" className="mt-4 block text-center text-sm text-sky-300 hover:text-sky-200">Keep my subscription</a>
    </main>
  );
}
