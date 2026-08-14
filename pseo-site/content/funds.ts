/**
 * /fund/[slug] entity pages, per-fund deal-flow context pages.
 *
 * Seed corpus of well-known venture funds. Each entry powers one
 * /fund/{slug} page that describes the fund's public thesis, stage focus,
 * and how engineering-acceleration signals from VC Deal Flow Signal map
 * to their sourcing.
 *
 * This is NOT a portfolio scrape and does NOT publish any private fund
 * data. Every fact is derivable from the fund's own public website,
 * Crunchbase profile, or partner blog posts.
 *
 * Greg-Isenberg framing: these pages double as Marcus-100 outreach hooks.
 * Each page is a "we built a public surface tracking the engineering
 * signals that match your published thesis, does this look right?"
 * conversation starter.
 */

export interface FundFAQ {
  question: string;
  answer: string;
}

export interface Fund {
  slug: string;
  name: string;
  homepageUrl: string;
  hq: string;
  stageFocus: string;
  description: string;
  // SEO surfaces
  title: string;
  metaDescription: string;
  h1: string;
  tagline: string;
  intro: string;
  thesis: string;
  signalMap: string;
  whyEngineeringSignals: string;
  faqs: FundFAQ[];
  relatedSectors: string[];
}

function build(f: {
  slug: string;
  name: string;
  homepage: string;
  hq: string;
  stage: string;
  thesis: string;
  related: string[];
  what: string;
}): Fund {
  return {
    slug: f.slug,
    name: f.name,
    homepageUrl: f.homepage,
    hq: f.hq,
    stageFocus: f.stage,
    description: `${f.name} is a ${f.hq}-based venture fund focused on ${f.stage}. ${f.what}`,
    title: `${f.name}, Deal Flow Context & Engineering Signal Map (2026)`,
    metaDescription: `${f.name} thesis, stage focus, and how GitHub engineering-acceleration signals map to their sourcing process. Built for emerging managers and operators studying ${f.name}'s public investment patterns.`,
    h1: `${f.name} Deal Flow Context`,
    tagline: `${f.name}'s public thesis mapped against engineering-acceleration signals, for emerging managers, operators, and LPs studying their sourcing.`,
    intro: `${f.name} is a ${f.hq}-based venture fund whose public thesis centers on ${f.stage}. ${f.what} This page summarizes the fund's publicly stated focus and maps it against the engineering-acceleration signal panel we publish at VC Deal Flow Signal, what the fund looks for, what GitHub data tends to correlate, and where the signal model would (and would not) be useful in their workflow.`,
    thesis: `${f.thesis}`,
    signalMap: `Engineering-acceleration signals most aligned with ${f.name}'s stage focus: commit velocity (rolling 4-week vs trailing 12-week median), contributor influx, repo creation pulse, and infrastructure repo buildouts. For ${f.stage}, the highest-information windows are typically the 6-12 weeks preceding a fundraise announcement, early enough to source, late enough to validate that the engineering team is real.`,
    whyEngineeringSignals: `${f.name}'s investment cadence in technical categories is well-suited to a quantitative pre-announcement signal. The six-signal panel published in /methodology is empirically tied to imminent fundraise probability for early-stage technical startups (see SSRN paper 6606558). Funds in ${f.name}'s segment use this kind of signal as a first-pass filter against the broader public-GitHub population, then layer their own qualitative judgment on the shortlist.`,
    faqs: [
      {
        question: `Is this page affiliated with ${f.name}?`,
        answer: `No. This page is an independent summary of ${f.name}'s publicly stated investment thesis and a mapping against our engineering-acceleration signal panel. ${f.name} has not endorsed, paid for, or reviewed this page. All facts are derivable from their own public website and partner-authored materials.`,
      },
      {
        question: `Where does the signal data come from?`,
        answer: `Public GitHub events only, commits, PRs, issues, releases, contributors. Aggregated weekly. Methodology is open at /methodology and the underlying paper is at SSRN 6606558. Raw aggregates ship via the public MCP server at /api/v1.`,
      },
      {
        question: `How can a fund use this signal in practice?`,
        answer: `Two common workflows: (1) Source, a weekly digest of technical startups whose engineering acceleration matches your stage and sector filters, delivered before competitive rounds form. (2) Validate, given a deal already in your pipeline, retrieve the public engineering trajectory to inform diligence. See /firstlook for the source workflow and /developers for the validate-by-API workflow.`,
      },
      {
        question: `Why ${f.name} specifically?`,
        answer: `Funds in ${f.name}'s segment publish enough thesis material on their own site that an external observer can map their stated interests against quantitative signal sources without scraping anything private. This page does that mapping; it does not claim insider knowledge of their portfolio decisions.`,
      },
    ],
    relatedSectors: f.related,
  };
}

