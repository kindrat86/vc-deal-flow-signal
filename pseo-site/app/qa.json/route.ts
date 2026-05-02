/**
 * /qa.json — single-document JSON mirror of /qa.jsonl with deep-link anchors.
 *
 * Companion to:
 *   /qa.jsonl   — newline-delimited (RAG-friendly)
 *   /qa.csv     — spreadsheet alternate
 *
 * Filter via ?category=signal-type (or general | blog | sector | research |
 * glossary). Default returns all categories.
 *
 * Distinct from /api/answers.json which serves the long-form /answers/{slug}
 * agent-query pages — this surface serves the atomic Q&A pairs that map to
 * /faq, /glossary, /research, and per-sector pages.
 */

import { posts } from "@/content/posts";
import { standaloneFaqs } from "@/content/standalone-faqs";
import { FINDINGS as RESEARCH_FINDINGS } from "@/content/research-findings";
import {
  getAllSectors,
  getCurrentPeriod,
  getDataLastModified,
} from "@/lib/data";

const SITE = "https://signals.gitdealflow.com";
const DATASET_VERSION = "1.0.0";

interface QAEntry {
  q: string;
  a: string;
  anchor: string;
  category: string;
  source: string;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const categoryFilter = url.searchParams.get("category")?.toLowerCase();

  const lastModified = getDataLastModified();
  const period = getCurrentPeriod();
  const sectors = getAllSectors();

  const entries: QAEntry[] = [];

  // 1. Standalone FAQs — anchored to /faq#q{i+1}
  standaloneFaqs.forEach((faq, i) => {
    entries.push({
      q: faq.question,
      a: faq.answer,
      anchor: `${SITE}/faq#q${i + 1}`,
      category: "general",
      source: "FAQ",
    });
  });

  // 2. Per-post FAQs
  posts.forEach((post) => {
    post.faqs?.forEach((faq) => {
      entries.push({
        q: faq.question,
        a: faq.answer,
        anchor: `${SITE}/blog/${post.slug}`,
        category: "blog",
        source: post.title,
      });
    });
  });

  // 3. Sector questions
  sectors.forEach((sector) => {
    const periodData = sector.periods[period.slug];
    if (!periodData) return;
    entries.push({
      q: `What is the engineering acceleration ranking for ${sector.name} startups in ${period.name}?`,
      a: `For ${period.name}, ${periodData.startups.length} ${sector.name} startups are tracked. The leader by 14-day commit-velocity change is ${periodData.startups[0]?.name ?? "(no data)"}. Ranking is by % change in commits to each startup's most active public GitHub repo over the last 14 days vs the prior 14-day window.`,
      anchor: `${SITE}/startups-to-watch/${sector.slug}-${period.slug}`,
      category: "sector",
      source: sector.name,
    });
  });

  // 4. Research findings
  RESEARCH_FINDINGS.forEach((f) => {
    entries.push({
      q: f.title,
      a: `${f.claim} — ${f.why} (Source: SSRN ssrn.com/abstract=6606558, ${f.section})`,
      anchor: `${SITE}/research/${f.slug}`,
      category: "research",
      source: `SSRN finding #${f.n} (${f.group})`,
    });
  });

  const filtered = categoryFilter
    ? entries.filter((e) => e.category === categoryFilter)
    : entries;

  const body = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "VC Deal Flow Signal — Q&A Dataset",
    description:
      "Citation-ready question/answer pairs covering methodology, sectors, signal types, and SSRN-indexed research findings. Each entry includes a deep-link anchor URL for direct attribution.",
    url: `${SITE}/qa.json`,
    sameAs: [`${SITE}/qa.jsonl`, `${SITE}/qa.csv`],
    version: DATASET_VERSION,
    license: "https://creativecommons.org/licenses/by/4.0/",
    licenseShort: "CC BY 4.0",
    creator: {
      "@type": "Organization",
      name: "VC Deal Flow Signal (GitDealFlow)",
      url: "https://gitdealflow.com",
      sameAs: [
        "https://www.wikidata.org/wiki/Q139376302",
        "https://orcid.org/0009-0002-2222-4112",
        "https://ssrn.com/abstract=6606558",
      ],
    },
    citation: `VC Deal Flow Signal (signals.gitdealflow.com), ${period.name} Q&A Dataset v${DATASET_VERSION}. Cite as DOI https://ssrn.com/abstract=6606558.`,
    period: period.name,
    lastModified: lastModified.toISOString(),
    count: filtered.length,
    countByCategory: {
      general: entries.filter((e) => e.category === "general").length,
      blog: entries.filter((e) => e.category === "blog").length,
      sector: entries.filter((e) => e.category === "sector").length,
      research: entries.filter((e) => e.category === "research").length,
    },
    queryFilter: categoryFilter ?? "(all)",
    relatedDatasets: [
      `${SITE}/qa.jsonl`,
      `${SITE}/qa.csv`,
      `${SITE}/api/dataset.jsonl`,
      `${SITE}/api/answers.json`,
    ],
    items: filtered,
  };

  const ifNoneMatch = request.headers.get("if-none-match");
  const etag = `"qajson:${period.slug}:${lastModified.getTime()}:${categoryFilter ?? "all"}"`;
  if (ifNoneMatch === etag) {
    return new Response(null, { status: 304, headers: { ETag: etag } });
  }

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
      "Access-Control-Allow-Origin": "*",
      "X-Robots-Tag": "index, follow",
      ETag: etag,
      "Last-Modified": lastModified.toUTCString(),
    },
  });
}
