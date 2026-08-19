/**
 * roadmap-board.ts, public Linear/Trello-style roadmap mirror.
 *
 * Internal-only design note (do NOT surface in customer copy):
 * Closes Traffic Secrets §3 Ch 19 audit gap. Audit V8 (2026-05-09) flagged:
 * "/roadmap exists but no public Trello/Linear-style board mirror, anyone
 * should see what's shipping next quarter without an account."
 *
 * Single source of truth for:
 *   - /roadmap/board (kanban view, grouped by lane)
 *   - /api/v1/roadmap.json (machine-readable JSON-LD ItemList feed)
 *   - /api/v1/roadmap (extension-stripped alias)
 *
 * Cadence: edit this file when something materially moves between lanes.
 * Each item carries: id, title, summary, lane, quarter, eta, owner role,
 * progress %, public links, related shipped chapter (internal taxonomy),
 * dependencies, last-updated date.
 */

export type RoadmapLane =
  | "shipped"
  | "in-flight"
  | "on-deck"
  | "considering"
  | "cut";

export type RoadmapTag =
  | "funnel"
  | "data"
  | "infra"
  | "distribution"
  | "content"
  | "agent"
  | "research"
  | "ops";

export type RoadmapItem = {
  /** Stable kebab-case id; never reuse. Used as anchor + JSON-LD @id. */
  id: string;
  /** Public-facing card title. */
  title: string;
  /** Short rationale (1-3 sentences). Reads like a Linear card description. */
  summary: string;
  /** Which lane this card lives in. */
  lane: RoadmapLane;
  /** Target/actual quarter, e.g. "Q2 2026". */
  quarter: string;
  /** ISO date target. Optional, null for `considering` and `cut`. */
  eta?: string;
  /**
   * Public-safe owner role. Use roles, not names. Rotates as work moves.
   * Examples: "Methodology Lead", "Funnel Engineering", "Distribution Lead".
   */
  ownerRole: string;
  /**
   * Progress 0-100. For `shipped` always 100. For `cut` always 0.
   */
  progress: number;
  /** Tags for column-level filters. */
  tags: RoadmapTag[];
  /** Public link to live evidence (where readers can see/use it). */
  link?: string;
  /** External link (opens in new tab). */
  external?: boolean;
  /**
   * Items that must land first. Use ids from this same file.
   * Surfaces as "blocked by" in the UI.
   */
  blockedBy?: string[];
  /** ISO date this card was last touched. Sort-key for "Recently moved". */
  updatedAt: string;
  /**
   * Optional public reason. Required for `cut` cards (transparency rule).
   * Single sentence, no internal jargon.
   */
  reason?: string;
};

