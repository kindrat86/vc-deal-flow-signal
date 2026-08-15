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
  overview: string;
  bestFor: string;
}

export interface CompetitorVs {
  slug: string;
  a: string;
  b: string;
  verdict: string;
  intro: string;
  decision: string;
}

/** How these head-to-head comparisons are evaluated. */
export const METHODOLOGY =
  "These comparisons are written and maintained by an independent analyst, with no affiliation to any of the companies evaluated. Each product is assessed from its published pricing, public product documentation, and the way it describes its own data model and coverage. Signal type and lead time are taken from each vendor's stated positioning, for example whether a tool claims to read live engineering or web signals ahead of a round, or whether it records funding events only after they are announced. No proprietary claims are repeated without a public source, and nothing here constitutes financial or investment advice. Readers should treat pricing as indicative and verify current figures on each vendor's site, since tiers and rates change frequently. The goal is to clarify which tool fits which buyer and workflow, and to show where products overlap, complement one another, or serve entirely different sides of the market.";

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
      "Team signals aren't directly observable, you trust the model",
      "Less useful once a company is past incorporation",
    ],
    overview: "Harmonic.ai is an AI-native sourcing platform that identifies promising startups by pattern matching founding teams and their professional networks. Rather than waiting for a funding round to be announced, it models founders' backgrounds and the density of their connections, drawing on extensive graph data about people, employers, prior collaborations, and alumni networks. Its central thesis is that strong teams cluster together, and that these patterns are already visible at the earliest stage of a company's life, in practice from the moment of incorporation. The product is aimed squarely at institutional venture firms that run dedicated sourcing teams and want to see companies before they appear in any public database. Its coverage is deliberately broad, spanning technical and non-technical sectors alike, which sets it apart from tools that only watch code repositories or engineering activity. The principal trade-off is trust: the signals it surfaces are model outputs rather than directly observable facts, so a buyer must accept Harmonic's underlying methodology on faith. Pricing is enterprise-only and sold on an annual contract, which excludes solo angels, scouts, and smaller funds. Once a company is past incorporation and operating publicly, the platform's distinctive edge also fades, making it a discovery tool for the very earliest window rather than a system of record for later stages.",
    bestFor: "Best for institutional VCs with dedicated sourcing teams that want to identify companies at incorporation across technical and non-technical sectors.",
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
      "Lagging by definition, only captures already-announced rounds",
      "Full access runs to hundreds-plus EUR per month",
      "Better for retrospective analysis than proactive sourcing",
    ],
    overview: "Dealroom is a comprehensive startup and funding database with the deepest European coverage in the industry, built around a richly granular sector taxonomy. Its data model is curated: analysts and ingestion pipelines assemble company profiles, funding histories, and portfolio mappings into hundreds of subsector classifications, which lets investors filter and segment markets with unusual precision. The platform is used widely by European venture firms, corporates, and policy bodies for research, benchmarking, and retrospective analysis, and its coverage extends globally even as its European depth remains the defining feature. Its core strength is structure and breadth, offering reliable, well-organised data on rounds that have already been announced, plus thorough portfolio mapping for understanding how capital has flowed. The corresponding limitation is timeliness. Because Dealroom records events after they are made public, it is by definition a lagging indicator with effectively zero lead time: it cannot tell you which companies are about to raise, only which ones already have. Full access is priced in a tiered structure that runs to hundreds of euros per month at the higher end, placing the richer feature set beyond many individual investors. For proactive sourcing, Dealroom is best treated as a reference and verification layer rather than an early-signal engine, and it composes naturally with leading-indicator tools that surface companies before the round.",
    bestFor: "Best for European-focused investors and analysts who need the deepest startup database with granular subsector classification and funding history.",
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
    overview: "Forager.ai is an NLP-driven sourcing engine that scans web, social, and hiring signals to surface companies that are quietly building momentum. Rather than relying on a curated editorial database, it reads the public internet, detecting hiring sprees, social media activity, and other public growth chatter that tends to precede a fundraise. Its coverage is therefore broad in a distinctive sense: any company with a public web footprint is in scope, including consumer and services businesses that engineering-signal tools would miss entirely. The lead time sits around two to six weeks before a raise, which is meaningful but shorter than approaches that watch code repositories and engineering acceleration. One of its strongest claims is a lower false-positive rate, since the signals it acts on are already publicly visible and validated rather than inferred from a model. It is a natural fit for investors running a wide net across non-technical startups, where web and social activity is the clearest early indicator. It is, conversely, less actionable for purely technical sectors, where code-level momentum is the stronger predictor. Pricing is tiered, with a limited free tier available for evaluation. Companies that have not yet surfaced publicly remain invisible to it, and its shorter lead window means it complements rather than replaces earlier-stage signal tools.",
    bestFor: "Best for wide-net investors sourcing consumer and services startups through publicly visible web, social, and hiring signals.",
  },
  crunchbase: {
    key: "crunchbase",
    name: "Crunchbase",
    url: "https://www.crunchbase.com",
    tagline: "The default startup database, comprehensive but lagging.",
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
      "Lagging indicator, alerts fire after the round is announced",
      "Survivorship bias, you only see rounds that closed",
      "Limited signal quality for pre-seed and seed discovery",
    ],
    overview: "Crunchbase is the default startup database: a comprehensive, globally scoped record of funding announcements, team updates, and company news that most investors already use and trust. Its core value is reliability and context. When a round is announced, Crunchbase records it faithfully, which makes it the best-in-class reference for retrospective research, deal diligence, and building a mental map of who has raised what across every sector. It is priced accessibly at the entry level, with a Pro tier around forty-nine dollars a month and enterprise tiers above that, alongside a limited free tier of alerts and views. Its ubiquity is itself a strength, since the standard tool is the one your colleagues, founders, and counterparties already recognise. The limitation is fundamental rather than cosmetic: it is a lagging indicator. Alerts fire only after a round is announced, so Crunchbase cannot help you discover a company before the market knows about it. It also carries survivorship bias, because you only ever see the rounds that actually closed, and its signal quality for pre-seed and seed discovery is thin. For most investors it is a necessary piece of infrastructure, a verification and research layer rather than a sourcing engine, and it is best paired with a leading-signal product that surfaces companies earlier in their life.",
    bestFor: "Best for investors who need a reliable, affordable record of confirmed funding events for research and retrospective context.",
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
      "Enterprise-only pricing, impossible for solo investors or angels",
      "Lagging by design, curated post-event data, not leading signals",
      "Interface and workflow built for analysts, not operators",
    ],
    overview: "PitchBook is the institutional gold standard for private-markets data, serving LPs, GPs, investment banks, and analysts with deep coverage of fund performance, secondaries, M&A, and the wider private capital landscape. Its data model is curated and post-event, assembled by a large analyst organisation into benchmarks, rankings, and reference datasets that the industry treats as authoritative. The platform is best understood as an analytical and benchmarking layer rather than a sourcing tool: it tells you what has happened across funds and companies, with the depth and reliability that institutions require for underwriting, LP reporting, and thesis work. Its limitations follow directly from that design. It is enterprise-priced at about twenty thousand dollars a year and up, which puts it out of reach for solo investors and angels, and it offers no free tier. It lags by design, recording events after they occur rather than predicting them. Its interface and workflow are built for analysts, not operators, so it sits naturally at the research end of the stack rather than the discovery end. Its buyers are institutions with analysts on staff, and it is the reference layer against which other private-markets data is judged. It is a reference system, not an early-signal engine, and it is almost always deployed alongside sourcing tools rather than as a substitute for them.",
    bestFor: "Best for institutional LPs, GPs, and bankers who need gold-standard fund performance, M&A, and private-markets benchmarks.",
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
    overview: "Tracxn is a global, sector-focused startup research platform best known for its deep sector maps, which now span more than two thousand industries, and for its strong coverage of Asian startup ecosystems. Its data model is analyst-curated: teams build structured taxonomies for each sector, attach company and funding data to them, and produce research reports that layer market context on top of the raw facts. This makes Tracxn a strong tool for sector research, competitive landscaping, and understanding an emerging market before committing capital. Its coverage of Asia is a genuine differentiator in a category that often skews toward Europe and North America. The limitations are structural. Tracxn is still a curated, post-announcement database, so it is a lagging indicator rather than a leading one, and it cannot surface a company before the round is public. Its workflow is heavier than many individual investors need, oriented toward analyst teams doing systematic sector reviews, and data freshness varies with how deeply a given sector is covered. Pricing is tiered, from Pro through to enterprise, with limited free access. It is best treated as a research and mapping layer within a broader sourcing stack rather than a discovery engine in its own right.",
    bestFor: "Best for analyst teams researching sector maps and Asian startup ecosystems across more than two thousand industries.",
  },
  openvc: {
    key: "openvc",
    name: "OpenVC",
    url: "https://www.openvc.app",
    tagline: "Free founder-side investor directory for outbound fundraising.",
    signalType: "Curated investor directory (founder-facing)",
    leadTime: "N/A, directory, not a signal",
    pricing: "Free core, tiered outbound CRM",
    coverage: "Thousands of VCs, angels, and funds globally",
    freeTier: "Yes, most founder workflows free",
    strengths: [
      "Most accessible free investor directory in the category",
      "Strong founder-side workflow tooling (intros, pitch templates)",
      "Indexed by stage, sector, and geography for targeted outreach",
    ],
    weaknesses: [
      "Founder-side product, not a deal-sourcing tool for investors",
      "Static directory, not a leading or live signal",
      "Outbound CRM features are paid above the free core",
    ],
    overview: "OpenVC is a founder-facing investor directory rather than a deal-sourcing tool, and it sits on the opposite side of the fundraising market from most products in this comparison. It offers a free, searchable index of thousands of VCs, angels, and funds across the globe, organised by stage, sector, and geography, so that founders can identify and approach relevant investors for an outbound raise. The core product is free for most founder workflows, with paid tiers reserved for outbound CRM features that sit above the free core. Its strength is accessibility and workflow: it is the most approachable free investor directory in the category, and it bundles useful founder-side tooling such as introduction templates and pitch guidance. For investors, however, it is not a sourcing or signal product at all. The directory is static, not live, and it reveals nothing about which companies are gaining momentum. An investor who wants to find startups should look elsewhere; OpenVC is the tool a startup uses to find the investor. Its positioning is deliberately founder-first, and it makes no claim to be a deal-sourcing engine. Within its lane it is genuinely useful, but it belongs in a different category from leading-signal or database products, and it should not be compared to them on sourcing terms.",
    bestFor: "Best for founders who want a free, searchable directory of investors organised by stage, sector, and geography.",
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
      "Optimises existing network, does not source net-new deals",
      "Insights are only as good as your inbound flow",
      "Limited value for solo angels and emerging managers without an existing network",
    ],
    overview: "Affinity is a relationship-intelligence CRM built for venture capital and private equity firms, and it is best understood as the operational layer of a sourcing stack rather than a discovery tool. It connects to a firm's inbox and calendar and automatically builds a graph of its communications, showing who at the firm knows whom, how warm each relationship is, and where introductions might be brokered. That graph powers pipeline management, warm-intro mapping, and reporting for partner meetings and LP updates, and it has become the industry-standard CRM for firms that run relationship-driven deal flow. The limitation is that it optimises a network you already have. It does not source net-new companies, and its insights are only as good as the inbound flow a firm already receives. For a solo angel or an emerging manager without an established network, the value is thin, and the enterprise per-seat pricing, with no free tier, reinforces that it is built for established teams. Affinity composes cleanly with discovery tools: one product finds the companies, the other helps you reach them through people you already know. There is no free tier, and its value compounds only when a firm already enjoys a healthy volume of inbound opportunities, which makes it an efficiency tool for teams that already have flow.",
    bestFor: "Best for established VC and PE firms that want a relationship-intelligence CRM to manage pipeline and warm introductions.",
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
    overview: "Specter is a growth-signal platform that surfaces companies by tracking momentum across web traffic, hiring, and product activity, a deliberately cross-channel approach that goes beyond the code repository signals used by engineering-focused tools. Its lead time is around two to six weeks before a fundraise, and its coverage spans multiple sectors, with particular strength in consumer and SaaS companies and a focus on English-speaking markets. The product is positioned for emerging fund managers, with tiered mid-market pricing that is more approachable than enterprise platforms while still not aimed at solo angels. Its key advantages are breadth of signal and price accessibility: by combining several growth indicators it reduces reliance on any single channel and catches momentum that a purely technical scanner would miss. Its limitations are equally clear. Coverage of deep-tech and infrastructure startups is shallow, precisely where engineering acceleration is the more decisive signal, and its lead time is shorter than code-level approaches. Access to the full dataset is limited on the free tier. Its position in the market sits squarely between consumer-grade scanners and enterprise intelligence platforms, and that is exactly the buyer it serves. Buyers choosing between Specter and similar tools are usually weighing interface fit and pricing, since the underlying coverage and intent are broadly comparable.",
    bestFor: "Best for emerging fund managers tracking consumer and SaaS companies through web, hiring, and product growth signals.",
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
      "Useless for pre-seed or seed sourcing, different stage",
      "Not a deal-sourcing tool; index-fund product instead",
      "No individual-investor SaaS access",
    ],
    overview: "SignalRank is a predictive model rather than a traditional sourcing database, built to estimate a startup's odds of graduating from Series A to Series B. It packages that prediction as an index-fund product rather than a direct software subscription, which shapes everything about how it is bought and used. The lead time is forward-looking: it scores companies that are already post-Series A, projecting their later-stage trajectory rather than flagging early-stage opportunities. Its published methodology is peer-reviewed, and its signal for Series-B graduation odds is among the strongest in the market, which makes it useful for late-stage thesis validation and for institutions that want systematic, data-driven exposure to the growth-stage segment. The methodology itself is available publicly even though the product is not a conventional SaaS subscription. The limitations are stage-bound. It is of no use for pre-seed or seed sourcing, which is a different problem entirely, and it is not a deal-sourcing tool in the conventional sense. There is no individual-investor SaaS access, so a solo angel cannot adopt it as a workflow. Its output is a score, not a list of companies to contact. It belongs in a specific lane: institutional, growth-stage, and passive-index oriented, where it is genuinely differentiated but narrow.",
    bestFor: "Best for late-stage investors validating Series-B graduation odds and seeking systematic data-driven growth-stage index exposure.",
  },
  "fund-momentum": {
    key: "fund-momentum",
    name: "Fund Momentum",
    url: "https://github.com/schneidavie/fundmomentum",
    tagline: "MCP server for investor-side VC fund signals, match startups to active funds.",
    signalType: "Fund/investor-side signals (GP activity, deployment status, thesis)",
    leadTime: "Current fund data (no fundraise-prediction lead time)",
    pricing: "Free API manifest; Starter $49/mo, Pro $299/mo, Agent $0.01/call, Enterprise custom",
    coverage: "960+ active VC funds (raised since Sept 2024)",
    freeTier: "API manifest only",
    strengths: [
      "Deep investor-side data, 960+ active funds, GP signals, partner theses",
      "Native MCP server, queryable directly from Claude or Cursor",
      "Usage-based Agent tier ($0.01/call) fits automated agent workflows",
    ],
    weaknesses: [
      "Fund-side only, surfaces which funds are active, not which companies are about to raise",
      "No fundraise-prediction lead time; it reflects current fund data",
      "Proprietary API (not open-source); no company-level engineering signal",
    ],
    overview: "Fund Momentum is an MCP server that exposes investor-side VC fund signals, profiling more than nine hundred and sixty active venture funds that have raised since September 2024. Instead of predicting which companies will raise, it maps which funds are actively deploying capital, what their GP signals and partner theses are, and where capital is moving right now. Because it is delivered natively as an MCP server, it can be queried directly from AI assistants such as Claude or Cursor, which makes it well suited to automated agent workflows and programmatic use. Pricing is layered: a free API manifest, a Starter tier at forty-nine dollars a month, a Pro tier at two hundred and ninety-nine dollars a month, and a usage-based Agent tier priced per call, with enterprise pricing on request. The key limitation is scope. It is fund-side only, so it surfaces which investors are active for a given thesis rather than which companies are about to raise, and it offers no fundraise-prediction lead time. Its API is proprietary rather than open-source, and it carries no company-level engineering signal. It answers a different question from company-side tools, and it is best understood as a complement to them rather than a replacement.",
    bestFor: "Best for automated agent workflows that need current VC fund and GP activity data queryable directly from an MCP server.",
  },
  "cb-insights": {
    key: "cb-insights",
    name: "CB Insights",
    url: "https://www.cbinsights.com",
    tagline: "Market intelligence platform with Mosaic scoring and industry analytics.",
    signalType: "Mosaic Score, industry analytics, market sizing",
    leadTime: "Mixed (leading + laging)",
    pricing: "Enterprise ($35k+/yr)",
    coverage: "Full private market across all sectors",
    freeTier: "No free tier",
    strengths: [
      "Mosaic Score predicts company health and growth trajectory",
      "Deep industry analytics and market-sizing reports",
      "Strong for strategic research and identifying market trends",
      "Tracks emerging tech categories with curated research briefs",
    ],
    weaknesses: [
      "Enterprise pricing ($35k+/yr) excludes solo angels and small funds",
      "Mosaic Score is proprietary and opaque (you trust the model)",
      "Broad market intelligence, not deal-flow-specific sourcing",
      "No engineering-momentum or code-level signals",
    ],
    overview: "CB Insights is a market-intelligence platform whose centrepiece is the Mosaic Score, a proprietary model that estimates a private company's health and growth trajectory by combining multiple data inputs. Around that score it layers deep industry analytics, market-sizing reports, and curated research briefs on emerging technology categories, which makes it a strong tool for strategic research, trend identification, and understanding where a whole sector is heading. Its coverage spans the full private market across all sectors. The trade-offs are significant for a sourcing-focused buyer. Pricing is enterprise-only at about thirty-five thousand dollars a year and up, which excludes solo angels and smaller funds, and there is no free tier. The Mosaic Score itself is opaque, so users must trust the model without being able to inspect its logic. The product is broad market intelligence rather than deal-flow-specific sourcing, with no engineering-momentum or code-level signals. Its lead time is mixed, combining some leading indicators with substantial lagging data drawn from post-event records. Its research briefs on emerging categories are genuinely useful for thematic investing and for boards preparing market context. For an institution doing research and market mapping it is powerful; for early-stage discovery it is a supporting layer rather than a primary engine.",
    bestFor: "Best for institutions doing strategic research and market mapping with Mosaic scoring and deep industry analytics.",
  },
};

