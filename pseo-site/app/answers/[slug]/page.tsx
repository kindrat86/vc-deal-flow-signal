import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  agentQueries,
  getAgentQueryBySlug,
  type AgentQuery,
  type AgentQueryLink,
} from "@/content/agent-queries";
import { getDataLastModified } from "@/lib/data";
import { AgentSummary } from "@/components/AgentSummary";
import { HreflangLinks } from "@/components/HreflangLinks";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";
import RelatedLinks from "@/components/RelatedLinks";
import { getRelatedGroups } from "@/lib/related-links";
import { withEditorialOverride } from "@/lib/metadata";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const SITE = "https://signals.gitdealflow.com";

export async function generateStaticParams() {
  return agentQueries.map((q) => ({ slug: q.slug }));
}

export const dynamicParams = false;
export const revalidate = 604800;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const q = getAgentQueryBySlug(slug);
  if (!q) return {};

  return withEditorialOverride({
    // metaTitle (CTR hook) overrides h1 when set; absolute so the 22ch
    // template suffix never truncates a hooked title.
    ...(q.metaTitle
      ? { title: { absolute: q.metaTitle } }
      : { title: q.h1 }),
    description: q.description,
    keywords: q.keywords.join(", "),
    alternates: { canonical: `/answers/${slug}` },
    openGraph: {
      title: q.metaTitle ?? q.h1,
      description: q.description,
      url: `${SITE}/answers/${slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: q.metaTitle ?? q.h1,
      description: q.description,
    },
  });
}

function buildJsonLd(q: AgentQuery): object {
  const url = `${SITE}/answers/${q.slug}`;
  // F37 (2026-05-08, AEO audit): single ISO timestamp shared across
  // datePublished + dateModified on every dated subgraph. Sourced from
  // getDataLastModified() so the freshness signal stays in sync with
  // the rest of the panel; flip to per-answer timestamps when each entry
  // grows its own provenance row.
  const lastModifiedIso = getDataLastModified().toISOString();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "All Sectors",
            item: SITE,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Answers",
            item: `${SITE}/answers`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: q.h1,
            item: url,
          },
        ],
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: q.h1,
        description: q.description,
        inLanguage: "en-US",
        datePublished: lastModifiedIso,
        dateModified: lastModifiedIso,
        license: "https://creativecommons.org/licenses/by/4.0/",
        // Speakable: voice assistants and AI Overviews read these selectors
        // aloud. Order matters, first match wins for some agents. Keep h1
        // first so the question itself is always the lead.
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: [
            "h1",
            "[data-direct-answer]",
            "[data-speakable]",
            "[data-agent-summary]",
            ".speakable",
          ],
        },
        isPartOf: {
          "@type": "WebSite",
          name: "VC Deal Flow Signal",
          url: SITE,
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          license: "https://creativecommons.org/licenses/by/4.0/",
          creditText: "VC Deal Flow Signal (GitDealFlow)",
          url: `${SITE}/opengraph-image`,
        copyrightNotice: "\u00a9 VC Deal Flow Signal (GitDealFlow). Licensed under CC BY 4.0.",
        creator: { "@id": "https://signals.gitdealflow.com/about#person" },
        acquireLicensePage: "https://signals.gitdealflow.com/terms",
        },
      },
      {
        // §23 AEO (2026-08-16): the core Question/Answer pair as real nodes.
        // The AskAction below has referenced #question / #answer @ids since
        // F37, but the nodes themselves were never emitted, so every
        // extraction engine resolving those refs found nothing. The
        // text is directAnswer, the 40-60 word definition when present
        // (featured-snippet target, 2026-08-16 rebuild) falling back to
        // q.tldr, rendered in the [data-direct-answer] block and selected by
        // the Speakable spec, so schema, visible page, and speakable passage
        // all agree on one extractable answer.
        "@type": "Question",
        "@id": `${url}#question`,
        name: q.h1,
        text: q.query,
        answerCount: 1,
        acceptedAnswer: { "@id": `${url}#answer` },
        isPartOf: { "@id": `${url}#webpage` },
      },
      {
        "@type": "Answer",
        "@id": `${url}#answer`,
        text: q.definition ?? q.tldr,
        url,
        parentItem: { "@id": `${url}#question` },
      },
      {
        // AskAction: machine-actionable hint that this question can be
        // re-asked programmatically against /api/answer (single best) or
        // /api/ask (top-N). Voice assistants and AI Overviews use AskAction
        // to surface "Ask this" / "Try a follow-up" affordances. Keeping
        // the structure schema.org-canonical: target → EntryPoint with
        // urlTemplate, object → the Question we're asking, result → the
        // Answer we already produced (so consuming agents can short-circuit
        // a fresh API call when this page already answers the query).
        "@type": "AskAction",
        "@id": `${url}#askaction`,
        name: `Ask: ${q.h1}`,
        description:
          "Ask this question programmatically, returns a citation-ready Answer envelope.",
        object: { "@id": `${url}#question` },
        result: { "@id": `${url}#answer` },
        target: [
          {
            "@type": "EntryPoint",
            name: "Single best answer",
            urlTemplate: `${SITE}/api/answer?q={query}`,
            httpMethod: "GET",
            contentType: "application/ld+json",
            encodingType: "application/ld+json",
            actionPlatform: [
              "https://schema.org/DesktopWebPlatform",
              "https://schema.org/MobileWebPlatform",
            ],
          },
          {
            "@type": "EntryPoint",
            name: "Ranked top-N answers",
            urlTemplate: `${SITE}/api/ask?q={query}&limit={limit}`,
            httpMethod: "GET",
            contentType: "application/ld+json",
            encodingType: "application/ld+json",
            actionPlatform: [
              "https://schema.org/DesktopWebPlatform",
              "https://schema.org/MobileWebPlatform",
            ],
          },
        ],
        "query-input": [
          "required name=query",
          "name=limit",
        ],
      },
      {
        // §23 AEO (2026-08-16): the page's own core question is mirrored as
        // mainEntity[0] so FAQPage consumers (AI Overviews, PAA, assistants)
        // see the page's primary Q→A, not just the auxiliary faqs. The answer
        // text is the same directAnswer (definition ?? tldr) emitted on the
        // #answer node and rendered in the [data-direct-answer] block: one
        // extractable answer, three surfaces.
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: q.h1,
            acceptedAnswer: {
              "@type": "Answer",
              text: q.definition ?? q.tldr,
            },
          },
          ...q.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: f.a,
            },
          })),
        ],
      },
      // HowTo (2026-08-15 AIO rebuild): semantic step list for answer
      // engines and AI Overviews. Only emitted when the entry defines steps.
      ...(q.steps && q.steps.length > 0
        ? [
            {
              "@type": "HowTo",
              "@id": `${url}#howto`,
              name: q.h1,
              description: q.definition ?? q.description,
              step: q.steps.map((s, i) => ({
                "@type": "HowToStep",
                position: i + 1,
                name: s.name,
                text: s.text,
                url: `${url}#step-${i + 1}`,
              })),
            },
          ]
        : []),
      {
        "@type": "WebAPI",
        name: "VC Deal Flow Signal, Public Agent API",
        documentation: `${SITE}/api/openapi.json`,
        endpointURL: [
          `${SITE}/api/signals.json`,
          `${SITE}/api/mcp/rpc`,
          `${SITE}/api/agent/tools`,
          `${SITE}/api/answer`,
          `${SITE}/api/ask`,
        ],
        provider: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: SITE,
        },
      },
    ],
  };
}

