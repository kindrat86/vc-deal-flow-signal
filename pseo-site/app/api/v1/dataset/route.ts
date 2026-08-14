/**
 * /api/v1/dataset, extension-stripped alias for /api/v1/dataset.jsonl.
 *
 * NOT force-static, see feedback_no_force_static_on_alias_via_import.md.
 */
import { GET as Upstream } from "@/app/api/v1/dataset.jsonl/route";

export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export async function GET(request: Request) {
  const upstream = await Upstream(request);
  const headers = new Headers(upstream.headers);
  headers.set("Link", `<${SITE}/api/v1/dataset.jsonl>; rel="canonical"`);
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
