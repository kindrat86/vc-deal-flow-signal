import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  PERSONAS,
  getAllPersonaSlugs,
  getPersona,
} from "@/content/personas";
import { HreflangLinks } from "@/components/HreflangLinks";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";
import { DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";

/**
 * Higher-intent buyer personas who evaluate companies for a living and have
 * budget — they get an ascension next step (paid Dashboard + Insider) beside
 * the free digest / First Look, not just the top-of-funnel options. Founders,
 * researchers, and journalists keep their own non-sales CTA and are excluded.
 */
const ASCENSION_SLUGS = new Set([
  "corp-dev",
  "pe-operating-partners",
  "tech-vps",
  "emerging-managers",
]);

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPersonaSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;
export const revalidate = 604800;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const p = getPersona(slug);
  if (!p) return {};

  return {
    title: p.title,
    description: p.metaDescription,
    openGraph: { title: p.title, description: p.metaDescription, type: "article", url: `/for/${slug}` },
    twitter: { card: "summary_large_image", title: p.title, description: p.metaDescription },
    alternates: { canonical: `/for/${slug}` },
  };
}

export default async function PersonaPage({ params }: PageProps) {
  const { slug } = await params;
  const persona = getPersona(slug);

  if (!persona) {
    notFound();
  }

  const pageUrl = `https://signals.gitdealflow.com/for/${slug}`;
  const otherPersonas = PERSONAS.filter((o) => o.slug !== slug);
  const showAscension = ASCENSION_SLUGS.has(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: persona.h1,
        description: persona.metaDescription,
        author: DATA_NERD_AUTHOR_REF,
        publisher: { "@id": "https://gitdealflow.com/#organization" },
        audience: {
          "@type": "Audience",
          audienceType: persona.name,
        },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", ".tagline", ".why-engineering-signals"],
        },
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
            name: "For",
            item: "https://signals.gitdealflow.com/for",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: persona.name,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: persona.faqs.map((faq) => ({
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
          <Link href="/for" className="hover:text-gray-300 transition-colors">
            For
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">{persona.shortName}</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          {persona.h1}
        </h1>
        <p className="tagline text-sky-400 text-base leading-relaxed mb-6 font-medium">
          {persona.tagline}
        </p>
        <p className="text-gray-400 text-base leading-relaxed mb-10">{persona.intro}</p>

        <section className="mb-10" aria-label="Quick start">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">Quick start</h2>
          <p className="text-gray-500 text-xs mb-4">
            The three pages worth bookmarking first.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {persona.quickStart.map((qs, i) => (
              <Link
                key={qs.path}
                href={qs.path}
                className="group block rounded-lg border border-sky-900/50 bg-sky-950/30 p-4 hover:border-sky-600 transition-all"
              >
                <p className="text-xs text-sky-400 mb-1">#{i + 1}</p>
                <h3 className="text-gray-100 font-medium text-sm group-hover:text-sky-300 transition-colors">
                  {qs.label}
                </h3>
                <p className="text-gray-500 text-xs mt-1 font-mono">{qs.path}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-10" aria-label="Workflows">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            Workflows for {persona.shortName}
          </h2>
          <div className="space-y-5">
            {persona.workflows.map((w) => (
              <div
                key={w.name}
                className="rounded-lg border border-slate-800 bg-slate-900 p-5"
              >
                <h3 className="text-gray-100 font-medium text-sm mb-2">{w.name}</h3>
                <p className="text-gray-400 text-xs leading-relaxed mb-3">
                  {w.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={w.primaryPath}
                    className="rounded-full border border-sky-900/50 bg-sky-950/30 px-3 py-1 text-xs text-sky-300 hover:bg-sky-900/50 transition-colors"
                  >
                    {w.primaryPath}
                  </Link>
                  {w.secondaryPaths.map((sp) => (
                    <Link
                      key={sp}
                      href={sp}
                      className="rounded-full border border-slate-800 bg-slate-950 px-3 py-1 text-xs text-gray-400 hover:border-slate-600 transition-colors"
                    >
                      {sp}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10 why-engineering-signals" aria-label="Why engineering signals">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">
            Why engineering signals matter for {persona.shortName}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {persona.whyEngineeringSignals}
          </p>
        </section>

        <section className="mb-10" aria-label="What it does not solve">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">
            What this does not solve
          </h2>
          <div className="rounded-lg border border-amber-900/50 bg-amber-950/20 p-5">
            <p className="text-gray-300 text-sm leading-relaxed">
              {persona.whatItDoesNotSolve}
            </p>
          </div>
        </section>

        {showAscension && (
          <section className="mb-12" aria-label="Pick your next step">
            <h2 className="text-xl font-semibold text-gray-100 mb-2">
              Pick the depth that fits {persona.shortName}
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Start free on Sunday. Move up only when the timing edge is paying
              for itself — most {persona.shortName} land on the weekly seat, a
              few who run a full pipeline take the room.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/firstlook"
                className="group block rounded-lg border border-slate-800 bg-slate-900 p-5 hover:border-sky-700 transition-all"
              >
                <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                  One-time · €7
                </p>
                <h3 className="text-gray-100 font-semibold text-sm group-hover:text-sky-300 transition-colors mb-1">
                  First Look
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  One full sample brief, translated into plain business
                  language. See exactly what a week of the signal reads like
                  before you commit to anything.
                </p>
              </Link>
              <Link
                href="/dashboard"
                className="group block rounded-lg border border-sky-800/60 bg-sky-950/30 p-5 hover:border-sky-500 transition-all"
              >
                <p className="text-[10px] uppercase tracking-wider text-sky-400/80 mb-1">
                  Most popular · €49/mo
                </p>
                <h3 className="text-gray-100 font-semibold text-sm group-hover:text-sky-300 transition-colors mb-1">
                  The Dashboard
                </h3>
                <p className="text-gray-300 text-xs leading-relaxed">
                  The live board, refreshed weekly, filtered to your sectors.
                  See which teams are suddenly shipping far more than usual —
                  weeks before the round is on anyone&rsquo;s desk.
                </p>
              </Link>
              <Link
                href="/insider"
                className="group block rounded-lg border border-amber-700/50 bg-amber-950/20 p-5 hover:border-amber-500 transition-all"
              >
                <p className="text-[10px] uppercase tracking-wider text-amber-400/80 mb-1">
                  For the full pipeline · €197/mo
                </p>
                <h3 className="text-gray-100 font-semibold text-sm group-hover:text-amber-200 transition-colors mb-1">
                  Insider Circle
                </h3>
                <p className="text-gray-300 text-xs leading-relaxed">
                  Everything in the Dashboard, plus the private room where the
                  earliest movers get the names first and the reasoning behind
                  each one — written so you can repeat it in the meeting.
                </p>
              </Link>
              <Link
                href="/#signup"
                className="group block rounded-lg border border-slate-800 bg-slate-950 p-5 hover:border-slate-600 transition-all"
              >
                <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                  Free · forever
                </p>
                <h3 className="text-gray-200 font-semibold text-sm group-hover:text-gray-100 transition-colors mb-1">
                  Sunday digest
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Not ready to pay? The free weekly email lands every Sunday.
                  Start there and upgrade when the head start earns its keep.
                </p>
              </Link>
            </div>
          </section>
        )}

        <section className="mb-12" aria-label="Frequently asked questions">
          <h2 className="text-xl font-semibold text-gray-100 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {persona.faqs.map((faq) => (
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

        <section className="mb-12" aria-label="Other personas">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">Other personas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {otherPersonas.map((o) => (
              <Link
                key={o.slug}
                href={`/for/${o.slug}`}
                className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
              >
                <h3 className="text-gray-200 font-medium text-sm group-hover:text-sky-400 transition-colors mb-1">
                  {o.name}
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed">{o.tagline}</p>
              </Link>
            ))}
          </div>
        </section>

        <DataNerdSignoff variant="long" catchphraseIndex={3} className="mb-12" />

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-center">
          <h2 className="text-gray-100 font-semibold text-lg mb-2">
            {persona.shortName} — get started
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            The fastest path is the weekly digest. Filter by your specific sectors during
            onboarding.
          </p>
          <Link
            href={persona.ctaPath}
            className="inline-block rounded-md bg-signal-500 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-signal-400 transition-colors"
          >
            {persona.ctaLabel}
          </Link>
        </div>
      </div>
    </>
  );
}
