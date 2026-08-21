import type { Metadata } from "next";
import Link from "next/link";
import { alternatives } from "@/content/alternatives";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import SeoCta from "@/components/SeoCta";

export const metadata: Metadata = {
  title: "Alternatives to Harmonic.ai, Dealroom, Crunchbase & Forager.ai",
  description:
    "Compare GitDealFlow with Harmonic.ai, Dealroom, Crunchbase alerts, and Forager.ai for earlier engineering-signal deal flow.",
  // hreflang emitted via <HreflangLinks/> in JSX (single source of truth).
  alternates: {
    canonical: "/alternatives",
  },
};

export default function AlternativesIndex() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/alternatives#webpage",
        url: "https://signals.gitdealflow.com/alternatives",
        name: "Deal Flow Tool Alternatives, VC Deal Flow Signal",
        description:
          "Head-to-head alternatives comparing VC Deal Flow Signal to Harmonic.ai, Dealroom, Crunchbase, and Forager.ai.",
        inLanguage: "en-US",
        isAccessibleForFree: true,
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["[data-speakable]", "h1", "h2"],
        },
      },
      {
        "@type": "CollectionPage",
        name: "Deal Flow Tool Alternatives",
        description:
          "Head-to-head alternatives comparing VC Deal Flow Signal to Harmonic.ai, Dealroom, Crunchbase, and Forager.ai.",
        url: "https://signals.gitdealflow.com/alternatives",
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
      },
      {
        "@type": "ItemList",
        itemListElement: alternatives.map((alt, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `https://signals.gitdealflow.com/alternatives/${alt.slug}`,
          name: alt.h1,
        })),
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
            name: "Alternatives",
            item: "https://signals.gitdealflow.com/alternatives",
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/alternatives"
        languages={getHreflangLanguages("/alternatives")}
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
          <span className="text-gray-400">Alternatives</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          VC Deal Flow Signal Alternatives
        </h1>
        <p className="text-gray-300 text-base leading-relaxed mb-4">
          In short: the alternatives compared here are the tools investors
          already use, PitchBook, CB Insights, Dealroom, Harmonic.ai, and
          Crunchbase alerts, and the honest difference is timing. Those tools
          are strongest at verification after a round is public; VC Deal Flow
          Signal ranks startups by change in 14-day GitHub commit velocity, a
          code-side signal that has historically moved three to six weeks
          before fundraise announcements.
        </p>
        <p className="text-gray-400 text-base leading-relaxed mb-10">
          Head-to-head alternatives to the most common deal flow tools investors
          already use. Each comparison covers signal philosophy, lead time,
          coverage, pricing, and when each tool is the better fit. If you are
          comparison-shopping, start with the alternatives that answer the
          timing question first.
        </p>

        <section className="mb-10 rounded-2xl border border-sky-700/30 bg-sky-950/20 p-6 sm:p-8">
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-[0.14em] mb-2">
            Start with the highest-intent routes
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            If the real question is timing, do not start with the broad index. Start with the comparisons that explain what the default tools miss and what kind of stack makes sense next.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/compare/crunchbase-alternative-for-angel-investors" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-signal-500 text-slate-950 text-sm font-semibold hover:bg-signal-600 transition-colors">
              Crunchbase alternative for angels →
            </Link>
            <Link href="/compare/best-alternative-data-tools-for-angel-investors" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
              Best alternative data tools →
            </Link>
            <Link href="/buyers-guide" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
              Read the buyer's guide →
            </Link>
          </div>
        </section>

        <div className="space-y-6">
          {alternatives.map((alt) => (
            <Link
              key={alt.slug}
              href={`/alternatives/${alt.slug}`}
              className="group block rounded-lg border border-slate-800 bg-slate-900 p-6 hover:border-slate-600 hover:bg-slate-800/60 transition-all"
            >
              <p className="text-xs font-medium text-sky-500 uppercase tracking-wider mb-2">
                vs {alt.competitor}
              </p>
              <h2 className="text-gray-100 font-semibold text-lg mb-2 group-hover:text-sky-400 transition-colors">
                {alt.h1}
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                {alt.tagline}
              </p>
              <span className="mt-3 inline-block text-sky-500 text-xs font-medium group-hover:text-sky-400 transition-colors">
                Read comparison &rarr;
              </span>
            </Link>
          ))}
        </div>

        {/* Pricing CTA, buyer-intent block for visitors comparison-shopping */}
        <section className="mt-14 rounded-lg border border-sky-800 bg-sky-950/20 p-6">
          <h2 className="text-lg font-semibold text-sky-200 mb-2">
            Comparing tools? Here&rsquo;s what we cost.
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-3">
            Five tiers, ordered cheapest to most expensive: free weekly
            digest, &euro;7 one-time First Look Pass, &euro;49/mo Dashboard,
            &euro;197/mo Insider Circle, and &euro;1,997 one-time Custom
            Sector Sweep. Founding members who joined before June 30, 2026
            keep their rate for life. Every paid tier ships with a 30-day
            Signal-or-It&rsquo;s-Free guarantee.
          </p>
          <Link
            href="/pricing"
            className="inline-block bg-signal-500 hover:bg-signal-600 text-slate-950 text-sm font-semibold px-4 py-2 rounded-md transition-colors"
          >
            See full pricing &rarr;
          </Link>
        </section>

        <div className="mt-10">
          <SeoCta
            secondary={{ label: "Test one sector, First Look €7", href: "/firstlook" }}
            signoffIndex={0}
          />
        </div>
      </div>
    </>
  );
}
