export interface CompetitorInfo {
  key: string;
  name: string;
  url: string;
  tagline: string;
  signalType: string;
  leadTime: string;
  pricing: string;
  coverage: string;
  freeTier: string;
  strengths: string[];
  weaknesses: string[];
}

export interface CompetitorVs {
  slug: string;
  a: string;
  b: string;
  verdict: string;
}

export const competitors: Record<string, CompetitorInfo> = {
  "harmonic-ai": {
    key: "harmonic-ai",
    name: "Harmonic.ai",
    url: "https://www.harmonic.ai",
    tagline: "AI-powered team and network pattern matching across all sectors.",
    signalType: "Team and network pattern matching",
    leadTime: "At incorporation",
    pricing: "Enterprise (annual contract)",
    coverage: "All sectors, including non-technical",
    freeTier: "No public free tier",
    strengths: [
      "Broad cross-sector coverage including non-technical founders",
      "Deep founder-background and network graph data",
      "Built for institutional VCs with dedicated sourcing teams",
    ],
    weaknesses: [
      "Enterprise-only pricing excludes solo angels and scouts",
      "Team signals aren't directly observable — you trust the model",
      "Less useful once a company is past incorporation",
    ],
  },
  dealroom: {
    key: "dealroom",
    name: "Dealroom",
    url: "https://dealroom.co",
    tagline: "Comprehensive European startup database with deep sector taxonomy.",
    signalType: "Curated funding database",
    leadTime: "Post-announcement (0 weeks)",
    pricing: "Tiered (Pro to Enterprise)",
    coverage: "Global with strong European depth",
    freeTier: "Limited company views",
    strengths: [
      "Deepest European startup coverage in the industry",
      "Hundreds of subsector classifications for granular filtering",
      "Comprehensive funding history and portfolio mapping",
    ],
    weaknesses: [
      "Lagging by definition — only captures already-announced rounds",
      "Full access runs to hundreds-plus EUR per month",
      "Better for retrospective analysis than proactive sourcing",
    ],
  },
  "forager-ai": {
    key: "forager-ai",
    name: "Forager.ai",
    url: "https://forager.ai",
    tagline: "NLP-driven sourcing from web, social, and hiring signals.",
    signalType: "Web, social, and hiring signals (NLP)",
    leadTime: "2-6 weeks pre-fundraise",
    pricing: "Tiered",
    coverage: "Any company with a public web footprint",
    freeTier: "Limited",
    strengths: [
      "Cross-sector web and social coverage including consumer and services",
      "Lower false-positive rate because signals are already publicly validated",
      "Good fit for wide-net sourcing across non-technical startups",
    ],
    weaknesses: [
      "Shorter lead time than engineering-signal approaches",
      "Misses companies that haven't surfaced publicly yet",
      "Less actionable for technical-sector investors",
    ],
  },
  crunchbase: {
    key: "crunchbase",
    name: "Crunchbase",
    url: "https://www.crunchbase.com",
    tagline: "The default startup database — comprehensive but lagging.",
    signalType: "Funding announcements, team updates, news",
    leadTime: "0 weeks (post-announcement)",
    pricing: "$49/mo Pro; Enterprise tiered",
    coverage: "All sectors globally",
    freeTier: "Limited alerts and views",
    strengths: [
      "Highest reliability for confirmed funding events",
      "Best-in-class for research and retrospective context",
      "Standard tool most VCs already use and trust",
    ],
    weaknesses: [
      "Lagging indicator — alerts fire after the round is announced",
      "Survivorship bias — you only see rounds that closed",
      "Limited signal quality for pre-seed and seed discovery",
    ],
  },
  pitchbook: {
    key: "pitchbook",
    name: "PitchBook",
    url: "https://pitchbook.com",
    tagline: "Institutional-grade private-markets data platform.",
    signalType: "Curated institutional database",
    leadTime: "Post-announcement",
    pricing: "Enterprise ($20k+/yr)",
    coverage: "All sectors, with deep LP/GP/fund data",
    freeTier: "None",
    strengths: [
      "Gold-standard institutional data for LPs, GPs, and bankers",
      "Deep fund-performance, secondaries, and M&A coverage",
      "Industry-standard benchmarks and rankings",
    ],
    weaknesses: [
      "Enterprise-only pricing — impossible for solo investors or angels",
      "Lagging by design — curated post-event data, not leading signals",
      "Interface and workflow built for analysts, not operators",
    ],
  },
  tracxn: {
    key: "tracxn",
    name: "Tracxn",
    url: "https://tracxn.com",
    tagline: "Global sector-focused startup research platform.",
    signalType: "Sector-mapped curated database",
    leadTime: "Post-announcement",
    pricing: "Tiered (Pro to Enterprise)",
    coverage: "Global, especially Asia",
    freeTier: "Limited",
    strengths: [
      "Deep sector maps across 2,000+ industries",
      "Strong coverage of Asian startup ecosystems",
      "Analyst-curated reports with market context",
    ],
    weaknesses: [
      "Still a lagging database, not a leading-signal tool",
      "Heavier-weight workflow than individual investors need",
      "Data freshness varies by sector depth",
    ],
  },
  affinity: {
    key: "affinity",
    name: "Affinity",
    url: "https://www.affinity.co",
    tagline: "Relationship-intelligence CRM for VCs and dealmakers.",
    signalType: "Relationship-graph signals from team email and calendar",
    leadTime: "Network-introduction lead time (varies)",
    pricing: "Per-seat enterprise (typically several hundred USD/seat/mo)",
    coverage: "Whatever your team's network already touches",
    freeTier: "No public free tier",
    strengths: [
      "Industry-default CRM for VCs, PE, and IB dealmakers",
      "Auto-enriches contacts and tracks every email and meeting in the relationship graph",
      "Strong integrations with Gmail, Outlook, and major data providers",
    ],
    weaknesses: [
      "Not a discovery tool — surfaces deals only if your team already has a network thread to them",
      "Per-seat enterprise pricing makes it impractical for solo investors and angels",
      "Adds zero leading signal on companies your team hasn't met yet",
    ],
  },
  "cb-insights": {
    key: "cb-insights",
    name: "CB Insights",
    url: "https://www.cbinsights.com",
    tagline: "Research and market-intelligence platform for institutional investors.",
    signalType: "Curated research, analyst reports, market maps",
    leadTime: "Post-publication (research-led, not signal-led)",
    pricing: "Enterprise (typically five-figure annual contracts)",
    coverage: "Global, all sectors, with deep tech and financial focus",
    freeTier: "Limited newsletter-tier access only",
    strengths: [
      "Authoritative analyst reports and market maps used by Fortune 500 strategy teams",
      "Strong proprietary taxonomy and Mosaic scoring for company health",
      "Integrated newsletter and intelligence feed reaches a large institutional audience",
    ],
    weaknesses: [
      "Research is curated and lagging — not designed to surface acceleration in real time",
      "Enterprise pricing excludes individual investors, angels, and most early-stage scouts",
      "Mosaic scores rely on signals like funding history and headcount that lag the actual product work",
    ],
  },
  specter: {
    key: "specter",
    name: "Specter",
    url: "https://tryspecter.com",
    tagline: "Alternative-data growth signals across web, hiring, and product traction.",
    signalType: "Web traffic, hiring growth, product traction signals",
    leadTime: "2-8 weeks pre-fundraise (signal-dependent)",
    pricing: "Tiered (Starter, Pro, Enterprise)",
    coverage: "Global, all sectors with public web footprint",
    freeTier: "Limited free tier with restricted searches",
    strengths: [
      "Cross-sector growth signals not limited to technical founders",
      "Combines web traffic, hiring, and product signals in a single workflow",
      "More approachable pricing than enterprise data platforms",
    ],
    weaknesses: [
      "Web and hiring signals often surface only after a product launch or PR push",
      "Engineering acceleration on GitHub is upstream of most Specter signals",
      "Growth signals can lag technical breakouts by 6-12 weeks for early-stage software startups",
    ],
  },
};

