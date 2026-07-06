/**
 * /api/v1/affiliates.json — programmatic affiliate-program endpoint.
 *
 * Traffic Secrets Ch 15 (Letterman / Affiliate Army) + Ch 17 (Sneaky
 * Affiliate Funnel) — agent-side discoverability of the program. Lists
 * commission terms, swipe-kit templates by archetype, leaderboard
 * snapshot, and the Refgrow signup URL. Crawlers and agents can use
 * this single endpoint to surface the program in third-party
 * directories, agent-recommendation flows, and "ways to monetize this
 * audience" pickers.
 *
 * Cached at the edge for 1 hour. Pseudonymized leaderboard data only —
 * no PII, no real names.
 */

import { NextResponse } from "next/server";
import {
  LEADERBOARD,
  LEADERBOARD_SNAPSHOT_DATE,
  PROGRAM_STATS,
  ARCHETYPE_LABEL,
} from "@/content/affiliate-leaderboard";
import {
  SWIPE_TEMPLATES,
  SWIPE_KIT_META,
} from "@/content/affiliate-swipe-kit";

export const dynamic = "force-dynamic";

const SITE = "https://signals.gitdealflow.com";
const PORTAL_URL = "https://gitdealflow.refgrow.com";

export async function GET() {
  const body = {
    schema_version: "1.0.0",
    program_name: "GitDealFlow Affiliate Program",
    last_updated: LEADERBOARD_SNAPSHOT_DATE,
    landing_page: `${SITE}/affiliates`,
    leaderboard_page: `${SITE}/affiliates/leaderboard`,
    swipe_kit_page: `${SITE}/affiliates/funnel-hack`,
    signup_url: PORTAL_URL,
    terms: {
      commission_rate: "20% lifetime recurring",
      commission_per_sector_sweep_eur: 399,
      commission_per_insider_circle_eur_per_month: 19.4,
      commission_per_dashboard_eur_per_month: 1.99,
      attribution: "60-day last-click cookie",
      payout_method: "Stripe",
      payout_minimum_eur: 50,
      payout_holdback_days: 60,
      cookie_window_days: 60,
      payment_frequency: "monthly",
      currency: "EUR",
      tracking_param: "?via=AFFILIATE_ID",
    },
    bait: {
      product: "free 31k-word book",
      url: `${SITE}/book`,
      price_eur: 0,
      drip_sequence_emails: 3,
      drip_window_days: 7,
      mechanism:
        SWIPE_KIT_META.trackingMechanism,
    },
    program_stats: {
      affiliates_total: PROGRAM_STATS.totalAffiliates,
      active_30d: PROGRAM_STATS.activeAffiliates30d,
      total_commissions_lifetime_range_eur:
        PROGRAM_STATS.totalCommissionsLifetimeRange,
      avg_earnings_per_active_30d:
        PROGRAM_STATS.averageEarningsPerActiveAffiliate,
      top_conversion_rate: PROGRAM_STATS.topConversionRate,
      top_conversion_rate_archetype: PROGRAM_STATS.topConversionRateProduct,
      median_days_to_first_conversion:
        PROGRAM_STATS.averageDaysToFirstConversion,
    },
    leaderboard: LEADERBOARD.map((row, i) => ({
      rank: i + 1,
      pseudonym: row.pseudonym,
      archetype: row.archetype,
      archetype_label: ARCHETYPE_LABEL[row.archetype],
      audience: row.audience,
      tier: row.tier,
      commission_range_eur: row.commissionRange,
      conversion_rate: row.conversionRate,
      top_product_referred: row.topProductReferred,
      badges: row.badges,
      joined_month: row.joinedMonth,
    })),
    swipe_kit: {
      total_templates: SWIPE_KIT_META.totalTemplates,
      avg_downstream_conversion_rate:
        SWIPE_KIT_META.averageDownstreamConversionRate,
      templates: SWIPE_TEMPLATES.map((t) => ({
        id: t.id,
        archetype: t.archetype,
        title: t.title,
        best_for: t.bestFor,
        time_to_customize: t.estimatedTimeToCustomize,
        expected_cvr: t.expectedCVR,
        body_url: `${SITE}/affiliates/funnel-hack#${t.id}`,
      })),
    },
    prohibited_channels: SWIPE_KIT_META.prohibitedChannels,
    contact: {
      email: "affiliates@gitdealflow.com",
      response_time_hours: 24,
    },
    license: "CC BY 4.0 — methodology paper at ssrn.com/abstract=6606558",
  };

  return NextResponse.json(body, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
