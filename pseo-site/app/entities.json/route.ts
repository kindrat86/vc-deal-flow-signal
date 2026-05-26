/**
 * /entities.json — flat, NER-friendly named-entity manifest.
 *
 * Companion to the richer surfaces already on this domain:
 *   - /knowledge-graph.json — full JSON-LD DataCatalog @graph
 *   - /.well-known/wikidata.json — Wikidata P-code claim ledger
 *   - RootIdentitySchema (every page) — site-wide JSON-LD identity block
 *
 * This surface exists for downstream NER and entity-extraction consumers
 * (spaCy, Hugging Face datasets, lightweight retrieval pipelines) that
 * want a single flat list of every named entity this site asserts —
 * people, organizations, the software product, datasets, and academic
 * publications — without parsing nested JSON-LD.
 *
 * Schema design:
 *   - One root object with typed arrays (people, organizations,
 *     softwareApplications, datasets, publications, projects).
 *   - Every entry carries `name`, `type` (Schema.org @type), `url`
 *     (canonical), and `sameAs[]` (mesh of external IDs).
 *   - People/Org entries also carry `identifiers[]` with `propertyID`
 *     (wikidata, ORCID, DOI, …) so consumers can build a typed
 *     identifier index without parsing PropertyValue triples.
 *
 * Why this file exists separately from knowledge-graph.json:
 *   knowledge-graph.json is a JSON-LD document — consumers need a
 *   JSON-LD parser. entities.json is plain JSON; flat schema; one fetch
 *   gives the full entity inventory to a spaCy pipeline or a Hugging
 *   Face dataset script.
 *
 * Why a route handler rather than pseo-site/public/entities.json:
 *   A route handler emits a typed content-type (application/json with
 *   utf-8), full Cache-Control headers, and survives Next.js asset
 *   pipeline rewrites. The repo-root entities.json continues to live
 *   as a hand-maintained developer-side reference; this route is the
 *   live, served surface.
 */

import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const revalidate = 86400;

const SITE = "https://signals.gitdealflow.com";
const APEX = "https://gitdealflow.com";
const WIKIDATA_QID = "Q139376302";

interface IdentifierRef {
  propertyID: string;
  value: string;
  url: string;
}

interface Entity {
  name: string;
  type: string;
  url: string;
  description: string;
  identifiers?: IdentifierRef[];
  sameAs?: string[];
  alternateName?: string[];
}

interface EntityManifest {
  $schema: string;
  contractVersion: string;
  name: string;
  description: string;
  generatedAt: string;
  publisher: { name: string; url: string; wikidata: string };
  license: string;
  people: Entity[];
  organizations: Entity[];
  softwareApplications: Entity[];
  datasets: Entity[];
  publications: Entity[];
  projects: Entity[];
}

const PEOPLE: Entity[] = [
  {
    name: "The Data Nerd",
    type: "Person",
    url: `${SITE}/about`,
    alternateName: ["Data Nerd"],
    description:
      "Founder of VC Deal Flow Signal (GitDealFlow). Researches code-side momentum signals across venture-backed startups using public GitHub data.",
    identifiers: [
      {
        propertyID: "ORCID",
        value: "0009-0002-2222-4112",
        url: "https://orcid.org/0009-0002-2222-4112",
      },
      {
        propertyID: "Semantic Scholar Author ID",
        value: "2430837379",
        url: "https://www.semanticscholar.org/author/The-Data-Nerd/2430837379",
      },
    ],
    sameAs: [
      "https://orcid.org/0009-0002-2222-4112",
      "https://www.semanticscholar.org/author/The-Data-Nerd/2430837379",
      "https://x.com/data_nerd",
      "https://github.com/kindrat86",
      "https://news.ycombinator.com/user?id=the_data_nerd",
      "https://www.indiehackers.com/The_Data_Nerd",
      "https://dev.to/the_data_nerd",
      "https://huggingface.co/the-data-nerd",
    ],
  },
];

