/**
 * /search: human-facing site search results page (SSR, no JS required).
 *
 * Why this exists (audit item "sitelinks 55", executed 2026-08-18):
 *   The site had a working JSON search API (/api/llms-search) and an
 *   OpenSearch description document, but NO human-visible results page:
 *   the opensearch.xml HTML template pointed at /?q={searchTerms} and the
 *   homepage ignored the param, so a browser that registered the site as
 *   a search engine landed on an unchanged homepage. Google deprecated
 *   the sitelinks search box (Nov 2024), so SearchAction's remaining
 *   value is (a) agent/LLM discovery of the JSON endpoint and (b) the
 *   human search path, which this page completes.
 *
 * Design constraints:
 *   - Plain <form action="/search" method="get">, zero client JS needed.
 *     Works with JS disabled, in text browsers, and for crawlers.
 *   - noindex (utility page, infinite URL space): metadata.robots +
 *     proxy.ts NOINDEX_PREFIXES ("/search") must stay aligned.
 *   - Reuses lib/search-index.ts (same corpus + scoring as the JSON API,
 *     extracted with zero behavior change) so results can never drift.
 *   - internal links are descriptive-text anchors into real content pages,
 *     reinforcing nav clarity for the algorithmic sitelinks 6-pack.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { searchCorpus, normalizeQuery } from "@/lib/search-index";
import { withEditorialOverride } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export const metadata: Metadata = withEditorialOverride({
  title: "Search, VC Deal Flow Signal",
  description:
    "Search startups, sectors, comparisons, answers, and research across VC Deal Flow Signal.",
  robots: { index: false, follow: true },
});

const TYPE_LABEL: Record<string, string> = {
  startup: "Startup",
  sector: "Sector",
  blog: "Blog",
  comparison: "Comparison",
  answer: "Answer",
  faq: "FAQ",
  research: "Research",
};

function SearchResult({ hit }: { hit: (ReturnType<typeof searchCorpus>)["hits"][number] }) {
  return (
    <li className="border-b border-slate-800 py-4 last:border-0">
      <Link
        href={hit.url}
        className="group block min-h-[24px] py-1"
      >
        <span className="text-sm text-sky-400 group-hover:text-sky-300 font-medium">
          {hit.title}
        </span>
        <span className="ml-2 rounded bg-slate-800 px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          {TYPE_LABEL[hit.type] ?? hit.type}
        </span>
        <p className="mt-1 text-sm text-gray-400 line-clamp-2">{hit.snippet}</p>
      </Link>
    </li>
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const rawQ = Array.isArray(params?.q) ? params?.q[0] : params?.q;
  const q = normalizeQuery(rawQ);
  const { hits, total } = q ? searchCorpus(q, 30) : { hits: [], total: 0 };

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <header className="mb-8">
        <p className="text-sky-400 text-xs font-medium mb-2 uppercase tracking-wider">
          Site search
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100">
          Search VC Deal Flow Signal
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Startups, sectors, comparisons, answers, and research across the
          site. AI agents: the JSON version of this search lives at{" "}
          <a
            href="/api/llms-search?q=harmonic"
            className="text-sky-400 hover:text-sky-300 underline"
          >
            /api/llms-search
          </a>
          .
        </p>
      </header>

      {/* Plain GET form: works with JavaScript disabled. */}
      <form action="/search" method="get" role="search" className="mb-8">
        <div className="flex gap-2">
          <label htmlFor="q" className="sr-only">
            Search query
          </label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Try: harmonic, fintech, commit velocity, scout program"
            className="flex-1 min-h-[44px] rounded-md border border-slate-700 bg-slate-900 px-3 text-base text-gray-100 placeholder:text-gray-500 focus:border-sky-500 focus:outline-none"
            autoComplete="off"
          />
          <button
            type="submit"
            className="min-h-[44px] rounded-md bg-[#ff6b1a] px-4 text-sm font-semibold text-slate-950 hover:bg-[#ff8c4d] transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {q ? (
        <section aria-label="Search results">
          <p className="text-sm text-gray-400 mb-4" data-total={total}>
            {total > 0
              ? `${total} result${total === 1 ? "" : "s"} for `
              : "No results for "}
            <span className="font-medium text-gray-200">&ldquo;{q}&rdquo;</span>
          </p>
          {hits.length > 0 ? (
            <ul className="divide-y divide-slate-800">
              {hits.map((hit) => (
                <SearchResult key={hit.url} hit={hit} />
              ))}
     </ul>
          ) : (
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6">
              <p className="text-sm text-gray-300">
                Nothing matched. Try a startup name (e.g.{" "}
                <Link href="/search?q=harmonic" className="text-sky-400 hover:text-sky-300 underline">
                  harmonic
                </Link>
                ), a sector (e.g.{" "}
                <Link href="/search?q=fintech" className="text-sky-400 hover:text-sky-300 underline">
                  fintech
                </Link>
                ), or browse{" "}
                <Link href="/startups" className="text-sky-400 hover:text-sky-300 underline">
                  all sectors
                </Link>
                .
              </p>
            </div>
          )}
        </section>
      ) : (
        <section aria-label="Popular searches" className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-100">Popular searches</h2>
          <div className="flex flex-wrap gap-2">
            {[
              ["harmonic", "Harmonic.ai"],
              ["pitchbook", "PitchBook"],
              ["fintech", "Fintech"],
              ["commit velocity", "Commit velocity"],
              ["scout", "Scout programs"],
              ["pre-seed", "Pre-seed"],
            ].map(([term, label]) => (
              <Link
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                className="min-h-[24px] py-1 px-3 rounded-full border border-slate-700 bg-slate-900 text-sm text-gray-300 hover:text-gray-100 hover:border-sky-500 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
          <p className="text-sm text-gray-400">
            Or browse{" "}
            <Link href="/startups" className="text-sky-400 hover:text-sky-300 underline">
              all startup sectors
            </Link>
            ,{" "}
            <Link href="/vs" className="text-sky-400 hover:text-sky-300 underline">
              tool comparisons
            </Link>
            , or{" "}
            <Link href="/research" className="text-sky-400 hover:text-sky-300 underline">
              research findings
            </Link>
            .
          </p>
        </section>
      )}
    </main>
  );
}
