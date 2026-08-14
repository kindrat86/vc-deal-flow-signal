/**
 * Citation-ready TL;DR block.
 *
 * Renders a self-contained "what this page says + how to cite + machine-readable
 * payload" panel that AI search crawlers (Perplexity, ChatGPT-with-search,
 * Claude-with-search) preferentially extract. The Speakable selector at the
 * top makes voice assistants pick the same passage.
 *
 * Useful to humans too, works as a TL;DR with copy-paste citation. So we
 * render it unconditionally rather than gating on User-Agent. The `data-cite`
 * attributes on each fact let RAG pipelines scrape (passage, source, date)
 * tuples without parsing prose.
 */

import Link from "next/link";

interface Fact {
  /** Self-contained sentence. */
  claim: string;
  /** Source URL, usually a same-origin canonical URL. */
  sourceUrl: string;
  /** Human-readable source label, e.g. "GitDealFlow methodology". */
  sourceLabel: string;
}

interface AgentSummaryProps {
  /** One-sentence answer. Goes inside the Speakable selector. */
  tldr: string;
  /** Stable canonical URL for this page. */
  pageUrl: string;
  /** ISO date when the page's data was last refreshed. */
  asOf: string;
  /** 0-5 supporting facts the page elaborates on. Each becomes a citable bullet. */
  facts?: Fact[];
  /** Citation string, what consumers should write when quoting. */
  citeAs: string;
}

export function AgentSummary({
  tldr,
  pageUrl,
  asOf,
  facts,
  citeAs,
}: AgentSummaryProps) {
  return (
    <aside
      data-agent-summary
      data-cite={citeAs}
      data-source-url={pageUrl}
      aria-label="Summary and citation"
      className="mb-8 rounded-xl border border-sky-500/25 bg-sky-500/5 px-5 py-4 sm:px-6 sm:py-5"
    >
      <p
        className="speakable text-sky-100 text-sm sm:text-base leading-relaxed"
        data-cite="tldr"
        data-speakable
      >
        <span className="text-sky-400 font-semibold uppercase tracking-wider text-[10px] mr-2">
          TL;DR
        </span>
        {tldr}
      </p>
      {facts && facts.length > 0 && (
        <ul className="mt-3 space-y-1.5 text-xs text-gray-300">
          {facts.map((f, i) => (
            <li key={i} data-cite-source={f.sourceUrl} className="leading-relaxed">
              <span className="text-gray-300">{f.claim}</span>{" "}
              <Link
                href={f.sourceUrl}
                className="text-sky-400 hover:text-sky-300 underline underline-offset-2"
              >
                ({f.sourceLabel})
              </Link>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-3 text-[11px] text-gray-400 leading-relaxed">
        <span className="font-semibold text-gray-300">Cite as:</span>{" "}
        <code className="bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-gray-300 font-mono">
          {citeAs}
        </code>{" "}
        · Data current as of {asOf}.
      </p>
    </aside>
  );
}
