/**
 * Brunson Product Launch Funnel (DotCom Secrets Ch 15) — content layer.
 *
 * Each entry is a 4-stage launch sequence with one launch surface per shipped
 * feature. The 4 stages map to Russell's classic PLF: Stage 1 names the
 * problem; Stage 2 dissects why current solutions fail; Stage 3 reveals the
 * fix this launch represents; Stage 4 opens the cart with a window.
 *
 * Anonymity-respecting: text only, no video, no founder face. The arc still
 * delivers the PLF tension because the four stages are the structure — the
 * medium is incidental.
 */

export interface LaunchStage {
  /** "1" through "4". Treated as ordering only — render as Stage labels. */
  n: 1 | 2 | 3 | 4;
  /** Short stage caption. Brunson uses these as section headers. */
  caption: string;
  /** Stage headline — the H2-equivalent above the body. */
  headline: string;
  /** Multi-paragraph body (markdown-ish, but rendered as plain paragraphs). */
  body: string[];
}

export interface Launch {
  slug: string;
  /** Whether this launch's window is currently open. Renders the cart CTA. */
  isOpen: boolean;
  /** ISO date the cart window closes. Drives countdown copy. */
  closesAt: string;
  /** Anchor headline for the launch (matches H1). */
  headline: string;
  /** One-sentence hook — appears under H1 and in OG. */
  hook: string;
  /** SSRN-style abstract: the "what is this" in 80 words. */
  abstract: string;
  /** Stack slide for the launch. Itemised value → close price. */
  stack: { label: string; standalone: string }[];
  /** Standalone-value summed line, e.g. "€1,728/year of value". */
  standaloneTotal: string;
  /** What the buyer pays during the launch window. */
  launchPrice: string;
  /** What the buyer pays after the window closes. */
  postLaunchPrice: string;
  /** The four PLF stages. */
  stages: LaunchStage[];
  /** Where the cart button points. */
  buyUrl: string;
  /** What the cart button reads. */
  ctaLabel: string;
  /** Reverse-chronological cohort tag for email sequence routing. */
  cohort: string;
  /** Optional FAQ entries below the stack. */
  faq: { q: string; a: string }[];
}

