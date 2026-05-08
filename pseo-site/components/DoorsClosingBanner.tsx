"use client";

/**
 * Brunson Live-Replay — phase-aware close banner inserted ABOVE the final
 * Stripe CTA. Three states:
 *
 *   fast-action → emerald-tinted "live now, founding rate locks" line.
 *   last-hours  → rose-tinted "doors closing tonight" with seconds-counter.
 *   closed      → slate "doors closed, get on the list" with countdown to
 *                 next Monday 06:00 UTC.
 *
 * Why it's separate from `LiveReplayBar`: that's the sticky chrome.
 * This is the *inline* in-flow conversion accelerant right before the CTA,
 * so the buyer's eye lands on the deadline at the moment of decision.
 *
 * Stripe link stays a normal anchor (server-rendered) — we re-frame it via
 * copy, we don't break the funnel for closed-cart visitors.
 */

import { useEffect, useState } from "react";
import {
  getReplayWindow,
  type ReplayPhase,
  type ReplayWindowSnapshot,
} from "@/lib/replay-window";

interface Props {
  initialWindow: ReplayWindowSnapshot;
}

function formatRemaining(deadline: Date, now: Date): string {
  const ms = Math.max(0, deadline.getTime() - now.getTime());
  const totalSec = Math.floor(ms / 1000);
  const d = Math.floor(totalSec / 86_400);
  const h = Math.floor((totalSec % 86_400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (d > 0)
    return `${d}d ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

interface LiveSnapshot {
  phase: ReplayPhase;
  deadline: Date;
  remaining: string;
}

export function DoorsClosingBanner({ initialWindow }: Props) {
  const [live, setLive] = useState<LiveSnapshot | null>(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const w = getReplayWindow(now);
      setLive({
        phase: w.phase,
        deadline: w.deadline,
        remaining: formatRemaining(w.deadline, now),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const phase = live?.phase ?? initialWindow.phase;
  const remaining = live?.remaining ?? "—";

  if (phase === "closed") {
    return (
      <div
        role="note"
        aria-label="Doors closed — next cohort opens Monday"
        className="rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 sm:px-5 sm:py-4 flex items-center gap-3 flex-wrap"
      >
        <span
          aria-hidden="true"
          className="shrink-0 w-2 h-2 rounded-full bg-slate-500"
        />
        <p className="text-slate-200 text-sm leading-snug flex-1 min-w-0">
          <strong className="text-slate-100">Doors closed.</strong> The
          €9.97 founding-member checkout opens again in{" "}
          <span className="font-mono text-slate-100 font-semibold tabular-nums">
            {remaining}
          </span>{" "}
          (Monday 06:00 UTC). Free Acceleration Watch signup below stays
          open.
        </p>
      </div>
    );
  }

  if (phase === "last-hours") {
    return (
      <div
        role="alert"
        aria-label="Doors closing tonight"
        className="rounded-lg border border-rose-500/50 bg-rose-950/40 px-4 py-3 sm:px-5 sm:py-4 flex items-center gap-3 flex-wrap"
      >
        <span
          aria-hidden="true"
          className="shrink-0 w-2 h-2 rounded-full bg-rose-400 animate-pulse"
        />
        <p className="text-rose-100 text-sm leading-snug flex-1 min-w-0">
          <strong className="text-white">Doors closing tonight.</strong>{" "}
          Cart closes in{" "}
          <span className="font-mono text-white font-semibold tabular-nums">
            {remaining}
          </span>{" "}
          (Thursday 23:59 UTC). Tomorrow the €9.97 link returns the
          waitlist screen until Monday.
        </p>
      </div>
    );
  }

  // fast-action
  return (
    <div
      role="note"
      aria-label="Fast-action window"
      className="rounded-lg border border-emerald-500/40 bg-emerald-950/30 px-4 py-3 sm:px-5 sm:py-4 flex items-center gap-3 flex-wrap"
    >
      <span
        aria-hidden="true"
        className="shrink-0 w-2 h-2 rounded-full bg-emerald-400"
      />
      <p className="text-emerald-100 text-sm leading-snug flex-1 min-w-0">
        <strong className="text-white">Live replay open.</strong>{" "}
        Fast-action bonuses (same-week Sweep slot + rate-ratchet + 12
        archived digests) drop off in{" "}
        <span className="font-mono text-white font-semibold tabular-nums">
          {remaining}
        </span>
        . Cart itself closes 24 hours later — Thursday 23:59 UTC.
      </p>
    </div>
  );
}
