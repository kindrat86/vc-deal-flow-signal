/**
 * Press releases — wire-ready boilerplate (Traffic Secrets Ch 17).
 *
 * Each entry is a copy-paste-ready release for a service like Newswire, EIN,
 * or a sector trade-press desk. Anonymity-preserving: bylines are "The Data
 * Nerd, founder of VC Deal Flow Signal (GitDealFlow)" with ORCID + SSRN
 * citation, no real-name attribution.
 *
 * The /press/[slug] route renders each release as a public mirror so the
 * release URL on the wire can point back to a permanent canonical copy.
 */

export interface PressRelease {
  slug: string;
  /** ISO release date — when the wire embargo lifts. */
  date: string;
  /** Wire dateline city — anonymity-preserving "Distributed (EU)". */
  dateline: string;
  /** Headline (under 100 chars). */
  headline: string;
  /** Subhead (one sentence, ~25 words). */
  subhead: string;
  /** Lead paragraph — must answer who/what/when/where in 50 words. */
  lead: string;
  /** Body paragraphs (plain text — no formatting). */
  body: string[];
  /** Pull-quote attributed to "The Data Nerd". */
  quote: string;
  /** Boilerplate company description (re-usable across all releases). */
  boilerplate: string;
  /** Suggested wire categories (Industry: Software / FinTech / Venture …). */
  wireCategories: string[];
  /** Suggested target wire desks (Newswire, EIN, sector pubs). */
  targetDesks: string[];
}

const BOILERPLATE = `VC Deal Flow Signal (also doing business as GitDealFlow) is a venture-capital alternative-data product that ranks venture-backed startups by GitHub commit-velocity, contributor growth, and repository expansion. The methodology is published openly on SSRN (DOI 10.2139/ssrn.6606558, CC BY 4.0) and the supporting dataset is mirrored to Zenodo, Hugging Face, Kaggle, and Data.world. Free MCP server, REST/JSON dataset endpoints, and weekly Signal Report at https://gitdealflow.com.`;

