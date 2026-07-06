/**
 * /api/v1/glossary.jsonl — NDJSON dump of the VC Deal Flow Signal
 * controlled vocabulary, one term per line.
 *
 * Sibling to /api/v1/glossary.json (which is a single JSON object). The
 * NDJSON form is the canonical input for HuggingFace Datasets, retrieval
 * pipelines that stream by line, and any RAG harness that scores each
 * term independently.
 *
 * Each line carries the same fields as /api/v1/glossary.json plus a
 * `url` field pointing at the term's dedicated page at /define/[id] so
 * the line itself is a complete citation unit.
 *
 * CC BY 4.0 — attribution requested per /citation-guide.
 */

import { glossaryTerms } from "@/content/glossary";
import {
  CATEGORY_META,
  getCategoryFor,
  getSignalPrimitiveSlug,
} from "@/lib/glossary-categories";

export const dynamic = "force-dynamic";

const SITE = "https://signals.gitdealflow.com";

export async function GET() {
  const lines = glossaryTerms.map((t) => {
    const category = getCategoryFor(t.id);
    const signalSlug = getSignalPrimitiveSlug(t.id);
    return JSON.stringify({
      id: t.id,
      term: t.term,
      definition: t.definition,
      category: category,
      category_label: CATEGORY_META[category].label,
      url: `${SITE}/define/${t.id}`,
      glossary_anchor: `${SITE}/glossary#${t.id}`,
      signal_primitive_url: signalSlug
        ? `${SITE}/signals/define/${signalSlug}`
        : null,
      license: "CC-BY-4.0",
      source: "VC Deal Flow Signal",
      source_url: "https://signals.gitdealflow.com",
      cite_as: `The Data Nerd. "${t.term}." VC Deal Flow Signal Glossary, ${SITE}/define/${t.id}.`,
    });
  });

  const body = lines.join("\n") + "\n";

  return new Response(body, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "s-maxage=86400, stale-while-revalidate=604800",
      "X-Robots-Tag": "index, follow",
      Link: `<${SITE}/api/v1/glossary.jsonl>; rel="canonical"`,
      "Access-Control-Allow-Origin": "*",
    },
  });
}
