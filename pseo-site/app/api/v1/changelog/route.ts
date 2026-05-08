/**
 * /api/v1/changelog — extension-stripped alias for /api/v1/changelog.json.
 * See /api/v1/signals/route.ts for the rationale.
 */

import { GET as Upstream } from "@/app/api/v1/changelog.json/route";

export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export async function GET() {
  const upstream = await Upstream();
  const headers = new Headers(upstream.headers);
  headers.set("Link", `<${SITE}/api/v1/changelog.json>; rel="canonical"`);
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
