import { NextRequest } from "next/server";
import startupsData from "@/data/startups.json";

export const runtime = "nodejs";
export const dynamic = "force-static";

// Color scheme by signal type
const SIGNAL_COLORS: Record<string, string> = {
  breakout: "#fbbf24", // amber
  acceleration: "#34d399", // emerald
  steady: "#60a5fa", // blue
  cooling: "#f87171", // red
  "Infrastructure buildout": "#818cf8",
  "Framework migration": "#f472b6",
  "Hiring burst": "#fb923c",
  "Deploy frequency spike": "#22d3ee",
  "Contributor influx": "#a78bfa",
};

function findStartup(name: string) {
  const normalized = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  for (const sector of (startupsData as any).sectors) {
    for (const [, snapshot] of Object.entries(sector.periods || {})) {
      const snap = snapshot as any;
      for (const s of snap.startups || []) {
        const sNorm = (s.name || "").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
        if (sNorm === normalized) return { ...s, sectorName: sector.name };
      }
    }
  }
  return null;
}

// Short badge value labels per signal type (kept in sync with
// lib/badge-dims.ts). The raw signalType is a long phrase like
// "Engineering hiring burst"; its FIRST word ("Engineering") read
// redundantly next to the "engineering momentum" label, so map to a
// clean short phrase.
const SHORT_SIGNAL: Record<string, string> = {
  "Engineering hiring burst": "hiring burst",
  "Framework migration": "framework migration",
  "Deploy frequency spike": "deploy spike",
  "Infrastructure buildout": "infra buildout",
};

function signalColor(signalType: string): string {
  for (const [key, color] of Object.entries(SIGNAL_COLORS)) {
    if ((signalType || "").toLowerCase().includes(key.toLowerCase())) return color;
  }
  return SIGNAL_COLORS.steady || "#60a5fa";
}

