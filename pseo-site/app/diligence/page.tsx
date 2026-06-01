import type { Metadata } from "next";
import Link from "next/link";
import { AgentSummary } from "@/components/AgentSummary";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import { getDataLastModified } from "@/lib/data";
import {
  buildDossier,
  getDiligenceEntityCount,
  type DiligenceDossier,
} from "@/lib/diligence";
import { ACQUIRERS } from "@/content/acquirers";
import { companies } from "@/content/companies";
import { getInvestorsForCompany } from "@/content/fund-portfolio";
import { TrustConversionBlock } from "@/components/TrustConversionBlock";

const SITE = "https://signals.gitdealflow.com";

export const revalidate = 86400;

export const metadata: Metadata = {
  title:
    "Diligence Answers for AI Agents — Who Acquired X, Who Backed Y, Signal on Z",
  description:
    "The questions an AI agent asks mid-diligence — who acquired a company, which funds backed it, what its engineering signal is — answered over a public-source entity corpus as one citation-ready dossier. JSON + MCP endpoints for agents.",
  alternates: { canonical: "/diligence" },
  openGraph: {
    title: "Agent Diligence Answers — one cited dossier per company",
    description:
      "Who acquired X · which funds backed Y · what's the signal on Z. Public-source, citation-ready, machine-readable. Built to be the grounding source AI agents reach for during diligence.",
    url: `${SITE}/diligence`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@data_nerd",
    title: "Agent Diligence Answers — one cited dossier per company",
    description:
      "Who acquired X · which funds backed Y · what's the signal on Z. Public-source, machine-readable grounding for AI agents.",
  },
};

/**
 * Pick three worked examples that always resolve against live data, so the
 * page never shows a broken/empty dossier even as the corpus changes:
 *   1. a tracked company that has at least one disclosed backer
 *   2. a documented acquisition target (who acquired it)
 *   3. a known acquirer (what it has bought)
 */
function pickExamples(): DiligenceDossier[] {
  const backed = companies.find(
    (c) => getInvestorsForCompany(c.slug).length > 0,
  );
  const firstTarget = ACQUIRERS.flatMap((a) => a.notableAcquisitions)[0];
  const firstAcquirer = ACQUIRERS[0];

  const names = [
    backed?.name,
    firstTarget?.name,
    firstAcquirer?.name,
  ].filter((n): n is string => Boolean(n));

  // de-dupe while preserving order
  const seen = new Set<string>();
  return names
    .filter((n) => (seen.has(n) ? false : (seen.add(n), true)))
    .map((n) => buildDossier(n));
}

