import type { Metadata } from "next";
import Link from "next/link";
import { allPosts } from "@/content/posts";
import PSEOFooterNav from "@/components/PSEOFooterNav";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import EmbedThisCard from "@/components/EmbedThisCard";
import SeoCta from "@/components/SeoCta";

export const metadata: Metadata = {
  title: "Weekly Signal Reports — Engineering Acceleration Archive",
  description:
    "Archive of weekly startup engineering acceleration reports from VC Deal Flow Signal. Each report ranks the top 10 startups by GitHub commit velocity change across all sectors.",
  // hreflang emitted via <HreflangLinks/> in JSX (single source of truth).
  alternates: {
    canonical: "/weekly",
  },
};

export default function WeeklyArchivePage() {
  const weeklyPosts = allPosts.filter((p) =>
    p.slug.startsWith("weekly-signal-report-")
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/weekly#webpage",
        url: "https://signals.gitdealflow.com/weekly",
        name: "Weekly Signal Reports — VC Deal Flow Signal",
        description:
          "Archive of weekly startup engineering acceleration reports.",
        inLanguage: "en-US",
        isAccessibleForFree: true,
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["[data-speakable]", "h1", "h2"],
        },
      },
      {
        "@type": "CollectionPage",
        name: "Weekly Signal Reports Archive",
        description:
          "Archive of weekly startup engineering acceleration reports.",
        url: "https://signals.gitdealflow.com/weekly",
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
            name: "Weekly Reports",
            item: "https://signals.gitdealflow.com/weekly",
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/weekly"
        languages={getHreflangLanguages("/weekly")}
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
          <span className="text-gray-400">Weekly Reports</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          Weekly Signal Reports
        </h1>
        <p className="text-gray-400 text-base leading-relaxed mb-10">
          Every week we publish the top 10 startups by engineering acceleration
          across all sectors. These reports capture a snapshot of which
          companies are shipping the fastest — a signal that has historically
          preceded fundraise announcements by three to six weeks. Subscribe to
          the weekly report to get each edition in your inbox. If you want the
          freshest shortlist or the proof behind it, use the routes below before
          browsing older editions.
        </p>

        <section className="mb-10 rounded-2xl border border-sky-700/30 bg-sky-950/20 p-6 sm:p-8">
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-[0.14em] mb-2">
            Start with the highest-intent routes
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            If your real question is what is moving now, whether the signal is real, or how to use the shortlist, these are the best starting pages.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/weekly/top-100" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-sky-600 text-white text-sm font-semibold hover:bg-sky-500 transition-colors">
              Open the weekly Top 100 →
            </Link>
            <Link href="/research" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
              Read the research panel →
            </Link>
            <Link href="/answers/how-to-turn-a-signal-into-a-watchlist" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
              Turn a signal into a watchlist →
            </Link>
          </div>
        </section>

        {weeklyPosts.length === 0 ? (
          <p className="text-gray-400 text-sm">
            No weekly reports published yet. The first report will appear after
            the next Monday data refresh.
          </p>
        ) : (
          <div className="space-y-4">
            {weeklyPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block rounded-lg border border-slate-800 bg-slate-900 p-5 hover:border-slate-600 hover:bg-slate-800/60 transition-all"
              >
                <p className="text-gray-400 text-xs mb-2">{post.date}</p>
                <h2 className="text-gray-100 font-semibold text-base mb-2 group-hover:text-sky-400 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                  {post.description}
                </p>
              </Link>
            ))}
          </div>
        )}

        <section className="mt-10 rounded-lg border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-lg font-semibold text-gray-100 mb-2">
            Embed the live leaderboard
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Newsletters, founder blogs, and incubator portals can drop the live
            weekly Top 10 into any post. The snippet ships a visible source
            credit linking back here.
          </p>
          <EmbedThisCard
            embedPath="/embed/weekly"
            sourcePath="/weekly"
            label="Weekly Signal"
            height={560}
          />
        </section>

        <PSEOFooterNav excludeHrefs={["/weekly"]} />

        <SeoCta signoffIndex={3} className="mt-12" />
      </div>
    </>
  );
}
