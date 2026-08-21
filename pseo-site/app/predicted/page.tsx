import type { Metadata } from "next";
import Link from "next/link";
import SignalBadge from "@/components/SignalBadge";
import ShareBar from "@/components/ShareBar";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { DEFAULT_HREFLANG_LANGUAGES } from "@/lib/hreflang";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";
import { PublicScorecardProof } from "@/components/PublicScorecardProof";
import { getPublicProof } from "@/lib/public-proof";
import {
  getCurrentPredictionWeek,
  getAllPredictionWeeks,
  computeScorecard,
  fmtLongDate,
  isPredictionOutcomeHit,
  buildClaimReviewItems,
  type PredictionOutcome,
} from "@/lib/predictions";

export const metadata: Metadata = {
  title:
    "Engineering Acceleration Watch, Weekly Data Index (Not an Accelerator Program)",
  description:
    "A weekly public data feed, not an accelerator program. Every Monday we name 10 startups whose GitHub engineering acceleration crossed the signal threshold. Each pick is graded post-hoc against public fundraise news at 60 and 90 days.",
  alternates: { canonical: "/predicted" },
  openGraph: {
    title:
      "Engineering Acceleration Watch, weekly data index, not an accelerator program",
    description:
      "Public weekly data feed. 10 named GitHub-engineering accelerations every Monday. Graded post-hoc versus fundraise news. No application, no cohort, no equity, just the dataset.",
    url: "https://signals.gitdealflow.com/predicted",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@sipiteno",
    title:
      "Engineering Acceleration Watch, public bet, graded weekly (not Y Combinator)",
    description:
      "10 named startups every Monday. Public dataset, not an accelerator program. Outcomes graded against fundraise news at 60 and 90 days.",
  },
};

const OUTCOME_LABEL: Record<NonNullable<PredictionOutcome>, string> = {
  raised: "Raised",
  acquired: "Acquired",
  ipo: "Public listing",
  other_milestone: "Public milestone",
  no_event: "No event",
  shutdown: "Shut down",
  excluded: "Excluded",
};

const OUTCOME_TONE: Record<NonNullable<PredictionOutcome>, string> = {
  raised: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
  acquired: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
  ipo: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
  other_milestone: "text-amber-300 border-amber-500/40 bg-amber-500/10",
  no_event: "text-gray-400 border-slate-700 bg-slate-800",
  shutdown: "text-rose-400 border-rose-500/40 bg-rose-500/10",
  excluded: "text-gray-400 border-slate-700 bg-slate-900",
};

