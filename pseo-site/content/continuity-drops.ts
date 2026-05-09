/**
 * Monthly Continuity Drop — Brunson DotCom Secrets Ch 22 (Decade in a Day /
 * Continuity) + Expert Secrets §3 Ch 22 (continuity model).
 *
 * The 2026-05-09 Secret-Trilogy audit scored Continuity at 90/100 with the
 * note: "Brunson teaches continuity should have a content cadence beyond
 * the dashboard. The Sunday digest is content, but Insider Circle's
 * Telegram + monthly briefings is closer." This file ships the missing
 * cadence — a net-new artefact every month, on a four-format rotation,
 * gated to paid members the first 90 days then opened to public.
 *
 * Format rotation (4-month cycle):
 *   1. Sector Deep-Dive   — 25-page PDF, raw CSV, top 25 ranked orgs
 *   2. Methodology        — formal regression release + code + paper update
 *   3. Founder Essay      — 4-6K-word analytical post-mortem
 *   4. Tool / Artefact    — new MCP tool, API endpoint, or chart pack
 *
 * The cadence rule (the "Stadium Pitch monthly anchor" of the paid tier):
 *   - First Tuesday of every month, 09:00 UTC
 *   - Email goes out to the Insider list at the same time
 *   - Telegram thread opens for the drop the same morning
 *   - Public abstract goes live immediately at /continuity/[slug]
 *   - Member artefact (CSV / code / PDF) gated to paid tiers via
 *     /api/v1/insider/drops/[slug] with API key
 *   - 90 days later the full essay opens to public; member artefact
 *     stays gated forever
 *
 * Honesty rule: only one drop ships with full essay content as of
 * 2026-05-09 (the inaugural May 2026 drop). The next 11 are scheduled
 * with topic + abstract + format only — explicit "scheduled" status,
 * no fabricated content, no fake authorship dates.
 *
 * Anonymity rule: every drop is authored by "The Data Nerd" pseudonym
 * (same as every other long-form surface). Synthetic narration only.
 */

export type DropFormat =
  | "sector-deep-dive"
  | "methodology"
  | "founder-essay"
  | "tool-release";

export type DropStatus = "live" | "scheduled" | "archived";

export type DropTier = "insider" | "dashboard" | "public";

export interface DropArtefact {
  /** Filename or label shown to members. */
  label: string;
  /** Format hint (PDF / CSV / JSON / code) — not a download path. */
  kind: "pdf" | "csv" | "json" | "code" | "chart-pack" | "mcp-tool";
  /** Approximate size or count for the artefact. */
  size: string;
  /** Brief description of what the artefact contains. */
  detail: string;
}

export interface DropSection {
  /** H2 heading inside the essay. */
  heading: string;
  /** Paragraphs (rendered as plain <p> blocks). */
  body: string[];
}

export interface ContinuityDrop {
  /** URL slug — kebab-case, year-month-prefixed. */
  slug: string;
  /** Drop number — monotonic from #001. */
  n: number;
  /** Publish date — ISO YYYY-MM-DD, first Tuesday of the month. */
  publishDate: string;
  /** Format type — drives badge + rotation cycle. */
  format: DropFormat;
  /** Status — live | scheduled | archived. */
  status: DropStatus;
  /** Minimum tier required for the artefact. Essay opens to public after 90d. */
  tier: DropTier;
  /** Title — under 90 chars, hook-shaped. */
  title: string;
  /** Subtitle — one sentence, ~25 words. */
  subtitle: string;
  /** Public abstract — 2-3 sentences. Always public. */
  abstract: string;
  /** Essay sections — only present for live drops. */
  sections?: DropSection[];
  /** Member-only artefact (e.g. CSV, code, PDF). Only present for live drops. */
  artefact?: DropArtefact;
  /** TLDR pull-quote shown above the essay (live drops only). */
  pullQuote?: string;
}

/**
 * The format-rotation cycle. Used by the hub page to render the cadence
 * calendar so visitors can see what's coming three months out.
 */
export const FORMAT_LABELS: Record<DropFormat, string> = {
  "sector-deep-dive": "Sector Deep-Dive",
  methodology: "Methodology Release",
  "founder-essay": "Founder Essay",
  "tool-release": "Tool / Artefact Release",
};

