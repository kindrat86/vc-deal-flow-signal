/**
 * /api/v1/transcripts/[slug] — WebVTT transcript for a given video.
 *
 * Returns text/vtt with cue blocks aligned to chapter timing from
 * `content/videos.ts`. Each transcript paragraph is split across the
 * available chapters in proportion, so a player or agent can consume
 * cues with start/end seconds.
 *
 * Negotiates content type via Accept header:
 *   - text/plain → newline-joined transcript paragraphs
 *   - text/vtt   → WebVTT cues (default)
 *
 * Used by:
 *   - /watch/[slug] pages can <track src=...> them
 *   - Agents that want speakable text without parsing JSON-LD
 *   - Search engines that index transcript files for video search
 */

import { NextResponse } from "next/server";
import { getVideoBySlug, getAllVideoSlugs } from "@/content/videos";

// NOT force-static — content-type varies on Accept. Edge caches per
// Accept value via the Vary header set on the response.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export function generateStaticParams() {
  return getAllVideoSlugs().map((slug) => ({ slug }));
}

function fmtVttTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}.000`;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const v = getVideoBySlug(slug);
  if (!v) {
    return NextResponse.json(
      {
        error: "video_not_found",
        slug,
        availableSlugs: getAllVideoSlugs(),
        catalog: `${SITE}/api/v1/videos.json`,
      },
      { status: 404 },
    );
  }

  // Distribute transcript paragraphs across chapters proportionally so
  // each cue lands within a chapter window. If counts mismatch, we
  // duplicate or split paragraphs to fill chapter slots.
  const chapters = v.chapters;
  const paras = v.transcriptParagraphs;
  const cues: { start: number; end: number; text: string }[] = [];

  if (chapters.length === paras.length) {
    chapters.forEach((c, i) => {
      cues.push({ start: c.start, end: c.end, text: paras[i] });
    });
  } else {
    // Fallback: even-split paragraphs across the full duration.
    const dur = v.durationSeconds;
    const slot = dur / paras.length;
    paras.forEach((p, i) => {
      cues.push({
        start: Math.floor(i * slot),
        end: Math.floor((i + 1) * slot),
        text: p,
      });
    });
  }

  // Content negotiation
  const accept = request.headers.get("accept") ?? "";
  const wantsPlain =
    accept.includes("text/plain") && !accept.includes("text/vtt");

  if (wantsPlain) {
    const body = paras.join("\n\n") + "\n";
    return new Response(body, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control":
          "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
        "X-Robots-Tag": "index, follow",
        "Access-Control-Allow-Origin": "*",
        "Vary": "Accept",
        "Link": `<${SITE}/watch/${slug}>; rel="canonical"`,
      },
    });
  }

  // WebVTT (default)
  const vttCues = cues
    .map((c, i) => {
      return `${i + 1}\n${fmtVttTime(c.start)} --> ${fmtVttTime(c.end)}\n${c.text}`;
    })
    .join("\n\n");

  const body = `WEBVTT
Kind: captions
Language: en
NOTE Synthetic narration — Cartesia "Theo" voice. Anonymity-safe per project rule (no founder face/voice/name). License: CC BY 4.0.
NOTE Source: ${SITE}/watch/${slug}
NOTE Catalog: ${SITE}/api/v1/videos.json

${vttCues}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/vtt; charset=utf-8",
      "Cache-Control":
        "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      "X-Robots-Tag": "index, follow",
      "Access-Control-Allow-Origin": "*",
      "Vary": "Accept",
      "Link": `<${SITE}/watch/${slug}>; rel="canonical"`,
    },
  });
}
