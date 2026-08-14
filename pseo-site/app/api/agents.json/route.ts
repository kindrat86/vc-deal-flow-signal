import { agentQueries } from "@/content/agent-queries";
import { getDataLastModified } from "@/lib/data";

export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

/**
 * Conventional flat-JSON index of every agent surface.
 *
 * Companion to `/.well-known/api-catalog` (RFC 9727 Linkset). Same data, but
 * shaped for runtimes that prefer a familiar JSON object over Linkset's
 * link-element vocabulary. Both endpoints are kept in sync intentionally —
 * agents pick whichever format their toolchain handles.
 */
export async function GET() {
  const lastModified = getDataLastModified();

  const body = {
    version: "1.0.0",
    name: "VC Deal Flow Signal — Agent Surfaces Index",
    description:
      "Free, no-auth public surfaces for AI agents. Each surface wraps the same dataset of ~369 venture-backed startups across 15 sectors, refreshed weekly.",
    site: SITE,
    license: {
      identifier: "CC-BY-4.0",
      url: "https://creativecommons.org/licenses/by/4.0/",
    },
    citation: "VC Deal Flow Signal (signals.gitdealflow.com), Q2 2026 data.",
    contact: {
      email: "signals@gitdealflow.com",
      telegram: "https://t.me/gitdealflow",
    },
    lastModified: lastModified.toISOString(),
    documentation: {
      agents_md: `${SITE}/AGENTS.md`,
      llms_txt: `${SITE}/llms.txt`,
      llms_full_txt: `${SITE}/llms-full.txt`,
      methodology: `${SITE}/methodology`,
      developers: `${SITE}/developers`,
      ssrn_preprint: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6606558",
    },
    surfaces: {
      mcp: {
        stdio: {
          install: "npx -y @gitdealflow/mcp-signal",
          npm_package: "@gitdealflow/mcp-signal",
          npm_url: "https://www.npmjs.com/package/@gitdealflow/mcp-signal",
          registry_id: "io.github.kindrat86/vc-deal-flow-signal",
          glama_tier: "A",
          glama_url:
            "https://glama.ai/mcp/servers/@kindrat86/vc-deal-flow-signal",
          discovery_manifest: `${SITE}/.well-known/mcp.json`,
        },
        http: {
          endpoint: `${SITE}/api/mcp/rpc`,
          transport: "Streamable HTTP",
        },
        tools: [
          "get_trending_startups",
          "search_startups_by_sector",
          "get_startup_signal",
          "get_signals_summary",
          "get_scout_receipts",
          "get_methodology",
        ],
      },
      a2a: {
        endpoint: `${SITE}/api/a2a`,
        transport: "JSON-RPC 2.0",
        agent_card: `${SITE}/.well-known/agent-card.json`,
        protocol_version: "0.3.0",
      },
      nlweb: {
        endpoint: `${SITE}/api/nlweb`,
        transport: "POST conversational",
        accepts: "natural-language query",
        returns: "schema.org-typed JSON-LD",
      },
      function_calling: {
        tool_definitions: `${SITE}/api/agent/tools`,
        invoke: `${SITE}/api/agent/call`,
        formats: ["openai", "anthropic", "gemini"],
      },
      openapi: {
        spec: `${SITE}/api/openapi.json`,
        version: "3.1",
      },
      json_panel: {
        endpoint: `${SITE}/api/signals.json`,
        cache_seconds: 86400,
      },
      community: {
        // Brunson Expert Secrets §1 Ch 4 (Mass Movement Vehicle) — member-
        // side ledger that pairs with /wins (startup-side ledger). Roster,
        // pre-sorted leaderboard, aggregate cohort stats, public 60d/90d
        // grading rules — all in one fetch.
        endpoint: `${SITE}/api/v1/members.json`,
        web_ui: `${SITE}/members`,
        leaderboard: `${SITE}/members/leaderboard`,
        apply: `${SITE}/members/join`,
        cache_seconds: 3600,
        anonymity_rule:
          "Pseudonymous handles welcome under the same rule as @thedatanerd. Real name never required.",
      },
      csv_panel: {
        endpoint: `${SITE}/api/signals.csv`,
        cache_seconds: 86400,
      },
      jsonl_panel: {
        endpoint: `${SITE}/api/dataset.jsonl`,
        format: "Hugging Face Datasets / RAG ingestion compatible",
        leading_meta_line: true,
      },
      badges: {
        scout: {
          endpoint: `${SITE}/api/badge/scout/{username}/svg`,
          builder: `${SITE}/badge-builder`,
        },
        momentum: {
          endpoint: `${SITE}/api/badge/momentum/{org}/{repo}/svg`,
          builder: `${SITE}/badge-builder`,
        },
      },
      receipts: {
        endpoint: `${SITE}/api/receipts/{username}`,
        web_ui: `${SITE}/receipts`,
      },
      well_known: {
        ai_plugin: `${SITE}/.well-known/ai-plugin.json`,
        agent_card: `${SITE}/.well-known/agent-card.json`,
        mcp: `${SITE}/.well-known/mcp.json`,
        agents_md: `${SITE}/.well-known/agents.md`,
        api_catalog: `${SITE}/.well-known/api-catalog`,
        security_txt: `${SITE}/.well-known/security.txt`,
        webfinger: `${SITE}/.well-known/webfinger?resource=acct:gitdealflow@gitdealflow.com`,
        host_meta: `${SITE}/.well-known/host-meta`,
      },
      answer_corpus: {
        index: `${SITE}/answers`,
        full_json: `${SITE}/api/answers.json`,
      },
      install_configs: {
        index: `${SITE}/api/agents/install/index`,
        per_host_template: `${SITE}/api/agents/install/{host}`,
        supported_hosts: [
          "claude-desktop",
          "claude-code",
          "cursor",
          "windsurf",
          "zed",
          "cline",
          "continue",
          "aider",
          "openai-agents-sdk",
          "anthropic-sdk",
          "google-genai-sdk",
          "langchain",
          "llamaindex",
          "huggingface-datasets",
          "postman",
          "chatgpt-custom-gpt",
        ],
      },
    },
    answer_pages: agentQueries.map((q) => ({
      slug: q.slug,
      url: `${SITE}/answers/${q.slug}`,
      query: q.query,
      title: q.h1,
      description: q.description,
    })),
    coding_agent_configs: {
      cursor_rule: `${SITE}/agents/cursor-rule.mdc`,
      continue_json: `${SITE}/agents/continue.json`,
      aider_md: `${SITE}/agents/aider.md`,
      huggingface_dataset: `${SITE}/agents/huggingface-dataset-readme.md`,
      langchain_hub_prompt: `${SITE}/agents/langchain-hub-prompt.json`,
      postman_collection: `${SITE}/agents/postman-collection.json`,
    },
    crawl_policy: {
      robots_txt: `${SITE}/robots.txt`,
      sitemap_index: `${SITE}/sitemap.xml`,
      ai_crawlers_allowed: [
        "GPTBot",
        "ChatGPT-User",
        "OAI-SearchBot",
        "ClaudeBot",
        "Claude-Web",
        "anthropic-ai",
        "PerplexityBot",
        "Perplexity-User",
        "Google-Extended",
        "CCBot",
        "Bytespider",
        "Applebot-Extended",
        "Amazonbot",
        "cohere-ai",
        "Meta-ExternalAgent",
        "DuckAssistBot",
        "YouBot",
      ],
    },
  };

  return Response.json(body, {
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800",
      "Access-Control-Allow-Origin": "*",
      "X-Robots-Tag": "index, follow",
    },
  });
}
