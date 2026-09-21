/**
 * Investor-lane taxonomy, single source of truth.
 *
 * The landing hero-quiz ("Tell me your lane, I'll tailor your first issue")
 * offers six investor lanes: angel, scout, fund, corpdev, builder, other.
 * The backend historically only understood a separate 4-tier *avatar*
 * taxonomy (F/T/D/I) used by the pseo quiz to fork the drip pitch sequence.
 * Because /api/subscribe whitelisted quiz_route to F/T/D/I, the six lane
 * values were silently dropped and the "tailor your first issue" promise
 * was never kept.
 *
 * This module owns the lane whitelist and the first-issue framing copy so
 * subscribe/verify can recognize a lane and the digest builder can render a
 * lane-specific intro. The avatar tiers (F/T/D/I) remain a separate concern
 * and are intentionally NOT listed here.
 */

export const INVESTOR_LANES = [
  "angel",
  "scout",
  "fund",
  "corpdev",
  "builder",
  "other",
] as const;

export type InvestorLane = (typeof INVESTOR_LANES)[number];

/** Type guard: is this string one of the six investor lanes? */
export function isInvestorLane(v: string): v is InvestorLane {
  return (INVESTOR_LANES as readonly string[]).includes(v);
}

/** Human label, matches the landing hero-quiz card titles. */
const LANE_LABELS: Record<InvestorLane, string> = {
  angel: "Angel investor",
  scout: "Scout / syndicate lead",
  fund: "Seed fund / VC",
  corpdev: "Corporate development",
  builder: "Builder / operator",
  other: "Other curious mind",
};

export function laneLabel(lane: InvestorLane): string {
  return LANE_LABELS[lane];
}

/**
 * First-issue framing line per lane. These are honest reader guidance on how
 * to read the same five signals, NOT a different ranking and NOT a claim
 * that the data changes by lane. The five breakout names are identical for
 * everyone; only the "how to read them" note is personalized.
 */
const LANE_INTROS: Record<InvestorLane, string> = {
  angel:
    "You picked angel. These five are ranked by how sharply they're speeding up, so start with the sector you know best and treat the velocity jump as a gut-check against your own sourcing.",
  scout:
    "You picked scout. These five are built to be shared: a clear story to bring back to your fund, with the public GitHub receipts behind each one.",
  fund:
    "You picked fund. The number to weigh is \"vs. usual pace\", how much faster than their own normal, not the raw count. Compare it against your own sourcing threshold.",
  corpdev:
    "You picked corporate development. Watch for the names whose acceleration maps to a build, buy, or partner decision in your space.",
  builder:
    "You picked builder. These five show what the market is rewarding right now, useful signal for your own roadmap and positioning.",
  other:
    "You're here to explore. The 14-day velocity number is the score: higher means the team is moving faster than their own normal pace.",
};

export function laneIntro(lane: InvestorLane): string {
  return LANE_INTROS[lane];
}