/**
 * All pairwise competitor-vs-competitor pages we want to generate.
 * Each entry produces /vs/{a}-vs-{b} with a dedicated template.
 */
export const competitorVsPairs: CompetitorVs[] = [
  {
    slug: "fund-momentum-vs-harmonic-ai",
    a: "fund-momentum",
    b: "harmonic-ai",
    verdict:
      "Both are AI-accessible sourcing tools that read opposite sides of the market: Fund Momentum profiles the 960+ active VC funds (who is deploying, into what thesis), while Harmonic.ai pattern-matches founding teams at incorporation. Neither measures what a company is actually building right now, for engineering-acceleration lead time before a round, pair either with a code-side signal like VC Deal Flow Signal.",
    intro: "Fund Momentum and Harmonic.ai are both AI-accessible sourcing tools, but they read opposite sides of the venture market. Fund Momentum profiles the 960-plus active VC funds, mapping which GPs are deploying capital and into what thesis. Harmonic.ai pattern-matches founding teams at the moment of incorporation, across all sectors. This page compares their signal type, lead time, pricing, and coverage, and explains where each tool is genuinely useful in a sourcing workflow.",
    decision: "Pick Fund Momentum when you are an investor or agent workflow that needs to know which funds are actively deploying capital right now, for example to route a startup to warm introductions or to identify who is hunting in your sector. Its MCP-native interface and the $0.01-per-call Agent tier suit automated agent pipelines. Pick Harmonic.ai when you are an institutional VC with an annual enterprise budget and a dedicated sourcing team that wants to catch companies at incorporation, before they surface anywhere else. Consider using both when you want the two halves of a sourcing loop: Harmonic.ai surfaces early companies, and Fund Momentum tells you which funds are likely to back them. Note that neither tool measures what a company is actually building, so neither gives you engineering-acceleration lead time ahead of a round.",
  },
  {
    slug: "fund-momentum-vs-forager-ai",
    a: "fund-momentum",
    b: "forager-ai",
    verdict:
      "Fund Momentum indexes the investor side (fund activity, GP theses); Forager.ai indexes the company side via web, social, and hiring NLP signals. Fund Momentum answers 'which funds are active for this thesis'; Forager answers 'which companies are showing growth chatter'. Both are current-state reads, for a leading engineering signal ahead of the round, add VC Deal Flow Signal.",
    intro: "Fund Momentum and Forager.ai index opposite sides of the deal-flow equation. Fund Momentum tracks the investor side, surfacing GP activity, deployment status, and thesis across more than 960 active funds. Forager.ai tracks the company side, reading web, social, and hiring signals through NLP. This page compares their signal type, lead time, pricing, and coverage so you can decide which side of the market you need to watch first.",
    decision: "Pick Fund Momentum when your question is about investors, specifically which funds are active for a given thesis and where capital is moving now. Its free API manifest and MCP interface make it easy to query from an agent or spreadsheet, and the Starter tier begins at $49 per month. Pick Forager.ai when your question is about companies, specifically which startups are showing growth chatter two to six weeks before a fundraise, across any sector with a public web footprint. Consider using both when you want a complete picture: Forager.ai surfaces candidate companies on the way up, and Fund Momentum identifies which funds might back them. Remember that both are current-state reads, so neither predicts the actual fundraise, and neither provides engineering-level lead time.",
  },
  {
    slug: "fund-momentum-vs-crunchbase",
    a: "fund-momentum",
    b: "crunchbase",
    verdict:
      "Crunchbase is a broad post-announcement company database; Fund Momentum is a narrow, MCP-native index of active VC funds and their deployment signals. Crunchbase tells you what already happened; Fund Momentum tells you which investors are moving now. Neither predicts a company's fundraise, that gap is exactly what engineering-momentum signals fill.",
    intro: "Fund Momentum and Crunchbase are both data tools, but they describe different things. Crunchbase is a broad company database that records funding rounds, team changes, and news after they are announced. Fund Momentum is a narrow, MCP-native index of active VC funds and their deployment signals. This page compares their signal type, lead time, pricing, and coverage to clarify which tool answers which question in a sourcing workflow.",
    decision: "Pick Fund Momentum when you want to know which investors are moving now, for example which funds have raised since September 2024 and are deploying into your sector, or which GP theses are active. Its $49 Starter tier and the $0.01-per-call Agent tier suit solo investors and automated agents. Pick Crunchbase when you want a broad, reliable record of companies and their funding history, with $49 per month Pro pricing and a familiar interface that most VCs already use. Consider using both when you need the investor side and the company side of the same market: Crunchbase for who raised and when, Fund Momentum for who is actively deploying now. Neither tool predicts a company's future fundraise, so neither offers leading engineering-momentum lead time.",
  },
  {
    slug: "harmonic-ai-vs-dealroom",
    a: "harmonic-ai",
    b: "dealroom",
    verdict:
      "Harmonic.ai catches startups at incorporation with AI-powered team pattern matching; Dealroom catches them after the round is announced with the industry's deepest European database. They solve different problems, sourcing vs research. Institutional VCs with enterprise budgets often run both: Harmonic for proactive discovery, Dealroom for retrospective context. Individual angels typically can't afford either and should look at a leading-signal tool like VC Deal Flow Signal instead.",
    intro: "Harmonic.ai and Dealroom represent two different moments in a startup's life. Harmonic.ai catches companies at incorporation, using AI-powered team and network pattern matching across all sectors. Dealroom catches them after the round is announced, through the industry's deepest European database. This page compares their signal type, lead time, pricing, and coverage, and explains which one fits a sourcing versus a research workflow.",
    decision: "Pick Harmonic.ai when you are an institutional VC with an annual enterprise budget and a sourcing team that wants proactive discovery, flagging promising founding teams at incorporation before they raise. Pick Dealroom when you need retrospective research, portfolio mapping, and funding history, with the strongest European coverage in the industry and hundreds of subsector classifications for granular filtering. Consider using both when you can afford it: Harmonic.ai for proactive early discovery, Dealroom for the retrospective context that a sourcing memo needs. Individual angels and emerging managers typically cannot afford either, given Harmonic's enterprise-only pricing and Dealroom's hundred-plus euro monthly tiers, so they are usually better served by a leading-signal tool with accessible pricing.",
  },
  {
    slug: "harmonic-ai-vs-forager-ai",
    a: "harmonic-ai",
    b: "forager-ai",
    verdict:
      "Harmonic.ai is broader and earlier (at incorporation) but enterprise-priced; Forager.ai is mid-lead-time (2-6 weeks pre-fundraise) and accessible to individual investors. Both cover non-technical sectors, which is their overlap. Pick Harmonic if you're an institutional VC with a dedicated sourcing team; pick Forager if you want cross-sector web signals at individual-investor pricing.",
    intro: "Harmonic.ai and Forager.ai are both early-stage sourcing tools that cover non-technical sectors, which is where they overlap. Harmonic.ai is the earlier of the two, pattern-matching founding teams at incorporation. Forager.ai reads web, social, and hiring signals two to six weeks before a fundraise. This page compares their signal type, lead time, pricing, and coverage to help you choose between an enterprise platform and an accessible signal engine.",
    decision: "Pick Harmonic.ai when you are an institutional VC with a dedicated sourcing team and an annual enterprise budget, and you want the earliest possible signal, at incorporation, powered by founder-background and network graph data. Pick Forager.ai when you are an individual investor or emerging manager who wants cross-sector web and social signals at accessible tiered pricing, accepting a slightly shorter lead time of two to six weeks. Consider using both when budget allows, since Harmonic surfaces companies before they are public and Forager validates them once they begin to show public growth chatter. Note that Harmonic's team signals are model-inferred rather than directly observable, while Forager's lower false-positive rate comes from the fact that its signals are already publicly validated.",
  },
  {
    slug: "harmonic-ai-vs-crunchbase",
    a: "harmonic-ai",
    b: "crunchbase",
    verdict:
      "Harmonic.ai is a leading signal at incorporation; Crunchbase is a lagging database that records rounds after they close. They compose well: Harmonic surfaces candidates, Crunchbase provides context once a name comes up. For individual investors who can't afford Harmonic's enterprise pricing, Crunchbase plus a leading-signal tool like VC Deal Flow Signal is a common budget-friendly combo.",
    intro: "Harmonic.ai and Crunchbase sit at opposite ends of the deal-flow timeline. Harmonic.ai is a leading signal, surfacing founding teams at incorporation before any funding is public. Crunchbase is a lagging database that records rounds, team changes, and news after they are announced. This page compares their signal type, lead time, pricing, and coverage, and shows how the two can be combined in a sourcing stack.",
    decision: "Pick Harmonic.ai when you want proactive early discovery and have an enterprise budget: it surfaces promising founding teams at incorporation, before they appear in any database. Pick Crunchbase when you need reliable, confirmed funding data and broad retrospective context at a $49 per month Pro price point, which is the standard research tool most VCs already trust. Consider using both when you want a leading-plus-lagging combination: Harmonic.ai surfaces candidate companies, and Crunchbase fills in the funding history and team context once a name comes up. Individual investors who cannot afford Harmonic's enterprise pricing often pair Crunchbase with a leading-signal tool that has accessible pricing, which delivers a similar early-plus-context workflow at a fraction of the cost.",
  },
  {
    slug: "harmonic-ai-vs-pitchbook",
    a: "harmonic-ai",
    b: "pitchbook",
    verdict:
      "Both are institutional-grade and enterprise-priced. Harmonic.ai focuses on early-stage sourcing with AI team pattern matching; PitchBook is the industry-standard reference database for fund performance, M&A, and LP-GP data. Most institutional firms use PitchBook for benchmarking and fund-of-funds work, and layer Harmonic on top specifically for proactive early-stage deal sourcing.",
    intro: "Harmonic.ai and PitchBook are both institutional-grade, enterprise-priced platforms, but they serve different purposes. Harmonic.ai is an early-stage sourcing tool built on AI team and network pattern matching. PitchBook is the industry-standard reference database for fund performance, M&A, and LP-GP data. This page compares their signal type, lead time, pricing, and coverage to clarify which role each plays in an institutional stack.",
    decision: "Pick Harmonic.ai when you need proactive early-stage sourcing, flagging founding teams at incorporation with AI pattern matching, and you have an institutional budget for an annual enterprise contract. Pick PitchBook when you need the gold-standard reference dataset for fund performance, secondaries, M&A, and LP-GP work, accepting its $20k-plus annual pricing and analyst-oriented workflow. Consider using both when you are an institutional firm that needs two distinct layers: PitchBook as the benchmarking and fund-of-funds reference, Harmonic.ai layered on top specifically for proactive early-stage deal sourcing. Neither tool is a fit for solo investors or angels, since both are enterprise-only in pricing, and neither provides leading engineering-momentum signals, so technical-sector investors should consider pairing them with a code-side signal source.",
  },
  {
    slug: "harmonic-ai-vs-tracxn",
    a: "harmonic-ai",
    b: "tracxn",
    verdict:
      "Harmonic.ai is a leading-signal AI platform (team-network pattern matching at incorporation); Tracxn is a sector-mapped curated database with strong Asian coverage. Harmonic is for institutional firms running proactive sourcing; Tracxn is for analyst-driven sector research across 2,000+ industries. They're rarely direct alternatives for the same workflow.",
    intro: "Harmonic.ai and Tracxn are rarely direct alternatives for the same workflow, but they both sit in the investor tooling category. Harmonic.ai is a leading-signal AI platform that pattern-matches founding teams at incorporation. Tracxn is a sector-mapped curated database with deep analyst coverage across more than 2,000 industries. This page compares their signal type, lead time, pricing, and coverage to show where each fits.",
    decision: "Pick Harmonic.ai when you are an institutional firm running proactive sourcing and you want the earliest possible signal, at incorporation, across all sectors including non-technical ones. Pick Tracxn when you need analyst-driven sector research, market context, and strong Asian startup coverage, with tiered pricing that is lighter than a full enterprise contract. Consider using both when you want proactive discovery plus deep sector research: Harmonic.ai surfaces early teams, and Tracxn provides the sector maps and market context to evaluate them. They are not substitutes, since Harmonic is a leading signal and Tracxn is a lagging database, so neither overlaps much with the other's core user. Both leave a gap for investors who want engineering-acceleration lead time on technical startups, which neither tool measures directly.",
  },
  {
    slug: "dealroom-vs-forager-ai",
    a: "dealroom",
    b: "forager-ai",
    verdict:
      "Dealroom is a curated European database, comprehensive, lagging, deep. Forager.ai is an NLP-driven web signal engine, broader, leading by 2-6 weeks, cross-sector. Pick Dealroom for European research, portfolio mapping, and retrospective analysis. Pick Forager for proactive sourcing across all sectors at individual-investor pricing. Many VCs use both: Dealroom as the reference layer, Forager as the early-signal layer.",
    intro: "Dealroom and Forager.ai answer different versions of the same question: which startups should I look at? Dealroom answers it retrospectively, with a curated European database of announced rounds. Forager.ai answers it prospectively, with NLP-driven web, social, and hiring signals that lead a fundraise by two to six weeks. This page compares their signal type, lead time, pricing, and coverage, side by side.",
    decision: "Pick Dealroom when you need European research, portfolio mapping, and retrospective funding analysis, and you can justify its tiered Pro to Enterprise pricing. Its depth of European coverage and hundreds of subsector classifications make it the reference layer for European-focused funds and analysts. Pick Forager.ai when you want proactive, cross-sector sourcing at individual-investor pricing, reading web and social signals two to six weeks before a fundraise. Consider using both when you want a layered stack: Dealroom as the reference and research layer, Forager.ai as the early-signal layer that surfaces companies before they appear in any database. This combination is common among European funds that want both deep context and early lead time. Neither tool offers engineering-acceleration signals for technical sectors, which is a gap to fill separately.",
  },
  {
    slug: "dealroom-vs-crunchbase",
    a: "dealroom",
    b: "crunchbase",
    verdict:
      "Both are curated post-event databases. Dealroom is deeper on European startups and offers hundreds of subsector classifications; Crunchbase is the industry default with broader US coverage and lower entry-level pricing. Neither is a leading indicator. Dealroom is stronger for European-focused funds and analysts; Crunchbase is the safer default for a generalist sourcing stack.",
    intro: "Dealroom and Crunchbase are both curated post-event databases, but they lead with different strengths. Dealroom is deeper on European startups and offers hundreds of subsector classifications. Crunchbase is the industry default with broader US coverage and a lower entry price of $49 per month. This page compares their signal type, lead time, pricing, and coverage to help you pick the right default for your sourcing stack.",
    decision: "Pick Dealroom when you are a European-focused fund or analyst who needs the deepest European startup coverage in the industry and granular subsector filtering, and you can justify tiered pricing that runs to hundreds of euros per month at the top end. Pick Crunchbase when you want the safer generalist default: broader US and global coverage, the highest reliability for confirmed funding events, and an accessible $49 per month Pro entry point. Consider using both when you operate on both sides of the Atlantic and want European depth plus US breadth in one stack, although the overlap is substantial and most teams standardise on one as their primary database. Remember that neither is a leading indicator, since both record rounds only after they are announced, so neither helps you catch a company before it raises.",
  },
  {
    slug: "dealroom-vs-pitchbook",
    a: "dealroom",
    b: "pitchbook",
    verdict:
      "Both are institutional curated databases. PitchBook is the gold standard for LP-GP, fund performance, and M&A data globally. Dealroom offers deeper sector taxonomy and stronger European coverage at a lower price point. Most institutional firms use PitchBook as the benchmarking reference; Dealroom is common for European-focused VCs and analysts who need granular sector maps.",
    intro: "Dealroom and PitchBook are both institutional curated databases, but they specialise in different regions and data. PitchBook is the gold standard for LP-GP relationships, fund performance, and M&A data globally. Dealroom offers deeper sector taxonomy and stronger European coverage at a lower price point. This page compares their signal type, lead time, pricing, and coverage to show where each earns its place.",
    decision: "Pick PitchBook when you are an LP, GP, or banker who needs the industry-standard reference for fund performance, secondaries, M&A, and benchmarking, and your firm can absorb its $20k-plus annual enterprise pricing. Pick Dealroom when you are a European-focused VC or analyst who needs granular sector maps and the deepest European coverage, typically at a lower price point than PitchBook. Consider using both when you are a global institutional firm that needs PitchBook as the benchmarking reference and Dealroom for European portfolio and sector work, though this doubles your data budget and is rarely justified below a certain firm size. Neither tool is a leading signal, since both are curated post-announcement data, so neither helps with proactive sourcing of companies that have not yet raised.",
  },
  {
    slug: "dealroom-vs-tracxn",
    a: "dealroom",
    b: "tracxn",
    verdict:
      "Dealroom is the European-depth leader; Tracxn is the sector-map leader with stronger Asian coverage. Both are curated databases, both are lagging by definition. Pick Dealroom for European portfolio work; pick Tracxn for Asian sourcing or cross-sector industry research. They rarely replace each other, but occasionally they compose as regional-bias complements.",
    intro: "Dealroom and Tracxn are both curated databases that lag the market by design, but they lead in different regions. Dealroom is the European-depth leader, with the deepest startup coverage on the continent. Tracxn is the sector-map leader, with analyst-curated coverage across more than 2,000 industries and strong Asian ecosystems. This page compares their signal type, lead time, pricing, and coverage.",
    decision: "Pick Dealroom when you need European portfolio work, deep funding history, and granular subsector classification, and you can justify its tiered Pro to Enterprise pricing. Pick Tracxn when your priority is Asian startup coverage or cross-sector industry research, where its 2,000-plus sector maps and analyst-curated reports add context that a raw database does not. Consider using both when you invest across Europe and Asia and want the regional-depth leader for each market, since they rarely replace each other and act more as regional complements than competitors. Both are lagging databases, so neither provides leading signals, and both are heavier-weight tools than an individual investor typically needs. For proactive sourcing ahead of a round, either would need to be paired with a leading-signal source.",
  },
  {
    slug: "forager-ai-vs-crunchbase",
    a: "forager-ai",
    b: "crunchbase",
    verdict:
      "Forager.ai is a leading web-signal engine (2-6 weeks pre-fundraise); Crunchbase is a lagging funding database. They answer different questions: Forager tells you what's bubbling up publicly; Crunchbase tells you what has already closed. They compose cleanly: Forager for early discovery, Crunchbase for funding history once a name surfaces.",
    intro: "Forager.ai and Crunchbase answer different questions in the sourcing workflow. Forager.ai is a leading web-signal engine that reads web, social, and hiring data two to six weeks before a fundraise. Crunchbase is a lagging database that records funding rounds after they are announced. This page compares their signal type, lead time, pricing, and coverage, and shows how the two tools compose.",
    decision: "Pick Forager.ai when you want early discovery, surfacing companies through web and social signals before they announce a round, with tiered pricing accessible to individual investors. Its lower false-positive rate comes from the fact that its signals are already publicly validated. Pick Crunchbase when you need confirmed funding history and reliable retrospective context, at a $49 per month Pro entry point that most VCs already know. Consider using both when you want a clean leading-plus-lagging pipeline: Forager.ai for early discovery across any company with a public web footprint, and Crunchbase to verify funding and team context once a name surfaces. This is a common budget-friendly combination for individual investors. Note that neither tool offers engineering-acceleration signals, which technical-sector investors may want to add separately.",
  },
  {
    slug: "forager-ai-vs-pitchbook",
    a: "forager-ai",
    b: "pitchbook",
    verdict:
      "Forager.ai is an accessible, leading web-signal engine for individual investors; PitchBook is an enterprise-priced institutional database. They target different buyer personas entirely. Forager is the right pick for angels and scouts wanting early web signals; PitchBook is for institutional LPs, GPs, and bankers who need fund-performance benchmarks and M&A data.",
    intro: "Forager.ai and PitchBook target entirely different buyer personas, despite both sitting in the VC tooling category. Forager.ai is an accessible, leading web-signal engine for individual investors and emerging managers. PitchBook is an enterprise-priced institutional database for LPs, GPs, and bankers. This page compares their signal type, lead time, pricing, and coverage to clarify which one matches your seat at the table.",
    decision: "Pick Forager.ai when you are an angel, scout, or emerging manager who wants early web, social, and hiring signals two to six weeks before a fundraise, at tiered pricing you can afford without an institutional budget. Its cross-sector coverage, including consumer and services companies, fits a wide-net sourcing approach. Pick PitchBook when you are an LP, GP, or banker who needs fund-performance benchmarks, M&A data, and secondaries coverage, and your firm can justify $20k-plus annual pricing. Consider using both only if you sit in both worlds, for example a fund-of-funds analyst who also runs a personal angel programme, since the two tools share almost no overlapping use case. Neither offers leading engineering signals, so technical-sector investors should add a code-side source regardless of which they choose.",
  },
  {
    slug: "forager-ai-vs-tracxn",
    a: "forager-ai",
    b: "tracxn",
    verdict:
      "Forager.ai is an NLP web-signal engine with 2-6 week lead time; Tracxn is a curated sector-mapped database, lagging by definition. Forager wins for proactive sourcing across sectors; Tracxn wins for deep sector research, especially in Asia. Non-overlapping use cases that both sit in the 'affordable enough for individual investors' tier of Tracxn's pricing.",
    intro: "Forager.ai and Tracxn both fall within reach of an individual investor's budget, but they are built for different jobs. Forager.ai is an NLP web-signal engine with a two to six week lead time. Tracxn is a curated, sector-mapped database that lags the market by definition. This page compares their signal type, lead time, pricing, and coverage to show where each outperforms the other.",
    decision: "Pick Forager.ai when you want proactive sourcing, reading web, social, and hiring signals across any company with a public web footprint, with a two to six week lead time before a fundraise. Pick Tracxn when you need deep sector research, market context, and analyst-curated reports, especially across Asian startup ecosystems. Consider using both when you want early discovery plus deep sector context: Forager.ai surfaces companies that are growing, and Tracxn provides the sector map and market background to evaluate them. The two use cases are largely non-overlapping, which is why both can sit in the same stack without redundancy. Note that Tracxn is still a lagging database rather than a leading signal, and neither tool provides engineering-acceleration signals for technical sectors, a gap that technical investors should fill separately.",
  },
  {
    slug: "crunchbase-vs-pitchbook",
    a: "crunchbase",
    b: "pitchbook",
    verdict:
      "Crunchbase is the accessible default ($49/mo Pro); PitchBook is the enterprise gold standard ($20k+/yr). Both are lagging databases. Individual investors and startups use Crunchbase; institutional LPs, bankers, and analysts use PitchBook. They cover similar ground but with different depth, price, and buyer personas.",
    intro: "Crunchbase and PitchBook are the two most recognisable names in startup data, and they cover similar ground at very different price points. Crunchbase is the accessible default, with a $49 per month Pro tier. PitchBook is the enterprise gold standard at $20k-plus per year. This page compares their signal type, lead time, pricing, and coverage to help you choose between accessibility and institutional depth.",
    decision: "Pick Crunchbase when you are an individual investor, operator, or startup that needs reliable funding data, team updates, and news at an accessible $49 per month Pro price, with the familiar interface most VCs already know. Pick PitchBook when you are an LP, banker, or analyst who needs fund-performance benchmarks, M&A data, and LP-GP relationships, and your firm can absorb $20k-plus annual enterprise pricing. Consider using both only when you need both ends of the spectrum, for example a startup team using Crunchbase for market research while its investors rely on PitchBook for benchmarking. Both are lagging databases that record events after they happen, so neither provides leading signals, and investors who want to catch companies before they raise should pair whichever they choose with a leading-signal tool.",
  },
  {
    slug: "crunchbase-vs-tracxn",
    a: "crunchbase",
    b: "tracxn",
    verdict:
      "Crunchbase has broader US and global coverage with the industry-default brand; Tracxn offers deeper sector mapping across 2,000+ industries and stronger Asian coverage. Both are lagging databases at broadly similar price points. Pick Crunchbase for a default sourcing stack; pick Tracxn if sector depth or Asian coverage is the priority.",
    intro: "Crunchbase and Tracxn are both lagging databases at broadly similar price points, but they lead with different strengths. Crunchbase offers broader US and global coverage with the industry-default brand. Tracxn offers deeper sector mapping across more than 2,000 industries and stronger Asian coverage. This page compares their signal type, lead time, pricing, and coverage to help you choose the right default.",
    decision: "Pick Crunchbase when you want the safest generalist default: broad US and global coverage, the highest reliability for confirmed funding events, and a $49 per month Pro entry point that most VCs already trust. Pick Tracxn when sector depth or Asian coverage is the priority, since its 2,000-plus sector maps and analyst-curated reports add market context that a raw database does not provide. Consider using both when you invest in Asian ecosystems and also want the broad global default, but note that the overlap in core funding data is significant, so most teams standardise on one. Both are lagging indicators that record rounds after they close, so neither helps you catch a company before it announces, and investors who want early lead time should add a leading-signal source to whichever database they choose.",
  },
  {
    slug: "pitchbook-vs-tracxn",
    a: "pitchbook",
    b: "tracxn",
    verdict:
      "PitchBook is the LP-GP and fund-performance gold standard globally; Tracxn is the sector-map specialist with strong Asian coverage. Different use cases, different buyers. Most institutional firms that can afford PitchBook use it as the reference; Tracxn serves analyst teams who need 2,000+ sector maps and Asian startup depth.",
    intro: "PitchBook and Tracxn are both analyst-grade research tools, but they serve different buyers and different regions. PitchBook is the LP-GP and fund-performance gold standard globally, with $20k-plus annual pricing. Tracxn is the sector-map specialist with strong Asian coverage and tiered pricing. This page compares their signal type, lead time, pricing, and coverage to show which research workflow each one supports.",
    decision: "Pick PitchBook when you are an institutional LP, GP, or banker who needs the industry-standard reference for fund performance, secondaries, M&A, and benchmarks, and your firm can justify $20k-plus annual pricing. Pick Tracxn when you are an analyst team researching sectors or markets, especially in Asia, and you value its 2,000-plus sector maps and curated reports over raw fund-performance data. Consider using both only in large institutions that need PitchBook as the benchmark reference and Tracxn for analyst-led sector mapping, since the two serve different use cases and rarely replace each other. Neither is a leading signal, as both are curated post-announcement databases, so neither helps you source companies before they raise. For proactive early discovery, either would need to be paired with a leading-signal source.",
  },
  {
    slug: "openvc-vs-harmonic-ai",
    a: "openvc",
    b: "harmonic-ai",
    verdict:
      "OpenVC and Harmonic.ai sit on opposite sides of the fundraising market. OpenVC is a free founder-side investor directory used to find VCs to pitch; Harmonic.ai is an enterprise investor-side AI platform used to find startups to back. Almost no overlap in users, founders pick OpenVC, institutional VCs pick Harmonic. They're not competing products despite both being in the VC tools category.",
    intro: "OpenVC and Harmonic.ai sit on opposite sides of the fundraising market, despite both being grouped under VC tools. OpenVC is a free founder-side directory that helps founders find investors to pitch. Harmonic.ai is an enterprise investor-side platform that helps investors find startups to back. This page compares their signal type, lead time, pricing, and coverage, and explains why they rarely compete for the same user.",
    decision: "Pick OpenVC when you are a founder raising a round and you want a free way to map the investor universe, indexed by stage, sector, and geography, with founder-side workflow tooling for intros and pitch templates. Pick Harmonic.ai when you are an institutional VC with an enterprise budget and a sourcing team that wants AI-powered team pattern matching to surface companies at incorporation. Consider using both only if you wear both hats, for example a founder who also angel-invests, since the two products share almost no overlap in users or workflows. They are not competing products: OpenVC is a static directory with no live signal, while Harmonic is a leading-signal platform, and they price at opposite ends of the spectrum. Neither is a company-side engineering signal, so investors wanting technical lead time should look elsewhere regardless.",
  },
  {
    slug: "openvc-vs-dealroom",
    a: "openvc",
    b: "dealroom",
    verdict:
      "OpenVC is founder-side (a free directory of investors); Dealroom is investor-side (a curated startup and funding database). Different products for different users. Founders raising rounds use OpenVC to map the investor universe; investors sourcing deals use Dealroom for startup-side data. Not direct alternatives despite both being free-tier-friendly tools in the broader VC market.",
    intro: "OpenVC and Dealroom both sit inside the venture capital tools category, yet they serve people on opposite sides of a fundraising process. OpenVC is a founder-facing directory that helps startups find the right investors to pitch. Dealroom is an investor-facing database that helps funds research startups and funding activity, with particular depth across Europe. This comparison explains what each tool actually does, who it is built for, and where the two overlap in practice.",
    decision: "Pick OpenVC when you are a founder raising a round and need to map the investor universe, build a target list, and run outbound outreach. Its free core covers most founder workflows, and the directory is indexed by stage, sector, and geography, which makes narrowing the list straightforward. Pick Dealroom when you are an investor or analyst who needs startup-side data: funding history, portfolio mapping, and granular European sector classifications. Its curated database is the stronger research layer, but full access runs to several hundred euros per month and reflects rounds that are already public. Consider using both when the two sides of a deal meet: a fundraising founder and an investing firm are usually just using complementary tools rather than competing ones. Neither is a substitute for the other, because they are not really alternatives.",
  },
  {
    slug: "openvc-vs-crunchbase",
    a: "openvc",
    b: "crunchbase",
    verdict:
      "OpenVC is a free founder-side directory of investors; Crunchbase is the default investor-side startup database. They mirror opposite sides of the same market and almost never compete for the same user. Founders raising use OpenVC; investors and analysts use Crunchbase. Most fundraising-active companies and active investors end up using both, OpenVC for outbound mapping, Crunchbase for funding and team verification.",
    intro: "OpenVC and Crunchbase are two of the most commonly confused tools in the startup ecosystem, largely because both are widely used during fundraising. In practice they face in opposite directions. OpenVC is a free, founder-side directory that helps startups find investors to pitch. Crunchbase is the default investor-side database for researching companies, funding rounds, and teams. This page breaks down the difference, who each tool is for, and how the two are typically used together rather than instead of one another.",
    decision: "Pick OpenVC when you are a founder running outbound fundraising and need to identify and contact investors. The free tier covers most of that workflow, and the directory is indexed by stage, sector, and geography. Pick Crunchbase when you need to verify a company, research its funding history, or monitor the market as an investor, analyst, or scout. Its Pro tier costs forty nine dollars a month and is the industry default for confirmed funding events. Consider using both when you are active in a raise on either side of the table: founders often use OpenVC to build an outbound target list while simultaneously using Crunchbase to verify the investors and competitors they are mapping. The two tools mirror opposite sides of the same market, so they rarely compete for the same job.",
  },
  {
    slug: "openvc-vs-pitchbook",
    a: "openvc",
    b: "pitchbook",
    verdict:
      "OpenVC is free and founder-facing; PitchBook is enterprise-priced and institution-facing. They serve completely different users at completely different price points and use cases. OpenVC helps a founder identify VCs to pitch; PitchBook gives an LP or banker a comprehensive private-markets reference dataset. Not alternatives, different products in different categories.",
    intro: "On the surface OpenVC and PitchBook both belong to the private-markets software category, but they could hardly sit further apart. OpenVC is a free, founder-facing directory that helps startups find and pitch investors. PitchBook is an enterprise-priced, institution-facing data platform used by LPs, GPs, and bankers for fund performance, M&A, and valuation reference. This comparison clarifies who each product is built for and why the two almost never appear in the same buying decision.",
    decision: "Pick OpenVC when you are a founder raising capital and need to map and contact investors without paying for access. Most of its founder workflow is free, with paid outbound CRM features layered on top. Pick PitchBook when you work at an institutional firm and need the industry-standard reference dataset for private markets, including fund performance, secondaries, and LP and GP data. That depth comes at an enterprise price of around twenty thousand dollars a year and no free tier. Consider using both only in the sense that a large firm may have an analyst on PitchBook while a portfolio company founder independently uses OpenVC for outbound. They are not substitutes: one serves founders cheaply, the other serves institutions at institutional prices.",
  },
  {
    slug: "openvc-vs-forager-ai",
    a: "openvc",
    b: "forager-ai",
    verdict:
      "OpenVC is a free founder-side investor directory; Forager.ai is an investor-side NLP web-signal sourcing engine. They sit on opposite sides of the fundraising market with no overlap in users. Founders use OpenVC to map outbound targets; investors use Forager.ai to surface emerging startups via web/social signals. Not competing products.",
    intro: "OpenVC and Forager.ai are occasionally grouped together as venture capital tools, but they address different questions for different people. OpenVC is a free, founder-side directory used to map and contact investors during a raise. Forager.ai is an investor-side sourcing engine that reads web, social, and hiring signals to surface startups before they formally fundraise. This page sets out what each tool does, who it is for, and why they do not compete for the same user.",
    decision: "Pick OpenVC when you are a founder building an outbound investor list. Its free core covers the core workflow of finding VCs, angels, and funds indexed by stage, sector, and geography. Pick Forager.ai when you are an investor or scout who wants leading web and social signals, roughly two to six weeks ahead of a fundraise, across consumer and services as well as technical companies. Forager is priced in tiers and suits a wide-net sourcing approach, though it is less actionable for purely technical sectors. Consider using both only across a single relationship: the founder uses OpenVC to reach out, while the investor on the receiving end may have found that founder through Forager. They are complementary sides of one market, not alternative products.",
  },
  {
    slug: "openvc-vs-tracxn",
    a: "openvc",
    b: "tracxn",
    verdict:
      "OpenVC is a free founder-side investor directory; Tracxn is an investor-side sector-mapped startup database with strong Asian coverage. Different products, different users. Founders raising rounds use OpenVC; analyst teams researching sectors or markets use Tracxn. Almost no overlap.",
    intro: "OpenVC and Tracxn occupy different ends of the startup data market. OpenVC is a free, founder-side directory for mapping and contacting investors during a fundraise. Tracxn is an investor-side research platform built around sector maps, analyst reports, and deep coverage of Asian ecosystems. This comparison explains the two products, their distinct user bases, and the circumstances in which each is the right choice.",
    decision: "Pick OpenVC when you are a founder raising a round and need to identify and contact investors. Its free core is sufficient for most outbound fundraising work, and the directory is indexed by stage, sector, and geography. Pick Tracxn when you are an analyst or investor who needs curated, sector-mapped startup research, especially across the two thousand plus industries Tracxn tracks and its strong Asian coverage. Tracxn is tiered from Pro to Enterprise and remains a lagging database, better for research than for catching companies early. Consider using both only in the sense that a founder and an investor sit on opposite sides of a deal and simply reach for different tools. The two almost never compete for the same buyer.",
  },
  {
    slug: "affinity-vs-harmonic-ai",
    a: "affinity",
    b: "harmonic-ai",
    verdict:
      "Affinity optimises sourcing through your firm's existing network; Harmonic.ai sources externally with AI-powered team pattern matching. They are complements, not substitutes. Most institutional VCs run both, Affinity for pipeline and warm-intro mapping, Harmonic for net-new discovery. Solo angels and emerging managers usually cannot justify either without a strong existing network or institutional budget.",
    intro: "Affinity and Harmonic.ai are both staples of the institutional venture capital stack, but they do fundamentally different jobs. Affinity is a relationship-intelligence CRM that builds a graph from your firm's inbox and calendar, helping you work the network you already have. Harmonic.ai is an external sourcing platform that pattern-matches founding teams and networks at incorporation to surface companies you have never heard of. This page examines how the two products differ and where they fit together.",
    decision: "Pick Affinity when your firm already has a meaningful inbound deal flow and the bottleneck is organising it: tracking pipeline, mapping warm introductions, and reporting to partners and LPs. It is priced per seat and only pays off when your existing network is strong. Pick Harmonic.ai when you want net-new, proactive discovery across all sectors, including non-technical founders, and have an enterprise budget with a dedicated sourcing team. Its signals are leading, at incorporation, but the model is not directly observable, so you are trusting its team and network patterns. Consider using both together if you are an institutional VC: Harmonic expands the top of the funnel while Affinity manages and converts it. Solo angels and emerging managers often find neither justifiable without a strong network or a large budget.",
  },
  {
    slug: "affinity-vs-pitchbook",
    a: "affinity",
    b: "pitchbook",
    verdict:
      "Affinity is a CRM for VC pipeline and relationship management; PitchBook is a research database for fund-performance and M&A reference. Different layers of the stack and they compose cleanly. Almost every institutional firm runs both: PitchBook as the data reference, Affinity as the operational CRM. Neither helps with proactive sourcing of unknown startups, pair with a leading-signal tool if that matters.",
    intro: "Affinity and PitchBook both live inside institutional firms, and because both are enterprise products they are sometimes weighed against each other. They belong to different layers of the stack. Affinity is a relationship-intelligence CRM that organises pipeline and warm introductions from your firm's communication graph. PitchBook is a research database for fund performance, valuations, M&A, and LP and GP reference. This page clarifies the two roles and why most firms adopt both rather than choose between them.",
    decision: "Pick Affinity when the problem is operational: you need a system of record for pipeline, relationship mapping, and partner and LP reporting. It auto-builds a graph from inbox and calendar, but it only optimises the network you already have and does not source net-new companies. Pick PitchBook when you need the gold-standard reference dataset for private markets, from fund performance and secondaries to M&A and benchmarks, at an enterprise price of twenty thousand dollars a year and up. Consider using both, which is what almost every institutional firm does: PitchBook as the data reference, Affinity as the working CRM. Remember that neither surfaces unknown startups, so if proactive sourcing matters you will still want a leading-signal tool layered on top.",
  },
  {
    slug: "affinity-vs-crunchbase",
    a: "affinity",
    b: "crunchbase",
    verdict:
      "Affinity is a relationship CRM for VC pipeline; Crunchbase is a public startup database. Almost every institutional firm uses both, Crunchbase for verification and basic research, Affinity for pipeline tracking and warm intros. Solo investors with a smaller network typically pick Crunchbase Pro and a leading-signal tool over an Affinity seat.",
    intro: "Affinity and Crunchbase appear in the same firm's tool belt so often that people naturally ask which one they need. They answer different questions. Affinity is a relationship-intelligence CRM that turns your firm's inbox and calendar into a pipeline and warm-introduction map. Crunchbase is a public startup database for verifying companies, funding rounds, and teams. This page compares the two and explains how most firms use them side by side rather than in competition.",
    decision: "Pick Affinity when your firm runs a steady inbound flow and needs to track and convert it: pipeline management, relationship mapping, and partner reporting. It is enterprise-priced per seat and is most valuable once you already have a network to organise. Pick Crunchbase when you need quick, reliable verification and basic research on companies and rounds, at forty nine dollars a month for Pro, a price point that works for individual investors and scouts. Consider using both if you are an institutional firm, since Crunchbase is the natural lookup layer while Affinity manages relationships. Solo investors and emerging managers usually get more from Crunchbase Pro plus a leading-signal tool than from paying for an Affinity seat, because Affinity cannot source deals you do not already have in flow.",
  },
  {
    slug: "specter-vs-harmonic-ai",
    a: "specter",
    b: "harmonic-ai",
    verdict:
      "Specter focuses on cross-channel growth signals (web, hiring, product) at mid-market pricing; Harmonic.ai focuses on AI-powered team pattern matching at incorporation, enterprise priced. Specter is the better fit for emerging managers tracking consumer and SaaS plays; Harmonic is for institutional VCs with sourcing teams. Both miss deep-tech and infrastructure plays where engineering acceleration is the right primary signal.",
    intro: "Specter and Harmonic.ai are both early-signal platforms for venture sourcing, but they look at different evidence. Specter tracks growth signals across web traffic, hiring, and product activity at mid-market pricing. Harmonic.ai pattern-matches founding teams and networks at incorporation, on enterprise contracts aimed at institutional firms. This comparison sets out what each tool measures, who it fits, and the blind spots they share.",
    decision: "Pick Specter when you are an emerging fund manager tracking consumer and SaaS companies and want cross-channel growth signals at approachable, mid-market pricing. Its lead time is roughly two to six weeks before a fundraise, and it goes beyond a single signal such as GitHub. Pick Harmonic.ai when you are an institutional VC with a dedicated sourcing team, an enterprise budget, and a thesis that spans non-technical founders, since Harmonic reads team and network patterns from incorporation. Consider using both only if you want complementary evidence across growth and people signals, though few teams need both given the cost. Note the shared gap: neither covers deep-tech and infrastructure well, so investors in those sectors should look to engineering-acceleration signals as the primary source instead.",
  },
  {
    slug: "specter-vs-forager-ai",
    a: "specter",
    b: "forager-ai",
    verdict:
      "Both are mid-market growth-signal platforms. Specter leans heavier on web traffic and product launch data; Forager.ai leans heavier on NLP across web, social, and hiring data. Coverage is comparable. Choice usually comes down to interface fit and pricing, both are reasonable picks for emerging managers wanting cross-sector early signals at individual-investor pricing.",
    intro: "Specter and Forager.ai are the two most direct competitors in this guide, both sitting in the mid-market tier of growth-signal platforms. Specter leans on web traffic and product launch data. Forager.ai leans on natural language processing across web, social, and hiring signals. Because their coverage is broadly comparable, the decision between them often comes down to practical factors rather than a single decisive feature. This page walks through the differences that do exist.",
    decision: "Pick Specter when you want growth evidence weighted toward web traffic and product activity, particularly for consumer and SaaS plays, at pricing aimed at emerging fund managers. Pick Forager.ai when you prefer NLP-driven coverage of web, social, and hiring signals and value a lower false-positive rate from publicly validated activity, across consumer and services as well as technical companies. Both give roughly two to six weeks of lead time before a fundraise and both are accessible to individual investors, though neither is free beyond limited tiers. Consider using both only if you have budget to spare, since their coverage overlaps heavily. In practice the decision usually comes down to interface fit and exact pricing for your team size, so it is worth trialling each against your own watchlist before committing.",
  },
  {
    slug: "specter-vs-crunchbase",
    a: "specter",
    b: "crunchbase",
    verdict:
      "Specter is a leading growth-signal platform (2-6 weeks pre-fundraise); Crunchbase is a lagging funding database. They answer different questions and compose cleanly: Specter for early discovery, Crunchbase for funding history once a name surfaces. Most emerging managers run both alongside a leading engineering-signal tool for technical sectors.",
    intro: "Specter and Crunchbase are frequently compared because both appear in an emerging manager's toolbox, yet they answer opposite questions about the market. Specter is a leading growth-signal platform that reads web, hiring, and product activity two to six weeks ahead of a fundraise. Crunchbase is a lagging database that records funding rounds after they are announced. This page explains the difference and how the two tools fit together in one workflow.",
    decision: "Pick Specter when you want to find companies before they formally fundraise, using leading growth signals across web traffic, hiring, and product data. Its mid-market pricing is approachable for emerging managers, though it can still stretch a solo angel's budget. Pick Crunchbase when you need reliable, post-event context: confirmed rounds, funding history, and team data, at forty nine dollars a month for Pro. Consider using both together, which is what most emerging managers do: Specter surfaces early candidates, then Crunchbase fills in the funding history once a name is in your pipeline. If you also invest in technical sectors, note that Specter's deep-tech and infrastructure coverage is shallow, so a leading engineering-signal tool is the natural third layer on top.",
  },
  {
    slug: "signalrank-vs-pitchbook",
    a: "signalrank",
    b: "pitchbook",
    verdict:
      "SignalRank is a Series-B graduation prediction model packaged as an index-fund product; PitchBook is the institutional reference database for private-markets data. Almost no overlap. SignalRank is useful for late-stage thesis validation and passive index exposure; PitchBook is the operational data layer for any institutional firm. They are not substitutes.",
    intro: "SignalRank and PitchBook are sometimes mentioned in the same conversation about late-stage private markets, but they are not really in the same category. SignalRank is a predictive model that scores a company's odds of graduating from Series A to Series B, packaged as an index-fund product. PitchBook is the institutional reference database for private-markets data. This comparison clarifies what each one is for and why they rarely appear in the same buying decision.",
    decision: "Pick SignalRank when you are validating a late-stage thesis or seeking passive index exposure to Series B graduation odds. It publishes the strongest signal in its niche and a peer-reviewed methodology, but it is an index-fund product rather than a subscription, so it is useless for pre-seed and seed sourcing and offers no individual-investor SaaS access. Pick PitchBook when your firm needs the operational data layer for private markets: fund performance, valuations, M&A, and LP and GP reference, at twenty thousand dollars a year and up. Consider using both only in the sense that a large institutional firm might hold SignalRank exposure while running PitchBook as its day to day reference. They are not substitutes, and for almost every workflow you will be choosing one or the other rather than weighing them against each other.",
  },
  {
    slug: "signalrank-vs-harmonic-ai",
    a: "signalrank",
    b: "harmonic-ai",
    verdict:
      "SignalRank predicts Series-B graduation odds for already-Series-A companies; Harmonic.ai sources companies at incorporation. They sit at opposite ends of the funnel. Most institutional firms running both do so for distinct reasons, SignalRank for thesis validation on late-stage opportunities, Harmonic for proactive early-stage discovery.",
    intro: "SignalRank and Harmonic.ai both apply machine learning to venture capital, but they operate at opposite ends of the funding funnel. SignalRank predicts whether an already-funded Series A company will graduate to Series B. Harmonic.ai sources brand new companies at the moment of incorporation by pattern-matching founding teams and networks. This page explains how the two models differ, what each is useful for, and why they do not overlap.",
    decision: "Pick SignalRank when you are evaluating late-stage opportunities and want a data-driven view of Series B graduation odds, or when you are seeking passive index exposure. Its methodology is published and peer-reviewed, but it starts only after a Series A, so it cannot help you find early companies. Pick Harmonic.ai when you want proactive, early-stage discovery across all sectors, including non-technical founders, and have an enterprise budget and a sourcing team. Its signals fire at incorporation, before most other tools even see the company. Consider using both if you are an institutional firm that plays the full funnel: Harmonic for early discovery, SignalRank for validating the late-stage portion of the thesis. For everyone else, the stage you invest at will determine which one, if either, is relevant.",
  },
  {
    slug: "harmonic-ai-vs-affinity",
    a: "harmonic-ai",
    b: "affinity",
    verdict:
      "Harmonic.ai is a sourcing tool, it brings new companies to your attention; Affinity is a relationship-intelligence CRM, it organises and optimises the network you already have. They are complements, not alternatives. Institutional VCs typically run both: Harmonic to expand the funnel, Affinity to manage and convert it.",
    intro: "Harmonic.ai and Affinity are two of the most commonly paired tools in an institutional venture firm, which is exactly why people ask whether one can replace the other. They cannot. Harmonic.ai is a sourcing engine that surfaces new companies through team and network pattern matching. Affinity is a relationship-intelligence CRM that organises the network and pipeline you already have. This page explains the division of labour between the two.",
    decision: "Pick Harmonic.ai when your goal is net-new deal flow: finding companies you would not otherwise know about, at incorporation, across all sectors including non-technical founders. It is enterprise-priced and best suited to firms with dedicated sourcing teams. Pick Affinity when your goal is conversion: tracking pipeline, mapping warm introductions, and reporting to partners and LPs from the inbox and calendar data you already hold. Affinity optimises what you have rather than finding what you do not. Consider using both, which is the standard institutional setup: Harmonic expands the top of the funnel while Affinity manages and converts it. The two are complements, not alternatives, and neither makes sense as a replacement for the other.",
  },
  {
    slug: "crunchbase-vs-cb-insights",
    a: "crunchbase",
    b: "cb-insights",
    verdict:
      "Crunchbase is a startup database best for company verification and basic research. CB Insights is a market intelligence platform with Mosaic scoring, industry analytics, and strategic research. Crunchbase costs $49/mo and is accessible to individual investors. CB Insights costs $35k+/yr and is built for institutional research teams. For deal sourcing with a budget, Crunchbase plus a leading-signal tool like VC Deal Flow Signal covers most individual-investor workflows.",
    intro: "Crunchbase and CB Insights are both household names in private-market data, but they serve different buyers at very different price points. Crunchbase is a startup database built for company verification and basic research. CB Insights is a market-intelligence platform with proprietary Mosaic scoring, industry analytics, and strategic research briefs. This comparison weighs the two on coverage, signal type, and cost, and explains which investor each one fits.",
    decision: "Pick Crunchbase when you need affordable, reliable verification of companies, funding rounds, and teams. At forty nine dollars a month for Pro, it is accessible to individual investors and scouts and is the default lookup tool for most of the market. Pick CB Insights when you need market intelligence rather than deal sourcing: Mosaic scores, industry analytics, market sizing, and curated research briefs, at an enterprise price of thirty five thousand dollars a year and up, built for institutional strategy teams. Consider using both only if you are a large firm that needs a research layer on top of a verification layer. For most individual investors, Crunchbase combined with a leading-signal tool covers the same workflow at a fraction of the cost, because CB Insights is broad market intelligence rather than a deal-flow sourcing engine.",
  },
  {
    slug: "pitchbook-vs-cb-insights",
    a: "pitchbook",
    b: "cb-insights",
    verdict:
      "PitchBook is institutional-grade private-markets data ($20k+/yr) with deep fund, LP, and valuation data. CB Insights is market intelligence ($35k+/yr) with Mosaic scoring and industry analytics. PitchBook is stronger for due diligence and portfolio management. CB Insights is stronger for market research and trend identification. Both are enterprise-priced. For sourcing at a fraction of the cost, pair a leading engineering-momentum signal like VC Deal Flow Signal with Crunchbase for verification.",
    intro: "PitchBook and CB Insights are the two enterprise heavyweights that institutional firms most often weigh against each other, since both carry five-figure annual price tags. PitchBook is a private-markets data platform focused on fund performance, valuations, and LP and GP data. CB Insights is a market-intelligence platform built around Mosaic scoring and industry analytics. This page compares them on the work each is genuinely better at.",
    decision: "Pick PitchBook when your work is due diligence and portfolio management: fund performance, secondaries, M&A, and valuation reference, at around twenty thousand dollars a year. Pick CB Insights when your work is market research and trend identification: Mosaic scores, market sizing, and analyst briefs on emerging categories, at around thirty five thousand dollars a year. Both are enterprise-priced with no meaningful free tier, so the choice is really about whether you need private-markets data or market intelligence. Consider using both only at large firms that run a dedicated strategy team alongside a deal team. If you are sourcing deals rather than researching markets, neither is the cheapest path: a leading engineering-momentum signal paired with Crunchbase for verification covers the same sourcing workflow at a fraction of the cost.",
  },
  {
    slug: "cb-insights-vs-crunchbase",
    a: "cb-insights",
    b: "crunchbase",
    verdict:
      "CB Insights provides proprietary Mosaic Scores, industry analytics, and research briefs for $35k+/yr. Crunchbase provides a comprehensive startup database for $49/mo. CB Insights is built for institutional strategy teams. Crunchbase is accessible to individual investors and scouts. For most solo investors and small funds, Crunchbase plus a free leading-signal tool like VC Deal Flow Signal covers the same workflow at a fraction of the cost.",
    intro: "CB Insights and Crunchbase are often named in the same sentence about startup data, but they occupy different tiers of the market. CB Insights is an enterprise market-intelligence platform with proprietary Mosaic scores, industry analytics, and research briefs. Crunchbase is a comprehensive startup database priced for individual users. This page compares the two on signal, coverage, and cost, and helps you decide which layer you actually need.",
    decision: "Pick CB Insights when you are an institutional strategy team that needs market intelligence: Mosaic scores, market sizing, and analyst research on emerging categories, at thirty five thousand dollars a year and up. Pick Crunchbase when you need a reliable, affordable startup database for verification and basic research, at forty nine dollars a month for Pro, a price that suits individual investors and scouts. Consider using both only if your firm needs a research layer on top of a verification layer. For most solo investors and small funds, the practical answer is Crunchbase plus a free leading-signal tool, which covers the same sourcing and verification workflow at a fraction of the cost. CB Insights is broad market intelligence, not a deal-flow sourcing engine, so it tends to be overkill for anyone whose main job is finding and checking companies.",
  },
  {
    slug: "harmonic-ai-vs-cb-insights",
    a: "harmonic-ai",
    b: "cb-insights",
    verdict:
      "Harmonic.ai uses AI to pattern-match founding teams at incorporation. CB Insights uses Mosaic scoring and market analytics for strategic research. Harmonic is sourcing-focused (find companies early). CB Insights is research-focused (understand markets and trends). Both are enterprise-priced. For individual investors, a code-side momentum signal like VC Deal Flow Signal catches the same companies at the engineering-acceleration phase.",
    intro: "Harmonic.ai and CB Insights both use machine learning to analyse private companies, and both are enterprise-priced, which invites the comparison. They optimise for different goals. Harmonic.ai is a sourcing platform that pattern-matches founding teams at incorporation to find companies early. CB Insights is a research platform that scores company health and analyses markets. This page explains what each model actually predicts and who it is for.",
    decision: "Pick Harmonic.ai when your goal is sourcing: finding companies early, at incorporation, across all sectors including non-technical founders. Its team and network signals are leading, but they are not directly observable, so you are trusting the model, and its enterprise pricing assumes a dedicated sourcing team. Pick CB Insights when your goal is research: Mosaic scores, market sizing, and analyst briefs to understand markets and trends, at thirty five thousand dollars a year and up. Consider using both only if a large firm wants a sourcing layer and a research layer under one roof. For individual investors who want to catch the same companies at the engineering-acceleration phase, a code-side momentum signal is the cheaper route, since both of these products sit well above what a solo angel or small fund typically spends.",
  },
];

