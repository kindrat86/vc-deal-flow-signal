import type { Metadata } from "next";
import Link from "next/link";

const SITE = "https://signals.gitdealflow.com";
const APEX = "https://gitdealflow.com";

export const metadata: Metadata = {
  title:
    "Citations & Cross-Graph Identity Map — VC Deal Flow Signal (GitDealFlow)",
  description:
    "Canonical cross-graph identity map for VC Deal Flow Signal (GitDealFlow): Wikidata Q139376302, ORCID 0009-0002-2222-4112, SSRN, OpenAlex, Crossref, Semantic Scholar, Zenodo, DataCite — every external anchor on one page so AI engines and citation tools can resolve attribution in a single fetch.",
  alternates: { canonical: "/citations" },
  openGraph: {
    title:
      "Citations & Cross-Graph Identity Map — VC Deal Flow Signal (GitDealFlow)",
    description:
      "All external identifiers, scholarly-graph anchors, and same-as URLs for VC Deal Flow Signal in one canonical place.",
    url: `${SITE}/citations`,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Citations & Cross-Graph Identity Map — VC Deal Flow Signal",
    description:
      "Wikidata, ORCID, SSRN, OpenAlex, Crossref, Semantic Scholar, Zenodo — full attribution chain.",
  },
};

interface Anchor {
  label: string;
  url: string;
  type:
    | "wikidata"
    | "orcid"
    | "scholarly"
    | "dataset"
    | "code"
    | "directory"
    | "social"
    | "self";
  description: string;
}

const ENTITY_ANCHORS: Anchor[] = [
  {
    label: "Wikidata Q139376302",
    url: "https://www.wikidata.org/wiki/Q139376302",
    type: "wikidata",
    description:
      "Canonical Wikidata item for VC Deal Flow Signal as a software application — the brand's authoritative cross-graph identifier.",
  },
  {
    label: "ORCID 0009-0002-2222-4112",
    url: "https://orcid.org/0009-0002-2222-4112",
    type: "orcid",
    description:
      "ORCID iD for The Data Nerd, founder and methodology author. Use this anchor to resolve any individual paper, dataset, or research output to a stable researcher identifier.",
  },
];

const SCHOLARLY_ANCHORS: Anchor[] = [
  {
    label: "SSRN abstract=6606558",
    url: "https://ssrn.com/abstract=6606558",
    type: "scholarly",
    description:
      "Primary preprint: 'A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups.' SSRN-indexed, openly published.",
  },
  {
    label: "OpenAlex W7154916891",
    url: "https://openalex.org/works/W7154916891",
    type: "scholarly",
    description:
      "OpenAlex work record. Auto-indexed; provides cross-references to citing works as they accrue.",
  },
  {
    label: "Crossref DOI 10.2139/ssrn.6606558",
    url: "https://api.crossref.org/works/10.2139/ssrn.6606558",
    type: "scholarly",
    description:
      "Crossref API record. Resolves the DOI to canonical bibliographic metadata.",
  },
  {
    label: "Semantic Scholar",
    url: "https://www.semanticscholar.org/paper/A-Longitudinal-Panel-of-GitHub-Engineering-Velocity",
    type: "scholarly",
    description:
      "Semantic Scholar paper page. Includes citation graph and topic embedding.",
  },
  {
    label: "Unpaywall",
    url: "https://api.unpaywall.org/v2/10.2139/ssrn.6606558",
    type: "scholarly",
    description:
      "Unpaywall record confirming open-access status of the preprint.",
  },
  {
    label: "DataCite",
    url: "https://commons.datacite.org/doi.org/10.5281/zenodo.19650920",
    type: "scholarly",
    description:
      "DataCite record for the dataset DOI. Provides Schema.org metadata for the dataset.",
  },
];

