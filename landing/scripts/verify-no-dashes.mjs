#!/usr/bin/env node
/**
 * No-dash guard for gitdealflow.com (static HTML), the landing half of the
 * site-wide style rule established 2026-08-14: never an em dash or en dash in
 * any shipped copy (use a comma, colon, paren, or hyphen instead).
 *
 * The pSEO project (signals.gitdealflow.com) enforces this in
 * scripts/verify-no-regressions.ts section 11. This script is the landing
 * equivalent: it runs in vercel.json's buildCommand, so any reintroduced
 * em/en dash (or its HTML entity) blocks the deploy instead of shipping.
 *
 * The 2026-08-14 sweep removed ~19k dashes across landing + pSEO, but the
 * landing had no build gate, so the dash could re-enter silently (it did:
 * pricing.html and 15 glossary pages regressed). This gate closes that hole.
 *
 * Scans shipped-content files only (html/css/js/json/txt/md/xml). Excludes
 * .vercel (build output), node_modules, .git, .next, and scripts/ (build
 * tooling, not served), mirroring verify-word-floor.mjs.
 *
 * Usage: node scripts/verify-no-dashes.mjs   (exit 1 on any violation)
 */
import { readdirSync, readFileSync } from "node:fs";
import { join, extname, relative } from "node:path";

const EM = String.fromCharCode(0x2014); // em dash
const EN = String.fromCharCode(0x2013); // en dash
const ESCAPED = /\\u2014|\\u2013/; // literal backslash-u2014 / backslash-u2013 in source
const DASHES = [
  EM,
  EN,
  "&" + "mdash;",
  "&" + "ndash;",
  "&#" + "8212;",
  "&#" + "8211;",
];

const EXTS = new Set([".html", ".css", ".js", ".json", ".txt", ".md", ".xml"]);
const EXCLUDE_DIRS = new Set([".vercel", "node_modules", ".git", ".next", "scripts"]);

const offenders = [];
let scanned = 0;

function label(d) {
  if (d === EM) return "em-dash";
  if (d === EN) return "en-dash";
  return d;
}

function hasDash(txt) {
  return DASHES.some((d) => txt.includes(d)) || ESCAPED.test(txt);
}

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
      if (!EXCLUDE_DIRS.has(e.name)) walk(full);
      continue;
    }
    if (!EXTS.has(extname(e.name).toLowerCase())) continue;
    if (e.name.endsWith(".d.ts")) continue;
    const rel = relative(process.cwd(), full) || full;
    let txt;
    try {
      txt = readFileSync(full, "utf8");
    } catch {
      continue;
    }
    scanned++;
    const found = DASHES.filter((d) => txt.includes(d));
    if (found.length || ESCAPED.test(txt)) {
      const labels = found.map(label);
      if (ESCAPED.test(txt)) labels.push("escaped-u2014/2013");
      offenders.push(`${rel}  [${labels.join(", ")}]`);
    }
  }
}

walk(".");

if (offenders.length) {
  console.error(
    `\n❌ verify-no-dashes: ${offenders.length} shipped file(s) reintroduced an em/en dash:`,
  );
  for (const o of offenders) console.error(`  - ${o}`);
  console.error(
    "\nFix the SOURCE (and the generator/template if it emits these pages), " +
      "not just the file: replace the em/en dash with a comma, colon, paren, or hyphen.",
  );
  console.error(
    "Reason: 2026-08-14 site-wide no-dash style rule (mirrors pSEO guard §11).",
  );
  process.exit(1);
}

console.log(`✓ verify-no-dashes: ${scanned} shipped file(s) dash-free`);
