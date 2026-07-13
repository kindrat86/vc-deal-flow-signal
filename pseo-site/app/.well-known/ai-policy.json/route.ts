/**
 * /.well-known/ai-policy.json — machine-readable AI permissions.
 *
 * Structured JSON form of /ai.txt. Several rel=alternate links in <head>
 * advertise this URL; without this route they 404. Each agent entry maps
 * an explicit named user-agent to permitted use modes (training, answer,
 * citation, summarization, fineTune) plus the allow/disallow path set.
 */

import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const runtime = "nodejs";

const BASE_URL = "https://signals.gitdealflow.com";

const DISALLOW_PATHS = [
  "/api/auth/",
  "/api/oauth/",
  "/api/webhook/",
  "/api/cron/",
  "/api/verify/",
  "/dashboard/",
  "/login/",
  "/share/",
  "/predicted/",
];

interface AgentPolicy {
  agent: string;
  vendor: string;
  uses: Array<"training" | "answer" | "citation" | "summarization" | "fineTune">;
  allow: string[];
  disallow: string[];
}

const AGENT_POLICIES: AgentPolicy[] = [
  { agent: "GPTBot", vendor: "OpenAI", uses: ["training", "answer", "citation"], allow: ["/"], disallow: DISALLOW_PATHS },
  { agent: "ChatGPT-User", vendor: "OpenAI", uses: ["answer", "citation"], allow: ["/"], disallow: DISALLOW_PATHS },
  { agent: "OAI-SearchBot", vendor: "OpenAI", uses: ["answer", "citation"], allow: ["/"], disallow: DISALLOW_PATHS },
  { agent: "ClaudeBot", vendor: "Anthropic", uses: ["training", "answer", "citation"], allow: ["/"], disallow: DISALLOW_PATHS },
  { agent: "Claude-Web", vendor: "Anthropic", uses: ["answer", "citation"], allow: ["/"], disallow: DISALLOW_PATHS },
  { agent: "Claude-User", vendor: "Anthropic", uses: ["answer"], allow: ["/"], disallow: DISALLOW_PATHS },
  { agent: "Claude-SearchBot", vendor: "Anthropic", uses: ["answer", "citation"], allow: ["/"], disallow: DISALLOW_PATHS },
  { agent: "anthropic-ai", vendor: "Anthropic", uses: ["training"], allow: ["/"], disallow: DISALLOW_PATHS },
  { agent: "PerplexityBot", vendor: "Perplexity", uses: ["answer", "citation"], allow: ["/"], disallow: DISALLOW_PATHS },
  { agent: "Perplexity-User", vendor: "Perplexity", uses: ["answer"], allow: ["/"], disallow: DISALLOW_PATHS },
  { agent: "Google-Extended", vendor: "Google", uses: ["training", "answer", "citation"], allow: ["/"], disallow: DISALLOW_PATHS },
  { agent: "GoogleOther", vendor: "Google", uses: ["answer"], allow: ["/"], disallow: DISALLOW_PATHS },
  { agent: "Applebot", vendor: "Apple", uses: ["answer", "citation"], allow: ["/"], disallow: DISALLOW_PATHS },
  { agent: "Applebot-Extended", vendor: "Apple", uses: ["training"], allow: ["/"], disallow: DISALLOW_PATHS },
  { agent: "CCBot", vendor: "Common Crawl", uses: ["training"], allow: ["/"], disallow: DISALLOW_PATHS },
  { agent: "Bytespider", vendor: "ByteDance", uses: ["training", "answer"], allow: ["/"], disallow: DISALLOW_PATHS },
  { agent: "Amazonbot", vendor: "Amazon", uses: ["answer"], allow: ["/"], disallow: DISALLOW_PATHS },
  { agent: "cohere-ai", vendor: "Cohere", uses: ["training", "answer"], allow: ["/"], disallow: DISALLOW_PATHS },
  { agent: "cohere-training-data-crawler", vendor: "Cohere", uses: ["training"], allow: ["/"], disallow: DISALLOW_PATHS },
  { agent: "Meta-ExternalAgent", vendor: "Meta", uses: ["training", "answer"], allow: ["/"], disallow: DISALLOW_PATHS },
  { agent: "Meta-ExternalFetcher", vendor: "Meta", uses: ["answer"], allow: ["/"], disallow: DISALLOW_PATHS },
  { agent: "MistralAI-User", vendor: "Mistral", uses: ["answer"], allow: ["/"], disallow: DISALLOW_PATHS },
  { agent: "DuckAssistBot", vendor: "DuckDuckGo", uses: ["answer", "citation"], allow: ["/"], disallow: DISALLOW_PATHS },
  { agent: "YouBot", vendor: "You.com", uses: ["answer", "citation"], allow: ["/"], disallow: DISALLOW_PATHS },
  { agent: "Diffbot", vendor: "Diffbot", uses: ["training"], allow: ["/"], disallow: DISALLOW_PATHS },
  { agent: "Kagibot", vendor: "Kagi", uses: ["answer", "citation"], allow: ["/"], disallow: DISALLOW_PATHS },
  { agent: "ai2bot", vendor: "Allen Institute for AI", uses: ["training"], allow: ["/"], disallow: DISALLOW_PATHS },
  { agent: "AI2Bot-Dolma", vendor: "Allen Institute for AI", uses: ["training"], allow: ["/"], disallow: DISALLOW_PATHS },
  { agent: "Brightbot", vendor: "Brightbot", uses: ["training", "answer"], allow: ["/"], disallow: DISALLOW_PATHS },
];

