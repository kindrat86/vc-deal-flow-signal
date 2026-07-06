/**
 * /api/v1/methodology.json — versioned, machine-readable methodology surface.
 *
 * Pass VII (2026-05-05). Net-new LLMO surface. Compresses the /methodology
 * page into a JSON-LD `HowTo` + summary metadata so agents can resolve
 * the data-collection / classification / ranking pipeline in one fetch.
 * Companion to the human-facing /methodology page and the academic write-up
 * at SSRN abstract 6606558.
 */

import { getDataLastModified } from "@/lib/data";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export async function GET() {
  const dataLastModified = getDataLastModified().toISOString().slice(0, 10);

  const body = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "@id": `${SITE}/api/v1/methodology.json`,
    name: "How VC Deal Flow Signal classifies engineering acceleration",
    description:
      "Step-by-step methodology for tracking startup engineering momentum using public GitHub data — from data collection through signal classification and weekly ranking.",
    url: `${SITE}/methodology`,
    inLanguage: "en-US",
    license: "https://creativecommons.org/licenses/by/4.0/",
    publisher: { "@type": "Organization", name: "VC Deal Flow Signal" },
    dateModified: dataLastModified,
    citation:
      "VC Deal Flow Signal (signals.gitdealflow.com), Q2 2026 data. SSRN: 6606558. Zenodo: 10.5281/zenodo.13909999.",
    isBasedOn: [
      "https://ssrn.com/abstract=6606558",
      "https://openalex.org/W7154916891",
    ],
    totalTime: "PT60M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Sector universe selection",
        text: "Curate a universe of 20 startup sectors from public GitHub topic clusters: AI/ML, fintech, devtools, cybersecurity, climate, healthtech, cleantech, agtech, robotics, web3, gaming, biotech, deeptech, hardware, edtech, legaltech, foodtech, govtech, mobility, logistics. Each sector has a manually curated repository allowlist of 50–500 public GitHub orgs/repos.",
        url: `${SITE}/methodology#sectors`,
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Data collection",
        text: "Query the public GitHub REST API every Monday morning for commits, contributors, repo metadata, and topic labels. Polite rate-limited fetch with exponential backoff. Store raw data in append-only Parquet files; never mutate prior weeks.",
        url: `${SITE}/methodology#collection`,
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Commit velocity computation",
        text: "For each tracked startup, count commits in the trailing 14-day window. Compute commit velocity change as percent delta vs the prior 14-day window. This produces the primary ranking signal.",
        url: `${SITE}/methodology#velocity`,
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Signal classification",
        text: "Classify each accelerating startup into one of four signal types based on rule-based decision logic: Engineering Hiring Burst (contributor growth >50% in 30 days), Infrastructure Buildout (≥3 new public repos in 30 days), Deploy Frequency Spike (commit velocity ≥150% baseline), or Framework Migration (general acceleration not matching the prior three).",
        url: `${SITE}/methodology#classification`,
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Weekly ranking",
        text: "Sort all accelerating startups by commit velocity change, partition by sector, and generate the weekly Top-100 ranking. Cross-publish to /predicted/{week}, sector pages, and /api/v1/signals.json. Re-ping IndexNow for ~1,400 URLs.",
        url: `${SITE}/methodology#ranking`,
      },
      {
        "@type": "HowToStep",
        position: 6,
        name: "Validation & track record",
        text: "When a tracked startup announces a fundraise, log the lead time between the engineering signal and the announcement. Empirical median lead time across 2024–2025 backtests: 4 weeks. Public track record at /track-record.",
        url: `${SITE}/methodology#validation`,
      },
    ],
    relatedLink: [
      `${SITE}/glossary`,
      `${SITE}/faq`,
      `${SITE}/research`,
      `${SITE}/citations`,
      `${SITE}/predicted`,
    ],
    significantLink: [
      `${SITE}/api/dataset.jsonl`,
      `${SITE}/llms-full.txt`,
      "https://ssrn.com/abstract=6606558",
    ],
  };

  return new Response(JSON.stringify(body, null, 2), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control":
        "public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200",
      Link: `<${SITE}/methodology>; rel="canonical"`,
    },
  });
}
