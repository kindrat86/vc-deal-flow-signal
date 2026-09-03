import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllSectors,
  getCurrentPeriod,
  getTopMoversThisWeek,
  getTotalTrackedThisWeek,
  getDataLastModified,
  type TopMover,
} from "@/lib/data";
import { getAuthor } from "@/content/authors";
import { panelClaimFloor } from "@/lib/canonical-claims";
import StatCallout from "@/components/StatCallout";
import PSEOFooterNav from "@/components/PSEOFooterNav";
import SeoCta from "@/components/SeoCta";
import { withEditorialOverride } from "@/lib/metadata";

export const revalidate = 3600;

const SITE = "https://signals.gitdealflow.com";

/** Minimum velocity-change a mover must clear to read as a genuine breakout. */
const BREAKOUT_VELOCITY_FLOOR = 30;
/** Minimum contributor count for a "real team" breakout. */
const BREAKOUT_CONTRIBUTOR_FLOOR = 8;

const SIGNAL_NARRATIVE: Record<string, string> = {
  "Engineering hiring burst":
    "A hiring burst is the classic post-raise signature: new engineers onboard and ship immediately. It has historically preceded an announced round by three to six weeks.",
  "Infrastructure buildout":
    "New repositories signal platform investment ahead of a product expansion. It tends to show up three to six weeks before a funding announcement.",
  "Deploy frequency spike":
    "A sharp rise in deploy cadence usually means a launch or a competitive response. It is one of the fastest-compressing lead signals we track.",
  "Framework migration":
    "A stack transition from exploration to production usually marks the moment a team is scaling a validated product rather than prototyping.",
};

const SIGNAL_FALLBACK =
  "A measurable acceleration in engineering activity, the earliest publicly available signal that a startup is entering a build-and-scale phase.";

function signalNarrative(signalType: string): string {
  return SIGNAL_NARRATIVE[signalType] ?? SIGNAL_FALLBACK;
}

interface BreakoutRoundup {
  breakouts: TopMover[];
  totalTracked: number;
  sectorCount: number;
  periodName: string;
  lastModified: string;
}