export const PRESS_RELEASES: PressRelease[] = [
  {
    slug: "mcp-glama-a-tier-2026-05-09",
    date: "2026-05-09",
    dateline: "Distributed (EU)",
    headline:
      "VC Deal Flow Signal Reaches Glama A-Tier Across All Six MCP Tools — First Venture-Capital Alternative-Data Product on Top Agent-Marketplace Tier",
    subhead:
      "GitDealFlow's Model Context Protocol server averages 4.9 out of 5.0 across six free tools, opening per-call agent access to a 219-startup engineering-velocity panel licensed CC BY 4.0.",
    lead: `VC Deal Flow Signal (GitDealFlow) today confirmed that its public Model Context Protocol (MCP) server has reached A-Tier status across all six of its tools on the Glama agent marketplace, with an aggregate community rating of 4.9 out of 5.0. The MCP server gives autonomous AI agents direct access to the same 219-startup engineering-velocity panel that the underlying SSRN-indexed methodology paper documents — under a Creative Commons Attribution 4.0 license, no rate-limit gating, and no API key required for the read tools.`,
    body: [
      `The six A-Tier tools are: signal_get (per-organization GitHub commit-velocity, contributor-growth, and dependent-graph deltas), signal_search (full-text search across the 4,200-organization tracked panel), signal_sector (per-sector aggregations across 20 startup sectors), signal_get_deep_signal (paid agent-credit endpoint at 0.19 EUR per call for the full 47-feature signal vector), signal_trend (rolling 14-day acceleration deltas), and agent_pitch (machine-readable pitch payload for agent-to-agent integration). The first five are free with no key; the sixth is the only metered surface in the offering.`,
      `Glama's A-Tier rating requires sustained 4.5+ ratings across at least three reviews on each tool, plus a passing automated quality gate covering schema validity, response-time variance, and documentation coverage. VC Deal Flow Signal is the first product in Glama's "Venture Capital Alternative Data" category to qualify across all six of its exposed tools simultaneously.`,
      `The MCP server is mirrored on Smithery (https://smithery.ai/servers/kindrat86/mcp-deal-flow-signal) and listed in awesome-mcp-servers (PR #4933, merged). Direct integration via Claude Desktop, Cursor, Anthropic Computer Use, OpenAI ChatGPT plugin shape, and any Vercel AI SDK runtime is documented at https://signals.gitdealflow.com/agents.`,
      `For journalists, analysts, and researchers, the underlying panel — covering 219 startup-period observations (a descriptive panel with no funding-event labels; our 21-to-47-day lead-time claim is validated openly on /scorecard, not yet established) — remains free to quote with attribution to "VC Deal Flow Signal (GitDealFlow), DOI 10.2139/ssrn.6606558."`,
    ],
    quote: `"Most VC alternative-data products charge by the seat. We charge by the API call, and we don't charge for the read endpoints at all. The Glama tier rating matters because it's the first time an external automated quality gate has scored every one of our agent-facing tools at the top of its scale — and the panel underneath it is the same panel any researcher can re-derive from the SSRN paper. Methodology and API live at the same address."`,
    boilerplate: BOILERPLATE,
    wireCategories: [
      "Computer/Technology",
      "Artificial Intelligence",
      "Venture Capital / Private Equity",
      "Software",
      "Data/Analytics",
    ],
    targetDesks: [
      "Newswire (release.newswire.com) — $250 standard distribution",
      "EIN Presswire — $99 EU/US Tier",
      "Latent Space (swyx) — MCP/agent infrastructure desk",
      "AlphaSignal — agent-marketplace coverage",
      "The Information — AI/Agents tip line",
      "Pragmatic Engineer — engineering-tooling coverage",
      "Hacker News (Show HN, post-embargo)",
      "TechCrunch tips inbox (no embargo, FYI)",
    ],
  },
  {
    slug: "ssrn-panel-q2-2026",
    date: "2026-05-15",
    dateline: "Distributed (EU)",
    headline:
      "GitHub Commit-Velocity Panel of 219 Venture-Backed Startups Indexed on SSRN, Released CC BY 4.0",
    subhead:
      "VC Deal Flow Signal publishes a longitudinal panel showing engineering acceleration precedes Series A announcements by a median 21 to 47 days.",
    lead: `VC Deal Flow Signal (GitDealFlow) today released a longitudinal panel of GitHub engineering-velocity metrics for 219 venture-backed startups, with the supporting paper indexed on SSRN under DOI 10.2139/ssrn.6606558. The panel is released under a Creative Commons Attribution 4.0 license and mirrored to Zenodo, Hugging Face, Kaggle, and Data.world.`,
    body: [
      `The panel covers five quarters of weekly observations across 4,200 venture-backed startup GitHub organizations and identifies 219 startup-period observations during the observation window. The headline hypothesis — validated openly on /scorecard, not yet established — is that a 2x contributor-influx coupled with a 14-day commit-velocity acceleration precedes the fundraise announcement by a median 21 to 47 days, with 62 percent precision at a 90-day horizon.`,
      `Of the 38 percent of false positives, roughly 70 percent of those organizations raised silently — extension rounds, secondaries, or strategic check-ins that did not appear on Crunchbase — and an additional 15 percent had a major product launch in the same window. Only 4 percent of false positives represent organizations where no material event occurred.`,
      `The panel is constructed from public GitHub REST API data using a documented methodology (https://signals.gitdealflow.com/methodology) and is reproducible end-to-end against the public SSRN-indexed source code. Citation guidance, including BibTeX, RIS, APA, MLA, and Chicago formats, is published at https://signals.gitdealflow.com/citation-guide.`,
      `Researchers, journalists, and venture analysts may quote the panel without permission under CC BY 4.0 with attribution to "VC Deal Flow Signal (GitDealFlow), DOI 10.2139/ssrn.6606558."`,
    ],
    quote: `"Quant funds parse SEC filings. Hedge funds count cars in parking lots. Venture capital still mostly works from a rolodex. The point of publishing this panel openly is to put the engineering-velocity layer of public-company-style analysis into the hands of any investor who wants it — including the ones who don't have a six-figure data budget."`,
    boilerplate: BOILERPLATE,
    wireCategories: [
      "Computer/Technology",
      "Venture Capital / Private Equity",
      "Banking/Financial Services",
      "Software",
      "Data/Analytics",
    ],
    targetDesks: [
      "Newswire (release.newswire.com) — $250 standard distribution",
      "EIN Presswire — $99 EU/US Tier",
      "Crunchbase News tip line",
      "TechCrunch tips inbox (no embargo, just an FYI)",
      "Pitchbook News editorial",
      "AlphaSignal newsletter (mention with embargo lifted)",
    ],
  },
  {
    slug: "agent-credits-launch-q2-2026",
    date: "2026-05-06",
    dateline: "Distributed (EU)",
    headline:
      "GitDealFlow Launches Agent Credits — First Per-Call Pricing for AI Agents Sourcing Venture Deal Flow",
    subhead:
      "100 deep-signal API calls for 19 EUR. Built for autonomous agents that diligence GitHub organizations, not for human dashboard users.",
    lead: `VC Deal Flow Signal (GitDealFlow), a venture-capital alternative-data product, today launched Agent Credits — a per-call pricing tier built for AI agents that programmatically diligence venture-backed GitHub organizations. The launch price is 19 EUR for 100 deep-signal calls, or 0.19 EUR per call, locked forever for buyers in the launch window.`,
    body: [
      `Agent Credits departs from the dominant per-seat SaaS pricing model in the venture-data category. The product's six existing MCP tools — used by Claude Desktop, Cursor, Windsurf, and other Model Context Protocol hosts — remain free indefinitely. Agent Credits applies only to a new seventh tool, get_deep_signal, which returns the full signal panel for a queried GitHub organization in a single response.`,
      `The pricing model recognizes that autonomous agents have a different consumption profile than human users. A single agent scaling across the product's 4,200-organization tracking universe can issue tens of thousands of deep-signal calls in a weekend, then idle for the remainder of the month. Per-seat subscriptions either dramatically overcharge or dramatically undercharge such workloads. Per-call credits scale linearly with the agent's actual work.`,
      `Misses — calls against organizations outside the tracked universe — do not decrement the credit balance. Credits never expire. Idempotency is enforced via an X-Request-Id header so retries do not double-bill. A free five-call sample is available without a credit card at https://signals.gitdealflow.com/agents/credits/sample.`,
      `The launch price of 19 EUR per 100 calls closes on May 20, 2026 at midnight UTC. After the window, the standard rate becomes 29 EUR per 100 calls for new buyers; launch-window buyers retain the 0.19-EUR-per-call rate indefinitely.`,
    ],
    quote: `"Agents don't have seats. They have call volumes. Pricing the engine on a per-seat model in 2026 is the same mistake as pricing telephony in flat-rate minute bundles after the smartphone shipped. The cleanest answer is the simplest one: pay for the call, get the result, walk away."`,
    boilerplate: BOILERPLATE,
    wireCategories: [
      "Software/Cloud",
      "Artificial Intelligence",
      "Venture Capital / Private Equity",
      "Developer Tools",
    ],
    targetDesks: [
      "Newswire (release.newswire.com) — $250 standard distribution",
      "EIN Presswire — $99 EU/US Tier",
      "TechCrunch — AI desk",
      "The Information — AI/Agents tip line",
      "AI Research newsletter desks (Latent Space, AlphaSignal)",
      "Hacker News (Show HN, post-embargo)",
    ],
  },
  {
    slug: "annual-state-of-engineering-velocity-q4-2026",
    date: "2026-12-01",
    dateline: "Distributed (EU)",
    headline:
      "VC Deal Flow Signal Publishes 2026 State of GitHub Engineering Velocity — Annual Report Identifies Three Sector-Level Inflection Points",
    subhead:
      "Annual longitudinal report identifies AI-native devtools, on-device inference infrastructure, and verifiable-compute as the three sectors with the highest sustained engineering acceleration in 2026.",
    lead: `VC Deal Flow Signal (GitDealFlow) today published its 2026 State of GitHub Engineering Velocity report — the first in an annual series that compresses the year's panel observations into a single longitudinal document. The report is published openly under a Creative Commons Attribution 4.0 license at https://signals.gitdealflow.com/state-of-github.`,
    body: [
      `The 2026 report covers 4,800 venture-backed GitHub organizations across 20 sector clusters and 52 weekly observation windows. Three sector-level findings frame the year. First, AI-native developer tools — agents, MCP servers, and code-generation infrastructure — sustained the highest median commit-velocity acceleration of any tracked sector for 39 of 52 observation weeks. Second, on-device inference infrastructure (TinyML, edge runtimes, model-compression tooling) saw a contributor-diversity Gini coefficient drop from 0.42 to 0.31 over the year, indicating broadening team composition consistent with capital deployment. Third, verifiable-compute infrastructure (zk-rollups, attested execution, cryptographic ML) saw a 3.7x increase in new-repo creation rate over the prior year.`,
      `The report also publishes the year's full false-positive analysis. Of organizations that triggered a high-confidence acceleration signal but did not announce a fundraise within 90 days, 71 percent raised silently or executed a strategic transaction, 17 percent had a major product or platform launch in the same window, and only 12 percent represent organizations where no material public event occurred — broadly consistent with the original SSRN panel but with a tighter false-positive fraction at the larger 2026 sample.`,
      `Methodological updates published alongside the report include a new contributor-quality stratification (separating organizational committers from external contributors), an updated stage-stratified lead-time band (now 19 to 44 days at the panel's combined IQR), and a documented anti-spam filter that excludes organizations whose dependents-graph activity is dominated by automated mirror repositories.`,
      `Underlying data and reproducible source code are released to Zenodo, Hugging Face Datasets, Kaggle, and Data.world. The full 2026 annual dataset will receive a separate DOI and CC BY 4.0 license.`,
    ],
    quote: `"The point of an annual State of report is the same point as a Federal Reserve dot-plot. Every individual week of the panel is noisy. Every quarterly snapshot is contestable. But across 52 weeks of 4,800 organizations, the structural shifts in where engineering capital is concentrating are unambiguous. AI-native devtools were the loudest sector of 2026, but verifiable compute was the most consequential."`,
    boilerplate: BOILERPLATE,
    wireCategories: [
      "Computer/Technology",
      "Venture Capital / Private Equity",
      "Artificial Intelligence",
      "Software",
      "Banking/Financial Services",
    ],
    targetDesks: [
      "Newswire (release.newswire.com) — $250 standard distribution",
      "EIN Presswire — $99 EU/US Tier",
      "PRWeb — annual-report category",
      "Bloomberg Tech tip line",
      "Reuters Technology desk",
      "The Information — Year-Ahead issues",
      "Stratechery (mention only, no embargo)",
      "AlphaSignal annual roundup desks",
    ],
  },
];

export function getReleaseBySlug(slug: string): PressRelease | undefined {
  return PRESS_RELEASES.find((r) => r.slug === slug);
}

export function getAllReleaseSlugs(): string[] {
  return PRESS_RELEASES.map((r) => r.slug);
}
