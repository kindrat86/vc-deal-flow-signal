/**
 * /.well-known/agent.json — singular alias for agent-card discovery.
 *
 * The A2A spec settled on `agent-card.json` but a number of early adopters
 * probe `agent.json`. Redirect rather than duplicate.
 */

export const runtime = "nodejs";

export async function GET() {
  return new Response(null, {
    status: 308,
    headers: {
      Location: "https://signals.gitdealflow.com/.well-known/agent-card.json",
      "Cache-Control": "s-maxage=86400, stale-while-revalidate=604800",
      "X-Robots-Tag": "index, follow",
    },
  });
}