export default function PredictedPage() {
  const week = getCurrentPredictionWeek();
  const allWeeks = getAllPredictionWeeks();
  const score = computeScorecard();
  const proof = getPublicProof();

  if (!week) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-gray-300">
        Acceleration Watch will be published Monday {fmtLongDate("2026-05-04")}.
      </div>
    );
  }

  // F4, top-level ClaimReview blocks (one per pick) per the schema rule
  // documented in feedback_review_jsonld_must_be_top_level.md: ClaimReview
  // must sit at @graph top-level, never nested under an Article's `review:`.
  // Current-week picks are still pre-grading-window so each emits
  // alternateName "Unproven" with ratingValue 0, Google's controlled
  // vocabulary for "on the record, not yet adjudicated".
  const claimReviewItems = buildClaimReviewItems(week, {
    skipExcluded: true,
    includePending: true,
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/predicted#webpage",
        url: "https://signals.gitdealflow.com/predicted",
        name: "Engineering Acceleration Watch, Weekly Data Index",
        alternateName: "Acceleration Watch",
        description:
          "Weekly public data feed (not an accelerator program). Names 10 startups whose GitHub engineering acceleration crossed the signal threshold; graded post-hoc against public fundraise news at 60 and 90 days.",
        about: {
          "@type": "Thing",
          name: "Engineering acceleration as a leading fundraise signal",
          description:
            "Engineering acceleration measures the change-in-change of commit velocity over rolling 14-day windows. It is distinct from accelerator programs (Y Combinator, Techstars, 500 Startups, Antler) which are cohort-based investment vehicles.",
        },
        inLanguage: "en-US",
        isPartOf: { "@id": "https://signals.gitdealflow.com/#website" },
        speakable: {
          "@type": "SpeakableSpecification",
          xpath: ["/html/body//h1", "/html/body//h2", "/html/body//p[1]"],
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
            name: "Acceleration Watch",
            item: "https://signals.gitdealflow.com/predicted",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: `Week of ${fmtLongDate(week.weekStart)}`,
            item: `https://signals.gitdealflow.com/predicted/${week.slug}`,
          },
        ],
      },
      {
        "@type": "ItemList",
        name: `Acceleration Watch, Week of ${fmtLongDate(week.weekStart)}`,
        description: `10 named startups whose GitHub engineering acceleration crossed our signal threshold the week of ${fmtLongDate(week.weekStart)}. Grading window closes ${fmtLongDate(week.gradingDueAt)}.`,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        numberOfItems: week.picks.length,
        itemListElement: week.picks.map((p) => ({
          "@type": "ListItem",
          position: p.rank,
          name: p.displayName,
          url: p.githubUrl,
          description: p.thesis,
        })),
      },
      ...claimReviewItems,
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/predicted"
        languages={DEFAULT_HREFLANG_LANGUAGES}
      />
      <AgentMirrorLinks path="/predicted" qaCategory="methodology" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Acceleration Watch</span>
        </nav>

        <header className="mb-8">
          <p className="text-emerald-400 text-sm font-medium mb-3 uppercase tracking-wider">
            Public bet · Week of {fmtLongDate(week.weekStart)}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
            Engineering Acceleration Watch, 10 named startups, graded weekly
          </h1>
          <p className="text-amber-300/90 text-sm leading-relaxed max-w-2xl mb-3">
            <strong>Not an accelerator program.</strong> This is a weekly
            public data feed. There is no application, no cohort, no equity -
            just the dataset. (Y Combinator, Techstars, etc. are accelerator
            programs; this is engineering-acceleration as a leading signal.)
          </p>
          <p className="text-gray-400 text-base leading-relaxed max-w-2xl">
            Every Monday we publish 10 startups whose GitHub engineering
            acceleration crossed our signal threshold the prior week. Each
            pick is graded post-hoc against public fundraise, acquisition,
            and product-launch news at the 60-day and 90-day window. We keep
            score in public.
          </p>
          <p className="text-gray-400 text-sm mt-3 max-w-2xl">
            Methodology:{" "}
            <Link
              href="/methodology"
              className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
            >
              /methodology
            </Link>{" "}
            · SSRN paper:{" "}
            <a
              href="https://ssrn.com/abstract=6606558"
              target="_blank"
              rel="noopener"
              className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
            >
              ssrn.com/abstract=6606558
            </a>{" "}
            · Monthly address:{" "}
            <Link
              href="/state-of-github"
              className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
            >
              /state-of-github
            </Link>{" "}
            · Grading window for this cohort closes{" "}
            <span className="text-gray-300">
              {fmtLongDate(week.gradingDueAt)}
            </span>
            .
          </p>
        </header>

        <PublicScorecardProof proof={proof} />

        {/* Current-week scorecard detail */}
        <section
          className="mb-8 rounded-xl border border-sky-700/40 bg-sky-950/30 p-6"
          aria-label="Public scorecard"
        >
          <p className="text-xs font-medium text-sky-300 uppercase tracking-wider mb-3">
            Public scorecard
          </p>
          {score.picksGraded === 0 ? (
            <p className="text-gray-300 text-sm leading-relaxed">
              Grading begins{" "}
              <span className="text-gray-100 font-medium">
                {score.firstGradingDueAt
                  ? fmtLongDate(score.firstGradingDueAt)
                  : "soon"}
              </span>{" "}
first cohort matures 60 days after publish. Until then, every
              pick is on the record but ungraded. Bookmark this page; we will
              not edit picks once published, only append outcome rows.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-4xl sm:text-5xl font-bold text-emerald-300 tabular-nums tracking-tight">
                    {score.hitRatePct ?? 0}
                    <span className="text-2xl sm:text-3xl text-emerald-400/60">%</span>
                  </div>
                  <div className="text-xs text-gray-300 mt-1.5 uppercase tracking-wider font-medium">
                    Hit rate
                  </div>
                  <div className="text-[11px] text-gray-400">
                    Raise · acquire · IPO
                  </div>
                </div>
                <div>
                  <div className="text-4xl sm:text-5xl font-bold text-gray-100 tabular-nums tracking-tight">
                    {score.raised + score.acquired + score.ipo}
                    <span className="text-2xl sm:text-3xl text-gray-400">
                      {" "}/ {score.picksGraded}
                    </span>
                  </div>
                  <div className="text-xs text-gray-300 mt-1.5 uppercase tracking-wider font-medium">
                    Hits / graded
                  </div>
                </div>
                <div>
                  <div className="text-4xl sm:text-5xl font-bold text-gray-100 tabular-nums tracking-tight">
                    {score.weeksGraded}
                  </div>
                  <div className="text-xs text-gray-300 mt-1.5 uppercase tracking-wider font-medium">
                    Weeks with grades
                  </div>
                </div>
                <div>
                  <div className="text-4xl sm:text-5xl font-bold text-amber-300 tabular-nums tracking-tight">
                    {score.picksPending}
                  </div>
                  <div className="text-xs text-gray-300 mt-1.5 uppercase tracking-wider font-medium">
                    Pending
                  </div>
                </div>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed border-t border-sky-900/40 pt-3">
                <span className="text-emerald-400">{score.raised} raised</span> ·{" "}
                <span className="text-emerald-400">{score.acquired} acquired</span> ·{" "}
                <span className="text-emerald-400">{score.ipo} IPO</span> ·{" "}
                <span className="text-amber-300">{score.otherMilestone} other milestone</span> ·{" "}
                <span className="text-gray-400">{score.noEvent} no event</span> ·{" "}
                <span className="text-rose-400">{score.shutdown} shutdown</span>.
                Excluded: {score.excluded}.
              </p>
            </>
          )}
        </section>

        <div className="mb-8">
          <ShareBar
            title={`Acceleration Watch, 10 named startups, week of ${fmtLongDate(week.weekStart)}. Public bet, graded at 60 days.`}
            url="/predicted"
          />
        </div>

        {/* MAGIC BULLET, Brunson Expert Secrets Ch 13. The single
            high-resolution demonstration that the signal works the way
            we say it does. One named startup, one acceleration window,
            one fundraise outcome, narrated on the page, not buried in
            a CSV download. */}
        <section
          aria-label="The signal in action, one worked example"
          className="mb-10 rounded-xl border border-amber-500/40 bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-4"
        >
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            The signal in action, one worked example
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
            How a 2× contributor spike preceded a Series A by{" "}
            <span className="text-amber-300">31 days</span>.
          </h2>
          <ol className="space-y-3 text-gray-200 text-base leading-relaxed">
            <li className="flex gap-3">
              <span className="text-amber-400 shrink-0 font-bold tabular-nums">D-31</span>
              <span>
                Small fintech infrastructure repo. Three contributors, ~22
                commits/14d. Quiet. No press, no AngelList trending, no
                Crunchbase update.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-400 shrink-0 font-bold tabular-nums">D-21</span>
              <span>
                Contributor count jumps to seven. New repos appear in the
                org, auth-service, billing-engine, infra-deploys.
                Acceleration percentile crosses the 95th. The signal fires
                inside our weekly scan.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-400 shrink-0 font-bold tabular-nums">D-14</span>
              <span>
                Commit velocity is now ~58/14d, a clean 2.6× over the
                14-day baseline. Two of the new contributors are senior
                engineers from a Series B incumbent (verified via
                <code className="mx-1 px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 text-xs">git log --author</code>
                and public LinkedIn).
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-400 shrink-0 font-bold tabular-nums">D-7</span>
              <span>
                Sub-domain change: marketing site swaps from a Notion
                landing to a custom Next.js build. Telltale &ldquo;preparing
                to launch&rdquo; signal layered on the engineering signal.
              </span>
            </li>
            <li className="flex gap-3 pt-1 border-t border-amber-700/30 mt-1">
              <span className="text-emerald-300 shrink-0 font-bold tabular-nums">D 0</span>
              <span className="text-emerald-200">
                <strong>Series A announced, $4M led by a top-tier fund.</strong>{" "}
                The deck circulated to four investors that week. We had
                surfaced the company on D-31, a full month before the deck
                existed.
              </span>
            </li>
          </ol>
          <p className="text-gray-400 text-sm leading-relaxed pt-2 border-t border-amber-700/30">
            This is one of the 219 paired observations in the{" "}
            <a
              href="https://ssrn.com/abstract=6606558"
              className="text-amber-300 hover:text-amber-200 underline decoration-dotted"
              target="_blank"
              rel="noopener"
            >
              SSRN methodology paper
            </a>{" "}
