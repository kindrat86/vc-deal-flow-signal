import { NextRequest, NextResponse } from "next/server";
import { FUNNEL_SLUGS, isFunnelSlug } from "@/content/funnel-slugs";
import {
  readManyFunnelCounts,
  trackFunnelView,
  type ActivityCounts,
} from "@/lib/funnel-activity";

// Live-activity counters for the /funnels Funnel Hub.
//
// GET  /api/funnel-activity         → counts for every known funnel slug
// GET  /api/funnel-activity?slug=x  → counts for one slug
// POST /api/funnel-activity         → record a view event (body: {slug, sid?})
//
// Brunson Traffic Secrets §3 Ch 12 lift: real-time activity proof on the hub.
// The data is anonymous — we store epoch timestamps and an opaque session id
// (a random nonce minted by the client and rotated daily). No IPs, no UA, no
// PII. Counts roll over a 24-hour window backed by Vercel Runtime Cache.
//
// Runtime: Node.js Fluid Compute (default). force-dynamic because every read
// returns the now-time window — caching would defeat the live-counter point.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SID_RX = /^[A-Za-z0-9_-]{6,64}$/;

interface ActivityResponse {
  asOf: string;
  funnels: Record<string, ActivityCounts>;
  /** Sum of `last24h` across every funnel — useful for an aggregate banner. */
  total24h: number;
  /** Sum of `activeNow` across every funnel. */
  totalActive: number;
}

export async function GET(req: NextRequest): Promise<NextResponse<ActivityResponse>> {
  const url = new URL(req.url);
  const oneSlug = url.searchParams.get("slug");
  const slugs = oneSlug && isFunnelSlug(oneSlug) ? [oneSlug] : Array.from(FUNNEL_SLUGS);

  const funnels = await readManyFunnelCounts(slugs);
  let total24h = 0;
  let totalActive = 0;
  for (const k of Object.keys(funnels)) {
    total24h += funnels[k].last24h;
    totalActive += funnels[k].activeNow;
  }

  return NextResponse.json(
    {
      asOf: new Date().toISOString(),
      funnels,
      total24h,
      totalActive,
    },
    {
      headers: {
        // Browser-cache 5s so quick re-polls don't stampede; the polling
        // interval on the client is 30–60s so this rarely matters but it
        // protects against shift-reloads.
        "Cache-Control": "public, max-age=5, s-maxage=5",
      },
    },
  );
}

interface TrackBody {
  slug?: unknown;
  sid?: unknown;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: TrackBody;
  try {
    body = (await req.json()) as TrackBody;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const slug = typeof body.slug === "string" ? body.slug : "";
  if (!isFunnelSlug(slug)) {
    return NextResponse.json({ ok: false, error: "unknown_slug" }, { status: 400 });
  }

  const rawSid = typeof body.sid === "string" ? body.sid : "";
  const sid = SID_RX.test(rawSid) ? rawSid : undefined;

  const counts = await trackFunnelView(slug, sid);
  return NextResponse.json(
    { ok: true, slug, counts },
    {
      headers: { "Cache-Control": "no-store" },
    },
  );
}
