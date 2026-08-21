"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export default function LeadMagnetForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError("");
    try {
      const params = new URLSearchParams(window.location.search);
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          cohort: "lead-magnet",
          source: "velocity-verdict",
          utm_source: params.get("utm_source") || "direct",
          utm_medium: params.get("utm_medium") || "landing",
          utm_campaign: params.get("utm_campaign") || "velocity-verdict-2026",
          utm_content: params.get("utm_content") || "velocity-verdict",
          referrer: document.referrer,
          landing_path: "/lead-magnet",
        }),
      });
      if (!response.ok) throw new Error("Could not send the confirmation email.");
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Network error. Please try again.");
    }
  }

  if (status === "sent") {
    return <div className="rounded-xl border border-emerald-700/40 bg-emerald-950/30 p-6 text-left"><p className="text-emerald-300 text-sm font-semibold uppercase tracking-wider">Check your inbox</p><p className="mt-2 text-gray-100">Confirm your email and the Velocity Verdict arrives straight after.</p></div>;
  }

  return <form onSubmit={submit} className="rounded-xl border border-sky-700/40 bg-sky-950/20 p-5 sm:p-6"><label htmlFor="velocity-verdict-email" className="block text-sm font-medium text-gray-100">Where should we send it?</label><div className="mt-3 flex flex-col gap-3 sm:flex-row"><input id="velocity-verdict-email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@fund.com" className="min-w-0 flex-1 rounded-md border border-slate-700 bg-slate-950 px-4 py-3 text-gray-100 placeholder:text-gray-500 focus:outline-none focus:border-sky-500"/><button type="submit" disabled={status === "sending"} className="rounded-md bg-signal-500 px-5 py-3 font-semibold text-slate-950 disabled:opacity-60">{status === "sending" ? "Sending..." : "Get the Verdict"}</button></div>{error ? <p className="mt-3 text-sm text-rose-400">{error}</p> : null}<p className="mt-3 text-xs leading-relaxed text-gray-400">Free. One confirmation email first. Then the cheat sheet and the Sunday Signal. Unsubscribe in one click.</p></form>;
}
