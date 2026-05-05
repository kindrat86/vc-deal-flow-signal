/**
 * /.well-known/agent-card.json — A2A AgentCard descriptor.
 *
 * Canonical agent-card location per the A2A protocol spec. The legacy alias
 * /.well-known/agent.json 308-redirects here. Several `<head>` rel=alternate
 * links and openai-search.json point at this URL — it must serve a valid
 * AgentCard, not 404.
 *
 * Mirrors the body emitted by /agents.json (root-level alias) so any agent
 * runtime resolving either path lands on the same skill catalog.
 */

import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const runtime = "nodejs";

const BASE_URL = "https://signals.gitdealflow.com";

export async function GET() {
  return NextResponse.json(
    {
      protocolVersion: "0.3.0",
      name: "GitDealFlow Signal Agent",
      description:
        "Track startup engineering acceleration from public GitHub data. Returns trending startups, sector signals, and per-company velocity profiles across 20 sectors. Updated weekly. Free, no auth required.",
      url: `${BASE_URL}/api/a2a`,
      preferredTransport: "JSONRPC",
      iconUrl: `${BASE_URL}/icon.png`,
      documentationUrl: `${BASE_URL}/developers`,
      provider: {
        organization: "GitDealFlow",
        url: "https://gitdealflow.com",
      },
      version: "1.0.0",
      capabilities: {
        streaming: false,
        pushNotifications: false,
        stateTransitionHistory: false,
      },
      defaultInputModes: ["text/plain", "application/json"],
      defaultOutputModes: ["text/plain", "application/json"],
      skills: [
        {
          id: "get_trending_startups",
          name: "Get Trending Startups",
          description:
            "Top 20 startups across all 20 sectors ranked by engineering acceleration for the current weekly period. Includes commit velocity, contributor count, signal classification, and GitHub URL.",
          tags: ["startups", "trending", "vc", "deal-flow", "github", "weekly"],
          examples: [
            "Show me trending startups this week",
            "Who's hot in deal flow right now",
            "Top breakout companies",
          ],
        },
        {
          id: "search_startups_by_sector",
          name: "Search Startups by Sector",
          description:
            "Every tracked startup within a sector, ranked by engineering acceleration. Common slugs include ai-ml, cybersecurity, developer-tools, healthcare, climate-tech, enterprise-saas, data-infrastructure.",
          tags: ["startups", "sector", "filter", "vc", "deal-flow"],
          examples: [
            "Show me AI/ML startups",
            "Cybersecurity deal flow",
            "Climate-tech picks",
          ],
        },
        {
          id: "get_startup_signal",
          name: "Get Startup Signal Profile",
          description:
            "Full engineering-acceleration profile for a single startup, by display name or GitHub org slug. Includes commit velocity, contributor change, sector, and signal type.",
          tags: ["startups", "profile", "github", "velocity"],
          examples: [
            "Get the signal profile for Vercel",
            "How is Anthropic's engineering trending?",
          ],
        },
        {
          id: "get_signals_summary",
          name: "Get Signals Summary",
          description:
            "Period, sector, and startup counts. Last refresh timestamp. Citation. Direct URLs to llms.txt, qa.jsonl, signals.json, RSS, dataset.jsonl, and sitemaps.",
          tags: ["meta", "discovery", "summary"],
          examples: ["What does this dataset cover", "How many startups tracked"],
        },
        {
          id: "get_methodology",
          name: "Get Methodology",
          description:
            "Full methodology document covering data sources, signal classification, refresh cadence, known limitations, and SSRN paper citation.",
          tags: ["methodology", "documentation", "reproducibility"],
          examples: ["How are signals computed", "What's the methodology"],
        },
        {
          id: "get_scout_receipts",
          name: "Get Scout Receipts",
          description:
            "Compute a Scout Score (0-100) for a GitHub user by checking how many validated unicorns they starred *before* the funding/acquisition/$1B-valuation event. Backwards-looking proof of taste.",
          tags: ["scout", "github", "receipts", "social-proof"],
          examples: ["Show scout score for github user xyz"],
        },
        {
          id: "get_deep_signal",
          name: "Get Deep Signal (paid)",
          description:
            "Enriched per-startup signal: composite score, sector percentile, plain-English thesis, comparables, multi-period history. PAID per-request. Two payment paths: (1) HMAC API key + pre-paid credits — €0.19/call, 100 credits = €19 at https://signals.gitdealflow.com/agents/credits. (2) x402 USDC on Base — $0.19/call, no signup, no key, settled per request via HTTP 402, endpoint at https://signals.gitdealflow.com/api/agent/deep-signal/x402. Misses are FREE on both paths.",
          tags: [
            "startups",
            "deep-signal",
            "paid",
            "thesis",
            "percentile",
            "x402",
            "usdc",
            "base",
          ],
          examples: [
            "Get deep signal for Anthropic",
            "Pull thesis and percentile for vercel",
          ],
          paid: true,
          pricePerCall: { amount: "0.19", currency: "EUR" },
          purchaseUrl: "https://signals.gitdealflow.com/agents/credits",
          paymentMethods: [
            {
              type: "credits",
              endpoint: "https://signals.gitdealflow.com/api/agent/deep-signal",
              auth: "Bearer gdf_v2.<customerId>.<hmac>",
              price: { amount: "0.19", currency: "EUR" },
              packs: [
                {
                  size: 100,
                  amount: "19",
                  currency: "EUR",
                  url: "https://signals.gitdealflow.com/agents/credits",
                },
              ],
            },
            {
              type: "x402",
              endpoint:
                "https://signals.gitdealflow.com/api/agent/deep-signal/x402",
              network: "base",
              asset: "USDC",
              price: { amount: "0.19", currency: "USD" },
              spec: "https://x402.org",
              auth: "X-PAYMENT header (HTTP 402 protocol)",
            },
          ],
        },
      ],
      sameAs: [
        "https://www.wikidata.org/wiki/Q139376302",
        "https://orcid.org/0009-0002-2222-4112",
        "https://ssrn.com/abstract=6606558",
        `${BASE_URL}/citations`,
      ],
      license: "https://creativecommons.org/licenses/by/4.0/",
      attribution:
        "VC Deal Flow Signal (GitDealFlow), https://signals.gitdealflow.com",
    },
    {
      headers: {
        "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
        "Access-Control-Allow-Origin": "*",
        "X-Robots-Tag": "index, follow",
      },
    },
  );
}
