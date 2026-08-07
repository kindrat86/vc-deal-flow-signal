"use client";

import { useState } from "react";
import SqueezeSuccess from "@/components/SqueezeSuccess";

type Status = "idle" | "submitting" | "success" | "error";

const ROUTES: { value: string; label: string }[] = [
  { value: "F", label: "I write angel cheques (€5k–€50k)" },
  { value: "T", label: "I run a small fund or syndicate (Pre-seed/Seed)" },
  { value: "D", label: "I'm an operator who occasionally writes cheques" },
  { value: "I", label: "Something else / just curious" },
];

export default function SqueezeForm() {
  const [email, setEmail] = useState("");
  const [route, setRoute] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errMsg, setErrMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !route) return;
    setStatus("submitting");
    setErrMsg("");
    const label =
      ROUTES.find((r) => r.value === route)?.label || "";
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          quiz_route: route,
          quiz_route_label: label,
          cohort: "soap-opera",
          source: "squeeze",
          utm_source: "squeeze",
          utm_medium: "landing",
          utm_campaign: "squeeze-2026",
          landing_path: "/squeeze",
          referrer:
            typeof document !== "undefined" ? document.referrer : "",
        }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `HTTP ${res.status}`);
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrMsg(err instanceof Error ? err.message : "Network error");
    }
  }

  if (status === "success") {
    return <SqueezeSuccess email={email} route={route} />;
  }

  const submitting = status === "submitting";

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-xl border border-sky-700/40 bg-gradient-to-br from-sky-950/30 via-slate-950 to-slate-950 p-6 sm:p-8"
    >
      <div className="space-y-1">
        <label
          htmlFor="squeeze-route"
          className="text-sky-300 text-xs font-semibold uppercase tracking-[0.14em]"
        >
          Step 1 — pick the one that fits
        </label>
        <select
          id="squeeze-route"
          required
          value={route}
          onChange={(e) => setRoute(e.target.value)}
          disabled={submitting}
          className="block w-full rounded-md border border-slate-700 bg-slate-900 text-gray-100 text-base px-3 py-2.5 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:opacity-50"
        >
          <option value="" disabled>
            — select your investor type —
          </option>
          {ROUTES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1">
        <label
          htmlFor="squeeze-email"
          className="text-sky-300 text-xs font-semibold uppercase tracking-[0.14em]"
        >
          Step 2 — where to send Sunday&rsquo;s 5
        </label>
        <input
          id="squeeze-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting}
          autoComplete="email"
          placeholder="you@yourfund.com"
          className="block w-full rounded-md border border-slate-700 bg-slate-900 text-gray-100 text-base px-3 py-2.5 placeholder:text-gray-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:opacity-50"
        />
      </div>
      <button
        type="submit"
        disabled={submitting || !email || !route}
        className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-signal-500 hover:bg-signal-600 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-3 text-slate-950 text-base font-semibold transition-colors shadow-sm shadow-signal-500/30"
      >
        {submitting ? "Sending confirmation…" : "Send me Sunday's 5 →"}
      </button>
      <p className="text-gray-400 text-xs leading-relaxed">
        Free forever. One email a week. Unsubscribe with one click. We
        never sell or share your email — see{" "}
        <a
          href="/.well-known/security.txt"
          className="text-gray-400 underline decoration-dotted underline-offset-2 hover:text-gray-300"
        >
          security.txt
        </a>
        .
      </p>
      {status === "error" && (
        <p className="text-rose-400 text-sm" role="alert">
          {errMsg ||
            "Couldn't reach the signup endpoint. Please try again."}
        </p>
      )}
    </form>
  );
}