// Hand-curated CTR hooks, one per canonical pair, keyed by canonical slug.
// WHY (2026-08-16, GSC 90d to 2026-08-12): the generic template title
// "X vs Y, Deal Flow Platform Comparison (2026)" drew 0.09-0.23% CTR on
// positions 4-8 (dealroom-vs-pitchbook: 4,274 imps / 4 clicks;
// harmonic-ai-vs-pitchbook: 3,466 / 8) while price/verdict-hooked titles on
// this site drew 1.2-2.0% (answers/free-harmonic-ai-alternative 1.22%,
// vs/specter-vs-harmonic-ai 1.99%, compare/best-free-deal-flow-tools 1.75%).
// Each hook names the concrete differentiator ($ figures straight from the
// pricing fields above) that decides the comparison. Keys without a hook
// fall back to the improved generic builder in app/vs/[slug]/page.tsx.
// Keep hooks <= 53 chars to leave room for the year, hard cap 60.
export const VS_TITLE_HOOKS: Record<string, string> = {
  "fund-momentum-vs-harmonic-ai": "Fund Momentum vs Harmonic.ai: Funds vs Teams",
  "fund-momentum-vs-forager-ai": "Fund Momentum vs Forager.ai: Funds vs Startups",
  "fund-momentum-vs-crunchbase": "Fund Momentum vs Crunchbase ($49/mo): Funds vs Data",
  "harmonic-ai-vs-dealroom": "Harmonic.ai vs Dealroom: Incorporation vs Post-Round",
  "harmonic-ai-vs-forager-ai": "Harmonic.ai vs Forager.ai: Team vs Web Signals",
  "harmonic-ai-vs-crunchbase": "Harmonic.ai vs Crunchbase ($49/mo): Sourcing",
  "harmonic-ai-vs-pitchbook": "Harmonic.ai vs PitchBook ($20k+/yr): Sourcing",
  "harmonic-ai-vs-tracxn": "Harmonic.ai vs Tracxn: Team Signals vs Sector Maps",
  "dealroom-vs-forager-ai": "Dealroom vs Forager.ai: EU Database vs Web Signals",
  "dealroom-vs-crunchbase": "Dealroom vs Crunchbase ($49/mo): EU Depth vs Default",
  "dealroom-vs-pitchbook": "Dealroom vs PitchBook ($20k+/yr): Deal Sourcing",
  "dealroom-vs-tracxn": "Dealroom vs Tracxn: European vs Asian Startup Depth",
  "forager-ai-vs-crunchbase": "Forager.ai vs Crunchbase ($49/mo): Web Signals vs Data",
  "forager-ai-vs-pitchbook": "Forager.ai vs PitchBook ($20k+/yr): Web vs Fund Data",
  "forager-ai-vs-tracxn": "Forager.ai vs Tracxn: Web Signals vs Sector Maps",
  "crunchbase-vs-pitchbook": "Crunchbase ($49/mo) vs PitchBook ($20k+/yr)",
  "crunchbase-vs-tracxn": "Crunchbase ($49/mo) vs Tracxn: Global vs Asia Depth",
  "crunchbase-vs-cb-insights": "Crunchbase ($49/mo) vs CB Insights ($35k+/yr)",
  "pitchbook-vs-tracxn": "PitchBook vs Tracxn: Fund Data vs 2,000+ Sector Maps",
  "pitchbook-vs-cb-insights": "PitchBook ($20k+/yr) vs CB Insights ($35k+/yr)",
  "openvc-vs-harmonic-ai": "OpenVC vs Harmonic.ai: Founder Side vs VC Side",
  "openvc-vs-dealroom": "OpenVC vs Dealroom: Founder Side vs Investor Side",
  "openvc-vs-crunchbase": "OpenVC (Free) vs Crunchbase ($49/mo): Two Sides",
  "openvc-vs-pitchbook": "OpenVC (Free) vs PitchBook ($20k+/yr)",
  "openvc-vs-forager-ai": "OpenVC vs Forager.ai: Founders vs Investors",
  "openvc-vs-tracxn": "OpenVC vs Tracxn: Founder Tool vs Analyst Tool",
  "affinity-vs-harmonic-ai": "Affinity vs Harmonic.ai: Pipeline CRM vs Sourcing",
  "affinity-vs-pitchbook": "Affinity vs PitchBook: CRM vs Fund Database",
  "affinity-vs-crunchbase": "Affinity vs Crunchbase ($49/mo): CRM vs Database",
  "specter-vs-harmonic-ai": "Specter vs Harmonic.ai: Growth vs Team Signals",
  "specter-vs-forager-ai": "Specter vs Forager.ai: Growth vs NLP Signals",
  "specter-vs-crunchbase": "Specter vs Crunchbase ($49/mo): Leading vs Lagging",
  "signalrank-vs-pitchbook": "SignalRank vs PitchBook: Series B Odds vs Fund Data",
  "signalrank-vs-harmonic-ai": "SignalRank vs Harmonic.ai: Series B vs Incorporation",
  "harmonic-ai-vs-cb-insights": "Harmonic.ai vs CB Insights ($35k+/yr): Sourcing",
};

