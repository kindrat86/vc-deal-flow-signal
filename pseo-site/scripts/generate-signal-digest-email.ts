/**
 * Render the weekly Signal Digest email from data/startups.json.
 *
 * 2026-11-03: this script used to carry its own copy of the ranking logic,
 * which drifted from lib/digest-builder.ts (no non-startup blocklist, "+999%"
 * shown as a number, "Week of <today>" on August data). It now renders through
 * buildLatestDigest(), the same builder the Sunday cron and /api/verify use,
 * so every surface shares one classifier, one label rule and one template.
 *
 * Freshness gate: refuses (exit 2, writes nothing) when the data is older than
 * FRESH_DAYS (8), has < 5 freshly measured startups, or the "Week of" label
 * does not match the data date. `--allow-stale` renders a local preview only,
 * written to emails/PREVIEW-STALE-signal-digest.html (never the issue files).
 *
 * Usage:
 *   npx tsx scripts/generate-signal-digest-email.ts
 *   npx tsx scripts/generate-signal-digest-email.ts --allow-stale   # preview only
 *
 * Writes (fresh data only):
 *   emails/signal-digest-<YYYY-MM-DD>.html  (dated issue)
 *   emails/signal-digest-latest.html         (always overwritten)
 */

import * as fs from "fs";
import * as path from "path";
import { buildLatestDigest, digestFreshness, weekLabelMatchesData } from "../lib/digest-builder";

function main() {
  const allowStale = process.argv.includes("--allow-stale");
  const fr = digestFreshness();
  const digest = buildLatestDigest();
  const labelOk = weekLabelMatchesData(digest.subject + " " + digest.html);
  const ok = fr.fresh && labelOk;
  const outDir = path.resolve(process.cwd(), "..", "emails");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  if (!ok) {
    const why = `fetchedAt=${fr.fetchedAt} ageDays=${fr.ageDays.toFixed(1)} freshCount=${fr.freshCount} labelOk=${labelOk}`;
    if (!allowStale) {
      console.error(`REFUSED: signal data is stale (${why}). Run the weekly data refresh first. No digest files written.`);
      // Inside `npm run build` this must not fail the site build; standalone it exits 2.
      process.exit(process.env.npm_lifecycle_event === "build" || process.env.VERCEL ? 0 : 2);
    }
    const p = path.join(outDir, "PREVIEW-STALE-signal-digest.html");
    fs.writeFileSync(p, digest.html, "utf8");
    console.warn(`STALE PREVIEW ONLY (${why}) -> ${p}. Do not send.`);
    return;
  }

  const dateStr = new Date().toISOString().slice(0, 10);
  const datedPath = path.join(outDir, `signal-digest-${dateStr}.html`);
  const latestPath = path.join(outDir, "signal-digest-latest.html");
  fs.writeFileSync(datedPath, digest.html, "utf8");
  fs.writeFileSync(latestPath, digest.html, "utf8");
  console.log(`Rendered ${datedPath} (${digest.totalStartups} startups, ${digest.sectorCount} sectors, data ${fr.fetchedAt})`);
  console.log(`Subject: ${digest.subject}`);
}

main();
