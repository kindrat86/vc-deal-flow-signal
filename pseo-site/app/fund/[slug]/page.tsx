import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { funds, getFund, getAllFundSlugs } from "@/content/funds";
import { HreflangLinks } from "@/components/HreflangLinks";
import SeoCta from "@/components/SeoCta";
import { DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllFundSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;
export const revalidate = 604800;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const f = getFund(slug);
  if (!f) return {};

  return {
    title: f.title,
    description: f.metaDescription,
    openGraph: {
      title: f.title,
      description: f.metaDescription,
      type: "article",
      url: `/fund/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: f.title,
      description: f.metaDescription,
    },
    alternates: {
      canonical: `/fund/${slug}`,
    },
  };
}

export default async function FundPage({ params }: PageProps) {
  const { slug } = await params;
  const f = getFund(slug);

  if (!f) {
    notFound();
  }

  const pageUrl = `https://signals.gitdealflow.com/fund/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: f.title,
        description: f.metaDescription,
        author: DATA_NERD_AUTHOR_REF,
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        about: {
          "@type": "Organization",
          name: f.name,
          url: f.homepageUrl,
        },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", ".thesis-block", ".tagline"],
        },
      },
      {
        "@type": "Organization",
        name: f.name,
        url: f.homepageUrl,
        description: f.description,
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
            name: "Funds",
            item: "https://signals.gitdealflow.com/fund",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: f.h1,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: f.faqs.map((faq) => ({
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
          <Link href="/fund" className="hover:text-gray-300 transition-colors">
            Funds
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">{f.name}</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          {f.h1}
        </h1>
        <p className="tagline text-sky-400 text-base leading-relaxed mb-6 font-medium">
          {f.tagline}
        </p>
        <p className="text-gray-400 text-base leading-relaxed mb-10">{f.intro}</p>

        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
              Fund website
            </p>
            <a
              href={f.homepageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:text-sky-300 text-sm"
            >
              {f.homepageUrl.replace(/^https?:\/\//, "")}
            </a>
            <p className="text-gray-400 text-xs mt-3">
              HQ: {f.hq} &middot; Stage: {f.stageFocus}
            </p>
          </div>
          <div className="thesis-block rounded-lg border border-sky-900/50 bg-sky-950/30 p-6">
            <p className="text-xs font-medium text-sky-400 uppercase tracking-wider mb-2">
              Published thesis
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">{f.thesis}</p>
          </div>
        </div>

        <section className="mb-10" aria-label="Signal map">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">
            How engineering signals map to their sourcing
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">{f.signalMap}</p>
        </section>

        <section className="mb-10" aria-label="Why engineering signals">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">
            Why engineering signals matter for this fund
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">{f.whyEngineeringSignals}</p>
        </section>

        <section className="mb-12" aria-label="Frequently asked questions">
          <h2 className="text-xl font-semibold text-gray-100 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {f.faqs.map((faq) => (
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

        <section className="mb-12" aria-label="Other funds">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Other Fund Profiles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {funds
              .filter((other) => other.slug !== slug)
              .slice(0, 6)
              .map((other) => (
                <Link
                  key={other.slug}
                  href={`/fund/${other.slug}`}
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

        <SeoCta secondary={{ label: "See a €7 First Look sample", href: "/firstlook" }} />
      </div>
    </>
  );
}
