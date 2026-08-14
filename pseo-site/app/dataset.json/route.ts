/**
 * Root-level alias for /.well-known/dataset.json.
 *
 * Google Dataset Search and Hugging Face Datasets historically probe both
 * /.well-known/dataset.json and a root-level /dataset.json. We serve the
 * DCAT 3 catalog body directly (200, not 308) because some dataset
 * crawlers don't follow redirects on JSON-LD probes. The canonical URL -
 * declared via the `Link: rel=canonical` header, remains under
 * /.well-known/.
 */

import { GET as WellKnownDatasetJson } from "@/app/.well-known/dataset.json/route";

export const dynamic = "force-static";
export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export async function GET() {
  const upstream = await WellKnownDatasetJson();
  const headers = new Headers(upstream.headers);
  headers.set(
    "Link",
    `<${SITE}/.well-known/dataset.json>; rel="canonical"`,
  );
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}
