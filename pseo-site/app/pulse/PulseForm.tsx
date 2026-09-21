"use client";

import { FormEvent, useState } from "react";

export default function PulseForm() {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setStatus("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/customer-voice", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: "pulse", score: Number(form.get("score")), usefulLead: form.get("usefulLead"), reason: form.get("reason"), raiseOnePoint: form.get("raiseOnePoint"), email: form.get("email"), contactOk: form.get("contactOk") === "yes", website: form.get("website"), source: new URLSearchParams(window.location.search).get("source") || "pulse-page" }) });
      const body = await response.json() as { error?: string };
      if (!response.ok) throw new Error(body.error || "Could not save your answer.");
      event.currentTarget.reset(); setStatus("Saved. The score only matters with your written reason, and both enter the weekly review.");
    } catch (error) { setStatus(error instanceof Error ? error.message : "Could not save your answer."); }
    finally { setBusy(false); }
  }
  return <form onSubmit={submit} className="mt-8 space-y-6 rounded-xl border border-slate-700 bg-slate-900/60 p-6">
    <fieldset><legend className="text-sm font-medium">How likely are you to recommend GitDealFlow to another investor?</legend><div className="mt-3 flex flex-wrap gap-2">{Array.from({ length: 11 }, (_, score) => <label key={score} className="cursor-pointer rounded-md border border-slate-600 bg-slate-950 px-3 py-2"><input required type="radio" name="score" value={score} className="mr-1" />{score}</label>)}</div><p className="mt-2 text-xs text-gray-400">0 = not at all likely. 10 = extremely likely.</p></fieldset>
    <label className="block text-sm font-medium">Did you find at least one startup worth investigating?<select required name="usefulLead" defaultValue="" className="mt-2 w-full rounded-md border border-slate-600 bg-slate-950 px-3 py-2"><option value="" disabled>Choose one</option><option value="yes">Yes</option><option value="not_yet">Not yet</option><option value="no">No</option></select></label>
    <label className="block text-sm font-medium">What is the main reason for your score?<textarea required name="reason" maxLength={1500} className="mt-2 min-h-28 w-full rounded-md border border-slate-600 bg-slate-950 px-3 py-2" /></label>
    <label className="block text-sm font-medium">What would raise it by one point?<textarea required name="raiseOnePoint" maxLength={1500} className="mt-2 min-h-28 w-full rounded-md border border-slate-600 bg-slate-950 px-3 py-2" /></label>
    <label className="block text-sm font-medium">Email, optional<input type="email" name="email" maxLength={254} className="mt-2 w-full rounded-md border border-slate-600 bg-slate-950 px-3 py-2" /></label>
    <label className="flex gap-3 text-sm text-gray-300"><input type="checkbox" name="contactOk" value="yes" /> You may contact me once about this answer.</label>
    <input tabIndex={-1} autoComplete="off" name="website" className="hidden" aria-hidden="true" />
    <button disabled={busy} className="rounded-md bg-sky-500 px-5 py-3 font-semibold text-slate-950 disabled:opacity-50">{busy ? "Saving..." : "Send score and reason"}</button>
    {status && <p role="status" className="text-sm text-sky-200">{status}</p>}
  </form>;
}