/** First concrete $ figure in a competitor's pricing string, e.g. "$49/mo",
 *  "$20k+/yr", or null when pricing is non-numeric ("Tiered", "Enterprise"). */
export function competitorPriceNote(c: CompetitorInfo): string | null {
  const m = c.pricing.match(/\$\d[\dk]*[\d.,]*(?:\s*\/\s*[a-z]+)?\+?/i);
  return m ? m[0].replace(/\s+/g, "") : null;
}

export function getCompetitorVsPair(slug: string): CompetitorVs | undefined {
  return competitorVsPairs.find((p) => p.slug === slug);
}

export function getAllCompetitorVsSlugs(): string[] {
  return competitorVsPairs.map((p) => p.slug);
}

// Reverse-duplicate comparisons: both orderings exist as separate slugs but each
// pair is the same head-to-head (near-identical content). Both self-canonicalizing
// created duplicate-content competition. Consolidate ranking signal onto ONE
// canonical direction (keep the higher-search-volume brand named first, which is
// also the earlier-authored slug) and treat the reverse as a crawlable alias:
// canonical -> primary, excluded from the sitemap and internal cross-links.
export const VS_CANONICAL_OVERRIDE: Record<string, string> = {
  "harmonic-ai-vs-affinity": "affinity-vs-harmonic-ai",
  "cb-insights-vs-crunchbase": "crunchbase-vs-cb-insights",
};

// The canonical slug for a comparison (itself, unless it is a reverse alias).
export function getCanonicalVsSlug(slug: string): string {
  return VS_CANONICAL_OVERRIDE[slug] ?? slug;
}

// Comparison slugs minus the reverse aliases, the set to advertise in the
// sitemap and internal "other comparisons" links (one URL per head-to-head).
export function getCanonicalCompetitorVsSlugs(): string[] {
  return competitorVsPairs
    .map((p) => p.slug)
    .filter((slug) => !(slug in VS_CANONICAL_OVERRIDE));
}
