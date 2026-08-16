/**
 * Brunson Product Launch Funnel, DotCom Secrets Ch 22 (Jeff Walker PLF).
 *
 * The 4 stages map to the canonical Jeff Walker PLC sequence Russell teaches
 * in DotCom Secrets:
 *
 *   1. Sideways Story       , show the bigger opportunity, why now
 *   2. Ownership Experience , what it's like to own this; let them taste it
 *   3. Internal Struggle    , address the doubts, the objections, the fears
 *   4. Big Idea / Open Cart , make the offer, name the window
 *
 * Anonymity rule: text + synthetic-voice video only. No founder face, no
 * founder voice, no real-name signature. The Stadium-Pitch monthly cron
 * (Cartesia Theo + Remotion) renders the synthetic walkthroughs that fill
 * the `videoCue` slots.
 */

export type VideoCueKind = "youtube" | "synthetic-stadium-pitch" | "scheduled";

export interface VideoCue {
  /** Embed source. `scheduled` renders a placeholder card with a date. */
  kind: VideoCueKind;
  /** YouTube video ID (when kind === "youtube"). */
  youtubeId?: string;
  /** Title displayed above the embed/placeholder. */
  title: string;
  /** Duration in seconds, used for VideoObject schema. */
  durationSeconds: number;
  /** ISO date the synthetic render is queued for (when kind === "scheduled"). */
  scheduledFor?: string;
  /** Human caption shown under the embed. */
  caption: string;
}

export type PLCStage =
  | "sideways-story"
  | "ownership-experience"
  | "internal-struggle"
  | "big-idea";

export interface LaunchStage {
  /** "1" through "4". Treated as ordering only, render as Stage labels. */
  n: 1 | 2 | 3 | 4;
  /** Jeff Walker PLC stage type, drives the badge under the number. */
  plc: PLCStage;
  /** Stage caption (UI label above the headline). */
  caption: string;
  /** Stage headline, the H2-equivalent above the body. */
  headline: string;
  /** Multi-paragraph body (rendered as plain paragraphs). */
  body: string[];
  /** Optional video cue rendered above the body. */
  videoCue?: VideoCue;
}

