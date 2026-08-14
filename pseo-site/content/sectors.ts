/**
 * /sector/[slug] entity pages: curated sector hubs.
 *
 * Each hub aggregates the four curated entity corpora into one
 * Marcus-grade sector landing: companies (/signal/[slug]), funds
 * (/fund/[slug]), founders (/founder/[handle]), and sector-relevant
 * glossary terms (/glossary#anchor).
 *
 * Disambiguation: /sector/[slug] is the **curated** sector hub. The
 * existing /stage/[stage]/[sector] route is the **scraped** leaderboard
 * over lib/data.ts. Different URLs, different data, different intent.
 */

import { companies, type Company } from "@/content/companies";
import { funds, type Fund } from "@/content/funds";
import { founders, type Founder } from "@/content/founders";
import { glossaryTerms, type GlossaryTerm } from "@/content/glossary";

export interface SectorFAQ {
  question: string;
  answer: string;
}

export interface Sector {
  slug: string;
  name: string;
  // SEO surfaces
  title: string;
  metaDescription: string;
  h1: string;
  tagline: string;
  intro: string;
  whatWeTrack: string;
  whyItMatters: string;
  /** Unique per-sector analyst commentary: breaks template similarity across hubs. */
  analystNote: string;
  faqs: SectorFAQ[];
  /** Substring tokens we match against glossary term + definition. */
  glossaryTokens: string[];
  /**
   * Fund-taxonomy slugs to bucket into this sector. Funds use a broader,
   * legacy taxonomy ("ai-ml", "infrastructure", "enterprise-saas") that
   * doesn't always line up with company sectors. Always include the
   * sector's own slug; add siblings for narrow sectors like "ai-infra".
   */
  fundSectors: string[];
}

function build(s: {
  slug: string;
  name: string;
  short: string;
  why: string;
  /** Per-sector analyst commentary (2-3 sentences, data-grounded, unique). */
  note: string;
  glossary: string[];
  fundSectors: string[];
  /**
   * Whether this sector has a scraped /stage/[stage]/[sector] leaderboard
   * (lib/data.ts). Defaults to true. Set false for curated-only sectors with
   * no scraped coverage (e.g. gaming) so the FAQ doesn't point at a dead route.
   */
  scrapedLeaderboard?: boolean;
}): Sector {
  const companyCount = companies.filter((c) => c.sector === s.slug).length;
  const fundCount = funds.filter((f) =>
    s.fundSectors.some((fs) => f.relatedSectors.includes(fs)),
  ).length;
  return {
    slug: s.slug,
    name: s.name,
    title: `${s.name} Engineering Signals & VC Deal Flow (2026)`,
    metaDescription: `Curated ${s.name.toLowerCase()} sector hub: ${companyCount} tracked companies, ${fundCount} active funds, notable engineering leaders, and the metrics we use to read momentum. Built for Corp Dev, PE operating partners, and emerging managers.`,
    h1: `${s.name}: Engineering Signals & Deal Flow`,
    tagline: `${s.short} A single page mapping who builds, who funds, and who leads in ${s.name.toLowerCase()}.`,
    intro: `This hub aggregates the ${s.name.toLowerCase()} surface VC Deal Flow Signal tracks: ${companyCount} curated companies with public GitHub orgs, ${fundCount} venture funds whose published thesis covers ${s.name.toLowerCase()}, and notable engineering leaders whose work shapes the category. ${s.why} Use it as a starting point for sourcing, diligence, or competitive scans.`,
    whatWeTrack: `In ${s.name.toLowerCase()} we track four engineering-acceleration primitives across every monitored org: commit velocity (rolling 14-day vs trailing 12-week median), contributor influx (new committers in the trailing 4 weeks), repo creation pulse (new public repos shipped in the trailing 8 weeks), and language-bias drift (when a new primary language appears in production code). The six-signal panel published at /methodology is empirically tied to imminent fundraise probability (see SSRN paper 6606558).`,
    whyItMatters: s.why,
    analystNote: s.note,
    faqs: [
      {
        question: `What are the breakout ${s.name.toLowerCase()} startups to watch right now?`,
        answer: `The breakout names in ${s.name.toLowerCase()} are the companies showing the steepest GitHub commit-velocity acceleration and contributor growth over a rolling 14-day window, the same pattern that has historically preceded fundraise announcements by three to six weeks. This hub lists ${companyCount} curated ${s.name.toLowerCase()} companies; the full signal list, filterable by sector, is at /signal, and every ranking number links back to a public GitHub repository.`,
      },
      {
        question: `How do investors find ${s.name.toLowerCase()} startups before they announce a funding round?`,
        answer: `By watching the engineering signal rather than the press release. Public GitHub activity (commit velocity, contributor influx, and new-repo creation) starts accelerating three to six weeks before most ${s.name.toLowerCase()} fundraises are announced. The four primitives we track and the six-signal panel are documented at /methodology and tied to fundraise probability in SSRN preprint 6606558. A weekly digest of ${s.name.toLowerCase()} companies matching a fund's stage and check-size filters is available at /firstlook.`,
      },
      {
        question: `Which ${s.name.toLowerCase()} companies do you track?`,
        answer: `We currently track ${companyCount} curated ${s.name.toLowerCase()} companies whose GitHub orgs are self-published on their homepage, devrel blog, or hiring page. The full list with per-company signal pages is at /signal (filter by sector). We do not track private orgs, leaked employee data, or LinkedIn-inferred profiles.`,
      },
      {
        question: `Which venture funds focus on ${s.name.toLowerCase()}?`,
        answer: `${fundCount} funds in our /fund/ corpus publish ${s.name.toLowerCase()} as part of their stated thesis. Each /fund/[slug] page is an independent summary of the fund's public thesis mapped against our engineering-acceleration signal panel. The corpus is not exhaustive. It is the seed set we built around Marcus 100 (Corp Dev, PE operating partners, non-engineer tech VPs).`,
      },
      {
        question: `How can a fund or Corp Dev team use this hub?`,
        answer: `Two workflows. (1) Source: weekly digest of ${s.name.toLowerCase()} companies whose engineering acceleration matches your stage and check-size filters, delivered before competitive rounds form (see /firstlook). (2) Validate: given a deal already in your pipeline, retrieve the public engineering trajectory via the public MCP server at /api/v1 or the openapi.json at /api/openapi.json.`,
      },
      {
        question: `Is this an exhaustive list?`,
        answer: `No. This is a curated seed corpus, not a Crunchbase-scale database. We add companies, funds, and founders deliberately when they meet our public-source threshold (self-published GitHub handle, public thesis, well-documented role).${s.scrapedLeaderboard === false ? "" : ` For the full open-source coverage of every ${s.name.toLowerCase()} startup we score, see /stage/[stage]/${s.slug}, the scraped leaderboard.`}`,
      },
    ],
    glossaryTokens: s.glossary,
    fundSectors: s.fundSectors,
  };
}