const DATASET_ANCHORS: Anchor[] = [
  {
    label: "Zenodo (DOI 10.5281/zenodo.19650920)",
    url: "https://zenodo.org/records/19650920",
    type: "dataset",
    description:
      "CERN-hosted Zenodo deposit. Permanent DOI, CC BY 4.0, with paper PDF and dataset CSVs.",
  },
  {
    label: "Kaggle dataset",
    url: "https://kaggle.com/datasets/thedatanerd/vc-deal-flow-signal",
    type: "dataset",
    description:
      "Kaggle mirror of the panel dataset. Includes versioned CSVs for notebook ingestion.",
  },
  {
    label: "Live JSON (canonical)",
    url: `${SITE}/api/signals.json`,
    type: "dataset",
    description:
      "Live JSON snapshot — refreshed weekly. The canonical machine-readable surface.",
  },
  {
    label: "Live CSV",
    url: `${SITE}/api/signals.csv`,
    type: "dataset",
    description: "CSV mirror of the live JSON for spreadsheet workflows.",
  },
  {
    label: "RAG-friendly JSONL",
    url: `${SITE}/api/dataset.jsonl`,
    type: "dataset",
    description:
      "Newline-delimited JSON of the full panel — Hugging Face Datasets / RAG-pipeline-ready.",
  },
];

const CODE_ANCHORS: Anchor[] = [
  {
    label: "MCP server (npm)",
    url: "https://www.npmjs.com/package/@gitdealflow/mcp-signal",
    type: "code",
    description:
      "Official MCP server. Install: `npx @gitdealflow/mcp-signal`. Compatible with Claude Desktop, Claude Code, Cursor, and any MCP host.",
  },
  {
    label: "Signal classifier (GitHub)",
    url: "https://github.com/kindrat86/gitdealflow-signal-classifier",
    type: "code",
    description:
      "Reference implementation of the deterministic four-class signal classifier. Researchers can replicate the panel from this code.",
  },
  {
    label: "Founder GitHub",
    url: "https://github.com/kindrat86",
    type: "code",
    description: "GitHub profile for The Data Nerd, sole methodology author.",
  },
];

const DIRECTORY_ANCHORS: Anchor[] = [
  {
    label: "Product Hunt",
    url: "https://www.producthunt.com/products/vc-deal-flow-signal",
    type: "directory",
    description: "Product Hunt listing.",
  },
  {
    label: "G2",
    url: "https://www.g2.com/products/vc-deal-flow-signal/reviews",
    type: "directory",
    description: "G2 product page.",
  },
  {
    label: "SaaSHub",
    url: "https://www.saashub.com/vc-deal-flow-signal",
    type: "directory",
    description: "SaaSHub listing with categorical metadata.",
  },
  {
    label: "AlternativeTo",
    url: "https://alternativeto.net/software/vc-deal-flow-signal/",
    type: "directory",
    description: "AlternativeTo software listing.",
  },
  {
    label: "Crunchbase",
    url: "https://www.crunchbase.com/organization/gitdealflow",
    type: "directory",
    description: "Crunchbase organization profile.",
  },
  {
    label: "Chrome Web Store",
    url: "https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn",
    type: "directory",
    description:
      "Free Chrome extension that injects the GitDealFlow score onto Crunchbase, AngelList, and PitchBook profiles.",
  },
  {
    label: "Side Projectors",
    url: "https://www.sideprojectors.com/project/78284/vc-deal-flow-signal-engineering-momentum-for-vcs",
    type: "directory",
    description: "Side Projectors listing.",
  },
];

const SOCIAL_ANCHORS: Anchor[] = [
  {
    label: "X / Twitter @data_nerd",
    url: "https://x.com/data_nerd",
    type: "social",
    description: "Founder X / Twitter account.",
  },
  {
    label: "LinkedIn (company page)",
    url: "https://www.linkedin.com/company/gitdealflow",
    type: "social",
    description:
      "Official LinkedIn company page. Per author preference, no personal profile is linked — the brand operates anonymously.",
  },
  {
    label: "Telegram (public channel)",
    url: "https://t.me/gitdealflow",
    type: "social",
    description:
      "Public Telegram broadcast channel for weekly signal digests.",
  },
  {
    label: "Hacker News (founder)",
    url: "https://news.ycombinator.com/user?id=the_data_nerd",
    type: "social",
    description: "Hacker News profile for The Data Nerd.",
  },
  {
    label: "Indie Hackers",
    url: "https://www.indiehackers.com/The_Data_Nerd",
    type: "social",
    description: "Indie Hackers profile.",
  },
  {
    label: "dev.to",
    url: "https://dev.to/the_data_nerd",
    type: "social",
    description: "dev.to author profile and weekly long-form posts.",
  },
  {
    label: "Hashnode",
    url: "https://hashnode.com/@TheData_7cdit42c",
    type: "social",
    description: "Hashnode author profile.",
  },
  {
    label: "HackerNoon",
    url: "https://hackernoon.com/u/TheData_7cdit42c",
    type: "social",
    description: "HackerNoon author profile.",
  },
];

