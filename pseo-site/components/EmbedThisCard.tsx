"use client";

/**
 * EmbedThisCard — a per-page "Embed this" copy-button that hands out a
 * backlink-bearing snippet.
 *
 * Off-page authority is the binding constraint on the composite SEO score for
 * an anonymous, pre-revenue entity (see
 * marketing/seo-authority-and-indexation-2026-05-30.md). On-page/pSEO is maxed;
 * the lever is external, editorial links. Embed widgets are the one
 * anonymity-compatible, code-movable backlink source: every site that pastes
 * our snippet bakes in attribution.
 *
 * ── Why the snippet ships a visible <a>, not just an <iframe> ──────────────
 * A bare iframe embed passes ZERO link equity. The only anchor in an
 * iframe-only snippet lives inside OUR /embed/* document — which is
 * `noindex,follow` and, being our own page, is a self-link. The host page's
 * DOM contains no crawlable link to us, so Google associates no backlink.
 *
 * The fix (standard Datawrapper / Flourish / DataWrapper embed pattern): the
 * snippet pairs the iframe with a visible attribution <a href> that points at
 * the *indexable* canonical page (`sourcePath`, NOT the /embed URL). That
 * anchor lives in the embedder's own HTML → a real, crawlable, equity-passing
 * editorial backlink to a page we actually want ranked. The iframe stays the
 * visual payload; the anchor is the SEO payload.
 *
 * Mirrors the proven ShareBar clipboard UX.
 */

import { useState } from "react";

interface Props {
  /** Embeddable iframe path (noindex widget), e.g. "/embed/define/rlhf". */
  embedPath: string;
  /**
   * Indexable canonical page the visible attribution anchor links to,
   * e.g. "/define/rlhf". This is the URL that receives the backlink equity —
   * it must be the indexable page, never the /embed/* URL.
   */
  sourcePath: string;
  /** Human label for the iframe title, anchor text, and button copy. */
  label: string;
  /** Fixed iframe height in px (define cards don't auto-resize). */
  height?: number;
}

const SITE = "https://signals.gitdealflow.com";

export default function EmbedThisCard({
  embedPath,
  sourcePath,
  label,
  height = 200,
}: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // The visible <a> below the iframe is the actual backlink. It targets the
  // indexable canonical page (sourcePath), not the noindex /embed widget.
  const snippet = `<iframe src="${SITE}${embedPath}" width="100%" height="${height}" frameborder="0" loading="lazy" title="${label} — VC Deal Flow Signal"></iframe>
<p style="font:12px/1.5 system-ui,-apple-system,sans-serif;margin:.5em 0;color:#64748b">Source: <a href="${SITE}${sourcePath}" rel="noopener" style="color:#0284c7">${label} — VC Deal Flow Signal</a> · <a href="https://creativecommons.org/licenses/by/4.0/" rel="license noopener" style="color:#0284c7">CC BY 4.0</a></p>`;

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
              rel="license noopener noreferrer"
              target="_blank"
            >
              CC BY 4.0
            </a>{" "}
            — the snippet includes a visible source credit linking back to this
            page.
          </p>
        </div>
      ) : null}
    </div>
  );
}
