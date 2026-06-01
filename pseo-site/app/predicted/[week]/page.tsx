import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SignalBadge from "@/components/SignalBadge";
import ShareBar from "@/components/ShareBar";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import SeoCta from "@/components/SeoCta";
import {
  getAllPredictionWeekSlugs,
  getPredictionWeek,
  fmtLongDate,
  isPredictionOutcomeHit,
  buildClaimReviewItems,
  type PredictionOutcome,
} from "@/lib/predictions";

interface RouteContext {
  params: Promise<{ week: string }>;
}

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPredictionWeekSlugs().map((week) => ({ week }));
}

export async function generateMetadata({
  params,
}: RouteContext): Promise<Metadata> {
  const { week: slug } = await params;
  const week = getPredictionWeek(slug);
  if (!week) return { title: "Week not found" };
  return {
    title: `Acceleration Watch — Week of ${fmtLongDate(week.weekStart)} | VC Deal Flow Signal`,
    description: `10 startups whose GitHub engineering acceleration crossed the signal threshold the week of ${fmtLongDate(week.weekStart)}. Public bet, graded post-hoc against fundraise / acquisition news at ${week.windowDays} days.`,
    alternates: { canonical: `/predicted/${week.slug}` },
    openGraph: {
      title: `Acceleration Watch — Week of ${fmtLongDate(week.weekStart)}`,
      description: `10 named startups, graded post-hoc. Window closes ${fmtLongDate(week.gradingDueAt)}.`,
      url: `https://signals.gitdealflow.com/predicted/${week.slug}`,
      type: "article",
      publishedTime: week.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: `Acceleration Watch — Week of ${fmtLongDate(week.weekStart)}`,
      description: `10 named startups, graded post-hoc. Window closes ${fmtLongDate(week.gradingDueAt)}.`,
    },
  };
}

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

export default async function PredictedWeekPage({ params }: RouteContext) {
  const { week: slug } = await params;
  const week = getPredictionWeek(slug);
  if (!week) notFound();

  const hits = week.picks.filter((p) =>
    isPredictionOutcomeHit(p.outcome),
  ).length;
  const graded = week.picks.filter(
    (p) => p.outcome !== null && p.outcome !== "excluded",
  ).length;
  const pending = week.picks.filter((p) => p.outcome === null).length;

  // F4 — top-level ClaimReview blocks for every published pick
  // (excluding outcome === "excluded" only). Uses Google's controlled
  // fact-check vocabulary so resolved picks are rich-result eligible:
  //   raised|acquired|ipo  → True       (5)
  //   other_milestone      → Mixture    (3)
  //   no_event|shutdown    → False      (1)
  //   pending (null)       → Unproven   (0)
  // ClaimReview blocks are spread directly into @graph — never nested under
  // Article.review (durable rule: feedback_review_jsonld_must_be_top_level.md).
  const claimReviewItems = buildClaimReviewItems(week, {
    skipExcluded: true,
    includePending: true,
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `https://signals.gitdealflow.com/predicted/${week.slug}#article`,
        headline: `Acceleration Watch — Week of ${fmtLongDate(week.weekStart)}`,
        description: `10 startups whose GitHub engineering acceleration crossed the signal threshold the week of ${fmtLongDate(week.weekStart)}. Graded ${week.windowDays} days post-publish.`,
        url: `https://signals.gitdealflow.com/predicted/${week.slug}`,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://signals.gitdealflow.com/predicted/${week.slug}`,
        },
        datePublished: week.publishedAt,
        dateModified: week.publishedAt,
        inLanguage: "en-US",
        isAccessibleForFree: true,
        license: "https://creativecommons.org/licenses/by/4.0/",
        author: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        image: {
          "@type": "ImageObject",
          url: `https://signals.gitdealflow.com/predicted/${week.slug}/opengraph-image`,
          width: 1200,
          height: 630,
        },
      },
      ...claimReviewItems,
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
        name: `Acceleration Watch — Week of ${fmtLongDate(week.weekStart)}`,
        numberOfItems: week.picks.length,
        itemListElement: week.picks.map((p) => ({
          "@type": "ListItem",
          position: p.rank,
          name: p.displayName,
          url: p.githubUrl,
          description: p.thesis,
        })),
      },
    ],
  };

  return (
    <>
      <AgentMirrorLinks
        path={`/predicted/${week.slug}`}
        qaCategory="methodology"
      />
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
          <Link
            href="/predicted"
            className="hover:text-gray-300 transition-colors"
          >
            Acceleration Watch
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Week of {fmtLongDate(week.weekStart)}</span>
        </nav>

        <header className="mb-8">
          <p className="text-emerald-400 text-sm font-medium mb-3 uppercase tracking-wider">
            Archive · {week.slug}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
            Acceleration Watch — Week of {fmtLongDate(week.weekStart)}
          </h1>
          <p className="text-gray-400 text-base leading-relaxed max-w-2xl">
            10 named startups whose GitHub engineering acceleration crossed
            our signal threshold during the week of {fmtLongDate(week.weekStart)}–{fmtLongDate(week.weekEnd)}.
            Grading window closes {fmtLongDate(week.gradingDueAt)}.
          </p>
        </header>

        <section className="mb-8 rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-bold text-gray-100">{hits}</div>
              <div className="text-xs text-gray-400 mt-1">Hits</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-100">{graded}</div>
              <div className="text-xs text-gray-400 mt-1">Graded</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-100">{pending}</div>
              <div className="text-xs text-gray-400 mt-1">Pending</div>
            </div>
          </div>
        </section>

        <div className="mb-8">
          <ShareBar
            title={`Acceleration Watch — week of ${fmtLongDate(week.weekStart)}: 10 named startups, graded post-hoc.`}
            url={`/predicted/${week.slug}`}
          />
        </div>

        <ol className="space-y-4">
          {week.picks.map((p) => (
            <li
              key={p.name}
              id={p.name}
              className="rounded-xl border border-slate-800 bg-slate-900 p-5"
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

        <div className="mt-12">
          <SeoCta
            heading="Get next week's picks before they're public"
            signoffIndex={2}
          />
        </div>

        <div className="mt-8">
          <Link
            href="/predicted"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted text-sm"
          >
            ← Back to current Acceleration Watch
          </Link>
        </div>
      </div>
    </>
  );
}