export const sectors: Sector[] = [
  build({
    slug: "ai-infra",
    name: "AI Infrastructure",
    short: "Compute, orchestration, inference, and the serving layer underneath the model providers.",
    why: "AI-infra companies have the most explicit engineering-acceleration signature of any sector: large-team coordination on actively shipped runtime, with weekly contributor influx tied to GPU-region rollouts and inference-API expansion. For Corp Dev teams at hyperscalers, AI-infra is the densest acquisition surface in 2026.",
    note: "Two-thirds of the tracked orgs read as accelerating, the highest concentration on the site, and the stage mix is weighted to series A to B, exactly where pre-announcement signal has the most sourcing value. The anchors worth watching are the inference-serving layer (Modal, Replicate, Fireworks AI, Together AI, Groq) and CoreWeave, the lone public comp. For a Corp Dev team this is the densest acquisition surface in the corpus; for an emerging manager it is where the gap between engineering reality and a priced round is widest.",
    glossary: ["commit velocity", "infrastructure", "ai-infra", "buildout", "gpu", "inference", "compute", "orchestrat"],
    fundSectors: ["ai-ml", "infrastructure", "developer-tools"],
  }),
  build({
    slug: "ai-ml",
    name: "AI & Machine Learning",
    short: "Frontier labs, model providers, open-weight checkpoints, and the applied-AI layer on top.",
    why: "AI/ML is the highest-momentum technical category in venture. The engineering signal here is contributor influx (new researchers joining the org) and language-bias drift (Python → Rust/CUDA migrations as models hit inference scale). PE operating partners use this as a bolt-on filter for portfolio software companies adopting AI features.",
    note: "This is the broadest hub on the site, and the only one where the applied layer (Cursor, Lovable, LangChain, Perplexity) now outnumbers the model providers it was seeded with. Two-thirds read as accelerating, with the density sitting at series B to C rather than the early stages most funds claim to want. The quiet signal is contributor influx migrating into the vector-database and eval/observability sub-layers (Weaviate, Qdrant, Pinecone, Arize, Braintrust), a category forming underneath the models.",
    glossary: ["ai", "ml", "machine learning", "model", "llm", "training", "inference", "rlhf", "embedding"],
    fundSectors: ["ai-ml"],
  }),
  build({
    slug: "developer-tools",
    name: "Developer Tools",
    short: "IDEs, frameworks, build systems, package managers, and the productivity layer engineers actually touch.",
    why: "Developer tools have the cleanest commit-velocity signal because their entire product is the GitHub org. Acceleration shows up as repo creation pulse: new SDK languages, new integrations, new templates. Tech VPs scanning for tooling consolidation use this hub to map vendor density across their stack.",
    note: "Developer tools is the deepest corpus because the product and the GitHub org are the same thing, which makes commit-velocity signal unusually clean here. The mix is more mature than the AI categories: a majority read as steady rather than accelerating, and the stage spread runs seed through public (GitLab, CircleCI, DigitalOcean). The founders list is the richest on the site (Guillermo Rauch, Mitchell Hashimoto, Adam Wathan, shadcn), which makes this the best hub for a tech-VP consolidation scan rather than an early-stage sourcing pass.",
    glossary: ["developer", "framework", "sdk", "tooling", "build", "package", "cli", "ide"],
    fundSectors: ["developer-tools"],
  }),
  build({
    slug: "infrastructure",
    name: "Cloud Infrastructure",
    short: "Edge platforms, runtimes, networking, observability primitives, and the platform-as-a-service layer.",
    why: "Cloud infrastructure is the longest-cycle engineering investment in software: companies here ship sustained commit velocity for years before fundraise events. The signal that matters is repo creation pulse paired with new-language adoption (Rust appearances are particularly load-bearing). Corp Dev tracks this for platform-tier acquisitions.",
    note: "Cloud infrastructure reads like a long-cycle portfolio, heavily skewed toward steady, later-stage, and public names (Cloudflare, HashiCorp, DigitalOcean, Render). Acceleration concentrates in the platform-tier challengers (Fly.io, Railway, Upstash, Fermyon) and in the Rust-native edge, which the language-bias primitive flags early. For Corp Dev the decisive signal is repo-creation pulse paired with new-language adoption, not headline velocity.",
    glossary: ["infrastructure", "edge", "platform", "runtime", "deployment", "kubernetes", "container"],
    fundSectors: ["infrastructure"],
  }),
  build({
    slug: "database",
    name: "Databases",
    short: "OLTP, OLAP, vector stores, embedded engines, and the storage layer underneath every modern app.",
    why: "Database companies show the most distinctive language-bias signature: Rust + C/C++ dominance with occasional Go infrastructure layers. Acceleration in this sector is typically tied to a new storage primitive (columnar, vector, time-series) shipping behind a public benchmark. Emerging-manager funds scout here for picks-and-shovels AI plays.",
    note: "Databases is where the language-bias primitive does the most work: Rust and C/C++ dominate, and a new storage primitive ships behind a public benchmark before the round. The corpus splits roughly evenly between accelerating challengers (Neon, Convex, Turso, PlanetScale) and steady incumbents (MongoDB, Elastic, Redis). The freshest acceleration surface is the vector-store sub-layer (Weaviate, Qdrant, Milvus, Pinecone), a picks-and-shovels angle most generalist funds still underweight.",
    glossary: ["database", "olap", "oltp", "vector", "storage", "query", "index", "embedding"],
    fundSectors: ["infrastructure", "developer-tools", "enterprise-saas"],
  }),
  build({
    slug: "observability",
    name: "Observability & Monitoring",
    short: "Logs, traces, metrics, error tracking, profiling, and the runtime-visibility surface for engineering orgs.",
    why: "Observability is a quietly consolidating sector: the engineering signal is integration breadth (new framework adapters, new language SDKs) more than core-product velocity. PE operating partners watch this category for roll-up opportunities since the buyer profile across vendors is nearly identical.",
    note: "Observability is a consolidating, mostly steady sector: only a handful of tracked companies read as accelerating against a long tail of public incumbents (Datadog, New Relic, Splunk, Dynatrace). The quiet signal lives in the AI-native and open-source challengers (SigNoz, Axiom, Better Stack) and the LLM-observability wedge (Langfuse, Arize, Braintrust, Helicone). PE operating partners should read this hub as a roll-up map: near-identical buyer profiles across vendors are what make the category attractive for consolidation.",
    glossary: ["observability", "logging", "trace", "metric", "monitoring", "telemetry", "error tracking"],
    fundSectors: ["developer-tools", "infrastructure", "enterprise-saas"],
  }),
  build({
    slug: "analytics",
    name: "Data Analytics",
    short: "Warehousing, transformation, BI, and the analyst-facing query surface on top of operational data.",
    why: "Analytics tools show the most cross-sector contributor influx because the buyer persona (data engineer, analytics engineer) is shared across every industry vertical. Engineering acceleration here is the SQL/Python integration layer: new connectors, new transformation primitives, new query-engine optimizations.",
    note: "Data analytics is the most cross-sector of the hubs: the buyer persona (data engineer, analytics engineer) is shared with every vertical, which is why it draws one of the deepest fund sets on the site. Acceleration is scarce and concentrated in the open-source, developer-first names (PostHog, dbt Labs, DuckDB, Airbyte, Fivetran), while the public comps (Amplitude, Mixpanel) read as steady. The leading indicator to watch is the SQL/Python integration layer: new connectors and query-engine optimizations precede a breakout.",
    glossary: ["analytics", "warehouse", "etl", "elt", "transformation", "query", "sql", "bi"],
    fundSectors: ["enterprise-saas", "developer-tools", "infrastructure"],
  }),
  build({
    slug: "fintech",
    name: "Fintech",
    short: "Payments, banking infrastructure, embedded finance, fraud, and the API surface for financial workflows.",
    why: "Fintech engineering signals are SDK-density-driven: number of supported languages, depth of language idioms, breadth of platform integrations. Corp Dev teams at incumbents (Visa, Mastercard, Stripe, Adyen) use this to map the acquisition pipeline of API-first challengers.",
    note: "Fintech is the most mature hub here: almost everything reads steady, later-stage, or public (Stripe, Adyen, Plaid, Wise, Nubank, Coinbase), with a single accelerating name. The engineering signal that matters is SDK-density (supported languages, language idioms, and platform-integration breadth), not raw velocity. That makes this a Corp Dev map of the API-first challengers incumbents are most likely to acquire, not an early-stage sourcing feed.",
    glossary: ["fintech", "payment", "banking", "embedded finance", "fraud", "compliance", "kyc"],
    fundSectors: ["fintech"],
  }),
  build({
    slug: "productivity",
    name: "Productivity & Knowledge Work",
    short: "Documents, collaboration, knowledge management, and the prosumer + team productivity layer.",
    why: "Productivity companies are the hardest sector to read from engineering signals alone: UI quality and brand load most of the value, and that does not surface in public GitHub. We track this category for completeness and as a Marcus reference (tech VPs and operating partners almost always have a productivity-tooling consolidation thesis).",
    note: "Productivity is the honest outlier: almost every tracked company reads as steady, because UI quality and brand load most of the value here, and neither surfaces in public GitHub. We track it for completeness and as a reference set (Linear, Figma, Retool, Coda, Miro), not as a live acceleration feed. Tech VPs and operating partners almost always carry a productivity-tooling consolidation thesis, so use this hub as a vendor map rather than a momentum signal.",
    glossary: ["productivity", "collaboration", "document", "knowledge", "team", "workflow"],
    fundSectors: ["enterprise-saas", "consumer"],
  }),
  build({
    slug: "gaming",
    name: "Gaming Infrastructure",
    short: "Game backends, multiplayer servers, server orchestration, cross-game avatars, and the live-ops layer beneath studios.",
    why: "Gaming is hit-driven and hard to read at the studio level, but gaming infrastructure underwrites like developer tools: the engineering signal is integration breadth (new engine SDKs, new platform adapters) and sustained backend commit velocity rather than a single launch spike. Corp Dev teams and gaming-native funds use this hub to track the picks-and-shovels layer (backends, multiplayer, and orchestration), where deal mechanics resemble dev tools, not content bets. We deliberately exclude studios, where signals are dominated by release calendars.",
    note: "Gaming infrastructure is deliberately narrow (all seed through series B, all currently reading steady), and we exclude studios entirely because their signal is dominated by release calendars. The picks-and-shovels layer we do track (Heroic Labs, Hathora, Edgegap, Beamable, Pragma, Ready Player Me) underwrites like developer tools: integration breadth and sustained backend velocity, not a single launch spike. It is the smallest hub by design, and the three listed founders are all Heroic Labs, a reminder this is a seed corpus, not an inventory.",
    glossary: ["gaming", "multiplayer", "matchmaking", "netcode", "game server", "game engine", "live-ops"],
    fundSectors: ["gaming"],
    scrapedLeaderboard: false,
  }),
];

