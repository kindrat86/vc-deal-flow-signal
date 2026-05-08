/**
 * /.well-known/tdm-reservation.json — W3C TDM Reservation Protocol manifest.
 *
 * Implements the EU Digital Services Act / Copyright Directive Article 4
 * machine-readable opt-out mechanism for text-and-data-mining (TDM). The
 * file lives at the well-known path so any TDM crawler that respects the
 * protocol can resolve our policy in a single GET before processing site
 * content.
 *
 * Format follows W3C TDM Reservation Protocol Community Group spec
 * (https://w3id.org/tdmrep). The contract is:
 *
 *   tdm-reservation: 0  → no reservation (TDM allowed under tdm-policy)
 *   tdm-reservation: 1  → reserved (TDM disallowed without explicit license)
 *
 * Our position: we allow TDM under CC BY 4.0 with attribution, so we set
 * `tdm-reservation: 0` and point `tdm-policy` at the machine-readable AI
 * content license at /.well-known/ai-content-license.json. Crawlers
 * unfamiliar with our policy URL fall back to the human-readable HTML
 * page at /citation-guide via the `humanPolicy` field.
 *
 * Audit 2026-05-08 closed gap "no TDM Reservation Protocol" — closes
 * dimension 17 Crawl/Bot governance from 94 toward 99.
 */

import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const runtime = "nodejs";

const BASE_URL = "https://signals.gitdealflow.com";

export async function GET() {
  return NextResponse.json(
    {
      // W3C TDM Reservation Protocol v1.0 vocabulary.
      "@context": "https://w3id.org/tdmrep/v0.6",
      // 0 = TDM allowed under tdm-policy. We don't reserve our content from
      // TDM; we only require attribution per CC BY 4.0.
      "tdm-reservation": 0,
      // Machine-readable license that any TDM crawler can fetch to learn
      // attribution requirements, permitted use modes, and exclusions.
      "tdm-policy": `${BASE_URL}/.well-known/ai-content-license.json`,
      // Human-readable policy reachable from the same domain — useful for
      // auditors and lawyers reviewing our position outside of automated
      // crawls.
      humanPolicy: `${BASE_URL}/citation-guide`,
      // Cross-link the broader AI policy file so a single TDM probe maps
      // back into the rest of our policy stack (ai.txt, ai-policy.json,
      // openai-search.json, agent-card.json).
      relatedPolicies: {
        aiPolicy: `${BASE_URL}/.well-known/ai-policy.json`,
        aiText: `${BASE_URL}/.well-known/ai.txt`,
        agentCard: `${BASE_URL}/.well-known/agent-card.json`,
        license: `${BASE_URL}/.well-known/ai-content-license.json`,
        compliance: `${BASE_URL}/.well-known/compliance.json`,
      },
      site: BASE_URL,
      lastUpdated: new Date().toISOString().slice(0, 10),
    },
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        // Long cache — policy rarely changes. SWR keeps clients warm if it
        // does, without making them wait on a revalidation request.
        "Cache-Control": "s-maxage=86400, stale-while-revalidate=604800",
        "Access-Control-Allow-Origin": "*",
        // The file itself is meant to be indexed so policy auditors can find
        // it via search engines, not just direct crawls.
        "X-Robots-Tag": "index, follow",
      },
    },
  );
}
