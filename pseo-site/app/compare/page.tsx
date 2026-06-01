import type { Metadata } from "next";
import Link from "next/link";
import { comparisons } from "@/content/comparisons";
import PSEOFooterNav from "@/components/PSEOFooterNav";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import SeoCta from "@/components/SeoCta";

export const metadata: Metadata = {
  title: "Compare Deal Flow Tools — VC Deal Flow Signal",
  description:
    "Compare the best deal flow tools for investors: GitHub engineering signals, AI-powered sourcing, startup databases, and buyer-side workflow choices. Find the right tool for timing, verification, and strategy.",
  // hreflang emitted via <HreflangLinks/> in JSX (single source of truth).
  alternates: {
    canonical: "/compare",
  },
};

export default function CompareIndex() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/compare#webpage",
        url: "https://signals.gitdealflow.com/compare",
        name: "Compare Deal Flow Tools — VC Deal Flow Signal",
        description:
          "Side-by-side comparisons of deal flow and startup sourcing tools for investors.",
        inLanguage: "en-US",
        isAccessibleForFree: true,
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["[data-speakable]", "h1", "h2"],
        },
      },
      {
        "@type": "CollectionPage",
        name: "Compare Deal Flow Tools",
        description:
          "Side-by-side comparisons of deal flow and startup sourcing tools for investors.",
        url: "https://signals.gitdealflow.com/compare",
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
            name: "Compare",
            item: "https://signals.gitdealflow.com/compare",
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/compare"
        languages={getHreflangLanguages("/compare")}
      />
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
        <span className="text-gray-400">Compare</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
        Compare Deal Flow Tools
      </h1>
      <p className="text-gray-400 text-base leading-relaxed mb-10">
        Side-by-side comparisons of deal flow and startup sourcing tools for
        investors. Which tools give you the earliest signal? Which fit your
        stage, budget, and workflow? If your question starts with "which tool
        should I use first?" this is the compare layer.
      </p>

      <section className="mb-10 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 sm:p-8">
        <p className="text-amber-300 text-xs font-semibold uppercase tracking-[0.14em] mb-2">
          Start with the right comparison
        </p>
        <p className="text-gray-300 text-sm leading-relaxed mb-4">
          Use the compare layer when the question is commercial, timing-sensitive, or stack-related. Then move into proof or buyer pages once the wedge is clear.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/compare/crunchbase-alternative-for-angel-investors" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-amber-400 text-slate-950 text-sm font-semibold hover:bg-amber-300 transition-colors">
            Compare timing vs verification →
          </Link>
          <Link href="/research" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
            Read the research panel →
          </Link>
          <Link href="/buyers-guide" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
            Read the buyer's guide →
          </Link>
        </div>
      </section>

      <div className="space-y-6">
        {comparisons.map((comp) => (
          <Link
            key={comp.slug}
            href={`/compare/${comp.slug}`}
            className="group block rounded-lg border border-slate-800 bg-slate-900 p-6 hover:border-slate-600 hover:bg-slate-800/60 transition-all"
          >
            <h2 className="text-gray-100 font-semibold text-lg mb-2 group-hover:text-sky-400 transition-colors">
              {comp.h1}
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
              {comp.description}
            </p>
            <span className="mt-3 inline-block text-sky-500 text-xs font-medium group-hover:text-sky-400 transition-colors">
              Read comparison &rarr;
            </span>
          </Link>
        ))}
      </div>

      <SeoCta className="mt-12 mb-10" signoffIndex={5} />

      <PSEOFooterNav excludeHrefs={["/compare"]} />
    </div>
    </>
  );
}
