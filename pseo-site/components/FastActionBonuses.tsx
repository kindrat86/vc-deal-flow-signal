import Link from "next/link";

/**
 * Fast-action bonuses, retired with the founding window.
 *
 * The weekly fast-action / last-hours / closed phase machine sold a
 * "founding checkout paused until Monday" story. The founding cohort
 * (€9.97/mo) closed 2026-06-30 and the Dashboard checkout is €49/mo,
 * always open. Replaced with a static honest card. Same export
 * signature so the call site (/walkthrough) needs no change; the
 * initialWindow prop is accepted and intentionally ignored.
 */

import type { ReplayWindowSnapshot } from "@/lib/replay-window";

interface Props {
  initialWindow: ReplayWindowSnapshot;
  signupUrl?: string;
}

export function FastActionBonuses({
  signupUrl = "https://gitdealflow.com/#signup",
}: Props) {
  return (
    <section
      aria-label="Dashboard pricing"
      className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 px-4 py-3 sm:px-5 sm:py-4 space-y-3"
    >
      <p className="text-emerald-100 text-sm leading-snug">
        <strong className="text-white">
          Dashboard is €49/mo, month to month, cancel anytime.
        </strong>{" "}
        Founding members who joined before 2026-06-30 keep €9.97 for life,
        that window is closed and is not coming back.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 pt-1">
        <a
          href={signupUrl}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-gray-100 font-semibold text-sm transition-colors"
        >
          Get the free digest →
        </a>
        <Link
          href="/firstlook"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-300 font-semibold text-sm transition-colors"
        >
          Or test one sector for €7 (always open)
        </Link>
      </div>
    </section>
  );
}
