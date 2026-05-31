import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";

const SITE = "https://signals.gitdealflow.com";

export const metadata: Metadata = {
  title: "Standards — Specifications VC Deal Flow Signal Conforms To",
  description:
    "Every published specification, schema, and standard VC Deal Flow Signal (GitDealFlow) implements end-to-end — Schema.org, Dublin Core, Highwire Press, DCAT 3, FAIR, OpenAPI 3.1, MCP, A2A, llms.txt, security.txt, IndieWeb. Each entry links to the spec and to the surface that exposes it.",
  alternates: { canonical: "/standards" },
  openGraph: {
    title: "Standards — Specifications VC Deal Flow Signal Conforms To",
    description:
      "Schema.org, Dublin Core, Highwire Press, DCAT 3, FAIR, OpenAPI 3.1, MCP, A2A, llms.txt, security.txt, IndieWeb — every spec implemented.",
    type: "article",
    url: `${SITE}/standards`,
  },
};

interface Standard {
  group:
    | "Structured data"
    | "Citation & scholarly"
    | "Open data & FAIR"
    | "API & agents"
    | "Web platform"
    | "Identity & federation"
    | "Operations & trust";
  name: string;
  spec: string;
  appliedAt: string;
  appliedHref: string;
  note: string;
}

const STANDARDS: Standard[] = [
  // Structured data
  {
    group: "Structured data",
    name: "Schema.org (JSON-LD)",
    spec: "https://schema.org/",
    appliedAt: "Site-wide @graph",
    appliedHref: "/knowledge-graph.json",
    note:
      "WebSite + Organization + Person + SoftwareApplication on every page; 40+ specialized types across pSEO templates (Dataset, FAQPage, ScholarlyArticle, Course, ClaimReview, Speakable).",
  },
  {
    group: "Structured data",
    name: "JSON-LD 1.1",
    spec: "https://www.w3.org/TR/json-ld11/",
    appliedAt: "All <script type=\"application/ld+json\"> blocks",
    appliedHref: "/knowledge-graph.json",
    note:
      "Stable @id anchors so cross-page references collapse into the same entity in any consumer's graph.",
  },
  {
    group: "Structured data",
    name: "Speakable Specification",
    spec: "https://schema.org/SpeakableSpecification",
    appliedAt: "Pillar + answer pages",
    appliedHref: "/citation-guide",
    note:
      "Voice-assistant-friendly summaries scoped to h1, h2, and [data-speakable] selectors.",
  },

  // Citation & scholarly
  {
    group: "Citation & scholarly",
    name: "Highwire Press citation_* meta",
    spec: "https://scholar.google.com/intl/en/scholar/inclusion.html",
    appliedAt: "/research/* pages",
    appliedHref: "/research",
    note:
      "13 citation_* + 6 DC.* meta tags per finding for Google Scholar indexing as a citable subdivision of the SSRN paper.",
  },
  {
    group: "Citation & scholarly",
    name: "Dublin Core Metadata Element Set",
    spec: "https://www.dublincore.org/specifications/dublin-core/dces/",
    appliedAt: "Research findings + dataset descriptors",
    appliedHref: "/.well-known/dataset.json",
    note:
      "DC.title / DC.creator / DC.identifier / DC.publisher / DC.subject / DC.rights on every research finding.",
  },
  {
    group: "Citation & scholarly",
    name: "BibTeX, RIS, APA, MLA, Chicago",
    spec: "https://www.bibtex.org/Format/",
    appliedAt: "Citation guide + per-page citation block",
    appliedHref: "/citation-guide",
    note:
      "Five canonical citation formats plus AI-attribution template, all served as plain text.",
  },
  {
    group: "Citation & scholarly",
    name: "DOI (Digital Object Identifier)",
    spec: "https://www.doi.org/the-identifier/what-is-a-doi/",
    appliedAt: "SSRN paper",
    appliedHref: "https://doi.org/10.2139/ssrn.6606558",
    note: "DOI 10.2139/ssrn.6606558 registered through Crossref; resolves to the canonical PDF.",
  },
  {
    group: "Citation & scholarly",
    name: "ORCID iD",
    spec: "https://info.orcid.org/what-is-orcid/",
    appliedAt: "Author identity",
    appliedHref: "https://orcid.org/0009-0002-2222-4112",
    note: "Persistent author identifier 0009-0002-2222-4112 for The Data Nerd; used in JSON-LD Person.identifier.",
  },

  // Open data & FAIR
  {
    group: "Open data & FAIR",
    name: "FAIR Data Principles",
    spec: "https://www.go-fair.org/fair-principles/",
    appliedAt: "Dataset distribution",
    appliedHref: "/api/dataset.jsonl",
    note:
      "Findable (Wikidata + Crossref + OpenAlex); Accessible (HTTPS + CSV + JSONL + JSON-LD); Interoperable (Schema.org + DCAT 3); Reusable (CC BY 4.0 + provenance).",
  },
  {
    group: "Open data & FAIR",
    name: "DCAT 3",
    spec: "https://www.w3.org/TR/vocab-dcat-3/",
    appliedAt: "/.well-known/dataset.json",
    appliedHref: "/.well-known/dataset.json",
    note: "DataCatalog + Dataset + Distribution + DataDownload typed entries with dcat: + dcterms: cross-vocabulary.",
  },
  {
    group: "Open data & FAIR",
    name: "Creative Commons Attribution 4.0",
    spec: "https://creativecommons.org/licenses/by/4.0/",
    appliedAt: "Dataset, Q&A corpus, research findings",
    appliedHref: "/citation-guide",
    note: "CC BY 4.0 declared on every distribution surface and in every JSON-LD license: field.",
  },
  {
    group: "Open data & FAIR",
    name: "DataCite Schema 4.5",
    spec: "https://schema.datacite.org/meta/kernel-4.5/",
    appliedAt: "Zenodo deposit",
    appliedHref: "https://zenodo.org/records/19650920",
    note: "Dataset deposit registered with DataCite via Zenodo; receives a DataCite DOI.",
  },

  // API & agents
  {
    group: "API & agents",
    name: "OpenAPI 3.1",
    spec: "https://spec.openapis.org/oas/v3.1.0",
    appliedAt: "/api/openapi.json + /.well-known/openapi.json",
    appliedHref: "/api/openapi.json",
    note: "Full spec for every public endpoint; consumed by Postman, Insomnia, Swagger UI, Bruno, and AI agents.",
  },
  {
    group: "API & agents",
    name: "Model Context Protocol (MCP)",
    spec: "https://modelcontextprotocol.io/specification",
    appliedAt: "/api/mcp/rpc + /.well-known/mcp.json",
    appliedHref: "https://glama.ai/mcp/servers/kindrat86/mcp-deal-flow-signal",
    note:
      "Live stdio + HTTP MCP server, Glama A-Tier (4.9/5.0 across 6 tools). Six tools (trending, sector, profile, summary, scout receipts, methodology) free forever.",
  },
  {
    group: "API & agents",
    name: "A2A Protocol (Agent2Agent)",
    spec: "https://a2aproject.dev/",
    appliedAt: "/api/a2a + /.well-known/agent-card.json",
    appliedHref: "/.well-known/agent-card.json",
    note: "AgentCard discovery endpoint and JSON-RPC stub conforming to the A2A v0.1 spec.",
  },
  {
    group: "API & agents",
    name: "llms.txt",
    spec: "https://llmstxt.org/",
    appliedAt: "/llms.txt + /llms-full.txt + /llms/[pillar]",
    appliedHref: "/llms.txt",
    note: "Three layers — index, full corpus, per-pillar segments — so retrieval pipelines can grab as much or as little as they need.",
  },
  {
    group: "API & agents",
    name: "ai.txt + ai-policy.json",
    spec: "https://site.spawning.ai/spawning-ai-txt",
    appliedAt: "/ai.txt + /.well-known/ai-policy.json",
    appliedHref: "/.well-known/ai-policy.json",
    note: "Per-bot machine-readable allow/deny policy; explicit allowlist for 25+ AI crawlers.",
  },
  {
    group: "API & agents",
    name: "OpenSearch Description Format",
    spec: "http://www.opensearch.org/Specifications/OpenSearch/1.1",
    appliedAt: "/opensearch.xml",
    appliedHref: "/opensearch.xml",
    note: "Browser address-bar search engine descriptor; also referenced from <link rel=\"search\">.",
  },

  // Web platform
  {
    group: "Web platform",
    name: "Sitemaps Protocol 0.9",
    spec: "https://www.sitemaps.org/protocol.html",
    appliedAt: "/sitemap.xml + /sitemap/[id]",
    appliedHref: "/sitemap.xml",
    note: "Sitemap index + per-section paginated sitemaps; News-Sitemap variant at /news-sitemap.xml.",
  },
  {
    group: "Web platform",
    name: "robots.txt (RFC 9309)",
    spec: "https://www.rfc-editor.org/rfc/rfc9309",
    appliedAt: "/robots.txt",
    appliedHref: "/robots.txt",
    note: "Named-allowlist for 25+ AI bots; sitemap pointers for both apex and signals subdomain.",
  },
  {
    group: "Web platform",
    name: "RSS 2.0 + JSON Feed 1.1",
    spec: "https://www.jsonfeed.org/version/1.1/",
    appliedAt: "/feed.xml + /feed.json",
    appliedHref: "/feed.json",
    note: "Both XML RSS and modern JSON Feed; LLM ingestion pipelines prefer JSON Feed.",
  },
  {
    group: "Web platform",
    name: "ISO 8601 (date/time)",
    spec: "https://www.iso.org/iso-8601-date-and-time-format.html",
    appliedAt: "All datePublished / dateModified / lastmod fields",
    appliedHref: "/sitemap.xml",
    note: "All timestamps emitted in ISO 8601 with explicit UTC offset.",
  },

  // Identity & federation
  {
    group: "Identity & federation",
    name: "WebFinger (RFC 7033)",
    spec: "https://www.rfc-editor.org/rfc/rfc7033",
    appliedAt: "/.well-known/webfinger",
    appliedHref: "/.well-known/webfinger?resource=acct:signal@gitdealflow.com",
    note: "JRD descriptor enables Mastodon, Lemmy, and IndieWeb crawlers to resolve canonical entity metadata.",
  },
  {
    group: "Identity & federation",
    name: "NodeInfo 2.1",
    spec: "http://nodeinfo.diaspora.software/protocol.html",
    appliedAt: "/.well-known/nodeinfo",
    appliedHref: "/.well-known/nodeinfo",
    note: "Federated-graph discovery for the fediverse. Identifies the site's protocol and software footprint.",
  },
  {
    group: "Identity & federation",
    name: "IndieWeb rel=me",
    spec: "https://indieweb.org/rel-me",
    appliedAt: "Site-wide <link rel=\"me\">",
    appliedHref: "/about",
    note: "Reciprocal identity verification across ORCID, Wikidata, X, GitHub, LinkedIn, npm, Telegram.",
  },
  {
    group: "Identity & federation",
    name: "Wikidata",
    spec: "https://www.wikidata.org/wiki/Wikidata:Introduction",
    appliedAt: "Cross-graph @id reference",
    appliedHref: "https://www.wikidata.org/wiki/Q139376302",
    note: "Q-ID Q139376302 with sameAs cross-graph; primary canonical identity in JSON-LD Organization.sameAs.",
  },
  {
    group: "Identity & federation",
    name: "host-meta (RFC 6415)",
    spec: "https://www.rfc-editor.org/rfc/rfc6415",
    appliedAt: "/.well-known/host-meta + host-meta.json",
    appliedHref: "/.well-known/host-meta.json",
    note: "Site metadata document; enables clients to resolve canonical URIs for the host.",
  },

  // Operations & trust
  {
    group: "Operations & trust",
    name: "security.txt (RFC 9116)",
    spec: "https://www.rfc-editor.org/rfc/rfc9116",
    appliedAt: "/.well-known/security.txt",
    appliedHref: "/.well-known/security.txt",
    note: "Security disclosure contact + canonical URL + preferred languages + expiry.",
  },
  {
    group: "Operations & trust",
    name: "traffic-advice",
    spec: "https://github.com/buettner/private-prefetch-proxy/blob/main/traffic-advice.md",
    appliedAt: "/.well-known/traffic-advice",
    appliedHref: "/.well-known/traffic-advice",
    note: "Origin-policy hint to private-prefetch proxies (Chrome's Privacy Sandbox).",
  },
  {
    group: "Operations & trust",
    name: "OAuth 2.0 Authorization Server Metadata (RFC 8414)",
    spec: "https://www.rfc-editor.org/rfc/rfc8414",
    appliedAt: "/.well-known/oauth-authorization-server",
    appliedHref: "/.well-known/oauth-authorization-server",
    note: "Server metadata document for clients to discover OAuth endpoints and capabilities.",
  },
  {
    group: "Operations & trust",
    name: "Change Password URL Well-Known (RFC 8615)",
    spec: "https://www.rfc-editor.org/rfc/rfc8615",
    appliedAt: "/.well-known/change-password",
    appliedHref: "/.well-known/change-password",
    note: "Standard discovery endpoint that lets password managers route users to the change-password flow.",
  },
];

