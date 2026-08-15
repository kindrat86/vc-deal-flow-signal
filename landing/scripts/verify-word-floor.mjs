#!/usr/bin/env node
/**
 * On-page word-floor guard for gitdealflow.com (static HTML).
 *
 * Enforces the on-page SEO floor set on 2026-08-15: no INDEXABLE page under
 * 500 visible words. The audit (audit 08-15) found body depth varying from
 * 165 to 1,900 words, with ~250 pages under 400; the floor raise deepens every
 * indexable template to >=500 so thin-content risk cannot re-enter silently.
 *
 * This is the BUILD-time enforcement of the one-off enrichment in
 * _onpage_floor_500.py. That script is a run-once; this is the permanent
 * gate. It runs in vercel.json's buildCommand, so a template that regresses
 * below the floor blocks the deploy instead of shipping thin.
 *
 * Word counting mirrors _onpage_floor_500.py visible_words() exactly:
 *   strip <script>, <style>, HTML comments, <nav>/<header>/<footer>, then
 *   strip remaining tags and count whitespace-split tokens.
 *
 * Exclusion mirrors _onpage_floor_500.py: noindex pages (meta robots), the
 * EXCLUDE_DIRS set, SKIP_FILES, and SKIP_SUBSTR. Noindex utility pages
 * (status, report, funnel-math) and the JSON-LD fragment are legitimately
 * thin and must NOT be flagged.
 *
 * Usage: node scripts/verify-word-floor.mjs   (exit 1 on any violation)
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname, relative } from "node:path";

const TARGET = 500;

const EXCLUDE_DIRS = new Set([
  ".vercel", "api", "embed", "widgets", "brand-assets", "de", "es",
  "node_modules", ".git", ".next",
]);
const SKIP_FILES = new Set([
  "404.html", "related-tools.html", "embed.html", "network-widget.html",
  "network/widget.html", "schema/jsonld-organization.html",
  "startupranking1371172920462410.html",
]);
const SKIP_SUBSTR = ["-thanks.html", "google", "yandex_", "startupranking"];

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
  return /<meta[^>]+name=["']robots["'][^>]+noindex/i.test(html) ||
    /<meta[^>]+content=["'][^"']*noindex[^"']*["'][^>]+name=["']robots["']/i.test(html);
}

const violations = [];
let scanned = 0;

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
    if (extname(e.name) !== ".html") continue;
    const rel = relative(process.cwd(), full) || full;
    if (SKIP_FILES.has(rel)) continue;
    if (SKIP_SUBSTR.some((s) => rel.includes(s))) continue;

    let html;
    try {
      html = readFileSync(full, "utf8");
    } catch {
      continue;
    }
    if (isNoindex(html)) continue;

    scanned++;
    const wc = visibleWords(html);
    if (wc < TARGET) {
      violations.push(`${rel}: ${wc} visible words (floor ${TARGET})`);
    }
  }
}

walk(".");

if (violations.length) {
  console.error(
    `\n❌ verify-word-floor: ${violations.length} indexable page(s) below the ${TARGET}-word floor:`,
  );
  for (const v of violations) console.error(`  - ${v}`);
  console.error(
    "\nFix the TEMPLATE that emits these pages (or enrich them with " +
      "_onpage_floor_500.py), not the individual files: regeneration will " +
      "re-introduce a hand-patched page.",
  );
  process.exit(1);
}

console.log(
  `✓ verify-word-floor: ${scanned} indexable page(s) >= ${TARGET} words`,
);
