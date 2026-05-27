/**
 * /sector/[slug] entity pages — curated sector hubs.
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
  glossary: string[];
  fundSectors: string[];
}): Sector {
  const companyCount = companies.filter((c) => c.sector === s.slug).length;
  const fundCount = funds.filter((f) =>
    s.fundSectors.some((fs) => f.relatedSectors.includes(fs)),
  ).length;
  return {
    slug: s.slug,
    name: s.name,
    title: `${s.name} Engineering Signals & VC Deal Flow (2026) — VC Deal Flow Signal`,
    metaDescription: `Curated ${s.name.toLowerCase()} sector hub: ${companyCount} tracked companies, ${fundCount} active funds, notable engineering leaders, and the metrics we use to read momentum. Built for Corp Dev, PE operating partners, and emerging managers.`,
    h1: `${s.name} — Engineering Signals & Deal Flow`,
    tagline: `${s.short} A single page mapping who builds, who funds, and who leads in ${s.name.toLowerCase()}.`,
    intro: `This hub aggregates the ${s.name.toLowerCase()} surface VC Deal Flow Signal tracks: ${companyCount} curated companies with public GitHub orgs, ${fundCount} venture funds whose published thesis covers ${s.name.toLowerCase()}, and notable engineering leaders whose work shapes the category. ${s.why} Use it as a starting point for sourcing, diligence, or competitive scans.`,
    whatWeTrack: `In ${s.name.toLowerCase()} we track four engineering-acceleration primitives across every monitored org: commit velocity (rolling 14-day vs trailing 12-week median), contributor influx (new committers in the trailing 4 weeks), repo creation pulse (new public repos shipped in the trailing 8 weeks), and language-bias drift (when a new primary language appears in production code). The six-signal panel published at /methodology is empirically tied to imminent fundraise probability — see SSRN paper 6606558.`,
    whyItMatters: s.why,
    faqs: [
      {
        question: `Which ${s.name.toLowerCase()} companies do you track?`,
        answer: `We currently track ${companyCount} curated ${s.name.toLowerCase()} companies whose GitHub orgs are self-published on their homepage, devrel blog, or hiring page. The full list with per-company signal pages is at /signal — filter by sector. We do not track private orgs, leaked employee data, or LinkedIn-inferred profiles.`,
      },
      {
        question: `Which venture funds focus on ${s.name.toLowerCase()}?`,
        answer: `${fundCount} funds in our /fund/ corpus publish ${s.name.toLowerCase()} as part of their stated thesis. Each /fund/[slug] page is an independent summary of the fund's public thesis mapped against our engineering-acceleration signal panel. The corpus is not exhaustive — it is the seed set we built around Marcus 100 (Corp Dev, PE operating partners, non-engineer tech VPs).`,
      },
      {
        question: `How can a fund or Corp Dev team use this hub?`,
        answer: `Two workflows. (1) Source: weekly digest of ${s.name.toLowerCase()} companies whose engineering acceleration matches your stage and check-size filters, delivered before competitive rounds form — see /firstlook. (2) Validate: given a deal already in your pipeline, retrieve the public engineering trajectory via the public MCP server at /api/v1 or the openapi.json at /api/openapi.json.`,
      },
      {
        question: `Is this an exhaustive list?`,
        answer: `No. This is a curated seed corpus, not a Crunchbase-scale database. We add companies, funds, and founders deliberately when they meet our public-source threshold (self-published GitHub handle, public thesis, well-documented role). For the full open-source coverage of every ${s.name.toLowerCase()} startup we score, see /stage/[stage]/${s.slug} — the scraped leaderboard.`,
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
    glossary: ["commit velocity", "infrastructure", "ai-infra", "buildout", "gpu", "inference", "compute", "orchestrat"],
    fundSectors: ["ai-ml", "infrastructure", "developer-tools"],
  }),
  build({
    slug: "ai-ml",
    name: "AI & Machine Learning",
    short: "Frontier labs, model providers, open-weight checkpoints, and the applied-AI layer on top.",
    why: "AI/ML is the highest-momentum technical category in venture. The engineering signal here is contributor influx (new researchers joining the org) and language-bias drift (Python → Rust/CUDA migrations as models hit inference scale). PE operating partners use this as a bolt-on filter for portfolio software companies adopting AI features.",
    glossary: ["ai", "ml", "machine learning", "model", "llm", "training", "inference", "rlhf", "embedding"],
    fundSectors: ["ai-ml"],
  }),
  build({
    slug: "developer-tools",
    name: "Developer Tools",
    short: "IDEs, frameworks, build systems, package managers, and the productivity layer engineers actually touch.",
    why: "Developer tools have the cleanest commit-velocity signal because their entire product is the GitHub org. Acceleration shows up as repo creation pulse: new SDK languages, new integrations, new templates. Tech VPs scanning for tooling consolidation use this hub to map vendor density across their stack.",
    glossary: ["developer", "framework", "sdk", "tooling", "build", "package", "cli", "ide"],
    fundSectors: ["developer-tools"],
  }),
  build({
    slug: "infrastructure",
    name: "Cloud Infrastructure",
    short: "Edge platforms, runtimes, networking, observability primitives, and the platform-as-a-service layer.",
    why: "Cloud infrastructure is the longest-cycle engineering investment in software — companies here ship sustained commit velocity for years before fundraise events. The signal that matters is repo creation pulse paired with new-language adoption (Rust appearances are particularly load-bearing). Corp Dev tracks this for platform-tier acquisitions.",
    glossary: ["infrastructure", "edge", "platform", "runtime", "deployment", "kubernetes", "container"],
    fundSectors: ["infrastructure"],
  }),
  build({
    slug: "database",
    name: "Databases",
    short: "OLTP, OLAP, vector stores, embedded engines, and the storage layer underneath every modern app.",
    why: "Database companies show the most distinctive language-bias signature: Rust + C/C++ dominance with occasional Go infrastructure layers. Acceleration in this sector is typically tied to a new storage primitive (columnar, vector, time-series) shipping behind a public benchmark. Emerging-manager funds scout here for picks-and-shovels AI plays.",
    glossary: ["database", "olap", "oltp", "vector", "storage", "query", "index", "embedding"],
    fundSectors: ["infrastructure", "developer-tools", "enterprise-saas"],
  }),
  build({
    slug: "observability",
    name: "Observability & Monitoring",
    short: "Logs, traces, metrics, error tracking, profiling, and the runtime-visibility surface for engineering orgs.",
    why: "Observability is a quietly consolidating sector — the engineering signal is integration breadth (new framework adapters, new language SDKs) more than core-product velocity. PE operating partners watch this category for roll-up opportunities since the buyer profile across vendors is nearly identical.",
    glossary: ["observability", "logging", "trace", "metric", "monitoring", "telemetry", "error tracking"],
    fundSectors: ["developer-tools", "infrastructure", "enterprise-saas"],
  }),
  build({
    slug: "analytics",
    name: "Data Analytics",
    short: "Warehousing, transformation, BI, and the analyst-facing query surface on top of operational data.",
    why: "Analytics tools show the most cross-sector contributor influx because the buyer persona (data engineer, analytics engineer) is shared across every industry vertical. Engineering acceleration here is the SQL/Python integration layer — new connectors, new transformation primitives, new query-engine optimizations.",
    glossary: ["analytics", "warehouse", "etl", "elt", "transformation", "query", "sql", "bi"],
    fundSectors: ["enterprise-saas", "developer-tools", "infrastructure"],
  }),
  build({
    slug: "fintech",
    name: "Fintech",
    short: "Payments, banking infrastructure, embedded finance, fraud, and the API surface for financial workflows.",
    why: "Fintech engineering signals are SDK-density-driven: number of supported languages, depth of language idioms, breadth of platform integrations. Corp Dev teams at incumbents (Visa, Mastercard, Stripe, Adyen) use this to map the acquisition pipeline of API-first challengers.",
    glossary: ["fintech", "payment", "banking", "embedded finance", "fraud", "compliance", "kyc"],
    fundSectors: ["fintech"],
  }),
  build({
    slug: "productivity",
    name: "Productivity & Knowledge Work",
    short: "Documents, collaboration, knowledge management, and the prosumer + team productivity layer.",
    why: "Productivity companies are the hardest sector to read from engineering signals alone — UI quality and brand load most of the value, and that does not surface in public GitHub. We track this category for completeness and as a Marcus reference (tech VPs and operating partners almost always have a productivity-tooling consolidation thesis).",
    glossary: ["productivity", "collaboration", "document", "knowledge", "team", "workflow"],
    fundSectors: ["enterprise-saas", "consumer"],
  }),
];

export function getAllSectorSlugs(): string[] {
  return sectors.map((s) => s.slug);
}

export function getSector(slug: string): Sector | undefined {
  return sectors.find((s) => s.slug === slug);
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
 * Conservative match — false negatives are fine, false positives are not.
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
