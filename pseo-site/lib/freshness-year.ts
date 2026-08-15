/**
 * SERP-facing freshness year, single source of truth (traffic audit 2026-08-16,
 * "content freshness/decay 55/100": hardcoded "(2026)" title tokens decay when
 * the calendar rolls; every rotatable title now re-renders with the build-time
 * year, so the first deploy of a new year rolls them together).
 *
 * WHAT MUST USE THIS (rotatable freshness decorators):
 *   - title / og:title / h1 year tokens on live-data and evergreen templates:
 *     alternatives, comparisons, use-cases, sectors, companies, acquirers,
 *     funds, works-with, city, sector-in-city, fund portfolio, trend, best,
 *     markets, from-stars-to-seed, benchmarks, startup-ideas (+ the
 *     llms-search.json startup-ideas summary). The /vs template already
 *     derives its year from lastModified (kept as is).
 *
 * WHAT MUST NEVER USE THIS (frozen years, do not "fix" them):
 *   - Citation / publication years: "The Data Nerd. (2026).", bibtex
 *     year = {2026}, Wikipedia {{cite}} year=, SSRN/Zenodo references.
 *     A paper published in 2026 stays published in 2026 forever.
 *   - Named editions / events / programs: "Series A Race 2026" (market
 *     resolves Dec 31 2026), "Charter Cohort 2026", "The 2026 State of
 *     Engineering Velocity", year-in-review, cursor-collab-2026, blog slugs
 *     ending in -2026.
 *   - Year-bound claims and dated editorial: content/posts.ts,
 *     content/agent-queries.ts (pricing prose like "$24k/seat in 2026"),
 *     /apply capacity claims, the Q2-2026 benchmark dataset vintage pages.
 *     Rolling those without re-verifying the claim fabricates freshness.
 *
 * Override: NEXT_PUBLIC_FRESH_YEAR=2027 at build time simulates a rollover
 * (used by the rollover proof build; also lets a January deploy pin the prior
 * year if a rollover must be held back for any reason).
 *
 * Guarded by scripts/verify-no-regressions.ts (auto-year rollover section,
 * 2026-08-16): rotatable files must interpolate, frozen files must not import.
 */
export function freshYear(now: Date = new Date()): number {
  const override = Number.parseInt(process.env.NEXT_PUBLIC_FRESH_YEAR ?? "", 10);
  return Number.isFinite(override) ? override : now.getFullYear();
}

export const FRESH_YEAR = freshYear();
/** "(2026)" form for trailing title tokens. */
export const FRESH_YEAR_STR = `(${FRESH_YEAR})`;
/** "2026" form for in-sentence year uses ("best tools in 2026"). */
export const FRESH_YEAR_PLAIN = `${FRESH_YEAR}`;
