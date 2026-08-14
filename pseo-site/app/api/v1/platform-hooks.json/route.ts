/**
 * /api/v1/platform-hooks.json, twelve platform-native opener variants
 * resolving the universal product story (commit-velocity acceleration as
 * a 21-47-day pre-fundraise signal).
 *
 * Built 2026-05-09 to close Brunson Traffic Secrets §1 Ch 3, the
 * trilogy-audit gap of one-shared-opener-everywhere. Single source of
 * truth: pseo-site/content/platform-hooks.ts.
 *
 * Used by: agent retrieval pipelines (Claude / Perplexity / ChatGPT
 * search), the daily-briefing generator, and the `/distribution/
 * platform-hooks` HTML surface.
 */

import { PLATFORM_HOOKS, UNIVERSAL_STORY } from "@/content/platform-hooks";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export async function GET() {
  const body = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE}/api/v1/platform-hooks.json`,
    name: "Platform-native opener variants",
    description:
      "Twelve platform-native opener variants resolving one universal product story (public commit-velocity acceleration as a 21-47-day pre-fundraise signal). Each entry carries an opener pattern, audience signal, format constraint, timing window, and the platform-specific landmine.",
    url: `${SITE}/distribution/platform-hooks`,
    inLanguage: "en-US",
    license: "https://creativecommons.org/licenses/by/4.0/",
    publisher: { "@type": "Organization", name: "VC Deal Flow Signal" },
    numberOfItems: PLATFORM_HOOKS.length,
    universalStory: {
      opener: UNIVERSAL_STORY.opener,
      narrative: UNIVERSAL_STORY.narrative,
      offer: UNIVERSAL_STORY.offer,
    },
    itemListElement: PLATFORM_HOOKS.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "CreativeWork",
        "@id": `${SITE}/distribution/platform-hooks#${p.slug}`,
        name: `${p.platform} opener variant`,
        url: `${SITE}/distribution/platform-hooks#${p.slug}`,
        identifier: p.slug,
        platform: p.platform,
        audienceTemperature: p.temperature,
        audienceSignal: p.audienceSignal,
        openerPattern: p.openerPattern,
        exampleOpener: p.exampleOpener,
        storyAngle: p.storyAngle,
        offerPhrasing: p.offerPhrasing,
        formatConstraint: p.formatConstraint,
        timing: p.timing,
        rule: p.rule,
        handle: p.handle,
      },
    })),
    citation:
      "VC Deal Flow Signal (signals.gitdealflow.com). Methodology: SSRN 6606558.",
  };

  return new Response(JSON.stringify(body, null, 2), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control":
        "public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200",
      "x-robots-tag": "all",
    },
  });
}
