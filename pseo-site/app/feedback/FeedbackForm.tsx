"use client";

import { FormEvent, useState } from "react";

export default function FeedbackForm() {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setStatus("");
    const form = new FormData(event.currentTarget);
    const payload = {
      kind: "feedback",
      tryingToDo: form.get("tryingToDo"),
      blocker: form.get("blocker"),
      frequency: form.get("frequency"),
      email: form.get("email"),
      contactOk: form.get("contactOk") === "yes",
      website: form.get("website"),
      source: new URLSearchParams(window.location.search).get("source") || "feedback-page",
    };
    try {
      const response = await fetch("/api/customer-voice", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const body = await response.json() as { error?: string };
      if (!response.ok) throw new Error(body.error || "Could not save your feedback.");
      event.currentTarget.reset();
      setStatus("Saved. This now enters the weekly product review.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not save your feedback.");
    } finally { setBusy(false); }
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-6 rounded-xl border border-slate-700 bg-slate-900/60 p-6">
      <label className="block text-sm font-medium text-gray-100">What were you trying to do?<textarea required name="tryingToDo" maxLength={1500} className="mt-2 min-h-28 w-full rounded-md border border-slate-600 bg-slate-950 px-3 py-2" /></label>
      <label className="block text-sm font-medium text-gray-100">What stopped you?<textarea required name="blocker" maxLength={1500} className="mt-2 min-h-28 w-full rounded-md border border-slate-600 bg-slate-950 px-3 py-2" /></label>
      <label className="block text-sm font-medium text-gray-100">How often would you use it?<select required name="frequency" defaultValue="" className="mt-2 w-full rounded-md border border-slate-600 bg-slate-950 px-3 py-2"><option value="" disabled>Choose one</option><option value="once">Once</option><option value="monthly">Monthly</option><option value="weekly">Weekly</option><option value="every_deal">On every deal</option></select></label>
      <label className="block text-sm font-medium text-gray-100">Email, optional<input name="email" type="email" maxLength={254} className="mt-2 w-full rounded-md border border-slate-600 bg-slate-950 px-3 py-2" /></label>
      <label className="flex gap-3 text-sm text-gray-300"><input type="checkbox" name="contactOk" value="yes" /> You may contact me once about this answer.</label>
      <input tabIndex={-1} autoComplete="off" name="website" className="hidden" aria-hidden="true" />
      <button disabled={busy} className="rounded-md bg-sky-500 px-5 py-3 font-semibold text-slate-950 disabled:opacity-50">{busy ? "Saving..." : "Send feedback"}</button>
      {status && <p role="status" className="text-sm text-sky-200">{status}</p>}
    </form>
  );
}
