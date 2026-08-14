/**
 * StatCallout, renders key statistics in a visually distinct, AI-extractable format.
 * Designed for GEO: quotable, self-contained stat blocks that AI models prefer to cite.
 */

export interface StatItem {
  value: string;
  label: string;
  context?: string;
}

interface StatCalloutProps {
  stats: StatItem[];
  source?: string;
  sourceHref?: string;
}

export default function StatCallout({ stats, source, sourceHref }: StatCalloutProps) {
  return (
    <aside
      className="my-8 rounded-lg border border-slate-800 bg-slate-900/80 p-5"
      aria-label="Key statistics"
      role="note"
    >
      <p className="text-xs font-medium text-sky-400 uppercase tracking-wider mb-4">
        Key Data
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="text-2xl font-bold text-gray-100">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
            {stat.context && (
              <p className="text-xs text-gray-600 mt-0.5">{stat.context}</p>
            )}
          </div>
        ))}
      </div>
      {source && (
        <p className="mt-4 text-xs text-gray-600">
          According to{" "}
          {sourceHref ? (
            <a
              href={sourceHref}
              className="text-sky-600 hover:text-sky-500 transition-colors"
            >
              {source}
            </a>
          ) : (
            source
          )}
          .
        </p>
      )}
    </aside>
  );
}
