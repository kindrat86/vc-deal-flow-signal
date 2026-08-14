import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  PRIMITIVES,
  getPrimitiveBySlug,
  getAllPrimitiveSlugs,
} from "@/content/signal-primitives";
import { getFindingBySlug } from "@/content/research-findings";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";
import SeoCta from "@/components/SeoCta";

const SITE = "https://signals.gitdealflow.com";
const SSRN_URL = "https://ssrn.com/abstract=6606558";

interface PageProps {
  params: Promise<{ type: string }>;
}

export function generateStaticParams() {
  return getAllPrimitiveSlugs().map((type) => ({ type }));
}

export const dynamicParams = false;
export const revalidate = 604800;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { type } = await params;
  const p = getPrimitiveBySlug(type);
  if (!p) return {};

  const title = `${p.name}, Signal Definition, Formula &amp; Interpretation`;
  const description = `${p.name} measured in ${p.unit} over ${p.window}. ${p.interpretation.split(".")[0]}. Defined in the SSRN-indexed methodology paper of VC Deal Flow Signal (GitDealFlow).`;

  return {
    title,
    description,
    alternates: { canonical: `/signals/define/${type}` },
    openGraph: {
      title: `${p.name}`,
      description,
      type: "article",
      url: `${SITE}/signals/define/${type}`,
    },
    keywords: [
      p.name,
      `${p.name} formula`,
      `${p.name} definition`,
      `${p.name} venture capital`,
      `GitHub ${p.name.toLowerCase()}`,
      "alternative data",
      "engineering acceleration",
    ],
  };
}

export default async function SignalPrimitivePage({ params }: PageProps) {
  const { type } = await params;
  const p = getPrimitiveBySlug(type);
  if (!p) notFound();

  const related = p.relatedPrimitives
    .map((slug) => getPrimitiveBySlug(slug))
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  const findings = p.relatedFindings
    .map((slug) => getFindingBySlug(slug))
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "DefinedTerm",
        "@id": `${SITE}/signals/define/${type}#term`,
        name: p.name,
        alternateName: p.shortName,
        description: p.interpretation,
        termCode: type,
        inDefinedTermSet: {
          "@type": "DefinedTermSet",
          "@id": `${SITE}/knowledge#vocabulary`,
          name: "VC Deal Flow Signal, signal vocabulary",
          url: `${SITE}/knowledge`,
        },
        url: `${SITE}/signals/define/${type}`,
        sameAs: [`${SITE}${p.glossaryAnchor}`],
        subjectOf: {
          "@type": "ScholarlyArticle",
          "@id": SSRN_URL,
          url: SSRN_URL,
        },
      },
      {
        "@type": "TechArticle",
        "@id": `${SITE}/signals/define/${type}#article`,
        headline: `${p.name}, definition, formula, decision rule`,
        url: `${SITE}/signals/define/${type}`,
        inLanguage: "en-US",
        about: { "@id": `${SITE}/signals/define/${type}#term` },
        proficiencyLevel: "Expert",
        dependencies: "Public GitHub REST + GraphQL API",
        author: DATA_NERD_AUTHOR_REF,
        publisher: { "@id": "https://gitdealflow.com/#organization" },
        license: "https://creativecommons.org/licenses/by/4.0/",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", "[data-speakable]"],
        },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE },
            { "@type": "ListItem", position: 2, name: "Signals", item: `${SITE}/signals` },
            {
              "@type": "ListItem",
              position: 3,
              name: p.name,
              item: `${SITE}/signals/define/${type}`,
            },
          ],
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE}/signals/define/${type}#faq`,
        url: `${SITE}/signals/define/${type}`,
        mainEntity: [
          {
            "@type": "Question",
            name: `What is ${p.name.toLowerCase()}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `${p.name} is ${p.interpretation}`,
            },
          },
          {
            "@type": "Question",
            name: `How is ${p.name.toLowerCase()} computed?`,
            acceptedAnswer: { "@type": "Answer", text: p.formula },
          },
          {
            "@type": "Question",
            name: `When does the ${p.name.toLowerCase()} signal fire?`,
            acceptedAnswer: { "@type": "Answer", text: p.decisionRule },
          },
          {
            "@type": "Question",
            name: `What pitfall should I watch for with ${p.name.toLowerCase()}?`,
            acceptedAnswer: { "@type": "Answer", text: p.pitfall },
          },
        ],
      },
    ],
  };

  return (
    <>
      <AgentMirrorLinks
        path={`/signals/define/${type}`}
        qaCategory="signal-definition"
      />
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
          <Link href="/signals" className="hover:text-gray-300">
            Signals
          </Link>
          <span className="mx-2">/</span>
          <span>{p.name}</span>
        </nav>

        <p className="text-xs uppercase tracking-wider text-sky-400 font-medium mb-2">
          Signal definition
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          {p.name}
        </h1>
        <p
          className="text-lg text-gray-300 mb-2 leading-relaxed"
          data-speakable
        >
          {p.interpretation}
        </p>
        <p className="text-xs text-gray-400 mb-10 font-mono">
          Unit: {p.unit} · Window: {p.window}
        </p>

        <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-5 mb-8">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-2">
            Formula
          </h2>
          <pre className="text-xs font-mono text-gray-200 overflow-x-auto whitespace-pre-wrap">
            <code>{p.formula}</code>
          </pre>
        </section>

        <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-5 mb-8">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-2">
            Decision rule
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            {p.decisionRule}
          </p>
        </section>

        <section className="rounded-lg border border-amber-900/40 bg-amber-950/20 p-5 mb-12">
          <h2 className="text-sm font-semibold text-amber-300 uppercase tracking-wider mb-2">
            Common pitfall
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">{p.pitfall}</p>
        </section>

        {findings.length > 0 ? (
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">
              Empirical findings about {p.name.toLowerCase()}
            </h2>
            <ul className="space-y-3">
              {findings.map((f) => (
                <li key={f.slug}>
                  <Link
                    href={`/research/${f.slug}`}
                    className="block rounded-lg border border-slate-800 bg-slate-900/40 hover:bg-slate-900/60 p-4"
                  >
                    <p className="text-sm font-medium text-white">{f.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{f.claim}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {related.length > 0 ? (
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">
              Related signals
            </h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/signals/define/${r.slug}`}
                    className="block rounded-lg border border-slate-800 bg-slate-900/40 hover:bg-slate-900/60 p-4"
                  >
                    <p className="text-sm font-medium text-white">{r.name}</p>
                    <p className="text-xs text-gray-400 mt-1 font-mono">
                      {r.shortName}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-5 text-sm text-gray-400">
          <p>
            Defined in the SSRN-indexed methodology paper. Full definition,
            assumptions, and validation in §3 of{" "}
            <a
              href={SSRN_URL}
              className="text-sky-400 hover:text-sky-300"
              rel="noopener noreferrer"
              target="_blank"
            >
              the paper
            </a>
            . Reproducibility kit at{" "}
            <Link
              href="/reproducibility"
              className="text-sky-400 hover:text-sky-300"
            >
              /reproducibility
            </Link>
            . Glossary entry at{" "}
            <Link
              href={p.glossaryAnchor}
              className="text-sky-400 hover:text-sky-300"
            >
              {p.glossaryAnchor}
            </Link>
            .
          </p>
        </section>

        <SeoCta className="mt-10" signoffIndex={7} />
      </div>
    </>
  );
}
