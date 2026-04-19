/**
 * Render the weekly Signal Digest email from data/startups.json.
 *
 * Sibling to generate-signal-report.ts — same data source, same ranking logic,
 * different output surface (HTML email instead of blog post).
 *
 * Usage:
 *   npx tsx scripts/generate-signal-digest-email.ts              # generic ESP syntax (%unsubscribe_url%)
 *   npx tsx scripts/generate-signal-digest-email.ts --esp=resend # Resend syntax ({{{RESEND_UNSUBSCRIBE_URL}}})
 *
 * Writes:
 *   emails/signal-digest-<YYYY-MM-DD>.html  (dated issue, committed weekly)
 *   emails/signal-digest-latest.html         (always overwritten, tracked for quick preview)
 */

import * as fs from "fs";
import * as path from "path";
import {
  renderDigestEmail,
  type DigestData,
  type DigestOptions,
  type DigestSector,
  type DigestStartup,
} from "../lib/digest-email";

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
  slug?: string;
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
  meta?: { issueNumber?: number };
}

function parseVelocityChange(s: string): number {
  return parseInt(s.replace(/[^0-9-]/g, ""), 10) || 0;
}

function parseEsp(argv: string[]): DigestOptions["esp"] {
  const arg = argv.find((a) => a.startsWith("--esp="));
  if (!arg) return "generic";
  const value = arg.split("=")[1];
  return value === "resend" ? "resend" : "generic";
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatWeekOf(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function buildHeadline(topSectors: DigestSector[]): string {
  if (!topSectors.length) return "This week's engineering acceleration report.";
  const names = topSectors.slice(0, 3).map((s) => s.name);
  if (names.length === 1) return `${names[0]} is accelerating fastest this week.`;
  if (names.length === 2) return `${names[0]} and ${names[1]} are accelerating fastest this week.`;
  return `${names[0]}, ${names[1]}, and ${names[2]} are accelerating fastest this week.`;
}

function main() {
  const dataPath = path.join(process.cwd(), "data", "startups.json");
  if (!fs.existsSync(dataPath)) {
    console.error(`No data file at ${dataPath}. Run fetch-github-data.ts first.`);
    process.exit(1);
  }

  const raw: StartupsData = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  const period = raw.periods.find((p) => p.current) ?? raw.periods[0];
  if (!period) {
    console.error("No current period in data.");
    process.exit(1);
  }

  const allStartups: Array<Startup & { sectorName: string; sectorSlug: string }> = [];
  const sectorStats: DigestSector[] = [];

  for (const sector of raw.sectors) {
    const snapshot = sector.periods[period.slug];
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
    sectorStats.push({
      name: sector.name,
      topStartup: sorted[0].name,
      topChange: sorted[0].commitVelocityChange,
      count: snapshot.startups.length,
      avgVelocity: avg,
    });
  }

  const topStartups: DigestStartup[] = [...allStartups]
    .sort(
      (a, b) =>
        parseVelocityChange(b.commitVelocityChange) - parseVelocityChange(a.commitVelocityChange)
    )
    .slice(0, 5)
    .map((s, i) => ({
      rank: i + 1,
      name: s.name,
      sectorName: s.sectorName,
      sectorSlug: s.sectorSlug,
      description: s.description,
      commitVelocityChange: s.commitVelocityChange,
      commitVelocity14d: s.commitVelocity14d,
      contributors: s.contributors,
      signalType: s.signalType,
      slug: s.slug ?? slugify(s.name),
    }));

  const hottestSectors = [...sectorStats].sort((a, b) => b.avgVelocity - a.avgVelocity).slice(0, 3);

  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10);

  const digest: DigestData = {
    issueNumber: raw.meta?.issueNumber ?? 1,
    weekOf: formatWeekOf(today),
    heroHeadline: buildHeadline(hottestSectors),
    heroIntro: `${allStartups.length} startups across ${sectorStats.length} sectors showed measurable engineering signals. ${topStartups
      .filter((s) => parseVelocityChange(s.commitVelocityChange) >= 100)
      .length} of them more than doubled commit velocity against their own baseline — typically a 3–6 week lead on a fundraise announcement.`,
    statStartups: allStartups.length,
    statSectors: sectorStats.length,
    statTopMover: topStartups[0]?.commitVelocityChange ?? "",
    topStartups,
    hottestSectors,
  };

  const esp = parseEsp(process.argv.slice(2));
  const html = renderDigestEmail(digest, { esp });

  const outDir = path.resolve(process.cwd(), "..", "emails");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const datedPath = path.join(outDir, `signal-digest-${dateStr}.html`);
  const latestPath = path.join(outDir, "signal-digest-latest.html");
  fs.writeFileSync(datedPath, html, "utf8");
  fs.writeFileSync(latestPath, html, "utf8");

  console.log(`Rendered ${datedPath} (${allStartups.length} startups, ${sectorStats.length} sectors, esp=${esp})`);
  console.log(`Also updated ${latestPath}`);
}

main();