const ORGANIZATIONS: Entity[] = [
  {
    name: "VC Deal Flow Signal",
    type: "Organization",
    url: APEX,
    alternateName: ["GitDealFlow", "VC Deal Flow Signal (GitDealFlow)"],
    description:
      "Independent research and product studio tracking GitHub commit-velocity, contributor-growth, and repository-expansion signals across venture-backed startups. Surfaces engineering-acceleration patterns 3–6 weeks before fundraise announcements.",
    identifiers: [
      {
        propertyID: "wikidata",
        value: WIKIDATA_QID,
        url: `https://www.wikidata.org/wiki/${WIKIDATA_QID}`,
      },
    ],
    sameAs: [
      `https://www.wikidata.org/wiki/${WIKIDATA_QID}`,
      "https://x.com/data_nerd",
      "https://t.me/gitdealflow",
      "https://www.linkedin.com/company/gitdealflow",
      "https://www.crunchbase.com/organization/gitdealflow",
      "https://www.producthunt.com/products/vc-deal-flow-signal",
      "https://www.g2.com/products/vc-deal-flow-signal/reviews",
      "https://www.saashub.com/vc-deal-flow-signal",
      "https://alternativeto.net/software/vc-deal-flow-signal/",
      "https://github.com/kindrat86/mcp-deal-flow-signal",
    ],
  },
];

const SOFTWARE_APPLICATIONS: Entity[] = [
  {
    name: "VC Deal Flow Signal Dashboard",
    type: "SoftwareApplication",
    url: `${SITE}/dashboard`,
    description:
      "Web dashboard surfacing weekly engineering-acceleration signals for 4,200+ venture-backed startups. Sector, stage, and signal-type filters; CSV/JSON export.",
    identifiers: [
      {
        propertyID: "wikidata",
        value: WIKIDATA_QID,
        url: `https://www.wikidata.org/wiki/${WIKIDATA_QID}`,
      },
    ],
    sameAs: [
      `https://www.wikidata.org/wiki/${WIKIDATA_QID}`,
      "https://www.producthunt.com/products/vc-deal-flow-signal",
      "https://www.g2.com/products/vc-deal-flow-signal/reviews",
      "https://www.saashub.com/vc-deal-flow-signal",
      "https://alternativeto.net/software/vc-deal-flow-signal/",
    ],
  },
  {
    name: "@gitdealflow/mcp-signal",
    type: "SoftwareApplication",
    url: "https://www.npmjs.com/package/@gitdealflow/mcp-signal",
    alternateName: ["GitDealFlow MCP Server", "mcp-deal-flow-signal"],
    description:
      "Free, no-API-key Model Context Protocol server exposing six tools over the public GitDealFlow signal index. Read-only. Glama A-Tier 4.9/5.0.",
    sameAs: [
      "https://www.npmjs.com/package/@gitdealflow/mcp-signal",
      "https://github.com/kindrat86/mcp-deal-flow-signal",
      "https://glama.ai/mcp/servers/kindrat86/mcp-deal-flow-signal",
      `${SITE}/.well-known/agent-card.json`,
    ],
  },
  {
    name: "VC Deal Flow Signal — Crunchbase + Wellfound badge",
    type: "SoftwareApplication",
    url: "https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn",
    description:
      "Chrome extension surfacing GitDealFlow acceleration signals on Crunchbase and Wellfound company pages.",
    sameAs: [
      "https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn",
    ],
  },
  {
    name: "VC GitHub Lookup — Startup Signals on Hover",
    type: "SoftwareApplication",
    url: "https://chromewebstore.google.com/detail/vc-github-lookup-%E2%80%94-startu/plgngijmloeljfkenecdkhiblcfcbblm",
    description:
      "Chrome extension surfacing startup signals on GitHub repository pages without leaving the tab.",
    sameAs: [
      "https://chromewebstore.google.com/detail/vc-github-lookup-%E2%80%94-startu/plgngijmloeljfkenecdkhiblcfcbblm",
    ],
  },
];

const DATASETS: Entity[] = [
  {
    name: "VC Deal Flow Signal — open dataset",
    type: "Dataset",
    url: `${SITE}/dataset`,
    description:
      "Open weekly dataset of GitHub-derived engineering-acceleration signals across 4,200+ venture-backed startups. CC BY 4.0. Available as JSON, JSONL, CSV.",
    identifiers: [
      {
        propertyID: "DOI",
        value: "10.5281/zenodo.19650920",
        url: "https://doi.org/10.5281/zenodo.19650920",
      },
    ],
    sameAs: [
      `${SITE}/dataset.json`,
      `${SITE}/dataset.jsonl`,
      `${SITE}/.well-known/dataset.json`,
      "https://zenodo.org/records/19650920",
      "https://kaggle.com/datasets/thedatanerd/vc-deal-flow-signal",
      "https://huggingface.co/datasets/the-data-nerd/vc-deal-flow-signal",
    ],
  },
];

