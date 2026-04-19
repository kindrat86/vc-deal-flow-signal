/**
 * Auto-generate a Weekly Signal Report blog post from the current data.
 *
 * Reads data/startups.json, finds the current period, picks the top movers
 * across all sectors, and writes a signal-report post to content/signal-reports.ts.
 *
 * Usage: npx tsx scripts/generate-signal-report.ts
 * Designed to run after fetch-github-data.ts in the build pipeline.
 */

import * as fs from "fs";
import * as path from "path";

interface Startup {
  name: string;
  description: string;
  stage: string;
  geography: string;
  commitVelocity14d: number;
  commitVelocityChange: string;
  contributors: number;
  contributorGrowth: string;
  newRepos: number;
  signalType: string;
  githubUrl: string;
  websiteUrl?: string;
  linkedinUrl?: string;
}

interface SectorSnapshot {
  intro: string;
  startups: Startup[];
  faqs: Array<{ question: string; answer: string }>;
}

interface Sector {
  slug: string;
  name: string;
  description: string;
  relatedSlugs: string[];
  periods: Record<string, SectorSnapshot>;
}

interface Period {
  slug: string;
  name: string;
  current: boolean;
}

interface StartupsData {
  periods: Period[];
  sectors: Sector[];
}

function parseVelocityChange(s: string): number {
  return parseInt(s.replace(/[^0-9-]/g, ""), 10) || 0;
}

function main() {
  const dataPath = path.join(process.cwd(), "data", "startups.json");
  if (!fs.existsSync(dataPath)) {
    console.log("No data file found, skipping signal report generation.");
    return;
  }

  const data: StartupsData = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  const currentPeriod = data.periods.find((p) => p.current) ?? data.periods[0];
  if (!currentPeriod) {
    console.log("No current period, skipping.");
    return;
  }

  // Collect all startups from the current period across all sectors
  const allStartups: Array<Startup & { sectorName: string; sectorSlug: string }> = [];
  const sectorStats: Array<{
    name: string;
    slug: string;
    count: number;
    avgVelocity: number;
    topStartup: string;
    topChange: string;
    dominantSignal: string;
  }> = [];

  for (const sector of data.sectors) {
    const snapshot = sector.periods[currentPeriod.slug];
    if (!snapshot || !snapshot.startups.length) continue;

    for (const s of snapshot.startups) {
      allStartups.push({ ...s, sectorName: sector.name, sectorSlug: sector.slug });
    }

    const sorted = [...snapshot.startups].sort(
      (a, b) => parseVelocityChange(b.commitVelocityChange) - parseVelocityChange(a.commitVelocityChange)
    );
    const avg = Math.round(
      snapshot.startups.reduce((sum, s) => sum + s.commitVelocity14d, 0) / snapshot.startups.length
    );
    const signals: Record<string, number> = {};
    for (const s of snapshot.startups) signals[s.signalType] = (signals[s.signalType] || 0) + 1;
    const topSignal = Object.entries(signals).sort(([, a], [, b]) => b - a)[0][0];

    sectorStats.push({
      name: sector.name,
      slug: sector.slug,
      count: snapshot.startups.length,
      avgVelocity: avg,
      topStartup: sorted[0].name,
      topChange: sorted[0].commitVelocityChange,
      dominantSignal: topSignal,
    });
  }

  // Sort all startups by velocity change
  const globalTop10 = [...allStartups]
    .sort((a, b) => parseVelocityChange(b.commitVelocityChange) - parseVelocityChange(a.commitVelocityChange))
    .slice(0, 10);

  // Sort sectors by avg velocity
  const hottestSectors = [...sectorStats].sort((a, b) => b.avgVelocity - a.avgVelocity).slice(0, 5);

  // Count signals
  const signalCounts: Record<string, number> = {};
  for (const s of allStartups) signalCounts[s.signalType] = (signalCounts[s.signalType] || 0) + 1;
  const signalBreakdown = Object.entries(signalCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([signal, count]) => `${signal}: ${count} startups`)
    .join(", ");

  // Geography breakdown
  const geoCounts: Record<string, number> = {};
  for (const s of allStartups) geoCounts[s.geography] = (geoCounts[s.geography] || 0) + 1;
  const geoBreakdown = Object.entries(geoCounts)
    .filter(([g]) => g !== "Unknown")
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([geo, count]) => `${geo} (${count})`)
    .join(", ");

  // Generate date-based slug
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10);
  const slug = `weekly-signal-report-${dateStr}`;
  const title = `Weekly Signal Report — ${currentPeriod.name}`;
  const description = `This week's top 10 startups by engineering acceleration across ${sectorStats.length} sectors. ${globalTop10[0]?.name} leads with ${globalTop10[0]?.commitVelocityChange} commit velocity change. Data from ${allStartups.length} tracked startups.`;

  // Build the body
  const top10Section = globalTop10
    .map((s, i) => {
      const outboundLinks = [
        s.websiteUrl ? `[Website](${s.websiteUrl})` : null,
        s.linkedinUrl ? `[LinkedIn](${s.linkedinUrl})` : null,
      ]
        .filter(Boolean)
        .join(" · ");
      const linkSuffix = outboundLinks ? ` ${outboundLinks}.` : "";
      return `**#${i + 1} ${s.name}** (${s.sectorName}) — ${s.commitVelocityChange} commit velocity change, ${s.commitVelocity14d} commits over 14 days, ${s.contributors} contributors. Signal: ${s.signalType}. ${s.description}${linkSuffix}`;
    })
    .join("\n\n");

  const sectorSection = hottestSectors
    .map(
      (s) =>
        `**${s.name}**: ${s.count} startups tracked, avg velocity ${s.avgVelocity} commits/14d. Top mover: ${s.topStartup} (${s.topChange}). Dominant signal: ${s.dominantSignal}.`
    )
    .join("\n\n");

  const body = `This is the automated weekly signal report from VC Deal Flow Signal. We track GitHub engineering acceleration across ${sectorStats.length} startup sectors and rank them by commit velocity change — the rate at which engineering activity is accelerating relative to baseline.

This report covers ${currentPeriod.name}. ${allStartups.length} startups across ${sectorStats.length} sectors showed measurable engineering signals.

## Top 10 Startups by Engineering Acceleration

These are the startups showing the highest commit velocity change this period — the ones where engineering activity is accelerating fastest relative to their own baseline.

${top10Section}

## Hottest Sectors

${sectorSection}

## Signal Breakdown

Across all ${allStartups.length} tracked startups: ${signalBreakdown}.

## Geography

Top regions by startup count: ${geoBreakdown}.

## What This Means for Investors

The startups at the top of this list are showing engineering momentum that has historically preceded fundraise announcements by three to six weeks. If you invest in any of the sectors covered here, these are the names to research this week.

Browse the full sector rankings for detailed data on every tracked startup. Or subscribe to the Signal Digest to get this report in your inbox every week.`;

  const relatedSectors = hottestSectors.slice(0, 3).map((s) => s.slug);

  // Write as a TypeScript module
  const output = `// Auto-generated by scripts/generate-signal-report.ts — do not edit manually
import type { BlogPost } from "./posts";

export const signalReport: BlogPost = ${JSON.stringify(
    { slug, title, description, date: dateStr, body, relatedSectors, faqs: [] },
    null,
    2
  )};
`;

  const outPath = path.join(process.cwd(), "content", "signal-report-latest.ts");
  fs.writeFileSync(outPath, output, "utf8");
  console.log(`Signal report generated: ${slug} (${allStartups.length} startups, ${sectorStats.length} sectors)`);
}

main();
