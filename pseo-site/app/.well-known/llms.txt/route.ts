/**
 * /.well-known/llms.txt — discovery alias.
 *
 * Some agents probe `/.well-known/llms.txt` per the proposed convention before
 * falling back to root `/llms.txt`. We 308-redirect to keep one canonical body
 * (no drift) and pass through the cache.
 */

export const runtime = "nodejs";

export async function GET() {
  return new Response(null, {
    status: 308,
    headers: {
      Location: "https://signals.gitdealflow.com/llms.txt",
      "Cache-Control": "s-maxage=86400, stale-while-revalidate=604800",
      "X-Robots-Tag": "index, follow",
    },
  });
}
