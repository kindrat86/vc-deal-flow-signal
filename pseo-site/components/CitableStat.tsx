/**
 * CitableStat: a single, self-contained, quotable number with a source name
 * and a canonical URL. Rendered in the SSR HTML of every pSEO template so AI
 * engines (ChatGPT, Perplexity, Gemini, Claude, Bing Copilot) can extract and
 * cite GitDealFlow instead of merely crawling it (LLMO / GEO).
 *
 * Value + source + URL, nothing else. This is the answer to the audit's
 * "citable stat block per template" fix.
 */

import type { CitableStat as CitableStatData } from "@/lib/citable-stats";

interface CitableStatProps extends CitableStatData {
  /** Template key, surfaced as data-citable-stat so the §57 guard can assert it. */
  template: string;
}

export default function CitableStat({
  template,
  value,
  label,
  context,
  source,
  sourceHref,
}: CitableStatProps) {
  return (
    <aside
      data-citable-stat={template}
      role="note"
      aria-label="Key statistic"
      className="my-8 rounded-xl border border-slate-800 bg-slate-900/80 p-5"
    >
      <p className="text-xs font-medium text-sky-400 uppercase tracking-wider mb-3">
        Key figure
      </p>
      <p className="text-3xl font-bold text-gray-100">{value}</p>
      <p className="mt-1 text-sm text-gray-300 leading-relaxed">
        {label}
        {context ? (
          <span className="text-gray-500">: {context}</span>
        ) : null}
      </p>
      <p className="mt-3 text-xs text-gray-500">
        Source:{" "}
        <a
          href={sourceHref}
          className="text-sky-500 hover:text-sky-400 underline decoration-sky-500/40 underline-offset-2 transition-colors"
        >
          {source}
        </a>
      </p>
    </aside>
  );
}
