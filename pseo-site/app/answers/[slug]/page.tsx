import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  agentQueries,
  getAgentQueryBySlug,
  type AgentQuery,
} from "@/content/agent-queries";
import { getDataLastModified } from "@/lib/data";
import { AgentSummary } from "@/components/AgentSummary";

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

  return {
    title: q.h1,
    description: q.description,
    keywords: q.keywords.join(", "),
    alternates: { canonical: `/answers/${slug}` },
    openGraph: {
      title: q.h1,
      description: q.description,
      url: `${SITE}/answers/${slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: q.h1,
      description: q.description,
    },
  };
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
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: [
            "[data-speakable]",
            ".speakable",
            "h1",
            "[data-agent-summary]",
          ],
        },
        isPartOf: {
          "@type": "WebSite",
          name: "VC Deal Flow Signal",
          url: SITE,
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${SITE}/opengraph-image`,
        },
      },
      {
        // QAPage describes the page itself (one primary question and its
        // answer). Distinct from FAQPage below which lists supplementary
        // FAQs. Google treats QAPage as a separate rich-result type with
        // its own Q&A snippet treatment in AI Overviews.
        "@type": "QAPage",
        "@id": `${url}#qapage`,
        url,
        datePublished: lastModifiedIso,
        dateModified: lastModifiedIso,
        mainEntity: {
          "@type": "Question",
          name: q.h1,
          text: q.h1,
          answerCount: 1,
          dateCreated: lastModifiedIso,
          acceptedAnswer: {
            "@type": "Answer",
            text: q.tldr,
            url,
            datePublished: lastModifiedIso,
            dateModified: lastModifiedIso,
            author: {
              "@type": "Organization",
              name: "VC Deal Flow Signal",
              url: SITE,
            },
          },
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: q.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.a,
          },
        })),
      },
      {
        "@type": "WebAPI",
        name: "VC Deal Flow Signal — Public Agent API",
        documentation: `${SITE}/api/openapi.json`,
        endpointURL: [
          `${SITE}/api/signals.json`,
          `${SITE}/api/mcp/rpc`,
          `${SITE}/api/agent/tools`,
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
          <p className="text-gray-400 text-base leading-relaxed">
            {q.description}
          </p>
        </header>

        <AgentSummary
          tldr={q.tldr}
          pageUrl={url}
          asOf={asOf}
          citeAs={`VC Deal Flow Signal — Answers (${url}), retrieved ${asOf}.`}
          facts={q.facts}
        />

        {/*
          [data-speakable] marks the canonical answer body so Google AI
          Overviews and voice assistants can extract a complete spoken
          response. The first paragraph gets its own [data-speakable] for
          short-form spoken answers — voice renderers truncate after ~80
          words by default. The QAPage's SpeakableSpecification (above)
          already references the [data-speakable] selector; this is the
          DOM half of that contract.
        */}
        <section
          data-speakable
          className="mb-10 prose prose-invert prose-slate max-w-none text-gray-300 leading-relaxed"
          aria-label="Full answer"
        >
          {paragraphs.map((p, i) => (
            <p
              key={i}
              data-speakable={i === 0 ? "" : undefined}
              className="mb-4 text-base"
            >
              {renderParagraphWithBoldAndCode(p)}
            </p>
          ))}
        </section>

        <section className="mb-10 rounded-xl border border-sky-500/30 bg-sky-500/5 p-6 sm:p-8 text-center">
          <p className="text-sky-400 text-xs uppercase tracking-wider mb-2 font-semibold">
            Try it now
          </p>
          <Link
            href={q.ctaUrl}
            className="inline-flex items-center px-6 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors"
          >
            {q.ctaLabel} →
          </Link>
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
                {/* First FAQ answer is speakable so voice agents can deliver
                    the canonical follow-up Q&A pair for this answer. */}
                <p
                  data-speakable={i === 0 ? "" : undefined}
                  className="mt-3 text-gray-300 text-sm leading-relaxed"
                >
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {q.related.length > 0 && (
          <section className="mb-10" aria-label="Related answers">
            <h2 className="text-base font-semibold text-gray-300 mb-4">
              Related questions
            </h2>
            <ul className="space-y-2">
              {q.related
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
        )}
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
