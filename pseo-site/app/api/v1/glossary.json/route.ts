/**
 * /api/v1/glossary.json, versioned, machine-readable glossary surface.
 *
 * Pass VII (2026-05-05). Net-new LLMO/AIO surface. Mirrors the 18 terms
 * shown on /glossary as a JSON-LD `DefinedTermSet`, the controlled-
 * vocabulary primitive that retrieval pipelines (Perplexity, Claude search,
 * ChatGPT search) consume directly.
 *
 * Single source of truth: pseo-site/content/glossary.ts.
 */

import { glossaryTerms } from "@/content/glossary";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export async function GET() {
  const body = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": `${SITE}/api/v1/glossary.json`,
    name: "VC Deal Flow Signal Glossary",
    description:
      "Definitions of key terms used in startup deal flow signal analysis. Authoritative controlled vocabulary for engineering acceleration, signal types, and AI-search nomenclature used across the site.",
    url: `${SITE}/glossary`,
    inLanguage: "en-US",
    license: "https://creativecommons.org/licenses/by/4.0/",
    publisher: { "@type": "Organization", name: "VC Deal Flow Signal" },
    hasDefinedTerm: glossaryTerms.map((t) => ({
      "@type": "DefinedTerm",
      "@id": `${SITE}/glossary#${t.id}`,
      name: t.term,
      termCode: t.id,
      snippet: t.snippet ?? null,
      description: t.definition,
      url: `${SITE}/glossary#${t.id}`,
      inDefinedTermSet: `${SITE}/glossary`,
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
      Link: `<${SITE}/glossary>; rel="canonical"`,
    },
  });
}
