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

function signalColor(signalType: string): string {
  for (const [key, color] of Object.entries(SIGNAL_COLORS)) {
    if ((signalType || "").toLowerCase().includes(key.toLowerCase())) return color;
  }
  return SIGNAL_COLORS.steady || "#60a5fa";
}

function badgeSvg(label: string, value: string, color: string) {
  const leftW = label.length * 8 + 24;
  const rightW = value.length * 8 + 24;
  const totalW = leftW + rightW;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="28" role="img">
  <title>VC Deal Flow Signal — ${label}</title>
  <linearGradient id="bg" x2="0" y2="100%">
    <stop offset="0" stop-color="#1e293b"/>
    <stop offset="1" stop-color="#0f172a"/>
  </linearGradient>
  <rect width="${totalW}" height="28" rx="6" fill="url(#bg)"/>
  <rect width="${leftW}" height="28" rx="0" fill="#334155"/>
  <rect x="${leftW}" width="${rightW}" height="28" rx="0" fill="${color}" fill-opacity="0.15"/>
  <rect x="${leftW}" width="${rightW}" height="28" rx="0" fill="${color}" fill-opacity="0.08"/>
  <text x="${leftW / 2}" y="19" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" font-weight="700" fill="#e2e8f0">${label}</text>
  <text x="${leftW + rightW / 2}" y="19" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" font-weight="700" fill="${color}">${value}</text>
</svg>`;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
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

  // Build badge value: signal + velocity
  const value = `${signal.replace(/ .+/, "")} ${vel} commits`;

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
  // Pre-render badges for all tracked startups
  const slugs: { name: string }[] = [];
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
