import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllSectors,
  getCurrentPeriod,
  getAllPeriods,
  getDataLastModified,
  getTopMoversThisWeek,
  getTotalTrackedThisWeek,
} from "@/lib/data";
import { allPosts as posts } from "@/content/posts";
import { comparisons } from "@/content/comparisons";
import { FINDINGS as RESEARCH_FINDINGS } from "@/content/research-findings";
import { standaloneFaqs } from "@/content/standalone-faqs";
import { AgentSummary } from "@/components/AgentSummary";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHomepageHreflang } from "@/lib/hreflang";
import SignalLeader from "@/components/SignalLeader";
import HomeSqueeze from "@/components/HomeSqueeze";
import IdentityBanner from "@/components/IdentityBanner";
import PricingLadder from "@/components/PricingLadder";
import SocialProofBar from "@/components/SocialProofBar";
import SharpScarcityBadge from "@/components/SharpScarcityBadge";
import EpiphanyBridgeCondensed from "@/components/EpiphanyBridgeCondensed";
import HomeOfferStack from "@/components/HomeOfferStack";
import { DataNerdPolarityCard } from "@/components/DataNerdPolarityCard";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";

export const metadata: Metadata = {
  // hreflang emitted via <HreflangLinks/> in JSX (single source of truth).
  alternates: {
    canonical: "/",
  },
  openGraph: {
    // F5 — explicit absolute og:url. Layout-default openGraph is replaced
    // wholesale when a child page sets its own openGraph object, and Next 16
    // drops relative URLs at the og:url meta tag, so we go absolute here.
    url: "https://signals.gitdealflow.com/",
    type: "website",
    siteName: "VC Deal Flow Signal",
  },
};

// Hoisted to module scope so the array is allocated once at build, not per
// render. Drives the "Pillar pages & topic clusters" block — strengthens the
// internal-link graph from the home page to routes Yandex flagged
// "low-value or low-demand" in the 2026-05-02 recheck.
const PILLAR_LINKS = [
  { href: "/mechanism", label: "The named mechanism", sub: "Commit-Velocity Acceleration Engine — formula, falsifiability, ladder", icon: "🔬" },
  { href: "/methodology", label: "Methodology", sub: "How signals are computed", icon: "📐" },
  { href: "/weekly", label: "This week's signals", sub: "Weekly top movers", icon: "📈" },
  { href: "/trending", label: "Trending now", sub: "Real-time leaderboard", icon: "🔥" },
  { href: "/startups-to-watch", label: "Startups to watch", sub: "By sector + region", icon: "🌍" },
  { href: "/signals", label: "Signal taxonomy", sub: "Every signal type", icon: "🏷️" },
  { href: "/alternatives", label: "Alternatives", sub: "vs Harmonic, Affinity, Tracxn", icon: "⚖️" },
  { href: "/glossary", label: "Glossary", sub: "Defined terms", icon: "📖" },
  { href: "/faq", label: "FAQ", sub: "60+ answers", icon: "❓" },
  { href: "/research", label: "Research panel", sub: "30 SSRN findings", icon: "🔬" },
  { href: "/blog", label: "Blog", sub: "Long-form analyses", icon: "✍️" },
  { href: "/markets", label: "Prediction markets", sub: "Series A Race 2026", icon: "🎯" },
  { href: "/citations", label: "Citation guide", sub: "How to cite us", icon: "📚" },
  { href: "/state-of-github", label: "State of GitHub", sub: "Monthly engineering-velocity address", icon: "🏛️" },
  { href: "/watch", label: "Watch (silent demo)", sub: "90-second visual walkthrough", icon: "📺" },
  { href: "/summit", label: "Summit", sub: "5 days · 20 anonymous-by-design talks · free during the live window", icon: "🎤" },
  { href: "/launch", label: "Launches", sub: "Active and archived 4-stage funnels", icon: "🚀" },
  { href: "/press", label: "Press kit", sub: "Wire-ready releases + boilerplate", icon: "📰" },
] as const;

// "Where to go next" deep-dive entry points. Icons help the eye navigate a
// dense grid of similarly-shaped cards.
const NEXT_LINKS = [
  { href: "/weekly", label: "Weekly leaderboard", sub: "Top 10 commit-velocity movers across every tracked sector, rebuilt every Monday.", icon: "🏆" },
  { href: "/signal-of-the-week", label: "Signal of the week", sub: "The single sharpest momentum break we observed this week, with the 14-day chart and decision rule.", icon: "⚡" },
  { href: "/signals", label: "Signal vocabulary", sub: "The six atomic primitives we compute — formula, decision rule, common pitfall for each.", icon: "🧪" },
  { href: "/methodology", label: "Methodology", sub: "How we compute commit velocity, sample frame, biases we accept, and what we explicitly do not claim.", icon: "📐" },
  { href: "/reproducibility", label: "Reproducibility", sub: "Step-by-step HowTo to re-run the panel against the public dataset. CC BY 4.0.", icon: "🔁" },
  { href: "/attestations", label: "Attestations", sub: "Every public claim with source, date, and a fact-check status (ClaimReview).", icon: "✅" },
  { href: "/knowledge", label: "Knowledge graph", sub: "Defined-term hub linking every sector, signal primitive, and competitor entity.", icon: "🕸️" },
  { href: "/alternatives", label: "Alternatives", sub: "Honest side-by-side: Harmonic, Forager, SignalFire Beacon, Affinity, Tracxn — and where each beats us.", icon: "⚖️" },
] as const;

