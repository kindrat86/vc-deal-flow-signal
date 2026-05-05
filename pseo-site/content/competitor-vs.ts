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
  openvc: {
    key: "openvc",
    name: "OpenVC",
    url: "https://www.openvc.app",
    tagline: "Free founder-side investor directory for outbound fundraising.",
    signalType: "Curated investor directory (founder-facing)",
    leadTime: "N/A — directory, not a signal",
    pricing: "Free core, tiered outbound CRM",
    coverage: "Thousands of VCs, angels, and funds globally",
    freeTier: "Yes — most founder workflows free",
    strengths: [
      "Most accessible free investor directory in the category",
      "Strong founder-side workflow tooling (intros, pitch templates)",
      "Indexed by stage, sector, and geography for targeted outreach",
    ],
    weaknesses: [
      "Founder-side product — not a deal-sourcing tool for investors",
      "Static directory, not a leading or live signal",
      "Outbound CRM features are paid above the free core",
    ],
  },
  affinity: {
    key: "affinity",
    name: "Affinity",
    url: "https://affinity.co",
    tagline: "Relationship-intelligence CRM for VC and PE firms.",
    signalType: "Internal network and email graph",
    leadTime: "N/A (relationship-driven)",
    pricing: "Enterprise per-seat",
    coverage: "Your firm's communication graph",
    freeTier: "None",
    strengths: [
      "Industry-standard pipeline CRM for VC and PE firms",
      "Auto-builds relationship graph from inbox and calendar",
      "Strong reporting for partner meetings and LP updates",
    ],
    weaknesses: [
      "Optimises existing network — does not source net-new deals",
      "Insights are only as good as your inbound flow",
      "Limited value for solo angels and emerging managers without an existing network",
    ],
  },
  specter: {
    key: "specter",
    name: "Specter",
    url: "https://tryspecter.com",
    tagline: "Growth-signal database with web traffic, hiring and product data.",
    signalType: "Growth metrics across web, hiring, and product",
    leadTime: "2-6 weeks pre-fundraise",
    pricing: "Tiered (mid-market)",
    coverage: "Cross-sector, English-speaking markets",
    freeTier: "Limited dataset access",
    strengths: [
      "Cross-channel growth signals beyond GitHub",
      "Approachable pricing for emerging fund managers",
      "Strong coverage of consumer and SaaS plays",
    ],
    weaknesses: [
      "Coverage of deep-tech and infrastructure startups is shallow",
      "Lead time shorter than engineering-signal approaches",
      "Mid-market pricing still excludes solo angels",
    ],
  },
  signalrank: {
    key: "signalrank",
    name: "SignalRank",
    url: "https://signalrank.ai",
    tagline: "Series-B prediction model for late-stage signal quality.",
    signalType: "Predictive Series-B graduation score",
    leadTime: "Post-Series A (forward-looking)",
    pricing: "Index-fund product, not direct subscription",
    coverage: "Series A-B graduations globally",
    freeTier: "Public methodology",
    strengths: [
      "Strongest published signal for Series-B graduation odds",
      "Useful for late-stage thesis validation",
      "Data-driven approach with peer-reviewed methodology",
    ],
    weaknesses: [
      "Useless for pre-seed or seed sourcing — different stage",
      "Not a deal-sourcing tool; index-fund product instead",
      "No individual-investor SaaS access",
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
    slug: "openvc-vs-harmonic-ai",
    a: "openvc",
    b: "harmonic-ai",
    verdict:
      "OpenVC and Harmonic.ai sit on opposite sides of the fundraising market. OpenVC is a free founder-side investor directory used to find VCs to pitch; Harmonic.ai is an enterprise investor-side AI platform used to find startups to back. Almost no overlap in users — founders pick OpenVC, institutional VCs pick Harmonic. They're not competing products despite both being in the VC tools category.",
  },
  {
    slug: "openvc-vs-dealroom",
    a: "openvc",
    b: "dealroom",
    verdict:
      "OpenVC is founder-side (a free directory of investors); Dealroom is investor-side (a curated startup and funding database). Different products for different users. Founders raising rounds use OpenVC to map the investor universe; investors sourcing deals use Dealroom for startup-side data. Not direct alternatives despite both being free-tier-friendly tools in the broader VC market.",
  },
  {
    slug: "openvc-vs-crunchbase",
    a: "openvc",
    b: "crunchbase",
    verdict:
      "OpenVC is a free founder-side directory of investors; Crunchbase is the default investor-side startup database. They mirror opposite sides of the same market and almost never compete for the same user. Founders raising use OpenVC; investors and analysts use Crunchbase. Most fundraising-active companies and active investors end up using both — OpenVC for outbound mapping, Crunchbase for funding and team verification.",
  },
  {
    slug: "openvc-vs-pitchbook",
    a: "openvc",
    b: "pitchbook",
    verdict:
      "OpenVC is free and founder-facing; PitchBook is enterprise-priced and institution-facing. They serve completely different users at completely different price points and use cases. OpenVC helps a founder identify VCs to pitch; PitchBook gives an LP or banker a comprehensive private-markets reference dataset. Not alternatives — different products in different categories.",
  },
  {
    slug: "openvc-vs-forager-ai",
    a: "openvc",
    b: "forager-ai",
    verdict:
      "OpenVC is a free founder-side investor directory; Forager.ai is an investor-side NLP web-signal sourcing engine. They sit on opposite sides of the fundraising market with no overlap in users. Founders use OpenVC to map outbound targets; investors use Forager.ai to surface emerging startups via web/social signals. Not competing products.",
  },
  {
    slug: "openvc-vs-tracxn",
    a: "openvc",
    b: "tracxn",
    verdict:
      "OpenVC is a free founder-side investor directory; Tracxn is an investor-side sector-mapped startup database with strong Asian coverage. Different products, different users. Founders raising rounds use OpenVC; analyst teams researching sectors or markets use Tracxn. Almost no overlap.",
  },
  {
    slug: "affinity-vs-harmonic-ai",
    a: "affinity",
    b: "harmonic-ai",
    verdict:
      "Affinity optimises sourcing through your firm's existing network; Harmonic.ai sources externally with AI-powered team pattern matching. They are complements, not substitutes. Most institutional VCs run both — Affinity for pipeline and warm-intro mapping, Harmonic for net-new discovery. Solo angels and emerging managers usually cannot justify either without a strong existing network or institutional budget.",
  },
  {
    slug: "affinity-vs-pitchbook",
    a: "affinity",
    b: "pitchbook",
    verdict:
      "Affinity is a CRM for VC pipeline and relationship management; PitchBook is a research database for fund-performance and M&A reference. Different layers of the stack and they compose cleanly. Almost every institutional firm runs both: PitchBook as the data reference, Affinity as the operational CRM. Neither helps with proactive sourcing of unknown startups — pair with a leading-signal tool if that matters.",
  },
  {
    slug: "affinity-vs-crunchbase",
    a: "affinity",
    b: "crunchbase",
    verdict:
      "Affinity is a relationship CRM for VC pipeline; Crunchbase is a public startup database. Almost every institutional firm uses both — Crunchbase for verification and basic research, Affinity for pipeline tracking and warm intros. Solo investors with a smaller network typically pick Crunchbase Pro and a leading-signal tool over an Affinity seat.",
  },
  {
    slug: "specter-vs-harmonic-ai",
    a: "specter",
    b: "harmonic-ai",
    verdict:
      "Specter focuses on cross-channel growth signals (web, hiring, product) at mid-market pricing; Harmonic.ai focuses on AI-powered team pattern matching at incorporation, enterprise priced. Specter is the better fit for emerging managers tracking consumer and SaaS plays; Harmonic is for institutional VCs with sourcing teams. Both miss deep-tech and infrastructure plays where engineering acceleration is the right primary signal.",
  },
  {
    slug: "specter-vs-forager-ai",
    a: "specter",
    b: "forager-ai",
    verdict:
      "Both are mid-market growth-signal platforms. Specter leans heavier on web traffic and product launch data; Forager.ai leans heavier on NLP across web, social, and hiring data. Coverage is comparable. Choice usually comes down to interface fit and pricing — both are reasonable picks for emerging managers wanting cross-sector early signals at individual-investor pricing.",
  },
  {
    slug: "specter-vs-crunchbase",
    a: "specter",
    b: "crunchbase",
    verdict:
      "Specter is a leading growth-signal platform (2-6 weeks pre-fundraise); Crunchbase is a lagging funding database. They answer different questions and compose cleanly: Specter for early discovery, Crunchbase for funding history once a name surfaces. Most emerging managers run both alongside a leading engineering-signal tool for technical sectors.",
  },
  {
    slug: "signalrank-vs-pitchbook",
    a: "signalrank",
    b: "pitchbook",
    verdict:
      "SignalRank is a Series-B graduation prediction model packaged as an index-fund product; PitchBook is the institutional reference database for private-markets data. Almost no overlap. SignalRank is useful for late-stage thesis validation and passive index exposure; PitchBook is the operational data layer for any institutional firm. They are not substitutes.",
  },
  {
    slug: "signalrank-vs-harmonic-ai",
    a: "signalrank",
    b: "harmonic-ai",
    verdict:
      "SignalRank predicts Series-B graduation odds for already-Series-A companies; Harmonic.ai sources companies at incorporation. They sit at opposite ends of the funnel. Most institutional firms running both do so for distinct reasons — SignalRank for thesis validation on late-stage opportunities, Harmonic for proactive early-stage discovery.",
  },
  {
    slug: "harmonic-ai-vs-affinity",
    a: "harmonic-ai",
    b: "affinity",
    verdict:
      "Harmonic.ai is a sourcing tool — it brings new companies to your attention; Affinity is a relationship-intelligence CRM — it organises and optimises the network you already have. They are complements, not alternatives. Institutional VCs typically run both: Harmonic to expand the funnel, Affinity to manage and convert it.",
  },
];

export function getCompetitorVsPair(slug: string): CompetitorVs | undefined {
  return competitorVsPairs.find((p) => p.slug === slug);
}

export function getAllCompetitorVsSlugs(): string[] {
  return competitorVsPairs.map((p) => p.slug);
}
