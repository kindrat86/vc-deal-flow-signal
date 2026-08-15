import "server-only";
import {
  getAllPeriods,
  getAllSectors,
  getCurrentPeriod,
  type Sector,
  type Startup,
} from "@/lib/data";
import { tierFromVelocityChange, TIER_HEX, type MomentumTier } from "@/lib/badge-svg";

// ---------------------------------------------------------------------------
// Sector resolution + aggregation for the embeddable sector badge/chart.
//
// Sectors resolve against the LIVE signal corpus (lib/data.ts), the same
// source that feeds /api/signals.json and the /api/badge/momentum route.
// Five legacy sectors froze at q2-2026 and carry zero startups in the current
// period, so resolveSector() walks back through getAllPeriods() (ordered
// current-first) to the latest snapshot that still has data. An unknown slug
// returns null; a known slug with no data anywhere returns an empty startup
// list. Consumers render a friendly "no data" badge, never a 404.
// ---------------------------------------------------------------------------

export interface ResolvedSector {
  sector: Sector;
  periodName: string;
  periodSlug: string;
  startups: Startup[];
}

export function resolveSector(slug: string): ResolvedSector | null {
  const sector = getAllSectors().find((s) => s.slug === slug);
  if (!sector) return null;

  for (const period of getAllPeriods()) {
    const snapshot = sector.periods[period.slug];
    if (snapshot && snapshot.startups.length > 0) {
      return {
        sector,
        periodName: period.name,
        periodSlug: period.slug,
        startups: snapshot.startups,
      };
    }
  }

  const current = getCurrentPeriod();
  return {
    sector,
    periodName: current.name,
    periodSlug: current.slug,
    startups: [],
  };
}

export interface SectorAggregate {
  count: number;
  avgVelocity: number;
  avgChange: number;
  breakout: number;
  hot: number;
  momentum: MomentumTier;
}

function safeFloat(value: string): number {
  return parseFloat(String(value).replace(/[^0-9.-]/g, "")) || 0;
}

export function aggregateSector(startups: Startup[]): SectorAggregate {
  const count = startups.length;
  const sumVelocity = startups.reduce(
    (acc, s) => acc + (s.commitVelocity14d || 0),
    0,
  );
  const sumChange = startups.reduce(
    (acc, s) => acc + safeFloat(s.commitVelocityChange),
    0,
  );
  const avgVelocity = count ? Math.round(sumVelocity / count) : 0;
  const avgChange = count ? Math.round(sumChange / count) : 0;

  let breakout = 0;
  let hot = 0;
  for (const s of startups) {
    const tier = tierFromVelocityChange(s.commitVelocityChange);
    if (tier === "breakout") breakout += 1;
    else if (tier === "hot") hot += 1;
  }

  return {
    count,
    avgVelocity,
    avgChange,
    breakout,
    hot,
    momentum: tierFromVelocityChange(`${avgChange}%`),
  };
}

// ---------------------------------------------------------------------------
// SVG rendering (self-contained, no external fonts/images, XML-escaped).
// ---------------------------------------------------------------------------

const FONT = "Verdana,Geneva,DejaVu Sans,sans-serif";
const W = 760;
const PAD = 28;
const BAR_TOP = 134;
const ROW_H = 40;
const BAR_H = 22;
const NAME_RIGHT = 200;
const BAR_LEFT = NAME_RIGHT + 14;
const BAR_RIGHT = W - PAD - 50;
const BAR_AREA = BAR_RIGHT - BAR_LEFT;

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function truncate(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max - 3)}...` : value;
}

export interface SectorChartInput {
  sectorName: string;
  periodName: string;
  aggregate: SectorAggregate;
  startups: Startup[];
}

export function renderSectorChart({
  sectorName,
  periodName,
  aggregate,
  startups,
}: SectorChartInput): string {
  const top = [...startups]
    .sort((a, b) => (b.commitVelocity14d || 0) - (a.commitVelocity14d || 0))
    .slice(0, 8);
  const maxVel = Math.max(1, ...top.map((s) => s.commitVelocity14d || 0));
  const barsEnd = BAR_TOP + top.length * ROW_H;
  const H = barsEnd + 46;

  const changePrefix = aggregate.avgChange >= 0 ? "+" : "";
  const parts: string[] = [];

  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(sectorName)} sector momentum chart, ${esc(periodName)}">`,
  );
  parts.push(
    `<title>${esc(`${sectorName} sector momentum, ${periodName}: ${aggregate.count} startups tracked, ${aggregate.breakout} breakout · GitDealFlow`)}</title>`,
  );
  parts.push(`<rect width="${W}" height="${H}" fill="#0b1220"/>`);

  // Header
  parts.push(
    `<text x="${PAD}" y="40" font-family="${FONT}" font-size="24" font-weight="700" fill="#f8fafc">${esc(sectorName)}</text>`,
  );
  parts.push(
    `<text x="${PAD}" y="68" font-family="${FONT}" font-size="14" fill="#94a3b8">${esc(periodName)} · ${aggregate.count} startups · avg ${aggregate.avgVelocity} commits/14d</text>`,
  );
  parts.push(
    `<text x="${PAD}" y="92" font-family="${FONT}" font-size="13" fill="#38bdf8">${aggregate.breakout} breakout · ${aggregate.hot} hot · avg ${changePrefix}${aggregate.avgChange}% velocity</text>`,
  );

  // Column label
  parts.push(
    `<text x="${PAD}" y="122" font-family="${FONT}" font-size="12" fill="#64748b">Top startups by commit velocity (14d)</text>`,
  );

  // Bars
  top.forEach((startup, i) => {
    const y = BAR_TOP + i * ROW_H;
    const velocity = startup.commitVelocity14d || 0;
    const tier = tierFromVelocityChange(startup.commitVelocityChange);
    const color = TIER_HEX[tier];
    const barW = Math.max(3, Math.round((velocity / maxVel) * BAR_AREA));
    const name = truncate(startup.name, 24);

    parts.push(
      `<rect x="${BAR_LEFT}" y="${y + 2}" width="${BAR_AREA}" height="${BAR_H}" rx="4" fill="#1e293b"/>`,
    );
    parts.push(
      `<text x="${NAME_RIGHT}" y="${y + 18}" text-anchor="end" font-family="${FONT}" font-size="13" fill="#e2e8f0">${esc(name)}</text>`,
    );
    parts.push(
      `<rect x="${BAR_LEFT}" y="${y + 2}" width="${barW}" height="${BAR_H}" rx="4" fill="${color}"/>`,
    );
    parts.push(
      `<text x="${BAR_LEFT + barW + 8}" y="${y + 18}" font-family="${FONT}" font-size="13" fill="#94a3b8">${velocity}</text>`,
    );
  });

  // Footer
  parts.push(
    `<rect x="${PAD}" y="${barsEnd + 4}" width="${W - PAD * 2}" height="1" fill="#1e293b"/>`,
  );
  parts.push(
    `<text x="${W / 2}" y="${barsEnd + 30}" text-anchor="middle" font-family="${FONT}" font-size="12" fill="#64748b">Powered by GitDealFlow · gitdealflow.com · data CC BY 4.0</text>`,
  );

  parts.push(`</svg>`);
  return parts.join("");
}
