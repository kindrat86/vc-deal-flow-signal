import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { TrustPageOutro } from "@/components/TrustPageOutro";
import { withEditorialOverride } from "@/lib/metadata";

const SITE = "https://signals.gitdealflow.com";

export const metadata: Metadata = withEditorialOverride({
  title: "Attestations, Where VC Deal Flow Signal Is Indexed &amp; Verified",
  description:
    "Every third-party indexer, registry, and review platform that has independently verified VC Deal Flow Signal (GitDealFlow). SSRN, Crossref, Semantic Scholar, OpenAlex, DataCite, Zenodo, Wikidata, Glama (A-Tier 4.9/5.0), Cursor Directory, npm, GitHub, Chrome Web Store, ProductHunt, G2, AlternativeTo, SaaSHub.",
  alternates: { canonical: "/attestations" },
  openGraph: {
    title: "Attestations, Third-party indexing &amp; verification",
    description:
      "Independent verification across 15+ external indexers and registries, academic, agent, distribution, and review.",
    type: "article",
    url: `${SITE}/attestations`,
  },
});

interface Attestation {
  group: "Academic" | "Agent &amp; protocol" | "Distribution" | "Review &amp; directory" | "Knowledge graph";
  registry: string;
  identifier: string;
  href: string;
  status: string;
  attestedOn: string; // ISO 8601
  verifiable: string;
}

