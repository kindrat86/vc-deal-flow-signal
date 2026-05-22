/**
 * F24 — pSEO uniqueness audit
 *
 * Computes within-surface 64-bit SimHash fingerprints over our programmatic
 * pSEO content and pairwise-compares them. Fails the build if more than
 * `PSEO_AUDIT_GLOBAL_THRESHOLD`% of total programmatic entries are part of
 * a near-duplicate pair (Hamming distance ≤ `PSEO_AUDIT_HAMMING_DISTANCE`
 * bits, which translates to roughly ≥86% body similarity at the 9-bit
 * default).
 *
 * Designed to run as part of `npm run build` postbuild on Vercel (gates the
 * deploy) and as a GitHub Actions workflow on PRs touching pSEO content
 * (gates the merge).
 *
 * Env knobs:
 *   PSEO_AUDIT_REPORT_ONLY=true     → log only, never exit non-zero
 *   PSEO_AUDIT_GLOBAL_THRESHOLD=5   → % of total entries that must be flagged
 *                                     before the script fails
 *   PSEO_AUDIT_HAMMING_DISTANCE=9   → bit-distance threshold; lower = stricter
 *
 * Output:
 *   - stdout: per-surface summary + first 3 near-dup pairs per surface
 *   - data/audit/pseo-uniqueness-report.json: full machine-readable report
 *
 * Usage:
 *   npx tsx scripts/audit-pseo-uniqueness.ts
 */

import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { comparisons } from "../content/comparisons";
import { alternatives } from "../content/alternatives";
import { starsCases } from "../content/from-stars-to-seed";
import { useCases } from "../content/use-cases";
import { competitorVsPairs } from "../content/competitor-vs";
import { nicheSectors } from "../content/niches";

// ---------- config ----------

const HAMMING_THRESHOLD = Number(process.env.PSEO_AUDIT_HAMMING_DISTANCE ?? 9);
const GLOBAL_THRESHOLD_PCT = Number(process.env.PSEO_AUDIT_GLOBAL_THRESHOLD ?? 5);
const REPORT_ONLY = process.env.PSEO_AUDIT_REPORT_ONLY === "true";

// ---------- types ----------

interface SurfaceEntry {
  slug: string;
  body: string;
}

interface Surface {
  name: string;
  basePath: string;
  entries: SurfaceEntry[];
}

interface DupPair {
  a: string;
  b: string;
  hamming: number;
  similarity: number;
}

interface SurfaceReport {
  name: string;
  basePath: string;
  totalEntries: number;
  flaggedEntries: number;
  flaggedPct: number;
  shingleCounts: { min: number; max: number; mean: number };
  pairs: DupPair[];
}

// ---------- helpers ----------

/**
 * Recursively walk an arbitrary JSON-like value and concatenate every
 * string leaf into a single body. Means we don't have to hand-code the
 * shape of every surface's entry — adding a new surface is just an import
 * + an entry in the SURFACES array below.
 */
function flatten(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map(flatten).join(" ");
  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).map(flatten).join(" ");
  }
  return "";
}

function buildEntry(slug: string, raw: unknown): SurfaceEntry {
  return { slug, body: flatten(raw) };
}

/**
 * Tokenize → 3-gram shingles. Falls back to 2-grams and finally to single
 * tokens for very short bodies, so we don't blow up on stub entries.
 */
function shingles(text: string): string[] {
  const tokens = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 3);

  const ngram = (n: number): string[] => {
    const out: string[] = [];
    for (let i = 0; i <= tokens.length - n; i++) {
      out.push(tokens.slice(i, i + n).join(" "));
    }
    return out;
  };

  let grams = ngram(3);
  if (grams.length < 16) grams = ngram(2);
  if (grams.length < 8) grams = tokens;
  return grams;
}

/** SHA-1 truncated to a 64-bit unsigned int. Stable, no extra deps. */
function hash64(s: string): bigint {
  const h = createHash("sha1").update(s).digest();
  return h.readBigUInt64BE(0);
}

