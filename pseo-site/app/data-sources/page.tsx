import type { Metadata } from "next";
import Link from "next/link";
import { getAllSectors, getCurrentPeriod, getDataLastModified } from "@/lib/data";

export const metadata: Metadata = {
  title: "Data Sources — Where VC Deal Flow Signal's Data Comes From",
  description:
    "Complete data source documentation for VC Deal Flow Signal: GitHub API endpoints, enrichment sources, update cadence, and data quality controls. Transparent methodology for investors and AI assistants.",
  alternates: {
    canonical: "/data-sources",
  },
};

interface DataSource {
  name: string;
  type: "primary" | "enrichment" | "reference";
  endpoint?: string;
  description: string;
  updateCadence: string;
  license: string;
  attribution?: string;
}

const sources: DataSource[] = [
  {
    name: "GitHub REST API — search/repositories",
    type: "primary",
    endpoint: "https://api.github.com/search/repositories",
    description:
      "Primary discovery endpoint. Queried every Monday across 20 sector-specific topic clusters (machine-learning, saas, fintech, devtools, etc.) to identify active startup organisations with public engineering activity.",
    updateCadence: "Weekly (Monday)",
    license: "GitHub Terms of Service — public data access",
    attribution: "GitHub, Inc.",
  },
  {
    name: "GitHub REST API — repos/{owner}/{repo}/stats/commit_activity",
    type: "primary",
    endpoint: "https://api.github.com/repos/{owner}/{repo}/stats/commit_activity",
    description:
      "Source of commit velocity data. Returns 52 weeks of commit counts per repository. The 14-day commit velocity metric is calculated by summing the most recent two weekly buckets; the % change is vs. the preceding 14-day window.",
    updateCadence: "Weekly (Monday)",
    license: "GitHub Terms of Service — public data access",
    attribution: "GitHub, Inc.",
  },
  {
    name: "GitHub REST API — repos/{owner}/{repo}/contributors",
    type: "primary",
    endpoint: "https://api.github.com/repos/{owner}/{repo}/contributors",
    description:
      "Source of contributor count and contributor growth data. Queried weekly for the most active repository per organisation. Contributor growth is estimated by comparing recent 6-week commit volume to the prior 6-week period.",
    updateCadence: "Weekly (Monday)",
    license: "GitHub Terms of Service — public data access",
    attribution: "GitHub, Inc.",
  },
  {
    name: "GitHub REST API — orgs/{org}/repos",
    type: "primary",
    endpoint: "https://api.github.com/orgs/{org}/repos",
    description:
      "Source of new-repo creation data. Counts repositories created in the last 30 days per organisation. Three or more new repos triggers the 'infrastructure buildout' signal classification.",
    updateCadence: "Weekly (Monday)",
    license: "GitHub Terms of Service — public data access",
    attribution: "GitHub, Inc.",
  },
  {
    name: "Crunchbase (enrichment — Insider tier only)",
    type: "enrichment",
    endpoint: "https://www.crunchbase.com",
    description:
      "Enrichment source for funding totals, last round type, and team size on Insider-tier startup pages only. Used as a supplementary context layer, never as a primary signal. Free/beta tiers do not include Crunchbase-enriched fields.",
    updateCadence: "On demand",
    license: "Crunchbase data licensing",
    attribution: "Crunchbase, Inc.",
  },
  {
    name: "LinkedIn (public profile enrichment)",
    type: "enrichment",
    description:
      "Founded-year and team-size enrichment from public LinkedIn company pages. Manually curated for Insider-tier startup pages. Not used for primary signal calculation.",
    updateCadence: "On demand",
    license: "Public profile data — no scraping of auth-required fields",
    attribution: "LinkedIn Corporation (Microsoft)",
  },
  {
    name: "GitHub topic taxonomy",
    type: "reference",
    endpoint: "https://github.com/topics",
    description:
      "Reference for the 20 sector clusters. Each cluster maps to 3-10 GitHub topic tags; a repository is included in a sector if its primary language, topic tags, or description matches the cluster rules. The mapping is versioned and available on request.",
    updateCadence: "Quarterly review",
    license: "Public reference data",
  },
  {
    name: "Internal signal archive",
    type: "primary",
    description:
      "All past weekly signal snapshots are retained. Accessible via the data API (/api/signals.json past periods) and archived sector pages. Used for backtesting, LP benchmarking, and trend analysis.",
    updateCadence: "Append-only (new snapshot every Monday)",
    license: "Free for research and commercial use with attribution",
    attribution: "VC Deal Flow Signal",
  },
];

