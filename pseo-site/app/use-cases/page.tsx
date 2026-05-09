import type { Metadata } from "next";
import Link from "next/link";
import { useCases } from "@/content/use-cases";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";

export const metadata: Metadata = {
  title: "Use Cases — Angels, VC Analysts, Fund of Funds",
  description:
    "How VC Deal Flow Signal is used by different investor personas — angel investors, VC analysts, fund of funds and LPs. Workflows, metrics, and persona-specific integrations.",
  // hreflang emitted via <HreflangLinks/> in JSX (single source of truth).
  alternates: {
    canonical: "/use-cases",
  },
};

export default function UseCasesIndex() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/use-cases#webpage",
        url: "https://signals.gitdealflow.com/use-cases",
        name: "Use Cases — VC Deal Flow Signal",
        description:
          "Persona-specific workflows for angel investors, VC analysts, and fund of funds / LPs.",
        inLanguage: "en-US",
        isAccessibleForFree: true,
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["[data-speakable]", "h1", "h2"],
        },
      },
      {
        "@type": "CollectionPage",
        name: "VC Deal Flow Signal Use Cases",
        description:
          "Persona-specific workflows for angel investors, VC analysts, and fund of funds / LPs.",
        url: "https://signals.gitdealflow.com/use-cases",
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
      },
      {
        "@type": "ItemList",
        itemListElement: useCases.map((u, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `https://signals.gitdealflow.com/use-cases/${u.slug}`,
          name: u.h1,
        })),
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
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/use-cases"
        languages={getHreflangLanguages("/use-cases")}
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
          <span className="text-gray-400">Use Cases</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          Use Cases
        </h1>
        <p className="text-gray-400 text-base leading-relaxed mb-10">
          Different investors use VC Deal Flow Signal differently. Pick the
          persona closest to your workflow for a detailed breakdown of the
          problem, the solution, and the weekly workflow.
        </p>

        <div className="space-y-6">
          {useCases.map((uc) => (
            <Link
              key={uc.slug}
              href={`/use-cases/${uc.slug}`}
              className="group block rounded-lg border border-slate-800 bg-slate-900 p-6 hover:border-slate-600 hover:bg-slate-800/60 transition-all"
            >
              <p className="text-xs font-medium text-sky-500 uppercase tracking-wider mb-2">
                For {uc.persona}s
              </p>
              <h2 className="text-gray-100 font-semibold text-lg mb-2 group-hover:text-sky-400 transition-colors">
                {uc.h1}
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                {uc.tagline}
              </p>
              <span className="mt-3 inline-block text-sky-500 text-xs font-medium group-hover:text-sky-400 transition-colors">
                Read workflow &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