export interface Launch {
  slug: string;
  /** Whether this launch's window is currently open. Renders the cart CTA. */
  isOpen: boolean;
  /** ISO date the cart window closes. Drives countdown copy. */
  closesAt: string;
  /** Anchor headline for the launch (matches H1). */
  headline: string;
  /** One-sentence hook, appears under H1 and in OG. */
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
  /** Numeric price in EUR for schema.org Offer.price. */
  priceEUR: number;
  /** The four PLC stages (always exactly 4: sideways → ownership → struggle → idea). */
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
      "Every other deal-flow tool charges per seat. Agents don’t have seats, they have call volumes. Agent Credits prices the engine the way agents actually consume it.",
    abstract:
      "Agent Credits is a per-call pricing tier for the GitDealFlow signal engine, designed for autonomous agents that programmatically diligence GitHub orgs. €0.19 per deep-signal call, sold in packs of 100. Misses are free. Credits never expire. The six existing free MCP tools stay free forever, Agent Credits applies only to the new get_deep_signal tool and POST /api/agent/deep-signal.",
    stack: [
      {
        label: "100 deep-signal API calls (no expiry)",
        standalone: "€19, the launch price (€0.19 per call)",
      },
      {
        label: "get_deep_signal MCP tool, Claude/Cursor/any-MCP-host",
        standalone: "€0, bundled",
      },
      {
        label: "POST /api/agent/deep-signal HTTP endpoint",
        standalone: "€0, bundled",
      },
      {
        label: "Idempotency via X-Request-Id (no double-billing on retry)",
        standalone: "€0, bundled",
      },
      {
        label: "Misses are free (only billed for matched orgs)",
        standalone: "€0, bundled",
      },
      {
        label: "Live ledger at /agents/credits showing remaining balance",
        standalone: "€0, bundled",
      },
      {
        label: "Free 5-call sample (no card) for testing the integration",
        standalone: "€19 of value, bundled",
      },
    ],
    standaloneTotal: "€38 of standalone value",
    launchPrice: "€19 for 100 calls (locked at €0.19/call forever)",
    postLaunchPrice: "€29 for 100 calls (€0.29/call) after May 20",
    priceEUR: 19,
    stages: [
      {
        n: 1,
        plc: "sideways-story",
        caption: "Stage 1 · Sideways Story · The Opportunity",
        headline:
          "AI agents are already running diligence. Nobody is selling them the data on agent terms.",
        body: [
          "Spend two minutes inside Claude or Cursor with an MCP server attached and the future is obvious. Agents don’t scroll dashboards. They issue tool calls. They scrape, score, decide, and ship a memo before you finish your coffee.",
          "Every signal-data product on the market still bills humans by the seat, €99/month, $299/month, €497/month, assuming a partner clicks through pages. None of them have a credit-meter that an agent can spend against.",
          "The result is the absurd status quo: an AI scout running on a small-cheque investor’s laptop pays €197 for a full Insider Circle subscription it consumes in 11 minutes of Sunday-morning research, then idles for six days. The data product has no way to charge proportionally, so it overcharges or undercharges depending on the day.",
        ],
        videoCue: {
          kind: "youtube",
          youtubeId: "sXFZHCKkROA",
          title: "Why agent-shaped pricing is the next data-product unlock",
          durationSeconds: 90,
          caption:
            "90-second synthetic walkthrough, the opportunity in one chart.",
        },
      },
      {
        n: 2,
        plc: "ownership-experience",
        caption: "Stage 2 · Ownership Experience · See It Working",
        headline:
          "100 deep-signal calls for €19. €0.19 per call. Locked forever for launch buyers.",
        body: [
          "Agent Credits is a single, dead-simple integer balance attached to your API key. Every successful deep-signal call decrements your balance by 1. Misses (no matching org) decrement by zero. Credits never expire. You buy more when you run out.",
          "The first 100 calls cost €19, €0.19 per call, and that price is locked forever for buyers in this launch window. After May 20, the standard rate becomes €29 per 100 (€0.29 per call) for new buyers. Existing buyers keep €0.19 indefinitely.",
          "Integration is two lines. With Claude Desktop or Cursor: install @gitdealflow/mcp-signal, set GITDEALFLOW_API_KEY, the new get_deep_signal tool appears next to the six free tools you already have. With raw HTTP: POST /api/agent/deep-signal with a GitHub org slug, get back the full signal panel JSON. Every retry with the same X-Request-Id is idempotent, no double-billing.",
        ],
        videoCue: {
          kind: "youtube",
          youtubeId: "6wgrWtR6eZg",
          title: "What the integration looks like inside Claude Desktop",
          durationSeconds: 180,
          caption:
            "3-minute silent screen capture, install, key, first call, ledger update.",
        },
      },
      {
        n: 3,
        plc: "internal-struggle",
        caption: "Stage 3 · Internal Struggle · The Doubts",
        headline:
          "‘Just sell us a higher seat tier’ doesn’t work. Agents have a different consumption shape than humans.",
        body: [
          "I tried two fixes before I built this one. First, I tried higher Insider tiers (€197 → €197 → €497). The math broke immediately: a single agent scaling across 400+ orgs ends up running ~30,000 deep-signal calls in a weekend. €497/month doesn’t cover the GitHub-API cost layer underneath, let alone the regression compute.",
          "Second, I tried a flat ‘fair-use ceiling.’ That’s the SaaS-pricing equivalent of duct tape. The honest agents stay polite at 200 calls/month. The dishonest ones blow through 30,000 the first week and the ceiling becomes the entire ceiling, at which point the only honest move is to cut their API access, which is a worse experience than just charging them per call up front.",
          "What this product needed was the simplest economic model in software: a credit. Pay for the call, get the result, walk away. No subscription, no overage drama, no per-seat fiction. The fix had to be priced by what an agent actually does, not by what a human looks like to a billing system.",
        ],
        videoCue: {
          kind: "youtube",
          youtubeId: "mBEMytrYZ1I",
          title: "The two fixes that didn’t work, and why credits did",
          durationSeconds: 60,
          caption:
            "60-second short on the failure modes of seat-tier pricing for agents.",
        },
      },
      {
        n: 4,
        plc: "big-idea",
        caption: "Stage 4 · Big Idea · Open Cart",
        headline:
          "Buy a 100-call pack at €19 today, lock €0.19/call for the lifetime of the engine.",
        body: [
          "Two ways to start. The free 5-call sample at /agents/credits/sample needs no card and no commitment, drop your email, get an API key, run five real deep-signal calls inside Claude or Cursor. If the integration fits, the €19 pack upgrades the same key.",
          "The €19 launch price closes May 20 at midnight UTC. After that, new buyers pay €29 for the same 100-call pack. Buyers from this window keep €0.19/call forever, even on future top-ups.",
          "If your sourcing is already routed through an agent, this is the cheapest data layer you’re going to find for a deep-signal call. If your sourcing isn’t agent-routed yet, the free Sunday digest stays free regardless of whether you buy this. The Agent Credits launch doesn’t change anything about the human-facing tiers.",
        ],
      },
    ],
    buyUrl: "https://buy.stripe.com/00w4gyfRpg3SbAGcUg0x205",
    ctaLabel: "Lock €0.19/call, €19 for 100 calls →",
    cohort: "launch-agent-credits",
    faq: [
      {
        q: "What counts as a ‘deep-signal call’?",
        a: "One call returns the full signal panel for one GitHub org, commit-velocity acceleration, contributor-diversity Gini, dependents-graph external count, README-freshness diff size, new-repo-creation rate, issue-to-PR ratio, and the composite score. Calls against orgs not in our universe (400+ venture-backed startup orgs) are misses and don’t decrement your balance.",
      },
      {
        q: "Is this rate-limited?",
        a: "Soft rate limit at 60 calls/minute per API key. Above that, you queue (no errors, just wait). If you have a sustained-throughput use case above that ceiling, email signals@gitdealflow.com and we’ll provision a higher key for the same per-call price.",
      },
      {
        q: "Do credits expire?",
        a: "No. The balance lives until you spend it. Buy 100 calls today, use them over five years, no penalty.",
      },
      {
        q: "Why is this a launch, not just a price?",
        a: "Two reasons. One, locking €0.19/call forever for launch buyers gives early agents a permanent margin advantage as the standard rate climbs. Two, a launch window forces me to ship the integration tooling (the MCP tool, the idempotency layer, the live balance UI) on a deadline rather than a someday. The window is real, the discount is real, and after May 20 the standard rate is €0.29/call for new buyers.",
      },
    ],
  },
  {
    slug: "founding-100",
    isOpen: true,
    closesAt: "2026-06-30T23:59:00Z",
    headline:
      "Founding-100, €9.97/mo locked forever, before the public rate climbs to €49/mo.",
    hook:
      "100 founding-member spots for the investor writing €5k-€50k checks. Not a discount, not a coupon, a permanent rate that holds even as the public price doubles, then quadruples.",
    abstract:
      "Founding-100 is the rate seat for the first 100 paying members of GitDealFlow. €9.97/month, locked for the lifetime of the subscription. Includes the live Dashboard, weekly Acceleration Watch, monthly Sector Deep-Dive PDF, both Chrome extensions, and the free MCP server. After 100 spots fill, the public rate is €49/month for new buyers. Founding members keep €9.97 forever, through company growth, price hikes, and feature expansion.",
    stack: [
      {
        label: "Live Dashboard, 400+ venture-backed startups, refreshed weekly",
        standalone: "€348/yr",
      },
      {
        label: "Weekly Acceleration Watch, Monday digest, top 10 movers",
        standalone: "€0, also free for non-buyers",
      },
      {
        label: "Monthly Sector Deep-Dive PDF, 12 issues a year",
        standalone: "€588/yr",
      },
      {
        label: "Crunchbase + Wellfound badge (Chrome extension)",
        standalone: "€99/yr",
      },
      {
        label: "VC GitHub Lookup (Chrome extension, 200ms hover)",
        standalone: "€99/yr",
      },
      {
        label: "Free MCP server, 6 read-only tools, never gated",
        standalone: "€0, bundled with every tier",
      },
      {
        label: "Founding-member rate locked forever (€9.97/mo, no renegotiation)",
        standalone: "€468/yr of permanent margin",
      },
    ],
    standaloneTotal: "€1,602/yr of standalone value",
    launchPrice: "€9.97/month, locked forever for the first 100 buyers",
    postLaunchPrice: "€49/month for new buyers after the 100 cap fills",
    priceEUR: 10,
    stages: [
      {
        n: 1,
        plc: "sideways-story",
        caption: "Stage 1 · Sideways Story · The Opportunity",
        headline:
          "There’s a class of investor that the data-product market simply doesn’t price for.",
        body: [
          "Look at the deal-flow tool prices. Harmonic starts at €1,000/month per seat. Affinity is enterprise-only. Tracxn is in the same range. Crunchbase Pro is €99/month and doesn’t track engineering signals at all.",
          "All four are priced for institutional buyers, partners at funds with six-figure data budgets, signing 12-month contracts. None of them are priced for the investor writing €5k-€50k checks out of personal capital, who needs the same engineering-velocity signal but consumes it on Sunday afternoons, not in eight-person partner meetings.",
          "Founding-100 is the rate seat that admits this buyer exists. €9.97/month. The price isn’t a discount, it’s the right number for the consumption shape. The opportunity is to lock it before the public rate (€49/month) catches up to where the institutional tools sit.",
        ],
        videoCue: {
          kind: "youtube",
          youtubeId: "sXFZHCKkROA",
          title: "The €49 tier nobody else priced for",
          durationSeconds: 90,
          caption:
            "Why every other tool skipped the small-cheque investor segment.",
        },
      },
      {
        n: 2,
        plc: "ownership-experience",
        caption: "Stage 2 · Ownership Experience · See It Working",
        headline:
          "Sunday morning, mug of coffee, dashboard open. Three sectors. Six accelerating orgs. Fifteen minutes.",
        body: [
          "Picture the rhythm. Monday at 06:00 UTC the Acceleration Watch arrives in your inbox. Top 10 movers across every tracked sector. You skim, mark two, archive the rest.",
          "Sunday morning you open the Dashboard. You filter by your two sectors. Six orgs are accelerating. You hover with the Crunchbase extension, see the velocity score, decide whether two of the six are worth a 30-minute write-up. By 11am you have a watchlist for the week, or a pre-Crunchbase outreach you’re sending Monday morning, three weeks ahead of every fund.",
          "That’s the loop the €9.97/mo seat buys. It’s not a workflow you have to schedule, it’s a rhythm you fall into. The deep-dive PDF arrives the first Monday of every month, which keeps a calendar pin on the routine. The two Chrome extensions mean the velocity score is one hover away on every Crunchbase profile and Wellfound search.",
        ],
        videoCue: {
          kind: "youtube",
          youtubeId: "6wgrWtR6eZg",
          title: "A Sunday inside the founding-member dashboard",
          durationSeconds: 180,
          caption:
            "Silent 3-minute walkthrough of the actual weekly rhythm.",
        },
      },
      {
        n: 3,
        plc: "internal-struggle",
        caption: "Stage 3 · Internal Struggle · The Doubts",
        headline:
          "Three questions every founding-member buyer asks before they hit the Stripe link.",
        body: [
          "‘Is the rate really locked forever, or is this marketing language for the first 12 months?’ The lock is contract-grade. As long as your Stripe subscription stays active, the price stays €9.97, through company growth, through public price hikes, through feature expansion. The only way the rate changes is if you cancel and re-subscribe, in which case you pay the public rate. The ‘forever’ in the marketing copy is the actual product spec.",
          "‘What if the company shuts down?’ Methodology Vault stays public regardless. The SSRN preprint, the regression code, the Zenodo dataset, all CC BY 4.0, mirrored in three places, indexed in academic libraries. If the live aggregation goes dark, the methodology is reproducible from the public artifacts. You’re not buying a black box, you’re buying live convenience over a published method.",
          "‘Why 100 spots, not 1,000? Is that just scarcity theater?’ 100 is the number of founding members the operations can serve at €9.97 without margin compression. Above 100 the per-customer cost of monthly deep-dives + Slack support + integration help passes the unit economics. The 100 cap is the real constraint, not a marketing ceiling. When it fills, new pricing serves new economics.",
        ],
        videoCue: {
          kind: "scheduled",
          title: "The 3-question objection walkthrough",
          durationSeconds: 240,
          scheduledFor: "2026-06-01",
          caption:
            "Synthetic-voice walkthrough renders June 1, the lock, the shutdown clause, the 100 cap.",
        },
      },
      {
        n: 4,
        plc: "big-idea",
        caption: "Stage 4 · Big Idea · Open Cart",
        headline:
          "23 of 100 spots taken. €9.97/month. Locked the day you subscribe, for as long as you stay subscribed.",
        body: [
          "Open until 100 spots fill or June 30, whichever comes first. The counter at the top of /pricing is live (Stripe webhook → SHARP_2026_TAKEN), so the spot count is real, not a marketing prop.",
          "The math: 100 founding members at €9.97/month is €11,964/year of recurring revenue. That funds the GitHub-API layer, the regression compute, the dataset hosting, and one part-time analyst on monthly deep-dives. Above 100, the same operations stretch, which is why the public rate climbs.",
          "If the rhythm above (Monday digest, Sunday dashboard, monthly PDF, hover-extensions) maps to how you already source, the €9.97 lock is the cheapest decision on this page. If it doesn’t map, the free Acceleration Watch stays free and you lose nothing by skipping. The ladder is real. The rungs hold. Founding-member is the rung that closes when 100 fills.",
        ],
      },
    ],
    buyUrl: "https://buy.stripe.com/4gMbJ07kTaJy7kqg6s0x20b",
    ctaLabel: "Lock €9.97/mo, claim a founding spot →",
    cohort: "launch-founding-100",
    faq: [
      {
        q: "How is the spot counter wired?",
        a: "Single source of truth is SHARP_2026_TAKEN, an integer that increments on Stripe checkout.session.completed for the founding-100 price ID. The counter on /pricing reads from /api/sharp-application. If you see 23 there, 23 is the real number, not a marketing dial.",
      },
      {
        q: "Can I upgrade later to a higher tier?",
        a: "Yes. Insider Circle (€177/mo, 6 free MCP tools + private Telegram + spike alerts) and Sector Sweep (€1,797 weekend deep-dive) are both available to founding members at no special discount, same price as everyone else. The €9.97/mo lock applies only to the founding-member tier itself.",
      },
      {
        q: "What happens if I cancel and resubscribe?",
        a: "You pay the public rate at the time of resubscription. The €9.97/mo is locked while your subscription is continuous, gaps reset the lock. This is standard SaaS founder-rate practice and is what makes the lock economically honest.",
      },
      {
        q: "Are agent users on this tier?",
        a: "No, Agent Credits is a separate, parallel tier (€19 for 100 calls, locked at €0.19/call). Founding-100 is for human-driven Sunday-morning research. Agent users buy credits per call. The two tiers don’t overlap and don’t compete.",
      },
    ],
  },
  {
    slug: "sector-sweep-2026-q2",
    isOpen: true,
    closesAt: "2026-06-14T23:59:00Z",
    headline:
      "Sector Sweep Q2 2026, €1,797 for a 47-page weekend deep-dive on the sector you pick.",
    hook:
      "Eight buyers, one weekend, one sector each. Monday morning you receive a 47-page PDF, the raw CSV, and a synthetic-voice walkthrough of the breakout candidates we found.",
    abstract:
      "Sector Sweep is a cohort-based weekend research engagement. You pick the sector at checkout. Friday night through Sunday night the engine runs deep-dive analysis: top 25 ranked GitHub orgs by 14-day commit-velocity acceleration, contributor influx maps for the top 10, dependents-graph mapping for adoption signals, named pre-Crunchbase breakouts with thesis tags, raw CSV, and a 12-minute synthetic-voice walkthrough. Monday at 09:00 UTC the bundle lands. Cohort is capped at 8 buyers per quarter.",
    stack: [
      {
        label: "47-page sector deep-dive PDF (top 25 orgs, ranked)",
        standalone: "€1,200 standalone",
      },
      {
        label: "Contributor influx map for the top 10 orgs (30-day window)",
        standalone: "€480 standalone",
      },
      {
        label: "Dependents-graph adoption analysis (downstream usage signals)",
        standalone: "€360 standalone",
      },
      {
        label: "Named pre-Crunchbase breakouts (thesis-tagged, 8-12 candidates)",
        standalone: "€720 standalone",
      },
      {
        label: "Raw CSV, every org × every metric, license-friendly",
        standalone: "€190 standalone",
      },
      {
        label: "12-minute synthetic-voice walkthrough (MP3 + transcript)",
        standalone: "€340 standalone",
      },
      {
        label: "30-day Slack channel for follow-up methodology questions",
        standalone: "€500 standalone",
      },
      {
        label: "Refund-or-credit guarantee if the sector breakout list misses",
        standalone: "Bonus",
      },
    ],
    standaloneTotal: "€3,790 of standalone value",
    launchPrice: "€1,797 once, Q2 2026 cohort, 8 spots",
    postLaunchPrice: "€2,497 standard rate after the cohort closes",
    priceEUR: 1797,
    stages: [
      {
        n: 1,
        plc: "sideways-story",
        caption: "Stage 1 · Sideways Story · The Opportunity",
        headline:
          "The €15,000 sector deep-dive a McKinsey associate ships in three weeks, compressed to a weekend, priced for a writer of personal checks.",
        body: [
          "Walk into any boutique consultancy and ask for a sector landscape: top 25 emerging companies, contributor maps, dependency analysis, named breakouts. They quote you €15,000 and three weeks. The output is a glossy deck, a CSV, and a partner walkthrough.",
          "The reason it costs €15,000 is that the entire artifact is hand-built. An associate spends two weeks pulling LinkedIn data, scraping Crunchbase, hand-ranking the orgs, building the deck in PowerPoint. The labor is the cost.",
          "But the underlying signal, code-side momentum across a sector, is computable in 4 hours of compute on a public GitHub corpus. The deck is the expensive part. The data is the cheap part. The opportunity is to ship the data on a weekend, autogenerate the deck, and price the artifact at what the data actually costs to produce, not what the consultancy bills.",
        ],
        videoCue: {
          kind: "scheduled",
          title: "Why sector landscapes are mispriced by 8×",
          durationSeconds: 120,
          scheduledFor: "2026-05-25",
          caption:
            "Synthetic-voice walkthrough rendering May 25, the labor-vs-signal cost split.",
        },
      },
      {
        n: 2,
        plc: "ownership-experience",
        caption: "Stage 2 · Ownership Experience · See It Working",
        headline:
          "Monday at 09:00 UTC, the bundle lands. By 09:15 you have three named breakouts and the thesis-tagged reasoning.",
        body: [
          "The 47-page PDF opens with the executive summary: top 5 movers, top 3 breakouts, the regression statistics that backed the picks, and the false-positive caveat list. If you read nothing else, the first 4 pages set the watchlist for the quarter.",
          "Pages 5-32 are the ranked top 25, one page each: org name, GitHub URL, 14-day commit-velocity delta, contributor influx (30-day), dependents graph, README freshness, and a 60-word thesis paragraph on why this org is on the list. The contributor influx map is a network diagram with the 30-day joiners highlighted.",
          "Pages 33-47 are the breakout dossier: 8-12 named pre-Crunchbase orgs we believe will register a fundraise in 21-47 days. Each gets a 1.5-page memo with thesis tags, the specific signals that triggered the pick, and a confidence score. The raw CSV mirrors every metric for the entire universe (400+ orgs) so you can re-rank by any criterion.",
          "The 12-minute synthetic-voice walkthrough is a guided audio tour through the top 5 picks, what stood out, what we’re unsure about, what the data is saying that the headlines aren’t. Played at 1.5× over Monday breakfast, you’re fully briefed by 09:15.",
        ],
        videoCue: {
          kind: "scheduled",
          title: "Inside a Sector Sweep, what Monday actually looks like",
          durationSeconds: 360,
          scheduledFor: "2026-06-01",
          caption:
            "6-minute screen capture of last quarter’s bundle, synthetic narration over the actual artifacts.",
        },
      },
      {
        n: 3,
        plc: "internal-struggle",
        caption: "Stage 3 · Internal Struggle · The Doubts",
        headline:
          "Four questions every cohort buyer asks before they wire €1,797.",
        body: [
          "‘Is a weekend really enough depth?’ Honest answer: depth depends on what you’re after. If you want a 60-page McKinsey-style narrative on the regulatory landscape and the macro cycle, no, that’s a three-week consultancy engagement. If you want the actual list of 8 companies you should be writing checks at right now, sorted by the signal that leads fundraise announcements by 21-47 days, that’s a weekend of compute, and the artifact is more accurate than the three-week version because it’s computed, not opined.",
          "‘How do you avoid hallucinating breakouts?’ Two-period confirmation rule. A breakout candidate has to register a 2× contributor spike in two consecutive 14-day windows before it lands on the list. Single-window spikes are filtered out as noise. We also include a false-positive caveat list, the candidates that almost made the cut but didn’t pass the two-period filter. You see what we excluded and why.",
          "‘What if my sector isn’t covered?’ We track 15 sectors. The full list is at /weekly. If you want a sector outside that universe, email signals@gitdealflow.com before checkout, we may extend to your sector for the cohort, or refund. We don’t sell sweeps for sectors we can’t actually run the panel on.",
          "‘Is the €1,797 refundable?’ Yes, if zero of the breakouts in our list register a fundraise within 90 days of delivery, we refund or credit toward the next quarter at your choice. The 90-day window is the median lead-time floor; missing it entirely means the panel didn’t fire and you shouldn’t pay for the artifact.",
        ],
        videoCue: {
          kind: "scheduled",
          title: "The four-question objection list, on the record",
          durationSeconds: 300,
          scheduledFor: "2026-06-08",
          caption:
            "5-minute synthetic-voice walkthrough, depth, hallucinations, sector coverage, refund.",
        },
      },
      {
        n: 4,
        plc: "big-idea",
        caption: "Stage 4 · Big Idea · Open Cart",
        headline:
          "Eight spots. €1,797. Weekend run is June 12-14. Bundle ships Monday June 15 at 09:00 UTC.",
        body: [
          "Cohort opens now and closes June 14 at midnight UTC, or earlier if all 8 spots fill. After the cohort closes, the standard Sector Sweep rate is €2,497 and runs are scheduled monthly with one buyer at a time. The €1,797 cohort price is the only way in at this rate.",
          "At checkout you pick the sector. The 19 currently-tracked sectors are: AI infrastructure, AI agents, developer tools, climate tech, biotech, fintech, cybersecurity, robotics, edge compute, vertical SaaS, gaming, creator tools, healthcare, defense tech, mobility, supply chain, vector databases, MLOps, observability. Email if you want a different sector run for the cohort.",
          "If a Sector Sweep is the right shape for you, this is the cheapest sector landscape you’re going to find that holds up under reproducibility. If it isn’t, the free Acceleration Watch and the €9.97 founding-member rate stay where they are. Sector Sweep is the rung above founding-member; it doesn’t replace it.",
        ],
      },
    ],
    buyUrl: "/api/checkout/session?tier=sector_sweep",
    ctaLabel: "Claim a Q2 cohort spot, €1,797 →",
    cohort: "launch-sector-sweep-q2-2026",
    faq: [
      {
        q: "Why a cohort instead of one-at-a-time delivery?",
        a: "Two reasons. One, running 8 sectors in parallel over the same weekend lets the regression run amortize across all 8, so unit margin holds at €1,797. One-at-a-time delivery (the standard tier) is €2,497 because the compute is dedicated. Two, the cohort lets us cross-reference signals across sectors, which surfaces meta-themes (e.g. ‘AI infrastructure and observability are both accelerating because of inference costs’) that a single-sector run wouldn’t catch.",
      },
      {
        q: "Can I pick a sector that isn’t in your 19?",
        a: "Email signals@gitdealflow.com before checkout. We may extend to your sector for the cohort if the universe of GitHub orgs is mappable in time. If we can’t, we’ll tell you before charging, no charge for sectors we can’t run.",
      },
      {
        q: "What format do I get the breakouts in?",
        a: "Three formats simultaneously: a 1.5-page PDF memo per breakout (for reading), a CSV row per breakout (for filtering), and a JSON dump (for piping into your CRM or watchlist tool). The synthetic-voice walkthrough covers the top 5 in audio.",
      },
      {
        q: "How is this different from First Look (€7)?",
        a: "First Look is one sector, 24-hour intake, 14-page report, no contributor influx maps, no dependents-graph, no Slack channel, no walkthrough audio, no breakout dossier. Sector Sweep is the same sector with 47 pages, 30-day Slack support, the synthetic walkthrough, and the named-breakout dossier. First Look is the tripwire; Sector Sweep is the delivery the tripwire credit (€7) anticipates.",
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
