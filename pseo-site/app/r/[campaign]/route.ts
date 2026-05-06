import { buildDestination, findCampaign } from "@/lib/paid-acquisition";

/**
 * /r/[campaign] — short-URL 308 redirect for paid ad creatives.
 *
 * Why a Route Handler instead of a Page (changed 2026-05-06):
 *   The original implementation was an async Server Component using
 *   `permanentRedirect()` from `next/navigation`. On Next.js 16.2.3 this
 *   intermittently returned a 200 with the layout shell instead of a 308 —
 *   the redirect throw was swallowed somewhere in the render pipeline,
 *   leaving the function with no JSX return and Next rendered just the
 *   layout. Route handlers don't go through the rendering pipeline, so a
 *   bare `Response(null, { status: 308, headers: { Location } })` is
 *   unambiguous.
 *
 * Behavior:
 *   - Live + draft campaigns → 308 to `buildDestination(campaign)`
 *     (a /firstlook URL with full UTM payload).
 *   - Paused or killed campaigns → 404 (so old click-throughs from past
 *     budget windows stop landing in the funnel).
 *   - Unknown slug → 404.
 *
 * Cache-Control: must-revalidate so a campaign-status flip (live → paused)
 * propagates instantly without manual purge.
 */

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ campaign: string }> },
): Promise<Response> {
  const { campaign: slug } = await params;

  try {
    const campaign = findCampaign(slug);

    if (!campaign) {
      // Wrong slug = paid ad copy is pointing at a campaign we deleted.
      // Worth logging for paid-spend debugging — every 404 here is wasted CPC.
      console.warn(
        `[/r/${slug}] 404 — unknown campaign slug. Referer: ${req.headers.get("referer") ?? "(none)"}`,
      );
      return new Response("Not found", { status: 404 });
    }
    if (campaign.status === "paused" || campaign.status === "killed") {
      console.info(
        `[/r/${slug}] 404 — campaign in '${campaign.status}' state (intentional kill).`,
      );
      return new Response("Campaign no longer active", { status: 404 });
    }

    const destination = buildDestination(campaign);
    console.info(
      `[/r/${slug}] 308 → ${destination} (status=${campaign.status})`,
    );

    return new Response(null, {
      status: 308,
      headers: {
        Location: destination,
        "Cache-Control": "public, max-age=0, must-revalidate",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
    });
  } catch (err) {
    // Unexpected — log loud so we notice on next deploy log scan.
    console.error(`[/r/${slug}] redirect failed:`, err);
    return new Response("Redirect error", { status: 500 });
  }
}
