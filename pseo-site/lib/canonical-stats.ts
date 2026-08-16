/**
 * CANONICAL STATS BLOCK  - single source of truth for every quantitative
 * claim about the GitDealFlow / VC Deal Flow Signal panel.
 *
 * RULES (enforced by scripts/verify-claims.ts in prebuild):
 *  1. Never hardcode a panel count in a page, FAQ, API description, README,
 *     or marketing surface. Import from here (TS surfaces) or copy the exact
 *     sanctioned wording (static HTML, see CLAIMS-LEDGER.md in the repo root).
 *  2. Derived numbers refresh automatically with data/startups.json. Static
 *     copies (landing HTML, READMEs) are band-checked against this module:
 *     they must stay within ±15% of the live count.
 *  3. Research-sample numbers (SSRN panel, scout unicorn DB) are CONSTANTS,
 *     not panel derivatives. Always quote them WITH their label ("SSRN
 *     sample", "validated unicorns"), never as panel size.
 *
 * Historical period floors ("400+ orgs in the Q1 2026 window") remain
 * legitimate inside period-labelled prose and are exempt from the guard.
 */
import startupsData from "../data/startups.json";

interface Period {
  slug: string;
  name: string;
  current: boolean;
}
interface SectorShape {
  slug: string;
  name: string;
  periods: Record<string, { startups: unknown[] }>;
}

const sectors = (startupsData as { sectors: SectorShape[] }).sectors;
const periods = (startupsData as { periods: Period[] }).periods;
const currentPeriod = periods.find((p) => p.current) ?? periods[0];

/** Sectors that carry a snapshot for the current period (legacy frozen
 *  clusters are excluded  - they froze at Q2 2026). */
export const ACTIVE_SECTOR_SLUGS: string[] = sectors
  .filter((s) => s.periods[currentPeriod.slug])
  .map((s) => s.slug);

/** Active sector count, e.g. 15. Matches /api/signals.json meta.totalSectors. */
export const ACTIVE_SECTOR_COUNT = ACTIVE_SECTOR_SLUGS.length;

/** Current weekly panel size, e.g. 411. Matches meta.totalStartups. */
export const CURRENT_PANEL_COUNT = ACTIVE_SECTOR_SLUGS.reduce(
  (sum, slug) =>
    sum + (sectors.find((s) => s.slug === slug)?.periods[currentPeriod.slug]?.startups.length ?? 0),
  0,
);

/** Human period label, e.g. "Q3 2026". */
export const PERIOD_NAME = currentPeriod.name;
export const PERIOD_SLUG = currentPeriod.slug;

/** Unique orgs ever published across all quarterly panels (union of names). */
export const CUMULATIVE_ORG_COUNT = new Set(
  sectors.flatMap((s) =>
    Object.values(s.periods).flatMap((snap) =>
      (snap.startups as { name: string }[]).map((st) => st.name.toLowerCase()),
    ),
  ),
).size;

/** Sanctioned one-line panel claim for prose, meta descriptions, directories. */
export const PANEL_CLAIM = `${CURRENT_PANEL_COUNT} venture-backed startup GitHub organizations across ${ACTIVE_SECTOR_COUNT} sectors (${PERIOD_NAME} panel), refreshed weekly`;

/** Short variant for badges and tight UI strings. */
export const PANEL_CLAIM_SHORT = `${CURRENT_PANEL_COUNT} orgs, ${ACTIVE_SECTOR_COUNT} sectors, weekly`;

/** Research-sample constants  - NOT panel derivatives. Quote with labels. */
export const RESEARCH = {
  ssrnId: "6606558",
  ssrnUrl: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6606558",
  ssrnConfirmedRounds: 219,
  ssrnRepoSample: "12,000+ public repositories",
  leadTimeDays: "21-47 days",
  scoutUnicornDb: "~75 validated unicorns",
  /** Historical frozen benchmark (Q2 2026)  - period-labelled, do not reuse
   *  as a current claim. */
  q2BenchmarkPanel: 269,
} as const;
