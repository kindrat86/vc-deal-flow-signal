import type { ReactNode } from "react";
import { EmbedAutoHeight } from "@/components/EmbedAutoHeight";

const SITE = "https://signals.gitdealflow.com";

/**
 * Minimal wrapper around an interactive widget (a calculator, badge, mini
 * leaderboard, etc.) shown inside an iframe on a third-party site.
 *
 * Rendering contract:
 *   - No site chrome (Header/Footer/banner/pixels) — those are gated off in
 *     the root layout via <NotInEmbed/> for any path matching
 *     /embed/<widget>/... .
 *   - A thin top bar shows the widget name and a deep-link back to the
 *     standalone tool page so the iframe functions as a brand impression
 *     even before any user click.
 *   - A thin bottom bar carries the canonical "via gitdealflow.com →"
 *     attribution that survives CC BY 4.0. Clicks open in the top frame.
 *   - <EmbedAutoHeight/> measures document height in the iframe and
 *     postMessages it to the parent window every time the content
 *     reflows. /embed.js on the embedder side reads those messages and
 *     resizes the iframe so the widget never grows scrollbars.
 *
 * Theming: dark only in v1. Iframes on light-themed embedder sites render
 * as a dark card, consistent with how Stripe / GitHub embeds look on
 * light pages. A `?theme=light` variant is a v2 follow-up.
 */
export function EmbedShell({
  toolSlug,
  toolName,
  deepLinkLabel,
  children,
}: {
  /** Slug under /tools — e.g., "safe-calculator" — used to build the deep link. */
  toolSlug: string;
  /** Human-readable tool name shown in the top bar. */
  toolName: string;
  /** Call-to-action text on the deep link, e.g., "Open full tool ↗". */
  deepLinkLabel?: string;
  children: ReactNode;
}) {
  const deepLink = `${SITE}/tools/${toolSlug}?utm_source=embed&utm_medium=iframe&utm_campaign=tools-embed`;

  return (
    <div className="px-3 py-3 sm:px-4 sm:py-4 bg-slate-950 text-gray-100">
      <div className="mb-3 flex items-baseline justify-between gap-3 border-b border-slate-800 pb-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-sky-400">
          {toolName}
        </p>
        <a
          href={deepLink}
          target="_top"
          rel="noopener"
          className="text-[11px] text-gray-400 hover:text-sky-300 transition-colors"
        >
          {deepLinkLabel ?? "Open full tool ↗"}
        </a>
      </div>

      {children}

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-800 pt-3 text-[11px] text-gray-500">
        <span>CC BY 4.0 · free · no signup</span>
        <a
          href={deepLink}
          target="_top"
          rel="noopener"
          className="text-gray-400 hover:text-sky-300 transition-colors"
        >
          via gitdealflow.com →
        </a>
      </div>

      <EmbedAutoHeight />
    </div>
  );
}
