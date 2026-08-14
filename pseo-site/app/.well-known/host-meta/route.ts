/**
 * RFC 6415, host-meta
 *
 * XRD descriptor for the host. Older OpenID / OAuth1 / fediverse-flavored
 * discovery; some agents still hit this before WebFinger as a host-level
 * sanity check.
 *
 * Returns XRD/XML by default. The `.json` variant (RFC 6415 §3.1) is at
 * /.well-known/host-meta.json, a separate route.
 */

export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export async function GET() {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<XRD xmlns="http://docs.oasis-open.org/ns/xri/xrd-1.0">
  <Subject>${SITE}</Subject>
  <Property type="http://schema.org/name">VC Deal Flow Signal</Property>
  <Link rel="lrdd" type="application/jrd+json" template="${SITE}/.well-known/webfinger?resource={uri}"/>
  <Link rel="self" type="application/json" href="${SITE}/api/agents.json"/>
  <Link rel="alternate" type="text/markdown" href="${SITE}/AGENTS.md"/>
  <Link rel="alternate" type="text/plain" href="${SITE}/llms.txt"/>
  <Link rel="http://schema.org/EntryPoint" type="application/json" href="${SITE}/api/openapi.json"/>
  <Link rel="http://docs.oasis-open.org/ns/xri/xrd-1.0" href="${SITE}/.well-known/api-catalog"/>
</XRD>
`;
  return new Response(body, {
    headers: {
      "Content-Type": "application/xrd+xml; charset=utf-8",
      "Cache-Control":
        "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