export function getAllSectorSlugs(): string[] {
  return sectors.map((s) => s.slug);
}

export function getSector(slug: string): Sector | undefined {
  return sectors.find((s) => s.slug === slug);
}

export interface SectorKeyStat {
  label: string;
  value: string;
  detail: string;
}

const STAGE_LABELS: Record<Company["stage"], string> = {
  seed: "Seed",
  "series-a": "Series A",
  "series-b": "Series B",
  "series-c": "Series C",
  later: "Later-stage",
  public: "Public",
};

/**
 * Quotable, data-grounded "key stats" for a sector hub. Computed at build
 * time from the same getCompaniesInSector() corpus the page renders, so the
 * numbers always match the visible company list. Framed as curated benchmark
 * figures, never live measurements (see the honesty contract in companies.ts).
 */
export function getSectorKeyStats(slug: string): SectorKeyStat[] {
  const list = getCompaniesInSector(slug);
  const total = list.length;
  if (total === 0) return [];

  const accelerating = list.filter(
    (c) => c.publicSignal.momentum === "accelerating",
  ).length;
  const accPct = Math.round((accelerating / total) * 100);

  const stageCounts = new Map<Company["stage"], number>();
  for (const c of list) stageCounts.set(c.stage, (stageCounts.get(c.stage) ?? 0) + 1);
  const [topStage, topStageCount] = [...stageCounts.entries()].sort(
    (a, b) => b[1] - a[1],
  )[0];

  const langCounts = new Map<string, number>();
  for (const c of list) {
    for (const raw of c.publicSignal.languageBias.split("/")) {
      const lang = raw.trim();
      if (lang) langCounts.set(lang, (langCounts.get(lang) ?? 0) + 1);
    }
  }
  const [topLang, topLangCount] = [...langCounts.entries()].sort(
    (a, b) => b[1] - a[1],
  )[0];

  return [
    {
      label: "Accelerating share",
      value: `${accPct}%`,
      detail:
        accelerating > 0
          ? `${accelerating} of ${total} tracked orgs read as accelerating`
          : `all ${total} tracked orgs read as steady`,
    },
    {
      label: "Stage concentration",
      value: STAGE_LABELS[topStage],
      detail: `${topStageCount} of ${total} tracked orgs`,
    },
    {
      label: "Language bias",
      value: topLang,
      detail: `${topLangCount} of ${total} tracked orgs list ${topLang} as a primary language`,
    },
  ];
}

