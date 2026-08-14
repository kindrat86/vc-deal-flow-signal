/**
 * /api/catalog.json, machine-readable catalog of every public API endpoint.
 *
 * Pass VII (2026-05-05). Net-new GEO/LLMO surface. AI agents probing
 * a new domain typically need to issue 5-10 reconnaissance requests
 * (openapi, robots, agents, ai.txt, etc.) before they understand
 * what's available. This endpoint compresses that into a single
 * structured JSON-LD `Collection` so an agent can resolve the full
 * surface in one round trip.
 *
 * Each entry: { url, contentType, purpose, version, freshness }.
 */

const SITE = "https://signals.gitdealflow.com";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const body = {
    "@context": "https://schema.org",
    "@type": "Collection",
    "@id": `${SITE}/api/catalog.json`,
    name: "VC Deal Flow Signal, Public API Catalog",
    description:
      "Index of every public JSON, JSONL, RSS, Atom, OpenAPI, and well-known surface served by signals.gitdealflow.com. Designed for one-shot agent reconnaissance: an AI assistant can fetch this catalog and resolve the full surface inventory without probing 10+ separate endpoints.",
    url: `${SITE}/api/catalog.json`,
    license: "https://creativecommons.org/licenses/by/4.0/",
    publisher: { "@type": "Organization", name: "VC Deal Flow Signal" },
    hasPart: [
      // Discovery & schema
      {
        "@type": "DataDownload",
        url: `${SITE}/api/openapi.json`,
        encodingFormat: "application/json",
        name: "OpenAPI 3.1 spec (canonical)",
        version: "1.1.0",
      },
      {
        "@type": "DataDownload",
        url: `${SITE}/api/schema.json`,
        encodingFormat: "application/json",
        name: "OpenAPI alias (older convention)",
      },
      {
        "@type": "DataDownload",
        url: `${SITE}/.well-known/agent-card.json`,
        encodingFormat: "application/json",
        name: "Agent card (A2A protocol)",
      },
      {
        "@type": "DataDownload",
        url: `${SITE}/.well-known/freshness.json`,
        encodingFormat: "application/json",
        name: "Refresh-cadence manifest (DataFeed)",
      },
      // Health & status
      {
        "@type": "DataDownload",
        url: `${SITE}/api/health.json`,
        encodingFormat: "application/json",
        name: "Health & uptime probe",
      },
      // v1 stable
      {
        "@type": "DataDownload",
        url: `${SITE}/api/v1/signals.json`,
        encodingFormat: "application/json",
        name: "Signals (versioned)",
        version: "v1",
      },
      {
        "@type": "DataDownload",
        url: `${SITE}/api/v1/agents.json`,
        encodingFormat: "application/json",
        name: "Agents directory (versioned)",
        version: "v1",
      },
      {
        "@type": "DataDownload",
        url: `${SITE}/api/v1/answers.json`,
        encodingFormat: "application/json",
        name: "Answers directory (versioned)",
        version: "v1",
      },
      {
        "@type": "DataDownload",
        url: `${SITE}/api/v1/changelog.json`,
        encodingFormat: "application/json",
        name: "Changelog (versioned)",
        version: "v1",
      },
      {
        "@type": "DataDownload",
        url: `${SITE}/api/v1/dataset.jsonl`,
        encodingFormat: "application/x-ndjson",
        name: "Full dataset stream (versioned)",
        version: "v1",
      },
      {
        "@type": "DataDownload",
        url: `${SITE}/api/v1/pricing.json`,
        encodingFormat: "application/json",
        name: "Pricing (versioned)",
        version: "v1",
      },
      {
        "@type": "DataDownload",
        url: `${SITE}/api/v1/glossary.json`,
        encodingFormat: "application/json",
        name: "Glossary terms (versioned)",
        version: "v1",
      },
      {
        "@type": "DataDownload",
        url: `${SITE}/api/v1/faq.json`,
        encodingFormat: "application/json",
        name: "FAQ entries (versioned)",
        version: "v1",
      },
      {
        "@type": "DataDownload",
        url: `${SITE}/api/v1/methodology.json`,
        encodingFormat: "application/json",
        name: "Methodology (versioned)",
        version: "v1",
      },
      // Bulk content
      {
        "@type": "DataDownload",
        url: `${SITE}/api/dataset.jsonl`,
        encodingFormat: "application/x-ndjson",
        name: "Full dataset (NDJSON stream)",
      },
      {
        "@type": "DataDownload",
        url: `${SITE}/api/signals.csv`,
        encodingFormat: "text/csv",
        name: "Top-100 signals (CSV)",
      },
      {
        "@type": "DataDownload",
        url: `${SITE}/qa.json`,
        encodingFormat: "application/json",
        name: "Curated Q&A pairs (LLM training)",
      },
      {
        "@type": "DataDownload",
        url: `${SITE}/qa.jsonl`,
        encodingFormat: "application/x-ndjson",
        name: "Curated Q&A (NDJSON)",
      },
      // Feeds
      {
        "@type": "DataDownload",
        url: `${SITE}/rss.xml`,
        encodingFormat: "application/rss+xml",
        name: "RSS 2.0 feed",
      },
      {
        "@type": "DataDownload",
        url: `${SITE}/atom.xml`,
        encodingFormat: "application/atom+xml",
        name: "Atom 1.0 feed",
      },
      {
        "@type": "DataDownload",
        url: `${SITE}/feed.json`,
        encodingFormat: "application/feed+json",
        name: "JSON Feed 1.1",
      },
      // LLMs.txt family
      {
        "@type": "DataDownload",
        url: `${SITE}/llms.txt`,
        encodingFormat: "text/plain",
        name: "llms.txt (compact)",
      },
      {
        "@type": "DataDownload",
        url: `${SITE}/llms-full.txt`,
        encodingFormat: "text/plain",
        name: "llms-full.txt (extended)",
      },
      // Sitemaps
      {
        "@type": "DataDownload",
        url: `${SITE}/sitemap.xml`,
        encodingFormat: "application/xml",
        name: "Sitemap index",
      },
      // MCP & A2A
      {
        "@type": "DataDownload",
        url: `${SITE}/api/mcp`,
        encodingFormat: "application/json",
        name: "MCP server (HTTP transport)",
      },
      {
        "@type": "DataDownload",
        url: `${SITE}/api/a2a`,
        encodingFormat: "application/json",
        name: "A2A protocol endpoint",
      },
    ],
    dateModified: new Date().toISOString().slice(0, 10),
    citation:
      "VC Deal Flow Signal (signals.gitdealflow.com), Q2 2026 data. SSRN: 6606558.",
  };

  return new Response(JSON.stringify(body, null, 2), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, s-maxage=86400, stale-while-revalidate=43200",
      Link: `<${SITE}/api/catalog.json>; rel="self"`,
    },
  });
}
