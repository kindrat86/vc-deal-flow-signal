import type { Metadata } from "next";
import Link from "next/link";
import { allPosts } from "@/content/posts";
import PSEOFooterNav from "@/components/PSEOFooterNav";

export const metadata: Metadata = {
  title: "Weekly Signal Reports — Engineering Acceleration Archive",
  description:
    "Archive of weekly startup engineering acceleration reports from VC Deal Flow Signal. Each report ranks the top 10 startups by GitHub commit velocity change across all sectors.",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
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
          the weekly report to get each edition in your inbox.
        </p>

        {weeklyPosts.length === 0 ? (
          <p className="text-gray-500 text-sm">
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
                <p className="text-gray-500 text-xs mb-2">{post.date}</p>
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

        <PSEOFooterNav excludeHrefs={["/weekly"]} />

        <div className="mt-12 rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-center">
          <h2 className="text-gray-100 font-semibold text-lg mb-2">
            Get each report in your inbox
          </h2>
          <p className="text-gray-400 text-sm mb-5 max-w-lg mx-auto">
            The weekly report plus sector highlights delivered every Monday.
            Free, no spam.
          </p>
          <Link
            href="https://gitdealflow.com/#signup"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors"
          >
            Get the Report
          </Link>
        </div>
      </div>
    </>
  );
}
