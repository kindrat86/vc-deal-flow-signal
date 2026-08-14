import { NextResponse } from "next/server";
import { readRecentSignups } from "@/lib/recent-signups";

// Real recent-signup feed for the landing page's social-proof toasts.
//
// GET /api/recent-signups → { asOf, count, signups: [{ city, country, ago, ts }] }
//
// Honest by construction: it returns only real signup events recorded at
// /api/subscribe (see lib/recent-signups.ts). When nothing real has happened
// recently the feed is empty and the landing shows no toast. Nothing is
// seeded or faked. Data is anonymous, city + country only, no PII.
//
// CORS: the apex landing (gitdealflow.com) fetches this cross-origin, so we
// echo the Origin when it is on the allow-list. Runtime: Node.js (Runtime
// Cache); force-dynamic because the feed is time-relative.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_ORIGINS = [
  "https://gitdealflow.com",
  "https://www.gitdealflow.com",
  ...(process.env.NODE_ENV !== "production" ? ["http://localhost:8080"] : []),
];

// Compact ISO-3166 alpha-2 → display name for the countries that actually
// show up in this audience. Anything not listed falls back to the raw code,
// so the feed never breaks on an unmapped country.
const COUNTRY_NAMES: Record<string, string> = {
  US: "United States", GB: "United Kingdom", CA: "Canada", AU: "Australia",
  DE: "Germany", FR: "France", NL: "Netherlands", IE: "Ireland", ES: "Spain",
  IT: "Italy", PT: "Portugal", SE: "Sweden", NO: "Norway", DK: "Denmark",
  FI: "Finland", CH: "Switzerland", AT: "Austria", BE: "Belgium", PL: "Poland",
  CZ: "Czechia", RO: "Romania", GR: "Greece", UA: "Ukraine", IL: "Israel",
  AE: "UAE", SA: "Saudi Arabia", IN: "India", SG: "Singapore", HK: "Hong Kong",
  JP: "Japan", KR: "South Korea", CN: "China", TW: "Taiwan", ID: "Indonesia",
  MY: "Malaysia", TH: "Thailand", VN: "Vietnam", PH: "Philippines",
  BR: "Brazil", MX: "Mexico", AR: "Argentina", CL: "Chile", CO: "Colombia",
  ZA: "South Africa", NG: "Nigeria", KE: "Kenya", EG: "Egypt", TR: "Turkey",
  NZ: "New Zealand", EE: "Estonia", LT: "Lithuania", LV: "Latvia",
};

function relativeAgo(ts: number, now: number): string {
  const s = Math.max(0, Math.floor((now - ts) / 1000));
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  const w = Math.floor(d / 7);
  return `${w}w ago`;
}

function corsHeaders(origin: string): Record<string, string> {
  const h: Record<string, string> = {
    "Cache-Control": "public, max-age=15, s-maxage=15",
    Vary: "Origin",
  };
  if (ALLOWED_ORIGINS.includes(origin)) {
    h["Access-Control-Allow-Origin"] = origin;
    h["Access-Control-Allow-Methods"] = "GET, OPTIONS";
  }
  return h;
}

export async function GET(request: Request) {
  const origin = request.headers.get("origin") || "";
  const now = Date.now();
  const events = await readRecentSignups(12);
  const signups = events.map((e) => ({
    city: e.city,
    country: e.country ? COUNTRY_NAMES[e.country] || e.country : "",
    ago: relativeAgo(e.ts, now),
    ts: e.ts,
  }));
  return NextResponse.json(
    { asOf: new Date(now).toISOString(), count: signups.length, signups },
    { headers: corsHeaders(origin) },
  );
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin") || "";
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}