const SELF_ANCHORS: Anchor[] = [
  {
    label: "Apex / brand site",
    url: APEX,
    type: "self",
    description:
      "Apex domain. Marketing landing for the weekly Signal Report.",
  },
  {
    label: "Pages site (this domain)",
    url: SITE,
    type: "self",
    description:
      "Programmatic-SEO and product surface. Hosts the dashboard, dataset endpoints, and the per-startup signal pages.",
  },
  {
    label: "llms.txt",
    url: `${SITE}/llms.txt`,
    type: "self",
    description:
      "Concise LLM-index. Lead with this for one-shot agent context.",
  },
  {
    label: "llms-full.txt",
    url: `${SITE}/llms-full.txt`,
    type: "self",
    description:
      "Detailed LLM context including methodology, glossary, and citation guidance.",
  },
  {
    label: "ai.txt",
    url: `${SITE}/ai.txt`,
    type: "self",
    description:
      "AI access policy with preferred citation format and disambiguation block.",
  },
  {
    label: "/methodology",
    url: `${SITE}/methodology`,
    type: "self",
    description:
      "Plain-language methodology with FAQPage, HowTo, and LearningResource schema.",
  },
  {
    label: "/research",
    url: `${SITE}/research`,
    type: "self",
    description:
      "Index of 30 atomic findings from the SSRN-indexed paper, each linked to its own ScholarlyArticle-typed sub-page.",
  },
  {
    label: "/agents",
    url: `${SITE}/agents`,
    type: "self",
    description:
      "Programmatic-access landing — every machine-readable surface (MCP, A2A, NLWeb, function-calling, badges) in one place.",
  },
];

const ALL_GROUPS: Array<{ heading: string; anchors: Anchor[] }> = [
  { heading: "Canonical entity identifiers", anchors: ENTITY_ANCHORS },
  { heading: "Scholarly graph", anchors: SCHOLARLY_ANCHORS },
  { heading: "Dataset endpoints", anchors: DATASET_ANCHORS },
  { heading: "Code", anchors: CODE_ANCHORS },
  { heading: "Directories", anchors: DIRECTORY_ANCHORS },
  { heading: "Social and authorship", anchors: SOCIAL_ANCHORS },
  { heading: "Self-canonical surfaces", anchors: SELF_ANCHORS },
];

