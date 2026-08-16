#!/usr/bin/env npx tsx
/**
 * Direct-answer coverage guard (featured-snippet rebuild, 2026-08-16).
 *
 * WHY THIS EXISTS
 * ---------------
 * The audit line: "Featured snippets 30 — eligible structure, none captured —
 * fix: 40-60 word direct-answer blocks". The site already had the full
 * extraction surface ([data-direct-answer] block, Speakable cssSelector,
 * Answer + FAQPage JSON-LD nodes), but the `definition` field was populated
 * on 1 of 92 /answers/ entries, so the direct-answer contract held on a
 * single page. This rebuild authored 91 grounded 40-60 word definitions.
 *
 * The failure mode this guards against is SILENT DECAY: a new entry added
 * without a `definition` reverts that page to tldr-only rendering — the box
 * disappears, Speakable falls back to generic selectors, and nothing in the
 * build notices. A definition that drifts out of the 40-60 word snippet
 * window (too short to extract, too long to quote) is equally invisible.
 *
 * WHAT IT CHECKS
 * --------------
 * For every entry in content/agent-queries.ts:
 *   1. `definition` is present and non-empty (100% coverage floor).
 *   2. Word count lands in [40, 60] — the featured-snippet/AIO window the
 *      template's speakable + Answer nodes are tuned for.
 *   3. The rendered block will not be empty: definition !== tldr is NOT
 *      required (same text is fine), but definition must differ from the
 *      entry's `description` (meta-description reuse would make the SERP
 *      snippet and the on-page answer redundant).
 *   4. Coverage ratchet: definitions/entries >= 100%. If a future refactor
 *      intentionally lowers the floor (e.g. a template family split), update
 *      MIN_COVERAGE here with a comment explaining why.
 *
 * It does NOT check rendering (verify-speakable.ts owns the selector→DOM
 * contract) or the JSON-LD emission (verify-jsonld.mjs owns that).
 *
 * Where it runs: prebuild (fail-closed before any artifact is built), so a
 * regressed tree cannot deploy through any path (scheduled, agent, manual).
 * Standalone: npx tsx scripts/verify-direct-answers.ts
 */

import { agentQueries } from "../content/agent-queries";

const MIN_WORDS = 40;
const MAX_WORDS = 60;
const MIN_COVERAGE = 1.0; // 100%: every entry must carry a definition

interface Failure {
  slug: string;
  reason: string;
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function main(): void {
  const failures: Failure[] = [];
  let withDefinition = 0;

  for (const q of agentQueries) {
    if (!q.definition || q.definition.trim().length === 0) {
      failures.push({
        slug: q.slug,
        reason: "missing `definition` (40-60 word direct answer)",
      });
      continue;
    }
    withDefinition++;

    const words = countWords(q.definition);
    if (words < MIN_WORDS || words > MAX_WORDS) {
      failures.push({
        slug: q.slug,
        reason: `definition is ${words} words, outside the [${MIN_WORDS}, ${MAX_WORDS}] snippet window`,
      });
    }

    if (q.definition.trim() === q.description.trim()) {
      failures.push({
        slug: q.slug,
        reason: "definition is identical to meta description (redundant extraction)",
      });
    }
  }

  const coverage = agentQueries.length > 0 ? withDefinition / agentQueries.length : 0;
  if (coverage < MIN_COVERAGE) {
    failures.push({
      slug: "(aggregate)",
      reason: `definition coverage ${(coverage * 100).toFixed(1)}% < ${(MIN_COVERAGE * 100).toFixed(0)}% floor`,
    });
  }

  if (failures.length > 0) {
    console.error(
      `\n✗ verify-direct-answers: ${failures.length} problem(s) across ${agentQueries.length} entries\n`
    );
    for (const f of failures) {
      console.error(`  - ${f.slug}: ${f.reason}`);
    }
    console.error(
      "\nEvery /answers/ entry must carry a 40-60 word `definition` distinct from\n" +
        "its meta description. See scripts/verify-direct-answers.ts header for the\n" +
        "contract and content/agent-queries.ts entries for examples.\n"
    );
    process.exit(1);
  }

  console.log(
    `✓ verify-direct-answers: ${withDefinition}/${agentQueries.length} entries ` +
      `carry a ${MIN_WORDS}-${MAX_WORDS}-word direct answer (coverage 100%).`
  );
}

main();
