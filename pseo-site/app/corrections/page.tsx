import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";
import { TrustConversionBlock } from "@/components/TrustConversionBlock";

const SITE = "https://signals.gitdealflow.com";

export const metadata: Metadata = {
  title: "Corrections Policy &amp; Log — VC Deal Flow Signal",
  description:
    "Public corrections policy and timestamped corrections log for VC Deal Flow Signal (GitDealFlow). Every substantive correction to the SSRN paper, the public dataset, methodology pages, and research findings is logged here with the date, what changed, and why.",
  alternates: { canonical: "/corrections" },
  openGraph: {
    title: "Corrections Policy & Log — VC Deal Flow Signal",
    description:
      "Public log of substantive corrections to research, dataset, and methodology pages — with date, scope, and reason.",
    type: "article",
    url: `${SITE}/corrections`,
  },
};

interface Correction {
  date: string; // ISO 8601
  scope: "Paper" | "Dataset" | "Methodology" | "Site copy" | "Schema";
  surface: string;
  surfaceHref?: string;
  what: string;
  why: string;
  reportedBy?: string;
}

// Real, verifiable corrections drawn from project-history facts. Each entry
// must be (a) reproducible against git history or external indexer state, and
// (b) substantive — typo fixes do not appear here.
const CORRECTIONS: Correction[] = [
  {
    date: "2026-04-26",
    scope: "Schema",
    surface: "Cross-indexer DOI propagation",
    what:
      "The dataset cross-indexer was probing the wrong DOI variant for OpenAlex propagation, returning 4/8 instead of 6/8 indexed.",
    why:
      "Internal verification script was concatenating a stale DOI prefix. Paper DOI itself was always correct on SSRN; only the verification harness was wrong. Fixed → cross-indexer now reports 6/8 (Crossref, Semantic Scholar, OpenAlex preprint+dataset, Unpaywall, DataCite, Zenodo).",
  },
  {
    date: "2026-04-25",
    scope: "Methodology",
    surface: "/research/* finding pages",
    surfaceHref: "/research",
    what:
      "Research finding pages were missing Highwire Press citation_* + Dublin Core DC.* meta tags required for Google Scholar to recognize them as citable subdivisions of the SSRN paper.",
    why:
      "Initial release shipped with Schema.org JSON-LD only. Scholar prefers Highwire Press tags for academic content. Added 13 citation_* + 6 DC.* meta tags per finding via Next 16 metadata.other.",
  },
  {
    date: "2026-04-22",
    scope: "Schema",
    surface: "SoftwareApplication offers",
    what:
      "Pricing schema initially used the generic Product type, which triggered Google Search Console Merchant errors.",
    why:
      "Google reserves Product schema for physical-goods commerce. Migrated to SoftwareApplication with offers[] array — same rich-result eligibility, no Merchant validation errors.",
  },
  {
    date: "2026-04-19",
    scope: "Site copy",
    surface: "Apex landing + signals home",
    surfaceHref: "/",
    what:
      "Removed implicit 'accelerator program' framing from headline copy; added explicit disambiguation against Y Combinator / Techstars / 500 Global in llms.txt and root identity schema.",
    why:
      "Brand-name 'engineering acceleration' was being mis-resolved by AI assistants as a reference to startup accelerator programs. Disambiguation copy now appears at the top of llms.txt and in JSON-LD knowsAbout.",
  },
  {
    date: "2026-04-18",
    scope: "Dataset",
    surface: "/api/dataset.jsonl + /api/signals.csv",
    surfaceHref: "/api/dataset.jsonl",
    what:
      "Filed Vercel mtime reset (filesystem returns 2018 epoch on serverless functions), which made dataset lastModified appear stale in DCAT 3 distribution metadata.",
    why:
      "Replaced raw fs.statSync().mtime with a clamped getDataLastModified() helper that uses git commit timestamps as the canonical source of truth. All distribution surfaces now report correct lastmod.",
  },
];

const POLICY = `When we discover that anything we publish is wrong, we fix it in the source, log it on this page with the date and reason, and re-push the affected machine-readable surfaces (Schema.org JSON-LD, Crossref via SSRN, OpenAlex, sitemap lastmod). We do not silently rewrite history. If a correction is material — meaning it changes a number we have published — we add a versioned annotation to the changed page so retrieval pipelines can detect it.`;

