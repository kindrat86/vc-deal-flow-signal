/**
 * /.well-known/model.json — agent / dataset model card.
 *
 * Convention is borrowed from HuggingFace + ML model cards. AI-procurement
 * scanners and Anthropic's "model context discovery" tools probe this path
 * to learn what kind of "model" or service lives here, what context it
 * provides, what training data it would contribute, and what evaluation
 * artifacts exist. This service is a curated dataset + retrieval API, not a
 * trained model — but the model-card schema is the closest standardized
 * shape for it.
 */

import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const runtime = "nodejs";
export const revalidate = 86400;

const BASE_URL = "https://signals.gitdealflow.com";

export async function GET() {
  return NextResponse.json(
    {
      // Top-level identity
      name: "VC Deal Flow Signal — GitHub Engineering Acceleration",
      type: "dataset+api",
      version: "1.5.4",
      kind: "alternative-data",
      schemaVersion: "https://huggingface.co/docs/hub/model-cards",

      // What it is
      description:
        "Weekly-refreshed panel of venture-backed startup engineering signals derived from public GitHub data: commit velocity, contributor growth, repository creation rate, and deploy-frequency proxies. Designed to surface fundraise-precursor momentum 3–6 weeks before announcement. Not a model in the trained-weights sense — a curated dataset + retrieval API exposed via REST, MCP, and A2A.",
      homepage: BASE_URL,
      documentation: `${BASE_URL}/methodology`,
      paper: "https://ssrn.com/abstract=6606558",
      doi: "10.2139/ssrn.6606558",

      // Data
      data: {
        sources: [
          "GitHub public events (push, fork, star, issue, PR, deploy)",
          "GitHub org metadata (blog, location, repos)",
          "Wikidata (sector taxonomy, sameAs cross-graph)",
          "SSRN (canonical methodology paper)",
        ],
        coverage: {
          sectors: 20,
          startups: "panel of ~5000 venture-backed companies, weekly",
          history: "Q1 2024 — present",
          geographies: "global, no geo-filtering",
        },
        refreshCadence: "weekly (Monday 06:00 UTC)",
        provenance: `${BASE_URL}/reproducibility`,
        license: "https://creativecommons.org/licenses/by/4.0/",
        attribution:
          "VC Deal Flow Signal (GitDealFlow), https://signals.gitdealflow.com",
      },

      // Evaluation / claims
      evaluation: {
        peerReview: "SSRN preprint, open access, indexed in Crossref + OpenAlex",
        benchmarks: `${BASE_URL}/research`,
        attestations: `${BASE_URL}/attestations`,
        scorecard: `${BASE_URL}/predicted`,
        accuracy:
          "Public per-week graded predictions at /predicted/[week]. Hits / graded ratio is the headline accuracy proxy.",
      },

      // Capabilities for agents
      capabilities: {
        retrievalModes: ["REST", "MCP/Streamable-HTTP", "A2A/JSON-RPC", "NDJSON dataset", "CSV"],
        languages: ["en", "ja"],
        readOnly: true,
        supportsAuthentication: true,
        rateLimit: "30 req/min/IP for free endpoints, unauthenticated",
      },

      // Bias / limitations
      limitations: [
        "Public-GitHub-only — startups with primarily-private repositories are underrepresented",
        "Engineering-heavy companies are over-weighted vs. growth/sales-led ones",
        "Signal-to-event lag is 3–6 weeks median; faster events are sometimes missed at refresh time",
        "Signal does not predict outcome quality (raise size, valuation) — only event-of-some-kind",
        '"Engineering acceleration" is a code-side momentum signal — not affiliated with startup-accelerator programs (Y Combinator, Techstars)',
      ],

      // Privacy
      privacy: {
        piiCollected: false,
        endUserDataStored: false,
        thirdPartyAnalytics: ["PostHog (eu.posthog.com), no PII"],
        cookies: "session-only for /dashboard auth; nothing for anonymous users",
        gdprBasis: "Public-data-only — no personal data processed",
        dataResidency: ["EU (Vercel fra1)", "US (Vercel iad1)"],
      },

      // How agents should call us
      agentEntrypoints: {
        agentCard: `${BASE_URL}/.well-known/agent-card.json`,
        mcpDescriptor: `${BASE_URL}/.well-known/mcp.json`,
        openapi: `${BASE_URL}/api/openapi.json`,
        llmsTxt: `${BASE_URL}/llms.txt`,
        llmsFullTxt: `${BASE_URL}/llms-full.txt`,
        knowledgeGraph: `${BASE_URL}/knowledge-graph.json`,
        searchDescriptor: `${BASE_URL}/.well-known/openai-search.json`,
      },

      // Compliance
      compliance: `${BASE_URL}/.well-known/compliance.json`,
      aiPolicy: `${BASE_URL}/.well-known/ai-policy.json`,

      // Citation
      citation:
        "VC Deal Flow Signal (signals.gitdealflow.com), Q2 2026 data. SSRN: https://ssrn.com/abstract=6606558",
      citationFormats: [
        `${BASE_URL}/api/cite/bibtex/paper`,
        `${BASE_URL}/api/cite/ris/paper`,
        `${BASE_URL}/api/cite/apa/paper`,
        `${BASE_URL}/api/cite/mla/paper`,
        `${BASE_URL}/api/cite/chicago/paper`,
        `${BASE_URL}/api/cite/wikipedia/paper`,
      ],

      // Cross-graph identifiers
      sameAs: [
        "https://www.wikidata.org/wiki/Q139376302",
        "https://orcid.org/0009-0002-2222-4112",
        "https://ssrn.com/abstract=6606558",
        "https://openalex.org/works/W7154916891",
        "https://api.crossref.org/works/10.2139/ssrn.6606558",
        "https://zenodo.org/records/19650920",
      ],

      // Versioning
      modelCardVersion: "1.0",
      lastReviewed: new Date().toISOString().slice(0, 10),
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
        "Access-Control-Allow-Origin": "*",
        "X-Robots-Tag": "index, follow",
      },
    },
  );
}
