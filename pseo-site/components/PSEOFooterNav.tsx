import Link from "next/link";
import {
  getAllSectors,
  getCurrentPeriod,
  SIGNAL_TYPES,
  getAllStageSlugs,
} from "@/lib/data";

const STAGE_NAMES: Record<string, string> = {
  "pre-seed": "Pre-seed",
  seed: "Seed",
  "series-a-b": "Series A/B",
};

/**
 * Site-wide pSEO footer nav. Drop into core pages (/weekly, /methodology,
 * /trending, /blog index, /faq, etc.) to give the demand classifier a dense
 * outbound link graph from each landing page into the programmatic axis.
 *
 * Yandex's 2026-05-02 recheck flagged 7/10 sample core pages as "low-value"
 * because each had only 3-5 internal links. This block adds ~50.
 *
 * Non-canonical (these pages don't compete with sector pages for keywords);
 * purely structural for crawl + classifier diversity.
 */
export default function PSEOFooterNav({
  excludeHrefs = [],
}: {
  excludeHrefs?: string[];
}) {
  const period = getCurrentPeriod();
  const sectors = getAllSectors().filter((s) => s.periods[period.slug]);
  const stageSlugs = getAllStageSlugs();

  const exclude = new Set(excludeHrefs);
  const link = (href: string, label: string, title?: string) => {
    if (exclude.has(href)) return null;
    return (
      <Link
        key={href}
        href={href}
        title={title}
        className="inline-block rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-gray-400 hover:text-sky-400 hover:border-slate-600 transition-colors"
      >
        {label}
      </Link>
    );
  };

  return (
    <section className="my-12" aria-label="Explore by sector, signal, and stage">
      <h2 className="text-gray-100 font-semibold text-lg mb-4">
        Or browse by axis
      </h2>

      <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">
        Priority routes
      </p>
      <div className="flex flex-wrap gap-2 mb-5">
        {link("/compare/crunchbase-alternative-for-angel-investors", "Crunchbase alternative for angels")}
        {link("/answers/deal-flow-timing-vs-verification", "Timing vs verification")}
        {link("/answers/how-angel-investors-use-github-signals", "How angels use GitHub signals")}
        {link("/research", "Research panel")}
        {link("/from-stars-to-seed", "Proof before the round")}
        {link("/buyers-guide", "How to evaluate the tool")}
        {link("/weekly/top-100", "What startups are moving now")}
        {link("/breakout-startups-this-week", "Breakout startups this week")}
        {link("/compare/best-alternative-data-tools-for-angel-investors", "Best alternative data tools")}
        {link("/integrations/best-mcp-server-for-vc-research", "Best MCP server for VC research")}
      </div>

      <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">
        By sector ({period.name})
      </p>
      <div className="flex flex-wrap gap-2 mb-5">
        {sectors.map((s) =>
          link(`/startups-to-watch/${s.slug}-${period.slug}`, s.name),
        )}
      </div>

      <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">
        By signal type
      </p>
      <div className="flex flex-wrap gap-2 mb-5">
        {SIGNAL_TYPES.map((sig) =>
          link(`/signals/${sig.slug}`, sig.name, sig.description),
        )}
      </div>

      <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">
        By stage
      </p>
      <div className="flex flex-wrap gap-2 mb-5">
        {stageSlugs.map((s) =>
          link(`/stage/${s}`, STAGE_NAMES[s] || s),
        )}
      </div>

      <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">
        Other entry points
      </p>
      <div className="flex flex-wrap gap-2">
        {link("/trending", "Trending now")}
        {link("/weekly", "Weekly reports")}
        {link("/pricing", "Pricing")}
        {link("/methodology", "Methodology")}
        {link("/research", "Research")}
        {link("/citations", "Citations")}
        {link("/blog", "Blog")}
        {link("/faq", "FAQ")}
        {link("/glossary", "Glossary")}
        {link("/data-sources", "Data sources")}
        {link("/compare", "Compare tools")}
        {link("/alternatives", "Alternatives")}
        {link("/use-cases", "Use cases")}
      </div>
    </section>
  );
}
