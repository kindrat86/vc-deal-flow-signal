import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getStartupPeriodData,
  getAllStartupPeriodPairs,
  getDataLastModified,
  getRelatedStartups,
} from "@/lib/data";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";

interface PageProps {
  params: Promise<{ slug: string; period: string }>;
}

export const dynamicParams = false;
export const revalidate = 604800;

export async function generateStaticParams() {
  return getAllStartupPeriodPairs().map(({ slug, period }) => ({
    slug,
    period,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, period } = await params;
  const data = getStartupPeriodData(slug, period);
  if (!data) return {};

  const title = `${data.profile.name} — ${data.entry.periodName} Engineering Signal`;
  const description = `${data.profile.name} engineering metrics in ${data.entry.periodName}: ${data.entry.commitVelocityChange} commit velocity change, ${data.entry.contributors} contributors, signal type: ${data.entry.signalType}. Historical snapshot from VC Deal Flow Signal.`;

  return {
    title,
    description,
    // Index-bloat control (2026-08-14): the ~1,700 period pages are
    // historical snapshots that already consolidate ranking signals to the
    // evergreen /startup/[slug] hub via the canonical below. noindex keeps
    // them OUT of the Google/Bing index (and they are dropped from the
    // sitemap — see app/sitemap/[id]/route.ts), while `follow` preserves the
    // prev/next + related-startups crawl paths so link equity still flows to
    // the base pages and sibling startups. Machine-readable mirrors (/md/,
    // /jsonld/, /api/signals.json) still expose the per-period data to
    // agents and AI crawlers.
    robots: {
      index: false,
      follow: true,
    },
    openGraph: { title, description, type: "article", url: `/startup/${slug}/${period}` },
    twitter: { card: "summary_large_image", title, description },
    alternates: {
      // Historical snapshots consolidate ranking signals to the evergreen
      // startup hub, so the ~1,700 period pages don't cannibalize their own
      // base /startup/[slug] page for the startup-name head keyword.
      canonical: `/startup/${slug}`,
      types: {
        "text/markdown": `/md/startup/${slug}/${period}`,
        "application/ld+json": `/jsonld/startup/${slug}/${period}`,
      },
    },
  };
}

export default async function StartupPeriodPage({ params }: PageProps) {
  const { slug, period } = await params;
  const data = getStartupPeriodData(slug, period);

  if (!data) notFound();

  const { profile, entry, nextEntry, prevEntry, sectorRank, sectorTotal } = data;
  const lastModified = getDataLastModified();
  const velNum = parseInt(entry.commitVelocityChange.replace(/[^0-9-]/g, ""), 10) || 0;

  // Same-sector peers from this page's own period, so historical snapshots
  // cross-link to the startups they were moving with at the time.
  const relatedStartups = getRelatedStartups(slug, entry.sectorSlug, 6, period);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `https://signals.gitdealflow.com/startup/${slug}/${period}#article`,
        headline: `${profile.name} — ${entry.periodName} Engineering Signal`,
        name: `${profile.name} — ${entry.periodName} Engineering Signal`,
        description: `${profile.name} engineering metrics and signal classification for ${entry.periodName}: ${entry.commitVelocityChange} commit velocity change, ${entry.contributors} contributors, signal type ${entry.signalType}.`,
        url: `https://signals.gitdealflow.com/startup/${slug}/${period}`,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://signals.gitdealflow.com/startup/${slug}/${period}`,
        },
        image: {
          "@type": "ImageObject",
          url: `https://signals.gitdealflow.com/api/og/startup/${slug}.png`,
          width: 1200,
          height: 630,
        },
        inLanguage: "en-US",
        isAccessibleForFree: true,
        license: "https://creativecommons.org/licenses/by/4.0/",
        author: DATA_NERD_AUTHOR_REF,
        publisher: {
          "@type": "Organization",
          "@id": "https://gitdealflow.com/#organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
          logo: {
            "@type": "ImageObject",
            url: "https://signals.gitdealflow.com/icon.png",
            width: 192,
            height: 192,
          },
        },
        datePublished: lastModified.toISOString().slice(0, 10),
        dateModified: lastModified.toISOString().slice(0, 10),
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "[aria-label='Period summary']", ".speakable", "[data-agent-summary]"],
        },
        about: {
          "@type": "Organization",
          name: profile.name,
          description: profile.description,
          ...(profile.websiteUrl ? { url: profile.websiteUrl } : {}),
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
            name: profile.name,
            item: `https://signals.gitdealflow.com/startup/${slug}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: entry.periodName,
            item: `https://signals.gitdealflow.com/startup/${slug}/${period}`,
          },
        ],
      },
      {
        "@type": "WebPage",
        "@id": `https://signals.gitdealflow.com/startup/${slug}/${period}#webpage`,
        url: `https://signals.gitdealflow.com/startup/${slug}/${period}`,
        name: `${profile.name} — ${entry.periodName} Engineering Signal`,
        inLanguage: "en-US",
        isPartOf: { "@id": "https://signals.gitdealflow.com/#website" },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "[aria-label='Period summary']", ".speakable", "[data-agent-summary]"],
        },
      },
      {
        "@type": "FAQPage",
        "@id": `https://signals.gitdealflow.com/startup/${slug}/${period}#faq`,
        url: `https://signals.gitdealflow.com/startup/${slug}/${period}`,
        inLanguage: "en-US",
        mainEntity: [
          {
            "@type": "Question",
            name: `What was ${profile.name}'s engineering signal in ${entry.periodName}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `In ${entry.periodName}, ${profile.name} showed ${entry.commitVelocityChange} commit velocity change with ${entry.contributors} active contributors (${entry.contributorGrowth} growth). Signal type: ${entry.signalType}.${typeof sectorRank === "number" && typeof sectorTotal === "number" ? ` Ranked ${sectorRank} of ${sectorTotal} in its sector that period.` : ""}`,
            },
          },
          {
            "@type": "Question",
            name: `What does the ${entry.signalType} signal mean?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `The ${entry.signalType} signal indicates a specific pattern of engineering acceleration. Full classification logic and the four-signal taxonomy are documented at /methodology and /signals.`,
              url: "https://signals.gitdealflow.com/methodology",
            },
          },
          {
            "@type": "Question",
            name: `Where can I find ${profile.name}'s historical signal data across periods?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `The startup hub at /startup/${slug} consolidates every period of historical signal data for ${profile.name}, including commit-velocity change, contributor growth, and signal classification. The free /api/signals.json endpoint exposes the same data for programmatic access.`,
              url: `https://signals.gitdealflow.com/startup/${slug}`,
            },
          },
        ],
      },
      ...(relatedStartups.length > 0
        ? [
            {
              "@type": "ItemList",
              name: `Related startups in ${entry.sectorName} (${entry.periodName})`,
              itemListElement: relatedStartups.map((r, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: r.name,
                url: `https://signals.gitdealflow.com/startup/${r.slug}`,
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path={`/startup/${slug}/${period}`} qaCategory="sector" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={`/startup/${slug}`}
            className="hover:text-gray-300 transition-colors"
          >
            {profile.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">{entry.periodName}</span>
        </nav>

        <header className="mb-8">
          <p className="text-sky-400 text-sm font-medium mb-2 uppercase tracking-wider">
            {entry.periodName} · Historical Snapshot
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 leading-tight">
            {profile.name} — {entry.periodName} Engineering Signal
          </h1>
          <p className="text-gray-400 text-base mt-2 leading-relaxed">
            {profile.description}
          </p>
        </header>

        <section className="mb-8" aria-label="Period summary">
          <div className="rounded-lg border border-sky-900/50 bg-sky-950/30 p-5">
            <p className="text-xs font-medium text-sky-400 uppercase tracking-wider mb-2">
              Signal — {entry.periodName}
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              In {entry.periodName}, {profile.name} showed{" "}
              {entry.commitVelocityChange} commit velocity change with{" "}
              {entry.contributors} active contributors ({entry.contributorGrowth}{" "}
              growth). Signal type:{" "}
              <strong className="text-gray-200">{entry.signalType}</strong>.{" "}
              {entry.newRepos > 0 &&
                `${entry.newRepos} new ${entry.newRepos === 1 ? "repository" : "repositories"} created in the 30 days preceding this period. `}
              {sectorTotal > 0 &&
                `Ranked #${sectorRank} of ${sectorTotal} in ${entry.sectorName} for ${entry.periodName}.`}
            </p>
          </div>
        </section>

        <section className="mb-10" aria-label="Period metrics">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Metrics — {entry.periodName}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <p className="text-gray-400 text-xs mb-1">Commit Velocity (14d)</p>
              <p className="text-gray-100 text-xl font-bold">
                {entry.commitVelocity14d}
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <p className="text-gray-400 text-xs mb-1">Velocity Change</p>
              <p
                className={`text-xl font-bold ${
                  velNum > 0
                    ? "text-emerald-400"
                    : velNum < 0
                      ? "text-red-400"
                      : "text-gray-100"
                }`}
              >
                {entry.commitVelocityChange}
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <p className="text-gray-400 text-xs mb-1">Contributors</p>
              <p className="text-gray-100 text-xl font-bold">
                {entry.contributors}
              </p>
              <p className="text-gray-400 text-xs mt-0.5">
                {entry.contributorGrowth} growth
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <p className="text-gray-400 text-xs mb-1">New Repos (30d)</p>
              <p className="text-gray-100 text-xl font-bold">{entry.newRepos}</p>
            </div>
          </div>
        </section>

        <section className="mb-10" aria-label="Period context">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Context
          </h2>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-5 text-gray-400 text-sm leading-relaxed space-y-3">
            <p>
              <strong className="text-gray-200">Sector:</strong> {entry.sectorName} (
              <Link
                href={`/startups-to-watch/${entry.sectorSlug}-${period}`}
                className="text-sky-500 hover:text-sky-400 underline transition-colors"
              >
                full {entry.periodName} ranking
              </Link>
              )
            </p>
            <p>
              <strong className="text-gray-200">Stage at time of snapshot:</strong>{" "}
              {entry.stage}
            </p>
            <p>
              <strong className="text-gray-200">Geography:</strong> {entry.geography}
            </p>
            <p>
              <strong className="text-gray-200">Signal classification:</strong>{" "}
              {entry.signalType} —{" "}
              <Link
                href={`/signals/${signalSlug(entry.signalType)}`}
                className="text-sky-500 hover:text-sky-400 underline transition-colors"
              >
                learn what this signal means
              </Link>
            </p>
          </div>
        </section>

        <nav className="mb-10" aria-label="Period navigation">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevEntry && (
              <Link
                href={`/startup/${slug}/${prevEntry.periodSlug}`}
                className="group rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-colors"
              >
                <p className="text-gray-400 text-xs mb-1">← Previous</p>
                <p className="text-gray-200 font-medium text-sm group-hover:text-sky-400 transition-colors">
                  {prevEntry.periodName}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  {prevEntry.commitVelocityChange} · {prevEntry.signalType}
                </p>
              </Link>
            )}
            {nextEntry && (
              <Link
                href={`/startup/${slug}/${nextEntry.periodSlug}`}
                className="group rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-colors"
              >
                <p className="text-gray-400 text-xs mb-1 text-right">Next →</p>
                <p className="text-gray-200 font-medium text-sm group-hover:text-sky-400 transition-colors text-right">
                  {nextEntry.periodName}
                </p>
                <p className="text-gray-400 text-xs mt-1 text-right">
                  {nextEntry.commitVelocityChange} · {nextEntry.signalType}
                </p>
              </Link>
            )}
          </div>
        </nav>

        {/* Same-sector peers from this period */}
        {relatedStartups.length > 0 && (
          <section className="mb-10" aria-label="Related startups">
            <h2 className="text-lg font-semibold text-gray-100 mb-4">
              Related Startups in {entry.sectorName} ({entry.periodName})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedStartups.map((r) => {
                const rChangePct =
                  parseInt(r.commitVelocityChange.replace(/[^0-9-]/g, ""), 10) || 0;
                return (
                  <Link
                    key={r.slug}
                    href={`/startup/${r.slug}`}
                    className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-sky-700/50 hover:bg-slate-800/80 transition-all"
                  >
                    <h3 className="text-gray-200 font-medium text-sm group-hover:text-sky-400 transition-colors mb-1.5">
                      {r.name}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      <span className="inline-block rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-gray-400">
                        {r.stage}
                      </span>
                      <span className="inline-block rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-gray-400">
                        {r.signalType}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>
                        Velocity:{" "}
                        <span className={rChangePct >= 0 ? "text-emerald-400" : "text-red-400"}>
                          {r.commitVelocityChange}
                        </span>
                      </span>
                      <span>
                        Commits: <span className="text-gray-300">{r.commitVelocity14d}</span>
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-center">
          <h2 className="text-gray-100 font-semibold text-lg mb-2">
            See {profile.name}&apos;s current signal
          </h2>
          <p className="text-gray-400 text-sm mb-5 max-w-lg mx-auto">
            This page shows a historical snapshot. For the most recent data,
            view the full profile.
          </p>
          <Link
            href={`/startup/${slug}`}
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-sm font-medium transition-colors"
          >
            View current profile →
          </Link>
        </div>
      </div>
    </>
  );
}

function signalSlug(signalType: string): string {
  const map: Record<string, string> = {
    "Engineering hiring burst": "hiring-burst",
    "Infrastructure buildout": "infrastructure-buildout",
    "Deploy frequency spike": "deploy-frequency-spike",
    "Framework migration": "framework-migration",
  };
  return map[signalType] ?? "hiring-burst";
}