export const funds: Fund[] = [
  build({
    slug: "sequoia",
    name: "Sequoia Capital",
    homepage: "https://www.sequoiacap.com",
    hq: "Menlo Park",
    stage: "seed through growth, AI and enterprise software-heavy",
    thesis: "Sequoia publishes a multi-decade thesis on outlier founders building enduring, often category-defining companies. Recent partner writing emphasizes AI-native infrastructure, vertical AI, and platform shifts in enterprise software. Their Arc and Scout programs widen sourcing into pre-seed.",
    related: ["ai-ml", "enterprise-saas", "developer-tools", "infrastructure"],
    what: "Sequoia is one of the most prolific check-writers across stages and one of the most visible thesis publishers in tech venture.",
  }),
  build({
    slug: "andreessen-horowitz",
    name: "Andreessen Horowitz",
    homepage: "https://a16z.com",
    hq: "Menlo Park",
    stage: "seed through growth across multiple verticals",
    thesis: "a16z publishes vertical-specific theses, American Dynamism, AI, Crypto, Bio + Health, Consumer, Games, Enterprise, Fintech. The general partner pool is sector-specialized; each vertical has its own publishing cadence and sourcing surface.",
    related: ["ai-ml", "developer-tools", "infrastructure", "fintech", "consumer", "gaming"],
    what: "a16z combines breadth of vertical funds with a high-volume operator-content strategy, their blog and podcast network is itself a deal-flow surface.",
  }),
  build({
    slug: "benchmark",
    name: "Benchmark Capital",
    homepage: "https://www.benchmark.com",
    hq: "San Francisco",
    stage: "early-stage (Series A primarily)",
    thesis: "Benchmark runs a flat-partnership structure with concentrated portfolios, fewer, larger early-stage bets where every partner is on the cap table of every deal. Public posture skews toward category-defining founders in B2B and consumer.",
    related: ["enterprise-saas", "consumer", "developer-tools"],
    what: "Benchmark is one of the most concentrated and operationally hands-on Series-A funds; partner-written content is sparse but consistent.",
  }),
  build({
    slug: "founders-fund",
    name: "Founders Fund",
    homepage: "https://foundersfund.com",
    hq: "San Francisco",
    stage: "seed through growth, contrarian-thesis",
    thesis: "Founders Fund publishes a contrarian-thesis posture, frontier technology bets, public-sector tech, defense, biotech, space. Manifesto-style essays from the partnership define the brand more than blog content does.",
    related: ["ai-ml", "frontier-tech", "infrastructure", "defense", "biotech"],
    what: "Founders Fund is one of the most thesis-heavy public funds in venture; their partners' essays explicitly anchor sourcing decisions.",
  }),
  build({
    slug: "greylock",
    name: "Greylock Partners",
    homepage: "https://greylock.com",
    hq: "Menlo Park",
    stage: "seed through Series B in enterprise and AI",
    thesis: "Greylock's published thesis emphasizes AI-native applications, infrastructure, and enterprise productivity. Partner-led essays cover go-to-market patterns for technical founders and category-design playbooks.",
    related: ["ai-ml", "enterprise-saas", "infrastructure", "developer-tools"],
    what: "Greylock combines a strong EIR program with a high-quality partner-content surface; sourcing concentration is heavy in AI and enterprise.",
  }),
  build({
    slug: "lightspeed",
    name: "Lightspeed Venture Partners",
    homepage: "https://lsvp.com",
    hq: "Menlo Park",
    stage: "seed through growth across multiple geographies",
    thesis: "Lightspeed publishes a multi-vertical thesis across enterprise, consumer, fintech, healthcare, and a strong India and Israel sourcing footprint. AI-infrastructure and developer-tools sourcing has compounded in their recent fund cycles.",
    related: ["ai-ml", "enterprise-saas", "fintech", "developer-tools", "consumer"],
    what: "Lightspeed is one of the most globally distributed early-stage funds, their per-geography partner pages explicitly publish thesis statements.",
  }),
  build({
    slug: "accel",
    name: "Accel",
    homepage: "https://www.accel.com",
    hq: "Palo Alto",
    stage: "seed through Series B across multiple geographies",
    thesis: "Accel publishes a 'prepared mind' sourcing thesis, partners specialize ahead of market shifts. Recent public writing centers on AI infrastructure, vertical software, and European founder strength.",
    related: ["ai-ml", "enterprise-saas", "developer-tools", "infrastructure"],
    what: "Accel is one of the longest-running early-stage funds; their European and Indian sourcing footprints are particularly active.",
  }),
  build({
    slug: "bessemer",
    name: "Bessemer Venture Partners",
    homepage: "https://www.bvp.com",
    hq: "Menlo Park",
    stage: "seed through growth, vertical-software-heavy",
    thesis: "Bessemer's State of the Cloud annual report and Roadmap essays publicly define their thesis. Strong sourcing in cloud-native B2B, developer tools, and healthcare software.",
    related: ["enterprise-saas", "developer-tools", "infrastructure", "healthcare"],
    what: "Bessemer publishes more durable thesis content per partner than almost any other firm; this is a sourcing surface in itself.",
  }),
  build({
    slug: "index-ventures",
    name: "Index Ventures",
    homepage: "https://www.indexventures.com",
    hq: "London / San Francisco",
    stage: "seed through Series B across enterprise and consumer",
    thesis: "Index publishes a transatlantic thesis with strong European-founder sourcing. Recent partner essays emphasize AI-native enterprise software, fintech infrastructure, and developer tools.",
    related: ["ai-ml", "enterprise-saas", "fintech", "developer-tools"],
    what: "Index is one of the most active US/Europe-bridge funds; their multi-office structure shapes a distinct sourcing pattern.",
  }),
  build({
    slug: "iconiq",
    name: "ICONIQ Capital",
    homepage: "https://www.iconiqcapital.com",
    hq: "San Francisco",
    stage: "growth-stage enterprise software primarily",
    thesis: "ICONIQ Growth invests in late-stage B2B software with a heavy focus on infrastructure, vertical SaaS, and AI-native applications.",
    related: ["enterprise-saas", "ai-ml", "infrastructure"],
    what: "ICONIQ Growth is one of the most concentrated late-stage enterprise-software funds; their portfolio appears as a stage benchmark in many emerging-manager LP decks.",
  }),
  build({
    slug: "coatue",
    name: "Coatue",
    homepage: "https://www.coatue.com",
    hq: "New York",
    stage: "growth through public",
    thesis: "Coatue runs a crossover thesis, late-stage private plus public. Their TMT focus centers on AI, semiconductors, and software platforms.",
    related: ["ai-ml", "enterprise-saas", "infrastructure", "semiconductors"],
    what: "Coatue is one of the most-cited crossover funds; their public-equity research surface informs their private sourcing in TMT.",
  }),
  build({
    slug: "insight-partners",
    name: "Insight Partners",
    homepage: "https://www.insightpartners.com",
    hq: "New York",
    stage: "growth-stage software (Series B through public)",
    thesis: "Insight publishes a 'ScaleUp' thesis, high-conviction growth-stage software, with a substantial Onsite operating team that supports portfolio companies post-investment.",
    related: ["enterprise-saas", "developer-tools", "fintech", "ai-ml"],
    what: "Insight is one of the largest growth-stage software funds; their published Onsite content is a significant operator-content surface.",
  }),
  build({
    slug: "general-catalyst",
    name: "General Catalyst",
    homepage: "https://www.generalcatalyst.com",
    hq: "Cambridge / San Francisco",
    stage: "seed through growth across multiple verticals",
    thesis: "GC publishes an 'Applied AI' thesis with strong sourcing in defense, healthcare, fintech, and enterprise software. Their Health Assurance and Global Resilience theses are explicit categories.",
    related: ["ai-ml", "healthcare", "fintech", "defense", "enterprise-saas"],
    what: "GC has one of the most distinctive published category-design postures; their thesis essays explicitly anchor multi-fund sourcing.",
  }),
  build({
    slug: "nea",
    name: "New Enterprise Associates",
    homepage: "https://www.nea.com",
    hq: "Menlo Park",
    stage: "seed through growth across tech and healthcare",
    thesis: "NEA publishes parallel tech and healthcare theses. Their tech focus centers on enterprise software, AI infrastructure, and developer tools.",
    related: ["enterprise-saas", "ai-ml", "developer-tools", "healthcare"],
    what: "NEA is one of the largest multi-stage funds; their healthcare and tech arms operate as parallel sourcing organizations.",
  }),
  build({
    slug: "google-ventures",
    name: "GV (Google Ventures)",
    homepage: "https://www.gv.com",
    hq: "Mountain View",
    stage: "seed through Series C across life sciences and tech",
    thesis: "GV publishes parallel life-sciences and tech theses. Their tech focus has strengthened in AI infrastructure and developer tools through the 2024-2026 fund cycles.",
    related: ["ai-ml", "developer-tools", "infrastructure", "life-sciences"],
    what: "GV is one of the most active corporate-strategic funds with a particularly strong life-sciences sourcing footprint.",
  }),
  build({
    slug: "khosla-ventures",
    name: "Khosla Ventures",
    homepage: "https://www.khoslaventures.com",
    hq: "Menlo Park",
    stage: "seed through growth, deep-tech and frontier",
    thesis: "Khosla publishes a frontier-tech-heavy thesis, AI, climate, biotech, fusion, agriculture. Partner-written essays emphasize 'unreasonable' technical bets on category-defining technology shifts.",
    related: ["ai-ml", "climate", "biotech", "frontier-tech"],
    what: "Khosla is one of the most distinctive frontier-tech funds; sourcing skews toward technical founders with deep domain expertise.",
  }),
  build({
    slug: "founders-inc",
    name: "Founders Inc",
    homepage: "https://www.f.inc",
    hq: "San Francisco",
    stage: "pre-seed and seed",
    thesis: "Founders Inc publishes an operator-content-heavy thesis with sourcing across consumer, AI, and developer tools. Strong studio/incubator overlay on top of fund operations.",
    related: ["ai-ml", "consumer", "developer-tools"],
    what: "Founders Inc combines fund and studio operations with one of the most visible operator-content surfaces in pre-seed venture.",
  }),
  build({
    slug: "initialized",
    name: "Initialized Capital",
    homepage: "https://initialized.com",
    hq: "San Francisco",
    stage: "seed (rare Series A)",
    thesis: "Initialized publishes a seed-only concentration thesis with strong technical-founder bias. Heavy sourcing in AI infrastructure, developer tools, and consumer-tech.",
    related: ["ai-ml", "developer-tools", "consumer"],
    what: "Initialized is one of the most concentrated seed-only funds with sourcing roots in the YC network.",
  }),
  build({
    slug: "nfx",
    name: "NFX",
    homepage: "https://www.nfx.com",
    hq: "San Francisco",
    stage: "seed and pre-seed across multiple verticals",
    thesis: "NFX publishes the canonical 'network effects' thesis. Their essay surface (Brief, Manual) anchors a heavy operator-content sourcing strategy.",
    related: ["consumer", "marketplaces", "ai-ml", "fintech"],
    what: "NFX has one of the most distinct published thesis surfaces in seed venture, the Network Effects Manual is a permanent reference for the category.",
  }),
  build({
    slug: "first-round",
    name: "First Round Capital",
    homepage: "https://firstround.com",
    hq: "San Francisco",
    stage: "seed and pre-seed",
    thesis: "First Round publishes the First Round Review, one of the longest-running operator-content surfaces in venture. Sourcing skews B2B SaaS, developer tools, and consumer.",
    related: ["enterprise-saas", "developer-tools", "consumer"],
    what: "First Round Review predates most modern venture-content surfaces; the publication itself is part of their sourcing strategy.",
  }),
  build({
    slug: "pear-vc",
    name: "Pear VC",
    homepage: "https://pear.vc",
    hq: "Palo Alto",
    stage: "pre-seed and seed",
    thesis: "Pear publishes a deep-tech and Stanford-network thesis with strong founder-fellowship programs. Sourcing concentrates around technical founders with strong domain backgrounds.",
    related: ["ai-ml", "biotech", "developer-tools", "infrastructure"],
    what: "Pear's founder-fellowship and Stanford ties make it one of the most concentrated technical-founder pre-seed sources.",
  }),
  build({
    slug: "pioneer-fund",
    name: "Pioneer Fund",
    homepage: "https://pioneer.app",
    hq: "Distributed",
    stage: "pre-seed (tournament-based sourcing)",
    thesis: "Pioneer runs a public tournament that sources pre-seed companies globally. The thesis is platform-agnostic, strong founder signal + early-product traction.",
    related: ["consumer", "developer-tools", "ai-ml"],
    what: "Pioneer is one of the most-distinct pre-seed sourcing surfaces, the public tournament itself is the funnel.",
  }),
  build({
    slug: "ycombinator",
    name: "Y Combinator",
    homepage: "https://www.ycombinator.com",
    hq: "San Francisco",
    stage: "pre-seed accelerator (batches)",
    thesis: "YC publishes a permanent open thesis through Requests for Startups and partner-authored essays. The accelerator itself is the sourcing engine.",
    related: ["ai-ml", "developer-tools", "enterprise-saas", "consumer", "fintech"],
    what: "YC is the longest-running and most-cited accelerator; its batch demo days are themselves a category-defining sourcing surface.",
  }),
  build({
    slug: "techstars",
    name: "Techstars",
    homepage: "https://www.techstars.com",
    hq: "Distributed (city programs)",
    stage: "pre-seed accelerator",
    thesis: "Techstars runs city- and vertical-specific accelerator programs with partner-authored thesis surfaces per program.",
    related: ["enterprise-saas", "developer-tools", "consumer", "ai-ml"],
    what: "Techstars is one of the most geographically distributed accelerator networks; per-city programs operate as semi-independent sourcing units.",
  }),
  build({
    slug: "500-global",
    name: "500 Global",
    homepage: "https://500.co",
    hq: "San Francisco",
    stage: "pre-seed and seed globally",
    thesis: "500 runs a globally distributed pre-seed and seed thesis with strong emerging-markets sourcing. Per-geography programs publish localized investment criteria.",
    related: ["consumer", "fintech", "developer-tools", "ai-ml"],
    what: "500 is one of the highest-volume globally distributed early-stage funds; their geographic concentration is distinct from peer Silicon-Valley funds.",
  }),
  build({
    slug: "village-global",
    name: "Village Global",
    homepage: "https://www.villageglobal.vc",
    hq: "San Francisco",
    stage: "pre-seed and seed across verticals",
    thesis: "Village Global runs a Venture Partner Network model, operators and founders source on behalf of the fund. Thesis surface skews toward AI applications and developer tools.",
    related: ["ai-ml", "developer-tools", "consumer", "enterprise-saas"],
    what: "Village's Venture Partner Network is one of the more distinctive sourcing models in seed venture.",
  }),
  build({
    slug: "boost-vc",
    name: "Boost VC",
    homepage: "https://www.boost.vc",
    hq: "San Mateo",
    stage: "pre-seed accelerator with frontier-tech focus",
    thesis: "Boost publishes a frontier-tech thesis, VR/AR, biotech, space, crypto, AI. Their accelerator program runs in cohorts with a strong sci-fi sourcing posture.",
    related: ["frontier-tech", "ai-ml", "biotech"],
    what: "Boost is one of the most distinctive frontier-tech pre-seed programs; the founder Adam Draper anchors the public thesis.",
  }),
  build({
    slug: "haystack",
    name: "Haystack",
    homepage: "https://www.haystack.vc",
    hq: "San Francisco",
    stage: "seed primarily",
    thesis: "Haystack publishes a founder-content-heavy seed thesis run by Semil Shah. Sourcing concentrates on early-stage founders before broader market awareness.",
    related: ["enterprise-saas", "consumer", "developer-tools"],
    what: "Haystack is one of the most distinctive solo-GP-style funds; their public-content surface anchors a high-volume sourcing model.",
  }),
  build({
    slug: "susa-ventures",
    name: "Susa Ventures",
    homepage: "https://www.susaventures.com",
    hq: "San Francisco",
    stage: "seed primarily",
    thesis: "Susa publishes a 'real businesses' seed thesis, capital-efficient, sustainable revenue models, often B2B and developer tools.",
    related: ["enterprise-saas", "developer-tools", "fintech"],
    what: "Susa is one of the more distinctive sustainable-growth seed funds with a strong B2B sourcing footprint.",
  }),
  build({
    slug: "hustle-fund",
    name: "Hustle Fund",
    homepage: "https://www.hustlefund.vc",
    hq: "San Francisco",
    stage: "pre-seed",
    thesis: "Hustle Fund publishes a 'hustle' thesis, high-volume pre-seed bets on go-to-market-first founders. Strong operator-content presence through partner publishing.",
    related: ["consumer", "enterprise-saas", "fintech"],
    what: "Hustle Fund's high-volume pre-seed model and operator-content presence make it one of the more distinct emerging-manager funds.",
  }),
  // ───────────────────────── 2026-05-28 funds expansion (15 funds) ─────────────────────────
  build({
    slug: "tiger-global",
    name: "Tiger Global",
    homepage: "https://www.tigerglobal.com",
    hq: "New York",
    stage: "growth through pre-IPO",
    thesis: "Tiger Global publishes a thesis of high-velocity, multi-stage capital deployment across software, internet, and consumer. Distinctive for fast-decision growth-round leadership during 2020-2021; pulled back significantly in 2023-2024.",
    related: ["ai-ml", "enterprise-saas", "developer-tools", "fintech", "consumer", "infrastructure"],
    what: "Tiger Global is one of the most prolific crossover investors, with public participation in dozens of category-defining venture rounds.",
  }),
  build({
    slug: "thrive-capital",
    name: "Thrive Capital",
    homepage: "https://thrivecap.com",
    hq: "New York",
    stage: "series A through growth",
    thesis: "Thrive Capital (Joshua Kushner) publishes a concentrated thesis on category-defining founders across consumer internet, fintech, and AI. Recent emphasis on frontier AI and developer infrastructure.",
    related: ["ai-ml", "enterprise-saas", "consumer", "fintech", "infrastructure"],
    what: "Thrive has one of the most concentrated growth portfolios in tech venture, with publicly known positions across the frontier AI and category-defining consumer waves.",
  }),
  build({
    slug: "ribbit-capital",
    name: "Ribbit Capital",
    homepage: "https://ribbitcap.com",
    hq: "Palo Alto",
    stage: "seed through pre-IPO",
    thesis: "Ribbit publishes a global-fintech-first thesis spanning payments, banking infrastructure, lending, and crypto. Strong international footprint with positions across LATAM, SEA, and EU fintech.",
    related: ["fintech", "developer-tools"],
    what: "Ribbit is the most globally-distributed fintech-focused fund, with public positions across major fintech category leaders.",
  }),
  build({
    slug: "battery-ventures",
    name: "Battery Ventures",
    homepage: "https://www.battery.com",
    hq: "Boston",
    stage: "seed through growth",
    thesis: "Battery publishes a multi-vertical thesis with strong B2B software, infrastructure, industrial tech, and consumer angles. Distinct for partner-publishing cadence and operator-style portfolio support.",
    related: ["enterprise-saas", "developer-tools", "infrastructure", "ai-ml"],
    what: "Battery is one of the longest-running multi-stage venture firms, with broad sector coverage and a strong partner-published thesis surface.",
  }),
  build({
    slug: "spark-capital",
    name: "Spark Capital",
    homepage: "https://www.sparkcapital.com",
    hq: "San Francisco",
    stage: "seed through growth",
    thesis: "Spark publishes a thesis on category-defining consumer and B2B software. Notable for early Twitter, Slack, Discord, and frontier AI positions; distinctive for concentrated partner-led conviction model.",
    related: ["ai-ml", "consumer", "enterprise-saas", "developer-tools"],
    what: "Spark Capital has one of the most distinctive concentrated-conviction sourcing motions in venture.",
  }),
  build({
    slug: "redpoint-ventures",
    name: "Redpoint Ventures",
    homepage: "https://www.redpoint.com",
    hq: "Menlo Park",
    stage: "seed through growth",
    thesis: "Redpoint publishes a thesis covering enterprise software, infrastructure, consumer internet, and crypto. Long-running multi-stage model with strong operator-content surface through partner blogs.",
    related: ["enterprise-saas", "developer-tools", "infrastructure", "ai-ml"],
    what: "Redpoint is one of the longer-running multi-stage venture firms with broad sector coverage.",
  }),
  build({
    slug: "emergence-capital",
    name: "Emergence Capital",
    homepage: "https://www.emcap.com",
    hq: "San Mateo",
    stage: "series A through growth",
    thesis: "Emergence publishes a B2B-SaaS-exclusive thesis. The most concentrated SaaS-only fund of meaningful size; notable Salesforce, Veeva, Zoom, Box, ServiceTitan investor.",
    related: ["enterprise-saas", "developer-tools"],
    what: "Emergence is the dominant SaaS-pure-play venture firm; their portfolio anchors the modern B2B SaaS category.",
  }),
  build({
    slug: "usv",
    name: "Union Square Ventures",
    homepage: "https://www.usv.com",
    hq: "New York",
    stage: "seed through series A",
    thesis: "USV publishes a thesis on network effects, marketplaces, decentralized protocols, and learning systems. One of the most published thesis-driven venture firms; partners write extensively on their blog.",
    related: ["consumer", "fintech", "developer-tools", "enterprise-saas"],
    what: "USV anchors much of the modern thesis-driven venture-publishing tradition; their early Twitter, Etsy, Stripe, Cloudflare positions defined a generation of network-effects investing.",
  }),
  build({
    slug: "menlo-ventures",
    name: "Menlo Ventures",
    homepage: "https://menlovc.com",
    hq: "San Francisco",
    stage: "series A through growth",
    thesis: "Menlo publishes a multi-vertical thesis with AI, B2B SaaS, fintech, and consumer angles. Notable for early Anthropic position and partner-published AI thesis cadence.",
    related: ["ai-ml", "enterprise-saas", "fintech", "consumer"],
    what: "Menlo is one of the longest-running venture firms with broad multi-stage coverage and a strong AI-thesis publishing footprint.",
  }),
  build({
    slug: "altimeter-capital",
    name: "Altimeter Capital",
    homepage: "https://www.altimetercap.com",
    hq: "Menlo Park",
    stage: "growth through pre-IPO",
    thesis: "Altimeter (Brad Gerstner) publishes a thesis on category-defining technology compounders. Distinctive crossover model with public-equity and venture-stage participation. Notable for Snowflake, MongoDB, Crowdstrike positions.",
    related: ["ai-ml", "enterprise-saas", "infrastructure"],
    what: "Altimeter is one of the most visible crossover funds, with strong partner-publishing cadence and visible public-equity positions on top of venture-stage bets.",
  }),
  build({
    slug: "dst-global",
    name: "DST Global",
    homepage: "https://dst-global.com",
    hq: "Hong Kong / London",
    stage: "growth through pre-IPO",
    thesis: "DST Global (Yuri Milner) publishes a global thesis on consumer internet platforms, social networks, fintech, and AI. Distinctive for international growth-round leadership across Asia, Europe, and the Americas.",
    related: ["ai-ml", "consumer", "fintech"],
    what: "DST Global is the most internationally-distributed growth investor in technology venture, with positions in Facebook, Twitter, Spotify, Stripe, and frontier AI labs.",
  }),
  build({
    slug: "m12",
    name: "M12 (Microsoft Ventures)",
    homepage: "https://m12.vc",
    hq: "Seattle",
    stage: "series A through growth",
    thesis: "M12 publishes a corporate-venture thesis aligned with Microsoft's strategic priorities, AI, enterprise infrastructure, security, and developer tools. Distinct from arms-length VC for its M&A optionality.",
    related: ["ai-ml", "developer-tools", "infrastructure", "enterprise-saas"],
    what: "M12 is Microsoft's strategic venture arm; their public investments often signal Microsoft's strategic interest in adjacent categories.",
  }),
  build({
    slug: "intel-capital",
    name: "Intel Capital",
    homepage: "https://www.intelcapital.com",
    hq: "Santa Clara",
    stage: "seed through growth",
    thesis: "Intel Capital publishes a deep-tech thesis spanning silicon, AI hardware, networking, edge compute, and infrastructure software. One of the longest-running corporate venture programs.",
    related: ["ai-infra", "ai-ml", "infrastructure", "developer-tools"],
    what: "Intel Capital has invested in over 2,000 companies; the deep-tech thesis especially relevant to silicon-adjacent and AI-infra categories.",
  }),
  build({
    slug: "salesforce-ventures",
    name: "Salesforce Ventures",
    homepage: "https://salesforceventures.com",
    hq: "San Francisco",
    stage: "series A through growth",
    thesis: "Salesforce Ventures publishes a strategic-venture thesis aligned with Salesforce's Customer 360 platform, AI, enterprise SaaS, developer tools, vertical SaaS. Strong AppExchange integration angle for portfolio companies.",
    related: ["ai-ml", "enterprise-saas", "developer-tools"],
    what: "Salesforce Ventures is one of the largest enterprise-software CVCs, with explicit AppExchange-distribution leverage for portfolio companies.",
  }),
  build({
    slug: "lux-capital",
    name: "Lux Capital",
    homepage: "https://www.luxcapital.com",
    hq: "New York / Menlo Park",
    stage: "seed through growth",
    thesis: "Lux Capital (Josh Wolfe) publishes a deep-tech, frontier-science thesis, quantum, robotics, defense tech, healthcare AI, frontier ML. The most concentrated deep-tech fund of meaningful size.",
    related: ["ai-ml", "ai-infra", "frontier-tech", "defense", "biotech"],
    what: "Lux Capital is the dominant deep-tech VC; their portfolio anchors much of the frontier-science and defense-tech venture landscape.",
  }),

  // --- Gaming / interactive-entertainment funds ---
  build({
    slug: "konvoy",
    name: "Konvoy Ventures",
    homepage: "https://www.konvoy.vc",
    hq: "Denver",
    stage: "pre-seed through Series A, gaming and interactive entertainment",
    thesis: "Konvoy is a thesis-driven firm investing in the platforms and technologies of interactive entertainment, game infrastructure, tooling, and the engine/runtime layer beneath studios. The team publishes a weekly gaming-industry newsletter that doubles as a public sourcing surface.",
    related: ["gaming", "infrastructure", "developer-tools"],
    what: "Konvoy is one of the most prolific dedicated gaming VCs, leading early rounds in game-infrastructure companies (Edgegap among them) and writing detailed public thesis material on the category.",
  }),
  build({
    slug: "bitkraft",
    name: "BITKRAFT Ventures",
    homepage: "https://www.bitkraft.vc",
    hq: "Denver",
    stage: "seed through Series B, gaming and synthetic reality",
    thesis: "BITKRAFT invests across gaming, interactive media, and immersive technology under a \"Synthetic Reality\" thesis, the convergence of physical and digital worlds. Founded by ESL co-founder Jens Hilgers, the firm spans game infrastructure, content, and platform layers.",
    related: ["gaming", "infrastructure"],
    what: "BITKRAFT is one of the largest gaming-native investment platforms, leading rounds in game-infrastructure companies (Beamable among them) with 130+ portfolio companies globally.",
  }),
  build({
    slug: "makers-fund",
    name: "Makers Fund",
    homepage: "https://www.makersfund.com",
    hq: "San Francisco",
    stage: "pre-seed through Series A, interactive entertainment",
    thesis: "Makers Fund backs builders of the future of interactive entertainment, games, content, platforms, and ecosystem technologies, with a thesis centered on the intersection of creativity, technology, and community. Global presence across San Francisco, London, Tokyo, and Singapore.",
    related: ["gaming", "infrastructure"],
    what: "Makers Fund is a dedicated interactive-entertainment VC with over $1B AUM, investing from product inception through global scaling across the games stack.",
  }),
];

export function getFund(slug: string): Fund | undefined {
  return funds.find((f) => f.slug === slug);
}

export function getAllFundSlugs(): string[] {
  return funds.map((f) => f.slug);
}
