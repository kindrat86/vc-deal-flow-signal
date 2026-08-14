import Link from "next/link";

/**
 * Public scarcity counter for Sharp Tier (€497/mo, capped 8 funds in 2026).
 * Single source of truth for the "7 of 8 spots taken" claim used across
 * /, /pricing, and /apply. Update SHARP_2026_TAKEN here when a fund signs.
 */
export const SHARP_2026_CAP = 8;
export const SHARP_2026_TAKEN = 1;
export const SHARP_2026_REMAINING = SHARP_2026_CAP - SHARP_2026_TAKEN;

export interface SharpScarcityBadgeProps {
  variant?: "default" | "inline" | "card";
  showCta?: boolean;
}

export default function SharpScarcityBadge({
  variant = "default",
  showCta = true,
}: SharpScarcityBadgeProps) {
  const isLowStock = SHARP_2026_REMAINING <= 3;
  const tone = isLowStock ? "amber" : "emerald";
  const toneClasses = {
    amber: {
      border: "border-amber-500/40",
      bg: "bg-amber-500/10",
      text: "text-amber-300",
      badge: "bg-amber-500/15 text-amber-300 border-amber-500/30",
      cta: "bg-amber-500 hover:bg-amber-400 text-slate-950",
    },
    emerald: {
      border: "border-emerald-500/40",
      bg: "bg-emerald-500/10",
      text: "text-emerald-300",
      badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
      cta: "bg-emerald-500 hover:bg-emerald-400 text-slate-950",
    },
  }[tone];

  if (variant === "inline") {
    return (
      <span
        className={`inline-flex items-center gap-2 rounded-md border px-2 py-0.5 text-xs font-medium ${toneClasses.badge}`}
      >
        <span className="relative flex h-2 w-2">
          <span
            aria-hidden="true"
            className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
              isLowStock ? "bg-amber-400" : "bg-emerald-400"
            }`}
          />
          <span
            aria-hidden="true"
            className={`relative inline-flex h-2 w-2 rounded-full ${
              isLowStock ? "bg-amber-400" : "bg-emerald-400"
            }`}
          />
        </span>
        Sharp Tier 2026, {SHARP_2026_TAKEN}/{SHARP_2026_CAP} spots taken,{" "}
        {SHARP_2026_REMAINING} open
      </span>
    );
  }

  if (variant === "card") {
    return (
      <div
        className={`rounded-xl border ${toneClasses.border} ${toneClasses.bg} p-4 sm:p-5 space-y-2`}
      >
        <p
          className={`text-xs font-semibold uppercase tracking-wider ${toneClasses.text}`}
        >
          Sharp Tier · 2026 fund cohort
        </p>
        <p className="text-3xl font-bold text-gray-100 tabular-nums">
          {SHARP_2026_TAKEN}
          <span className="text-gray-400 text-xl"> / {SHARP_2026_CAP}</span>
        </p>
        <p className="text-gray-400 text-xs">
          spots taken · {SHARP_2026_REMAINING} open · application-gated · 48h response
        </p>
        {showCta ? (
          <Link
            href="/apply"
            className={`inline-flex items-center justify-center px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${toneClasses.cta}`}
          >
            Apply for Sharp Tier →
          </Link>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg border ${toneClasses.border} ${toneClasses.bg} px-4 py-3 flex flex-wrap items-center gap-3`}
    >
      <span className="relative flex h-2.5 w-2.5">
        <span
          aria-hidden="true"
          className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
            isLowStock ? "bg-amber-400" : "bg-emerald-400"
          }`}
        />
        <span
          aria-hidden="true"
          className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
            isLowStock ? "bg-amber-400" : "bg-emerald-400"
          }`}
        />
      </span>
      <p className="text-gray-200 text-sm">
        <strong className={toneClasses.text}>
          Sharp Tier 2026, {SHARP_2026_TAKEN} of {SHARP_2026_CAP} fund spots
          taken
        </strong>
        <span className="text-gray-400">
          {" "}
          · {SHARP_2026_REMAINING} open · application reviewed within 48 hours
        </span>
      </p>
      {showCta ? (
        <Link
          href="/apply"
          className={`ml-auto inline-flex items-center justify-center px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${toneClasses.cta}`}
        >
          Apply →
        </Link>
      ) : null}
    </div>
  );
}
