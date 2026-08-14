/**
 * /case-study/[slug] entity pages, narrative workflow walkthroughs.
 *
 * Each case study is a representative (anonymous) scenario showing how
 * one Marcus 100 buyer persona uses the VC Deal Flow Signal surface
 * end-to-end. Stories are illustrative composites of real workflows we
 * have observed in customer onboarding and demo conversations, not
 * literal customer accounts, names and specific deal details are
 * omitted by design to preserve privacy and Code of Conduct compliance.
 *
 * Structure: hook + situation + workflow steps (referencing actual
 * URLs the persona used) + outcome + lessons. Each leaf cross-links
 * heavily into /signal, /sector, /acquirer, /fund, /trend, /works-with.
 *
 * AEO target: ChatGPT/Perplexity queries like "how do Corp Dev teams
 * use engineering signals," "case study PE operating partner
 * portfolio benchmarking," etc.
 */

export interface CaseStudyStep {
  /** Short label for the step. */
  label: string;
  /** Markdown-light description (we render as plain paragraphs). */
  description: string;
  /** Primary URL the persona navigated to during this step. */
  primaryPath: string;
  /** Optional supporting URLs. */
  supportingPaths?: string[];
}

export interface CaseStudyFAQ {
  question: string;
  answer: string;
}

export interface CaseStudy {
  slug: string;
  /** Concise scenario name. */
  name: string;
  /** Persona slug from /for/[slug]. */
  personaSlug: string;
  /** Persona display label. */
  personaLabel: string;
  // SEO surfaces
  title: string;
  metaDescription: string;
  h1: string;
  tagline: string;
  /** Two-paragraph framing. */
  situation: string;
  /** 4-6 numbered workflow steps. */
  steps: CaseStudyStep[];
  /** Outcome paragraph, what changed for the buyer. */
  outcome: string;
  /** Three or four lessons or takeaways. */
  lessons: string[];
  faqs: CaseStudyFAQ[];
}

function build(c: {
  slug: string;
  name: string;
  personaSlug: string;
  personaLabel: string;
  tagline: string;
  situation: string;
  steps: CaseStudyStep[];
  outcome: string;
  lessons: string[];
  extraFaqs?: CaseStudyFAQ[];
}): CaseStudy {
  return {
    slug: c.slug,
    name: c.name,
    personaSlug: c.personaSlug,
    personaLabel: c.personaLabel,
    title: `${c.name}, VC Deal Flow Signal Case Study`,
    metaDescription: `Workflow walkthrough: how a ${c.personaLabel.toLowerCase()} uses VC Deal Flow Signal for ${c.name.toLowerCase()}. Illustrative composite scenario covering the full sourcing-to-action flow.`,
    h1: c.name,
    tagline: c.tagline,
    situation: c.situation,
    steps: c.steps,
    outcome: c.outcome,
    lessons: c.lessons,
    faqs: [
      {
        question: `Is this case study a real customer?`,
        answer: `No. This is an illustrative composite of workflows we observe in onboarding and demo conversations. Names, specific deals, and identifying details are omitted by design. The structure of the workflow (what URLs the persona uses, what questions they ask, what action they take) is representative.`,
      },
      {
        question: `What persona does this scenario match?`,
        answer: `${c.personaLabel}. For the full persona-specific overview, see /for/${c.personaSlug}.`,
      },
      ...(c.extraFaqs ?? []),
    ],
  };
}