// XML-escape badge text. Stat labels contain "&" (e.g. "Energy & resources")
// which would produce an unparseable SVG if emitted raw.
function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function badgeSvg(label: string, value: string, color: string) {
  const leftW = label.length * 8 + 24;
  const rightW = value.length * 8 + 24;
  const totalW = leftW + rightW;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="28" role="img">
  <title>VC Deal Flow Signal: ${esc(label)}</title>
  <linearGradient id="bg" x2="0" y2="100%">
    <stop offset="0" stop-color="#1e293b"/>
    <stop offset="1" stop-color="#0f172a"/>
  </linearGradient>
  <rect width="${totalW}" height="28" rx="6" fill="url(#bg)"/>
  <rect width="${leftW}" height="28" rx="0" fill="#334155"/>
  <rect x="${leftW}" width="${rightW}" height="28" rx="0" fill="${color}" fill-opacity="0.15"/>
  <rect x="${leftW}" width="${rightW}" height="28" rx="0" fill="${color}" fill-opacity="0.08"/>
  <text x="${leftW / 2}" y="19" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" font-weight="700" fill="#e2e8f0">${esc(label)}</text>
  <text x="${leftW + rightW / 2}" y="19" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" font-weight="700" fill="${color}">${esc(value)}</text>
</svg>`;
}

// Citable stats from the /stats hub (gitdealflow.com/stats). Served as
// shields.io-style badges so the stat cards' badge rows resolve to real
// values instead of 404s or the grey "not tracked" fallback. Keep labels
// in sync with landing/stats/index.html stat cards.
const STAT_BADGES: Record<string, { label: string; value: string; color: string }> = {
  "stats-m1": { label: "Global M&A deal value in 2025", value: "$4.9T", color: "#34d399" },
  "stats-m2": { label: "Projected global M&A deal value 2026", value: "$4T", color: "#60a5fa" },
  "stats-m3": { label: "Global M&A volume in Q1 2026", value: "$861.1B", color: "#34d399" },
  "stats-m4": { label: "M&A activity increase in 2025", value: "43%", color: "#34d399" },
  "stats-m5": { label: "Total M&A transactions since 2000", value: "790,000+", color: "#60a5fa" },
  "stats-m6": { label: "Projected number of deals in 2026", value: "~42,000", color: "#60a5fa" },
  "stats-m7": { label: "Mega-deal threshold driving growth", value: "$10B+", color: "#fbbf24" },
  "stats-m8": { label: "Most active M&A sector 2025-26", value: "Technology", color: "#818cf8" },
  "stats-m9": { label: "Energy & resources deal value growth", value: "+40%", color: "#34d399" },
  "stats-m10": { label: "Median EV/EBITDA multiple (2025)", value: "12.5x", color: "#a78bfa" },
  "stats-m11": { label: "Share of billion-dollar acquisitions", value: "33%", color: "#60a5fa" },
  "stats-m12": { label: "Average mega-deal size Q1 2026", value: "$4.2B", color: "#fbbf24" },
  "stats-m13": { label: "Cross-border deal share in 2025", value: "32%", color: "#60a5fa" },
  "stats-m14": { label: "PE dry powder available for M&A", value: "$1.2T", color: "#34d399" },
  "stats-m15": { label: "PE share of total M&A in 2025", value: "28%", color: "#60a5fa" },
  "stats-m16": { label: "Deals meeting or exceeding synergy targets", value: "60%", color: "#34d399" },
  "stats-m17": { label: "Announcement to close, average", value: "4-6 months", color: "#60a5fa" },
  "stats-m18": { label: "Engineering signal lead time", value: "3-6 weeks", color: "#fbbf24" },
  "stats-m19": { label: "Tracked sectors for deal signals", value: "15", color: "#818cf8" },
  "stats-m20": { label: "Top-decile signal precision", value: "~65%", color: "#34d399" },
  // /stats hub (signals.gitdealflow.com) cards stat-s1..s10. Keep in sync with
  // pseo-site/public/stats/index.html (the human companion of /stats.json).
  "stats-s1": { label: "Tracked startup organizations", value: "350+", color: "#60a5fa" },
  "stats-s2": { label: "Tracked industry sectors", value: "15", color: "#818cf8" },
  "stats-s3": { label: "Engineering signal lead time", value: "3-6 weeks", color: "#fbbf24" },
  "stats-s4": { label: "Top-decile signal precision", value: "~65%", color: "#34d399" },
  "stats-s5": { label: "Global M&A volume Q1 2026", value: "$861.1B", color: "#34d399" },
  "stats-s6": { label: "Global M&A deal value 2025", value: "$4.9T", color: "#34d399" },
  "stats-s7": { label: "M&A activity increase in 2025", value: "+43%", color: "#34d399" },
  "stats-s8": { label: "Free API tools (MCP server)", value: "6", color: "#60a5fa" },
  "stats-s9": { label: "Programmatic access surfaces", value: "5", color: "#60a5fa" },
  "stats-s10": { label: "Scout Score range", value: "0-100", color: "#a78bfa" },
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const rawName = (await params).name;
  // Accept both "stats-m1" and "stats-m1.svg" (the /stats hub uses .svg).
  const name = rawName.replace(/\.svg$/i, "");

  const stat = STAT_BADGES[name];
  if (stat) {
    return new Response(badgeSvg(stat.label, stat.value, stat.color), {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
        "CDN-Cache-Control": "public, max-age=86400",
      },
    });
  }

  const startup = findStartup(name);

  if (!startup) {
    const svg = badgeSvg("VC Deal Flow Signal", "not tracked", "#64748b");
    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
        "CDN-Cache-Control": "public, max-age=86400",
      },
    });
  }

  const vel = startup.commitVelocity14d || 0;
  const change = (startup.commitVelocityChange || "0%").replace("+", "");
  const signal = startup.signalType || "steady";
  const color = signalColor(signal);

  // Build badge value: short signal label + velocity
  const value = `${SHORT_SIGNAL[signal] || signal.replace(/ .+/, "")} ${vel} commits`;

  const label = "engineering momentum";
  const svg = badgeSvg(label, value, color);

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "CDN-Cache-Control": "public, max-age=86400",
    },
  });
}

export async function generateStaticParams() {
  // Pre-render badges for all tracked startups, plus the /stats hub badges
  // (gitdealflow.com/stats embeds all 20 via its badge rows).
  const slugs: { name: string }[] = Object.keys(STAT_BADGES).map((k) => ({ name: k }));
  const seen = new Set<string>();
  for (const sector of (startupsData as any).sectors) {
    for (const [, snapshot] of Object.entries(sector.periods || {})) {
      for (const s of (snapshot as any).startups || []) {
        const slug = (s.name || "").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
        if (slug && !seen.has(slug)) {
          seen.add(slug);
          slugs.push({ name: slug });
        }
      }
    }
  }
  return slugs;
}
