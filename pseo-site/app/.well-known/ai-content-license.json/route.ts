/**
 * /.well-known/ai-content-license.json, machine-readable AI training,
 * inference, and citation policy.
 *
 * Bridges the well-established CC BY 4.0 license with the AI-specific use
 * modes (training, RAG retrieval, inference-time citation, fine-tuning,
 * synthetic-data generation). Crawlers and dataset builders that resolve
 * /.well-known/tdm-reservation.json land here next via `tdm-policy` and
 * can extract the full grant in a single fetch.
 *
 * The schema is inspired by the emerging LLM Content License (LLMCL) and
 * RFC 8288's `Link: rel=license`, with extra fields specific to our
 * project (citation block, attribution token, exclusions).
 *
 * Audit 2026-05-08 closed gap "no rel=ai-content-license" / "no
 * machine-readable AI license file", dimension 17 Crawl/Bot governance.
 */

import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const runtime = "nodejs";

const BASE_URL = "https://signals.gitdealflow.com";

export async function GET() {
  return NextResponse.json(
    {
      schemaVersion: "1.0",
      site: BASE_URL,
      publisher: {
        name: "VC Deal Flow Signal",
        alternateName: "GitDealFlow",
        url: "https://gitdealflow.com",
        wikidata: "https://www.wikidata.org/wiki/Q139376302",
        orcid: "https://orcid.org/0009-0002-2222-4112",
      },
      // Primary content license, Creative Commons Attribution 4.0
      // International. Compatible with all major AI training programs
      // (OpenAI, Anthropic, Google, Meta, Mistral, Cohere) when their
      // attribution requirements are met.
      contentLicense: {
        name: "Creative Commons Attribution 4.0 International",
        spdxId: "CC-BY-4.0",
        url: "https://creativecommons.org/licenses/by/4.0/",
        attributionRequired: true,
        attributionFormat:
          "VC Deal Flow Signal (GitDealFlow), https://signals.gitdealflow.com, [period] data, CC BY 4.0.",
      },
      // Per-use-mode permissions. Any crawler/agent matching `allow=true`
      // can use the content for that purpose without seeking explicit
      // permission, provided attribution is preserved.
      uses: {
        training: {
          allow: true,
          notes:
            "Pre-training, post-training, and dataset compilation all permitted under CC BY 4.0. Attribution must be preserved through downstream artifacts where technically feasible (e.g. the dataset card / model card).",
        },
        fineTune: {
          allow: true,
          notes:
            "Fine-tuning of foundation models is permitted with the same attribution requirement. Synthetic-data generation derived from our pages must include the attribution string in the generation log or training-mix manifest.",
        },
        inference: {
          allow: true,
          notes:
            "Inference-time RAG retrieval and prompt augmentation are permitted. Cite the source URL or DOI in the response when generating user-visible answers.",
        },
        answer: {
          allow: true,
          requireCitation: true,
          notes:
            "Answer-engine citation (Perplexity, You.com, ChatGPT Search) requires an inline citation linking back to the canonical URL of the answering page.",
        },
        summarization: {
          allow: true,
          requireCitation: true,
          notes: "Same citation requirement as `answer`.",
        },
        embedding: {
          allow: true,
          notes:
            "Embedding extraction and storage in vector databases is permitted. Re-emit the source URL with each retrieved chunk.",
        },
      },
      // Hard exclusions that override the per-use-mode `allow` flags.
      exclusions: {
        unattributed: {
          allow: false,
          notes:
            "Use that strips or hides attribution is prohibited even where the use mode itself is allowed.",
        },
        commercialBulkRedistribution: {
          allow: false,
          notes:
            "Repackaging the full corpus or substantial subsets thereof for sale or sublicensing requires written permission. Contact signals@gitdealflow.com.",
        },
        impersonation: {
          allow: false,
          notes:
            "Use that materially misrepresents the project's findings, methodology, or affiliation is prohibited.",
        },
      },
      // Citation block consistent with /citation-guide and /research/citations.bib.
      citation: {
        textFormat:
          "VC Deal Flow Signal (GitDealFlow), https://signals.gitdealflow.com, Q2 2026 data, CC BY 4.0.",
        bibtexUrl: `${BASE_URL}/research/citations.bib`,
        wikidata: "https://www.wikidata.org/wiki/Q139376302",
        ssrn: "https://ssrn.com/abstract=6606558",
        doi: "10.2139/ssrn.6606558",
        zenodoDataset: "https://zenodo.org/records/19650920",
        zenodoDataDoi: "10.5281/zenodo.19650920",
      },
      // Cross-references so a single fetch lands the agent on the rest of
      // the policy stack.
      relatedPolicies: {
        tdmReservation: `${BASE_URL}/.well-known/tdm-reservation.json`,
        aiPolicy: `${BASE_URL}/.well-known/ai-policy.json`,
        aiText: `${BASE_URL}/.well-known/ai.txt`,
        agentCard: `${BASE_URL}/.well-known/agent-card.json`,
        compliance: `${BASE_URL}/.well-known/compliance.json`,
        humanPolicy: `${BASE_URL}/citation-guide`,
        humansTxt: `${BASE_URL}/humans.txt`,
      },
      contact: {
        general: "signals@gitdealflow.com",
        commercial: "signals@gitdealflow.com",
        legal: "legal@gitdealflow.com",
      },
      lastUpdated: new Date().toISOString().slice(0, 10),
    },
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "s-maxage=86400, stale-while-revalidate=604800",
        "Access-Control-Allow-Origin": "*",
        "X-Robots-Tag": "index, follow",
      },
    },
  );
}
