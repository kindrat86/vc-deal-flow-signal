/**
 * /for/[slug] entity pages — persona navigation hubs.
 *
 * Each persona is one of the Marcus 100 buyer roles. The page maps
 * the existing pSEO surface (711+ pages across /signal, /sector,
 * /city, /acquirer, /fund, /trend, /works-with,
 * /year-in-review) to that persona's specific workflows.
 *
 * URL convention: distinct from existing /for-builders, /for-crewai,
 * /for-langchain, /for-letta, /for-mastra, /for-vercel-ai-sdk
 * (top-level routes for AI-framework affiliations). /for/[slug] is
 * a fresh nested namespace for buyer-role personas.
 *
 * Marcus 100 personas covered:
 * - Corp Dev directors at hyperscalers + Fortune 500
 * - PE Operating Partners at growth funds
 * - Non-engineer tech VPs at portfolio + acquirer companies
 * - Emerging-manager VC funds
 * - Founders (B2B + technical)
 * - Researchers (academic + policy)
 * - Tech journalists + analysts
 */

export interface PersonaWorkflow {
  name: string;
  description: string;
  /** Primary route path the workflow points to. */
  primaryPath: string;
  /** Secondary route paths used in the workflow. */
  secondaryPaths: string[];
}

export interface PersonaFAQ {
  question: string;
  answer: string;
}

export interface Persona {
  slug: string;
  name: string;
  shortName: string;
  // SEO surfaces
  title: string;
  metaDescription: string;
  h1: string;
  tagline: string;
  intro: string;
  /** Three or four primary workflows the persona uses VC Deal Flow Signal for. */
  workflows: PersonaWorkflow[];
  /** Quick-start path: 3 specific pages the persona should bookmark first. */
  quickStart: { label: string; path: string }[];
  /** Why the engineering-signal lens specifically matters for this persona. */
  whyEngineeringSignals: string;
  /** Honest caveat about what the engineering-signal lens does NOT solve. */
  whatItDoesNotSolve: string;
  faqs: PersonaFAQ[];
  /** Primary CTA destination — most personas land at /firstlook; researchers at /methodology. */
  ctaPath: string;
  ctaLabel: string;
}

