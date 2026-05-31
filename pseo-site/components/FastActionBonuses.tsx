"use client";

/**
 * Brunson Live-Replay — fast-action bonuses block (DotCom Secrets Ch 12,
 * Cart Funnel Building Block #19: stacked bonuses with hard expiry).
 *
 * Three named bonuses with concrete dollar values. Visible during the
 * "fast-action" phase (Mon → Wed 23:59 UTC). Replaced with a "last-hours"
 * pulse on Thursday, then a "doors closed" waitlist redirect Fri–Sun.
 *
 * Each phase is a different *card* — not a hidden div. The reader who
 * lands on Friday should see WHY the page is gated, not an empty container.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getReplayWindow,
  type ReplayPhase,
  type ReplayWindowSnapshot,
} from "@/lib/replay-window";

interface Props {
  initialWindow: ReplayWindowSnapshot;
  /** Free-list signup URL used in the "doors closed" state. */
  signupUrl?: string;
}

const FAST_ACTION_BONUSES = [
  {
    label: "Bonus #1 — Same-week Sector Sweep slot",
    detail:
      "Lock by Wednesday 23:59 UTC and your first €1,797 Sector Sweep file ships the same calendar week, instead of next-cohort-Monday. Saves a four-to-seven-day delay on the deepest deliverable in the stack.",
    value: "€1,797 → same week",
  },
  {
    label: "Bonus #2 — Founding-rate ratchet (€9.97 anchored to today)",
    detail:
      "Lock now and the €9.97/mo rate is contractually anchored to your checkout date. Even if next cohort opens at €19/mo or the public price hits €49/mo, your seat doesn't move. Lock-in is dated to entry, not to tenure.",
    value: "€39/mo saved year-1",
  },
  {
    label: "Bonus #3 — Twelve historical Sunday digests",
    detail:
      "Locked-in members get the full back-archive of every Sunday digest since January 2026 — twelve issues of narrative around the dataset. Cohort-locked, never offered to next-week's cohort.",
    value: "€348 standalone",
  },
] as const;

export function FastActionBonuses({ initialWindow, signupUrl = "https://gitdealflow.com/#signup" }: Props) {
  const [phase, setPhase] = useState<ReplayPhase>(initialWindow.phase);

  useEffect(() => {
    const tick = () => setPhase(getReplayWindow(new Date()).phase);
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (phase === "closed") {
    return (
      <section
        aria-label="Cart closed for this cohort"
        className="rounded-xl border border-slate-700 bg-slate-900/60 p-6 sm:p-8 space-y-4"
      >
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
          Cart closed · This cohort
        </p>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-100 leading-snug">
          The €9.97 founding-member checkout is paused until Monday 06:00 UTC.
        </h2>
        <p className="text-gray-300 text-sm leading-relaxed">
          Live replays open Monday 06:00 UTC and close Thursday 23:59 UTC,
          every cohort. The founding-member rate is only checkoutable while
          doors are open — that&rsquo;s how the price stays locked for the
          people who are already in. The free Acceleration Watch is
          unaffected.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <a
            href={signupUrl}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-gray-100 font-semibold text-sm transition-colors"
          >
            Get the free digest while you wait →
          </a>
          <Link
            href="/firstlook"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-300 font-semibold text-sm transition-colors"
          >
            Or test one sector for €7 (always open)
          </Link>
        </div>
        <p className="text-gray-500 text-xs leading-relaxed border-t border-slate-800 pt-3">
          The €7 First Look Pass is the only checkoutable surface during
          closed-cart hours. It&rsquo;s a tripwire, not the founding-member
          tier — but the €7 credits toward Dashboard if you upgrade in the
          next 14 days.
        </p>
      </section>
    );
  }

  if (phase === "last-hours") {
    return (
      <section
        aria-label="Last hours — doors closing tonight"
        className="rounded-xl border border-rose-500/50 bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-4"
      >
        <p className="text-rose-300 text-xs font-semibold uppercase tracking-wider">
          Last hours · Doors closing tonight
        </p>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-100 leading-snug">
          Cart closes Thursday 23:59 UTC. The €9.97 link goes to a
          waitlist page until Monday.
        </h2>
        <p className="text-gray-300 text-sm leading-relaxed">
          The three fast-action bonuses (same-week Sector Sweep slot +
          founding-rate ratchet + twelve historical Sunday digests) expired
          Wednesday 23:59 UTC. The seat itself is still on the table — but
          only until tonight. Tomorrow morning the link returns the
          waitlist screen.
        </p>
        <p className="text-rose-200 text-sm leading-relaxed">
          Doors close on every cohort. This isn&rsquo;t the discount
          expiring — the cohort is. The seat does not roll over.
        </p>
      </section>
    );
  }

  // fast-action phase — show the three bonuses with their hard deadline.
  return (
    <section
      aria-label="Fast-action bonuses — expire Wednesday 23:59 UTC"
      className="rounded-xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-5"
    >
      <div className="space-y-1.5">
        <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">
          Fast-action · Expires Wednesday 23:59 UTC
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-tight">
          Lock by Wednesday and three bonuses ride along with the seat.
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
          Fast-action bonuses are anti-procrastination, not promo. They
          reward locking the cadence inside the same cohort, not a vague
          &ldquo;sometime next month.&rdquo; Wednesday 23:59 UTC: all three
          disappear. The seat stays available 24 more hours, unbundled.
        </p>
      </div>

      <ul className="space-y-3">
        {FAST_ACTION_BONUSES.map((b, i) => (
          <li
            key={b.label}
            className="flex items-start gap-4 rounded-lg border border-slate-800 bg-slate-900/50 p-4"
          >
            <span
              aria-hidden="true"
              className="shrink-0 w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-bold flex items-center justify-center"
            >
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-3 flex-wrap">
                <p className="text-gray-100 font-semibold text-sm sm:text-base">
                  {b.label}
                </p>
                <p className="text-emerald-400 text-xs whitespace-nowrap font-semibold">
                  {b.value}
                </p>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mt-1">
                {b.detail}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <p className="text-gray-400 text-xs leading-relaxed border-t border-slate-800 pt-3">
        These three bonuses disappear at Wednesday 23:59 UTC sharp. The seat
        itself stays available until Thursday 23:59 UTC. After that, the
        cart link routes to a waitlist page — Monday 06:00 UTC the next
        cohort opens.
      </p>
    </section>
  );
}
