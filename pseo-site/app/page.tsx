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
import HomeStoryMoment from "@/components/HomeStoryMoment";
import HomeOfferStack from "@/components/HomeOfferStack";
import CharterCohortBlock from "@/components/CharterCohortBlock";

import { DataNerdPolarityCard } from "@/components/DataNerdPolarityCard";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";
import TrialClose from "@/components/TrialClose";
import { DATA_NERD_ORCID, DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";
import {
  EMOTIONAL_CAUSE_KICKER,
  EMOTIONAL_CAUSE_LINES,
} from "@/content/cause";

export const metadata: Metadata = {
  description:
    "A deal-flow signal tool for investors, not a fund. See which startups are accelerating before the round feels obvious — public engineering signals, calmer timing, and direct proof.",
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
  { href: "/code-side-sourcing", label: "Code-Side Sourcing", sub: "The category we're defining — definition, first principles, practitioners", icon: "🧭" },
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
  { href: "/distribution/platform-hooks", label: "Platform-native openers", sub: "Twelve openers, one signal — how the same product story gets reframed for Twitter, Reddit, HN, dev.to, LinkedIn, Telegram and seven more", icon: "🪝" },
  { href: "/target-list", label: "Top 100", sub: "100 voices we read on the engineering-signal frontier — substacks, podcasts, GitHub orgs, datasets — each ICP-scored", icon: "💬" },
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

const PRIORITY_LINK_BLOCKS = [
  {
    title: "Commercial evaluation",
    sub: "Send crawlers and buyers toward the pages that help them decide whether to trust, compare, and buy.",
    links: [
      { href: "/answers", label: "Answers", icon: "💬" },
      { href: "/compare", label: "Compare", icon: "⚖️" },
      { href: "/alternatives", label: "Alternatives", icon: "🧭" },
      { href: "/vs", label: "VS", icon: "↔️" },
      { href: "/use-cases", label: "Use Cases", icon: "🎯" },
      { href: "/funnels", label: "Funnels", icon: "🚀" },
    ],
  },
  {
    title: "Proof",
    sub: "Keep authority flowing from evidence and case studies into the commercial paths.",
    links: [
      { href: "/research", label: "Research", icon: "🔬" },
      { href: "/from-stars-to-seed", label: "From Stars to Seed", icon: "🏁" },
      { href: "/citations", label: "Citations", icon: "📚" },
      { href: "/attestations", label: "Attestations", icon: "✅" },
      { href: "/reproducibility", label: "Reproducibility", icon: "🔁" },
      { href: "/receipts", label: "Scout Receipts", icon: "🧾" },
    ],
  },
  {
    title: "Live now",
    sub: "Point both users and crawlers at the freshest recurring surfaces on the site.",
    links: [
      { href: "/weekly/top-100", label: "Weekly Top 100", icon: "🏆" },
      { href: "/signal-of-the-week", label: "Signal of the Week", icon: "⚡" },
      { href: "/predicted", label: "Predicted", icon: "🔮" },
      { href: "/trending", label: "Trending", icon: "🔥" },
      { href: "/startup-ideas", label: "Startup Ideas", icon: "💡" },
      { href: "/idea-of-the-day", label: "Idea of the Day", icon: "📅" },
    ],
  },
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
      // Site-wide identity nodes (WebSite #website + Organization
      // #organization) are emitted authoritatively by
      // <RootIdentitySchema/> in the root layout on every page,
      // including this one. The homepage previously re-emitted
      // strict-subset copies under the same @id — pure byte bloat
      // (duplicated again in the RSC flight payload). Removed; the
      // richer layout nodes carry all fields. Page-unique nodes
      // (ItemList, Dataset, WebPage, WebAPI, FAQPage, Service,
      // SoftwareApplication, Event) remain below.
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
          author: DATA_NERD_AUTHOR_REF,
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
        // Page-unique LIVE metrics only. These counters are contributed
        // to the canonical SoftwareApplication entity (/#software), which
        // <RootIdentitySchema/> already emits authoritatively on every
        // page (carrying name, applicationCategory, the full offers list
        // incl. Insider, featureList, Wikidata identifier, and the Glama
        // aggregateRating). Sharing that @id merges these stats onto the
        // canonical node instead of re-declaring a second, anonymous app
        // entity — the old node duplicated the layout's name/offers/
        // featureList in BOTH the ld+json tag and the RSC flight payload
        // (~2 KB ×2) and left schema parsers with two competing apps.
        "@type": "SoftwareApplication",
        "@id": "https://signals.gitdealflow.com/#software",
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
      },
      {
        "@type": "Service",
        "@id": "https://signals.gitdealflow.com/#service",
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
            Mirrors the canonical avatar in @/content/target-list-icp.ts
            (line 5–7). Placed between H1 and the stat band so it is
            the first identity moment a reader hits — above the fold,
            not 1,100 lines down where the longer disqualifier lives. */}
        <p
          aria-label="Start here if"
          className="inline-flex items-start sm:items-center gap-2 mb-5 rounded-full border border-emerald-500/30 bg-emerald-950/30 px-3 py-1.5 text-[11px] sm:text-xs font-medium text-emerald-200/95"
        >
          <span aria-hidden className="mt-[1px] sm:mt-0">→</span>
          <span className="leading-snug">
            If you evaluate companies for a living — angel, scout, seed
            fund, corp-dev or PE — and want a calmer signal before the round
            gets obvious, you are in the right place.{" "}
            <span className="text-emerald-300/80">No code-reading required.</span>
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
          days). It is a tool, not a fund — we surface the signal, you make the
          calls. Free to browse, built to give you a clearer read before the round gets obvious.
        </p>
      </header>

      {/* Brunson "one funnel, one offer" fix (2026-06-01): removed the early
          "Start here if the site feels large" 3-card router that sat here.
          It dumped three exits immediately after the hook, before any belief
          was built or the free email was offered — the #1 conversion drag.
          The site now keeps exactly ONE human routing block (the "Where to
          start" Free/Faster/Method lanes lower down, free as the default);
          the bottom "Where to go next" grid is a post-decision SEO hub, not a
          third start-router. Hero now flows straight into the story. */}

      {/* Brunson Expert Secrets §2 Ch 5 — Storytelling. Audit 2026-05-09
          flagged Ch 5 at 95/100 because the Day 0 / Day 14 / Day 21 / Day 25
          email beats carry the story arc beautifully and /origin walks the
          long-form Hero's Two Journeys, but the home above-the-fold had no
          story moment at all — H1 → avatar pin → stat band → subhead →
          straight into the abstracted 5-step bridge. The first emotional
          beat the reader hit was already the conclusion of a story they
          had not been told yet. HomeStoryMoment ships the same canon scene
          as the Day 0 email (Saturday afternoon, the laptop fan, a
          fintech's GitHub on the screen, the unsent email, a Series A
          announced three weeks later) condensed to ~85 words for a
          30-second read, with the closing line that bridges into the
          product. */}
      <HomeStoryMoment />

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

      {/* Plain-English framing above the live movers (2026-06-01). Marcus —
          corp-dev / PE / non-engineer VP, whose fear is "looking
          non-technical in a technical room" — hits the business translation
          BEFORE any velocity / contributor / deploy chips, so the numbers
          read as receipts, not a test he has to pass. Voice rule from
          lib/data-nerd.ts: "translate, don't dump." */}
      <div className="rounded-xl border border-emerald-700/30 bg-emerald-950/15 px-5 py-4 sm:px-6">
        <p className="text-emerald-300 text-[11px] font-semibold uppercase tracking-wider mb-1.5">
          In plain English
        </p>
        <p className="text-gray-200 text-sm sm:text-[15px] leading-relaxed">
          These are the teams that suddenly started shipping far more than
          their own normal this week — more engineers, more infrastructure,
          more activity than usual.{" "}
          <span className="text-gray-400">
            You don&rsquo;t read the code; we translate the movement into
            business language. The numbers on each card are the receipts.
          </span>
        </p>
      </div>

      {/* Live hero — top 3 movers this week. Greg audit: "embed a live,
          breathing thing at the top." */}
      <SignalLeader movers={topMovers} periodSlug={period.slug} asOf={asOf} />

      {/* IdentityBanner — Brunson DotCom Secrets Ch 4 (Three Core Markets /
          Desires). Wealth (returns) primary, Status (analyst reputation)
          secondary. Frames every door beneath it as an identity choice, not
          a feature comparison. /identity is the long-form companion. */}
      <IdentityBanner />

      {/* CATEGORY NAMING — Russell-Brunson Expert Secrets §1 Ch 3 ship
          2026-05-09. The "New Opportunity" must be named, not described.
          Audit had this chapter at 92/100 with the note that the category
          was walked but never branded. Block names "Code-Side Sourcing" as
          the category and links the canonical definition page. Placed
          immediately above the Big Domino so the reader has a category
          name to attach the single-belief claim to. */}
      <section
        aria-label="The category we're defining"
        className="my-8 rounded-xl border border-amber-700/40 bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-950 p-6 sm:p-8"
      >
        <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider mb-3">
          The category we&rsquo;re defining
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug mb-3">
          Code-Side Sourcing — a new sourcing channel for venture capital.
        </h2>
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-3">
          Code-Side Sourcing is the practice of using public
          repository-velocity data as a leading indicator of venture-stage
          outcomes — surfacing fundraises{" "}
          <span className="text-amber-300 font-semibold">
            21 to 47 days before pitch decks circulate.
          </span>{" "}
          It runs alongside warm intros, decks, and databases — not in place
          of them.
        </p>
        <p className="text-gray-400 text-sm leading-relaxed">
          Read the canonical definition at{" "}
          <Link
            href="/code-side-sourcing"
            className="text-amber-300 hover:text-amber-200 underline decoration-dotted"
          >
            /code-side-sourcing
          </Link>
          {" "}— what it replaces, the five first principles, who practises it,
          and the open methodology that grounds it.
        </p>
      </section>

      {/* Brunson Expert Secrets Ch 6 — Big Domino + Ch 10 Three Secrets
          (false-belief collapses). Audit 2026-05-09: domino used to sit
          BELOW the offer (after HomeSqueeze + HomeOfferStack), which is the
          opposite of canonical Brunson sequence Story → Domino → Three
          Objections → Offer. Moved up so the reader builds belief BEFORE
          any commitment ask (email or money). The whole offer beneath
          this block rests on this one statement. */}
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
            href="/walkthrough"
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

      {/* Embedded VSL removed 2026-06-01 — the walkthrough-vsl recording was
          poor quality, so it's pulled from the homepage until a better cut is
          ready (owner will revisit). The asset still lives in
          content/videos.ts and is used on /walkthrough + /predicted. To
          restore: re-add `import { VideoEmbedBlock } from
          "@/components/VideoEmbedBlock";` and a <section> rendering
          <VideoEmbedBlock slug="walkthrough-vsl" variant="full" /> here, and
          point the Big Domino paragraph above back at "watch the version
          below". */}

      {/* Three Secrets — the false-belief breakdowns surfaced directly
          after the Big Domino so the reader's three objections collapse
          before the offer surfaces below. Same audit as the Domino move
          above (2026-05-09): belief block sits ahead of any commitment
          ask. */}
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
              Renaissance Technologies started in 1988 on data anyone could
              buy &mdash; Reuters quotes, SEC filings, OPRA ticks. Medallion
              compounded ~39% net for thirty years. Edge wasn&rsquo;t in
              the data. It was in the lens.
            </p>
          </div>
        </div>

        {/* False-Belief #3 — visceral counter-story. The Three Objections
            grid argues the External objection abstractly ("the lens is the
            edge"); this block shows it. October 2024, a specific repo,
            three peer angels who didn't open the page that month — the
            buyer's brain needs the moment, not the principle. Brunson
            Expert Secrets Ch 5 (Storytelling) + Ch 10 (False Beliefs /
            Identity Shift): show, don't tell. */}
        <div className="rounded-xl border border-indigo-700/30 bg-gradient-to-br from-indigo-950/20 via-slate-900 to-slate-950 p-5 sm:p-6 space-y-3 mt-4">
          <p className="text-indigo-300 text-[11px] font-semibold uppercase tracking-wider">
            The Saturday I learned that lesson on a GitHub page
          </p>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            October 2024. A small fintech team &mdash; three founders, one
            repo, beautifully boring product. I opened their org page on a
            Saturday morning. Their commit velocity had tripled in the
            prior fortnight. Four new contributors had joined. They&rsquo;d
            spun up three new infrastructure repos. All of it on
            github.com, indexed by Google, free to read.
          </p>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            I knew three other angels who wrote checks at the same size I
            did. They all had GitHub accounts. None of them opened that
            org&rsquo;s page that month. I checked.
          </p>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Three weeks later the team announced a $4M Series A. The two
            investors who got in had either been told by a warm intro
            &mdash; fine, but slow &mdash; or had been reading the same
            public data I had. The other three later said they
            &ldquo;missed&rdquo; the round.{" "}
            <strong className="text-gray-100">
              They didn&rsquo;t miss it. They didn&rsquo;t read it.
            </strong>
          </p>
          <p className="text-gray-400 text-sm leading-relaxed border-l-2 border-indigo-700/40 pl-3">
            Same as SEC filings. Same as Reuters quotes. Same as every
            market that ever produced an alpha-generating fund out of
            information sitting in plain sight. The data is open. The
            lens is the edge.
          </p>
        </div>

        <p className="text-gray-400 text-sm">
          Full breakdown on the{" "}
          <Link
            href="/walkthrough"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
          >
            long-form walkthrough
          </Link>
          .
        </p>
      </section>

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
          on /firstlook + /walkthrough but the home reader (who never
          clicks through) saw price tiers without value anchors. Eight
          stack lines, anchored against standalone equivalents, total
          €1,728 vs €9.97/mo founding rate. Risk-reversal sticker
          (30-day guarantee) included as final stack line. */}
      <HomeOfferStack />

      {/* CharterCohortBlock — Brunson Expert Secrets §1 Ch 4 (Mass Movement
          Vehicle). The chapter teaches that a movement requires *visible
          momentum* — the new visitor sees other members. /wins is the
          startup-side ledger; /members is the member-side ledger. Block
          shows the seat counter (X of 25 open) + 4 archetype previews +
          claim-a-seat CTA so the home reader sees the movement scaffold
          before they hit the conversion path. */}
      <CharterCohortBlock />

      {/* Brunson DCS Ch 7 — Attractive Character polarity card. The reader
          self-qualifies on the four pillars before they hit the conversion
          path, so people who'd churn at email #2 churn here at scroll-second
          15 instead. Compact, links to /data-nerd for the long version. */}
      <DataNerdPolarityCard />

      {/* Institutional-trust beat (2026-06-01). The polarity card above
          asserts "anonymity is a credibility signal" — true for the indie
          reader, but a procurement problem for Marcus, who has to defend a
          vendor to an investment committee. This converts the anonymity from
          an intimacy ceiling into a credentialed, IC-ready signal: anonymous
          handle, NOT an anonymous track record. Fixes the "anonymity =
          institutional-trust problem" + Brunson "anti-personality" docks
          without breaking the anonymity pillar (no face/name/voice added —
          only the already-published ORCID + SSRN + CC BY 4.0 credentials). */}
      <section
        aria-label="Anonymous handle, credentialed methodology"
        className="my-8 rounded-xl border border-sky-700/30 bg-gradient-to-br from-sky-950/25 via-slate-900 to-slate-950 p-6 sm:p-7"
      >
        <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider mb-2">
          Anonymous handle — not an anonymous track record
        </p>
        <p className="text-gray-200 text-sm sm:text-base leading-relaxed">
          You can take this to an investment committee without taking a
          personality with it. The handle is pseudonymous on purpose; the
          <strong className="text-gray-100"> methodology is credentialed and
          auditable</strong> — an SSRN-indexed paper (n=219), a persistent
          ORCID (<span className="font-mono text-sky-300 tabular-nums">{DATA_NERD_ORCID}</span>),
          and the full regression released CC BY 4.0 so your own team can
          reproduce every number before you commit a euro. Your committee buys
          the math, not the messenger.
        </p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs">
          <Link
            href="/methodology"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted font-medium"
          >
            Read the methodology →
          </Link>
          <Link
            href="/reproducibility"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted font-medium"
          >
            Reproduce the panel →
          </Link>
          <Link
            href="/citations"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted font-medium"
          >
            Verify the credentials →
          </Link>
        </div>
      </section>

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

      {/* CAUSE — emotional layer. Brunson Expert Secrets §1 Ch 2 — the
          Future-Based Cause has two layers: intellectual and emotional.
          Intellectual lives below ("data over networks" + named enemy);
          emotional opens here, because the gut-level version is what
          recruits a movement and the intellectual version is what
          retains it. Source of truth: content/cause.ts. */}
      <section
        aria-labelledby="home-emotional-cause-heading"
        className="my-8 rounded-xl border border-rose-700/40 bg-gradient-to-br from-rose-950/25 via-slate-900 to-slate-950 p-6 sm:p-8"
      >
        <p className="text-rose-300 text-xs font-semibold uppercase tracking-wider mb-3">
          {EMOTIONAL_CAUSE_KICKER}
        </p>
        <h2
          id="home-emotional-cause-heading"
          className="text-xl sm:text-2xl font-bold text-gray-100 leading-snug mb-5"
        >
          Five sentences. If any of them lands, you&rsquo;re one of us.
        </h2>
        <ol className="space-y-3.5">
          {EMOTIONAL_CAUSE_LINES.map((line, i) => (
            <li
              key={i}
              className="flex gap-3 text-gray-200 text-sm sm:text-base leading-relaxed"
            >
              <span
                aria-hidden="true"
                className="text-rose-400 font-bold tabular-nums shrink-0 w-6 pt-0.5"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ol>
        <p className="text-gray-400 text-xs sm:text-sm leading-relaxed pt-5 border-t border-rose-700/20 mt-5">
          Read the long version on the{" "}
          <Link
            href="/manifesto"
            className="text-rose-300 hover:text-rose-200 underline decoration-dotted"
          >
            two-layer manifesto
          </Link>{" "}
          — what we believe, what we refuse, the seven pillars, the named
          enemy, who&rsquo;s on the bus.
        </p>
      </section>

      {/* CAUSE — intellectual layer. The pillars-flavored summary that
          retains the reader who already nodded through the emotional
          opener. The named enemy ("warm-intro roulette") closes the
          loop. */}
      <section
        aria-label="What we believe"
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
        <TrialClose tone="amber">
          Warm-intro roulette is the named enemy. If the system that&rsquo;s
          been gating your deal flow for ten years is the system, not your
          network — does naming it change what you&rsquo;d try next?
        </TrialClose>
      </section>

      {/* STARTING-POINT ROUTING — replaces persona/archetype framing with direct decision help. */}
      <section className="my-12 space-y-4">
        <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
          Where to start
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
          You do not need a persona. You need the right starting point for this
          week.
        </h2>
        <p className="text-gray-300 text-base leading-relaxed max-w-3xl">
          <strong className="text-gray-100">Most people should start free</strong>{" "}
          — one calm read every Sunday. The other two lanes are only for when a
          live question is already costing you, or your team needs a method it
          can defend. Same signal. Different urgency.
        </p>
      </section>

      <section
        aria-label="Three ways to start"
        className="my-12 grid grid-cols-1 gap-5 md:grid-cols-3"
      >
        <article className="relative flex flex-col gap-4 rounded-2xl border border-sky-500/60 ring-1 ring-sky-500/30 bg-gradient-to-b from-sky-950/40 to-slate-950/40 p-6 shadow-lg shadow-sky-500/10">
          <span className="absolute -top-2.5 left-6 inline-flex items-center gap-1 rounded bg-sky-500 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-950 shadow-sm shadow-sky-500/30">
            <span aria-hidden="true">★</span> Most start here
          </span>
          <div className="space-y-2">
            <span className="inline-flex items-center rounded-full border border-sky-400/30 bg-sky-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-sky-200">
              Start free
            </span>
            <h3 className="text-lg font-bold text-gray-100">
              If you want one useful read each Sunday
            </h3>
          </div>
          <p className="text-sm leading-relaxed text-gray-300">
            Get the weekly watch when you want earlier signal without another
            dashboard. Read it in one sitting, keep the names worth revisiting,
            and ignore the rest.
          </p>
          <div className="mt-auto space-y-1.5 border-t border-slate-800/80 pt-3 text-xs text-gray-400">
            <p className="font-semibold uppercase tracking-[0.12em] text-gray-500">
              Best first step
            </p>
            <p className="text-gray-200">Free Acceleration Watch</p>
          </div>
          <Link
            href="/free"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-sky-500 px-4 py-2.5 text-xs font-semibold text-slate-950 shadow-lg transition-colors hover:bg-sky-400"
          >
            Get the Sunday issue <span aria-hidden="true">→</span>
          </Link>
        </article>

        <article className="flex flex-col gap-4 rounded-2xl border border-emerald-500/20 bg-slate-950/40 p-6">
          <div className="space-y-2">
            <span className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-200">
              Move faster
            </span>
            <h3 className="text-lg font-bold text-gray-100">
              If a live question is already getting expensive
            </h3>
          </div>
          <p className="text-sm leading-relaxed text-gray-300">
            Use the 24-hour lane when you need a sharper read now. This is for
            the week when five names are no longer enough and you need the next
            shortlist while the timing still matters.
          </p>
          <div className="mt-auto space-y-1.5 border-t border-slate-800/80 pt-3 text-xs text-gray-400">
            <p className="font-semibold uppercase tracking-[0.12em] text-gray-500">
              Best first step
            </p>
            <p className="text-gray-200">First Look</p>
          </div>
          <Link
            href="/firstlook"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-slate-950 shadow-lg transition-colors hover:bg-emerald-400"
          >
            Get a faster read <span aria-hidden="true">→</span>
          </Link>
        </article>

        <article className="flex flex-col gap-4 rounded-2xl border border-violet-500/20 bg-slate-950/40 p-6">
          <div className="space-y-2">
            <span className="inline-flex items-center rounded-full border border-violet-400/30 bg-violet-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-violet-200">
              Reuse the method
            </span>
            <h3 className="text-lg font-bold text-gray-100">
              If you need a workflow your team can defend
            </h3>
          </div>
          <p className="text-sm leading-relaxed text-gray-300">
            Start with the paper and buyer&apos;s guide when trust, repeatability,
            or internal sign-off matters more than speed. You get the logic, the
            thresholds, and the proof before you commit to a recurring lane.
          </p>
          <div className="mt-auto space-y-1.5 border-t border-slate-800/80 pt-3 text-xs text-gray-400">
            <p className="font-semibold uppercase tracking-[0.12em] text-gray-500">
              Best first step
            </p>
            <p className="text-gray-200">Methodology + buyer&apos;s guide</p>
          </div>
          <Link
            href="/buyers-guide"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-500 px-4 py-2.5 text-xs font-semibold text-slate-950 shadow-lg transition-colors hover:bg-violet-400"
          >
            See how to verify it <span aria-hidden="true">→</span>
          </Link>
        </article>
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
                You sit in corp-dev, PE, or as a non-engineer tech VP — you
                evaluate companies for a living, don&rsquo;t read code
                yourself, and want the engineering signal in plain business
                English.
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
                  href="/walkthrough"
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
              <strong className="text-amber-300">If you never had to</strong>{" "}
              read a line of code, hire a quant, or chase a warm intro — and the
              signal still found the founders before consensus did, would{" "}
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
        <TrialClose tone="violet">
          A free rung, a €7 rung, a €9.97/mo rung, all the way up to a
          €49,997/yr rung. If even one of those fits where you actually
          are — would you let the right rung pick itself?
        </TrialClose>
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

      {/* Priority link graph — commercial, proof, and live-now routes get
          explicit homepage support so crawl pressure matches sitemap priority. */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {PRIORITY_LINK_BLOCKS.map((block) => (
          <section
            key={block.title}
            className="rounded-xl border border-slate-800 bg-slate-900/70 p-5"
            aria-label={block.title}
          >
            <h2 className="text-gray-100 font-semibold text-lg mb-2">{block.title}</h2>
            <p className="text-gray-400 text-xs leading-relaxed mb-4">{block.sub}</p>
            <div className="grid grid-cols-2 gap-2">
              {block.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-gray-300 hover:border-sky-600/50 hover:bg-slate-800/60 hover:text-sky-300 transition-all"
                >
                  <span className="mr-2" aria-hidden="true">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

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
          {/* Cap homepage to a curated 12 (4×3) to keep DOM under Lighthouse's
              ~1,500-node "excessive DOM size" threshold; the "All comparisons →"
              hub link + sitemap retain full crawl/link equity to all entries. */}
          {comparisons.slice(0, 12).map((comp) => (
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

      {/* Brunson DCS Ch 7 — Attractive Character signoff at page-end. Upgraded
          default → "long" (2026-06-01) to give the Charismatic Leader more
          presence at the final CTA: the medium first-person bio + a
          catchphrase, so the page closes on a voice, not a logo. Counters the
          "anonymity leaves AC-driven conversion on the table" dock while
          staying anonymity-safe (sigma sigil, no face/name/voice). Links to
          /data-nerd character bible and /about/founder backstory. */}
      <DataNerdSignoff variant="long" />

    </div>
    </>
  );
}
