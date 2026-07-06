// /api/v1/videos.json — versioned video catalog for AI agents and crawlers.
//
// Single-source-of-truth for every video this site exposes. Mirrors what the
// /sitemap-videos.xml emits but in agent-friendly JSON-LD with full chapter
// timing, transcript paragraphs, and SeekToAction wiring per video. Pinned
// at /api/v1/* so consumers can cite a stable shape even after the
// underlying canonical /watch/[slug] HTML changes.
//
// CORS-enabled, license CC BY 4.0. Cached 1h at the edge.

import { NextResponse } from "next/server";
import {
  videos,
  isoDuration,
  watchPageUrl,
  embedUrl,
  publicUrl,
} from "@/content/videos";

export const dynamic = "force-dynamic";

const SITE = "https://signals.gitdealflow.com";
const APEX = "https://gitdealflow.com";

export async function GET() {
  const items = videos.map((v) => {
    const pageUrl = watchPageUrl(v.slug);
    const clips = v.chapters.map((c, i) => ({
      "@type": "Clip",
      "@id": `${pageUrl}#clip-${i + 1}`,
      name: c.name,
      startOffset: c.start,
      endOffset: c.end,
      url: v.youtubeId
        ? `https://www.youtube.com/watch?v=${v.youtubeId}&t=${c.start}s`
        : `${pageUrl}?t=${c.start}`,
    }));

    return {
      "@type": "VideoObject",
      "@id": `${pageUrl}#video`,
      slug: v.slug,
      youtubeId: v.youtubeId,
      name: v.title,
      description: v.description,
      thumbnailUrl: [v.thumbnailMaxUrl, v.thumbnailUrl],
      contentUrl: v.contentUrl,
      embedUrl: embedUrl(v),
      uploadDate: v.uploadDate,
      duration: isoDuration(v.durationSeconds),
      durationSeconds: v.durationSeconds,
      format: v.format,
      isFamilyFriendly: true,
      inLanguage: "en-US",
      keywords: v.tags,
      license: "https://creativecommons.org/licenses/by/4.0/",
      creditText:
        "The Data Nerd · Cartesia synthetic voice (anonymity-safe)",
      url: pageUrl,
      sameAs: v.youtubeId
        ? [publicUrl(v), `https://youtu.be/${v.youtubeId}`]
        : [],
      hasPart: clips,
      transcript: v.transcriptParagraphs.join("\n\n"),
      transcriptParagraphs: v.transcriptParagraphs,
      transcriptVttUrl: `${SITE}/api/v1/transcripts/${v.slug}`,
      transcriptPlainUrl: `${SITE}/api/v1/transcripts/${v.slug}`,
      chapters: v.chapters,
      embeddedOn: v.embeddedOn,
      potentialAction: {
        "@type": "SeekToAction",
        target: v.youtubeId
          ? `https://www.youtube.com/watch?v=${v.youtubeId}&t={seek_to_second_number}s`
          : `${pageUrl}?t={seek_to_second_number}`,
        "startOffset-input": "required name=seek_to_second_number",
      },
    };
  });

  const body = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE}/api/v1/videos.json`,
    name: "VC Deal Flow Signal — Video Catalog",
    description:
      "Every video this site exposes — YouTube uploads, self-hosted demos — with chapter timing, transcripts, and SeekToAction targets. Anonymity-safe (Cartesia synthetic voice; no founder face/voice/name).",
    license: "https://creativecommons.org/licenses/by/4.0/",
    publisher: {
      "@type": "Organization",
      "@id": `${APEX}/#organization`,
      name: "VC Deal Flow Signal",
      alternateName: "GitDealFlow",
      url: APEX,
    },
    dateModified: new Date().toISOString().slice(0, 10),
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: it.url,
      item: it,
    })),
    _meta: {
      version: "1",
      sitemapVideos: `${SITE}/sitemap-videos.xml`,
      catalogPage: `${SITE}/watch`,
      contractVersion: "2026-05-08.veo1",
      attribution:
        "VC Deal Flow Signal (signals.gitdealflow.com), Q2 2026 data.",
    },
  };

  return NextResponse.json(body, {
    headers: {
      "Content-Type": "application/ld+json; charset=utf-8",
      "Cache-Control":
        "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "index, follow",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