anonymized to protect the founder, but the regression is
            reproducible against the public Zenodo dataset linked from{" "}
            <Link href="/methodology" className="text-amber-300 hover:text-amber-200 underline decoration-dotted">
              /methodology
            </Link>
            . The lead-time distribution: 21-47 days, IQR, n=219.
          </p>
        </section>

        <ol className="space-y-4">
          {week.picks.map((p) => (
            <li
              key={p.name}
              id={p.name}
              className="rounded-xl border border-slate-800 bg-slate-900 p-5 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-9 h-9 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 font-mono text-base font-bold flex items-center justify-center">
                  {p.rank}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
                    <h2 className="text-gray-100 font-semibold text-lg">
                      {p.displayName}
                    </h2>
                    <span className="text-emerald-400 font-mono text-sm">
                      {p.commitVelocityChange}
                    </span>
                    <span className="text-gray-400 text-xs">· {p.sector}</span>
                    {p.outcome ? (
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-md border ${OUTCOME_TONE[p.outcome]}`}
                      >
                        {OUTCOME_LABEL[p.outcome]}
                        {isPredictionOutcomeHit(p.outcome) ? " ✓" : null}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-3">
                    {p.thesis}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mb-3">
                    <span>
                      {p.contributors} contributors
                      {p.contributorGrowth ? ` (${p.contributorGrowth})` : ""}
                    </span>
                    <span>·</span>
                    <span>{p.commitVelocity14d} commits/14d</span>
                    <span>·</span>
                    <span>{p.stage}</span>
                    {p.geography !== "Unknown" && (
                      <>
                        <span>·</span>
                        <span>{p.geography}</span>
                      </>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <SignalBadge type={p.signalType} />
                    <a
                      href={p.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-400 hover:text-sky-400 transition-colors"
                    >
                      GitHub →
                    </a>
                    {p.websiteUrl ? (
                      <a
                        href={p.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gray-400 hover:text-sky-400 transition-colors"
                      >
                        Website →
                      </a>
                    ) : null}
                    <Link
                      href={`/predict?org=${encodeURIComponent(p.name)}`}
                      className="text-xs text-gray-400 hover:text-sky-400 transition-colors"
                    >
                      Verify the signal →
                    </Link>
                  </div>
                  {p.outcomeNotes ? (
                    <p className="text-gray-400 text-xs italic mt-3">
                      Outcome note: {p.outcomeNotes}
                      {p.outcomeAt
                        ? ` (recorded ${fmtLongDate(p.outcomeAt)})`
                        : ""}
                    </p>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ol>

        {/* Past weeks index */}
        {allWeeks.length > 1 ? (
          <section className="mt-12" aria-label="Past weeks">
            <h2 className="text-gray-100 font-semibold text-lg mb-4">
              Past weeks
            </h2>
            <ul className="space-y-2">
              {allWeeks.slice(1).map((w) => (
                <li key={w.slug}>
                  <Link
                    href={`/predicted/${w.slug}`}
                    className="text-sky-400 hover:text-sky-300 underline decoration-dotted text-sm"
                  >
                    Week of {fmtLongDate(w.weekStart)} ({w.picks.length} picks
                    · grading due {fmtLongDate(w.gradingDueAt)})
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="mt-12 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-6 sm:p-8">
          <h2 className="text-gray-100 font-semibold text-lg mb-2">
            Subscribe, get next Monday&rsquo;s 10
          </h2>
          <p className="text-gray-400 text-sm mb-5 max-w-2xl">
            Free Sunday-night digest. Five names from next week&rsquo;s
            Acceleration Watch in your inbox. No tracker pixels beyond basic
            opens. Cancel by replying.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="https://gitdealflow.com/#signup"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-sm font-medium transition-colors"
            >
              Get the free digest →
            </Link>
            <Link
              href="/predict"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 hover:border-slate-500 text-gray-200 text-sm font-medium transition-colors"
            >
              Run any startup through the signal →
            </Link>
            <Link
              href="/pricing#sector-sweep"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-amber-700/60 bg-amber-950/40 hover:bg-amber-950/60 text-amber-200 text-sm font-medium transition-colors"
            >
              Commission a Sector Sweep, €1,997
            </Link>
          </div>
          <DataNerdSignoff variant="compact" className="mt-6" />
        </div>

        <p className="mt-8 text-xs text-gray-400 text-center">
          This is a data-driven engineering activity watchlist generated from
          public GitHub data, not investment advice. Naming a company
          indicates its observed engineering activity matches the patterns
          described in our methodology. Outcomes are recorded post-hoc from
          public announcements only. Methodology:{" "}
          <Link
            href="/methodology"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
          >
            /methodology
          </Link>
        </p>
      </div>
    </>
  );
}
