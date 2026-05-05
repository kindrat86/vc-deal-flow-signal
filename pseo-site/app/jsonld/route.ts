/**
 * /jsonld — index of per-page JSON-LD endpoints.
 *
 * The dynamic catch-all /jsonld/[...path] generates per-page schema graphs.
 * Without a base /jsonld response, agents probing the index 404. This route
 * returns a JSON-LD `Collection` listing the URL templates so agents can
 * resolve any startup, sector, stage, or signal page graph in one hop.
 */

import { NextResponse } from "next/server";
import { SIGNAL_TYPES } from "@/lib/data";

export const dynamic = "force-static";
export const runtime = "nodejs";
export const revalidate = 86400;

const SITE = "https://signals.gitdealflow.com";

export async function GET() {
  const collection = {
    "@context": "https://schema.org",
    "@type": "Collection",
    "@id": `${SITE}/jsonld`,
    name: "VC Deal Flow Signal — Per-Page JSON-LD Catalogue",
    description:
      "Index of dynamic JSON-LD graphs available at /jsonld/{path}. Each path returns a self-contained Schema.org `@graph` for the corresponding human-facing page (Article + BreadcrumbList + ItemList + Dataset / Organization / Observation / DefinedTerm where applicable).",
    publisher: {
      "@type": "Organization",
      "@id": "https://gitdealflow.com/#organization",
      name: "VC Deal Flow Signal",
      alternateName: "GitDealFlow",
      url: "https://gitdealflow.com",
    },
    license: "https://creativecommons.org/licenses/by/4.0/",
    inLanguage: "en-US",
    hasPart: [
      {
        "@type": "WebAPI",
        name: "Stage page graph",
        urlTemplate: `${SITE}/jsonld/stage/{stageSlug}`,
        description:
          "Schema.org graph for /stage/{stage} pages — Article + BreadcrumbList + ItemList of startups + DefinedTerm + Table.",
        examples: [
          `${SITE}/jsonld/stage/seed`,
          `${SITE}/jsonld/stage/series-a`,
        ],
      },
      {
        "@type": "WebAPI",
        name: "Stage × sector page graph",
        urlTemplate: `${SITE}/jsonld/stage/{stageSlug}/{sectorSlug}`,
        description:
          "Per-stage, per-sector startup ranking with Article + BreadcrumbList + ItemList.",
        examples: [`${SITE}/jsonld/stage/seed/ai-ml`],
      },
      {
        "@type": "WebAPI",
        name: "Stage × signal-type page graph",
        urlTemplate: `${SITE}/jsonld/stage/{stageSlug}/signal/{signalSlug}`,
        description:
          "Stage filtered by signal-type with Article + BreadcrumbList + ItemList.",
        examples: [`${SITE}/jsonld/stage/seed/signal/breakout`],
      },
      {
        "@type": "WebAPI",
        name: "Signal-type page graph",
        urlTemplate: `${SITE}/jsonld/signals/{signalSlug}`,
        description:
          "Signal-type explainer + cross-sector list. Article + DefinedTerm + ItemList.",
        examples: SIGNAL_TYPES.slice(0, 3).map(
          (s) => `${SITE}/jsonld/signals/${s.slug}`,
        ),
      },
      {
        "@type": "WebAPI",
        name: "Signal × sector page graph",
        urlTemplate: `${SITE}/jsonld/signals/{signalSlug}/{sectorSlug}`,
        description:
          "Signal-type filtered by sector. Article + BreadcrumbList + ItemList.",
        examples: [`${SITE}/jsonld/signals/breakout/ai-ml`],
      },
      {
        "@type": "WebAPI",
        name: "Startup profile graph",
        urlTemplate: `${SITE}/jsonld/startup/{startupSlug}`,
        description:
          "Per-startup graph: Organization + Article + BreadcrumbList + Dataset (history) + ItemList + DefinedTerm.",
      },
      {
        "@type": "WebAPI",
        name: "Startup × period graph",
        urlTemplate: `${SITE}/jsonld/startup/{startupSlug}/{periodSlug}`,
        description:
          "Per-startup, per-period observation. Article + BreadcrumbList + Observation.",
      },
      {
        "@type": "WebAPI",
        name: "Startups-to-watch sector page graph",
        urlTemplate: `${SITE}/jsonld/startups-to-watch/{sectorSlug}-{periodSlug}`,
        description:
          "Sector × period ranking. Article + BreadcrumbList + ItemList.",
      },
    ],
    sameAs: [
      `${SITE}/.well-known/dataset.json`,
      `${SITE}/api/openapi.json`,
      `${SITE}/.well-known/agent-card.json`,
      `${SITE}/standards`,
    ],
  };

  return NextResponse.json(collection, {
    headers: {
      "Content-Type": "application/ld+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "X-Robots-Tag": "index, follow",
      Link: `<https://creativecommons.org/licenses/by/4.0/>; rel="license"`,
    },
  });
}