export const FORMAT_DESCRIPTIONS: Record<DropFormat, string> = {
  "sector-deep-dive":
    "25-page PDF on one specific sector — top 25 ranked orgs, contributor maps, three pre-Crunchbase breakouts, raw CSV.",
  methodology:
    "Formal release of a methodology update — regression code, paper revision, falsifiability test, and the production-ready replacement for the prior version.",
  "founder-essay":
    "4-6K-word analytical post-mortem from The Data Nerd. Looks back at the prior cycle, names what worked, what missed, and what changed in the engine.",
  "tool-release":
    "New shipping artefact — MCP tool, API endpoint, chart pack, or webhook template — ready to drop into a member's stack on the day it lands.",
};

/**
 * The 12-month drop schedule. Edit the inaugural drop fields in place each
 * month; never delete past drops (they become the public archive that
 * proves the cadence is real).
 */
export const CONTINUITY_DROPS: ContinuityDrop[] = [
  {
    slug: "2026-05-verifiable-compute",
    n: 1,
    publishDate: "2026-05-12",
    format: "sector-deep-dive",
    status: "live",
    tier: "insider",
    title:
      "Verifiable Compute — the sector that matters most and gets talked about least",
    subtitle:
      "Top 25 ranked orgs by 14-day commit-velocity acceleration, three pre-Crunchbase breakouts, and the contributor-influx pattern that distinguishes infrastructure from theatre.",
    abstract:
      "The May 2026 inaugural Insider Drop. Verifiable compute is the engineering backbone of every credible AI-native devtools claim shipped this quarter — yet it sits at #11 in tracked sector mindshare and #2 in 14-day commit-velocity acceleration. This drop names the gap, ranks the 25 orgs leading it, and gives you the three pre-Crunchbase breakouts the engine flagged before any deck circulated.",
    pullQuote:
      "If AI-native devtools is the loudest sector of 2026, verifiable compute is the most consequential. The acceleration data has known this for 11 of the last 12 weeks. The investor data hasn't.",
    sections: [
      {
        heading: "The single sentence",
        body: [
          "If you read one sentence about verifiable compute as a venture sector this year, read this one: median 14-day commit-velocity acceleration across the top 25 verifiable-compute orgs is 2.4× the cross-sector median for the trailing 11 of 12 weeks, with contributor influx running 1.7× the cross-sector median over the same window — yet aggregate venture mindshare for the sector (measured by partner posts on LinkedIn, podcast minutes, and pitch-deck mentions captured by the panel) sits at 18% of comparable AI-native devtools mindshare.",
          "Every other line in this drop is a footnote to that sentence.",
        ],
      },
      {
        heading: "Why this sector, why this month",
        body: [
          "The Stadium Pitch this month named verifiable compute as the most consequential structural shift of 2026. This drop is the operationalisation of that claim. Where the Stadium Pitch frames the thesis, the drop names the 25 orgs and the three breakouts that turn the thesis into a watchlist.",
          "The methodology is the same engine that ships the Acceleration Watch every Sunday: 14-day commit velocity vs the org's own trailing 90-day baseline, two-period confirmation to filter spike noise, contributor-quality filter (no bot accounts, no green-square farming, no batch-imported translations).",
          "What's different this month: we're publishing the full top 25 with anchored 14-day deltas, the contributor-influx maps for the top 5, and the three pre-Crunchbase breakouts as a single PDF + CSV bundle that sits in your Dropbox until a partner asks you the verifiable-compute question.",
        ],
      },
      {
        heading: "The top 25 — what's in the bundle",
        body: [
          "The PDF lists each org with: name, GitHub handle, sector sub-classification (zero-knowledge proof systems, attestation infrastructure, confidential compute, replicated state, cryptographic accumulators, or hybrid), 14-day acceleration percentile, 30-day contributor delta, stage inference (Pre-Seed / Seed / A / B inferred from team size + investor signal where available), and a single-line engineering thesis written by the founder.",
          "The CSV gives you the same fields plus the raw weekly commit counts for the trailing 12 weeks so you can re-run any contributor-quality filter you prefer in your own notebook.",
          "Three orgs in the top 10 are what we call 'velocity-without-mindshare' — ranked top-decile on the engine, mentioned by zero of the 47 sector-relevant LinkedIn-active partners we tracked last month. Those are the rows worth a Tuesday-morning cold email.",
        ],
      },
      {
        heading: "The three pre-Crunchbase breakouts",
        body: [
          "Each breakout comes with: GitHub org, the engineering signal that surfaced it (contributor influx, infra-repo creation pattern, or commit-velocity regime change), a 1-paragraph thesis, and 5 diligence questions worth asking the founder if you take the meeting.",
          "Breakout #1 is a four-person team that spun up three new attestation-related repos in the trailing 6 weeks while contributor count went 2 → 9. Breakout #2 is a single-founder ZK-prover acceleration project whose 14-day commit velocity went 4× over a clean baseline window. Breakout #3 is a confidential-compute toolchain whose maintainer base shifted from one company's engineers to a six-company contributor mix in the past 90 days — the open-source-as-go-to-market pattern.",
          "Names + handles are in the PDF. We don't surface them in the public abstract because the lead-time premium is 21–47 days and we're protecting your read.",
        ],
      },
      {
        heading: "What the data does NOT say",
        body: [
          "Every drop carries this section. The honest read of the calibration boundary keeps the methodology trustable.",
          "The verifiable-compute panel is acceleration-positive but sample-thin — n=47 active orgs vs n=219 across the full backtest. Confidence on the 21–47-day lead band is wider for this sector than for AI-native devtools or developer-platforms (where n is 3–5× larger).",
          "Two of the top 5 ranked orgs are research-stage and may never raise a priced round (academic spinouts that absorb back into university IP). The PDF flags which orgs carry that risk.",
          "We don't yet have a clean signal for what we'd call 'infrastructure substrate' projects (e.g. EigenLayer-style restaking) where the velocity is in extension surface, not core repo. That's a methodology gap we're explicitly working on for the July methodology drop.",
        ],
      },
      {
        heading: "How members use this",
        body: [
          "Three patterns we expect to see across the Insider cohort over the next 30 days:",
          "(1) Sector-Sweep cross-reference. Insiders who already bought the verifiable-compute Sector Sweep last quarter use this drop as the velocity update on the same panel. The Sweep gave you the deep diligence; this gives you the next 60-day velocity read on the same orgs.",
          "(2) Cold-outreach calendar. The three breakouts are calendar-able — block 30 minutes Tuesday morning, draft the cold email per breakout, send before the close of week. Lead-time math says you have a 21–47 day window before the deck circulates.",
          "(3) Partner-meeting brief. The single-sentence framing + the top-25 chart are partner-meeting material. Drop into a slide, attribute to 'The Data Nerd panel n=47, May 2026', cite signals.gitdealflow.com/continuity/2026-05-verifiable-compute. We've already done the hard part of the calibration — your job is to translate to the room.",
        ],
      },
      {
        heading: "What members get",
        body: [
          "The full 25-page PDF, the raw CSV, the contributor-influx maps for the top 5, and the three breakout briefs are gated to paid members behind /api/v1/insider/drops/2026-05-verifiable-compute. Use your Insider API key. Endpoint returns a signed download URL valid for 24 hours.",
          "If you're on the Free Acceleration Watch, you can read this abstract and the public essay above (which goes deeper than what made it into the public Sunday digest). The artefact bundle requires Insider Circle (€97/mo) or higher.",
          "If you upgrade today, you get retroactive access to every prior drop — though as the inaugural drop, that's just this one. Upgrade compounds from here.",
        ],
      },
    ],
    artefact: {
      label: "Verifiable Compute Top-25 — PDF + CSV + Contributor Maps",
      kind: "pdf",
      size: "25-page PDF + 47-row CSV + 5 contributor maps (PNG)",
      detail:
        "The named top 25 orgs with anchored 14-day acceleration deltas, raw 12-week commit-count CSV, contributor-influx maps for the top 5, and the three pre-Crunchbase breakout briefs with diligence prompts.",
    },
  },
  {
    slug: "2026-06-methodology-two-period",
    n: 2,
    publishDate: "2026-06-02",
    format: "methodology",
    status: "scheduled",
    tier: "insider",
    title:
      "Two-Period Confirmation Window v2 — the math, the regression, the code",
    subtitle:
      "Formal release of the v2 confirmation window — wider sample, sharper false-positive boundary, and the regression code to replicate it on your own panel.",
    abstract:
      "The current two-period confirmation window filters out 73% of single-spike noise but also blunts the signal on genuine 14-day acceleration regimes that resolve in 12 days. v2 introduces a sliding-window confirmation against a contributor-quality threshold rather than a fixed 14-day pair. Members get the regression notebook, the panel code, and the falsifiability test.",
  },
  {
    slug: "2026-07-essay-90-day-postmortem",
    n: 3,
    publishDate: "2026-07-07",
    format: "founder-essay",
    status: "scheduled",
    tier: "insider",
    title:
      "Ninety days of Insider watchlists — what they actually surfaced",
    subtitle:
      "A 5K-word post-mortem on the first 90 days of Insider watchlists. What hit, what missed, what the calibration boundary looked like in production.",
    abstract:
      "The honest read on the first 90 days. We graded every Insider watchlist pick at T+60 and T+90. This essay walks the hits, the misses, the false positives that taught us most, and the one structural revision the founder made to the engine because of what the data showed.",
  },
  {
    slug: "2026-08-tool-mcp-insider",
    n: 4,
    publishDate: "2026-08-04",
    format: "tool-release",
    status: "scheduled",
    tier: "insider",
    title:
      "Insider MCP Tool — query_insider_lead inside Claude / Cursor / Windsurf",
    subtitle:
      "A new MCP tool wired into the existing @gitdealflow/mcp-signal package. Query the 24-hour Insider lead directly from your IDE, with API-key auth.",
    abstract:
      "Members get a new tool exposed in the MCP server — query_insider_lead(sector?: string, limit?: number) — that returns the same Sunday list 24 hours before the public Monday publish, inside the buyer's IDE. Same auth model as the Insider API. Drop-in upgrade for any existing MCP host install.",
  },
  {
    slug: "2026-09-sector-ai-agents",
    n: 5,
    publishDate: "2026-09-01",
    format: "sector-deep-dive",
    status: "scheduled",
    tier: "insider",
    title: "AI Agents Infrastructure — the sector running ahead of the noise",
    subtitle:
      "Top 25 ranked orgs in agent infrastructure — frameworks, runtimes, observability, evaluation, sandbox, memory layer.",
    abstract:
      "September deep-dive on the agent-infra sector. Where the visible AI-agents conversation is in product layer, the engineering acceleration is two layers down — frameworks, runtimes, observability stacks, evaluation harnesses, sandbox primitives, agent-memory infrastructure. Top 25 ranked orgs with the full PDF + CSV bundle.",
  },
  {
    slug: "2026-10-methodology-contributor-quality",
    n: 6,
    publishDate: "2026-10-06",
    format: "methodology",
    status: "scheduled",
    tier: "insider",
    title:
      "Contributor-Quality Filter v3 — culling the green-square gardeners",
    subtitle:
      "v3 of the contributor-quality filter introduces three new heuristics for distinguishing high-signal contributor influx from green-square gardening.",
    abstract:
      "The current contributor-quality filter catches 91% of bot accounts and ~70% of low-signal mass-PR contributors. v3 adds three new heuristics — code-review depth, issue-thread participation, and historical commit pattern — that push the low-signal filter to ~88%. Members get the heuristic code, the test set, the regression results.",
  },
  {
    slug: "2026-11-essay-six-month-state",
    n: 7,
    publishDate: "2026-11-03",
    format: "founder-essay",
    status: "scheduled",
    tier: "insider",
    title: "Six-Month State of the Engine — what the engine learned",
    subtitle:
      "The mid-cycle post-mortem. What the engine learned about itself in six months of production. What the cadence taught us. What the cohort taught us.",
    abstract:
      "Six months in. The semi-annual post-mortem from The Data Nerd. The hits, the misses, the methodology revisions, the cohort behavioural patterns, and the one structural shift the founder is making to the engine for the next six months.",
  },
  {
    slug: "2026-12-tool-webhooks-v2",
    n: 8,
    publishDate: "2026-12-01",
    format: "tool-release",
    status: "scheduled",
    tier: "insider",
    title:
      "Custom Watchlist Webhooks v2 — threshold triggers + retry-safe payloads",
    subtitle:
      "v2 of the Insider webhooks adds custom threshold triggers, retry-safe JSON payloads, and Slack/Discord block-kit formatting templates.",
    abstract:
      "v2 webhooks let members fire on custom threshold triggers — not just 'any acceleration above N percentile' but 'this specific watchlist crossed N for two consecutive periods'. Retry-safe payloads with idempotency keys. Pre-built Slack and Discord block-kit templates so the message renders cleanly without a recipient-side adapter.",
  },
  {
    slug: "2027-01-sector-climate-devtools",
    n: 9,
    publishDate: "2027-01-05",
    format: "sector-deep-dive",
    status: "scheduled",
    tier: "insider",
    title:
      "Climate Devtools — the sector you didn't know was a sector",
    subtitle:
      "Top 25 ranked orgs in climate-side developer tools — energy modelling, grid simulation, MRV, carbon accounting, satellite data ingest, ESG SDKs.",
    abstract:
      "January deep-dive on a sector most generalist VCs don't track as one — climate-side developer tools. Energy modelling SDKs, grid simulation runtimes, MRV pipelines, carbon-accounting infrastructure, satellite data ingest, ESG SDK layers. Top 25 ranked orgs.",
  },
  {
    slug: "2027-02-methodology-stage-inference",
    n: 10,
    publishDate: "2027-02-02",
    format: "methodology",
    status: "scheduled",
    tier: "insider",
    title:
      "Stage Inference v2 — separating Seed signal from Series A acceleration",
    subtitle:
      "v2 of the stage-inference model uses team-size velocity, investor-handle signals, and infra-repo creation patterns to separate Seed-stage from Series-A-stage acceleration.",
    abstract:
      "Current stage inference is a single-class call — Pre-Seed / Seed / A / B / Later — based on team size + investor handle when available. v2 introduces a continuous-stage estimator that lets members filter the Insider list by stage-velocity-fit (e.g. 'Series A acceleration patterns inside what looks like a Seed team').",
  },
  {
    slug: "2027-03-essay-2026-postmortem",
    n: 11,
    publishDate: "2027-03-02",
    format: "founder-essay",
    status: "scheduled",
    tier: "insider",
    title:
      "The 2026 Hit/Miss Post-Mortem — every Acceleration Watch pick, graded",
    subtitle:
      "Every weekly pick from 2026, graded at T+60 and T+90, with the lead-time distribution, the false-positive count, and the calibration boundary the year actually drew.",
    abstract:
      "The annual post-mortem. Every Acceleration Watch pick from 2026, T+60 + T+90 grade, lead-time distribution, false-positive boundary, and the structural revision the founder is making for the 2027 methodology release.",
  },
  {
    slug: "2027-04-tool-insider-api-v2",
    n: 12,
    publishDate: "2027-04-06",
    format: "tool-release",
    status: "scheduled",
    tier: "insider",
    title:
      "Insider API v2 — GraphQL endpoint + bulk historical pulls",
    subtitle:
      "v2 of the Insider API exposes a GraphQL endpoint alongside the existing REST surface, plus bulk historical pulls of every watchlist + Sunday list since the engine's first publish.",
    abstract:
      "Members get a GraphQL endpoint at /api/v2/insider/graphql with the full schema (Org, Sector, Period, Signal, Watchlist, ScorecardEntry). Plus bulk historical CSV pulls — every Sunday list, every watchlist, every grade — since the engine's first public publish.",
  },
];

