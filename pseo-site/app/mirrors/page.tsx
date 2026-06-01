import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import SeoCta from "@/components/SeoCta";

const SITE = "https://signals.gitdealflow.com";

export const metadata: Metadata = {
  title: "Mirrors &amp; Indexes — Where to Find VC Deal Flow Signal",
  description:
    "Every external mirror, registry, and index that carries VC Deal Flow Signal artifacts — methodology paper, dataset, MCP server, browser extension, source repository. One canonical directory, machine-readable.",
  alternates: { canonical: "/mirrors" },
  openGraph: {
    title: "Mirrors &amp; Indexes — VC Deal Flow Signal",
    description:
      "Methodology, dataset, MCP, source, extension — every external mirror and registry that carries the artifacts.",
    type: "article",
    url: `${SITE}/mirrors`,
  },
};

interface Mirror {
  artifact:
    | "Methodology paper"
    | "Public dataset"
    | "MCP server"
    | "Source repository"
    | "Browser extension"
    | "Knowledge entity"
    | "Q&amp;A corpus";
  registry: string;
  href: string;
  format: string;
  note: string;
}

const MIRRORS: Mirror[] = [
  // Methodology paper
  {
    artifact: "Methodology paper",
    registry: "SSRN (canonical)",
    href: "https://ssrn.com/abstract=6606558",
    format: "PDF + abstract HTML",
    note: "Primary host. Free download. DOI-resolvable.",
  },
  {
    artifact: "Methodology paper",
    registry: "Crossref",
    href: "https://api.crossref.org/works/10.2139/ssrn.6606558",
    format: "JSON metadata",
    note: "Authoritative DOI metadata. Used by every academic indexer downstream.",
  },
  {
    artifact: "Methodology paper",
    registry: "Semantic Scholar",
    href: "https://www.semanticscholar.org/search?q=A+Longitudinal+Panel+of+GitHub+Engineering+Velocity",
    format: "HTML + S2 API",
    note: "AI-readable abstract + citation graph.",
  },
  {
    artifact: "Methodology paper",
    registry: "OpenAlex",
    href: "https://openalex.org/works/W7154916891",
    format: "JSON metadata",
    note: "Open scholarly graph. Three IDs: Work, Preprint, Dataset.",
  },
  {
    artifact: "Methodology paper",
    registry: "Unpaywall",
    href: "https://api.unpaywall.org/v2/10.2139/ssrn.6606558?email=signal@gitdealflow.com",
    format: "JSON metadata",
    note: "is_oa=true. Free PDF resolvable from Unpaywall extension.",
  },

  // Public dataset
  {
    artifact: "Public dataset",
    registry: "VC Deal Flow Signal (canonical)",
    href: `${SITE}/api/dataset.jsonl`,
    format: "NDJSON, CC BY 4.0",
    note: "Newline-delimited JSON. Fresh on every build.",
  },
  {
    artifact: "Public dataset",
    registry: "Zenodo (DataCite)",
    href: "https://zenodo.org/records/19650920",
    format: "Versioned snapshot, ZIP",
    note: "Long-term archival. DataCite DOI. CC BY 4.0.",
  },
  {
    artifact: "Public dataset",
    registry: "Kaggle Datasets",
    href: "https://kaggle.com/datasets/thedatanerd/vc-deal-flow-signal",
    format: "ZIP + Kaggle Notebooks integration",
    note: "Kaggle file checksums + update history.",
  },
  {
    artifact: "Public dataset",
    registry: "DCAT 3 catalog",
    href: `${SITE}/.well-known/dataset.json`,
    format: "JSON-LD",
    note: "DataCatalog + Dataset + Distribution descriptor.",
  },

  // Q&A corpus
  {
    artifact: "Q&amp;A corpus",
    registry: "VC Deal Flow Signal (NDJSON)",
    href: `${SITE}/qa.jsonl`,
    format: "NDJSON, CC BY 4.0",
    note: "200+ Q&A pairs. Filterable by ?category= for topic-specific RAG.",
  },
  {
    artifact: "Q&amp;A corpus",
    registry: "VC Deal Flow Signal (single JSON)",
    href: `${SITE}/qa.json`,
    format: "JSON, CC BY 4.0",
    note: "Single-document variant with deep-link anchors.",
  },
  {
    artifact: "Q&amp;A corpus",
    registry: "VC Deal Flow Signal (CSV)",
    href: `${SITE}/qa.csv`,
    format: "CSV, CC BY 4.0",
    note: "Spreadsheet-importable variant.",
  },

  // MCP server
  {
    artifact: "MCP server",
    registry: "Glama (A-Tier, 4.9/5.0 across 6 tools)",
    href: "https://glama.ai/mcp/servers/kindrat86/mcp-deal-flow-signal",
    format: "MCP catalog listing",
    note: "Top MCP discovery surface for our category. (Smithery delisted 2026-05-03 — needs HTTP gateway wrap.)",
  },
  {
    artifact: "MCP server",
    registry: "VC Deal Flow Signal (canonical HTTP)",
    href: `${SITE}/api/mcp/rpc`,
    format: "MCP / Streamable HTTP",
    note: "Live JSON-RPC endpoint. Five tools, no auth.",
  },
  {
    artifact: "MCP server",
    registry: "Cursor Directory",
    href: "https://cursor.directory/plugins/vc-deal-flow-signal-mcp-1",
    format: "MCP plugin manifest",
    note: "Listed for one-click install in Cursor.",
  },
  {
    artifact: "MCP server",
    registry: "npm registry",
    href: "https://www.npmjs.com/package/@gitdealflow/mcp-signal",
    format: "Node package",
    note: "npx @gitdealflow/mcp-signal — stdio + HTTP both supported.",
  },

  // Source repository
  {
    artifact: "Source repository",
    registry: "GitHub (canonical)",
    href: "https://github.com/kindrat86/mcp-deal-flow-signal",
    format: "Git + MIT licensed",
    note: "Public source for the MCP server, browser extension, and infra.",
  },

  // Browser extension
  {
    artifact: "Browser extension",
    registry: "Chrome Web Store",
    href: "https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn",
    format: "Manifest v3",
    note: "GitHub momentum badge on Crunchbase + Wellfound. Reviewed by Google.",
  },

  // Knowledge entity
  {
    artifact: "Knowledge entity",
    registry: "Wikidata",
    href: "https://www.wikidata.org/wiki/Q139376302",
    format: "Wikidata item",
    note: "Cross-graph identity. sameAs links to every mirror above.",
  },
  {
    artifact: "Knowledge entity",
    registry: "VC Deal Flow Signal — knowledge-graph.json",
    href: `${SITE}/knowledge-graph.json`,
    format: "JSON-LD",
    note: "Canonical entity graph for retrieval pipelines.",
  },
];