export const CASE_STUDIES: CaseStudy[] = [
  build({
    slug: "corp-dev-ai-acquisition-shortlist",
    name: "Corp Dev: Building an AI Infrastructure Acquisition Shortlist",
    personaSlug: "corp-dev",
    personaLabel: "Corp Dev Director",
    tagline:
      "How a hyperscaler Corp Dev director moved from sector-level scouting to a 4-target shortlist in 3 days using engineering-signal data.",
    situation:
      "A Corp Dev director at a Fortune 100 cloud platform needed to build a shortlist of 4 AI infrastructure acquisition candidates for an internal strategy review. The platform's leadership had set a 90-day window to identify and approach targets before competitive bidding hardened pricing. Traditional banker books were not yet circulating for any of the most interesting targets.",
    steps: [
      {
        label: "Sector framing",
        description:
          "Started at the /sector/ai-infra hub to understand the engineering-acceleration shape of the AI infrastructure category. Read the why-it-matters editorial, scanned the tracked companies, identified the 8 most-active orgs in the sector.",
        primaryPath: "/sector/ai-infra",
        supportingPaths: ["/sector"],
      },
      {
        label: "Per-company deep dive",
        description:
          "Drilled into each tracked org's /signal/[slug] page to read engineering momentum, contributor counts, and language-bias signals. Cross-referenced against existing acquirer pattern (own M&A history at /acquirer/[platform]) to filter for strategic fit.",
        primaryPath: "/signal",
        supportingPaths: ["/signal/modal", "/signal/replicate", "/signal/groq"],
      },
      {
        label: "Side-by-side comparison",
        description:
          "For top 4 candidates, compared /signal/[slug] pages side by side on stage, momentum, public repos, and language bias. Surfaced engineering-team-shape differences that affected integration cost models.",
        primaryPath: "/signal",
        supportingPaths: ["/signal/modal", "/signal/replicate"],
      },
      {
        label: "Trend cross-reference",
        description:
          "Checked /trend/llm-inference-providers-2026 to validate that the shortlist matched the broader category leadership. Confirmed the editorial roster aligned with the side-by-side comparisons.",
        primaryPath: "/trend/llm-inference-providers-2026",
        supportingPaths: ["/trend"],
      },
      {
        label: "Geographic filter",
        description:
          "Filtered final 4 candidates through /city/[slug] pages, checked HQ locations against acquisition integration constraints (work-authorization, time-zone overlap with engineering centers).",
        primaryPath: "/city/san-francisco",
        supportingPaths: ["/city/new-york", "/city"],
      },
    ],
    outcome:
      "The Corp Dev director presented the shortlist to leadership 4 days after starting the research, with engineering-signal context for each candidate and a recommended approach order. Leadership approved 2 exploratory outreach conversations within the 90-day window, both initiated 4-6 weeks before competitive bidding emerged.",
    lessons: [
      "Engineering-signal data is most useful when paired with the acquirer's own M&A pattern, it accelerates the shortlist phase but does not replace strategic fit analysis.",
      "Per-company /signal pages should always be cross-referenced against /sector and /trend pages before drawing conclusions.",
      "Reading candidate /signal pages side by side is the highest-leverage step for shortlist construction.",
    ],
    extraFaqs: [
      {
        question: "How long did it take to build the acquisition shortlist?",
        answer:
          "In this composite scenario, the Corp Dev director moved from sector-level scouting to a 4-target shortlist in about 3 days, presenting to leadership on day 4, inside a 90-day window before competitive bidding hardened pricing.",
      },
      {
        question: "Which pages does Corp Dev use to build an acquisition shortlist?",
        answer:
          "The workflow runs /sector/[slug] for category framing, /signal/[slug] for per-company engineering momentum and side-by-side comparison, /trend/[slug] to validate category leadership, and /city/[slug] to filter for integration constraints.",
      },
      {
        question: "Does engineering-signal data replace strategic-fit analysis?",
        answer:
          "No. It accelerates the shortlist phase but is paired with the acquirer's own M&A pattern (see /acquirer/[platform]). Strategic fit, integration cost, and approach order are still assessed separately.",
      },
    ],
  }),
  build({
    slug: "pe-operating-partner-portfolio-benchmark",
    name: "PE Operating Partner: Benchmarking Portfolio Engineering Velocity",
    personaSlug: "pe-operating-partners",
    personaLabel: "PE Operating Partner",
    tagline:
      "How a PE Operating Partner used engineering-signal benchmarking to surface a portfolio-company performance gap before it became a board issue.",
    situation:
      "A PE Operating Partner at a $20B+ AUM enterprise-software-focused fund was preparing for a quarterly portfolio review. One platform company in the database category had been delivering on revenue targets but showed signs of engineering slowdown. The OP needed data-driven evidence before raising the issue with the company's CTO and the deal's investment partner.",
    steps: [
      {
        label: "Sector context",
        description:
          "Started at /sector/database to understand the engineering-acceleration patterns at category-leading public peers (MongoDB, Snowflake, Databricks) and adjacent venture-backed competitors.",
        primaryPath: "/sector/database",
      },
      {
        label: "Peer engineering signal review",
        description:
          "Reviewed individual /signal pages for the three most-comparable public-or-near-public database companies. Noted commit-velocity, contributor-influx, and repo creation pulse patterns for each.",
        primaryPath: "/signal/mongodb",
        supportingPaths: ["/signal/clickhouse", "/signal/snowflake (via acquirer)"],
      },
      {
        label: "Trend leaderboard contextualization",
        description:
          "Reviewed /trend/ai-native-databases-2026 to identify where the portfolio company sat in the category-shift toward AI-native workloads. Found that 3 of the 6 leaderboard companies had pivoted toward AI-native features that the portfolio company had not yet announced.",
        primaryPath: "/trend/ai-native-databases-2026",
      },
      {
        label: "Fund concentration analysis",
        description:
          "Used /fund/[their fund]/portfolio to map the fund's other database investments and identify cross-portfolio expertise that could help the underperforming company. Found two adjacent portfolio CTOs with relevant experience.",
        primaryPath: "/fund",
      },
      {
        label: "Action: cross-portfolio support",
        description:
          "Convened a private cross-portfolio CTO call between the underperforming company and the two adjacent portfolio CTOs to share engineering-velocity practices. Used /firstlook to subscribe to weekly tracking of the portfolio company's signals for ongoing monitoring.",
        primaryPath: "/firstlook",
      },
    ],
    outcome:
      "Within 6 weeks, the portfolio company shipped its first AI-native feature announcement (vector search). The CTO publicly credited the cross-portfolio expertise sharing. The OP presented the engineering-signal trajectory at the next quarterly review with the partner team, preempting a potential investment-committee escalation.",
    lessons: [
      "Engineering-signal data is most valuable when used proactively (surface issues before they become board-level concerns) rather than retroactively.",
      "Cross-portfolio expertise sharing is one of the highest-ROI PE Operating Partner moves, engineering signals make the case for which connections to broker.",
      "The /trend leaderboards are essential context, peer-relative positioning matters more than absolute engineering velocity numbers.",
    ],
    extraFaqs: [
      {
        question: "How does a PE Operating Partner benchmark portfolio engineering velocity?",
        answer:
          "By comparing a portfolio company's /signal page against its closest public peers in the relevant /sector hub, positioning it on the category /trend leaderboard, then acting via cross-portfolio expertise sharing rather than waiting for a board escalation.",
      },
      {
        question: "What was the outcome of the benchmarking in this scenario?",
        answer:
          "The portfolio company shipped its first AI-native feature (vector search) within 6 weeks after a cross-portfolio CTO call, and the Operating Partner preempted a potential investment-committee escalation at the next quarterly review.",
      },
      {
        question: "Why use engineering signals proactively rather than retroactively?",
        answer:
          "Surfacing an engineering slowdown before it becomes a board-level concern is far higher-value than diagnosing it afterward. Peer-relative /trend positioning matters more than a company's absolute velocity numbers in isolation.",
      },
    ],
  }),
  build({
    slug: "emerging-manager-pre-round-sourcing",
    name: "Emerging Manager: Pre-Round Sourcing on a Two-Person Investment Team",
    personaSlug: "emerging-managers",
    personaLabel: "Emerging Manager VC",
    tagline:
      "How a $40M Fund I emerging manager landed in 3 oversubscribed AI-infra rounds in 2026 by sourcing from engineering signals 6-8 weeks before bankers circulated decks.",
    situation:
      "A two-person investment team at a $40M Fund I emerging-manager VC had committed to closing 12 investments over 18 months. They lacked the sourcing volume of larger firms but had strong founder-engineer reputation. Their differentiated thesis: invest in pre-round AI-infra companies before the warm-intro network surfaced them. Code-side sourcing was the operational engine that made this thesis executable.",
    steps: [
      {
        label: "Weekly Monday sourcing meeting",
        description:
          "Every Monday morning, the team reviewed the weekly First Look digest. Filtered by sector (AI infra, developer tools, AI/ML) and stage (pre-seed to Series A). Flagged 6-10 companies showing engineering acceleration above the +50% threshold.",
        primaryPath: "/firstlook",
      },
      {
        label: "Per-company deep dive",
        description:
          "For each flagged company, opened /signal/[slug] to read engineering momentum, contributor influx, and language-bias signals. Cross-referenced against the company's homepage, careers page, and founders' Twitter/LinkedIn.",
        primaryPath: "/signal",
      },
      {
        label: "Sector positioning check",
        description:
          "For top 3 candidates each week, used /sector/[slug] hubs to position the company against tracked sector peers. Read the why-it-matters and what-we-track editorials to ground the partner-meeting discussion.",
        primaryPath: "/sector/ai-infra",
      },
      {
        label: "Fund competitive analysis",
        description:
          "Used /fund/[competitor]/portfolio pages to map which a16z, Sequoia, and Index Ventures portfolio companies adjacent to the candidate. Avoided rounds where multiple large funds had already committed.",
        primaryPath: "/fund/andreessen-horowitz/portfolio",
      },
      {
        label: "Founder outreach with engineering-grounded pitch",
        description:
          "Outreach email referenced the engineering-acceleration data ('we noticed your contributor count went from 8 to 23 in the last 4 weeks') instead of generic 'I want to learn more.' Reply rate ~35% vs ~5% baseline for cold-warm outreach in this segment.",
        primaryPath: "/signal",
      },
    ],
    outcome:
      "Over 12 months, the team closed 9 investments, 7 of them were companies first surfaced via engineering-acceleration signals. 3 of the 9 rounds became oversubscribed (a16z, Sequoia, Index Ventures led after the emerging-manager team's investment), validating the pre-round sourcing thesis. The Fund's LP report cited code-side sourcing as a differentiated motion.",
    lessons: [
      "Engineering-signal sourcing is the rare sourcing channel where being smaller and faster is the structural advantage.",
      "Outreach grounded in the engineering-acceleration data converts 5-7x baseline cold-outreach response rates.",
      "Monday-morning weekly cadence is the highest-leverage time-block for emerging-manager sourcing teams.",
    ],
    extraFaqs: [
      {
        question: "How does an emerging manager source pre-round with a two-person team?",
        answer:
          "A weekly Monday First Look digest review filters by sector and stage for engineering acceleration above a +50% threshold; each flagged candidate is deep-dived on /signal/[slug] before founder outreach. The cadence, not headcount, is the engine.",
      },
      {
        question: "What reply rate did engineering-grounded outreach achieve?",
        answer:
          "In this composite, outreach referencing specific contributor-count acceleration (for example, 'your contributor count went from 8 to 23 in 4 weeks') drew roughly 35% reply rates versus a ~5% cold-warm baseline, a 5-7× lift.",
      },
      {
        question: "How many investments did the thesis produce?",
        answer:
          "9 closes over 12 months, 7 of them first surfaced via engineering-acceleration signals; 3 of the rounds became oversubscribed after larger funds (a16z, Sequoia, Index Ventures) followed in, validating the pre-round sourcing thesis.",
      },
    ],
  }),
  build({
    slug: "tech-vp-vendor-consolidation",
    name: "Tech VP: Vendor Consolidation Decision via Engineering Signals",
    personaSlug: "tech-vps",
    personaLabel: "Non-Engineer Tech VP",
    tagline:
      "How a non-engineer VP Platform consolidated 4 observability vendors to 2 by grounding the decision in publicly observable engineering velocity.",
    situation:
      "A non-engineer VP Platform at a Series E SaaS company (1,200 engineers) had been mandated to cut platform spend by 25%. The observability stack had 4 vendors with overlapping coverage: Datadog (APM + infra), Grafana (dashboards), Honeycomb (trace exploration), and Sentry (error tracking). The VP needed to recommend which 2 vendors to consolidate around, and defend the choice to non-engineer executive peers.",
    steps: [
      {
        label: "Engineering signal comparison",
        description:
          "Used /sector/observability to scan the category leadership. Drilled into individual /signal pages for each vendor to read engineering momentum, repo cadence, and language-bias signals.",
        primaryPath: "/sector/observability",
        supportingPaths: ["/signal/datadog", "/signal/grafana", "/signal/honeycomb", "/signal/sentry"],
      },
      {
        label: "Side-by-side decision matrix",
        description:
          "Compared /signal/datadog and /signal/honeycomb side by side to surface engineering-organization-shape differences. Datadog showed sustained breadth across 300+ public repos; Honeycomb showed deeper focus on a narrower trace-exploration surface.",
        primaryPath: "/signal/datadog",
      },
      {
        label: "Trend leaderboard context",
        description:
          "Reviewed /trend/observability-platforms-2026 to position the four vendors against category-shift dynamics (AI-aware observability, LLM-tracing standards).",
        primaryPath: "/trend/observability-platforms-2026",
      },
      {
        label: "Integration path check",
        description:
          "Used /works-with/[primary CRM] and adjacent integration pages to verify which vendors fit the existing operational stack without custom integration work.",
        primaryPath: "/works-with",
      },
      {
        label: "Recommendation to executive peers",
        description:
          "Built a 2-page recommendation memo. Engineering-signal data appeared as objective benchmark layer. Non-engineer executive peers accepted the recommendation without engineering-team-level technical debate.",
        primaryPath: "/methodology",
      },
    ],
    outcome:
      "Consolidated to Datadog (APM + infra + integrated dashboards) and Sentry (error tracking + frontend monitoring). Decommissioned Grafana (replaced by Datadog dashboards) and Honeycomb (replaced by Datadog APM + custom retention). Annual platform-spend savings: $1.2M (27% reduction). Decision held up at subsequent quarterly review without challenge.",
    lessons: [
      "Engineering-signal data translates well to non-engineer executive audiences because the data is independently sourced and publicly verifiable.",
      "Vendor consolidation arguments benefit from objective third-party benchmark data, internal CRMs and engineering opinions alone are not enough.",
      "Side-by-side /signal comparisons are especially valuable for vendor-consolidation work.",
    ],
    extraFaqs: [
      {
        question: "How can a non-engineer VP justify a vendor-consolidation decision?",
        answer:
          "By grounding it in independently sourced, publicly verifiable engineering-velocity data from /signal pages. Because the data is third-party and public, non-engineer executive peers accept it without an engineering-team-level technical debate.",
      },
      {
        question: "What was the spend impact in this scenario?",
        answer:
          "Consolidating 4 observability vendors to 2 (Datadog plus Sentry) produced about $1.2M in annual savings, a 27% platform-spend reduction that held up at the following quarterly review without challenge.",
      },
      {
        question: "Which page is most useful for vendor consolidation?",
        answer:
          "Side-by-side /signal pages, which expose engineering-organization-shape differences, for example Datadog's sustained breadth across 300+ public repos versus Honeycomb's deeper focus on a narrower trace-exploration surface.",
      },
    ],
  }),
  build({
    slug: "founder-fundraise-competitive-mapping",
    name: "Founder: Mapping the Competitive Landscape Before a Series A",
    personaSlug: "founders",
    personaLabel: "Technical Founder",
    tagline:
      "How a technical founder used engineering-signal data to position the fundraise narrative, identify the 4 most-aligned investors, and pre-empt the 'how are you different from X' question.",
    situation:
      "A solo technical founder building an AI agent framework had bootstrapped to $1.4M ARR and was preparing to raise a Series A. The agent-framework space had become crowded (LangChain, CrewAI, Letta, Mastra) and the fundraise narrative needed to position the company's differentiation clearly. The founder also needed to identify the 5-7 investors most aligned with their thesis before opening outreach.",
    steps: [
      {
        label: "Sector positioning",
        description:
          "Used /sector/ai-ml to understand the agent-framework category structure and the engineering-acceleration patterns of public peers. Read the /trend/agentic-ai-frameworks-2026 leaderboard to position the company in the category narrative.",
        primaryPath: "/trend/agentic-ai-frameworks-2026",
        supportingPaths: ["/sector/ai-ml"],
      },
      {
        label: "Per-competitor deep dive",
        description:
          "For each of the 4 most-comparable competitors, opened /signal/[slug] to read engineering momentum, contributor influx, and language-bias signals. Mapped the company's own GitHub trajectory against each competitor's.",
        primaryPath: "/signal/langchain",
        supportingPaths: ["/signal/crewai", "/signal/letta-ai", "/signal/mastra"],
      },
      {
        label: "Side-by-side competitive table",
        description:
          "Compared competitor /signal pages side by side to validate the differentiation story across multiple axes (stage, momentum, language bias, contributor density). Lifted the framing for the competitive-landscape slide in the fundraise deck.",
        primaryPath: "/signal",
      },
      {
        label: "Investor target identification",
        description:
          "Used /fund/ pages to identify which funds had publicly invested in agent-framework adjacent companies. Mapped the company's stage and check-size needs against each fund's published thesis.",
        primaryPath: "/fund",
        supportingPaths: ["/fund/andreessen-horowitz/portfolio", "/fund/menlo-ventures"],
      },
      {
        label: "Strategic-acquirer mapping",
        description:
          "Used /acquirer/ pages to identify potential long-term strategic acquirers (Salesforce, ServiceNow, Atlassian). Verified the acquirer's M&A pattern aligned with the company's likely exit trajectory.",
        primaryPath: "/acquirer/salesforce",
        supportingPaths: ["/acquirer/atlassian", "/acquirer/servicenow"],
      },
    ],
    outcome:
      "Closed Series A 11 weeks after starting outreach. 6 of the 7 contacted funds accepted intro meetings (vs the founder's previous attempt with 1 of 11 acceptance rate). Final round oversubscribed by 1.6x; the founder used the engineering-signal-grounded competitive analysis verbatim in 3 of the term-sheet conversations.",
    lessons: [
      "Engineering-signal data is symmetric, what an investor uses to evaluate you is the same data you can use to map your competitive landscape.",
      "Competitive-landscape slides grounded in publicly observable engineering data are far more credible than self-asserted 'we're ahead' claims.",
      "Investor target lists built from public fund-thesis data convert at meaningfully higher rates than untargeted outreach.",
    ],
    extraFaqs: [
      {
        question: "How does a founder map competitors before a Series A?",
        answer:
          "By positioning on the relevant /trend leaderboard, deep-diving each competitor's /signal page, and validating differentiation across axes (stage, momentum, contributor density, language bias) with side-by-side /signal comparisons, then lifting that framing into the deck's competitive-landscape slide.",
      },
      {
        question: "How did engineering-grounded positioning affect the raise?",
        answer:
          "In this composite the founder closed a Series A in 11 weeks, with 6 of 7 contacted funds taking meetings (versus 1 of 11 on a prior attempt) and a final round oversubscribed by about 1.6×.",
      },
      {
        question: "Why is engineering-signal data symmetric for founders?",
        answer:
          "The same publicly observable data an investor uses to evaluate a startup can be used by the founder to map the competitive landscape and pre-empt the 'how are you different from X' question with verifiable evidence rather than assertion.",
      },
    ],
  }),
  build({
    slug: "researcher-empirical-methodology-citation",
    name: "Researcher: Citing the Methodology in an Empirical Venture-Finance Paper",
    personaSlug: "researchers",
    personaLabel: "Academic Researcher",
    tagline:
      "How an empirical-finance PhD candidate used the published methodology and open dataset to validate a venture-finance leading-indicator hypothesis.",
    situation:
      "A PhD candidate at a top-10 finance program was writing a third-year empirical paper on leading indicators of venture-stage outcomes. The candidate needed a published, citable, replicable dataset and methodology that linked observable engineering activity to fundraise timing. Crunchbase and PitchBook data were proprietary and gated; OpenAlex and Semantic Scholar covered the academic-paper graph but not the engineering-activity layer.",
    steps: [
      {
        label: "Methodology citation",
        description:
          "Found /methodology via Semantic Scholar and OpenAlex citation graphs. Read the full published methodology and the underlying SSRN paper (6606558) documenting commit-velocity acceleration as a 3-6-week leading indicator of fundraise announcements.",
        primaryPath: "/methodology",
        supportingPaths: ["/code-side-sourcing", "/citation-guide"],
      },
      {
        label: "Dataset acquisition",
        description:
          "Accessed the /dataset endpoint to download the full tracked engineering-signal corpus as JSON, JSONL, and CSV. Verified the Zenodo DOI (10.5281/zenodo.19650920) as the canonical archive citation and downloaded the Hugging Face mirror for ML-pipeline integration.",
        primaryPath: "/dataset",
        supportingPaths: ["/reproducibility"],
      },
      {
        label: "Programmatic API access",
        description:
          "Used the /api/v1 endpoints to pull historical signal panels for the longitudinal replication. Verified the public MCP server worked with Claude for LLM-augmented research workflows.",
        primaryPath: "/developers",
        supportingPaths: ["/api/openapi.json"],
      },
      {
        label: "Bibliography construction",
        description:
          "Pulled the BibTeX, APA, and Chicago citation formats from /citation-guide. Cross-referenced the OpenAlex paper ID (W7154916891) and Semantic Scholar paper ID (4dd7b11e) for the references section.",
        primaryPath: "/citation-guide",
      },
      {
        label: "Replication study design",
        description:
          "Used the open dataset to replicate the original paper's central finding on an independent random sample of 200 venture-backed startups. Replication confirmed the 3-6-week leading-indicator window held in a different sub-sample.",
        primaryPath: "/methodology",
      },
    ],
    outcome:
      "The candidate's empirical paper was accepted at a top-tier finance conference 9 months later. The paper cited the SSRN preprint and the open dataset (CC BY 4.0) with full attribution. The replication-confirmation finding became one of the paper's headline contributions. The candidate's follow-on advisor inquiries cited the open-data approach as a key enabler.",
    lessons: [
      "Open, citable, CC-BY-licensed datasets and methodologies enable academic replication studies that proprietary data products simply cannot.",
      "Researchers strongly prefer DOI-backed archive citations (Zenodo) for long-term stability over commercial-platform-only URLs.",
      "Programmatic API access plus a clean MCP server enables LLM-augmented research workflows that accelerate replication studies.",
    ],
    extraFaqs: [
      {
        question: "Is the dataset citable for academic work?",
        answer:
          "Yes. The corpus is published under CC BY 4.0 with a Zenodo DOI (10.5281/zenodo.19650920) and an accompanying SSRN preprint. BibTeX, APA, and Chicago citation formats are available at /citation-guide.",
      },
      {
        question: "How can researchers access the data programmatically?",
        answer:
          "Via the /dataset endpoint (JSON, JSONL, CSV), the /api/v1 endpoints documented at /developers and /api/openapi.json, and a public read-only MCP server for LLM-augmented research workflows.",
      },
      {
        question: "What did the replication in this scenario find?",
        answer:
          "An independent random sample of 200 venture-backed startups confirmed that the 3-6-week engineering-acceleration leading-indicator window held in a different sub-sample, which became one of the paper's headline contributions.",
      },
    ],
  }),
  build({
    slug: "journalist-trend-story-grounding",
    name: "Journalist: Grounding a Sector Trend Story in Citable Engineering Data",
    personaSlug: "journalists",
    personaLabel: "Tech Journalist",
    tagline:
      "How a senior reporter at a major tech publication grounded a sector trend story in publicly observable engineering-signal data, without coordinating with company PR.",
    situation:
      "A senior reporter at a major tech publication was writing a 1,200-word feature on the AI inference provider category. The reporter needed to ground the story in citable, independent, publicly verifiable data, and wanted to avoid the PR-coordination cycle that softened previous sector coverage. The story's lede needed to position 3-4 inference providers as the category leaders with defensible evidence.",
    steps: [
      {
        label: "Trend leaderboard scan",
        description:
          "Started at /trend/llm-inference-providers-2026 to identify the editorial framing of the category and the publicly tracked leaderboard companies. Read the why-this-matters and what-to-watch editorials.",
        primaryPath: "/trend/llm-inference-providers-2026",
      },
      {
        label: "Per-company signal reading",
        description:
          "For each tracked company, opened /signal/[slug] to read engineering momentum, repo cadence, and language-bias signals. Pulled quotable numbers (commit volume, contributor counts) directly from the per-company pages.",
        primaryPath: "/signal/groq",
        supportingPaths: ["/signal/fireworks-ai", "/signal/together-ai", "/signal/modal"],
      },
      {
        label: "Methodology citation",
        description:
          "Linked to /methodology in the story's footnotes. Read the SSRN paper reference to confirm the leading-indicator framing held up to peer review.",
        primaryPath: "/methodology",
      },
      {
        label: "Side-by-side comparison",
        description:
          "Compared /signal/groq and /signal/modal side by side to surface engineering-organization-shape differences. Lifted comparison numbers into the story's middle section.",
        primaryPath: "/signal/groq",
      },
      {
        label: "Verification + publication",
        description:
          "Verified each cited number by independently checking the public GitHub orgs. Sent the story to fact-checking with a list of source URLs. No PR coordination was required, every claim was linked to a public, independent source.",
        primaryPath: "/signal",
      },
    ],
    outcome:
      "Story published with 14 inline citations to VC Deal Flow Signal URLs and 3 deep-links to /signal pages. The story's lede positioned 4 inference providers as category leaders with defensible engineering-acceleration evidence. The publication received zero corrections requests from the companies named. The reporter cited VC Deal Flow Signal as a source in two follow-on stories.",
    lessons: [
      "Independent, citable, public-data-sourced engineering data is uniquely valuable to journalism because it bypasses the PR-coordination cycle.",
      "Per-company /signal pages should be the citation target, they have the most direct evidence on the engineering-acceleration claim.",
      "Methodology and SSRN-paper citations elevate trade-press stories to the level of grounded research-backed reporting.",
    ],
    extraFaqs: [
      {
        question: "How can a journalist ground a sector story without PR coordination?",
        answer:
          "By citing publicly verifiable /signal and /trend pages and linking /methodology in the footnotes. Every claim traces to an independent public GitHub source, which bypasses the PR-coordination cycle that softens conventional sector coverage.",
      },
      {
        question: "How many citations did the story use in this scenario?",
        answer:
          "The published feature carried 14 inline citations to VC Deal Flow Signal URLs and 3 deep-links to /signal pages, and drew zero correction requests from the companies named.",
      },
      {
        question: "Which page is the right citation target?",
        answer:
          "Per-company /signal pages, which carry the most direct evidence on the engineering-acceleration claim. Linking /methodology and the SSRN paper adds the research-backed credibility that elevates the reporting.",
      },
    ],
  }),
  build({
    slug: "corp-dev-sector-scan-quarterly-review",
    name: "Corp Dev: Quarterly Sector Scan for Board Strategy Review",
    personaSlug: "corp-dev",
    personaLabel: "Corp Dev Director",
    tagline:
      "How a Corp Dev director prepared a 30-minute sector strategy review for a Fortune 100 board, using engineering-signal data to ground forward-looking M&A recommendations.",
    situation:
      "A Corp Dev director at a Fortune 100 enterprise SaaS company had been asked to present a 30-minute quarterly sector strategy review to the board. The board wanted forward-looking M&A recommendations (which sectors and stages to focus the company's $3B M&A capacity on over the next 12 months) grounded in defensible market data. Traditional banker decks did not provide engineering-organization context.",
    steps: [
      {
        label: "Sector-wide scan",
        description:
          "Started at /sector to scan all 10 tracked sectors. Identified the 3 with strongest engineering acceleration over the trailing 6 months (AI infra, agentic AI frameworks, developer tools).",
        primaryPath: "/sector",
      },
      {
        label: "Year-in-review context",
        description:
          "Used /year-in-review/2026 and /year-in-review/2025 to position the sector dynamics in their historical context. Pulled quotable framing for the board narrative.",
        primaryPath: "/year-in-review/2026",
        supportingPaths: ["/year-in-review/2025"],
      },
      {
        label: "Trend-leaderboard deep dive",
        description:
          "For the top 3 sectors, used /trend/[slug] pages to identify the 5-10 most-tracked companies in each category. Read the why-it-matters and what-to-watch editorials.",
        primaryPath: "/trend",
      },
      {
        label: "Peer-acquirer benchmarking",
        description:
          "Used /acquirer/[competitor] pages (Salesforce, ServiceNow, IBM, Cisco) to benchmark the company's likely M&A pace against industry peers. Surfaced cases where peers had moved aggressively in sectors the company had not yet entered.",
        primaryPath: "/acquirer/salesforce",
        supportingPaths: ["/acquirer/servicenow", "/acquirer/cisco"],
      },
      {
        label: "Strategic recommendation",
        description:
          "Built a 12-slide deck. Engineering-signal data appeared as the objective layer underneath the strategic narrative. Recommended focusing $1.8B of the $3B M&A capacity on AI infrastructure and agentic AI frameworks over the next 12 months.",
        primaryPath: "/methodology",
      },
    ],
    outcome:
      "The board approved the recommended M&A capacity allocation. Within 6 months, the company closed 2 acquisitions in AI infrastructure and 1 in agentic AI, all 3 targets were identified through the engineering-signal-grounded scanning process. The Corp Dev director was asked to present the methodology at the next annual strategy offsite.",
    lessons: [
      "Engineering-signal data is uniquely useful in board-level strategy reviews because the data is independently sourced and translates well to non-engineer executive audiences.",
      "Year-in-review and trend-leaderboard pages provide the editorial context that grounds M&A capacity allocation arguments.",
      "Peer-acquirer benchmarking via /acquirer/[competitor] pages is one of the highest-leverage moves for Corp Dev strategy.",
    ],
    extraFaqs: [
      {
        question: "How does Corp Dev prepare a board sector-strategy review?",
        answer:
          "Scan all tracked sectors at /sector, contextualize with /year-in-review, deep-dive the top sectors' /trend leaderboards, and benchmark M&A pace against peers via /acquirer/[competitor] pages before forming a forward-looking recommendation.",
      },
      {
        question: "What did the board approve in this scenario?",
        answer:
          "The recommended allocation of $1.8B of $3B M&A capacity toward AI infrastructure and agentic AI over 12 months. Within 6 months the company closed 3 acquisitions, all surfaced through the signal-grounded scanning process.",
      },
      {
        question: "Why does engineering-signal data work for board audiences?",
        answer:
          "It is independently sourced and publicly verifiable, so it translates cleanly to non-engineer executives and directors. /year-in-review and /trend pages supply the editorial context that grounds capacity-allocation arguments.",
      },
    ],
  }),
];

export function getAllCaseStudySlugs(): string[] {
  return CASE_STUDIES.map((c) => c.slug);
}

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}

export function getCaseStudiesForPersona(personaSlug: string): CaseStudy[] {
  return CASE_STUDIES.filter((c) => c.personaSlug === personaSlug);
}
