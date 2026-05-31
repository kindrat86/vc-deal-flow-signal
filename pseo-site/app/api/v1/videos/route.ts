/**
 * /api/v1/videos — extension-stripped alias for /api/v1/videos.json.
 *
 * Matches the F37 pattern (every v1 endpoint exposes both `.json` and
 * stripped versions so generic agents that strip suffixes don't 404).
 *
 * NOT force-static — see feedback_no_force_static_on_alias_via_import.md.
 */
import { GET as Upstream } from "@/app/api/v1/videos.json/route";

export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export async function GET() {
  const upstream = await Upstream();
  const headers = new Headers(upstream.headers);
  headers.set("Link", `<${SITE}/api/v1/videos.json>; rel="canonical"`);
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
