/**
 * /api/v1/changelog.json — versioned alias for /api/changelog.json.
 *
 * Stable v1 path for the public changelog feed (release notes, signal
 * cadence updates, methodology revisions). Body and headers mirror the
 * upstream; canonical URL — declared via `Link: rel=canonical` —
 * remains at /api/changelog.json.
 */

import { GET as ApiChangelogJson } from "@/app/api/changelog.json/route";

export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export async function GET() {
  const upstream = await ApiChangelogJson();
  const headers = new Headers(upstream.headers);
  headers.set("Link", `<${SITE}/api/changelog.json>; rel="canonical"`);
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