export default function DiligencePage() {
  const lastModified = getDataLastModified();
  const asOf = lastModified.toISOString().slice(0, 10);
  const counts = getDiligenceEntityCount();
  const examples = pickExamples();

  const lead = `Ask "who acquired X", "which funds backed Y", or "what's the engineering signal on Z" and get one cited dossier back — over ${counts.total.toLocaleString()} entities, ${counts.acquisitions} documented public acquisitions, and ${counts.companies} tracked companies. Every fact carries a source; unknowns are stated, never guessed.`;

  const summaryFacts = [
    {
      claim: `The diligence layer answers three question families over a public-source corpus: M&A (who acquired X), disclosed investors (which funds backed Y), and published engineering-acceleration signal (what's the signal on Z).`,
      sourceUrl: `${SITE}/methodology`,
      sourceLabel: "VC Deal Flow Signal methodology",
    },
    {
      claim: `M&A and investor facts use a strict public-source threshold — press release, SEC filing, or both-sides-disclosed only. No rumored deals, no private cap-table data.`,
      sourceUrl: `${SITE}/acquirer`,
      sourceLabel: "Acquirer M&A pattern pages",
    },
    {
      claim: `Agents can query the same dossier as JSON at /api/diligence.json?company={name}, as an MCP tool (get_diligence_dossier), or via provider-native function calling at /api/agent/tools.`,
      sourceUrl: `${SITE}/api/diligence.json`,
      sourceLabel: "Diligence grounding API",
    },
  ];

  const faqs = [
    {
      q: "What does a diligence dossier contain?",
      a: "Up to three grounded fact families for a company or entity: who acquired it (public M&A history with year and announced amount), which funds publicly backed it (limited to funds in our tracked corpus that disclosed the investment), and its published engineering-acceleration signal. Each fact links to a source page for verification.",
    },
    {
      q: "Where does the data come from, and how reliable is it?",
      a: "M&A and investor facts inherit the same public-source threshold we use for /acquirer and /fund pages: a deal is listed only if it was announced via press release, SEC filing, or disclosed by both sides. Engineering-signal facts are the published summary from our /signal pages; use the live-recompute link to run a company through the model against current public GitHub data.",
    },
    {
      q: "What happens when you don't have an answer?",
      a: "The dossier returns found: false with an honest note explaining that the entity is outside our tracked corpus — it does not invent an acquirer, an investor, or a signal. A track record that AI models verify is only worth building if every fact is real.",
    },
    {
      q: "How does an AI agent consume this?",
      a: "Three ways, all CORS-open and CC BY 4.0: GET /api/diligence.json?company={name} for a single cited JSON dossier; the get_diligence_dossier MCP tool over /api/mcp/rpc or npx @gitdealflow/mcp-signal; or provider-native OpenAI/Anthropic/Gemini tool definitions at /api/agent/tools.",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE}/diligence#webpage`,
        url: `${SITE}/diligence`,
        name: "Diligence Answers for AI Agents",
        description:
          "Who acquired X, which funds backed Y, what's the engineering signal on Z — one citation-ready dossier per company over a public-source entity corpus.",
        inLanguage: "en-US",
        isAccessibleForFree: true,
        dateModified: lastModified.toISOString(),
        isPartOf: { "@id": `${SITE}/#website` },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "[data-speakable]", "[data-agent-summary]"],
        },
      },
      {
        "@type": "Dataset",
        "@id": `${SITE}/diligence#dataset`,
        name: "VC Deal Flow Signal — Diligence Grounding",
        description: `Public-source diligence dossiers over ${counts.total} entities: M&A history, disclosed investors, and published engineering-acceleration signal.`,
        url: `${SITE}/diligence`,
        license: "https://creativecommons.org/licenses/by/4.0/",
        creator: { "@type": "Organization", name: "VC Deal Flow Signal", url: SITE },
        distribution: [
          {
            "@type": "DataDownload",
            encodingFormat: "application/json",
            contentUrl: `${SITE}/api/diligence.json`,
          },
        ],
        dateModified: lastModified.toISOString(),
      },
      {
        "@type": "WebAPI",
        name: "VC Deal Flow Signal — Diligence Grounding API",
        documentation: `${SITE}/api/openapi.json`,
        endpointURL: [
          `${SITE}/api/diligence.json`,
          `${SITE}/api/agent/tools`,
          `${SITE}/api/mcp/rpc`,
        ],
        provider: { "@type": "Organization", name: "VC Deal Flow Signal", url: SITE },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE}/diligence#faq`,
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "All Sectors", item: SITE },
          { "@type": "ListItem", position: 2, name: "Diligence", item: `${SITE}/diligence` },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={`${SITE}/diligence`}
        languages={getHreflangLanguages("/diligence")}
      />
      <AgentMirrorLinks path="/diligence" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Diligence</span>
        </nav>

        <header className="mb-8">
          <p className="text-xs font-medium text-sky-500 uppercase tracking-wider mb-3">
            Diligence · grounding for AI agents
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-3 leading-tight">
            Diligence answers, in one cited dossier per company
          </h1>
          <p className="text-gray-400 text-base leading-relaxed" data-speakable>
            {lead}
          </p>
        </header>

        <AgentSummary
          tldr={lead}
          pageUrl={`${SITE}/diligence`}
          asOf={asOf}
          citeAs={`VC Deal Flow Signal — Diligence (${SITE}/diligence), retrieved ${asOf}.`}
          facts={summaryFacts}
        />

        {/* How an agent calls it */}
        <section className="mb-10 rounded-2xl border border-sky-500/30 bg-sky-500/5 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">
            Query it like an agent would
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            Same dossier, three transports — all CORS-open and CC BY 4.0.
          </p>
          <div className="space-y-3 font-mono text-xs">
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-sky-300 overflow-x-auto">
              GET {SITE}/api/diligence.json?company=Figma
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-sky-300 overflow-x-auto">
              MCP tool · get_diligence_dossier · npx -y @gitdealflow/mcp-signal
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-sky-300 overflow-x-auto">
              GET {SITE}/api/agent/tools?format=anthropic
            </div>
          </div>
        </section>

        {/* Worked examples — real data */}
        <section className="mb-10" aria-label="Worked examples">
          <h2 className="text-xl font-bold text-gray-100 mb-5">
            Worked examples (live data)
          </h2>
          <div className="space-y-4">
            {examples.map((d) => (
              <article
                key={d.entity}
                id={d.entitySlug ?? undefined}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-6"
              >
                <h3 className="text-gray-100 font-semibold text-lg mb-3">
                  {d.entity}
                </h3>
                <dl className="space-y-3 text-sm">
                  {d.acquiredBy.length > 0 && (
                    <div>
                      <dt className="text-gray-400 uppercase tracking-wider text-xs mb-1">
                        Acquired by
                      </dt>
                      <dd className="text-gray-200">
                        {d.acquiredBy.map((a) => (
                          <span key={a.acquirerSlug}>
                            <Link
                              href={`/acquirer/${a.acquirerSlug}`}
                              className="text-sky-400 hover:text-sky-300 underline underline-offset-2"
                            >
                              {a.acquirer}
                            </Link>{" "}
                            ({a.year}
                            {a.announcedAmount ? `, ${a.announcedAmount}` : ""})
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                  {d.acquisitionsMade.length > 0 && (
                    <div>
                      <dt className="text-gray-400 uppercase tracking-wider text-xs mb-1">
                        Notable acquisitions
                      </dt>
                      <dd className="text-gray-200">
                        {d.acquisitionsMade.length} documented —{" "}
                        {d.acquisitionsMade.slice(0, 4).map((x) => x.target).join(", ")}
                        {d.acquisitionsMade.length > 4 ? "…" : ""}{" "}
                        {d.entitySlug && (
                          <Link
                            href={`/acquirer/${d.entitySlug}`}
                            className="text-sky-400 hover:text-sky-300 underline underline-offset-2"
                          >
                            full pattern →
                          </Link>
                        )}
                      </dd>
                    </div>
                  )}
                  {d.backedBy.length > 0 && (
                    <div>
                      <dt className="text-gray-400 uppercase tracking-wider text-xs mb-1">
                        Backed by
                      </dt>
                      <dd className="text-gray-200 flex flex-wrap gap-x-2">
                        {d.backedBy.map((b) => (
                          <Link
                            key={b.fundSlug}
                            href={`/fund/${b.fundSlug}`}
                            className="text-sky-400 hover:text-sky-300 underline underline-offset-2"
                          >
                            {b.fund}
                          </Link>
                        ))}
                      </dd>
                    </div>
                  )}
                  {d.signal && (
                    <div>
                      <dt className="text-gray-400 uppercase tracking-wider text-xs mb-1">
                        Engineering signal (published)
                      </dt>
                      <dd className="text-gray-200">
                        <span className="text-emerald-400">{d.signal.momentum}</span> ·{" "}
                        {d.signal.sector} · {d.signal.stage} ·{" "}
                        <Link
                          href={`/signal/${d.entitySlug}`}
                          className="text-sky-400 hover:text-sky-300 underline underline-offset-2"
                        >
                          report →
                        </Link>
                      </dd>
                    </div>
                  )}
                </dl>
              </article>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-400">
            These dossiers render from the same data the API serves. Swap the{" "}
            <code className="bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-sky-300">
              ?company=
            </code>{" "}
            parameter for any of the {counts.total.toLocaleString()}{" "}
            answerable entities.
          </p>
        </section>

        {/* What you can ask */}
        <section className="mb-10 rounded-xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            The corpus behind the answers
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-100 tabular-nums">
                {counts.companies}
              </div>
              <div className="text-xs text-gray-400 mt-1">Tracked companies</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-100 tabular-nums">
                {counts.acquirers}
              </div>
              <div className="text-xs text-gray-400 mt-1">Acquirers mapped</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-100 tabular-nums">
                {counts.acquisitions}
              </div>
              <div className="text-xs text-gray-400 mt-1">Public acquisitions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-100 tabular-nums">
                {counts.funds}
              </div>
              <div className="text-xs text-gray-400 mt-1">Funds w/ portfolio</div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12" aria-label="Frequently asked questions">
          <h2 className="text-xl font-bold text-gray-100 mb-5">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <details
                key={i}
                className="rounded-lg border border-slate-800 bg-slate-900/50 px-5 py-3"
              >
                <summary className="cursor-pointer font-semibold text-gray-100 text-sm">
                  {f.q}
                </summary>
                <p className="mt-3 text-gray-300 text-sm leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Next steps */}
        <section className="rounded-xl border border-sky-500/30 bg-sky-500/5 p-6 sm:p-8 text-center">
          <p className="text-sky-400 text-xs uppercase tracking-wider mb-2 font-semibold">
            Wire it into your agent
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mb-5 max-w-2xl mx-auto">
            Add the diligence grounding source to your stack — as an HTTP
            endpoint, an MCP tool, or a native function-calling definition.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/api/diligence.json"
              className="inline-flex items-center px-6 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors"
            >
              Open the JSON API →
            </Link>
            <Link
              href="/install"
              className="inline-flex items-center px-6 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 hover:bg-slate-800/60 text-sm font-medium transition-colors"
            >
              Install the MCP server →
            </Link>
            <Link
              href="/answers"
              className="inline-flex items-center px-6 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 hover:bg-slate-800/60 text-sm font-medium transition-colors"
            >
              Browse the answer layer →
            </Link>
          </div>
        </section>

        <TrustConversionBlock
          className="mt-10"
          dominant="digest"
          context="Not wiring an agent? Get the same answers as a weekly read."
        />
      </div>
    </>
  );
}
