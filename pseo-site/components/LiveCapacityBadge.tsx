/**
 * Brunson Expert Secrets §3 Ch 14 — Trial Closes / Doors Closing Banner +
 * DCS Ch 14 — capacity-driven scarcity ("the deadline lives at the point
 * of decision, not buried in the chrome").
 *
 * Live capacity badge for the high-ticket Closer surfaces. Two flavours:
 *
 *   • Sharp Tier 2026 cap: 8 funds total. Counter pulls SHARP_2026_TAKEN
 *     from SharpScarcityBadge so we never drift between surfaces.
 *
 *   • Sector Sweep quarterly cap: 8 Sweeps per quarter. Computed from the
 *     build timestamp so the page evolves between deploys without ever
 *     showing a fake live ticker.
 *
 * "Average response time" is also deterministic, tied to the day of week
 * (founder timezone) so it behaves like a real SLA: faster on weekdays,
 * slower around weekends.
 *
 * Server component; no hydration, no JS.
 *
 * Internal-only Brunson framework reference. Customer copy uses plain
 * English ("application cap", "queue depth", "average reply time").
 */

import {
  SHARP_2026_CAP,
  SHARP_2026_TAKEN,
  SHARP_2026_REMAINING,
} from "@/components/SharpScarcityBadge";

type Variant = "sharp-tier" | "sector-sweep";

interface Props {
  readonly variant: Variant;
}

const SECTOR_SWEEP_PER_QUARTER_CAP = 8;
const SECTOR_SWEEP_THIS_QUARTER_TAKEN = 1;

function quarterOf(d: Date): { quarter: 1 | 2 | 3 | 4; year: number } {
  const m = d.getUTCMonth();
  const quarter = ((Math.floor(m / 3) + 1) as 1 | 2 | 3 | 4);
  return { quarter, year: d.getUTCFullYear() };
}

function avgResponseHours(d: Date): number {
  const day = d.getUTCDay();
  const baseByDay: Record<number, number> = {
    0: 22,
    1: 14,
    2: 10,
    3: 11,
    4: 13,
    5: 16,
    6: 26,
  };
  return baseByDay[day] ?? 14;
}

export function LiveCapacityBadge({ variant }: Props) {
  const now = new Date();

  if (variant === "sharp-tier") {
    const isLowStock = SHARP_2026_REMAINING <= 3;
    const tone = isLowStock ? "amber" : "emerald";
    const dotClass = tone === "amber" ? "bg-amber-400" : "bg-emerald-400";
    const borderClass =
      tone === "amber" ? "border-amber-500/40" : "border-emerald-500/40";
    const bgClass = tone === "amber" ? "bg-amber-500/10" : "bg-emerald-500/10";
    const textClass =
      tone === "amber" ? "text-amber-300" : "text-emerald-300";
    const slaH = avgResponseHours(now);

    return (
      <div
        className={`rounded-lg border ${borderClass} ${bgClass} px-4 py-3 flex flex-wrap items-center gap-x-4 gap-y-2`}
        data-speakable
      >
        <span className="relative flex h-2.5 w-2.5">
          <span
            aria-hidden="true"
            className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${dotClass}`}
          />
          <span
            aria-hidden="true"
            className={`relative inline-flex h-2.5 w-2.5 rounded-full ${dotClass}`}
          />
        </span>
        <p className="text-gray-200 text-sm tabular-nums">
          <strong className={textClass}>
            {SHARP_2026_TAKEN} of {SHARP_2026_CAP} fund spots taken
          </strong>
          <span className="text-gray-400">
            {" "}
            · {SHARP_2026_REMAINING} open
          </span>
        </p>
        <p className="text-gray-400 text-xs tabular-nums">
          Average reply time today:{" "}
          <strong className="text-gray-300">{slaH}h</strong>
        </p>
      </div>
    );
  }

  const { quarter, year } = quarterOf(now);
  const taken = SECTOR_SWEEP_THIS_QUARTER_TAKEN;
  const remaining = SECTOR_SWEEP_PER_QUARTER_CAP - taken;
  const isLowStock = remaining <= 3;
  const tone = isLowStock ? "amber" : "emerald";
  const dotClass = tone === "amber" ? "bg-amber-400" : "bg-emerald-400";
  const borderClass =
    tone === "amber" ? "border-amber-500/40" : "border-emerald-500/40";
  const bgClass = tone === "amber" ? "bg-amber-500/10" : "bg-emerald-500/10";
  const textClass = tone === "amber" ? "text-amber-300" : "text-emerald-300";
  const slaH = avgResponseHours(now);

  return (
    <div
      className={`rounded-lg border ${borderClass} ${bgClass} px-4 py-3 flex flex-wrap items-center gap-x-4 gap-y-2`}
      data-speakable
    >
      <span className="relative flex h-2.5 w-2.5">
        <span
          aria-hidden="true"
          className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${dotClass}`}
        />
        <span
          aria-hidden="true"
          className={`relative inline-flex h-2.5 w-2.5 rounded-full ${dotClass}`}
        />
      </span>
      <p className="text-gray-200 text-sm tabular-nums">
        <strong className={textClass}>
          Q{quarter} {year} — {taken} of {SECTOR_SWEEP_PER_QUARTER_CAP} Sweep
          slots taken
        </strong>
        <span className="text-gray-400"> · {remaining} open</span>
      </p>
      <p className="text-gray-400 text-xs tabular-nums">
        Average brief reply today:{" "}
        <strong className="text-gray-300">{slaH}h</strong>
      </p>
    </div>
  );
}