/** Master ordered list. Newer items at top within each lane group. */
export const ROADMAP_ITEMS: RoadmapItem[] = [
  // ────────────────────────── SHIPPED, Q2 2026 ──────────────────────────
  {
    id: "buyer-roadmap-five-surfaces",
    title: "Buyer Roadmap wired into 5 conversion surfaces",
    summary:
      "Apply, FirstLook, Pricing, Insider, and Sector Sweep now share a single Buyer Roadmap component so visitors see the same four-stage path on every conversion page (decide → onboard → first signal → 90-day check).",
    lane: "shipped",
    quarter: "Q2 2026",
    eta: "2026-05-08",
    ownerRole: "Funnel Engineering",
    progress: 100,
    tags: ["funnel"],
    link: "/apply",
    updatedAt: "2026-05-08",
  },
  {
    id: "sector-sweep-heat-build-sequence",
    title: "Sector Sweep heat-build setter sequence",
    summary:
      "Five-day heat-build sequence on the Sector Sweep brief (€1,997 tier), daily proof emails, a worked client teardown, and a soft-pitch close. Lifts the brief funnel score to 100/100.",
    lane: "shipped",
    quarter: "Q2 2026",
    eta: "2026-05-07",
    ownerRole: "Funnel Engineering",
    progress: 100,
    tags: ["funnel", "content"],
    link: "/sector-sweep",
    updatedAt: "2026-05-07",
  },
  {
    id: "openapi-31-mcp-x",
    title: "Unified OpenAPI 3.1 spec with x-mcp-tool extensions",
    summary:
      "Single /api/openapi.json now serves REST and MCP in one fetch, 31 paths, 8 MCP tools, 3 resources, 5 prompt templates. Consumed by ChatGPT GPT, Cursor, Claude, and any MCP host without a separate manifest.",
    lane: "shipped",
    quarter: "Q2 2026",
    eta: "2026-05-07",
    ownerRole: "Methodology Lead",
    progress: 100,
    tags: ["agent", "infra"],
    link: "/api/openapi.json",
    updatedAt: "2026-05-07",
  },
  {
    id: "one-click-oto-stripe",
    title: "One-click OTO upsells (Stripe off-session)",
    summary:
      "After a successful First Look purchase, the Insider and Sector Sweep upsells charge the saved card without a second checkout. Webhook idempotency uses runtime-cache with a 14-day TTL.",
    lane: "shipped",
    quarter: "Q2 2026",
    eta: "2026-05-07",
    ownerRole: "Funnel Engineering",
    progress: 100,
    tags: ["funnel", "infra"],
    link: "/firstlook",
    updatedAt: "2026-05-07",
  },
  {
    id: "book-funnel-7-signals",
    title: "Free book funnel, 7 GitHub Signals (104 pages)",
    summary:
      "Free PDF/EPUB read at /book/read, €0.99 Kindle unlocks a three-email bonus drip with a worked Series A walkthrough and a 30-day direct-line invite. Acts as the indoctrination top of the value ladder.",
    lane: "shipped",
    quarter: "Q2 2026",
    eta: "2026-05-06",
    ownerRole: "Content Lead",
    progress: 100,
    tags: ["funnel", "content"],
    link: "/book",
    updatedAt: "2026-05-06",
  },
  {
    id: "predicted-acceleration-watch",
    title: "Acceleration Watch, free weekly index",
    summary:
      "Every Monday: 5 named startups whose commit-velocity acceleration crossed the signal threshold, with sector + percentile + post-hoc grading at 60d / 90d. ClaimReview JSON-LD on every pick.",
    lane: "shipped",
    quarter: "Q2 2026",
    eta: "2026-04-22",
    ownerRole: "Methodology Lead",
    progress: 100,
    tags: ["data", "content"],
    link: "/predicted",
    updatedAt: "2026-05-08",
  },
  {
    id: "state-of-github-monthly",
    title: "State of GitHub, monthly written address",
    summary:
      "First Wednesday of every month: 10-minute written address on engineering-velocity panel data. May 2026 covered AI-native devtools as the loudest sector. Synthetic-voice video render is on deck.",
    lane: "shipped",
    quarter: "Q2 2026",
    eta: "2026-05-06",
    ownerRole: "Methodology Lead",
    progress: 100,
    tags: ["content", "data"],
    link: "/state-of-github",
    updatedAt: "2026-05-06",
  },
  {
    id: "ssrn-research-panel",
    title: "SSRN-indexed research panel (CC BY 4.0)",
    summary:
      "219-company longitudinal panel published as a working paper (SSRN abstract 6606558). Reproducibility appendix, replication CSV, and DOI on Crossref. Lead-time median 21-47 days vs. press release.",
    lane: "shipped",
    quarter: "Q2 2026",
    eta: "2026-04-15",
    ownerRole: "Methodology Lead",
    progress: 100,
    tags: ["research", "data"],
    link: "/research",
    updatedAt: "2026-04-15",
  },
  {
    id: "chrome-extensions-pair",
    title: "Two Chrome extensions live in Web Store",
    summary:
      "VC GitHub Lookup (badge on Crunchbase profiles) and the Acceleration overlay both live, both with 5-star reviews. Free distribution play that funnels to /firstlook on click-through.",
    lane: "shipped",
    quarter: "Q2 2026",
    eta: "2026-04-30",
    ownerRole: "Distribution Lead",
    progress: 100,
    tags: ["distribution"],
    link: "https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn",
    external: true,
    updatedAt: "2026-04-30",
  },
  {
    id: "mcp-server-published",
    title: "MCP server v1.6.0, six read-only tools",
    summary:
      "Published as @gitdealflow/mcp-signal on npm. Discoverable via /.well-known/mcp.json, listed on Glama and Smithery. Six tools: signal_get, signal_search, signal_sector, signal_get_deep_signal, signal_trend, agent_pitch.",
    lane: "shipped",
    quarter: "Q2 2026",
    eta: "2026-04-28",
    ownerRole: "Agent Architect",
    progress: 100,
    tags: ["agent", "distribution"],
    link: "https://www.npmjs.com/package/@gitdealflow/mcp-signal",
    external: true,
    updatedAt: "2026-04-28",
  },
  {
    id: "pseo-1060-pages",
    title: "Programmatic SEO surface, 1,060+ live pages",
    summary:
      "12 hreflang locales, /startup/[slug]/[period] long-tail, /predicted/[week] archive, /signals/define/[primitive] knowledge base. All 1,060 sitemap URLs return 200 with full schema.org markup.",
    lane: "shipped",
    quarter: "Q2 2026",
    eta: "2026-05-05",
    ownerRole: "SEO Engineering",
    progress: 100,
    tags: ["content", "infra"],
    link: "/sitemap.xml",
    updatedAt: "2026-05-05",
  },
  {
    id: "manifesto-cause-pages",
    title: "Manifesto + future-based cause pages",
    summary:
      "/manifesto with six pillars (data over networks, code over decks, public over private, methodology over personality, ladder over lock-in, free over gated). Plus the emotional cause: five geographic scenes from Athens to São Paulo.",
    lane: "shipped",
    quarter: "Q2 2026",
    eta: "2026-05-05",
    ownerRole: "Content Lead",
    progress: 100,
    tags: ["content"],
    link: "/manifesto",
    updatedAt: "2026-05-05",
  },

  // ───────────────────────── IN FLIGHT, this quarter ─────────────────────
  {
    id: "public-roadmap-board",
    title: "Public roadmap board (this page)",
    summary:
      "A Linear-style kanban view of every shipped, in-flight, on-deck, considering, and cut item, no account required, machine-readable JSON feed at /api/v1/roadmap.json. Closes the public-bet transparency loop.",
    lane: "in-flight",
    quarter: "Q2 2026",
    eta: "2026-05-09",
    ownerRole: "Funnel Engineering",
    progress: 90,
    tags: ["funnel", "content"],
    link: "/roadmap/board",
    updatedAt: "2026-05-09",
  },
  {
    id: "instagram-pipeline",
    title: "Instagram pipeline, daily anonymous chart-reels",
    summary:
      "Anonymous data-viz reels (commit-velocity charts, sector heat maps) posted daily at @thedatanerd. No founder face required. Aiming for 30 posts in 30 days as a baseline reach experiment.",
    lane: "in-flight",
    quarter: "Q2 2026",
    eta: "2026-05-25",
    ownerRole: "Distribution Lead",
    progress: 35,
    tags: ["distribution", "content"],
    link: "/distribution",
    updatedAt: "2026-05-09",
  },
  {
    id: "dream100-mention-radar",
    title: "Dream-100 mention radar (auto-amplify)",
    summary:
      "GitHub Action scans 99 Dream-100 sources every 6 hours for mentions of GitDealFlow / Acceleration Watch / engineering-velocity index. Auto-files to a public log so we can reply within 4 hours.",
    lane: "in-flight",
    quarter: "Q2 2026",
    eta: "2026-05-15",
    ownerRole: "Distribution Lead",
    progress: 70,
    tags: ["distribution", "ops"],
    link: "/target-list",
    updatedAt: "2026-05-09",
  },
  {
    id: "synthetic-voice-state-of-github",
    title: "Synthetic-voice render for State of GitHub",
    summary:
      "Cartesia Theo voice + Remotion slides + whisper.cpp captions. Monthly cron renders a 10-minute YouTube upload from the written address. May 2026 entry first to be backfilled.",
    lane: "in-flight",
    quarter: "Q2 2026",
    eta: "2026-05-30",
    ownerRole: "Video Pipeline",
    progress: 60,
    tags: ["content"],
    link: "/state-of-github",
    blockedBy: ["video-quality-revisit-decision"],
    updatedAt: "2026-05-09",
  },
  {
    id: "reddit-ads-launch",
    title: "Reddit Ads launch, 6 ad-sets at €5/day",
    summary:
      "Six targeted ad-sets across r/startups, r/Entrepreneur, r/AngelInvesting, r/InvestmentClub, r/SideProject, r/EntrepreneurRideAlong. Account, pixel, env vars, and creatives ready. Launch over the weekend window.",
    lane: "in-flight",
    quarter: "Q2 2026",
    eta: "2026-05-11",
    ownerRole: "Distribution Lead",
    progress: 80,
    tags: ["distribution"],
    link: "/distribution",
    updatedAt: "2026-05-09",
  },
  {
    id: "wikipedia-entry",
    title: "Wikipedia entry (Wikidata anchor live)",
    summary:
      "Wikidata Q139376302 already in place. Wikipedia draft pending the third independent secondary citation to clear the notability bar. Two of three citations already collected.",
    lane: "in-flight",
    quarter: "Q3 2026",
    eta: "2026-07-01",
    ownerRole: "Content Lead",
    progress: 45,
    tags: ["distribution", "research"],
    link: "/wikipedia",
    updatedAt: "2026-05-08",
  },
  {
    id: "video-quality-revisit-decision",
    title: "Video stack quality revisit (TTS + visuals + avatar)",
    summary:
      "Open decision on the whole video pipeline: which TTS provider, whether to add an AI avatar, captions style, music. Two GitHub-Actions video crons paused while the call is open.",
    lane: "in-flight",
    quarter: "Q2 2026",
    eta: "2026-05-12",
    ownerRole: "Video Pipeline",
    progress: 25,
    tags: ["content", "ops"],
    link: "/now",
    updatedAt: "2026-05-09",
  },

  // ───────────────────────── ON DECK, next quarter ───────────────────────
  {
    id: "press-wire-first-release",
    title: "First paid press wire, SSRN panel announcement",
    summary:
      "Wire one of the five ready releases through Newswire ($99). Targets the SSRN-panel + agent-credits launch. Tests the desk pickup rate before committing to a quarterly cadence.",
    lane: "on-deck",
    quarter: "Q3 2026",
    eta: "2026-07-15",
    ownerRole: "Distribution Lead",
    progress: 20,
    tags: ["distribution"],
    link: "/press",
    updatedAt: "2026-05-09",
  },
  {
    id: "funnel-hacking-friday",
    title: "Funnel Hacking Friday, weekly competitor teardown",
    summary:
      "Every Friday: a screenshotted teardown of one competitor's funnel (Harmonic, Tracxn, Affinity, Forager, Dealroom). Posted to Twitter/LinkedIn with a link back to /alternatives.",
    lane: "on-deck",
    quarter: "Q3 2026",
    eta: "2026-07-04",
    ownerRole: "Content Lead",
    progress: 10,
    tags: ["content", "distribution"],
    link: "/alternatives",
    updatedAt: "2026-05-09",
  },
  {
    id: "sector-coverage-19-to-24",
    title: "Sector coverage expansion, 19 → 24 sectors",
    summary:
      "Adding climate-software, robotics-ops, identity-infra, healthtech-RWD, fintech-rails-EU. Each gets its own /startups-to-watch/[sector] page and Acceleration Watch coverage.",
    lane: "on-deck",
    quarter: "Q3 2026",
    eta: "2026-08-15",
    ownerRole: "Methodology Lead",
    progress: 15,
    tags: ["data", "content"],
    link: "/methodology",
    updatedAt: "2026-05-09",
  },
  {
    id: "live-ab-experiments-dashboard",
    title: "Live A/B experiments, public conversion log",
    summary:
      "Public dashboard of every experiment we run on /firstlook, /pricing, /apply. Hypothesis → variant → metric → outcome. Read-only, updated weekly.",
    lane: "on-deck",
    quarter: "Q3 2026",
    eta: "2026-08-01",
    ownerRole: "Funnel Engineering",
    progress: 10,
    tags: ["funnel", "ops"],
    link: "/experiments",
    updatedAt: "2026-05-09",
  },
  {
    id: "long-form-vsl",
    title: "Long-Form Video Sales Letter (anonymous narration)",
    summary:
      "Voiceover-only walkthrough of the full pitch, synthetic narration, no founder face, screen-only visuals. Embeds on /vsl, /walkthrough, and /pricing.",
    lane: "on-deck",
    quarter: "Q3 2026",
    eta: "2026-09-01",
    ownerRole: "Video Pipeline",
    progress: 5,
    tags: ["funnel", "content"],
    link: "/vsl",
    blockedBy: ["video-quality-revisit-decision"],
    updatedAt: "2026-05-09",
  },
  {
    id: "insider-circle-telegram",
    title: "Insider Circle private Telegram",
    summary:
      "Live for €97/mo subscribers. Spike alerts, monthly briefings, anonymized portfolio overlap. Replaces the email-only delivery for paying members who want signal velocity.",
    lane: "on-deck",
    quarter: "Q3 2026",
    eta: "2026-08-30",
    ownerRole: "Funnel Engineering",
    progress: 0,
    tags: ["funnel", "ops"],
    link: "/insider",
    updatedAt: "2026-05-09",
  },
  {
    id: "recurring-sector-sweep-rhythm",
    title: "Custom Sector Sweep, recurring quarterly rhythm",
    summary:
      "End-of-quarter deep dives on requested sectors. Capped at 8 per quarter. Buyers can re-up the same sector or rotate; queue is publicly numbered.",
    lane: "on-deck",
    quarter: "Q4 2026",
    eta: "2026-10-01",
    ownerRole: "Methodology Lead",
    progress: 0,
    tags: ["funnel", "data"],
    link: "/sector-sweep",
    updatedAt: "2026-05-09",
  },
  {
    id: "annual-state-of-engineering-velocity-report",
    title: "Annual State of Engineering Velocity report (PDF)",
    summary:
      "Year-end branded PDF, sector-by-sector commit-velocity rankings, year-over-year shifts, methodology updates. Industry-citation play; positioned as the standard reference for the category.",
    lane: "on-deck",
    quarter: "Q4 2026",
    eta: "2026-12-15",
    ownerRole: "Methodology Lead",
    progress: 0,
    tags: ["research", "content"],
    updatedAt: "2026-05-09",
  },

  // ───────────────────────── CONSIDERING ──────────────────────────────────
  {
    id: "european-data-residency",
    title: "European data residency",
    summary:
      "Mirror dashboard + CSV in EU-hosted Postgres for GDPR-strict syndicates. Demand-gated, won't build until two paying funds explicitly request it.",
    lane: "considering",
    quarter: "Q4 2026",
    ownerRole: "Infrastructure",
    progress: 0,
    tags: ["infra"],
    updatedAt: "2026-05-09",
  },
  {
    id: "github-actions-portfolio-watch",
    title: "GitHub Actions integration, portfolio watch",
    summary:
      "Drop your portfolio orgs into a YAML file in your private repo, get a PR comment on weekly velocity changes. Free utility play to seed the agent-native distribution surface.",
    lane: "considering",
    quarter: "Q4 2026",
    ownerRole: "Agent Architect",
    progress: 0,
    tags: ["agent", "distribution"],
    updatedAt: "2026-05-09",
  },
  {
    id: "anonymous-funder-map",
    title: "Anonymous funder map, who's reading the Watch",
    summary:
      "Aggregated view of who reads the Acceleration Watch by region, fund stage, and focus. No individual identity; cohort math only. Tested if it lifts conversion on /pricing.",
    lane: "considering",
    quarter: "Q4 2026",
    ownerRole: "Funnel Engineering",
    progress: 0,
    tags: ["funnel", "content"],
    updatedAt: "2026-05-09",
  },
  {
    id: "multi-language-walkthrough-variants",
    title: "Multi-language walkthrough variants",
    summary:
      "ja, de, fr-FR currently localized on /[locale]; expand to the full /walkthrough + /walkthrough/5min. Will follow first non-English Acceleration Watch subscriber spike.",
    lane: "considering",
    quarter: "Q4 2026",
    ownerRole: "Content Lead",
    progress: 0,
    tags: ["content", "distribution"],
    updatedAt: "2026-05-09",
  },
  {
    id: "cursor-marketplace-listing",
    title: "Cursor Marketplace + Vercel Templates submissions",
    summary:
      "Submit the MCP server to the Cursor marketplace and a deploy template to Vercel Templates. Both are free distribution channels with engineer-investor overlap.",
    lane: "considering",
    quarter: "Q3 2026",
    ownerRole: "Agent Architect",
    progress: 0,
    tags: ["agent", "distribution"],
    updatedAt: "2026-05-09",
  },

  // ───────────────────────── CUT ──────────────────────────────────────────
  {
    id: "discord-community-channel",
    title: "Discord community channel",
    summary:
      "Reactive-only on Cursor #mcp; embedding plan parked. Retired 2026-05-02 per durable rule.",
    lane: "cut",
    quarter: "Q1 2026",
    ownerRole: "Distribution Lead",
    progress: 0,
    tags: ["distribution"],
    reason:
      "Community channels concentrate support load without converting to paid tiers at our funnel mix. Replaced by Telegram for paying members and async email for everyone else.",
    updatedAt: "2026-05-02",
  },
  {
    id: "beehiiv-newsletter-mirror",
    title: "Beehiiv newsletter mirror",
    summary:
      "Mandatory SMS verification fails for Greek mobile numbers. Skip until UK/US virtual number available; mirror lives on Substack instead.",
    lane: "cut",
    quarter: "Q1 2026",
    ownerRole: "Content Lead",
    progress: 0,
    tags: ["distribution", "content"],
    reason:
      "Phone-verification gate blocks signup. Substack mirror covers the same surface area without the gate.",
    updatedAt: "2026-04-20",
  },
  {
    id: "paid-newsletter-sponsorships",
    title: "Paid newsletter sponsorships",
    summary:
      "On hold until earned Tier-1 citation OR 500 paying subs + 3:1 CAC/LTV. Distribution budget routed to Reddit Ads instead this quarter.",
    lane: "cut",
    quarter: "Q2 2026",
    ownerRole: "Distribution Lead",
    progress: 0,
    tags: ["distribution"],
    reason:
      "Cost-per-sub is unproven at our funnel maturity. Earned distribution and Reddit Ads have shorter feedback loops.",
    updatedAt: "2026-04-25",
  },
  {
    id: "founder-podcasts",
    title: "Founder podcasts and on-camera interviews",
    summary:
      "Permanent cut, anonymity rule is a positioning choice, not a temporary constraint. Synthetic-voice guest spots remain on the table separately.",
    lane: "cut",
    quarter: "Q1 2026",
    ownerRole: "Content Lead",
    progress: 0,
    tags: ["content", "distribution"],
    reason:
      "The brand is methodology-first by design. Founder face/voice would re-anchor it on personality, which is the opposite of the manifesto's fourth pillar.",
    updatedAt: "2026-04-15",
  },
  {
    id: "smithery-stdio-legacy-listing",
    title: "Smithery legacy stdio listing",
    summary:
      "Legacy stdio listing model retired upstream. Replaced by HTTP-hosted listing in the in-flight column.",
    lane: "cut",
    quarter: "Q2 2026",
    ownerRole: "Agent Architect",
    progress: 0,
    tags: ["agent"],
    reason:
      "Smithery deprecated stdio in favor of HTTP-hosted listings. We're already re-listed under the new model.",
    updatedAt: "2026-05-05",
  },
];

