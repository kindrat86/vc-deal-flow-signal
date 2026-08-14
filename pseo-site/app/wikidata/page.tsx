import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import SeoCta from "@/components/SeoCta";

/**
 * /wikidata, Knowledge Panel claim landing.
 *
 * Brunson Audit Pass V8 (2026-05-09). Closes the +4-pt gap on Traffic
 * Secrets §2 Ch 9 (Google), the entity Q139376302 already exists on
 * Wikidata; this page is the public-facing reciprocal proof that THIS
 * domain controls THAT entity.
 *
 * What this page does:
 *   1. Asserts the bidirectional binding (domain → QID, QID → domain)
 *      in human-readable form, copy-paste SPARQL queries any consumer
 *      can run against query.wikidata.org to verify.
 *   2. Renders the same property table the manifest at
 *      /.well-known/wikidata.json carries, so search engines indexing
 *      this HTML can extract every Wikidata P-code value as on-page
 *      structured data (in addition to the JSON-LD).
 *   3. Carries its own JSON-LD WebPage that links the /wikidata page
 *      back to the Organization @id (mainEntityOfPage cycle closes).
 *   4. Cross-links to /.well-known/wikidata.json (machine), /wikipedia
 *      (citation helper), /knowledge-graph.json (full entity map).
 */

const SITE = "https://signals.gitdealflow.com";
const APEX = "https://gitdealflow.com";
const QID = "Q139376302";
const WIKIDATA_URL = `https://www.wikidata.org/wiki/${QID}`;
const WIKIDATA_JSON = `https://www.wikidata.org/wiki/Special:EntityData/${QID}.json`;
const WIKIDATA_TTL = `https://www.wikidata.org/wiki/Special:EntityData/${QID}.ttl`;

export const metadata: Metadata = {
  title:
    "Wikidata Knowledge Panel claim, VC Deal Flow Signal (Q139376302)",
  description:
    "Bidirectional Knowledge Panel claim binding the Wikidata entity Q139376302 to signals.gitdealflow.com. Includes copy-paste SPARQL verification queries, the full P-code property table, and the machine-readable manifest at /.well-known/wikidata.json. Reciprocal sameAs across 24+ external profiles.",
  alternates: { canonical: "/wikidata" },
  openGraph: {
    title: "Wikidata Knowledge Panel claim",
    description:
      "Bidirectional binding between Wikidata Q139376302 and signals.gitdealflow.com. SPARQL-verifiable.",
    type: "article",
    url: `${SITE}/wikidata`,
  },
};

const PROPERTIES: { p: string; label: string; value: string; href?: string }[] =
  [
    {
      p: "P31",
      label: "instance of",
      value: "business (Q4830453)",
      href: "https://www.wikidata.org/wiki/Q4830453",
    },
    {
      p: "P452",
      label: "industry",
      value: "financial technology (Q1063015)",
      href: "https://www.wikidata.org/wiki/Q1063015",
    },
    {
      p: "P856",
      label: "official website",
      value: SITE,
      href: SITE,
    },
    { p: "P571", label: "inception", value: "2025" },
    { p: "P1813", label: "short name", value: "GitDealFlow" },
    {
      p: "P3789",
      label: "Telegram channel",
      value: "@gitdealflow",
      href: "https://t.me/gitdealflow",
    },
    {
      p: "P2037",
      label: "GitHub username",
      value: "kindrat86",
      href: "https://github.com/kindrat86",
    },
    {
      p: "P4264",
      label: "LinkedIn company page",
      value: "gitdealflow",
      href: "https://www.linkedin.com/company/gitdealflow",
    },
    {
      p: "P17",
      label: "country",
      value: "Greece (Q41)",
      href: "https://www.wikidata.org/wiki/Q41",
    },
    {
      p: "P968",
      label: "email",
      value: "signals@gitdealflow.com",
      href: "mailto:signals@gitdealflow.com",
    },
    {
      p: "P1581",
      label: "official blog",
      value: `${SITE}/blog`,
      href: `${SITE}/blog`,
    },
    {
      p: "P496",
      label: "ORCID iD (founder)",
      value: "0009-0002-2222-4112",
      href: "https://orcid.org/0009-0002-2222-4112",
    },
    {
      p: "P1581",
      label: "research output (DOI)",
      value: "10.2139/ssrn.6606558",
      href: "https://ssrn.com/abstract=6606558",
    },
  ];

