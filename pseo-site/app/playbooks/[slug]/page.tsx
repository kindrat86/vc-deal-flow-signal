import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  playbooks,
  getPlaybookBySlug,
  type Playbook,
} from "@/content/playbooks";
import { getDataLastModified } from "@/lib/data";
import { AgentSummary } from "@/components/AgentSummary";
import { HreflangLinks } from "@/components/HreflangLinks";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";
import { withEditorialOverride } from "@/lib/metadata";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const SITE = "https://signals.gitdealflow.com";

export async function generateStaticParams() {
  return playbooks.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;
export const revalidate = 604800;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const p = getPlaybookBySlug(slug);
  if (!p) return {};

  return withEditorialOverride({
    title: p.h1,
    description: p.description,
    keywords: p.keywords.join(", "),
    alternates: { canonical: `/playbooks/${slug}` },
    openGraph: {
      title: p.h1,
      description: p.description,
      url: `${SITE}/playbooks/${slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: p.h1,
      description: p.description,
    },
  });
}

function formatDuration(iso: string): string {
  const m = iso.match(/^PT(?:(\d+)H)?(?:(\d+)M)?$/);
  if (!m) return iso;
  const h = m[1] ? Number(m[1]) : 0;
  const min = m[2] ? Number(m[2]) : 0;
  if (h && min) return `${h}h ${min}m`;
  if (h) return `${h}h`;
  return `${min}m`;
}

const DIFFICULTY_BADGE: Record<
  "beginner" | "intermediate" | "advanced",
  string
> = {
  beginner:
    "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  intermediate: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  advanced: "bg-amber-500/15 text-amber-300 border-amber-500/30",
};

function buildJsonLd(p: Playbook): object {
  const url = `${SITE}/playbooks/${p.slug}`;
  // Mirror /answers, single ISO timestamp shared across datePublished
  // and dateModified, sourced from the data-mtime so freshness signals
  // stay in sync with the rest of the panel.
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
            name: "Playbooks",
            item: `${SITE}/playbooks`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: p.h1,
            item: url,
          },
        ],
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: p.h1,
        description: p.description,
        inLanguage: "en-US",
        datePublished: lastModifiedIso,
        dateModified: lastModifiedIso,
        license: "https://creativecommons.org/licenses/by/4.0/",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: [
            "h1",
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
          url: `${SITE}/opengraph-image`,
        },
      },
      {
        "@type": "HowTo",
        "@id": `${url}#howto`,
        name: p.h1,
        description: p.tldr,
        url,
        inLanguage: "en-US",
        datePublished: lastModifiedIso,
        dateModified: lastModifiedIso,
        totalTime: p.totalTime,
        // Difficulty isn't a first-class schema.org property but the
        // EducationalLevel pattern is widely understood by AI Overviews.
        educationalLevel: p.difficulty,
        supply: p.prerequisites.map((s) => ({
          "@type": "HowToSupply",
          name: s,
        })),
        tool: p.tools.map((t) => ({
          "@type": "HowToTool",
          name: t,
        })),
        step: p.steps.map((s, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: s.name,
          text: s.text,
          ...(s.timeRequired ? { timeRequired: s.timeRequired } : {}),
          ...(s.toolUrl
            ? {
                url: s.toolUrl.startsWith("http")
                  ? s.toolUrl
                  : `${SITE}${s.toolUrl}`,
              }
            : {}),
        })),
        author: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: SITE,
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: p.faqs.map((f) => ({
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

export default async function PlaybookPage({ params }: PageProps) {
  const { slug } = await params;
  const p = getPlaybookBySlug(slug);
  if (!p) notFound();

  const lastModified = getDataLastModified();
  const asOf = lastModified.toISOString().slice(0, 10);
  const url = `${SITE}/playbooks/${p.slug}`;
  const jsonLd = buildJsonLd(p);

  const paragraphs = p.body
    .split(/\n\n+/)
    .map((para) => para.trim())
    .filter(Boolean);

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
          <Link
            href="/playbooks"
            className="hover:text-gray-300 transition-colors"
          >
            Playbooks
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">{p.h1}</span>
        </nav>

        <header className="mb-8">
          <p className="text-xs font-medium text-sky-500 uppercase tracking-wider mb-3">
            Playbook · operator how-to
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-3 leading-tight">
            {p.h1}
          </h1>
          <p
            className="text-gray-400 text-base leading-relaxed mb-4"
            data-speakable="description"
          >
            {p.description}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-semibold uppercase tracking-wider ${DIFFICULTY_BADGE[p.difficulty]}`}
            >
              {p.difficulty}
            </span>
            <span className="text-[10px] text-slate-400 tabular-nums font-semibold uppercase tracking-wider">
              {formatDuration(p.totalTime)} total · {p.steps.length} steps
            </span>
          </div>
        </header>

        <AgentSummary
          tldr={p.tldr}
          pageUrl={url}
          asOf={asOf}
          citeAs={`VC Deal Flow Signal, Playbooks (${url}), retrieved ${asOf}.`}
          facts={p.facts}
        />

        <section
          className="mb-10 prose prose-invert prose-slate max-w-none text-gray-300 leading-relaxed"
          aria-label="Playbook overview"
        >
          {paragraphs.map((para, i) => (
            <p
              key={i}
              className="mb-4 text-base"
              {...(i === 0 ? { "data-speakable": "lead" } : {})}
            >
              {renderParagraphWithBoldAndCode(para)}
            </p>
          ))}
        </section>

        <section
          className="mb-10 rounded-xl border border-slate-800 bg-slate-900/40 px-5 py-5 sm:px-6 sm:py-6"
          aria-label="Prerequisites and tools"
        >
          <h2 className="text-base font-semibold text-gray-100 mb-3">
            Before you start
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <p className="text-[10px] font-semibold text-sky-400 uppercase tracking-wider mb-2">
                Prerequisites
              </p>
              <ul className="space-y-1.5 text-sm text-gray-300">
                {p.prerequisites.map((pre, i) => (
                  <li key={i} className="leading-relaxed">
                    · {pre}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-sky-400 uppercase tracking-wider mb-2">
                Tools
              </p>
              <ul className="space-y-1.5 text-sm text-gray-300">
                {p.tools.map((t, i) => (
                  <li key={i} className="leading-relaxed">
                    · {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-10" aria-label="Steps">
          <h2 className="text-xl font-bold text-gray-100 mb-5">
            Steps
          </h2>
          <ol className="space-y-5">
            {p.steps.map((step, i) => (
              <li
                key={i}
                className="rounded-xl border border-slate-800 bg-slate-900/50 px-5 py-5 sm:px-6 sm:py-5"
              >
                <div className="flex items-baseline gap-3 mb-2 flex-wrap">
                  <span className="text-sky-400 font-bold text-base tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-gray-100 font-semibold text-base leading-snug">
                    {step.name}
                  </h3>
                  {step.timeRequired && (
                    <span className="text-[10px] text-slate-400 tabular-nums font-semibold uppercase tracking-wider ml-auto">
                      {formatDuration(step.timeRequired)}
                    </span>
                  )}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {renderParagraphWithBoldAndCode(step.text)}
                </p>
                {step.toolUrl && step.toolLabel && (
                  <p className="mt-3">
                    <Link
                      href={step.toolUrl}
                      className="inline-flex items-center text-sky-400 hover:text-sky-300 text-xs font-semibold underline-offset-2 underline decoration-dotted"
                    >
                      {step.toolLabel} →
                    </Link>
                  </p>
                )}
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-10 rounded-xl border border-sky-500/30 bg-sky-500/5 p-6 sm:p-8 text-center">
          <p className="text-sky-400 text-xs uppercase tracking-wider mb-2 font-semibold">
            Run the play
          </p>
          <Link
            href={p.ctaUrl}
            className="inline-flex items-center px-6 py-2.5 rounded-lg bg-signal-500 hover:bg-signal-600 text-slate-950 text-sm font-medium transition-colors"
          >
            {p.ctaLabel} →
          </Link>
          {p.builderAside && (
            <p className="mt-5 text-xs text-slate-400 leading-relaxed">
              <span className="font-semibold text-slate-300">
                If you build agents:
              </span>{" "}
              {p.builderAside.text}{" "}
              <a
                href={p.builderAside.url}
                className="text-sky-400 hover:text-sky-300 underline underline-offset-2 decoration-dotted font-semibold"
              >
                {p.builderAside.label} →
              </a>
            </p>
          )}
        </section>

        <section className="mb-12" aria-label="Frequently asked questions">
          <h2 className="text-xl font-bold text-gray-100 mb-5">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {p.faqs.map((f, i) => (
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

        {p.related.length > 0 && (
          <section className="mb-10" aria-label="Related playbooks">
            <h2 className="text-base font-semibold text-gray-300 mb-4">
              Related playbooks
            </h2>
            <ul className="space-y-2">
              {p.related
                .map((relSlug) => getPlaybookBySlug(relSlug))
                .filter((r): r is Playbook => Boolean(r))
                .map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/playbooks/${r.slug}`}
                      className="text-sky-400 hover:text-sky-300 underline underline-offset-2 text-sm"
                    >
                      {r.h1}
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        )}

        <section className="mt-12" aria-label="Who wrote this playbook">
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            The rubric above is the same one I run on the operating side every
            week. I keep my name off it on purpose, the edge is in the timing,
            not the messenger. Trust the math, not me.
          </p>
          <DataNerdSignoff />
        </section>
      </article>
    </>
  );
}

/**
 * Lightweight inline renderer: turns `**bold**` into <strong> and `\`code\``
 * into <code>. Mirrors the helper in /answers/[slug] so the two routes stay
 * visually consistent without sharing a component (different prose contexts).
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