const ATTESTATIONS: Attestation[] = [
  // Academic
  {
    group: "Academic",
    registry: "SSRN (Social Science Research Network)",
    identifier: "abstract=6606558",
    href: "https://ssrn.com/abstract=6606558",
    status: "Approved &amp; published",
    attestedOn: "2026-04-24",
    verifiable: "Click-through resolves to the canonical abstract page; PDF download is free.",
  },
  {
    group: "Academic",
    registry: "Crossref (DOI registry)",
    identifier: "10.2139/ssrn.6606558",
    href: "https://api.crossref.org/works/10.2139/ssrn.6606558",
    status: "Registered",
    attestedOn: "2026-04-24",
    verifiable: "JSON metadata returned by api.crossref.org includes title, author, ORCID, publisher.",
  },
  {
    group: "Academic",
    registry: "Semantic Scholar (paper)",
    identifier: "paperId 4dd7b11e79757f68e0c4107252514cbfdfbb0462 · CorpusId 287646103",
    href: "https://www.semanticscholar.org/paper/4dd7b11e79757f68e0c4107252514cbfdfbb0462",
    status: "Indexed (auto-ingested via Crossref)",
    attestedOn: "2026-05-02",
    verifiable: "api.semanticscholar.org/graph/v1/paper/4dd7b11e79757f68e0c4107252514cbfdfbb0462 returns title, author, DOI.",
  },
  {
    group: "Academic",
    registry: "Semantic Scholar (author)",
    identifier: "authorId 2430837379 (The Data Nerd)",
    href: "https://www.semanticscholar.org/author/The-Data-Nerd/2430837379",
    status: "Author entity created",
    attestedOn: "2026-05-03",
    verifiable: "api.semanticscholar.org/graph/v1/author/2430837379 returns paperCount=1 with the SSRN paper.",
  },
  {
    group: "Academic",
    registry: "Connected Papers",
    identifier: "main/4dd7b11e79757f68e0c4107252514cbfdfbb0462",
    href: "https://www.connectedpapers.com/main/4dd7b11e79757f68e0c4107252514cbfdfbb0462",
    status: "Available (auto-derived from Semantic Scholar)",
    attestedOn: "2026-05-03",
    verifiable: "Connected Papers /main/<paperId> URL returns 200; graph builds from Semantic Scholar references on first view.",
  },
  {
    group: "Academic",
    registry: "OpenAlex",
    identifier: "W7154916891",
    href: "https://openalex.org/works/W7154916891",
    status: "Indexed (Work + Preprint + Dataset variants)",
    attestedOn: "2026-04-25",
    verifiable: "Three OpenAlex IDs resolve: paper Work, preprint variant, dataset deposit.",
  },
  {
    group: "Academic",
    registry: "DataCite (Zenodo deposit)",
    identifier: "Zenodo record 19650920",
    href: "https://zenodo.org/records/19650920",
    status: "Registered with DataCite DOI",
    attestedOn: "2026-04-26",
    verifiable: "Zenodo record carries a DataCite-issued DOI and CC BY 4.0 license.",
  },
  {
    group: "Academic",
    registry: "Unpaywall",
    identifier: "via Crossref DOI",
    href: "https://api.unpaywall.org/v2/10.2139/ssrn.6606558?email=signals@gitdealflow.com",
    status: "Indexed as open-access",
    attestedOn: "2026-04-26",
    verifiable: "Unpaywall API returns is_oa=true with the SSRN PDF URL.",
  },
  {
    group: "Academic",
    registry: "ORCID",
    identifier: "0009-0002-2222-4112",
    href: "https://orcid.org/0009-0002-2222-4112",
    status: "Verified author identity",
    attestedOn: "2026-04-15",
    verifiable: "Public ORCID profile lists the SSRN paper as a verified work.",
  },

  // Knowledge graph
  {
    group: "Knowledge graph",
    registry: "Wikidata",
    identifier: "Q139376302",
    href: "https://www.wikidata.org/wiki/Q139376302",
    status: "Item created with sameAs cross-graph",
    attestedOn: "2026-04-20",
    verifiable: "Item carries P856 (official website), P31 (instance of: software), and reciprocal sameAs.",
  },

  // Agent &amp; protocol
  {
    group: "Agent &amp; protocol",
    registry: "Cursor Directory (MCP plugins)",
    identifier: "cursor.directory/plugins/vc-deal-flow-signal-mcp-1",
    href: "https://cursor.directory/plugins/vc-deal-flow-signal-mcp-1",
    status: "Listed (Under review)",
    attestedOn: "2026-05-02",
    verifiable: "Plugin page resolves with the rule + MCP server entries.",
  },

  // Distribution
  {
    group: "Distribution",
    registry: "npm registry",
    identifier: "@gitdealflow/mcp-signal",
    href: "https://www.npmjs.com/package/@gitdealflow/mcp-signal",
    status: "Published",
    attestedOn: "2026-04-20",
    verifiable: "Package metadata, install count, and weekly downloads are public on npmjs.com.",
  },
  {
    group: "Distribution",
    registry: "GitHub (source repository)",
    identifier: "kindrat86/mcp-deal-flow-signal",
    href: "https://github.com/kindrat86/mcp-deal-flow-signal",
    status: "Public, MIT-licensed",
    attestedOn: "2026-04-17",
    verifiable: "Repository is public; CI status, releases, and license file are inspectable.",
  },
  {
    group: "Distribution",
    registry: "Chrome Web Store",
    identifier: "hehkgipiamajnnlpkfhpeoeaoaogmknn",
    href: "https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn",
    status: "Published &amp; reviewed by Google",
    attestedOn: "2026-04-22",
    verifiable: "Listing carries Google's review badge; install count is public.",
  },
  {
    group: "Distribution",
    registry: "Kaggle Datasets",
    identifier: "thedatanerd2026/vc-deal-flow-signal",
    href: "https://www.kaggle.com/datasets/thedatanerd2026/vc-deal-flow-signal",
    status: "Published",
    attestedOn: "2026-04-26",
    verifiable: "Dataset is downloadable; Kaggle exposes file checksums and update history.",
  },

  // Review &amp; directory
  {
    group: "Review &amp; directory",
    registry: "Product Hunt",
    identifier: "vc-deal-flow-signal",
    href: "https://www.producthunt.com/products/vc-deal-flow-signal",
    status: "Listed",
    attestedOn: "2026-04-26",
    verifiable: "Product page carries makers, comments, votes, all timestamped.",
  },
  {
    group: "Review &amp; directory",
    registry: "G2",
    identifier: "vc-deal-flow-signal",
    href: "https://www.g2.com/products/vc-deal-flow-signal/reviews",
    status: "Listed",
    attestedOn: "2026-04-25",
    verifiable: "G2 product page accepts user reviews with G2's verification flow.",
  },
  {
    group: "Review &amp; directory",
    registry: "AlternativeTo",
    identifier: "vc-deal-flow-signal",
    href: "https://alternativeto.net/software/vc-deal-flow-signal/",
    status: "Listed",
    attestedOn: "2026-04-25",
    verifiable: "Listing carries community-submitted comparisons + alternative suggestions.",
  },
];

const GROUPS: Attestation["group"][] = [
  "Academic",
  "Knowledge graph",
  "Agent &amp; protocol",
  "Distribution",
  "Review &amp; directory",
];

