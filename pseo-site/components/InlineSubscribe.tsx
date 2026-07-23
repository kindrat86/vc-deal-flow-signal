"use client";

import { useState, useCallback } from "react";

// Single-email capture for content pages. POSTs to same-domain /api/subscribe
// with source = current page path + template property. The existing
// cross-domain CTAs remain — this is IN ADDITION, capturing readers who
// won't click through to gitdealflow.com.

type Status = "idle" | "submitting" | "success" | "error";

interface Props {
  template: string; // e.g. "startup", "answers", "compare", etc.
  source?: string; // default: window.location.pathname
}

export default function InlineSubscribe({ template, source }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errMsg, setErrMsg] = useState("");

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email) return;
      setStatus("submitting");
      setErrMsg("");
      const path = source || (typeof window !== "undefined" ? window.location.pathname : "/");

      try {
        const res = await fetch("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            cohort: "soap-opera",
            source: path,
            template,
            landing_path: path,
            referrer:
              typeof document !== "undefined" ? document.referrer : "",
          }),
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `HTTP ${res.status}`);
        }

        // Fire PostHog custom event
        if (typeof window !== "undefined" && (window as any).posthog) {
          (window as any).posthog.capture("signals_inline_subscribed", {
            template,
            path,
          });
        }

        setStatus("success");
      } catch (err) {
        setStatus("error");
        setErrMsg(err instanceof Error ? err.message : "Network error");
      }
    },
    [email, template, source],
  );

  if (status === "success") {
    return (
      <div className="rounded-xl border border-emerald-700/40 bg-emerald-950/30 p-6 sm:p-8 text-center">
        <p className="text-emerald-300 text-sm font-semibold uppercase tracking-[0.14em] mb-2">
          You&rsquo;re in
        </p>
        <p className="text-gray-100 text-lg font-semibold mb-1">
          Check your inbox to confirm
        </p>
        <p className="text-gray-400 text-sm">
          We sent a confirmation email to <strong className="text-emerald-200 break-all">{email}</strong>.
          Click the link inside to complete your subscription.
        </p>
      </div>
    );
  }

  return (
    <section
      aria-label="Get the free Sunday digest"
      className="rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6 sm:p-8"
    >
      <h2 className="text-gray-100 font-semibold text-lg sm:text-xl mb-2 leading-snug">
        Five breakout startups, every Sunday
      </h2>
      <p className="text-gray-400 text-sm leading-relaxed mb-5 max-w-2xl">
        The free Acceleration Watch: five venture-backed teams accelerating on
        the engineering signal, translated into plain English — 21 to 47 days
        before the deck circulates. No code-reading, no card.
      </p>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="inline-sub-email" className="sr-only">
            Email address
          </label>
          <input
            id="inline-sub-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "submitting"}
            autoComplete="email"
            placeholder="you@yourfund.com"
            className="block w-full rounded-md border border-slate-700 bg-slate-900 text-gray-100 text-base px-3 py-2.5 placeholder:text-gray-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:opacity-50"
          />
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <button
            type="submit"
            disabled={status === "submitting" || !email}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-[#ff6b1a] hover:bg-[#ff8c4d] disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 text-sm font-semibold transition-colors shadow-sm shadow-[#ff6b1a]/30"
          >
            {status === "submitting"
              ? "Sending confirmation…"
              : "Get the free Sunday issue →"}
          </button>
          <a
            href="https://gitdealflow.com/report"
            className="text-gray-400 hover:text-gray-300 text-xs underline decoration-dotted underline-offset-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            See a sample issue →
          </a>
        </div>
        {status === "error" && (
          <p className="text-rose-400 text-sm" role="alert">
            {errMsg || "Couldn't reach the signup endpoint. Please try again."}
          </p>
        )}
        <p className="text-gray-500 text-xs leading-relaxed">
          Free forever. One email a week. Unsubscribe with one click.
        </p>
      </form>
    </section>
  );
}
