/**
 * Live replay pressure bar, retired with the founding window.
 *
 * The founding cohort (€9.97/mo) closed 2026-06-30. There is no weekly
 * "doors close / next cohort" cycle anymore, so the countdown theater is
 * gone. Replaced with a static honest ribbon. Same export signature so
 * the call sites (/walkthrough, /walkthrough/5min, /walkthrough/90s)
 * need no change; the prop is accepted and intentionally ignored (same
 * pattern as DoorsClosingBanner).
 */

import type { ReplayWindowSnapshot } from "@/lib/replay-window";

interface Props {
  initialWindow: ReplayWindowSnapshot;
}

export function LiveReplayBar(_props: Props) {
  return (
    <div
      role="status"
      aria-label="Dashboard pricing"
      className="sticky top-0 z-40 bg-emerald-500 text-emerald-950 border-b border-emerald-600/60 text-center text-[12px] sm:text-[13px] font-semibold py-2 px-3 shadow-sm"
    >
      Dashboard is €49/mo, month to month. Founding members who joined
      before 2026-06-30 keep €9.97 for life, that window is closed.
    </div>
  );
}