/** Standard 64-bit SimHash. */
function simhash64(tokens: string[]): bigint {
  if (tokens.length === 0) return 0n;
  const counts = new Array<number>(64).fill(0);
  for (const tok of tokens) {
    const h = hash64(tok);
    for (let b = 0; b < 64; b++) {
      const bit = (h >> BigInt(b)) & 1n;
      counts[b] += bit === 1n ? 1 : -1;
    }
  }
  let result = 0n;
  for (let b = 0; b < 64; b++) {
    if (counts[b] > 0) result |= 1n << BigInt(b);
  }
  return result;
}

function hamming(a: bigint, b: bigint): number {
  let x = a ^ b;
  let d = 0;
  while (x !== 0n) {
    d += Number(x & 1n);
    x >>= 1n;
  }
  return d;
}

function similarityFromHamming(d: number): number {
  return ((64 - d) / 64) * 100;
}

// ---------- surfaces ----------
//
// To audit a new programmatic surface, import its data array above and add an
// entry here. Each entry is {slug, raw-object}; flatten() will recursively
// concat all string fields, so any new surface works out of the box.

const SURFACES: Surface[] = [
  {
    name: "compare",
    basePath: "/compare",
    entries: comparisons.map((c) => buildEntry(c.slug, c)),
  },
  {
    name: "alternatives",
    basePath: "/alternatives",
    entries: alternatives.map((a) => buildEntry(a.slug, a)),
  },
  {
    name: "use-cases",
    basePath: "/use-cases",
    entries: useCases.map((u) => buildEntry(u.slug, u)),
  },
  {
    name: "vs",
    basePath: "/vs",
    entries: competitorVsPairs.map((v) => buildEntry(v.slug, v)),
  },
  {
    // Niche-down — Greg-style "riches in the niches" cluster (2026-05-22).
    // Flattens each leaf-niche to its full body for SimHash. Slug shape
    // "<sector>/<sub-niche>" so the basePath is /niche-down and the leaf
    // URL is /niche-down/<sector>/<sub-niche>.
    name: "niche-down",
    basePath: "/niche-down",
    entries: nicheSectors.flatMap((s) =>
      s.niches.map((n) => buildEntry(`${s.slug}/${n.slug}`, n)),
    ),
  },
  {
    name: "from-stars-to-seed",
    basePath: "/from-stars-to-seed",
    entries: starsCases.map((c) => buildEntry(c.slug, c)),
  },
];

// ---------- audit ----------

function auditSurface(s: Surface): SurfaceReport {
  const shingleSizes: number[] = [];
  const fingerprints = s.entries.map((e) => {
    const grams = shingles(e.body);
    shingleSizes.push(grams.length);
    return { slug: e.slug, hash: simhash64(grams) };
  });

  const pairs: DupPair[] = [];
  const flagged = new Set<string>();
  for (let i = 0; i < fingerprints.length; i++) {
    for (let j = i + 1; j < fingerprints.length; j++) {
      const d = hamming(fingerprints[i].hash, fingerprints[j].hash);
      if (d <= HAMMING_THRESHOLD) {
        pairs.push({
          a: fingerprints[i].slug,
          b: fingerprints[j].slug,
          hamming: d,
          similarity: Number(similarityFromHamming(d).toFixed(1)),
        });
        flagged.add(fingerprints[i].slug);
        flagged.add(fingerprints[j].slug);
      }
    }
  }

  const totalEntries = s.entries.length;
  const flaggedEntries = flagged.size;
  const flaggedPct = totalEntries > 0 ? Number(((flaggedEntries / totalEntries) * 100).toFixed(1)) : 0;
  const min = shingleSizes.length ? Math.min(...shingleSizes) : 0;
  const max = shingleSizes.length ? Math.max(...shingleSizes) : 0;
  const mean = shingleSizes.length
    ? Math.round(shingleSizes.reduce((a, b) => a + b, 0) / shingleSizes.length)
    : 0;

  return {
    name: s.name,
    basePath: s.basePath,
    totalEntries,
    flaggedEntries,
    flaggedPct,
    shingleCounts: { min, max, mean },
    pairs: pairs.sort((a, b) => a.hamming - b.hamming).slice(0, 20),
  };
}

