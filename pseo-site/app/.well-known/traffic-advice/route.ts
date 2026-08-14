/**
 * /.well-known/traffic-advice, Google "private prefetch proxy" advisory.
 *
 * Spec: https://github.com/buettner/private-prefetch-proxy/blob/main/traffic-advice.md
 *
 * Tells Chrome's private prefetch proxy that we accept prefetch requests
 * for our domain. Without it, Chrome conservatively skips prefetching us,
 * adding 100-300ms to first-paint for users who arrive via Google.
 *
 * The Content-Type MUST be `application/trafficadvice+json` per the spec -
 * a generic `application/json` content-type causes Chrome to reject the file.
 */

export const dynamic = "force-static";
export const runtime = "nodejs";

export async function GET() {
  const body = JSON.stringify(
    [
      {
        user_agent: "prefetch-proxy",
        fraction: 1.0,
      },
    ],
    null,
    2,
  );

  return new Response(body, {
    headers: {
      "Content-Type": "application/trafficadvice+json; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=604800",
      "Access-Control-Allow-Origin": "*",
      "X-Robots-Tag": "noindex",
    },
  });
}
