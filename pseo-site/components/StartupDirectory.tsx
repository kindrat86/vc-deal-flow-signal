import Link from "next/link";
import type { Startup } from "@/lib/data";
import SignalBadge from "@/components/SignalBadge";
import { slugify } from "@/lib/slugify";

const BASE_URL = "https://signals.gitdealflow.com";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface StartupDirectoryProps {
  title: string;
  subtitle: string;
  startups: Startup[];
  page: number;
  totalPages: number;
  basePath: string;
  breadcrumb: BreadcrumbItem[];
  listName: string;
}

function pageHref(basePath: string, page: number): string {
  return page === 1 ? basePath : `${basePath}/${page}`;
}

/**
 * Shared renderer for the paginated startup directory
 * (/startups/[sector]/[page] and /startups/region/[geo]/[page]).
 *
 * Emits rel=prev / rel=next pagination links (Google deprecated their
 * indexing use in 2019 but they remain the standard signal for Bing and other
 * crawlers, and give the long tail a bounded crawl path), a unique H1 per
 * page, and an ItemList JSON-LD describing the page slice.
 */
export default function StartupDirectory({
  title,
  subtitle,
  startups,
  page,
  totalPages,
  basePath,
  breadcrumb,
  listName,
}: StartupDirectoryProps) {
  const prevHref = page > 1 ? pageHref(basePath, page - 1) : null;
  const nextHref = page < totalPages ? pageHref(basePath, page + 1) : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    url: `${BASE_URL}${pageHref(basePath, page)}`,
    isPartOf: {
      "@type": "WebSite",
      name: "VC Deal Flow Signal",
      url: BASE_URL,
    },
    mainEntity: {
      "@type": "ItemList",
      name: listName,
      itemListOrder: "Unordered",
      numberOfItems: startups.length,
      itemListElement: startups.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: s.name,
        url: `${BASE_URL}/startup/${slugify(s.name)}`,
      })),
    },
  };

  return (
    <>
      {prevHref && <link rel="prev" href={`${BASE_URL}${prevHref}`} />}
      {nextHref && <link rel="next" href={`${BASE_URL}${nextHref}`} />}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          {breadcrumb.map((item, i) => (
            <span key={item.href}>
              {i > 0 && <span className="mx-2">/</span>}
              {i === breadcrumb.length - 1 ? (
                <span className="text-gray-400">{item.label}</span>
              ) : (
                <Link href={item.href} className="hover:text-gray-300 transition-colors">
                  {item.label}
                </Link>
              )}
            </span>
          ))}
        </nav>

        <header className="mb-8 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
            {title}
          </h1>
          <p className="text-gray-400 text-base leading-relaxed">{subtitle}</p>
        </header>

        <section className="mb-10" aria-label="Tracked startups">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {startups.map((s) => (
              <Link
                key={s.name}
                href={`/startup/${slugify(s.name)}`}
                className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h2 className="text-gray-100 font-medium text-sm group-hover:text-sky-400 transition-colors">
                    {s.name}
                  </h2>
                  <SignalBadge type={s.signalType} />
                </div>
                <p className="text-gray-500 text-xs line-clamp-2 mb-3">{s.description}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                  <span>{s.stage}</span>
                  {s.geography && <span>{s.geography}</span>}
                  <span className="text-emerald-400 font-medium">{s.commitVelocityChange}</span>
                  <span>{s.contributors} contributors</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {totalPages > 1 && (
          <nav className="mb-10 flex items-center justify-center gap-2" aria-label="Pagination">
            {prevHref ? (
              <Link
                href={prevHref}
                rel="prev"
                className="rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-gray-300 hover:text-sky-400 hover:border-slate-600 transition-colors"
              >
                Previous
              </Link>
            ) : (
              <span className="rounded-md border border-slate-800/50 bg-slate-900/40 px-3 py-1.5 text-xs text-gray-600">
                Previous
              </span>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              const href = pageHref(basePath, p);
              const isCurrent = p === page;
              return isCurrent ? (
                <span
                  key={p}
                  className="rounded-md bg-sky-500/20 border border-sky-500/50 px-3 py-1.5 text-xs text-sky-300 font-medium"
                >
                  {p}
                </span>
              ) : (
                <Link
                  key={p}
                  href={href}
                  className="rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-gray-300 hover:text-sky-400 hover:border-slate-600 transition-colors"
                >
                  {p}
                </Link>
              );
            })}
            {nextHref ? (
              <Link
                href={nextHref}
                rel="next"
                className="rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-gray-300 hover:text-sky-400 hover:border-slate-600 transition-colors"
              >
                Next
              </Link>
            ) : (
              <span className="rounded-md border border-slate-800/50 bg-slate-900/40 px-3 py-1.5 text-xs text-gray-600">
                Next
              </span>
            )}
          </nav>
        )}
      </div>
    </>
  );
}
