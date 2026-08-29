"use client";

import { FormEvent, useState } from "react";

export default function SupportForm() {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setStatus("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/customer-voice", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: "support", email: form.get("email"), topic: form.get("topic"), message: form.get("message"), website: form.get("website"), source: "support-page" }) });
      const body = await response.json() as { error?: string };
      if (!response.ok) throw new Error(body.error || "Could not send your request.");
      event.currentTarget.reset(); setStatus("Received. A human will reply within 1 business day.");
    } catch (error) { setStatus(error instanceof Error ? error.message : "Could not send your request."); }
    finally { setBusy(false); }
  }
  return <form onSubmit={submit} className="mt-8 space-y-5 rounded-xl border border-slate-700 bg-slate-900/60 p-6">
    <label className="block text-sm font-medium">Reply email<input required type="email" name="email" maxLength={254} className="mt-2 w-full rounded-md border border-slate-600 bg-slate-950 px-3 py-2" /></label>
    <label className="block text-sm font-medium">Topic<select required name="topic" defaultValue="" className="mt-2 w-full rounded-md border border-slate-600 bg-slate-950 px-3 py-2"><option value="" disabled>Choose one</option><option value="billing">Billing</option><option value="login">Login</option><option value="data_quality">Data or signal quality</option><option value="newsletter">Newsletter delivery</option><option value="other">Other</option></select></label>
    <label className="block text-sm font-medium">What happened?<textarea required name="message" maxLength={4000} className="mt-2 min-h-32 w-full rounded-md border border-slate-600 bg-slate-950 px-3 py-2" /></label>
    <input tabIndex={-1} autoComplete="off" name="website" className="hidden" aria-hidden="true" />
    <button disabled={busy} className="rounded-md bg-sky-500 px-5 py-3 font-semibold text-slate-950 disabled:opacity-50">{busy ? "Sending..." : "Send support request"}</button>
    {status && <p role="status" className="text-sm text-sky-200">{status}</p>}
  </form>;
}
