#!/usr/bin/env npx tsx
/**
 * Lineage-ancestry guard (verify-no-regressions section 44, 2026-08-18).
 *
 * WHY THIS EXISTS
 * ---------------
 * Twice (2026-08-16, and historically 2026-08-03/04) a swarm sibling
 * fast-forwarded or reset main onto a lineage built from an older base, and
 * committed production fixes SILENTLY fell out of HEAD. The tree built fine,
 * deployed fine, and the live site regressed (the 92 direct-answer
 * definitions briefly reverted to 1/92). Content guards caught it before
 * ship only because someone ran them manually.
 *
 * The manual ritual was: `git merge-base --is-ancestor <fix> HEAD` + count
 * needles in `git show HEAD:<file>`. This guard makes that ritual mechanical
 * and fail-closed: a tree whose HEAD has lost a sentinel fix CANNOT BUILD,
 * on any deploy path (prebuild, scheduled, agent, temp-worktree).
 *
 * WHAT IT CHECKS
 * --------------
 * From scripts/ancestry-ledger.json, for every sentinel:
 *   1. ANCESTRY: fixCommit is an ancestor of HEAD — unless
 *      ancestryExpected=false (side lineages that never merged but carried
 *      live content are tracked for needles only) or the entry is marked
 *      superseded.
 *   2. CONTENT: every contentNeedle survives in the named file AT HEAD
 *      (read via `git show`, never the worktree, so a dirty or torn
 *      worktree cannot mask a regressed HEAD — and conversely uncommitted
 *      local WIP cannot satisfy the guard for a commit that lacks it).
 *      - pattern + minCount: regex must match at least minCount times.
 *      - pipeline:true: file must exist and parse as JSON at HEAD (for
 *        generated artifacts like data/internal-links.json).
 *   3. SHORT-SHA DISCIPLINE: fixCommit must be a full 40-char SHA.
 *      `git merge-base --is-ancestor` is undefined on ambiguous short SHAs.
 *
 * FAILURE MODES IT CATCHES
 * ------------------------
 * - A reset/ff that drops a sentinel commit (ancestry failure).
 * - A "surgical restore" that restores the file but from a source that
 *   misses part of the fix (needle-count failure).
 * - A cherry-pick that carries the content but NOT the commit (this passes
 *   ancestry — if your workflow cherry-picks, flip ancestryExpected to
 *   false on that entry and rely on the needles; needles are the truth,
 *   ancestry is the tripwire).
 *
 * HOW TO FIX A FAILURE
 * --------------------
 * - Ancestry failure, content PASSES: your fix landed via a different
 *   commit (cherry-pick/rebase). Point fixCommit at the commit that
 *   actually landed it. Do NOT set ancestryExpected=false to silence it.
 * - Content failure: HEAD genuinely lost the fix. Restore it
 *   (`git checkout <fixCommit> -- <path>`, then re-apply any newer
 *   legitimate edits on top) and commit. Do not edit the ledger to match a
 *   regressed tree — that is fixing the test, not the tree.
 * - Needle obsolete (content legitimately rewritten): update the entry
 *   with a supersededBy note, keeping the history.
 *
 * Where it runs: standalone first (below), then §44 inside
 * verify-no-regressions.ts (which owns prebuild). Standalone:
 *   npx tsx scripts/verify-ancestry.ts
 */

import { execFileSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..", ".."); // pseo-site/scripts -> repo root
const LEDGER_PATH = join(__dirname, "ancestry-ledger.json");

interface Needle {
  file: string;
  pattern?: string;
  minCount?: number;
  pipeline?: boolean;
  /** "landing" = the needle lives in the sibling landing/ tree; skipped
   *  with a notice when that tree is absent from this checkout (pseo-site
   *  subtree archive deploys, CI standalone clones), enforced when present.
   *  Mirrors the landingCheck() CI-safe pattern in verify-no-regressions.ts. */
  tree?: "landing";
}

interface Sentinel {
  id: string;
  what?: string;
  auditLine?: string;
  fixCommit: string;
  ancestryExpected?: boolean;
  supersededBy?: string;
  note?: string;
  contentNeedles?: Needle[];
}

interface Ledger {
  sentinels: Sentinel[];
}

function git(args: string[]): string {
  // execFileSync: no shell interpolation of SHAs/paths from the ledger.
  return execFileSync("git", args, {
    cwd: REPO_ROOT,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function gitOk(args: string[]): boolean {
  try {
    git(args);
    return true;
  } catch {
    return false;
  }
}

// Archive exports (deploy_from_commit.sh uses `git archive`) carry no .git:
// ancestry is unverifiable there, but the exported files ARE the commit
// content, so needles still guard the twice-bitten failure mode (content
// loss). Full mode runs wherever git exists (canonical worktree, CI).
const HAS_GIT = gitOk(["rev-parse", "--git-dir"]);
// Shallow clones (actions/checkout default depth=1) lack the history ancestry
// needs: merge-base would false-fail. Degrade to needles-only there, same as
// archive exports.
const IS_SHALLOW = HAS_GIT && git(["rev-parse", "--is-shallow-repository"]).trim() === "true";
if (!HAS_GIT) {
  console.log(
    "[verify-ancestry] note: no .git in this tree (archive export) — content needles enforced, lineage ancestry not verifiable here."
  );
} else if (IS_SHALLOW) {
  console.log(
    "[verify-ancestry] note: shallow clone — content needles enforced, lineage ancestry not verifiable (fetch-depth: 0 to enable)."
  );
}

function headSha(): string {
  return git(["rev-parse", "HEAD"]).trim();
}

/** Resolve a repo-relative needle path against the actual tree layout:
 *  repo-root checkouts (pseo-site/content/...) and subtree exports
 *  (content/... at top level, as `git archive <sha>:pseo-site` produces). */
function resolveNeedlePath(file: string): string | null {
  const bases = [REPO_ROOT, process.cwd(), join(process.cwd(), ".."), join(process.cwd(), "..", "..")];
  const candidates = [file, file.replace(/^pseo-site\//, "")];
  for (const base of bases) {
    for (const cand of candidates) {
      const p = join(base, cand);
      if (existsSync(p)) return p;
    }
  }
  return null;
}

function fileAtHead(file: string): string | null {
  if (HAS_GIT) {
    if (!gitOk(["cat-file", "-e", `HEAD:${file}`])) return null;
    return git(["show", `HEAD:${file}`]);
  }
  // Archive mode: the file on disk IS the shipped content.
  const p = resolveNeedlePath(file);
  return p === null ? null : readFileSync(p, "utf8");
}

function countPattern(haystack: string, pattern: string): number {
  const re = new RegExp(pattern, "gm");
  const matches = haystack.match(re);
  return matches ? matches.length : 0;
}

/** Landing sibling tree present in this checkout? (absent in pseo-site
 *  subtree archive exports and CI standalone clones). */
function landingTreePresent(): boolean {
  const candidates = [
    join(REPO_ROOT, "landing"),
    join(process.cwd(), "..", "landing"),
    join(process.cwd(), "landing"),
  ];
  return candidates.some((p) => existsSync(join(p, "package.json")) || existsSync(p));
}

export interface AncestryResult {
  failures: string[];
  summary: string;
}

export function runAncestryGuard(): AncestryResult {
  const failures: string[] = [];
  let ledger: Ledger;
  try {
    ledger = JSON.parse(readFileSync(LEDGER_PATH, "utf8")) as Ledger;
  } catch (err) {
    return {
      failures: [
        `§44 ancestry-ledger.json missing or unparsable — the guard cannot run. ${String(err)}`,
      ],
      summary: `head=? sentinels=0 (ledger unreadable)`,
    };
  }

  const head = HAS_GIT ? headSha() : "(archive)";
  let checkedAncestry = 0;
  let checkedNeedles = 0;
  let skipped = 0;

  for (const s of ledger.sentinels) {
    const label = s.id ?? "(unnamed sentinel)";

    if (!s.fixCommit || !/^[0-9a-f]{40}$/.test(s.fixCommit)) {
      failures.push(
        `§44 ${label}: fixCommit "${s.fixCommit}" is not a full 40-char SHA — ` +
          `short SHAs make ancestry checks undefined. Resolve it: git rev-parse <short>.`
      );
      continue;
    }

    if (s.supersededBy) {
      skipped++;
      console.log(`[verify-ancestry] skip ${label} (superseded by ${s.supersededBy})`);
      continue;
    }

    // --- 1. ancestry (full-history checkouts only: archives lack .git,
    //     shallow clones lack the history merge-base needs) ---
    if (HAS_GIT && !IS_SHALLOW && s.ancestryExpected !== false) {
      checkedAncestry++;
      const isAncestor = gitOk(["merge-base", "--is-ancestor", s.fixCommit, "HEAD"]);
      if (!isAncestor) {
        failures.push(
          `§44 ${label}: fixCommit ${s.fixCommit.slice(0, 10)} is NOT an ancestor of HEAD ${head.slice(0, 10)}.\n` +
            `  A lineage reset may have dropped this fix from main (known swarm hazard, bitten twice).\n` +
            `  Check content below: if needles also fail, HEAD lost the fix — restore it (git checkout ${s.fixCommit.slice(0, 10)} -- <path>);\n` +
            `  if needles pass, the fix landed via a different commit — repoint fixCommit. Do not silence this.`
        );
      }
    }

    // --- 2. content needles at HEAD ---
    for (const n of s.contentNeedles ?? []) {
      // Landing-tree needles: enforce only when the landing tree exists in
      // this checkout (repo-root) — subtree archive exports of pseo-site and
      // CI standalone clones legitimately lack it.
      if (n.tree === "landing" && !landingTreePresent()) {
        continue;
      }
      const content = fileAtHead(n.file);
      if (content === null) {
        failures.push(
          `§44 ${label}: file ${n.file} does not exist at HEAD — the fix it carries is gone from the tree.`
        );
        continue;
      }
      if (n.pipeline) {
        checkedNeedles++;
        try {
          JSON.parse(content);
        } catch {
          failures.push(`§44 ${label}: ${n.file} exists at HEAD but does not parse as JSON (pipeline artifact corrupted).`);
        }
        continue;
      }
      if (!n.pattern) {
        failures.push(`§44 ${label}: needle on ${n.file} has neither pattern nor pipeline — fix the ledger entry.`);
        continue;
      }
      checkedNeedles++;
      const count = countPattern(content, n.pattern);
      const min = n.minCount ?? 1;
      if (count < min) {
        failures.push(
          `§44 ${label}: ${n.file} at HEAD has ${count} match(es) for /${n.pattern}/, floor is ${min}.\n` +
            `  The content this sentinel protects has partially or fully regressed. Restore from ${s.fixCommit.slice(0, 10)} ` +
            `(re-applying any newer legitimate edits), or mark supersededBy if legitimately rewritten.`
        );
      }
    }
  }

  const summary =
    `head=${head.slice(0, 10)} sentinels=${ledger.sentinels.length} ` +
    `ancestryChecks=${checkedAncestry} needleChecks=${checkedNeedles} skipped=${skipped}`;

  return { failures, summary };
}

// CLI entry (standalone run): full output + exit code.
if (process.argv[1] && process.argv[1].endsWith("verify-ancestry.ts")) {
  const { failures, summary } = runAncestryGuard();
  if (failures.length > 0) {
    console.error("[verify-ancestry] FAIL — sentinel lineage or content regression detected:");
    for (const f of failures) console.error(`\n  ${f}`);
    console.error(`\n[verify-ancestry] ${summary}`);
    process.exit(1);
  }
  console.log(`[verify-ancestry] OK — sentinel fixes all hold (${summary}).`);
}