/** Computes this week's breakout roundup from the live dataset (deterministic). */
function getBreakoutRoundup(): BreakoutRoundup {
  const period = getCurrentPeriod();
  const totalTracked = getTotalTrackedThisWeek();
  const sectorCount = getAllSectors().filter(
    (s) => s.periods[period.slug],
  ).length;
  const lastModified = getDataLastModified().toISOString().slice(0, 10);

  const movers = getTopMoversThisWeek(25, 30);
  const qualified = movers.filter(
    (m) =>
      m.velocityChangePct >= BREAKOUT_VELOCITY_FLOOR &&
      m.contributors >= BREAKOUT_CONTRIBUTOR_FLOOR,
  );
  const breakouts = (qualified.length >= 5 ? qualified : movers).slice(0, 10);

  return {
    breakouts,
    totalTracked,
    sectorCount,
    periodName: period.name,
    lastModified,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const { breakouts, totalTracked, sectorCount, periodName } =
    getBreakoutRoundup();
  const panelClaim = panelClaimFloor(totalTracked);
  const n = breakouts.length;
  const top = breakouts[0];
  const title =
    n >= 5
      ? `Breakout Startups This Week: ${n} Engineering Teams Accelerating Fastest`
      : "Breakout Startups This Week: Fastest-Accelerating Engineering Teams";

  const description = `${n} startups across ${sectorCount} sectors posted the fastest GitHub engineering acceleration this week${top ? `, led by ${top.name} at ${top.commitVelocityChange} commit velocity` : ""}. Data from ${panelClaim} tracked orgs.`;

  const discoverTags = breakouts
    .slice(0, 5)
    .flatMap((m) => [m.name, m.sectorName])
    .filter(Boolean);
  const newsKeywords = [
    "breakout startups",
    "engineering acceleration",
    "commit velocity",
    "startup signals",
    ...breakouts.slice(0, 5).map((m) => m.name),
    periodName,
  ]
    .filter(Boolean)
    .join(", ");

  return withEditorialOverride({
    title,
    description,
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: "/breakout-startups-this-week",
      publishedTime: getDataLastModified().toISOString(),
      modifiedTime: getDataLastModified().toISOString(),
      tags: discoverTags,
      images: [
        { url: `${SITE}/breakout-startups-this-week/opengraph-image`, width: 1200, height: 630 },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: "/breakout-startups-this-week",
    },
    other: {
      news_keywords: newsKeywords,
    },
  });
}

export default function BreakoutStartupsThisWeekPage() {
  const { breakouts, totalTracked, sectorCount, periodName, lastModified } =
    getBreakoutRoundup();
  const top = breakouts[0];
  const author = getAuthor("the-data-nerd");

  const keyStats = [
    { value: String(breakouts.length), label: "Breakouts this week", context: "Above the 30% velocity floor" },
    { value: String(totalTracked), label: "Startups tracked", context: "Across 15 sectors" },
    { value: String(sectorCount), label: "Sectors represented", context: periodName },
    ...(top
      ? [{ value: top.commitVelocityChange, label: "Fastest mover", context: top.name }]
      : []),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${SITE}/breakout-startups-this-week#article`,
        headline: `Breakout Startups This Week, ${periodName}`,
        name: "Breakout Startups This Week",
        description: `The ${breakouts.length} startups with the fastest GitHub engineering acceleration this week, ranked by commit velocity change across ${sectorCount} sectors.`,
        url: `${SITE}/breakout-startups-this-week`,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${SITE}/breakout-startups-this-week`,
        },
        image: {
          "@type": "ImageObject",
          url: `${SITE}/breakout-startups-this-week/opengraph-image`,
          width: 1200,
          height: 630,
        copyrightNotice: "\u00a9 VC Deal Flow Signal (GitDealFlow). Licensed under CC BY 4.0.",
        creator: { "@id": "https://signals.gitdealflow.com/about#person" },
        acquireLicensePage: "https://signals.gitdealflow.com/terms",
        },
        inLanguage: "en-US",
        isAccessibleForFree: true,
        isFamilyFriendly: true,
        license: "https://creativecommons.org/licenses/by/4.0/",
        copyrightHolder: { "@id": "https://gitdealflow.com/#organization" },
        copyrightYear: new Date(lastModified).getUTCFullYear(),
        datePublished: lastModified,
        dateModified: lastModified,
        lastReviewed: lastModified,
        author: {
          "@type": "Person",
          "@id": `${SITE}/about#person`,
          name: author.name,
          url: author.url,
          jobTitle: author.jobTitle,
          affiliation: {
            "@type": "Organization",
            name: author.affiliation,
            url: "https://gitdealflow.com",
          },
          knowsAbout: author.credentials,
          sameAs: author.sameAs,
        },
        publisher: {
          "@type": "Organization",
          "@id": "https://gitdealflow.com/#organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
          logo: {
            "@type": "ImageObject",
            url: `${SITE}/icon.png`,
            width: 192,
            height: 192,
          copyrightNotice: "\u00a9 VC Deal Flow Signal (GitDealFlow). Licensed under CC BY 4.0.",
          creator: { "@id": "https://signals.gitdealflow.com/about#person" },
          acquireLicensePage: "https://signals.gitdealflow.com/terms",
          },
        },
        audience: {
          "@type": "Audience",
          audienceType: "Venture capital investors and operators",
          name: "Investors evaluating engineering-led startups",
        },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", ".speakable", "[data-agent-summary]"],
        },
      },
      {
        "@type": "ItemList",
        name: `Breakout Startups This Week, ${periodName}`,
        numberOfItems: breakouts.length,
        itemListElement: breakouts.map((m, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: m.name,
          description: `${m.sectorName}: ${m.commitVelocityChange} commit velocity, ${m.contributors} contributors, ${m.signalType.toLowerCase()}.`,
          url: m.githubUrl,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "All Sectors", item: SITE },
          { "@type": "ListItem", position: 2, name: "Trending", item: `${SITE}/trending` },
          { "@type": "ListItem", position: 3, name: "Breakout Startups This Week", item: `${SITE}/breakout-startups-this-week` },
        ],
      },
      {
        "@type": "Dataset",
        name: `Breakout Startup Engineering Signals, ${periodName}`,
        description: `The ${breakouts.length} startups with the fastest GitHub engineering acceleration this week, ranked by commit velocity change. Commit velocity, contributor growth, and signal classification from public GitHub data.`,
        url: `${SITE}/breakout-startups-this-week`,
        license: "https://signals.gitdealflow.com/terms",
        creator: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        distribution: {
          "@type": "DataDownload",
          encodingFormat: "application/json",
          contentUrl: `${SITE}/api/signals.json`,
        },
        temporalCoverage: periodName,
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE}/breakout-startups-this-week#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "What makes a startup a breakout this week?",
            acceptedAnswer: {
              "@type": "Answer",
              text: `A startup clears the breakout bar when it posts at least 30 commits in the trailing 14-day window, has a real contributor team, and shows a commit-velocity change of 30% or more versus its own baseline. That triple filter separates genuine acceleration from noise.`,
            },
          },
          {
            "@type": "Question",
            name: "How are these startups ranked?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "By commit-velocity change over the trailing 14-day window, descending. Velocity change is the rate at which engineering activity is accelerating relative to each startup's own baseline, so a small but rapidly accelerating org can outrank a larger but flat one.",
            },
          },
          {
            "@type": "Question",
            name: "Is this investment advice?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. Breakout Startups This Week is a weekly data snapshot drawn from public GitHub activity. It is a starting point for diligence, not a recommendation. Investors should combine engineering signals with founder evaluation, market analysis, and product diligence before acting.",
            },
          },
          {
            "@type": "Question",
            name: "How often is this page updated?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Weekly, after each Monday data refresh. The page re-renders from the latest dataset, so the rankings, counts, and narrative reflect the current period automatically.",
            },
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <Link href="/trending" className="hover:text-gray-300 transition-colors">
            Trending
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Breakout Startups This Week</span>
        </nav>

        <header className="mb-8 max-w-3xl">
          <p className="text-sky-400 text-sm font-medium mb-2 uppercase tracking-wider">
            {periodName}, Weekly Roundup
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
            Breakout Startups This Week
          </h1>
          <p className="text-gray-400 text-base leading-relaxed" data-agent-summary>
            The GitHub activity of {totalTracked} venture-backed startups shifted
            again this week. {breakouts.length} cleared our breakout bar: at least
            30 commits in 14 days, a real contributor team, and a commit-velocity
            change of 30% or more. These are the engineering teams accelerating
            fastest right now, typically three to six weeks before a round is
            announced.
          </p>
        </header>

        {top && (
          <section className="mb-8" aria-label="Lead breakout">
            <div className="rounded-lg border border-sky-900/50 bg-sky-950/30 p-5">
              <p className="text-xs font-medium text-sky-400 uppercase tracking-wider mb-2">
                Lead breakout
              </p>
              <p className="text-gray-300 text-sm leading-relaxed speakable">
                {top.name} ({top.sectorName}) leads the board with{" "}
                {top.commitVelocityChange} commit velocity change and{" "}
                {top.contributors} contributors. The dominant signal is{" "}
                {top.signalType.toLowerCase()}. {signalNarrative(top.signalType)}
              </p>
            </div>
          </section>
        )}

        <section className="mb-10" aria-label="Breakout rankings">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            The {breakouts.length} Breakouts, Ranked
          </h2>
          <ol className="space-y-4">
            {breakouts.map((m, i) => (
              <li key={m.name}>
                <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sky-400 text-xl font-bold min-w-[2rem]">
                      #{i + 1}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-gray-100 font-semibold text-base leading-snug">
                        {m.name}
                        <span className="text-gray-500 font-normal"> · {m.sectorName}</span>
                      </h3>
                      <p className="text-gray-400 text-xs mt-0.5">
                        {m.commitVelocityChange} commit velocity · {m.contributors} contributors ·{" "}
                        {m.newRepos} new repos
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    <span className="text-sky-400 font-medium">{m.signalType}:</span>{" "}
                    {signalNarrative(m.signalType)}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                    {m.websiteUrl && (
                      <a
                        href={m.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-500 hover:text-sky-400 underline decoration-dotted"
                      >
                        Website
                      </a>
                    )}
                    <a
                      href={m.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-500 hover:text-sky-400 underline decoration-dotted"
                    >
                      GitHub
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <StatCallout
          stats={keyStats}
          source="Public GitHub activity"
          sourceHref="/methodology"
        />

        <section className="mb-10 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
          <h2 className="text-gray-100 font-semibold text-lg mb-3">
            How to read this
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Every number above is reproducible from public GitHub data. We rank by
            commit-velocity change, the rate at which engineering activity is
            accelerating relative to each startup's own baseline. A high rank means
            the team is shipping faster than it was, which in our panel has
            historically preceded announced rounds by three to six weeks. It is a
            lead signal, not a verdict. Full methodology at{" "}
            <Link href="/methodology" className="text-sky-500 hover:text-sky-400 underline">
              /methodology
            </Link>
            .
          </p>
        </section>

        <PSEOFooterNav excludeHrefs={["/breakout-startups-this-week"]} />

        <SeoCta
          heading="Get the breakout list before the round gets crowded"
          signoffIndex={6}
          className="mt-10"
        />
      </div>
    </>
  );
}
