import { NextResponse } from "next/server";
import { AFFILIATE_PROGRAM_FACTS } from "@/content/affiliate-leaderboard";
import {
  SWIPE_TEMPLATES,
  SWIPE_KIT_META,
} from "@/content/affiliate-swipe-kit";

/**
 * Programmatic affiliate-program endpoint.
 *
 * This endpoint exposes only verifiable terms and templates. The previous
 * version embedded unsupported partner counts, earnings, and CVRs. Real partner
 * results can be added only after they exist in the Refgrow dashboard.
 */
export const dynamic = "force-dynamic";

const SITE = "https://signals.gitdealflow.com";

export async function GET() {
  const body = {
    schema_version: "2.0.0",
    program_name: "GitDealFlow Affiliate Program",
    last_verified: AFFILIATE_PROGRAM_FACTS.lastVerified,
    landing_page: `${SITE}/affiliates`,
    swipe_kit_page: `${SITE}/affiliates/funnel-hack`,
    signup_url: AFFILIATE_PROGRAM_FACTS.portalUrl,
    terms: {
      commission_rate: AFFILIATE_PROGRAM_FACTS.commissionRate,
      commission_per_dashboard_eur_per_month: 9.8,
      commission_per_sector_sweep_eur: 399.4,
      terms_source: AFFILIATE_PROGRAM_FACTS.portalUrl,
    },
    earnings_history: {
      status: "no_publishable_history",
      note:
        "The program is open but young. No affiliate earnings have been paid out yet; when they are, figures will come from the Refgrow dashboard.",
    },
    swipe_kit: {
      total_templates: SWIPE_KIT_META.totalTemplates,
      templates: SWIPE_TEMPLATES.map((template) => ({
        id: template.id,
        archetype: template.archetype,
        title: template.title,
        best_for: template.bestFor,
        time_to_customize: template.estimatedTimeToCustomize,
        body_url: `${SITE}/affiliates/funnel-hack#${template.id}`,
      })),
    },
    prohibited_channels: SWIPE_KIT_META.prohibitedChannels,
    contact: { email: "signals@gitdealflow.com" },
    license: "CC BY 4.0, methodology paper at ssrn.com/abstract=6606558",
  };

  return NextResponse.json(body, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
