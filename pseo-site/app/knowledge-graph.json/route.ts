/**
 * /knowledge-graph.json, single canonical entity graph for the project.
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
import { getAllMarkets } from "@/lib/markets";

export const dynamic = "force-static";
export const revalidate = 86400;

const SITE = "https://signals.gitdealflow.com";
const APEX = "https://gitdealflow.com";
const SSRN = "https://ssrn.com/abstract=6606558";
const DOI = "10.2139/ssrn.6606558";

/**
 * Six-step methodology, mirrored from /api/v1/methodology.json. Kept
 * inline here so the master graph resolves in one fetch (the F25 contract
 * is "agents pull this once, trust everything").
 */
const METHODOLOGY_STEPS: Array<{ name: string; text: string; anchor: string }> =
  [
    {
      name: "Sector universe selection",
      text: "Curate 15 active startup sectors from public GitHub topic clusters (five legacy clusters archived at Q2 2026); each sector has a manually curated allowlist of 50-500 public GitHub orgs/repos.",
      anchor: "sectors",
    },
    {
      name: "Data collection",
      text: "Query the public GitHub REST API every Monday morning for commits, contributors, repo metadata, and topic labels. Polite rate-limited fetch, append-only Parquet storage, never mutate prior weeks.",
      anchor: "collection",
    },
    {
      name: "Commit velocity computation",
      text: "For each tracked startup, count commits in the trailing 14-day window. Compute commit velocity change as percent delta vs the prior 14-day window. Primary ranking signal.",
      anchor: "velocity",
    },
    {
      name: "Signal classification",
      text: "Classify each accelerating startup into one of four signal types (Engineering Hiring Burst, Infrastructure Buildout, Deploy Frequency Spike, Framework Migration) via rule-based decision logic.",
      anchor: "classification",
    },
    {
      name: "Weekly ranking",
      text: "Sort all accelerating startups by commit velocity change, partition by sector, and generate the weekly Top-100 ranking. Cross-publish to /predicted/{week}, sector pages, and /api/v1/signals.json.",
      anchor: "ranking",
    },
    {
      name: "Validation & track record",
      text: "When a tracked startup announces a fundraise, log the lead time between the engineering signal and the announcement. Empirical median lead time across 2024-2025 backtests: 4 weeks.",
      anchor: "validation",
    },
  ];

