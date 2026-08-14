import { NextRequest } from "next/server";
import {
  getAllSectors,
  getCurrentPeriod,
  getSortedStartups,
  type Startup,
  type Sector,
} from "@/lib/data";
import { slugify } from "@/lib/slugify";

const BASE_URL = "https://signals.gitdealflow.com";
const NLWEB_VERSION = "0.1.0";
const SCHEMA_ORG = "https://schema.org";

const SECTOR_ALIASES: Record<string, string> = {
  ai: "ai-ml",
  "artificial-intelligence": "ai-ml",
  ml: "ai-ml",
  "machine-learning": "ai-ml",
  crypto: "web3",
  blockchain: "web3",
  cyber: "cybersecurity",
  infosec: "cybersecurity",
  security: "cybersecurity",
  saas: "enterprise-saas",
  enterprise: "enterprise-saas",
  devtools: "developer-tools",
  "developer-experience": "developer-tools",
  climate: "climate-tech",
  cleantech: "climate-tech",
  "clean-energy": "climate-tech",
  biotech: "healthcare",
  health: "healthcare",
  medtech: "healthcare",
  data: "data-infrastructure",
  databases: "data-infrastructure",
  "real-estate": "proptech",
  agriculture: "agtech",
  space: "space-tech",
  games: "gaming",
  community: "social-community",
  social: "social-community",
  logistics: "supply-chain",
  law: "legal-tech",
  legal: "legal-tech",
  recruiting: "hr-tech",
  hr: "hr-tech",
  learning: "edtech",
  education: "edtech",
  commerce: "ecommerce-infrastructure",
  "retail-infra": "ecommerce-infrastructure",
  hardware: "robotics",
  drones: "robotics",
  fintech: "fintech",
  finance: "fintech",
  finsec: "fintech",
};

function normalizeSector(input: string): string {
  const slug = slugify(input);
  return SECTOR_ALIASES[slug] ?? slug;
}

interface NLWebRequest {
  query?: string;
  site?: string;
  prev?: unknown[];
  streaming?: boolean;
  generate_mode?: string;
  mode?: string;
}

type Intent =
  | { kind: "trending" }
  | { kind: "sector"; slug: string; raw: string }
  | { kind: "startup"; name: string }
  | { kind: "methodology" }
  | { kind: "summary" }
  | { kind: "unknown" };

const SECTOR_SLUG_SET = new Set([
  "ai-ml",
  "fintech",
  "cybersecurity",
  "developer-tools",
  "healthcare",
  "climate-tech",
  "enterprise-saas",
  "data-infrastructure",
  "web3",
  "robotics",
  "edtech",
  "ecommerce-infrastructure",
  "supply-chain",
  "legal-tech",
  "hr-tech",
  "proptech",
  "agtech",
  "gaming",
  "space-tech",
  "social-community",
]);

