"use client";

import { useState } from "react";

interface TrackedScoutShareActionsProps {
  shareUrl: string;
  twitterIntent: string;
  linkedinIntent: string;
}

type ShareChannel = "x" | "linkedin" | "copy";

type PostHogLike = {
  capture?: (event: string, properties?: Record<string, unknown>) => void;
  __loaded?: boolean;
};

function captureShare(channel: ShareChannel) {
  if (typeof window === "undefined") return;
  const posthog = (window as unknown as { posthog?: PostHogLike }).posthog;
  if (!posthog?.capture || !posthog.__loaded) return;
  try {
    posthog.capture("customer_share_clicked", {
      surface: "dashboard_scout",
      channel,
      share_kind: "scout",
      path: window.location.pathname,
    });
  } catch {
    // Analytics must never block the share action.
  }
}

export default function TrackedScoutShareActions({
  shareUrl,
  twitterIntent,
  linkedinIntent,
}: TrackedScoutShareActionsProps) {
  const [copied, setCopied] = useState(false);

  async function copyShareUrl() {
    captureShare("copy");
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-3">
      <input
        type="text"
        readOnly
        value={shareUrl}
        aria-label="Your attributed GitDealFlow share link"
        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-gray-100 font-mono text-xs"
      />
      <div className="flex flex-wrap gap-3">
        <a
          href={twitterIntent}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => captureShare("x")}
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-sm font-medium transition"
        >
          Share on X
        </a>
        <a
          href={linkedinIntent}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => captureShare("linkedin")}
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-slate-700 bg-slate-800/60 hover:border-sky-600 text-gray-200 text-sm font-medium transition"
        >
          Share on LinkedIn
        </a>
        <button
          type="button"
          onClick={copyShareUrl}
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-slate-700 bg-slate-800/60 hover:border-emerald-600 text-gray-200 text-sm font-medium transition"
        >
          {copied ? "Link copied" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
