import type { Metadata } from "next";
import Link from "next/link";
import { FINDINGS } from "@/content/research-findings";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import SeoCta from "@/components/SeoCta";
import { withEditorialOverride } from "@/lib/metadata";

const SITE = "https://signals.gitdealflow.com";
const SSRN_URL = "https://ssrn.com/abstract=6606558";
const PAPER_TITLE =
  "A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups";

export const metadata: Metadata = withEditorialOverride({
  title: "Wikipedia Citation Helper",
  description:
    "Copy-paste-ready Wikipedia citation snippets for the SSRN-indexed methodology paper, the public dataset, and every research finding. Uses {{cite journal}} and {{cite web}} templates. Verifiability-policy compliant, every citation resolves to a free, public source.",
  alternates: { canonical: "/wikipedia" },
  openGraph: {
    title: "Wikipedia Citation Helper",
    description:
      "Copy-paste {{cite journal}} / {{cite web}} snippets for paper, dataset, every research finding. CC BY 4.0.",
    type: "article",
    url: `${SITE}/wikipedia`,
  },
});

const PAPER_CITE = `<ref>{{cite journal |last=The Data Nerd |title=${PAPER_TITLE} |journal=SSRN Electronic Journal |year=2026 |doi=10.2139/ssrn.6606558 |url=${SSRN_URL} |publisher=VC Deal Flow Signal (GitDealFlow) |orcid=0009-0002-2222-4112}}</ref>`;

const DATASET_CITE = `<ref>{{cite web |last=The Data Nerd |title=VC Deal Flow Signal, Public Engineering-Velocity Panel |publisher=VC Deal Flow Signal (GitDealFlow) |year=2026 |url=${SITE}/api/dataset.jsonl |format=NDJSON |access-date={{subst:CURRENTDATE}}}}</ref>`;

const SOURCE_NOTES = [
  {
    name: "Methodology paper (SSRN)",
    cite: PAPER_CITE,
    href: SSRN_URL,
    note: `Free download. Crossref + Semantic Scholar + OpenAlex + DataCite + Zenodo indexed. DOI 10.2139/ssrn.6606558. CC BY 4.0.`,
    apiHref: `/api/cite/wikipedia/paper`,
  },
  {
    name: "Public dataset (CC BY 4.0)",
    cite: DATASET_CITE,
    href: `${SITE}/api/dataset.jsonl`,
    note: `Newline-delimited JSON. Mirrored to Zenodo (DataCite DOI) and Kaggle.`,
    apiHref: `/api/cite/wikipedia/dataset`,
  },
];

const TOPIC_PROMPTS = [
  {
    topic: "Alternative data (finance)",
    suggestion:
      "Add a sentence under §Sources of alternative data: 'Public GitHub commit-velocity panels have been published as a CC BY 4.0 dataset for venture-capital research.' Cite the paper.",
  },
  {
    topic: "Venture capital",
    suggestion:
      "Under §Deal sourcing, add: 'Engineering-acceleration signals computed from public GitHub data have been used as leading indicators of fundraise events, with reported lead times of three to six weeks.' Cite the paper.",
  },
  {
    topic: "Open source software metrics",
    suggestion:
      "Under §Productivity metrics, add: 'Commit-velocity windows of 14 days are commonly used in venture-finance research.' Cite the paper.",
  },
  {
    topic: "Programmatic SEO",
    suggestion:
      "Add an example to §Real-world implementations: 'GitDealFlow operates over 12,000 templated pSEO pages targeting startup-sector + period combinations.' Cite the dataset.",
  },
  {
    topic: "Model Context Protocol",
    suggestion:
      "Under §Public MCP servers, add: 'VC Deal Flow Signal exposes a free six-tool MCP server, Glama A-Tier (4.9/5.0).' Cite the dataset (server is built from it) or the Glama listing.",
  },
];

