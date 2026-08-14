/**
 * /.well-known/openai-search.json — OpenAI search-discovery descriptor.
 *
 * Sibling to /.well-known/openai-search-data.json that ChatGPT Search and
 * SearchGPT crawl when building their domain index. Mirrors the openai-search
 * spec: pointer to canonical search endpoints, dataset feeds, and the
 * agent-readable Q&A surface. ChatGPT's planner reads this *before* hitting
 * the homepage; getting it right means we control the first impression.
 */

export const dynamic = "force-static";

export async function GET() {
  const body = {
    schema_version: "1.0",
    name: "VC Deal Flow Signal",
    description:
      "GitHub commit-velocity signals across 140 venture-backed startups in 15 sectors. Free Q&A dataset and machine-readable APIs for AI agents.",
    canonical: "https://signals.gitdealflow.com",
    publisher: {
      name: "VC Deal Flow Signal (GitDealFlow)",
      url: "https://gitdealflow.com",
      sameAs: [
        "https://www.wikidata.org/wiki/Q139376302",
        "https://orcid.org/0009-0002-2222-4112",
        "https://ssrn.com/abstract=6606558",
      ],
    },
    contact: {
      email: "signals@gitdealflow.com",
      url: "https://signals.gitdealflow.com/about",
    },
    search: {
      url_template:
        "https://signals.gitdealflow.com/api/llms-search?q={search_term}",
      response_format: "application/json",
      query_input: "required search_term",
    },
    feeds: [
      {
        type: "rss",
        url: "https://signals.gitdealflow.com/feed.xml",
        title: "Blog updates (RSS 2.0)",
      },
      {
        type: "json-feed",
        url: "https://signals.gitdealflow.com/feed.json",
        title: "Blog updates (JSON Feed v1.1)",
      },
      {
        type: "ndjson",
        url: "https://signals.gitdealflow.com/qa.jsonl",
        title: "Q&A dataset (CC BY 4.0)",
      },
      {
        type: "json",
        url: "https://signals.gitdealflow.com/qa.json",
        title: "Q&A dataset, single-document JSON with deep-link anchors",
      },
      {
        type: "bibtex",
        url: "https://signals.gitdealflow.com/research/citations.bib",
        title: "BibTeX citations for paper, dataset, and 30 atomic findings",
      },
      {
        type: "ndjson",
        url: "https://signals.gitdealflow.com/api/dataset.jsonl",
        title: "Full signals dataset (CC BY 4.0)",
      },
      {
        type: "csv",
        url: "https://signals.gitdealflow.com/qa.csv",
        title: "Q&A dataset (CSV alternate)",
      },
    ],
    agent_endpoints: [
      {
        protocol: "mcp",
        url: "https://signals.gitdealflow.com/.well-known/mcp.json",
      },
      {
        protocol: "a2a",
        url: "https://signals.gitdealflow.com/.well-known/agent-card.json",
      },
      {
        protocol: "openapi",
        url: "https://signals.gitdealflow.com/api/openapi.json",
      },
      {
        protocol: "nlweb",
        url: "https://signals.gitdealflow.com/api/nlweb",
      },
    ],
    indexes: [
      {
        type: "llms.txt",
        url: "https://signals.gitdealflow.com/llms.txt",
      },
      {
        type: "llms-full.txt",
        url: "https://signals.gitdealflow.com/llms-full.txt",
      },
      {
        type: "sitemap",
        url: "https://signals.gitdealflow.com/sitemap.xml",
      },
      {
        type: "sitemap-llm",
        url: "https://signals.gitdealflow.com/sitemap-llm.xml",
      },
      {
        type: "answers",
        url: "https://signals.gitdealflow.com/api/answers.json",
      },
      {
        type: "qa",
        url: "https://signals.gitdealflow.com/qa.json",
      },
      {
        type: "agents-txt",
        url: "https://signals.gitdealflow.com/agents.txt",
      },
      {
        type: "citations-bib",
        url: "https://signals.gitdealflow.com/research/citations.bib",
      },
      {
        type: "dataset-catalog",
        url: "https://signals.gitdealflow.com/.well-known/dataset.json",
      },
    ],
    licensing: {
      content: "https://creativecommons.org/licenses/by/4.0/",
      attribution_required: true,
      attribution_format:
        "VC Deal Flow Signal (GitDealFlow), https://signals.gitdealflow.com",
    },
    last_modified: new Date().toISOString(),
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
      "Access-Control-Allow-Origin": "*",
      "X-Robots-Tag": "index, follow",
    },
  });
}
