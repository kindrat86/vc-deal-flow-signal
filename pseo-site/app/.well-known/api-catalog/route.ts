/**
 * RFC 9727 — `/.well-known/api-catalog`
 *
 * Linkset-formatted (RFC 9264) catalog of every machine-readable API
 * description offered by this service. Emerging standard for agent-driven
 * API discovery: a fresh runtime asks
 * `GET https://example.com/.well-known/api-catalog`, gets back a list of
 * pointers to OpenAPI / MCP / AsyncAPI / etc., and decides which to use.
 *
 * RFCs:
 *   - https://www.rfc-editor.org/rfc/rfc9727  (the .well-known/api-catalog spec)
 *   - https://www.rfc-editor.org/rfc/rfc9264  (Linkset format)
 */

export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export async function GET() {
  const linkset = {
    linkset: [
      {
        anchor: SITE,
        // Machine-readable API descriptions
        "service-desc": [
          {
            href: `${SITE}/api/openapi.json`,
            type: "application/openapi+json",
            title: "OpenAPI 3.1 spec — full HTTP API surface",
          },
          {
            href: `${SITE}/.well-known/mcp.json`,
            type: "application/json",
            title:
              "MCP discovery manifest — 12 tools, three resources, two templates, seven prompts",
          },
          {
            href: `${SITE}/.well-known/agent-card.json`,
            type: "application/json",
            title: "Google A2A AgentCard (protocolVersion 0.3.0)",
          },
          {
            href: `${SITE}/.well-known/ai-plugin.json`,
            type: "application/json",
            title:
              "ChatGPT plugin manifest — references the OpenAPI spec, no auth",
          },
          {
            href: `${SITE}/api/agent/tools?format=openai`,
            type: "application/json",
            title:
              "Function-calling tool definitions (OpenAI / Anthropic / Gemini formats via ?format=)",
          },
          {
            href: `${SITE}/api/schema.json`,
            type: "application/openapi+json",
            title:
              "OpenAPI 3.1 spec (alias of /api/openapi.json — redirects 308)",
          },
          {
            href: `${SITE}/.well-known/model.json`,
            type: "application/json",
            title:
              "Model card — dataset+API capabilities, evaluation, limitations, agent entrypoints",
          },
          {
            href: `${SITE}/.well-known/compliance.json`,
            type: "application/json",
            title:
              "Enterprise compliance descriptor — GDPR / CCPA / SOC2 / ISO27001 posture, subprocessors, DPA contact",
          },
        ],
        // Human-readable docs
        "service-doc": [
          {
            href: `${SITE}/agents.md`,
            type: "text/markdown",
            title: "Canonical agent reference — install + tool list + citation",
          },
          {
            href: `${SITE}/llms.txt`,
            type: "text/plain",
            title: "Concise LLM context (links + index)",
          },
          {
            href: `${SITE}/llms-full.txt`,
            type: "text/plain",
            title: "Full LLM context — methodology, glossary, current data",
          },
          {
            href: `${SITE}/developers`,
            type: "text/html",
            title: "Developer / API page",
          },
        ],
        // Stable tool entry points (the actual callable endpoints)
        item: [
          { href: `${SITE}/api/signals.json`, title: "Bulk panel — JSON" },
          { href: `${SITE}/api/signals.csv`, title: "Bulk panel — CSV" },
          {
            href: `${SITE}/api/dataset.jsonl`,
            title:
              "Bulk panel — JSONL (Hugging Face Datasets / RAG ingestion compatible)",
          },
          {
            href: `${SITE}/api/mcp/rpc`,
            title: "MCP server — Streamable HTTP",
          },
          {
            href: `${SITE}/api/a2a`,
            title: "Google A2A — JSON-RPC 2.0",
          },
          {
            href: `${SITE}/api/nlweb`,
            title: "Microsoft NLWeb — conversational",
          },
          {
            href: `${SITE}/api/agent/call`,
            title: "Function-calling invoke endpoint",
          },
          {
            href: `${SITE}/api/badge/scout/{username}/svg`,
            title: "Embeddable Scout Score badge (SVG)",
          },
          {
            href: `${SITE}/api/badge/momentum/{org}/{repo}/svg`,
            title: "Embeddable Commit Momentum badge (SVG)",
          },
          {
            href: `${SITE}/api/answers.json`,
            title:
              "Full-content answer corpus — citation-ready Q&A in one fetch (RAG-friendly)",
          },
          {
            href: `${SITE}/api/agents.json`,
            title:
              "Flat-JSON agent surfaces index — companion to this api-catalog",
          },
          {
            href: `${SITE}/api/agents/install/{host}`,
            title:
              "Per-host install config — claude-desktop, cursor, windsurf, zed, cline, continue, aider, openai-agents-sdk, anthropic-sdk, langchain, llamaindex, huggingface-datasets, postman, chatgpt-custom-gpt",
          },
          {
            href: `${SITE}/.well-known/webfinger?resource=acct:gitdealflow@gitdealflow.com`,
            title:
              "RFC 7033 WebFinger — fediverse / IndieWeb discovery for the brand identity",
          },
          {
            href: `${SITE}/.well-known/host-meta`,
            title:
              "RFC 6415 host-meta XRD — host-level discovery descriptor",
          },
        ],
        // License + freshness pointers
        license: [
          {
            href: "https://creativecommons.org/licenses/by/4.0/",
            type: "text/html",
            title: "CC-BY 4.0 — commercial reuse with attribution",
          },
        ],
      },
    ],
  };

  return new Response(JSON.stringify(linkset, null, 2), {
    headers: {
      "Content-Type": "application/linkset+json; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800",
      "Access-Control-Allow-Origin": "*",
      "X-Robots-Tag": "index, follow",
    },
  });
}
