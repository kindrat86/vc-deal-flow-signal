import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllTop100Slugs,
  getTop100,
  formatIsoWeekLabel,
  isoWeekToMonday,
} from "@/lib/top-100";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";

const SITE = "https://signals.gitdealflow.com";

export const metadata: Metadata = {
  title: "Top 100 GitHub-Signal Startups — Weekly Index",
  description:
    "Weekly ranked index of the 100 startups with the strongest GitHub engineering signals — composite of commit velocity change, contributor growth, raw scale, and team size.",
  alternates: { canonical: "/weekly/top-100" },
  openGraph: {
    title: "Top 100 GitHub-Signal Startups — Weekly Index",
    description:
      "Composite leaderboard of the 100 startups with the strongest GitHub engineering signals, refreshed every Monday.",
    type: "website",
    url: `${SITE}/weekly/top-100`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Top 100 GitHub-Signal Startups — Weekly Index",
    description:
      "Composite leaderboard refreshed weekly. Commit velocity + contributor growth + raw scale + team size.",
  },
};

export default function Top100ArchivePage() {
  const slugs = getAllTop100Slugs();
  const editions = slugs
    .map((slug) => {
      const snap = getTop100(slug);
      if (!snap) return null;
      return {
        slug,
        label: formatIsoWeekLabel(slug),
        monday: isoWeekToMonday(slug),
        topName: snap.rankings[0]?.name ?? "",
        topScore: snap.rankings[0]?.signalScore ?? 0,
        totalRanked: snap.summary.totalRanked,
      };
    })
    .filter((e): e is NonNullable<typeof e> => e !== null);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE}/weekly/top-100#collection`,
        name: "Top 100 GitHub-Signal Startups — Weekly Index",
        description:
          "Weekly ranked index of the 100 startups with the strongest GitHub engineering signals across 19 sectors.",
        url: `${SITE}/weekly/top-100`,
        inLanguage: "en-US",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", ".speakable", "[data-agent-summary]"],
        },
        isPartOf: { "@id": `${SITE}/#website` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "All Sectors",
            item: SITE,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Weekly Reports",
            item: `${SITE}/weekly`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Top 100 Index",
            item: `${SITE}/weekly/top-100`,
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
          <Link
            href="/weekly"
            className="hover:text-gray-300 transition-colors"
          >
            Weekly Reports
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Top 100 Index</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          Top 100 GitHub-Signal Startups
        </h1>
        <p
          className="text-gray-400 text-base leading-relaxed mb-8 speakable"
          data-agent-summary="A weekly composite leaderboard of the 100 startups with the strongest GitHub engineering signals across 19 sectors. The Signal Score combines commit velocity change, contributor growth, raw commit scale, and contributor count, with each component capped to prevent any single metric from dominating."
        >
          A weekly composite leaderboard of the 100 startups with the strongest
          GitHub engineering signals across 19 sectors. The Signal Score
          combines four capped components — commit velocity change, contributor
          growth, raw commit scale, and contributor count — so no single metric
          dominates. Refreshed every Monday from the same dataset that powers
          the sector pages.
        </p>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 mb-8 text-sm text-gray-400 leading-relaxed">
          <h2 className="text-gray-200 font-semibold text-base mb-2">
            How the Signal Score is calculated
          </h2>
          <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap break-words mb-2">
            {"SignalScore = clamp(velocityChange%, -20, 150)\n            + clamp(contribGrowth%, 0, 150)\n            + min(100, commits14d / 10)\n            + min( 50, contributors / 2)"}
          </pre>
          <p>
            Range −20 to 450. Capped components prevent a +999% velocity change
            on a 6-commit repo from out-ranking a steady org with 1,800 commits
            and 100 contributors. Same scoring is reused across every weekly
            edition so rank changes are comparable week-over-week.
          </p>
        </div>

        {editions.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No weekly indices published yet. The first index will appear after
            the next Monday data refresh.
          </p>
        ) : (
          <div className="space-y-4">
            {editions.map((e) => (
              <Link
                key={e.slug}
                href={`/weekly/top-100/${e.slug}`}
                className="group block rounded-lg border border-slate-800 bg-slate-900 p-5 hover:border-slate-600 hover:bg-slate-800/60 transition-all"
              >
                <p className="text-gray-500 text-xs mb-2">
                  {e.monday
                    ? e.monday.toISOString().slice(0, 10)
                    : e.slug}
                </p>
                <h2 className="text-gray-100 font-semibold text-base mb-1 group-hover:text-sky-400 transition-colors">
                  Top 100 GitHub-Signal Startups — {e.label}
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {e.totalRanked} distinct startups ranked. #1 this week:{" "}
                  <span className="text-gray-200 font-medium">{e.topName}</span>{" "}
                  (Signal Score {e.topScore}).
                </p>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12 rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-center">
          <h2 className="text-gray-100 font-semibold text-lg mb-2">
            Get each Monday&apos;s index in your inbox
          </h2>
          <p className="text-gray-400 text-sm mb-5 max-w-lg mx-auto">
            Free Substack mirror with the full leaderboard plus a 30-second
            sector roll-up. Same data, no email gate on the index page itself.
          </p>
          <Link
            href="https://gitdealflow.com/#signup"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors"
          >
            Get the Index
          </Link>
        </div>

        <AgentMirrorLinks path="/weekly/top-100" qaCategory="methodology" />
      </div>
    </>
  );
}
