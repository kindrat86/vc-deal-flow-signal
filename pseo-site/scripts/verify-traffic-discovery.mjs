#!/usr/bin/env node

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const read = (file) => readFileSync(resolve(root, file), "utf8");

const robots = read("public/robots.txt");
assert.match(
  robots,
  /^Sitemap: https:\/\/signals\.gitdealflow\.com\/sitemap\.xml$/m,
  "robots.txt must declare the canonical sitemap index",
);

const vercel = JSON.parse(read("vercel.json"));
assert.ok(
  vercel.redirects?.some(
    (rule) =>
      rule.source === "/AGENTS.md" &&
      rule.destination === "/agents.md" &&
      rule.permanent === true,
  ),
  "uppercase /AGENTS.md must permanently redirect to the markdown discovery file",
);

const sourcing = read("content/posts-sourcing-cluster.ts");
for (const needle of [
  'title: "How Do VCs Source Deals? 4 Channels + Weekly Workflow (2026)"',
  '"VCs source deals through four channels: inbound, outbound, networks, and data platforms. See the weekly workflow, funnel stages, and metrics funds track."',
  'body: "VCs source deals through four channels: inbound, outbound, networks, and platform or data sourcing.',
]) {
  assert.ok(sourcing.includes(needle), `striking-distance snippet regression: missing ${needle}`);
}

const agentQueries = read("content/agent-queries.ts");
for (const needle of [
  'metaTitle: "Glama MCP Directory: Official Registry vs Glama (2026)"',
  '"Glama is an independent MCP server directory, not the official registry. Compare its search, install instructions, host support, and A-F quality tiers."',
  'metaTitle: "Harmonic.ai Pricing (2026): Cost + Free Alternative"',
  '"Harmonic.ai does not publish list pricing. See reported 2026 quotes around $20K-$24K per seat yearly and compare a free GitHub-based alternative side by side."',
]) {
  assert.ok(agentQueries.includes(needle), `striking-distance query regression: missing ${needle}`);
}

const competitorVs = read("content/competitor-vs.ts");
assert.ok(
  competitorVs.includes(
    '"harmonic-ai-vs-dealroom": "Harmonic.ai vs Dealroom: Which Is Better for Sourcing?"',
  ),
  "Harmonic vs Dealroom title must match the zero-click comparison query",
);

console.log("traffic-discovery guard: OK");