export default function CorrectionsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE}/corrections#page`,
        name: "Corrections Policy & Log — VC Deal Flow Signal",
        url: `${SITE}/corrections`,
        inLanguage: "en-US",
        isPartOf: { "@id": `${SITE}/#website` },
        about: {
          "@type": "Thing",
          name: "Editorial corrections policy",
        },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", "[data-speakable]"],
        },
        publisher: { "@id": "https://gitdealflow.com/#organization" },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE },
            {
              "@type": "ListItem",
              position: 2,
              name: "Corrections",
              item: `${SITE}/corrections`,
            },
          ],
        },
      },
      {
        "@type": "ItemList",
        "@id": `${SITE}/corrections#log`,
        name: "Corrections log",
        numberOfItems: CORRECTIONS.length,
        itemListElement: CORRECTIONS.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Comment",
            "@id": `${SITE}/corrections#${c.date}`,
            datePublished: c.date,
            name: `${c.scope} correction — ${c.surface}`,
            text: `${c.what} ${c.why}`,
            about: c.surfaceHref
              ? {
                  "@type": "WebPage",
                  url: c.surfaceHref.startsWith("http")
                    ? c.surfaceHref
                    : `${SITE}${c.surfaceHref}`,
                }
              : undefined,
            author: { "@id": `${SITE}/about#person` },
          },
        })),
      },
    ],
  };

  return (
    <>
      <AgentMirrorLinks path="/corrections" qaCategory="trust" />
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
          <span>Corrections</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Corrections Policy &amp; Log
        </h1>
        <p
          className="text-lg text-gray-300 mb-10 leading-relaxed"
          data-speakable
        >
          Every substantive correction to research, dataset, methodology, or
          schema appears here within seven days of the fix landing in
          production — with the date, the surface, what changed, and why.
        </p>
        <p className="text-base text-gray-400 mb-10 leading-relaxed border-l-2 border-amber-700/40 pl-4 max-w-3xl">
          The honest move is to publish the limit before you find it. This log
          exists so you can audit every change we&rsquo;ve ever made — not the
          ones we&rsquo;d have picked to show you.
        </p>

        <section className="mb-10 rounded-lg border border-slate-800 bg-slate-900/40 p-6">
          <h2 className="text-lg font-semibold text-white mb-3">Policy</h2>
          <p className="text-sm text-gray-300 leading-relaxed" data-speakable>
            {POLICY}
          </p>
          <ul className="list-disc pl-5 mt-4 space-y-1 text-sm text-gray-300">
            <li>
              Material corrections (a number we have published changes) are
              versioned in-page so retrieval pipelines can detect them.
            </li>
            <li>
              Typos and prose edits do not appear here. They appear in the
              public{" "}
              <Link
                href="/changelog"
                className="text-sky-400 hover:text-sky-300"
              >
                changelog
              </Link>
              .
            </li>
            <li>
              To report something we have wrong, email{" "}
              <a
                href="mailto:signals@gitdealflow.com"
                className="text-sky-400 hover:text-sky-300"
              >
                signals@gitdealflow.com
              </a>{" "}
              or open an issue on{" "}
              <a
                href="https://github.com/kindrat86/mcp-deal-flow-signal/issues"
                className="text-sky-400 hover:text-sky-300"
                rel="noopener noreferrer"
                target="_blank"
              >
                GitHub
              </a>
              .
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-6">
            Log ({CORRECTIONS.length} entries)
          </h2>
          <ol className="space-y-6">
            {CORRECTIONS.map((c) => (
              <li
                key={c.date + c.surface}
                id={c.date}
                className="rounded-lg border border-slate-800 bg-slate-900/40 p-5"
              >
                <div className="flex flex-wrap items-baseline gap-3 mb-2">
                  <time
                    dateTime={c.date}
                    className="text-xs font-mono text-gray-400"
                  >
                    {c.date}
                  </time>
                  <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-gray-300">
                    {c.scope}
                  </span>
                  {c.surfaceHref ? (
                    c.surfaceHref.startsWith("http") ? (
                      <a
                        href={c.surfaceHref}
                        className="text-sm text-sky-400 hover:text-sky-300"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {c.surface}
                      </a>
                    ) : (
                      <Link
                        href={c.surfaceHref}
                        className="text-sm text-sky-400 hover:text-sky-300"
                      >
                        {c.surface}
                      </Link>
                    )
                  ) : (
                    <span className="text-sm text-gray-300">{c.surface}</span>
                  )}
                </div>
                <p className="text-sm text-gray-300 leading-relaxed mb-2">
                  <span className="text-gray-400">What changed:</span> {c.what}
                </p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  <span className="text-gray-400">Why:</span> {c.why}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <p className="text-xs text-gray-400 text-center mt-12">
          See also:{" "}
          <Link href="/standards" className="hover:text-gray-300">
            Standards
          </Link>{" "}
          ·{" "}
          <Link href="/reproducibility" className="hover:text-gray-300">
            Reproducibility
          </Link>{" "}
          ·{" "}
          <Link href="/attestations" className="hover:text-gray-300">
            Attestations
          </Link>{" "}
          ·{" "}
          <Link href="/changelog" className="hover:text-gray-300">
            Changelog
          </Link>
        </p>

        <div className="mt-12">
          <DataNerdSignoff variant="default" />
        </div>

        <div className="mt-8">
          <TrustConversionBlock
            dominant="digest"
            context="This is how we stay honest. Here's the weekly read it backs."
          />
        </div>
      </div>
    </>
  );
}