export const PERSONAS: Persona[] = [
  {
    slug: "corp-dev",
    name: "Corporate Development Directors",
    shortName: "Corp Dev",
    title: "VC Deal Flow Signal for Corporate Development — M&A Sourcing Surface",
    metaDescription:
      "Corp Dev directors at hyperscalers and Fortune 500 incumbents use VC Deal Flow Signal to scout acquisition targets pre-fundraise. Engineering acceleration as a 3-6-week leading indicator. Independent, public-data sourced.",
    h1: "VC Deal Flow Signal for Corporate Development",
    tagline:
      "Scout acquisition targets via the engineering-acceleration signal — 3 to 6 weeks before the round closes and the price hardens.",
    intro:
      "Corporate Development directors at hyperscalers (Microsoft, Google, Cisco, Salesforce, Adobe, Oracle, IBM, Snowflake, Databricks) and Fortune 500 incumbents face a structural sourcing problem: by the time an acquisition target circulates a banker book, multiple competing strategic buyers already know about the asset. VC Deal Flow Signal surfaces engineering-acceleration patterns 3 to 6 weeks before fundraise announcements — early enough to start exploratory conversations before pricing tension forms. This page maps your specific Corp Dev workflows to the public pSEO surface we publish.",
    workflows: [
      {
        name: "Acquisition-target scouting by sector",
        description:
          "Filter the engineering-signal panel by sectors that match your M&A focus areas, then drill into per-company /signal pages for engineering-organization shape, contributor density, and language-bias signals. Each /sector hub lists 5-15 tracked companies in the category with one-click access to /signal/[company] deep dives.",
        primaryPath: "/sector",
        secondaryPaths: ["/signal", "/sector/ai-infra", "/sector/observability"],
      },
      {
        name: "Acquirer pattern benchmarking",
        description:
          "Compare your firm's M&A pattern against peer acquirers — Cisco, IBM, Google, Salesforce — to triangulate competitive responses. The /acquirer pages document 130+ public deals across 20 incumbents with focus-sector mapping. Useful for board-deck preparation and M&A pipeline arguments.",
        primaryPath: "/acquirer",
        secondaryPaths: ["/acquirer/microsoft", "/acquirer/cisco", "/acquirer/google"],
      },
      {
        name: "Side-by-side target comparison",
        description:
          "For acquisition shortlists in the same sector, open the candidates' /signal pages side by side for a full engineering-signal comparison. Stage, momentum, public repos, language bias — useful as a first-pass screen before deep due diligence.",
        primaryPath: "/signal",
        secondaryPaths: ["/signal/anthropic", "/signal/modal"],
      },
      {
        name: "Year-in-review M&A landscape briefings",
        description:
          "The /year-in-review pages anchor M&A landscape briefings — useful for board presentations explaining peer-acquirer activity patterns and the strategic context for proposed deals.",
        primaryPath: "/year-in-review",
        secondaryPaths: ["/year-in-review/2024", "/year-in-review/2025"],
      },
    ],
    quickStart: [
      { label: "Acquirer pattern map", path: "/acquirer" },
      { label: "Sector signal hubs", path: "/sector" },
      { label: "Latest signal feed", path: "/firstlook" },
    ],
    whyEngineeringSignals:
      "Corp Dev is structurally late to most deals — banker books circulate at the announcement stage, by which point competing buyers already know. Engineering signals (commit velocity, contributor influx, repo creation pulse) move 3 to 6 weeks earlier in the cycle and are publicly observable. The 2-4 week head start is often the difference between a competitive auction and an exclusive conversation. Engineering signal is not the only sourcing channel — it stacks underneath banker books, warm intros, and conference relationships. It is the channel that fires earliest.",
    whatItDoesNotSolve:
      "Engineering signal does not replace due diligence, financial modeling, or culture-fit assessment. It does not surface non-technical acquisitions (sales-led B2B SaaS, consumer apps, content businesses, services firms). It is one signal among many, and best used to surface candidates earlier rather than to make final go/no-go decisions.",
    faqs: [
      {
        question: `How early can Corp Dev act on engineering signals?`,
        answer: `The 3-to-6-week window before fundraise announcements is the typical action window. For most engineering signal breaks, an exploratory outreach in week 1-2 of the signal firing arrives well before the company actively markets the round, which means the conversation can move on the buyer's timeline rather than reactive to the founder's process.`,
      },
      {
        question: `Are engineering signals proprietary data?`,
        answer: `No — every signal we publish is derivable from public GitHub event data plus each company's self-published facts (homepage, GitHub org, careers page). The methodology is published at /methodology and the underlying paper is at SSRN 6606558. No insider information is involved.`,
      },
      {
        question: `Which acquirers does VC Deal Flow Signal cover?`,
        answer: `The /acquirer hub documents 20 well-known public acquirers with 130+ deals across them: Microsoft, Google, Salesforce, Adobe, Apple, Amazon/AWS, Cisco, IBM, Oracle, Nvidia, Atlassian, ServiceNow, Stripe, Cloudflare, Shopify, Snowflake, Databricks, GitHub, HubSpot, Intel. Other acquirers can be added on request for paying customers.`,
      },
      {
        question: `Can we get a custom integration into our CRM?`,
        answer: `Yes. The /works-with section documents available integration paths for major CRMs (Affinity, HubSpot, Salesforce, Microsoft Dynamics). Custom Corp Dev integrations into Dynamics, Salesforce, or a proprietary M&A pipeline tool are scoped during onboarding. Typical setup is 2-4 weeks.`,
      },
    ],
    ctaPath: "/firstlook",
    ctaLabel: "Get the Corp Dev Brief",
  },
  {
    slug: "pe-operating-partners",
    name: "PE Operating Partners",
    shortName: "PE OPs",
    title: "VC Deal Flow Signal for PE Operating Partners — Portfolio & Bolt-on Sourcing",
    metaDescription:
      "PE Operating Partners use VC Deal Flow Signal to scout bolt-on acquisition targets and benchmark portfolio company engineering velocity. Independent — sourced from public GitHub data only.",
    h1: "VC Deal Flow Signal for PE Operating Partners",
    tagline:
      "Scout bolt-on targets and benchmark portfolio company engineering velocity through one unified signal panel.",
    intro:
      "PE Operating Partners at growth-stage funds (Vista, Thoma Bravo, KKR, Bain Capital, EQT, ICONIQ) face two recurring problems: sourcing bolt-on acquisition targets that fit existing platform investments, and benchmarking portfolio company engineering velocity against public peers. VC Deal Flow Signal addresses both via a single public engineering-acceleration signal panel. This page maps your specific Operating Partner workflows to the pSEO surface we publish.",
    workflows: [
      {
        name: "Bolt-on target sourcing by sector",
        description:
          "Filter the signal panel by the sectors of your existing platform investments. Each /sector hub surfaces tracked companies whose engineering acceleration suggests they may be receptive to strategic acquisition offers from a well-resourced platform parent.",
        primaryPath: "/sector",
        secondaryPaths: ["/sector/observability", "/sector/database", "/sector/fintech"],
      },
      {
        name: "Portfolio company velocity benchmarking",
        description:
          "Compare your portfolio companies' engineering velocity to category-leading public peers via the /signal entity pages. Useful for quarterly portfolio review and for identifying portfolio companies that need engineering-organization investment.",
        primaryPath: "/signal",
        secondaryPaths: ["/sector", "/trend"],
      },
      {
        name: "Fund-level concentration via portfolio rollups",
        description:
          "The /fund/[slug]/portfolio pages render the intersection of a peer fund's publicly disclosed portfolio with our tracked corpus — useful when evaluating co-investment opportunities or modeling competitive dynamics among PE peers.",
        primaryPath: "/fund",
        secondaryPaths: ["/fund/sequoia/portfolio", "/fund/andreessen-horowitz/portfolio"],
      },
    ],
    quickStart: [
      { label: "Sector signal hubs", path: "/sector" },
      { label: "Peer-fund portfolios", path: "/fund" },
      { label: "Latest engineering trends", path: "/trend" },
    ],
    whyEngineeringSignals:
      "PE Operating Partners need a signal layer that works across both bolt-on sourcing and portfolio benchmarking. Engineering signals satisfy both: a target's acceleration is a sourcing signal, and a portfolio company's relative acceleration vs category peers is a benchmark. Public GitHub data is the rare data source that gives consistent, comparable measurement across both inbound and outbound use cases without requiring access to confidential financials.",
    whatItDoesNotSolve:
      "Engineering signal does not replace financial benchmarking, ARR analysis, or unit-economics modeling. For non-technical PE portfolio investments (industrial, healthcare services, consumer brands), the engineering-signal lens has limited applicability. The signal is most powerful at the SaaS / infrastructure / developer-tools intersection.",
    faqs: [
      {
        question: `How does this differ from PitchBook or Capital IQ?`,
        answer: `PitchBook and Capital IQ are financial-data products — they document fundraise events after they happen. VC Deal Flow Signal documents engineering-acceleration signals that historically precede fundraise events by 3-6 weeks. Complementary, not competitive — use PitchBook for what happened, our signals for what's about to happen.`,
      },
      {
        question: `Can we use the signal data in internal portfolio review decks?`,
        answer: `Yes. The public engineering-signal data is CC BY 4.0 licensed (see /dataset). Internal use in portfolio decks, board materials, and investment memos is explicitly permitted with attribution. For higher-volume programmatic use, see the public MCP server at /api/v1 and the /works-with integration paths.`,
      },
      {
        question: `Which funds have we documented portfolio rollups for?`,
        answer: `19 funds with at least one publicly disclosed portfolio company in our tracked corpus — see /fund. Hand-curated map sourced from each fund's portfolio page, press releases, and Crunchbase only. We do not list rumored investments or anything not publicly disclosed by both sides.`,
      },
    ],
    ctaPath: "/firstlook",
    ctaLabel: "Get the OP Brief",
  },
  {
    slug: "tech-vps",
    name: "Non-Engineer Tech VPs",
    shortName: "Tech VPs",
    title: "VC Deal Flow Signal for Tech VPs — Vendor & Competitive Intelligence",
    metaDescription:
      "Non-engineer tech VPs use VC Deal Flow Signal to scout vendor consolidation candidates and benchmark engineering investment versus competitors. Independent public-data sourced.",
    h1: "VC Deal Flow Signal for Tech VPs",
    tagline:
      "Vendor consolidation scouting and competitive engineering benchmarking through one unified signal panel.",
    intro:
      "Non-engineer tech VPs (VP Engineering, VP Platform, Chief Architect, VP Infrastructure) at enterprise companies face two parallel problems: which vendors should we consolidate around as we cut budget, and how does our engineering investment compare to publicly observable peer companies? VC Deal Flow Signal addresses both via the same engineering-acceleration signal panel — vendors with sustained acceleration are likely to consolidate the category; peer companies with relative acceleration suggest where your team may be underinvested.",
    workflows: [
      {
        name: "Vendor consolidation scouting",
        description:
          "When evaluating which vendor to standardize on in a category (auth, observability, database, dev tools, etc.), the /sector hubs and per-vendor /signal pages give a publicly observable engineering-velocity comparison. Vendors with sustained acceleration are likely to consolidate the category long-term.",
        primaryPath: "/sector",
        secondaryPaths: ["/signal", "/works-with"],
      },
      {
        name: "Competitive engineering benchmarking",
        description:
          "Compare your company's engineering acceleration to direct public competitors via /signal entity pages. Useful for board presentations defending engineering headcount, advocating for platform investments, or modeling competitive timelines.",
        primaryPath: "/signal",
        secondaryPaths: ["/sector", "/trend"],
      },
      {
        name: "Acquisition-rumor verification",
        description:
          "When trade press reports rumored acquisitions, the /acquirer and /signal pages let you verify the implied integration path. Acquirers whose published M&A pattern doesn't match the rumored target's profile are often false-flag signals.",
        primaryPath: "/acquirer",
        secondaryPaths: ["/signal", "/year-in-review"],
      },
    ],
    quickStart: [
      { label: "Sector vendor hubs", path: "/sector" },
      { label: "Per-vendor signal pages", path: "/signal" },
      { label: "Trend leaderboards", path: "/trend" },
    ],
    whyEngineeringSignals:
      "Non-engineer tech VPs need to make engineering-organization arguments to non-engineer executive peers (CFO, COO, CMO). Engineering signals translate complex technical-velocity claims into measurable, public, comparable metrics that defensive executives accept as credible — because they are independently sourced from public GitHub data rather than from internal claims.",
    whatItDoesNotSolve:
      "Engineering signal does not address engineering-culture quality, code-review depth, security posture, or technical-debt levels. It is a velocity signal, not a quality signal. For technical due diligence on potential vendors, the signal is useful as a first-pass screen but should never be the only input.",
    faqs: [
      {
        question: `Which vendor categories does VC Deal Flow Signal cover?`,
        answer: `Today: AI infrastructure, AI/ML, developer tools, cloud infrastructure, databases, observability, analytics, fintech, productivity, edge compute. Most of the technical-vendor surface a tech VP scouts. Categories with weak GitHub footprint (proprietary closed-source enterprise vendors) are not well-served by the engineering-signal lens.`,
      },
      {
        question: `Can we use this data in vendor RFP processes?`,
        answer: `Yes. Engineering-signal data is publicly licensed (CC BY 4.0). Including signal data in vendor RFPs as an objective benchmark layer is explicitly permitted with attribution to /methodology.`,
      },
      {
        question: `How does this compare to Gartner Magic Quadrants?`,
        answer: `Gartner is an analyst-relations product, scored partly on vendor activity with analysts. VC Deal Flow Signal is observation-only — we measure publicly observable engineering velocity without vendor input. Complementary: Gartner tells you what analysts think; we tell you what's measurably shipping.`,
      },
    ],
    ctaPath: "/firstlook",
    ctaLabel: "Get the Tech VP Brief",
  },
  {
    slug: "emerging-managers",
    name: "Emerging-Manager VCs",
    shortName: "Emerging Managers",
    title: "VC Deal Flow Signal for Emerging-Manager VCs — Sourcing & Differentiation",
    metaDescription:
      "Emerging-manager VC funds use VC Deal Flow Signal to source pre-round deals and differentiate sourcing from larger established funds. Independent — public-data sourced.",
    h1: "VC Deal Flow Signal for Emerging-Manager VCs",
    tagline:
      "Source pre-round deals from public engineering signals and differentiate from established-fund sourcing motions.",
    intro:
      "Emerging-manager VC funds face a competitive sourcing problem: established funds have larger sourcing teams, more partner relationships, and broader access to the warm-intro network. Code-side sourcing — the practice of identifying companies before the round circulates by reading their public GitHub activity — is the rare sourcing channel where being smaller and faster is the structural advantage. VC Deal Flow Signal publishes the public signal panel that makes this sourcing motion repeatable.",
    workflows: [
      {
        name: "Sector-filtered deal sourcing",
        description:
          "Filter the public engineering signal panel by sectors that match your investment thesis. The /sector pages list 5-15 curated companies per sector with one-click access to engineering-signal deep dives. New-fund partner teams use this as the weekly Monday-morning sourcing-meeting agenda.",
        primaryPath: "/sector",
        secondaryPaths: ["/firstlook", "/signal"],
      },
      {
        name: "Geographic sourcing through city hubs",
        description:
          "Use the /city hubs to filter the signal panel by venture hub. Especially useful for emerging managers focused on specific geographies (European-focused, Latin-America-focused, etc.) where local engineering rhythm matters more than global panels.",
        primaryPath: "/city",
        secondaryPaths: ["/city/london", "/city/berlin", "/city/lagos"],
      },
      {
        name: "Differentiation via published thesis mapping",
        description:
          "The /fund pages list 30 established funds with their published thesis mapped against the engineering-signal panel. Use as benchmark for differentiating your fund's pitch to LPs and founders — what makes your sourcing motion different from Sequoia, a16z, Accel, or Benchmark.",
        primaryPath: "/fund",
        secondaryPaths: ["/fund/sequoia", "/fund/andreessen-horowitz"],
      },
    ],
    quickStart: [
      { label: "Weekly sourcing digest", path: "/firstlook" },
      { label: "Sector signal hubs", path: "/sector" },
      { label: "Geographic city hubs", path: "/city" },
    ],
    whyEngineeringSignals:
      "Emerging-manager economics depend on access (getting into the right rounds) and differentiation (offering founders something the larger funds can't). Code-side sourcing gives both: it surfaces deals 3-6 weeks before competitive funds know, and the founder-facing pitch ('we found you through your engineering work, not a banker book') differentiates from generic outreach. Engineering signals don't replace warm intros — they create the warm-intro opening.",
    whatItDoesNotSolve:
      "Engineering signal does not solve LP-side fundraising, doesn't help with portfolio management once deals are closed, and is irrelevant for non-technical investments (consumer, services, content). It is a sourcing-stage tool, deployed at the top of the funnel.",
    faqs: [
      {
        question: `Is this accessible for solo capital allocators?`,
        answer: `Yes. The public engineering-signal panel is free to read. Paid plans (see /pricing) add weekly curated digests, MCP server access, and custom integrations. Solo angels, scout-program GPs, and emerging-manager partners are explicitly part of the target market.`,
      },
      {
        question: `Can we cite this in LP materials and fund-marketing?`,
        answer: `Yes — Code-Side Sourcing is a published category (see /code-side-sourcing) with an associated SSRN paper (6606558). Citing the methodology in LP materials, fund marketing, and partner content is explicitly permitted. Several emerging-manager funds have built differentiated LP pitches around code-side sourcing as a sourcing pillar.`,
      },
      {
        question: `How does the cadence work for solo or small partner teams?`,
        answer: `Weekly digest is the default rhythm — Sunday-evening publication, ready for Monday partner-meeting prep. For higher-frequency needs (sector watch lists, real-time alerts), the MCP server and webhook integrations are available.`,
      },
    ],
    ctaPath: "/firstlook",
    ctaLabel: "Get the Sourcing Digest",
  },
  {
    slug: "founders",
    name: "Founders",
    shortName: "Founders",
    title: "VC Deal Flow Signal for Founders — Sector Map & Investor Targeting",
    metaDescription:
      "Founders use VC Deal Flow Signal to scope competitive landscape and identify investor targets aligned with their sector. Independent — public-data sourced.",
    h1: "VC Deal Flow Signal for Founders",
    tagline:
      "Map your competitive landscape and identify investor targets aligned with your sector through public engineering signals.",
    intro:
      "Founders face two sequential sourcing problems: understanding the competitive landscape before raising (which companies are 6-12 months ahead in your sector?) and identifying investor targets whose thesis matches what you're building. VC Deal Flow Signal publishes the public engineering-signal panel that makes both clear — and lets you bring evidence to investor conversations rather than just claims.",
    workflows: [
      {
        name: "Competitive landscape scoping",
        description:
          "Before raising, use /sector and /signal pages to map who's ahead in your category, what engineering investment they've made, and how your team's velocity compares. Brings objectivity to the 'we're ahead' or 'we're behind' framing during fundraise conversations.",
        primaryPath: "/sector",
        secondaryPaths: ["/signal", "/trend"],
      },
      {
        name: "Investor target identification",
        description:
          "The /fund pages map each fund's published thesis to the engineering-signal panel they're most aligned with. Useful for building target-investor lists where the fund's stated thesis matches your sector — increases hit rate on cold outreach significantly.",
        primaryPath: "/fund",
        secondaryPaths: ["/fund/sequoia", "/fund/andreessen-horowitz"],
      },
      {
        name: "Acquisition-path mapping",
        description:
          "Founders building toward eventual acquisition use /acquirer pages to understand each potential strategic buyer's published M&A pattern — what they've bought, what they pay, what they integrate. Useful for board strategy and exit-planning conversations.",
        primaryPath: "/acquirer",
        secondaryPaths: ["/acquirer/microsoft", "/acquirer/cisco"],
      },
    ],
    quickStart: [
      { label: "Competitive landscape", path: "/sector" },
      { label: "Investor target list", path: "/fund" },
      { label: "Acquirer M&A patterns", path: "/acquirer" },
    ],
    whyEngineeringSignals:
      "Founders need objective, third-party-sourced data when making fundraise pitches and exit conversations. Engineering signals are uniquely useful for technical founders because the same signal that an investor uses to evaluate your company is the same signal you can use to map your competitive landscape. The data is symmetric — what your potential funders see is exactly what you can see.",
    whatItDoesNotSolve:
      "Engineering signal does not replace fundraise craft (pitch deck, narrative, traction story), product-market-fit work, or hiring. It is a competitive-landscape and investor-targeting tool, not a substitute for the work of building a company.",
    faqs: [
      {
        question: `Will investors see my engineering signal data?`,
        answer: `Investors using VC Deal Flow Signal already see your public GitHub data — that's literally what the panel publishes. If you're a public GitHub org, your engineering acceleration is already visible to anyone who wants to look. This page just makes it easier for you to see what they see.`,
      },
      {
        question: `My GitHub org is private — does this still apply?`,
        answer: `Engineering signals are derived from PUBLIC GitHub data only. If your org is fully private, you do not appear in our /signal corpus. Many founders deliberately maintain a public devrel surface (a public docs repo, sample SDKs, or starter templates) precisely so that the engineering-signal panel surfaces them. The choice is yours.`,
      },
      {
        question: `Can I get added to /signal?`,
        answer: `The /signal corpus is curated — additions require self-published GitHub handle on your company homepage, devrel blog, or hiring page. If that's already true and you'd like to be added, contact us via /corrections. We add companies in batches roughly quarterly.`,
      },
    ],
    ctaPath: "/firstlook",
    ctaLabel: "See Your Sector",
  },
  {
    slug: "researchers",
    name: "Researchers",
    shortName: "Researchers",
    title: "VC Deal Flow Signal for Researchers — Methodology & Open Dataset",
    metaDescription:
      "Academic and policy researchers use VC Deal Flow Signal's open dataset and published methodology to study engineering-acceleration patterns as leading indicators of venture activity. CC BY 4.0 licensed.",
    h1: "VC Deal Flow Signal for Researchers",
    tagline:
      "Open dataset, published methodology, citable SSRN paper, and APIs designed for academic and policy research.",
    intro:
      "Academic and policy researchers studying venture finance, technical innovation, or engineering-organization dynamics have a recurring data access problem: most relevant data is proprietary and gated by Crunchbase, PitchBook, or CB Insights. VC Deal Flow Signal addresses this by publishing the full engineering-acceleration signal panel under CC BY 4.0 — the panel itself, the underlying methodology, and the SSRN paper documenting empirical findings are all freely citable.",
    workflows: [
      {
        name: "Empirical methodology citation",
        description:
          "The SSRN paper (6606558) documents the empirical relationship between commit-velocity acceleration and fundraise announcements with a 3-6-week leading-indicator window. Researchers studying technical-innovation timing or venture-financing pre-announcement dynamics can cite this paper as the empirical foundation.",
        primaryPath: "/methodology",
        secondaryPaths: ["/citation-guide", "/code-side-sourcing"],
      },
      {
        name: "Open dataset for replication studies",
        description:
          "The /dataset endpoint serves the full tracked engineering signal corpus as JSON, JSONL, and CSV under CC BY 4.0. Replication studies, follow-on papers, and policy analysis can use the dataset without restriction other than attribution.",
        primaryPath: "/dataset",
        secondaryPaths: ["/reproducibility", "/citation-guide"],
      },
      {
        name: "API access for programmatic research",
        description:
          "The /api/v1 endpoints + public MCP server give programmatic access for higher-volume analysis. Pythonic researchers can pull the full panel directly into Jupyter or pandas notebooks; LLM-augmented research can use the MCP server with Claude or ChatGPT.",
        primaryPath: "/developers",
        secondaryPaths: ["/api/openapi.json", "/api/v1"],
      },
    ],
    quickStart: [
      { label: "Published methodology", path: "/methodology" },
      { label: "Open dataset", path: "/dataset" },
      { label: "Citation guide", path: "/citation-guide" },
    ],
    whyEngineeringSignals:
      "Researchers studying venture finance, technical innovation, or engineering-organization dynamics typically rely on proprietary databases (Crunchbase, PitchBook, CB Insights) that gate replication and follow-on research behind enterprise licenses. The Code-Side Sourcing category and the supporting public dataset solve a specific reproducibility problem: we publish the source data, the methodology, and the empirical findings under open licenses that explicitly permit academic use and replication.",
    whatItDoesNotSolve:
      "The engineering-signal data covers technical companies with public GitHub orgs only. For research questions involving non-technical companies (consumer brands, services, regulated industries), the corpus is not relevant. The data is observational; causal-identification research requires additional design.",
    faqs: [
      {
        question: `What is the citation format for the published paper?`,
        answer: `The Data Nerd (2026). "A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups." SSRN: https://ssrn.com/abstract=6606558. DOI: 10.2139/ssrn.6606558. ORCID: 0009-0002-2222-4112. See /citation-guide for BibTeX and APA formats.`,
      },
      {
        question: `What's the license on the dataset?`,
        answer: `CC BY 4.0 — see /dataset. Academic and commercial research use is explicitly permitted with attribution. The Zenodo DOI (10.5281/zenodo.19650920) is the canonical archive citation; Hugging Face mirror is available at the-data-nerd/vc-deal-flow-signal.`,
      },
      {
        question: `How frequently is the dataset updated?`,
        answer: `The signal panel updates weekly. The dataset endpoint reflects the latest weekly snapshot. For longitudinal-panel research requiring historical snapshots, contact via /corrections — we maintain weekly archive snapshots back to the panel's inception.`,
      },
    ],
    ctaPath: "/methodology",
    ctaLabel: "Read the Methodology",
  },
  {
    slug: "journalists",
    name: "Tech Journalists & Analysts",
    shortName: "Journalists",
    title: "VC Deal Flow Signal for Journalists — Citable Engineering Data",
    metaDescription:
      "Tech journalists and industry analysts cite VC Deal Flow Signal's engineering-acceleration data when reporting on venture stories. Independent, public-sourced, citable.",
    h1: "VC Deal Flow Signal for Journalists & Analysts",
    tagline:
      "Citable, independent, public-data sourced engineering-acceleration signal for venture-story reporting.",
    intro:
      "Tech journalists and industry analysts (TechCrunch, Information, Axios, Bloomberg, Reuters, plus boutique research shops) face a recurring problem: most venture-stage data is proprietary and gated, and the embargoed data flowing from PR shops is partial. VC Deal Flow Signal addresses this with citable, independent engineering-acceleration data sourced from public GitHub events — no NDAs, no embargoes, no privileged access required.",
    workflows: [
      {
        name: "Independent quote-friendly data",
        description:
          "Reporting on a fundraise or acquisition? Cite the /signal page for the relevant company — engineering-velocity numbers are publicly observable and directly quotable in stories. We do not require advance notice or coordinate with PR teams.",
        primaryPath: "/signal",
        secondaryPaths: ["/sector", "/trend"],
      },
      {
        name: "Sector-trend stories grounded in data",
        description:
          "The /trend leaderboards are designed as the foundation for sector-story leads — 'agentic AI is the year's biggest trend' becomes citable when grounded in the /trend/agentic-ai-frameworks-2026 page with its underlying signal data and methodology.",
        primaryPath: "/trend",
        secondaryPaths: ["/year-in-review", "/sector"],
      },
      {
        name: "Year-in-review and longform retrospectives",
        description:
          "The /year-in-review pages serve as research scaffolding for longform retrospectives — each leaf combines tracked signals, documented M&A history, and trend leaderboards into a citable narrative arc.",
        primaryPath: "/year-in-review",
        secondaryPaths: ["/acquirer", "/trend"],
      },
    ],
    quickStart: [
      { label: "Per-company signal data", path: "/signal" },
      { label: "Trend leaderboards", path: "/trend" },
      { label: "Year-in-review hubs", path: "/year-in-review" },
    ],
    whyEngineeringSignals:
      "Journalism needs citable, independent, publicly verifiable sources. Engineering signals satisfy all three: the data is sourced from public GitHub events anyone can verify, the methodology is documented and reproducible (SSRN 6606558), and quotes from our pages can be linked directly. No paywall, no NDA, no PR-shop mediation.",
    whatItDoesNotSolve:
      "Engineering signal does not replace shoe-leather reporting — it's a data layer underneath the actual story. Use it to ground claims and verify quotes from on-the-record sources, not as the entire story.",
    faqs: [
      {
        question: `Can I quote VC Deal Flow Signal directly in stories?`,
        answer: `Yes. The data is public and citable. Standard journalism practice (named attribution + link back to /signal or the underlying page) is the expected use pattern. We do not require advance notice or comment opportunities — the data is the data.`,
      },
      {
        question: `Do you have an embargo or PR-coordination process?`,
        answer: `No. We are not a PR-driven publication. We publish weekly engineering-signal updates on a fixed cadence without coordinating with the companies covered. Stories can quote from any of our published pages without notice.`,
      },
      {
        question: `Can I get pre-publication access to a future trend page?`,
        answer: `No. Our publication cadence is fixed and public. We do not provide embargoed early access to our editorial work. Researchers and journalists are encouraged to use the open dataset and API for their own original analysis.`,
      },
    ],
    ctaPath: "/dataset",
    ctaLabel: "Browse the Open Dataset",
  },
  {
    slug: "angel-investors",
    name: "Angel Investors",
    shortName: "Angels",
    title: "GitHub Engineering Signals for Angel Investors — Find Pre-Seed Breakouts Early",
    metaDescription:
      "Angel investors use public GitHub commit velocity to spot pre-seed startups accelerating 3-6 weeks before a fundraise. Free dataset, weekly rankings, no signup.",
    h1: "GitHub Engineering Signals for Angel Investors",
    tagline:
      "Spot pre-seed breakouts 3-6 weeks before the round gets crowded — using public GitHub commit velocity as the earliest engineering-momentum signal.",
    intro:
      "Angel investors need signals before the round gets crowded. Commit velocity is the earliest public indicator of engineering momentum — visible weeks before pitch decks circulate, press hits, or SEC filings appear. VC Deal Flow Signal tracks 400+ startups across 20 sectors, refreshed weekly.",
    workflows: [
      {
        name: "Pre-seed breakout detection",
        description: "Filter the signal panel for startups with commit-velocity acceleration above the sector median. These are the earliest breakout candidates — the ones that haven't appeared in any press yet.",
        primaryPath: "/signal",
        secondaryPaths: ["/stage/pre-seed", "/signal/hiring-burst"],
      },
      {
        name: "Scout Score for deal screening",
        description: "Compute a 0-100 Scout Score for any GitHub username based on their starring history vs. ~75 validated unicorns. Useful for evaluating founder taste and pattern-matching ability before writing a cheque.",
        primaryPath: "/receipts",
        secondaryPaths: ["/receipts"],
      },
      {
        name: "Free weekly Sunday digest",
        description: "Join the Telegram channel for 5 hand-picked breakout startups every Sunday — free, no email required. Perfect for angels who want a Monday-morning sourcing agenda.",
        primaryPath: "/telegram",
        secondaryPaths: ["/telegram"],
      },
    ],
    quickStart: [
      { label: "Pre-seed rankings", path: "/stage/pre-seed" },
      { label: "Scout Score checker", path: "/receipts" },
      { label: "Sunday digest", path: "/telegram" },
    ],
    whyEngineeringSignals:
      "Angels live on speed and access. Engineering signals fire 3-6 weeks before institutional funds see the deck. For angels, that head start is the difference between getting into a round at terms you negotiate vs. terms set by a competitive process.",
    whatItDoesNotSolve:
      "Engineering signals don't replace founder conversations, reference checks, or market-thesis validation. They are a sourcing and screening signal — not a diligence tool. Use them to find candidates faster, not to make final investment decisions.",
    faqs: [
      { question: "What GitHub signals are relevant for angel investors?", answer: "Commit velocity (14-day rolling commits to the most active public repo), contributor growth (new organizational committers), and signal type classification (breakout, acceleration, steady, cooling). These are the earliest publicly observable indicators of engineering momentum." },
      { question: "How often is the data refreshed?", answer: "Every Monday at approximately 09:00 UTC. The 14-day rolling window resets weekly." },
      { question: "Is this free for angels?", answer: "Yes. The dataset, API, MCP server, and weekly rankings are free forever. No signup required." },
    ],
    ctaPath: "/telegram",
    ctaLabel: "Get the Free Sunday Digest",
  },
  {
    slug: "venture-scouts",
    name: "Venture Scouts",
    shortName: "Scouts",
    title: "Deal Flow Sourcing for Venture Scouts — GitHub Momentum as a Lead Indicator",
    metaDescription:
      "Venture scouts use GitHub engineering acceleration to find startups before partners do. Free weekly rankings across 20 sectors, MCP server for Claude Desktop.",
    h1: "Deal Flow Sourcing for Venture Scouts",
    tagline:
      "Use GitHub engineering acceleration to surface deals before the partners you scout for do — with a reproducible, data-driven sourcing edge.",
    intro:
      "Scouts live on speed and pattern recognition. The startups that show engineering acceleration today are the ones partners see decks for in six weeks. VC Deal Flow Signal gives scouts a reproducible, data-driven sourcing edge — free, with an MCP server that plugs directly into Claude Desktop for natural-language deal screening.",
    workflows: [
      {
        name: "Natural-language deal screening",
        description: "Install the MCP server in Claude Desktop and ask 'which fintech startups are accelerating this week?' — Claude queries the live dataset and returns ranked results.",
        primaryPath: "/developers",
        secondaryPaths: ["/developers"],
      },
      {
        name: "Sector-filtered sourcing lists",
        description: "Generate weekly sourcing lists by sector, sorted by commit-velocity change. Each /sector hub lists 5-15 curated companies with one-click deep dives.",
        primaryPath: "/sector",
        secondaryPaths: ["/sector/fintech", "/sector/ai-ml"],
      },
      {
        name: "Scout Score for founder evaluation",
        description: "Compute a 0-100 Scout Score from any founder's GitHub starring history. Higher scores correlate with validated unicorn-taste patterns.",
        primaryPath: "/receipts",
        secondaryPaths: ["/receipts"],
      },
    ],
    quickStart: [
      { label: "Install MCP server", path: "/developers" },
      { label: "Sector rankings", path: "/sector" },
      { label: "Scout Score", path: "/receipts" },
    ],
    whyEngineeringSignals:
      "Scouts need to bring deal flow to partners faster than the partner's own network surfaces it. Code-side sourcing is the rare channel where a scout's GitHub literacy is the differentiator — partners without technical depth can't replicate this sourcing motion.",
    whatItDoesNotSolve:
      "Engineering signals don't solve partner relationship management or fund politics. They are a sourcing-quality signal, not an internal-advocacy tool.",
    faqs: [
      { question: "How does the MCP server work for deal screening?", answer: "Install @gitdealflow/mcp-signal via npx in Claude Desktop. Then ask natural-language questions like 'which cybersecurity startups had a hiring burst this week?' and Claude queries the live dataset." },
      { question: "Can I use this to build a deal-flow tracker?", answer: "Yes. The JSON API (/api/signals.json) and CSV export are free, no auth. Pull them into Notion, Airtable, or any CRM." },
      { question: "Is this free for scouts?", answer: "Yes — all free. The MCP server, dataset, API, and weekly rankings are free forever." },
    ],
    ctaPath: "/developers",
    ctaLabel: "Install the MCP Server",
  },
  {
    slug: "solo-gps",
    name: "Solo GPs",
    shortName: "Solo GPs",
    title: "Deal Flow Tools for Solo GPs — GitHub Signals Before the Deck Arrives",
    metaDescription:
      "Solo general partners use public GitHub momentum data to source deals before institutional rounds. Free dataset, CSV export, API access.",
    h1: "Deal Flow Tools for Solo GPs",
    tagline:
      "Level the playing field against established funds with a single dataset that surfaces breakout startups across 20 sectors every week.",
    intro:
      "Solo GPs don't have a sourcing team. GitHub engineering signals level the playing field — a single dataset that surfaces breakout startups across 20 sectors every week, before the round is live. No expensive Bloomberg terminal, no analyst subscriptions. Just public code, measured.",
    workflows: [
      {
        name: "Full dataset export for CRM pipeline",
        description: "Export the complete signal dataset as JSON, CSV, or NDJSON. Plug into your own pipeline or CRM — Affinity, HubSpot, Notion, or a custom dashboard.",
        primaryPath: "/dataset",
        secondaryPaths: ["/dataset", "/api/openapi.json"],
      },
      {
        name: "Custom sector deep-dive reports",
        description: "Order a deep written report on any one sector — the Custom Sector Sweep includes per-company engineering profiles, trajectory analysis, and fundraise-window predictions.",
        primaryPath: "/firstlook",
        secondaryPaths: ["/firstlook"],
      },
      {
        name: "API access for automated dashboards",
        description: "Build automated deal-flow dashboards with the OpenAPI 3.1 spec. No auth required — just fetch the JSON endpoint on a schedule.",
        primaryPath: "/developers",
        secondaryPaths: ["/developers", "/api/openapi.json"],
      },
    ],
    quickStart: [
      { label: "Export dataset", path: "/dataset" },
      { label: "API docs", path: "/developers" },
      { label: "Sector sweep", path: "/firstlook" },
    ],
    whyEngineeringSignals:
      "Solo GPs compete against firms with 20-person sourcing teams. Code-side sourcing turns a solo operator's GitHub literacy into a structural advantage — the same data that a 20-person team would spend weeks collecting is available as a single weekly export.",
    whatItDoesNotSolve:
      "Engineering signals don't replace investment judgment, portfolio management, or LP relations. They are a sourcing accelerator, not a full investing platform.",
    faqs: [
      { question: "Can I export the dataset into my own pipeline?", answer: "Yes. JSON, CSV, and NDJSON exports are free at /dataset. The OpenAPI spec at /api/openapi.json documents all endpoints." },
      { question: "How accurate is the stage classification?", answer: "Stage is estimated from contributor count, team-size enrichment data, and funding history where publicly available. See /methodology for the full classification methodology." },
      { question: "Is there a paid tier for solo GPs?", answer: "The dataset and API are free. The Custom Sector Sweep (€1,997 once) and Insider Circle (€97/month) are additive paid offerings." },
    ],
    ctaPath: "/dataset",
    ctaLabel: "Export the Dataset",
  },
  {
    slug: "family-offices",
    name: "Family Offices",
    shortName: "Family Offices",
    title: "Startup Engineering Momentum Data for Family Offices — Quantitative Venture Sourcing",
    metaDescription:
      "Family offices use GitHub commit velocity as a quantitative pre-fundraise signal. Free weekly rankings, SSRN-validated methodology, CC BY 4.0 dataset.",
    h1: "Quantitative Venture Sourcing for Family Offices",
    tagline:
      "Reproducible, defensible sourcing signals for investment committees — grounded in a longitudinal panel with an SSRN preprint and CC BY 4.0 dataset.",
    intro:
      "Family offices need reproducible, defensible sourcing signals — not vibes. VC Deal Flow Signal provides a longitudinal panel of GitHub engineering velocity, validated against 30 atomic findings in an SSRN preprint. Every metric links back to a public GitHub source.",
    workflows: [
      {
        name: "Investment-committee-grade methodology",
        description: "The SSRN preprint (DOI: 10.2139/ssrn.6606558) documents the empirical relationship between commit-velocity and fundraise timing. Citation-ready for IC memos.",
        primaryPath: "/methodology",
        secondaryPaths: ["/methodology", "/citation-guide"],
      },
      {
        name: "Open dataset for internal analysis",
        description: "The full dataset is CC BY 4.0 licensed — no vendor lock-in, no subscription dependency. Download as CSV/JSON for internal analysis or archive.",
        primaryPath: "/dataset",
        secondaryPaths: ["/dataset"],
      },
      {
        name: "30 peer-reviewable research findings",
        description: "The /research pages document 30 atomic findings with external scholarly citations. Each finding is independently verifiable and links to its source data.",
        primaryPath: "/research",
        secondaryPaths: ["/research"],
      },
    ],
    quickStart: [
      { label: "Published methodology", path: "/methodology" },
      { label: "Open dataset", path: "/dataset" },
      { label: "Research findings", path: "/research" },
    ],
    whyEngineeringSignals:
      "Family offices answer to investment committees that demand reproducible, defensible sourcing methodology. The SSRN preprint, CC BY 4.0 license, and documented methodology satisfy IC due-diligence requirements that proprietary data products (Crunchbase, PitchBook) cannot match — because those products gate replication behind enterprise licenses.",
    whatItDoesNotSolve:
      "Engineering signals don't address non-technical investments (real estate, consumer brands, services). They are most powerful at the SaaS / infrastructure / developer-tools intersection where GitHub activity is a meaningful proxy for company momentum.",
    faqs: [
      { question: "Can we cite this in investment committee materials?", answer: "Yes. The SSRN paper (DOI: 10.2139/ssrn.6606558) is citation-ready. CC BY 4.0 explicitly permits internal IC use with attribution." },
      { question: "How is this different from PitchBook?", answer: "PitchBook documents what happened (after the fact). We document what's about to happen (3-6 weeks before). Complementary, not competitive." },
      { question: "Is the dataset suitable for quantitative analysis?", answer: "Yes. JSON, CSV, NDJSON formats with documented schema. Weekly time series available for longitudinal analysis." },
    ],
    ctaPath: "/methodology",
    ctaLabel: "Read the Methodology",
  },
];

export function getAllPersonaSlugs(): string[] {
  return PERSONAS.map((p) => p.slug);
}

export function getPersona(slug: string): Persona | undefined {
  return PERSONAS.find((p) => p.slug === slug);
}
