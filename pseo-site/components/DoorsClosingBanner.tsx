/**
 * Founding-rate scarcity — HONEST, non-resetting.
 *
 * Replaces the prior weekly-resetting "doors closing tonight" countdown,
 * which implied the €9.97 Stripe link closes Thursday–Monday (it does not;
 * the link is always live). Project rule: honest dated/capped scarcity only,
 * never a resetting or fake countdown. The real scarcity is the
 * founding-member rate — locked for life now, rising to €49/mo once the
 * founding cohort closes.
 *
 * Kept as a named export with the same prop shape so the existing call sites
 * (/walkthrough, /walkthrough/5min, /walkthrough/90s) need no change. The
 * prop is accepted and intentionally ignored.
 */

import type { ReplayWindowSnapshot } from "@/lib/replay-window";

interface Props {
  initialWindow?: ReplayWindowSnapshot;
}

export function DoorsClosingBanner(_props: Props) {
  return (
    <div
      role="note"
      aria-label="Founding-member rate"
      className="rounded-lg border border-emerald-500/40 bg-emerald-950/30 px-4 py-3 sm:px-5 sm:py-4 flex items-center gap-3 flex-wrap"
    >
      <span
        aria-hidden="true"
        className="shrink-0 w-2 h-2 rounded-full bg-emerald-400"
      />
      <p className="text-emerald-100 text-sm leading-snug flex-1 min-w-0">
        <strong className="text-white">
          Founding-member rate: €9.97/mo, locked for life.
        </strong>{" "}
        It rises to €49/mo once the founding cohort closes — everyone who
        joins before then keeps €9.97 forever. No countdown, no fake
        deadline: just the rate, while it&rsquo;s still open.
      </p>
    </div>
  );
}
