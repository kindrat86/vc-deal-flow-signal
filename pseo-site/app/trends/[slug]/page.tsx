import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllTrendSlugs,
  parseTrendSlug,
  getSortedStartups,
  getDataLastModified,
  type Startup,
} from "@/lib/data";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import { DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";
import SeoCta from "@/components/SeoCta";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllTrendSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;
export const revalidate = 604800;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseTrendSlug(slug);
  if (!parsed) return {};

  const { sector, periodA, periodB } = parsed;
  const avgVelA = Math.round(
    parsed.snapshotA.startups.reduce((s, x) => s + x.commitVelocity14d, 0) /
      (parsed.snapshotA.startups.length || 1),
  );
  const avgVelB = Math.round(
    parsed.snapshotB.startups.reduce((s, x) => s + x.commitVelocity14d, 0) /
      (parsed.snapshotB.startups.length || 1),
  );
  const velChange =
    avgVelB > 0 ? Math.round(((avgVelA - avgVelB) / avgVelB) * 100) : 0;
  const delta =
    velChange >= 0 ? `+${velChange}%` : `${velChange}%`;
  const title = `${sector.name} Startup Momentum: ${periodA.name} vs ${periodB.name} (${delta})`;
  const description = `${sector.name} engineering momentum moved ${delta} period-over-period: avg 14-day commit velocity ${avgVelB} → ${avgVelA} across ${parsed.snapshotA.startups.length} tracked orgs. Commit velocity, contributor growth, new-repo trends.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "article", url: `/trends/${slug}` },
    alternates: { canonical: `/trends/${slug}` },
  };
}

export default async function TrendPage({ params }: PageProps) {
  const { slug } = await params;
  const parsed = parseTrendSlug(slug);

  if (!parsed) {
    notFound();
  }

  const { sector, periodA, periodB, snapshotA, snapshotB } = parsed;
  const sortedA = getSortedStartups(snapshotA.startups);
  const sortedB = getSortedStartups(snapshotB.startups);
  const lastModified = getDataLastModified();

  const avgVelA = Math.round(
    snapshotA.startups.reduce((s, x) => s + x.commitVelocity14d, 0) /
      (snapshotA.startups.length || 1)
  );
  const avgVelB = Math.round(
    snapshotB.startups.reduce((s, x) => s + x.commitVelocity14d, 0) /
      (snapshotB.startups.length || 1)
  );
  const velChange =
    avgVelB > 0 ? Math.round(((avgVelA - avgVelB) / avgVelB) * 100) : 0;

  // Cohort composition, computed from this page's own snapshot so every
  // trend page carries period-specific, sector-specific detail.
  const countBy = (rows: Startup[], key: (s: Startup) => string) => {
    const m = new Map<string, number>();
    for (const s of rows) {
      const k = key(s) || "Unknown";
      m.set(k, (m.get(k) ?? 0) + 1);
    }
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  };
  const stageMix = countBy(snapshotA.startups, (s) => s.stage);
  const geoMix = countBy(snapshotA.startups, (s) => s.geography);
  const newReposTotal = snapshotA.startups.reduce(
    (s, x) => s + x.newRepos,
    0,
  );
  const contributorsTotal = snapshotA.startups.reduce(
    (s, x) => s + x.contributors,
    0,
  );
  const delta =
    velChange >= 0 ? `+${velChange}%` : `${velChange}%`;

  // Sibling trends for the same sector, newest first, for discovery.
  const siblingTrends = getAllTrendSlugs()
    .filter((s) => s.startsWith(`${sector.slug}-`) && s !== slug)
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `https://signals.gitdealflow.com/trends/${slug}#webpage`,
        url: `https://signals.gitdealflow.com/trends/${slug}`,
        name: `${sector.name} Trend: ${periodA.name} vs ${periodB.name}`,
        description: `Period-over-period engineering acceleration trend for ${sector.name.toLowerCase()} startups.`,
        inLanguage: "en-US",
        isAccessibleForFree: true,
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["[data-speakable]", "h1", "h2"],
        },
      },
      {
        "@type": "Article",
        headline: `${sector.name}: ${periodA.name} vs ${periodB.name}`,
        description: `Period-over-period engineering acceleration trend for ${sector.name.toLowerCase()} startups.`,
        author: DATA_NERD_AUTHOR_REF,
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        dateModified: lastModified.toISOString().slice(0, 10),
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
            name: `${sector.name} Trend`,
            item: `https://signals.gitdealflow.com/trends/${slug}`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `How much did ${sector.name} startup engineering momentum change between ${periodB.name} and ${periodA.name}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Average 14-day commit velocity across tracked ${sector.name.toLowerCase()} orgs moved from ${avgVelB} in ${periodB.name} to ${avgVelA} in ${periodA.name}, a ${delta} change, with ${snapshotA.startups.length} orgs in the current period.`,
            },
          },
          {
            "@type": "Question",
            name: `Which ${sector.name} startups accelerated the most in ${periodA.name}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `By period-over-period commit-velocity change, the top movers were ${sortedA
                .slice(0, 5)
                .map((s) => `${s.name} (${s.commitVelocityChange})`)
                .join(", ")}. The full ranked leaderboard is on the ${sector.name} ${periodA.name} page.`,
            },
          },
          {
            "@type": "Question",
            name: "What is commit velocity and why does it matter for deal flow?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Commit velocity is the number of code commits an engineering team lands per 14-day window, compared against its own 90-day baseline. Sustained acceleration in public repositories tends to precede hiring waves and fundraise announcements by several weeks, which is what makes it useful as an early deal-flow signal.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={`https://signals.gitdealflow.com/trends/${slug}`}
        languages={getHreflangLanguages(`/trends/${slug}`)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">
            {sector.name} Trend
          </span>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
            {sector.name}: {periodA.name} vs {periodB.name}
          </h1>
          <p className="text-gray-400 text-base leading-relaxed">
            Period-over-period comparison of {sector.name.toLowerCase()}{" "}
            startup engineering acceleration. How has the sector&apos;s
            engineering momentum changed between {periodB.name} and{" "}
            {periodA.name}?
          </p>
          <div
            className="mt-5 rounded-lg border border-sky-700/40 bg-sky-950/20 px-5 py-4"
            data-speakable
          >
            <p className="text-gray-300 text-base leading-relaxed">
              <strong className="text-gray-100">
                {sector.name} engineering momentum moved {delta} period-over-period:
              </strong>{" "}
              average 14-day commit velocity went from {avgVelB} in{" "}
              {periodB.name} to {avgVelA} in {periodA.name} across{" "}
              {snapshotA.startups.length} tracked orgs. The fastest movers were{" "}
              {sortedA
                .slice(0, 3)
                .map((s) => s.name)
                .join(", ")}
              .
            </p>
          </div>
        </header>

        {/* Stage + geography mix computed from this page's own snapshot */}
        <section className="mb-10" aria-label="Composition of the sector this period">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Who is in the {sector.name} cohort, {periodA.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-sky-400 mb-3">
                By stage
              </h3>
              <ul className="space-y-1.5 text-sm text-gray-300">
                {stageMix.map(([stage, count]) => (
                  <li key={stage} className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span>{stage}</span>
                    <span className="text-gray-400 font-mono">{count}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium text-sky-400 mb-3">
                By geography
              </h3>
              <ul className="space-y-1.5 text-sm text-gray-300">
                {geoMix.map(([geo, count]) => (
                  <li key={geo} className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span>{geo}</span>
                    <span className="text-gray-400 font-mono">{count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mt-4">
            Stage labels are inferred from repository scale and activity, not
            self-reported. Geography reflects the primary location associated
            with each public GitHub organization. Both mixes shift as the
            cohort changes between periods, which is why the same sector can
            look very different two quarters in a row.
          </p>
        </section>

        {/* Summary stats */}
        <section className="mb-10" aria-label="Trend summary">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <p className="text-gray-400 text-xs mb-1">
                Startups ({periodA.name})
              </p>
              <p className="text-gray-100 text-xl font-bold">
                {snapshotA.startups.length}
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <p className="text-gray-400 text-xs mb-1">
                Startups ({periodB.name})
              </p>
              <p className="text-gray-100 text-xl font-bold">
                {snapshotB.startups.length}
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <p className="text-gray-400 text-xs mb-1">Avg Velocity (now)</p>
              <p className="text-gray-100 text-xl font-bold">{avgVelA}</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <p className="text-gray-400 text-xs mb-1">Velocity Trend</p>
              <p
                className={`text-xl font-bold ${
                  velChange > 0
                    ? "text-emerald-400"
                    : velChange < 0
                      ? "text-red-400"
                      : "text-gray-100"
                }`}
              >
                {velChange > 0 ? "+" : ""}
                {velChange}%
              </p>
            </div>
          </div>
        </section>

        {/* Side-by-side top 5 */}
        <section className="mb-10" aria-label="Top movers comparison">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Top 5 by Period
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-sky-400 mb-3">
                {periodA.name}
              </h3>
              <div className="space-y-2">
                {sortedA.slice(0, 5).map((s, i) => (
                  <div
                    key={s.name}
                    className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-900 px-3 py-2"
                  >
                    <span className="text-gray-300 text-sm">
                      <span className="text-gray-400 font-mono mr-2">
                        {i + 1}.
                      </span>
                      {s.name}
                    </span>
                    <span className="text-emerald-400 text-xs font-mono font-semibold">
                      {s.commitVelocityChange}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-3">
                {periodB.name}
              </h3>
              <div className="space-y-2">
                {sortedB.slice(0, 5).map((s, i) => (
                  <div
                    key={s.name}
                    className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-900 px-3 py-2"
                  >
                    <span className="text-gray-400 text-sm">
                      <span className="text-gray-400 font-mono mr-2">
                        {i + 1}.
                      </span>
                      {s.name}
                    </span>
                    <span className="text-gray-400 text-xs font-mono">
                      {s.commitVelocityChange}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <SeoCta className="mb-10" />

        {/* Links to full rankings */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Full Rankings
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/startups-to-watch/${sector.slug}-${periodA.slug}`}
              className="inline-flex items-center px-4 py-2 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-sm font-medium transition-colors"
            >
              {sector.name}, {periodA.name} &rarr;
            </Link>
            <Link
              href={`/startups-to-watch/${sector.slug}-${periodB.slug}`}
              className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-600 hover:border-slate-500 text-gray-300 text-sm font-medium transition-colors"
            >
              {sector.name}, {periodB.name} &rarr;
            </Link>
          </div>
        </section>

        {/* Breadth + breadth context from the snapshot */}
        <section className="mb-10" aria-label="Cohort breadth">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            How broad is this cohort
          </h2>
          <p className="text-gray-300 text-base leading-relaxed mb-4">
            Beyond the top movers, the {periodA.name} {sector.name.toLowerCase()}{" "}
            cohort spans {contributorsTotal} active contributors who together
            opened {newReposTotal} new public repositories during the window.
            Breadth matters more than any single company: a sector where many
            teams add repositories and contributors at once is usually
            entering a build phase that shows up in funding rounds one to two
            quarters later, while a sector led by one or two outliers is more
            fragile than its headline number suggests.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            Treat the velocity trend as a screening input, not a verdict. A{" "}
            {delta} sector-wide move tells you where to spend attention next
            week; the per-company detail behind it tells you whether the move
            is real or driven by a single team pushing a release.
          </p>
        </section>

        {/* How to read this page */}
        <section className="mb-10" aria-label="How to read this page">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            How to read this comparison
          </h2>
          <ol className="list-decimal pl-5 space-y-2 text-gray-300 text-base leading-relaxed marker:text-sky-400">
            <li>
              Start with the velocity trend ({delta}). It answers one question:
              is this sector accelerating or cooling compared with{" "}
              {periodB.name}?
            </li>
            <li>
              Check the stage and geography mix. A cohort dominated by
              early-stage teams behaves differently from one weighted toward
              later-stage companies; the same headline number can mean
              different things.
            </li>
            <li>
              Scan the top-5 lists for both periods. Companies appearing in
              both are sustained accelerators, the strongest single pattern in
              this dataset. Companies appearing in only the newer period are
              new breakouts worth a manual look.
            </li>
            <li>
              Follow through to the full leaderboard before acting. The trend
              page shows aggregates; the ranking page shows each company
              against its own baseline.
            </li>
          </ol>
        </section>

        {/* Methodology */}
        <section
          className="mb-10 rounded-xl border border-slate-800 bg-slate-900/60 p-6"
          aria-label="Methodology"
        >
          <h2 className="text-lg font-semibold text-gray-100 mb-3">
            How these numbers are built
          </h2>
          <p className="text-gray-300 text-base leading-relaxed mb-3">
            Every metric on this page is computed from public GitHub activity
            for {snapshotA.startups.length} tracked {sector.name.toLowerCase()}{" "}
            organizations. Commit velocity is commits in the last 14 days
            compared with the org&apos;s own 90-day average; contributor
            growth and new-repo creation are measured on the same windows.
            Nothing is self-reported, and no private data is used.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            The full methodology, including how orgs enter and leave the
            cohort, is published at{" "}
            <Link
              href="/methodology"
              className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
            >
              /methodology
            </Link>
            . An academic write-up of the signal family is available as{" "}
            <a
              href="https://ssrn.com/abstract=6606558"
              target="_blank"
              rel="noopener"
              className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
            >
              SSRN preprint 6606558
            </a>
            .
          </p>
        </section>

        {/* Visible FAQ, matches the FAQPage JSON-LD */}
        <section className="mb-10" aria-label="Frequently asked questions">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Common questions
          </h2>
          <dl className="space-y-4">
            <div className="border-l-2 border-slate-700 pl-4 space-y-1.5">
              <dt className="text-gray-100 font-semibold text-base">
                How much did {sector.name} engineering momentum change between{" "}
                {periodB.name} and {periodA.name}?
              </dt>
              <dd className="text-gray-300 text-base leading-relaxed">
                Average 14-day commit velocity moved from {avgVelB} to{" "}
                {avgVelA}, a {delta} change, across {snapshotA.startups.length}{" "}
                tracked orgs.
              </dd>
            </div>
            <div className="border-l-2 border-slate-700 pl-4 space-y-1.5">
              <dt className="text-gray-100 font-semibold text-base">
                Which {sector.name} startups accelerated the most in{" "}
                {periodA.name}?
              </dt>
              <dd className="text-gray-300 text-base leading-relaxed">
                By commit-velocity change: {sortedA.slice(0, 5).map((s) => `${s.name} (${s.commitVelocityChange})`).join(", ")}.
                The full ranked leaderboard is on the {sector.name}{" "}
                {periodA.name} page.
              </dd>
            </div>
            <div className="border-l-2 border-slate-700 pl-4 space-y-1.5">
              <dt className="text-gray-100 font-semibold text-base">
                What is commit velocity and why does it matter for deal flow?
              </dt>
              <dd className="text-gray-300 text-base leading-relaxed">
                Commit velocity is the number of code commits an engineering
                team lands per 14-day window, compared against its own 90-day
                baseline. Sustained acceleration in public repositories tends
                to precede hiring waves and fundraise announcements by several
                weeks, which is what makes it useful as an early deal-flow
                signal.
              </dd>
            </div>
          </dl>
        </section>

        {siblingTrends.length > 0 && (
          <section
            className="mb-10 border-t border-slate-800 pt-6"
            aria-label="More trends for this sector"
          >
            <h2 className="text-sm text-sky-300 font-semibold uppercase tracking-wider mb-3">
              More {sector.name} comparisons
            </h2>
            <ul className="space-y-2">
              {siblingTrends.map((s) => {
                const p = parseTrendSlug(s);
                if (!p) return null;
                return (
                  <li key={s}>
                    <Link
                      href={`/trends/${s}`}
                      className="text-gray-300 hover:text-sky-200 text-base leading-relaxed underline decoration-dotted decoration-slate-600 hover:decoration-sky-300"
                    >
                      {p.sector.name}, {p.periodA.name} vs {p.periodB.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}
