/**
 * Company → HQ city mapping.
 *
 * Maps each /signal/[slug] company to a city slug from cities.ts.
 * Used by /city/[slug] and /sector/[slug]/in/[city] to show actual
 * tracked companies HQ'd in a given city rather than just editorial
 * notable-orgs strings.
 *
 * Source threshold: HQ is taken from the company's own homepage,
 * Crunchbase profile, or careers page. For multi-HQ orgs, we pick
 * the city most consistently referenced as primary. Cities outside
 * our cities.ts taxonomy fall back to the nearest covered hub:
 * Bay Area → san-francisco; Greater NYC → new-york; etc.
 *
 * Companies without a documented HQ (or whose HQ isn't reasonably
 * close to any city in cities.ts) get `null` and are skipped in
 * city-side aggregation.
 */

import { companies, type Company, getAllCompanySlugs } from "@/content/companies";
import { CITIES, getCityBySlug } from "@/content/cities";

/** city slug from cities.ts, or null if HQ doesn't map cleanly. */
const HQ_BY_SLUG: Record<string, string | null> = {
  // ── AI/ML core ──
  anthropic: "san-francisco",
  openai: "san-francisco",
  "mistral-ai": "paris",
  cohere: "toronto",
  huggingface: "new-york",
  "perplexity-ai": "san-francisco",
  "ai21-labs": "tel-aviv",
  writer: "san-francisco",
  "stability-ai": "london",

  // ── AI/ML, agent frameworks ──
  langchain: "san-francisco",
  "letta-ai": "san-francisco",
  mastra: "san-francisco",
  "dust-tt": "paris",
  crewai: "san-francisco",
  lovable: "stockholm",
  cursor: "san-francisco",

  // ── AI infrastructure ──
  modal: "new-york",
  replicate: "san-francisco",
  "together-ai": "san-francisco",
  "fireworks-ai": "san-francisco",
  groq: "san-francisco",
  e2b: "san-francisco",
  browserbase: "san-francisco",
  runway: "new-york",
  elevenlabs: "london",

  // ── Developer tools ──
  vercel: "san-francisco",
  tailwindcss: "los-angeles",
  shadcn: "san-francisco",
  linear: "san-francisco",
  remotion: "berlin",
  prisma: "berlin",
  drizzle: "san-francisco",
  inngest: "new-york",
  "trigger-dev": "london",
  posthog: "london",
  sentry: "san-francisco",
  grafana: "new-york",
  resend: "san-francisco",
  clerk: "san-francisco",
  stytch: "san-francisco",
  workos: "san-francisco",
  temporal: "seattle",
  pulumi: "seattle",
  twilio: "san-francisco",
  sourcegraph: "san-francisco",
  netlify: "san-francisco",
  bun: "san-francisco",
  deno: "san-francisco",
  "weights-biases": "san-francisco",

  // ── Infrastructure ──
  cloudflare: "san-francisco",
  hashicorp: "san-francisco",
  "fly-io": "chicago",
  fermyon: "seattle",
  railway: "san-francisco",

  // ── Database & data ──
  supabase: "singapore",
  neon: "san-francisco",
  planetscale: "san-francisco",
  turso: "san-francisco",
  upstash: "san-francisco",
  convex: "san-francisco",
  mongodb: "new-york",
  clickhouse: "amsterdam",
  duckdb: "amsterdam",
  timescale: "new-york",
  pinecone: "new-york",
  weaviate: "amsterdam",
  qdrant: "berlin",
  milvus: "san-francisco",
  redis: "san-francisco",
  mariadb: "helsinki",
  couchbase: "san-francisco",
  meilisearch: "paris",
  typesense: "san-francisco",

  // ── Observability ──
  datadog: "new-york",
  elastic: "amsterdam",
  honeycomb: "san-francisco",

  // ── Analytics ──
  "dbt-labs": "san-francisco",
  amplitude: "san-francisco",
  mixpanel: "san-francisco",
  metabase: "san-francisco",

  // ── Productivity ──
  figma: "san-francisco",

  // ── Fintech ──
  stripe: "san-francisco",
  plaid: "san-francisco",
  adyen: "amsterdam",
};

export function getCompanyHq(slug: string): string | null {
  return HQ_BY_SLUG[slug] ?? null;
}

export function getCompaniesInCity(citySlug: string): Company[] {
  const result: Company[] = [];
  for (const c of companies) {
    if (HQ_BY_SLUG[c.slug] === citySlug) {
      result.push(c);
    }
  }
  return result;
}

/** Companies in a sector that are HQ'd in a given city. */
export function getCompaniesInSectorAndCity(
  sectorSlug: string,
  citySlug: string,
): Company[] {
  const inCity = getCompaniesInCity(citySlug);
  return inCity.filter(
    (c) => c.sector === sectorSlug || c.relatedSectors.includes(sectorSlug),
  );
}

/**
 * Coverage audit, returns the slugs we know about but couldn't map.
 * Useful for build-step audit; not used at runtime.
 */
export function getUnmappedCompanySlugs(): string[] {
  const known = getAllCompanySlugs();
  return known.filter((s) => HQ_BY_SLUG[s] === undefined);
}

/** Sanity check, every city slug used must exist in cities.ts. */
export function getUnknownCitySlugs(): string[] {
  const unknown = new Set<string>();
  for (const [, city] of Object.entries(HQ_BY_SLUG)) {
    if (city && !getCityBySlug(city)) unknown.add(city);
  }
  return [...unknown];
}

void CITIES; // ensure import is not tree-shaken