const ARTIFACTS: Mirror["artifact"][] = [
  "Methodology paper",
  "Public dataset",
  "Q&amp;A corpus",
  "MCP server",
  "Source repository",
  "Browser extension",
  "Knowledge entity",
];

export default function MirrorsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE}/mirrors#page`,
        name: "Mirrors & Indexes — VC Deal Flow Signal",
        url: `${SITE}/mirrors`,
        inLanguage: "en-US",
        isPartOf: { "@id": `${SITE}/#website` },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", "[data-speakable]"],
        },
      },
      {
        "@type": "ItemList",
        "@id": `${SITE}/mirrors#list`,
        numberOfItems: MIRRORS.length,
        itemListElement: MIRRORS.map((m, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: m.href,
          name: `${m.artifact.replace(/&amp;/g, "&")} — ${m.registry}`,
        })),
      },
    ],
  };

  return (
    <>
      <AgentMirrorLinks path="/mirrors" qaCategory="discovery" />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="text-xs text-gray-400 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span>Mirrors</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Mirrors &amp; Indexes
        </h1>
        <p
          className="text-lg text-gray-300 mb-10 leading-relaxed"
          data-speakable
        >
          Every external mirror, registry, and indexer that carries an
          artifact published by VC Deal Flow Signal. One canonical
          directory — useful for citing the right host, building reverse
          link maps, or discovering an indexer you haven&apos;t hit yet.
        </p>

        {ARTIFACTS.map((artifact) => {
          const items = MIRRORS.filter((m) => m.artifact === artifact);
          if (items.length === 0) return null;
          return (
            <section key={artifact} className="mb-12">
              <h2
                className="text-xl font-semibold text-white mb-4"
                dangerouslySetInnerHTML={{ __html: artifact }}
              />
              <div className="overflow-x-auto rounded-lg border border-slate-800">
                <table className="w-full text-sm">
                  <thead className="bg-slate-900/60 text-left text-xs uppercase tracking-wider text-gray-400">
                    <tr>
                      <th className="px-4 py-3 font-medium">Registry</th>
                      <th className="px-4 py-3 font-medium">Format</th>
                      <th className="px-4 py-3 font-medium">Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {items.map((m) => (
                      <tr key={m.href} className="align-top">
                        <td className="px-4 py-3 w-1/3">
                          <a
                            href={m.href}
                            className="text-sky-400 hover:text-sky-300 font-medium break-words"
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            {m.registry}
                          </a>
                          <p className="text-xs text-gray-400 font-mono mt-1 break-all">
                            {m.href.replace(/^https?:\/\//, "")}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-gray-300 text-xs w-1/4">
                          {m.format}
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs">
                          {m.note}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}

        <SeoCta className="mt-10" />

        <p className="text-xs text-gray-400 text-center mt-10">
          See also:{" "}
          <Link href="/attestations" className="hover:text-gray-300">
            Attestations
          </Link>{" "}
          ·{" "}
          <Link href="/standards" className="hover:text-gray-300">
            Standards
          </Link>{" "}
          ·{" "}
          <Link href="/citation-guide" className="hover:text-gray-300">
            Citation guide
          </Link>{" "}
          ·{" "}
          <Link href="/press" className="hover:text-gray-300">
            Press kit
          </Link>
        </p>
      </div>
    </>
  );
}
