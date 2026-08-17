import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllStartupSlugs,
  getStartupProfile,
  getCurrentPeriod,
  getRelatedStartups,
  getSectorLatestPeriod,
  getCrossSectorPeers,
  computeVelocityScore,
  getVelocityLabel,
} from "@/lib/data";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import CuriosityGate from "@/components/CuriosityGate";
import SeoCta from "@/components/SeoCta";
import DefinitionBlock from "@/components/DefinitionBlock";
import { DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";
import { BADGE_LABEL, BADGE_HEIGHT, badgeWidth, badgeValue } from "@/lib/badge-dims";
import CitableStat from "@/components/CitableStat";
import { citableStat } from "@/lib/citable-stats";
import { buildSourceTruthDataset } from "@/lib/dataset-schema";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllStartupSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;
export const revalidate = 604800;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = getStartupProfile(slug);
  if (!profile) return {};

  const latest = profile.history[0];
  // CTR: brand-name head + always-positive proof numbers from the latest
  // snapshot (same values the page renders). Absolute 14-day commit velocity
  // and contributor count read as evidence for every org; % change can be
  // negative (decelerating) and would make the SERP headline self-defeating.
  const title = `${profile.name}: ${latest.commitVelocity14d} Commits in 14 Days, ${latest.contributors} Contributors`;
  const description = `${profile.name} engineering acceleration tracked by VC Deal Flow Signal. ${latest.commitVelocityChange} commit velocity change, ${latest.contributors} contributors, signal type: ${latest.signalType}.${profile.description ? ' ' + profile.description.replace(/<[^>]+>/g, '').trim().substring(0, 160 - 120 - 5) : ''}`.substring(0, 152).trim() + '...';

  // Signal type description for OG
  const signalDescriptions: Record<string, string> = {
    "Engineering hiring burst": "Rapid team expansion indicating recent funding and engineering scale-up",
    "Infrastructure buildout": "New repository creation indicating platform investment and product expansion",
    "Deploy frequency spike": "Accelerated shipping cadence indicating product launch or competitive response",
    "Framework migration": "Technology stack transition indicating shift from exploration to production",
  };
  const signalDesc = signalDescriptions[latest.signalType] || `Engineering acceleration signal detected in ${profile.sectors[0] || latest.sectorName} sector`;

  // Google Discover: article:tag meta tags
  const discoverTags = [
    profile.name,
    ...profile.sectors,
    latest.signalType,
    profile.latestStage,
  ].filter(Boolean);

  // Google Discover: news_keywords as comma-separated string
  const sectorForKeywords = profile.sectors[0] || "";
  const newsKeywords = [
    profile.name,
    sectorForKeywords,
    latest.signalType,
    profile.latestStage,
    profile.latestGeography,
  ]
    .filter(Boolean)
    .join(", ");

  return {
    title,
    description,
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
    openGraph: {
      title,
      description: `${profile.name}, ${signalDesc}. ${latest.commitVelocityChange} commit velocity, ${latest.signalType} signal.`,
      type: "article",
      url: `/startup/${slug}`,
      tags: discoverTags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `/startup/${slug}`,
    },
    other: {
      "news_keywords": newsKeywords,
    },
  };
}

