/**
 * Honest affiliate-program facts.
 *
 * The old file contained an unsupported top-10 earners leaderboard, partner
 * counts, commission ranges, and CVRs. It has been replaced with only the
 * program terms that can be verified against the live Refgrow portal and
 * current public prices.
 */
export const AFFILIATE_PROGRAM_FACTS = {
  portalUrl: "https://gitdealflow.refgrow.com",
  commissionRate: "20% recurring",
  commissionPerInsiderCircleMonthly: "€39.40",
  commissionPerDashboardMonthly: "€9.80",
  commissionPerSectorSweep: "€399.40",
  programStatus: "open",
  lastVerified: "2026-08-29",
} as const;
