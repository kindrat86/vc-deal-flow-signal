import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ACQUIRERS,
  getAllAcquirerSlugs,
  getAcquirer,
} from "@/content/acquirers";
import { getSector, getCompaniesInSector } from "@/content/sectors";
import { HreflangLinks } from "@/components/HreflangLinks";
import SeoCta from "@/components/SeoCta";
import { DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllAcquirerSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;
export const revalidate = 604800;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const a = getAcquirer(slug);
  if (!a) return {};

  return {
    title: a.title,
    description: a.metaDescription,
    openGraph: { title: a.title, description: a.metaDescription, type: "article", url: `/acquirer/${slug}` },
    twitter: { card: "summary_large_image", title: a.title, description: a.metaDescription },
    alternates: { canonical: `/acquirer/${slug}` },
  };
}

export default async function AcquirerPage({ params }: PageProps) {
  const { slug } = await params;
  const a = getAcquirer(slug);

  if (!a) {
    notFound();
  }

  const pageUrl = `https://signals.gitdealflow.com/acquirer/${slug}`;

  // Pull companies from focus sectors — these are the kinds of orgs the acquirer's published focus aligns with.
  const trackedCompaniesInFocus = a.focusSectors
    .flatMap((s) => getCompaniesInSector(s))
    .reduce<{ slug: string; name: string; sector: string }[]>((acc, c) => {
      if (!acc.find((x) => x.slug === c.slug)) {
        acc.push({ slug: c.slug, name: c.name, sector: c.sector });
      }
      return acc;
    }, [])
    .slice(0, 12);

  const focusSectorObjs = a.focusSectors.map((s) => getSector(s)).filter(Boolean);

  const otherAcquirers = ACQUIRERS.filter((o) => o.slug !== a.slug).slice(0, 6);

  const faqs = [
    {
      question: `How many acquisitions has ${a.name} made?`,
      answer: `This page documents ${a.notableAcquisitions.length} notable public acquisitions by ${a.name} — every deal here was announced via press release, SEC filing, or both. ${a.name}'s full acquisition history may include smaller, undisclosed talent acquisitions; we list only the publicly documented deals that materially shaped their direction.`,
    },
    {
      question: `What does ${a.name} typically acquire?`,
      answer: a.whatTheyScoutFor,
    },
    {
      question: `What is ${a.name}'s M&A strategy?`,
      answer: a.acquisitionStrategy,
    },
    {
      question: `Is this page affiliated with ${a.name}?`,
      answer: `No. This page is an independent summary of ${a.name}'s publicly disclosed acquisitions and stated focus areas. ${a.name} has not endorsed, paid for, or reviewed this page. All deals listed are sourced from their own press releases, SEC filings, or both. We do not publish private deals or speculation about future acquisitions.`,
    },
    {
      question: `How can Corp Dev or PE teams use this page?`,
      answer: `Two workflows. (1) Pattern matching: when scouting acquisition targets, the ${a.notableAcquisitions.length}-deal history above is a published reference for what ${a.name} actually buys — useful for triangulating "would they buy this?" judgments. (2) Sector overlap: the focus-sectors mapping connects ${a.name}'s historical M&A pattern to the engineering-signal panel we publish, so analysts can correlate acquisition pace with sector-level signal acceleration.`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: `${a.name} Acquisitions & M&A Pattern`,
        description: a.metaDescription,
        author: DATA_NERD_AUTHOR_REF,
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        about: {
          "@type": "Organization",
          name: a.name,
          url: a.homepageUrl,
        },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", ".tagline", ".acquisition-strategy"],
        },
      },
      {
        "@type": "ItemList",
        name: `${a.name} — Notable Public Acquisitions`,
        itemListOrder: "Descending",
        numberOfItems: a.notableAcquisitions.length,
        itemListElement: a.notableAcquisitions.map((acq, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Organization",
            name: acq.name,
            description: acq.note,
          },
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
            name: "Acquirers",
            item: "https://signals.gitdealflow.com/acquirer",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: a.name,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
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
          <Link href="/acquirer" className="hover:text-gray-300 transition-colors">
            Acquirers
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">{a.name}</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          {a.h1}
        </h1>
        <p className="tagline text-sky-400 text-base leading-relaxed mb-6 font-medium">
          {a.tagline}
        </p>
        <p className="text-gray-400 text-base leading-relaxed mb-10">{a.intro}</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-center">
            <p className="text-2xl font-bold text-sky-400">
              {a.notableAcquisitions.length}
            </p>
            <p className="text-xs text-gray-400 mt-1">Notable deals</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-center">
            <p className="text-2xl font-bold text-sky-400">{a.focusSectors.length}</p>
            <p className="text-xs text-gray-400 mt-1">Focus sectors</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-center">
            <p className="text-2xl font-bold text-sky-400">
              {trackedCompaniesInFocus.length}
            </p>
            <p className="text-xs text-gray-400 mt-1">Companies we track</p>
          </div>
        </div>

        <section className="mb-10 acquisition-strategy" aria-label="Acquisition strategy">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">M&A strategy</h2>
          <p className="text-gray-400 text-sm leading-relaxed">{a.acquisitionStrategy}</p>
        </section>

        <section className="mb-10" aria-label="What they scout for">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">
            What {a.name} typically scouts for
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">{a.whatTheyScoutFor}</p>
        </section>

        <section className="mb-10" aria-label="Notable acquisitions">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            Notable public acquisitions
          </h2>
          <p className="text-gray-500 text-xs mb-4">
            Sorted by year (most recent first). Every deal here was announced publicly via
            press release, SEC filing, or both.
          </p>
          <div className="space-y-3">
            {a.notableAcquisitions.map((acq) => (
              <div
                key={`${acq.name}-${acq.year}`}
                className="rounded-lg border border-slate-800 bg-slate-900 p-4"
              >
                <div className="flex items-start justify-between mb-1 gap-3">
                  <h3 className="text-gray-100 font-medium text-sm">{acq.name}</h3>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-gray-300 font-mono">
                      {acq.year}
                    </span>
                    {acq.announcedAmount && (
                      <span className="rounded-full bg-sky-950 px-2 py-0.5 text-xs text-sky-300 font-mono">
                        {acq.announcedAmount}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">{acq.note}</p>
              </div>
            ))}
          </div>
        </section>

        {focusSectorObjs.length > 0 && (
          <section className="mb-10" aria-label="Focus sectors">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              Sector hubs aligned with {a.name}'s M&A focus
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {focusSectorObjs.map((s) =>
                s ? (
                  <Link
                    key={s.slug}
                    href={`/sector/${s.slug}`}
                    className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
                  >
                    <h3 className="text-gray-200 font-medium text-sm group-hover:text-sky-400 transition-colors mb-1">
                      {s.name}
                    </h3>
                    <p className="text-gray-400 text-xs leading-relaxed">{s.tagline}</p>
                  </Link>
                ) : null,
              )}
            </div>
          </section>
        )}

        {trackedCompaniesInFocus.length > 0 && (
          <section className="mb-10" aria-label="Tracked companies in focus sectors">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              Tracked companies in {a.name}'s focus sectors
            </h2>
            <p className="text-gray-500 text-xs mb-4">
              We do not claim these companies are acquisition targets. They are simply
              companies in the engineering-signal panel that sit in the same sectors{" "}
              {a.name} has historically acquired in.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {trackedCompaniesInFocus.map((c) => (
                <Link
                  key={c.slug}
                  href={`/signal/${c.slug}`}
                  className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
                >
                  <h3 className="text-gray-200 font-medium text-sm group-hover:text-sky-400 transition-colors mb-1">
                    {c.name}
                  </h3>
                  <p className="text-gray-400 text-xs">{c.sector}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mb-12" aria-label="Frequently asked questions">
          <h2 className="text-xl font-semibold text-gray-100 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
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

        <section className="mb-12" aria-label="Other acquirers">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">Other acquirers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {otherAcquirers.map((o) => (
              <Link
                key={o.slug}
                href={`/acquirer/${o.slug}`}
                className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
              >
                <h3 className="text-gray-200 font-medium text-sm group-hover:text-sky-400 transition-colors mb-1">
                  {o.name}
                </h3>
                <p className="text-gray-400 text-xs">
                  {o.notableAcquisitions.length} deals &middot; {o.hq}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <SeoCta secondary={{ label: "See a €7 First Look sample", href: "/firstlook" }} />
      </div>
    </>
  );
}
