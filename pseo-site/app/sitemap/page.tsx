import type { Metadata } from "next";
import Link from "next/link";
import { HreflangLinks } from "@/components/HreflangLinks";
import {
  getSiteDirectory,
  getSiteDirectoryLinkCount,
} from "@/lib/site-directory";

const PAGE_URL = "https://signals.gitdealflow.com/sitemap";

const LINK_COUNT = getSiteDirectoryLinkCount();

export const metadata: Metadata = {
  title: "Sitemap — Every Page | VC Deal Flow Signal",
  description: `The complete directory of VC Deal Flow Signal — ${LINK_COUNT}+ pages organized by section: sectors, signals, companies, funds, founders, answers, tools, research, and more.`,
  alternates: { canonical: "/sitemap" },
  openGraph: {
    title: "Sitemap — VC Deal Flow Signal",
    description: "The complete, human-readable directory of every page on the site.",
    type: "website",
    url: "/sitemap",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sitemap — VC Deal Flow Signal",
    description: "Every page on VC Deal Flow Signal, organized by section.",
  },
};

// Weekly cadence matches the underlying data refresh (getDataLastModified()).
export const revalidate = 604800;

export default function SitemapPage() {
  const sections = getSiteDirectory();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        url: PAGE_URL,
        name: "Sitemap — VC Deal Flow Signal",
        description: `The complete directory of every page on VC Deal Flow Signal (${LINK_COUNT}+ links across ${sections.length} sections).`,
        isPartOf: {
          "@type": "WebSite",
          name: "VC Deal Flow Signal",
          url: "https://signals.gitdealflow.com",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://signals.gitdealflow.com" },
          { "@type": "ListItem", position: 2, name: "Sitemap", item: PAGE_URL },
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Centered hero focal block */}
        <header className="text-center mb-14">
          <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-gray-300 transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">Sitemap</span>
          </nav>

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-100 mb-4 leading-tight tracking-tight">
            Sitemap
          </h1>
          <p className="text-sky-400 text-lg leading-relaxed mb-4 font-medium">
            Every page on VC Deal Flow Signal, in one place — {LINK_COUNT.toLocaleString("en-US")}+
            links across {sections.length} sections.
          </p>
          <p className="text-gray-400 text-base leading-relaxed max-w-2xl mx-auto">
            A human-readable directory of the whole site. Large programmatic
            families (per-startup profiles, stage/signal crossings, sector-by-city
            cells) link to their browse hub with a page count rather than listing
            every leaf. Looking for the machine-readable version? See{" "}
            <a
              href="/sitemap.xml"
              className="text-sky-400 hover:text-sky-300 underline underline-offset-2"
            >
              sitemap.xml
            </a>
            .
          </p>
        </header>

        {/* Jump-to table of contents — centered */}
        <nav
          aria-label="Sections"
          className="mb-16 flex flex-wrap justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-4"
        >
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-sm text-gray-300 hover:border-sky-500 hover:text-sky-400 transition-colors"
            >
              {s.title}
            </a>
          ))}
        </nav>

        <div className="space-y-14">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <div className="border-b border-slate-800 pb-3 mb-6">
                <h2 className="text-2xl font-bold text-gray-100 mb-1">
                  {section.title}
                </h2>
                <p className="text-gray-400 text-sm">{section.blurb}</p>
              </div>

              <div className="space-y-8">
                {section.groups.map((group) => (
                  <div key={group.heading}>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-sky-400 mb-1">
                      {group.heading}
                    </h3>
                    {group.note && (
                      <p className="text-gray-500 text-xs mb-3">{group.note}</p>
                    )}
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1.5 mt-2">
                      {group.links.map((l) => (
                        <li key={l.href} className="min-w-0">
                          <Link
                            href={l.href}
                            className="block truncate text-sm text-gray-300 hover:text-sky-400 transition-colors"
                            title={l.label}
                          >
                            {l.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-center">
          <h2 className="text-gray-100 font-semibold text-lg mb-2">
            Get the weekly engineering signal
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            One email a week — the startups whose GitHub activity is accelerating.
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
