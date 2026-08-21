import { NextResponse } from "next/server";
import { getCache } from "@vercel/functions";
import { getPublicProof } from "@/lib/public-proof";
import proofCounters from "@/data/proof-counters.json";

/**
 * GET /api/proof
 *
 * Honest live proof counters for the apex landing (gitdealflow.com):
 *
 *   - subscribers: active (non-unsubscribed) contacts in the GitDealFlow
 *     Resend audience. Live, runtime-cached 1h so a page-load flood does not
 *     hammer the Resend API. Returns -1 when Resend is unreachable or
 *     unconfigured; the landing then hides the number instead of inventing one.
 *
 *   - issuesSent: committed Sunday Signal Digest edition count
 *     (data/proof-counters.json). Bump that file when a new weekly issue
 *     ships. This is a floor, not an exact live count, and deliberately
 *     under-claims the same way the panel claim locks to "350+".
 *
 *   - scorecard: hits / misses / pending from the pre-registered Acceleration
 *     Watch (lib/predictions). This is the public "track record, auditable"
 *     proof the landing already promises.
 *
 * CORS mirrors /api/recent-signups: the apex landing fetches this
 * cross-origin, so we echo the Origin only when it is on the allow-list.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_ORIGINS = [
  "https://gitdealflow.com",
  "https://www.gitdealflow.com",
  ...(process.env.NODE_ENV !== "production" ? ["http://localhost:8080"] : []),
];

const PROOF_NAMESPACE = "proof-counters";
const SUBSCRIBER_TTL_SECONDS = 3600; // 1h

function corsHeaders(origin: string): Record<string, string> {
  const h: Record<string, string> = {
    "Cache-Control": "public, max-age=300, s-maxage=300",
    Vary: "Origin",
  };
  if (ALLOWED_ORIGINS.includes(origin)) {
    h["Access-Control-Allow-Origin"] = origin;
    h["Access-Control-Allow-Methods"] = "GET, OPTIONS";
  }
  return h;
}

interface ResendContacts {
  data?: Array<{ unsubscribed?: boolean }>;
}

async function getActiveSubscriberCount(): Promise<number> {
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!apiKey || !audienceId) return -1;

  const cache = getCache({ namespace: PROOF_NAMESPACE });
  const cached = await cache.get("active-subscribers");
  if (typeof cached === "number") return cached;

  let active = 0;
  try {
    const res = await fetch(
      `https://api.resend.com/audiences/${audienceId}/contacts`,
      { headers: { Authorization: `Bearer ${apiKey}` } },
    );
    if (!res.ok) return -1;
    const json = (await res.json()) as ResendContacts;
    for (const c of json.data ?? []) if (!c?.unsubscribed) active++;
  } catch {
    return -1;
  }

  await cache.set("active-subscribers", active, { ttl: SUBSCRIBER_TTL_SECONDS });
  return active;
}

export async function GET(request: Request) {
  const origin = request.headers.get("origin") || "";
  const proof = getPublicProof();
  const subscribers = await getActiveSubscriberCount();

  return NextResponse.json(
    {
      asOf: proof.asOf,
      subscribers,
      issuesSent: proofCounters.issuesSent,
      firstIssueDate: proofCounters.firstIssueDate,
      scorecard: proof.scorecard,
    },
    { headers: corsHeaders(origin) },
  );
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin") || "";
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}
