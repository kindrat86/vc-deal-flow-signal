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
    "Weekly index of the 100 startups with the strongest GitHub engineering signals, refreshed every Monday.",
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
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
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
          the sector pages. If your question is which startups are moving now,
          this is the recurring shortlist page rather than a static startup
          database.
        </p>

        <section className="mb-8 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 sm:p-8">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-[0.14em] mb-2">
            Quote-ready takeaway
          </p>
          <blockquote className="text-gray-100 text-lg leading-relaxed border-l-2 border-amber-400/60 pl-4">
            The weekly Top 100 is not a verdict on the best startups. It is a shortlist of where public engineering momentum is concentrating right now.
          </blockquote>
          <p className="mt-4 text-xs text-gray-400 leading-relaxed">
            If you cite this page externally, use the takeaway above with the page URL and the current edition date.
          </p>
        </section>

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
          <p className="text-gray-400 text-sm">
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
                <p className="text-gray-400 text-xs mb-2">
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

        <div className="mt-12 rounded-xl border border-amber-500/30 bg-amber-500/5 p-6 sm:p-8">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2 text-center">
            Use this week’s movement
          </p>
          <h2 className="text-gray-100 font-semibold text-lg mb-2 text-center">
            Turn the leaderboard into sourcing action
          </h2>
          <p className="text-gray-400 text-sm mb-5 max-w-2xl mx-auto text-center">
            The ranking shows where engineering momentum is concentrating right now.
            Use the answer layer, the research panel, and the buyer-side pages
            to decide what to investigate next, what to ignore, and whether this
            belongs in your sourcing workflow.
          </p>
          <div className="flex flex-col items-center gap-4">
            <Link href="/answers" className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-amber-400 text-slate-950 text-sm font-semibold hover:bg-amber-300 transition-colors">
              Read the answers layer →
            </Link>
            <p className="text-xs text-gray-400 text-center leading-relaxed max-w-xl">
              Or go deeper:{" "}
              <Link href="/research" className="text-sky-400 hover:text-sky-300 underline">the research panel</Link>,{" "}
              <Link href="/answers/how-to-turn-a-signal-into-a-watchlist" className="text-sky-400 hover:text-sky-300 underline">turn a signal into a watchlist</Link>,{" "}
              <Link href="/buyers-guide" className="text-sky-400 hover:text-sky-300 underline">the buyer&rsquo;s guide</Link>,{" "}
              <Link href="/receipts" className="text-sky-400 hover:text-sky-300 underline">your Scout Score</Link>, or a{" "}
              <Link href="/firstlook" className="text-sky-400 hover:text-sky-300 underline">€7 First Look</Link>.
            </p>
          </div>
        </div>

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
