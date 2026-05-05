"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import type { DashboardStartup } from "@/app/dashboard/page";
import SignalBadge from "@/components/SignalBadge";
import { slugify } from "@/lib/slugify";

/** Current data period slug — update when rolling to a new quarter */
const CURRENT_PERIOD_SLUG = "q2-2026";

interface Props {
  startups: DashboardStartup[];
  sectorNames: string[];
  stages: string[];
  geos: string[];
  signalTypes: string[];
  tier: "dashboard" | "insider";
}

function useWatchlist() {
  const [watched, setWatched] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const saved = localStorage.getItem("gdf_watchlist");
      if (saved) setWatched(new Set(JSON.parse(saved)));
    } catch {}
  }, []);

  const toggle = useCallback((name: string) => {
    setWatched((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      localStorage.setItem("gdf_watchlist", JSON.stringify([...next]));
      return next;
    });
  }, []);

  return { watched, toggle };
}

function exportToCsv(data: DashboardStartup[], isInsider: boolean) {
  const headers = [
    "Rank", "Name", "Sector", "Stage", "Geography",
    "Commits (14d)", "Velocity Change", "Contributors", "Signal Type",
    ...(isInsider ? ["Funding", "Last Round", "Team Size", "Founded"] : []),
  ];

  const rows = data.map((s, i) => [
    String(i + 1),
    s.name,
    s.sectorName,
    s.stage,
    s.geography,
    String(s.commitVelocity14d),
    s.commitVelocityChange,
    String(s.contributors),
    s.signalType,
    ...(isInsider ? [
      s.fundingTotal ?? "—",
      s.lastRoundType ?? "—",
      s.teamSize ? String(s.teamSize) : "—",
      s.foundedYear ? String(s.foundedYear) : "—",
    ] : []),
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `vc-deal-flow-signal-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function DashboardFilters({
  startups,
  sectorNames,
  stages,
  geos,
  signalTypes,
  tier,
}: Props) {
  const isInsider = tier === "insider";
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("");
  const [stage, setStage] = useState("");
  const [geo, setGeo] = useState("");
  const [signal, setSignal] = useState("");
  const [sortBy, setSortBy] = useState<"velocity" | "contributors" | "commits">(
    "velocity"
  );
  const [watchedOnly, setWatchedOnly] = useState(false);
  const { watched, toggle } = useWatchlist();

  const filtered = useMemo(() => {
    let result = startups;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.sectorName.toLowerCase().includes(q)
      );
    }
    if (sector) result = result.filter((s) => s.sectorName === sector);
    if (stage) result = result.filter((s) => s.stage === stage);
    if (geo) result = result.filter((s) => s.geography === geo);
    if (signal) result = result.filter((s) => s.signalType === signal);
    if (watchedOnly) result = result.filter((s) => watched.has(s.name));

    return [...result].sort((a, b) => {
      if (sortBy === "velocity") {
        const aVal =
          parseInt(a.commitVelocityChange.replace(/[^0-9-]/g, ""), 10) || 0;
        const bVal =
          parseInt(b.commitVelocityChange.replace(/[^0-9-]/g, ""), 10) || 0;
        return bVal - aVal;
      }
      if (sortBy === "contributors") return b.contributors - a.contributors;
      return b.commitVelocity14d - a.commitVelocity14d;
    });
  }, [startups, search, sector, stage, geo, signal, sortBy, watchedOnly, watched]);

  const selectClass =
    "rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-sky-500";

  return (
    <>
      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3 items-end">
        <div className="w-full sm:flex-1 sm:min-w-[200px]">
          <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">
            Search
          </label>
          <input
            type="text"
            placeholder="Company name, sector..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-sky-500"
          />
        </div>
        <div>
          <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">
            Sector
          </label>
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className={selectClass}
          >
            <option value="">All sectors</option>
            {sectorNames.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">
            Stage
          </label>
          <select
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            className={selectClass}
          >
            <option value="">All stages</option>
            {stages.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">
            Geography
          </label>
          <select
            value={geo}
            onChange={(e) => setGeo(e.target.value)}
            className={selectClass}
          >
            <option value="">All geos</option>
            {geos.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">
            Signal
          </label>
          <select
            value={signal}
            onChange={(e) => setSignal(e.target.value)}
            className={selectClass}
          >
            <option value="">All signals</option>
            {signalTypes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">
            Sort by
          </label>
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "velocity" | "contributors" | "commits")
            }
            className={selectClass}
          >
            <option value="velocity">Velocity change</option>
            <option value="commits">Total commits</option>
            <option value="contributors">Contributors</option>
          </select>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <p className="text-gray-500 text-xs">
            Showing {filtered.length} of {startups.length} startups
            {sector || stage || geo || signal || search || watchedOnly ? " (filtered)" : ""}
          </p>
          {isInsider && (
            <button
              onClick={() => setWatchedOnly(!watchedOnly)}
              className={`text-xs px-3 py-1 rounded-full border transition ${
                watchedOnly
                  ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                  : "text-gray-500 border-slate-700 hover:border-slate-500"
              }`}
            >
              {watchedOnly
                ? `Watchlist (${watched.size})`
                : `Show watchlist (${watched.size})`}
            </button>
          )}
        </div>
        {isInsider && (
          <button
            onClick={() => exportToCsv(filtered, isInsider)}
            className="text-xs text-sky-500 hover:text-sky-400 transition flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/60">
              {isInsider && (
                <th className="text-center text-gray-400 font-medium px-2 py-3 w-8" title="Watchlist">
                  <svg className="w-3.5 h-3.5 mx-auto text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </th>
              )}
              <th className="text-left text-gray-400 font-medium px-4 py-3 w-10">
                #
              </th>
              <th className="text-left text-gray-400 font-medium px-4 py-3">
                Company
              </th>
              <th className="text-left text-gray-400 font-medium px-4 py-3">
                Sector
              </th>
              <th className="text-left text-gray-400 font-medium px-4 py-3">
                Stage
              </th>
              <th className="text-left text-gray-400 font-medium px-4 py-3">
                Geo
              </th>
              <th className="text-right text-gray-400 font-medium px-4 py-3">
                Commits (14d)
              </th>
              <th className="text-right text-gray-400 font-medium px-4 py-3">
                Change
              </th>
              <th className="text-right text-gray-400 font-medium px-4 py-3">
                Contributors
              </th>
              <th className="text-left text-gray-400 font-medium px-4 py-3">
                Signal
              </th>
              {isInsider && (
                <>
                  <th className="text-right text-gray-400 font-medium px-4 py-3 text-amber-400/70">
                    Funding
                  </th>
                  <th className="text-left text-gray-400 font-medium px-4 py-3 text-amber-400/70">
                    Last Round
                  </th>
                  <th className="text-right text-gray-400 font-medium px-4 py-3 text-amber-400/70">
                    Team
                  </th>
                  <th className="text-right text-gray-400 font-medium px-4 py-3 text-amber-400/70">
                    Founded
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.map((startup, index) => {
              const rank = index + 1;
              const isTop3 = rank <= 3;
              const isWatched = watched.has(startup.name);
              const rowBase = isWatched
                ? "bg-amber-500/5 border-l-2 border-l-amber-500/50"
                : isTop3
                  ? "bg-sky-500/5 border-l-2 border-l-sky-500"
                  : "bg-transparent";
              return (
                <tr
                  key={`${startup.name}-${startup.sectorSlug}`}
                  className={`border-b border-slate-800/60 last:border-0 ${rowBase} hover:bg-slate-800/40 transition-colors`}
                >
                  {isInsider && (
                    <td className="px-2 py-3 text-center">
                      <button
                        onClick={() => toggle(startup.name)}
                        className={`transition ${
                          isWatched ? "text-amber-400" : "text-gray-700 hover:text-gray-500"
                        }`}
                        title={isWatched ? "Remove from watchlist" : "Add to watchlist"}
                      >
                        <svg className="w-4 h-4" fill={isWatched ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </button>
                    </td>
                  )}
                  <td className="px-4 py-3 text-gray-500 font-mono">
                    {rank}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/startup/${slugify(startup.name)}`}
                      className={`font-medium hover:text-sky-400 transition-colors ${isTop3 ? "text-gray-100" : "text-gray-200"}`}
                    >
                      {startup.name}
                    </Link>
                    <p className="text-gray-500 text-xs mt-0.5 max-w-xs truncate">
                      {startup.description}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/startups-to-watch/${startup.sectorSlug}-${CURRENT_PERIOD_SLUG}`}
                      className="text-xs text-sky-500 hover:text-sky-400 transition-colors"
                    >
                      {startup.sectorName}
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
                  <td className="px-4 py-3">
                    <SignalBadge type={startup.signalType} />
                  </td>
                  {isInsider && (
                    <>
                      <td className="px-4 py-3 text-right font-mono text-amber-300/80 text-xs">
                        {startup.fundingTotal ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-xs text-amber-300/60">
                        {startup.lastRoundType ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-amber-300/80 text-xs">
                        {startup.teamSize ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-amber-300/80 text-xs">
                        {startup.foundedYear ?? "—"}
                      </td>
                    </>
                  )}
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
            {" "}&mdash; real-time GitHub engineering data for investors
          </span>
          <span className="text-[10px] text-gray-700">
            Data from public GitHub API
          </span>
        </div>
      </div>
    </>
  );
}
