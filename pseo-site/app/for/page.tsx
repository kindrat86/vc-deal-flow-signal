import type { Metadata } from "next";
import Link from "next/link";
import { PERSONAS } from "@/content/personas";
import { HreflangLinks } from "@/components/HreflangLinks";

export const metadata: Metadata = {
  title: "For — Persona Navigation Hubs",
  description: `${PERSONAS.length} buyer-persona pages mapping the engineering-signal panel to specific roles — Corp Dev, PE Operating Partners, Tech VPs, Emerging Managers, Founders, Researchers, Journalists.`,
  alternates: { canonical: "/for" },
  openGraph: {
    title: "For",
    description: "Persona navigation hubs for the engineering-signal panel.",
    type: "website",
    url: "/for",
  },
  twitter: {
    card: "summary_large_image",
    title: "For",
    description: "Persona navigation hubs.",
  },
};

export const revalidate = 604800;

const PAGE_URL = "https://signals.gitdealflow.com/for";

export default function ForHubPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        url: PAGE_URL,
        name: "For — Persona Navigation Hubs",
        description: `${PERSONAS.length} buyer-persona navigation hubs.`,
        isPartOf: {
          "@type": "WebSite",
          name: "VC Deal Flow Signal",
          url: "https://signals.gitdealflow.com",
        },
      },
      {
        "@type": "ItemList",
        itemListOrder: "Unordered",
        numberOfItems: PERSONAS.length,
        itemListElement: PERSONAS.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${PAGE_URL}/${p.slug}`,
          name: p.name,
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
            name: "For",
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
          <span className="text-gray-400">For</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          For
        </h1>
        <p className="text-sky-400 text-base leading-relaxed mb-6 font-medium">
          {PERSONAS.length} persona navigation hubs mapping the engineering-signal panel
          to specific buyer roles.
        </p>
        <p className="text-gray-400 text-base leading-relaxed mb-10">
          Each persona page covers the workflows, quick-start paths, and honest caveats
          for one Marcus 100 buyer role. Pick the page that matches your role and start
          from the recommended quick-start bookmarks.
        </p>

        <div className="space-y-4">
          {PERSONAS.map((p) => (
            <Link
              key={p.slug}
              href={`/for/${p.slug}`}
              className="group block rounded-lg border border-slate-800 bg-slate-900 p-5 hover:border-slate-600 transition-all"
            >
              <h2 className="text-gray-100 font-semibold text-lg group-hover:text-sky-400 transition-colors mb-1">
                {p.name}
              </h2>
              <p className="text-sky-400 text-xs font-medium mb-2">{p.tagline}</p>
              <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                {p.intro}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-center">
          <h2 className="text-gray-100 font-semibold text-lg mb-2">
            Get the weekly engineering signal
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Filtered to your role during onboarding.
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
