/**
 * /api/v1/signals, extension-stripped alias for /api/v1/signals.json.
 *
 * Generic agents that infer "stripped" REST paths probe /api/v1/<resource>
 * before /api/v1/<resource>.json. This thin alias mirrors the upstream
 * body and declares the canonical URL via `Link: rel=canonical`.
 *
 * NOT force-static, see feedback_no_force_static_on_alias_via_import.md.
 */
import { GET as Upstream } from "@/app/api/v1/signals.json/route";

export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export async function GET(request: Request) {
  const upstream = await Upstream(request as never);
  const headers = new Headers(upstream.headers);
  headers.set("Link", `<${SITE}/api/v1/signals.json>; rel="canonical"`);
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
