/**
 * PlainEnglishNote, the "translate, don't dump" callout for technical pages.
 *
 * The proof/methodology pages (/methodology, /research, /reproducibility,
 * /data-sources, /scorecard) carry load-bearing code/stats jargon (Gini,
 * regression, IQR, percentiles, curl/jq) that the core buyer, Marcus, a
 * non-engineer dealmaker whose stated fear is "looking non-technical in a
 * technical room", cannot decode. Per the Data Nerd voice rule #2
 * ("Translate, don't dump, plain business English over code jargon"),
 * every technical claim should sit beside the plain-English version of what
 * it means for a deal.
 *
 * Drop this immediately after a jargon-heavy block. Keep the body short and
 * in dealmaker language: what the number means, what to do about it, and the
 * explicit reassurance that no code-reading is required.
 */

import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  title?: string;
  className?: string;
}

export function PlainEnglishNote({
  children,
  title = "In plain English, no code required",
  className = "",
}: Props) {
  return (
    <aside
      className={`rounded-xl border border-emerald-700/30 bg-emerald-950/15 p-5 sm:p-6 ${className}`}
      aria-label={title}
    >
      <p className="text-emerald-300 text-[10px] font-semibold uppercase tracking-wider mb-2">
        {title}
      </p>
      <div className="text-gray-300 text-sm leading-relaxed space-y-2">
        {children}
      </div>
    </aside>
  );
}

export default PlainEnglishNote;
