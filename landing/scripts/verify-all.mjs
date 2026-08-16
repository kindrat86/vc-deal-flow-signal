#!/usr/bin/env node
/**
 * Build-gate orchestrator for gitdealflow.com (landing, static HTML).
 *
 * Runs every verify gate in order and fails the build on the first failure.
 * This wrapper exists because Vercel caps `projectSettings.buildCommand` at
 * 256 characters; chaining all seven gates inline hit that cap (deploy_failed
 * "buildCommand should NOT be longer than 256 characters", 2026-08-19).
 * Adding a gate here keeps the buildCommand a single short line.
 *
 * Order mirrors the historical inline chain and matters: verify-vercel-config
 * first (cheapest config sanity), JSON-LD parse next, then content gates.
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
// Gates run from the deploy ROOT (parent of scripts/), not scripts/: the gates
// scan "." (the tree that ships) and read "pricing.html" relative to cwd.
const ROOT = dirname(HERE);

const GATES = [
  ["node", ["scripts/verify-vercel-config.mjs"]],
  ["node", ["scripts/verify-jsonld.mjs", "."]],
  ["node", ["scripts/verify-word-floor.mjs"]],
  ["node", ["scripts/verify-direct-answers.mjs"]],
  ["node", ["scripts/verify-no-dashes.mjs"]],
  ["node", ["scripts/verify-css-preloads.mjs"]],
  ["node", ["scripts/verify-pricing-offers.mjs"]],
];

for (const [cmd, args] of GATES) {
  const r = spawnSync(cmd, args, { cwd: ROOT, stdio: "inherit", shell: false });
  if (r.status !== 0) {
    console.error(`\n❌ verify-all: gate failed (${args.join(" ")}), refusing to ship.`);
    process.exit(r.status === null ? 1 : r.status);
  }
}

console.log("✓ verify-all: all build gates passed");
