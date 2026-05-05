/**
 * /knowledge-graph.json — single canonical entity graph for the project.
 *
 * Aggregates every authoritative cross-reference (Wikidata, ORCID, SSRN,
 * OpenAlex, Crossref, Semantic Scholar, DataCite, Zenodo, Kaggle, npm,
 * GitHub, social, directory listings) into one machine-readable JSON-LD
 * document. Mirrors the human page at /citations.
 *
 * AI retrieval engines that build local entity stores can fetch this once
 * and resolve any reference to "VC Deal Flow Signal", "GitDealFlow",
 * "engineering acceleration", or "The Data Nerd" without crawling.
 */

import { getDataLastModified } from "@/lib/data";
import { FINDINGS } from "@/content/research-findings";

export const dynamic = "force-static";
export const revalidate = 86400;

const SITE = "https://signals.gitdealflow.com";
const APEX = "https://gitdealflow.com";
const SSRN = "https://ssrn.com/abstract=6606558";
const DOI = "10.2139/ssrn.6606558";

export async function GET() {
  const lastModified = getDataLastModified().toISOString();

  const graph = {
    "@context": [
      "https://schema.org",
      { dcat: "http://www.w3.org/ns/dcat#", dcterms: "http://purl.org/dc/terms/" },
    ],
    "@id": `${SITE}/knowledge-graph.json`,
    "@type": "DataCatalog",
    name: "VC Deal Flow Signal — Canonical Knowledge Graph",
    description:
      "Single authoritative entity graph for VC Deal Flow Signal (GitDealFlow). Resolves the brand, founder, methodology paper, dataset, and product into one machine-readable document with every cross-reference (Wikidata, ORCID, SSRN, OpenAlex, Crossref, Semantic Scholar, DataCite, Zenodo, Kaggle, npm).",
    url: `${SITE}/knowledge-graph.json`,
    license: "https://creativecommons.org/licenses/by/4.0/",
    dateModified: lastModified,
    inLanguage: "en-US",
    "@graph": [
      // ─── Brand entity ─────────────────────────────────────────────────────
      {
        "@type": "Organization",
        "@id": `${APEX}/#organization`,
        name: "VC Deal Flow Signal",
        legalName: "VC Deal Flow Signal (GitDealFlow)",
        alternateName: ["GitDealFlow", "VC Deal Flow Signal (GitDealFlow)"],
        url: APEX,
        foundingDate: "2025",
        email: "signal@gitdealflow.com",
        sameAs: [
          "https://www.wikidata.org/wiki/Q139376302",
          "https://www.crunchbase.com/organization/gitdealflow",
          "https://www.linkedin.com/company/gitdealflow",
          "https://x.com/data_nerd",
          "https://t.me/gitdealflow",
          "https://github.com/kindrat86/mcp-deal-flow-signal",
          "https://www.npmjs.com/package/@gitdealflow/mcp-signal",
          "https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn",
          "https://www.producthunt.com/products/vc-deal-flow-signal",
          "https://www.g2.com/products/vc-deal-flow-signal/reviews",
          "https://www.saashub.com/vc-deal-flow-signal",
          "https://alternativeto.net/software/vc-deal-flow-signal/",
        ],
        knowsAbout: [
          "GitHub commit velocity",
          "venture capital alternative data",
          "code-side momentum signals",
          "startup engineering acceleration",
        ],
      },
      // ─── Founder ──────────────────────────────────────────────────────────
      {
        "@type": "Person",
        "@id": `${SITE}/about#person`,
        name: "The Data Nerd",
        jobTitle: "Founder, VC Deal Flow Signal",
        worksFor: { "@id": `${APEX}/#organization` },
        identifier: [
          {
            "@type": "PropertyValue",
            propertyID: "ORCID",
            value: "0009-0002-2222-4112",
            url: "https://orcid.org/0009-0002-2222-4112",
          },
        ],
        sameAs: [
          "https://orcid.org/0009-0002-2222-4112",
          "https://x.com/data_nerd",
          "https://github.com/kindrat86",
          "https://news.ycombinator.com/user?id=the_data_nerd",
          "https://www.indiehackers.com/The_Data_Nerd",
          "https://dev.to/the_data_nerd",
        ],
      },
      // ─── Methodology paper (SSRN) ─────────────────────────────────────────
      {
        "@type": "ScholarlyArticle",
        "@id": SSRN,
        headline:
          "A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups",
        name: "A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups",
        url: SSRN,
        identifier: [
          { "@type": "PropertyValue", propertyID: "DOI", value: DOI },
          {
            "@type": "PropertyValue",
            propertyID: "OpenAlex",
            value: "W7154916891",
          },
          {
            "@type": "PropertyValue",
            propertyID: "SSRN",
            value: "6606558",
          },
        ],
        sameAs: [
          SSRN,
          `https://api.crossref.org/works/${DOI}`,
          "https://openalex.org/works/W7154916891",
          "https://www.semanticscholar.org/paper/A-Longitudinal-Panel-of-GitHub-Engineering-Velocity",
          "https://zenodo.org/records/19650920",
          `https://commons.datacite.org/doi.org/${DOI}`,
        ],
        author: { "@id": `${SITE}/about#person` },
        publisher: { "@id": `${APEX}/#organization` },
        license: "https://creativecommons.org/licenses/by/4.0/",
        hasPart: FINDINGS.map((f) => ({
          "@type": "ScholarlyArticle",
          "@id": `${SITE}/research/${f.slug}#article`,
          name: f.title,
          url: `${SITE}/research/${f.slug}`,
        })),
      },
      // ─── Dataset ──────────────────────────────────────────────────────────
      {
        "@type": "Dataset",
        "@id": `${SITE}/#dataset`,
        name: "VC Deal Flow Signal — Startup Engineering Acceleration Dataset",
        url: SITE,
        identifier: SITE,
        sameAs: [
          "https://kaggle.com/datasets/thedatanerd/vc-deal-flow-signal",
          "https://zenodo.org/records/19650920",
        ],
        license: "https://creativecommons.org/licenses/by/4.0/",
        creator: { "@id": `${APEX}/#organization` },
        publisher: { "@id": `${APEX}/#organization` },
        isBasedOn: { "@id": SSRN },
        distribution: [
          {
            "@type": "DataDownload",
            encodingFormat: "text/csv",
            contentUrl: `${SITE}/api/signals.csv`,
          },
          {
            "@type": "DataDownload",
            encodingFormat: "application/json",
            contentUrl: `${SITE}/api/signals.json`,
          },
          {
            "@type": "DataDownload",
            encodingFormat: "application/x-ndjson",
            contentUrl: `${SITE}/api/dataset.jsonl`,
          },
          {
            "@type": "DataDownload",
            encodingFormat: "application/x-ndjson",
            contentUrl: `${SITE}/qa.jsonl`,
          },
        ],
      },
      // ─── Product ──────────────────────────────────────────────────────────
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE}/#software`,
        name: "VC Deal Flow Signal Dashboard",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        url: `${SITE}/dashboard`,
        publisher: { "@id": `${APEX}/#organization` },
        sameAs: [
          "https://www.npmjs.com/package/@gitdealflow/mcp-signal",
          "https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn",
        ],
      },
      // ─── DefinedTerm ──────────────────────────────────────────────────────
      {
        "@type": "DefinedTerm",
        "@id": `${SITE}/glossary#engineering-acceleration`,
        name: "engineering acceleration",
        description:
          "A quantitative, code-side momentum signal computed from public GitHub data: rolling 14-day commit velocity, contributor growth, and repository expansion. Distinct from startup accelerator programs (Y Combinator, Techstars, etc.) — refers to engineering velocity, not cohort-based mentorship.",
        inDefinedTermSet: { "@id": `${SITE}/glossary` },
        url: `${SITE}/glossary#engineering-acceleration`,
        isBasedOn: { "@id": SSRN },
      },
      {
        "@type": "DefinedTerm",
        "@id": `${SITE}/glossary#commit-velocity`,
        name: "commit velocity (14-day)",
        description:
          "Total commits to an organization's most active public repository over a rolling 14-day observation window. Primary unit of GitHub momentum used by VC Deal Flow Signal.",
        inDefinedTermSet: { "@id": `${SITE}/glossary` },
        url: `${SITE}/glossary#commit-velocity`,
      },
      // ─── Discovery surfaces ───────────────────────────────────────────────
      {
        "@type": "WebAPI",
        "@id": `${SITE}/#api`,
        name: "VC Deal Flow Signal Public API",
        url: `${SITE}/api`,
        documentation: `${SITE}/.well-known/api-catalog`,
        provider: { "@id": `${APEX}/#organization` },
        endpointURL: [
          `${SITE}/api/answer`,
          `${SITE}/api/ask`,
          `${SITE}/api/dataset.jsonl`,
          `${SITE}/api/signals.json`,
          `${SITE}/api/signals.csv`,
          `${SITE}/api/llms-search`,
          `${SITE}/api/nlweb`,
          `${SITE}/api/openapi.json`,
        ],
        license: "https://creativecommons.org/licenses/by/4.0/",
      },
    ],
  };

  return new Response(JSON.stringify(graph, null, 2), {
    headers: {
      "Content-Type": "application/ld+json; charset=utf-8",
      "Cache-Control": "s-maxage=86400, stale-while-revalidate=604800",
      "Access-Control-Allow-Origin": "*",
      "X-Robots-Tag": "index, follow",
      Link: `<${SITE}/.well-known/dataset.json>; rel="describedby", <${SITE}/citations>; rel="canonical"`,
    },
  });
}
