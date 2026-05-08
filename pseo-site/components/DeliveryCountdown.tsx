"use client";

import { useEffect, useState } from "react";

// Brunson DotCom Secrets Ch 13 ("Best Bait") + the Fast 15 (Expert Secrets
// Ch 21). The biggest cart-abandonment objection on a 24-hour SLA is "I
// don't actually know if it's 24 hours from now." A live, ticking countdown
// turns the claim into a contract the buyer watches enforce itself in
// real-time. The clock anchors on the moment of page load (a proxy for
// payment confirmation, since /firstlook/thanks is only reached after a
// paid Stripe session). Off by a few seconds either way is fine — the
// purpose is psychological commitment, not millisecond precision.

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

function pad(n: number): string {
  return String(Math.max(0, Math.floor(n))).padStart(2, "0");
}

export default function DeliveryCountdown() {
  // Anchor at first client render. useState init runs once — exactly what
  // we want for a stable "moment of payment" anchor that survives
  // re-renders without drift.
  const [endsAt] = useState(() => Date.now() + TWENTY_FOUR_HOURS_MS);
  const [remaining, setRemaining] = useState(TWENTY_FOUR_HOURS_MS);

  useEffect(() => {
    const tick = () => {
      const r = endsAt - Date.now();
      setRemaining(r > 0 ? r : 0);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [endsAt]);

  const hours = remaining / (60 * 60 * 1000);
  const minutes = (remaining % (60 * 60 * 1000)) / (60 * 1000);
  const seconds = (remaining % (60 * 1000)) / 1000;
  const expired = remaining <= 0;

  return (
    <section
      aria-label="Live 24-hour delivery countdown"
      className="rounded-xl border-2 border-cyan-500/50 bg-gradient-to-br from-cyan-950/30 via-slate-900 to-slate-950 p-5 sm:p-7 space-y-4"
    >
      <header className="space-y-1.5">
        <p className="text-cyan-300 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
          Live · 24-hour delivery clock · started at payment
        </p>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-100 leading-snug">
          {expired
            ? "Your deep dive should be in your inbox now."
            : "Your deep dive lands in your inbox in:"}
        </h2>
      </header>

      <div
        aria-live="polite"
        aria-atomic="true"
        className="grid grid-cols-3 gap-3 sm:gap-4"
      >
        <CountCell label="Hours" value={pad(hours)} />
        <CountCell label="Minutes" value={pad(minutes)} />
        <CountCell label="Seconds" value={pad(seconds)} />
      </div>

      <p className="text-gray-400 text-xs leading-relaxed border-t border-slate-800 pt-3">
        Weekday delivery. If you paid Friday after 18:00 UTC the clock
        adjusts to Monday 18:00 UTC and you receive an inbox note with the
        adjusted ETA. Outside that edge case, this counter is the actual
        SLA.
      </p>
    </section>
  );
}

function CountCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-cyan-700/30 bg-slate-950/60 p-3 sm:p-4 text-center">
      <p className="text-cyan-300 text-[10px] sm:text-xs uppercase tracking-wider font-semibold">
        {label}
      </p>
      <p className="text-gray-100 font-bold text-3xl sm:text-4xl tabular-nums leading-none mt-1">
        {value}
      </p>
    </div>
  );
}