export const LAUNCHES: Launch[] = [
  {
    slug: "agent-credits",
    isOpen: true,
    closesAt: "2026-05-20T23:59:00Z",
    headline:
      "100 deep-signal API calls for €19. The first signal-engine pricing built for AI agents, not humans.",
    hook:
      "Every other deal-flow tool charges per seat. Agents don’t have seats — they have call volumes. Agent Credits prices the engine the way agents actually consume it.",
    abstract:
      "Agent Credits is a per-call pricing tier for the GitDealFlow signal engine, designed for autonomous agents that programmatically diligence GitHub orgs. €0.19 per deep-signal call, sold in packs of 100. Misses are free. Credits never expire. The six existing free MCP tools stay free forever — Agent Credits applies only to the new get_deep_signal tool and POST /api/agent/deep-signal.",
    stack: [
      {
        label: "100 deep-signal API calls (no expiry)",
        standalone: "€19 — the launch price (€0.19 per call)",
      },
      {
        label: "get_deep_signal MCP tool — Claude/Cursor/any-MCP-host",
        standalone: "€0 — bundled",
      },
      {
        label: "POST /api/agent/deep-signal HTTP endpoint",
        standalone: "€0 — bundled",
      },
      {
        label: "Idempotency via X-Request-Id (no double-billing on retry)",
        standalone: "€0 — bundled",
      },
      {
        label: "Misses are free (only billed for matched orgs)",
        standalone: "€0 — bundled",
      },
      {
        label: "Live ledger at /agents/credits showing remaining balance",
        standalone: "€0 — bundled",
      },
      {
        label: "Free 5-call sample (no card) for testing the integration",
        standalone: "€19 of value — bundled",
      },
    ],
    standaloneTotal: "€38 of standalone value",
    launchPrice: "€19 for 100 calls (locked at €0.19/call forever)",
    postLaunchPrice: "€29 for 100 calls (€0.29/call) after May 20",
    stages: [
      {
        n: 1,
        caption: "Stage 1 — The problem",
        headline:
          "AI agents are already running diligence. Nobody is selling them the data on agent terms.",
        body: [
          "Spend two minutes inside Claude or Cursor with an MCP server attached and the future is obvious. Agents don’t scroll dashboards. They issue tool calls. They scrape, score, decide, and ship a memo before you finish your coffee.",
          "Every signal-data product on the market still bills humans by the seat — €99/month, $299/month, €497/month — assuming a partner clicks through pages. None of them have a credit-meter that an agent can spend against.",
          "The result is the absurd status quo: an AI scout running on a developer-investor’s laptop pays €97 for a full Insider Circle subscription it consumes in 11 minutes of Sunday-morning research, then idles for six days. The data product has no way to charge proportionally, so it overcharges or undercharges depending on the day.",
        ],
      },
      {
        n: 2,
        caption: "Stage 2 — Why every current fix fails",
        headline:
          "‘Just sell us a higher seat tier’ doesn’t work. Agents have a different consumption shape than humans.",
        body: [
          "I tried two fixes before I built this one. First, I tried higher Insider tiers (€97 → €197 → €497). The math broke immediately: a single agent scaling across 4,200 orgs ends up running ~30,000 deep-signal calls in a weekend. €497/month doesn’t cover the GitHub-API cost layer underneath, let alone the regression compute.",
          "Second, I tried a flat ‘fair-use ceiling.’ That’s the SaaS-pricing equivalent of duct tape. The honest agents stay polite at 200 calls/month. The dishonest ones blow through 30,000 the first week and the ceiling becomes the entire ceiling — at which point the only honest move is to cut their API access, which is a worse experience than just charging them per call up front.",
          "What this product needed was the simplest economic model in software: a credit. Pay for the call, get the result, walk away. No subscription, no overage drama, no per-seat fiction. The fix had to be priced by what an agent actually does, not by what a human looks like to a billing system.",
        ],
      },
      {
        n: 3,
        caption: "Stage 3 — The fix I built",
        headline:
          "100 deep-signal calls for €19. €0.19 per call. Locked forever for launch buyers.",
        body: [
          "Agent Credits is a single, dead-simple integer balance attached to your API key. Every successful deep-signal call decrements your balance by 1. Misses (no matching org) decrement by zero. Credits never expire. You buy more when you run out.",
          "The first 100 calls cost €19 — €0.19 per call — and that price is locked forever for buyers in this launch window. After May 20, the standard rate becomes €29 per 100 (€0.29 per call) for new buyers. Existing buyers keep €0.19 indefinitely.",
          "Integration is two lines. With Claude Desktop or Cursor: install @gitdealflow/mcp-signal, set GITDEALFLOW_API_KEY, the new get_deep_signal tool appears next to the six free tools you already have. With raw HTTP: POST /api/agent/deep-signal with a GitHub org slug, get back the full signal panel JSON. Every retry with the same X-Request-Id is idempotent — no double-billing.",
        ],
      },
      {
        n: 4,
        caption: "Stage 4 — Cart open until May 20",
        headline:
          "Buy a 100-call pack at €19 today, lock €0.19/call for the lifetime of the engine.",
        body: [
          "Two ways to start. The free 5-call sample at /agents/credits/sample needs no card and no commitment — drop your email, get an API key, run five real deep-signal calls inside Claude or Cursor. If the integration fits, the €19 pack upgrades the same key.",
          "The €19 launch price closes May 20 at midnight UTC. After that, new buyers pay €29 for the same 100-call pack. Buyers from this window keep €0.19/call forever — even on future top-ups.",
          "If your sourcing is already routed through an agent, this is the cheapest data layer you’re going to find for a deep-signal call. If your sourcing isn’t agent-routed yet, the free Sunday digest stays free regardless of whether you buy this. The Agent Credits launch doesn’t change anything about the human-facing tiers.",
        ],
      },
    ],
    buyUrl: "https://buy.stripe.com/agent-credits-100",
    ctaLabel: "Lock €0.19/call — €19 for 100 calls →",
    cohort: "launch-agent-credits",
    faq: [
      {
        q: "What counts as a ‘deep-signal call’?",
        a: "One call returns the full signal panel for one GitHub org — commit-velocity acceleration, contributor-diversity Gini, dependents-graph external count, README-freshness diff size, new-repo-creation rate, issue-to-PR ratio, and the composite score. Calls against orgs not in our universe (4,200+ venture-backed startup orgs) are misses and don’t decrement your balance.",
      },
      {
        q: "Is this rate-limited?",
        a: "Soft rate limit at 60 calls/minute per API key. Above that, you queue (no errors, just wait). If you have a sustained-throughput use case above that ceiling, email signal@gitdealflow.com and we’ll provision a higher key for the same per-call price.",
      },
      {
        q: "Do credits expire?",
        a: "No. The balance lives until you spend it. Buy 100 calls today, use them over five years, no penalty.",
      },
      {
        q: "Why is this a launch, not just a price?",
        a: "Two reasons. One — locking €0.19/call forever for launch buyers gives early agents a permanent margin advantage as the standard rate climbs. Two — a launch window forces me to ship the integration tooling (the MCP tool, the idempotency layer, the live balance UI) on a deadline rather than a someday. The window is real, the discount is real, and after May 20 the standard rate is €0.29/call for new buyers.",
      },
    ],
  },
];

export function getLaunchBySlug(slug: string): Launch | undefined {
  return LAUNCHES.find((l) => l.slug === slug);
}

export function getAllLaunchSlugs(): string[] {
  return LAUNCHES.map((l) => l.slug);
}

export const OPEN_LAUNCH = LAUNCHES.find((l) => l.isOpen);
