"use client";

/**
 * EmbedThisCard — a per-page "Embed this" copy-button.
 *
 * Distribution lever (Phase 3 of marketing/seo-authority-and-indexation-2026-05-30.md):
 * every site that embeds one of our widgets bakes in a CC BY 4.0 attribution link,
 * which is a natural, editorial, anonymity-compatible backlink. The central /embed
 * hub already lists every snippet, but a single-tap copy box on the *individual*
 * page (where a reader is already convinced the card is useful) converts far better
 * than asking them to go hunt the hub. Mirrors the iframe contract used by /embed.
 *
 * The iframe surface (/embed/*) is itself noindex,follow, so this never creates a
 * duplicate-content competitor — it only hands out a backlink-bearing snippet.
 */

import { useState } from "react";

interface Props {
  /** Embeddable iframe path, e.g. "/embed/define/scout-score". */
  embedPath: string;
  /** Fixed iframe height in px (define cards don't auto-resize). */
  height?: number;
  /** Human label for the iframe title + button copy, e.g. "Scout Score". */
  label: string;
}

const SITE = "https://signals.gitdealflow.com";

export default function EmbedThisCard({ embedPath, height = 200, label }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const snippet = `<iframe src="${SITE}${embedPath}" width="100%" height="${height}" frameborder="0" loading="lazy" title="${label} — GitDealFlow"></iframe>`;

  const copy = () => {
    navigator.clipboard.writeText(snippet).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="mt-4 border-t border-slate-800 pt-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-gray-400 hover:text-sky-400 transition-colors cursor-pointer"
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
          />
        </svg>
        Embed this {label} card
      </button>

      {open ? (
        <div className="mt-3">
          <div className="flex items-start gap-2">
            <pre className="flex-1 text-[11px] font-mono text-gray-300 bg-slate-950/60 rounded p-3 overflow-x-auto whitespace-pre-wrap break-all">
              {snippet}
            </pre>
            <button
              type="button"
              onClick={copy}
              className="shrink-0 rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-xs text-gray-300 hover:text-sky-400 hover:border-sky-500/40 transition-colors cursor-pointer"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Free to embed ·{" "}
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              className="text-sky-400 hover:text-sky-300"
              rel="noopener noreferrer"
              target="_blank"
            >
              CC BY 4.0
            </a>{" "}
            — attribution to gitdealflow is baked into the widget.
          </p>
        </div>
      ) : null}
    </div>
  );
}
