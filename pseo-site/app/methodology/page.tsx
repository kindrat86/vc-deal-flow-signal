import type { Metadata } from "next";
import Link from "next/link";
import { AgentSummary } from "@/components/AgentSummary";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import { getDataLastModified } from "@/lib/data";
import PSEOFooterNav from "@/components/PSEOFooterNav";

export const metadata: Metadata = {
  title: "Methodology — How We Measure Startup Engineering Acceleration",
  description:
    "How VC Deal Flow Signal measures GitHub engineering acceleration: data sources, commit velocity calculation, contributor growth metrics, signal classification, and update frequency.",
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
        author: {
          "@type": "Person",
          name: "The Data Nerd",
          url: "https://signals.gitdealflow.com/about",
          jobTitle: "Founder, VC Deal Flow Signal",
        },
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
        mainEntity: [
          {
            "@type": "Question",
            name: "How does VC Deal Flow Signal measure engineering acceleration?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Engineering acceleration is computed weekly from public GitHub data. The pipeline pulls 14-day commit velocity, contributor count, and repository creation events for approximately 4,200 startup organizations across 20 sectors via the GitHub REST API, then expresses each metric as a percentage change versus the prior 14-day window. A startup whose 14-day commit velocity doubles relative to its own baseline is recorded as +100% acceleration. The metric is computed per organization against its own historical baseline, not across the population.",
            },
          },
          {
            "@type": "Question",
            name: "What data sources are used in the methodology?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The primary source is the public GitHub REST API v3 — search/repositories, stats/commit_activity, contributors, and repos endpoints. No private repositories, no scraping, no terms-of-service violations. The methodology excludes commits authored by accounts matching common bot patterns (Dependabot, Renovate, GitHub Actions) and applies file-count filtering to remove trivial commits. The full data sources page lists every endpoint and refresh cadence.",
            },
          },
          {
            "@type": "Question",
            name: "Why use a 14-day rolling window?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Investor signal pipelines tend to use either 14-day or 28-day rolling windows. The 14-day window is more responsive — it surfaces breakouts faster — at the cost of higher volatility. To filter the resulting noise, the methodology requires a breakout to persist into a second 14-day window before it is treated as actionable. This two-period confirmation rule removes most one-period spikes caused by hackathons, launch sprints, or single contributors onboarding.",
            },
          },
          {
            "@type": "Question",
            name: "How are bot commits filtered out?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Commits authored by accounts whose name or type matches known bot patterns (bot, github-actions, dependabot, renovate) are excluded before any aggregation. A second filter removes commits with diffs below a small file-count threshold to suppress automated formatting and dependency-update commits. The combination removes the loudest noise sources without overfitting; further normalization can be added but is rarely worth the engineering cost.",
            },
          },
          {
            "@type": "Question",
            name: "What are the four signal types?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Acceleration patterns sort into four operational types. The hiring burst is rising velocity plus rising contributor count — the strongest fundraise predictor. The shipping sprint is velocity rising while contributor count holds flat — typical of launch preparation. The infrastructure buildout is repository creation accelerating versus baseline — strategic technical investment. The platform migration is language mix shifting between primary languages over a quarter — slower-moving but strategically significant. Each pattern implies a different diligence question.",
            },
          },
          {
            "@type": "Question",
            name: "How is funding stage estimated?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Funding stage is estimated heuristically from contributor count, repository age, language mix maturity, and any cross-referenced public funding history. Pre-seed teams typically have 1 to 3 contributors and codebases under six months old; seed teams have 3 to 8 contributors with sustained activity over several quarters; Series A teams have 8 to 20 contributors with multiple repositories and mature language mixes. The estimate is heuristic and is intended as a screening filter, not a definitive label.",
            },
          },
          {
            "@type": "Question",
            name: "Is the methodology peer-reviewed?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The methodology write-up is published on SSRN at ssrn.com/abstract=6606558 and mirrored on Zenodo with a DOI. The dataset is auto-indexed by OpenAlex (W7154916891) and DataCite. The work is not formally peer reviewed in a journal but is openly published and reproducible. Investors evaluating the signal can audit the full methodology and replicate the metrics from the same public GitHub data described in the paper.",
            },
          },
          {
            "@type": "Question",
            name: "How often is the data refreshed?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The full panel refreshes weekly. Each Monday the pipeline pulls the latest 14-day GitHub activity, recomputes acceleration metrics, classifies signal patterns, and republishes the sector rankings, the API endpoints, and the dashboard. The free Signal Report email is sent the same morning. Intraday changes do not affect rankings — the cadence is intentionally weekly to match how investors review pipelines.",
            },
          },
          {
            "@type": "Question",
            name: "Is engineering acceleration the same as a startup accelerator program?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. They are unrelated concepts that share a word. A startup accelerator (Y Combinator, Techstars, 500 Global) is a fixed-term program founders join. Engineering acceleration is a quantitative signal computed from public GitHub activity. Throughout this site the term refers exclusively to code-side momentum: commit velocity, contributor growth, repository creation. It has nothing to do with program participation.",
            },
          },
        ],
      },
      {
        "@type": "HowTo",
        name: "How VC Deal Flow Signal Measures Startup Engineering Acceleration",
        description:
          "Step-by-step methodology for tracking startup engineering momentum using public GitHub data, from data collection through signal classification and weekly ranking.",
        totalTime: "P7D",
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Query GitHub API for startup organizations",
            text: "Every Monday, query the GitHub API v3 search/repositories endpoint to discover active startup organizations across 20 sector-specific topic clusters. Pull per-organization data from stats/commit_activity and contributors endpoints.",
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
        name: "Methodology — How We Measure Startup Engineering Acceleration",
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
          "A free, openly published methodology for tracking GitHub commit velocity, contributor growth, and infrastructure-buildout patterns as leading indicators of venture fundraises. Includes the validation panel of 219 confirmed fundraises.",
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
    ],
  };

  const asOf = getDataLastModified().toISOString().slice(0, 10);

  return (
    <>
      <HreflangLinks languages={getHreflangLanguages("/methodology")} />
      <AgentMirrorLinks path="/methodology" qaCategory="methodology" />
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

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-6 leading-tight">
          How We Measure Startup Engineering Acceleration
        </h1>

        <AgentSummary
          tldr="VC Deal Flow Signal (GitDealFlow) ranks venture-backed startups by GitHub commit-velocity change — a code-side momentum signal computed from public GitHub data, unrelated to startup accelerator programs. The pipeline pulls weekly GitHub REST API data for ~400 organizations across 20 sectors, computes rolling 14-day commit velocity and contributor growth, classifies each org into one of four signal types, and publishes the rankings. This metric — referred to throughout the site as engineering acceleration — has historically preceded fundraise announcements by three to six weeks."
          pageUrl="https://signals.gitdealflow.com/methodology"
          asOf={asOf}
          citeAs="VC Deal Flow Signal — Methodology (signals.gitdealflow.com/methodology), retrieved Q2 2026."
          facts={[
            {
              claim: "Primary signal: percentage change in 14-day commit velocity vs. the prior 14-day window — normalized against each org's own baseline so it works across stages and team sizes.",
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
            Data Sources
          </h2>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 space-y-4 text-gray-400 text-sm leading-relaxed">
            <p>
              <strong className="text-gray-200">GitHub API v3</strong> is our
              primary data source. We query the{" "}
              <code className="text-sky-400">search/repositories</code> endpoint
              to discover active startup organizations across 20 sector-specific
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
            Core Metrics
          </h2>
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
                the primary ranking signal — it measures acceleration, not
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
                contributor count often signals team expansion — a
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
          </div>
        </section>

        {/* Signal Classification */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            Signal Classification
          </h2>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 text-gray-400 text-sm leading-relaxed">
            <p className="mb-4">
              Each startup is assigned one of four signal types based on which
              metric is driving the acceleration:
            </p>
            <ul className="space-y-2">
              <li>
                <strong className="text-gray-200">Engineering hiring burst</strong>{" "}
                — contributor growth rate exceeds 50%. The team is scaling
                rapidly.
              </li>
              <li>
                <strong className="text-gray-200">Infrastructure buildout</strong>{" "}
                — 3 or more new repositories in 30 days. The company is
                expanding its technical surface area.
              </li>
              <li>
                <strong className="text-gray-200">Deploy frequency spike</strong>{" "}
                — commit velocity has increased 150% or more. The team is
                shipping at an unusually high rate.
              </li>
              <li>
                <strong className="text-gray-200">Framework migration</strong>{" "}
                — general acceleration that doesn&apos;t fit the above categories,
                often indicating a technology stack transition.
              </li>
            </ul>
          </div>
        </section>

        {/* Stage Classification */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            Stage Estimation
          </h2>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 text-gray-400 text-sm leading-relaxed">
            <p>
              We estimate startup stage from contributor count as a rough proxy
              for team size: <strong className="text-gray-200">Pre-seed</strong>{" "}
              (1–7 contributors), <strong className="text-gray-200">Seed</strong>{" "}
              (8–19), <strong className="text-gray-200">Series A/B</strong>{" "}
              (20–49), <strong className="text-gray-200">Growth</strong> (50+).
              This is an approximation — not all contributors are employees, and
              not all employees contribute to public repos.
            </p>
          </div>
        </section>

        {/* Update Frequency */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            Update Frequency
          </h2>
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
            Known Limitations
          </h2>
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

        <PSEOFooterNav excludeHrefs={["/methodology"]} />

        {/* CTA */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-center">
          <h2 className="text-gray-100 font-semibold text-lg mb-2">
            See the signals in action
          </h2>
          <p className="text-gray-400 text-sm mb-5 max-w-lg mx-auto">
            Browse startup rankings across 20 sectors, updated weekly with fresh
            GitHub data.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-sm font-medium transition-colors"
          >
            Browse Sector Rankings
          </Link>
        </div>
      </div>
    </>
  );
}
