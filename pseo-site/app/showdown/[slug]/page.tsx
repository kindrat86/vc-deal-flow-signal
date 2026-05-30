import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { companies } from "@/content/companies";
import {
  getAllShowdownSlugs,
  getShowdownPair,
  pairSlug,
} from "@/content/showdowns";
import { HreflangLinks } from "@/components/HreflangLinks";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllShowdownSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;
export const revalidate = 604800;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pair = getShowdownPair(slug);
  if (!pair) return {};

  const title = `${pair.a.name} vs ${pair.b.name} — Engineering Signal Comparison (2026)`;
  const description = `Side-by-side comparison of ${pair.a.name} and ${pair.b.name} on public GitHub engineering signals: stage, momentum, contributor activity, and language bias. Independent — no affiliation with either org.`;

  return {
    title,
    description,
    // noindex,follow — the /showdown/[slug] family is a templated company-vs-company
    // surface built from the shared per-entity prose in content/companies.ts. The
    // uniqueness audit (scripts/audit-pseo-uniqueness.ts, observational tier) flags
    // 100% of these leaves as near-duplicates of a sibling (some byte-identical after
    // name substitution), which is precisely the profile Google's scaled-content-abuse
    // policy demotes. We keep the pages crawlable + linkable (follow:true) so internal
    // equity still flows to the indexed entity/sector hubs, but pull the leaves out of
    // the search index. Reversible: drop this `robots` block to re-index. Sitemap leaf
    // entries are removed in parallel (app/sitemap/[id]/route.ts) so we never submit a
    // noindexed URL. See marketing/seo-authority-and-indexation-2026-05-30.md.
    robots: { index: false, follow: true },
    openGraph: { title, description, type: "article", url: `/showdown/${slug}` },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: `/showdown/${slug}` },
  };
}

