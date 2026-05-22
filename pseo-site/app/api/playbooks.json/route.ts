import { playbooks } from "@/content/playbooks";
import { getDataLastModified } from "@/lib/data";

export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

/**
 * Full-content JSON corpus of every `/playbooks/{slug}` page.
 *
 * One request, every operator how-to in machine-readable form. Each entry
 * carries the same fields the page renders (TL;DR, body, steps with
 * timeRequired + toolUrl, prerequisites, tools, facts with sources, FAQs,
 * keywords). Built for RAG ingestion — agents that want to ground responses
 * in our playbook corpus can drop this into a vector store with one fetch.
 *
 * Mirrors the shape of /api/answers.json so consumers can reuse the same
 * ingest path for both corpora.
 */
export async function GET() {
  const lastModified = getDataLastModified();

  const body = {
    version: "1.0.0",
    name: "VC Deal Flow Signal — Playbook Corpus",
    description:
      "Operator how-tos for VC deal flow via GitHub signals. Reproducible, time-budgeted, step-by-step playbooks for operator-investors, scouts, solo founders, and angels. Each entry has a TL;DR, prerequisites, tools, ordered steps with per-step timeRequired and optional tool URLs, supporting facts with source URLs, and a FAQPage.",
    site: SITE,
    license: {
      identifier: "CC-BY-4.0",
      url: "https://creativecommons.org/licenses/by/4.0/",
    },
    citation:
      "VC Deal Flow Signal — Playbooks (signals.gitdealflow.com/playbooks).",
    lastModified: lastModified.toISOString(),
    count: playbooks.length,
    playbooks: playbooks.map((p) => ({
      slug: p.slug,
      url: `${SITE}/playbooks/${p.slug}`,
      title: p.h1,
      description: p.description,
      tldr: p.tldr,
      body: p.body,
      totalTime: p.totalTime,
      difficulty: p.difficulty,
      prerequisites: p.prerequisites,
      tools: p.tools,
      steps: p.steps.map((s) => ({
        name: s.name,
        text: s.text,
        timeRequired: s.timeRequired ?? null,
        toolUrl: s.toolUrl
          ? s.toolUrl.startsWith("http")
            ? s.toolUrl
            : `${SITE}${s.toolUrl}`
          : null,
        toolLabel: s.toolLabel ?? null,
      })),
      facts: p.facts,
      faqs: p.faqs,
      cta: { url: p.ctaUrl, label: p.ctaLabel },
      related: p.related.map((slug) => `${SITE}/playbooks/${slug}`),
      keywords: p.keywords,
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
