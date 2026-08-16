#!/usr/bin/env node
/**
 * §23 AEO direct-answer guard for gitdealflow.com (static HTML).
 *
 * Every indexable /answers page must carry a visible 40-60 word
 * "Direct answer:" callout in a [data-direct-answer] wrapper, inserted
 * directly after the H1, and the page's core question mirrored as a
 * Question node in the FAQPage JSON-LD. Established 2026-08-16 by the
 * audit-08-15 AEO fix (score 66 → target 80+).
 *
 * Runs in vercel.json buildCommand alongside verify-jsonld and
 * verify-word-floor, so a regressed tree cannot deploy. Mirrors the
 * §23 checks in pseo-site/scripts/verify-no-regressions.ts.
 *
 * Usage: node scripts/verify-direct-answers.mjs   (exit 1 on violation)
 */

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ANSWERS_DIR = "answers";
const failures = [];

function visibleWords(s) {
  return s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().split(" ").filter(Boolean).length;
}

function checkPage(path, html) {
  const rel = path;
  // noindex pages are exempt
  if (/name="robots"\s+content="[^"]*noindex/i.test(html)) return;

  // 1. visible direct-answer callout in the marked wrapper
  const m = html.match(
    /<div[^>]*data-direct-answer[^>]*>[\s\S]*?<strong>Direct answer:<\/strong>\s*([\s\S]*?)<\/p>/,
  );
  if (!m) {
    failures.push(`${rel}: no [data-direct-answer] "Direct answer:" callout`);
    return;
  }
  const words = visibleWords(m[1]);
  if (words < 40 || words > 60) {
    failures.push(`${rel}: direct answer is ${words} words (needs 40-60)`);
  }

  // 2. callout sits before the first H2 (top-of-page extraction position)
  const h2 = html.search(/<h2[\s>]/i);
  const callout = html.indexOf("data-direct-answer");
  if (h2 !== -1 && callout !== -1 && callout > h2) {
    failures.push(`${rel}: direct-answer callout appears after the first H2 (must be top-of-page)`);
  }

  // 3. core question mirrored in FAQPage schema
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  let faqOk = false;
  for (const b of blocks) {
    let d;
    try {
      d = JSON.parse(b[1]);
    } catch {
      continue; // verify-jsonld.mjs owns parse errors
    }
    const nodes = d["@graph"] ? d["@graph"] : [d];
    for (const n of nodes) {
      if (n && n["@type"] === "FAQPage" && Array.isArray(n.mainEntity) && n.mainEntity.length) {
        faqOk = true;
      }
    }
  }
  if (!faqOk) {
    failures.push(`${rel}: no FAQPage JSON-LD with a Question in mainEntity (core-Q mirror)`);
  }
}

// index page is a hub, not an answer page
const SKIP = new Set(["index.html", "feed.json"]);

// 2026-08-16 AI-citation lift (citation/mention share 25): the four AIO-visible
// buyer-intent pages outside /answers (p1/p3/p5/p7 of the ai-citations probe set)
// now carry the same 40-60w "Direct answer:" callout. Guarded here so a lineage
// revert cannot strip them silently.
const QUOTABLE_TARGETS = [
  "alternatives-to/pitchbook-alternatives/index.html",
  "best/best-deal-flow-tools.html",
  "pricing/pitchbook-pricing/index.html",
  "alternatives-to/crunchbase-alternatives/index.html",
];

function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "index.html") checkPage(join(p, "index.html"), readFileSync(join(p, "index.html"), "utf8"));
      else walk(p);
    } else if (e.name.endsWith(".html") && !SKIP.has(e.name)) {
      checkPage(p, readFileSync(p, "utf8"));
    }
  }
}

if (!existsSync(ANSWERS_DIR)) {
  console.error(`verify-direct-answers: ${ANSWERS_DIR}/ not found (run from landing root)`);
  process.exit(1);
}
walk(ANSWERS_DIR);

// 2026-08-16: also enforce the quotable direct-answer block on the four
// AIO-visible buyer-intent pages (see QUOTABLE_TARGETS above).
for (const t of QUOTABLE_TARGETS) {
  if (existsSync(t)) checkPage(t, readFileSync(t, "utf8"));
  else failures.push(`${t}: missing file (quotable-target guard)`);
}

if (failures.length) {
  console.error(`\n✖ verify-direct-answers: ${failures.length} violation(s):\n`);
  for (const f of failures) console.error(`  ✖ ${f}`);
  process.exit(1);
}
console.log("✓ verify-direct-answers: all /answers pages carry a 40-60w direct answer + FAQ mirror");