const ATTESTATIONS = [
  {
    method: "HTML rel=me link",
    where: "Every page (app/layout.tsx)",
    target: WIKIDATA_URL,
    snippet: `<link rel="me" href="${WIKIDATA_URL}" />`,
  },
  {
    method: "JSON-LD identifier (Organization)",
    where: "Every page (RootIdentitySchema) + homepage @graph",
    target: WIKIDATA_URL,
    snippet: `{ "@type": "PropertyValue", "propertyID": "wikidata", "value": "${QID}", "url": "${WIKIDATA_URL}" }`,
  },
  {
    method: "Well-known manifest",
    where: "/.well-known/wikidata.json",
    target: WIKIDATA_URL,
    snippet: `curl -s ${SITE}/.well-known/wikidata.json | jq .entity.qid`,
  },
  {
    method: "Reciprocal P856 (official website)",
    where: `Wikidata claim ${QID}#P856`,
    target: SITE,
    snippet: `SELECT ?website WHERE { wd:${QID} wdt:P856 ?website . }`,
  },
];

const SPARQL_QUERIES = [
  {
    label: "Resolve QID → official website",
    query: `SELECT ?website WHERE { wd:${QID} wdt:P856 ?website . }`,
  },
  {
    label: "Resolve QID → all label languages",
    query: `SELECT ?label WHERE { wd:${QID} rdfs:label ?label . }`,
  },
  {
    label: "Resolve QID → industry + instance-of types",
    query: `SELECT ?industryLabel ?typeLabel WHERE {
  wd:${QID} wdt:P452 ?industry ; wdt:P31 ?type .
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en" . }
}`,
  },
  {
    label: "Resolve QID → all external IDs (sitelinks + identifiers)",
    query: `SELECT ?prop ?value WHERE {
  wd:${QID} ?p ?value .
  ?prop wikibase:directClaim ?p .
  ?prop wikibase:propertyType wikibase:ExternalId .
}`,
  },
];

