"use client";

import { useState } from "react";

type GateState = "idle" | "submitting" | "captured" | "error";

interface ShareGateProps {
  username: string;
  twitterShare: string;
  linkedinShare: string;
}

/**
 * Brunson-style share gate. Default state shows share buttons inline so
 * we don't slow down a hot moment, but also surfaces a one-line email
 * capture box that — if filled — subscribes the visitor to the free
 * Sunday digest. Skipping is allowed (anti-friction). The capture is
 * optional; the share is not paywalled.
 */
export default function ShareGate({
  username,
  twitterShare,
  linkedinShare,
}: ShareGateProps) {
  const [email, setEmail] = useState("");
  const [gate, setGate] = useState<GateState>("idle");
  const [err, setErr] = useState<string | null>(null);

  async function captureEmail(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErr("Please use a valid email.");
      return;
    }
    setGate("submitting");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          source: "receipts-share",
          utm_source: `receipts-${username}`,
        }),
      });
      if (!res.ok && res.status >= 500) {
        throw new Error("Subscribe service unavailable");
      }
      setGate("captured");
    } catch (error) {
      setErr(
        error instanceof Error
          ? error.message
          : "Subscribe failed — share buttons still work below.",
      );
      setGate("error");
    }
  }

  return (
    <div className="space-y-3">
      {/* Share buttons — always visible, never paywalled */}
      <div className="flex gap-2">
        <a
          href={twitterShare}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm text-gray-300 transition"
          onClick={() => {
            // Soft tracking: most analytics handlers will pick this up via
            // standard click events without us wiring anything bespoke.
            if (gate === "idle") setGate("idle");
          }}
        >
          Share on X
        </a>
        <a
          href={linkedinShare}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm text-gray-300 transition"
        >
          Share on LinkedIn
        </a>
      </div>

      {/* Capture nudge — invites email but does not block share */}
      {gate === "captured" ? (
        <p className="text-emerald-400 text-xs">
          Subscribed ✓ — Sunday digest lands in 30 minutes.
        </p>
      ) : (
        <form
          onSubmit={captureEmail}
          className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-baseline"
          aria-label="Optional Sunday-digest signup"
        >
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email me my badge + Sunday digest"
            maxLength={200}
            className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 focus:border-sky-500 focus:outline-none text-gray-100 text-xs placeholder-gray-600 min-w-0"
            disabled={gate === "submitting"}
          />
          <button
            type="submit"
            disabled={gate === "submitting"}
            className="px-3 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:bg-slate-700 disabled:cursor-wait text-white text-xs font-medium transition-colors whitespace-nowrap"
          >
            {gate === "submitting" ? "Sending…" : "Email it →"}
          </button>
        </form>
      )}
      {err ? (
        <p className="text-rose-400 text-xs" role="alert">
          {err}
        </p>
      ) : null}
    </div>
  );
}
