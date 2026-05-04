// RFC 9727 API Discovery via well-known URI + RFC 9264 Linkset response.
// Lets agent runtimes auto-discover every machine-readable surface from
// a single canonical URL. Content-Type per RFC 9264 §4.2.
//
// Spec: https://www.rfc-editor.org/rfc/rfc9727
// Linkset format: https://www.rfc-editor.org/rfc/rfc9264

const SITE = "https://signals.gitdealflow.com";

interface LinkAttrs {
  href: string;
  type?: string;
  title?: string;
  hreflang?: string;
}

interface Linkset {
  anchor: string;
  // The relation type → list of links targeting that relation.
  // Common rels per IANA: service-doc, service-desc, service-meta,
  // describedby, alternate, status, type, item.
  [rel: string]: string | LinkAttrs[];
}

const linkset: { linkset: Linkset[] } = {
  linkset: [
    {
      anchor: SITE,
      "service-desc": [
        {
          href: `${SITE}/api/openapi.json`,
          type: "application/vnd.oai.openapi+json;version=3.1",
          title: "OpenAPI 3.1 specification for the signals API",
        },
      ],
      "service-doc": [
        {
          href: `${SITE}/developers`,
          type: "text/html",
          title: "Developer documentation",
        },
        {
          href: `${SITE}/agents`,
          type: "text/html",
          title: "Every machine-readable surface, with install snippets",
        },
      ],
      "service-meta": [
        {
          href: `${SITE}/.well-known/mcp.json`,
          type: "application/json",
          title: "MCP server discovery manifest",
        },
        {
          href: `${SITE}/.well-known/agent-card.json`,
          type: "application/json",
          title: "Google A2A AgentCard",
        },
        {
          href: `${SITE}/.well-known/ai-plugin.json`,
          type: "application/json",
          title: "ChatGPT plugin manifest (legacy compatibility)",
        },
      ],
      "describedby": [
        {
          href: `${SITE}/llms.txt`,
          type: "text/plain",
          title: "LLMs reference index for AI agents",
        },
        {
          href: `${SITE}/llms-full.txt`,
          type: "text/plain",
          title: "LLMs full reference",
        },
        {
          href: `${SITE}/ai.txt`,
          type: "text/plain",
          title: "AI access policy",
        },
      ],
      "alternate": [
        {
          href: `${SITE}/api/signals.json`,
          type: "application/json",
          title: "Full signals panel — JSON",
        },
        {
          href: `${SITE}/api/signals.csv`,
          type: "text/csv",
          title: "Full signals panel — CSV",
        },
        {
          href: `${SITE}/qa.jsonl`,
          type: "application/x-ndjson",
          title: "Q&A corpus (CC BY 4.0)",
        },
        {
          href: `${SITE}/feed.xml`,
          type: "application/rss+xml",
          title: "Blog RSS feed",
        },
      ],
      "item": [
        {
          href: `${SITE}/api/mcp/rpc`,
          type: "application/json",
          title: "MCP Streamable-HTTP endpoint",
        },
        {
          href: `${SITE}/api/a2a`,
          type: "application/json",
          title: "Google A2A JSON-RPC 2.0 endpoint",
        },
        {
          href: `${SITE}/api/nlweb`,
          type: "application/json",
          title: "Microsoft NLWeb conversational endpoint",
        },
        {
          href: `${SITE}/api/agent/call`,
          type: "application/json",
          title: "Function-calling endpoint (OpenAI/Anthropic/Gemini formats)",
        },
        {
          href: `${SITE}/api/agent/tools`,
          type: "application/json",
          title: "Function-calling tool manifest",
        },
      ],
    },
  ],
};

export async function GET() {
  return new Response(JSON.stringify(linkset, null, 2), {
    headers: {
      "Content-Type": "application/linkset+json; charset=utf-8",
      "Cache-Control": "s-maxage=86400, stale-while-revalidate=3600",
      "X-Robots-Tag": "index, follow",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