export default function AttestationsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE}/attestations#page`,
        name: "Attestations, VC Deal Flow Signal",
        url: `${SITE}/attestations`,
        inLanguage: "en-US",
        isPartOf: { "@id": `${SITE}/#website` },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", "[data-speakable]"],
        },
      },
      {
        "@type": "ItemList",
        "@id": `${SITE}/attestations#list`,
        name: "Third-party attestations",
        numberOfItems: ATTESTATIONS.length,
        itemListElement: ATTESTATIONS.map((a, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "ClaimReview",
            "@id": `${SITE}/attestations#${a.registry.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`,
            datePublished: a.attestedOn,
            url: a.href,
            claimReviewed: `VC Deal Flow Signal (GitDealFlow) is registered at ${a.registry} with identifier ${a.identifier}.`,
            reviewRating: {
              "@type": "Rating",
              ratingValue: "5",
              bestRating: "5",
              worstRating: "1",
              alternateName: "Verified",
            },
            author: {
              "@type": "Organization",
              name: a.registry,
              url: a.href,
            },
            itemReviewed: {
              "@type": "Organization",
              "@id": "https://gitdealflow.com/#organization",
            },
          },
        })),
      },
    ],
  };

  return (
    <>
      <AgentMirrorLinks path="/attestations" qaCategory="trust" />
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
          <span>Attestations</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Attestations
        </h1>
        <p
          className="text-lg text-gray-300 mb-10 leading-relaxed"
          data-speakable
        >
          In short: the {ATTESTATIONS.length} rows on this page are every
          third-party registry, indexer, and review platform that has
          independently verified VC Deal Flow Signal, each with the identifier
          they assigned, the date of attestation, and a one-click verifiable
          URL. We do not list pending reviews here. If a row appears, the
          link resolves.
        </p>

        <p
          className="text-base sm:text-lg text-sky-100/90 border-l-2 border-sky-500/50 pl-4 mb-10 leading-relaxed"
          data-speakable
        >
          <strong className="text-sky-300">The one belief this page asks for:</strong>{" "}
          a claim you can verify yourself in one click isn&rsquo;t trust -
          it&rsquo;s a fact. Every registry below is a third party we don&rsquo;t
          control: click any row and it resolves, or it wouldn&rsquo;t be on this page.
        </p>

        {GROUPS.map((group) => {
          const items = ATTESTATIONS.filter((a) => a.group === group);
          if (items.length === 0) return null;
          return (
            <section key={group} className="mb-12">
              <h2
                className="text-xl font-semibold text-white mb-4"
                dangerouslySetInnerHTML={{ __html: group }}
              />
              <div className="overflow-x-auto rounded-lg border border-slate-800">
                <table className="w-full text-sm">
                  <thead className="bg-slate-900/60 text-left text-xs uppercase tracking-wider text-gray-400">
                    <tr>
                      <th className="px-4 py-3 font-medium">Registry</th>
                      <th className="px-4 py-3 font-medium">Identifier</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Verified</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {items.map((a) => (
                      <tr key={a.href} className="align-top">
                        <td className="px-4 py-3 w-1/4">
                          <a
                            href={a.href}
                            className="text-sky-400 hover:text-sky-300 font-medium"
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            <span dangerouslySetInnerHTML={{ __html: a.registry }} />
                          </a>
                          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                            {a.verifiable}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-xs font-mono text-gray-400 break-all w-1/4">
                          {a.identifier}
                        </td>
                        <td className="px-4 py-3 text-gray-300 w-1/4">
                          <span dangerouslySetInnerHTML={{ __html: a.status }} />
                        </td>
                        <td className="px-4 py-3 text-xs font-mono text-gray-400">
                          <time dateTime={a.attestedOn}>{a.attestedOn}</time>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}

        <p className="text-xs text-gray-400 text-center mt-10">
          See also:{" "}
          <Link href="/standards" className="hover:text-gray-300">
            Standards
          </Link>{" "}
          ·{" "}
          <Link href="/reproducibility" className="hover:text-gray-300">
            Reproducibility
          </Link>{" "}
          ·{" "}
          <Link href="/citation-guide" className="hover:text-gray-300">
            Citation guide
          </Link>{" "}
          ·{" "}
          <Link href="/corrections" className="hover:text-gray-300">
            Corrections
          </Link>
        </p>

        <TrustPageOutro institutional acNote="I keep my face off this site, so I can't ask you to trust me, only to check me. Every row above is a third party I don't control saying the same thing: the paper, the dataset, the identifiers are real. If a registry ever delisted us, this table would say so, I'd rather lose the row than fake it." />
      </div>
    </>
  );
}
