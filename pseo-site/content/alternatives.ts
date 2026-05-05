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
    relatedSectors: ["ai-ml", "enterprise-saas", "developer-tools"],
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
    relatedSectors: ["ai-ml", "developer-tools", "enterprise-saas"],
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
    relatedSectors: ["ai-ml", "enterprise-saas", "developer-tools"],
  },
  {
    slug: "pitchbook",
    competitor: "PitchBook",
    competitorUrl: "https://pitchbook.com",
    title: "PitchBook Alternative — VC Deal Flow Signal (2026)",
    description:
      "Looking for a PitchBook alternative? VC Deal Flow Signal trades research-platform breadth for engineering-side leading signals at 1/2,000th the price.",
    h1: "VC Deal Flow Signal vs PitchBook",
    tagline:
      "An affordable, leading-indicator alternative to PitchBook for early-stage technical-startup sourcing.",
    intro:
      "PitchBook is the institutional reference platform for private-market data — funding history, valuations, cap tables, exit comparables. It is comprehensive, well-curated, and priced for full-time research teams ($20,000+/year per seat). VC Deal Flow Signal is built for the opposite end of the workflow: not researching companies that already raised, but spotting them before they do. GitHub engineering acceleration is a leading signal that fires 3–6 weeks before fundraise announcements — exactly the window PitchBook misses by definition.",
    sections: [
      {
        heading: "Research platform vs leading-signal engine",
        body: "PitchBook is a research platform: it gives you depth on what has already happened across millions of companies and tens of thousands of investors. It is the canonical reference for due diligence, market mapping, and LP reporting. VC Deal Flow Signal is a signal engine: it surfaces a small list of technical startups each week showing breakout engineering activity, with the explicit purpose of catching them before the round is announced. They answer different questions.",
      },
      {
        heading: "Lead time",
        body: "PitchBook is a lagging system by design — funding events appear once they are public. The lead time is zero or negative. VC Deal Flow Signal catches engineering acceleration 3–6 weeks before the corresponding fundraise announcement. For investors whose edge depends on getting in before a round is competitive, this is the gap PitchBook cannot fill.",
      },
      {
        heading: "Pricing",
        body: "PitchBook is enterprise-priced — the typical seat is $20,000/year and up, with tiered packages and annual contracts. It is built for institutional VCs, corporate strategy teams, and investment banks. VC Deal Flow Signal is EUR 9.97/month for the full Dashboard, with a free weekly Signal Report and all sector pages publicly accessible. Two thousand months of VC Deal Flow Signal cost less than one PitchBook seat.",
      },
      {
        heading: "Coverage",
        body: "PitchBook covers 3.4 million companies globally across all sectors and stages. VC Deal Flow Signal covers technical startups with public GitHub activity — about 20 sector clusters, narrower but with canonical source data. PitchBook is the right tool for non-technical sectors (consumer, healthcare delivery, financial services); GitHub signals are stronger for AI/ML, dev tools, infrastructure, and enterprise SaaS.",
      },
      {
        heading: "Using them together",
        body: "Funds that can afford PitchBook typically run both: VC Deal Flow Signal for the leading engineering signal on technical startups, PitchBook for funding history, valuations, and competitive context once a name comes up. The two are complementary and the combined budget is dominated by the PitchBook line item.",
      },
    ],
    featureTable: {
      tools: ["VC Deal Flow Signal", "PitchBook"],
      features: [
        { feature: "Primary purpose", values: { "VC Deal Flow Signal": "Leading-signal engine", "PitchBook": "Research platform" } },
        { feature: "Lead time", values: { "VC Deal Flow Signal": "3–6 weeks pre-fundraise", "PitchBook": "Post-fundraise (lagging)" } },
        { feature: "Free tier", values: { "VC Deal Flow Signal": "Weekly report + sector pages", "PitchBook": "None" } },
        { feature: "Paid pricing", values: { "VC Deal Flow Signal": "EUR 9.97/mo", "PitchBook": "$20,000+/year per seat" } },
        { feature: "Coverage", values: { "VC Deal Flow Signal": "Technical startups, ~20 sectors", "PitchBook": "3.4M companies, all sectors" } },
        { feature: "Best for", values: { "VC Deal Flow Signal": "Early sourcing, technical sectors", "PitchBook": "Due diligence, LP reporting, market mapping" } },
      ],
    },
    verdict:
      "Choose PitchBook if you need the canonical funding-history database and have a five-figure annual research budget. Choose VC Deal Flow Signal if you want a leading engineering signal on technical startups for the price of two lunches per month. Funds that can afford both run both — the two products almost never overlap.",
    whenToPick: {
      us: "You source technical startups, want a quantitative leading indicator, and would rather pay EUR 9.97/month than $20,000/year. You can do your own funding-history research from public sources.",
      them: "You run a sourcing or research function with full-time analysts, cover non-technical sectors, and need a single canonical database for funding history, valuations, and exit comparables across millions of companies.",
    },
    faqs: [
      { question: "Can VC Deal Flow Signal replace PitchBook?", answer: "Not as a database. PitchBook is the canonical reference for funding history across the private markets. VC Deal Flow Signal does not maintain a comprehensive funding database — it is a leading-signal engine for technical startups. Most funds that can afford PitchBook run both." },
      { question: "Is PitchBook worth the cost for an angel?", answer: "Generally no. PitchBook is built for institutional research teams. For an angel or scout building a sourcing stack, VC Deal Flow Signal Dashboard ($EUR 9.97/mo) plus Crunchbase free tier delivers most of the actionable value at less than 0.1% of the cost." },
      { question: "Does PitchBook cover GitHub data?", answer: "PitchBook does not surface engineering signals or GitHub activity directly. Their data is funding rounds, valuations, team changes, and investor activity — what is captured in conventional VC research workflows. The engineering-side leading signal is a different category." },
      { question: "Which is better for European startups?", answer: "PitchBook covers Europe, but Dealroom is widely considered stronger for granular European coverage. VC Deal Flow Signal is geography-agnostic — GitHub signals fire wherever the engineering is happening." },
    ],
    relatedSectors: ["ai-ml", "enterprise-saas", "fintech"],
  },
  {
    slug: "cb-insights",
    competitor: "CB Insights",
    competitorUrl: "https://cbinsights.com",
    title: "CB Insights Alternative — VC Deal Flow Signal (2026)",
    description:
      "Looking for a CB Insights alternative? VC Deal Flow Signal trades market-intelligence reports for engineering-side leading signals at less than 1% of the price.",
    h1: "VC Deal Flow Signal vs CB Insights",
    tagline:
      "A leading-signal alternative to CB Insights focused on technical-startup sourcing rather than market intelligence.",
    intro:
      "CB Insights is the market-intelligence platform of choice for corporate strategy teams, large VCs, and management consultancies. It bundles funding data, sector reports, the proprietary Mosaic Score, and analyst-written research at $35,000+/year. VC Deal Flow Signal is a different category: a focused, leading engineering-acceleration signal on technical startups, priced for individual investors and small funds.",
    sections: [
      {
        heading: "Market intelligence vs leading signal",
        body: "CB Insights is a market-intelligence platform: written reports, sector teardowns, the Mosaic Score, and a deep funding-data layer. It is built for strategic decision-making — which sectors to enter, which startups to acquire, which competitors are gaining ground. VC Deal Flow Signal is a tactical sourcing tool: each week it surfaces breakout technical startups by GitHub engineering activity, and that is the entire product.",
      },
      {
        heading: "Lead time and signal type",
        body: "CB Insights' Mosaic Score blends leading and lagging factors and is most useful for stage-level scoring rather than week-over-week sourcing decisions. VC Deal Flow Signal is purely a leading signal — engineering acceleration that fires 3–6 weeks before a fundraise announcement. For weekly deal flow, the GitHub signal is more directly actionable.",
      },
      {
        heading: "Pricing and audience",
        body: "CB Insights starts in the $35,000/year range and scales to six-figure enterprise deals. The audience is corporate strategy, large VCs, and consulting firms. VC Deal Flow Signal is EUR 9.97/month for individual investors and small funds; the free tier covers weekly Signal Reports and all sector pages.",
      },
      {
        heading: "Research depth vs raw signal",
        body: "CB Insights publishes hundreds of analyst-written reports per year — sector deep-dives, technology landscapes, competitive battlecards. VC Deal Flow Signal does not write reports; it publishes raw weekly signals and the methodology that produced them. If you need narrative research, CB Insights wins; if you want the signal itself, VC Deal Flow Signal is more direct.",
      },
    ],
    featureTable: {
      tools: ["VC Deal Flow Signal", "CB Insights"],
      features: [
        { feature: "Primary purpose", values: { "VC Deal Flow Signal": "Weekly leading signal", "CB Insights": "Market intelligence platform" } },
        { feature: "Lead time", values: { "VC Deal Flow Signal": "3–6 weeks pre-fundraise", "CB Insights": "Mixed (Mosaic Score)" } },
        { feature: "Free tier", values: { "VC Deal Flow Signal": "Weekly report + sector pages", "CB Insights": "Limited newsletter" } },
        { feature: "Paid pricing", values: { "VC Deal Flow Signal": "EUR 9.97/mo", "CB Insights": "$35,000+/year" } },
        { feature: "Audience", values: { "VC Deal Flow Signal": "Angels, scouts, technical funds", "CB Insights": "Corporate strategy, large VCs, consultancies" } },
      ],
    },
    verdict:
      "Choose CB Insights if you need analyst-written sector reports, corporate-strategy market intelligence, and the Mosaic Score for stage-level evaluation. Choose VC Deal Flow Signal if you want a leading engineering signal on technical startups, weekly, for the price of a coffee. The audiences barely overlap.",
    whenToPick: {
      us: "You are an angel, scout, or small fund focused on technical startups, and you want a leading sourcing signal you can act on each Monday. Reports and market-intelligence narratives are nice-to-have, not core.",
      them: "You run a corporate strategy team, a large VC platform, or a consulting practice. You need analyst-written reports, sector landscapes, and a comprehensive funding-data layer across all categories.",
    },
    faqs: [
      { question: "Can VC Deal Flow Signal replace CB Insights?", answer: "Only on the sourcing layer for technical startups. CB Insights' market-intelligence reports, sector landscapes, and Mosaic Score are a different category that VC Deal Flow Signal does not attempt to cover." },
      { question: "Is the Mosaic Score similar to engineering acceleration?", answer: "No. The Mosaic Score blends momentum, market, and money signals across many inputs and is published per-company. Engineering acceleration is a single dimension — code-side momentum measured weekly. They sometimes correlate but capture different things." },
      { question: "Why is CB Insights so expensive?", answer: "CB Insights employs a research staff producing original reports and analyst research, plus operates a comprehensive private-market funding database. The pricing reflects the editorial product as much as the data product." },
    ],
    relatedSectors: ["ai-ml", "enterprise-saas", "fintech"],
  },
  {
    slug: "affinity",
    competitor: "Affinity",
    competitorUrl: "https://affinity.co",
    title: "Affinity Alternative — VC Deal Flow Signal (2026)",
    description:
      "Affinity is a relationship-intelligence CRM, not a deal-sourcing engine. VC Deal Flow Signal complements it with leading GitHub signals — most funds run both.",
    h1: "VC Deal Flow Signal vs Affinity",
    tagline:
      "A leading-signal sourcing engine that complements Affinity's relationship intelligence.",
    intro:
      "Affinity is the leading relationship-intelligence CRM in venture capital — it maps your firm's network, surfaces warm-intro paths, and tracks every interaction with founders and co-investors. It is excellent at one thing: knowing who in your network has already met a startup. It does not generate new deal flow on its own. VC Deal Flow Signal is the layer Affinity does not have: a leading GitHub-engineering signal that surfaces breakout technical startups before they are introduced through your network. Most funds run both.",
    sections: [
      {
        heading: "Different categories",
        body: "Affinity is a relationship CRM. It indexes your firm's email, calendar, and contact data to map who knows whom and when they last spoke. VC Deal Flow Signal is a signal engine — it produces ranked weekly lists of technical startups showing engineering acceleration. The two are complements, not substitutes.",
      },
      {
        heading: "Where signals come from",
        body: "Affinity's signals are network signals: introductions, meetings, follow-ups, deal-team activity. They are powerful when your firm has good network coverage of a sector. VC Deal Flow Signal's signals are public-data signals: GitHub commit velocity, contributor growth, repository expansion. They fire whether or not anyone in your firm has met the founders yet — that is precisely their value.",
      },
      {
        heading: "Pricing",
        body: "Affinity is enterprise per-seat pricing with annual contracts; budget assumptions are typically several thousand dollars per seat per year. VC Deal Flow Signal is EUR 9.97/month for the full Dashboard, billed monthly, with a permanent free tier (weekly Signal Report and all sector pages).",
      },
      {
        heading: "Combining them",
        body: "The standard workflow: VC Deal Flow Signal surfaces a breakout startup in your sector. You drop the GitHub org or company name into Affinity and check whether anyone in your firm — partners, advisors, scouts, portfolio founders — already knows the team. If yes, you have a warm-intro path before the round is competitive. If no, you have a cold-outreach opener grounded in their engineering work. The combined cycle is hard to replicate with either tool alone.",
      },
    ],
    featureTable: {
      tools: ["VC Deal Flow Signal", "Affinity"],
      features: [
        { feature: "Category", values: { "VC Deal Flow Signal": "Leading-signal engine", "Affinity": "Relationship-intelligence CRM" } },
        { feature: "Generates new deal flow?", values: { "VC Deal Flow Signal": "Yes (weekly)", "Affinity": "No (maps existing network)" } },
        { feature: "Lead time", values: { "VC Deal Flow Signal": "3–6 weeks pre-fundraise", "Affinity": "N/A — based on network" } },
        { feature: "Pricing", values: { "VC Deal Flow Signal": "EUR 9.97/mo", "Affinity": "Enterprise per-seat (annual)" } },
        { feature: "Best for", values: { "VC Deal Flow Signal": "Discovering technical startups", "Affinity": "Pipeline management, warm intros" } },
      ],
    },
    verdict:
      "Affinity and VC Deal Flow Signal solve different problems. Affinity is the right tool if you need to organise pipeline and surface warm-intro paths from your firm's network. VC Deal Flow Signal is the right tool if you need to know which technical startups are accelerating right now, regardless of whether anyone in your firm has met them yet. Funds with budget for both run both; the combined workflow is significantly stronger than either alone.",
    whenToPick: {
      us: "You need new deal flow you do not already have through your network. You cover technical sectors and want a quantitative leading signal each week.",
      them: "You have strong existing deal flow and need to organise pipeline, surface warm intros, and track every founder interaction across your firm. You already source via partners, scouts, and portfolio referrals.",
    },
    faqs: [
      { question: "Is Affinity a deal-sourcing tool?", answer: "Not in the discovery sense. Affinity organises and surfaces relationships within your existing network — it does not generate new startups for you to look at. VC Deal Flow Signal is the discovery layer Affinity does not have." },
      { question: "Can I integrate VC Deal Flow Signal with Affinity?", answer: "Yes, via the JSON or CSV exports or the MCP server. Several funds run a daily Zapier or n8n job that creates an Affinity record (or tag) for each new breakout startup, so partners see the signal alongside the network context." },
      { question: "Which should I buy first?", answer: "If you have not built a strong sourcing flow yet, VC Deal Flow Signal first — it generates the deal flow Affinity will then organise. If you have strong inbound and need to manage pipeline, Affinity first." },
    ],
    relatedSectors: ["ai-ml", "enterprise-saas", "developer-tools"],
  },
  {
    slug: "tracxn",
    competitor: "Tracxn",
    competitorUrl: "https://tracxn.com",
    title: "Tracxn Alternative — VC Deal Flow Signal (2026)",
    description:
      "A Tracxn alternative that focuses on engineering-side leading signals rather than analyst-curated sector taxonomies. Free weekly tier, EUR 9.97/mo Dashboard.",
    h1: "VC Deal Flow Signal vs Tracxn",
    tagline:
      "A leading-signal alternative to Tracxn's analyst-curated startup database.",
    intro:
      "Tracxn is a curated startup database with strong sector taxonomy — particularly in emerging markets and Asia — built around analyst-written sector landscapes and competitor mapping. It is broad, careful, and mid-priced. VC Deal Flow Signal is a different beast: a narrow, leading engineering signal on technical startups, refreshed weekly, priced for individual investors. The two answer different questions; for technical-sector sourcing, the engineering signal fires earlier.",
    sections: [
      {
        heading: "Curated database vs leading signal",
        body: "Tracxn is a database with editorial layer: each startup in their universe is tagged into a sector taxonomy curated by analysts, often with comparator companies and notes. VC Deal Flow Signal does not maintain a curated taxonomy — sectors are defined by GitHub topic clusters, and the only editorial layer is the methodology itself. For sector landscaping, Tracxn wins. For weekly leading signals, the engineering data is more direct.",
      },
      {
        heading: "Geographic strength",
        body: "Tracxn is notably strong in India, Southeast Asia, and other emerging markets where conventional databases have thin coverage. VC Deal Flow Signal is geography-agnostic — GitHub signals fire wherever the engineering is happening, including in markets where founders have minimal local press coverage.",
      },
      {
        heading: "Pricing and audience",
        body: "Tracxn is mid-tier pricing — typically several thousand dollars per seat per year, with custom enterprise plans. The audience is mid-sized funds, corporate venture, and emerging-market investors. VC Deal Flow Signal is EUR 9.97/month for individual investors; the free weekly tier covers most of what an angel needs.",
      },
      {
        heading: "Coverage shape",
        body: "Tracxn covers all sectors with breadth. VC Deal Flow Signal covers technical startups with public engineering activity — about 20 sector clusters. For non-technical investing (consumer, services, healthtech delivery), Tracxn is the better fit. For technical sector sourcing, GitHub signals are closer to the actual product work.",
      },
    ],
    featureTable: {
      tools: ["VC Deal Flow Signal", "Tracxn"],
      features: [
        { feature: "Primary signal", values: { "VC Deal Flow Signal": "GitHub engineering acceleration", "Tracxn": "Analyst-curated sector taxonomy" } },
        { feature: "Lead time", values: { "VC Deal Flow Signal": "3–6 weeks pre-fundraise", "Tracxn": "Post-fundraise" } },
        { feature: "Geographic coverage", values: { "VC Deal Flow Signal": "Global (technical sectors)", "Tracxn": "Strong in India, SEA, emerging markets" } },
        { feature: "Free tier", values: { "VC Deal Flow Signal": "Yes — permanent", "Tracxn": "Limited" } },
        { feature: "Paid pricing", values: { "VC Deal Flow Signal": "EUR 9.97/mo", "Tracxn": "Mid-tier ($1,000s/year)" } },
      ],
    },
    verdict:
      "Choose Tracxn for analyst-curated sector landscapes, broad coverage including emerging markets, and a mid-priced research-platform tier. Choose VC Deal Flow Signal for a leading engineering signal on technical startups at angel-friendly pricing. They overlap on technical-sector sourcing where Tracxn is broader but later, and VC Deal Flow Signal is narrower but earlier.",
    whenToPick: {
      us: "You source technical startups globally and want the engineering-side leading signal, not a curated sector taxonomy. You prefer monthly billing and a permanent free tier over annual contracts.",
      them: "You need broad sector landscapes, analyst commentary, and strong emerging-market coverage. You invest beyond technical sectors and value editorial structure over raw signals.",
    },
    faqs: [
      { question: "Does Tracxn cover GitHub data?", answer: "Tracxn surfaces basic technology stack and engineering metadata in some profiles, but it is not a leading-signal engine — engineering acceleration is not a tracked dimension. The two products complement each other for technical-sector sourcing." },
      { question: "Is Tracxn better for emerging markets?", answer: "For analyst-curated coverage in India, Southeast Asia, and similar markets, yes — Tracxn has invested heavily in emerging-market depth. VC Deal Flow Signal is geography-agnostic but covers only technical startups with public GitHub activity, which is a smaller universe in some emerging markets." },
    ],
    relatedSectors: ["ai-ml", "enterprise-saas", "fintech"],
  },
  {
    slug: "specter",
    competitor: "Specter",
    competitorUrl: "https://tryspecter.com",
    title: "Specter Alternative — VC Deal Flow Signal (2026)",
    description:
      "A Specter alternative for engineering-side leading signals. Specter focuses on web/social signals; VC Deal Flow Signal focuses on GitHub engineering acceleration. Most investors use both.",
    h1: "VC Deal Flow Signal vs Specter",
    tagline:
      "A complementary engineering-signal alternative to Specter's web/social sourcing.",
    intro:
      "Specter is one of the better-known web-and-social-signal sourcing tools — it scans product launches, hiring, web traffic, and social mentions to surface companies gaining early traction. It works well as a wide-net early sourcing layer across all sectors. VC Deal Flow Signal targets a different signal: GitHub engineering acceleration on technical startups. The two often surface different companies at different moments; many investors use both.",
    sections: [
      {
        heading: "Signal philosophy",
        body: "Specter aggregates many public signals — Product Hunt launches, hiring activity, web traffic estimates, social mentions, app store rankings — into a per-company momentum score. The signal is broad and works across consumer, B2B, and technical companies. VC Deal Flow Signal isolates one channel — GitHub engineering acceleration — and goes deep on it. The single-channel focus makes the engineering signal more direct on technical startups but bounds coverage tightly.",
      },
      {
        heading: "Coverage",
        body: "Specter covers all sectors with similar depth — consumer apps, B2B SaaS, marketplaces, services. VC Deal Flow Signal covers only technical startups with meaningful public GitHub activity. For consumer-app sourcing, Specter is the better tool. For technical-startup sourcing in dev tools, AI/ML, infrastructure, or enterprise SaaS, the engineering signal is closer to the work.",
      },
      {
        heading: "Lead time",
        body: "Specter's signals are mixed-lead — product launches and social mentions are at-launch, hiring activity is concurrent, web traffic is lagging. The composite score is best understood as a current-momentum reading. VC Deal Flow Signal is uniformly leading — engineering acceleration fires 3–6 weeks before a fundraise announcement on technical startups.",
      },
      {
        heading: "Pricing",
        body: "Specter has tiered pricing scaled by usage and team size, with paid plans starting in the low-hundreds-per-month range and enterprise tiers above. VC Deal Flow Signal is a flat EUR 9.97/month for the Dashboard with a permanent free tier.",
      },
    ],
    featureTable: {
      tools: ["VC Deal Flow Signal", "Specter"],
      features: [
        { feature: "Signal channel", values: { "VC Deal Flow Signal": "GitHub engineering acceleration", "Specter": "Web/social composite (multi-channel)" } },
        { feature: "Lead time", values: { "VC Deal Flow Signal": "3–6 weeks pre-fundraise", "Specter": "Mixed (launch / concurrent)" } },
        { feature: "Coverage", values: { "VC Deal Flow Signal": "Technical startups, ~20 sectors", "Specter": "All sectors, broad" } },
        { feature: "Free tier", values: { "VC Deal Flow Signal": "Permanent", "Specter": "Trial / limited" } },
        { feature: "Paid pricing", values: { "VC Deal Flow Signal": "EUR 9.97/mo", "Specter": "Tiered (hundreds/mo+)" } },
      ],
    },
    verdict:
      "Specter and VC Deal Flow Signal answer adjacent questions. Specter is the right tool for broad cross-sector early-momentum sourcing, including consumer and non-technical B2B. VC Deal Flow Signal is the right tool for technical-sector engineering signals with a tighter lead-time guarantee. The two surface different companies at different moments; most investors who care about technical sectors run VC Deal Flow Signal as the deeper layer alongside a broader tool like Specter.",
    whenToPick: {
      us: "You source technical startups (AI/ML, dev tools, infrastructure, enterprise SaaS) and want a leading engineering signal at angel-friendly pricing. You prefer a single deep channel over a composite score.",
      them: "You source broadly across consumer, services, and technical sectors and want a multi-channel composite that surfaces early-momentum companies regardless of whether they have public engineering activity.",
    },
    faqs: [
      { question: "Does Specter cover GitHub data?", answer: "Specter surfaces some engineering-side metadata but does not run a dedicated GitHub-engineering-acceleration signal. The two products are complements, not substitutes, for technical-sector sourcing." },
      { question: "Is Specter cheaper than VC Deal Flow Signal?", answer: "No. Specter's paid plans start in the low-hundreds-per-month range, scaling to enterprise tiers. VC Deal Flow Signal is a flat EUR 9.97/month with a permanent free tier — it is the cheapest paid layer in the category for technical-sector sourcing." },
    ],
    relatedSectors: ["ai-ml", "enterprise-saas", "developer-tools"],
  },
  {
    slug: "openvc",
    competitor: "OpenVC",
    competitorUrl: "https://www.openvc.app",
    title: "OpenVC Alternative — VC Deal Flow Signal (2026)",
    description:
      "OpenVC is an investor directory built for founders raising rounds. VC Deal Flow Signal is built for the opposite side — investors sourcing startups. The two work well together; they answer different questions.",
    h1: "VC Deal Flow Signal vs OpenVC",
    tagline:
      "An investor-side leading-signal alternative to OpenVC, the founder-side investor directory.",
    intro:
      "OpenVC is a free, founder-facing investor directory. Founders use it to find VCs that match their stage, sector, and geography, then send outbound pitches. It is one of the better tools in its category and the database is broad. VC Deal Flow Signal solves the opposite problem — it gives investors a leading signal on which startups are accelerating before they raise. The two are mirror images of the same fundraising market: OpenVC helps founders find investors; VC Deal Flow Signal helps investors find founders early.",
    sections: [
      {
        heading: "Founder side vs investor side",
        body: "OpenVC is built for founders raising a round — searchable VC database, intro templates, fundraising stage trackers. The product assumes you are the one fundraising. VC Deal Flow Signal is built for investors sourcing deals — engineering-acceleration rankings, sector pages, weekly Signal Report. The product assumes you are the one looking for companies to back. Almost no overlap in users.",
      },
      {
        heading: "Database vs signal",
        body: "OpenVC maintains a curated investor database — thousands of VCs, angels, and funds, indexed by stage and sector. The data is mostly static beyond entry/exit churn. VC Deal Flow Signal is a refreshed-weekly signal engine over a startup panel — the data product is the rate of change of GitHub engineering activity, not a static directory.",
      },
      {
        heading: "Pricing",
        body: "OpenVC has a free tier covering most founder-side use cases, with paid tiers for outbound CRM and pitch tracking. VC Deal Flow Signal is EUR 9.97/month for the full investor Dashboard, with a permanent free Signal Report tier. Both are accessibly priced for individual users, with no enterprise-style annual contracts.",
      },
      {
        heading: "Using them together",
        body: "Founders raising a technical-startup round can use both: OpenVC to identify investors that match their thesis, plus VC Deal Flow Signal's free tier to monitor whether their own engineering signals are firing visibly. Investors can use both: VC Deal Flow Signal to surface startups, plus OpenVC for the inverse view of how founders are positioning themselves in the same market.",
      },
    ],
    featureTable: {
      tools: ["VC Deal Flow Signal", "OpenVC"],
      features: [
        { feature: "Audience", values: { "VC Deal Flow Signal": "Investors sourcing deals", "OpenVC": "Founders raising rounds" } },
        { feature: "Primary data", values: { "VC Deal Flow Signal": "GitHub engineering acceleration (live)", "OpenVC": "Investor directory (curated)" } },
        { feature: "Lead time / freshness", values: { "VC Deal Flow Signal": "Weekly refresh, 3–6 weeks pre-fundraise", "OpenVC": "Static directory + churn" } },
        { feature: "Free tier", values: { "VC Deal Flow Signal": "Permanent (weekly report + sector pages)", "OpenVC": "Free for most founder-side use" } },
        { feature: "Paid pricing", values: { "VC Deal Flow Signal": "EUR 9.97/mo Dashboard", "OpenVC": "Tiered (outbound CRM, pitch tracking)" } },
        { feature: "Best for", values: { "VC Deal Flow Signal": "Sourcing technical startups early", "OpenVC": "Founders mapping the investor universe" } },
      ],
    },
    verdict:
      "OpenVC and VC Deal Flow Signal are complementary — they sit on opposite sides of the same fundraising market. OpenVC is the canonical free founder-side investor directory. VC Deal Flow Signal is the cheapest investor-side leading-signal engine for technical sectors. If you are an investor, VC Deal Flow Signal is the relevant tool. If you are a founder raising, OpenVC is the relevant tool. Most users do not need both at the same time, but anyone working both sides of the market will use them together.",
    whenToPick: {
      us: "You are an investor, scout, or fund principal sourcing technical startups, and you want a leading GitHub-engineering signal at angel-friendly pricing. The investor-directory side of the market is not your primary problem.",
      them: "You are a founder raising a round and you need to identify the right investors to approach by stage, sector, and geography. The leading-signal side of the market is not your primary problem.",
    },
    faqs: [
      { question: "Is OpenVC a deal-flow tool for investors?", answer: "Not directly. OpenVC is a founder-side investor directory — its primary user is a founder mapping the VC universe. Investors who want signal on which startups to back early should use VC Deal Flow Signal or a similar investor-side product, not OpenVC." },
      { question: "Can I find startups to invest in via OpenVC?", answer: "OpenVC does not surface startup-side signals. The database is investors, not startups. For investor-side sourcing — which startups are accelerating, which engineering signals are firing — VC Deal Flow Signal is the relevant tool." },
      { question: "Are OpenVC and VC Deal Flow Signal competitors?", answer: "No. They are complements, not competitors. OpenVC serves founders raising rounds; VC Deal Flow Signal serves investors sourcing startups. The two products mirror opposite sides of the same fundraising market and almost never compete for the same user." },
      { question: "Can I use VC Deal Flow Signal as a founder?", answer: "Yes — many founders use the free Signal Report to monitor whether their own engineering signals are firing visibly enough to attract inbound investor interest. The leading-signal data is informative for both sides of the market, even though the product is built for the investor side." },
    ],
    relatedSectors: ["ai-ml", "enterprise-saas", "developer-tools"],
  },
  {
    slug: "signalrank",
    competitor: "SignalRank",
    competitorUrl: "https://signalrank.ai",
    title: "SignalRank Alternative — VC Deal Flow Signal (2026)",
    description:
      "SignalRank predicts Series-B graduation odds. VC Deal Flow Signal surfaces engineering acceleration 6-12 weeks pre-fundraise. Different stages, different signal types — here is when each one is the right tool.",
    h1: "VC Deal Flow Signal vs SignalRank",
    tagline:
      "Different stages, different signals. The honest comparison.",
    intro:
      "SignalRank is a Series-B graduation prediction model packaged as an index-fund product — it scores already-Series-A companies on their probability of reaching Series B. It is a thesis-validation tool for late-stage participation. VC Deal Flow Signal sits at the opposite end of the funnel: it surfaces technical startups 6-12 weeks before their first or second fundraise, when engineering acceleration is unmistakable but the round is not yet competitive. Almost no overlap.",
    sections: [
      { heading: "Stage of investment", body: "SignalRank operates on already-funded Series-A companies — its model predicts which ones will graduate to Series B. VC Deal Flow Signal operates on pre-fundraise technical startups — its signal model surfaces companies that haven't raised yet. Different stages, different decisions." },
      { heading: "Signal type", body: "SignalRank uses funding patterns, prior round timing, and team or company graduation signals to model probability of late-stage success. VC Deal Flow Signal uses GitHub commit velocity, contributor growth, and infrastructure scaling to model probability of imminent fundraise. Different inputs, different outputs." },
      { heading: "Output and access", body: "SignalRank is primarily an index-fund product — its output is portfolio allocation, not individual company alerts. VC Deal Flow Signal is a SaaS tool — its output is a weekly ranked list of breakout startups plus a real-time Dashboard. They are not substitutes for the same workflow." },
      { heading: "Who should use which", body: "SignalRank is for late-stage thesis validation, fund-of-funds, and passive index exposure. VC Deal Flow Signal is for any active investor sourcing technical pre-seed, seed, or Series A deals. Most active investors will get more value from VC Deal Flow Signal; LPs and passive allocators may get more from SignalRank." },
    ],
    featureTable: {
      tools: ["VC Deal Flow Signal", "SignalRank"],
      features: [
        { feature: "Stage focus", values: { "VC Deal Flow Signal": "Pre-fundraise to Series A", "SignalRank": "Series A to Series B" } },
        { feature: "Signal type", values: { "VC Deal Flow Signal": "Engineering acceleration (leading)", "SignalRank": "Series-B graduation probability (predictive)" } },
        { feature: "Output", values: { "VC Deal Flow Signal": "Weekly ranked startups", "SignalRank": "Index-fund allocation" } },
        { feature: "Use case", values: { "VC Deal Flow Signal": "Active sourcing", "SignalRank": "Late-stage thesis validation" } },
        { feature: "Pricing", values: { "VC Deal Flow Signal": "Free / EUR 9.97/mo", "SignalRank": "Index-fund product" } },
      ],
    },
    verdict:
      "SignalRank and VC Deal Flow Signal serve different stages and different decisions. They are not substitutes. Active early-stage investors should pick VC Deal Flow Signal; passive late-stage allocators may consider SignalRank's index-fund product. Some firms use SignalRank's published methodology as one input alongside leading-signal tools like VC Deal Flow Signal — they cover non-overlapping parts of the funnel.",
    whenToPick: {
      us: "You source actively in pre-seed, seed, or Series A on technical startups. You want a leading signal that gives you 6-12 weeks of timing advantage before rounds become competitive.",
      them: "You allocate passively at the late stage and want index-fund exposure to Series-B-graduation candidates with a published probability model.",
    },
    faqs: [
      { question: "Is VC Deal Flow Signal an alternative to SignalRank?", answer: "Not really — they cover different stages and different decisions. VC Deal Flow Signal is for active early-stage sourcing; SignalRank is for passive late-stage index exposure. They can coexist in a fund-of-funds or hybrid strategy but they don't substitute for one another." },
      { question: "Does SignalRank source pre-seed deals?", answer: "No. SignalRank's model operates on already-Series-A companies and predicts their odds of reaching Series B. For pre-seed and seed sourcing, you need a different signal type — VC Deal Flow Signal's engineering-acceleration signal is empirically validated for that stage." },
      { question: "Can I get a SignalRank-style score from VC Deal Flow Signal?", answer: "Different signal type. VC Deal Flow Signal scores engineering acceleration relative to sector baseline and historical fundraise correlation. It doesn't predict Series-B graduation probability — it predicts imminent fundraise probability for early-stage technical startups." },
    ],
    relatedSectors: ["ai-ml", "enterprise-saas", "developer-tools"],
  },
];

export function getAlternative(slug: string): Alternative | undefined {
  return alternatives.find((a) => a.slug === slug);
}

export function getAllAlternativeSlugs(): string[] {
  return alternatives.map((a) => a.slug);
}