/**
 * All pairwise competitor-vs-competitor pages we want to generate.
 * Each entry produces /vs/{a}-vs-{b} with a dedicated template.
 */
export const competitorVsPairs: CompetitorVs[] = [
  {
    slug: "harmonic-ai-vs-dealroom",
    a: "harmonic-ai",
    b: "dealroom",
    verdict:
      "Harmonic.ai catches startups at incorporation with AI-powered team pattern matching; Dealroom catches them after the round is announced with the industry's deepest European database. They solve different problems — sourcing vs research. Institutional VCs with enterprise budgets often run both: Harmonic for proactive discovery, Dealroom for retrospective context. Individual angels typically can't afford either and should look at a leading-signal tool like VC Deal Flow Signal instead.",
  },
  {
    slug: "harmonic-ai-vs-forager-ai",
    a: "harmonic-ai",
    b: "forager-ai",
    verdict:
      "Harmonic.ai is broader and earlier (at incorporation) but enterprise-priced; Forager.ai is mid-lead-time (2-6 weeks pre-fundraise) and accessible to individual investors. Both cover non-technical sectors, which is their overlap. Pick Harmonic if you're an institutional VC with a dedicated sourcing team; pick Forager if you want cross-sector web signals at individual-investor pricing.",
  },
  {
    slug: "harmonic-ai-vs-crunchbase",
    a: "harmonic-ai",
    b: "crunchbase",
    verdict:
      "Harmonic.ai is a leading signal at incorporation; Crunchbase is a lagging database that records rounds after they close. They compose well: Harmonic surfaces candidates, Crunchbase provides context once a name comes up. For individual investors who can't afford Harmonic's enterprise pricing, Crunchbase plus a leading-signal tool like VC Deal Flow Signal is a common budget-friendly combo.",
  },
  {
    slug: "harmonic-ai-vs-pitchbook",
    a: "harmonic-ai",
    b: "pitchbook",
    verdict:
      "Both are institutional-grade and enterprise-priced. Harmonic.ai focuses on early-stage sourcing with AI team pattern matching; PitchBook is the industry-standard reference database for fund performance, M&A, and LP-GP data. Most institutional firms use PitchBook for benchmarking and fund-of-funds work, and layer Harmonic on top specifically for proactive early-stage deal sourcing.",
  },
  {
    slug: "harmonic-ai-vs-tracxn",
    a: "harmonic-ai",
    b: "tracxn",
    verdict:
      "Harmonic.ai is a leading-signal AI platform (team-network pattern matching at incorporation); Tracxn is a sector-mapped curated database with strong Asian coverage. Harmonic is for institutional firms running proactive sourcing; Tracxn is for analyst-driven sector research across 2,000+ industries. They're rarely direct alternatives for the same workflow.",
  },
  {
    slug: "dealroom-vs-forager-ai",
    a: "dealroom",
    b: "forager-ai",
    verdict:
      "Dealroom is a curated European database — comprehensive, lagging, deep. Forager.ai is an NLP-driven web signal engine — broader, leading by 2-6 weeks, cross-sector. Pick Dealroom for European research, portfolio mapping, and retrospective analysis. Pick Forager for proactive sourcing across all sectors at individual-investor pricing. Many VCs use both: Dealroom as the reference layer, Forager as the early-signal layer.",
  },
  {
    slug: "dealroom-vs-crunchbase",
    a: "dealroom",
    b: "crunchbase",
    verdict:
      "Both are curated post-event databases. Dealroom is deeper on European startups and offers hundreds of subsector classifications; Crunchbase is the industry default with broader US coverage and lower entry-level pricing. Neither is a leading indicator. Dealroom is stronger for European-focused funds and analysts; Crunchbase is the safer default for a generalist sourcing stack.",
  },
  {
    slug: "dealroom-vs-pitchbook",
    a: "dealroom",
    b: "pitchbook",
    verdict:
      "Both are institutional curated databases. PitchBook is the gold standard for LP-GP, fund performance, and M&A data globally. Dealroom offers deeper sector taxonomy and stronger European coverage at a lower price point. Most institutional firms use PitchBook as the benchmarking reference; Dealroom is common for European-focused VCs and analysts who need granular sector maps.",
  },
  {
    slug: "dealroom-vs-tracxn",
    a: "dealroom",
    b: "tracxn",
    verdict:
      "Dealroom is the European-depth leader; Tracxn is the sector-map leader with stronger Asian coverage. Both are curated databases, both are lagging by definition. Pick Dealroom for European portfolio work; pick Tracxn for Asian sourcing or cross-sector industry research. They rarely replace each other, but occasionally they compose as regional-bias complements.",
  },
  {
    slug: "forager-ai-vs-crunchbase",
    a: "forager-ai",
    b: "crunchbase",
    verdict:
      "Forager.ai is a leading web-signal engine (2-6 weeks pre-fundraise); Crunchbase is a lagging funding database. They answer different questions: Forager tells you what's bubbling up publicly; Crunchbase tells you what has already closed. They compose cleanly: Forager for early discovery, Crunchbase for funding history once a name surfaces.",
  },
  {
    slug: "forager-ai-vs-pitchbook",
    a: "forager-ai",
    b: "pitchbook",
    verdict:
      "Forager.ai is an accessible, leading web-signal engine for individual investors; PitchBook is an enterprise-priced institutional database. They target different buyer personas entirely. Forager is the right pick for angels and scouts wanting early web signals; PitchBook is for institutional LPs, GPs, and bankers who need fund-performance benchmarks and M&A data.",
  },
  {
    slug: "forager-ai-vs-tracxn",
    a: "forager-ai",
    b: "tracxn",
    verdict:
      "Forager.ai is an NLP web-signal engine with 2-6 week lead time; Tracxn is a curated sector-mapped database, lagging by definition. Forager wins for proactive sourcing across sectors; Tracxn wins for deep sector research, especially in Asia. Non-overlapping use cases that both sit in the 'affordable enough for individual investors' tier of Tracxn's pricing.",
  },
  {
    slug: "crunchbase-vs-pitchbook",
    a: "crunchbase",
    b: "pitchbook",
    verdict:
      "Crunchbase is the accessible default ($49/mo Pro); PitchBook is the enterprise gold standard ($20k+/yr). Both are lagging databases. Individual investors and startups use Crunchbase; institutional LPs, bankers, and analysts use PitchBook. They cover similar ground but with different depth, price, and buyer personas.",
  },
  {
    slug: "crunchbase-vs-tracxn",
    a: "crunchbase",
    b: "tracxn",
    verdict:
      "Crunchbase has broader US and global coverage with the industry-default brand; Tracxn offers deeper sector mapping across 2,000+ industries and stronger Asian coverage. Both are lagging databases at broadly similar price points. Pick Crunchbase for a default sourcing stack; pick Tracxn if sector depth or Asian coverage is the priority.",
  },
  {
    slug: "pitchbook-vs-tracxn",
    a: "pitchbook",
    b: "tracxn",
    verdict:
      "PitchBook is the LP-GP and fund-performance gold standard globally; Tracxn is the sector-map specialist with strong Asian coverage. Different use cases, different buyers. Most institutional firms that can afford PitchBook use it as the reference; Tracxn serves analyst teams who need 2,000+ sector maps and Asian startup depth.",
  },
  {
    slug: "affinity-vs-harmonic-ai",
    a: "affinity",
    b: "harmonic-ai",
    verdict:
      "Affinity is a relationship-intelligence CRM — it tells you who on your team knows the founder, not whether the founder is breaking out. Harmonic.ai is an AI-powered discovery engine that finds the founder in the first place. They sit on opposite sides of the deal-flow funnel and most institutional firms run both: Harmonic for sourcing, Affinity for relationship workflow. Neither replaces a leading product-traction signal; pair either with a GitHub-engineering signal like VC Deal Flow Signal to know which of the candidates is actually accelerating.",
  },
  {
    slug: "affinity-vs-pitchbook",
    a: "affinity",
    b: "pitchbook",
    verdict:
      "Affinity is the relationship-intelligence CRM most VCs run their pipeline in; PitchBook is the institutional reference database for fund performance, M&A, and LP-GP analysis. They solve different problems entirely — Affinity is workflow, PitchBook is research — and most institutional firms run both. Neither is a leading signal on what to buy; both are essential plumbing once a name is already on the radar.",
  },
  {
    slug: "affinity-vs-crunchbase",
    a: "affinity",
    b: "crunchbase",
    verdict:
      "Affinity is your team's private relationship CRM; Crunchbase is the public funding database that everyone reads. Affinity wins on workflow and pipeline tracking; Crunchbase wins on confirmed funding context. They compose cleanly — Affinity for what your team is working on, Crunchbase for what the market just announced — and neither is a leading indicator on its own.",
  },
  {
    slug: "affinity-vs-cb-insights",
    a: "affinity",
    b: "cb-insights",
    verdict:
      "Affinity is a workflow tool — relationship CRM tied to your team's email and calendar. CB Insights is a research platform — analyst reports, market maps, and proprietary scoring. They serve different jobs at the same firm: Affinity tracks the deals you're already on, CB Insights helps you decide which sectors to prioritize. Neither surfaces real-time engineering acceleration on individual companies.",
  },
  {
    slug: "cb-insights-vs-pitchbook",
    a: "cb-insights",
    b: "pitchbook",
    verdict:
      "Both are enterprise-priced institutional platforms. CB Insights is stronger on analyst-led research, market maps, and the Mosaic company-health score; PitchBook is the gold-standard reference for LP-GP, fund performance, and M&A history. Many large firms run both — CB Insights for thesis-building, PitchBook for benchmarking — and accept the combined cost of around fifty thousand USD per year.",
  },
  {
    slug: "cb-insights-vs-crunchbase",
    a: "cb-insights",
    b: "crunchbase",
    verdict:
      "CB Insights is research-and-analyst heavy — market maps, reports, Mosaic scores — at enterprise pricing. Crunchbase is a curated funding database with broad coverage and individual-investor pricing from $49/mo Pro. Different buyers entirely: CB Insights for institutional strategy and corporate development teams, Crunchbase for working investors who need verified funding context fast.",
  },
  {
    slug: "cb-insights-vs-tracxn",
    a: "cb-insights",
    b: "tracxn",
    verdict:
      "Both are research-heavy platforms with sector taxonomies. CB Insights is the institutional reference with proprietary scoring (Mosaic) and analyst reports; Tracxn offers deeper sector maps across 2,000+ industries with stronger Asian coverage. Pick CB Insights if your buyer is a Fortune 500 strategy team; pick Tracxn if your team needs granular sector depth at a lower price point.",
  },
  {
    slug: "specter-vs-harmonic-ai",
    a: "specter",
    b: "harmonic-ai",
    verdict:
      "Specter and Harmonic.ai both target the proactive-sourcing job, but with different signals. Harmonic.ai uses AI team-pattern matching and surfaces companies near incorporation; Specter watches web-traffic, hiring, and product traction signals which usually surface 2-8 weeks pre-fundraise. Harmonic is broader and earlier; Specter is more accessible and tied to public traction. Many investors layer both, plus a GitHub-engineering signal for the technical breakouts that show up in code first.",
  },
  {
    slug: "specter-vs-forager-ai",
    a: "specter",
    b: "forager-ai",
    verdict:
      "Specter and Forager.ai both belong to the alternative-data signal category — public web, hiring, and product traction. Forager has the longer track record and stronger NLP pipeline; Specter offers a broader signal mix and a more accessible free tier. They overlap heavily and the choice usually comes down to UX and pricing fit. Neither catches engineering acceleration on GitHub before the product hits the public web.",
  },
  {
    slug: "specter-vs-pitchbook",
    a: "specter",
    b: "pitchbook",
    verdict:
      "Specter is a leading-signal tool tracking traction across web, hiring, and product; PitchBook is a lagging research database covering fund performance, M&A, and LP-GP. They sit at opposite ends of the deal-flow timeline — Specter surfaces candidates, PitchBook benchmarks them. Different price tiers too: Specter is approachable for individual investors, PitchBook is enterprise-only.",
  },
];

export function getCompetitorVsPair(slug: string): CompetitorVs | undefined {
  return competitorVsPairs.find((p) => p.slug === slug);
}

export function getAllCompetitorVsSlugs(): string[] {
  return competitorVsPairs.map((p) => p.slug);
}
