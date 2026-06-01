import type { Metadata } from "next";
import Link from "next/link";
import { CASE_STUDIES } from "@/content/case-studies";
import { HreflangLinks } from "@/components/HreflangLinks";
import { TrustConversionBlock } from "@/components/TrustConversionBlock";

export const metadata: Metadata = {
  title: "Case Studies — Workflow Walkthroughs | VC Deal Flow Signal",
  description: `${CASE_STUDIES.length} narrative workflow case studies showing how corp-dev, PE, and VC dealmakers use VC Deal Flow Signal end-to-end. Illustrative composite scenarios with full step-by-step walkthroughs.`,
  alternates: { canonical: "/case-study" },
  openGraph: {
    title: "Case Studies — VC Deal Flow Signal",
    description:
      "Workflow walkthroughs for Corp Dev, PE Operating Partners, founders, researchers, and journalists.",
    type: "website",
    url: "/case-study",
  },
  twitter: {
    card: "summary_large_image",
    title: "Case Studies — VC Deal Flow Signal",
    description: "Workflow walkthroughs for corp-dev, PE, and VC dealmakers.",
  },
};

export const revalidate = 604800;

const PAGE_URL = "https://signals.gitdealflow.com/case-study";

export default function CaseStudyHubPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        url: PAGE_URL,
        name: "Case Studies — Workflow Walkthroughs",
        description: `${CASE_STUDIES.length} narrative workflow case studies for corp-dev, PE, and VC dealmakers.`,
        isPartOf: {
          "@type": "WebSite",
          name: "VC Deal Flow Signal",
          url: "https://signals.gitdealflow.com",
        },
      },
      {
        "@type": "ItemList",
        itemListOrder: "Unordered",
        numberOfItems: CASE_STUDIES.length,
        itemListElement: CASE_STUDIES.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${PAGE_URL}/${c.slug}`,
          name: c.name,
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
            item: PAGE_URL,
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={PAGE_URL}
        languages={{ en: PAGE_URL, "en-US": PAGE_URL, "x-default": PAGE_URL }}
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
          <span className="text-gray-400">Case Studies</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          Case Studies
        </h1>
        <p className="text-sky-400 text-base leading-relaxed mb-6 font-medium">
          {CASE_STUDIES.length} workflow walkthroughs for corp-dev, PE, and VC dealmakers.
        </p>
        <p className="text-gray-400 text-base leading-relaxed mb-10">
          Each case study is an illustrative composite scenario showing how one
          non-technical dealmaker uses the VC Deal Flow Signal surface end-to-end. Names and
          specific deal details are omitted by design — the structure of the workflow
          (which URLs the persona uses, which questions they ask, which action they
          take) is the representative element. Designed to show buyers exactly how the
          product works for their role.
        </p>
        <p className="text-gray-400 text-sm leading-relaxed mb-10">
          These walkthroughs are illustrative composites. The named, dated
          receipts — real orgs and the engineering events that preceded their
          rounds — live on{" "}
          <Link href="/wins" className="text-sky-400 hover:text-sky-300 underline decoration-dotted">
            the wins page
          </Link>
          .
        </p>

        <div className="space-y-4">
          {CASE_STUDIES.map((cs) => (
            <Link
              key={cs.slug}
              href={`/case-study/${cs.slug}`}
              className="group block rounded-lg border border-slate-800 bg-slate-900 p-5 hover:border-slate-600 transition-all"
            >
              <p className="text-xs text-sky-400 uppercase tracking-wider mb-2">
                {cs.personaLabel}
              </p>
              <h2 className="text-gray-100 font-semibold text-base group-hover:text-sky-400 transition-colors mb-2">
                {cs.name}
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                {cs.tagline}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-center">
          <h2 className="text-gray-100 font-semibold text-lg mb-2">
            Try a workflow for your team
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            No call to book — run the same workflow on a sector you already care
            about for €7.
          </p>
          <Link
            href="/firstlook"
            className="inline-block rounded-md bg-sky-500 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-400 transition-colors"
          >
            See it on your sector — €7 First Look
          </Link>
        </div>

        <div className="mt-10">
          <TrustConversionBlock
            dominant="firstlook"
            context="These are workflows. Run one on your real sector."
          />
        </div>
      </div>
    </>
  );
}