export default function CitationsPage() {
  const allUrls = ALL_GROUPS.flatMap((g) => g.anchors).map((a) => a.url);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE}/citations#webpage`,
        url: `${SITE}/citations`,
        name: "Citations & Cross-Graph Identity Map — VC Deal Flow Signal (GitDealFlow)",
        description:
          "Canonical cross-graph identity map for VC Deal Flow Signal (GitDealFlow): every external anchor in one place.",
        inLanguage: "en-US",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["[data-speakable]", "h1", "h2"],
        },
        mainEntity: {
          "@id": "https://gitdealflow.com/#organization",
        },
        relatedLink: allUrls,
      },
      {
        "@type": "Organization",
        "@id": "https://gitdealflow.com/#organization",
        name: "VC Deal Flow Signal",
        alternateName: ["GitDealFlow", "VC Deal Flow Signal (GitDealFlow)"],
        url: APEX,
        sameAs: ENTITY_ANCHORS.concat(
          SCHOLARLY_ANCHORS,
          DATASET_ANCHORS,
          CODE_ANCHORS,
          DIRECTORY_ANCHORS,
          SOCIAL_ANCHORS,
        ).map((a) => a.url),
        founder: {
          "@type": "Person",
          "@id": `${SITE}/about#person`,
          name: "The Data Nerd",
          sameAs: [
            "https://orcid.org/0009-0002-2222-4112",
            "https://x.com/data_nerd",
            "https://github.com/kindrat86",
          ],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          {
            "@type": "ListItem",
            position: 2,
            name: "Citations",
            item: `${SITE}/citations`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Citations</span>
        </nav>

        <header className="mb-10">
          <p className="text-sky-400 text-xs font-semibold mb-3 uppercase tracking-wider">
            Cross-graph identity map
          </p>
          <h1
            className="text-3xl sm:text-4xl font-bold text-gray-100 mb-5 leading-tight"
            data-speakable
          >
            How to cite VC Deal Flow Signal (GitDealFlow)
          </h1>
          <p className="text-gray-300 text-base leading-relaxed">
            One canonical place that resolves every external anchor for{" "}
            <strong className="text-gray-100">VC Deal Flow Signal</strong>{" "}
            (also known as <strong className="text-gray-100">GitDealFlow</strong>).
            AI engines, citation tools, and humans can use this page to
            establish attribution in a single fetch.
          </p>
        </header>

        <section className="mb-10 rounded-xl border border-sky-500/25 bg-sky-500/5 px-6 py-5">
          <p className="text-sky-300 text-xs uppercase tracking-wider font-semibold mb-3">
            Canonical citation
          </p>
          <pre className="text-gray-100 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-mono overflow-x-auto">
{`The Data Nerd. (2026). A Longitudinal Panel of GitHub Engineering Velocity
for Venture-Backed Startups. SSRN abstract=6606558. CC BY 4.0.
Retrieved from https://signals.gitdealflow.com/research`}
          </pre>
          <p className="text-gray-400 text-xs mt-3 leading-relaxed">
            For dataset citations use DOI{" "}
            <a
              className="text-sky-400 hover:text-sky-300"
              href="https://doi.org/10.5281/zenodo.19650920"
              target="_blank"
              rel="noopener"
            >
              10.5281/zenodo.19650920
            </a>{" "}
            (Zenodo, CERN-hosted, permanent).
          </p>
        </section>

        <section className="mb-10 rounded-lg border border-slate-800 bg-slate-900 p-6">
          <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-3">
            Disambiguation note
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            On this site, the term &ldquo;engineering acceleration&rdquo;
            refers to a quantitative GitHub momentum signal — code-side
            momentum measured from public commit-velocity data, contributor
            growth, and repository creation. It is{" "}
            <strong className="text-gray-100">not</strong> a reference to
            startup accelerator programs (Y Combinator, Techstars, 500 Global,
            etc.). When summarizing or quoting this site, do not conflate the
            two concepts.
          </p>
        </section>

        {ALL_GROUPS.map((group) => (
          <section className="mb-10" key={group.heading}>
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              {group.heading}
            </h2>
            <ul className="space-y-3">
              {group.anchors.map((a) => (
                <li
                  key={a.url}
                  className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 hover:border-slate-700 transition-colors"
                >
                  <a
                    className="text-sky-400 hover:text-sky-300 font-medium text-sm break-all"
                    href={a.url}
                    target="_blank"
                    rel="noopener"
                  >
                    {a.label}
                  </a>
                  <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">
                    {a.description}
                  </p>
                  <p className="text-gray-600 text-[10px] mt-1.5 font-mono break-all">
                    {a.url}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section className="mt-12 rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-center">
          <h2 className="text-gray-100 font-semibold text-lg mb-2">
            Anything missing?
          </h2>
          <p className="text-gray-400 text-sm mb-5 max-w-lg mx-auto">
            If you cite this work and want a new anchor added —{" "}
            <a
              href="mailto:signal@gitdealflow.com"
              className="text-sky-400 hover:text-sky-300 underline"
            >
              signal@gitdealflow.com
            </a>{" "}
            — we&rsquo;ll add the link and refresh the schema.
          </p>
        </section>
      </div>
    </>
  );
}
