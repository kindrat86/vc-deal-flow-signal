#!/usr/bin/env node
/**
 * Word-floor guard for signals.gitdealflow.com (pSEO site, Next.js).
 *
 * Enforces the thin-content floor from the 2026-08-15 traffic audit: no
 * indexable prerendered page under 400 visible words. The audit measured
 * templates from 140 to 2,722 words; the audit's win #3 enrichment already
 * lifted the four flagged templates (answers, momentum/signal, glossary,
 * city) well above the floor on `main`. This script is the PERMANENT gate:
 * a template that regresses below the floor blocks the build instead of
 * shipping thin, regardless of which lineage/checkout deploys.
 *
 * Where it runs: `postbuild` (first step), NOT prebuild. The floor is
 * measured on RENDERED HTML (the .next/server/app tree), which only exists
 * after `next build`. A postbuild exit still fails `npm run build` and
 * therefore every deploy path (same npm-lifecycle mechanism the prebuild
 * regression guards rely on; see scripts/verify-no-regressions.ts).
 *
 * Baseline pinning (~500 pages of pre-existing thin debt):
 *   data/thin-content-baseline.json snapshots every currently-thin page at
 *   its measured count. A page in the baseline may not fall more than
 *   BUFFER words below its pinned count; a page NOT in the baseline must
 *   meet the hard FLOOR. When you enrich a family, delete its rows from the
 *   baseline (regenerate with --update-baseline) and the hard floor takes
 *   over. Never delete rows to "fix" a failure: enrich the template.
 *
 * Word counting mirrors landing/scripts/verify-word-floor.mjs exactly
 * (same strip order: script → style → comments → nav/header/footer → tags
 * → unescape → whitespace-split). Do not drift this counter.
 *
 * Usage:
 *   node scripts/verify-word-floor.mjs                    # verify (exit 1)
 *   node scripts/verify-word-floor.mjs --update-baseline   # regen baseline
 * Env:
 *   WORDFLOOR_REPORT_ONLY=true   log only, never exit non-zero
 *   WORDFLOOR_BASELINE=path      override baseline file (for self-tests)
 */

import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { join, extname, relative } from "node:path";

const FLOOR = 400;
const BUFFER = 10; // regeneration noise tolerance for pinned pages
const BASELINE_PATH =
  process.env.WORDFLOOR_BASELINE || "data/thin-content-baseline.json";
const REPORT_ONLY = process.env.WORDFLOOR_REPORT_ONLY === "true";
const UPDATE = process.argv.includes("--update-baseline");
const APP_DIR = join(process.cwd(), ".next/server/app");

// ---------------------------------------------------------------- counter --

function visibleWords(html) {
  let t = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ");
  t = t.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ");
  t = t.replace(/<!--[\s\S]*?-->/g, " ");
  t = t.replace(/<(nav|header|footer)[^>]*>[\s\S]*?<\/\1>/gi, " ");
  t = t.replace(/<[^>]+>/g, " ");
  t = t
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ");
  t = t.replace(/\s+/g, " ").trim();
  return t ? t.split(" ").length : 0;
}

function isNoindex(html) {
  return (
    /<meta[^>]+name=["']robots["'][^>]+noindex/i.test(html) ||
    /<meta[^>]+content=["'][^"']*noindex[^"']*["'][^>]+name=["']robots["']/i.test(html)
  );
}

// ------------------------------------------------------ noindex discovery --

/**
 * Route prefixes that vercel.json makes noindex via X-Robots-Tag headers.
 * Derived from the config (not hardcoded) so future header additions are
 * picked up automatically. Such pages are legitimately content-free.
 */
function noindexPrefixesFromVercelJson() {
  const prefixes = [];
  try {
    const cfg = JSON.parse(readFileSync("vercel.json", "utf8"));
    for (const h of cfg.headers || []) {
      const xr = (h.headers || []).find(
        (x) => x.key.toLowerCase() === "x-robots-tag" && /noindex/i.test(x.value),
      );
      if (!xr) continue;
      const src = h.source.replace(/^\//, "").replace(/\(\.\*\)$/, "").replace(/\/$/, "");
      if (src) prefixes.push(src);
    }
  } catch {
    /* no vercel.json → no header-derived exclusions */
  }
  return prefixes;
}

const NOINDEX_PREFIXES = noindexPrefixesFromVercelJson();

// Transactional / functional trees that are exempt from a content floor by
// design (post-purchase, iframe widget, short-link interstitials).
const SKIP_DIRS = new Set(["thanks", "embed", "r", "s", "share-approve", "vault"]);

// ------------------------------------------------------------------ scan --

const rows = [];
function walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      walk(full);
      continue;
    }
    if (extname(e.name) !== ".html") continue;
    if (e.name.startsWith("_")) continue; // _not-found, _global-error
    const rel = relative(APP_DIR, full);
    const firstSeg = rel.split("/")[0];
    if (SKIP_DIRS.has(firstSeg)) continue;
    if (NOINDEX_PREFIXES.some((p) => rel === p || rel.startsWith(p + "/"))) continue;
    let html;
    try {
      html = readFileSync(full, "utf8");
    } catch {
      continue;
    }
    if (isNoindex(html)) continue;
    rows.push({ rel, words: visibleWords(html) });
  }
}