export default function WikidataClaimPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE}/wikidata#page`,
        url: `${SITE}/wikidata`,
        name: "Wikidata Knowledge Panel claim, VC Deal Flow Signal",
        description:
          "Bidirectional Knowledge Panel claim binding the Wikidata entity Q139376302 to signals.gitdealflow.com. SPARQL-verifiable.",
        inLanguage: "en-US",
        isPartOf: { "@id": `${SITE}/#website` },
        mainEntity: { "@id": `${APEX}/#organization` },
        about: {
          "@type": "Thing",
          name: "Wikidata entity Q139376302",
          identifier: {
            "@type": "PropertyValue",
            propertyID: "wikidata",
            value: QID,
            url: WIKIDATA_URL,
          },
          sameAs: WIKIDATA_URL,
        },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", "[data-speakable]"],
        },
      },
      // ClaimReview-style attestation that this page asserts the QID
      // binding. Lets Google Fact Check Tools see the claim.
      {
        "@type": "ClaimReview",
        "@id": `${SITE}/wikidata#claim`,
        url: `${SITE}/wikidata`,
        claimReviewed: `signals.gitdealflow.com is the canonical web presence of the Wikidata entity ${QID}.`,
        author: { "@id": `${APEX}/#organization` },
        datePublished: "2026-05-09",
        itemReviewed: {
          "@type": "Thing",
          name: "VC Deal Flow Signal",
          identifier: {
            "@type": "PropertyValue",
            propertyID: "wikidata",
            value: QID,
            url: WIKIDATA_URL,
          },
        },
        reviewRating: {
          "@type": "Rating",
          bestRating: 5,
          worstRating: 1,
          ratingValue: 5,
          alternateName: "Verified, bidirectional reciprocal claim",
        },
      },
    ],
  };

  return (
    <>
      <AgentMirrorLinks path="/wikidata" qaCategory="trust" />
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
          <span>Wikidata</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Wikidata Knowledge Panel claim
        </h1>
        <p
          className="text-lg text-gray-300 mb-8 leading-relaxed"
          data-speakable
        >
          This page is the public-facing reciprocal proof that this domain (
          <code className="font-mono text-sky-300">signals.gitdealflow.com</code>
          ) is the canonical web presence of the Wikidata entity{" "}
          <a
            href={WIKIDATA_URL}
            className="font-mono text-sky-400 hover:text-sky-300"
          >
            {QID}
          </a>
          . Every claim on this page is independently verifiable against
          Wikidata via SPARQL, no trust required.
        </p>

        <section className="mb-10 rounded-lg border border-emerald-900/40 bg-emerald-950/20 p-5 text-sm text-emerald-100/90">
          <p className="font-semibold mb-2 text-emerald-300">
            Bidirectional binding ✓
          </p>
          <ul className="space-y-1 list-disc pl-5">
            <li>
              <strong className="text-white">Wikidata → Domain:</strong>{" "}
              property{" "}
              <a
                href={`${WIKIDATA_URL}#P856`}
                className="text-emerald-300 hover:text-emerald-200 font-mono"
              >
                P856
              </a>{" "}
              (official website) on entity {QID} resolves to{" "}
              <code className="font-mono">{SITE}</code>.
            </li>
            <li>
              <strong className="text-white">Domain → Wikidata:</strong> JSON-LD{" "}
              <code className="font-mono text-emerald-200">
                Organization.identifier
              </code>{" "}
              PropertyValue carries{" "}
              <code className="font-mono">propertyID:&quot;wikidata&quot;</code>{" "}
              <code className="font-mono">value:&quot;{QID}&quot;</code> on
              every page (homepage + RootIdentitySchema).
            </li>
            <li>
              <strong className="text-white">IndieAuth verified identity:</strong>{" "}
              <code className="font-mono text-emerald-200">
                &lt;link rel=&quot;me&quot; href=&quot;{WIKIDATA_URL}&quot; /&gt;
              </code>{" "}
              on every page.
            </li>
            <li>
              <strong className="text-white">Machine-readable manifest:</strong>{" "}
              <Link
                href="/.well-known/wikidata.json"
                className="text-emerald-300 hover:text-emerald-200 font-mono"
              >
                /.well-known/wikidata.json
              </Link>{" "}
              (RFC 8615).
            </li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-4">
            Entity at a glance
          </h2>
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-6 text-sm">
            <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-gray-300">
              <div>
                <dt className="text-xs uppercase tracking-wider text-gray-500">
                  QID
                </dt>
                <dd className="font-mono">
                  <a
                    href={WIKIDATA_URL}
                    className="text-sky-400 hover:text-sky-300"
                  >
                    {QID}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-gray-500">
                  Label
                </dt>
                <dd>VC Deal Flow Signal</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-gray-500">
                  Aliases
                </dt>
                <dd>GitDealFlow · Engineering Acceleration Watch</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-gray-500">
                  JSON
                </dt>
                <dd className="font-mono break-all">
                  <a
                    href={WIKIDATA_JSON}
                    className="text-sky-400 hover:text-sky-300"
                  >
                    Special:EntityData/{QID}.json
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-gray-500">
                  Turtle
                </dt>
                <dd className="font-mono break-all">
                  <a
                    href={WIKIDATA_TTL}
                    className="text-sky-400 hover:text-sky-300"
                  >
                    Special:EntityData/{QID}.ttl
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-gray-500">
                  Manifest
                </dt>
                <dd className="font-mono break-all">
                  <Link
                    href="/.well-known/wikidata.json"
                    className="text-sky-400 hover:text-sky-300"
                  >
                    /.well-known/wikidata.json
                  </Link>
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-4">
            Properties (Wikidata P-codes)
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            Every property below is a self-attested mirror of the
            corresponding claim on{" "}
            <a
              href={WIKIDATA_URL}
              className="text-sky-400 hover:text-sky-300"
            >
              {QID}
            </a>
            . Differences indicate stale on-Wikidata claims, file a
            correction by editing the entity directly. The machine-readable
            mirror at{" "}
            <Link
              href="/.well-known/wikidata.json"
              className="text-sky-400 hover:text-sky-300 font-mono"
            >
              /.well-known/wikidata.json
            </Link>{" "}
            carries the same table.
          </p>
          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-sm">
              <thead className="bg-slate-900/60 text-left text-xs uppercase tracking-wider text-gray-400">
                <tr>
                  <th className="px-4 py-3 font-medium">P-code</th>
                  <th className="px-4 py-3 font-medium">Property</th>
                  <th className="px-4 py-3 font-medium">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {PROPERTIES.map((row) => (
                  <tr key={`${row.p}-${row.label}`} className="align-top">
                    <td className="px-4 py-3 font-mono text-xs">
                      <a
                        href={`https://www.wikidata.org/wiki/Property:${row.p}`}
                        className="text-sky-400 hover:text-sky-300"
                      >
                        {row.p}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-gray-300">{row.label}</td>
                    <td className="px-4 py-3 font-mono text-xs break-all text-gray-200">
                      {row.href ? (
                        <a
                          href={row.href}
                          className="text-sky-400 hover:text-sky-300"
                        >
                          {row.value}
                        </a>
                      ) : (
                        row.value
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-4">
            Verify yourself (SPARQL)
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            Each query below is independently runnable against the public
            Wikidata SPARQL endpoint at{" "}
            <a
              href="https://query.wikidata.org"
              className="text-sky-400 hover:text-sky-300 font-mono"
            >
              query.wikidata.org
            </a>
            . Click any query to open it pre-loaded.
          </p>
          <div className="space-y-4">
            {SPARQL_QUERIES.map((q) => (
              <div
                key={q.label}
                className="rounded-lg border border-slate-800 bg-slate-900/40 p-5"
              >
                <p className="text-sm font-semibold text-white mb-2">
                  {q.label}
                </p>
                <pre className="rounded-md bg-slate-950 border border-slate-800 px-4 py-3 text-xs font-mono text-gray-200 overflow-x-auto whitespace-pre-wrap">
                  <code>{q.query}</code>
                </pre>
                <p className="text-xs mt-2">
                  <a
                    href={`https://query.wikidata.org/#${encodeURIComponent(
                      q.query
                    )}`}
                    className="text-sky-400 hover:text-sky-300"
                  >
                    Run on query.wikidata.org →
                  </a>
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-4">
            Attestation methods
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            Four independent surfaces on this domain assert the same QID
            binding. A consumer that reaches any one of them can resolve
            the entity without trusting the others.
          </p>
          <div className="space-y-3">
            {ATTESTATIONS.map((a) => (
              <div
                key={a.method}
                className="rounded-lg border border-slate-800 bg-slate-900/40 p-5"
              >
                <p className="text-sm font-semibold text-white mb-1">
                  {a.method}
                </p>
                <p className="text-xs text-gray-400 mb-2">{a.where}</p>
                <pre className="rounded-md bg-slate-950 border border-slate-800 px-3 py-2 text-xs font-mono text-gray-200 overflow-x-auto whitespace-pre-wrap break-all">
                  <code>{a.snippet}</code>
                </pre>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-6">
          <h2 className="text-base font-semibold text-white mb-3">
            Related surfaces
          </h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/.well-known/wikidata.json"
                className="text-sky-400 hover:text-sky-300 font-mono"
              >
                /.well-known/wikidata.json
              </Link>{" "}
machine-readable manifest of every claim on this page.
            </li>
            <li>
              <Link
                href="/wikipedia"
                className="text-sky-400 hover:text-sky-300 font-mono"
              >
                /wikipedia
              </Link>{" "}
copy-paste{" "}
              <code className="font-mono text-xs text-gray-300">
                {`{{cite journal}}`}
              </code>{" "}
              and{" "}
              <code className="font-mono text-xs text-gray-300">
                {`{{cite web}}`}
              </code>{" "}
              snippets pre-filled with our DOI + dataset.
            </li>
            <li>
              <Link
                href="/knowledge-graph.json"
                className="text-sky-400 hover:text-sky-300 font-mono"
              >
                /knowledge-graph.json
              </Link>{" "}
full site-wide JSON-LD entity map.
            </li>
            <li>
              <Link
                href="/.well-known/discover.json"
                className="text-sky-400 hover:text-sky-300 font-mono"
              >
                /.well-known/discover.json
              </Link>{" "}
umbrella manifest of every well-known + root surface.
            </li>
            <li>
              <Link
                href="/attestations"
                className="text-sky-400 hover:text-sky-300 font-mono"
              >
                /attestations
              </Link>{" "}
every public claim with source, date, and ClaimReview
              fact-check status.
            </li>
          </ul>
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
          <Link href="/about" className="hover:text-gray-300">
            About
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