function inferIntent(query: string): Intent {
  const t = query.toLowerCase();

  if (/method|how.*calcul|breakout.*mean|how.*work|signal.*mean|trust|interpret/.test(t)) {
    return { kind: "methodology" };
  }
  // Summary intent: dataset-level questions only. Skip if the query contains a
  // proper noun (capitalized word other than the first word), that's almost
  // always a startup name like "tell me about Roboflow".
  const hasProperNoun = /\s[A-Z][a-zA-Z]+/.test(query);
  if (
    !hasProperNoun &&
    /^(summary|fresh|cite|citation|csv|how do i cite|where (?:can|do) i (?:download|find))\b/i.test(t)
  ) {
    return { kind: "summary" };
  }
  if (
    !hasProperNoun &&
    /^(what|describe|tell me about) (?:this|the) (?:dataset|data|service|product|api|tool|signal)\b/i.test(t)
  ) {
    return { kind: "summary" };
  }
  if (!hasProperNoun && /^(what is this|how many startups|how many sectors)\b/i.test(t)) {
    return { kind: "summary" };
  }

  // Trending check runs BEFORE sector/startup regexes so "trending fintech startups"
  // resolves to a constrained-sector trending query, and "trending startups" doesn't
  // get misclassified as a sector lookup for "trending".
  const trendingHit = /\b(trending|hot|breakout|top|right now|this week|accelerat|who.*watch|who.*hot)\b/.test(t);

  const sectorMatch =
    /(?:in|for|about|inside)\s+([a-z][a-z\- ]{2,40})|\b([a-z][a-z\- ]{2,40})\s+(?:startups|companies|deal flow|movers|picks)/i.exec(query);
  if (sectorMatch) {
    const raw = (sectorMatch[1] ?? sectorMatch[2] ?? "").trim();
    const slug = normalizeSector(raw);
    // Only claim sector intent if the normalized slug is a real, supported sector.
    // Otherwise fall through to trending or unknown.
    if (raw && SECTOR_SLUG_SET.has(slug)) {
      return { kind: "sector", slug, raw };
    }
  }

  if (trendingHit) {
    return { kind: "trending" };
  }

  const lookupPattern =
    /(?:about|tell me about|profile|signal for|lookup|look up|how is|what's)\s+([A-Za-z][\w \-.]{1,80})/i.exec(query);
  if (lookupPattern) {
    return { kind: "startup", name: lookupPattern[1].trim() };
  }

  return { kind: "unknown" };
}

function startupAdditionalProperties(s: Startup) {
  return [
    { "@type": "PropertyValue" as const, name: "commitVelocity14d", value: s.commitVelocity14d },
    { "@type": "PropertyValue" as const, name: "commitVelocityChange", value: s.commitVelocityChange },
    { "@type": "PropertyValue" as const, name: "contributors", value: s.contributors },
    { "@type": "PropertyValue" as const, name: "contributorGrowth", value: s.contributorGrowth },
    { "@type": "PropertyValue" as const, name: "newRepos", value: s.newRepos },
    { "@type": "PropertyValue" as const, name: "signalType", value: s.signalType },
    { "@type": "PropertyValue" as const, name: "stage", value: s.stage },
    { "@type": "PropertyValue" as const, name: "geography", value: s.geography },
  ];
}

function buildOrgJsonLd(s: Startup, sectorName?: string) {
  const profileUrl = `${BASE_URL}/startup/${slugify(s.name)}`;
  const sameAs: string[] = [s.githubUrl];
  if (s.websiteUrl) sameAs.push(s.websiteUrl);
  if (s.linkedinUrl) sameAs.push(s.linkedinUrl);
  return {
    "@type": "Organization" as const,
    "@id": profileUrl,
    name: s.name,
    description: s.description,
    url: s.websiteUrl ?? profileUrl,
    sameAs,
    ...(sectorName ? { industry: sectorName } : {}),
    additionalProperty: startupAdditionalProperties(s),
  };
}

function buildItemList(name: string, description: string, items: object[]) {
  return {
    "@context": SCHEMA_ORG,
    "@type": "ItemList" as const,
    name,
    description,
    url: BASE_URL,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem" as const,
      position: i + 1,
      item,
    })),
    isBasedOn: BASE_URL,
    license: `${BASE_URL}/terms`,
  };
}

function getActiveSectors(): Sector[] {
  const period = getCurrentPeriod();
  return getAllSectors().filter((s) => s.periods[period.slug]);
}

function findStartup(name: string): { startup: Startup; sectorName: string } | null {
  const target = slugify(name);
  const period = getCurrentPeriod();
  for (const sector of getAllSectors()) {
    const snap = sector.periods[period.slug];
    if (!snap) continue;
    const match = snap.startups.find((st) => slugify(st.name) === target);
    if (match) return { startup: match, sectorName: sector.name };
  }
  return null;
}

function trendingResponse() {
  const period = getCurrentPeriod();
  const active = getActiveSectors();
  const all = active.flatMap((s) =>
    s.periods[period.slug].startups.map((st) => ({ ...st, _sectorName: s.name }))
  );
  const top20 = getSortedStartups(all).slice(0, 20);
  const items = top20.map((s) =>
    buildOrgJsonLd(s, (s as Startup & { _sectorName?: string })._sectorName)
  );
  return buildItemList(
    `Top 20 Trending Startups by Engineering Acceleration, ${period.name}`,
    `Cross-sector ranking of startups with the strongest engineering momentum on public GitHub for the current weekly period (${period.name}). Ranked by commit velocity change.`,
    items
  );
}

