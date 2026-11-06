#!/usr/bin/env node
/**
 * Internal CLI for the for-funds sample generator (directive gdf-for-funds
 * phase 2). Runs the exact same handler/matching as the live endpoint, prints
 * a one-page markdown sample. Internal tooling: never deployed (scripts/ is
 * excluded from dist by build-public.mjs).
 *
 * Usage:
 *   node scripts/for-funds-sample.mjs "We back applied AI in healthcare teams in Europe."
 *   node scripts/for-funds-sample.mjs --list          # thesis bank labels
 *   node scripts/for-funds-sample.mjs --queue         # print the local queue tail
 */
import handler from "../api/for-funds-sample.js";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

process.env.QS_DIR = process.env.QS_DIR || join(homedir(), ".local", "state", "gdf-for-funds");

function mockRes() {
  return {
    headers: {},
    status(c) { this._c = c; return this; },
    setHeader() {},
    json(b) { this._b = b; return this; },
  };
}

const arg = process.argv[2];

if (!arg || arg === "--list") {
  const r = mockRes();
  await handler({ method: "GET" }, r);
  if (!arg) {
    console.log("Usage: node scripts/for-funds-sample.mjs \"<fund thesis>\"  |  --list  |  --queue");
    process.exit(2);
  }
  for (const t of r._b.theses) console.log(`${t.id.padEnd(24)} ${t.label}`);
  console.log(`signal data updated: ${r._b.updated}, max matches/thesis: ${r._b.max_matches}`);
  process.exit(0);
}

if (arg === "--queue") {
  try {
    const lines = readFileSync(join(process.env.QS_DIR, "for-funds-sample-queue.jsonl"), "utf8").trim().split("\n");
    console.log(lines.slice(-10).join("\n"));
  } catch {
    console.log("(queue is empty or does not exist yet)");
  }
  process.exit(0);
}

const r = mockRes();
await handler({ method: "POST", body: { thesis: arg, variant: "internal_cli" } }, r);
if (!r._b.ok) {
  console.error(`error: ${r._b.error}${r._b.hint ? " - " + r._b.hint : ""}`);
  process.exit(1);
}
const b = r._b;
console.log(`# Sample report - matched thesis: ${b.thesis_label}`);
console.log();
console.log(`Method: ${b.method}`);
console.log(`Signal data updated: ${b.data_updated}. ${b.queued_via === "stdout" ? "(no email sent; request logged)" : `(queued as ${b.queue_id}; no email sent)`}`);
console.log();
b.matches.forEach((m, i) => {
  console.log(`## ${i + 1}. ${m.name} - ${m.sector}`);
  console.log(`- Why matched: ${m.why_matched}`);
  console.log(`- Evidence: ${m.evidence}`);
});
console.log();
console.log("_Public engineering-activity signal to investigate, not investment advice._");
