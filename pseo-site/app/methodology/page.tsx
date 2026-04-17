import type { Metadata } from "next";
import Link from "next/link";

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
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Methodology</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-6 leading-tight">
          How We Measure Startup Engineering Acceleration
        </h1>

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
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors"
          >
            Browse Sector Rankings
          </Link>
        </div>
      </div>
    </>
  );
}
