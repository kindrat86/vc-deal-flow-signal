import Link from "next/link";

export interface RelatedGroup {
  title: string;
  links: {
    href: string;
    label: string;
    subtitle?: string;
  }[];
}

interface RelatedLinksProps {
  groups: RelatedGroup[];
  heading?: string;
}

/**
 * Cross-linking block for pSEO pages. Renders up to N groups of related
 * links (other crossings, historical periods, adjacent sectors, etc.) to
 * strengthen internal PageRank + help readers pivot.
 */
export default function RelatedLinks({
  groups,
  heading = "Related views",
}: RelatedLinksProps) {
  const nonEmpty = groups.filter((g) => g.links.length > 0);
  if (nonEmpty.length === 0) return null;

  return (
    <section className="mb-10" aria-label={heading}>
      <h2 className="text-lg font-semibold text-gray-100 mb-4">{heading}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {nonEmpty.map((g) => (
          <div
            key={g.title}
            className="rounded-lg border border-slate-800 bg-slate-900 p-4"
          >
            <p className="text-xs font-medium text-sky-400 uppercase tracking-wider mb-3">
              {g.title}
            </p>
            <ul className="space-y-2">
              {g.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="group block text-sm text-gray-300 hover:text-sky-400 transition-colors min-h-[24px] py-1"
                  >
                    <span className="group-hover:underline">{l.label}</span>
                    {l.subtitle && (
                      <span className="block text-xs text-gray-400 mt-0.5">
                        {l.subtitle}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
