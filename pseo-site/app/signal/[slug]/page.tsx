import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { companies, getCompany, getAllCompanySlugs } from "@/content/companies";
import { HreflangLinks } from "@/components/HreflangLinks";
import { DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";
import RelatedLinks from "@/components/RelatedLinks";
import { getRelatedGroups } from "@/lib/related-links";
import SeoCta from "@/components/SeoCta";
import { withEditorialOverride } from "@/lib/metadata";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllCompanySlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;
export const revalidate = 604800;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const c = getCompany(slug);
  if (!c) return {};

  return withEditorialOverride({
    title: c.title,
    description: c.metaDescription,
    openGraph: {
      title: c.title,
      description: c.metaDescription,
      type: "article",
      url: `/signal/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: c.title,
      description: c.metaDescription,
    },
    alternates: {
      canonical: `/signal/${slug}`,
    },
  });
}

export default async function CompanySignalPage({ params }: PageProps) {
  const { slug } = await params;
  const c = getCompany(slug);

  if (!c) {
    notFound();
  }

  const pageUrl = `https://signals.gitdealflow.com/signal/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: c.title,
        description: c.metaDescription,
        author: DATA_NERD_AUTHOR_REF,
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        about: {
          "@type": "Organization",
          name: c.name,
          url: c.homepageUrl,
          sameAs: [`https://github.com/${c.githubOrg}`],
        },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["[data-speakable]", "h1", ".signal-summary", ".tagline"],
        },
      },
      {
        "@type": "Organization",
        name: c.name,
        url: c.homepageUrl,
        sameAs: [`https://github.com/${c.githubOrg}`],
        description: c.description,
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
            name: "Company Signals",
            item: "https://signals.gitdealflow.com/signal",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: c.h1,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: c.faqs.map((faq) => ({
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
      <HreflangLinks
        canonical={pageUrl}
        languages={{
          en: pageUrl,
          "en-US": pageUrl,
          "x-default": pageUrl,
        }}
      />
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
          <Link href="/signal" className="hover:text-gray-300 transition-colors">
            Company Signals
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">{c.name}</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          {c.h1}
        </h1>
        <p data-speakable className="tagline text-sky-400 text-base leading-relaxed mb-6 font-medium">
          {c.tagline}
        </p>
        <p className="text-gray-400 text-base leading-relaxed mb-10">{c.intro}</p>

        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
              Public GitHub org
            </p>
            <a
              href={`https://github.com/${c.githubOrg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:text-sky-300 text-sm font-mono"
            >
              github.com/{c.githubOrg}
            </a>
            <p className="text-gray-400 text-xs mt-3">
              Sector: {c.sector} &middot; Stage: {c.stage}
            </p>
          </div>
          <div className="signal-summary rounded-lg border border-sky-900/50 bg-sky-950/30 p-6">
            <p className="text-xs font-medium text-sky-400 uppercase tracking-wider mb-2">
              Reference profile
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">{c.signalSummary}</p>
          </div>
        </div>

        <section className="mb-10" aria-label="What we track">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">What we track</h2>
          <p className="text-gray-400 text-sm leading-relaxed">{c.whatWeTrack}</p>
        </section>

        <section className="mb-10" aria-label="Why it matters">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">
            Why it matters for investors
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">{c.whyItMatters}</p>
        </section>

        <section className="mb-12" aria-label="Frequently asked questions">
          <h2 className="text-xl font-semibold text-gray-100 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {c.faqs.map((faq) => (
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

        <section className="mb-12" aria-label="Other company signals">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Other Company Signals to Compare
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {companies
              .filter((other) => other.slug !== slug && other.sector === c.sector)
              .slice(0, 6)
              .map((other) => (
                <Link
                  key={other.slug}
                  href={`/signal/${other.slug}`}
                  className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
                >
                  <h3 className="text-gray-200 font-medium text-sm group-hover:text-sky-400 transition-colors mb-1">
                    {other.name}
                  </h3>
                  <p className="text-gray-400 text-xs">{other.tagline}</p>
                </Link>
              ))}
          </div>
        </section>

        <RelatedLinks groups={getRelatedGroups(`/signal/${slug}`)} heading="Related signals" />

        <SeoCta
          signoffIndex={3}
          secondary={{
            label: "See it on your sector, First Look (€7) →",
            href: `/firstlook?ref=signal-${slug}`,
          }}
        />
      </div>
    </>
  );
}