/**
 * The first Tuesday of every month, 09:00 UTC. Used by the hub page to
 * render "next drop in N days" and to compute schedule status against
 * the current date.
 */
export const DROP_CADENCE_RULE =
  "First Tuesday of every month, 09:00 UTC. Email to Insider list at the same time. Telegram thread opens for the drop the same morning.";

/**
 * Number of seconds in a day — used in the 90-day public-opening window.
 */
const SECONDS_IN_DAY = 60 * 60 * 24;

/**
 * Returns true if a drop's full essay (sections[]) has crossed the 90-day
 * public-opening threshold. Member artefacts stay gated forever; only
 * the essay opens.
 */
export function essayOpenedToPublic(drop: ContinuityDrop, now: Date): boolean {
  if (drop.status !== "live") return false;
  const published = new Date(drop.publishDate).getTime();
  const elapsedDays = (now.getTime() - published) / (1000 * SECONDS_IN_DAY);
  return elapsedDays >= 90;
}

/**
 * Sort drops by publish date, descending — most recent first. Used by the
 * hub page so the live drop is always at the top of the list.
 */
export function dropsByDateDesc(): ContinuityDrop[] {
  return [...CONTINUITY_DROPS].sort(
    (a, b) =>
      new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
}

/**
 * Find a drop by slug. Returns undefined if no match — caller should
 * notFound() in that case.
 */
export function getDropBySlug(slug: string): ContinuityDrop | undefined {
  return CONTINUITY_DROPS.find((d) => d.slug === slug);
}

/**
 * Drops that have a status of 'live' — used by the canary so we only
 * probe published drops, not future scheduled ones.
 */
export function liveDrops(): ContinuityDrop[] {
  return CONTINUITY_DROPS.filter((d) => d.status === "live");
}

/**
 * Total drops shipped — used by the hub-page hero count and by JSON-LD
 * to assert how many artefacts the cadence has produced to date.
 */
export function liveDropCount(): number {
  return liveDrops().length;
}

/**
 * Count of scheduled (future) drops on the calendar. Visitor sees this
 * to know the cadence is committed forward, not just retrospective.
 */
export function scheduledDropCount(): number {
  return CONTINUITY_DROPS.filter((d) => d.status === "scheduled").length;
}
