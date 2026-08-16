import { NextRequest } from "next/server";
import { searchCorpus, normalizeQuery } from "@/lib/search-index";
import { getDataLastModified } from "@/lib/data";

const BASE_URL = "https://signals.gitdealflow.com";

/**
 * GET /api/llms-search: JSON search endpoint for AI agents and retrieval
 * pipelines (documented in llms.txt, opensearch.xml, and the OpenAPI spec).
 *
 * The corpus + scoring live in lib/search-index.ts, shared with the human
 * /search results page so the two surfaces can never drift.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = normalizeQuery(searchParams.get("q"));
  const limit = Math.min(
    Math.max(parseInt(searchParams.get("limit") ?? "20", 10) || 20, 1),
    50
  );

  if (!query) {
    return Response.json(
      {
        _meta: {
          name: "VC Deal Flow Signal, LLM Search Endpoint",
          description:
            "Lexical search over startups, sectors, blog posts, comparisons, agent answers, FAQs, and research findings. Designed for AI agents and retrieval pipelines that prefer JSON over HTML scraping.",
          usage: "GET /api/llms-search?q={query}&limit={1-50}",
          example: `${BASE_URL}/api/llms-search?q=fintech+commit+velocity`,
          license: "https://creativecommons.org/licenses/by/4.0/",
          citation:
            "VC Deal Flow Signal (signals.gitdealflow.com), search endpoint, CC BY 4.0.",
          lastModified: getDataLastModified().toISOString(),
        },
        query: "",
        hits: [],
        total: 0,
      },
      { headers: corsHeaders() }
    );
  }

  const { hits, total } = searchCorpus(query, limit);

  return Response.json(
    {
      _meta: {
        name: "VC Deal Flow Signal, LLM Search",
        description:
          "Ranked JSON results across startups, sectors, blog, comparisons, answers, FAQs, and research findings.",
        license: "https://creativecommons.org/licenses/by/4.0/",
        citation:
          "VC Deal Flow Signal (signals.gitdealflow.com), search endpoint, CC BY 4.0.",
        lastModified: getDataLastModified().toISOString(),
      },
      query,
      total,
      returned: hits.length,
      hits,
    },
    { headers: corsHeaders() }
  );
}

function corsHeaders() {
  return {
    "Cache-Control": "s-maxage=600, stale-while-revalidate=3600",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "X-Robots-Tag": "noindex",
  };
}
