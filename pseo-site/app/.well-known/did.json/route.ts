/**
 * /.well-known/did.json, DID document for did:web:signals.gitdealflow.com.
 *
 * Anchors the AT Protocol feed generator service. The Bluesky AppView resolves
 * the feed's serviceEndpoint by GET'ing this document, finding the
 * `BskyFeedGenerator` service entry, and routing /xrpc requests to it.
 *
 * Spec: https://atproto.com/specs/did
 */

export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";
const SERVICE_DID = "did:web:signals.gitdealflow.com";

export async function GET() {
  const body = {
    "@context": ["https://www.w3.org/ns/did/v1"],
    id: SERVICE_DID,
    service: [
      {
        id: "#bsky_fg",
        type: "BskyFeedGenerator",
        serviceEndpoint: SITE,
      },
    ],
  };
  return new Response(JSON.stringify(body, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "s-maxage=86400, stale-while-revalidate=604800",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
