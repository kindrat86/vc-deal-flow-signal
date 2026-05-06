import { notFound, redirect, permanentRedirect } from "next/navigation";
import { buildDestination, findCampaign } from "@/lib/paid-acquisition";

/**
 * /r/[campaign] — short-URL redirect for paid ad creatives.
 *
 * Example: a Reddit ad for the r/venturecapital subreddit links to
 *   https://signals.gitdealflow.com/r/vc
 * which 308-redirects to
 *   https://signals.gitdealflow.com/firstlook
 *     ?utm_source=reddit&utm_medium=cpc
 *     &utm_campaign=vc-2026-05&utm_content=venturecapital
 *
 * Why we redirect rather than serve the landing inline:
 *   - Ad networks count the URL on click — short, brand-clean URLs lift CTR.
 *   - The destination stays one canonical static page (`/firstlook`),
 *     so SEO and OG previews aren't fragmented per-campaign.
 *   - `paused` and `killed` campaigns return 404 so old click-throughs
 *     stop landing in the funnel after budget cuts.
 *
 * The route is dynamic (depends on the slug) but the response is just a
 * redirect, so we keep this as a server component without `'use cache'`.
 */
export const dynamic = "force-dynamic";

export default async function PaidRedirect({
  params,
}: {
  params: Promise<{ campaign: string }>;
}) {
  const { campaign: slug } = await params;
  const campaign = findCampaign(slug);

  if (!campaign) notFound();

  if (campaign.status === "paused" || campaign.status === "killed") {
    notFound();
  }

  const destination = buildDestination(campaign);

  // 308 for live + draft (draft is intentional during QA — we want to
  // verify the redirect resolves correctly before flipping to live).
  permanentRedirect(destination);
  // Fallback (unreachable) — keeps the type-checker happy.
  redirect(destination);
}
