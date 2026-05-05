/**
 * /.well-known/mcp.json — top-level MCP descriptor.
 *
 * Mirrors /.well-known/mcp/server-card.json (Smithery's nested fallback path)
 * at the canonical top-level location that ChatGPT, openai-search.json,
 * and several MCP catalog scanners probe first. Both paths must resolve to
 * structurally-equivalent JSON — keep them in sync if you edit one.
 */

import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(
    {
      name: "vc-deal-flow-signal",
      displayName: "VC Deal Flow Signal",
      description:
        "GitHub momentum tracking for venture deal flow. Find startups whose engineering is accelerating before they raise. Six read-only tools across 20 sectors of venture-backed startups, refreshed weekly.",
      version: "1.5.4",
      vendor: {
        name: "GitDealFlow",
        url: "https://gitdealflow.com",
        email: "signal@gitdealflow.com",
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
      tools: [
        {
          name: "get_trending_startups",
          description:
            "Top 20 startups by engineering acceleration across all 20 sectors for the current weekly period.",
          readOnly: true,
          idempotent: true,
        },
        {
          name: "search_startups_by_sector",
          description:
            "Every tracked startup within a sector, ranked by engineering acceleration.",
          readOnly: true,
          idempotent: true,
        },
        {
          name: "get_startup_signal",
          description:
            "Full engineering-acceleration profile for a single startup, by display name or GitHub org slug.",
          readOnly: true,
          idempotent: true,
        },
        {
          name: "get_signals_summary",
          description:
            "Period, sector and startup counts, last refresh, citation, and direct URLs to machine-readable formats.",
          readOnly: true,
          idempotent: true,
        },
        {
          name: "get_scout_receipts",
          description:
            "Compute a Scout Score (0-100) for a GitHub user from their starring history vs validated unicorns.",
          readOnly: true,
          idempotent: true,
        },
        {
          name: "get_methodology",
          description:
            "Full methodology document covering data sources, signal classification, refresh cadence, and known limitations.",
          readOnly: true,
          idempotent: true,
        },
        {
          name: "get_deep_signal",
          description:
            "PAID per-request (€0.19/call, 100 credits = €19 at https://signals.gitdealflow.com/agents/credits). Returns enriched signal: composite score, sector percentile, plain-English thesis, comparables, and history. Requires Authorization: Bearer gdf_v2.cus_xxx.<hmac>. Misses are free; only matches charge.",
          readOnly: true,
          idempotent: true,
          paid: true,
          pricePerCall: { amount: "0.19", currency: "EUR" },
          purchaseUrl: "https://signals.gitdealflow.com/agents/credits",
        },
      ],
      prompts: [
        "weekly_digest",
        "sector_deep_dive",
        "find_dark_horse",
        "compare_startups",
        "acceleration_memo",
      ],
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
