/**
 * /skills.json — root alias for /.well-known/skills.json.
 *
 * Some agents probe the root before /.well-known. Mirrors the canonical
 * skills card without redirect; declares the canonical URL in the Link
 * header.
 *
 * NOT force-static — see feedback_no_force_static_on_alias_via_import.md.
 */
import { GET as Upstream } from "@/app/.well-known/skills.json/route";

export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export async function GET() {
  const upstream = await Upstream();
  const headers = new Headers(upstream.headers);
  headers.set("Link", `<${SITE}/.well-known/skills.json>; rel="canonical"`);
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