function sectorResponse(intent: Extract<Intent, { kind: "sector" }>) {
  const period = getCurrentPeriod();
  const sector = getAllSectors().find(
    (s) => s.slug === intent.slug && s.periods[period.slug]
  );
  if (!sector) {
    const available = getActiveSectors().map((s) => s.slug);
    return {
      "@context": SCHEMA_ORG,
      "@type": "ItemList" as const,
      name: `Sector "${intent.raw}" not found`,
      description: `Unknown sector. Active sectors: ${available.join(", ")}.`,
      numberOfItems: 0,
      itemListElement: [],
    };
  }
  const sorted = getSortedStartups(sector.periods[period.slug].startups);
  const items = sorted.map((s) => buildOrgJsonLd(s, sector.name));
  return buildItemList(
    `${sector.name} Startups by Engineering Acceleration, ${period.name}`,
    `${sector.description} Ranked by commit velocity change for ${period.name}.`,
    items
  );
}

function startupResponse(intent: Extract<Intent, { kind: "startup" }>) {
  const period = getCurrentPeriod();
  const found = findStartup(intent.name);
  if (!found) {
    return {
      "@context": SCHEMA_ORG,
      "@type": "WebPage" as const,
      name: `Startup "${intent.name}" not in tracked universe`,
      description:
        "Try the exact GitHub org name. Browse the tracked universe via /api/signals.json or call get_trending_startups via the MCP server.",
      url: `${BASE_URL}/api/signals.json`,
    };
  }
  return {
    "@context": SCHEMA_ORG,
    ...buildOrgJsonLd(found.startup, found.sectorName),
    citation: `VC Deal Flow Signal (signals.gitdealflow.com), ${period.name} data.`,
  };
}

async function methodologyResponse() {
  let bodyText = "";
  try {
    const res = await fetch(`${BASE_URL}/llms-full.txt`, {
      headers: { "User-Agent": "gitdealflow-nlweb/0.1.0" },
    });
    if (res.ok) {
      const t = await res.text();
      bodyText = t.split("## Methodology")[1]?.split("## Glossary")[0]?.trim() ?? "";
    }
  } catch {
    // best-effort; the link below still resolves
  }
  return {
    "@context": SCHEMA_ORG,
    "@type": "Article" as const,
    headline: "VC Deal Flow Signal, Methodology",
    description:
      "Data sources, metric computation, signal classification, refresh cadence, and known limitations.",
    articleBody: bodyText,
    url: `${BASE_URL}/methodology`,
    isBasedOn: `${BASE_URL}/llms-full.txt`,
    license: `${BASE_URL}/terms`,
  };
}

function summaryResponse() {
  const period = getCurrentPeriod();
  const active = getActiveSectors();
  const total = active.reduce(
    (sum, s) => sum + s.periods[period.slug].startups.length,
    0
  );
  return {
    "@context": SCHEMA_ORG,
    "@type": "Dataset" as const,
    name: "VC Deal Flow Signal",
    description:
      "Public dataset of startup engineering acceleration derived from public GitHub activity. Commit velocity, contributor growth, and signal classification across 15 sectors. Updated weekly.",
    url: BASE_URL,
    keywords: [
      "venture-capital",
      "deal-flow",
      "startup-signals",
      "github-analytics",
      "engineering-acceleration",
    ],
    creator: {
      "@type": "Organization",
      name: "GitDealFlow",
      url: "https://gitdealflow.com",
    },
    distribution: [
      { "@type": "DataDownload", encodingFormat: "application/json", contentUrl: `${BASE_URL}/api/signals.json` },
      { "@type": "DataDownload", encodingFormat: "text/csv", contentUrl: `${BASE_URL}/api/signals.csv` },
      { "@type": "DataDownload", encodingFormat: "application/rss+xml", contentUrl: `${BASE_URL}/feed.xml` },
      { "@type": "DataDownload", encodingFormat: "application/openapi+json", contentUrl: `${BASE_URL}/api/openapi.json` },
    ],
    temporalCoverage: period.name,
    dateModified: new Date().toISOString(),
    license: `${BASE_URL}/terms`,
    additionalProperty: [
      { "@type": "PropertyValue", name: "sectorsActive", value: active.length },
      { "@type": "PropertyValue", name: "startupsTracked", value: total },
      { "@type": "PropertyValue", name: "updateFrequency", value: "Weekly (Mondays ~09:00 UTC)" },
    ],
  };
}