export default async function StartupPage({ params }: PageProps) {
  const { slug } = await params;
  const profile = getStartupProfile(slug);

  if (!profile) {
    notFound();
  }

  const period = getCurrentPeriod();
  const latest = profile.history[0];
  const prevEntry = profile.history.length > 1 ? profile.history[1] : null;

  // Compute velocity trend
  const latestVelNum =
    parseInt(latest.commitVelocityChange.replace(/[^0-9-]/g, ""), 10) || 0;
  const prevVelNum = prevEntry
    ? parseInt(prevEntry.commitVelocityChange.replace(/[^0-9-]/g, ""), 10) || 0
    : null;
  let trendLabel = "";
  if (prevVelNum !== null) {
    if (latestVelNum > prevVelNum) trendLabel = "Accelerating";
    else if (latestVelNum < prevVelNum) trendLabel = "Decelerating";
    else trendLabel = "Stable";
  }

  // Geography label
  const geoNames: Record<string, string> = {
    US: "United States",
    UK: "United Kingdom",
    EU: "Europe",
    APAC: "Asia-Pacific",
    Canada: "Canada",
    LATAM: "Latin America",
    MENA: "Middle East & North Africa",
    Unknown: "Not specified",
  };
  // Curiosity-gate projections are computed inside <CuriosityGate/> from this
  // org's real signal (lib/projection.ts), kept DRY with the list templates.
  const trackedCount = getAllStartupSlugs().length;

  const geoLabel = geoNames[profile.latestGeography] || profile.latestGeography;

  // GitHub org handle + avatar URL, derived from the canonical github.com URL
  // (always present, form https://github.com/{org}). GitHub serves a sized
  // avatar PNG at https://github.com/{org}.png?size=N (2x for retina at 48px).
  const githubOrg = profile.githubUrl.replace(/\/+$/, "").split("/").pop() || "";
  const avatarUrl = githubOrg
    ? `https://github.com/${githubOrg}.png?size=96`
    : null;

  // Related startups from the same sector
  const relatedStartups = getRelatedStartups(slug, latest.sectorSlug, 6);
  // Honesty: when the sector's freshest snapshot is older than the global
  // current period, say which cohort the related list comes from.
  const relatedPeriod = getSectorLatestPeriod(latest.sectorSlug);
  const relatedPeriodLabel =
    relatedPeriod && relatedPeriod.slug !== period.slug
      ? relatedPeriod.name
      : null;

  // Cross-sector peers: same-stage startups in adjacent sectors. Connects the
  // sector clusters into one graph so the long tail is not siloed.
  const crossSectorPeers = getCrossSectorPeers(slug, 3);

  // Generate FAQs
  const faqs = [
    {
      question: `What is ${profile.name}'s current engineering signal?`,
      answer: `As of ${latest.periodName}, ${profile.name} shows a "${latest.signalType}" signal with ${latest.commitVelocityChange} commit velocity change over a 14-day window, ${latest.contributors} active contributors, and ${latest.contributorGrowth} contributor growth. ${latest.signalType === "Engineering hiring burst" ? "This indicates rapid team expansion, often following a funding round." : latest.signalType === "Infrastructure buildout" ? "This indicates significant new infrastructure investment, often preceding a major product milestone." : latest.signalType === "Deploy frequency spike" ? "This indicates an accelerated shipping cadence, often seen before a public launch or major release." : "This indicates a technology stack transition, which often precedes a pivot or platform upgrade."}`,
    },
    {
      question: `Is ${profile.name} raising a funding round?`,
      answer: `VC Deal Flow Signal does not predict specific funding rounds. However, ${profile.name}'s engineering acceleration pattern (${latest.commitVelocityChange} commit velocity change in ${latest.periodName}) is the type of signal that has historically preceded fundraise announcements by three to six weeks. Investors should cross-reference this signal with other sources (Crunchbase, hiring activity, community mentions) before drawing conclusions.`,
    },
    {
      question: `How does ${profile.name} compare to other ${latest.sectorName.toLowerCase()} startups?`,
      answer: `${profile.name} is tracked in our ${latest.sectorName} sector rankings for ${latest.periodName}. View the full sector ranking at signals.gitdealflow.com/startups-to-watch/${latest.sectorSlug}-${latest.periodSlug} to see how it compares on commit velocity, contributor count, and signal type against other ${latest.sectorName.toLowerCase()} startups.`,
    },
  ];

  const orgSameAs = [profile.githubUrl, profile.websiteUrl, profile.linkedinUrl].filter(
    (u): u is string => Boolean(u)
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `https://signals.gitdealflow.com/startup/${slug}#webpage`,
        url: `https://signals.gitdealflow.com/startup/${slug}`,
        name: `${profile.name} Engineering Signal, GitHub Activity & Acceleration`,
        description: profile.description || `${profile.name} engineering acceleration data from VC Deal Flow Signal.`,
        isPartOf: {
          "@id": "https://signals.gitdealflow.com/#website",
        },
        breadcrumb: {
          "@id": `https://signals.gitdealflow.com/startup/${slug}#breadcrumb`,
        },
        about: {
          "@id": `https://signals.gitdealflow.com/startup/${slug}#org`,
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `https://signals.gitdealflow.com/startup/${slug}/opengraph-image`,
          width: 1200,
          height: 630,
        },
      },
      {
        "@type": "Article",
        "@id": `https://signals.gitdealflow.com/startup/${slug}#article`,
        headline: `${profile.name} Engineering Signal, GitHub Activity & Acceleration`,
        description: profile.description,
        image: {
          "@type": "ImageObject",
          url: `https://signals.gitdealflow.com/startup/${slug}/opengraph-image`,
          width: 1200,
          height: 630,
        },
        author: DATA_NERD_AUTHOR_REF,
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        dateModified: new Date().toISOString().slice(0, 10),
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["[aria-label='Key takeaway']", "h1", "[data-direct-answer]"],
        },
        about: {
          "@id": `https://signals.gitdealflow.com/startup/${slug}#org`,
        },
        mainEntity: {
          "@id": `https://signals.gitdealflow.com/startup/${slug}#org`,
        },
      },
      {
        // Tracked startup as an Organization. sameAs anchors GitHub +
        // optional website + LinkedIn so AI engines can disambiguate this
        // entity from name-collisions (e.g. "Pulse", "Vector", "Atlas").
        "@type": "Organization",
        "@id": `https://signals.gitdealflow.com/startup/${slug}#org`,
        name: profile.name,
        url: profile.websiteUrl || profile.githubUrl,
        description: profile.description,
        ...(orgSameAs.length > 0 ? { sameAs: orgSameAs } : {}),
        ...(profile.latestGeography
          ? {
              location: {
                "@type": "Place",
                name: geoLabel,
              },
            }
          : {}),
        // Render acceleration metrics as InteractionCounter for AIO surfaces.
        interactionStatistic: [
          {
            "@type": "InteractionCounter",
            name: "Commit velocity (14-day)",
            interactionType: "https://schema.org/WriteAction",
            userInteractionCount: latest.commitVelocity14d,
          },
          {
            "@type": "InteractionCounter",
            name: "Contributors",
            interactionType: "https://schema.org/JoinAction",
            userInteractionCount: latest.contributors,
          },
        ],
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
            name: latest.sectorName,
            item: `https://signals.gitdealflow.com/startups-to-watch/${latest.sectorSlug}-${latest.periodSlug}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: profile.name,
            item: `https://signals.gitdealflow.com/startup/${slug}`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
      ...(relatedStartups.length > 0
        ? [
            {
              "@type": "ItemList",
              name: `Related startups in ${latest.sectorName}`,
              itemListElement: relatedStartups.map((r, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: r.name,
                url: `https://signals.gitdealflow.com/startup/${r.slug}`,
              })),
            },
          ]
        : []),
      ...(crossSectorPeers.length > 0
        ? [
            {
              "@type": "ItemList",
              name: `Similar momentum in other sectors for ${profile.name}`,
              itemListElement: crossSectorPeers.map((p, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: p.name,
                url: `https://signals.gitdealflow.com/startup/${p.slug}`,
              })),
            },
          ]
        : []),
      buildSourceTruthDataset({
        url: `https://signals.gitdealflow.com/startup/${slug}`,
        name: `${profile.name}: Engineering Signal Dataset`,
        description: `Engineering-velocity signal record for ${profile.name}, tracked by the VC Deal Flow Signal (GitDealFlow) GitHub panel. ${profile.description}`,
        variableMeasured: [
          { name: "Commit velocity (14d)", value: latest.commitVelocity14d, unitText: "commits" },
          { name: "Commit velocity change", value: latest.commitVelocityChange },
          { name: "Active contributors", value: latest.contributors },
          { name: "Signal type", value: latest.signalType },
        ],
        temporalCoverage: latest.periodName,
      }),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path={`/startup/${slug}`} qaCategory="sector" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={`/startups-to-watch/${latest.sectorSlug}-${latest.periodSlug}`}
            className="hover:text-gray-300 transition-colors"
          >
            {latest.sectorName}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">{profile.name}</span>
        </nav>

        <article>
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                {avatarUrl && (
                  <img
                    src={avatarUrl}
                    alt={`${profile.name} ${latest.sectorName} startup logo`}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-lg object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                )}
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 leading-tight">
                  {profile.name}
                </h1>
              </div>
              <p className="text-gray-400 text-base mt-2 leading-relaxed">
                {profile.description}
              </p>
              <DefinitionBlock
                text={`${profile.name} is a startup tracked by VC Deal Flow Signal through its public GitHub activity. This profile records its commit velocity, contributors, and signal type as a benchmark for investors.`}
              />
            </div>
            {/* Mobile-first fix: actions row must wrap under the name on 360-390px
                phones (was shrink-0, pushed scrollWidth to 417px vs 390 viewport) */}
            <div className="flex flex-wrap items-center gap-2 min-w-0">
              {profile.websiteUrl && (
                <a
                  href={profile.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={profile.websiteUrl}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-700 text-gray-400 text-xs hover:text-gray-100 hover:border-slate-500 transition-colors"
                >
                  Website
                  <span aria-hidden="true">↗</span>
                </a>
              )}
              {profile.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="LinkedIn company page"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-700 text-gray-400 text-xs hover:text-gray-100 hover:border-slate-500 transition-colors"
                >
                  LinkedIn
                  <span aria-hidden="true">↗</span>
                </a>
              )}
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-700 text-gray-400 text-xs hover:text-gray-100 hover:border-slate-500 transition-colors"
              >
                GitHub
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          {/* Meta badges */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-block rounded-full bg-slate-800 px-3 py-1 text-xs text-gray-300">
              {profile.latestStage}
            </span>
            <span className="inline-block rounded-full bg-slate-800 px-3 py-1 text-xs text-gray-300">
              {geoLabel}
            </span>
            {profile.sectors.map((s) => (
              <span
                key={s}
                className="inline-block rounded-full bg-slate-800 px-3 py-1 text-xs text-gray-300"
              >
                {s}
              </span>
            ))}
          </div>
        </header>

        <CitableStat {...citableStat("startup")} template="startup" />

        {/* Key Takeaway */}
        <section className="mb-8" aria-label="Key takeaway">
          <div className="rounded-lg border border-sky-900/50 bg-sky-950/30 p-5">
            <p className="text-xs font-medium text-sky-400 uppercase tracking-wider mb-2">
              Current Signal, {latest.periodName}
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              {profile.name} shows {latest.commitVelocityChange} commit velocity
              change with {latest.contributors} active contributors (
              {latest.contributorGrowth} growth). Signal type:{" "}
              <strong className="text-gray-200">{latest.signalType}</strong>.{" "}
              {latest.newRepos > 0 &&
                `${latest.newRepos} new ${latest.newRepos === 1 ? "repository" : "repositories"} created in the last 30 days. `}
              {trendLabel &&
                `Trend vs. prior quarter: ${trendLabel.toLowerCase()} (was ${prevEntry?.commitVelocityChange} in ${prevEntry?.periodName}).`}
            </p>
            <p className="mt-3 text-gray-400 text-xs leading-relaxed">
              <dfn className="not-italic font-medium text-gray-300">
                Engineering acceleration
              </dfn>{" "}
              is a sustained rise in a startup&apos;s public GitHub output -
              commits, contributors, new repositories, relative to its own
              baseline. It is a quantitative signal computed from public data,
              unrelated to accelerator programs.
            </p>
            <p className="mt-3 text-gray-600 text-xs">
              Data sourced from public GitHub activity.{" "}
              <Link
                href="/methodology"
                className="text-sky-500 hover:text-sky-400 transition-colors"
              >
                Read our methodology
              </Link>
            </p>
          </div>
        </section>

        {/* Current metrics */}
        <section className="mb-10" aria-label="Current metrics">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Engineering Metrics, {latest.periodName}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <p className="text-gray-400 text-xs mb-1">
                Commit Velocity (14d)
              </p>
              <p className="text-gray-100 text-xl font-bold">
                {latest.commitVelocity14d}
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <p className="text-gray-400 text-xs mb-1">Velocity Change</p>
              <p
                className={`text-xl font-bold ${
                  latestVelNum > 0
                    ? "text-emerald-400"
                    : latestVelNum < 0
                      ? "text-red-400"
                      : "text-gray-100"
                }`}
              >
                {latest.commitVelocityChange}
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <p className="text-gray-400 text-xs mb-1">Contributors</p>
              <p className="text-gray-100 text-xl font-bold">
                {latest.contributors}
              </p>
              <p className="text-gray-400 text-xs mt-0.5">
                {latest.contributorGrowth} growth
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
              <p className="text-gray-400 text-xs mb-1">New Repos (30d)</p>
              <p className="text-gray-100 text-xl font-bold">
                {latest.newRepos}
              </p>
            </div>
          </div>

          <CuriosityGate
            change={latest.commitVelocityChange}
            signalType={latest.signalType}
            entityName={profile.name}
            otherCount={trackedCount - 1}
            contextLabel="startups we track"
            className="mt-4"
          />
        </section>

        {/* Velocity Score Report Card */}
        {(() => {
          const score = computeVelocityScore(profile);
          const label = getVelocityLabel(score);
          const scoreColor =
            score >= 80
              ? "text-emerald-400"
              : score >= 60
                ? "text-sky-400"
                : score >= 40
                  ? "text-amber-400"
                  : "text-gray-400";
          const barColor =
            score >= 80
              ? "bg-emerald-500"
              : score >= 60
                ? "bg-sky-500"
                : score >= 40
                  ? "bg-amber-500"
                  : "bg-gray-500";
          // Score breakdown
          const changePct =
            parseInt(latest.commitVelocityChange.replace(/[^0-9-]/g, ""), 10) || 0;
          const contribGrowthPct =
            parseInt(latest.contributorGrowth.replace(/[^0-9-]/g, ""), 10) || 0;
          return (
            <section className="mb-10" aria-label="Velocity report card">
              <h2 className="text-lg font-semibold text-gray-100 mb-4">
                Engineering Velocity Report Card
              </h2>
              <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Velocity Score</p>
                    <p className={`text-4xl font-bold ${scoreColor}`}>
                      {score}
                      <span className="text-lg text-gray-500 font-normal">/100</span>
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      <span className={`font-medium ${scoreColor}`}>{label}</span>
                      {score >= 60
                        ? ", Significant engineering activity detected"
                        : score >= 40
                          ? ", Moderate activity above baseline"
                          : ", Baseline activity level"}
                    </p>
                  </div>
                  <div className="w-24 h-24 rounded-full border-4 border-slate-700 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full border-4 border-slate-600 flex items-center justify-center overflow-hidden relative">
                      <div
                        className={`absolute bottom-0 left-0 right-0 ${barColor} transition-all duration-500`}
                        style={{ height: `${score}%` }}
                      />
                      <span className={`relative z-10 text-lg font-bold ${scoreColor}`}>
                        {score}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-md bg-slate-950/50 p-3">
                    <p className="text-gray-500 text-xs mb-1">Commit Velocity Change</p>
                    <p className={`font-semibold ${changePct >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {latest.commitVelocityChange}
                    </p>
                  </div>
                  <div className="rounded-md bg-slate-950/50 p-3">
                    <p className="text-gray-500 text-xs mb-1">Contributor Growth</p>
                    <p className={`font-semibold ${contribGrowthPct >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {latest.contributorGrowth}
                    </p>
                  </div>
                  <div className="rounded-md bg-slate-950/50 p-3">
                    <p className="text-gray-500 text-xs mb-1">New Repositories</p>
                    <p className="text-gray-200 font-semibold">{latest.newRepos}</p>
                  </div>
                  <div className="rounded-md bg-slate-950/50 p-3">
                    <p className="text-gray-500 text-xs mb-1">Signal Type</p>
                    <p className="text-gray-200 font-semibold">{latest.signalType}</p>
                  </div>
                </div>
              </div>
            </section>
          );
        })()}

        {/* Historical timeline */}
        {profile.history.length > 1 && (
          <section className="mb-10" aria-label="Signal history">
            <h2 className="text-lg font-semibold text-gray-100 mb-4">
              Signal History
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-left text-gray-400 text-xs">
                    <th className="pb-2 pr-4 font-medium">Period</th>
                    <th className="pb-2 pr-4 font-medium">Velocity (14d)</th>
                    <th className="pb-2 pr-4 font-medium">Change</th>
                    <th className="pb-2 pr-4 font-medium">Contributors</th>
                    <th className="pb-2 pr-4 font-medium">Growth</th>
                    <th className="pb-2 pr-4 font-medium">New Repos</th>
                    <th className="pb-2 font-medium">Signal</th>
                  </tr>
                </thead>
                <tbody>
                  {profile.history.map((entry, i) => {
                    const velNum =
                      parseInt(
                        entry.commitVelocityChange.replace(/[^0-9-]/g, ""),
                        10
                      ) || 0;
                    return (
                      <tr
                        key={`${entry.periodSlug}-${entry.sectorSlug}`}
                        className={`border-b border-slate-800/50 ${i === 0 ? "bg-slate-900/50" : ""}`}
                      >
                        <td className="py-2.5 pr-4 text-gray-300">
                          {entry.periodName}
                        </td>
                        <td className="py-2.5 pr-4 text-gray-400">
                          {entry.commitVelocity14d}
                        </td>
                        <td
                          className={`py-2.5 pr-4 font-medium ${
                            velNum > 0
                              ? "text-emerald-400"
                              : velNum < 0
                                ? "text-red-400"
                                : "text-gray-400"
                          }`}
                        >
                          {entry.commitVelocityChange}
                        </td>
                        <td className="py-2.5 pr-4 text-gray-400">
                          {entry.contributors}
                        </td>
                        <td className="py-2.5 pr-4 text-gray-400">
                          {entry.contributorGrowth}
                        </td>
                        <td className="py-2.5 pr-4 text-gray-400">
                          {entry.newRepos}
                        </td>
                        <td className="py-2.5 text-gray-400">
                          {entry.signalType}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* What this signal means */}
        <section className="mb-10" aria-label="Signal interpretation">
          <h2 className="text-lg font-semibold text-gray-100 mb-3">
            What This Signal Means for Investors
          </h2>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-5 text-gray-400 text-sm leading-relaxed space-y-3">
            {latest.signalType === "Engineering hiring burst" && (
              <>
                <p>
                  {profile.name}&apos;s contributor count is growing at{" "}
                  {latest.contributorGrowth}, which classifies as an{" "}
                  <strong className="text-gray-200">
                    engineering hiring burst
                  </strong>
                  . This pattern typically means the company has recently closed
                  a funding round and is rapidly scaling its engineering team.
                </p>
                <p>
                  If you are seeing this signal, you may be too late for the
                  current round but well-positioned for the next one. The team
                  expansion suggests the company has capital to deploy and is
                  building toward a product milestone.
                </p>
              </>
            )}
            {latest.signalType === "Infrastructure buildout" && (
              <>
                <p>
                  {profile.name} has created {latest.newRepos} new{" "}
                  {latest.newRepos === 1 ? "repository" : "repositories"} in 30
                  days, which classifies as an{" "}
                  <strong className="text-gray-200">
                    infrastructure buildout
                  </strong>
                  . This pattern typically appears at the seed-to-Series A
                  transition: the core product works, and the team is building
                  the supporting platform.
                </p>
                <p>
                  Infrastructure buildout requires capital and reflects
                  confidence in the product direction. For investors, this is
                  often an early signal that the company is preparing to scale.
                </p>
              </>
            )}
            {latest.signalType === "Deploy frequency spike" && (
              <>
                <p>
                  {profile.name}&apos;s commit velocity has increased{" "}
                  {latest.commitVelocityChange} versus baseline, which
                  classifies as a{" "}
                  <strong className="text-gray-200">
                    deploy frequency spike
                  </strong>
                  . The team is shipping code at an unusually high rate.
                </p>
                <p>
                  This can indicate a product launch, rapid iteration on
                  customer feedback, or a competitive response. All are
                  interesting signals for investors evaluating product-market
                  fit.
                </p>
              </>
            )}
            {latest.signalType === "Framework migration" && (
              <>
                <p>
                  {profile.name} shows general engineering acceleration that
                  classifies as a{" "}
                  <strong className="text-gray-200">framework migration</strong>
                  . This often indicates a technology stack transition, moving
                  from a prototype to production infrastructure, or adopting new
                  tooling.
                </p>
                <p>
                  Framework migrations are the subtlest signal type but can
                  indicate the shift from exploration to exploitation, a key
                  milestone in startup development that often precedes
                  fundraising.
                </p>
              </>
            )}
          </div>
        </section>

        {/* Related startups in the same sector */}
        {relatedStartups.length > 0 && (
          <section className="mb-10" aria-label="Related startups">
            <h2 className="text-lg font-semibold text-gray-100 mb-4">
              Related Startups in {latest.sectorName}
              {relatedPeriodLabel &&
                ` (${relatedPeriodLabel} cohort)`}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedStartups.map((r) => {
                const rChangePct = parseInt(r.commitVelocityChange.replace(/[^0-9-]/g, ""), 10) || 0;
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
            <Link
              href={`/startups-to-watch/${latest.sectorSlug}-${latest.periodSlug}`}
              className="inline-block mt-4 text-sky-400 hover:text-sky-300 text-sm font-medium"
            >
              View all {latest.sectorName} startups &rarr;
            </Link>
          </section>
        )}

        {/* Cross-sector peers: same stage in adjacent sectors */}
        {crossSectorPeers.length > 0 && (
          <section className="mb-10" aria-label="Similar momentum in other sectors">
            <h2 className="text-lg font-semibold text-gray-100 mb-4">
              Similar Momentum in Other Sectors
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {crossSectorPeers.map((p) => {
                const pChangePct =
                  parseInt(p.commitVelocityChange.replace(/[^0-9-]/g, ""), 10) ||
                  0;
                return (
                  <Link
                    key={p.slug}
                    href={`/startup/${p.slug}`}
                    className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-sky-700/50 hover:bg-slate-800/80 transition-all"
                  >
                    <h3 className="text-gray-200 font-medium text-sm group-hover:text-sky-400 transition-colors mb-1.5">
                      {p.name}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      <span className="inline-block rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-gray-400">
                        {p.stage}
                      </span>
                      <span className="inline-block rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-gray-400">
                        {p.sectorName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>
                        Velocity:{" "}
                        <span
                          className={
                            pChangePct >= 0 ? "text-emerald-400" : "text-red-400"
                          }
                        >
                          {p.commitVelocityChange}
                        </span>
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section
          className="mb-10 max-w-3xl"
          aria-label="Frequently asked questions"
        >
          <h2 className="text-xl font-semibold text-gray-100 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-lg border border-slate-800 bg-slate-900 p-5"
              >
                <h3 className="text-gray-100 font-medium mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Sector links */}
        <section className="mb-10" aria-label="Sector rankings">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            View Full Sector Rankings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {profile.sectors.map((sectorName) => {
              const entry = profile.history.find(
                (h) => h.sectorName === sectorName
              );
              if (!entry) return null;
              return (
                <Link
                  key={sectorName}
                  href={`/startups-to-watch/${entry.sectorSlug}-${entry.periodSlug}`}
                  className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
                >
                  <h3 className="text-gray-200 font-medium text-sm group-hover:text-sky-400 transition-colors mb-1">
                    {sectorName}
                  </h3>
                  <p className="text-gray-400 text-xs">
                    {entry.periodName} rankings &rarr;
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Related Resources, cross-links to gitdealflow.com landing pages */}
        <section className="mb-10" aria-label="Related resources">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Related Resources
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href={`https://gitdealflow.com/sector/${latest.sectorSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-sky-700/50 hover:bg-slate-800/80 transition-all"
            >
              <p className="text-gray-200 font-medium text-sm group-hover:text-sky-400 transition-colors">
                View {profile.name} in {latest.sectorName} sector &rarr;
              </p>
              <p className="text-gray-400 text-xs mt-1">
                See how {profile.name} ranks among {latest.sectorName} startups on gitdealflow.com
              </p>
            </a>
            <a
              href="https://gitdealflow.com/benchmark"
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-sky-700/50 hover:bg-slate-800/80 transition-all"
            >
              <p className="text-gray-200 font-medium text-sm group-hover:text-sky-400 transition-colors">
                Benchmark {profile.name} vs 356 startups &rarr;
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Compare engineering velocity across the entire VC Deal Flow Signal dataset
              </p>
            </a>
            <a
              href={`https://gitdealflow.com/a/startups-like-${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-sky-700/50 hover:bg-slate-800/80 transition-all"
            >
              <p className="text-gray-200 font-medium text-sm group-hover:text-sky-400 transition-colors">
                Find startups like {profile.name} &rarr;
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Discover similar startups with comparable engineering signals and momentum
              </p>
            </a>
            <a
              href="https://gitdealflow.com/check-velocity"
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-sky-700/50 hover:bg-slate-800/80 transition-all"
            >
              <p className="text-gray-200 font-medium text-sm group-hover:text-sky-400 transition-colors">
                Check {profile.name}&apos;s velocity &rarr;
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Get a detailed velocity analysis and engineering report card
              </p>
            </a>
          </div>
        </section>

        {/* Badge embed CTA, viral growth: every startup can embed a badge */}
        <section className="mb-12 rounded-xl border border-sky-900/40 bg-sky-950/20 p-6">
          <div className="flex items-center gap-2 mb-3">
            <img
              src={`/api/badge/${slug}`}
              alt={`${profile.name} engineering momentum badge: ${latest.signalType} signal, ${latest.commitVelocity14d} commits in 14 days`}
              width={badgeWidth(BADGE_LABEL, badgeValue(latest.commitVelocity14d || 0, latest.signalType || "steady"))}
              height={BADGE_HEIGHT}
              className="h-7 w-auto"
              loading="lazy"
            />
          </div>
          <h2 className="text-lg font-semibold text-gray-100 mb-2">
            Show this badge on your README
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-3">
            Free, auto-updating SVG badge for {profile.name}. Embeds in GitHub
            READMEs, websites, and pitch decks.
          </p>
          <pre className="rounded-lg bg-slate-950 border border-slate-800 p-3 text-xs text-gray-300 overflow-x-auto">
            <code>{`[![momentum](https://signals.gitdealflow.com/api/badge/${slug})](https://signals.gitdealflow.com/badge-builder)`}</code>
          </pre>
          <Link
            href="/badge-builder"
            className="inline-block mt-3 text-sky-400 hover:text-sky-300 text-sm font-medium underline decoration-dotted"
          >
            See all badge styles →
          </Link>
        </section>

        </article>

        {/* CTA */}
        <SeoCta secondary={{ label: "See a €7 First Look sample", href: "/firstlook" }} />
      </div>
    </>
  );
}
