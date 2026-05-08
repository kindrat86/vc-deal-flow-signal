"use client";

import { useState } from "react";

// Brunson DotCom Secrets Ch 14 — Lead "Squeeze" Funnels.
// Russell-Brunson HSO audit 2026-05-08 flagged that the home hero
// (ThreeDoorHero) gave equal weight to three CTAs — diluting the
// single-purpose squeeze. This client component is the home-page
// variant of /squeeze SqueezeForm, attribution-tagged source="home"
// so the home squeeze and the dedicated /squeeze page split-bucket
// in PostHog. Same /api/subscribe endpoint, same soap-opera cohort,
// same Resend audience — only the source UTM differs.

type Status = "idle" | "submitting" | "success" | "error";

const ROUTES: { value: string; label: string }[] = [
  { value: "F", label: "I write angel cheques (€5k–€50k)" },
  { value: "T", label: "I run a small fund or syndicate (Pre-seed/Seed)" },
  { value: "D", label: "I'm an operator who occasionally writes cheques" },
  { value: "I", label: "Something else / just curious" },
];

export default function HomeSqueezeForm() {
  const [email, setEmail] = useState("");
  const [route, setRoute] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errMsg, setErrMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !route) return;
    setStatus("submitting");
    setErrMsg("");
    const label = ROUTES.find((r) => r.value === route)?.label || "";
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          quiz_route: route,
          quiz_route_label: label,
          cohort: "soap-opera",
          source: "home",
          utm_source: "home",
          utm_medium: "hero",
          utm_campaign: "home-squeeze-2026",
          landing_path: "/",
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
    return (
      <div className="rounded-xl border border-emerald-700/40 bg-emerald-950/30 p-6 sm:p-8 space-y-3">
        <p className="text-emerald-300 text-xs font-semibold uppercase tracking-[0.14em]">
          Check your inbox
        </p>
        <h3 className="text-gray-100 font-semibold text-2xl leading-tight">
          One last step.
        </h3>
        <p className="text-gray-200 text-base leading-relaxed">
          We just sent a confirmation link to{" "}
          <strong className="text-emerald-200">{email}</strong>. Click
          it and you&rsquo;ll get the first Sunday digest within 30
          minutes — including this week&rsquo;s 5 breakout candidates
          ranked by 14-day commit-velocity acceleration.
        </p>
        <p className="text-gray-400 text-sm leading-relaxed">
          If you don&rsquo;t see it in 5 minutes, check spam / Promotions
          tab. The sender is{" "}
          <code className="text-emerald-200 bg-emerald-900/40 px-1.5 py-0.5 rounded text-xs">
            signal@gitdealflow.com
          </code>
          .
        </p>
      </div>
    );
  }

  const submitting = status === "submitting";

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-xl border-2 border-sky-600/50 bg-gradient-to-br from-sky-950/40 via-slate-950 to-slate-950 p-6 sm:p-8 shadow-lg shadow-sky-900/30"
    >
      <div className="space-y-1">
        <label
          htmlFor="home-squeeze-route"
          className="text-sky-300 text-xs font-semibold uppercase tracking-[0.14em]"
        >
          Step 1 — pick the one that fits
        </label>
        <select
          id="home-squeeze-route"
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
          htmlFor="home-squeeze-email"
          className="text-sky-300 text-xs font-semibold uppercase tracking-[0.14em]"
        >
          Step 2 — where to send Sunday&rsquo;s 5
        </label>
        <input
          id="home-squeeze-email"
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
        className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-sky-600 hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-3.5 text-white text-base font-semibold transition-colors shadow-sm shadow-sky-500/30"
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
