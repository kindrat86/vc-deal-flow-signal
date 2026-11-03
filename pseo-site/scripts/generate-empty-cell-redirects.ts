/**
 * Regenerates data/empty-cell-redirects.json from data/startups.json (prebuild).
 *
 * WHY (2026-11-03): pSEO cross pages (/stage/<stage>/<sector>,
 * /signals/<signal>/<sector>) only generate while the CURRENT period has
 * >= MIN_PSEO_CELL_SIZE matching startups, and /trends/<sector>-<a>-vs-<b>
 * only for adjacent periods still in the data. After a weekly refresh a cell
 * can drop below the floor (e.g. /stage/pre-seed/healthcare: 2 pre-seed
 * startups) and the URL 404s while it still holds GSC history. Every such URL
 * now 301s to its nearest live parent instead: stage hub, signal hub, or the
 * sector's oldest live trend comparison. Derived from data, so a cell that
 * refills drops out of the list and renders again; nothing to hand-maintain.
 *
 * Idempotent: writes only when the derived set changed.
 * Usage: npx tsx scripts/generate-empty-cell-redirects.ts
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  getAllStageSlugs,
  getAllStageSectorPairs,
  SIGNAL_TYPES,
  getAllSignalSectorPairs,
  getAllTrendSlugs,
  getAllPeriods,
  getAllSectors,
} from "../lib/data";

const OUT = join(process.cwd(), "data", "empty-cell-redirects.json");
type R = { source: string; destination: string };

function prevQuarter(slug: string): string | null {
  const m = slug.match(/^q(\d)-(\d{4})$/);
  if (!m) return null;
  const q = Number(m[1]);
  const y = Number(m[2]);
  return q === 1 ? `q4-${y - 1}` : `q${q - 1}-${y}`;
}

function main(): void {
  const sectors = getAllSectors().map((s) => s.slug);
  const out: R[] = [];

  const live = new Set(getAllStageSectorPairs().map((p) => `${p.stage}/${p.sector}`));
  for (const stage of getAllStageSlugs())
    for (const sector of sectors)
      if (!live.has(`${stage}/${sector}`))
        out.push({ source: `/stage/${stage}/${sector}`, destination: `/stage/${stage}` });

  const liveSig = new Set(getAllSignalSectorPairs().map((p) => `${p.signal}/${p.sector}`));
  for (const sig of SIGNAL_TYPES)
    for (const sector of sectors)
      if (!liveSig.has(`${sig.slug}/${sector}`))
        out.push({ source: `/signals/${sig.slug}/${sector}`, destination: `/signals/${sig.slug}` });

  // Trend comparisons: every adjacent-quarter pair from one quarter before the
  // oldest period up to the newest that no longer generates -> the sector's
  // oldest live comparison (closest in time to the dropped one).
  const liveTrends = new Set(getAllTrendSlugs());
  const periods = getAllPeriods().map((p) => p.slug); // newest first
  const pairs: [string, string][] = [];
  for (let i = 0; i < periods.length - 1; i++) pairs.push([periods[i], periods[i + 1]]);
  const oldest = periods[periods.length - 1];
  const beforeOldest = oldest ? prevQuarter(oldest) : null;
  if (oldest && beforeOldest) pairs.push([oldest, beforeOldest]);
  for (const sector of sectors) {
    const liveForSector = [...liveTrends].filter((s) =>
      new RegExp(`^${sector}-q\\d-\\d{4}-vs-q\\d-\\d{4}$`).test(s),
    );
    if (!liveForSector.length) continue;
    const target = liveForSector[liveForSector.length - 1];
    for (const [a, b] of pairs) {
      const slug = `${sector}-${a}-vs-${b}`;
      if (!liveTrends.has(slug)) out.push({ source: `/trends/${slug}`, destination: `/trends/${target}` });
    }
  }

  // Weekly Signal Report: only the latest dated post exists, so last week's
  // slug 404s after each refresh. Any other dated slug -> the latest one.
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { signalReport } = require("../content/signal-report-latest");
    const latest: string | undefined = signalReport?.slug;
    const m = latest?.match(/^weekly-signal-report-(\d{4}-\d{2}-\d{2})$/);
    if (latest && m)
      out.push({
        source: `/blog/weekly-signal-report-:date((?!${m[1]}$)\\d{4}-\\d{2}-\\d{2})`,
        destination: `/blog/${latest}`,
      });
  } catch {
    /* no report generated yet */
  }

  if (existsSync(OUT)) {
    const prev = JSON.parse(readFileSync(OUT, "utf8")) as { redirects?: R[] };
    if (JSON.stringify(prev.redirects ?? null) === JSON.stringify(out)) {
      console.log(`[empty-cell-redirects] unchanged: ${out.length} entries`);
      return;
    }
  }
  writeFileSync(OUT, JSON.stringify({ redirects: out }, null, 2) + "\n");
  console.log(`[empty-cell-redirects] wrote ${out.length} entries`);
}

main();
