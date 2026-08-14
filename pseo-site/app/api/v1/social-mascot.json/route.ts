/**
 * /api/v1/social-mascot.json, programmatic Data Nerd mascot bible.
 *
 * Traffic Secrets Ch 7 + Ch 8 (Instagram + Facebook playbook) under
 * an anonymity-respecting frame: synthetic mascot stays consistent
 * across every channel via a single source of truth. Cross-posters,
 * affiliate community managers, and AI agents that surface our
 * content can fetch this once and stay aligned with brand voice.
 *
 * Cached at the edge for 1 hour. Mirror of /data-nerd/social.
 */

import { NextResponse } from "next/server";
import {
  DATA_NERD,
  HASHTAG_BANK,
  POSTING_HOURS_UTC,
} from "@/content/social-mascot";
import { SOCIAL_BATCH, BATCH_META } from "@/content/social-content-batch";

export const dynamic = "force-dynamic";

const SITE = "https://signals.gitdealflow.com";

export async function GET() {
  const body = {
    schema_version: "1.0.0",
    mascot_name: DATA_NERD.name,
    bible_page: `${SITE}/data-nerd/social`,
    hub_page: `${SITE}/data-nerd`,
    last_updated: BATCH_META.generatedAt,
    handles: DATA_NERD.handles,
    handle_status: DATA_NERD.status,
    visual_identity: DATA_NERD.visual,
    voice: DATA_NERD.voice,
    tone: DATA_NERD.tone,
    pillars: DATA_NERD.pillars.map((p) => ({
      slug: p.slug,
      label: p.label,
      target_ratio: p.ratio,
      description: p.description,
      example_post: p.example,
    })),
    cadence: DATA_NERD.cadence,
    posting_hours_utc: POSTING_HOURS_UTC,
    hashtag_bank: HASHTAG_BANK,
    artefacts: Object.fromEntries(
      Object.entries(DATA_NERD.artefacts).map(([k, v]) => [k, `${SITE}${v}`]),
    ),
    sample_batch: {
      total: BATCH_META.total,
      pillar_mix: BATCH_META.pillarMix,
      by_primary_channel: BATCH_META.byPrimaryChannel,
      posts: SOCIAL_BATCH.map((p) => ({
        id: p.id,
        pillar: p.pillar,
        primary: p.primary,
        cross_post_to: p.crossPostTo,
        scheduled_iso_date: p.scheduledIsoDate,
        bodies: p.bodies,
        image_spec: p.imageSpec,
      })),
    },
    repurpose_rule:
      "All content originates as a Data Nerd post. The framework + the data + the methodology paper do the talking. The founder's identity stays anonymous.",
    license: "CC BY 4.0, methodology paper at ssrn.com/abstract=6606558",
  };

  return NextResponse.json(body, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