export function getCompaniesInSector(slug: string): Company[] {
  return companies.filter(
    (c) => c.sector === slug || c.relatedSectors.includes(slug),
  );
}

export function getFundsInSector(slug: string): Fund[] {
  const sector = getSector(slug);
  if (!sector) return [];
  return funds.filter((f) =>
    sector.fundSectors.some((fs) => f.relatedSectors.includes(fs)),
  );
}

/**
 * Founders affiliated with a company in this sector. Match by:
 * (a) exact company name appearing in affiliation string, OR
 * (b) company githubOrg appearing in affiliation (lowercased).
 *
 * Conservative match: false negatives are fine, false positives are not.
 */
export function getFoundersInSector(slug: string): Founder[] {
  const sectorCompanies = getCompaniesInSector(slug);
  const names = new Set(sectorCompanies.map((c) => c.name.toLowerCase()));
  return founders.filter((f) => {
    const aff = f.affiliation.toLowerCase();
    for (const name of names) {
      if (aff.includes(name)) return true;
    }
    return false;
  });
}

export function getGlossaryTermsForSector(slug: string): GlossaryTerm[] {
  const sector = getSector(slug);
  if (!sector) return [];
  const tokens = sector.glossaryTokens.map((t) => t.toLowerCase());
  return glossaryTerms.filter((g) => {
    const haystack = `${g.term} ${g.definition}`.toLowerCase();
    return tokens.some((tok) => haystack.includes(tok));
  });
}
