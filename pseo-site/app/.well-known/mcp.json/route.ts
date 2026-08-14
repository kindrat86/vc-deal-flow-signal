/**
 * /.well-known/mcp.json — top-level MCP descriptor.
 *
 * Mirrors /.well-known/mcp/server-card.json (Smithery's nested fallback path)
 * at the canonical top-level location that ChatGPT, openai-search.json,
 * and several MCP catalog scanners probe first. Both paths must resolve to
 * structurally-equivalent JSON — keep them in sync if you edit one.
 */

import { NextResponse } from "next/server";
import {
  MCP_TOOLS,
  MCP_TOOL_COUNT,
  MCP_PAID_PRICE,
  MCP_PAID_PURCHASE_URL,
  MCP_PROMPT_NAMES,
} from "@/lib/mcp-tools";

export const dynamic = "force-static";
export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(
    {
      name: "vc-deal-flow-signal",
      displayName: "VC Deal Flow Signal",
      description: `GitHub momentum tracking for venture deal flow. Find startups whose engineering is accelerating before they raise. ${MCP_TOOL_COUNT} read-only tools (1 metered) across 15 sectors of venture-backed startups, refreshed weekly.`,
      version: "1.5.4",
      vendor: {
        name: "GitDealFlow",
        url: "https://gitdealflow.com",
        email: "signals@gitdealflow.com",
      },
      license: "MIT",
      homepage: "https://signals.gitdealflow.com",
      documentation: "https://signals.gitdealflow.com/developers",
      repository: "https://github.com/kindrat86/mcp-deal-flow-signal",
      icon: "https://signals.gitdealflow.com/icon.png",
      categories: ["finance", "research", "developer-tools"],
      tags: [
        "vc",
        "venture-capital",
        "startup-data",
        "github",
        "alternative-data",
        "deal-flow",
        "engineering-acceleration",
        "commit-velocity",
        "sourcing",
      ],
      protocol: {
        version: "2025-06-18",
        transport: ["streamable-http", "stdio"],
      },
      endpoints: {
        rpc: "https://signals.gitdealflow.com/api/mcp/rpc",
        oauth: {
          tokenEndpoint: "https://signals.gitdealflow.com/api/oauth/token",
          metadata:
            "https://signals.gitdealflow.com/.well-known/oauth-authorization-server",
          grantTypes: ["client_credentials"],
          scopesSupported: ["mcp:read"],
          required: false,
        },
      },
      install: {
        npm: "@gitdealflow/mcp-signal",
        npx: "npx -y @gitdealflow/mcp-signal",
        registry: "io.github.kindrat86/vc-deal-flow-signal",
      },
      // Derived from the canonical catalog so this list, the prose count above,
      // and what tools/list returns can never drift. See lib/mcp-tools.ts.
      tools: MCP_TOOLS.map((t) => ({
        name: t.name,
        description: t.description,
        readOnly: t.readOnly,
        idempotent: true,
        ...(t.paid
          ? {
              paid: true,
              pricePerCall: {
                amount: MCP_PAID_PRICE.amount,
                currency: MCP_PAID_PRICE.currency,
              },
              purchaseUrl: MCP_PAID_PURCHASE_URL,
            }
          : {}),
      })),
      prompts: MCP_PROMPT_NAMES,
      privacy: {
        piiCollected: false,
        dataStored: false,
        thirdPartyData: false,
        telemetryOptOut: ["GITDEALFLOW_MCP_TELEMETRY=0", "DO_NOT_TRACK=1"],
      },
      academic: {
        ssrnPreprint: "6606558",
        citation:
          "VC Deal Flow Signal (signals.gitdealflow.com), Q2 2026 data.",
        doi: "10.2139/ssrn.6606558",
      },
      links: {
        serverCard: "https://signals.gitdealflow.com/.well-known/mcp/server-card.json",
        agentCard: "https://signals.gitdealflow.com/.well-known/agent-card.json",
        aiPolicy: "https://signals.gitdealflow.com/.well-known/ai-policy.json",
      },
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
        "Access-Control-Allow-Origin": "*",
        "X-Robots-Tag": "index, follow",
      },
    },
  );
}
