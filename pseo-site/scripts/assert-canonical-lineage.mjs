#!/usr/bin/env node
// scripts/assert-canonical-lineage.mjs, multi-lineage deploy guard.
//
// signals.gitdealflow.com (Vercel project `pseo-site`, alias-pinned) was
// historically deployed from MULTIPLE checkouts on different branches:
//   ~/signals-gitdealflow/pseo-site        (main)
//   ~/signals-worldclass/pseo-site         (worldclass-signals)
//   ~/Downloads/vc-deal-flow-signal/...    (deleted before 2026-08-12)
// "Whichever deploys last wins" silently reverted verified production fixes
// (2026-08-03/04: deactivated Stripe payment links and post-payment 404s
// went BACK into production days after being fixed and verified live).
//
// RESOLUTION 2026-08-12: exactly ONE canonical lineage may build/deploy:
//   checkout ~/signals-gitdealflow/pseo-site, branch `main`.
//
// How this works: a committed sentinel file `.deploy-lineage` at the repo
// root declares the tree's role. On `main` it says role=CANONICAL; on the
// retired `worldclass-signals` branch it says role=RETIRED. This script runs
// FIRST in `prebuild`, so every deploy path, direct `vercel build`, CI,
// scripts/deploy-prod.sh, and deploy_from_commit.sh's temp git-archive
// export (which has no .git dir, hence a sentinel and not a path check) -
// aborts before building a non-canonical tree.
//
// Do NOT "fix" a failure here by editing the sentinel or this script.
// A failure means you are building the WRONG TREE. Go to the canonical
// checkout instead. (Same contract as verify-no-regressions.ts.)

import { readFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";

const CANONICAL_CHECKOUT = "~/signals-gitdealflow/pseo-site";
const CANONICAL_BRANCH = "main";

function die(msg) {
  console.error("\n[assert-canonical-lineage] ✖ BUILD ABORTED, NON-CANONICAL LINEAGE\n");
  console.error(msg);
  console.error(
    `\nThe ONLY tree allowed to build/deploy signals.gitdealflow.com is:\n` +
      `    checkout ${CANONICAL_CHECKOUT}  (branch ${CANONICAL_BRANCH})\n\n` +
      `Deploying any other tree silently reverts production fixes\n` +
      `("whichever deploys last wins", see AGENTS.md, incidents of 2026-08-03/04).\n` +
      `Land your change on ${CANONICAL_BRANCH} in the canonical checkout and deploy from there\n` +
      `via ~/growth-loop/lib/deploy_from_commit.sh. Do NOT edit .deploy-lineage\n` +
      `or this guard to get past this error.\n`
  );
  process.exit(1);
}

// --- 1. Committed lineage sentinel (works in git-archive exports too) -------
if (!existsSync(".deploy-lineage")) {
  die(
    "No .deploy-lineage sentinel at the repo root. This tree either predates\n" +
      "the 2026-08-12 lineage resolution or was tampered with."
  );
}
const sentinel = Object.fromEntries(
  readFileSync(".deploy-lineage", "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => l.split("=", 2).map((s) => s.trim()))
);
if (sentinel.role !== "CANONICAL") {
  die(
    `.deploy-lineage declares role=${sentinel.role ?? "(missing)"} ` +
      `(lineage=${sentinel.lineage ?? "?"}).\n` +
      "This branch/checkout is RETIRED from deploying signals.gitdealflow.com."
  );
}

// --- 2. Belt-and-braces path check (no-op inside temp exports/CI) -----------
const cwd = process.cwd();
if (/\/signals-worldclass\//.test(cwd)) {
  die(`Building from the retired checkout path: ${cwd}`);
}

// --- 3. Branch check when a real .git is present (skipped in exports/Vercel)
if (!process.env.VERCEL && !process.env.CI) {
  try {
    // Fixed literal command, no user input, execSync is safe here.
    const branch = execSync("git rev-parse --abbrev-ref HEAD", {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
    if (branch !== CANONICAL_BRANCH && branch !== "HEAD") {
      die(`This checkout is on branch '${branch}', not '${CANONICAL_BRANCH}'.`);
    }
  } catch {
    // git-archive export or no git, sentinel already validated the lineage.
  }
}

console.log(
  `[assert-canonical-lineage] ✔ canonical lineage confirmed (role=CANONICAL, lineage=${sentinel.lineage ?? "?"})`
);
