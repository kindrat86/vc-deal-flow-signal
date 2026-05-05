/**
 * /xrpc/app.bsky.feed.describeFeedGenerator
 *
 * Describes which feeds this generator service hosts. Bluesky AppViews and
 * client tooling call this to discover the feed's owning DID and the list of
 * feed records (URIs) served by this endpoint.
 *
 * Spec: https://docs.bsky.app/docs/category/feed-generator
 */

export const runtime = "nodejs";

const SERVICE_DID = "did:web:signals.gitdealflow.com";

// Owner DID for thedatanerd.bsky.social, resolved 2026-05-03. Hardcoded so
// the endpoint is fully static and doesn't depend on PLC directory uptime.
const OWNER_DID =
  process.env.BLUESKY_FEED_OWNER_DID || "did:plc:xaejsj7fkpehxurvzrbnt3fb";

const FEED_RKEY = "github-vc-signals";

export async function GET() {
  const body = {
    did: SERVICE_DID,
    feeds: [
      {
        uri: `at://${OWNER_DID}/app.bsky.feed.generator/${FEED_RKEY}`,
      },
    ],
  };
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