export default async function ShowdownPage({ params }: PageProps) {
  const { slug } = await params;
  const pair = getShowdownPair(slug);

  if (!pair) {
    notFound();
  }

  const { a, b } = pair;
  const pageUrl = `https://signals.gitdealflow.com/showdown/${slug}`;

  const otherShowdowns = companies
    .filter((c) => c.sector === a.sector && c.slug !== a.slug && c.slug !== b.slug)
    .slice(0, 4)
    .flatMap((c) => [
      { other: c, against: a, slug: pairSlug(a.slug, c.slug) },
      { other: c, against: b, slug: pairSlug(b.slug, c.slug) },
    ])
    .slice(0, 6);

  const rows: { label: string; a: string; b: string }[] = [
    { label: "Sector", a: a.sector, b: b.sector },
    { label: "Stage", a: a.stage.replace("-", " "), b: b.stage.replace("-", " ") },
    { label: "GitHub org", a: a.githubOrg, b: b.githubOrg },
    { label: "Homepage", a: a.homepageUrl, b: b.homepageUrl },
    {
      label: "Public momentum",
      a: a.publicSignal.momentum,
      b: b.publicSignal.momentum,
    },
    {
      label: "Public repos",
      a: a.publicSignal.publicReposEstimate,
      b: b.publicSignal.publicReposEstimate,
    },
    {
      label: "Language bias",
      a: a.publicSignal.languageBias,
      b: b.publicSignal.languageBias,
    },
  ];

  const faqs = [
    {
      question: `What is the engineering signal difference between ${a.name} and ${b.name}?`,
      answer: `${a.name} (${a.stage.replace("-", " ")}) shows ${a.publicSignal.momentum} momentum across ${a.publicSignal.publicReposEstimate} on a ${a.publicSignal.languageBias} stack. ${b.name} (${b.stage.replace("-", " ")}) shows ${b.publicSignal.momentum} momentum across ${b.publicSignal.publicReposEstimate} on a ${b.publicSignal.languageBias} stack. The contributor-influx and commit-velocity panels are the comparison surfaces most often used by investors and operators when sourcing in this sector.`,
    },
    {
      question: `Is this comparison endorsed by ${a.name} or ${b.name}?`,
      answer: `No. This is an independent side-by-side using only publicly observable GitHub-event aggregates and each company's self-published facts (homepage, GitHub org, stage). Neither company has endorsed, paid for, or reviewed this page. Corrections welcome via /corrections.`,
    },
    {
      question: `Where does the underlying signal data come from?`,
      answer: `Public GitHub events only — commits, pull requests, issues, releases, contributors. Aggregated weekly across both ${a.githubOrg} and ${b.githubOrg}. The methodology is published at /methodology and the underlying paper is at SSRN 6606558. Raw aggregates ship via the public MCP server at /api/v1.`,
    },
    {
      question: `How would Corp Dev or PE use a comparison like this?`,
      answer: `Three workflows. (1) Acquisition shortlists: when both orgs are in the same sector and stage, the comparison surfaces the engineering-organization shape that informs integration cost. (2) Vendor consolidation: tech VPs running ${a.sector.replace("-", " ")} consolidation projects use side-by-side eng signals as one input. (3) Competitive scans: emerging-manager funds use these pages to benchmark their own portfolio companies against the closest public reference.`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: `${a.name} vs ${b.name} — Engineering Signal Comparison`,
        description: `Side-by-side engineering-signal comparison of ${a.name} and ${b.name}.`,
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
        about: [
          {
            "@type": "Organization",
            name: a.name,
            url: a.homepageUrl,
            sameAs: [`https://github.com/${a.githubOrg}`],
          },
          {
            "@type": "Organization",
            name: b.name,
            url: b.homepageUrl,
            sameAs: [`https://github.com/${b.githubOrg}`],
          },
        ],
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", ".showdown-summary"],
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
            name: "Showdowns",
            item: "https://signals.gitdealflow.com/showdown",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: `${a.name} vs ${b.name}`,
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
          <Link href="/showdown" className="hover:text-gray-300 transition-colors">
            Showdowns
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">
            {a.name} vs {b.name}
          </span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          {a.name} vs {b.name}
        </h1>
        <p className="text-sky-400 text-base leading-relaxed mb-6 font-medium">
          Engineering signal comparison &middot;{" "}
          <Link href={`/sector/${a.sector}`} className="hover:text-sky-300 underline">
            {a.sector}
          </Link>{" "}
          &middot; independent
        </p>
        <p className="showdown-summary text-gray-400 text-base leading-relaxed mb-10">
          Side-by-side view of {a.name} and {b.name} on publicly observable
          engineering-signal axes. Both orgs are tracked in the {a.sector.replace("-", " ")}{" "}
          sector. This page is independent — neither company is affiliated with VC Deal
          Flow Signal, and no private data is published here.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-gray-100 font-semibold text-lg mb-1">
              <Link
                href={`/signal/${a.slug}`}
                className="hover:text-sky-400 transition-colors"
              >
                {a.name}
              </Link>
            </h2>
            <p className="text-gray-400 text-xs leading-relaxed">{a.tagline}</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
            <h2 className="text-gray-100 font-semibold text-lg mb-1">
              <Link
                href={`/signal/${b.slug}`}
                className="hover:text-sky-400 transition-colors"
              >
                {b.name}
              </Link>
            </h2>
            <p className="text-gray-400 text-xs leading-relaxed">{b.tagline}</p>
          </div>
        </div>

        <section className="mb-10" aria-label="Side-by-side">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">Side-by-side</h2>
          <div className="overflow-hidden rounded-lg border border-slate-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900">
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3 w-1/4">
                    Axis
                  </th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">
                    {a.name}
                  </th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-3">
                    {b.name}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={row.label}
                    className={
                      i % 2 === 0 ? "bg-slate-950" : "bg-slate-900/40"
                    }
                  >
                    <td className="px-4 py-3 text-gray-400 text-xs font-medium">
                      {row.label}
                    </td>
                    <td className="px-4 py-3 text-gray-200 text-sm">{row.a}</td>
                    <td className="px-4 py-3 text-gray-200 text-sm">{row.b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10" aria-label="What we track">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">
            What this comparison is based on
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Every axis above is derivable from each company's publicly self-published
            facts (homepage, GitHub org, careers page) or aggregated public GitHub
            events. We do not publish private contact data, leaked employee info, or
            anything that requires authenticated access. For deeper per-company
            signals, see{" "}
            <Link href={`/signal/${a.slug}`} className="text-sky-400 hover:text-sky-300 underline">
              /signal/{a.slug}
            </Link>{" "}
            and{" "}
            <Link href={`/signal/${b.slug}`} className="text-sky-400 hover:text-sky-300 underline">
              /signal/{b.slug}
            </Link>
            .
          </p>
        </section>

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

        {otherShowdowns.length > 0 && (
          <section className="mb-12" aria-label="Other showdowns">
            <h2 className="text-lg font-semibold text-gray-100 mb-4">
              Other showdowns in {a.sector.replace("-", " ")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {otherShowdowns.map((s) => (
                <Link
                  key={s.slug}
                  href={`/showdown/${s.slug}`}
                  className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
                >
                  <h3 className="text-gray-200 font-medium text-sm group-hover:text-sky-400 transition-colors">
                    {s.against.name} vs {s.other.name}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-center">
          <h2 className="text-gray-100 font-semibold text-lg mb-2">
            Get weekly engineering signals on both
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Track {a.name}, {b.name}, and adjacent {a.sector.replace("-", " ")} orgs
            in one weekly digest.
          </p>
          <Link
            href="/firstlook"
            className="inline-block rounded-md bg-sky-500 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-400 transition-colors"
          >
            See First Look
          </Link>
        </div>
      </div>
    </>
  );
}
