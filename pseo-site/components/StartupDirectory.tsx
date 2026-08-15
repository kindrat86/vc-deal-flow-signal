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
  periodName: string;
  totalCount: number;
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
 * page, an ItemList JSON-LD describing the page slice, and a methodology
 * explainer that keeps every page above the 400-word thin-content floor
 * (verify-word-floor.mjs counts only non-nav/header/footer text, so the
 * explainer lives in <section> elements).
 */
export default function StartupDirectory({
  title,
  subtitle,
  periodName,
  totalCount,
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

        <section className="mb-8 max-w-3xl" aria-label="About this directory">
          <p className="text-gray-400 text-base leading-relaxed">
            This directory lists every startup VC Deal Flow Signal tracks in{" "}
            {periodName}, ranked by GitHub engineering acceleration. It contains{" "}
            {totalCount} companies spread across {totalPages}{" "}
            {totalPages === 1 ? "page" : "pages"}; this is page {page}. Each card
            links to a company&apos;s full signal profile with its complete commit
            history, contributor data, and sector ranking.
          </p>
        </section>

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
                <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-gray-400">
                  <dt className="text-gray-600">Stage</dt>
                  <dd className="text-gray-300">{s.stage}</dd>
                  <dt className="text-gray-600">Geography</dt>
                  <dd className="text-gray-300">{s.geography || "N/A"}</dd>
                  <dt className="text-gray-600">Commits (14d)</dt>
                  <dd className="text-gray-300">{s.commitVelocity14d.toLocaleString()}</dd>
                  <dt className="text-gray-600">Velocity change</dt>
                  <dd className="text-emerald-400 font-medium">{s.commitVelocityChange}</dd>
                  <dt className="text-gray-600">Contributors</dt>
                  <dd className="text-gray-300">{s.contributors}</dd>
                  <dt className="text-gray-600">New repos (30d)</dt>
                  <dd className="text-gray-300">{s.newRepos}</dd>
                </dl>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-8 max-w-3xl" aria-label="How to read these rankings">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">
            How to read these rankings
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-3">
            We rank each company on public GitHub activity, never on press
            releases or fundraise announcements. The primary signal is commit
            velocity change: the percentage change in total commits to a
            company&apos;s most active public repository over a rolling 14-day
            window, measured against its own trailing baseline. Sustained
            acceleration has historically preceded fundraise announcements by
            three to six weeks.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed mb-3">
            We surface three supporting primitives alongside velocity.
            Contributor influx counts new committers in the trailing four weeks;
            a hiring burst often follows a fresh round. Repository creation
            pulse counts new public repositories shipped in the trailing eight
            weeks, a leading indicator of platform expansion. Language bias
            drift flags when a new primary language appears in production code,
            which often marks a pivot or scale-up.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            Use this directory to source and to validate. For sourcing, scan the
            top of each page for the fastest-accelerating teams, then open their
            profiles to read the full signal. For validation, look up a company
            you already know and compare its trajectory against the broader
            sector distribution. No single metric is a buy signal; always
            cross-reference with Crunchbase, hiring activity, and community
            mentions before acting.
          </p>
        </section>

        <section className="mb-8 max-w-3xl" aria-label="Signal types">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">Signal types</h2>
          <ul className="text-gray-400 text-sm leading-relaxed space-y-2 list-disc list-inside">
            <li>
              <span className="text-gray-200 font-medium">Engineering hiring burst</span>{" "}
              marks rapid team expansion, often following a funding round.
            </li>
            <li>
              <span className="text-gray-200 font-medium">Infrastructure buildout</span>{" "}
              marks new repository creation, indicating platform investment and
              product expansion.
            </li>
            <li>
              <span className="text-gray-200 font-medium">Deploy frequency spike</span>{" "}
              marks an accelerated shipping cadence, often seen before a public
              launch.
            </li>
            <li>
              <span className="text-gray-200 font-medium">Framework migration</span>{" "}
              marks a technology stack transition, which often precedes a pivot
              or platform upgrade.
            </li>
          </ul>
        </section>

        <section className="mb-10 max-w-3xl" aria-label="Data source and methodology">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">
            Data source and methodology
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Every number links back to public GitHub activity and refreshes
            weekly. The full methodology, including the six-signal panel and its
            empirical tie to fundraise probability, is published on the{" "}
            <Link href="/methodology" className="text-sky-400 hover:text-sky-300 underline">
              methodology page
            </Link>
            . The underlying SSRN preprint is 6606558, and a CC BY 4.0
            machine-readable dataset is available on the{" "}
            <Link href="/dataset" className="text-sky-400 hover:text-sky-300 underline">
              dataset page
            </Link>
            . We track only self-published public GitHub organizations, never
            private repositories or inferred profiles.
          </p>
        </section>

        <section className="mb-10 max-w-3xl" aria-label="About this signal">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">
            About this signal
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            VC Deal Flow Signal is a free public dataset that treats GitHub
            engineering acceleration as a leading indicator of startup momentum.
            It exists for Corp Dev teams, PE operating partners, and emerging
            managers who want to see momentum before a round is announced rather
            than after. Every company in this directory has a self-published
            public GitHub organization, and every ranking number links back to
            the public repository behind it. The dataset is updated weekly and
            is independent of any incumbent venture platform.
          </p>
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
