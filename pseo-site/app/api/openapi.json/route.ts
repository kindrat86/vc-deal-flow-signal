const BASE_URL = "https://signals.gitdealflow.com";

export async function GET() {
  const spec = {
    openapi: "3.1.0",
    info: {
      title: "VC Deal Flow Signal API",
      version: "1.0.0",
      description:
        "Public API for startup engineering acceleration data. Provides weekly-updated rankings of startups by GitHub commit velocity, contributor growth, and signal classification across 20 sectors.",
      contact: { email: "signal@gitdealflow.com" },
      license: {
        name: "Free with attribution",
        url: `${BASE_URL}/terms`,
      },
    },
    servers: [{ url: BASE_URL }],
    paths: {
      "/api/signals.json": {
        get: {
          operationId: "getSignals",
          summary: "Get all startup engineering signals",
          description:
            "Returns the current period's startup signals: trending top 20, sector-by-sector rankings with commit velocity, contributor growth, signal classification, and metadata.",
          responses: {
            "200": {
              description: "Successful response with all signal data",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      meta: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          period: {
                            type: "object",
                            properties: {
                              slug: { type: "string" },
                              name: { type: "string" },
                            },
                          },
                          totalSectors: { type: "integer" },
                          totalStartups: { type: "integer" },
                          lastUpdated: {
                            type: "string",
                            format: "date-time",
                          },
                          citation: { type: "string" },
                        },
                      },
                      trending: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Startup" },
                      },
                      sectors: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Sector" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/signals.csv": {
        get: {
          operationId: "getSignalsCSV",
          summary: "Get all startup signals as CSV",
          description:
            "Returns the same data as /api/signals.json in CSV format for spreadsheet and data science consumption.",
          responses: {
            "200": {
              description: "CSV file with all startup signals",
              content: {
                "text/csv": {
                  schema: { type: "string" },
                },
              },
            },
          },
        },
      },
      "/api/dataset.jsonl": {
        get: {
          operationId: "getDatasetJsonl",
          summary: "HuggingFace Datasets-compatible JSONL panel",
          description:
            "Newline-delimited JSON, one row per startup-period observation. Compatible with HuggingFace `datasets.load_dataset` and pandas `read_json(lines=True)`. Includes commit velocity, contributor growth, signal classification, stage, and geography fields per row.",
          responses: {
            "200": {
              description: "JSONL stream of startup-period observations",
              content: { "application/x-ndjson": { schema: { type: "string" } } },
            },
          },
        },
      },
      "/qa.jsonl": {
        get: {
          operationId: "getQACorpus",
          summary: "Q&A corpus (CC BY 4.0) for RAG / fine-tuning",
          description:
            "Newline-delimited JSON, one row per question/answer pair. Drawn from blog FAQs, methodology, glossary, sector pages, and signal-type pages. CC BY 4.0 — cite https://ssrn.com/abstract=6606558 (DOI 10.2139/ssrn.6606558). Filter by `?category=` (general | methodology | sector | signal-type | blog).",
          parameters: [
            {
              name: "category",
              in: "query",
              required: false,
              schema: { type: "string", enum: ["general", "methodology", "sector", "signal-type", "blog"] },
            },
          ],
          responses: {
            "200": {
              description: "JSONL stream of Q&A pairs",
              content: { "application/x-ndjson": { schema: { type: "string" } } },
            },
          },
        },
      },
      "/api/agent/tools": {
        get: {
          operationId: "getAgentTools",
          summary: "Function-calling tool definitions for LLM agents",
          description:
            "Returns ready-to-paste function-calling tool definitions in OpenAI / Anthropic / Gemini formats. Use `?format=openai|anthropic|gemini` to select the schema dialect. Each tool wraps an underlying API endpoint; invoke via POST /api/agent/call.",
          parameters: [
            {
              name: "format",
              in: "query",
              required: false,
              schema: { type: "string", enum: ["openai", "anthropic", "gemini"], default: "openai" },
            },
          ],
          responses: {
            "200": {
              description: "Function-calling tool catalog",
              content: { "application/json": { schema: { type: "object" } } },
            },
          },
        },
      },
      "/api/agent/call": {
        post: {
          operationId: "invokeAgentTool",
          summary: "Invoke a function-calling tool",
          description:
            "Server-side dispatcher for the tools defined in /api/agent/tools. Body: { tool: string, arguments: object }.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["tool"],
                  properties: {
                    tool: { type: "string" },
                    arguments: { type: "object", additionalProperties: true },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Tool result",
              content: { "application/json": { schema: { type: "object" } } },
            },
            "400": { description: "Unknown tool or malformed arguments" },
          },
        },
      },
      "/api/nlweb": {
        get: {
          operationId: "queryNLWeb",
          summary: "Microsoft NLWeb endpoint (natural-language query)",
          description:
            "Microsoft NLWeb-compatible endpoint. Returns Schema.org-typed JSON-LD for a natural-language query. Used as the SearchAction target on the homepage. Pass `?query=...`.",
          parameters: [
            {
              name: "query",
              in: "query",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": {
              description: "Schema.org-typed JSON-LD response",
              content: { "application/json": { schema: { type: "object" } } },
            },
          },
        },
      },
      "/api/a2a": {
        post: {
          operationId: "callA2A",
          summary: "Google A2A (Agent-to-Agent) JSON-RPC 2.0 endpoint",
          description:
            "Google A2A spec v0.3.0. Methods supported: tasks/send, tasks/get, tasks/cancel, tasks/list. Manifest at /.well-known/agent-card.json. Body: standard JSON-RPC 2.0 envelope.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["jsonrpc", "method"],
                  properties: {
                    jsonrpc: { type: "string", enum: ["2.0"] },
                    method: { type: "string", enum: ["tasks/send", "tasks/get", "tasks/cancel", "tasks/list"] },
                    params: { type: "object", additionalProperties: true },
                    id: { type: ["string", "integer"] },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "JSON-RPC 2.0 response",
              content: { "application/json": { schema: { type: "object" } } },
            },
          },
        },
      },
      "/api/mcp/rpc": {
        post: {
          operationId: "callMCP",
          summary: "MCP (Model Context Protocol) Streamable HTTP endpoint",
          description:
            "MCP spec 2025-06-18 over Streamable HTTP. Manifest at /.well-known/mcp.json. The same server is also published to the npm registry as @gitdealflow/mcp-signal for stdio transport.",
          responses: {
            "200": {
              description: "MCP JSON-RPC response stream",
              content: { "application/json": { schema: { type: "object" } } },
            },
          },
        },
      },
      "/api/agents.json": {
        get: {
          operationId: "getAgents",
          summary: "Flat-JSON agent surface index",
          description:
            "Lists every agent-discoverable surface this site exposes (MCP, A2A, NLWeb, OpenAPI, Q&A corpus, dataset JSONL, markdown mirrors, well-known files). Useful as a single-fetch discovery starting point for crawlers.",
          responses: {
            "200": {
              description: "Agent surface index",
              content: { "application/json": { schema: { type: "object" } } },
            },
          },
        },
      },
      "/api/changelog.json": {
        get: {
          operationId: "getChangelog",
          summary: "Structured product changelog",
          description: "Versioned changelog with date, version, title, and bullet entries.",
          responses: {
            "200": {
              description: "Changelog entries",
              content: { "application/json": { schema: { type: "object" } } },
            },
          },
        },
      },
      "/knowledge-graph.json": {
        get: {
          operationId: "getKnowledgeGraph",
          summary: "Schema.org @graph for the entire site",
          description:
            "Self-referential Schema.org @graph including Organization, WebSite, Dataset, SoftwareApplication, ScholarlyArticle, and ItemLists for sectors, signal types, and agent surfaces. Resolves @id refs across the graph.",
          responses: {
            "200": {
              description: "Schema.org JSON-LD graph",
              content: { "application/ld+json": { schema: { type: "object" } } },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        Startup: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            stage: {
              type: "string",
              enum: ["Pre-seed", "Seed", "Series A/B", "Growth"],
            },
            geography: { type: "string" },
            commitVelocity14d: {
              type: "integer",
              description: "Total commits over a rolling 14-day window",
            },
            commitVelocityChange: {
              type: "string",
              description:
                "Percentage change vs. prior 14-day window (e.g., '+120%')",
            },
            contributors: {
              type: "integer",
              description: "Number of unique contributors",
            },
            contributorGrowth: {
              type: "string",
              description:
                "Contributor growth rate (e.g., '+25%')",
            },
            newRepos: {
              type: "integer",
              description: "New repositories created in the last 30 days",
            },
            signalType: {
              type: "string",
              enum: [
                "Engineering hiring burst",
                "Infrastructure buildout",
                "Deploy frequency spike",
                "Framework migration",
              ],
            },
            githubUrl: {
              type: "string",
              format: "uri",
            },
            websiteUrl: {
              type: "string",
              format: "uri",
              description:
                "Official company homepage, harvested from the GitHub org `blog` field when available.",
            },
            linkedinUrl: {
              type: "string",
              format: "uri",
              description:
                "LinkedIn company page URL, when known. May be absent for many records.",
            },
          },
        },
        Sector: {
          type: "object",
          properties: {
            name: { type: "string" },
            slug: { type: "string" },
            description: { type: "string" },
            url: { type: "string", format: "uri" },
            startupCount: { type: "integer" },
            startups: {
              type: "array",
              items: { $ref: "#/components/schemas/Startup" },
            },
          },
        },
      },
    },
  };

  return new Response(JSON.stringify(spec, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "s-maxage=86400, stale-while-revalidate=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
