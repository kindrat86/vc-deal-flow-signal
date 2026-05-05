import { agentQueries } from "@/content/agent-queries";
import { getDataLastModified } from "@/lib/data";

export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

/**
 * Full-content JSON corpus of every `/answers/{slug}` page.
 *
 * One request, every answer page in machine-readable form. Each entry carries
 * the same fields the page renders (TL;DR, body, facts with sources, FAQs,
 * keywords). Built for RAG ingestion — agents that want to ground responses
 * in our citation-tuned answers can drop this into a vector store with one
 * fetch.
 *
 * Companion to /api/answers.jsonl (newline-delimited variant) — both are
 * generated from the same source array.
 */
export async function GET() {
  const lastModified = getDataLastModified();

  const body = {
    version: "1.0.0",
    name: "VC Deal Flow Signal — Answer Corpus",
    description:
      "Citation-ready answers to common AI-agent and AI-search queries about VC deal flow, GitHub momentum, MCP servers, and engineering signals. Each entry has a TL;DR, supporting facts with source URLs, a long-form body, and a FAQPage.",
    site: SITE,
    license: {
      identifier: "CC-BY-4.0",
      url: "https://creativecommons.org/licenses/by/4.0/",
    },
    citation: "VC Deal Flow Signal — Answers (signals.gitdealflow.com/answers).",
    lastModified: lastModified.toISOString(),
    count: agentQueries.length,
    answers: agentQueries.map((q) => ({
      slug: q.slug,
      url: `${SITE}/answers/${q.slug}`,
      query: q.query,
      title: q.h1,
      description: q.description,
      tldr: q.tldr,
      body: q.body,
      facts: q.facts,
      faqs: q.faqs,
      cta: { url: q.ctaUrl, label: q.ctaLabel },
      related: q.related.map((slug) => `${SITE}/answers/${slug}`),
      keywords: q.keywords,
    })),
  };

  return Response.json(body, {
    headers: {
      "Cache-Control":
        "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800",
      "Access-Control-Allow-Origin": "*",
      "X-Robots-Tag": "index, follow",
    },
  });
}
