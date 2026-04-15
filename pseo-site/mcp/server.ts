#!/usr/bin/env npx tsx
/**
 * VC Deal Flow Signal — MCP Server (stdio)
 *
 * A Model Context Protocol server that exposes startup engineering
 * acceleration data for direct consumption by AI agents (Claude, Cursor, etc.).
 *
 * Run: npx tsx mcp/server.ts
 * Or add to claude_desktop_config.json / .claude/settings.json
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const BASE_URL = "https://signals.gitdealflow.com";

async function fetchJSON(path: string) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${path}`);
  return res.json();
}

async function fetchText(path: string) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${path}`);
  return res.text();
}

const server = new Server(
  {
    name: "vc-deal-flow-signal",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "get_trending",
      description:
        "Get the top 20 trending startups by engineering acceleration across all sectors. Returns startup name, commit velocity change, contributors, signal type, and sector.",
      inputSchema: {
        type: "object" as const,
        properties: {},
      },
    },
    {
      name: "get_sector",
      description:
        "Get startups ranked by engineering acceleration for a specific sector. Returns all tracked startups in that sector with commit velocity, contributor growth, and signal classification.",
      inputSchema: {
        type: "object" as const,
        properties: {
          sector: {
            type: "string",
            description:
              "Sector slug (e.g., 'ai-ml', 'fintech', 'cybersecurity', 'developer-tools', 'healthcare', 'climate-tech', 'enterprise-saas', 'data-infrastructure', 'web3', 'robotics', 'edtech', 'ecommerce-infrastructure', 'supply-chain', 'legal-tech', 'hr-tech', 'proptech', 'agtech', 'gaming', 'space-tech', 'social-community')",
          },
        },
        required: ["sector"],
      },
    },
    {
      name: "get_startup",
      description:
        "Get the signal profile for a specific startup. Returns current and historical engineering metrics, signal type, sector, and investor context.",
      inputSchema: {
        type: "object" as const,
        properties: {
          name: {
            type: "string",
            description:
              "Startup name or slug (e.g., 'skypilot-org' or 'SkyPilot'). Case-insensitive, spaces and special characters will be normalized.",
          },
        },
        required: ["name"],
      },
    },
    {
      name: "get_signals_summary",
      description:
        "Get a high-level summary of the current data: total sectors, total startups, current period, top signal types, and links to all data formats.",
      inputSchema: {
        type: "object" as const,
        properties: {},
      },
    },
    {
      name: "get_methodology",
      description:
        "Get the full methodology: how data is sourced from GitHub API, how metrics are calculated, signal classification rules, and known limitations.",
      inputSchema: {
        type: "object" as const,
        properties: {},
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "get_trending": {
        const data = await fetchJSON("/api/signals.json");
        const trending = data.trending.slice(0, 20);
        const lines = trending.map(
          (s: Record<string, unknown>, i: number) =>
            `${i + 1}. ${s.name} — ${s.commitVelocityChange} velocity change, ${s.contributors} contributors, signal: ${s.signalType}`
        );
        return {
          content: [
            {
              type: "text" as const,
              text: `Top 20 Trending Startups (${data.meta.period.name})\n\n${lines.join("\n")}\n\nSource: ${BASE_URL}/trending\nCitation: ${data.meta.citation}`,
            },
          ],
        };
      }

      case "get_sector": {
        const sectorSlug = (args as { sector: string }).sector;
        const data = await fetchJSON("/api/signals.json");
        const sector = data.sectors.find(
          (s: Record<string, unknown>) => s.slug === sectorSlug
        );
        if (!sector) {
          return {
            content: [
              {
                type: "text" as const,
                text: `Sector "${sectorSlug}" not found. Available sectors: ${data.sectors.map((s: Record<string, unknown>) => s.slug).join(", ")}`,
              },
            ],
          };
        }
        const lines = sector.startups.map(
          (s: Record<string, unknown>, i: number) =>
            `${i + 1}. ${s.name} — ${s.commitVelocityChange} velocity change, ${s.contributors} contributors, signal: ${s.signalType}\n   ${s.description}`
        );
        return {
          content: [
            {
              type: "text" as const,
              text: `${sector.name} Startups (${data.meta.period.name})\n${sector.description}\n${sector.startupCount} startups tracked\n\n${lines.join("\n\n")}\n\nSource: ${sector.url}\nCitation: ${data.meta.citation}`,
            },
          ],
        };
      }

      case "get_startup": {
        const inputName = (args as { name: string }).name;
        const slug = inputName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");

        const data = await fetchJSON("/api/signals.json");
        let found: Record<string, unknown> | null = null;
        let foundSector = "";

        for (const sector of data.sectors) {
          const match = (
            sector.startups as Record<string, unknown>[]
          ).find(
            (s) =>
              (s.name as string)
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "") === slug
          );
          if (match) {
            found = match;
            foundSector = sector.name as string;
            break;
          }
        }

        if (!found) {
          return {
            content: [
              {
                type: "text" as const,
                text: `Startup "${inputName}" not found in current data. Try searching by organization name as it appears on GitHub.`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: "text" as const,
              text: `${found.name} — Engineering Signal Profile\n\nSector: ${foundSector}\nStage: ${found.stage}\nGeography: ${found.geography}\nCommit Velocity (14d): ${found.commitVelocity14d}\nVelocity Change: ${found.commitVelocityChange}\nContributors: ${found.contributors}\nContributor Growth: ${found.contributorGrowth}\nNew Repos (30d): ${found.newRepos}\nSignal Type: ${found.signalType}\nGitHub: ${found.githubUrl}\nProfile: ${found.profileUrl}\n\n${found.description}\n\nSource: ${BASE_URL}/startup/${slug}\nCitation: ${data.meta.citation}`,
            },
          ],
        };
      }

      case "get_signals_summary": {
        const changelog = await fetchJSON("/api/changelog.json");
        const cp = changelog.currentPeriod;
        return {
          content: [
            {
              type: "text" as const,
              text: `VC Deal Flow Signal — Data Summary\n\nCurrent Period: ${cp.name}\nSectors Active: ${cp.sectorsActive}\nStartups Tracked: ${cp.startupsTracked}\nLast Data Refresh: ${cp.lastDataRefresh}\nUpdate Frequency: Weekly (Mondays)\n\nAvailable Formats:\n- JSON: ${BASE_URL}/api/signals.json\n- CSV: ${BASE_URL}/api/signals.csv\n- OpenAPI: ${BASE_URL}/api/openapi.json\n- LLMs.txt: ${BASE_URL}/llms.txt\n- Full context: ${BASE_URL}/llms-full.txt\n- AI policy: ${BASE_URL}/ai.txt\n- RSS: ${BASE_URL}/feed.xml\n- Changelog: ${BASE_URL}/api/changelog.json\n\nCitation: "VC Deal Flow Signal (signals.gitdealflow.com), ${cp.name} data."`,
            },
          ],
        };
      }

      case "get_methodology": {
        const text = await fetchText("/llms-full.txt");
        const methodSection = text.split("## Methodology")[1]?.split("## Glossary")[0] ?? "";
        return {
          content: [
            {
              type: "text" as const,
              text: `VC Deal Flow Signal — Methodology\n\n${methodSection.trim()}\n\nFull details: ${BASE_URL}/methodology`,
            },
          ],
        };
      }

      default:
        return {
          content: [
            { type: "text" as const, text: `Unknown tool: ${name}` },
          ],
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
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
