import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getUseCase, getAllUseCaseSlugs, type UseCaseFAQ } from "@/content/use-cases";
import { getAlternative } from "@/content/alternatives";
import { getAllSectors, getCurrentPeriod, getDataLastModified } from "@/lib/data";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllUseCaseSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;
export const revalidate = 604800;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const uc = getUseCase(slug);
  if (!uc) return {};

  return {
    title: uc.title,
    description: uc.description,
    openGraph: {
      title: uc.title,
      description: uc.description,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: uc.title,
      description: uc.description,
    },
    alternates: {
      canonical: `/use-cases/${slug}`,
    },
  };
}

export default async function UseCasePage({ params }: PageProps) {
  const { slug } = await params;
  const uc = getUseCase(slug);

  if (!uc) {
    notFound();
  }

  const sectors = getAllSectors();
  const period = getCurrentPeriod();
  const lastModified = getDataLastModified();
  const pageUrl = `https://signals.gitdealflow.com/use-cases/${slug}`;

  const relatedSectorData = uc.relatedSectors
    .map((rs) => {
      const sector = sectors.find((s) => s.slug === rs);
      if (!sector || !sector.periods[period.slug]) return null;
      return {
        name: sector.name,
        slug: `${sector.slug}-${period.slug}`,
        count: sector.periods[period.slug].startups.length,
      };
    })
    .filter((s): s is NonNullable<typeof s> => s !== null);

  const relatedAlts = uc.relatedAlternatives
    .map((s) => getAlternative(s))
    .filter((a): a is NonNullable<typeof a> => a !== undefined);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: uc.title,
        description: uc.description,
        author: {
          "@type": "Person",
          name: "The Data Nerd",
          url: "https://signals.gitdealflow.com/about",
          jobTitle: "Founder, VC Deal Flow Signal",
        },
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        datePublished: lastModified.toISOString().slice(0, 10),
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", ".tagline", ".problem-block", ".solution-block"],
        },
      },
      {
        "@type": "HowTo",
        name: `How ${uc.persona}s use VC Deal Flow Signal`,
        description: uc.tagline,
        step: uc.workflow.map((w) => ({
          "@type": "HowToStep",
          position: w.step,
          name: w.name,
          text: w.body,
        })),
      },
      {
        "@type": "Audience",
        audienceType: uc.persona,
        name: `${uc.persona}s`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "All Sectors",
            item: "https://signals.gitdealflow.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Use Cases",
            item: "https://signals.gitdealflow.com/use-cases",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: uc.persona,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: uc.faqs.map((faq: UseCaseFAQ) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path={`/use-cases/${slug}`} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <Link href="/use-cases" className="hover:text-gray-300 transition-colors">
            Use Cases
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">{uc.persona}</span>
        </nav>

        <p className="text-xs font-medium text-sky-500 uppercase tracking-wider mb-2">
          For {uc.persona}s
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          {uc.h1}
        </h1>
        <p className="tagline text-sky-400 text-base leading-relaxed mb-6 font-medium">
          {uc.tagline}
        </p>
        <p className="text-gray-400 text-base leading-relaxed mb-10">
          {uc.intro}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {uc.metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-lg border border-slate-800 bg-slate-900 p-4"
            >
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                {m.label}
              </p>
              <p className="text-gray-100 font-semibold text-sm leading-snug">
                {m.value}
              </p>
            </div>
          ))}
        </div>

        <div className="problem-block rounded-lg border border-amber-900/50 bg-amber-950/20 p-6 mb-6">
          <p className="text-xs font-medium text-amber-400 uppercase tracking-wider mb-2">
            Problem
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            {uc.problem}
          </p>
        </div>

        <div className="solution-block rounded-lg border border-sky-900/50 bg-sky-950/30 p-6 mb-10">
          <p className="text-xs font-medium text-sky-400 uppercase tracking-wider mb-2">
            How VC Deal Flow Signal fits
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            {uc.solution}
          </p>
        </div>

        <section className="mb-12" aria-label="Workflow">
          <h2 className="text-xl font-semibold text-gray-100 mb-6">
            Workflow
          </h2>
          <ol className="space-y-4">
            {uc.workflow.map((w) => (
              <li
                key={w.step}
                className="rounded-lg border border-slate-800 bg-slate-900 p-6 flex gap-4"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-600 text-white font-semibold text-sm flex items-center justify-center">
                  {w.step}
                </div>
                <div>
                  <h3 className="text-gray-100 font-semibold text-sm mb-2">
                    {w.name}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {w.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-12" aria-label="Frequently asked questions">
          <h2 className="text-xl font-semibold text-gray-100 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {uc.faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-lg border border-slate-800 bg-slate-900"
              >
                <summary className="cursor-pointer p-5 text-gray-100 font-medium flex items-center justify-between">
                  {faq.question}
                  <span className="text-gray-600 group-open:rotate-180 transition-transform ml-2">
                    &#9662;
                  </span>
                </summary>
                <div className="px-5 pb-5">
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {relatedAlts.length > 0 && (
          <section className="mb-12" aria-label="Relevant comparisons">
            <h2 className="text-lg font-semibold text-gray-100 mb-4">
              Relevant comparisons
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedAlts.map((a) => (
                <Link
                  key={a.slug}
                  href={`/alternatives/${a.slug}`}
                  className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
                >
                  <p className="text-xs font-medium text-sky-500 uppercase tracking-wider mb-1">
                    vs {a.competitor}
                  </p>
                  <h3 className="text-gray-200 font-medium text-sm group-hover:text-sky-400 transition-colors">
                    {a.h1}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}

        {relatedSectorData.length > 0 && (
          <section className="mb-12" aria-label="Related sectors">
            <h2 className="text-lg font-semibold text-gray-100 mb-4">
              See the signals in action
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedSectorData.map((s) => (
                <Link
                  key={s.slug}
                  href={`/startups-to-watch/${s.slug}`}
                  className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
                >
                  <h3 className="text-gray-200 font-medium text-sm group-hover:text-sky-400 transition-colors mb-1">
                    {s.name}
                  </h3>
                  <p className="text-gray-400 text-xs">
                    {s.count} startups tracked &rarr;
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-center">
          <h2 className="text-gray-100 font-semibold text-lg mb-2">
            Get this week&apos;s signals
          </h2>
          <p className="text-gray-400 text-sm mb-5 max-w-lg mx-auto">
            Five breakout startups every Monday. Free, no spam.
          </p>
          <Link
            href="https://gitdealflow.com/#signup"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors"
          >
            Get the Report
          </Link>
        </div>
      </div>
    </>
  );
}
