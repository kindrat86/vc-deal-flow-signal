/**
 * Canonical MCP tool catalog — SINGLE SOURCE OF TRUTH for the static descriptors.
 *
 * The live JSON-RPC endpoint defines the runtime tool implementations in
 * `app/api/mcp/rpc/route.ts` (`const TOOLS`). This module mirrors that catalog
 * (names + one-line summaries + paid/read-only flags) so every static discovery
 * surface — /.well-known/mcp.json, /.well-known/mcp/server-card.json,
 * /.well-known/discover.json, /.well-known/api-catalog, llms.txt, llms-full.txt —
 * reports the SAME counts and the SAME tool list. Prose counts, descriptor tool
 * arrays, and what `tools/list` returns can no longer drift apart.
 *
 * Drift is caught at build time by `scripts/verify-mcp-catalog.ts`, which extracts
 * the tool names from route.ts and fails the build if they diverge from this list.
 *
 * KEEP IN SYNC: if you add/remove/rename a tool in route.ts `TOOLS`, update this
 * array (the build guard will remind you).
 */

export type McpTool = {
  name: string;
  /** One-line summary used by the discovery descriptors. */
  description: string;
  /** All tools are non-destructive (share_result only composes; predict_funding only scores). */
  readOnly: boolean;
  /** Only get_deep_signal is metered (€0.19/call via credits or x402 USDC; misses are free). */
  paid?: boolean;
};

export const MCP_TOOLS: McpTool[] = [
  {
    name: "get_trending_startups",
    description:
      "Top 20 startups by engineering acceleration across all 15 sectors for the current weekly period.",
    readOnly: true,
  },
  {
    name: "search_startups_by_sector",
    description:
      "Every tracked startup within a sector, ranked by engineering acceleration.",
    readOnly: true,
  },
  {
    name: "get_startup_signal",
    description:
      "Full engineering-acceleration profile for a single startup, by display name or GitHub org slug.",
    readOnly: true,
  },
  {
    name: "get_signals_summary",
    description:
      "Period, sector and startup counts, last refresh, citation, and direct URLs to machine-readable formats.",
    readOnly: true,
  },
  {
    name: "get_diligence_dossier",
    description:
      "Public-source diligence dossier for a company or entity: M&A history, public backers, and the published engineering signal. Returns found:false with an honest note when outside the tracked corpus — never guesses.",
    readOnly: true,
  },
  {
    name: "get_scout_receipts",
    description:
      "Compute a Scout Score (0-100) for a GitHub user from their starring history vs validated unicorns.",
    readOnly: true,
  },
  {
    name: "get_methodology",
    description:
      "Full methodology document covering data sources, signal classification, refresh cadence, and known limitations.",
    readOnly: true,
  },
  {
    name: "get_deep_signal",
    description:
      "PAID per-request (€0.19/call via pre-paid credits or x402 USDC on Base; misses are FREE). Returns enriched signal: composite score, sector percentile, plain-English thesis, comparables, and multi-period history.",
    readOnly: true,
    paid: true,
  },
  {
    name: "share_result",
    description:
      "Compose a ready-to-share social post (Twitter/Bluesky/Mastodon/LinkedIn/Telegram) about a prior tool result, with per-platform char counts and intent URLs. Composes only — never posts on the user's behalf (two-step approval).",
    readOnly: true,
  },
  {
    name: "predict_funding",
    description:
      "Transparent, scored funding-likelihood claim for one tracked startup, with the full evidence chain, confidence level, honest caveats, and citable provenance (methodology + SSRN).",
    readOnly: true,
  },
  {
    name: "shortlist_signals",
    description:
      "Build and score a shortlist of N startups against a thesis, with optional sector and geography filters.",
    readOnly: true,
  },
  {
    name: "compare_signals",
    description:
      "Compare engineering-acceleration signals across multiple startups side by side.",
    readOnly: true,
  },
];

/** x402 / credits pricing for the single paid tool. */
export const MCP_PAID_PRICE = { amount: "0.19", currency: "EUR" } as const;
export const MCP_PAID_PURCHASE_URL =
  "https://signals.gitdealflow.com/agents/credits";

export const MCP_TOOL_NAMES = MCP_TOOLS.map((t) => t.name);
export const MCP_TOOL_COUNT = MCP_TOOLS.length; // 12
export const MCP_PAID_COUNT = MCP_TOOLS.filter((t) => t.paid).length; // 1
export const MCP_FREE_COUNT = MCP_TOOL_COUNT - MCP_PAID_COUNT; // 11

/** Prompts and resources exposed by the same endpoint (route.ts PROMPTS/RESOURCES). */
export const MCP_PROMPT_NAMES = [
  "weekly_digest",
  "sector_deep_dive",
  "find_dark_horse",
  "compare_startups",
  "acceleration_memo",
  "sourcing_session",
  "diligence_brief",
];
export const MCP_PROMPT_COUNT = MCP_PROMPT_NAMES.length; // 7
export const MCP_RESOURCE_COUNT = 3; // signal://trending, signal://summary, signal://methodology
export const MCP_RESOURCE_TEMPLATE_COUNT = 2; // signal://startup/{name}, signal://sector/{slug}