function main(): void {
  console.log("\nF24 — pSEO uniqueness audit");
  console.log("================================");
  const minSimPct = (((64 - HAMMING_THRESHOLD) / 64) * 100).toFixed(1);
  console.log(`Hamming threshold:    ${HAMMING_THRESHOLD} bits  (≥${minSimPct}% body similarity)`);
  console.log(`Global fail threshold: ${GLOBAL_THRESHOLD_PCT}% of total programmatic entries`);
  console.log(`Report-only:           ${REPORT_ONLY}`);
  console.log("");

  const reports: SurfaceReport[] = [];
  let totalEntries = 0;
  let totalFlagged = 0;

  for (const s of SURFACES) {
    const r = auditSurface(s);
    reports.push(r);
    totalEntries += r.totalEntries;
    totalFlagged += r.flaggedEntries;
    console.log(
      `[${r.name.padEnd(13)}] ${String(r.totalEntries).padStart(4)} entries · ${String(r.flaggedEntries).padStart(3)} flagged (${String(r.flaggedPct).padStart(4)}%) · ${r.pairs.length} near-dup pair(s) · shingles min/mean/max ${r.shingleCounts.min}/${r.shingleCounts.mean}/${r.shingleCounts.max}`,
    );
    for (const p of r.pairs.slice(0, 3)) {
      console.log(`    ↪ ${p.a}  ≈  ${p.b}   (sim ${p.similarity}%, hamming ${p.hamming})`);
    }
  }

  const globalPct = totalEntries > 0 ? (totalFlagged / totalEntries) * 100 : 0;
  const verdict = globalPct > GLOBAL_THRESHOLD_PCT ? "FAIL" : "PASS";

  console.log("");
  console.log(`Total programmatic entries: ${totalEntries}`);
  console.log(`Total flagged:              ${totalFlagged}  (${globalPct.toFixed(1)}%)`);
  console.log(`Verdict:                    ${verdict}`);

  // Write machine-readable report. Path is relative to this script.
  const here = dirname(fileURLToPath(import.meta.url));
  const reportPath = resolve(here, "..", "data", "audit", "pseo-uniqueness-report.json");
  mkdirSync(dirname(reportPath), { recursive: true });
  writeFileSync(
    reportPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        config: {
          hammingThreshold: HAMMING_THRESHOLD,
          globalThresholdPct: GLOBAL_THRESHOLD_PCT,
          reportOnly: REPORT_ONLY,
        },
        totals: {
          entries: totalEntries,
          flagged: totalFlagged,
          flaggedPct: Number(globalPct.toFixed(2)),
        },
        verdict,
        surfaces: reports,
      },
      null,
      2,
    ) + "\n",
  );
  console.log(`Report written to ${reportPath}`);

  if (verdict === "FAIL") {
    if (REPORT_ONLY) {
      console.log(
        `\n[REPORT_ONLY] Would have failed (${globalPct.toFixed(1)}% > ${GLOBAL_THRESHOLD_PCT}%). Exiting 0 because PSEO_AUDIT_REPORT_ONLY=true.`,
      );
      return;
    }
    console.error(`\n❌ Failing: ${globalPct.toFixed(1)}% of programmatic entries near-duplicate (threshold ${GLOBAL_THRESHOLD_PCT}%).`);
    console.error("Long-term fix: rewrite flagged pages with unique editorial (fix F17).");
    console.error("Temporary bypass: set PSEO_AUDIT_REPORT_ONLY=true (Vercel env or shell).");
    process.exit(1);
  }
  console.log("\n✅ pSEO uniqueness PASS");
}

main();