export default function Home() {
  const sectors = getAllSectors();
  const period = getCurrentPeriod();
  const allPeriods = getAllPeriods();
  const topMovers = getTopMoversThisWeek(3);
  const totalTracked = getTotalTrackedThisWeek();
  const activeSectorCount = sectors.filter((s) => s.periods[period.slug]).length;
  const asOf = getDataLastModified().toISOString().slice(0, 10);

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
          url: "https://signals.gitdealflow.com/icon.png",
          contentUrl: "https://signals.gitdealflow.com/icon.png",
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
          "https://huggingface.co/datasets/the-data-nerd/vc-deal-flow-signal",
          "https://huggingface.co/spaces/the-data-nerd/vc-deal-flow-explorer",
          "https://huggingface.co/spaces/the-data-nerd/vc-deal-flow-deepseek",
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
        identifier: [
          "https://signals.gitdealflow.com",
          "https://doi.org/10.5281/zenodo.19650920",
          "https://doi.org/10.5281/zenodo.19650919",
        ],
        sameAs: [
          "https://gitdealflow.com",
          "https://huggingface.co/datasets/the-data-nerd/vc-deal-flow-signal",
          "https://www.kaggle.com/datasets/thedatanerd2026/vc-deal-flow-signal",
          "https://zenodo.org/records/19650920",
          "https://data.world/thedatanerd2026/vc-deal-flow-signal-startup-engineering-acceleration",
        ],
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
        includedInDataCatalog: [
          {
            "@type": "DataCatalog",
            name: "VC Deal Flow Signal Data Catalog",
            url: "https://signals.gitdealflow.com",
          },
          {
            "@type": "DataCatalog",
            name: "Hugging Face Datasets",
            url: "https://huggingface.co/datasets",
          },
          {
            "@type": "DataCatalog",
            name: "Zenodo",
            url: "https://zenodo.org",
          },
          {
            "@type": "DataCatalog",
            name: "Kaggle Datasets",
            url: "https://www.kaggle.com/datasets",
          },
          {
            "@type": "DataCatalog",
            name: "Data.world",
            url: "https://data.world",
          },
        ],
        distribution: [
          {
            "@type": "DataDownload",
            name: "Startup signals — CSV (live)",
            encodingFormat: "text/csv",
            contentUrl: "https://signals.gitdealflow.com/api/signals.csv",
          },
          {
            "@type": "DataDownload",
            name: "Startup signals — JSON (live)",
            encodingFormat: "application/json",
            contentUrl: "https://signals.gitdealflow.com/api/signals.json",
          },
          {
            "@type": "DataDownload",
            name: "Hugging Face Dataset mirror",
            encodingFormat: "text/csv",
            contentUrl:
              "https://huggingface.co/datasets/the-data-nerd/vc-deal-flow-signal/resolve/main/startup_signals.csv",
          },
          {
            "@type": "DataDownload",
            name: "Zenodo archive (v1.0.0, DOI 10.5281/zenodo.19650920)",
            encodingFormat: "application/zip",
            contentUrl: "https://zenodo.org/records/19650920/files-archive",
          },
          {
            "@type": "DataDownload",
            name: "Kaggle dataset mirror",
            encodingFormat: "text/csv",
            contentUrl:
              "https://www.kaggle.com/datasets/thedatanerd2026/vc-deal-flow-signal",
          },
          {
            "@type": "DataDownload",
            name: "Data.world mirror (autosynced daily)",
            encodingFormat: "text/csv",
            contentUrl:
              "https://data.world/thedatanerd2026/vc-deal-flow-signal-startup-engineering-acceleration",
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
            priceValidUntil: "2026-12-31",
            availability: "https://schema.org/InStock",
            description:
              "Full dashboard access: 85+ ranked startups per week, filters by sector, stage, and geography, MCP server access, CSV export.",
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
          "85+ startups ranked every Monday",
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
          logo: "https://signals.gitdealflow.com/icon.png",
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
              priceValidUntil: "2026-12-31",
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
              priceValidUntil: "2026-12-31",
              availability: "https://schema.org/InStock",
              url: "https://gitdealflow.com/#firstlook",
              category: "One-time",
              eligibleRegion: { "@type": "Place", name: "Global" },
            },
            {
              "@type": "Offer",
              name: "Agent Credits — Pay Per Deep Signal",
              description:
                "Per-request pricing for AI agents and programmatic callers. 100 deep-signal calls for €19 (€0.19 per call). One credit consumed per match; misses are free. Credits never expire. Applies only to the new get_deep_signal MCP tool and POST /api/agent/deep-signal endpoint — the six free MCP tools stay free forever.",
              price: "19",
              priceCurrency: "EUR",
              priceValidUntil: "2026-12-31",
              availability: "https://schema.org/InStock",
              url: "https://signals.gitdealflow.com/agents/credits",
              category: "API Credits",
              eligibleQuantity: {
                "@type": "QuantitativeValue",
                value: 100,
                unitText: "API calls",
              },
              priceSpecification: {
                "@type": "UnitPriceSpecification",
                price: "0.19",
                priceCurrency: "EUR",
                referenceQuantity: {
                  "@type": "QuantitativeValue",
                  value: 1,
                  unitText: "deep-signal call",
                },
              },
              eligibleRegion: { "@type": "Place", name: "Global" },
            },
          ],
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
        // Named-entity disambiguation — anchor to Wikidata so AI engines can
        // cross-reference. Competitors, platforms, and concepts mentioned on
        // this site are explicitly typed and linked.
        mentions: [
          {
            "@type": "Thing",
            name: "GitHub",
            sameAs: [
              "https://www.wikidata.org/wiki/Q364",
              "https://github.com",
            ],
          },
          {
            "@type": "Thing",
            name: "Venture capital",
            sameAs: ["https://www.wikidata.org/wiki/Q189569"],
          },
          {
            "@type": "Thing",
            name: "Alternative data",
            sameAs: ["https://www.wikidata.org/wiki/Q4734016"],
          },
          {
            "@type": "Thing",
            name: "Open-source software",
            sameAs: ["https://www.wikidata.org/wiki/Q1130645"],
          },
          {
            "@type": "Organization",
            name: "Y Combinator",
            sameAs: [
              "https://www.wikidata.org/wiki/Q4933824",
              "https://www.ycombinator.com",
            ],
            description:
              "Startup accelerator. Distinct from this site's 'engineering acceleration' GitHub signal.",
          },
          {
            "@type": "Organization",
            name: "Techstars",
            sameAs: [
              "https://www.wikidata.org/wiki/Q3522381",
              "https://www.techstars.com",
            ],
          },
          {
            "@type": "Organization",
            name: "Crunchbase",
            sameAs: [
              "https://www.wikidata.org/wiki/Q5188749",
              "https://www.crunchbase.com",
            ],
          },
          {
            "@type": "Organization",
            name: "PitchBook",
            sameAs: ["https://www.wikidata.org/wiki/Q15639544"],
          },
          {
            "@type": "Organization",
            name: "AngelList",
            sameAs: ["https://www.wikidata.org/wiki/Q4754038"],
          },
          {
            "@type": "Organization",
            name: "Dealroom",
            sameAs: ["https://dealroom.co"],
          },
          {
            "@type": "Organization",
            name: "Harmonic.ai",
            sameAs: ["https://harmonic.ai"],
          },
          {
            "@type": "SoftwareApplication",
            name: "Model Context Protocol (MCP)",
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Cross-platform (stdio, Streamable HTTP)",
            sameAs: [
              "https://modelcontextprotocol.io",
              "https://github.com/modelcontextprotocol",
            ],
          },
          {
            "@type": "SoftwareApplication",
            name: "Claude Desktop",
            applicationCategory: "DeveloperApplication",
            operatingSystem: "macOS, Windows",
            sameAs: ["https://www.anthropic.com/claude"],
          },
          {
            "@type": "SoftwareApplication",
            name: "Cursor",
            applicationCategory: "DeveloperApplication",
            operatingSystem: "macOS, Windows, Linux",
            sameAs: ["https://cursor.com"],
          },
        ],
        // lastReviewed lets AIO surfaces (Google AI Overviews) treat this
        // page's data as evergreen-but-monitored.
        lastReviewed: getDataLastModified().toISOString().slice(0, 10),
        reviewedBy: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
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
      {
        "@type": "FAQPage",
        "@id": "https://signals.gitdealflow.com/#faq",
        url: "https://signals.gitdealflow.com",
        inLanguage: "en-US",
        about: { "@id": "https://gitdealflow.com/#organization" },
        isPartOf: { "@id": "https://signals.gitdealflow.com/#website" },
        mainEntity: standaloneFaqs.slice(0, 12).map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.answer,
            url: f.sourceHref.startsWith("http")
              ? f.sourceHref
              : `https://signals.gitdealflow.com${f.sourceHref}`,
          },
        })),
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/"
        languages={getHomepageHreflang()}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/" />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-8 sm:space-y-10">
      {/* Hero — specific outcome H1 + one-line subhead. Greg audit 2026-05-02:
          previous H1 ("Startup Engineering Signals by Sector") was a filename,
          not a hook. New copy names the job-to-be-done and surfaces SSRN /
          live data as proof above the fold. */}
      <header className="max-w-3xl">
        <p className="text-sky-400 text-xs font-medium mb-3 uppercase tracking-wider">
          {period.name} Edition · Updated {asOf}
        </p>
        <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 mb-4 leading-[1.1] tracking-tight">
          Crunchbase tells you the day they raised.{" "}
          <span className="text-sky-400">We tell you 47 days before the deck.</span>
        </h1>

        {/* Brunson Secret Formula §1 — Ch 1 audit fix (2026-05-08):
            single-sentence "this is who we serve" avatar pin. Names
            check size, stage, and sector in the buyer's own language.
            Mirrors the canonical avatar in @/content/dream-100-icp.ts
            (line 5–7). Placed between H1 and the stat band so it is
            the first identity moment a reader hits — above the fold,
            not 1,100 lines down where the longer disqualifier lives. */}
        <p
          aria-label="Built for"
          className="inline-flex items-start sm:items-center gap-2 mb-5 rounded-full border border-emerald-500/30 bg-emerald-950/30 px-3 py-1.5 text-[11px] sm:text-xs font-medium text-emerald-200/95"
        >
          <span aria-hidden className="mt-[1px] sm:mt-0">→</span>
          <span className="leading-snug">
            Built for{" "}
            <strong className="font-semibold text-emerald-100">
              developer-investors
            </strong>{" "}
            writing <span className="tabular-nums">€5k–€50k</span> angel
            checks on AI infra, devtools &amp; SaaS — between deal #5 and
            deal #40.
          </span>
        </p>

        {/* Brunson Secret Formula §1 fix (audit 2026-05-06): "Define result
            in numerical terms above the fold." The 3.4× lift is the
            headline finding from soap-opera D12 (lib/emails.ts:241) —
            high-acceleration AND low-contributor-concentration (Gini < 0.30)
            orgs are 3.4× more likely to announce a Series A within 60 days
            than orgs with high acceleration alone. Stat band sits between
            H1 and subhead so the result is the first number a reader sees. */}
        <dl
          aria-label="Headline results from the SSRN panel"
          className="grid grid-cols-3 gap-3 sm:gap-4 mb-5 rounded-xl border border-sky-700/40 bg-gradient-to-br from-sky-950/40 via-slate-900 to-slate-950 p-4 sm:p-5"
        >
          <div className="text-center sm:text-left">
            <dt className="text-[10px] sm:text-xs uppercase tracking-wider text-sky-300/80 font-semibold mb-1">
              Series A within 60d
            </dt>
            <dd className="text-2xl sm:text-3xl font-bold text-gray-100 tabular-nums leading-none">
              3.4<span className="text-sky-400">×</span>
            </dd>
            <dd className="text-[11px] text-gray-400 mt-1 leading-snug">
              more likely vs. velocity alone
            </dd>
          </div>
          <div className="text-center sm:text-left border-l border-slate-800 pl-3 sm:pl-4">
            <dt className="text-[10px] sm:text-xs uppercase tracking-wider text-sky-300/80 font-semibold mb-1">
              Median lead time
            </dt>
            <dd className="text-2xl sm:text-3xl font-bold text-gray-100 tabular-nums leading-none">
              21–47<span className="text-sky-400 text-base sm:text-lg ml-1">d</span>
            </dd>
            <dd className="text-[11px] text-gray-400 mt-1 leading-snug">
              before the round announces
            </dd>
          </div>
          <div className="text-center sm:text-left border-l border-slate-800 pl-3 sm:pl-4">
            <dt className="text-[10px] sm:text-xs uppercase tracking-wider text-sky-300/80 font-semibold mb-1">
              Panel size
            </dt>
            <dd className="text-2xl sm:text-3xl font-bold text-gray-100 tabular-nums leading-none">
              n=219
            </dd>
            <dd className="text-[11px] text-gray-400 mt-1 leading-snug">
              confirmed rounds, SSRN-indexed
            </dd>
          </div>
        </dl>

        <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
          {totalTracked} venture-backed GitHub orgs ranked every week by commit
          velocity <strong className="text-gray-100">and contributor diversity</strong> —
          the two signals that, combined, drove the{" "}
          <a
            href="/methodology#3-4x-finding"
            className="text-sky-400 hover:text-sky-300 underline decoration-sky-400/40 underline-offset-2"
          >
            3.4× Series-A lift
          </a>{" "}
          in the SSRN panel of 219 confirmed fundraises (median lead time 21–47
          days). Free forever, built for the developer who also angel-invests.
        </p>
      </header>

      {/* Brunson Expert Secrets Ch 7 + Ch 9 — 5-step Epiphany Bridge.
          HSO audit 2026-05-08: full Hero's Two Journeys lives at /origin
          (8-min read) but the home reader who never clicks through never
          sees the bridge. Five pills — Backstory, Desire, External Wall,
          Internal Shift, New Opportunity — surface the same arc above
          the fold. Long version stays linked. */}
      <EpiphanyBridgeCondensed />

      <SocialProofBar
        startupCount={totalTracked}
        sectorCount={activeSectorCount}
      />

      {/* Live hero — top 3 movers this week. Greg audit: "embed a live,
          breathing thing at the top." */}
      <SignalLeader movers={topMovers} periodSlug={period.slug} asOf={asOf} />

      {/* IdentityBanner — Brunson DotCom Secrets Ch 4 (Three Core Markets /
          Desires). Wealth (returns) primary, Status (analyst reputation)
          secondary. Frames every door beneath it as an identity choice, not
          a feature comparison. /identity is the long-form companion. */}
      <IdentityBanner />

      {/* Brunson DotCom Secrets Ch 14 — Lead "Squeeze" Funnel.
          HSO audit 2026-05-08 (Ch 14: 87/100): the prior ThreeDoorHero
          gave equal weight to three CTAs, diluting the squeeze. Replaced
          with a true single-CTA squeeze — inline email-capture form
          (dominant) + two small tertiary "exit" links (subordinate).
          The form posts to /api/subscribe with cohort=soap-opera and
          source=home for split-bucket attribution vs /squeeze. */}
      <HomeSqueeze />

      {/* Brunson DotCom Secrets Ch 12 + Expert Secrets Ch 13 — Stack Slide
          on the home page. HSO audit 2026-05-08: full priced stack lived
          on /firstlook + /perfect-webinar but the home reader (who never
          clicks through) saw price tiers without value anchors. Eight
          stack lines, anchored against standalone equivalents, total
          €1,728 vs €9.97/mo founding rate. Risk-reversal sticker
          (30-day guarantee) included as final stack line. */}
      <HomeOfferStack />

      {/* Brunson DCS Ch 7 — Attractive Character polarity card. The reader
          self-qualifies on the four pillars before they hit the conversion
          path, so people who'd churn at email #2 churn here at scroll-second
          15 instead. Compact, links to /data-nerd for the long version. */}
      <DataNerdPolarityCard />

      {/* AgentSummary kept for AI extractability — visually de-emphasized
          via wrapper since the live SignalLeader now plays the human-facing
          TL;DR role. */}
      <AgentSummary
        tldr={`VC Deal Flow Signal (GitDealFlow) ranks ${activeSectorCount} startup sectors by GitHub commit velocity every Monday — a quantitative code-side momentum signal computed from public GitHub data, distinct from startup accelerator programs (Y Combinator, Techstars). Data is free via JSON / CSV / RSS / MCP / A2A / NLWeb. The metric — sometimes called engineering acceleration on this site — has historically preceded fundraise announcements by three to six weeks.`}
        pageUrl="https://signals.gitdealflow.com"
        asOf={asOf}
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
            claim: `${totalTracked} startup signals across ${activeSectorCount} sectors and ${allPeriods.length} quarterly periods of history.`,
            sourceUrl: "https://signals.gitdealflow.com/api/signals.json",
            sourceLabel: "signals.json",
          },
        ]}
      />

      {/* Brunson Big Domino — single-belief block above the pricing close.
          The whole offer rests on this one statement. Russell audit
          2026-05-05: home was missing the "if this is true, everything else
          falls" frame. */}
      <section
        aria-label="Core claim"
        className="bg-gradient-to-br from-sky-950/40 via-slate-900 to-slate-950 border border-sky-700/40 rounded-xl p-6 sm:p-8 my-8"
      >
        <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider mb-3">
          What this whole site argues
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug mb-3">
          If commit-velocity acceleration is the most leading public signal in
          venture capital, then every other deal-flow source —{" "}
          <span className="text-sky-400">
            pitch decks, AngelList, Crunchbase, warm intros
          </span>{" "}
          — is a lagging indicator.
        </h2>
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
          Read the long version on the{" "}
          <Link
            href="/perfect-webinar"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
          >
            12-minute walkthrough
          </Link>
          {" "}or the{" "}
          <Link
            href="/pitch"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
          >
            90-second pitch
          </Link>
          . Three objections, three breakdowns, the SSRN panel that proves the
          21-to-47-day lead time.
        </p>
      </section>

      {/* Three Secrets — the false-belief breakdowns from Workbook 4. Surface
          them on the most-trafficked surface (home) instead of burying them
          inside the soap-opera email sequence. */}
      <section aria-label="Three objections" className="my-8 space-y-5">
        <div>
          <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            The three objections every investor raises
          </p>
          <h2 className="text-2xl font-bold text-gray-100">
            And why each one is wrong.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border-l-4 border-sky-500 bg-slate-900/60 p-5 rounded-r-lg">
            <p className="text-sky-400 text-[10px] font-semibold uppercase tracking-wider mb-2">
              #1 · Vehicle
            </p>
            <h3 className="text-gray-100 font-semibold text-base mb-2">
              &ldquo;GitHub data is just noise.&rdquo;
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              We don&rsquo;t look at absolute numbers — only sharp deviations
              from each company&rsquo;s own baseline. That isn&rsquo;t noise,
              that&rsquo;s a regime change.
            </p>
          </div>
          <div className="border-l-4 border-emerald-500 bg-slate-900/60 p-5 rounded-r-lg">
            <p className="text-emerald-400 text-[10px] font-semibold uppercase tracking-wider mb-2">
              #2 · Internal
            </p>
            <h3 className="text-gray-100 font-semibold text-base mb-2">
              &ldquo;I have enough deal flow already.&rdquo;
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your network shows you what other investors already see. We open
              the 21-to-47-day window before consensus forms.
            </p>
          </div>
          <div className="border-l-4 border-indigo-500 bg-slate-900/60 p-5 rounded-r-lg">
            <p className="text-indigo-400 text-[10px] font-semibold uppercase tracking-wider mb-2">
              #3 · External
            </p>
            <h3 className="text-gray-100 font-semibold text-base mb-2">
              &ldquo;Public data isn&rsquo;t edge.&rdquo;
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Quant funds make billions on SEC filings. The edge is in the
              lens, not the data. Zero investor tools package GitHub as deal
              flow.
            </p>
          </div>
        </div>

        <p className="text-gray-400 text-sm">
          Full breakdown on the{" "}
          <Link
            href="/perfect-webinar"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
          >
            long-form walkthrough
          </Link>
          .
        </p>
      </section>

      {/* Manifesto — Brunson "future-based cause" surfaced on home. The
          movement-frame the workbook had but the page didn't. */}
      <section
        aria-label="Manifesto"
        className="my-8 border-l-2 border-amber-500/50 pl-5 sm:pl-6 py-1"
      >
        <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
          What we believe
        </p>
        <p className="text-gray-200 text-base sm:text-lg leading-relaxed mb-2">
          The next generation of great investments will be found in{" "}
          <em className="not-italic font-semibold text-amber-300">data</em>,
          not networks.
        </p>
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
          The best startups leave footprints in their code long before they
          leave footprints in the press. Our mission is to make engineering
          momentum visible to every investor — not just the ones with the
          right rolodex. A world where capital finds builders faster is a
          world where better products get built.
        </p>
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed pt-2">
          The enemy isn&rsquo;t a fund or a competitor. It&rsquo;s the{" "}
          <strong className="text-amber-300">warm-intro roulette</strong>{" "}
          — a sourcing system that rewards proximity to the right rolodex
          and punishes builders who happen to live three time zones away.
          We&rsquo;re replacing that roulette with a public, reproducible,
          code-side signal anyone with curiosity can read.
        </p>
      </section>

      {/* IDENTITY DECLARATION — Brunson Expert Secrets identity-belief.
          This page already names "developer-investor" inside copy; this
          block surfaces the identity formation as a standalone moment
          before the pricing ladder. */}
      <section
        aria-label="Identity declaration"
        className="my-8 rounded-xl border border-sky-700/40 bg-gradient-to-br from-sky-950/30 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-3"
      >
        <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
          Who this is for
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
          You&rsquo;re not a VC. You&rsquo;re a{" "}
          <span className="text-sky-400">developer-investor</span>.
        </h2>
        <p className="text-gray-300 text-base leading-relaxed">
          You read commit logs for fun. You write €5k–€50k checks on the side.
          You don&rsquo;t want a fund-grade platform with a fund-grade contract
          and a fund-grade price. You want a tool that fits the way you
          actually source — Sunday email, Wednesday filter, end-of-quarter
          deeper dive. Built around how you read software, not how a partner
          reads pitch decks.
        </p>
      </section>

      {/* DISQUALIFIER — "Who this is FOR / NOT FOR".
          Traffic Secrets Ch 1 (dream customer). The polarization is the
          point: telling the wrong reader to leave is what makes the right
          reader trust the offer. */}
      <section
        aria-label="Who this is for / not for"
        className="my-10 grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        <div className="group relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-950/40 via-emerald-950/10 to-transparent p-6 sm:p-7 transition-colors hover:border-emerald-400/40">
          <div className="mb-5 flex items-center gap-2.5">
            <span
              aria-hidden
              className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30"
            >
              <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 6.25 5 8.75l4.5-5.5" />
              </svg>
            </span>
            <p className="text-emerald-300/90 text-[11px] font-semibold uppercase tracking-[0.14em]">
              This is for you if
            </p>
          </div>
          <ul className="space-y-3 text-gray-200/95 text-[15px] leading-relaxed">
            <li className="flex gap-3">
              <span aria-hidden className="mt-[0.55rem] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/70" />
              <span>
                You write 5–40 angel checks a year and want one extra leading
                indicator your network can&rsquo;t give you.
              </span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden className="mt-[0.55rem] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/70" />
              <span>
                You scout for a fund and need a Monday memo your principal
                respects, sourced from public, reproducible data.
              </span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden className="mt-[0.55rem] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/70" />
              <span>
                You&rsquo;re a developer who occasionally writes checks and
                wants the cleanest 5-name digest in your inbox every Sunday.
              </span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden className="mt-[0.55rem] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/70" />
              <span>You read a methodology paper before you trust a metric.</span>
            </li>
          </ul>
        </div>
        <div className="group relative overflow-hidden rounded-2xl border border-rose-500/25 bg-gradient-to-br from-rose-950/40 via-rose-950/10 to-transparent p-6 sm:p-7 transition-colors hover:border-rose-400/40">
          <div className="mb-5 flex items-center gap-2.5">
            <span
              aria-hidden
              className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-500/15 text-rose-300 ring-1 ring-rose-400/30"
            >
              <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3l6 6M9 3l-6 6" />
              </svg>
            </span>
            <p className="text-rose-300/90 text-[11px] font-semibold uppercase tracking-[0.14em]">
              This is not for you if
            </p>
          </div>
          <ul className="space-y-3 text-gray-200/95 text-[15px] leading-relaxed">
            <li className="flex gap-3">
              <span aria-hidden className="mt-[0.55rem] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400/70" />
              <span>
                You&rsquo;re a Series-B+ partner with a six-figure data budget —
                Harmonic, Tracxn, and Affinity are built for you, not us.
              </span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden className="mt-[0.55rem] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400/70" />
              <span>
                You want a tool that screens code-quality or runs founder
                background checks — that&rsquo;s a different category.
              </span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden className="mt-[0.55rem] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400/70" />
              <span>
                You source exclusively from warm intros and don&rsquo;t want a
                cold path to founders. Engineering signal opens cold lanes.
              </span>
            </li>
            <li className="flex gap-3">
              <span aria-hidden className="mt-[0.55rem] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400/70" />
              <span>
                You believe public data has no edge. Our{" "}
                <Link
                  href="/perfect-webinar"
                  className="whitespace-nowrap font-medium text-sky-300 underline decoration-sky-400/40 decoration-dotted underline-offset-[3px] transition-colors hover:text-sky-200 hover:decoration-sky-300"
                >
                  long-form pitch
                </Link>{" "}
                argues the opposite — if it doesn&rsquo;t convince you, this
                isn&rsquo;t the tool.
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Sharp scarcity counter — public 2026-cohort capacity. Sits above
          PricingLadder so high-intent fund visitors see the cap before the
          price grid. */}
      <SharpScarcityBadge variant="default" />

      {/* Trial closes — Brunson Expert Secrets Ch 15. Three yes-no gut-checks
          immediately above the pricing card, so the visitor's head is nodding
          before they see the number. Russell rule: the trial close is the
          bridge between belief (Big Domino + Three Objections) and price
          (PricingLadder). One Money close, one Identity close, one Urgency
          close — each phrased as "would that be worth it" so the answer is
          a self-spoken yes. */}
      <section
        aria-label="Gut-check before pricing"
        className="my-8 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/30 via-slate-950 to-slate-950 p-6 sm:p-8"
      >
        <p className="text-amber-300 text-xs font-semibold uppercase tracking-[0.14em] mb-4">
          Three quick gut-checks before the price
        </p>
        <ul className="space-y-4 text-gray-100 text-base sm:text-[17px] leading-relaxed">
          <li className="flex gap-3">
            <span
              aria-hidden
              className="mt-[0.6rem] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400"
            />
            <span>
              <strong className="text-amber-300">If a 24-hour lead</strong> on
              the same ten ranked startups changed{" "}
              <em>one</em> cheque you write in the next 12 months — at a €5k–€50k
              angel range with a 3× exit on one in five — would that head-start
              be worth <strong>€97/month</strong>?
            </span>
          </li>
          <li className="flex gap-3">
            <span
              aria-hidden
              className="mt-[0.6rem] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400"
            />
            <span>
              <strong className="text-amber-300">If you stayed</strong> the
              engineer who reads commit logs for fun — never had to turn into a
              warm-intro-Tetris partner — and the signal still found the
              founders before consensus did, would{" "}
              <strong>€9.97/month</strong> be a fair trade?
            </span>
          </li>
          <li className="flex gap-3">
            <span
              aria-hidden
              className="mt-[0.6rem] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400"
            />
            <span>
              <strong className="text-amber-300">If the founding rate</strong>{" "}
              locks forever for everyone who joins before the cohort closes —
              and the public price is already scheduled to step to €29/€197
              after — does the cost of waiting one more week feel{" "}
              <em>cheaper</em> than the cost of locking in tonight?
            </span>
          </li>
        </ul>
        <p className="mt-5 text-gray-400 text-sm">
          If you said yes to any one of these, the rung that fits sits in the
          ladder below. If you said no to all three, the{" "}
          <Link
            href="/predicted"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
          >
            free Sunday digest
          </Link>{" "}
          is the right rhythm for now — no upgrade pressure, ever.
        </p>
      </section>

      {/* Pricing ladder — visible on homepage so buyers don't have to hunt for
          the price. Greg audit: anchor on Insider, sell the middle tier. */}
      <PricingLadder />

      {/* All sectors — moved below the fold. Still SEO-load-bearing (links to
          every /startups-to-watch/{sector}-{period} page) but no longer the
          first thing a human visitor sees. */}
      <div>
        <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
          <h2 className="text-gray-100 font-semibold text-2xl">
            All sectors we track
          </h2>
          <p className="text-gray-400 text-xs">
            {activeSectorCount} sectors · {totalTracked} venture-backed
            startups · refreshed weekly
          </p>
        </div>
        <p className="text-gray-400 text-sm mb-5 max-w-2xl">
          Each sector page ranks the top startups by 14-day commit velocity
          change, with contributor growth and signal type. Updated every
          Monday at 09:00 UTC.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sectors.map((sector) => {
            const snapshot = sector.periods[period.slug];
            if (!snapshot) return null;
            return (
              <Link
                key={sector.slug}
                href={`/startups-to-watch/${sector.slug}-${period.slug}`}
                className="group block rounded-lg border border-slate-800 bg-slate-900 p-5 hover:border-sky-600/50 hover:bg-slate-800/60 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-500/10 transition-all"
              >
                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <h3 className="text-gray-100 font-semibold text-base group-hover:text-sky-400 transition-colors">
                    {sector.name}
                  </h3>
                  <span className="text-gray-400 text-[11px] font-mono tabular-nums shrink-0">
                    {snapshot.startups.length}
                  </span>
                </div>
                <p className="text-gray-400 text-xs mb-3 uppercase tracking-wider">
                  startups tracked
                </p>
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                  {sector.description}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sky-400 text-xs font-medium group-hover:text-sky-300 transition-colors">
                  View rankings <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Previous periods */}
      {allPeriods.length > 1 && (
        <div>
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

      {/* Topical hubs — in-body editorial links to high-intent destinations.
          Footer carries discoverability; this carries contextual weight.
          Yandex 2026-05-02 audit found apex-routes underweighted — body
          links from the home page move PageRank where it matters. */}
      <div>
        <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
          <h2 className="text-gray-100 font-semibold text-2xl">
            Where to go next
          </h2>
          <p className="text-gray-400 text-xs">
            The 8 highest-signal pages on this site
          </p>
        </div>
        <p className="text-gray-400 text-sm mb-5 max-w-2xl">
          Most of the value isn&rsquo;t in the sector grids — it&rsquo;s in
          the methodology, the weekly leaderboard, and the receipts you can
          run against your own GitHub stars.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {NEXT_LINKS.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-sky-600/50 hover:bg-slate-800/60 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-500/10 transition-all"
            >
              <div className="flex items-start gap-2.5 mb-2">
                <span aria-hidden="true" className="text-base leading-none mt-0.5">
                  {n.icon}
                </span>
                <h3 className="text-gray-100 font-semibold text-sm group-hover:text-sky-400 transition-colors">
                  {n.label}
                </h3>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">
                {n.sub}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Latest from the blog */}
      <div>
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
              className="group block rounded-lg border border-slate-800 bg-slate-900 p-5 hover:border-sky-600/50 hover:bg-slate-800/60 hover:-translate-y-0.5 transition-all"
            >
              <p className="text-gray-400 text-xs mb-2 uppercase tracking-wider">{post.date}</p>
              <h3 className="text-gray-100 font-semibold text-base mb-2 group-hover:text-sky-400 transition-colors leading-snug">
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
      <div>
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
              className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-sky-600/50 hover:bg-slate-800/60 hover:-translate-y-0.5 transition-all"
            >
              <p className="font-mono text-xs text-sky-400 font-semibold mb-2 tabular-nums">
                #{f.n.toString().padStart(2, "0")}
              </p>
              <p className="text-gray-200 text-sm leading-snug group-hover:text-sky-300 transition-colors line-clamp-3">
                {f.title}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Compare tools */}
      <div>
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
              className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-sky-600/50 hover:bg-slate-800/60 hover:-translate-y-0.5 transition-all"
            >
              <h3 className="text-gray-100 font-medium text-sm group-hover:text-sky-400 transition-colors mb-1 leading-snug">
                {comp.h1}
              </h3>
              <p className="text-gray-400 text-xs inline-flex items-center gap-1">
                Read comparison <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Pillar-page hub — boosts internal-link graph for Yandex
          "low-value" recheck routes (/weekly, /methodology, /trending,
          /startups-to-watch, /alternatives, /signals, /faq, /glossary).
          Added 2026-05-03 per traffic-impact action plan. */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-100 font-semibold text-lg">
            Pillar pages &amp; topic clusters
          </h2>
        </div>
        <p className="text-gray-400 text-xs mb-3">
          Deep-dive entry points for the most-asked questions about GitHub
          momentum signals — methodology, sectors, signal types, and tooling
          comparisons.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {PILLAR_LINKS.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="group block rounded-lg border border-slate-800 bg-slate-900 p-3 hover:border-sky-600/50 hover:bg-slate-800/60 hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-center gap-2">
                <span aria-hidden="true" className="text-sm leading-none">
                  {p.icon}
                </span>
                <p className="text-gray-200 text-sm font-medium group-hover:text-sky-400 transition-colors">
                  {p.label}
                </p>
              </div>
              <p className="text-gray-400 text-[11px] mt-1 leading-tight pl-6">
                {p.sub}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom CTA — receipts-led lead magnet (Russell pivot 2026-04-26) */}
      <div className="relative rounded-xl border border-emerald-800/50 bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-950 p-6 sm:p-10 text-center overflow-hidden shadow-lg shadow-emerald-500/5">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, #10b981 40%, #0ea5e9 60%, transparent)" }}
        />
        <span className="inline-flex items-center gap-1.5 mb-3 rounded-full border border-emerald-700/50 bg-emerald-950/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
          <span aria-hidden="true">★</span> Free · 30 seconds · No signup
        </span>
        <h2 className="text-gray-100 font-bold text-2xl sm:text-3xl mb-3 tracking-tight">
          What&rsquo;s your developer Scout Score?
        </h2>
        <p className="text-gray-300 text-sm sm:text-base mb-6 max-w-xl mx-auto leading-relaxed">
          Paste any GitHub username and see how many validated unicorns you
          starred <em className="text-emerald-300 not-italic font-medium">before</em> they hit $1B.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
          <Link
            href="/receipts"
            className="inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-all shadow-sm shadow-emerald-500/30 hover:shadow-md hover:shadow-emerald-500/40"
          >
            Get my Scout Score
            <span aria-hidden="true">→</span>
          </Link>
          <Link
            href="https://gitdealflow.com/#signup"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-slate-700 hover:border-slate-500 hover:bg-slate-800/40 text-gray-300 hover:text-white text-sm font-medium transition-colors"
          >
            Or get the weekly report
          </Link>
        </div>
      </div>

      {/* Brunson DCS Ch 7 — Attractive Character signoff at page-end. Links
          to /data-nerd character bible and /about/founder backstory. */}
      <DataNerdSignoff variant="default" />

    </div>
    </>
  );
}
