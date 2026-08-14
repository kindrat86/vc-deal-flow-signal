import type { Metadata } from "next";
import Link from "next/link";
import { competitors, getAllCompetitorVsSlugs } from "@/content/competitor-vs";
import SeoCta from "@/components/SeoCta";

export const metadata: Metadata = {
  title: "Deal Flow Tool Comparisons (VS)",
  description:
    "Head-to-head comparisons of every major deal flow platform: Harmonic.ai, PitchBook, Crunchbase, Dealroom, Tracxn, Forager.ai. Signal type, lead time, pricing, coverage, and when to pick each one.",
  alternates: {
    canonical: "/vs",
  },
};

export default function VsIndex() {
  const slugs = getAllCompetitorVsSlugs();

  const pairs = slugs
    .map((slug) => {
      const [aSlug, bSlug] = slug.split("-vs-");
      const a = competitors[aSlug];
      const b = competitors[bSlug];
      if (!a || !b) return null;
      return { slug, a, b };
    })
    .filter(<T,>(x: T | null): x is T => x !== null);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "Deal Flow Tool Comparisons (VS)",
        description:
          "Head-to-head comparisons of major deal flow platforms used by VCs, angels, and scouts.",
        url: "https://signals.gitdealflow.com/vs",
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "All Sectors",
            item: "https://signals.gitdealflow.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "VS Comparisons",
            item: "https://signals.gitdealflow.com/vs",
          },
        ],
      },
      {
        "@type": "ItemList",
        itemListElement: pairs.map((p, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: `${p.a.name} vs ${p.b.name}`,
          url: `https://signals.gitdealflow.com/vs/${p.slug}`,
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">VS Comparisons</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          Deal Flow Tool Comparisons
        </h1>
        <p className="text-gray-400 text-base leading-relaxed mb-10">
          Head-to-head comparisons of every major deal flow platform used by VCs,
          angels, and scouts in 2026. Signal type, typical lead time before a
          fundraise, pricing, coverage, and when to pick each. Independently
          maintained, VC Deal Flow Signal is one of the tools compared, but
          every page summarises the strengths and weaknesses of all of them on
          equal footing. If you already know the comparison you need, start with
          the sharper routes below instead of scanning the whole matrix.
        </p>

        <section className="mb-10 rounded-2xl border border-sky-700/30 bg-sky-950/20 p-6 sm:p-8">
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-[0.14em] mb-2">
            Start with the highest-intent routes
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            Use the VS matrix when you want broad comparison coverage. But if your real question is timing, proof, or buyer-side evaluation, start with the sharper pages first.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/compare/crunchbase-alternative-for-angel-investors" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-signal-500 text-slate-950 text-sm font-semibold hover:bg-signal-600 transition-colors">
              Crunchbase alternative for angels →
            </Link>
            <Link href="/research" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
              Read the research panel →
            </Link>
            <Link href="/buyers-guide" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
              Read the buyer's guide →
            </Link>
          </div>
        </section>

        <div className="space-y-3">
          {pairs.map(({ slug, a, b }) => (
            <Link
              key={slug}
              href={`/vs/${slug}`}
              className="group block rounded-lg border border-slate-800 bg-slate-900 p-5 hover:border-slate-600 hover:bg-slate-800/60 transition-all"
            >
              <h2 className="text-gray-100 font-semibold text-base mb-1 group-hover:text-sky-400 transition-colors">
                {a.name} vs {b.name}
              </h2>
              <p className="text-gray-400 text-xs leading-relaxed">
                {a.signalType} ({a.leadTime.toLowerCase()}) vs {b.signalType.toLowerCase()} ({b.leadTime.toLowerCase()}).
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-12 rounded-lg border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-gray-100 font-semibold text-lg mb-2">
            Want VC Deal Flow Signal compared against any of these?
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            VC Deal Flow Signal is a GitHub commit-velocity tracker, the only
            tool in this list that gives you a 6-12 week lead time before a
            fundraise on technical startups. See the dedicated alternative
            pages for direct comparisons.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/alternatives/harmonic-ai"
              className="text-xs text-sky-400 hover:text-sky-300 underline"
            >
              vs Harmonic.ai
            </Link>
            <Link
              href="/alternatives/dealroom"
              className="text-xs text-sky-400 hover:text-sky-300 underline"
            >
              vs Dealroom
            </Link>
            <Link
              href="/alternatives/forager-ai"
              className="text-xs text-sky-400 hover:text-sky-300 underline"
            >
              vs Forager.ai
            </Link>
            <Link
              href="/alternatives/crunchbase-alerts"
              className="text-xs text-sky-400 hover:text-sky-300 underline"
            >
              vs Crunchbase Alerts
            </Link>
            <Link
              href="/compare"
              className="text-xs text-sky-400 hover:text-sky-300 underline"
            >
              All comparisons
            </Link>
          </div>
        </div>

        <SeoCta className="mt-12" signoffIndex={4} />
      </div>
    </>
  );
}