function unknownResponse(query: string) {
  return {
    "@context": SCHEMA_ORG,
    "@type": "WebPage" as const,
    name: "Could not resolve query",
    description: `The query "${query}" did not match a known intent. Try one of: 'trending startups', '<sector> startups', 'tell me about <startup>', 'how is this calculated', 'what is this dataset'.`,
    url: BASE_URL,
    potentialAction: [
      { "@type": "SearchAction", target: `${BASE_URL}/?q={search_term_string}`, "query-input": "required name=search_term_string" },
    ],
    sameAs: [
      `${BASE_URL}/agents.md`,
      `${BASE_URL}/llms.txt`,
      `${BASE_URL}/.well-known/agent-card.json`,
      `${BASE_URL}/.well-known/mcp.json`,
    ],
  };
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
} as const;

export async function GET() {
  const period = getCurrentPeriod();
  return Response.json(
    {
      service: "GitDealFlow NLWeb endpoint",
      protocol: "nlweb",
      version: NLWEB_VERSION,
      transport: "https",
      method: "POST",
      contentType: "application/json",
      schema: {
        request: {
          query: "string (required), natural-language question",
          site: "string (optional)",
          prev: "array (optional), prior turns, NLWeb conversational context",
          streaming: "boolean (optional, default false)",
          mode: "string (optional), 'list' | 'summarize' | 'generate'",
        },
        response: {
          contentType: "application/ld+json",
          notes:
            "Schema.org-typed JSON-LD. Top-level @type is one of: ItemList (trending / sector), Organization (single startup), Article (methodology), Dataset (summary), WebPage (fallback).",
        },
      },
      examples: [
        { query: "trending startups this week" },
        { query: "ai-ml startups" },
        { query: "show me cybersecurity deal flow" },
        { query: "tell me about Roboflow" },
        { query: "how is this calculated" },
        { query: "what is this dataset" },
      ],
      currentPeriod: period.name,
      docs: `${BASE_URL}/agents.md`,
      agentCard: `${BASE_URL}/.well-known/agent-card.json`,
      mcpManifest: `${BASE_URL}/.well-known/mcp.json`,
    },
    {
      headers: {
        ...CORS_HEADERS,
        "Cache-Control": "public, max-age=3600",
      },
    }
  );
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      ...CORS_HEADERS,
      "Access-Control-Max-Age": "86400",
    },
  });
}

export async function POST(request: NextRequest) {
  let body: NLWebRequest;
  try {
    body = (await request.json()) as NLWebRequest;
  } catch {
    return Response.json(
      {
        "@context": SCHEMA_ORG,
        "@type": "WebPage" as const,
        name: "Invalid request",
        description: "Body must be valid JSON. Send { \"query\": \"...\" }.",
      },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const query = (body?.query ?? "").trim();
  if (!query) {
    return Response.json(
      {
        "@context": SCHEMA_ORG,
        "@type": "WebPage" as const,
        name: "Missing query",
        description: "Send { \"query\": \"<natural-language question>\" }.",
      },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const intent = inferIntent(query);
  let payload: object;
  switch (intent.kind) {
    case "trending":
      payload = trendingResponse();
      break;
    case "sector":
      payload = sectorResponse(intent);
      break;
    case "startup":
      payload = startupResponse(intent);
      break;
    case "methodology":
      payload = await methodologyResponse();
      break;
    case "summary":
      payload = summaryResponse();
      break;
    case "unknown":
    default:
      payload = unknownResponse(query);
      break;
  }

  return new Response(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/ld+json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-NLWeb-Intent": intent.kind,
    },
  });
}
