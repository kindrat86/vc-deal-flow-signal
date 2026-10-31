import Link from "next/link";

/**
 * Sharp Tier application badge used on / and /apply.
 * 2026-10: the "1 of 8 fund spots taken" counter was removed. It was a
 * hardcoded constant with no Sharp Tier Stripe product or signed fund on
 * record, so it could not be verified. Do not re-add a counter unless it is
 * driven by real signed-fund data.
 */

export interface SharpScarcityBadgeProps {
  variant?: "default" | "inline" | "card";
  showCta?: boolean;
}

export default function SharpScarcityBadge({
  variant = "default",
  showCta = true,
}: SharpScarcityBadgeProps) {
  const isLowStock = false;
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
        Sharp Tier for funds, application only
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
        <p className="text-gray-400 text-xs">
          application-gated · 48h response
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
          Sharp Tier for funds, application only
        </strong>
        <span className="text-gray-400">
          {" "}
          · application reviewed within 48 hours
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
