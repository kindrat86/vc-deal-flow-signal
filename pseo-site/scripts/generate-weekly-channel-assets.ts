import * as fs from "node:fs";
import * as path from "node:path";
import { compileWeeklyChannelAssets, type WeeklySignal } from "../lib/weekly-channel-compiler";

type Startup = {
  name: string;
  commitVelocityChange: string;
  contributors: number;
  signalType: string;
  githubUrl: string;
};

type Snapshot = { startups: Startup[] };
type Sector = { name: string; periods: Record<string, Snapshot> };
type Source = {
  periods: Array<{ slug: string; name: string; current: boolean }>;
  sectors: Sector[];
};

function score(change: string): number {
  return Number.parseInt(change.replace(/[^0-9-]/g, ""), 10) || 0;
}

function main(): void {
  const dataPath = path.join(process.cwd(), "data", "startups.json");
  const source: Source = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  const period = source.periods.find((candidate) => candidate.current) ?? source.periods[0];
  if (!period) throw new Error("No current period in data/startups.json.");

  const topSignals = source.sectors.flatMap((sector) => (sector.periods[period.slug]?.startups ?? []).map((startup) => ({
    name: startup.name,
    sector: sector.name,
    commitVelocityChange: startup.commitVelocityChange,
    contributors: startup.contributors,
    signalType: startup.signalType,
    url: startup.githubUrl,
  }))).sort((a, b) => score(b.commitVelocityChange) - score(a.commitVelocityChange)).slice(0, 5);

  if (!topSignals.length) throw new Error(`No startup signals found for ${period.slug}.`);

  const signal: WeeklySignal = {
    period: period.slug,
    publishedAt: new Date().toISOString(),
    title: `Weekly Signal Report, ${period.name}`,
    summary: `The five largest engineering-acceleration moves in ${period.name}, derived from public GitHub activity.`,
    canonicalUrl: `https://signals.gitdealflow.com/research/weekly-signal-report-${new Date().toISOString().slice(0, 10)}`,
    datasetUrl: "https://signals.gitdealflow.com/weekly/latest.csv",
    topSignals,
  };
  const assets = compileWeeklyChannelAssets(signal);
  const output = path.join(process.cwd(), "public", "weekly");
  fs.mkdirSync(output, { recursive: true });
  fs.writeFileSync(path.join(output, "latest.json"), `${JSON.stringify(assets.api.json, null, 2)}\n`);
  fs.writeFileSync(path.join(output, "latest.csv"), assets.api.csv);
  fs.writeFileSync(path.join(output, "latest.rss.xml"), `${assets.rss}\n`);
  fs.writeFileSync(path.join(output, "latest.websub.json"), `${JSON.stringify(assets.websub, null, 2)}\n`);
  fs.writeFileSync(path.join(output, "latest.mcp.json"), `${JSON.stringify(assets.mcp, null, 2)}\n`);
  fs.writeFileSync(path.join(output, "latest.email.txt"), `Subject: ${assets.email.subject}\nPreheader: ${assets.email.preheader}\n\n${assets.email.text}\n`);
  fs.writeFileSync(path.join(output, "latest.card.json"), `${JSON.stringify(assets.card, null, 2)}\n`);
  console.log(`Generated six weekly channel assets for ${period.slug} in public/weekly.`);
}

main();
