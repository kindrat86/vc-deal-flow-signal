"use client";

/**
 * <YouTubePoster />a click-to-YouTube facade used in place of a raw
 * <iframe> embed.
 *
 * The channel's videos have "Allow embedding" turned OFF on YouTube, so a
 * youtube-nocookie <iframe> renders YouTube's grey "Error 153, Video player
 * configuration error" box instead of a player. Rather than show a broken
 * embed, we render the (always-available) thumbnail with a play button that
 * opens the real watch page on youtube.com in a new tab.
 *
 * Bonus: no heavy YouTube iframe on load → better Core Web Vitals. The
 * VideoObject JSON-LD on the host page is unaffected (still emitted), so the
 * SERP video carousel keeps working.
 *
 * Client component only for the maxres→hq thumbnail onError fallback, so the
 * poster itself can never become a broken-image box.
 */

import { useState } from "react";

export function YouTubePoster({
  thumbnailMaxUrl,
  thumbnailUrl,
  watchUrl,
  title,
}: {
  /** Preferred (maxresdefault) thumbnail. */
  thumbnailMaxUrl: string;
  /** Fallback (hqdefault) thumbnail, always exists for a real video. */
  thumbnailUrl: string;
  /** Public youtube.com watch URL the poster links to. */
  watchUrl: string;
  title: string;
}) {
  const [src, setSrc] = useState(thumbnailMaxUrl);

  return (
    <a
      href={watchUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block h-full w-full"
      aria-label={`Play “${title}” on YouTube`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={title}
        loading="lazy"
        onError={() => {
          if (src !== thumbnailUrl) setSrc(thumbnailUrl);
        }}
        className="h-full w-full object-cover"
      />
      <span className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/15">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-lg transition-transform group-hover:scale-110">
          <svg
            viewBox="0 0 24 24"
            fill="white"
            className="ml-1 h-7 w-7"
            aria-hidden="true"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
      <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-[11px] font-medium text-white">
        Watch on YouTube
      </span>
    </a>
  );
}