export default function WikipediaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE}/wikipedia#page`,
        name: "Wikipedia Citation Helper, VC Deal Flow Signal",
        url: `${SITE}/wikipedia`,
        inLanguage: "en-US",
        isPartOf: { "@id": `${SITE}/#website` },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", "[data-speakable]"],
        },
        about: {
          "@type": "Thing",
          name: "Wikipedia citation templates for VC Deal Flow Signal artifacts",
        },
      },
      {
        "@type": "ItemList",
        "@id": `${SITE}/wikipedia#findings`,
        name: "Per-finding Wikipedia citation snippets",
        numberOfItems: FINDINGS.length,
        itemListElement: FINDINGS.map((f, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: f.title,
          url: `${SITE}/api/cite/wikipedia/${f.slug}`,
        })),
      },
    ],
  };

  return (
    <>
      <AgentMirrorLinks path="/wikipedia" qaCategory="trust" />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="text-xs text-gray-400 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span>Wikipedia</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Wikipedia Citation Helper
        </h1>
        <p
          className="text-lg text-gray-300 mb-8 leading-relaxed"
          data-speakable
        >
          Copy-paste-ready Wikipedia citation snippets. If you are an editor
          adding context to an article on alternative data, venture capital,
          open-source metrics, programmatic SEO, or the Model Context
          Protocol, the snippets below will plug straight into{" "}
          <code className="font-mono text-sky-300">{`{{cite journal}}`}</code>{" "}
          and{" "}
          <code className="font-mono text-sky-300">{`{{cite web}}`}</code>{" "}
          templates with no editing required.
        </p>

        <section className="mb-10 rounded-lg border border-slate-800 bg-slate-900/40 p-5 text-sm text-gray-300">
          <p>
            <strong className="text-white">
              Why this page exists.
            </strong>{" "}
            Verifiability is Wikipedia&apos;s core content policy. Every
            snippet on this page links to a public, free, indexed source -
            SSRN, Zenodo, OpenAlex, Crossref. We license everything CC BY 4.0
            so attribution-with-link is always sufficient. We do not solicit
            specific edits, see the suggested topic placements at the bottom
            for ideas, but please use editorial judgment.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-4">
            Primary sources
          </h2>
          <div className="space-y-6">
            {SOURCE_NOTES.map((s) => (
              <div
                key={s.name}
                className="rounded-lg border border-slate-800 bg-slate-900/40 p-6"
              >
                <h3 className="text-base font-semibold text-white mb-2">
                  {s.name}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-3">
                  {s.note}
                </p>
                <p className="text-xs text-gray-400 mb-1">
                  Wikipedia template (copy-paste):
                </p>
                <pre className="rounded-md bg-slate-950 border border-slate-800 px-4 py-3 text-xs font-mono text-gray-200 overflow-x-auto whitespace-pre-wrap break-all">
                  <code>{s.cite}</code>
                </pre>
                <p className="text-xs text-gray-400 mt-3">
                  <a
                    href={s.apiHref}
                    className="text-sky-400 hover:text-sky-300"
                  >
                    Raw text version: {s.apiHref}
                  </a>
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-4">
            Per-finding snippets ({FINDINGS.length})
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            Each research finding has its own copy-paste snippet that cites
            the section of the SSRN paper it came from. Useful when adding
            a single specific number to an article (e.g. &quot;the
            14-day median for VC-backed startups is 71 commits&quot;).
          </p>
          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-sm">
              <thead className="bg-slate-900/60 text-left text-xs uppercase tracking-wider text-gray-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Finding</th>
                  <th className="px-4 py-3 font-medium">Section</th>
                  <th className="px-4 py-3 font-medium">Citation snippet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {FINDINGS.map((f) => (
                  <tr key={f.slug} className="align-top">
                    <td className="px-4 py-3 w-1/3">
                      <Link
                        href={`/research/${f.slug}`}
                        className="text-sky-400 hover:text-sky-300"
                      >
                        {f.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-gray-400 w-1/6">
                      {f.section}
                    </td>
                    <td className="px-4 py-3 w-1/2">
                      <a
                        href={`/api/cite/wikipedia/${f.slug}`}
                        className="text-xs font-mono text-sky-400 hover:text-sky-300 break-all"
                      >
                        /api/cite/wikipedia/{f.slug}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-4">
            Suggested topic placements
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            Ideas for where these citations could add real informational
            value to existing Wikipedia articles. We do not directly edit
            articles ourselves to avoid conflict-of-interest concerns; if
            you choose to add a citation, please use your own editorial
            judgment.
          </p>
          <ul className="space-y-3">
            {TOPIC_PROMPTS.map((p) => (
              <li
                key={p.topic}
                className="rounded-lg border border-slate-800 bg-slate-900/40 p-5"
              >
                <p className="text-sm font-semibold text-white mb-1">
                  {p.topic}
                </p>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {p.suggestion}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-6">
          <h2 className="text-base font-semibold text-white mb-3">
            Other formats
          </h2>
          <p className="text-sm text-gray-300 mb-3">
            The same per-subject citation generator handles five additional
            formats:
          </p>
          <ul className="grid sm:grid-cols-2 gap-2 text-xs font-mono">
            {["bibtex", "ris", "apa", "mla", "chicago"].map((f) => (
              <li key={f}>
                <a
                  href={`/api/cite/${f}/paper`}
                  className="text-sky-400 hover:text-sky-300"
                >
                  /api/cite/{f}/paper
                </a>
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-400 mt-3">
            Replace <code className="font-mono text-sky-300">paper</code>{" "}
            with <code className="font-mono text-sky-300">dataset</code> or
            any{" "}
            <Link
              href="/research"
              className="text-sky-400 hover:text-sky-300"
            >
              research finding
            </Link>{" "}
            slug.
          </p>
        </section>

        <SeoCta className="mt-10" />

        <p className="text-xs text-gray-400 text-center mt-10">
          See also:{" "}
          <Link href="/citation-guide" className="hover:text-gray-300">
            Citation guide
          </Link>{" "}
          ·{" "}
          <Link href="/standards" className="hover:text-gray-300">
            Standards
          </Link>{" "}
          ·{" "}
          <Link href="/attestations" className="hover:text-gray-300">
            Attestations
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
