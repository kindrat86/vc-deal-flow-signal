import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CASE_STUDIES,
  getAllCaseStudySlugs,
  getCaseStudy,
} from "@/content/case-studies";
import { HreflangLinks } from "@/components/HreflangLinks";
import SeoCta from "@/components/SeoCta";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllCaseStudySlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;
export const revalidate = 604800;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) return {};

  return {
    title: cs.title,
    description: cs.metaDescription,
    openGraph: { title: cs.title, description: cs.metaDescription, type: "article", url: `/case-study/${slug}` },
    twitter: { card: "summary_large_image", title: cs.title, description: cs.metaDescription },
    alternates: { canonical: `/case-study/${slug}` },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);

  if (!cs) {
    notFound();
  }

  const pageUrl = `https://signals.gitdealflow.com/case-study/${slug}`;
  const otherCaseStudies = CASE_STUDIES.filter((o) => o.slug !== slug).slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: cs.h1,
        description: cs.metaDescription,
        author: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        audience: {
          "@type": "Audience",
          audienceType: cs.personaLabel,
        },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", ".tagline", ".situation"],
        },
      },
      {
        "@type": "HowTo",
        name: `${cs.h1}, workflow steps`,
        description: cs.tagline,
        step: cs.steps.map((s, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: s.label,
          text: s.description,
          url: `https://signals.gitdealflow.com${s.primaryPath}`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://signals.gitdealflow.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Case Studies",
            item: "https://signals.gitdealflow.com/case-study",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: cs.name,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: cs.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={pageUrl}
        languages={{ en: pageUrl, "en-US": pageUrl, "x-default": pageUrl }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/case-study" className="hover:text-gray-300 transition-colors">
            Case Studies
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">{cs.personaLabel}</span>
        </nav>

        <p className="text-sky-400 text-xs uppercase tracking-wider font-medium mb-3">
          {cs.personaLabel} &middot;{" "}
          <Link href={`/for/${cs.personaSlug}`} className="hover:text-sky-300 underline">
            persona overview
          </Link>
        </p>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          {cs.h1}
        </h1>
        <p className="tagline text-sky-400 text-base leading-relaxed mb-6 font-medium">
          {cs.tagline}
        </p>
        <p className="situation text-gray-400 text-base leading-relaxed mb-10">
          {cs.situation}
        </p>

        <section className="mb-12" aria-label="Workflow steps">
          <h2 className="text-xl font-semibold text-gray-100 mb-6">Workflow</h2>
          <ol className="space-y-6">
            {cs.steps.map((step, i) => (
              <li key={step.label} className="rounded-lg border border-slate-800 bg-slate-900 p-5">
                <div className="flex items-start gap-3 mb-3">
                  <span className="rounded-full bg-sky-950 text-sky-300 text-xs font-mono w-7 h-7 flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <h3 className="text-gray-100 font-semibold text-sm">{step.label}</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-4 ml-10">
                  {step.description}
                </p>
                <div className="flex flex-wrap gap-2 ml-10">
                  <Link
                    href={step.primaryPath}
                    className="rounded-full border border-sky-900/50 bg-sky-950/30 px-3 py-1 text-xs text-sky-300 hover:bg-sky-900/50 transition-colors"
                  >
                    {step.primaryPath}
                  </Link>
                  {(step.supportingPaths ?? []).map((p) => (
                    <Link
                      key={p}
                      href={p}
                      className="rounded-full border border-slate-800 bg-slate-950 px-3 py-1 text-xs text-gray-400 hover:border-slate-600 transition-colors"
                    >
                      {p}
                    </Link>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-10" aria-label="Outcome">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">Outcome</h2>
          <p className="text-gray-400 text-sm leading-relaxed">{cs.outcome}</p>
        </section>

        <section className="mb-10" aria-label="Lessons">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">
            Lessons & takeaways
          </h2>
          <ul className="space-y-3">
            {cs.lessons.map((lesson, i) => (
              <li
                key={i}
                className="rounded-lg border border-amber-900/50 bg-amber-950/20 p-4 text-gray-300 text-sm leading-relaxed"
              >
                {lesson}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12" aria-label="Frequently asked questions">
          <h2 className="text-xl font-semibold text-gray-100 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {cs.faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-lg border border-slate-800 bg-slate-900"
              >
                <summary className="cursor-pointer p-5 text-gray-100 font-medium flex items-center justify-between">
                  {faq.question}
                  <span className="text-gray-400 group-open:rotate-180 transition-transform ml-2">
                    &#9662;
                  </span>
                </summary>
                <div className="px-5 pb-5">
                  <p className="text-gray-400 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="mb-12" aria-label="Other case studies">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">Other case studies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {otherCaseStudies.map((o) => (
              <Link
                key={o.slug}
                href={`/case-study/${o.slug}`}
                className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
              >
                <p className="text-xs text-sky-400 uppercase tracking-wider mb-1">
                  {o.personaLabel}
                </p>
                <h3 className="text-gray-200 font-medium text-sm group-hover:text-sky-400 transition-colors mb-1">
                  {o.name}
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                  {o.tagline}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section aria-label="Call to action">
          <SeoCta
            heading="Try this workflow for your team"
            blurb="The free Acceleration Watch runs on the same engineering signal these workflows use, five breakout teams every Sunday, in plain English, no code-reading. Onboarding to any paid tier includes a guided walkthrough of the workflow that matches your role."
            secondary={{ label: "See a €7 First Look sample", href: "/firstlook" }}
          />
        </section>
      </div>
    </>
  );
}
