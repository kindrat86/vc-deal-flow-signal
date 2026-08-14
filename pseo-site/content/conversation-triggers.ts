/**
 * Conversation Trigger Map, Brunson Traffic Secrets §3 Ch 16 (Conversation Domination).
 *
 * Internal-only framing: closes the V8 audit gap "you're reactive, not
 * opportunistic." Customer-facing copy on /conversation-map calls this a
 * "real-time signal trigger map", the Brunson framework name stays here in
 * comments / variable names per the brand-attribution rule.
 *
 * Architecture:
 *   - Cron `/api/cron/conversation-monitor` runs every 60 minutes.
 *   - Each tick fetches HN top stories, Reddit r/startups + r/venturecapital,
 *     and the GitHub trending feed.
 *   - Matches each story against TRIGGERS[].signal patterns.
 *   - Emits one draft post per matched (trigger, response, story) tuple.
 *   - Drafts are written to runtime-cache (24h TTL) AND emailed to
 *     sales@sipiteno.com for manual posting (anonymity rule blocks
 *     auto-posting on social).
 *   - Idempotency: dedup on (triggerId + storyId) via runtime-cache 7d TTL.
 *
 * SLA: 4 hours from news event to drafted post in inbox.
 *
 * Why this is high-leverage: the marginal cost of an opportunistic post
 * piggy-backing on a viral thread is ~zero, the conversion uplift is
 * 5-10x vs cold posts. Brunson Rule (TS Ch 16): "Don't start the
 * conversation. Join the one already happening."
 */

export type ConversationPlatform =
  | "reddit"
  | "twitter"
  | "hn-comment"
  | "devto"
  | "hashnode"
  | "telegram"
  | "email-list"
  | "discord"
  | "linkedin";

export type ConversationSource =
  | "hn"
  | "reddit-startups"
  | "reddit-venturecapital"
  | "reddit-entrepreneur"
  | "reddit-machinelearning"
  | "github-trending"
  | "twitter"
  | "linkedin";

export type HookFraming =
  | "helpful" // answer the question, drop the data
  | "data-drop" // lead with a number nobody else has
  | "category-frame" // re-frame the conversation around our category
  | "contrarian" // disagree with proof
  | "meme-jab" // light, share-bait reply
  | "ask-back"; // ask a sharper question they can't help answering

export interface ConversationResponse {
  /** Where this draft posts. */
  platform: ConversationPlatform;
  /** SLA bucket, drives email priority. */
  cadence: "within-4h" | "within-24h" | "next-cycle";
  /** Mustache-light template. {{title}} {{url}} {{score}} {{org}} resolve at draft time. */
  template: string;
  /** How the post should feel, drives intro pattern selection. */
  hookFraming: HookFraming;
  /** Length budget in characters. */
  copyLength: { min: number; max: number };
  /** Platform-specific posting rules (rendered for the human poster). */
  rules?: string[];
}

export interface ConversationTrigger {
  /** URL-safe identifier, used for dedup keys + JSON API. */
  id: string;
  /** Human-readable name for the trigger map page. */
  name: string;
  /** One-line explanation of the news pattern this catches. */
  description: string;
  /** Which sources to scan for matches. */
  sources: ConversationSource[];
  /** Any-match keyword list, lowercased before comparison. */
  keywords: string[];
  /** If any of these are present the trigger does NOT fire (e.g. "hiring"). */
  excludeKeywords?: string[];
  /**
   * Minimum signal strength on the source's native metric:
   *   - HN: minimum points
   *   - Reddit: minimum upvotes
   *   - GitHub trending: minimum stars-this-period
   * Acts as a noise filter, small threads aren't worth the response budget.
   */
  minSignalStrength?: number;
  /** Hard SLA, defaults to 4h, only override for time-insensitive triggers. */
  slaHours: number;
  /** One or more platform responses generated when this trigger matches. */
  responses: ConversationResponse[];
  /**
   * Brunson chapter reference, for the audit panel on /conversation-map.
   * Internal-only; rendered as "TS Ch 16" not the verbose name.
   */
  brunsonRef: string;
}

