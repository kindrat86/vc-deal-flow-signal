"use client";

/**
 * Brunson Live-Replay Pressure, sticky top bar with cohort countdown.
 *
 * Initial render: server-passed snapshot (build-time state). Hydration: live
 * Date.now() inside useEffect, ticking every second. The mismatch between
 * build-time state and live state is corrected within ~16ms of mount, so SEO
 * crawlers see a coherent server-rendered bar and humans see a live counter.
 *
 * Phases drive copy + colour:
 *   fast-action → emerald, "Fast-action bonuses expire Wed 23:59 UTC"
 *   last-hours  → rose,    "Doors closing tonight, cart closes Thu 23:59 UTC"
 *   closed      → slate,   "Doors closed, next cohort opens Monday 06:00 UTC"
 */

import { useEffect, useState } from "react";
import { getReplayWindow, type ReplayWindowSnapshot } from "@/lib/replay-window";

interface Props {
  initialWindow: ReplayWindowSnapshot;
}

interface Countdown {
  d: number;
  h: number;
  m: number;
  s: number;
  totalMs: number;
}

function diffToCountdown(deadline: Date, now: Date): Countdown {
  const totalMs = Math.max(0, deadline.getTime() - now.getTime());
  const totalSec = Math.floor(totalMs / 1000);
  return {
    d: Math.floor(totalSec / 86_400),
    h: Math.floor((totalSec % 86_400) / 3600),
    m: Math.floor((totalSec % 3600) / 60),
    s: totalSec % 60,
    totalMs,
  };
}

const PHASE_THEME = {
  "fast-action": {
    ribbonClass:
      "bg-emerald-500 text-emerald-950 border-b border-emerald-600/60",
    pulseClass: "bg-emerald-900/80 text-emerald-50",
    label: "Live replay open · Fast-action bonuses expire in",
  },
  "last-hours": {
    ribbonClass: "bg-rose-500 text-rose-50 border-b border-rose-700/60",
    pulseClass: "bg-rose-900/80 text-rose-50",
    label: "Doors closing tonight · Cart closes in",
  },
  closed: {
    ribbonClass: "bg-slate-700 text-slate-100 border-b border-slate-800",
    pulseClass: "bg-slate-800 text-slate-200",
    label: "Doors closed · Next cohort opens in",
  },
} as const;

export function LiveReplayBar({ initialWindow }: Props) {
  // Hydration anchor: render initial server snapshot first, then re-compute.
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const live = now ? getReplayWindow(now) : null;

  // Choose source-of-truth: live state if hydrated, else server snapshot.
  const phase = live?.phase ?? initialWindow.phase;
  const deadline = live?.deadline ?? new Date(initialWindow.deadlineISO);
  const replayId = live?.replayId ?? initialWindow.replayId;

  const countdown = now ? diffToCountdown(deadline, now) : null;
  const theme = PHASE_THEME[phase];

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Live replay window status"
      data-replay-phase={phase}
      data-replay-id={replayId}
      className={`sticky top-0 z-40 ${theme.ribbonClass} text-center text-[12px] sm:text-[13px] font-semibold py-2 px-3 shadow-sm`}
    >
      <span className="inline-flex items-center gap-2 sm:gap-3 flex-wrap justify-center">
        <span aria-hidden="true" className="opacity-90">
          ●
        </span>
        <span>{theme.label}</span>
        <span
          className={`font-mono tabular-nums px-2 py-0.5 rounded ${theme.pulseClass} text-[11px] sm:text-[12px]`}
        >
          {countdown
            ? formatCountdown(countdown)
            : phase === "closed"
              ? "-"
              : countdown === null
                ? "-"
                : ""}
        </span>
        <span className="hidden sm:inline opacity-80 text-[11px] font-medium">
          Cohort {replayId}
        </span>
      </span>
    </div>
  );
}

function formatCountdown(c: Countdown): string {
  if (c.totalMs === 0) return "0s";
  const parts: string[] = [];
  if (c.d > 0) parts.push(`${c.d}d`);
  parts.push(String(c.h).padStart(2, "0"));
  parts.push(String(c.m).padStart(2, "0"));
  parts.push(String(c.s).padStart(2, "0"));
  // "2d 14:23:07" or "07:42:31"
  if (c.d > 0) return `${parts[0]} ${parts.slice(1).join(":")}`;
  return parts.slice(1).join(":");
}
