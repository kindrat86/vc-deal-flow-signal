/**
 * /qa.csv, CSV alternate of /qa.jsonl for Excel / Google Sheets / pandas
 * consumers and AI tools that prefer tabular ingestion over NDJSON.
 * Same content set, RFC 4180 quoted CSV, CC BY 4.0.
 */

import { getAllSectors, getAllPeriods, getCurrentPeriod } from "@/lib/data";
import { posts } from "@/content/posts";
import { standaloneFaqs } from "@/content/standalone-faqs";
import { FINDINGS as RESEARCH_FINDINGS } from "@/content/research-findings";

const SITE = "https://signals.gitdealflow.com";

export const dynamic = "force-static";

function csvEscape(v: string): string {
  if (v === null || v === undefined) return "";
  const needsQuote = /[",\n\r]/.test(v);
  const escaped = v.replace(/"/g, '""');
  return needsQuote ? `"${escaped}"` : escaped;
}

interface Row {
  question: string;
  answer: string;
  source: string;
  source_url: string;
  category: string;
}

export async function GET() {
  const rows: Row[] = [];

  for (const f of standaloneFaqs) {
    const url = f.sourceHref.startsWith("http")
      ? f.sourceHref
      : `${SITE}${f.sourceHref}`;
    rows.push({
      question: f.question,
      answer: f.answer,
      source: f.source,
      source_url: url,
      category: "general",
    });
  }

  for (const post of posts) {
    if (!post.faqs) continue;
    for (const f of post.faqs) {
      rows.push({
        question: f.question,
        answer: f.answer,
        source: post.title,
        source_url: `${SITE}/blog/${post.slug}`,
        category: "blog",
      });
    }
  }

  const sectors = getAllSectors();
  const allPeriods = getAllPeriods();
  for (const sector of sectors) {
    for (const period of allPeriods) {
      const snapshot = sector.periods[period.slug];
      if (!snapshot?.faqs) continue;
      for (const f of snapshot.faqs) {
        rows.push({
          question: f.question,
          answer: f.answer,
          source: `${sector.name}, ${period.name}`,
          source_url: `${SITE}/startups-to-watch/${sector.slug}-${period.slug}`,
          category: "sector",
        });
      }
    }
  }

  for (const finding of RESEARCH_FINDINGS) {
    const q = finding.title.endsWith("?") ? finding.title : `${finding.title}?`;
    rows.push({
      question: q,
      answer: `${finding.claim} ${finding.why}`,
      source: `Research finding ${finding.section}`,
      source_url: `${SITE}/research/${finding.slug}`,
      category: "research",
    });
  }

  const header = ["question", "answer", "source", "source_url", "category"]
    .map(csvEscape)
    .join(",");
  const lines = [header];
  for (const r of rows) {
    lines.push(
      [r.question, r.answer, r.source, r.source_url, r.category]
        .map(csvEscape)
        .join(","),
    );
  }
  const body = lines.join("\n") + "\n";
  const period = getCurrentPeriod();

  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `inline; filename="vc-deal-flow-signal-qa-${period.slug}.csv"`,
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "X-Robots-Tag": "index, follow",
      "X-Dataset-License": "CC BY 4.0",
      "Link": `<${SITE}/qa.jsonl>; rel="alternate"; type="application/x-ndjson", <https://creativecommons.org/licenses/by/4.0/>; rel="license"`,
    },
  });
}
