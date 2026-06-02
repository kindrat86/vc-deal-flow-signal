/**
 * Build guard — the MCP tool catalog must stay internally consistent.
 *
 * 1. The tool names in the live endpoint (app/api/mcp/rpc/route.ts `const TOOLS`)
 *    must exactly equal lib/mcp-tools.ts `MCP_TOOL_NAMES`. The static descriptors
 *    (mcp.json, server-card.json) derive their tool arrays + prose counts from
 *    that module, so this single check keeps tools/list == descriptors == prose.
 * 2. A scoped scan of the MCP-describing surfaces catches a stale hard-coded
 *    count (e.g. "six tools") sneaking back into the prose-only files.
 *
 * Run: `npx tsx scripts/verify-mcp-catalog.ts` (wired into the prebuild chain).
 */
import { readFileSync } from "fs";
import { join } from "path";
import { MCP_TOOL_NAMES, MCP_TOOL_COUNT } from "../lib/mcp-tools";

const ROOT = process.cwd(); // pseo-site (npm scripts run from package.json dir)
const errors: string[] = [];

// 1) route.ts TOOLS names must equal the canonical list.
const routeSrc = readFileSync(join(ROOT, "app/api/mcp/rpc/route.ts"), "utf8");
const start = routeSrc.indexOf("const TOOLS = [");
const end = routeSrc.indexOf("const RESOURCES");
if (start < 0 || end < 0 || end < start) {
  errors.push("could not locate `const TOOLS`..`const RESOURCES` bounds in route.ts");
} else {
  const region = routeSrc.slice(start, end);
  const routeNames = [...region.matchAll(/^ {4}name: "([a-z_]+)"/gm)].map((m) => m[1]);
  if (JSON.stringify(routeNames) !== JSON.stringify(MCP_TOOL_NAMES)) {
    errors.push(
      `route.ts TOOLS (${routeNames.length}) != lib/mcp-tools MCP_TOOL_NAMES (${MCP_TOOL_NAMES.length}).\n` +
        `    route.ts : ${JSON.stringify(routeNames)}\n` +
        `    mcp-tools: ${JSON.stringify(MCP_TOOL_NAMES)}`,
    );
  }
}

// 2) Scoped stale-count scan (only the MCP-describing surfaces, to avoid false positives).
const SURFACES = [
  "app/.well-known/mcp.json/route.ts",
  "app/.well-known/mcp/server-card.json/route.ts",
  "app/.well-known/discover.json/route.ts",
  "app/.well-known/api-catalog/route.ts",
  "app/llms.txt/route.ts",
  "app/llms-full.txt/route.ts",
  "content/comparisons.ts",
];
const STALE = [
  /\b(five|six|seven|eight)\s+(free\s+|read-only\s+)?tools\b/i,
  /\b[4-9]\s+free\s+tools\b/i,
  /across\s+[4-9]\s+tools/i,
];
for (const rel of SURFACES) {
  const src = readFileSync(join(ROOT, rel), "utf8");
  for (const re of STALE) {
    const m = src.match(re);
    if (m) errors.push(`stale MCP tool-count phrase in ${rel}: ${JSON.stringify(m[0])}`);
  }
}

if (errors.length) {
  console.error("verify-mcp-catalog FAILED:\n" + errors.map((e) => " - " + e).join("\n"));
  process.exit(1);
}
console.log(
  `verify-mcp-catalog OK — ${MCP_TOOL_COUNT} tools consistent across route.ts, lib/mcp-tools.ts, and the descriptors.`,
);