// Stable ordering: lane priority, then progress (desc), then updatedAt (desc).
const LANE_ORDER: Record<RoadmapLane, number> = {
  shipped: 1,
  "in-flight": 2,
  "on-deck": 3,
  considering: 4,
  cut: 5,
};

export function getItemsByLane(lane: RoadmapLane): RoadmapItem[] {
  return ROADMAP_ITEMS
    .filter((it) => it.lane === lane)
    .sort((a, b) => {
      if (b.progress !== a.progress) return b.progress - a.progress;
      return b.updatedAt.localeCompare(a.updatedAt);
    });
}

export function getAllRoadmapItems(): RoadmapItem[] {
  return [...ROADMAP_ITEMS].sort((a, b) => {
    const laneDiff = LANE_ORDER[a.lane] - LANE_ORDER[b.lane];
    if (laneDiff !== 0) return laneDiff;
    if (b.progress !== a.progress) return b.progress - a.progress;
    return b.updatedAt.localeCompare(a.updatedAt);
  });
}

export function getRecentlyMovedItems(limit = 8): RoadmapItem[] {
  return [...ROADMAP_ITEMS]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, limit);
}

export const ROADMAP_LANES: { lane: RoadmapLane; label: string; color: string }[] = [
  { lane: "shipped", label: "Shipped", color: "emerald" },
  { lane: "in-flight", label: "In flight", color: "sky" },
  { lane: "on-deck", label: "On deck", color: "amber" },
  { lane: "considering", label: "Considering", color: "violet" },
  { lane: "cut", label: "Cut", color: "rose" },
];

/** Last roadmap update across the whole board. ISO date. */
export function getRoadmapLastUpdated(): string {
  return ROADMAP_ITEMS.map((it) => it.updatedAt).sort().reverse()[0] ?? "2026-05-09";
}

/** Counts per lane, surfaces in board nav + JSON feed. */
export function getLaneCounts(): Record<RoadmapLane, number> {
  return ROADMAP_ITEMS.reduce(
    (acc, it) => {
      acc[it.lane] = (acc[it.lane] ?? 0) + 1;
      return acc;
    },
    { shipped: 0, "in-flight": 0, "on-deck": 0, considering: 0, cut: 0 } as Record<RoadmapLane, number>,
  );
}