if (!existsSync(APP_DIR) || !statSync(APP_DIR).isDirectory()) {
  console.error(
    "❌ verify-word-floor: no .next/server/app output. Run after `next build`.",
  );
  process.exit(1);
}
walk(APP_DIR);

// --------------------------------------------------------------- baseline --

let baseline = { pages: {} };
if (!UPDATE && existsSync(BASELINE_PATH)) {
  try {
    baseline = JSON.parse(readFileSync(BASELINE_PATH, "utf8"));
  } catch (e) {
    console.error(`❌ verify-word-floor: cannot parse ${BASELINE_PATH}: ${e.message}`);
    process.exit(1);
  }
}
const pinned = baseline.pages || {};

if (UPDATE) {
  const thin = rows.filter((r) => r.words < FLOOR).sort((a, b) => a.words - b.words);
  const byFamily = new Map();
  for (const t of thin) {
    const fam = t.rel.includes("/") ? t.rel.split("/")[0] : "(top level)";
    byFamily.set(fam, (byFamily.get(fam) || 0) + 1);
  }
  const out = {
    _comment:
      "Thin-content baseline (2026-08-15 audit). Pages below the 400-word floor, pinned at their measured counts: they may not get THINNER (floor = count - 10). Pages absent from this file must meet the hard 400 floor. Enrich a template, then regenerate with `node scripts/verify-word-floor.mjs --update-baseline` so its rows drop out. Never hand-edit counts downward.",
    floor: FLOOR,
    buffer: BUFFER,
    generatedAt: new Date().toISOString(),
    pages: Object.fromEntries(thin.map((t) => [t.rel, t.words])),
  };
  writeFileSync(BASELINE_PATH, JSON.stringify(out, null, 2) + "\n");
  console.log(
    `✓ baseline regenerated: ${thin.length} thin page(s) pinned across ${byFamily.size} families`,
  );
  for (const [fam, n] of [...byFamily.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`    ${String(n).padStart(4)}  ${fam}`);
  }
  process.exit(0);
}

// -------------------------------------------------------------- verify ----

const violations = [];
let hardFloorChecks = 0;
let pinnedChecks = 0;

for (const r of rows) {
  if (r.words >= FLOOR) continue;
  if (Object.prototype.hasOwnProperty.call(pinned, r.rel)) {
    pinnedChecks++;
    const floorFor = pinned[r.rel] - BUFFER;
    if (r.words < floorFor) {
      violations.push(
        `${r.rel}: ${r.words} words (pinned ${pinned[r.rel]}, floor ${floorFor}) — page got THINNER`,
      );
    }
  } else {
    hardFloorChecks++;
    violations.push(`${r.rel}: ${r.words} words (floor ${FLOOR})`);
  }
}

const stale = Object.keys(pinned).filter((k) => !rows.some((r) => r.rel === k));

console.log(
  `verify-word-floor: ${rows.length} indexable prerendered page(s), floor ${FLOOR}` +
    ` (baseline: ${pinnedChecks} pinned thin, ${hardFloorChecks} unregistered thin)`,
);
if (stale.length) {
  console.log(
    `  note: ${stale.length} baseline row(s) no longer exist (route removed or noindex); regenerate to prune`,
  );
}

if (violations.length) {
  console.error(
    `\n❌ verify-word-floor: ${violations.length} page(s) below the ${FLOOR}-word floor:`,
  );
  for (const v of violations.slice(0, 30)) console.error(`  - ${v}`);
  if (violations.length > 30) console.error(`  … and ${violations.length - 30} more`);
  console.error(
    "\nFix the TEMPLATE that emits these pages (or enrich them), not the\n" +
      "baseline: regeneration will re-introduce a hand-patched page. After\n" +
      "enriching, regenerate the baseline so the rows drop out:\n" +
      "  node scripts/verify-word-floor.mjs --update-baseline",
  );
  if (!REPORT_ONLY) process.exit(1);
} else {
  console.log(`✓ verify-word-floor: all ${rows.length} page(s) pass`);
}