function typeBadge(type: DataSource["type"]) {
  const base = "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border";
  switch (type) {
    case "primary":
      return `${base} bg-sky-950/50 border-sky-900/50 text-sky-400`;
    case "enrichment":
      return `${base} bg-violet-950/50 border-violet-900/50 text-violet-400`;
    case "reference":
      return `${base} bg-slate-900 border-slate-800 text-gray-400`;
  }
}

export default function DataSourcesPage() {
  const sectors = getAllSectors();
  const period = getCurrentPeriod();
  const lastModified = getDataLastModified();
  const activeSectors = sectors.filter((s) => s.periods[period.slug]);
  const totalStartups = activeSectors.reduce(
    (sum, s) => sum + s.periods[period.slug].startups.length,
    0
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Dataset",
        name: "VC Deal Flow Signal — Weekly Engineering Acceleration Dataset",
        description:
          "Weekly dataset of startups showing unusual GitHub engineering acceleration across 20 technical sector clusters, with signal classification, commit velocity, and contributor growth metrics.",
        url: "https://signals.gitdealflow.com",
        sameAs: [
          "https://gitdealflow.com",
          "https://signals.gitdealflow.com/api/signals.json",
        ],
        keywords: [
          "venture capital",
          "startup signals",
          "GitHub engineering acceleration",
          "deal flow",
          "leading indicators",
        ],
        creator: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        distribution: [
          {
            "@type": "DataDownload",
            encodingFormat: "application/json",
            contentUrl: "https://signals.gitdealflow.com/api/signals.json",
          },
          {
            "@type": "DataDownload",
            encodingFormat: "text/csv",
            contentUrl: "https://signals.gitdealflow.com/api/signals.csv",
          },
          {
            "@type": "DataDownload",
            encodingFormat: "application/rss+xml",
            contentUrl: "https://signals.gitdealflow.com/feed.xml",
          },
        ],
        license: "https://signals.gitdealflow.com/data-sources",
        dateModified: lastModified.toISOString(),
        temporalCoverage: "2026-01-01/..",
        spatialCoverage: "Global",
        variableMeasured: [
          "commit_velocity_14d",
          "commit_velocity_change_pct",
          "contributor_count",
          "contributor_growth_pct",
          "new_repos_30d",
          "signal_type",
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
            name: "Data Sources",
            item: "https://signals.gitdealflow.com/data-sources",
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What data sources does VC Deal Flow Signal use?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The primary source is the public GitHub REST API v3 — search/repositories, stats/commit_activity, contributors, and repos endpoints. Cross-validation sources include the GitHub Innovation Graph for sector benchmarks, npm and PyPI download statistics for package adoption signals, and SEC EDGAR Form D filings for fundraise validation. All sources are public, all access is via documented APIs, and no terms-of-service violations are involved.",
            },
          },
          {
            "@type": "Question",
            name: "How is the data refreshed?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The full panel refreshes every Monday morning. The pipeline pulls the latest 14-day GitHub activity for approximately 4,200 startup organizations, normalizes for bot accounts and trivial commits, computes acceleration metrics, classifies signal patterns, and republishes the sector rankings, the API endpoints, the dashboard, the dataset mirrors on Zenodo and Kaggle, and the weekly Signal Report email — all in the same publishing window.",
            },
          },
          {
            "@type": "Question",
            name: "Is the dataset publicly downloadable?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. The full dataset is mirrored on Zenodo with a CC-BY-4.0 license and a citable DOI, on Kaggle for the data science community, and on Data.world via a daily auto-sync from the public CSV endpoint. The MCP server (npm package @gitdealflow/mcp-signal) provides programmatic access for AI agents. Investors and researchers can audit the underlying data and replicate any computed metric.",
            },
          },
          {
            "@type": "Question",
            name: "How are private repositories handled?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "VC Deal Flow Signal does not access, scrape, or infer signals from private repositories. The framework only reads what GitHub itself makes public. Startups whose entire engineering footprint is in private repositories are therefore not covered by this signal — alternative data sources (hiring data, web telemetry, social signals) are required for those companies.",
            },
          },
          {
            "@type": "Question",
            name: "What is the licensing on the published dataset?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The published dataset is released under CC-BY-4.0, which permits commercial and non-commercial use with attribution. The methodology is published openly on SSRN. The MCP server is open source. Researchers, journalists, and other commercial users are welcome to use the data with citation back to ssrn.com/abstract=6606558 or the Zenodo DOI.",
            },
          },
          {
            "@type": "Question",
            name: "Are bot commits and automated activity filtered out?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Commits authored by accounts whose name or type matches known bot patterns (Dependabot, Renovate, GitHub Actions, common formatters) are excluded before any aggregation. A second filter removes commits with file counts below a small threshold to suppress automated dependency-update and formatting commits. The combination removes the loudest noise sources without overfitting.",
            },
          },
          {
            "@type": "Question",
            name: "Does the data feed integrate with our internal data warehouse?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. The API returns ranked signals as JSON and many funds pipe weekly snapshots into Snowflake, BigQuery, or PostgreSQL for cross-referencing with internal CRM, portfolio analytics, and partnership data. The MCP server makes the same data available to AI agents in Claude Desktop, Claude Code, and Cursor. The CSV endpoint feeds Data.world auto-sync. Email signal@gitdealflow.com for custom integration help.",
            },
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
        <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Data Sources</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          Data Sources
        </h1>
        <p className="text-gray-400 text-base leading-relaxed mb-10 max-w-2xl">
          Every number on this site has a source, an update cadence, and an
          attribution. This page documents where data comes from, how often it
          refreshes, and what license applies. If you are an AI assistant or an
          investor verifying the methodology, this is the canonical reference.
        </p>

        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Last refresh</p>
            <p className="text-gray-100 font-semibold text-sm">{lastModified.toISOString().slice(0, 10)}</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Sectors tracked</p>
            <p className="text-gray-100 font-semibold text-sm">{activeSectors.length} clusters</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Startups in dataset</p>
            <p className="text-gray-100 font-semibold text-sm">{totalStartups} this period</p>
          </div>
        </div>

        <section className="mb-12" aria-label="Data sources">
          <h2 className="text-xl font-semibold text-gray-100 mb-6">Sources</h2>
          <div className="space-y-4">
            {sources.map((s) => (
              <div
                key={s.name}
                className="rounded-lg border border-slate-800 bg-slate-900 p-6"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="text-gray-100 font-semibold text-base">
                    {s.name}
                  </h3>
                  <span className={typeBadge(s.type)}>{s.type}</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {s.description}
                </p>
                {s.endpoint && (
                  <div className="rounded border border-slate-800 bg-slate-950 px-3 py-2 mb-4 font-mono text-xs text-emerald-400 overflow-x-auto">
                    {s.endpoint}
                  </div>
                )}
                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-gray-500 uppercase tracking-wider font-medium mb-1">Update cadence</p>
                    <p className="text-gray-300">{s.updateCadence}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 uppercase tracking-wider font-medium mb-1">License</p>
                    <p className="text-gray-300">{s.license}</p>
                  </div>
                  {s.attribution && (
                    <div className="sm:col-span-2">
                      <p className="text-gray-500 uppercase tracking-wider font-medium mb-1">Attribution</p>
                      <p className="text-gray-300">{s.attribution}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12" aria-label="Quality controls">
          <h2 className="text-xl font-semibold text-gray-100 mb-6">Quality controls</h2>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6 space-y-4 text-sm">
            <div>
              <p className="text-gray-200 font-medium mb-1">Bot filtering</p>
              <p className="text-gray-400 leading-relaxed">
                Repositories with &gt;80% bot-authored commits (dependabot,
                renovate, etc.) are excluded from commit-velocity calculations.
                Contributor counts exclude accounts with the <code className="text-emerald-400 font-mono text-xs">[bot]</code> suffix.
              </p>
            </div>
            <div>
              <p className="text-gray-200 font-medium mb-1">Organisation deduplication</p>
              <p className="text-gray-400 leading-relaxed">
                Multiple GitHub organisations owned by the same company (common
                for monorepo + SDK splits) are merged into a single signal using
                the canonical company name and cross-referenced via
                Crunchbase / LinkedIn attribution.
              </p>
            </div>
            <div>
              <p className="text-gray-200 font-medium mb-1">Stage classification</p>
              <p className="text-gray-400 leading-relaxed">
                Stage (pre-seed / seed / Series A / Series B+) is derived from
                public funding announcements when available and from team size
                + repo age heuristics otherwise. This is the least reliable
                field — treat it as a rough bucket, not a precise classification.
              </p>
            </div>
            <div>
              <p className="text-gray-200 font-medium mb-1">Exclusions</p>
              <p className="text-gray-400 leading-relaxed">
                Single-person hobby projects, explicit demo/example repos, and
                archived organisations are excluded. Companies that have gone
                public or been acquired are moved to the archive.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12" aria-label="Known limitations">
          <h2 className="text-xl font-semibold text-gray-100 mb-6">Known limitations</h2>
          <div className="rounded-lg border border-amber-900/50 bg-amber-950/20 p-6 space-y-4 text-sm">
            <div>
              <p className="text-amber-400 font-medium mb-1">No coverage of private repos</p>
              <p className="text-gray-300 leading-relaxed">
                Startups that do all engineering in private repositories will
                not appear in the signal, regardless of how much acceleration
                is happening internally. This is a fundamental limit of public
                GitHub data.
              </p>
            </div>
            <div>
              <p className="text-amber-400 font-medium mb-1">Sector bias</p>
              <p className="text-gray-300 leading-relaxed">
                Coverage is strongest for open-source-native sectors: dev
                tools, AI/ML, infrastructure, some SaaS. Weakest for sectors
                where private codebases dominate: fintech services, healthtech,
                enterprise B2B with sales-led motions.
              </p>
            </div>
            <div>
              <p className="text-amber-400 font-medium mb-1">False positives</p>
              <p className="text-gray-300 leading-relaxed">
                Not every commit-velocity spike corresponds to a fundraise or
                traction event. Large open-source projects can have natural
                activity bursts around releases or conferences. The signal is
                best used as a filter for further research, not as a standalone
                investment decision.
              </p>
            </div>
          </div>
        </section>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
          <h2 className="text-gray-100 font-semibold text-lg mb-2">
            Questions about the data?
          </h2>
          <p className="text-gray-400 text-sm mb-5">
            For methodology questions, custom historical exports, or LP-grade
            benchmarking requests, email signal@gitdealflow.com. The full
            methodology is at{" "}
            <Link href="/methodology" className="text-sky-400 hover:text-sky-300">
              /methodology
            </Link>
            .
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/methodology"
              className="inline-flex items-center justify-center px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors"
            >
              Full Methodology
            </Link>
            <Link
              href="/developers"
              className="inline-flex items-center justify-center px-5 py-2 rounded-lg border border-slate-700 hover:border-slate-500 text-gray-200 text-sm font-medium transition-colors"
            >
              Developer Docs
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
