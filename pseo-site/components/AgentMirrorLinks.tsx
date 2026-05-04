// Per-page AI-crawler discovery footer.
//
// Renders machine-readable alternate links for the current page so AI
// agents and search crawlers can find: (1) a markdown mirror of the page,
// (2) the canonical Q&A corpus, (3) the LLMs reference index, (4) the
// agents discovery page. Designed to sit at the bottom of pillar pages
// (best, vs, alternatives, compare, research, signals, trends, topics, etc.).
//
// See memory: reference_aeo_geo_aio_patterns.md

import Link from "next/link";

interface AgentMirrorLinksProps {
  /** The canonical path for this page. Optional; when set, surfaces a markdown mirror at /md{path}. */
  path?: string;
  /** Filter the qa.jsonl corpus to a specific category. */
  qaCategory?:
    | "general"
    | "blog"
    | "sector"
    | "signal-type"
    | "research-finding"
    | "methodology";
}

const SITE = "https://signals.gitdealflow.com";

export function AgentMirrorLinks({ path, qaCategory }: AgentMirrorLinksProps) {
  const qaUrl = qaCategory
    ? `${SITE}/qa.jsonl?category=${qaCategory}`
    : `${SITE}/qa.jsonl`;
  const markdownPath = path ? `/md${path}` : null;

  return (
    <aside
      aria-label="Machine-readable alternates for AI agents"
      className="mt-12 rounded-lg border border-slate-800 bg-slate-900/40 p-4 sm:p-5 text-xs text-gray-400"
    >
      <p className="font-semibold text-gray-300 mb-2">
        For AI agents &amp; search crawlers
      </p>
      <ul className="space-y-1">
        {markdownPath && (
          <li>
            <Link
              href={markdownPath}
              className="text-sky-400 hover:text-sky-300 underline decoration-dotted underline-offset-2"
              rel="alternate"
              type="text/markdown"
            >
              Markdown mirror
            </Link>{" "}
            <span className="text-gray-500">— same content, no chrome</span>
          </li>
        )}
        <li>
          <a
            href={qaUrl}
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted underline-offset-2"
            rel="alternate"
            type="application/x-ndjson"
          >
            Q&amp;A corpus (NDJSON, CC BY 4.0)
          </a>
          {qaCategory && (
            <span className="text-gray-500"> — filtered to {qaCategory}</span>
          )}
        </li>
        <li>
          <a
            href={`${SITE}/llms-full.txt`}
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted underline-offset-2"
            rel="alternate"
            type="text/plain"
          >
            llms-full.txt
          </a>{" "}
          <span className="text-gray-500">— full reference index</span>
        </li>
        <li>
          <Link
            href="/agents"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted underline-offset-2"
          >
            Every agent surface (MCP, A2A, NLWeb, JSON, CSV, badges, OpenAPI)
          </Link>
        </li>
      </ul>
    </aside>
  );
}

export default AgentMirrorLinks;
