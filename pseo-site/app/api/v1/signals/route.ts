/**
 * /api/v1/signals — extension-stripped alias for /api/v1/signals.json.
 *
 * Closes audit gap 2026-05-08: agents that infer "stripped" REST paths and
 * never append `.json` were hitting 404 on every /api/v1/<resource>. This
 * thin wrapper returns the same body and headers as the .json variant with
 * a `Link: rel=canonical` pointing back to the canonical .json path so
 * crawlers don't index two URLs as primary.
 *
 * No `dynamic="force-static"`: per `feedback_no_force_static_on_alias_via_import.md`,
 * alias-via-import routes silently break under force-static when the
 * upstream is dynamic. Let runtime decide.
 */

import type { NextRequest } from "next/server";
import { GET as Upstream } from "@/app/api/v1/signals.json/route";

export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export async function GET(request: NextRequest) {
  const upstream = await Upstream(request);
  const headers = new Headers(upstream.headers);
  headers.set("Link", `<${SITE}/api/v1/signals.json>; rel="canonical"`);
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
