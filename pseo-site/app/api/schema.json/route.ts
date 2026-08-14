/**
 * /api/schema.json, alias of /api/openapi.json (direct content, not redirect).
 *
 * Several MCP catalogs and AI Action builders probe `schema.json` (older
 * convention) while OpenAPI 3.x adopters use `openapi.json`. Serving both at
 * the same content avoids the failure mode where a discovery scanner skips
 * us because it's looking under a different filename.
 *
 * Pass VII (2026-05-05), converted from 308 to 200 direct, matching the
 * established Pass V/VI rule: agent bots probing JSON descriptors often
 * skip the redirect hop and treat 308 as "not found." Canonical URL is
 * still declared via `Link: rel=canonical` so caches stay unified.
 */

import { GET as ApiOpenApiJson } from "@/app/api/openapi.json/route";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export async function GET() {
  const upstream = await ApiOpenApiJson();
  const headers = new Headers(upstream.headers);
  headers.set("Link", `<${SITE}/api/openapi.json>; rel="canonical"`);
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
