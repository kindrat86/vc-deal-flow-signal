import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllTop100Slugs,
  getTop100,
  formatIsoWeekLabel,
  isoWeekToMonday,
} from "@/lib/top-100";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";

const SITE = "https://signals.gitdealflow.com";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllTop100Slugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;
export const revalidate = 604800;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const snap = getTop100(slug);
  if (!snap) return {};
  const label = formatIsoWeekLabel(slug);
  const top = snap.rankings[0];
  const description = top
    ? `Composite leaderboard of ${snap.summary.totalRanked} distinct startups ranked by GitHub engineering signal — ${label}. #1 this week: ${top.name} (Signal Score ${top.signalScore}, ${top.commitVelocityChange} commit velocity, ${top.contributorGrowth} contributor growth).`
    : `Top 100 GitHub-Signal Startups for ${label}.`;
  return {
    title: `Top 100 GitHub-Signal Startups — ${label}`,
    description,
    alternates: { canonical: `/weekly/top-100/${slug}` },
    openGraph: {
      title: `Top 100 GitHub-Signal Startups — ${label}`,
      description,
      type: "article",
      url: `${SITE}/weekly/top-100/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `Top 100 GitHub-Signal Startups — ${label}`,
      description,
    },
  };
}

function ScoreBar({ score, max }: { score: number; max: number }) {
  const pct = Math.max(0, Math.min(100, ((score - -20) / (max - -20)) * 100));
  return (
    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
      <div
        className="h-full bg-sky-500"
        style={{ width: `${pct.toFixed(1)}%` }}
      />
    </div>
  );
}

export default async function Top100WeeklyPage({ params }: PageProps) {
  const { slug } = await params;
  const snap = getTop100(slug);
  if (!snap) notFound();

  const label = formatIsoWeekLabel(slug);
  const monday = isoWeekToMonday(slug);
  const dateIso = monday ? monday.toISOString().slice(0, 10) : "";
  const pageUrl = `${SITE}/weekly/top-100/${slug}`;
  const max = snap.summary.topSignalScore;

  // Sector roll-up: count how many of the top-100 each sector contributed
  const sectorCounts = new Map<
    string,
    { name: string; count: number; topRow?: (typeof snap.rankings)[number] }
  >();
  for (const row of snap.rankings) {
    const cur = sectorCounts.get(row.sectorSlug);
    if (cur) {
      cur.count += 1;
      if (!cur.topRow || row.signalScore > cur.topRow.signalScore) {
        cur.topRow = row;
      }
    } else {
      sectorCounts.set(row.sectorSlug, {
        name: row.sectorName,
        count: 1,
        topRow: row,
      });
    }
  }
  const sectorRollup = [...sectorCounts.entries()]
    .map(([sectorSlug, v]) => ({ sectorSlug, ...v }))
    .sort((a, b) => b.count - a.count);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline: `Top 100 GitHub-Signal Startups — ${label}`,
        datePublished: dateIso,
        dateModified: dateIso,
        author: {
          "@type": "Person",
          name: "The Data Nerd",
          url: `${SITE}/about`,
        },
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: SITE,
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
        url: pageUrl,
        inLanguage: "en-US",
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#leaderboard`,
        name: `Top 100 GitHub-Signal Startups — ${label}`,
        numberOfItems: snap.rankings.length,
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        itemListElement: snap.rankings.slice(0, 100).map((r) => ({
          "@type": "ListItem",
          position: r.rank,
          name: r.name,
          url: r.githubUrl || `${SITE}/startup/${r.name}`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "All Sectors", item: SITE },
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
          {
            "@type": "ListItem",
            position: 4,
            name: label,
            item: pageUrl,
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <Link href="/weekly" className="hover:text-gray-300 transition-colors">
            Weekly Reports
          </Link>
          <span className="mx-2">/</span>
          <Link
            href="/weekly/top-100"
            className="hover:text-gray-300 transition-colors"
          >
            Top 100 Index
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">{label}</span>
        </nav>

        <p className="text-gray-500 text-xs mb-2">{dateIso}</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          Top 100 GitHub-Signal Startups — {label}
        </h1>
        <p
          className="text-gray-400 text-base leading-relaxed mb-8 speakable"
          data-agent-summary={`Composite leaderboard of ${snap.summary.totalRanked} distinct startups across ${snap.summary.sectorsCovered} sectors for ${label}. The Signal Score combines four capped components: commit velocity change, contributor growth, raw commit scale, and contributor count. Top this week is ${snap.rankings[0]?.name ?? "n/a"} with a Signal Score of ${snap.rankings[0]?.signalScore ?? 0}.`}
        >
          {snap.summary.totalRanked} distinct startups ranked across{" "}
          {snap.summary.sectorsCovered} sectors. Top Signal Score this week:{" "}
          <span className="text-gray-200 font-medium">
            {snap.rankings[0]?.signalScore ?? 0}
          </span>{" "}
          ({snap.rankings[0]?.name}). Median Signal Score:{" "}
          <span className="text-gray-200 font-medium">
            {snap.summary.medianSignalScore}
          </span>
          .
        </p>

        <details className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 mb-8 text-sm text-gray-400 leading-relaxed">
          <summary className="text-gray-200 font-semibold text-base cursor-pointer">
            Methodology
          </summary>
          <pre className="mt-3 text-xs text-gray-300 font-mono whitespace-pre-wrap break-words">
            {snap.methodology}
          </pre>
        </details>

        <h2 className="text-xl font-semibold text-gray-100 mb-4">
          Sector roll-up
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
          {sectorRollup.map((s) => (
            <Link
              key={s.sectorSlug}
              href={`/${s.sectorSlug}-${snap.period}`}
              className="rounded-lg border border-slate-800 bg-slate-900 p-3 hover:border-slate-600 transition-colors"
            >
              <p className="text-gray-200 text-sm font-medium">{s.name}</p>
              <p className="text-gray-500 text-xs mt-1">
                {s.count} in top-100 · top: {s.topRow?.name}
              </p>
            </Link>
          ))}
        </div>

        <h2 className="text-xl font-semibold text-gray-100 mb-4">
          The leaderboard
        </h2>
        <ol className="space-y-3">
          {snap.rankings.map((r) => {
            const profileHref = `/startup/${r.name}`;
            const subline = [
              r.commitVelocityChange + " commits",
              r.contributorGrowth + " team",
              r.commitVelocity14d + " c/14d",
              r.contributors + " devs",
              r.signalType,
            ].join(" · ");
            return (
              <li
                key={`${r.rank}-${r.name}`}
                className="rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 text-right">
                    <p className="text-gray-500 text-xs">rank</p>
                    <p className="text-gray-100 font-bold text-lg leading-none">
                      {r.rank}
                    </p>
                  </div>
                  <div className="flex-shrink-0 w-16 text-right">
                    <p className="text-gray-500 text-xs">score</p>
                    <p className="text-sky-300 font-bold text-lg leading-none">
                      {r.signalScore}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-3 flex-wrap">
                      <Link
                        href={profileHref}
                        className="text-gray-100 font-semibold text-base hover:text-sky-400 transition-colors"
                      >
                        {r.name}
                      </Link>
                      <span className="text-xs text-gray-500">
                        {r.sectorName}
                        {r.alsoInSectors && r.alsoInSectors.length > 0 && (
                          <>
                            {" · also "}
                            {r.alsoInSectors.map((a) => a.name).join(", ")}
                          </>
                        )}
                      </span>
                    </div>
                    {r.description && (
                      <p className="text-gray-400 text-sm mt-1 leading-snug">
                        {r.description}
                      </p>
                    )}
                    <p className="text-gray-500 text-xs mt-2">{subline}</p>
                    <div className="mt-2">
                      <ScoreBar score={r.signalScore} max={max} />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs">
                      {r.githubUrl && (
                        <a
                          href={r.githubUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-sky-400 hover:text-sky-300"
                        >
                          GitHub →
                        </a>
                      )}
                      {r.websiteUrl && (
                        <a
                          href={r.websiteUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-sky-400 hover:text-sky-300"
                        >
                          Website →
                        </a>
                      )}
                      <Link
                        href={profileHref}
                        className="text-sky-400 hover:text-sky-300"
                      >
                        Full profile →
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        {snap.substackUrl && (
          <div className="mt-10 rounded-xl border border-amber-900/50 bg-amber-950/20 p-5 text-sm leading-relaxed">
            <h2 className="text-amber-200 font-semibold text-base mb-2">
              Substack mirror
            </h2>
            <p className="text-gray-300 mb-2">
              This edition is also live on Substack with a 30-second
              sector roll-up plus the full leaderboard:{" "}
              <a
                href={snap.substackUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="text-amber-300 hover:text-amber-200 underline"
              >
                {snap.substackUrl.replace("https://", "")}
              </a>
            </p>
            <p className="text-gray-500 text-xs">
              Same data, same canonical (this page). The Substack version is
              free, mirrors here every Monday.
            </p>
          </div>
        )}

        <div className="mt-12 rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-center">
          <h2 className="text-gray-100 font-semibold text-lg mb-2">
            Want next week&apos;s leaderboard in your inbox?
          </h2>
          <p className="text-gray-400 text-sm mb-5 max-w-lg mx-auto">
            Free weekly mirror on Substack. Full leaderboard plus a 30-second
            sector roll-up. No upsell, no paywall on the index itself.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="https://gitdealflow.com/#signup"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors"
            >
              Get next Monday&apos;s index
            </Link>
            <a
              href="https://gitdealflow.substack.com/subscribe"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg border border-slate-700 hover:border-slate-500 text-gray-200 text-sm font-medium transition-colors"
            >
              Subscribe on Substack
            </a>
          </div>
        </div>

        <AgentMirrorLinks
          path={`/weekly/top-100/${slug}`}
          qaCategory="methodology"
        />
      </div>
    </>
  );
}
