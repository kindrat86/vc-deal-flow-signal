/**
 * Regenerates data/best-redirects.json from data/startups.json (prebuild).
 *
 * Idempotent: writes only when the derived redirect set or the current period
 * changed, so repeated builds never dirty the working tree. The prebuild chain
 * runs this BEFORE verify-no-regressions, which re-derives the same set and
 * fails any tree whose committed JSON drifted (or that hardcodes /best/
 * redirects in next.config.ts).
 *
 * Usage: npx tsx scripts/generate-best-redirects.ts
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  deriveBestRedirects,
  loadStartupsData,
  type BestRedirect,
} from "./best-redirect-lib";

const OUT = join(process.cwd(), "data", "best-redirects.json");

function main(): void {
  const data = loadStartupsData();
  const redirects = deriveBestRedirects(data);
  const currentPeriod =
    data.periods.find((p) => p.current)?.slug ?? "";

  if (existsSync(OUT)) {
    const prev = JSON.parse(readFileSync(OUT, "utf8")) as {
      currentPeriod?: string;
      redirects?: BestRedirect[];
    };
    const unchanged =
      prev.currentPeriod === currentPeriod &&
      JSON.stringify(prev.redirects ?? null) === JSON.stringify(redirects);
    if (unchanged) {
      console.log(
        `[best-redirects] unchanged: ${redirects.length} entries (${currentPeriod})`,
      );
      return;
    }
  }

  writeFileSync(
    OUT,
    JSON.stringify({ currentPeriod, redirects }, null, 2) + "\n",
  );
  console.log(
    `[best-redirects] wrote ${redirects.length} entries (${currentPeriod})`,
  );
}

main();
