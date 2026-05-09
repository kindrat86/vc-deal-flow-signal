"use client";

import { useEffect, useState } from "react";
import { deconstructDuration } from "@/lib/stadium-pitch-schedule";

/**
 * Stadium Pitch — live countdown ticker.
 *
 * Pure client component. SSR renders nothing (placeholder skeleton); on
 * mount, hydrates with the live countdown to `targetIso` and re-renders
 * every second.
 *
 * Used inside StadiumPitchHero. Decoupled so the parent can re-target the
 * countdown when the drop phase transitions live → replay.
 */

type Props = {
  /** ISO 8601 timestamp of the moment we're counting down to. */
  targetIso: string;
  /** Optional accent class — overrides the default sky-400 for live state. */
  accentClass?: string;
  /** Compact mode — single line, smaller numbers. */
  compact?: boolean;
};

export default function StadiumPitchCountdown({
  targetIso,
  accentClass = "text-sky-300",
  compact = false,
}: Props) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // SSR / first-paint placeholder. Reserve the layout space so hydration
  // doesn't shift the page.
  if (now === null) {
    return (
      <div
        aria-hidden="true"
        className={
          compact
            ? "h-5 w-44 rounded bg-slate-800/40"
            : "h-12 w-full max-w-md rounded bg-slate-800/40"
        }
      />
    );
  }

  const target = new Date(targetIso).getTime();
  const ms = target - now;
  const { days, hours, minutes, seconds } = deconstructDuration(ms);

  if (compact) {
    return (
      <span className={`tabular-nums font-semibold ${accentClass}`}>
        {days > 0 ? `${days}d ` : ""}
        {String(hours).padStart(2, "0")}h {String(minutes).padStart(2, "0")}m{" "}
        {String(seconds).padStart(2, "0")}s
      </span>
    );
  }

  return (
    <div
      className="grid grid-cols-4 gap-3 max-w-md"
      role="timer"
      aria-live="polite"
      aria-label="Time until next Stadium Pitch drop"
    >
      <CountUnit value={days} label="days" accent={accentClass} />
      <CountUnit value={hours} label="hours" accent={accentClass} />
      <CountUnit value={minutes} label="minutes" accent={accentClass} />
      <CountUnit value={seconds} label="seconds" accent={accentClass} />
    </div>
  );
}

function CountUnit({
  value,
  label,
  accent,
}: {
  value: number;
  label: string;
  accent: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-slate-800 bg-slate-900/60 py-2 px-1">
      <span className={`tabular-nums text-2xl sm:text-3xl font-bold ${accent}`}>
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] uppercase tracking-wider text-slate-400 mt-0.5">
        {label}
      </span>
    </div>
  );
}
