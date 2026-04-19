import type { Metadata } from "next";
import Link from "next/link";
import { getAllSectors, getCurrentPeriod, getAllPeriods } from "@/lib/data";
import { allPosts as posts } from "@/content/posts";
import { comparisons } from "@/content/comparisons";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  const sectors = getAllSectors();
  const period = getCurrentPeriod();
  const allPeriods = getAllPeriods();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "VC Deal Flow Signal",
        url: "https://signals.gitdealflow.com",
        description:
          "Track startup engineering acceleration by sector. GitHub commit velocity, contributor growth, and breakout signals for investors.",
      },
      {
        "@type": "Organization",
        name: "VC Deal Flow Signal",
        url: "https://gitdealflow.com",
        logo: "https://signals.gitdealflow.com/opengraph-image",
        foundingDate: "2025",
        description:
          "VC Deal Flow Signal tracks startup engineering acceleration using public GitHub data to surface breakout startups before they appear on the funding radar.",
        contactPoint: {
          "@type": "ContactPoint",
          email: "signal@gitdealflow.com",
          contactType: "customer support",
        },
        sameAs: [
          "https://t.me/gitdealflow",
          "https://x.com/data_nerd",
          "https://www.linkedin.com/company/gitdealflow",
          "https://www.wikidata.org/wiki/Q139376302",
          "https://www.crunchbase.com/organization/gitdealflow",
          "https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn",
          "https://www.sideprojectors.com/project/78284/vc-deal-flow-signal-engineering-momentum-for-vcs",
        ],
      },
      {
        "@type": "ItemList",
        name: "Startup Sectors Tracked by Engineering Acceleration",
        numberOfItems: sectors.length,
        itemListElement: sectors
          .filter((s) => s.periods[period.slug])
          .map((s, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: s.name,
            url: `https://signals.gitdealflow.com/startups-to-watch/${s.slug}-${period.slug}`,
          })),
      },
      {
        "@type": "Dataset",
        name: "VC Deal Flow Signal — Startup Engineering Acceleration Dataset",
        alternateName: "GitDealFlow Startup Engineering Velocity Panel",
        description:
          "Quarterly longitudinal panel of GitHub engineering-velocity signals across venture-backed startups. Covers commit velocity, contributor growth, repository expansion, and acceleration-signal classification across " +
          sectors.length +
          " startup sectors and " +
          allPeriods.length +
          " quarterly periods. Designed for venture-capital deal sourcing, portfolio monitoring, and academic research on alternative data in venture capital.",
        url: "https://signals.gitdealflow.com",
        identifier: "https://signals.gitdealflow.com",
        sameAs: "https://gitdealflow.com",
        version: "1.0.0",
        datePublished: "2026-04-19",
        dateModified: new Date().toISOString().slice(0, 10),
        isAccessibleForFree: true,
        license: "https://creativecommons.org/licenses/by/4.0/",
        keywords: [
          "venture capital",
          "startups",
          "alternative data",
          "GitHub",
          "open source",
          "engineering velocity",
          "commit activity",
          "deal flow",
          "funding prediction",
          "panel data",
        ],
        creator: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
          email: "signal@gitdealflow.com",
          sameAs: [
            "https://www.linkedin.com/company/gitdealflow",
            "https://www.wikidata.org/wiki/Q139376302",
            "https://www.crunchbase.com/organization/gitdealflow",
          ],
        },
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        includedInDataCatalog: {
          "@type": "DataCatalog",
          name: "VC Deal Flow Signal Data Catalog",
          url: "https://signals.gitdealflow.com",
        },
        distribution: [
          {
            "@type": "DataDownload",
            name: "Startup signals — CSV",
            encodingFormat: "text/csv",
            contentUrl: "https://signals.gitdealflow.com/api/signals.csv",
          },
          {
            "@type": "DataDownload",
            name: "Startup signals — JSON",
            encodingFormat: "application/json",
            contentUrl: "https://signals.gitdealflow.com/api/signals.json",
          },
        ],
        temporalCoverage: allPeriods.map((p) => p.name).join("/"),
        spatialCoverage: {
          "@type": "Place",
          name: "Global — US, EU, APAC, LATAM, Canada",
        },
        measurementTechnique:
          "Automated collection from the GitHub REST API v3: commit activity, unique contributor counts, and repository-creation metadata for venture-backed startup organizations. Rolling 14-day observation windows with deterministic signal classification over commit patterns.",
        variableMeasured: [
          {
            "@type": "PropertyValue",
            name: "Commit Velocity (14-day)",
            description:
              "Total commits to an organization's most active public repository over a rolling 14-day window.",
            unitText: "commits",
          },
          {
            "@type": "PropertyValue",
            name: "Commit Velocity Change",
            description:
              "Percentage change in commit velocity compared to the preceding 14-day window. Primary ranking signal.",
            unitText: "percent",
          },
          {
            "@type": "PropertyValue",
            name: "Contributor Count",
            description:
              "Number of unique contributors to the organization's most active public repository.",
            unitText: "contributors",
          },
          {
            "@type": "PropertyValue",
            name: "Signal Type",
            description:
              "Classification of acceleration pattern: framework migration, engineering hiring burst, infrastructure buildout, or deploy frequency spike.",
          },
        ],
        citation:
          "VC Deal Flow Signal (2026). A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups. https://gitdealflow.com",
      },
      {
        "@type": "SoftwareApplication",
        name: "VC Deal Flow Signal",
        applicationCategory: "BusinessApplication",
        applicationSubCategory: "Deal Flow & Sourcing",
        operatingSystem: "Web, MCP, Email, RSS, Telegram",
        url: "https://gitdealflow.com",
        description:
          "Engineering-acceleration signal engine for venture capital deal flow. Weekly report of breakout startups ranked by GitHub commit velocity, contributor growth, and infrastructure buildouts.",
        offers: [
          {
            "@type": "Offer",
            name: "Free Signal Report",
            price: "0",
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock",
            description:
              "Weekly email with 5 breakout startups ranked by GitHub engineering acceleration. No credit card required.",
            url: "https://gitdealflow.com/#signup",
          },
          {
            "@type": "Offer",
            name: "Dashboard (Beta)",
            price: "9.97",
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock",
            description:
              "Full dashboard access: 50+ ranked startups per week, filters by sector, stage, and geography, MCP server access, CSV export.",
            url: "https://signals.gitdealflow.com/dashboard",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: "9.97",
              priceCurrency: "EUR",
              unitCode: "MON",
              billingIncrement: 1,
              referenceQuantity: {
                "@type": "QuantitativeValue",
                value: 1,
                unitCode: "MON",
              },
            },
          },
        ],
        featureList: [
          "Weekly GitHub engineering acceleration signals",
          "50+ startups ranked every Monday",
          "20 technical sector clusters",
          "MCP server for Claude, Cursor, Windsurf",
          "JSON / CSV / RSS / Telegram / Email delivery",
          "Chrome extension for Crunchbase, AngelList, PitchBook",
        ],
        interactionStatistic: [
          {
            "@type": "InteractionCounter",
            interactionType: "https://schema.org/ViewAction",
            name: "Startups tracked in current period",
            userInteractionCount: sectors
              .filter((s) => s.periods[period.slug])
              .reduce((sum, s) => sum + s.periods[period.slug].startups.length, 0),
          },
          {
            "@type": "InteractionCounter",
            interactionType: "https://schema.org/FollowAction",
            name: "Sectors tracked",
            userInteractionCount: sectors.filter((s) => s.periods[period.slug]).length,
          },
        ],
        provider: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
      },
      {
        "@type": "Event",
        name: "VC Deal Flow Signal — Weekly Data Refresh",
        description:
          "Weekly update of startup engineering acceleration data across " +
          sectors.length +
          " sectors. Commit velocity, contributor growth, and signal classification refreshed every Monday morning.",
        startDate: (() => {
          const now = new Date();
          const day = now.getDay();
          const next = new Date(now);
          next.setDate(now.getDate() + ((1 - day + 7) % 7 || 7));
          next.setHours(9, 0, 0, 0);
          return next.toISOString().slice(0, 10);
        })(),
        eventSchedule: {
          "@type": "Schedule",
          repeatFrequency: "P1W",
          byDay: "https://schema.org/Monday",
          startTime: "09:00",
        },
        organizer: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
        location: {
          "@type": "VirtualLocation",
          url: "https://signals.gitdealflow.com",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header section */}
      <div className="mb-10 max-w-2xl">
        <p className="text-sky-400 text-sm font-medium mb-3 uppercase tracking-wider">
          {period.name} Edition
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          Startup Engineering Signals by Sector
        </h1>
        <p className="text-gray-400 text-base leading-relaxed">
          We track GitHub commit velocity, contributor growth, and repository
          expansion across {sectors.length} startup sectors to surface breakout
          engineering teams before they appear on the funding radar. These
          signals — commit acceleration, hiring bursts, infrastructure
          buildouts — have historically preceded fundraise announcements by six
          to twelve weeks. Each page ranks the top startups in a sector by
          engineering acceleration, updated weekly.
        </p>
      </div>

      {/* Sector grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sectors.map((sector) => {
          const snapshot = sector.periods[period.slug];
          if (!snapshot) return null;
          return (
            <Link
              key={sector.slug}
              href={`/startups-to-watch/${sector.slug}-${period.slug}`}
              className="group block rounded-lg border border-slate-800 bg-slate-900 p-5 hover:border-slate-600 hover:bg-slate-800/60 transition-all"
            >
              <h2 className="text-gray-100 font-semibold text-base mb-1 group-hover:text-sky-400 transition-colors">
                {sector.name}
              </h2>
              <p className="text-gray-500 text-xs mb-3">
                {snapshot.startups.length} startups tracked
              </p>
              <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                {sector.description}
              </p>
              <span className="mt-3 inline-block text-sky-500 text-xs font-medium group-hover:text-sky-400 transition-colors">
                View rankings &rarr;
              </span>
            </Link>
          );
        })}
      </div>

      {/* Previous periods */}
      {allPeriods.length > 1 && (
        <div className="mt-10 mb-6">
          <h2 className="text-gray-100 font-semibold text-lg mb-3">
            Previous Quarters
          </h2>
          <div className="flex flex-wrap gap-2">
            {allPeriods
              .filter((p) => !p.current)
              .map((p) => (
                <Link
                  key={p.slug}
                  href={`/startups-to-watch/${sectors[0]?.slug}-${p.slug}`}
                  className="inline-block rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-gray-400 hover:text-sky-400 hover:border-slate-600 transition-colors"
                >
                  {p.name}
                </Link>
              ))}
          </div>
        </div>
      )}

      {/* Latest from the blog */}
      <div className="mt-12 mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-100 font-semibold text-lg">
            Signal Intelligence
          </h2>
          <Link
            href="/blog"
            className="text-sky-500 text-xs font-medium hover:text-sky-400 transition-colors"
          >
            All posts &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {posts.slice(0, 2).map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block rounded-lg border border-slate-800 bg-slate-900 p-5 hover:border-slate-600 hover:bg-slate-800/60 transition-all"
            >
              <p className="text-gray-500 text-xs mb-2">{post.date}</p>
              <h3 className="text-gray-100 font-semibold text-sm mb-2 group-hover:text-sky-400 transition-colors">
                {post.title}
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                {post.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Compare tools */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-100 font-semibold text-lg">
            Compare Deal Flow Tools
          </h2>
          <Link
            href="/compare"
            className="text-sky-500 text-xs font-medium hover:text-sky-400 transition-colors"
          >
            All comparisons &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {comparisons.map((comp) => (
            <Link
              key={comp.slug}
              href={`/compare/${comp.slug}`}
              className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 hover:bg-slate-800/60 transition-all"
            >
              <h3 className="text-gray-200 font-medium text-sm group-hover:text-sky-400 transition-colors mb-1">
                {comp.h1}
              </h3>
              <p className="text-gray-500 text-xs">Read comparison &rarr;</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-12 rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-center">
        <h2 className="text-gray-100 font-semibold text-lg mb-2">
          Get this week's top breakout startups
        </h2>
        <p className="text-gray-400 text-sm mb-5 max-w-lg mx-auto">
          Every week we rank the top 10 breakout engineering signals across all
          sectors. Get the report free, no spam.
        </p>
        <Link
          href="https://gitdealflow.com/#signup"
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors"
        >
          Get the Report
        </Link>
      </div>
    </div>
    </>
  );
}