const PUBLICATIONS: Entity[] = [
  {
    name: "A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups",
    type: "ScholarlyArticle",
    url: "https://ssrn.com/abstract=6606558",
    description:
      "SSRN working paper. Methodology and empirical validation of commit-velocity, contributor-growth, and repository-expansion signals as 4-week leading indicators of fundraise announcements.",
    identifiers: [
      {
        propertyID: "DOI",
        value: "10.2139/ssrn.6606558",
        url: "https://doi.org/10.2139/ssrn.6606558",
      },
      {
        propertyID: "OpenAlex",
        value: "W7154916891",
        url: "https://openalex.org/works/W7154916891",
      },
      {
        propertyID: "Semantic Scholar",
        value: "4dd7b11e79757f68e0c4107252514cbfdfbb0462",
        url: "https://www.semanticscholar.org/paper/4dd7b11e79757f68e0c4107252514cbfdfbb0462",
      },
    ],
    sameAs: [
      "https://ssrn.com/abstract=6606558",
      "https://api.crossref.org/works/10.2139/ssrn.6606558",
      "https://openalex.org/works/W7154916891",
      "https://www.semanticscholar.org/paper/4dd7b11e79757f68e0c4107252514cbfdfbb0462",
      "https://www.connectedpapers.com/main/4dd7b11e79757f68e0c4107252514cbfdfbb0462",
    ],
  },
];

const PROJECTS: Entity[] = [
  {
    name: "Weekly Engineering Acceleration Watch",
    type: "Periodical",
    url: `${SITE}/predicted`,
    alternateName: ["Acceleration Watch"],
    description:
      "Weekly editorial publication grading named startups whose GitHub engineering acceleration crossed the signal threshold during the prior week.",
  },
  {
    name: "Hugging Face Space — VC Deal Flow Explorer",
    type: "SoftwareApplication",
    url: "https://huggingface.co/spaces/the-data-nerd/vc-deal-flow-explorer",
    description:
      "Public Hugging Face Space for interactive exploration of the VC Deal Flow Signal dataset.",
    sameAs: ["https://huggingface.co/spaces/the-data-nerd/vc-deal-flow-explorer"],
  },
  {
    name: "Company GitHub Signals Index",
    type: "CollectionPage",
    url: `${SITE}/signal`,
    description:
      "Index of per-company GitHub engineering signal pages — commit velocity, contributor influx, and repo activity for well-known public technical companies. One leaf page per company under /signal/[slug].",
  },
  {
    name: "Venture Fund Profiles Index",
    type: "CollectionPage",
    url: `${SITE}/fund`,
    description:
      "Independent profiles of well-known venture funds — published thesis, stage focus, and engineering-signal sourcing map. One leaf page per fund under /fund/[slug].",
  },
  {
    name: "Founder & Public Engineering Profiles Index",
    type: "CollectionPage",
    url: `${SITE}/founder`,
    description:
      "Public-figure-threshold engineering profile pages — founders, OSS maintainers, and technical executives who self-publish their GitHub handle on their own surface. One leaf per handle under /founder/[handle], with opt-out at /founder/opt-out.",
  },
];

export async function GET() {
  const body: EntityManifest = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    contractVersion: "1.0.0",
    name: "VC Deal Flow Signal — named-entity manifest",
    description:
      "Flat, NER-friendly inventory of every named entity asserted by signals.gitdealflow.com — people, organizations, software products, datasets, publications, projects. Companion to /knowledge-graph.json (JSON-LD) and /.well-known/wikidata.json (Wikidata claim ledger). License: CC BY 4.0.",
    generatedAt: new Date().toISOString(),
    publisher: {
      name: "VC Deal Flow Signal",
      url: APEX,
      wikidata: `https://www.wikidata.org/wiki/${WIKIDATA_QID}`,
    },
    license: "https://creativecommons.org/licenses/by/4.0/",
    people: PEOPLE,
    organizations: ORGANIZATIONS,
    softwareApplications: SOFTWARE_APPLICATIONS,
    datasets: DATASETS,
    publications: PUBLICATIONS,
    projects: PROJECTS,
  };

  return NextResponse.json(body, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
