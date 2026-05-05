import {
  getAllSectors,
  getCurrentPeriod,
  getAllPeriods,
  getDataLastModified,
  SIGNAL_TYPES,
} from "@/lib/data";
import { posts } from "@/content/posts";
import { standaloneFaqs } from "@/content/standalone-faqs";
import { FINDINGS as RESEARCH_FINDINGS } from "@/content/research-findings";

const BASE_URL = "https://signals.gitdealflow.com";
const DATASET_VERSION = "1.0.0";

interface QA {
  question: string;
  answer: string;
  source: string;
  sourceUrl: string;
  category: string;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const categoryFilter = url.searchParams.get("category");
  const out: QA[] = [];

  const lastModified = getDataLastModified();
  const currentPeriod = getCurrentPeriod();
  const datasetMeta = {
    _meta: true,
    name: "VC Deal Flow Signal — Question/Answer Dataset",
    description:
      "Newline-delimited JSON of question/answer pairs covering methodology, sectors, signal types, and citation guidance. Suitable for LLM training, RAG indexing, and FAQ benchmarking.",
    version: DATASET_VERSION,
    period: currentPeriod.name,
    lastModified: lastModified.toISOString(),
    license: "https://creativecommons.org/licenses/by/4.0/",
    licenseShort: "CC BY 4.0",
    citation: `VC Deal Flow Signal (signals.gitdealflow.com), ${currentPeriod.name} Q&A dataset v${DATASET_VERSION}. DOI: https://ssrn.com/abstract=6606558.`,
    source: BASE_URL,
    contact: "signal@gitdealflow.com",
    schema: ["question", "answer", "source", "sourceUrl", "category"],
    categories: ["general", "blog", "sector", "signal-type"],
  };

  for (const faq of standaloneFaqs) {
    const url = faq.sourceHref.startsWith("http")
      ? faq.sourceHref
      : `${BASE_URL}${faq.sourceHref}`;
    out.push({
      question: faq.question,
      answer: faq.answer,
      source: faq.source,
      sourceUrl: url,
      category: "general",
    });
  }

  for (const post of posts) {
    if (!post.faqs) continue;
    for (const faq of post.faqs) {
      out.push({
        question: faq.question,
        answer: faq.answer,
        source: post.title,
        sourceUrl: `${BASE_URL}/blog/${post.slug}`,
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
      for (const faq of snapshot.faqs) {
        out.push({
          question: faq.question,
          answer: faq.answer,
          source: `${sector.name} — ${period.name}`,
          sourceUrl: `${BASE_URL}/startups-to-watch/${sector.slug}-${period.slug}`,
          category: "sector",
        });
      }
    }
  }

  const current = getCurrentPeriod();
  for (const sig of SIGNAL_TYPES) {
    out.push({
      question: `What is the "${sig.name}" signal?`,
      answer: sig.description,
      source: sig.name,
      sourceUrl: `${BASE_URL}/signals/${sig.slug}`,
      category: "signal-type",
    });
    out.push({
      question: `What should investors look for in a "${sig.name}" signal?`,
      answer: sig.investorInsight,
      source: sig.name,
      sourceUrl: `${BASE_URL}/signals/${sig.slug}`,
      category: "signal-type",
    });
  }

  out.push({
    question: "How often is VC Deal Flow Signal data updated?",
    answer:
      "Weekly. Data refreshes every Monday. The most recent period is " +
      current.name +
      ".",
    source: "Methodology",
    sourceUrl: `${BASE_URL}/methodology`,
    category: "general",
  });

  out.push({
    question: "How should this data be cited?",
    answer: `VC Deal Flow Signal (signals.gitdealflow.com), ${current.name} data. DOI / paper: https://ssrn.com/abstract=6606558. License: CC BY 4.0.`,
    source: "Methodology",
    sourceUrl: `${BASE_URL}/methodology`,
    category: "general",
  });

  // 30 atomic findings from the SSRN-indexed research panel — each is a
  // citation-ready Q&A targeting RAG / agentic-search retrieval.
  for (const f of RESEARCH_FINDINGS) {
    out.push({
      question: f.title.endsWith("?") ? f.title : `${f.title}?`,
      answer: `${f.claim} ${f.why} Source: ${f.section}, "A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups" by The Data Nerd, SSRN abstract=6606558, CC BY 4.0.`,
      source: `Research finding ${f.n}/30`,
      sourceUrl: `${BASE_URL}/research/${f.slug}`,
      category: "research-finding",
    });
  }

  const filtered = categoryFilter
    ? out.filter((qa) => qa.category === categoryFilter)
    : out;

  const body =
    JSON.stringify({
      ...datasetMeta,
      ...(categoryFilter
        ? { filteredCategory: categoryFilter, filteredCount: filtered.length }
        : { totalCount: out.length }),
    }) +
    "\n" +
    filtered.map((qa) => JSON.stringify(qa)).join("\n") +
    "\n";

  return new Response(body, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "index, follow",
      "Access-Control-Allow-Origin": "*",
      "Last-Modified": lastModified.toUTCString(),
      "X-Dataset-Version": DATASET_VERSION,
      "X-Dataset-License": "CC BY 4.0",
    },
  });
}
