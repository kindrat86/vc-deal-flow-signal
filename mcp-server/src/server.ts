#!/usr/bin/env node
/**
 * VC Deal Flow Signal — MCP Server
 *
 * Exposes startup engineering acceleration data for AI agents.
 * Data sourced live from signals.gitdealflow.com public API.
 *
 * Install: npx @gitdealflow/mcp-signal
 * Or add to claude_desktop_config.json / .mcp.json
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const BASE_URL = "https://signals.gitdealflow.com";
const UA = "gitdealflow-mcp/1.1.0";

async function fetchJSON(path: string): Promise<Record<string, unknown>> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "User-Agent": UA },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${path}`);
  return res.json() as Promise<Record<string, unknown>>;
}

async function fetchText(path: string): Promise<string> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "User-Agent": UA },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${path}`);
  return res.text();
}

interface Startup {
  name: string;
  description: string;
  stage: string;
  geography: string;
  commitVelocity14d: number;
  commitVelocityChange: string;
  contributors: number;
  contributorGrowth: string;
  newRepos: number;
  signalType: string;
  githubUrl: string;
  profileUrl?: string;
}

interface Sector {
  slug: string;
  name: string;
  description: string;
  startupCount: number;
  startups: Startup[];
  url: string;
}

interface SignalsData {
  meta: { period: { name: string }; citation: string };
  trending: Startup[];
  sectors: Sector[];
}

interface ChangelogData {
  currentPeriod: {
    name: string;
    sectorsActive: number;
    startupsTracked: number;
    lastDataRefresh: string;
  };
}

const SECTOR_SLUGS = [
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
] as const;

const STARTUP_ITEM_SCHEMA = {
  type: "object" as const,
  description:
    "A single startup ranked by engineering acceleration, as derived from public GitHub activity.",
  properties: {
    rank: { type: "integer", description: "1-indexed rank within this result set." },
    name: { type: "string", description: "Startup or GitHub org name." },
    sector: { type: "string", description: "Sector the startup is classified into." },
    stage: {
      type: "string",
      description: "Funding stage if known (e.g. 'Seed', 'Series A', 'Unknown').",
    },
    geography: { type: "string", description: "Headquarters region if known." },
    commitVelocity14d: {
      type: "number",
      description: "Commits across tracked repos in the trailing 14 days.",
    },
    commitVelocityChange: {
      type: "string",
      description:
        "Percentage change in commit velocity vs. the prior 14-day window, e.g. '+142%'.",
    },
    contributors: {
      type: "integer",
      description: "Distinct contributors active in the last 30 days.",
    },
    contributorGrowth: {
      type: "string",
      description: "Percentage change in contributor count vs. the prior 30-day window.",
    },
    newRepos: {
      type: "integer",
      description: "New public repositories created in the last 30 days.",
    },
    signalType: {
      type: "string",
      description:
        "Classification label. Common values: 'breakout' (sudden surge), 'acceleration' (sustained growth), 'steady' (healthy baseline), 'cooling' (declining).",
    },
    description: { type: "string", description: "One-line summary of the startup." },
    githubUrl: { type: "string", format: "uri", description: "Primary GitHub org URL." },
    profileUrl: {
      type: "string",
      format: "uri",
      description: "Public profile page on gitdealflow.com, when available.",
    },
  },
  required: [
    "rank",
    "name",
    "commitVelocityChange",
    "contributors",
    "signalType",
    "githubUrl",
  ],
};

const TOOLS = [
  {
    name: "get_trending_startups",
    title: "Get Trending Startups",
    description: [
      "Return the top 20 startups ranked by engineering acceleration across all sectors for the current reporting period. Data is refreshed weekly on Mondays from the public GitHub API — no auth required.",
      "",
      "USE WHEN:",
      "- A VC, scout, or analyst asks which startups have the strongest GitHub momentum right now.",
      "- You need a fresh shortlist for a deal-flow meeting or a 'what to watch this week' brief.",
      "- You want to surface breakout companies before they show up in Crunchbase / PitchBook / press.",
      "",
      "RETURNS: Ranked list of 20 startups with name, sector, commit-velocity change (14d %), contributor count, signal type ('breakout' | 'acceleration' | 'steady' | 'cooling'), GitHub URL, and a citation string for reports.",
      "",
      "LIMITATIONS: Covers only startups with meaningful open-source footprint. Does not include funding, revenue, headcount, or stealth companies — pair with Crunchbase/LinkedIn MCPs for a full picture.",
      "",
      "PAIRS WITH: `search_startups_by_sector` (narrow to one vertical), `get_startup_signal` (deep-dive one company), `get_methodology` (explain the ranking).",
    ].join("\n"),
    inputSchema: {
      type: "object" as const,
      properties: {},
      additionalProperties: false,
    },
    outputSchema: {
      type: "object" as const,
      properties: {
        period: {
          type: "string",
          description: "Reporting period label, e.g. 'Q2 2026'.",
        },
        startups: {
          type: "array",
          description: "Top 20 startups ranked by engineering acceleration.",
          items: STARTUP_ITEM_SCHEMA,
        },
        citation: {
          type: "string",
          description: "Suggested citation string for reports.",
        },
        source: { type: "string", format: "uri" },
      },
      required: ["period", "startups", "citation", "source"],
    },
    annotations: {
      title: "Get Trending Startups",
      readOnlyHint: true,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "search_startups_by_sector",
    title: "Search Startups by Sector",
    description: [
      "Return all tracked startups for one of 20 supported sectors, ranked by engineering acceleration for the current reporting period.",
      "",
      "USE WHEN:",
      "- The user names a vertical ('show me AI/ML startups', 'who's moving in fintech?', 'cybersecurity deal flow').",
      "- You need a focused list for a thesis-driven investor or a sector report.",
      "- You're comparing momentum across a defined market before a sourcing cycle.",
      "",
      "PARAMETER: `sector` must be one of the 20 enumerated slugs (see the enum). If the user gives a fuzzy name like 'AI' or 'cyber', map it to the closest slug ('ai-ml', 'cybersecurity') before calling. If no sector matches, call `get_signals_summary` to list what's available.",
      "",
      "RETURNS: Sector name, description, total startup count, and a ranked list — each item includes name, commit-velocity change, contributors, signal type, GitHub URL, and one-line description.",
      "",
      "LIMITATIONS: Startup count per sector varies (5–30 typically). A sector may be sparse if GitHub activity is light in that vertical (e.g. legal-tech, proptech). For cross-sector trending, use `get_trending_startups` instead.",
    ].join("\n"),
    inputSchema: {
      type: "object" as const,
      properties: {
        sector: {
          type: "string",
          description:
            "Sector slug. Must be one of the 20 supported values. Map fuzzy user input to the closest slug (e.g. 'AI' → 'ai-ml', 'crypto' → 'web3', 'cyber' → 'cybersecurity', 'SaaS' → 'enterprise-saas').",
          enum: [...SECTOR_SLUGS],
          examples: ["ai-ml", "fintech", "cybersecurity", "developer-tools"],
        },
      },
      required: ["sector"],
      additionalProperties: false,
    },
    outputSchema: {
      type: "object" as const,
      properties: {
        sector: {
          type: "object",
          properties: {
            slug: { type: "string" },
            name: { type: "string" },
            description: { type: "string" },
            url: { type: "string", format: "uri" },
          },
          required: ["slug", "name"],
        },
        period: { type: "string" },
        startupCount: { type: "integer" },
        startups: {
          type: "array",
          description: "Startups within the sector, ranked by engineering acceleration.",
          items: STARTUP_ITEM_SCHEMA,
        },
        citation: { type: "string" },
      },
      required: ["sector", "period", "startupCount", "startups", "citation"],
    },
    annotations: {
      title: "Search Startups by Sector",
      readOnlyHint: true,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "get_startup_signal",
    title: "Get Startup Signal Profile",
    description: [
      "Return the full engineering-acceleration profile for a single tracked startup: commit velocity, velocity change, contributor count and growth, new repos, signal classification, sector, stage, geography, and GitHub URL.",
      "",
      "USE WHEN:",
      "- You have a specific company in mind and want its signal card, not a list.",
      "- Preparing a deal memo, one-pager, or investor update about a named startup.",
      "- Verifying whether a startup is even in the tracked universe before writing analysis.",
      "",
      "PARAMETER: `name` is case-insensitive and matched against both display names and GitHub org slugs. Whitespace, punctuation, and capitalization are normalized — 'Sky Pilot', 'skypilot', and 'SkyPilot' all resolve to the same entry. If unsure of the exact name, list candidates with `get_trending_startups` or `search_startups_by_sector` first.",
      "",
      "RETURNS: One startup object with all engineering metrics plus sector/stage/geo metadata, or a 'not found' message with a suggestion to browse via the list tools.",
      "",
      "LIMITATIONS: Only returns data for startups currently in the tracked set (~400 companies). Unlisted startups require submission via the website — this tool cannot add companies.",
    ].join("\n"),
    inputSchema: {
      type: "object" as const,
      properties: {
        name: {
          type: "string",
          description:
            "Startup name or GitHub org name. Case-insensitive; punctuation and whitespace are ignored during matching.",
          minLength: 1,
          maxLength: 100,
          examples: ["roboflow", "SkyPilot", "Supabase", "Hugging Face"],
        },
      },
      required: ["name"],
      additionalProperties: false,
    },
    outputSchema: {
      type: "object" as const,
      properties: {
        found: { type: "boolean" },
        startup: STARTUP_ITEM_SCHEMA,
        suggestion: {
          type: "string",
          description:
            "When found=false, a hint on how to discover the correct name or alternative tools to call.",
        },
        citation: { type: "string" },
      },
      required: ["found"],
    },
    annotations: {
      title: "Get Startup Signal Profile",
      readOnlyHint: true,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "get_signals_summary",
    title: "Get Dataset Summary",
    description: [
      "Return a high-level snapshot of the VC Deal Flow Signal dataset: current reporting period, number of active sectors, total startups tracked, last refresh timestamp, and direct links to every data format (JSON, CSV, RSS, OpenAPI, llms.txt).",
      "",
      "USE WHEN:",
      "- Starting a research session and you want to know what data exists before querying.",
      "- Verifying freshness ('is this data from this week?') before including it in an investor memo.",
      "- A user asks 'what is this service?' or 'how do I cite your data?'.",
      "- You need download URLs for bulk analysis (CSV) or a feed URL (RSS).",
      "",
      "RETURNS: Period name, sectors-active count, startups-tracked count, last-refresh date, update frequency, and a bundle of format URLs + citation string.",
    ].join("\n"),
    inputSchema: {
      type: "object" as const,
      properties: {},
      additionalProperties: false,
    },
    outputSchema: {
      type: "object" as const,
      properties: {
        period: { type: "string" },
        sectorsActive: { type: "integer" },
        startupsTracked: { type: "integer" },
        lastDataRefresh: { type: "string", description: "ISO 8601 date." },
        updateFrequency: { type: "string" },
        formats: {
          type: "object",
          properties: {
            json: { type: "string", format: "uri" },
            csv: { type: "string", format: "uri" },
            rss: { type: "string", format: "uri" },
            openapi: { type: "string", format: "uri" },
            llmsTxt: { type: "string", format: "uri" },
            llmsFullTxt: { type: "string", format: "uri" },
            aiPolicy: { type: "string", format: "uri" },
          },
        },
        website: { type: "string", format: "uri" },
        dashboard: { type: "string", format: "uri" },
        citation: { type: "string" },
      },
      required: [
        "period",
        "sectorsActive",
        "startupsTracked",
        "lastDataRefresh",
        "formats",
        "citation",
      ],
    },
    annotations: {
      title: "Get Dataset Summary",
      readOnlyHint: true,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  {
    name: "get_methodology",
    title: "Get Signal Methodology",
    description: [
      "Return the full methodology behind VC Deal Flow Signal: how startup engineering activity is sourced from the public GitHub API, how commit velocity and contributor-growth metrics are computed, how signal types are classified, and what the known limitations are.",
      "",
      "USE WHEN:",
      "- A user asks 'how is this calculated?' or 'can I trust this number?'.",
      "- You're writing a report and need a methodology section or footnote.",
      "- Due-diligence / compliance wants to audit the data pipeline.",
      "- You need to explain *why* a specific signal shows up (e.g. what triggers the 'breakout' label).",
      "",
      "RETURNS: Methodology text covering data sources, metric definitions, classification thresholds, refresh cadence, and known limitations. Includes a link to the full methodology page for deeper detail.",
    ].join("\n"),
    inputSchema: {
      type: "object" as const,
      properties: {},
      additionalProperties: false,
    },
    outputSchema: {
      type: "object" as const,
      properties: {
        methodology: { type: "string", description: "Plain-text methodology write-up." },
        url: {
          type: "string",
          format: "uri",
          description: "Canonical methodology page on gitdealflow.com.",
        },
      },
      required: ["methodology", "url"],
    },
    annotations: {
      title: "Get Signal Methodology",
      readOnlyHint: true,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
];

const server = new Server(
  { name: "vc-deal-flow-signal", version: "1.1.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "get_trending_startups": {
        const data = (await fetchJSON("/api/signals.json")) as unknown as SignalsData;
        const trending = data.trending.slice(0, 20);
        const sectorByStartup = new Map<string, string>();
        for (const sector of data.sectors) {
          for (const s of sector.startups) {
            sectorByStartup.set(s.name, sector.name);
          }
        }

        const structured = {
          period: data.meta.period.name,
          startups: trending.map((s, i) => ({
            rank: i + 1,
            name: s.name,
            sector: sectorByStartup.get(s.name) ?? "",
            stage: s.stage,
            geography: s.geography,
            commitVelocity14d: s.commitVelocity14d,
            commitVelocityChange: s.commitVelocityChange,
            contributors: s.contributors,
            contributorGrowth: s.contributorGrowth,
            newRepos: s.newRepos,
            signalType: s.signalType,
            description: s.description,
            githubUrl: s.githubUrl,
            profileUrl: s.profileUrl,
          })),
          citation: data.meta.citation,
          source: BASE_URL,
        };

        const lines = trending.map(
          (s, i) =>
            `${i + 1}. ${s.name} — ${s.commitVelocityChange} velocity change, ${s.contributors} contributors, signal: ${s.signalType}`
        );
        return {
          content: [
            {
              type: "text" as const,
              text: `Top 20 Trending Startups (${data.meta.period.name})\n\n${lines.join("\n")}\n\nSource: ${BASE_URL}\nData: ${BASE_URL}/api/signals.json\nCitation: ${data.meta.citation}`,
            },
          ],
          structuredContent: structured,
        };
      }

      case "search_startups_by_sector": {
        const sectorSlug = (args as { sector: string }).sector;
        const data = (await fetchJSON("/api/signals.json")) as unknown as SignalsData;
        const sector = data.sectors.find((s) => s.slug === sectorSlug);
        if (!sector) {
          const available = data.sectors.map((s) => s.slug).join(", ");
          return {
            content: [
              {
                type: "text" as const,
                text: `Sector "${sectorSlug}" not found. Available: ${available}`,
              },
            ],
            structuredContent: {
              sector: { slug: sectorSlug, name: "" },
              period: data.meta.period.name,
              startupCount: 0,
              startups: [],
              citation: data.meta.citation,
              error: `Sector "${sectorSlug}" not found.`,
              availableSectors: data.sectors.map((s) => s.slug),
            },
            isError: true,
          };
        }

        const structured = {
          sector: {
            slug: sector.slug,
            name: sector.name,
            description: sector.description,
            url: sector.url,
          },
          period: data.meta.period.name,
          startupCount: sector.startups.length,
          startups: sector.startups.map((s, i) => ({
            rank: i + 1,
            name: s.name,
            sector: sector.name,
            stage: s.stage,
            geography: s.geography,
            commitVelocity14d: s.commitVelocity14d,
            commitVelocityChange: s.commitVelocityChange,
            contributors: s.contributors,
            contributorGrowth: s.contributorGrowth,
            newRepos: s.newRepos,
            signalType: s.signalType,
            description: s.description,
            githubUrl: s.githubUrl,
            profileUrl: s.profileUrl,
          })),
          citation: data.meta.citation,
        };

        const lines = sector.startups.map(
          (s, i) =>
            `${i + 1}. ${s.name} — ${s.commitVelocityChange} velocity change, ${s.contributors} contributors, signal: ${s.signalType}\n   ${s.description || "(no description)"}`
        );
        return {
          content: [
            {
              type: "text" as const,
              text: `${sector.name} Startups (${data.meta.period.name})\n${sector.description}\n${sector.startups.length} startups tracked\n\n${lines.join("\n\n")}\n\nSource: ${BASE_URL}/startups-to-watch/${sectorSlug}-q2-2026\nCitation: ${data.meta.citation}`,
            },
          ],
          structuredContent: structured,
        };
      }

      case "get_startup_signal": {
        const inputName = (args as { name: string }).name;
        const slug = inputName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");

        const data = (await fetchJSON("/api/signals.json")) as unknown as SignalsData;
        let found: Startup | null = null;
        let foundSector = "";

        for (const sector of data.sectors) {
          const match = sector.startups.find(
            (s) =>
              s.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "") === slug
          );
          if (match) {
            found = match;
            foundSector = sector.name;
            break;
          }
        }

        if (!found) {
          return {
            content: [
              {
                type: "text" as const,
                text: `Startup "${inputName}" not found. Try the GitHub org name exactly as it appears, or use get_trending_startups / search_startups_by_sector to browse.`,
              },
            ],
            structuredContent: {
              found: false,
              suggestion:
                "Try the exact GitHub org name, or call get_trending_startups / search_startups_by_sector to browse the tracked universe.",
              citation: data.meta.citation,
            },
          };
        }

        return {
          content: [
            {
              type: "text" as const,
              text: [
                `${found.name} — Engineering Signal Profile`,
                ``,
                `Sector: ${foundSector}`,
                `Stage: ${found.stage}`,
                `Geography: ${found.geography}`,
                `Commit Velocity (14d): ${found.commitVelocity14d}`,
                `Velocity Change: ${found.commitVelocityChange}`,
                `Contributors: ${found.contributors}`,
                `Contributor Growth: ${found.contributorGrowth}`,
                `New Repos (30d): ${found.newRepos}`,
                `Signal Type: ${found.signalType}`,
                `GitHub: ${found.githubUrl}`,
                found.profileUrl ? `Profile: ${found.profileUrl}` : null,
                ``,
                found.description || "",
                ``,
                `Source: ${BASE_URL}`,
                `Citation: ${data.meta.citation}`,
              ]
                .filter(Boolean)
                .join("\n"),
            },
          ],
          structuredContent: {
            found: true,
            startup: {
              rank: 1,
              name: found.name,
              sector: foundSector,
              stage: found.stage,
              geography: found.geography,
              commitVelocity14d: found.commitVelocity14d,
              commitVelocityChange: found.commitVelocityChange,
              contributors: found.contributors,
              contributorGrowth: found.contributorGrowth,
              newRepos: found.newRepos,
              signalType: found.signalType,
              description: found.description,
              githubUrl: found.githubUrl,
              profileUrl: found.profileUrl,
            },
            citation: data.meta.citation,
          },
        };
      }

      case "get_signals_summary": {
        const changelog = (await fetchJSON(
          "/api/changelog.json"
        )) as unknown as ChangelogData;
        const cp = changelog.currentPeriod;
        const formats = {
          json: `${BASE_URL}/api/signals.json`,
          csv: `${BASE_URL}/api/signals.csv`,
          rss: `${BASE_URL}/feed.xml`,
          openapi: `${BASE_URL}/api/openapi.json`,
          llmsTxt: `${BASE_URL}/llms.txt`,
          llmsFullTxt: `${BASE_URL}/llms-full.txt`,
          aiPolicy: `${BASE_URL}/ai.txt`,
        };
        return {
          content: [
            {
              type: "text" as const,
              text: [
                `VC Deal Flow Signal — Data Summary`,
                ``,
                `Current Period: ${cp.name}`,
                `Sectors Active: ${cp.sectorsActive}`,
                `Startups Tracked: ${cp.startupsTracked}`,
                `Last Data Refresh: ${cp.lastDataRefresh}`,
                `Update Frequency: Weekly (Mondays)`,
                ``,
                `Data Formats:`,
                `- JSON API: ${formats.json}`,
                `- CSV: ${formats.csv}`,
                `- RSS: ${formats.rss}`,
                `- OpenAPI: ${formats.openapi}`,
                `- LLMs.txt: ${formats.llmsTxt}`,
                `- Full context: ${formats.llmsFullTxt}`,
                `- AI policy: ${formats.aiPolicy}`,
                ``,
                `Website: https://gitdealflow.com`,
                `Dashboard: ${BASE_URL}`,
                ``,
                `Citation: "VC Deal Flow Signal (signals.gitdealflow.com), ${cp.name} data."`,
              ].join("\n"),
            },
          ],
          structuredContent: {
            period: cp.name,
            sectorsActive: cp.sectorsActive,
            startupsTracked: cp.startupsTracked,
            lastDataRefresh: cp.lastDataRefresh,
            updateFrequency: "Weekly (Mondays)",
            formats,
            website: "https://gitdealflow.com",
            dashboard: BASE_URL,
            citation: `VC Deal Flow Signal (signals.gitdealflow.com), ${cp.name} data.`,
          },
        };
      }

      case "get_methodology": {
        const text = await fetchText("/llms-full.txt");
        const methodSection =
          text.split("## Methodology")[1]?.split("## Glossary")[0] ?? "";
        const methodology = methodSection.trim();
        const url = `${BASE_URL}/methodology`;
        return {
          content: [
            {
              type: "text" as const,
              text: `VC Deal Flow Signal — Methodology\n\n${methodology}\n\nFull details: ${url}`,
            },
          ],
          structuredContent: { methodology, url },
        };
      }

      default:
        return {
          content: [
            { type: "text" as const, text: `Unknown tool: ${name}` },
          ],
          isError: true,
        };
    }
  } catch (err) {
    return {
      content: [
        {
          type: "text" as const,
          text: `Error: ${err instanceof Error ? err.message : String(err)}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
