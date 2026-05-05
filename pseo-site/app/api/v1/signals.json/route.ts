/**
 * /api/v1/signals.json — versioned alias for /api/signals.json.
 *
 * Companion to the existing /api/v1/pricing.json. Agents and procurement
 * automations that pin to v1 need a stable signals endpoint at the same
 * version path. Body and headers mirror the upstream; canonical URL —
 * declared via `Link: rel=canonical` — remains at /api/signals.json.
 */

import type { NextRequest } from "next/server";
import { GET as ApiSignalsJson } from "@/app/api/signals.json/route";

export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export async function GET(request: NextRequest) {
  const upstream = await ApiSignalsJson(request);
  const headers = new Headers(upstream.headers);
  headers.set("Link", `<${SITE}/api/signals.json>; rel="canonical"`);
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
