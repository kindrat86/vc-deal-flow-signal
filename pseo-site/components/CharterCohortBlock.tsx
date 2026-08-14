import Link from "next/link";
import {
  CHARTER_COHORT,
  CHARTER_COHORT_TOTAL_SEATS,
  CHECK_SIZE_LABELS,
  SECTOR_LABELS,
  getClaimedCount,
  getRemainingSeats,
} from "@/content/charter-cohort";

/**
 * CharterCohortBlock, visible-momentum surface on the home page.
 *
 * Brunson Expert Secrets §1 Ch 4 (Mass Movement Vehicle). The chapter teaches
 * that a movement requires *visible momentum*, the new visitor sees other
 * members. The /wins ledger is founder-curated startup-side proof; this block
 * is the member-side complement.
 *
 * Pulls from the shared CHARTER_COHORT content file so the home counter and
 * /members header always agree. Pure server component, no hydration cost.
 */

export default function CharterCohortBlock() {
  const claimed = getClaimedCount();
  const remaining = getRemainingSeats();

  return (
    <section
      aria-label="Charter Cohort 2026"
      className="my-8 rounded-2xl border border-amber-700/40 bg-gradient-to-br from-amber-950/25 via-slate-900 to-slate-950 p-6 sm:p-8"
    >
      <div className="space-y-5">
        <header className="space-y-2">
          <p className="text-amber-300 text-[11px] uppercase tracking-[0.18em] font-semibold">
            The movement, member-side
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-tight tracking-tight">
            Charter Cohort 2026, {" "}
            <span className="text-amber-400 tabular-nums">
              {remaining} of {CHARTER_COHORT_TOTAL_SEATS}
            </span>{" "}
            seats open.
          </h2>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            <Link
              href="/wins"
              className="text-amber-400 hover:text-amber-300 underline decoration-dotted"
            >
              The wins ledger
            </Link>{" "}
            shows the startups our methodology surfaced before fundraise. The
            Charter Cohort shows the <strong>investors</strong> reading those
            signals, public thesis, public picks, public scorecard.
            Pseudonymous handles welcome.
          </p>
        </header>

        {/* Compact seat preview, 4 archetypes, single row on desktop */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CHARTER_COHORT.map((m) => (
            <li
              key={m.handle}
              className="rounded-lg border border-slate-800 bg-slate-950/40 px-4 py-3"
            >
              <p
                className={`text-[10px] font-semibold uppercase tracking-wider mb-1 ${
                  m.claimed ? "text-emerald-300" : "text-amber-300"
                }`}
              >
                {m.claimed ? "Claimed" : "Open seat"}
              </p>
              <Link
                href={`/members/${m.handle}`}
                className="block text-gray-100 hover:text-amber-300 font-semibold text-sm leading-snug mb-1 transition-colors"
              >
                {m.archetype} →
              </Link>
              <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                {CHECK_SIZE_LABELS[m.checkSize]} ·{" "}
                {m.sectors.map((s) => SECTOR_LABELS[s]).join(", ")}
              </p>
            </li>
          ))}
        </ul>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center pt-1">
          <Link
            href="/members/join"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm shadow-lg shadow-amber-500/20 transition-colors"
          >
            Claim a charter seat <span aria-hidden>→</span>
          </Link>
          <Link
            href="/members"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-amber-700/40 bg-slate-900/40 hover:bg-amber-950/20 text-amber-200 font-semibold text-sm transition-colors"
          >
            See all 25 seats
          </Link>
          <p className="text-gray-500 text-xs leading-relaxed sm:ml-auto sm:text-right">
            {claimed} claimed · {remaining} open · 48-hour written review
          </p>
        </div>
      </div>
    </section>
  );
}
