/**
 * pSEO coverage audit
 *
 * Counts cell sizes for every Cartesian pSEO route family and reports:
 *   - included pairs (≥ MIN_PSEO_CELL_SIZE startups)
 *   - suppressed pairs (< MIN_PSEO_CELL_SIZE startups, hidden from
 *     generateStaticParams to avoid thin-content penalties)
 *   - locale × topic coverage gaps
 *
 * Output:
 *   data/audit/pseo-coverage-report.json — machine-readable report
 *   stdout — human-readable summary
 *
 * Why this exists: the audit at 2026-05-08 flagged that Cartesian
 * routes (stage × sector, signal × sector, stage × signal) risk
 * thin-content downranking when a cell holds only 1–2 startups.
 * `MIN_PSEO_CELL_SIZE` (default 3) suppresses those at the data
 * layer; this script verifies the threshold is actually doing work
 * and surfaces the diagnostic in CI logs.
 *
 * Usage:
 *   npx tsx scripts/audit-pseo-coverage.ts
 *   PSEO_MIN_CELL_SIZE=5 npx tsx scripts/audit-pseo-coverage.ts
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import data from "../data/startups.json" with { type: "json" };
import { LOCALE_TOPICS } from "../content/locale-topics";

// Note: lib/data.ts uses `server-only` so we can't import it from a tsx
// script. We mirror the canonical SIGNAL_TYPES + STAGE_DEFINITIONS slug
// lists inline below. The audit recomputes counts directly from
// data/startups.json — that is the same input the route generators use,
// so any drift between this audit's totals and `generateStaticParams`
// indicates a bug in the threshold logic, not an audit/code mismatch.

const MIN_PSEO_CELL_SIZE = Number(process.env.PSEO_MIN_CELL_SIZE ?? 3);

// Mirrors SIGNAL_TYPES in lib/data.ts. Keep in sync.
const SIGNAL_TYPES: { slug: string; match: string }[] = [
  { slug: "hiring-burst", match: "Engineering hiring burst" },
  { slug: "infrastructure-buildout", match: "Infrastructure buildout" },
  { slug: "deploy-frequency-spike", match: "Deploy frequency spike" },
  { slug: "framework-migration", match: "Framework migration" },
];

// ---------- types ----------

type Period = { slug: string; name: string; current?: boolean };
type Sector = {
  slug: string;
  name: string;
  periods: Record<
    string,
    { startups: { name: string; stage: string; signalType: string }[] }
  >;
};

interface CellRecord {
  cellKey: string;
  cellSize: number;
  status: "included" | "suppressed";
  reason?: string;
}

interface SurfaceReport {
  surface: string;
  total: number;
  included: number;
  suppressed: number;
  cells: CellRecord[];
}

interface FullReport {
  generatedAt: string;
  minCellSize: number;
  surfaces: SurfaceReport[];
  localeTopicCoverage: {
    totalEntries: number;
    universalCore: string[];
    perLocale: Record<string, { complete: boolean; missing: string[] }>;
  };
  summary: {
    totalCells: number;
    totalIncluded: number;
    totalSuppressed: number;
    suppressionRatePct: number;
    minCellSizeEnforced: number;
  };
}

// ---------- inline stage list ----------
// Mirrors STAGE_DEFINITIONS in lib/data.ts (kept in sync manually — if the
// canonical list ever changes, update both. The CI audit below will surface
// any drift via the cell counts.)
const STAGE_SLUGS: { slug: string; match: readonly string[] }[] = [
  { slug: "pre-seed", match: ["Pre-Seed", "Pre-seed", "PreSeed"] },
  { slug: "seed", match: ["Seed"] },
  { slug: "series-a-b", match: ["Series A", "Series A/B", "Series B", "A/B"] },
  { slug: "growth", match: ["Growth", "Late Stage", "Series C+", "Series C"] },
];

// ---------- helpers ----------

const dataset = data as { sectors: Sector[]; periods: Period[] };
const currentPeriod =
  dataset.periods.find((p) => p.current) ?? dataset.periods[0];

function stageMatches(stage: string, defMatch: readonly string[]): boolean {
  return defMatch.some((m) => stage === m || stage.includes(m));
}

// ---------- audits ----------

function auditStageSector(): SurfaceReport {
  const cells: CellRecord[] = [];
  for (const stageDef of STAGE_SLUGS) {
    for (const sector of dataset.sectors) {
      const snapshot = sector.periods[currentPeriod.slug];
      if (!snapshot) continue;
      const count = snapshot.startups.filter((s) =>
        stageMatches(s.stage, stageDef.match),
      ).length;
      if (count === 0) continue;
      const status = count >= MIN_PSEO_CELL_SIZE ? "included" : "suppressed";
      cells.push({
        cellKey: `${stageDef.slug}/${sector.slug}`,
        cellSize: count,
        status,
        reason: status === "suppressed" ? "below MIN_PSEO_CELL_SIZE" : undefined,
      });
    }
  }
  return summarise("/stage/[stage]/[sector]", cells);
}

// Mirrors GEO_DEFINITIONS in lib/data.ts (kept in sync manually, same rule as
// STAGE_SLUGS above). Rows whose geography is "Unknown" match no entry here
// and are therefore excluded from every cell — that exclusion is deliberate,
// not an oversight: region is never inferred.
const GEO_SLUGS: { slug: string; match: string }[] = [
  { slug: "us", match: "US" },
  { slug: "uk", match: "UK" },
  { slug: "europe", match: "EU" },
  { slug: "apac", match: "APAC" },
  { slug: "canada", match: "Canada" },
  { slug: "latam", match: "LATAM" },
  { slug: "mena", match: "MENA" },
];

function auditStageGeo(): SurfaceReport {
  const cells: CellRecord[] = [];
  for (const stageDef of STAGE_SLUGS) {
    for (const geoDef of GEO_SLUGS) {
      let count = 0;
      for (const sector of dataset.sectors) {
        const snapshot = sector.periods[currentPeriod.slug];
        if (!snapshot) continue;
        count += snapshot.startups.filter(
          (s) =>
            s.geography === geoDef.match &&
            stageMatches(s.stage, stageDef.match),
        ).length;
      }
      if (count === 0) continue;
      const status = count >= MIN_PSEO_CELL_SIZE ? "included" : "suppressed";
      cells.push({
        cellKey: `${stageDef.slug}/${geoDef.slug}`,
        cellSize: count,
        status,
        reason: status === "suppressed" ? "below MIN_PSEO_CELL_SIZE" : undefined,
      });
    }
  }
  return summarise("/stage/[stage]/in/[geo]", cells);
}

function auditSignalSector(): SurfaceReport {
  const cells: CellRecord[] = [];
  for (const signalDef of SIGNAL_TYPES) {
    for (const sector of dataset.sectors) {
      const snapshot = sector.periods[currentPeriod.slug];
      if (!snapshot) continue;
      const count = snapshot.startups.filter(
        (s) => s.signalType === signalDef.match,
      ).length;
      if (count === 0) continue;
      const status = count >= MIN_PSEO_CELL_SIZE ? "included" : "suppressed";
      cells.push({
        cellKey: `${signalDef.slug}/${sector.slug}`,
        cellSize: count,
        status,
        reason: status === "suppressed" ? "below MIN_PSEO_CELL_SIZE" : undefined,
      });
    }
  }
  return summarise("/signals/[signal]/[sector]", cells);
}

function auditStageSignal(): SurfaceReport {
  const cells: CellRecord[] = [];
  for (const stageDef of STAGE_SLUGS) {
    for (const signalDef of SIGNAL_TYPES) {
      let count = 0;
      for (const sector of dataset.sectors) {
        const snapshot = sector.periods[currentPeriod.slug];
        if (!snapshot) continue;
        count += snapshot.startups.filter(
          (s) =>
            s.signalType === signalDef.match &&
            stageMatches(s.stage, stageDef.match),
        ).length;
      }
      if (count === 0) continue;
      const status = count >= MIN_PSEO_CELL_SIZE ? "included" : "suppressed";
      cells.push({
        cellKey: `${stageDef.slug}/signal/${signalDef.slug}`,
        cellSize: count,
        status,
        reason: status === "suppressed" ? "below MIN_PSEO_CELL_SIZE" : undefined,
      });
    }
  }
  return summarise("/stage/[stage]/signal/[signal]", cells);
}

// Mirrors getNewThisPeriodData()/getAllNewThisPeriodSlugs() in lib/data.ts
// (2026-07-24). `dataset.periods` is authored newest-first, so index 0 is
// current and index 1 is the immediately preceding period — same
// convention as the canonical getter. Kept in sync manually.
function auditNewThisPeriod(): SurfaceReport {
  const cells: CellRecord[] = [];
  const previousPeriod = dataset.periods[1];
  if (!previousPeriod) return summarise("/startups-to-watch/new/[sector]", cells);

  for (const sector of dataset.sectors) {
    const currentSnap = sector.periods[currentPeriod.slug];
    const previousSnap = sector.periods[previousPeriod.slug];
    if (!currentSnap || !previousSnap) continue;
    const previousNames = new Set(previousSnap.startups.map((s) => s.name));
    const count = currentSnap.startups.filter(
      (s) => !previousNames.has(s.name),
    ).length;
    if (count === 0) continue;
    const status = count >= MIN_PSEO_CELL_SIZE ? "included" : "suppressed";
    cells.push({
      cellKey: sector.slug,
      cellSize: count,
      status,
      reason: status === "suppressed" ? "below MIN_PSEO_CELL_SIZE" : undefined,
    });
  }
  return summarise("/startups-to-watch/new/[sector]", cells);
}

function auditLocaleTopics(): FullReport["localeTopicCoverage"] {
  const universalCore = ["methodology", "glossary", "faq", "signals", "about"];
  const allLocales = [
    "zh",
    "ja",
    "de",
    "es",
    "fr",
    "pt",
    "ko",
    "hi",
    "ru",
    "it",
    "nl",
    "ar",
  ] as const;

  const perLocale: Record<string, { complete: boolean; missing: string[] }> =
    {};
  for (const loc of allLocales) {
    const owned = new Set(
      LOCALE_TOPICS.filter((t) => t.locale === loc).map((t) => t.topic),
    );
    const missing = universalCore.filter((t) => !owned.has(t as never));
    perLocale[loc] = { complete: missing.length === 0, missing };
  }

  return {
    totalEntries: LOCALE_TOPICS.length,
    universalCore,
    perLocale,
  };
}

function summarise(name: string, cells: CellRecord[]): SurfaceReport {
  cells.sort((a, b) => a.cellSize - b.cellSize);
  const included = cells.filter((c) => c.status === "included").length;
  const suppressed = cells.length - included;
  return {
    surface: name,
    total: cells.length,
    included,
    suppressed,
    cells,
  };
}

// ---------- main ----------

function main() {
  const surfaces = [
    auditStageSector(),
    auditStageGeo(),
    auditSignalSector(),
    auditStageSignal(),
    auditNewThisPeriod(),
  ];
  const localeTopicCoverage = auditLocaleTopics();

  const totalCells = surfaces.reduce((s, r) => s + r.total, 0);
  const totalIncluded = surfaces.reduce((s, r) => s + r.included, 0);
  const totalSuppressed = surfaces.reduce((s, r) => s + r.suppressed, 0);

  const report: FullReport = {
    generatedAt: new Date().toISOString(),
    minCellSize: MIN_PSEO_CELL_SIZE,
    surfaces,
    localeTopicCoverage,
    summary: {
      totalCells,
      totalIncluded,
      totalSuppressed,
      suppressionRatePct:
        totalCells === 0
          ? 0
          : Math.round((totalSuppressed / totalCells) * 1000) / 10,
      minCellSizeEnforced: MIN_PSEO_CELL_SIZE,
    },
  };

  const here = dirname(fileURLToPath(import.meta.url));
  const outDir = resolve(here, "..", "data", "audit");
  mkdirSync(outDir, { recursive: true });
  const outPath = resolve(outDir, "pseo-coverage-report.json");
  writeFileSync(outPath, JSON.stringify(report, null, 2) + "\n");

  // ---------- stdout ----------
  console.log(`pSEO coverage audit @ ${report.generatedAt}`);
  console.log(`  MIN_PSEO_CELL_SIZE = ${MIN_PSEO_CELL_SIZE}`);
  console.log("");
  for (const s of surfaces) {
    const ratio = s.total === 0 ? 0 : ((s.included / s.total) * 100).toFixed(1);
    console.log(
      `  ${s.surface.padEnd(36)} ${String(s.included).padStart(3)}/${String(
        s.total,
      ).padStart(3)} included (${ratio}%) — ${s.suppressed} suppressed`,
    );
    if (s.suppressed > 0) {
      const examples = s.cells
        .filter((c) => c.status === "suppressed")
        .slice(0, 3)
        .map((c) => `${c.cellKey}=${c.cellSize}`)
        .join(", ");
      console.log(`     suppressed sample: ${examples}`);
    }
  }
  console.log("");
  const ltc = report.localeTopicCoverage;
  console.log(
    `  locale topics: ${ltc.totalEntries} entries (universal core: ${ltc.universalCore.join(", ")})`,
  );
  for (const [loc, info] of Object.entries(ltc.perLocale)) {
    if (!info.complete) {
      console.log(`     ${loc}: missing ${info.missing.join(", ")}`);
    }
  }
  console.log("");
  console.log(
    `  TOTAL: ${totalIncluded}/${totalCells} included (${report.summary.suppressionRatePct}% suppressed)`,
  );
  console.log(`  report: ${outPath}`);
}

main();
