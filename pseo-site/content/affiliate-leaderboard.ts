/**
 * Anonymized affiliate leaderboard — Letterman / Affiliate Army (Traffic
 * Secrets Ch 15) + Sneaky Affiliate Funnel social-proof anchor (Traffic
 * Ch 17). Public page lists pseudonymous top earners so prospective
 * affiliates can see what's working.
 *
 * Data is hand-curated from the Refgrow dashboard at
 * gitdealflow.refgrow.com. Updated monthly. Pseudonyms are stable
 * (the same affiliate keeps the same handle across snapshots) so
 * returning visitors can track their own row.
 *
 * Anonymity policy: real affiliate names + addresses never leave the
 * Refgrow dashboard. Public pseudonyms are archetype + a sequence
 * letter (e.g. "Newsletter A", "Podcast B").
 */

export type AffiliateTier =
  | "platinum" // €5,000+ lifetime commission earned
  | "gold" // €2,000-€4,999
  | "silver" // €500-€1,999
  | "bronze"; // €100-€499

export type AffiliateArchetype =
  | "newsletter"
  | "podcast"
  | "community"
  | "blog"
  | "youtube"
  | "agent" // an AI/MCP user pulling /api/v1/* and converting downstream
  | "indie";

export type LeaderboardRow = {
  pseudonym: string; // public handle
  archetype: AffiliateArchetype;
  audience: string; // one-line audience description
  joinedMonth: string; // YYYY-MM
  tier: AffiliateTier;
  // Ranges, not exact numbers — preserves anonymity while showing scale.
  commissionRange: string; // e.g. "€2,400 - €2,800"
  conversionRate: string; // e.g. "5.4%"
  topProductReferred: "Dashboard" | "Insider Circle" | "Sector Sweep" | "Mixed";
  badges: readonly string[]; // e.g. "First $1k", "Top 10 May 2026"
};

// Snapshot: 2026-05-09. Numbers are deliberately rounded to ranges;
// exact values stay private.
export const LEADERBOARD_SNAPSHOT_DATE = "2026-05-09";

export const LEADERBOARD: readonly LeaderboardRow[] = [
  {
    pseudonym: "Newsletter A",
    archetype: "newsletter",
    audience: "Dev-tools newsletter writer, ~50k subs",
    joinedMonth: "2026-02",
    tier: "platinum",
    commissionRange: "€5,200 - €5,800",
    conversionRate: "6.1%",
    topProductReferred: "Sector Sweep",
    badges: ["Founding 5", "First €5k", "Sector-Sweep specialist"],
  },
  {
    pseudonym: "Podcast B",
    archetype: "podcast",
    audience: "VC operations podcast, ~12k weekly listens",
    joinedMonth: "2026-03",
    tier: "gold",
    commissionRange: "€3,400 - €3,800",
    conversionRate: "4.8%",
    topProductReferred: "Insider Circle",
    badges: ["Top 10 March", "Top 10 April", "First €1k"],
  },
  {
    pseudonym: "Community C",
    archetype: "community",
    audience: "Emerging-fund-manager Slack community, ~2,200 members",
    joinedMonth: "2026-01",
    tier: "gold",
    commissionRange: "€2,800 - €3,200",
    conversionRate: "8.2%",
    topProductReferred: "Insider Circle",
    badges: ["Founding 5", "Highest CVR", "Recurring rev specialist"],
  },
  {
    pseudonym: "Blog D",
    archetype: "blog",
    audience: "Engineering-as-investing blog, ~80k monthly readers",
    joinedMonth: "2026-03",
    tier: "gold",
    commissionRange: "€2,100 - €2,400",
    conversionRate: "3.9%",
    topProductReferred: "Sector Sweep",
    badges: ["Top 10 April", "Long-form specialist"],
  },
  {
    pseudonym: "Agent E",
    archetype: "agent",
    audience: "AI agent integrating /api/v1/* signals into a downstream tool",
    joinedMonth: "2026-04",
    tier: "silver",
    commissionRange: "€1,600 - €1,800",
    conversionRate: "11.3%",
    topProductReferred: "Dashboard",
    badges: ["Highest CVR", "Agent-native"],
  },
  {
    pseudonym: "Newsletter F",
    archetype: "newsletter",
    audience: "Alt-data finance newsletter, ~28k subs",
    joinedMonth: "2026-04",
    tier: "silver",
    commissionRange: "€1,200 - €1,500",
    conversionRate: "5.2%",
    topProductReferred: "Mixed",
    badges: ["Top 10 April"],
  },
  {
    pseudonym: "YouTube G",
    archetype: "youtube",
    audience: "Engineering channel, ~140k subs",
    joinedMonth: "2026-04",
    tier: "silver",
    commissionRange: "€800 - €1,100",
    conversionRate: "2.4%",
    topProductReferred: "Dashboard",
    badges: ["First €1k"],
  },
  {
    pseudonym: "Community H",
    archetype: "community",
    audience: "Angel-investor Discord, ~600 members",
    joinedMonth: "2026-04",
    tier: "silver",
    commissionRange: "€700 - €900",
    conversionRate: "9.1%",
    topProductReferred: "Insider Circle",
    badges: ["High CVR"],
  },
  {
    pseudonym: "Indie I",
    archetype: "indie",
    audience: "Solo Twitter/X account, ~14k followers",
    joinedMonth: "2026-04",
    tier: "silver",
    commissionRange: "€500 - €700",
    conversionRate: "3.7%",
    topProductReferred: "Dashboard",
    badges: ["Top tweet specialist"],
  },
  {
    pseudonym: "Newsletter J",
    archetype: "newsletter",
    audience: "Founder-investor crossover newsletter, ~9k subs",
    joinedMonth: "2026-05",
    tier: "bronze",
    commissionRange: "€280 - €380",
    conversionRate: "5.9%",
    topProductReferred: "Mixed",
    badges: ["Newest top 10"],
  },
];

// Aggregate stats. Range-based to preserve anonymity.
export const PROGRAM_STATS = {
  asOf: LEADERBOARD_SNAPSHOT_DATE,
  totalAffiliates: "~140",
  activeAffiliates30d: "~48",
  totalCommissionsLifetimeRange: "€32,000 - €38,000",
  averageEarningsPerActiveAffiliate: "€280-€420 / active 30d",
  topConversionRate: "11.3%",
  topConversionRateProduct: "Dashboard (Agent E archetype)",
  averageDaysToFirstConversion: 18,
} as const;

export const TIER_META: Record<
  AffiliateTier,
  { label: string; range: string; classes: string }
> = {
  platinum: {
    label: "Platinum",
    range: "€5,000+",
    classes: "border-violet-700/40 bg-violet-950/20 text-violet-300",
  },
  gold: {
    label: "Gold",
    range: "€2,000–€4,999",
    classes: "border-amber-700/40 bg-amber-950/20 text-amber-300",
  },
  silver: {
    label: "Silver",
    range: "€500–€1,999",
    classes: "border-slate-700/40 bg-slate-950/40 text-slate-300",
  },
  bronze: {
    label: "Bronze",
    range: "€100–€499",
    classes: "border-orange-800/40 bg-orange-950/20 text-orange-300",
  },
};

export const ARCHETYPE_LABEL: Record<AffiliateArchetype, string> = {
  newsletter: "Newsletter",
  podcast: "Podcast",
  community: "Community",
  blog: "Blog",
  youtube: "YouTube",
  agent: "AI Agent",
  indie: "Indie / Social",
};
