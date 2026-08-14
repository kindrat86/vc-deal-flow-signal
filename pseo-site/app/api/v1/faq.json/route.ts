/**
 * /api/v1/faq.json, versioned, machine-readable FAQ surface.
 *
 * Pass VII (2026-05-05). Net-new LLMO/AEO surface. Mirrors the 100+ Q&A
 * pairs from /content/standalone-faqs.ts as a JSON-LD `FAQPage`.
 * Companion to /qa.jsonl (NDJSON stream, intended for fine-tuning) and
 * /qa.json (lighter snapshot). The FAQ shape is what AI Overviews +
 * featured snippets parse for People-Also-Ask.
 *
 * Single source of truth: pseo-site/content/standalone-faqs.ts.
 */

import { standaloneFaqs } from "@/content/standalone-faqs";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export async function GET() {
  const body = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE}/api/v1/faq.json`,
    name: "VC Deal Flow Signal, FAQ",
    description:
      "Frequently asked questions about VC Deal Flow Signal: methodology, pricing, data sources, signal types, agent integrations, and citation policy.",
    url: `${SITE}/faq`,
    inLanguage: "en-US",
    license: "https://creativecommons.org/licenses/by/4.0/",
    publisher: { "@type": "Organization", name: "VC Deal Flow Signal" },
    mainEntity: standaloneFaqs.map((q, i) => ({
      "@type": "Question",
      "@id": `${SITE}/faq#q${i + 1}`,
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
        url: q.sourceHref.startsWith("http")
          ? q.sourceHref
          : `${SITE}${q.sourceHref}`,
        citation: q.source,
      },
    })),
    citation:
      "VC Deal Flow Signal (signals.gitdealflow.com), Q2 2026 data. SSRN: 6606558.",
  };

  return new Response(JSON.stringify(body, null, 2), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control":
        "public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200",
      Link: `<${SITE}/faq>; rel="canonical"`,
    },
  });
}