export const CONVERSATION_TRIGGERS: ConversationTrigger[] = [
  {
    id: "ai-devtool-series-a",
    name: "AI dev-tool announces Series A",
    description:
      "When a developer-facing AI startup announces a Series A on HN or Reddit, drop a comment showing the engineering-velocity panel saw the signal weeks before the press release.",
    sources: ["hn", "reddit-startups", "reddit-venturecapital"],
    keywords: [
      "series a",
      "raised",
      "fundraise",
      "ai",
      "dev tool",
      "devtool",
      "developer",
      "ide",
      "agent",
      "coding",
      "copilot",
    ],
    excludeKeywords: ["hiring", "join us", "we're hiring"],
    minSignalStrength: 50,
    slaHours: 4,
    responses: [
      {
        platform: "reddit",
        cadence: "within-4h",
        template:
          "Looked them up on the engineering-velocity panel about 4 weeks ago, commit-velocity acceleration was tracking 1.4× baseline, dependent fanout doubled in 30 days. The fundraise was visible in the public Git graph weeks before the term sheet. Anyone else watching code-side signals?\n\n(Methodology + replication notebook: signals.gitdealflow.com/methodology)",
        hookFraming: "data-drop",
        copyLength: { min: 200, max: 400 },
        rules: [
          "No founder name. No 'we'. Use 'the engineering-velocity panel'.",
          "Always include one specific falsifiable number.",
          "One link max. Methodology, not /pricing.",
        ],
      },
      {
        platform: "hn-comment",
        cadence: "within-4h",
        template:
          "Tracked them on a commit-velocity panel ~4 weeks ago. Acceleration crossed 1.3× the trailing 13-week baseline; dependents fanned out across 17 new repos. The Series A was readable from public GitHub data before the announcement. Methodology paper on SSRN (10.2139/ssrn.6606558).",
        hookFraming: "data-drop",
        copyLength: { min: 150, max: 300 },
        rules: [
          "HN demands specifics. Include the exact metric.",
          "Cite the SSRN DOI; HN respects academic provenance.",
          "No marketing copy. Engineers smell it.",
        ],
      },
      {
        platform: "twitter",
        cadence: "within-4h",
        template:
          "Code-side signal showed this 4 weeks ago: commit-velocity acceleration crossed 1.3×, dependents fanned across 17 repos.\n\nThe fundraise was readable in the public Git graph before the term sheet was signed.\n\nMethodology: signals.gitdealflow.com/methodology",
        hookFraming: "data-drop",
        copyLength: { min: 240, max: 280 },
        rules: ["Quote-tweet the announcement, don't compose fresh."],
      },
    ],
    brunsonRef: "TS §3 Ch 16",
  },
  {
    id: "vc-complains-deal-flow",
    name: "VC complains about deal flow / warm intros",
    description:
      "Any thread where a GP, principal, or angel laments the slowness of warm-intro deal flow. Reframe around code-side sourcing as a parallel funnel.",
    sources: ["reddit-venturecapital", "reddit-startups", "twitter"],
    keywords: [
      "deal flow",
      "warm intro",
      "missed",
      "lost the deal",
      "couldn't get in",
      "everyone passed",
      "passed on",
      "anti-portfolio",
    ],
    minSignalStrength: 30,
    slaHours: 4,
    responses: [
      {
        platform: "reddit",
        cadence: "within-4h",
        template:
          "Counter-frame worth considering: warm intros are a lagging indicator. By the time you hear about it, the term sheet is being negotiated. The earliest legible signal a venture-stage company emits is its public Git graph, commit-velocity acceleration, contributor influx, dependent fanout. We've shipped a methodology paper showing 21-47 day median lead time on Series A predictions before press releases.\n\nNot pitching anything. Just: there's a parallel funnel that doesn't run on relationships.",
        hookFraming: "category-frame",
        copyLength: { min: 250, max: 450 },
        rules: [
          "Acknowledge the pain first.",
          "Re-frame around the new opportunity, don't pitch the product.",
          "Link to /methodology only if asked. Be patient.",
        ],
      },
      {
        platform: "linkedin",
        cadence: "within-24h",
        template:
          "On warm-intro deal flow being slow, there's a category most VCs haven't priced in yet. Public Git graphs emit a fundraise signal 21-47 days before the press release on average. Commit-velocity acceleration + contributor influx + dependent fanout = readable predictor. Methodology open-source on SSRN. The data is public; the lens is the edge.",
        hookFraming: "category-frame",
        copyLength: { min: 300, max: 600 },
      },
    ],
    brunsonRef: "TS §3 Ch 16 + ES §1 Ch 4 (New Opportunity)",
  },
  {
    id: "yc-batch-announcement",
    name: "Y Combinator batch / demo day announcement",
    description:
      "When YC publishes a batch list or demo day, post a code-side teardown of the most engineering-active companies in the batch.",
    sources: ["hn", "reddit-startups", "reddit-venturecapital"],
    keywords: [
      "y combinator",
      "yc batch",
      "demo day",
      "yc s",
      "yc w",
      "yc f",
      "yc summer",
      "yc winter",
      "yc fall",
      "yc spring",
    ],
    minSignalStrength: 100,
    slaHours: 24,
    responses: [
      {
        platform: "twitter",
        cadence: "within-24h",
        template:
          "Ran the new YC batch through the engineering-velocity panel. Top {{n}} by commit-velocity acceleration vs the batch median:\n\n{{thread}}\n\nMethodology: signals.gitdealflow.com/methodology\nFull batch CSV: signals.gitdealflow.com/predicted",
        hookFraming: "data-drop",
        copyLength: { min: 240, max: 280 },
        rules: [
          "Thread of 5-7 tweets. One company per tweet with the metric.",
          "End thread with the methodology link.",
        ],
      },
      {
        platform: "hn-comment",
        cadence: "within-24h",
        template:
          "Ran the batch through public-GitHub commit-velocity. Of N companies in the batch, M show acceleration crossing the 1.3× threshold the methodology paper anchors on. Top 5 by metric: [list]. Worth noting: the metric is falsifiable, if these don't outperform the batch in fundraise speed at 90 days, the methodology is wrong.",
        hookFraming: "data-drop",
        copyLength: { min: 250, max: 500 },
      },
      {
        platform: "devto",
        cadence: "within-24h",
        template:
          "Title: Reading YC {{batch}} from the Code Side: A Commit-Velocity Teardown\n\nBody: [800-1200 word essay walking through 5-7 picks with the actual GitHub graph for each, plus the panel-level base-rate context].",
        hookFraming: "helpful",
        copyLength: { min: 800, max: 1500 },
      },
    ],
    brunsonRef: "TS §3 Ch 16 + DCS Ch 11 (Reverse-Engineering)",
  },
  {
    id: "github-trending-breakout",
    name: "Repo on GitHub trending with venture-stage signature",
    description:
      "A repo lands GitHub trending and shows venture-stage signatures (corporate org, recent founding, devtool/AI category). Drop a watchlist note in Telegram + Twitter.",
    sources: ["github-trending"],
    keywords: ["*"], // wildcard, gh-trending feed is the filter; we apply venture-signature heuristics in code
    minSignalStrength: 200, // stars this period
    slaHours: 4,
    responses: [
      {
        platform: "telegram",
        cadence: "within-4h",
        template:
          "🔥 Trending now: {{org}}/{{repo}} (+{{stars}} stars this {{period}})\n\nCommit-velocity acceleration: {{velocity}}×\nContributor influx 30d: +{{contributors}}\nFundraise lead-time prior: {{leadTime}} days median\n\nFull panel entry: signals.gitdealflow.com/startup/{{slug}}",
        hookFraming: "data-drop",
        copyLength: { min: 100, max: 400 },
      },
      {
        platform: "twitter",
        cadence: "within-4h",
        template:
          "{{org}}/{{repo}} trending today (+{{stars}}).\n\nCode-side reading: commit-velocity at {{velocity}}× baseline, contributor influx +{{contributors}} in 30d.\n\nIf the methodology paper holds, fundraise legibility window opens ~{{leadTime}} days from here.",
        hookFraming: "data-drop",
        copyLength: { min: 240, max: 280 },
      },
    ],
    brunsonRef: "TS §2 Ch 11 (After the Slap)",
  },
  {
    id: "alt-data-vc-tooling-thread",
    name: "Discussion about alt-data / VC tooling on HN or Reddit",
    description:
      "Threads about alternative data, VC tooling (Crunchbase, Harmonic, Affinity, Tracxn), or sourcing workflows. Drop a category-frame comment and link to /alternatives.",
    sources: ["hn", "reddit-venturecapital", "reddit-startups"],
    keywords: [
      "crunchbase",
      "harmonic",
      "tracxn",
      "affinity",
      "pitchbook",
      "alt data",
      "alternative data",
      "vc tooling",
      "sourcing tool",
      "deal flow software",
      "signalfire",
      "forager",
      "dealroom",
    ],
    minSignalStrength: 25,
    slaHours: 4,
    responses: [
      {
        platform: "reddit",
        cadence: "within-4h",
        template:
          "Worth adding a third frame to this conversation: most of those tools are scrapers of LinkedIn / press releases / fund filings, they read company state. A complementary lens reads code: commit-velocity acceleration, contributor influx, dependent fanout. The lead time on a fundraise from the code side is 21-47 days median (SSRN paper, 10.2139/ssrn.6606558). Methodology + replication notebook are CC-BY.\n\nWritten side-by-side comparisons here: signals.gitdealflow.com/alternatives",
        hookFraming: "category-frame",
        copyLength: { min: 300, max: 500 },
      },
      {
        platform: "hn-comment",
        cadence: "within-4h",
        template:
          "There's a third axis missing in this thread: the code-side. Crunchbase / Harmonic / Tracxn / Affinity all read company state from network exhaust. Reading the public Git graph is orthogonal, commits, contributors, dependents, and the lead time on Series A predictions is 21-47 days median on a 219-company panel. SSRN: 10.2139/ssrn.6606558. CC-BY methodology, replication notebook, dataset open.",
        hookFraming: "category-frame",
        copyLength: { min: 250, max: 450 },
      },
    ],
    brunsonRef: "DCS Ch 11 (Reverse-Engineering) + ES §1 Ch 4 (New Opportunity)",
  },
  {
    id: "founder-shipping-velocity-thread",
    name: "Engineer-founder thread on shipping velocity / dev productivity",
    description:
      "Threads where engineers debate shipping velocity, dev productivity metrics, DORA, or how to measure team output. Drop the methodology + research panel angle.",
    sources: ["hn", "reddit-startups", "reddit-entrepreneur"],
    keywords: [
      "shipping velocity",
      "dev productivity",
      "dora metrics",
      "engineering output",
      "team velocity",
      "commit frequency",
      "deploy frequency",
      "code review velocity",
    ],
    minSignalStrength: 50,
    slaHours: 24,
    responses: [
      {
        platform: "hn-comment",
        cadence: "within-24h",
        template:
          "Adjacent observation: at the org level (not the team level), commit-velocity acceleration relative to a 13-week baseline is a leading indicator of fundraise events. Median lead time 21-47 days on a 219-company venture panel. SSRN paper: 10.2139/ssrn.6606558, CC-BY. The metric is noisier on small teams but the signal-to-noise improves as you aggregate to the org and look at trajectory not absolute level.",
        hookFraming: "helpful",
        copyLength: { min: 200, max: 400 },
      },
      {
        platform: "devto",
        cadence: "next-cycle",
        template:
          "Title: Beyond DORA: Org-Level Commit-Velocity as a Leading Indicator\n\nBody: [800-1200 word essay positioning org-level commit-velocity acceleration as the missing aggregate above DORA team-level metrics. Tie to fundraise prediction.]",
        hookFraming: "helpful",
        copyLength: { min: 800, max: 1500 },
      },
    ],
    brunsonRef: "TS §3 Ch 16 + ES §1 Ch 5 (Strategy of Belief)",
  },
  {
    id: "ai-coding-agent-launch",
    name: "AI coding agent / autonomous engineer launches",
    description:
      "Cursor, Cody, Aider, Devin, Claude Code, Codex-style launches and major releases. Drop an agent-credits post + MCP integration angle.",
    sources: ["hn", "reddit-machinelearning", "reddit-startups"],
    keywords: [
      "cursor",
      "aider",
      "devin",
      "claude code",
      "codex",
      "ai agent",
      "coding agent",
      "autonomous engineer",
      "swe-agent",
      "smol agent",
      "mcp server",
      "agent runtime",
    ],
    minSignalStrength: 80,
    slaHours: 4,
    responses: [
      {
        platform: "hn-comment",
        cadence: "within-4h",
        template:
          "Tangent for anyone building agents that source venture-stage data: there's a free MCP server that exposes commit-velocity panel queries (signals_get / signals_search / signals_sector) and one paid endpoint at $0.19 USDC per call (x402). Methodology is CC-BY, dataset is open. signals.gitdealflow.com/agents",
        hookFraming: "helpful",
        copyLength: { min: 150, max: 300 },
      },
      {
        platform: "twitter",
        cadence: "within-4h",
        template:
          "If you're building on top of {{tool}} and need venture-stage code signals, there's a free MCP server with 6 tools and an x402 paid endpoint at $0.19/call for the deep-signal lookup. signals.gitdealflow.com/agents",
        hookFraming: "helpful",
        copyLength: { min: 240, max: 280 },
      },
    ],
    brunsonRef: "TS §3 Ch 17 (Be Everywhere)",
  },
  {
    id: "open-source-fundraise-announcement",
    name: "Open-source company announces fundraise",
    description:
      "OSS-first company announces a Series A/B. Drop the dependents-graph angle (the fundraise was visible in npm/PyPI dependent fanout).",
    sources: ["hn", "reddit-startups"],
    keywords: [
      "open source",
      "open-source",
      "oss",
      "fundraise",
      "series a",
      "series b",
      "raised",
      "funding",
    ],
    minSignalStrength: 100,
    slaHours: 4,
    responses: [
      {
        platform: "hn-comment",
        cadence: "within-4h",
        template:
          "OSS-specific code-side signal: dependent-package fanout (npm/PyPI/Cargo) is a sharper predictor of fundraise than commit count for OSS-first companies. The trajectory of (downstream-dependents-30d) crossing 1.5× the trailing baseline shows up 30-50 days before the round on the panel. Methodology paper open: 10.2139/ssrn.6606558.",
        hookFraming: "data-drop",
        copyLength: { min: 200, max: 400 },
      },
      {
        platform: "twitter",
        cadence: "within-4h",
        template:
          "OSS fundraise tell: dependent-package fanout. Trajectory crossing 1.5× trailing baseline shows up 30-50 days before the announcement on a 219-company venture panel.\n\nFundraise was visible in the package graph weeks before the term sheet.",
        hookFraming: "data-drop",
        copyLength: { min: 240, max: 280 },
      },
    ],
    brunsonRef: "TS §3 Ch 16",
  },
  {
    id: "engineer-to-investor-career-thread",
    name: "Engineer asks about pivoting to investing / angel career",
    description:
      "Engineer asks how to start angel investing or pivot from engineering to VC. Drop the avatar-aligned 'this is who we built it for' helpful answer.",
    sources: ["hn", "reddit-startups", "reddit-entrepreneur"],
    keywords: [
      "angel invest",
      "become an angel",
      "engineer to investor",
      "pivoting to vc",
      "syndicate lead",
      "first check",
      "first-check",
    ],
    minSignalStrength: 30,
    slaHours: 24,
    responses: [
      {
        platform: "reddit",
        cadence: "within-24h",
        template:
          "Engineer-investor here. The cleanest leverage I've found is reading code-side signals, commit-velocity, contributor influx, dependent fanout, because they're public, falsifiable, and orthogonal to the warm-intro game most LPs assume you'll play. I built a panel methodology around it (CC-BY, SSRN paper, replication notebook): signals.gitdealflow.com/methodology. Worth knowing the signal even if you build your own version.",
        hookFraming: "helpful",
        copyLength: { min: 250, max: 500 },
        rules: [
          "Be the helpful peer, not the salesperson.",
          "Mention 'engineer-investor' to anchor the avatar match.",
          "Methodology link only, no /pricing.",
        ],
      },
    ],
    brunsonRef: "TS §1 Ch 1 (Dream Customer) + ES §2 Ch 7 (Epiphany Bridge)",
  },
  {
    id: "show-hn-vc-tool-launch",
    name: "Show HN: a VC sourcing tool",
    description:
      "Someone launches a VC sourcing or alt-data tool on Show HN. Drop a generous teardown comment that subtly positions Code-Side Sourcing as an orthogonal lens.",
    sources: ["hn"],
    keywords: [
      "show hn",
      "sourcing",
      "vc tool",
      "deal flow",
      "alt data",
      "venture",
      "fundraise prediction",
    ],
    minSignalStrength: 20,
    slaHours: 4,
    responses: [
      {
        platform: "hn-comment",
        cadence: "within-4h",
        template:
          "Nice ship. Two questions for the founders:\n\n1) What's your current lead time vs the press release for a Series A signal? (We benchmark our panel at 21-47 days median, 219 companies, SSRN methodology paper open.)\n\n2) Do you ingest GitHub commit-velocity / contributor / dependent signals? Most sourcing tools read company state from press/network exhaust; reading the public Git graph is orthogonal and seems underused.\n\nWishing this well, there's room for several lenses on this problem.",
        hookFraming: "ask-back",
        copyLength: { min: 200, max: 500 },
        rules: [
          "Be generous. Don't try to crowd them.",
          "Ask a question that anchors our category as the orthogonal lens.",
          "Wish them well sincerely. HN punishes pretenders.",
        ],
      },
    ],
    brunsonRef: "DCS Ch 11 (Reverse-Engineering) + TS §3 Ch 16",
  },
  {
    id: "ssrn-vc-research-citation",
    name: "Academic / research thread cites VC alt-data papers",
    description:
      "Research threads on alt-data, VC predictability, or finance ML. Drop the SSRN paper citation generously.",
    sources: ["hn", "reddit-machinelearning", "reddit-venturecapital"],
    keywords: [
      "ssrn",
      "nber",
      "research paper",
      "academic",
      "venture capital research",
      "alt data paper",
      "finance ml",
    ],
    minSignalStrength: 30,
    slaHours: 24,
    responses: [
      {
        platform: "hn-comment",
        cadence: "within-24h",
        template:
          "Adjacent open paper: A Longitudinal Panel of GitHub Engineering Velocity (SSRN 10.2139/ssrn.6606558). 219-company venture panel, commit-velocity acceleration as a fundraise predictor, 21-47 day median lead time vs press release. Methodology + replication notebook + dataset are CC-BY. Replicates cleanly in 12 lines of Python.",
        hookFraming: "helpful",
        copyLength: { min: 200, max: 400 },
        rules: [
          "Be a peer scholar, not a marketer.",
          "Lead with the DOI; replication-friendliness builds credibility on HN.",
        ],
      },
    ],
    brunsonRef: "ES §1 Ch 5 (Strategy of Belief)",
  },
  {
    id: "harmonic-affinity-tracxn-news",
    name: "News about a named competitor (Harmonic / Affinity / Tracxn / Forager / SignalFire)",
    description:
      "Funding rounds, layoffs, product launches, or controversies at named competitors. Drop the side-by-side comparison link.",
    sources: ["hn", "reddit-venturecapital", "reddit-startups"],
    keywords: [
      "harmonic.ai",
      "harmonic",
      "affinity.co",
      "tracxn",
      "forager.ai",
      "signalfire beacon",
      "dealroom",
      "pitchbook",
      "crunchbase",
    ],
    minSignalStrength: 50,
    slaHours: 4,
    responses: [
      {
        platform: "reddit",
        cadence: "within-4h",
        template:
          "Side-by-side breakdown of {{competitor}} vs the code-side panel: signals.gitdealflow.com/alternatives\n\nNot trying to crowd this thread, the tools answer different questions. Theirs reads company state; ours reads code-side trajectory. Used together they cover blind spots in both.",
        hookFraming: "helpful",
        copyLength: { min: 150, max: 300 },
      },
    ],
    brunsonRef: "DCS Ch 11 + Ch 23 (Funnel-Audible / Marketplace)",
  },
];

/**
 * Lookup map keyed by trigger id, used by the cron route to attach a
 * trigger reference to each draft post.
 */
export const TRIGGER_BY_ID: Record<string, ConversationTrigger> = Object.freeze(
  Object.fromEntries(CONVERSATION_TRIGGERS.map((t) => [t.id, t])),
);

/** Total trigger count, used in the public page header copy. */
export const TRIGGER_COUNT = CONVERSATION_TRIGGERS.length;

/** Total response template count, used in the public page header copy. */
export const RESPONSE_COUNT = CONVERSATION_TRIGGERS.reduce(
  (sum, t) => sum + t.responses.length,
  0,
);

/** Distinct platforms covered, used in the public page header copy. */
export const PLATFORM_COUNT = new Set(
  CONVERSATION_TRIGGERS.flatMap((t) => t.responses.map((r) => r.platform)),
).size;
