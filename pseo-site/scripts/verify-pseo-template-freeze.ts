#!/usr/bin/env npx tsx
/**
 * pSEO template-freeze guard (2026-08-16).
 *
 * WHY THIS EXISTS
 * ---------------
 * Discovery audit 2026-08-16, pSEO row (70/100): the site runs ~15 headline
 * templates (about 2,850 URLs) over an entity-aware data pipeline. The
 * highest-impact fix was "freeze net-new template launches until the harvest
 * rate justifies them". The fleet already bled index quality: 47% of sitemap
 * URLs earned zero impressions over 28 days, and every new template family
 * is a new generator of thin pages that split crawl budget and dilute the
 * entity graph before any existing template has proven it converts
 * impressions into qualified clicks.
 *
 * The failure mode this guards against is SILENT PROLIFERATION: an agent or
 * a parallel session adds `app/<family>/[slug]/page.tsx` + a content source +
 * a sitemap block, ships it, and nothing in the build notices the new URL
 * generator until the indexability ratio and CTR have already decayed.
 *
 * WHAT IT CHECKS
 * --------------
 * A "template family" is the first path segment under `app/` that contains a
 * dynamic `[segment]` directory (e.g. `app/vs/[slug]` -> family `vs`,
 * `app/sector/[slug]/in/[city]` -> family `sector`). The guard walks `app/`,
 * computes the live set of family roots, and diffs it against the frozen set
 * below in BOTH directions:
 *   1. live minus frozen  = a net-new template family was launched  -> FAIL
 *   2. frozen minus live  = a frozen family lost its dynamic route   -> FAIL
 *
 * Excluded roots are infrastructure, not indexable content templates:
 *   api/ (JSON route handlers), [locale]/ (i18n catch-all wrapper),
 *   sitemap/ (sitemap shard resolver).
 *
 * LIFT CRITERIA (all must hold, OR explicit user sign-off):
 *   - site-wide GSC CTR (28d) >= 0.5%  (audit baseline was 0.17%)
 *   - indexability ratio (pages-with-impressions / sitemap URLs, 28d) >= 70%
 *     (audit baseline was 52.8%, post-prune ~63%)
 *   To lift: prove the criteria, then add the new family to FROZEN_FAMILIES
 *   in the SAME commit as the route + content + sitemap block.
 *
 * Where it runs: prebuild (fail-closed before any artifact is built), so a
 * tree that launches a net-new template cannot deploy through any path
 * (scheduled, agent, manual). Standalone: npx tsx scripts/verify-pseo-template-freeze.ts
 * Print the current live set (for lift-time regeneration): add `--print`.
 */
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/** Infrastructure roots, not indexable content templates. */
const EXCLUDED_ROOTS = new Set(["api", "[locale]", "sitemap"]);

/**
 * Frozen template families, auto-discovered from app/ on 2026-08-16.
 * 60 roots. Every indexable programmatic route family the site runs today.
 * Do not add to this list without the lift criteria above.
 */
const FROZEN_FAMILIES: ReadonlySet<string> = new Set([
  "a2a",
  "acquirer",
  "alternatives",
  "answers",
  "authors",
  "benchmarks",
  "best",
  "blog",
  "book",
  "build-vs-invest",
  "case-study",
  "challenge",
  "city",
  "community-signal",
  "compare",
  "continuity",
  "embed",
  "for",
  "founder",
  "from-stars-to-seed",
  "fund",
  "instagram",
  "integrations",
  "jsonld",
  "launch",
  "llms",
  "md",
  "members",
  "momentum",
  "niche-down",
  "parables",
  "playbooks",
  "predicted",
  "press",
  "r",
  "receipts",
  "research",
  "research-paper",
  "s",
  "sector",
  "share",
  "signal",
  "signals",
  "solo-founder-tracker",
  "stage",
  "startup",
  "startup-ideas",
  "startups",
  "startups-to-watch",
  "summit",
  "topics",
  "trend",
  "trends",
  "use-cases",
  "voices",
  "vs",
  "watch",
  "weekly",
  "works-with",
  "year-in-review",
]);

/** A directory basename is a dynamic segment iff it is fully bracketed. */
const DYNAMIC_RE = /^\[.*\]$/;

function liveFamilyRoots(appDir: string): Set<string> {
  const fams = new Set<string>();
  const walk = (dir: string, rel: string): void => {
    let entries: string[];
    try {
      entries = readdirSync(dir);
    } catch {
      return;
    }
    for (const name of entries) {
      const abs = join(dir, name);
      let isDir = false;
      try {
        isDir = statSync(abs).isDirectory();
      } catch {
        continue;
      }
      if (!isDir) continue;
      const relChild = rel ? `${rel}/${name}` : name;
      if (DYNAMIC_RE.test(name)) {
        const root = relChild.split("/")[0];
        if (!EXCLUDED_ROOTS.has(root)) fams.add(root);
      }
      walk(abs, relChild);
    }
  };
  walk(appDir, "");
  return fams;
}

function main(): void {
  const ROOT = process.cwd();
  const appDir = join(ROOT, "app");

  const live = liveFamilyRoots(appDir);

  if (process.argv.includes("--print")) {
    console.log([...live].sort().join("\n"));
    return;
  }

  const failures: string[] = [];

  for (const fam of [...live].sort()) {
    if (!FROZEN_FAMILIES.has(fam)) {
      failures.push(
        `net-new template family "/${fam}/[..]" was launched\n` +
          `    reason: pSEO template freeze is in effect (2026-08-16). The fleet is\n` +
          `    frozen until the harvest rate justifies expansion (see header: CTR >= 0.5%\n` +
          `    AND indexability >= 70%, or explicit user sign-off).\n` +
          `    fix: revert the new route, OR prove the criteria then add "${fam}" to\n` +
          `    FROZEN_FAMILIES in scripts/verify-pseo-template-freeze.ts in the same commit`,
      );
    }
  }

  for (const fam of [...FROZEN_FAMILIES].sort()) {
    if (!live.has(fam)) {
      failures.push(
        `frozen template family "${fam}" lost its dynamic route\n` +
          `    reason: a retired template must also update the freeze manifest, otherwise\n` +
          `    the guard drifts from the real route tree and future launches slip past it.\n` +
          `    fix: remove "${fam}" from FROZEN_FAMILIES in scripts/verify-pseo-template-freeze.ts\n` +
          `    in the same commit that retires the route (plus its 301 + sitemap cleanup)`,
      );
    }
  }

  if (failures.length > 0) {
    console.error(
      `\n✗ verify-pseo-template-freeze: ${failures.length} template-family drift(s) detected.\n` +
        `  This tree launches a net-new pSEO template (or retired one without updating\n` +
        `  the freeze). Deploying it would re-open the index-bloat channel this guard\n` +
        `  closes. See scripts/verify-pseo-template-freeze.ts header for lift criteria.\n`,
    );
    for (const f of failures) console.error(`  ✖ ${f}\n`);
    process.exit(1);
  }

  console.log(
    `✓ verify-pseo-template-freeze: ${live.size}/${FROZEN_FAMILIES.size} template families frozen (no net-new launches)`,
  );
}

main();