const GROUPS: Standard["group"][] = [
  "Structured data",
  "Citation & scholarly",
  "Open data & FAIR",
  "API & agents",
  "Web platform",
  "Identity & federation",
  "Operations & trust",
];

export default function StandardsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE}/standards#page`,
        name: "Standards — VC Deal Flow Signal",
        url: `${SITE}/standards`,
        inLanguage: "en-US",
        isPartOf: { "@id": `${SITE}/#website` },
        about: {
          "@type": "Thing",
          name: "Open standards for venture-data interoperability",
        },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", "[data-speakable]"],
        },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE },
            {
              "@type": "ListItem",
              position: 2,
              name: "Standards",
              item: `${SITE}/standards`,
            },
          ],
        },
      },
      {
        "@type": "ItemList",
        "@id": `${SITE}/standards#list`,
        name: "Specifications implemented end-to-end",
        numberOfItems: STANDARDS.length,
        itemListElement: STANDARDS.map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "TechArticle",
            name: s.name,
            url: s.spec,
            isBasedOn: s.spec,
            mainEntityOfPage: s.appliedHref.startsWith("http")
              ? s.appliedHref
              : `${SITE}${s.appliedHref}`,
            description: s.note,
          },
        })),
      },
    ],
  };

  return (
    <>
      <AgentMirrorLinks path="/standards" qaCategory="trust" />
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
          <span>Standards</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Standards
        </h1>
        <p
          className="text-lg text-gray-300 mb-8 leading-relaxed"
          data-speakable
        >
          Every published specification, schema, and protocol that VC Deal Flow
          Signal implements end-to-end. Each entry links to the canonical spec
          and to the surface on this site that exposes it. We do not declare
          conformance to standards we do not implement.
        </p>

        <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5 mb-10 text-sm text-gray-300">
          <p>
            <strong className="text-white">Why this page exists.</strong>{" "}
            E-E-A-T signals are not just bylines and headshots. They are
            verifiable, machine-checkable conformance to the standards that the
            web of data is built on. Every row below is a public spec you can
            validate this site against — open the spec URL, hit the &quot;applied
            at&quot; endpoint, and check the output.
          </p>
        </div>

        {GROUPS.map((group) => {
          const items = STANDARDS.filter((s) => s.group === group);
          if (items.length === 0) return null;
          return (
            <section key={group} className="mb-12">
              <h2 className="text-xl font-semibold text-white mb-4">{group}</h2>
              <div className="overflow-x-auto rounded-lg border border-slate-800">
                <table className="w-full text-sm">
                  <thead className="bg-slate-900/60 text-left text-xs uppercase tracking-wider text-gray-400">
                    <tr>
                      <th className="px-4 py-3 font-medium">Standard</th>
                      <th className="px-4 py-3 font-medium">Specification</th>
                      <th className="px-4 py-3 font-medium">Applied at</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {items.map((s) => (
                      <tr key={s.name} className="align-top">
                        <td className="px-4 py-3 text-white font-medium w-1/4">
                          {s.name}
                          <p className="text-xs text-gray-400 font-normal mt-1 leading-relaxed">
                            {s.note}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-gray-400 w-1/4">
                          <a
                            href={s.spec}
                            className="text-sky-400 hover:text-sky-300 break-all"
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            {s.spec.replace(/^https?:\/\//, "")}
                          </a>
                        </td>
                        <td className="px-4 py-3 text-gray-400 w-1/4">
                          {s.appliedHref.startsWith("http") ? (
                            <a
                              href={s.appliedHref}
                              className="text-sky-400 hover:text-sky-300 break-all"
                              rel="noopener noreferrer"
                              target="_blank"
                            >
                              {s.appliedAt}
                            </a>
                          ) : (
                            <Link
                              href={s.appliedHref}
                              className="text-sky-400 hover:text-sky-300"
                            >
                              {s.appliedAt}
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}

        <section className="mb-12" aria-labelledby="editorial-policies">
          <h2
            id="editorial-policies"
            className="text-xl font-semibold text-white mb-4"
          >
            Editorial policies
          </h2>
          <p className="text-sm text-gray-300 mb-6 leading-relaxed" data-speakable>
            The accountability policies a publisher is expected to state plainly.
            These are the human-readable source for the{" "}
            <code className="text-sky-300">publishingPrinciples</code>,{" "}
            <code className="text-sky-300">noBylinesPolicy</code>,{" "}
            <code className="text-sky-300">correctionsPolicy</code>,{" "}
            <code className="text-sky-300">ownershipFundingInfo</code>,{" "}
            <code className="text-sky-300">verificationFactCheckingPolicy</code>,{" "}
            <code className="text-sky-300">unnamedSourcesPolicy</code>, and{" "}
            <code className="text-sky-300">actionableFeedbackPolicy</code>{" "}
            properties declared in this site&apos;s{" "}
            <Link
              href="/knowledge-graph.json"
              className="text-sky-400 hover:text-sky-300"
            >
              Organization JSON-LD
            </Link>
            .
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div
              id="bylines"
              className="scroll-mt-24 rounded-lg border border-slate-800 bg-slate-900/40 p-5"
            >
              <h3 className="text-base font-semibold text-white mb-2">
                Bylines &amp; author identity
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Editorial work is published under the pseudonymous byline{" "}
                <strong className="text-white">The Data Nerd</strong> by
                deliberate policy, not omission. The methodology is the
                protagonist; the operator stays anonymous on purpose. The
                identity is nonetheless persistent and accountable: one{" "}
                <a
                  href="https://orcid.org/0009-0002-2222-4112"
                  className="text-sky-400 hover:text-sky-300"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  ORCID iD
                </a>
                , one{" "}
                <Link href="/about" className="text-sky-400 hover:text-sky-300">
                  author profile
                </Link>
                , and a published, DOI-bearing{" "}
                <Link
                  href="/research"
                  className="text-sky-400 hover:text-sky-300"
                >
                  methodology paper
                </Link>{" "}
                stand behind every claim. No claim depends on the author&apos;s
                identity — each is traceable to the public dataset.
              </p>
            </div>

            <div
              id="ownership"
              className="scroll-mt-24 rounded-lg border border-slate-800 bg-slate-900/40 p-5"
            >
              <h3 className="text-base font-semibold text-white mb-2">
                Ownership &amp; funding
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Independently operated and self-funded by subscription and
                dataset revenue — not affiliated with, owned by, or funded by
                any incumbent VC platform, fund, or data vendor. Full ownership
                and funding disclosure is published in the annual{" "}
                <Link
                  href="/transparency"
                  className="text-sky-400 hover:text-sky-300"
                >
                  Transparency Report
                </Link>
                .
              </p>
            </div>

            <div
              id="ethics"
              className="scroll-mt-24 rounded-lg border border-slate-800 bg-slate-900/40 p-5"
            >
              <h3 className="text-base font-semibold text-white mb-2">
                Ethics &amp; sourcing
              </h3>
              <p
                id="sourcing"
                className="scroll-mt-24 text-sm text-gray-300 leading-relaxed"
              >
                Every signal is derived from <strong className="text-white">
                  public
                </strong>{" "}
                GitHub activity. We use no private, scraped-behind-login, or
                unnamed-source data, and we do not pay for tips. There are no
                anonymous sources to protect because there are none — the inputs
                are public and the transformation is documented in the{" "}
                <Link
                  href="/methodology"
                  className="text-sky-400 hover:text-sky-300"
                >
                  methodology
                </Link>
                . Conflicts of interest (any position in a covered company) are
                disclosed at point of coverage.
              </p>
            </div>

            <div
              id="feedback"
              className="scroll-mt-24 rounded-lg border border-slate-800 bg-slate-900/40 p-5"
            >
              <h3 className="text-base font-semibold text-white mb-2">
                Corrections &amp; feedback
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Spotted an error? Email{" "}
                <a
                  href="mailto:signal@gitdealflow.com"
                  className="text-sky-400 hover:text-sky-300"
                >
                  signal@gitdealflow.com
                </a>{" "}
                or open a public{" "}
                <a
                  href="https://github.com/kindrat86/mcp-deal-flow-signal/issues"
                  className="text-sky-400 hover:text-sky-300"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  GitHub issue
                </a>
                . Verification-driven fact-checking is documented in the{" "}
                <Link
                  href="/methodology"
                  className="text-sky-400 hover:text-sky-300"
                >
                  methodology
                </Link>
                , and every accepted correction is logged publicly, with date
                and rationale, in the{" "}
                <Link
                  href="/corrections"
                  className="text-sky-400 hover:text-sky-300"
                >
                  corrections log
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12 rounded-lg border border-slate-800 bg-slate-900/40 p-6">
          <h2 className="text-lg font-semibold text-white mb-3">
            How to verify
          </h2>
          <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-300">
            <li>
              Pick a row above and open the &quot;Specification&quot; link to
              read the canonical spec.
            </li>
            <li>
              Open the &quot;Applied at&quot; URL and inspect the raw output
              (Schema.org JSON-LD validates at{" "}
              <a
                href="https://validator.schema.org/"
                className="text-sky-400 hover:text-sky-300"
                rel="noopener noreferrer"
                target="_blank"
              >
                validator.schema.org
              </a>
              ; OpenAPI at{" "}
              <a
                href="https://editor.swagger.io/"
                className="text-sky-400 hover:text-sky-300"
                rel="noopener noreferrer"
                target="_blank"
              >
                editor.swagger.io
              </a>
              ; sitemaps at{" "}
              <a
                href="https://www.xml-sitemaps.com/validate-xml-sitemap.html"
                className="text-sky-400 hover:text-sky-300"
                rel="noopener noreferrer"
                target="_blank"
              >
                xml-sitemaps validator
              </a>
              ).
            </li>
            <li>
              If anything fails to validate, open an issue on the public{" "}
              <a
                href="https://github.com/kindrat86/mcp-deal-flow-signal/issues"
                className="text-sky-400 hover:text-sky-300"
                rel="noopener noreferrer"
                target="_blank"
              >
                GitHub repository
              </a>
              {" "}or email{" "}
              <a
                href="mailto:signal@gitdealflow.com"
                className="text-sky-400 hover:text-sky-300"
              >
                signal@gitdealflow.com
              </a>
              . Documented fixes go in the public{" "}
              <Link
                href="/corrections"
                className="text-sky-400 hover:text-sky-300"
              >
                corrections log
              </Link>
              .
            </li>
          </ol>
        </section>

        <p className="text-xs text-gray-400 text-center">
          See also:{" "}
          <Link href="/citation-guide" className="hover:text-gray-300">
            Citation guide
          </Link>{" "}
          ·{" "}
          <Link href="/reproducibility" className="hover:text-gray-300">
            Reproducibility kit
          </Link>{" "}
          ·{" "}
          <Link href="/attestations" className="hover:text-gray-300">
            Third-party attestations
          </Link>{" "}
          ·{" "}
          <Link href="/corrections" className="hover:text-gray-300">
            Corrections policy &amp; log
          </Link>
        </p>
      </div>
    </>
  );
}
