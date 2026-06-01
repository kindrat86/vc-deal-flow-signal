import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  WORKS_WITH,
  getAllWorksWithSlugs,
  getWorksWith,
  pathLabel,
  categoryLabel,
} from "@/content/works-with";
import { HreflangLinks } from "@/components/HreflangLinks";
import SeoCta from "@/components/SeoCta";
import { DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllWorksWithSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;
export const revalidate = 604800;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const t = getWorksWith(slug);
  if (!t) return {};

  return {
    title: t.title,
    description: t.metaDescription,
    openGraph: { title: t.title, description: t.metaDescription, type: "article", url: `/works-with/${slug}` },
    twitter: { card: "summary_large_image", title: t.title, description: t.metaDescription },
    alternates: { canonical: `/works-with/${slug}` },
  };
}

export default async function WorksWithPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = getWorksWith(slug);

  if (!tool) {
    notFound();
  }

  const pageUrl = `https://signals.gitdealflow.com/works-with/${slug}`;
  const otherTools = WORKS_WITH.filter((o) => o.slug !== slug).slice(0, 6);
  const sameCategoryTools = WORKS_WITH.filter(
    (o) => o.category === tool.category && o.slug !== slug,
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: tool.h1,
        description: tool.metaDescription,
        author: DATA_NERD_AUTHOR_REF,
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        about: {
          "@type": "SoftwareApplication",
          name: tool.name,
          url: tool.homepageUrl,
          applicationCategory: categoryLabel(tool.category),
        },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", ".tagline", ".how-it-works"],
        },
      },
      {
        "@type": "ItemList",
        name: `${tool.name} — Available Integration Paths`,
        itemListOrder: "Unordered",
        numberOfItems: tool.availablePaths.length,
        itemListElement: tool.availablePaths.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: pathLabel(p),
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
            name: "Works with",
            item: "https://signals.gitdealflow.com/works-with",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: tool.name,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: tool.faqs.map((faq) => ({
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
          <Link href="/works-with" className="hover:text-gray-300 transition-colors">
            Works with
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">{tool.name}</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          {tool.h1}
        </h1>
        <p className="tagline text-sky-400 text-base leading-relaxed mb-6 font-medium">
          {tool.tagline}
        </p>
        <p className="text-gray-400 text-base leading-relaxed mb-10">{tool.intro}</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-center">
            <p className="text-2xl font-bold text-sky-400">
              {tool.availablePaths.length}
            </p>
            <p className="text-xs text-gray-400 mt-1">Paths today</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-center">
            <p className="text-2xl font-bold text-sky-400">{tool.workflows.length}</p>
            <p className="text-xs text-gray-400 mt-1">Live workflows</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-center col-span-2 sm:col-span-1">
            <p className="text-sm font-bold text-sky-400">
              {categoryLabel(tool.category)}
            </p>
            <p className="text-xs text-gray-400 mt-1">Category</p>
          </div>
        </div>

        <section className="mb-10" aria-label="Available integration paths">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            Available integration paths today
          </h2>
          <div className="flex flex-wrap gap-2">
            {tool.availablePaths.map((p) => (
              <span
                key={p}
                className="rounded-full border border-sky-900/50 bg-sky-950/30 px-3 py-1 text-xs text-sky-300"
              >
                {pathLabel(p)}
              </span>
            ))}
          </div>
        </section>

        <section className="mb-10" aria-label="How it works">
          <h2 className="text-xl font-semibold text-gray-100 mb-3 how-it-works">
            How it works
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">{tool.howItWorks}</p>
        </section>

        <section className="mb-10" aria-label="Workflows">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">Live workflows</h2>
          <div className="space-y-3">
            {tool.workflows.map((w) => (
              <div
                key={w.name}
                className="rounded-lg border border-slate-800 bg-slate-900 p-4"
              >
                <h3 className="text-gray-100 font-medium text-sm mb-2">{w.name}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{w.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10" aria-label="What's not available">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">
            What's not yet available
          </h2>
          <div className="rounded-lg border border-amber-900/50 bg-amber-950/20 p-5">
            <p className="text-gray-300 text-sm leading-relaxed">{tool.whatsMissing}</p>
          </div>
        </section>

        <section className="mb-12" aria-label="Frequently asked questions">
          <h2 className="text-xl font-semibold text-gray-100 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {tool.faqs.map((faq) => (
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

        {sameCategoryTools.length > 0 && (
          <section className="mb-12" aria-label="Other tools in same category">
            <h2 className="text-lg font-semibold text-gray-100 mb-4">
              Other {categoryLabel(tool.category).toLowerCase()} tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sameCategoryTools.map((o) => (
                <Link
                  key={o.slug}
                  href={`/works-with/${o.slug}`}
                  className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
                >
                  <h3 className="text-gray-200 font-medium text-sm group-hover:text-sky-400 transition-colors mb-1">
                    {o.name}
                  </h3>
                  <p className="text-gray-400 text-xs">
                    {o.availablePaths.length} paths today
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {sameCategoryTools.length < 3 && otherTools.length > 0 && (
          <section className="mb-12" aria-label="Other supported tools">
            <h2 className="text-lg font-semibold text-gray-100 mb-4">
              Other supported tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {otherTools.map((o) => (
                <Link
                  key={o.slug}
                  href={`/works-with/${o.slug}`}
                  className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
                >
                  <h3 className="text-gray-200 font-medium text-sm group-hover:text-sky-400 transition-colors mb-1">
                    {o.name}
                  </h3>
                  <p className="text-gray-400 text-xs">{categoryLabel(o.category)}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <SeoCta secondary={{ label: "See a €7 First Look sample", href: "/firstlook" }} />
      </div>
    </>
  );
}
