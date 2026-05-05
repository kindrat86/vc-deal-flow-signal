#!/usr/bin/env node
/**
 * run-all.mjs — umbrella runner for paper amplification scripts.
 *
 * Fires the fully-autonomous scripts (check-indexing, wayback-machine)
 * sequentially. Login-walled scripts (OSF, ResearchGate, Papers With
 * Code, etc.) are listed but not executed without a Steel session ID.
 *
 * Usage:
 *   node distribution/research-paper/submissions/scripts/run-all.mjs
 *
 * With a Steel session (runs login-walled submissions too):
 *   node distribution/research-paper/submissions/scripts/run-all.mjs --session=<steel_id>
 */

import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const args = Object.fromEntries(
  process.argv
    .slice(2)
    .filter((a) => a.startsWith("--"))
    .map((a) => {
      const [k, ...rest] = a.slice(2).split("=");
      return [k, rest.length ? rest.join("=") : true];
    })
);

const autonomous = [
  "check-indexing.mjs",
  "submit-wayback-machine.mjs",
];

const loginWalled = [
  "submit-papers-with-code.mjs",
  "submit-osf.mjs",
  "submit-researchgate.mjs",
  "submit-orcid.mjs",
  "submit-mpra.mjs",
  "submit-figshare.mjs",
  "submit-harvard-dataverse.mjs",
  "submit-mendeley-data.mjs",
  "submit-humanities-commons.mjs",
  "submit-academia-edu.mjs",
];

const apiKeyed = [
  "submit-devto.mjs",        // needs DEV_TO_API_KEY
  "submit-hashnode.mjs",      // needs HASHNODE_PAT
];

function run(script) {
  const p = path.join(__dirname, script);
  console.log(`\n═══ ${script} ═══`);
  try {
    execSync(`node ${p}`, { stdio: "inherit" });
  } catch (err) {
    console.error(`${script} exited with error: ${err.message}`);
  }
}

console.log("═══ Autonomous (no auth required) ═══");
for (const s of autonomous) run(s);

if (process.env.DEV_TO_API_KEY || process.env.HASHNODE_PAT) {
  console.log("\n═══ API-keyed ═══");
  for (const s of apiKeyed) {
    if (s.includes("devto") && !process.env.DEV_TO_API_KEY) continue;
    if (s.includes("hashnode") && !process.env.HASHNODE_PAT) continue;
    run(s);
  }
} else {
  console.log(
    "\n[skipped] API-keyed scripts (DEV_TO_API_KEY, HASHNODE_PAT not set)"
  );
}

if (args.session) {
  console.log(`\n═══ Login-walled (Steel session ${args.session}) ═══`);
  for (const s of loginWalled) {
    const p = path.join(__dirname, s);
    try {
      execSync(`node ${p} --session=${args.session}`, { stdio: "inherit" });
    } catch (err) {
      console.error(`${s} exited: ${err.message}`);
    }
  }
} else {
  console.log(
    "\n[skipped] Login-walled scripts (pass --session=<STEEL_SESSION_ID> to run)"
  );
  console.log(
    "Bootstrap a Steel session with: node tools/steel/session.mjs --url=https://osf.io/login"
  );
}

console.log(
  "\nDone. Review distribution/research-paper/amplification-status.json for updates."
);
