import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllSectors,
  getAllPeriods,
  getCurrentPeriod,
  getDataLastModified,
} from "@/lib/data";
import { DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";

const SITE = "https://signals.gitdealflow.com";
const SSRN_URL = "https://ssrn.com/abstract=6606558";
const PAPER_TITLE =
  "A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups";
const HF_MIRROR = "https://huggingface.co/datasets/the-data-nerd/vc-deal-flow-signal";

export const metadata: Metadata = {
  title:
    "GitHub Engineering Velocity Index, Q3 2026: 350+ Startups, 15 Sectors",
  description:
    "The GitHub Engineering Velocity Index: a public, quarterly release of engineering-acceleration signals for 350+ venture-backed startups across 15 sectors, derived from public GitHub activity. Full company table, CSV/JSON/Parquet downloads, methodology, limitations, and citation. CC BY 4.0.",
  alternates: { canonical: "/engineering-velocity-index" },
  openGraph: {
    title: "GitHub Engineering Velocity Index: Q3 2026 Release",
    description:
      "Public quarterly table of GitHub engineering-acceleration signals for 350+ venture-backed startups across 15 sectors. CC BY 4.0.",
    url: `${SITE}/engineering-velocity-index`,
    type: "article",
    images: [{ url: `${SITE}/api/og/signal-card`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GitHub Engineering Velocity Index: Q3 2026 Release",
    description:
      "Public quarterly table of GitHub engineering-acceleration signals for 350+ venture-backed startups across 15 sectors. CC BY 4.0.",
    images: [`${SITE}/api/og/signal-card`],
  },
};

export const revalidate = 604800; // weekly, matches data refresh cadence

const SIGNAL_ORDER = [
  "Engineering hiring burst",
  "Infrastructure buildout",
  "Deploy frequency spike",
  "Framework migration",
  "Deceleration",
];

function pct(v: string): number {
  const m = v.replace(/[^0-9-]/g, "");
  return parseInt(m || "0", 10);
}

export default function VelocityIndexPage() {
  const period = getCurrentPeriod();
  const allPeriods = getAllPeriods();
  const sectors = getAllSectors();
  const lastModified = getDataLastModified().toISOString().slice(0, 10);

  // Build the current-quarter table from live data (never hardcoded).
  type Row = {
    name: string;
    sector: string;
    stage: string;
    geography: string;
    commitVelocity14d: number;
    commitVelocityChange: string;
    contributors: number;
    contributorGrowth: string;
    newRepos: number;
    signalType: string;
    githubUrl: string;
    websiteUrl?: string;
  };
  const rows: Row[] = [];
  const activeSectors = sectors.filter((s) => s.periods[period.slug]);
  for (const sector of activeSectors) {
    const snap = sector.periods[period.slug];
    for (const s of snap.startups) {
      rows.push({
        name: s.name,
        sector: sector.name,
        stage: s.stage,
        geography: s.geography,
        commitVelocity14d: s.commitVelocity14d,
        commitVelocityChange: s.commitVelocityChange,
        contributors: s.contributors,
        contributorGrowth: s.contributorGrowth,
        newRepos: s.newRepos,
        signalType: s.signalType,
        githubUrl: s.githubUrl,
        websiteUrl: s.websiteUrl,
      });
    }
  }
  // Sort by absolute velocity change desc, then velocity desc.
  rows.sort((a, b) => {
    const da = Math.abs(pct(a.commitVelocityChange));
    const db = Math.abs(pct(b.commitVelocityChange));
    if (db !== da) return db - da;
    return b.commitVelocity14d - a.commitVelocity14d;
  });

  // Computed statistics (sourced from the dataset itself).
  const total = rows.length;
  const positiveMovers = rows.filter(
    (r) => r.commitVelocityChange.startsWith("+") && r.commitVelocityChange !== "+0%",
  ).length;
  const deceleration = rows.filter((r) => r.signalType === "Deceleration").length;
  const signalCounts: Record<string, number> = {};
  for (const r of rows) signalCounts[r.signalType] = (signalCounts[r.signalType] || 0) + 1;
  const avgVelocity = Math.round(
    rows.reduce((s, r) => s + r.commitVelocity14d, 0) / Math.max(total, 1),
  );
  const totalCommits = rows.reduce((s, r) => s + r.commitVelocity14d, 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${SITE}/engineering-velocity-index#dataset`,
    name: "GitHub Engineering Velocity Index",
    alternateName: "VC Deal Flow Signal: Quarterly Engineering Acceleration Release",
    description: `Public quarterly release of GitHub engineering-acceleration signals for ${total} venture-backed startups across ${activeSectors.length} sectors in ${period.name}. Tracks 14-day commit velocity and change, contributor count and growth, new-repository creation, and a five-class acceleration-signal classification (engineering hiring burst, infrastructure buildout, deploy frequency spike, framework migration, deceleration).`,
    url: `${SITE}/engineering-velocity-index`,
    version: period.slug,
    datePublished: lastModified,
    dateModified: lastModified,
    isAccessibleForFree: true,
    license: {
      "@type": "CreativeWork",
      name: "Creative Commons Attribution 4.0 International",
      url: "https://creativecommons.org/licenses/by/4.0/",
    },
    keywords: [
      "venture capital",
      "startups",
      "GitHub",
      "engineering velocity",
      "commit activity",
      "alternative data",
      "deal flow",
      "panel data",
    ],
    creator: DATA_NERD_AUTHOR_REF,
    publisher: {
      "@type": "Organization",
      name: "VC Deal Flow Signal",
      url: "https://gitdealflow.com",
      sameAs: "https://www.wikidata.org/wiki/Q139376302",
    },
    temporalCoverage: allPeriods.map((p) => p.name).join("/"),
    distribution: [
      {
        "@type": "DataDownload",
        name: "Live CSV (current quarter)",
        contentUrl: `${SITE}/api/signals.csv`,
        encodingFormat: "text/csv",
      },
      {
        "@type": "DataDownload",
        name: "Live JSON (current quarter)",
        contentUrl: `${SITE}/api/signals.json`,
        encodingFormat: "application/json",
      },
      {
        "@type": "DataDownload",
        name: "Parquet (3 configs, Hugging Face)",
        contentUrl: HF_MIRROR,
        encodingFormat: "application/x-parquet",
      },
    ],
    citation: {
      "@type": "ScholarlyArticle",
      "@id": SSRN_URL,
      name: PAPER_TITLE,
      url: SSRN_URL,
      author: DATA_NERD_AUTHOR_REF,
      datePublished: "2026-04",
      sameAs: [
        "https://www.wikidata.org/wiki/Q139493250",
        "https://doi.org/10.2139/SSRN.6606558",
      ],
    },
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      {
        "@type": "ListItem",
        position: 2,
        name: "GitHub Engineering Velocity Index",
        item: `${SITE}/engineering-velocity-index`,
      },
    ],
  };

  const apa =
    "The Data Nerd. (2026). GitHub Engineering Velocity Index (Q3 2026 Release) [Dataset]. VC Deal Flow Signal. https://signals.gitdealflow.com/engineering-velocity-index";
  const bibtex = `@dataset{thedatanerd_2026_velocity_index_q3,
  author = {The Data Nerd},
  title  = {{GitHub Engineering Velocity Index (Q3 2026 Release)}},
  year   = {2026},
  publisher = {VC Deal Flow Signal},
  url    = {https://signals.gitdealflow.com/engineering-velocity-index},
  license = {CC-BY-4.0}
}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span aria-current="page">GitHub Engineering Velocity Index</span>
      </nav>

      <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
        GitHub Engineering Velocity Index: {period.name} Release
      </h1>
      <p className="mt-3 max-w-3xl text-slate-600">
        A public, quarterly release of engineering-acceleration signals for{" "}
        <strong className="text-slate-900">350+ venture-backed startups</strong>{" "}
        across {activeSectors.length} sectors, computed from public GitHub
        activity. Each row is the {period.name} 14-day observation window: commit
        velocity, contributor growth, new-repository creation, and a
        five-class acceleration-signal classification. Released under{" "}
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          className="text-blue-600 underline"
        >
          CC BY 4.0
        </a>
        . Data last refreshed {lastModified}.
      </p>

      {/* Snapshot statistics, computed from the live table below */}
      <section
        aria-label="Quarterly snapshot"
        className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <Stat label={`Startups tracked (${period.name})`} value={String(total)} />
        <Stat
          label="Positive-velocity movers"
          value={`${positiveMovers} (${Math.round(
            (100 * positiveMovers) / Math.max(total, 1),
          )}%)`}
        />
        <Stat label="Avg 14-day commit velocity" value={String(avgVelocity)} />
        <Stat label="Total 14-day commits" value={totalCommits.toLocaleString()} />
      </section>

      <section className="mt-8" aria-labelledby="downloads-heading">
        <h2
          id="downloads-heading"
          className="text-2xl font-semibold text-slate-900"
        >
          Downloads
        </h2>
        <p className="mt-2 text-slate-600">
          The full panel (all five quarters, {rows.length}+ startup-period
          observations) is available in machine-readable form. The live CSV/JSON
          endpoints always reflect the current quarter; the Hugging Face mirror
          carries the complete history in Parquet.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <DownloadCard
            name="Live CSV"
            format="text/csv"
            url={`${SITE}/api/signals.csv`}
            note="Current-quarter observations, refreshed weekly."
          />
          <DownloadCard
            name="Live JSON"
            format="application/json"
            url={`${SITE}/api/signals.json`}
            note="Current-quarter observations, refreshed weekly."
          />
          <DownloadCard
            name="Parquet (3 configs)"
            format="application/x-parquet"
            url={HF_MIRROR}
            note="Full history on Hugging Face (startup_signals, sector_aggregates, signal_type_timeseries)."
          />
        </div>
      </section>

      <section className="mt-12" aria-labelledby="table-heading">
        <h2
          id="table-heading"
          className="text-2xl font-semibold text-slate-900"
        >
          Full {period.name} company table ({total} startups)
        </h2>
        <p className="mt-2 text-slate-600">
          Sorted by absolute commit-velocity change. &ldquo;Signal type&rdquo;
          classifies the acceleration pattern; &ldquo;Deceleration&rdquo; marks a
          negative velocity change versus the prior 14-day window.
        </p>
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="p-3 font-semibold">#</th>
                <th className="p-3 font-semibold">Startup</th>
                <th className="p-3 font-semibold">Sector</th>
                <th className="p-3 font-semibold">Stage</th>
                <th className="p-3 font-semibold">Geo</th>
                <th className="p-3 font-semibold text-right">Commits/14d</th>
                <th className="p-3 font-semibold text-right">Velocity Δ</th>
                <th className="p-3 font-semibold text-right">Contributors</th>
                <th className="p-3 font-semibold">Signal type</th>
                <th className="p-3 font-semibold">GitHub</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={`${r.name}-${r.sector}`} className="border-t border-slate-100">
                  <td className="p-3 text-slate-400">{i + 1}</td>
                  <td className="p-3 font-medium text-slate-900">
                    {r.websiteUrl ? (
                      <a
                        href={r.websiteUrl}
                        className="hover:underline"
                        rel="noopener"
                      >
                        {r.name}
                      </a>
                    ) : (
                      r.name
                    )}
                  </td>
                  <td className="p-3 text-slate-600">{r.sector}</td>
                  <td className="p-3 text-slate-600">{r.stage}</td>
                  <td className="p-3 text-slate-600">{r.geography}</td>
                  <td className="p-3 text-right tabular-nums text-slate-700">
                    {r.commitVelocity14d}
                  </td>
                  <td
                    className={`p-3 text-right tabular-nums font-medium ${
                      r.commitVelocityChange.startsWith("-")
                        ? "text-red-600"
                        : "text-emerald-600"
                    }`}
                  >
                    {r.commitVelocityChange}
                  </td>
                  <td className="p-3 text-right tabular-nums text-slate-700">
                    {r.contributors}
                  </td>
                  <td className="p-3 text-slate-600">{r.signalType}</td>
                  <td className="p-3">
                    <a
                      href={r.githubUrl}
                      className="text-blue-600 hover:underline"
                      rel="noopener"
                    >
                      repo
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12" aria-labelledby="method-heading">
        <h2 id="method-heading" className="text-2xl font-semibold text-slate-900">
          Methodology
        </h2>
        <div className="mt-3 space-y-3 text-slate-700">
          <p>
            For each tracked organization and quarterly period, the pipeline
            enumerates public repositories via the GitHub REST API, selects the
            most active by 14-day commit count, pulls commit and contributor
            data, and applies a deterministic five-class signal classifier.
            Engineering acceleration is expressed as a percentage change versus
            the prior 14-day window; a deceleration is any negative change.
          </p>
          <p>
            Signal classes:{" "}
            {SIGNAL_ORDER.map((s, i) => (
              <span key={s}>
                {i > 0 && ", "}
                {s}
                {signalCounts[s] ? ` (${signalCounts[s]})` : ""}
              </span>
            ))}
            . The full method, formulas, and update cadence are described in the
            SSRN-indexed paper,{" "}
            <a href={SSRN_URL} className="text-blue-600 underline" rel="noopener">
              {PAPER_TITLE}
            </a>{" "}
            (abstract 6606558, DOI 10.2139/ssrn.6606558).
          </p>
        </div>
      </section>

      <section className="mt-10" aria-labelledby="limits-heading">
        <h2 id="limits-heading" className="text-2xl font-semibold text-slate-900">
          Known limitations
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-700">
          <li>
            No linked funding-event labels in this release; the panel measures
            engineering activity, not capital events.
          </li>
          <li>
            Selection bias toward open-source-active sectors; organizations that
            keep engineering private are under-represented.
          </li>
          <li>
            The 14-day observation window is a pragmatic tradeoff with academic
            precedent and is not optimized against any downstream objective.
          </li>
          <li>
            Survivorship bias: only currently-active organizations are tracked.
          </li>
          <li>
            Organization-to-startup mapping can be ambiguous for orgs operating
            multiple products.
          </li>
          <li>
            Contributor counts are for the single most active public repository
            per organization, not the whole org.
          </li>
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="cite-heading">
        <h2 id="cite-heading" className="text-2xl font-semibold text-slate-900">
          How to cite
        </h2>
        <p className="mt-2 text-slate-600">
          This index is a derivative release of the VC Deal Flow Signal panel.
          Cite the underlying methodology paper, and reference the index URL for
          the quarterly snapshot you used.
        </p>
        <div className="mt-4 space-y-4">
          <CiteBlock label="APA" code={apa} />
          <CiteBlock label="BibTeX" code={bibtex} />
          <p className="text-sm text-slate-600">
            Methodology:{" "}
            <a href={SSRN_URL} className="text-blue-600 underline" rel="noopener">
              {PAPER_TITLE} (SSRN abstract 6606558)
            </a>
            .
          </p>
        </div>
      </section>

      <section className="mt-10 rounded-lg border border-slate-200 bg-slate-50 p-5">
        <h2 className="text-lg font-semibold text-slate-900">
          License &amp; reuse
        </h2>
        <p className="mt-2 text-slate-700">
          Released under{" "}
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            className="text-blue-600 underline"
          >
            CC BY 4.0
          </a>
          . You may use, redistribute, and build on this index commercially or
          academically, provided attribution is given. No API key is required to
          download the CSV or JSON.
        </p>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-wide text-slate-500">
        {label}
      </div>
    </div>
  );
}

function DownloadCard({
  name,
  format,
  url,
  note,
}: {
  name: string;
  format: string;
  url: string;
  note: string;
}) {
  return (
    <a
      href={url}
      className="rounded-lg border border-slate-200 p-4 transition hover:border-blue-400 hover:bg-blue-50"
      rel="noopener"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-slate-900">{name}</span>
      </div>
      <div className="mt-1 text-xs uppercase tracking-wide text-slate-500">
        {format}
      </div>
      <p className="mt-2 text-sm text-slate-600">{note}</p>
    </a>
  );
}

function CiteBlock({ label, code }: { label: string; code: string }) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </h3>
      <pre className="mt-1 overflow-x-auto rounded bg-slate-900 p-3 text-xs text-slate-100">
        <code>{code}</code>
      </pre>
    </div>
  );
}
