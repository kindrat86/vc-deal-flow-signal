/**
 * Charter Cohort 2026, Brunson Expert Secrets §1 Ch 4 (Mass Movement Vehicle).
 *
 * The chapter teaches: a movement requires *visible momentum*, the new
 * member sees other members, not just the founder. Until 2026-05-09 the
 * project's only visible community surface was /wins (the *startups* the
 * methodology surfaced before fundraise). That's founder-curated proof,
 * not member-side proof.
 *
 * This file ships the member-side scaffold, 25 charter seats, currently
 * 0 claimed. The four named seat templates below are *archetype previews*:
 * each shows what a real charter member's profile will look like once the
 * seat is claimed, with an illustrative thesis the visitor can replace
 * with their own.
 *
 * Honesty rule: the templates are explicitly labeled "Open seat, claim
 * this archetype" on /members and /members/[handle]. There are no fake
 * names, no fake scorecards, no fake testimonials. The system is empty
 * and admits it. Once a real charter member submits via /members/join
 * and the founder approves, the template's `claimed` flag flips and the
 * `claimedBy` block is filled with the member's pseudonymous handle.
 *
 * Anonymity rule: members may publish under a pseudonymous handle, same
 * as the founder ("@thedatanerd"). Real names never required. The
 * application form at /members/join asks for a verifiable email + the
 * pseudonymous handle they want to use.
 */

export type SectorTag =
  | "ai-infra"
  | "dev-tools"
  | "data-infra"
  | "technical-saas"
  | "agents"
  | "fintech"
  | "climate"
  | "developer-platforms";

export type CheckSizeBand =
  | "5-25k" // Angel
  | "25-100k" // Active angel / scout
  | "100-500k" // Syndicate lead
  | "500k-2m" // Small fund
  | "2m+"; // Mid-fund

export interface CharterPick {
  /** GitHub org slug or org/repo. */
  org: string;
  /** Why this org made the member's watchlist, 1 sentence. */
  why: string;
  /** ISO date, when the member added it. */
  flaggedAt: string;
}

export interface ScorecardEntry {
  /** ISO date, 60 days from flaggedAt. */
  graded60dAt: string;
  /** ISO date, 90 days from flaggedAt. */
  graded90dAt: string;
  /** Pending until both windows close. */
  status: "pending" | "hit" | "miss";
  /** If hit: the public event that validated the pick. */
  hitEvent?: string;
}

export interface CharterMember {
  /** Stable seat slug, used in /members/[handle]. */
  handle: string;
  /** True when a real member has claimed this seat. */
  claimed: boolean;
  /** Archetype label, visible above the fold on the profile. */
  archetype: string;
  /** Short tagline shown in the cohort grid + meta description. */
  tagline: string;
  /** Public thesis, 2-4 sentences, the angle this member writes from. */
  thesis: string;
  /** Check-size band, qualifies the type of conviction the picks reflect. */
  checkSize: CheckSizeBand;
  /** Sectors this member tracks closely. */
  sectors: SectorTag[];
  /** Public picks, empty until member publishes their first. */
  picks: CharterPick[];
  /** Scorecard rows, one per pick, mirrored by index. */
  scorecard: ScorecardEntry[];
  /** ISO date, when the seat opened (for templates) or was claimed. */
  seatOpenedAt: string;
  /** Filled only when claimed=true. */
  claimedBy?: {
    handle: string;
    claimedAt: string;
    bio: string;
  };
}

export const CHARTER_COHORT_TOTAL_SEATS = 25;

/**
 * Sample sector orgs, same names already public on /predicted and in the
 * validated-wins ledger. Used in seat templates so the illustrative picks
 * reflect orgs the panel actively tracks rather than fabricated names.
 *
 * Each pick `flaggedAt` is set to a *future-pending* date to make clear the
 * scorecard is Pending, not back-fitted.
 */
