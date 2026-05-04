import type { Metadata } from "next";
import Link from "next/link";
import { getAllSectors, getCurrentPeriod, getAllPeriods, getDataLastModified } from "@/lib/data";
import { allPosts as posts } from "@/content/posts";
import { comparisons } from "@/content/comparisons";
import { FINDINGS as RESEARCH_FINDINGS } from "@/content/research-findings";
import { AgentSummary } from "@/components/AgentSummary";

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
        "@id": "https://signals.gitdealflow.com/#website",
        name: "VC Deal Flow Signal",
        alternateName: ["GitDealFlow", "VC Deal Flow Signal (GitDealFlow)"],
        url: "https://signals.gitdealflow.com",
        description:
          "GitHub commit-velocity tracking across startup sectors — code-side momentum signals from public GitHub data (distinct from startup accelerator programs). Surfaces venture-backed startups 3–6 weeks before fundraise.",
        publisher: { "@id": "https://gitdealflow.com/#organization" },
        inLanguage: "en-US",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate:
              "https://signals.gitdealflow.com/api/nlweb?query={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": "https://gitdealflow.com/#organization",
        name: "VC Deal Flow Signal",
        alternateName: ["GitDealFlow", "VC Deal Flow Signal (GitDealFlow)"],
        url: "https://gitdealflow.com",
        logo: {
          "@type": "ImageObject",
          url: "https://signals.gitdealflow.com/icon",
          contentUrl: "https://signals.gitdealflow.com/icon",
          width: 192,
          height: 192,
          encodingFormat: "image/png",
          caption: "VC Deal Flow Signal logo",
        },
        image: {
          "@type": "ImageObject",
          url: "https://signals.gitdealflow.com/opengraph-image",
          contentUrl: "https://signals.gitdealflow.com/opengraph-image",
          width: 1200,
          height: 630,
          encodingFormat: "image/png",
          caption:
            "VC Deal Flow Signal — Startup Engineering Acceleration Tracker",
          representativeOfPage: true,
        },
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
          "https://chromewebstore.google.com/detail/vc-github-lookup-%E2%80%94-startu/plgngijmloeljfkenecdkhiblcfcbblm",
          "https://www.sideprojectors.com/project/78284/vc-deal-flow-signal-engineering-momentum-for-vcs",
          "https://www.npmjs.com/package/@gitdealflow/mcp-signal",
          "https://www.producthunt.com/products/vc-deal-flow-signal",
          "https://www.g2.com/products/vc-deal-flow-signal/reviews",
          "https://www.saashub.com/vc-deal-flow-signal",
          "https://alternativeto.net/software/vc-deal-flow-signal/",
          "https://github.com/kindrat86/mcp-deal-flow-signal",
          "https://ssrn.com/abstract=6606558",
          "https://openalex.org/works/W7154916891",
          "https://zenodo.org/records/19650920",
          "https://api.crossref.org/works/10.2139/ssrn.6606558",
          "https://www.semanticscholar.org/paper/A-Longitudinal-Panel-of-GitHub-Engineering-Velocity",
          "https://kaggle.com/datasets/thedatanerd/vc-deal-flow-signal",
        ],
        knowsAbout: [
          "GitHub commit velocity",
          "venture capital alternative data",
          "code-side momentum signals",
          "startup engineering acceleration (quantitative GitHub signal, distinct from accelerator programs)",
          "open-source contributor-growth analytics",
          "repository-expansion signals",
        ],
        founder: {
          "@type": "Person",
          "@id": "https://signals.gitdealflow.com/about#person",
          name: "The Data Nerd",
          alternateName: "Data Nerd",
          jobTitle: "Founder, VC Deal Flow Signal",
          url: "https://signals.gitdealflow.com/about",
          sameAs: [
            "https://orcid.org/0009-0002-2222-4112",
            "https://x.com/data_nerd",
            "https://github.com/kindrat86",
            "https://news.ycombinator.com/user?id=the_data_nerd",
            "https://www.indiehackers.com/The_Data_Nerd",
            "https://dev.to/the_data_nerd",
          ],
        },
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
        citation: {
          "@type": "ScholarlyArticle",
          "@id": "https://ssrn.com/abstract=6606558",
          name: "A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups",
          headline:
            "A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups",
          author: {
            "@type": "Person",
            name: "The Data Nerd",
            sameAs: "https://orcid.org/0009-0002-2222-4112",
          },
          datePublished: "2026-04",
          publisher: {
            "@type": "Organization",
            name: "Social Science Research Network (SSRN)",
            url: "https://ssrn.com",
          },
          url: "https://ssrn.com/abstract=6606558",
          identifier: "https://ssrn.com/abstract=6606558",
          sameAs: [
            "https://openalex.org/works/W7154916891",
            "https://zenodo.org/records/19650920",
          ],
          license: "https://creativecommons.org/licenses/by/4.0/",
          inLanguage: "en",
        },
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
              "Full dashboard access: 60+ ranked startups per week, filters by sector, stage, and geography, MCP server access, CSV export.",
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
          "60+ startups ranked every Monday",
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
        "@type": "Service",
        "@id": "https://signals.gitdealflow.com#service",
        name: "VC Deal Flow Signal — Engineering Acceleration Tracking",
        serviceType: "Venture Capital Deal Sourcing — Alternative Data",
        provider: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        areaServed: {
          "@type": "Place",
          name: "Global",
        },
        audience: {
          "@type": "Audience",
          audienceType:
            "Venture capital investors, angel investors, deal-flow analysts, family office investment teams, fund-of-funds analysts, scout investors",
        },
        category: "Alternative Data — Engineering Velocity Signals",
        description:
          "Weekly engineering-acceleration signals from public GitHub data across 20 startup sectors. Surfaces breakout startups 3-6 weeks before fundraise announcements. Delivered via web dashboard, MCP server, JSON/CSV, RSS, Telegram, and email.",
        url: "https://signals.gitdealflow.com",
        availableChannel: [
          {
            "@type": "ServiceChannel",
            name: "Web dashboard",
            serviceUrl: "https://signals.gitdealflow.com/dashboard",
          },
          {
            "@type": "ServiceChannel",
            name: "MCP server",
            serviceUrl: "https://signals.gitdealflow.com/.well-known/mcp.json",
          },
          {
            "@type": "ServiceChannel",
            name: "Email digest",
            serviceUrl: "https://gitdealflow.com/#signup",
          },
          {
            "@type": "ServiceChannel",
            name: "RSS feed",
            serviceUrl: "https://signals.gitdealflow.com/feed.xml",
          },
          {
            "@type": "ServiceChannel",
            name: "Telegram channel",
            serviceUrl: "https://t.me/gitdealflow",
          },
        ],
        brand: {
          "@type": "Brand",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
          logo: "https://signals.gitdealflow.com/icon",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "VC Deal Flow Signal — Pricing Tiers",
          itemListElement: [
            {
              "@type": "Offer",
              name: "Free Tier",
              description:
                "Permanent free tier — MCP server with six read-only tools, weekly Signal Report email, public REST/JSON dataset endpoints, free Scout Receipts at /receipts. Sufficient for solo investors and emerging fund managers focused on technical startups.",
              price: "0",
              priceCurrency: "EUR",
              availability: "https://schema.org/InStock",
              url: "https://signals.gitdealflow.com",
              category: "Free",
              eligibleRegion: { "@type": "Place", name: "Global" },
            },
            {
              "@type": "Offer",
              name: "Insider Circle Dashboard",
              description:
                "Full universe filtering (sector, stage, geography), 10 Scout Game predictions per month, advanced sourcing-edge analytics. Per-individual subscription, no annual commitment, cancellable any time.",
              price: "19",
              priceCurrency: "EUR",
              priceSpecification: {
                "@type": "UnitPriceSpecification",
                price: "19",
                priceCurrency: "EUR",
                referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" },
                billingDuration: "P1M",
              },
              availability: "https://schema.org/InStock",
              url: "https://gitdealflow.com/#signup",
              category: "Subscription",
              eligibleRegion: { "@type": "Place", name: "Global" },
            },
            {
              "@type": "Offer",
              name: "First Look Pass",
              description:
                "One-time tripwire — early access to a sector-specific signal report ahead of the next weekly digest. Single payment, no recurring billing.",
              price: "7",
              priceCurrency: "EUR",
              availability: "https://schema.org/InStock",
              url: "https://gitdealflow.com/#firstlook",
              category: "One-time",
              eligibleRegion: { "@type": "Place", name: "Global" },
            },
          ],
        },
      },
      {
        "@type": "VideoObject",
        name: "VC Deal Flow Signal MCP Server — Claude Desktop Demo",
        description:
          "Live demo of the VC Deal Flow Signal MCP server running inside Claude Desktop. Shows trending startups, sector search, and individual startup signal lookups via natural-language prompts.",
        thumbnailUrl: "https://gitdealflow.com/mcp-demo.gif",
        contentUrl: "https://gitdealflow.com/mcp-demo.mp4",
        uploadDate: "2026-04-17",
        duration: "PT1M12S",
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
      },
      {
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/#webpage",
        url: "https://signals.gitdealflow.com",
        name: "VC Deal Flow Signal — Startup Engineering Acceleration Tracker",
        description:
          "Weekly ranking of breakout engineering teams by GitHub commit velocity, contributor growth, and infrastructure buildouts across 20 startup sectors.",
        inLanguage: "en-US",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: [".speakable", "h1", "[data-agent-summary]"],
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: "https://signals.gitdealflow.com/opengraph-image",
        },
        isPartOf: {
          "@type": "WebSite",
          name: "VC Deal Flow Signal",
          url: "https://signals.gitdealflow.com",
        },
      },
      {
        "@type": "WebAPI",
        "@id": "https://signals.gitdealflow.com/#api",
        name: "VC Deal Flow Signal — Public Agent API",
        description:
          "Free, no-auth public API surface for AI agents and automation. Includes JSON / CSV exports, per-startup signal lookup, MCP server (stdio + Streamable HTTP), A2A JSON-RPC endpoint, NLWeb conversational endpoint, function-calling tool definitions for OpenAI / Anthropic / Gemini SDKs, and embeddable SVG badges. OpenAPI 3.1 spec describes every callable route.",
        documentation: "https://signals.gitdealflow.com/api/openapi.json",
        termsOfService: "https://signals.gitdealflow.com/ai.txt",
        provider: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        endpointURL: [
          "https://signals.gitdealflow.com/api/signals.json",
          "https://signals.gitdealflow.com/api/signals.csv",
          "https://signals.gitdealflow.com/api/openapi.json",
          "https://signals.gitdealflow.com/api/agent/tools",
          "https://signals.gitdealflow.com/api/agent/call",
          "https://signals.gitdealflow.com/api/a2a",
          "https://signals.gitdealflow.com/api/nlweb",
          "https://signals.gitdealflow.com/api/mcp/rpc",
          "https://signals.gitdealflow.com/api/badge/scout/{username}/svg",
          "https://signals.gitdealflow.com/api/badge/momentum/{org}/{repo}/svg",
        ],
        endpointDescription: "https://signals.gitdealflow.com/.well-known/mcp.json",
        potentialAction: [
          {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate:
                "https://signals.gitdealflow.com/api/nlweb?query={query}",
              contentType: "application/json",
            },
            "query-input": "required name=query",
          },
          {
            "@type": "ConsumeAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: "https://signals.gitdealflow.com/api/signals.json",
              contentType: "application/json",
            },
          },
        ],
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
          buildouts — have historically preceded fundraise announcements by
          three to six weeks. Each page ranks the top startups in a sector by
          engineering acceleration, updated weekly.
        </p>
        <Link
          href="/receipts"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          What&rsquo;s your developer Scout Score? Free in 30 seconds &rarr;
        </Link>
      </div>

      <AgentSummary
        tldr={`VC Deal Flow Signal (GitDealFlow) ranks ${sectors.filter((s) => s.periods[period.slug]).length} startup sectors by GitHub commit velocity every Monday — a quantitative code-side momentum signal computed from public GitHub data, distinct from startup accelerator programs (Y Combinator, Techstars). Data is free via JSON / CSV / RSS / MCP / A2A / NLWeb. The metric — sometimes called engineering acceleration on this site — has historically preceded fundraise announcements by three to six weeks.`}
        pageUrl="https://signals.gitdealflow.com"
        asOf={getDataLastModified().toISOString().slice(0, 10)}
        citeAs={`VC Deal Flow Signal (signals.gitdealflow.com), ${period.name} data.`}
        facts={[
          {
            claim:
              "Commit-velocity acceleration has preceded venture fundraise announcements by 3–6 weeks across the tracked dataset.",
            sourceUrl: "https://signals.gitdealflow.com/methodology",
            sourceLabel: "Methodology",
          },
          {
            claim:
              "Free MCP server (npx @gitdealflow/mcp-signal) exposes 6 read-only tools to Claude, Cursor, and any MCP-compatible host.",
            sourceUrl: "https://signals.gitdealflow.com/agents.md",
            sourceLabel: "agents.md",
          },
          {
            claim: `${sectors.filter((s) => s.periods[period.slug]).reduce((sum, s) => sum + s.periods[period.slug].startups.length, 0)} startup signals across ${sectors.filter((s) => s.periods[period.slug]).length} sectors and ${allPeriods.length} quarterly periods of history.`,
            sourceUrl: "https://signals.gitdealflow.com/api/signals.json",
            sourceLabel: "signals.json",
          },
        ]}
      />

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
              <p className="text-gray-400 text-xs mb-3">
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
              <p className="text-gray-400 text-xs mb-2">{post.date}</p>
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

      {/* Research findings — internal-link to /research/[slug] sub-pages */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-100 font-semibold text-lg">
            From the research panel
          </h2>
          <Link
            href="/research"
            className="text-sky-500 text-xs font-medium hover:text-sky-400 transition-colors"
          >
            All 30 findings &rarr;
          </Link>
        </div>
        <p className="text-gray-400 text-xs mb-3">
          SSRN-indexed methodology, CC BY 4.0 — quotable numbers from a
          219-observation panel of venture-backed startup GitHub activity.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {RESEARCH_FINDINGS.slice(0, 6).map((f) => (
            <Link
              key={f.slug}
              href={`/research/${f.slug}`}
              className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 hover:bg-slate-800/60 transition-all"
            >
              <p className="font-mono text-xs text-sky-500 font-semibold mb-2">
                #{f.n.toString().padStart(2, "0")}
              </p>
              <p className="text-gray-200 text-sm leading-snug group-hover:text-sky-400 transition-colors line-clamp-3">
                {f.title}
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
              <p className="text-gray-400 text-xs">Read comparison &rarr;</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom CTA — receipts-led lead magnet (Russell pivot 2026-04-26) */}
      <div className="mt-12 rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-center">
        <h2 className="text-gray-100 font-semibold text-lg mb-2">
          What&rsquo;s your developer Scout Score?
        </h2>
        <p className="text-gray-400 text-sm mb-5 max-w-lg mx-auto">
          Paste any GitHub username and see how many validated unicorns you
          starred <em>before</em> they hit $1B. Free, 30 seconds, no signup.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
          <Link
            href="/receipts"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-medium transition-colors"
          >
            Get my Scout Score &rarr;
          </Link>
          <Link
            href="https://gitdealflow.com/#signup"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg border border-slate-700 hover:border-slate-500 text-gray-300 hover:text-gray-100 text-sm font-medium transition-colors"
          >
            Or get the weekly report
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}
