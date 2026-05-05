/**
 * /.well-known/dataset.json — DCAT 3 (W3C) dataset descriptor.
 * https://www.w3.org/TR/vocab-dcat-3/
 *
 * Lets data-aware crawlers (research aggregators, RAG indexers, dataset
 * search engines like Google Dataset Search and Hugging Face Datasets)
 * resolve every machine-readable surface in one fetch.
 */

import { getDataLastModified, getCurrentPeriod } from "@/lib/data";

export const dynamic = "force-static";

const SITE = "https://signals.gitdealflow.com";
const APEX = "https://gitdealflow.com";

export async function GET() {
  const modified = getDataLastModified().toISOString();
  const period = getCurrentPeriod();

  const dcat = {
    "@context": {
      "@vocab": "http://www.w3.org/ns/dcat#",
      dct: "http://purl.org/dc/terms/",
      foaf: "http://xmlns.com/foaf/0.1/",
      schema: "https://schema.org/",
      adms: "http://www.w3.org/ns/adms#",
    },
    "@type": "Catalog",
    "@id": `${SITE}/.well-known/dataset.json`,
    "dct:title": "VC Deal Flow Signal — Open Data Catalog",
    "dct:description":
      "Machine-readable dataset surfaces published by VC Deal Flow Signal: question/answer corpus, full signal panel, methodology, OpenAPI 3.1 spec, MCP descriptor, A2A agent card. All open, CC BY 4.0.",
    "dct:publisher": {
      "@type": "foaf:Organization",
      "@id": `${APEX}/#organization`,
      name: "VC Deal Flow Signal",
      "schema:alternateName": "GitDealFlow",
      url: APEX,
      "schema:sameAs": [
        "https://www.wikidata.org/wiki/Q139376302",
        "https://orcid.org/0009-0002-2222-4112",
      ],
    },
    "dct:issued": "2026-04-19",
    "dct:modified": modified,
    "dct:license": "https://creativecommons.org/licenses/by/4.0/",
    "dct:rights": "CC BY 4.0",
    "dct:language": "en-US",
    dataset: [
      {
        "@type": "Dataset",
        "@id": `${SITE}/api/dataset.jsonl`,
        "dct:title": "VC Deal Flow Signal — Full Signal Panel (NDJSON)",
        "dct:description":
          "Complete longitudinal panel of GitHub engineering signals across all tracked sectors and periods. Newline-delimited JSON. Same content set as the SSRN paper (abstract=6606558).",
        "dct:identifier": "vcdfs-panel-ndjson",
        "dct:issued": "2026-04-19",
        "dct:modified": modified,
        "dct:license": "https://creativecommons.org/licenses/by/4.0/",
        "dct:accrualPeriodicity": "http://purl.org/cld/freq/weekly",
        keyword: [
          "venture capital",
          "alternative data",
          "GitHub",
          "engineering velocity",
          "startup analytics",
          "panel data",
        ],
        distribution: [
          {
            "@type": "Distribution",
            "dct:title": "NDJSON",
            accessURL: `${SITE}/api/dataset.jsonl`,
            downloadURL: `${SITE}/api/dataset.jsonl`,
            mediaType: "application/x-ndjson",
            "dct:format": "application/x-ndjson",
          },
          {
            "@type": "Distribution",
            "dct:title": "CSV",
            accessURL: `${SITE}/api/signals.csv`,
            downloadURL: `${SITE}/api/signals.csv`,
            mediaType: "text/csv",
            "dct:format": "text/csv",
          },
          {
            "@type": "Distribution",
            "dct:title": "JSON",
            accessURL: `${SITE}/api/signals.json`,
            mediaType: "application/json",
            "dct:format": "application/json",
          },
        ],
        landingPage: `${SITE}/data-sources`,
        "dct:isReferencedBy": [
          "https://ssrn.com/abstract=6606558",
          "https://openalex.org/works/W7154916891",
          "https://zenodo.org/records/19650920",
        ],
        "dct:temporal": period.name,
      },
      {
        "@type": "Dataset",
        "@id": `${SITE}/qa.jsonl`,
        "dct:title": "VC Deal Flow Signal — Q&A Corpus",
        "dct:description":
          "Self-contained question/answer pairs covering methodology, sectors, signal types, and citation guidance. Suitable for LLM training, RAG indexing, FAQ benchmarking.",
        "dct:identifier": "vcdfs-qa-corpus",
        "dct:license": "https://creativecommons.org/licenses/by/4.0/",
        "dct:modified": modified,
        keyword: ["FAQ", "Q&A", "RAG", "LLM training", "answer engine"],
        distribution: [
          {
            "@type": "Distribution",
            "dct:title": "NDJSON",
            downloadURL: `${SITE}/qa.jsonl`,
            mediaType: "application/x-ndjson",
          },
          {
            "@type": "Distribution",
            "dct:title": "CSV",
            downloadURL: `${SITE}/qa.csv`,
            mediaType: "text/csv",
          },
        ],
        landingPage: `${SITE}/answers`,
      },
      {
        "@type": "DataService",
        "@id": `${SITE}/api/openapi.json`,
        "dct:title": "VC Deal Flow Signal — OpenAPI 3.1 Spec",
        "dct:description":
          "OpenAPI 3.1 description of the public read-only API endpoints, suitable for client codegen and agent tool registration.",
        endpointURL: `${SITE}/api`,
        endpointDescription: `${SITE}/api/openapi.json`,
        "dct:format": "application/json",
      },
      {
        "@type": "DataService",
        "@id": `${SITE}/.well-known/mcp.json`,
        "dct:title": "VC Deal Flow Signal — MCP Server Descriptor",
        "dct:description":
          "Model Context Protocol descriptor. The corresponding npm package is @gitdealflow/mcp-signal; the same surface is mirrored over Streamable HTTP at /api/mcp/rpc.",
        endpointURL: `${SITE}/api/mcp/rpc`,
      },
      {
        "@type": "DataService",
        "@id": `${SITE}/.well-known/agent-card.json`,
        "dct:title": "VC Deal Flow Signal — A2A AgentCard",
        "dct:description":
          "Google Agent-to-Agent (A2A) AgentCard descriptor; JSON-RPC endpoint at /api/a2a.",
        endpointURL: `${SITE}/api/a2a`,
      },
    ],
    themeTaxonomy: [
      "https://www.wikidata.org/wiki/Q1378470",
      "https://www.wikidata.org/wiki/Q205663",
      "https://www.wikidata.org/wiki/Q364",
    ],
    "schema:citation": "https://ssrn.com/abstract=6606558",
  };

  return new Response(JSON.stringify(dcat, null, 2), {
    headers: {
      "Content-Type": "application/ld+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "X-Robots-Tag": "index, follow",
      "Link": `<https://creativecommons.org/licenses/by/4.0/>; rel="license"`,
    },
  });
}