export default async function AnswerPage({ params }: PageProps) {
  const { slug } = await params;
  const q = getAgentQueryBySlug(slug);
  if (!q) notFound();

  const lastModified = getDataLastModified();
  const asOf = lastModified.toISOString().slice(0, 10);
  const url = `${SITE}/answers/${q.slug}`;
  const jsonLd = buildJsonLd(q);

  // Split body on double-newline → paragraphs.
  const paragraphs = q.body.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);

  return (
    <>
      <HreflangLinks
        canonical={url}
        languages={{
          en: url,
          "en-US": url,
          "x-default": url,
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <Link href="/answers" className="hover:text-gray-300 transition-colors">
            Answers
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">{q.h1}</span>
        </nav>

        <header className="mb-8">
          <p className="text-xs font-medium text-sky-500 uppercase tracking-wider mb-3">
            Answer · for AI agents and their humans
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-3 leading-tight">
            {q.h1}
          </h1>
          <p
            className="text-gray-400 text-base leading-relaxed"
            data-speakable="description"
          >
            {q.description}
          </p>
        </header>

        {q.definition ? (
          <div
            data-direct-answer
            data-speakable="definition"
            className="mb-8 rounded-xl border border-slate-700 bg-slate-900/70 px-5 py-4 sm:px-6 sm:py-5"
          >
            <p className="text-sky-400 text-[10px] font-semibold uppercase tracking-wider mb-2">
              Direct answer
            </p>
            <p className="text-gray-100 text-base sm:text-lg leading-relaxed">
              {q.definition}
            </p>
          </div>
        ) : null}

        <AgentSummary
          tldr={q.tldr}
          pageUrl={url}
          asOf={asOf}
          citeAs={`VC Deal Flow Signal, Answers (${url}), retrieved ${asOf}.`}
          facts={q.facts}
        />

        <section
          className="mb-10 prose prose-invert prose-slate max-w-none text-gray-300 leading-relaxed"
          aria-label="Full answer"
        >
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className="mb-4 text-base"
              // First paragraph is the natural voice-summary for the answer.
              // Speakable selectors prefer one short hook over many.
              {...(i === 0 ? { "data-speakable": "lead" } : {})}
            >
              {renderParagraphWithBoldAndCode(p)}
            </p>
          ))}
        </section>

        {q.steps && q.steps.length > 0 ? (
          <section className="mb-10" aria-label="Step-by-step method">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              The method, step by step
            </h2>
            <ol className="list-decimal list-outside space-y-5 pl-5">
              {q.steps.map((s, i) => (
                <li
                  key={i}
                  id={`step-${i + 1}`}
                  className="text-gray-300 leading-relaxed"
                >
                  <span className="font-semibold text-gray-100">{s.name}.</span>{" "}
                  {s.text}
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        <section className="mb-10 rounded-xl border border-amber-500/30 bg-amber-500/5 p-6 sm:p-8">
          <p className="text-amber-300 text-xs uppercase tracking-wider mb-2 font-semibold">
            Quote-ready takeaway
          </p>
          <blockquote className="text-gray-100 text-lg leading-relaxed border-l-2 border-amber-400/60 pl-4">
            {q.tldr}
          </blockquote>
          <p className="mt-4 text-xs text-gray-400 leading-relaxed">
            If you cite or quote this page externally, use the takeaway above with the built-in citation block and link back to this answer.
          </p>
        </section>

        {q.proofLinks && q.proofLinks.length > 0 ? (
          <section className="mb-10 rounded-xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-gray-100 mb-3">
              If you want to verify the claim
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              The signal logic is public. Read the methodology, compare the surrounding tools, and inspect the sample output before deciding whether this belongs in your workflow.
            </p>
            <div className="flex flex-col gap-3">
              {q.proofLinks.map((link: AgentQueryLink) => (
                <Link
                  key={link.url}
                  href={link.url}
                  className="text-sky-400 hover:text-sky-300 underline underline-offset-2 text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {q.nextReadLinks && q.nextReadLinks.length > 0 ? (
          <section className="mb-10 rounded-xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-gray-100 mb-3">
              What to read next
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              If this answer is close to your real question, these pages move
              you from definition into proof and decision.
            </p>
            <div className="flex flex-col gap-3">
              {q.nextReadLinks.map((link: AgentQueryLink) => (
                <Link
                  key={link.url}
                  href={link.url}
                  className="text-sky-400 hover:text-sky-300 underline underline-offset-2 text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mb-10 rounded-xl border border-sky-500/30 bg-sky-500/5 p-6 sm:p-8 text-center">
          <p className="text-sky-400 text-xs uppercase tracking-wider mb-2 font-semibold">
            Turn the answer into a next step
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mb-5 max-w-2xl mx-auto">
            If you just want one calm read each Sunday, start there. If the
            question is already expensive, use First Look. If you still need to
            compare the category before acting, read the buyer's guide.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3">
            <Link
              href="https://gitdealflow.com/#signup"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-signal-500 hover:bg-signal-400 text-white text-sm font-semibold transition-colors shadow-sm shadow-signal-500/30"
            >
              Get the free Sunday issue →
            </Link>
            <Link
              href={q.ctaUrl}
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 hover:bg-slate-800/60 text-sm font-medium transition-colors"
            >
              {q.ctaLabel} →
            </Link>
          </div>
          <p className="text-gray-500 text-xs mt-4">
            Already comparing tools? Read the{" "}
            <Link href="/buyers-guide" className="text-sky-400 hover:text-sky-300 underline">
              buyer&apos;s guide
            </Link>{" "}
            or test one sector with{" "}
            <Link href="/firstlook" className="text-sky-400 hover:text-sky-300 underline">
              First Look (€7)
            </Link>
            .
          </p>
          <DataNerdSignoff variant="compact" className="mt-6" />
        </section>

        <section className="mb-12" aria-label="Frequently asked questions">
          <h2 className="text-xl font-bold text-gray-100 mb-5">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {q.faqs.map((f, i) => (
              <details
                key={i}
                className="rounded-lg border border-slate-800 bg-slate-900/50 px-5 py-3"
              >
                <summary className="cursor-pointer font-semibold text-gray-100 text-sm">
                  {f.q}
                </summary>
                <p className="mt-3 text-gray-300 text-sm leading-relaxed">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {(q.nextReadLinks && q.nextReadLinks.length > 0) || q.related.length > 0 ? (
          <section className="mb-10" aria-label="Related answers">
            <h2 className="text-base font-semibold text-gray-300 mb-4">
              What to read next
            </h2>
            <ul className="space-y-2">
              {(q.nextReadLinks ?? []).map((link: AgentQueryLink) => (
                <li key={link.url}>
                  <Link
                    href={link.url}
                    className="text-sky-400 hover:text-sky-300 underline underline-offset-2 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {!q.nextReadLinks?.length && q.related
                .map((relSlug) => getAgentQueryBySlug(relSlug))
                .filter((r): r is AgentQuery => Boolean(r))
                .map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/answers/${r.slug}`}
                      className="text-sky-400 hover:text-sky-300 underline underline-offset-2 text-sm"
                    >
                      {r.h1}
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        ) : null}

        <RelatedLinks groups={getRelatedGroups(`/answers/${slug}`)} heading="Related answers" />
      </article>
    </>
  );
}

/**
 * Lightweight inline renderer: turns `**bold**` into <strong> and `\`code\``
 * into <code>. Avoids pulling in a markdown lib for short answer bodies.
 */
function renderParagraphWithBoldAndCode(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0;
  let key = 0;
  for (const m of text.matchAll(pattern)) {
    const start = m.index ?? 0;
    if (start > last) parts.push(text.slice(last, start));
    const tok = m[0];
    if (tok.startsWith("**")) {
      parts.push(
        <strong key={`b-${key++}`} className="text-gray-100">
          {tok.slice(2, -2)}
        </strong>,
      );
    } else {
      parts.push(
        <code
          key={`c-${key++}`}
          className="bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-xs text-sky-300 font-mono"
        >
          {tok.slice(1, -1)}
        </code>,
      );
    }
    last = start + tok.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}