export async function GET() {
  const lastModified = getDataLastModified().toISOString();

  const graph = {
    "@context": [
      "https://schema.org",
      { dcat: "http://www.w3.org/ns/dcat#", dcterms: "http://purl.org/dc/terms/" },
    ],
    "@id": `${SITE}/knowledge-graph.json`,
    "@type": "DataCatalog",
    name: "VC Deal Flow Signal, Canonical Knowledge Graph",
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
        // Brunson Audit V8 (2026-05-09), Knowledge Panel claim. Pairs with
        // /.well-known/wikidata.json + /wikidata page + RootIdentitySchema
        // identifier block. additionalType=Q4830453 (business).
        additionalType: "https://www.wikidata.org/wiki/Q4830453",
        identifier: [
          {
            "@type": "PropertyValue",
            propertyID: "wikidata",
            value: "Q139376302",
            url: "https://www.wikidata.org/wiki/Q139376302",
          },
        ],
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${SITE}/wikidata`,
          url: `${SITE}/wikidata`,
        },
        name: "VC Deal Flow Signal",
        legalName: "VC Deal Flow Signal (GitDealFlow)",
        alternateName: ["GitDealFlow", "VC Deal Flow Signal (GitDealFlow)"],
        url: APEX,
        foundingDate: "2025",
        email: "signals@gitdealflow.com",
        sameAs: [
          "https://www.wikidata.org/wiki/Q139376302",
          "https://www.crunchbase.com/organization/gitdealflow",
          "https://www.linkedin.com/company/gitdealflow",
          "https://t.me/gitdealflow",
          "https://github.com/kindrat86/mcp-deal-flow-signal",
          "https://www.npmjs.com/package/@gitdealflow/mcp-signal",
          "https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn",
          "https://www.producthunt.com/products/vc-deal-flow-signal",
          "https://www.g2.com/products/vc-deal-flow-signal/reviews",
          "https://alternativeto.net/software/vc-deal-flow-signal/",
          "https://maps.google.com/?cid=6048369014916179204",
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
          "https://github.com/kindrat86",
          "https://news.ycombinator.com/user?id=the_data_nerd",
          "https://www.indiehackers.com/The_Data_Nerd",
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
        name: "VC Deal Flow Signal, Startup Engineering Acceleration Dataset",
        url: SITE,
        identifier: SITE,
        sameAs: [
          "https://www.kaggle.com/datasets/thedatanerd2026/vc-deal-flow-signal",
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
          "A quantitative, code-side momentum signal computed from public GitHub data: rolling 14-day commit velocity, contributor growth, and repository expansion. Distinct from startup accelerator programs (Y Combinator, Techstars, etc.), refers to engineering velocity, not cohort-based mentorship.",
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
      // ─── Methodology (HowTo), F25 ────────────────────────────────────────
      {
        "@type": "HowTo",
        "@id": `${SITE}/methodology#howto`,
        name: "How VC Deal Flow Signal classifies engineering acceleration",
        description:
          "Step-by-step methodology for tracking startup engineering momentum using public GitHub data, from data collection through signal classification, weekly ranking, and validation.",
        url: `${SITE}/methodology`,
        inLanguage: "en-US",
        license: "https://creativecommons.org/licenses/by/4.0/",
        publisher: { "@id": `${APEX}/#organization` },
        author: { "@id": `${SITE}/about#person` },
        dateModified: lastModified,
        totalTime: "PT60M",
        isBasedOn: { "@id": SSRN },
        sameAs: `${SITE}/api/v1/methodology.json`,
        step: METHODOLOGY_STEPS.map((s, i) => ({
          "@type": "HowToStep",
          "@id": `${SITE}/methodology#${s.anchor}`,
          position: i + 1,
          name: s.name,
          text: s.text,
          url: `${SITE}/methodology#${s.anchor}`,
        })),
      },
      // ─── Prediction markets (ItemList of CreativeWork), F25 ──────────────
      {
        "@type": "ItemList",
        "@id": `${SITE}/markets#list`,
        name: "VC Deal Flow Signal, Open Prediction Markets",
        description:
          "Seeded prediction markets on startup funding events, derived from GitHub commit-velocity signals. Implied odds are model output over a public candidate set, not investment advice.",
        url: `${SITE}/markets`,
        numberOfItems: getAllMarkets().length,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        provider: { "@id": `${APEX}/#organization` },
        license: "https://creativecommons.org/licenses/by/4.0/",
        isBasedOn: { "@id": `${SITE}/methodology#howto` },
        itemListElement: getAllMarkets().map((m, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE}/markets/${m.slug}`,
          item: {
            "@type": "CreativeWork",
            "@id": `${SITE}/markets/${m.slug}#market`,
            additionalType: "https://schema.org/Question",
            name: m.shortName,
            headline: m.question,
            url: `${SITE}/markets/${m.slug}`,
            about: m.category,
            datePublished: m.openedOn,
            expires: m.resolvesOn,
            inLanguage: "en-US",
            license: "https://creativecommons.org/licenses/by/4.0/",
            creator: { "@id": `${APEX}/#organization` },
            isBasedOn: { "@id": `${SITE}/methodology#howto` },
            mainEntity: {
              "@type": "Question",
              name: m.question,
              text: m.resolverNote,
              suggestedAnswer: m.candidates.map((c) => ({
                "@type": "Answer",
                text: c.displayName,
                upvoteCount: Math.round(c.impliedProbability * 1000),
                url: c.websiteUrl,
              })),
            },
          },
        })),
      },
      // ─── MCP server (SoftwareApplication), F25 cross-link ────────────────
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE}/#mcp-server`,
        name: "@gitdealflow/mcp-signal",
        applicationCategory: "DeveloperApplication",
        applicationSubCategory: "MCPServer",
        operatingSystem: "Cross-platform",
        url: `${SITE}/.well-known/mcp.json`,
        downloadUrl:
          "https://www.npmjs.com/package/@gitdealflow/mcp-signal",
        sameAs: [
          "https://www.npmjs.com/package/@gitdealflow/mcp-signal",
          "https://smithery.ai/servers/kindrat86/mcp-deal-flow-signal",
          "https://glama.ai/mcp/servers/kindrat86/mcp-deal-flow-signal",
          "https://github.com/kindrat86/mcp-deal-flow-signal",
        ],
        publisher: { "@id": `${APEX}/#organization` },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "EUR",
          eligibleTransactionVolume: {
            "@type": "PriceSpecification",
            description:
              "Six free tools + one paid tool (get_deep_signal, €0.19/call via x402 USDC).",
          },
        },
      },
      // ─── Periodical (the weekly Acceleration Watch), F25 cross-link ──────
      {
        "@type": "Periodical",
        "@id": `${SITE}/predicted#periodical`,
        name: "Acceleration Watch",
        alternateName: "VC Deal Flow Signal Weekly",
        url: `${SITE}/predicted`,
        issn: "Pending",
        publisher: { "@id": `${APEX}/#organization` },
        inLanguage: "en-US",
        license: "https://creativecommons.org/licenses/by/4.0/",
        isBasedOn: { "@id": `${SITE}/methodology#howto` },
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
          `${SITE}/api/v1/methodology.json`,
          `${SITE}/api/mcp/rpc`,
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
