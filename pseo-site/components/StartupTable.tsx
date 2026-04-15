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
      <div className="overflow-x-auto rounded-lg border border-slate-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/60">
            <th className="text-left text-gray-400 font-medium px-4 py-3 w-10">#</th>
            <th className="text-left text-gray-400 font-medium px-4 py-3">Company</th>
            <th className="text-left text-gray-400 font-medium px-4 py-3">Stage</th>
            <th className="text-left text-gray-400 font-medium px-4 py-3">Geo</th>
            <th className="text-right text-gray-400 font-medium px-4 py-3">Commits (14d)</th>
            <th className="text-right text-gray-400 font-medium px-4 py-3">Change</th>
            <th className="text-right text-gray-400 font-medium px-4 py-3">Contributors</th>
            <th className="text-right text-gray-400 font-medium px-4 py-3">Contrib. Growth</th>
            <th className="text-right text-gray-400 font-medium px-4 py-3">New Repos</th>
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
                <td className="px-4 py-3 text-gray-500 font-mono">{rank}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/startup/${slugify(startup.name)}`}
                    className="block group/link"
                  >
                    <span className={`font-medium group-hover/link:text-sky-400 transition-colors ${isTop3 ? "text-gray-100" : "text-gray-200"}`}>
                      {startup.name}
                    </span>
                    <p className="text-gray-500 text-xs mt-0.5 max-w-xs">
                      {startup.description}
                    </p>
                    <span className="text-sky-600 text-[10px] font-medium group-hover/link:text-sky-400 transition-colors">
                      View signal profile &rarr;
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-gray-400 bg-slate-800 px-2 py-0.5 rounded">
                    {startup.stage}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs font-medium">
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
                <td className="px-4 py-3 text-right font-mono text-sky-400">
                  {startup.contributorGrowth}
                </td>
                <td className="px-4 py-3 text-right font-mono text-gray-300">
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
        <span className="text-[10px] text-gray-600">
          Powered by{" "}
          <a
            href="https://gitdealflow.com"
            className="text-sky-600 hover:text-sky-500 transition-colors"
          >
            VC Deal Flow Signal
          </a>
          {" "}— real-time GitHub engineering data for investors
        </span>
        <span className="text-[10px] text-gray-700">
          Data from public GitHub API
        </span>
      </div>
    </div>
    </>
  );
}