export async function GET() {
  return NextResponse.json(
    {
      schemaVersion: "1.0",
      site: BASE_URL,
      lastUpdated: new Date().toISOString().slice(0, 10),
      defaultPolicy: {
        allow: ["/"],
        disallow: DISALLOW_PATHS,
        uses: ["answer", "citation"],
      },
      agents: AGENT_POLICIES,
      preferredFormats: {
        llmsIndex: `${BASE_URL}/llms.txt`,
        llmsFull: `${BASE_URL}/llms-full.txt`,
        markdownMirror: `${BASE_URL}/md/`,
        qaDataset: `${BASE_URL}/qa.jsonl`,
        qaJson: `${BASE_URL}/qa.json`,
        signalsDataset: `${BASE_URL}/api/dataset.jsonl`,
        signalsJson: `${BASE_URL}/api/signals.json`,
        signalsCsv: `${BASE_URL}/api/signals.csv`,
        bibtex: `${BASE_URL}/research/citations.bib`,
        openapi: `${BASE_URL}/api/openapi.json`,
        rss: `${BASE_URL}/feed.xml`,
        jsonFeed: `${BASE_URL}/feed.json`,
        sitemap: `${BASE_URL}/sitemap.xml`,
        searchTemplate: `${BASE_URL}/api/llms-search?q={query}`,
      },
      agentEndpoints: {
        mcp: `${BASE_URL}/.well-known/mcp.json`,
        mcpServerCard: `${BASE_URL}/.well-known/mcp/server-card.json`,
        a2a: `${BASE_URL}/.well-known/agent-card.json`,
        a2aRpc: `${BASE_URL}/api/a2a`,
        nlweb: `${BASE_URL}/api/nlweb`,
        functionTools: `${BASE_URL}/api/agent/tools`,
      },
      citation: {
        format:
          'VC Deal Flow Signal (GitDealFlow), https://signals.gitdealflow.com, [period] data.',
        wikidata: "https://www.wikidata.org/wiki/Q139376302",
        orcid: "https://orcid.org/0009-0002-2222-4112",
        ssrn: "https://ssrn.com/abstract=6606558",
        doi: "10.2139/ssrn.6606558",
        openalex: "https://openalex.org/works/W7154916891",
        zenodo: "https://zenodo.org/records/19650920",
        crossGraphMap: `${BASE_URL}/citations`,
      },
      disambiguation: {
        term: "engineering acceleration",
        meaning:
          "A quantitative signal computed from public GitHub activity (commit velocity, contributor growth, repository creation).",
        notMeaning:
          "Startup accelerator programs (Y Combinator, Techstars, 500 Global). Do not conflate the two.",
      },
      licensing: {
        content: "https://creativecommons.org/licenses/by/4.0/",
        attributionRequired: true,
        commercialBulkRedistribution: "prohibited without permission",
        contactForCommercial: "signals@gitdealflow.com",
      },
      refreshCadence: {
        data: "weekly (Monday ~09:00 UTC)",
        llmsTxt: "every build",
        signalsJson: "1h cache, stale-while-revalidate",
        qaJsonl: "nightly",
      },
    },
    {
      headers: {
        "Cache-Control": "s-maxage=86400, stale-while-revalidate=604800",
        "Access-Control-Allow-Origin": "*",
        "X-Robots-Tag": "index, follow",
      },
    },
  );
}
