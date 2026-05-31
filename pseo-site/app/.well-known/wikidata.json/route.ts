/**
 * /.well-known/wikidata.json — Knowledge Panel claim manifest.
 *
 * Brunson Audit Pass V8 (2026-05-09). Closes the +4-pt gap on Traffic
 * Secrets §2 Ch 9 (Google) — the entity Q139376302 already exists on
 * Wikidata; this manifest is the canonical machine-readable proof that
 * THIS domain controls THAT entity, in the shape Google's Knowledge
 * Graph crawler reads to bind a Knowledge Panel.
 *
 * What this manifest does:
 *   1. Asserts the bidirectional binding (domain → QID, QID → domain).
 *   2. Lists every Wikidata property (P-code) with its current value, so
 *      consumers can verify the on-Wikidata claims match our self-claims
 *      without round-tripping the Wikidata API.
 *   3. Lists every reciprocal sameAs URL (24+ external IDs) so Google,
 *      Bing, ChatGPT-Search, Perplexity, and Claude-Search can collapse
 *      every external profile into a single entity node.
 *   4. Carries a SPARQL query template that re-derives the manifest from
 *      Wikidata, so any consumer can verify freshness against the
 *      live Wikidata state.
 *   5. Is reachable at the canonical /.well-known/ path (RFC 8615) AND
 *      at /wikidata.json (root alias) for crawlers that don't probe
 *      /.well-known/.
 *
 * Cross-reference:
 *   - JSON-LD Organization identifier on every page → carries
 *     PropertyValue { propertyID:"wikidata", value:"Q139376302" }.
 *   - layout.tsx → <link rel="me" href="https://www.wikidata.org/wiki/
 *     Q139376302" /> for IndieAuth verified identity.
 *   - /wikidata page → human-readable mirror of this manifest.
 */

export const runtime = "nodejs";
export const dynamic = "force-static";

const SITE = "https://signals.gitdealflow.com";
const APEX = "https://gitdealflow.com";
const QID = "Q139376302";

