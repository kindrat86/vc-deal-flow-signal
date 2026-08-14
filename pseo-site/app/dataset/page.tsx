import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllSectors,
  getAllPeriods,
  getCurrentPeriod,
  getDataLastModified,
} from "@/lib/data";
import { DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";

export const metadata: Metadata = {
  title:
    "Open Dataset, VC Deal Flow Signal: GitHub Engineering Velocity Panel",
  description:
    "Download the open VC Deal Flow Signal dataset (CC BY 4.0). 309 rows across three CSV configurations (startup_signals, sector_aggregates, signal_type_timeseries). Mirrored on Hugging Face, Zenodo, Kaggle, Data.world. DOI 10.5281/zenodo.19650920.",
  alternates: {
    canonical: "/dataset",
  },
};

interface Mirror {
  name: string;
  url: string;
  format: string;
  notes: string;
  badge?: string;
}

const mirrors: Mirror[] = [
  {
    name: "Hugging Face Datasets",
    url: "https://huggingface.co/datasets/the-data-nerd/vc-deal-flow-signal",
    format: "CSV / Parquet (3 configs)",
    notes:
      "Canonical research mirror. Loadable via `datasets.load_dataset('the-data-nerd/vc-deal-flow-signal')`.",
    badge: "Primary research mirror",
  },
  {
    name: "Zenodo (DOI archive)",
    url: "https://zenodo.org/records/19650920",
    format: "CSV bundle",
    notes:
      "Citable archive. Version DOI 10.5281/zenodo.19650920; concept DOI 10.5281/zenodo.19650919 always resolves to the latest version.",
    badge: "Persistent DOI",
  },
  {
    name: "Kaggle Datasets",
    url: "https://www.kaggle.com/datasets/thedatanerd2026/vc-deal-flow-signal",
    format: "CSV (3 configs)",
    notes: "Notebook-friendly mirror with full README and per-file descriptions.",
  },
  {
    name: "Data.world",
    url: "https://data.world/thedatanerd2026/vc-deal-flow-signal-startup-engineering-acceleration",
    format: "CSV (autosynced daily)",
    notes:
      "Autosyncs from the live API endpoint each day. SPARQL-queryable via Data.world's query layer.",
  },
  {
    name: "Live JSON / CSV API",
    url: "https://signals.gitdealflow.com/api/signals.csv",
    format: "CSV / JSON",
    notes:
      "Always-fresh live endpoints: /api/signals.csv and /api/signals.json. Refreshed weekly.",
    badge: "Live",
  },
];

const configs = [
  {
    name: "startup_signals",
    rows: "~250",
    description:
      "Per-startup, per-period observations: 14-day commit velocity and change %, contributor count and growth %, new-repo count, inferred signal type, GitHub URL.",
    columns: [
      "period",
      "sector_slug",
      "sector_name",
      "startup_name",
      "stage",
      "geography",
      "commit_velocity_14d",
      "commit_velocity_change_pct",
      "contributors",
      "contributor_growth_pct",
      "new_repos",
      "signal_type",
      "github_url",
    ],
  },
  {
    name: "sector_aggregates",
    rows: "~50",
    description:
      "Sector-level rollups: tracked-startup count, mean and median commit velocity, total 14-day commits, mean contributor count, count of positive-velocity movers, top mover, dominant signal type.",
    columns: [
      "period",
      "sector_slug",
      "sector_name",
      "startups_tracked",
      "avg_commit_velocity_14d",
      "median_commit_velocity_14d",
      "total_commits_14d",
      "avg_contributors",
      "positive_velocity_count",
      "top_mover_name",
      "top_mover_change_pct",
      "dominant_signal_type",
    ],
  },
  {
    name: "signal_type_timeseries",
    rows: "~10",
    description:
      "Signal-type frequency by period with share of total. Useful for tracking aggregate shifts between framework migrations, hiring bursts, infrastructure buildouts, and deploy spikes.",
    columns: ["period", "signal_type", "startup_count", "share_of_total"],
  },
];

const variableMeasured = [
  {
    name: "Commit Velocity (14-day)",
    unit: "commits",
    description:
      "Total commits to an organization's most active public repository over a rolling 14-day window.",
  },
  {
    name: "Commit Velocity Change",
    unit: "percent",
    description:
      "Percentage change in commit velocity compared to the preceding 14-day window. Primary ranking signal.",
  },
  {
    name: "Contributor Count",
    unit: "contributors",
    description:
      "Number of unique contributors to the organization's most active public repository.",
  },
  {
    name: "Contributor Growth",
    unit: "percent",
    description:
      "Period-over-period change in unique contributor count. Surfaces engineering hiring bursts.",
  },
  {
    name: "Signal Type",
    unit: "categorical",
    description:
      "Classification of acceleration pattern: framework migration, engineering hiring burst, infrastructure buildout, or deploy frequency spike.",
  },
];

const citationCff = `cff-version: 1.2.0
title: "VC Deal Flow Signal, Startup Engineering Acceleration Dataset"
type: dataset
authors:
  - name: "The Data Nerd"
    affiliation: "VC Deal Flow Signal"
version: "1.0.0"
date-released: "2026-04-19"
doi: "10.5281/zenodo.19650920"
license: "CC-BY-4.0"`;

const apaCitation =
  "The Data Nerd. (2026). VC Deal Flow Signal: A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups (1.0.0) [Dataset]. Zenodo. https://doi.org/10.5281/zenodo.19650920";

const bibtexCitation = `@dataset{thedatanerd_2026_vc_deal_flow_signal,
  author       = {The Data Nerd},
  title        = {{VC Deal Flow Signal: A Longitudinal Panel of
                   GitHub Engineering Velocity for Venture-Backed
                   Startups}},
  month        = apr,
  year         = 2026,
  publisher    = {Zenodo},
  version      = {1.0.0},
  doi          = {10.5281/zenodo.19650920},
  url          = {https://doi.org/10.5281/zenodo.19650920},
  license      = {CC-BY-4.0}
}`;

export default function DatasetPage() {
  const sectors = getAllSectors();
  const allPeriods = getAllPeriods();
  const period = getCurrentPeriod();
  const lastModified = getDataLastModified().toISOString().slice(0, 10);

  // Standalone Dataset JSON-LD for this page (mirrors the homepage @graph
  // entry but simpler, Google Dataset Search prefers a dedicated URL).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "VC Deal Flow Signal, Startup Engineering Acceleration Dataset",
    alternateName: "GitDealFlow Startup Engineering Velocity Panel",
    description:
      `Open longitudinal panel of GitHub engineering-velocity signals across ${sectors.length} venture-backed startup sectors and ${allPeriods.length} quarterly periods. Tracks 14-day commit velocity, contributor growth, repository expansion, and acceleration-signal classification. Designed for venture-capital deal sourcing, portfolio monitoring, and academic research on alternative data in venture capital.`,
    url: "https://signals.gitdealflow.com/dataset",
    identifier: [
      "https://signals.gitdealflow.com/dataset",
      "https://doi.org/10.5281/zenodo.19650920",
      "https://doi.org/10.5281/zenodo.19650919",
    ],
    sameAs: [
      "https://huggingface.co/datasets/the-data-nerd/vc-deal-flow-signal",
      "https://www.kaggle.com/datasets/thedatanerd2026/vc-deal-flow-signal",
      "https://zenodo.org/records/19650920",
      "https://data.world/thedatanerd2026/vc-deal-flow-signal-startup-engineering-acceleration",
    ],
    version: "1.0.0",
    datePublished: "2026-04-19",
    dateModified: lastModified,
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
      "time series",
    ],
    creator: DATA_NERD_AUTHOR_REF,
    publisher: {
      "@type": "Organization",
      name: "VC Deal Flow Signal",
      url: "https://gitdealflow.com",
      sameAs: "https://www.wikidata.org/wiki/Q139376302",
    },
    distribution: mirrors.map((m) => ({
      "@type": "DataDownload",
      name: m.name,
      contentUrl: m.url,
      encodingFormat: m.format.includes("JSON")
        ? "application/json"
        : m.format.includes("Parquet")
          ? "application/x-parquet"
          : "text/csv",
    })),
    temporalCoverage: allPeriods.map((p) => p.name).join("/"),
    spatialCoverage: {
      "@type": "Place",
      name: "Global, US, EU, APAC, LATAM, Canada",
    },
    measurementTechnique:
      "Automated collection from the GitHub REST API v3: commit activity, unique contributor counts, and repository-creation metadata for venture-backed startup organizations. Rolling 14-day observation windows with deterministic signal classification over commit patterns.",
    variableMeasured: variableMeasured.map((v) => ({
      "@type": "PropertyValue",
      name: v.name,
      description: v.description,
      unitText: v.unit,
    })),
    citation: {
      "@type": "ScholarlyArticle",
      "@id": "https://ssrn.com/abstract=6606558",
      name: "A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups",
      url: "https://ssrn.com/abstract=6606558",
      author: DATA_NERD_AUTHOR_REF,
      datePublished: "2026-04",
    },
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://signals.gitdealflow.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Open Dataset",
        item: "https://signals.gitdealflow.com/dataset",
      },
    ],
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
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
        <span aria-current="page">Open Dataset</span>
      </nav>

      <h1 className="text-3xl font-bold text-slate-900">
        Open Dataset, GitHub Engineering Velocity Panel for Venture-Backed
        Startups
      </h1>
      <p className="mt-3 text-slate-600">
        Released under{" "}
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          className="text-blue-600 underline"
        >
          CC BY 4.0
        </a>
        . Citable via{" "}
        <a
          href="https://doi.org/10.5281/zenodo.19650920"
          className="text-blue-600 underline"
        >
          DOI 10.5281/zenodo.19650920
        </a>
        . Currently {period.name}; data last refreshed {lastModified}.
      </p>

      <section className="mt-8" aria-labelledby="downloads-heading">
        <h2
          id="downloads-heading"
          className="text-2xl font-semibold text-slate-900"
        >
          Downloads &amp; mirrors
        </h2>
        <p className="mt-2 text-slate-600">
          The same canonical CSVs are served from five independent mirrors so
          you can pick whichever fits your stack.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {mirrors.map((m) => (
            <a
              key={m.url}
              href={m.url}
              className="rounded-lg border border-slate-200 p-4 transition hover:border-blue-400 hover:bg-blue-50"
              rel="noopener"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-slate-900">{m.name}</span>
                {m.badge && (
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                    {m.badge}
                  </span>
                )}
              </div>
              <div className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                {m.format}
              </div>
              <p className="mt-2 text-sm text-slate-600">{m.notes}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-12" aria-labelledby="configs-heading">
        <h2
          id="configs-heading"
          className="text-2xl font-semibold text-slate-900"
        >
          Three CSV configurations
        </h2>
        <p className="mt-2 text-slate-600">
          309 rows total across the three configs. All three share the{" "}
          <code className="rounded bg-slate-100 px-1 py-0.5 text-sm">
            period
          </code>{" "}
          column for time-series joins.
        </p>
        <div className="mt-4 space-y-6">
          {configs.map((cfg) => (
            <div
              key={cfg.name}
              className="rounded-lg border border-slate-200 p-5"
            >
              <h3 className="font-mono text-lg font-semibold text-slate-900">
                {cfg.name}
              </h3>
              <p className="mt-1 text-sm text-slate-500">~{cfg.rows} rows</p>
              <p className="mt-2 text-slate-700">{cfg.description}</p>
              <div className="mt-3">
                <span className="text-xs uppercase tracking-wide text-slate-500">
                  Columns
                </span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {cfg.columns.map((c) => (
                    <code
                      key={c}
                      className="rounded bg-slate-100 px-2 py-0.5 text-xs"
                    >
                      {c}
                    </code>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12" aria-labelledby="variables-heading">
        <h2
          id="variables-heading"
          className="text-2xl font-semibold text-slate-900"
        >
          Variables measured
        </h2>
        <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="p-3">Variable</th>
                <th className="p-3">Unit</th>
                <th className="p-3">Definition</th>
              </tr>
            </thead>
            <tbody>
              {variableMeasured.map((v) => (
                <tr key={v.name} className="border-t border-slate-100">
                  <td className="p-3 font-medium text-slate-900">{v.name}</td>
                  <td className="p-3 text-slate-500">{v.unit}</td>
                  <td className="p-3 text-slate-700">{v.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12" aria-labelledby="cite-heading">
        <h2 id="cite-heading" className="text-2xl font-semibold text-slate-900">
          Citation
        </h2>
        <p className="mt-2 text-slate-600">
          Use whichever format your venue requires. ORCID iD{" "}
          <a
            href="https://orcid.org/0009-0002-2222-4112"
            className="text-blue-600 underline"
          >
            0009-0002-2222-4112
          </a>{" "}
          and the persistent DOI both resolve to the canonical record.
        </p>
        <div className="mt-4 space-y-4">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              APA
            </h3>
            <p className="mt-1 rounded bg-slate-50 p-4 text-sm text-slate-800">
              {apaCitation}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              BibTeX
            </h3>
            <pre className="mt-1 overflow-x-auto rounded bg-slate-50 p-4 text-xs text-slate-800">
              {bibtexCitation}
            </pre>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              CITATION.cff
            </h3>
            <pre className="mt-1 overflow-x-auto rounded bg-slate-50 p-4 text-xs text-slate-800">
              {citationCff}
            </pre>
          </div>
        </div>
      </section>

      <section className="mt-12" aria-labelledby="related-heading">
        <h2
          id="related-heading"
          className="text-2xl font-semibold text-slate-900"
        >
          Related resources
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
          <li>
            <a
              href="https://ssrn.com/abstract=6606558"
              className="text-blue-600 underline"
            >
              SSRN working paper
            </a>{" "}
methodology, classification rules, and early observations.
          </li>
          <li>
            <Link href="/methodology" className="text-blue-600 underline">
              Methodology page
            </Link>{" "}
full breakdown of how each signal is computed.
          </li>
          <li>
            <Link href="/data-sources" className="text-blue-600 underline">
              Data sources
            </Link>{" "}
every API endpoint, update cadence, and licensing detail.
          </li>
          <li>
            <Link href="/citations" className="text-blue-600 underline">
              Citations to this dataset
            </Link>{" "}
papers, blog posts, and tools that have used the data.
          </li>
        </ul>
      </section>
    </div>
  );
}
