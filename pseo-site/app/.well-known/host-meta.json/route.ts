/**
 * RFC 6415 §3.1, host-meta JRD variant.
 * JSON sibling of /.well-known/host-meta. Some agents prefer JSON.
 */

export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export async function GET() {
  const body = {
    subject: SITE,
    properties: {
      "http://schema.org/name": "VC Deal Flow Signal",
      "http://schema.org/alternateName": "GitDealFlow",
    },
    links: [
      {
        rel: "lrdd",
        type: "application/jrd+json",
        template: `${SITE}/.well-known/webfinger?resource={uri}`,
      },
      {
        rel: "describedby",
        type: "application/json",
        href: `${SITE}/.well-known/ai-policy.json`,
      },
      {
        rel: "describedby",
        type: "application/json",
        href: `${SITE}/.well-known/agent-card.json`,
      },
      {
        rel: "alternate",
        type: "application/feed+json",
        href: `${SITE}/feed.json`,
      },
      {
        rel: "alternate",
        type: "application/rss+xml",
        href: `${SITE}/feed.xml`,
      },
      {
        rel: "alternate",
        type: "text/plain",
        href: `${SITE}/llms.txt`,
      },
    ],
  };
  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "Content-Type": "application/jrd+json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
