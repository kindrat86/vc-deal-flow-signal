/**
 * /api/diligence.json, agent diligence grounding endpoint.
 *
 * The questions an AI agent issues mid-diligence, "who acquired X",
 * "which funds backed Y", "what's the engineering signal on Z", answered
 * over our public-source entity corpus (acquirers + fund→portfolio +
 * companies) as a single citation-ready dossier.
 *
 * Pass `?company=` (alias `?q=` / `?entity=`). With no param, returns a
 * usage envelope listing the answerable universe so an agent can orient.
 *
 * Honesty: every fact carries a source URL; unknown facts are stated as
 * unknown, never invented. See lib/diligence.ts for the source threshold.
 *
 * Matches the CORS + CC-BY + schema.org conventions of /api/answer.
 */

import {
  buildDossier,
  dossierEnvelope,
  getAllDiligenceEntities,
  getDiligenceEntityCount,
  SITE,
} from "@/lib/diligence";
import { getDataLastModified } from "@/lib/data";

// Per-request: the answer depends on `?company=`, which Vercel's CDN does
// not include in its cache key by default (same rationale as /api/answer).
export const dynamic = "force-dynamic";

function corsHeaders() {
  return {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "public, max-age=0, must-revalidate",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "X-Robots-Tag": "index, follow",
    Link: `<${SITE}/diligence>; rel="alternate"; type="text/html", <${SITE}/api/diligence.json>; rel="self"`,
  };
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

function usageEnvelope() {
  const counts = getDiligenceEntityCount();
  return {
    _meta: {
      name: "VC Deal Flow Signal, Diligence Grounding API",
      description:
        "Public-source diligence dossiers keyed by company/entity name: M&A history (who acquired X), disclosed investors (which funds backed Y), and published engineering-acceleration signal (what's the signal on Z). Built for AI agents doing pre-investment or competitive diligence that prefer one cited JSON object over crawling HTML.",
      usage:
        'GET /api/diligence.json?company={name}  or  POST {"company":"..."}',
      examples: [
        `${SITE}/api/diligence.json?company=Figma`,
        `${SITE}/api/diligence.json?company=Supabase`,
        `${SITE}/api/diligence.json?company=Broadcom`,
      ],
      coverage: {
        trackedCompanies: counts.companies,
        acquirers: counts.acquirers,
        documentedAcquisitions: counts.acquisitions,
        fundsWithPortfolio: counts.funds,
        answerableEntities: counts.total,
      },
      sourceThreshold:
        "M&A + investor facts: public press release / SEC filing / both-sides-disclosed only. Signal: published v1 summary; recompute live via /predict.",
      humanPage: `${SITE}/diligence`,
      relatedEndpoints: {
        directAnswer: `${SITE}/api/answer?q={question}`,
        rankedAnswers: `${SITE}/api/ask?q={query}&limit={1-20}`,
        signals: `${SITE}/api/signals.json`,
        mcp: `${SITE}/api/mcp/rpc`,
        agentTools: `${SITE}/api/agent/tools`,
      },
      license: "https://creativecommons.org/licenses/by/4.0/",
      citation: "VC Deal Flow Signal (signals.gitdealflow.com), CC BY 4.0.",
    },
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "VC Deal Flow Signal, Diligence Grounding",
    answerableEntities: getAllDiligenceEntities(),
    isPartOf: { "@type": "WebSite", "@id": `${SITE}/#website`, url: SITE },
  };
}

function respond(query: string) {
  const asOf = getDataLastModified().toISOString().slice(0, 10);
  if (!query) {
    return new Response(JSON.stringify(usageEnvelope(), null, 2), {
      headers: corsHeaders(),
    });
  }
  const dossier = buildDossier(query);
  return new Response(
    JSON.stringify(dossierEnvelope(dossier, query, asOf), null, 2),
    { headers: corsHeaders(), status: dossier.found ? 200 : 404 },
  );
}

export function GET(request: Request) {
  const url = new URL(request.url);
  const query = (
    url.searchParams.get("company") ||
    url.searchParams.get("entity") ||
    url.searchParams.get("q") ||
    ""
  ).trim();
  return respond(query);
}

export async function POST(request: Request) {
  let body: { company?: string; entity?: string; q?: string } = {};
  try {
    body = await request.json();
  } catch {
    /* fall through to usage envelope */
  }
  const query = (body.company || body.entity || body.q || "").trim();
  return respond(query);
}
