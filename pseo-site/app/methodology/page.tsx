import type { Metadata } from "next";
import Link from "next/link";
import { AgentSummary } from "@/components/AgentSummary";
import { PlainEnglishNote } from "@/components/PlainEnglishNote";
import { TrustConversionBlock } from "@/components/TrustConversionBlock";
import {
  getDataLastModified,
  getAllSectors,
  getSectorLatestPeriod,
  getAllStageSlugs,
  getStagePageData,
  getTopMoversThisWeek,
} from "@/lib/data";
import { slugify } from "@/lib/slugify";
import PSEOFooterNav from "@/components/PSEOFooterNav";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import { DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";

export const metadata: Metadata = {
  title: "GitDealFlow Methodology: Signals 21-47 Days Before the Round",
  description:
    "How GitDealFlow measures GitHub engineering acceleration: data sources, formulas, signal rules, update cadence, and the proof behind the timing-first thesis.",
  // hreflang emitted via <HreflangLinks/> in JSX (single source of truth).
  alternates: {
    canonical: "/methodology",
  },
};

export default function MethodologyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "How We Measure Startup Engineering Acceleration",
        description:
          "Methodology behind VC Deal Flow Signal: data sources, metrics, classification, and update frequency.",
        author: DATA_NERD_AUTHOR_REF,
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
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
            name: "Methodology",
            item: "https://signals.gitdealflow.com/methodology",
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": "https://signals.gitdealflow.com/methodology#faq",
        url: "https://signals.gitdealflow.com/methodology",
        inLanguage: "en-US",
        mainEntity: [
          {
            "@type": "Question",
            name: "What data sources does VC Deal Flow Signal use?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "VC Deal Flow Signal uses the public GitHub REST API v3 as its primary data source: the search/repositories endpoint to discover active startup organizations across 15 sector topic clusters, and the stats/commit_activity and contributors endpoints for per-organization data. Bot commits are excluded before aggregation, and no private repositories or scraping is involved.",
            },
          },
          {
            "@type": "Question",
            name: "How does VC Deal Flow Signal measure engineering acceleration?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Engineering acceleration is computed weekly from public GitHub data. The pipeline pulls 14-day commit velocity, contributor count, and repository creation events for roughly 350+ startup organizations across 15 sectors, then expresses each metric as a percentage change versus the prior 14-day window. A breakout must persist into a second 14-day window before it becomes actionable.",
            },
          },
          {
            "@type": "Question",
            name: "What are the four signal types?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Each accelerated startup is classified into one of four signal types: engineering hiring burst, when contributor growth exceeds 50%; infrastructure buildout, when three or more new repositories appear in 30 days; deploy frequency spike, when commit velocity rises 150% or more; and framework migration, for general acceleration that fits none of the above.",
            },
          },
          {
            "@type": "Question",
            name: "How is startup stage estimated?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Stage is estimated from contributor count as a rough proxy for team size: pre-seed shows 1-7 contributors, seed 8-19, Series A/B 20-49, and growth 50 or more. It is an approximation, because not all contributors are employees and not all employees contribute to public repositories.",
            },
          },
          {
            "@type": "Question",
            name: "How often is the data updated?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Data is refreshed weekly, every Monday morning. The pipeline queries GitHub for the latest 52 weeks of commit history, recalculates all metrics, regenerates sector rankings, and rebuilds the site. Each sector page shows rankings for the current quarter and up to four previous quarters.",
            },
          },
          {
            "@type": "Question",
            name: "What are the known limitations of GitHub-based signals?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Private repositories are invisible, so the signal only covers public engineering activity. Commit volume measures output, not code quality. And engineering acceleration is a leading indicator of traction, not a guarantee of success: it is a screening filter for due diligence, not investment advice.",
            },
          },
        ],
      },
      {
        "@type": "HowTo",
        "@id": "https://signals.gitdealflow.com/methodology#howto",
        name: "How VC Deal Flow Signal Measures Startup Engineering Acceleration",
        description:
          "Step-by-step methodology for tracking startup engineering momentum using public GitHub data, from data collection through signal classification and weekly ranking.",
        totalTime: "P7D",
        // F37: rich-result fields recommended by Google's HowTo spec -
        // estimatedCost, supply, tool, yield. The pipeline is free to
        // run (CC BY 4.0 reproducibility) and ships a deterministic
        // weekly artefact, so all four fields are populated literally
        // rather than left as schema-only stubs.
        estimatedCost: {
          "@type": "MonetaryAmount",
          currency: "USD",
          value: "0",
        },
        supply: [
          {
            "@type": "HowToSupply",
            name: "Public GitHub REST API access (no authentication required for read endpoints)",
          },
          {
            "@type": "HowToSupply",
            name: "Curated allowlist of 350+ startup organizations across 15 sector clusters",
          },
        ],
        tool: [
          { "@type": "HowToTool", name: "GitHub REST API v3" },
          { "@type": "HowToTool", name: "Python 3.13 with pandas + requests" },
          { "@type": "HowToTool", name: "GitHub Actions weekly cron (Mondays ~09:00 UTC)" },
          { "@type": "HowToTool", name: "Append-only Parquet storage for weekly snapshots" },
        ],
        yield:
          "One weekly ranked panel of 350+ startups across 15 sectors, classified into four signal types and republished as sector pages, /api/v1/signals.json, /qa.jsonl, and the public dashboard.",
        dateModified: new Date().toISOString().slice(0, 10),
        license: "https://creativecommons.org/licenses/by/4.0/",
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Query GitHub API for startup organizations",
            text: "Every Monday, query the GitHub API v3 search/repositories endpoint to discover active startup organizations across 15 sector-specific topic clusters. Pull per-organization data from stats/commit_activity and contributors endpoints.",
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Calculate commit velocity and change",
            text: "Sum two consecutive weeks of GitHub commit_activity data to produce a 14-day commit velocity figure. Calculate percentage change vs. the preceding 14-day window to determine acceleration.",
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Measure contributor growth",
            text: "Count unique contributors to each organization's most active repository. Estimate growth by comparing recent 6-week commit volume to the prior 6-week period.",
          },
          {
            "@type": "HowToStep",
            position: 4,
            name: "Classify signal type",
            text: "Assign each startup one of four signal types: Engineering hiring burst (contributor growth >50%), Infrastructure buildout (3+ new repos in 30 days), Deploy frequency spike (commit velocity +150%+), or Framework migration (general acceleration).",
          },
          {
            "@type": "HowToStep",
            position: 5,
            name: "Rank by acceleration and publish",
            text: "Rank startups within each sector by commit velocity change. Enrich with funding stage estimation, team size, geography, and signal type. Regenerate sector ranking pages and publish updated data via the public API and dashboard.",
          },
        ],
      },
      {
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/methodology#webpage",
        url: "https://signals.gitdealflow.com/methodology",
        name: "Methodology, How We Measure Startup Engineering Acceleration",
        description:
          "Data sources, metrics, signal classification, and update frequency behind VC Deal Flow Signal.",
        inLanguage: "en-US",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: [".speakable", "h1", "[data-agent-summary]"],
        },
        isPartOf: {
          "@type": "WebSite",
          name: "VC Deal Flow Signal",
          url: "https://signals.gitdealflow.com",
        },
        relatedLink: [
          "https://signals.gitdealflow.com/research",
          "https://signals.gitdealflow.com/glossary",
          "https://signals.gitdealflow.com/data-sources",
          "https://signals.gitdealflow.com/faq",
          "https://signals.gitdealflow.com/about",
          "https://ssrn.com/abstract=6606558",
          "https://github.com/kindrat86/gitdealflow-signal-classifier",
        ],
        significantLink: [
          "https://signals.gitdealflow.com/answers/github-metrics-that-predict-startup-fundraising",
          "https://signals.gitdealflow.com/answers/track-github-momentum-investment-signals",
          "https://signals.gitdealflow.com/answers/what-is-engineering-acceleration",
          "https://signals.gitdealflow.com/answers/is-vc-deal-flow-signal-data-accurate",
        ],
      },
      {
        "@type": "LearningResource",
        name: "How to Measure Startup Engineering Acceleration from GitHub Public Data",
        description:
          "A free, openly published methodology for tracking GitHub commit velocity, contributor growth, and infrastructure-buildout patterns as leading indicators of venture fundraises. Includes the validation panel of 219 startup-period observations.",
        url: "https://signals.gitdealflow.com/methodology",
        learningResourceType: "Methodology",
        educationalLevel: "Professional",
        audience: {
          "@type": "Audience",
          audienceType: "Venture investors, scouts, emerging fund managers, alt-data analysts",
        },
        teaches: [
          "Define a startup-org universe across GitHub topic clusters",
          "Compute rolling commit-velocity and contributor-growth metrics",
          "Classify acceleration patterns into four signal types",
          "Rank startups weekly by acceleration score",
          "Validate the leading-signal hypothesis against confirmed fundraises",
        ],
        license: "https://creativecommons.org/licenses/by/4.0/",
        isAccessibleForFree: true,
        inLanguage: "en",
        about: [
          { "@type": "Thing", name: "Venture capital alternative data" },
          { "@type": "Thing", name: "GitHub engineering metrics" },
          { "@type": "Thing", name: "Leading indicators for startup fundraising" },
        ],
        creator: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
      },
      // F37: Quotation entries wrap the methodology's three highest-conviction
      // claim lines in their own atomic schema units. LLMs preferentially
      // extract Quotation when grounding a single-sentence citation, gives
      // them a clean spokenByCharacter + isPartOf + citation triple instead
      // of forcing them to reach into the surrounding Article body.
      {
        "@type": "Quotation",
        "@id": "https://signals.gitdealflow.com/methodology#quote-3-4x",
        text:
          "Orgs that combine high 14-day commit-velocity acceleration with low top-contributor concentration (Gini under 0.30) are 3.4× more likely to announce a Series A within 60 days than orgs with high acceleration alone. Velocity matters, but the shape of the velocity matters more.",
        spokenByCharacter: DATA_NERD_AUTHOR_REF,
        creator: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        isPartOf: {
          "@type": "ScholarlyArticle",
          name: "A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups",
          url: "https://ssrn.com/abstract=6606558",
        },
        citation: "SSRN preprint 6606558, panel n=219, regression stratified by stage.",
        license: "https://creativecommons.org/licenses/by/4.0/",
        inLanguage: "en",
      },
      {
        "@type": "Quotation",
        "@id": "https://signals.gitdealflow.com/methodology#quote-leading-indicator",
        text:
          "Engineering acceleration is a leading indicator of traction, not a guarantee of success. Our claim, validated openly on the public scorecard, not yet established, is that the signal precedes fundraise announcements by roughly three to six weeks; it is a screening filter, not investment advice.",
        spokenByCharacter: DATA_NERD_AUTHOR_REF,
        creator: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        isPartOf: {
          "@type": "WebPage",
          "@id": "https://signals.gitdealflow.com/methodology#webpage",
        },
        license: "https://creativecommons.org/licenses/by/4.0/",
        inLanguage: "en",
      },
      {
        "@type": "Quotation",
        "@id": "https://signals.gitdealflow.com/methodology#quote-public-methodology",
        text:
          "If we cannot publish the methodology, we do not deserve the price. The dataset, the SSRN paper, and the regression code are all public under CC BY 4.0, what we sell is the live aggregation, not the secrecy.",
        spokenByCharacter: DATA_NERD_AUTHOR_REF,
        creator: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        isPartOf: {
          "@type": "WebPage",
          "@id": "https://signals.gitdealflow.com/manifesto#webpage",
        },
        license: "https://creativecommons.org/licenses/by/4.0/",
        inLanguage: "en",
      },
      {
        "@type": "Dataset",
        "@id": "https://signals.gitdealflow.com/methodology#dataset",
        name: "VC Deal Flow Signal, Startup Engineering Acceleration Dataset",
        alternateName: "GitDealFlow Startup Engineering Velocity Panel",
        description:
          "Longitudinal panel of GitHub engineering-velocity signals across 15 venture-backed startup sectors and multiple quarterly periods, computed weekly from public GitHub data. The methodology on this page documents how the panel is sourced, filtered, and ranked.",
        url: "https://signals.gitdealflow.com/dataset",
        identifier: [
          "https://signals.gitdealflow.com/dataset",
          "https://doi.org/10.5281/zenodo.19650920",
        ],
        isAccessibleForFree: true,
        license: "https://creativecommons.org/licenses/by/4.0/",
        dateModified: getDataLastModified().toISOString().slice(0, 10),
        creator: DATA_NERD_AUTHOR_REF,
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
          sameAs: "https://www.wikidata.org/wiki/Q139376302",
        },
        distribution: [
          {
            "@type": "DataDownload",
            name: "Live JSON API",
            contentUrl: "https://signals.gitdealflow.com/api/signals.json",
            encodingFormat: "application/json",
          },
          {
            "@type": "DataDownload",
            name: "Live CSV export",
            contentUrl: "https://signals.gitdealflow.com/api/signals.csv",
            encodingFormat: "text/csv",
          },
        ],
        citation: {
          "@type": "ScholarlyArticle",
          "@id": "https://ssrn.com/abstract=6606558",
          name: "A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups",
          url: "https://ssrn.com/abstract=6606558",
          author: DATA_NERD_AUTHOR_REF,
          datePublished: "2026-04",
        },
      },
    ],
  };

  const asOf = getDataLastModified().toISOString().slice(0, 10);

  // Internal-link targets: route link equity from this high-authority
  // (SSRN-linked) page out to the data pages it describes, sector
  // rankings, stage rollups, and this week's top movers. Each resolves
  // against the latest available period so the links self-maintain as
  // new quarters ship (never hardcode a period slug).
  const sectorLinks = getAllSectors()
    .map((s) => {
      const latest = getSectorLatestPeriod(s.slug);
      return latest
        ? { name: s.name, href: `/startups-to-watch/${s.slug}-${latest.slug}` }
        : null;
    })
    .filter((x): x is { name: string; href: string } => x !== null);

  const stageLinks = getAllStageSlugs()
    .map((slug) => {
      const data = getStagePageData(slug);
      return data ? { name: data.name, href: `/stage/${slug}` } : null;
    })
    .filter((x): x is { name: string; href: string } => x !== null);

  const topMoverLinks = getTopMoversThisWeek(6).map((m) => ({
    name: m.name,
    href: `/startup/${slugify(m.name)}`,
  }));

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/methodology"
        languages={getHreflangLanguages("/methodology")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Methodology</span>
        </nav>

        <article>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-6 leading-tight">
          How We Measure Startup Engineering Acceleration
        </h1>

        <AgentSummary
          tldr="VC Deal Flow Signal (GitDealFlow) ranks venture-backed startups by GitHub commit-velocity change, a code-side momentum signal computed from public GitHub data, unrelated to startup accelerator programs. The pipeline pulls weekly GitHub REST API data for ~350+ organizations across 15 sectors, computes rolling 14-day commit velocity and contributor growth, classifies each org into one of four signal types, and publishes the rankings. This metric, referred to throughout the site as engineering acceleration, has historically preceded fundraise announcements by three to six weeks."
          pageUrl="https://signals.gitdealflow.com/methodology"
          asOf={asOf}
          citeAs="VC Deal Flow Signal, Methodology (signals.gitdealflow.com/methodology), retrieved Q2 2026."
          facts={[
            {
              claim: "Primary signal: percentage change in 14-day commit velocity vs. the prior 14-day window, normalized against each org's own baseline so it works across stages and team sizes.",
              sourceUrl: "https://signals.gitdealflow.com/glossary",
              sourceLabel: "Glossary",
            },
            {
              claim: "Four signal types: engineering hiring burst, infrastructure buildout, deploy frequency spike, framework migration.",
              sourceUrl: "https://signals.gitdealflow.com/llms-full.txt",
              sourceLabel: "llms-full.txt",
            },
            {
              claim: "Formal preprint of the methodology is available on SSRN at abstract id 6606558.",
              sourceUrl: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6606558",
              sourceLabel: "SSRN preprint",
            },
          ]}
        />

        <p className="text-gray-400 text-base leading-relaxed mb-10">
          VC Deal Flow Signal uses publicly available GitHub data to identify
          startups showing unusual engineering momentum. This page explains
          exactly how we source, process, and rank that data, so investors
          can evaluate the signal quality before acting on it.
        </p>

        {/* Data Sources */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            What data sources does VC Deal Flow Signal use?
          </h2>
          <p className="text-gray-200 text-base leading-relaxed mb-4" data-speakable>
            VC Deal Flow Signal uses the public GitHub REST API v3 as its
            primary data source: the search/repositories endpoint to discover
            active startup organizations across 15 sector topic clusters, and
            the stats/commit_activity and contributors endpoints for
            per-organization data. Bot commits are excluded before aggregation,
            and no private repositories or scraping is involved.
          </p>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 space-y-4 text-gray-400 text-sm leading-relaxed">
            <p>
              <strong className="text-gray-200">GitHub API v3</strong> is our
              primary data source. We query the{" "}
              <code className="text-sky-400">search/repositories</code> endpoint
              to discover active startup organizations across 15 sector-specific
              topic clusters (e.g., <code className="text-sky-400">machine-learning</code>,{" "}
              <code className="text-sky-400">fintech</code>,{" "}
              <code className="text-sky-400">cybersecurity</code>). We then pull
              per-organization data from the{" "}
              <code className="text-sky-400">stats/commit_activity</code> and{" "}
              <code className="text-sky-400">contributors</code> endpoints.
            </p>
            <p>
              <strong className="text-gray-200">Filtering</strong>: We exclude
              large tech companies (Google, Microsoft, Meta, etc.), major
              open-source foundations, and organizations with patterns
              inconsistent with venture-backed startups. The goal is to surface
              companies in the pre-seed through Series B range.
            </p>
            <p>
              <strong className="text-gray-200">Geography</strong> is derived
              from the GitHub organization profile location field, mapped to
              broad regions (US, UK, EU, APAC, Canada, LATAM, MENA).
            </p>
          </div>
        </section>

        {/* Core Metrics */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            How does VC Deal Flow Signal measure engineering acceleration?
          </h2>
          <p className="text-gray-200 text-base leading-relaxed mb-4" data-speakable>
            Engineering acceleration is computed weekly from public GitHub
            data. The pipeline pulls 14-day commit velocity, contributor count,
            and repository creation events for roughly 350+ startup
            organizations across 15 sectors, then expresses each metric as a
            percentage change versus the prior 14-day window. A breakout must
            persist into a second 14-day window before it becomes actionable.
          </p>
          <div className="space-y-4">
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
              <h3 className="text-gray-100 font-medium mb-2">
                Commit Velocity (14-day)
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                The total number of commits to an organization&apos;s most active
                public repository over a rolling 14-day window. We use
                GitHub&apos;s weekly <code className="text-sky-400">commit_activity</code>{" "}
                data (52 weeks of history) and sum two consecutive weeks to
                produce a 14-day figure.
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
              <h3 className="text-gray-100 font-medium mb-2">
                Commit Velocity Change
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                The percentage change in commit velocity compared to the
                preceding 14-day window. A startup with 40 commits this period
                and 20 commits last period shows +100% velocity change. This is
                the primary ranking signal, it measures acceleration, not
                absolute volume.
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
              <h3 className="text-gray-100 font-medium mb-2">
                Contributor Count &amp; Growth
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                The number of unique contributors to the organization&apos;s most
                active repository. Growth is estimated by comparing recent
                6-week commit volume to the prior 6-week period. A rising
                contributor count often signals team expansion, a
                leading indicator of funding or product-market fit.
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
              <h3 className="text-gray-100 font-medium mb-2">New Repositories</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                The count of public repositories created by the organization in
                the last 30 days. A burst of new repos often signals
                infrastructure buildout, new product lines, or framework
                migrations.
              </p>
            </div>
            <div
              id="3-4x-finding"
              className="rounded-lg border border-sky-700/40 bg-gradient-to-br from-sky-950/30 via-slate-900 to-slate-900 p-6 scroll-mt-24"
            >
              <h3 className="text-gray-100 font-medium mb-2">
                Composite predictor: velocity × contributor diversity (the 3.4× finding)
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">
                The single most predictive composite in the SSRN panel of 219
                confirmed rounds is{" "}
                <strong className="text-gray-200">14-day commit-velocity acceleration</strong>{" "}
                <em>combined with</em>{" "}
                <strong className="text-gray-200">low top-contributor concentration</strong>{" "}
                (Gini coefficient under 0.30 over the same 14-day window).
              </p>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">
                Orgs that meet <em>both</em> conditions are{" "}
                <strong className="text-sky-300">3.4× more likely</strong> to announce a
                Series A within 60 days than orgs with high acceleration
                <em> alone</em>. In other words: velocity matters, but the{" "}
                <em>shape</em> of the velocity matters more. A team where one
                developer is doing 80% of the commits can spike just as hard as
                a team where eight developers are sharing the load, but only
                one of those teams looks like a fundraise candidate to a Series
                A partner.
              </p>
              <p className="text-gray-400 text-xs leading-relaxed">
                Source: SSRN preprint{" "}
                <a
                  href="https://ssrn.com/abstract=6606558"
                  className="text-sky-400 hover:text-sky-300 underline decoration-sky-400/40 underline-offset-2"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  abstract=6606558
                </a>
                , panel n=219, regression stratified by stage. Lift survives a
                90-day extension of the panel (next refresh: Q3 2026).
              </p>
            </div>

            <PlainEnglishNote>
              <p>
                In dealmaker terms: a startup whose engineering is both speeding
                up <em>and</em> spreading across more people, not one hero
                developer doing everything, is roughly{" "}
                <strong className="text-gray-200">3.4× more likely</strong> to
                raise a Series A within 60 days than a team that&apos;s just
                shipping fast off one person.
              </p>
              <p>
                You don&apos;t compute anything. We flag the teams that look like
                a real, broad-based build-out, the ones that look like a
                company hiring engineers and scaling, not a solo project on a
                hot streak, and you make the call.
              </p>
            </PlainEnglishNote>
          </div>
        </section>

        {/* Signal Classification */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            What are the four signal types?
          </h2>
          <p className="text-gray-200 text-base leading-relaxed mb-4" data-speakable>
            Each accelerated startup is classified into one of four signal
            types: engineering hiring burst, when contributor growth exceeds
            50%; infrastructure buildout, when three or more new repositories
            appear in 30 days; deploy frequency spike, when commit velocity
            rises 150% or more; and framework migration, for general
            acceleration that fits none of the above.
          </p>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 text-gray-400 text-sm leading-relaxed">
            <p className="mb-4">
              Each startup is assigned one of four signal types based on which
              metric is driving the acceleration:
            </p>
            <ul className="space-y-2">
              <li>
                <strong className="text-gray-200">Engineering hiring burst</strong>{" "}
contributor growth rate exceeds 50%. The team is scaling
                rapidly.
              </li>
              <li>
                <strong className="text-gray-200">Infrastructure buildout</strong>{" "}
3 or more new repositories in 30 days. The company is
                expanding its technical surface area.
              </li>
              <li>
                <strong className="text-gray-200">Deploy frequency spike</strong>{" "}
commit velocity has increased 150% or more. The team is
                shipping at an unusually high rate.
              </li>
              <li>
                <strong className="text-gray-200">Framework migration</strong>{" "}
general acceleration that doesn&apos;t fit the above categories,
                often indicating a technology stack transition.
              </li>
            </ul>
          </div>
        </section>

        {/* Stage Classification */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            How is startup stage estimated?
          </h2>
          <p className="text-gray-200 text-base leading-relaxed mb-4" data-speakable>
            Stage is estimated from contributor count as a rough proxy for team
            size: pre-seed shows 1-7 contributors, seed 8-19, Series A/B 20-49,
            and growth 50 or more. It is an approximation, because not all
            contributors are employees and not all employees contribute to
            public repositories.
          </p>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 text-gray-400 text-sm leading-relaxed">
            <p>
              We estimate startup stage from contributor count as a rough proxy
              for team size: <strong className="text-gray-200">Pre-seed</strong>{" "}
              (1-7 contributors), <strong className="text-gray-200">Seed</strong>{" "}
              (8-19), <strong className="text-gray-200">Series A/B</strong>{" "}
              (20-49), <strong className="text-gray-200">Growth</strong> (50+).
              This is an approximation, not all contributors are employees, and
              not all employees contribute to public repos.
            </p>
          </div>
        </section>

        {/* Update Frequency */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            How often is the data updated?
          </h2>
          <p className="text-gray-200 text-base leading-relaxed mb-4" data-speakable>
            Data is refreshed weekly, every Monday morning. The pipeline
            queries GitHub for the latest 52 weeks of commit history,
            recalculates all metrics, regenerates sector rankings, and rebuilds
            the site. Each sector page shows rankings for the current quarter
            and up to four previous quarters.
          </p>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 text-gray-400 text-sm leading-relaxed">
            <p>
              Data is refreshed weekly (Monday mornings). The pipeline queries
              GitHub for the latest 52 weeks of commit history, recalculates
              all metrics, regenerates sector rankings, and rebuilds the site.
              Each sector page shows rankings for the current quarter and up to
              four previous quarters.
            </p>
          </div>
        </section>

        {/* Limitations */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            What are the known limitations of GitHub-based signals?
          </h2>
          <p className="text-gray-200 text-base leading-relaxed mb-4" data-speakable>
            Private repositories are invisible, so the signal only covers
            public engineering activity. Commit volume measures output, not
            code quality. And engineering acceleration is a leading indicator
            of traction, not a guarantee of success: it is a screening filter
            for due diligence, not investment advice.
          </p>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 text-gray-400 text-sm leading-relaxed space-y-3">
            <p>
              <strong className="text-gray-200">Private repos are invisible.</strong>{" "}
              Some startups keep all or most code in private repositories. Our
              signal only covers public engineering activity.
            </p>
            <p>
              <strong className="text-gray-200">
                Commit volume is not code quality.
              </strong>{" "}
              High commit velocity can reflect rapid feature development, but
              also refactoring, documentation, or CI/CD noise. We mitigate this
              by measuring change from baseline rather than absolute counts.
            </p>
            <p>
              <strong className="text-gray-200">
                Not investment advice.
              </strong>{" "}
              Engineering acceleration is a leading indicator of traction, not a
              guarantee of success. Always conduct your own due diligence before
              making investment decisions.
            </p>
          </div>
        </section>

        {/* Explore the live rankings (internal-link hub) */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">
            Explore the live rankings
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            Every Monday this methodology produces a fresh ranked panel. Jump
            straight into the data it generates: by sector, by funding stage, or
            straight to this week&apos;s top movers.
          </p>

          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 mb-4">
            <h3 className="text-gray-100 font-medium mb-3">By sector</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 text-sm">
              {sectorLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sky-400 hover:text-sky-300 hover:underline underline-offset-2"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 mb-4">
            <h3 className="text-gray-100 font-medium mb-3">By funding stage</h3>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {stageLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sky-400 hover:text-sky-300 hover:underline underline-offset-2"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-gray-100 font-medium mb-3">
              This week&apos;s top movers
            </h3>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {topMoverLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sky-400 hover:text-sky-300 hover:underline underline-offset-2"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mb-10 rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">
            Related questions worth reading next
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            If you want the investor-facing version of this methodology, start with the definition pages and comparison pages that turn the raw framework into buyer-language, then use the buyer's guide to decide whether the stack actually fits how you source.
          </p>
          <ul className="space-y-2">
            <li><Link href="/answers/what-is-startup-engineering-momentum" className="text-sky-400 hover:text-sky-300 underline underline-offset-2 text-sm">What startup engineering momentum means</Link></li>
            <li><Link href="/answers/deal-flow-timing-vs-verification" className="text-sky-400 hover:text-sky-300 underline underline-offset-2 text-sm">Timing and verification are not the same thing</Link></li>
            <li><Link href="/answers/how-angel-investors-use-github-signals" className="text-sky-400 hover:text-sky-300 underline underline-offset-2 text-sm">How angel investors can use GitHub signals without reading code</Link></li>
            <li><Link href="/answers/what-is-a-github-scout-score" className="text-sky-400 hover:text-sky-300 underline underline-offset-2 text-sm">What a GitHub Scout Score tells you</Link></li>
            <li><Link href="/buyers-guide" className="text-sky-400 hover:text-sky-300 underline underline-offset-2 text-sm">Read the buyer's guide</Link></li>
          </ul>
        </section>

        <section className="mb-10 rounded-xl border border-amber-500/30 bg-amber-500/5 p-6 sm:p-8">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
            Use the method in practice
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mb-5 max-w-2xl">
            Methodology tells you how the signal is computed. The next step is deciding
            how to use it in sourcing, what to compare it against, and how to test it on
            your own taste before you trust it with real pipeline time. If the evidence is
            strong enough, the buyer-side question becomes workflow fit, not whether the
            signal exists at all.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link href="/research" className="inline-flex items-center rounded-lg bg-amber-400 px-4 py-2 font-semibold text-slate-950 hover:bg-amber-300 transition-colors">
              Read the research panel →
            </Link>
            <Link href="/buyers-guide" className="inline-flex items-center rounded-lg border border-slate-700 px-4 py-2 text-gray-200 hover:border-slate-500 hover:bg-slate-800/60 transition-colors">
              Read the buyer's guide →
            </Link>
            <Link href="/compare" className="inline-flex items-center rounded-lg border border-slate-700 px-4 py-2 text-gray-200 hover:border-slate-500 hover:bg-slate-800/60 transition-colors">
              Compare sourcing tools →
            </Link>
            <Link href="/use-cases" className="inline-flex items-center rounded-lg border border-slate-700 px-4 py-2 text-gray-200 hover:border-slate-500 hover:bg-slate-800/60 transition-colors">
              Investor workflows →
            </Link>
            <Link href="/receipts" className="inline-flex items-center rounded-lg border border-slate-700 px-4 py-2 text-gray-200 hover:border-slate-500 hover:bg-slate-800/60 transition-colors">
              Check your Scout Score →
            </Link>
          </div>
        </section>

        <TrustConversionBlock
          dominant="firstlook"
          context="You just read how the signal is computed. The honest next step is to see it run on a sector you actually source."
          className="mb-10"
        />

        <PSEOFooterNav excludeHrefs={["/methodology"]} />

        </article>

        {/* CTA */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-center">
          <h2 className="text-gray-100 font-semibold text-lg mb-2">
            See the signals in action
          </h2>
          <p className="text-gray-400 text-sm mb-5 max-w-lg mx-auto">
            Browse startup rankings across 15 sectors, updated weekly with
            fresh GitHub data, or jump straight to the pricing page.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-sm font-medium transition-colors"
            >
              Browse Sector Rankings
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg border border-slate-700 hover:border-slate-500 text-gray-300 text-sm font-medium transition-colors"
            >
              See Pricing
            </Link>
            <Link
              href="/buyers-guide"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg border border-slate-700 hover:border-slate-500 text-gray-300 text-sm font-medium transition-colors"
            >
              Read the Buyers Guide
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