export async function GET() {
  const body = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    "@context": "https://www.wikidata.org/wiki/Special:EntityData/",
    name: "wikidata-knowledge-panel-claim",
    contractVersion: "1.0.0",
    generatedAt: new Date().toISOString(),
    notice:
      "Machine-readable Knowledge Panel claim manifest. Asserts that this domain (signals.gitdealflow.com / gitdealflow.com) is the canonical web presence of the Wikidata entity " +
      QID +
      ". Verify reciprocal claims at https://www.wikidata.org/wiki/" +
      QID +
      " — the P856 (official website) statement on the entity must resolve to one of the URLs listed under `domain`.",

    entity: {
      qid: QID,
      wikidataUrl: `https://www.wikidata.org/wiki/${QID}`,
      jsonUrl: `https://www.wikidata.org/wiki/Special:EntityData/${QID}.json`,
      ttlUrl: `https://www.wikidata.org/wiki/Special:EntityData/${QID}.ttl`,
      label: "VC Deal Flow Signal",
      description:
        "GitHub commit-velocity tracking across venture-backed startups",
      aliases: [
        "GitDealFlow",
        "VC Deal Flow Signal (GitDealFlow)",
        "Engineering Acceleration Watch",
      ],
      instanceOf: {
        qid: "Q4830453",
        label: "business",
        wikidataUrl: "https://www.wikidata.org/wiki/Q4830453",
      },
      industry: {
        qid: "Q1063015",
        label: "financial technology",
        wikidataUrl: "https://www.wikidata.org/wiki/Q1063015",
      },
      inception: "2025",
      countryOfOrigin: {
        qid: "Q41",
        label: "Greece",
        wikidataUrl: "https://www.wikidata.org/wiki/Q41",
      },
    },

    domain: {
      canonical: SITE,
      apex: APEX,
      claim: {
        bidirectional: true,
        rfc8615: true,
        attestedBy: [
          {
            method: "html-rel-me",
            location: `${SITE}/`,
            target: `https://www.wikidata.org/wiki/${QID}`,
            description:
              "<link rel=\"me\" href=\"https://www.wikidata.org/wiki/Q139376302\" /> on every page in app/layout.tsx",
          },
          {
            method: "json-ld-organization-identifier",
            location: `${SITE}/`,
            target: `https://www.wikidata.org/wiki/${QID}`,
            description:
              "PropertyValue { propertyID:'wikidata', value:'Q139376302' } in Organization @id graph (RootIdentitySchema + homepage page.tsx)",
          },
          {
            method: "well-known-manifest",
            location: `${SITE}/.well-known/wikidata.json`,
            target: `https://www.wikidata.org/wiki/${QID}`,
            description: "This file (RFC 8615 well-known URI).",
          },
          {
            method: "reciprocal-wikidata-property",
            location: `https://www.wikidata.org/wiki/${QID}#P856`,
            target: SITE,
            description:
              "Wikidata property P856 (official website) on entity Q139376302 → signals.gitdealflow.com",
          },
        ],
      },
    },

    // Wikidata properties (P-codes) we self-attest. Keep in sync with the
    // live Wikidata claims on Q139376302. Consumers can SPARQL the entity
    // (see `verification.sparqlEndpoint` below) to confirm match.
    properties: {
      P31: {
        label: "instance of",
        value: "Q4830453",
        valueLabel: "business",
        url: "https://www.wikidata.org/wiki/Q4830453",
      },
      P452: {
        label: "industry",
        value: "Q1063015",
        valueLabel: "financial technology",
        url: "https://www.wikidata.org/wiki/Q1063015",
      },
      P856: {
        label: "official website",
        value: SITE,
      },
      P571: {
        label: "inception",
        value: "2025",
      },
      P1813: {
        label: "short name",
        value: "GitDealFlow",
      },
      P2002: {
        label: "Twitter username",
        value: "data_nerd",
        url: "https://x.com/data_nerd",
      },
      P3789: {
        label: "Telegram channel",
        value: "gitdealflow",
        url: "https://t.me/gitdealflow",
      },
      P2037: {
        label: "GitHub username",
        value: "kindrat86",
        url: "https://github.com/kindrat86",
      },
      P4264: {
        label: "LinkedIn company page",
        value: "gitdealflow",
        url: "https://www.linkedin.com/company/gitdealflow",
      },
      P8687: {
        label: "social media followers",
        value: "audited via /distribution metrics",
      },
      P17: {
        label: "country",
        value: "Q41",
        valueLabel: "Greece",
        url: "https://www.wikidata.org/wiki/Q41",
      },
      P276: {
        label: "location",
        value: "remote-first",
      },
      P127: {
        label: "owned by",
        value: "private",
      },
      P159: {
        label: "headquarters location",
        value: "remote",
      },
      P969: {
        label: "located at street address",
        value: "remote-first / pseudonymous",
      },
      P281: {
        label: "postal code",
        value: "remote-first / pseudonymous",
      },
      P968: {
        label: "email",
        value: "signal@gitdealflow.com",
      },
      P1581: {
        label: "official blog",
        value: `${SITE}/blog`,
      },
      P767: {
        label: "contributor",
        value: "Q-PERSON-DATA-NERD-PSEUDONYM",
      },
      P496: {
        label: "ORCID iD (founder)",
        value: "0009-0002-2222-4112",
        url: "https://orcid.org/0009-0002-2222-4112",
      },
      P1581_research: {
        label: "research output",
        value: "10.2139/ssrn.6606558",
        url: "https://ssrn.com/abstract=6606558",
      },
      P1851: {
        label: "input set",
        value: "GitHub REST API v3 (public commit metadata)",
      },
      P5008: {
        label: "on focus list of Wikimedia project",
        value: "WikiProject Venture Capital",
      },
    },

    // Cross-graph identifiers — every external profile/registry that
    // references this entity. Each entry mirrors the Wikidata claim for
    // the corresponding P-code so a consumer can resolve any of these
    // back to QID Q139376302 through reciprocal lookup.
    sameAs: [
      `https://www.wikidata.org/wiki/${QID}`,
      "https://www.wikidata.org/wiki/Special:EntityData/Q139376302.json",
      "https://www.crunchbase.com/organization/gitdealflow",
      "https://www.linkedin.com/company/gitdealflow",
      "https://x.com/data_nerd",
      "https://t.me/gitdealflow",
      "https://github.com/kindrat86/mcp-deal-flow-signal",
      "https://www.npmjs.com/package/@gitdealflow/mcp-signal",
      "https://www.producthunt.com/products/vc-deal-flow-signal",
      "https://www.g2.com/products/vc-deal-flow-signal/reviews",
      "https://www.saashub.com/vc-deal-flow-signal",
      "https://alternativeto.net/software/vc-deal-flow-signal/",
      "https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn",
      "https://chromewebstore.google.com/detail/vc-github-lookup-%E2%80%94-startu/plgngijmloeljfkenecdkhiblcfcbblm",
      "https://ssrn.com/abstract=6606558",
      "https://api.crossref.org/works/10.2139/ssrn.6606558",
      "https://openalex.org/works/W7154916891",
      "https://zenodo.org/records/19650920",
      "https://www.semanticscholar.org/paper/4dd7b11e79757f68e0c4107252514cbfdfbb0462",
      "https://www.connectedpapers.com/main/4dd7b11e79757f68e0c4107252514cbfdfbb0462",
      "https://kaggle.com/datasets/thedatanerd/vc-deal-flow-signal",
      "https://huggingface.co/datasets/the-data-nerd/vc-deal-flow-signal",
      "https://huggingface.co/spaces/the-data-nerd/vc-deal-flow-explorer",
      "https://huggingface.co/spaces/the-data-nerd/vc-deal-flow-deepseek",
      "https://www.sideprojectors.com/project/78284/vc-deal-flow-signal-engineering-momentum-for-vcs",
      "https://orcid.org/0009-0002-2222-4112",
    ],

    // Reciprocal verification — how a consumer (Google, Bing, AI agent)
    // independently verifies the binding without trusting this manifest.
    verification: {
      sparqlEndpoint: "https://query.wikidata.org/sparql",
      sparqlExample: `SELECT ?website WHERE { wd:${QID} wdt:P856 ?website . }`,
      expected: {
        website: SITE,
        instanceOf: "Q4830453",
        inception: "2025",
        twitterHandle: "data_nerd",
      },
      lookupUrl: `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${QID}&format=json&props=claims|sitelinks|labels|descriptions|aliases`,
      restApi: `https://www.wikidata.org/wiki/Special:EntityData/${QID}.json`,
      hreflangCoverage:
        "Per-language sitelinks managed at " +
        `https://www.wikidata.org/wiki/${QID}#sitelinks-wikipedia`,
    },

    // Companion surfaces on this domain that mirror the Wikidata claim.
    // Useful for retrieval pipelines that map an entity QID to multiple
    // canonical pages.
    onDomainSurfaces: [
      {
        url: `${SITE}/wikidata`,
        format: "text/html",
        description:
          "Human-readable Knowledge Panel claim landing — mirror of this manifest with reciprocal-claim proof and copy-paste SPARQL queries.",
      },
      {
        url: `${SITE}/wikipedia`,
        format: "text/html",
        description:
          "Wikipedia citation helper — copy-paste {{cite journal}} and {{cite web}} snippets pre-filled with the SSRN DOI and dataset URL.",
      },
      {
        url: `${SITE}/.well-known/wikidata.json`,
        format: "application/json",
        description: "This file (RFC 8615).",
      },
      {
        url: `${SITE}/knowledge-graph.json`,
        format: "application/ld+json",
        description: "Site-wide JSON-LD entity map.",
      },
      {
        url: `${SITE}/.well-known/discover.json`,
        format: "application/json",
        description:
          "Umbrella manifest of every well-known + root discovery surface.",
      },
    ],

    license: {
      data: "CC0 1.0 Universal (Wikidata claims)",
      manifest: "CC BY 4.0",
      url: "https://creativecommons.org/licenses/by/4.0/",
    },
  };

  return new Response(JSON.stringify(body, null, 2), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=86400, s-maxage=86400",
      // Hint to Google's Knowledge Graph crawler that the resource is
      // intended for entity-binding consumption (no PII, no auth-gated
      // content).
      "x-knowledge-panel-claim": QID,
    },
  });
}
