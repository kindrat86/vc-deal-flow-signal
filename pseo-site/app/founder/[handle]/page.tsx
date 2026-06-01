import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { founders, getFounder, getAllFounderHandles } from "@/content/founders";
import { HreflangLinks } from "@/components/HreflangLinks";

interface PageProps {
  params: Promise<{ handle: string }>;
}

export async function generateStaticParams() {
  return getAllFounderHandles().map((handle) => ({ handle }));
}

export const dynamicParams = false;
export const revalidate = 604800;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle } = await params;
  const p = getFounder(handle);
  if (!p) return {};

  return {
    title: p.title,
    description: p.metaDescription,
    openGraph: {
      title: p.title,
      description: p.metaDescription,
      type: "profile",
      url: `/founder/${handle}`,
    },
    twitter: {
      card: "summary_large_image",
      title: p.title,
      description: p.metaDescription,
    },
    alternates: {
      canonical: `/founder/${handle}`,
    },
  };
}

export default async function FounderPage({ params }: PageProps) {
  const { handle } = await params;
  const p = getFounder(handle);

  if (!p) {
    notFound();
  }

  const pageUrl = `https://signals.gitdealflow.com/founder/${handle}`;
  const githubUrl = `https://github.com/${handle}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        url: pageUrl,
        mainEntity: {
          "@type": "Person",
          name: p.name,
          alternateName: `@${handle}`,
          jobTitle: p.role,
          worksFor: {
            "@type": "Organization",
            name: p.affiliation,
          },
          sameAs: [githubUrl, ...p.sameAs],
        },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", ".tagline", ".notable-work"],
        },
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
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
            name: "Founders",
            item: "https://signals.gitdealflow.com/founder",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: p.name,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: p.faqs.map((faq) => ({
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
          <Link href="/founder" className="hover:text-gray-300 transition-colors">
            Founders
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">{p.name}</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          {p.h1}
        </h1>
        <p className="tagline text-sky-400 text-base leading-relaxed mb-6 font-medium">
          {p.tagline}
        </p>
        <p className="text-gray-400 text-base leading-relaxed mb-10">{p.intro}</p>

        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
              Public GitHub handle
            </p>
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:text-sky-300 text-sm font-mono"
            >
              @{handle}
            </a>
            <p className="text-gray-400 text-xs mt-3">
              Role: {p.role} &middot; Affiliation: {p.affiliation}
            </p>
          </div>
          <div className="rounded-lg border border-sky-900/50 bg-sky-950/30 p-6">
            <p className="text-xs font-medium text-sky-400 uppercase tracking-wider mb-2">
              Self-published source
            </p>
            <a
              href={p.publicSource}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-300 hover:text-sky-200 text-sm break-all"
            >
              {p.publicSource}
            </a>
            <p className="text-gray-400 text-xs mt-3">
              The handle-to-identity mapping cited on this page is published by {p.name} at this URL.
            </p>
          </div>
        </div>

        <section className="mb-10 notable-work" aria-label="Notable public work">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">Notable public work</h2>
          <p className="text-gray-400 text-sm leading-relaxed">{p.notablePublicWork}</p>
        </section>

        <section className="mb-10" aria-label="Why investors watch">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">
            Why investors and operators watch this profile
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">{p.whyInvestorsWatch}</p>
        </section>

        <section className="mb-12" aria-label="Frequently asked questions">
          <h2 className="text-xl font-semibold text-gray-100 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {p.faqs.map((faq) => (
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

        <section className="mb-12" aria-label="Other founders">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">Other Founder Profiles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {founders
              .filter((other) => other.handle !== handle)
              .slice(0, 6)
              .map((other) => (
                <Link
                  key={other.handle}
                  href={`/founder/${other.handle}`}
                  className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
                >
                  <h3 className="text-gray-200 font-medium text-sm group-hover:text-sky-400 transition-colors mb-1">
                    {other.name}
                  </h3>
                  <p className="text-gray-400 text-xs">{other.role} at {other.affiliation}</p>
                </Link>
              ))}
          </div>
        </section>

        <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5 mb-10">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
            Privacy &amp; opt-out
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            This page summarizes publicly observable engineering activity and a publicly self-published professional affiliation. To request removal, see{" "}
            <Link href="/founder/opt-out" className="text-sky-400 hover:text-sky-300">
              /founder/opt-out
            </Link>
            . Verified removal requests are honored within 7 business days; the page then returns HTTP 410 Gone and the handle is added to a permanent blocklist.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-center">
          <h2 className="text-gray-100 font-semibold text-lg mb-2">
            Track engineering acceleration weekly
          </h2>
          <p className="text-gray-400 text-sm mb-5 max-w-lg mx-auto">
            5 breakout startups every Sunday, ranked by GitHub engineering signals. Free.
          </p>
          <Link
            href={`/firstlook?ref=founder-${handle}`}
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-sm font-medium transition-colors"
          >
            Get the Report
          </Link>
        </div>
      </div>
    </>
  );
}
