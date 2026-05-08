/**
 * <VideoEmbedBlock slug="..." /> — drop-in YouTube embed + VideoObject
 * JSON-LD for any page that wants to anchor a video from `content/videos.ts`.
 *
 * Renders:
 *   1. A privacy-enhanced YouTube iframe (or <video> for self-hosted).
 *   2. A separate <script type="application/ld+json"> with full VideoObject,
 *      Clip[] chapters, SeekToAction, transcript. Google merges multiple
 *      LD blocks on a page so this is additive — does not interfere with
 *      the host page's existing @graph.
 *
 * Used by /predicted (anchors sXFZHCKkROA) and /perfect-webinar (anchors
 * 6wgrWtR6eZg). Keeps the per-page JSON-LD lean while still giving Google /
 * Bing video carousels a complete VideoObject for the SERP.
 */

import Link from "next/link";
import {
  getVideoBySlug,
  isoDuration,
  embedUrl,
  watchPageUrl,
  publicUrl,
  type SiteVideo,
} from "@/content/videos";

const SITE = "https://signals.gitdealflow.com";
const APEX = "https://gitdealflow.com";

function fmtTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

function buildJsonLd(v: SiteVideo) {
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
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "@id": `${pageUrl}#video`,
    name: v.title,
    description: v.description,
    thumbnailUrl: [v.thumbnailMaxUrl, v.thumbnailUrl],
    contentUrl: v.contentUrl ?? undefined,
    embedUrl: embedUrl(v),
    uploadDate: v.uploadDate,
    duration: isoDuration(v.durationSeconds),
    isFamilyFriendly: true,
    inLanguage: "en-US",
    keywords: v.tags.join(", "),
    license: "https://creativecommons.org/licenses/by/4.0/",
    creditText:
      "The Data Nerd · Cartesia synthetic voice (anonymity-safe)",
    publisher: {
      "@type": "Organization",
      "@id": `${APEX}/#organization`,
      name: "VC Deal Flow Signal",
      url: APEX,
    },
    hasPart: clips,
    potentialAction: {
      "@type": "SeekToAction",
      target: v.youtubeId
        ? `https://www.youtube.com/watch?v=${v.youtubeId}&t={seek_to_second_number}s`
        : `${pageUrl}?t={seek_to_second_number}`,
      "startOffset-input": "required name=seek_to_second_number",
    },
    transcript: v.transcriptParagraphs.join("\n\n"),
    sameAs: v.youtubeId
      ? [publicUrl(v), `https://youtu.be/${v.youtubeId}`]
      : undefined,
    isPartOf: { "@id": `${SITE}/#website` },
  };
}

export function VideoEmbedBlock({
  slug,
  variant = "compact",
}: {
  slug: string;
  /** "compact" — smaller embed for inline use; "full" — hero-sized. */
  variant?: "compact" | "full";
}) {
  const v = getVideoBySlug(slug);
  if (!v) return null;

  const aspectClass =
    v.format === "short"
      ? "aspect-[9/16] max-w-sm mx-auto"
      : variant === "full"
        ? "aspect-video w-full"
        : "aspect-video w-full max-w-3xl mx-auto";

  return (
    <section
      className="space-y-4"
      aria-labelledby={`video-${slug}`}
      data-video-anchor={slug}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(v)) }}
      />
      <h2
        id={`video-${slug}`}
        className="sr-only"
      >
        {v.title}
      </h2>

      <figure
        className={`${aspectClass} overflow-hidden rounded-xl bg-black border border-slate-800 shadow-2xl`}
      >
        {v.youtubeId ? (
          <iframe
            title={v.title}
            src={embedUrl(v)}
            allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            className="w-full h-full border-0"
          />
        ) : v.contentUrl ? (
          <video
            controls
            preload="metadata"
            poster={v.thumbnailMaxUrl}
            playsInline
            className="w-full h-full"
            aria-label={v.title}
          >
            <source src={v.contentUrl} type="video/mp4" />
          </video>
        ) : null}
      </figure>

      <p className="text-xs text-slate-400 text-center">
        {fmtTime(v.durationSeconds)} ·{" "}
        {v.format === "short" ? "Short · 9:16" : "Long-form"} · synthetic voice ·
        CC BY 4.0 ·{" "}
        <Link
          href={`/watch/${v.slug}`}
          className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
        >
          Transcript + chapters
        </Link>
      </p>
    </section>
  );
}