export const CHARTER_COHORT: ReadonlyArray<CharterMember> = [
  {
    handle: "charter-1",
    claimed: false,
    archetype: "AI Infrastructure Angel",
    tagline:
      "€5-25k checks into AI infra and agent runtimes. Reads the merge graph before the deck.",
    thesis:
      "AI-native infrastructure is the next decade's developer-platform layer, the Vercel/Stripe/Twilio of the agent economy. I write small early checks into teams whose commit velocity outpaces their funding round, with a soft preference for runtime, evals, and on-device inference. Edge isn't access, edge is reading the code six weeks earlier than the deck.",
    checkSize: "5-25k",
    sectors: ["ai-infra", "agents"],
    picks: [],
    scorecard: [],
    seatOpenedAt: "2026-05-09",
  },
  {
    handle: "charter-2",
    claimed: false,
    archetype: "Dev Tools Syndicate Lead",
    tagline:
      "Pools €100-500k from a developer-syndicate into one breakout per month.",
    thesis:
      "I run a syndicate of 30+ engineers who write small checks together. Our edge is technical due diligence at speed, we can read a codebase in a Saturday and decide on Sunday. The bottleneck is sourcing: by the time a dev tool reaches our group via warm intro, the round is filled. Reading commit-velocity acceleration in real time is the only sourcing channel that scales with our diligence speed.",
    checkSize: "100-500k",
    sectors: ["dev-tools", "developer-platforms"],
    picks: [],
    scorecard: [],
    seatOpenedAt: "2026-05-09",
  },
  {
    handle: "charter-3",
    claimed: false,
    archetype: "Technical SaaS Scout",
    tagline:
      "Scout-style mandate. €25-100k checks into B2B SaaS with public engineering signal.",
    thesis:
      "I scout for two emerging-manager funds and write personal angel checks alongside. My edge isn't capital, it's pattern recognition on what 'looks like' a Series-A-ready engineering org six weeks early. Star-detachment, contributor influx, and infra-buildout signals tell me which teams are about to pour gasoline on a working motor. I want the data the partner-grade tools price me out of.",
    checkSize: "25-100k",
    sectors: ["technical-saas", "dev-tools"],
    picks: [],
    scorecard: [],
    seatOpenedAt: "2026-05-09",
  },
  {
    handle: "charter-4",
    claimed: false,
    archetype: "Data Infrastructure Partner",
    tagline:
      "Small fund principal. €500k-2m checks into data, devtools, and verifiable compute.",
    thesis:
      "I'm a principal at a small data-infra-focused fund with a thesis on verifiable compute, data lineage, and the next-generation OLAP/OLTP layer. Our IC reviews 8 deals a quarter, sourcing breadth is the constraint, not capital. The methodology is what convinced me to charter here: SSRN-published, n=219, replication code public. Edge in venture isn't access anymore. It's lens.",
    checkSize: "500k-2m",
    sectors: ["data-infra", "developer-platforms"],
    picks: [],
    scorecard: [],
    seatOpenedAt: "2026-05-09",
  },
];

/**
 * Helper, count seats currently claimed.
 * Used on /members header + /members/[handle] availability indicator.
 */
export function getClaimedCount(): number {
  return CHARTER_COHORT.filter((m) => m.claimed).length;
}

/**
 * Helper, count remaining seats.
 */
export function getRemainingSeats(): number {
  return CHARTER_COHORT_TOTAL_SEATS - getClaimedCount();
}

/**
 * Lookup by handle. Used by /members/[handle] route.
 */
export function getCharterMember(handle: string): CharterMember | null {
  return CHARTER_COHORT.find((m) => m.handle === handle) ?? null;
}

/**
 * All handles, for generateStaticParams.
 */
export function getAllCharterHandles(): readonly string[] {
  return CHARTER_COHORT.map((m) => m.handle);
}

/**
 * Sector label for display.
 */
export const SECTOR_LABELS: Record<SectorTag, string> = {
  "ai-infra": "AI Infrastructure",
  "dev-tools": "Developer Tools",
  "data-infra": "Data Infrastructure",
  "technical-saas": "Technical SaaS",
  agents: "AI Agents",
  fintech: "Fintech / Payments",
  climate: "Climate Tech",
  "developer-platforms": "Developer Platforms",
};

/**
 * Check-size label for display.
 */
export const CHECK_SIZE_LABELS: Record<CheckSizeBand, string> = {
  "5-25k": "€5k - €25k angel checks",
  "25-100k": "€25k - €100k active angel",
  "100-500k": "€100k - €500k syndicate",
  "500k-2m": "€500k - €2m small fund",
  "2m+": "€2m+ mid-fund",
};
