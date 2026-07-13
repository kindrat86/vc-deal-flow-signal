import Link from "next/link";
import type { Startup } from "@/lib/data";
import SignalBadge from "@/components/SignalBadge";
import { slugify } from "@/lib/slugify";

interface StartupTableProps {
  startups: Startup[];
  tableName?: string;
}

export default function StartupTable({ startups, tableName }: StartupTableProps) {
  const tableSchema = tableName
    ? {
        "@context": "https://schema.org",
        "@type": "Table",
        about: tableName,
        description: `Startup rankings by engineering acceleration — commit velocity, contributor growth, and signal classification. ${startups.length} startups ranked.`,
      }
    : null;

  return (
    <>
      {tableSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(tableSchema) }}
        />
      )}
      <p className="md:hidden text-gray-400 text-xs mb-2" aria-hidden="true">
        Swipe &rarr; for signal details
      </p>
      <div className="overflow-x-auto rounded-lg border border-slate-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/60">
            <th className="text-left text-gray-400 font-medium px-4 py-3 w-10">#</th>
            <th className="text-left text-gray-400 font-medium px-4 py-3 sticky left-0 bg-slate-900 z-10">Company</th>
            <th className="text-left text-gray-400 font-medium px-4 py-3">Stage</th>
            <th className="hidden md:table-cell text-left text-gray-400 font-medium px-4 py-3">Geo</th>
            <th className="text-right text-gray-400 font-medium px-4 py-3">Commits (14d)</th>
            <th className="text-right text-gray-400 font-medium px-4 py-3">Change</th>
            <th className="text-right text-gray-400 font-medium px-4 py-3">Contributors</th>
            <th className="hidden md:table-cell text-right text-gray-400 font-medium px-4 py-3">Contrib. Growth</th>
            <th className="hidden md:table-cell text-right text-gray-400 font-medium px-4 py-3">New Repos</th>
            <th className="text-left text-gray-400 font-medium px-4 py-3">Signal</th>
          </tr>
        </thead>
        <tbody>
          {startups.map((startup, index) => {
            const rank = index + 1;
            const isTop3 = rank <= 3;
            const rowBase = isTop3
              ? "bg-sky-500/5 border-l-2 border-l-sky-500"
              : "bg-transparent";
            const rowHover = "hover:bg-slate-800/40 transition-colors";
            return (
              <tr
                key={startup.name}
                className={`border-b border-slate-800/60 last:border-0 ${rowBase} ${rowHover}`}
              >
                <td className="px-4 py-3 text-gray-400 font-mono">{rank}</td>
                <td className="px-4 py-3 sticky left-0 bg-slate-900 z-10">
                  <Link
                    href={`/startup/${slugify(startup.name)}`}
                    className="block group/link"
                  >
                    <span className={`font-medium group-hover/link:text-sky-400 transition-colors ${isTop3 ? "text-gray-100" : "text-gray-200"}`}>
                      {startup.name}
                    </span>
                    <p className="text-gray-400 text-xs mt-0.5 max-w-[220px] sm:max-w-xs line-clamp-2">
                      {startup.description}
                    </p>
                    <span className="text-sky-600 text-xs font-medium group-hover/link:text-sky-400 transition-colors">
                      View signal profile &rarr;
                    </span>
                  </Link>
                  {(startup.websiteUrl || startup.linkedinUrl) && (
                    <div className="mt-1.5 flex items-center gap-5">
                      {startup.websiteUrl && (
                        <a
                          href={startup.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${startup.name} official website`}
                          title={startup.websiteUrl}
                          className="inline-flex p-2 -m-2 text-gray-400 hover:text-sky-400 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="2" y1="12" x2="22" y2="12" />
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                          </svg>
                        </a>
                      )}
                      {startup.linkedinUrl && (
                        <a
                          href={startup.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${startup.name} LinkedIn company page`}
                          title="LinkedIn company page"
                          className="inline-flex p-2 -m-2 text-gray-400 hover:text-sky-400 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-gray-400 bg-slate-800 px-2 py-0.5 rounded">
                    {startup.stage}
                  </span>
                </td>
                <td className="hidden md:table-cell px-4 py-3 text-gray-400 text-xs font-medium">
                  {startup.geography}
                </td>
                <td className="px-4 py-3 text-right font-mono text-gray-200">
                  {startup.commitVelocity14d.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right font-mono font-semibold text-emerald-400">
                  {startup.commitVelocityChange}
                </td>
                <td className="px-4 py-3 text-right font-mono text-gray-200">
                  {startup.contributors}
                </td>
                <td className="hidden md:table-cell px-4 py-3 text-right font-mono text-sky-400">
                  {startup.contributorGrowth}
                </td>
                <td className="hidden md:table-cell px-4 py-3 text-right font-mono text-gray-300">
                  {startup.newRepos}
                </td>
                <td className="px-4 py-3">
                  <SignalBadge type={startup.signalType} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-t border-slate-800">
        <span className="text-xs text-gray-400">
          Powered by{" "}
          <a
            href="https://gitdealflow.com"
            className="text-sky-500 hover:text-sky-400 transition-colors"
          >
            VC Deal Flow Signal
          </a>
          {" "}— real-time GitHub engineering data for investors
        </span>
        <span className="text-xs text-gray-400">
          Data from public GitHub API
        </span>
      </div>
    </div>
    </>
  );
}
