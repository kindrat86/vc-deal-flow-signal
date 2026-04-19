export interface AlternativeFeature {
  feature: string;
  values: Record<string, string>;
}

export interface AlternativeFAQ {
  question: string;
  answer: string;
}

export interface Alternative {
  slug: string;
  competitor: string;
  competitorUrl: string;
  title: string;
  description: string;
  h1: string;
  tagline: string;
  intro: string;
  sections: { heading: string; body: string }[];
  featureTable: {
    tools: string[];
    features: AlternativeFeature[];
  };
  verdict: string;
  whenToPick: {
    us: string;
    them: string;
  };
  faqs: AlternativeFAQ[];
  relatedSectors: string[];
}

export const alternatives: Alternative[] = [
  {
    slug: "harmonic-ai",
    competitor: "Harmonic.ai",
    competitorUrl: "https://www.harmonic.ai",
    title: "Harmonic.ai Alternative — VC Deal Flow Signal (2026)",
    description:
      "Looking for a Harmonic.ai alternative? VC Deal Flow Signal uses GitHub engineering acceleration to surface breakout startups 6-12 weeks before a fundraise — at a fraction of the enterprise price.",
    h1: "VC Deal Flow Signal vs Harmonic.ai",
    tagline:
      "An affordable alternative to Harmonic.ai for investors who want quantitative engineering signals without enterprise contracts.",
    intro:
      "Harmonic.ai built its reputation on AI-powered team pattern matching — scanning founder backgrounds, hiring networks, and public signals to identify promising startups at incorporation. It is powerful, thorough, and priced for institutional budgets. VC Deal Flow Signal takes a different angle: watch the product getting built, not the team building it. GitHub commit velocity, contributor acceleration, and infrastructure buildouts are leading indicators that precede fundraise announcements by 6-12 weeks. Here is how the two stack up.",
    sections: [
      {
        heading: "Signal philosophy",
        body: "Harmonic.ai models the investor's intuition: identify founders whose backgrounds, networks, and decisions match the patterns of successful exits. VC Deal Flow Signal models the engineer's intuition: watch for unusual acceleration in the actual product — shipping velocity, infrastructure scaling, and team growth visible in public code. Both approaches work; they catch different signals at different moments in the startup lifecycle.",
      },
      {
        heading: "Lead time",
        body: "Harmonic surfaces promising teams around incorporation — the earliest possible moment, but also the moment with the most uncertainty. VC Deal Flow Signal typically catches companies 6-12 weeks before a fundraise announcement, when engineering acceleration has become unmistakable but before the round is publicly competitive. If you want to be first, Harmonic is earlier. If you want to be confident, the engineering signal comes with more proof points.",
      },
      {
        heading: "Pricing and access",
        body: "Harmonic.ai is enterprise-priced — annual contracts, typically five figures. It is built for institutional VCs with dedicated sourcing teams. VC Deal Flow Signal offers a free weekly Signal Report delivered by email, plus a full Dashboard at EUR 9.97/month during beta. Angels, scouts, and smaller funds can get the full product for less than a single Harmonic seat.",
      },
      {
        heading: "Data sources",
        body: "Harmonic aggregates LinkedIn, news, startup databases, and proprietary network graphs — broad coverage, heavy curation. VC Deal Flow Signal pulls directly from GitHub's public API: commit activity, contributor stats, repository creation, and release cadence across 20 sector-specific topic clusters. The data is narrower but the source is canonical and the update cycle is weekly.",
      },
      {
        heading: "Coverage",
        body: "Harmonic covers founders across all sectors, including companies with little public code (healthtech, biotech, consumer brands, fintech services). VC Deal Flow Signal covers technical startups with public engineering activity — primarily AI/ML, dev tools, enterprise SaaS, infrastructure, and similar sectors. If you invest in non-technical founders, Harmonic is the better fit. If you invest in technical startups, GitHub signals are a more direct measurement of traction.",
      },
    ],
    featureTable: {
      tools: ["VC Deal Flow Signal", "Harmonic.ai"],
      features: [
        { feature: "Primary signal", values: { "VC Deal Flow Signal": "GitHub engineering acceleration", "Harmonic.ai": "Team & network pattern matching" } },
        { feature: "Typical lead time", values: { "VC Deal Flow Signal": "6-12 weeks pre-fundraise", "Harmonic.ai": "At incorporation" } },
        { feature: "Free tier", values: { "VC Deal Flow Signal": "Weekly report + sector pages", "Harmonic.ai": "No public free tier" } },
        { feature: "Paid pricing", values: { "VC Deal Flow Signal": "EUR 9.97/mo (beta)", "Harmonic.ai": "Enterprise (annual)" } },
        { feature: "Coverage", values: { "VC Deal Flow Signal": "Technical startups with public code", "Harmonic.ai": "All sectors, including non-technical" } },
        { feature: "Data freshness", values: { "VC Deal Flow Signal": "Weekly", "Harmonic.ai": "Continuous" } },
        { feature: "API / MCP access", values: { "VC Deal Flow Signal": "MCP server + JSON/CSV", "Harmonic.ai": "Enterprise API" } },
        { feature: "Best for", values: { "VC Deal Flow Signal": "Angels, scouts, solo GPs, technical funds", "Harmonic.ai": "Institutional VCs, sourcing teams" } },
      ],
    },
    verdict:
      "Pick Harmonic.ai if you are an institutional VC with an enterprise budget, a dedicated sourcing team, and a mandate that covers every sector. Pick VC Deal Flow Signal if you invest in technical startups, want a quantitative signal you can verify in a browser, and prefer a 10 EUR/month SaaS over a 50,000 EUR/year contract. Many investors use both: Harmonic for broad candidate generation, VC Deal Flow Signal as a confirming signal before outreach.",
    whenToPick: {
      us: "You invest in technical startups, want a quantitative signal with 6-12 week lead time, and prefer accessible SaaS pricing over enterprise contracts. You value the ability to inspect the raw data (GitHub) yourself.",
      them: "You are an institutional VC with a dedicated sourcing function, a multi-sector mandate that includes non-technical companies, and budget for enterprise tooling. Team-pattern matching is core to your thesis.",
    },
    faqs: [
      { question: "Is VC Deal Flow Signal a direct Harmonic.ai alternative?", answer: "It is a complementary tool rather than a full feature replacement. Harmonic covers all sectors with team-level signals; VC Deal Flow Signal focuses on technical startups with engineering-level signals. For investors who care about technical sectors and want a lower-cost entry point, it is a strong alternative." },
      { question: "Why is VC Deal Flow Signal so much cheaper than Harmonic.ai?", answer: "Different data sources and different target customers. Harmonic licenses and curates broad data from many providers and sells to enterprise VCs. VC Deal Flow Signal pulls directly from GitHub's public API, focuses on a narrower signal, and is priced for individual investors and smaller funds." },
      { question: "Can I use both Harmonic.ai and VC Deal Flow Signal?", answer: "Yes, and many investors do. Harmonic is strong for broad candidate generation across all sectors; VC Deal Flow Signal is strong as a confirming engineering signal on technical startups. They answer different questions and their signals rarely overlap." },
      { question: "How does VC Deal Flow Signal compare to Harmonic.ai on coverage?", answer: "Harmonic covers all sectors, including non-technical. VC Deal Flow Signal covers only technical startups with public GitHub activity — roughly 20 sector clusters in AI/ML, infrastructure, dev tools, and enterprise SaaS. If you invest in consumer brands or healthtech, Harmonic has broader reach." },
    ],
    relatedSectors: ["ai-ml", "enterprise-saas", "dev-tools"],
  },
  {
    slug: "dealroom",
    competitor: "Dealroom",
    competitorUrl: "https://dealroom.co",
    title: "Dealroom Alternative — VC Deal Flow Signal (2026)",
    description:
      "A Dealroom alternative focused on leading indicators, not curated post-raise data. VC Deal Flow Signal surfaces engineering acceleration 6-12 weeks before fundraise announcements.",
    h1: "VC Deal Flow Signal vs Dealroom",
    tagline:
      "A leading-indicator alternative to Dealroom for investors who want to know before the round is announced.",
    intro:
      "Dealroom is one of the most comprehensive startup databases in Europe, widely used for sector mapping, funding history, and competitive analysis. It is excellent at telling you what has already happened. VC Deal Flow Signal is built for a different question: what is happening right now, before the press release? By watching GitHub engineering acceleration weekly, it surfaces the same startups Dealroom will list 6-12 weeks later.",
    sections: [
      {
        heading: "Database vs signal engine",
        body: "Dealroom is a database: it records, curates, and indexes every startup funding event, team change, and sector classification it can find. It is the authoritative reference for what has already happened. VC Deal Flow Signal is a signal engine: it doesn't try to be comprehensive, it tries to be early. Each week it surfaces a small list of startups showing unusual engineering acceleration and explains why.",
      },
      {
        heading: "Lead time",
        body: "Dealroom records funding rounds after they are announced — that is the nature of a curated database. Lead time is effectively zero or negative. VC Deal Flow Signal typically catches engineering acceleration 6-12 weeks before the corresponding fundraise is announced. For investors trying to get into rounds before they are competitive, this is the single most important difference.",
      },
      {
        heading: "Sector taxonomy",
        body: "Dealroom has one of the most detailed sector taxonomies in the industry, with hundreds of subsectors and a strong European bias. VC Deal Flow Signal operates in 20 sector clusters derived from GitHub topic taxonomy — narrower, more technical, and not tied to any regional bias. If you need granular sector filtering, Dealroom wins. If you want signals by engineering domain, VC Deal Flow Signal is closer to the work.",
      },
      {
        heading: "Pricing",
        body: "Dealroom is tiered: a limited free view, a Professional tier for individual investors, and an Enterprise tier for institutional use. Full access costs hundreds to thousands of euros per month depending on usage. VC Deal Flow Signal is EUR 9.97/month for the full Dashboard, with a free weekly Signal Report and all sector pages publicly accessible.",
      },
      {
        heading: "When each is right",
        body: "Use Dealroom for portfolio mapping, retrospective sector analysis, and finding every company that matches a set of criteria. Use VC Deal Flow Signal for weekly deal flow, early conviction-building, and deciding where to focus outreach right now.",
      },
    ],
    featureTable: {
      tools: ["VC Deal Flow Signal", "Dealroom"],
      features: [
        { feature: "Primary value", values: { "VC Deal Flow Signal": "Leading signal (pre-raise)", "Dealroom": "Curated database (post-raise)" } },
        { feature: "Typical lead time", values: { "VC Deal Flow Signal": "6-12 weeks pre-fundraise", "Dealroom": "Post-announcement" } },
        { feature: "Sector taxonomy", values: { "VC Deal Flow Signal": "20 engineering-domain clusters", "Dealroom": "Hundreds of subsectors, European depth" } },
        { feature: "Free tier", values: { "VC Deal Flow Signal": "Weekly report + public sector pages", "Dealroom": "Limited company views" } },
        { feature: "Paid pricing", values: { "VC Deal Flow Signal": "EUR 9.97/mo (beta)", "Dealroom": "Tiered (Pro to Enterprise)" } },
        { feature: "API / MCP access", values: { "VC Deal Flow Signal": "MCP server + JSON/CSV", "Dealroom": "Enterprise API" } },
        { feature: "Best for", values: { "VC Deal Flow Signal": "Weekly deal flow, early conviction", "Dealroom": "Portfolio mapping, sector research" } },
      ],
    },
    verdict:
      "Dealroom is the better tool if you want a comprehensive European startup database for mapping, research, and retrospective analysis. VC Deal Flow Signal is the better tool if you want a leading engineering signal — who is accelerating right now, before the next round is announced. They are genuinely complementary: Dealroom gives you the complete picture, VC Deal Flow Signal tells you what to look at first.",
    whenToPick: {
      us: "You want a weekly signal that points at specific startups accelerating before fundraise announcements. You value timing and focus over comprehensiveness, and a 10 EUR/month product fits your stack better than a platform subscription.",
      them: "You need a comprehensive, curated database for sector mapping, retrospective research, or European portfolio analysis. You need to answer 'find every company that matches X' with confidence.",
    },
    faqs: [
      { question: "Is VC Deal Flow Signal a replacement for Dealroom?", answer: "Not a full replacement. Dealroom is a comprehensive database; VC Deal Flow Signal is a leading-signal engine. Most investors who use both keep Dealroom for research and portfolio mapping, and use VC Deal Flow Signal as a weekly feed of startups accelerating in engineering activity." },
      { question: "Which has better European startup coverage?", answer: "Dealroom has deeper European coverage in terms of sector taxonomy, funding data, and historical context. VC Deal Flow Signal's coverage is global but narrower: any startup with public GitHub activity across roughly 20 technical sector clusters." },
      { question: "How much cheaper is VC Deal Flow Signal than Dealroom?", answer: "The VC Deal Flow Signal Dashboard is EUR 9.97/month during beta. Dealroom pricing varies by tier but full professional access is typically 10-100x higher. For individual investors and small funds, VC Deal Flow Signal is often the only affordable option." },
      { question: "Does VC Deal Flow Signal show funding history like Dealroom?", answer: "No. VC Deal Flow Signal surfaces engineering acceleration signals — commit velocity, contributor growth, infrastructure buildouts — and links out to each startup's GitHub organization. For funding history, valuations, and team details, you would supplement with Dealroom or Crunchbase." },
    ],
    relatedSectors: ["ai-ml", "enterprise-saas", "fintech"],
  },
  {
    slug: "forager-ai",
    competitor: "Forager.ai",
    competitorUrl: "https://forager.ai",
    title: "Forager.ai Alternative — VC Deal Flow Signal (2026)",
    description:
      "Compare Forager.ai vs VC Deal Flow Signal. Different signals (web/social vs GitHub engineering), different lead times, and two distinct approaches to early-stage sourcing.",
    h1: "VC Deal Flow Signal vs Forager.ai",
    tagline:
      "An engineering-signal alternative to Forager.ai's web and social sourcing — built for investors who back technical founders.",
    intro:
      "Forager.ai and VC Deal Flow Signal answer the same question — who is breaking out before the round is announced? — with different data. Forager.ai uses NLP on public web signals: product launches, social mentions, press coverage, and hiring patterns. VC Deal Flow Signal uses GitHub engineering acceleration: commit velocity, contributor growth, and infrastructure buildouts. Both catch real traction signals. They just catch different ones, at different moments.",
    sections: [
      {
        heading: "Signal source",
        body: "Forager.ai's edge is the breadth of public web data — it casts a wide net across product launches, press mentions, social buzz, and hiring activity. VC Deal Flow Signal's edge is the canonical nature of GitHub data — every commit, every contributor, every release is verifiable and timestamped. Web signals tell you the company is getting talked about. Engineering signals tell you the product is getting built.",
      },
      {
        heading: "Lead time and false positives",
        body: "Forager.ai typically surfaces companies 2-6 weeks before broader public awareness. VC Deal Flow Signal typically surfaces engineering acceleration 6-12 weeks before the corresponding fundraise. Engineering signals tend to have slightly more false positives (not every commit spike leads to a raise) but a longer lead time. Web signals have fewer false positives but less runway.",
      },
      {
        heading: "Coverage",
        body: "Forager.ai covers any company with a public web footprint — consumer, SaaS, hardware, services, across all sectors. VC Deal Flow Signal covers technical startups with public GitHub activity in about 20 sector clusters. If you invest in consumer or services companies, Forager is more applicable. If you invest in technical and developer-facing products, GitHub signals are closer to the actual work.",
      },
      {
        heading: "Pricing and access",
        body: "Forager.ai offers tiered pricing with a limited free tier. VC Deal Flow Signal offers a free weekly Signal Report plus a EUR 9.97/month Dashboard during beta. Both are accessible to individual investors, though the Dashboard is priced to be affordable for scouts and solo GPs specifically.",
      },
    ],
    featureTable: {
      tools: ["VC Deal Flow Signal", "Forager.ai"],
      features: [
        { feature: "Primary signal", values: { "VC Deal Flow Signal": "GitHub engineering acceleration", "Forager.ai": "Web, social, and hiring signals" } },
        { feature: "Typical lead time", values: { "VC Deal Flow Signal": "6-12 weeks pre-fundraise", "Forager.ai": "2-6 weeks" } },
        { feature: "Coverage", values: { "VC Deal Flow Signal": "Technical startups with public code", "Forager.ai": "Any company with public web footprint" } },
        { feature: "Free tier", values: { "VC Deal Flow Signal": "Weekly report + sector pages", "Forager.ai": "Limited" } },
        { feature: "Paid pricing", values: { "VC Deal Flow Signal": "EUR 9.97/mo (beta)", "Forager.ai": "Tiered" } },
        { feature: "False positive rate", values: { "VC Deal Flow Signal": "Moderate (signals require interpretation)", "Forager.ai": "Low-moderate (signals are already validated publicly)" } },
        { feature: "Best for", values: { "VC Deal Flow Signal": "Technical sector investors, engineering-led conviction", "Forager.ai": "Wide-net sourcing across sectors" } },
      ],
    },
    verdict:
      "Forager.ai is the better tool if you want to cast a wide net across all sectors and catch companies at the moment they start gaining public visibility. VC Deal Flow Signal is the better tool if you invest in technical startups and want to catch engineering acceleration before the company is publicly visible at all. The two signals rarely overlap, which is why many investors use both.",
    whenToPick: {
      us: "You invest in technical startups and want to see acceleration in the product itself — commit velocity, contributor growth, infrastructure buildouts — before the company shows up in press coverage or job boards.",
      them: "You invest across sectors and want early web and social signals: product launches, press mentions, hiring patterns. Non-technical founders and services companies are part of your thesis.",
    },
    faqs: [
      { question: "How does VC Deal Flow Signal differ from Forager.ai?", answer: "Different data. Forager.ai uses NLP on public web, social, and hiring signals. VC Deal Flow Signal uses GitHub engineering activity. Forager catches companies gaining public visibility; VC Deal Flow Signal catches engineering acceleration often before any public visibility exists." },
      { question: "Which has earlier signals?", answer: "VC Deal Flow Signal typically has 2-6 weeks more lead time because engineering acceleration usually precedes public-facing launches and hiring surges. The tradeoff is that engineering signals are slightly noisier and require a technical lens to interpret." },
      { question: "Can Forager.ai cover startups that VC Deal Flow Signal misses?", answer: "Yes, especially non-technical companies and services businesses that have minimal public GitHub footprint. Forager covers any company with a public web presence, which is a much broader universe than technical startups with open-source activity." },
      { question: "Is VC Deal Flow Signal a Forager.ai alternative or complement?", answer: "Most investors treat them as complements. If you invest across all sectors and want one tool, Forager covers more ground. If you invest in technical startups and want the earliest possible signal on engineering traction, VC Deal Flow Signal is a direct fit." },
    ],
    relatedSectors: ["ai-ml", "dev-tools", "enterprise-saas"],
  },
  {
    slug: "crunchbase-alerts",
    competitor: "Crunchbase",
    competitorUrl: "https://www.crunchbase.com",
    title: "Crunchbase Alternative for Early Deal Flow (2026)",
    description:
      "A Crunchbase alerts alternative that surfaces startup acceleration 6-12 weeks before fundraise announcements, not after. GitHub engineering signals vs Crunchbase funding alerts.",
    h1: "VC Deal Flow Signal vs Crunchbase Alerts",
    tagline:
      "A leading-indicator alternative to Crunchbase alerts. Catch startups before the round is announced, not after.",
    intro:
      "Crunchbase alerts are the default early-signal tool for most investors. They are reliable, well-integrated, and comprehensive. They are also, by definition, lagging: alerts fire when a round is announced, at which point the deal is already competitive or closed. VC Deal Flow Signal offers a leading alternative — weekly GitHub engineering acceleration signals that precede fundraise announcements by 6-12 weeks on average.",
    sections: [
      {
        heading: "Leading vs lagging indicators",
        body: "Crunchbase alerts trigger on confirmed funding events — the round has closed, the press release is out, the alert fires. That is the definition of a lagging indicator. VC Deal Flow Signal triggers on GitHub engineering acceleration — commit velocity surges, contributor growth, infrastructure buildouts — which historically precede fundraise announcements by 6-12 weeks. One tells you what happened. The other tells you what is about to happen.",
      },
      {
        heading: "Reliability and noise",
        body: "Crunchbase is highly reliable for confirmed funding events — the data is curated and verified. It has survivorship bias though: you only learn about rounds that closed. VC Deal Flow Signal has more noise (not every engineering spike leads to a raise) but covers a wider funnel, including companies that will raise next quarter and companies that will stay bootstrapped but grow anyway.",
      },
      {
        heading: "Sector coverage",
        body: "Crunchbase covers all sectors with equal authority — consumer, SaaS, healthtech, fintech, services, hardware. VC Deal Flow Signal covers technical startups with public GitHub activity across about 20 sector clusters. For non-technical sectors, Crunchbase is more comprehensive; for technical sectors, GitHub signals are closer to the actual product work.",
      },
      {
        heading: "Pricing",
        body: "Crunchbase Pro starts at $49/month for individual investors with advanced search, alerts, and unlimited profile views. Enterprise plans are tiered higher. VC Deal Flow Signal is EUR 9.97/month for the full Dashboard plus a free weekly Signal Report. For solo investors, the combined cost of Crunchbase + VC Deal Flow Signal is still less than a single Crunchbase Enterprise seat.",
      },
      {
        heading: "Using them together",
        body: "The most common workflow: use VC Deal Flow Signal to surface engineering acceleration on technical startups, then use Crunchbase to pull funding history, team details, and investor context on the companies you want to approach. Leading signal plus lagging context — they compose well and each is cheap on its own.",
      },
    ],
    featureTable: {
      tools: ["VC Deal Flow Signal", "Crunchbase Alerts"],
      features: [
        { feature: "Signal type", values: { "VC Deal Flow Signal": "Engineering acceleration (leading)", "Crunchbase Alerts": "Funding announcements (lagging)" } },
        { feature: "Typical lead time", values: { "VC Deal Flow Signal": "6-12 weeks pre-fundraise", "Crunchbase Alerts": "0 weeks (post-announcement)" } },
        { feature: "Data reliability", values: { "VC Deal Flow Signal": "Canonical GitHub data, moderate noise", "Crunchbase Alerts": "Curated funding events, high precision" } },
        { feature: "Sector coverage", values: { "VC Deal Flow Signal": "Technical startups, 20 clusters", "Crunchbase Alerts": "All sectors" } },
        { feature: "Free tier", values: { "VC Deal Flow Signal": "Weekly report + sector pages", "Crunchbase Alerts": "Limited" } },
        { feature: "Paid pricing", values: { "VC Deal Flow Signal": "EUR 9.97/mo (beta)", "Crunchbase Alerts": "$49+/mo (Pro)" } },
        { feature: "Best for", values: { "VC Deal Flow Signal": "Getting in before the round", "Crunchbase Alerts": "Confirming what already raised" } },
      ],
    },
    verdict:
      "If you are trying to get into rounds before they become competitive, VC Deal Flow Signal gives you the lead time Crunchbase alerts cannot. If you need comprehensive funding data across all sectors and have a research-heavy workflow, Crunchbase remains the default. Most serious investors run both: VC Deal Flow Signal as the early signal, Crunchbase as the context layer once a name comes up.",
    whenToPick: {
      us: "You invest in technical startups and your edge depends on getting in early, before the round is announced and competitive. Engineering acceleration is a signal you can evaluate in a browser.",
      them: "You need confirmed funding history, team details, and investor context across all sectors. Your workflow is research-first, and alerts after a round announcement give you enough lead time for your strategy.",
    },
    faqs: [
      { question: "Can VC Deal Flow Signal replace Crunchbase?", answer: "Not fully. Crunchbase is a comprehensive funding database covering all sectors. VC Deal Flow Signal is a leading-signal engine focused on technical startups. Most investors use both: VC Deal Flow Signal for weekly early signals, Crunchbase for confirmed funding context." },
      { question: "What makes GitHub signals a leading indicator vs Crunchbase alerts?", answer: "Startups typically accelerate engineering hiring, shipping, and infrastructure buildout 6-12 weeks before they close a round. By the time Crunchbase alerts fire on a fundraise announcement, that acceleration has been visible in GitHub for weeks. The engineering signal is causally upstream of the funding signal." },
      { question: "Is VC Deal Flow Signal cheaper than Crunchbase Pro?", answer: "Yes. VC Deal Flow Signal Dashboard is EUR 9.97/month during beta vs $49/month for Crunchbase Pro. The free tier of VC Deal Flow Signal (weekly Signal Report plus all sector pages) is also more substantial than Crunchbase's free tier." },
      { question: "Which is better for non-technical sectors?", answer: "Crunchbase. VC Deal Flow Signal only covers technical startups with public GitHub activity. For consumer, healthtech, fintech services, or hardware, Crunchbase's coverage is far broader and more relevant." },
    ],
    relatedSectors: ["ai-ml", "enterprise-saas", "dev-tools"],
  },
];

export function getAlternative(slug: string): Alternative | undefined {
  return alternatives.find((a) => a.slug === slug);
}

export function getAllAlternativeSlugs(): string[] {
  return alternatives.map((a) => a.slug);
}
