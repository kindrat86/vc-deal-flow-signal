// NodeInfo discovery (https://nodeinfo.diaspora.software/protocol.html).
// Surfaces the project as a discoverable open-graph node — Mastodon admins,
// Lemmy crawlers, and federated indexers query this to learn about a service.
const BASE_URL = "https://signals.gitdealflow.com";

export async function GET() {
  const body = {
    links: [
      {
        rel: "http://nodeinfo.diaspora.software/ns/schema/2.1",
        href: `${BASE_URL}/.well-known/nodeinfo/2.1`,
      },
      {
        rel: "http://nodeinfo.diaspora.software/ns/schema/2.0",
        href: `${BASE_URL}/.well-known/nodeinfo/2.0`,
      },
    ],
  };
  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
