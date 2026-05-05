/**
 * /.well-known/freshness.json — data freshness manifest for AEO/AIO probes.
 *
 * Retrieval pipelines (Perplexity, ChatGPT-with-search, Claude search,
 * agent-native VC tools that cache our data) want a single quick handle
 * for "how stale is this dataset right now?" before re-fetching the full
 * NDJSON / OpenAPI surface. This manifest exposes the most recent data
 * mutation timestamp, the active reporting period, and per-surface refresh
 * cadences in one machine-readable doc.
 *
 * Mirrors the `dct:modified` claims in /.well-known/dataset.json so any
 * crawler that reads either file gets a consistent freshness picture.
 */

import { NextResponse } from "next/server";
import { getDataLastModified, getCurrentPeriod, getAllPeriods } from "@/lib/data";

export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export async function GET() {
  const modified = getDataLastModified().toISOString();
  const period = getCurrentPeriod();
  const periods = getAllPeriods();

  const manifest = {
    "@context": "https://schema.org",
    "@type": "DataFeed",
    "@id": `${SITE}/.well-known/freshness.json`,
    name: "VC Deal Flow Signal — Data Freshness Manifest",
    description:
      "Machine-readable manifest of the most recent data mutation timestamp, the active reporting period, and per-surface refresh cadences. Designed for retrieval pipelines that cache our dataset and need a quick freshness probe before re-fetching.",
    publisher: {
      "@type": "Organization",
      "@id": "https://gitdealflow.com/#organization",
      name: "VC Deal Flow Signal",
      alternateName: "GitDealFlow",
      url: "https://gitdealflow.com",
    },
    license: "https://creativecommons.org/licenses/by/4.0/",
    dateModified: modified,
    dataCurrency: {
      lastModified: modified,
      activePeriod: {
        slug: period.slug,
        name: period.name,
        current: period.current,
      },
      coveredPeriods: periods.map((p) => ({
        slug: p.slug,
        name: p.name,
        current: p.current,
      })),
      refreshCadence: "weekly",
      nextScheduledRefresh: "Mondays ~09:00 UTC",
    },
    surfaces: [
      {
        url: `${SITE}/api/signals.json`,
        format: "application/json",
        cadence: "weekly",
        cacheTtlSeconds: 3600,
      },
      {
        url: `${SITE}/api/signals.csv`,
        format: "text/csv",
        cadence: "weekly",
        cacheTtlSeconds: 3600,
      },
      {
        url: `${SITE}/api/dataset.jsonl`,
        format: "application/x-ndjson",
        cadence: "weekly",
        cacheTtlSeconds: 86400,
      },
      {
        url: `${SITE}/qa.jsonl`,
        format: "application/x-ndjson",
        cadence: "as-edited",
        cacheTtlSeconds: 3600,
      },
      {
        url: `${SITE}/llms.txt`,
        format: "text/plain",
        cadence: "per-build",
        cacheTtlSeconds: 3600,
      },
      {
        url: `${SITE}/llms-full.txt`,
        format: "text/plain",
        cadence: "per-build",
        cacheTtlSeconds: 3600,
      },
      {
        url: `${SITE}/api/openapi.json`,
        format: "application/json",
        cadence: "per-release",
        cacheTtlSeconds: 86400,
      },
      {
        url: `${SITE}/.well-known/agent-card.json`,
        format: "application/json",
        cadence: "per-release",
        cacheTtlSeconds: 86400,
      },
      {
        url: `${SITE}/.well-known/mcp.json`,
        format: "application/json",
        cadence: "per-release",
        cacheTtlSeconds: 86400,
      },
      {
        url: `${SITE}/sitemap.xml`,
        format: "application/xml",
        cadence: "per-build",
        cacheTtlSeconds: 3600,
      },
      {
        url: `${SITE}/news-sitemap.xml`,
        format: "application/xml",
        cadence: "per-build",
        cacheTtlSeconds: 1800,
      },
    ],
    citation: {
      paper: "https://ssrn.com/abstract=6606558",
      dataset: "https://zenodo.org/records/19650920",
      doi: "10.5281/zenodo.19650920",
    },
    sameAs: [
      `${SITE}/.well-known/dataset.json`,
      `${SITE}/standards`,
      `${SITE}/reproducibility`,
    ],
  };

  return NextResponse.json(manifest, {
    headers: {
      "Content-Type": "application/ld+json; charset=utf-8",
      "Cache-Control": "public, max-age=900, s-maxage=3600",
      "X-Robots-Tag": "index, follow",
      Link: `<https://creativecommons.org/licenses/by/4.0/>; rel="license"`,
    },
  });
}
