import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RANK_COLORS: Record<string, string> = {
  curious: "#94a3b8",
  scout: "#22c55e",
  sharp: "#38bdf8",
  elite: "#a855f7",
  oracle: "#f59e0b",
};

const RANK_LABELS: Record<string, string> = {
  curious: "Curious",
  scout: "Scout",
  sharp: "Sharp",
  elite: "Elite",
  oracle: "Oracle",
};

function badgeSvg(score: number, rank: string, username: string) {
  const color = RANK_COLORS[rank] || "#94a3b8";
  const label = RANK_LABELS[rank] || "Unknown";
  const scoreText = `${score}/100`;
  const leftLabel = "VC Scout";
  const leftW = leftLabel.length * 9 + 24;
  const rightW = scoreText.length * 10 + 32 + label.length * 8;
  const totalW = leftW + rightW;
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="28" role="img" aria-label="VC Scout Score: ${scoreText} ${label}">
  <title>VC Scout Score for ${username}: ${scoreText} — ${label}</title>
  <linearGradient id="bg" x2="0" y2="100%">
    <stop offset="0" stop-color="#1e293b"/>
    <stop offset="1" stop-color="#0f172a"/>
  </linearGradient>
  <rect width="${totalW}" height="28" rx="6" fill="url(#bg)"/>
  <rect width="${leftW}" height="28" fill="#334155"/>
  <rect x="${leftW}" width="${rightW}" height="28" fill="${color}" fill-opacity="0.15"/>
  <text x="${leftW / 2}" y="19" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" font-weight="700" fill="#e2e8f0">${leftLabel}</text>
  <text x="${leftW + rightW / 2}" y="19" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" font-weight="700" fill="${color}">${scoreText} ${label}</text>
</svg>`;
}

function errorBadge(message: string) {
  const leftW = 120;
  const rightW = 180;
  const totalW = leftW + rightW;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="28" role="img">
  <rect width="${totalW}" height="28" rx="6" fill="#0b1220"/>
  <rect width="${leftW}" height="28" fill="#334155"/>
  <rect x="${leftW}" width="${rightW}" height="28" fill="#ef4444" fill-opacity="0.15"/>
  <text x="${leftW / 2}" y="19" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" font-weight="700" fill="#e2e8f0">VC Scout</text>
  <text x="${leftW + rightW / 2}" y="19" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" font-weight="700" fill="#ef4444">${message}</text>
</svg>`;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  
  if (!username || !/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(username)) {
    return new Response(errorBadge("invalid user"), {
      headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=60" },
    });
  }

  try {
    // Fetch from the internal receipts API
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_SITE_URL || "https://signals.gitdealflow.com";
    
    const res = await fetch(`${baseUrl}/api/receipts/${encodeURIComponent(username)}`, {
      next: { revalidate: 86400 },
    });
    
    if (!res.ok) {
      return new Response(errorBadge("user not found"), {
        headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=60" },
      });
    }

    const data = await res.json();
    const score = data.score ?? 0;
    const rank = data.rank ?? "curious";
    
    const svg = badgeSvg(score, rank, username);
    
    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600",
        "CDN-Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new Response(errorBadge("error"), {
      headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=30" },
    });
  }
}
