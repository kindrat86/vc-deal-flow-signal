import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getStartupPeriodData,
  getAllStartupPeriodPairs,
  getDataLastModified,
} from "@/lib/data";
import { HreflangLinks } from "@/components/HreflangLinks";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { DEFAULT_HREFLANG_LANGUAGES } from "@/lib/hreflang";

const SITE = "https://signals.gitdealflow.com";

interface PageProps {
  params: Promise<{ slug: string; period: string }>;
}

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
  const d = getStartupPeriodData(slug, period);
  if (!d) return {};

  const title = `${d.profile.name} Engineering Signal — ${d.entry.periodName} Snapshot`;
  const description = `${d.profile.name} engineering activity in ${d.entry.periodName}: ${d.entry.commitVelocityChange} commit velocity change, ${d.entry.contributors} contributors, signal type: ${d.entry.signalType}. Ranked ${d.sectorRank} of ${d.sectorTotal} ${d.entry.sectorName} startups by engineering acceleration.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "article" },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: `/startup/${slug}/${period}` },
  };
}

export default async function StartupPeriodPage({ params }: PageProps) {
  const { slug, period } = await params;
  const d = getStartupPeriodData(slug, period);

  if (!d) {
    notFound();
  }

  const { profile, entry, prevEntry, nextEntry, sectorRank, sectorTotal } = d;
  const lastModified = getDataLastModified();
  const dateModified = lastModified.toISOString().slice(0, 10);
  const canonical = `${SITE}/startup/${slug}/${period}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: `${profile.name} — ${entry.periodName} Engineering Signal`,
        description: `${profile.name} engineering activity in ${entry.periodName}: ${entry.commitVelocityChange} commit velocity change, ${entry.contributors} contributors, ranked ${sectorRank} of ${sectorTotal} ${entry.sectorName} startups.`,
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
        dateModified,
        about: {
          "@type": "SoftwareApplication",
          name: profile.name,
          url: profile.githubUrl,
          applicationCategory: "BusinessApplication",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "All Sectors", item: SITE },
          {
            "@type": "ListItem",
            position: 2,
            name: profile.name,
            item: `${SITE}/startup/${slug}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: entry.periodName,
            item: canonical,
          },
        ],
      },
      {
        "@type": "Observation",
        observationDate: entry.periodSlug,
        about: {
          "@type": "SoftwareApplication",
          name: profile.name,
          url: profile.githubUrl,
        },
        measuredProperty: {
          "@type": "PropertyValue",
          name: "Commit velocity (14-day window)",
          value: entry.commitVelocity14d,
        },
        observedNode: { "@id": `${SITE}/startup/${slug}#startup` },
      },
    ],
  };

  return (
    <>
      <HreflangLinks canonical={canonical} languages={DEFAULT_HREFLANG_LANGUAGES} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path={`/startup/${slug}/${period}`} qaCategory="general" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/startup/${slug}`} className="hover:text-gray-300 transition-colors">
            {profile.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">{entry.periodName}</span>
        </nav>

        <header className="mb-8">
          <p className="text-sky-400 text-sm font-medium mb-2 uppercase tracking-wider">
            {entry.periodName} Snapshot
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
            {profile.name} — {entry.periodName} Engineering Signal
          </h1>
          <p className="text-gray-400 text-base leading-relaxed">
            {profile.description}
          </p>
        </header>

        <section className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3" aria-label="Key metrics">
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Commit velocity
            </p>
            <p className="text-gray-100 text-xl font-bold">{entry.commitVelocity14d}</p>
            <p className="text-gray-400 text-xs mt-1">{entry.commitVelocityChange}</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Contributors
            </p>
            <p className="text-gray-100 text-xl font-bold">{entry.contributors}</p>
            <p className="text-gray-400 text-xs mt-1">{entry.contributorGrowth}</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              New repos
            </p>
            <p className="text-gray-100 text-xl font-bold">{entry.newRepos}</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Sector rank
            </p>
            <p className="text-gray-100 text-xl font-bold">
              #{sectorRank}
              <span className="text-gray-500 text-sm font-normal"> / {sectorTotal}</span>
            </p>
          </div>
        </section>

        <section className="mb-8" aria-label="Signal classification">
          <div className="rounded-lg border border-sky-900/50 bg-sky-950/30 p-5">
            <p className="text-xs font-medium text-sky-400 uppercase tracking-wider mb-2">
              Signal classification
            </p>
            <p className="text-gray-100 text-base font-medium mb-1">{entry.signalType}</p>
            <p className="text-gray-400 text-sm leading-relaxed">
              {profile.name} is classified as &ldquo;{entry.signalType.toLowerCase()}&rdquo; in{" "}
              {entry.periodName}, with stage {entry.stage} and geography {entry.geography}.
              In this snapshot, {profile.name} ranks {sectorRank} of {sectorTotal}{" "}
              {entry.sectorName} startups by engineering-acceleration metrics.
            </p>
          </div>
        </section>

        <section className="mb-12 grid grid-cols-1 sm:grid-cols-2 gap-3" aria-label="Period navigation">
          {prevEntry ? (
            <Link
              href={`/startup/${slug}/${prevEntry.periodSlug}`}
              className="block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-colors"
            >
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">← Previous period</p>
              <p className="text-gray-200 font-medium">{prevEntry.periodName}</p>
              <p className="text-gray-500 text-xs mt-1">
                {prevEntry.commitVelocityChange} · {prevEntry.signalType}
              </p>
            </Link>
          ) : <div />}
          {nextEntry ? (
            <Link
              href={`/startup/${slug}/${nextEntry.periodSlug}`}
              className="block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-colors text-right"
            >
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Next period →</p>
              <p className="text-gray-200 font-medium">{nextEntry.periodName}</p>
              <p className="text-gray-500 text-xs mt-1">
                {nextEntry.commitVelocityChange} · {nextEntry.signalType}
              </p>
            </Link>
          ) : <div />}
        </section>

        <section className="mb-10" aria-label="Related links">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Continue reading
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href={`/startup/${slug}`}
              className="block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-colors"
            >
              <h3 className="text-gray-200 font-medium text-sm mb-1">
                {profile.name} — full timeline
              </h3>
              <p className="text-gray-500 text-xs">All quarters tracked.</p>
            </Link>
            <Link
              href={`/startups-to-watch/${entry.sectorSlug}-${entry.periodSlug}`}
              className="block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-colors"
            >
              <h3 className="text-gray-200 font-medium text-sm mb-1">
                {entry.sectorName} startups, {entry.periodName}
              </h3>
              <p className="text-gray-500 text-xs">
                Full sector ranking for this period.
              </p>
            </Link>
          </div>
        </section>

        <a
          href={profile.githubUrl}
          rel="noopener noreferrer"
          className="inline-flex items-center text-sky-400 hover:text-sky-300 text-sm transition-colors"
        >
          {profile.name} on GitHub →
        </a>
      </div>
    </>
  );
}
