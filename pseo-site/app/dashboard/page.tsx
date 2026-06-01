import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  getAllSectors,
  getCurrentPeriod,
  getSortedStartups,
  getDataLastModified,
  enrichStartup,
} from "@/lib/data";
import type { Startup } from "@/lib/data";
import { getSession } from "@/lib/auth";
import DashboardFilters from "@/components/DashboardFilters";
import LogoutButton from "./LogoutButton";

export const metadata: Metadata = {
  title: "Dashboard — Full Startup Rankings | VC Deal Flow Signal",
  description:
    "Browse and filter 60+ startups ranked by GitHub engineering acceleration. Filter by sector, stage, geography, and signal type. Updated weekly.",
  alternates: {
    canonical: "/dashboard",
  },
  robots: {
    index: false,
  },
};

export interface DashboardStartup extends Startup {
  sectorName: string;
  sectorSlug: string;
}

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }
  const sectors = getAllSectors();
  const period = getCurrentPeriod();
  const lastModified = getDataLastModified();

  const allStartups: DashboardStartup[] = [];

  const isInsider = session.tier === "insider";

  for (const sector of sectors) {
    const snapshot = sector.periods[period.slug];
    if (!snapshot) continue;
    for (const startup of snapshot.startups) {
      const enriched = isInsider ? enrichStartup(startup) : startup;
      allStartups.push({
        ...enriched,
        sectorName: sector.name,
        sectorSlug: sector.slug,
      });
    }
  }

  const sorted = getSortedStartups(allStartups) as DashboardStartup[];

  const sectorNames = [...new Set(sorted.map((s) => s.sectorName))].sort();
  const stages = [...new Set(sorted.map((s) => s.stage))].sort();
  const geos = [...new Set(sorted.map((s) => s.geography))].sort();
  const signalTypes = [...new Set(sorted.map((s) => s.signalType))].sort();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Session bar */}
      <div className="mb-6 flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-2.5">
        <div className="flex items-center gap-3 text-sm">
          <span className="text-gray-400">Logged in as</span>
          <span className="text-gray-200">{session.email}</span>
          <span
            className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
              session.tier === "insider"
                ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                : "bg-sky-500/15 text-sky-300 border border-sky-500/30"
            }`}
          >
            {session.tier === "insider" ? "Insider" : "Pro"}
          </span>
        </div>
        <div className="flex items-center gap-4">
          {isInsider && (
            <>
              <Link href="/dashboard/watchlist" className="text-gray-400 hover:text-gray-300 text-xs transition">
                Watchlist
              </Link>
              <Link href="/dashboard/api-keys" className="text-gray-400 hover:text-gray-300 text-xs transition">
                API Keys
              </Link>
            </>
          )}
          <LogoutButton />
        </div>
      </div>

      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-gray-300 transition-colors">
          All Sectors
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-400">Dashboard</span>
      </nav>

      {/* Header */}
      <header className="mb-8 max-w-3xl">
        <div className="flex items-center gap-3 mb-2">
          <p className="text-sky-400 text-sm font-medium uppercase tracking-wider">
            {period.name}
          </p>
          <span className="inline-block rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30 px-2 py-0.5 text-[10px] font-semibold uppercase">
            Early Access
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          Startup Signal Dashboard
        </h1>
        <p className="text-gray-400 text-base leading-relaxed">
          {sorted.length} startups across {sectorNames.length} sectors ranked by
          GitHub engineering acceleration. Filter by sector, stage, geography, or
          signal type. Data refreshed weekly from the GitHub API.
        </p>
        <p className="text-gray-600 text-xs mt-3">
          Last updated: {lastModified.toISOString().slice(0, 10)}
        </p>
      </header>

      {/* Upgrade nudge (Dashboard tier only) */}
      {!isInsider && (
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg border border-amber-500/30 bg-amber-950/15 px-4 py-3">
          <p className="text-sm text-gray-300 leading-relaxed">
            <span className="text-amber-300 font-semibold">Get this list 24 hours earlier</span>
            {" "}+ the private investor room. Same ranked list, more lead time — €97/mo.
          </p>
          <Link
            href="/insider"
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 hover:text-amber-100 font-semibold text-sm px-4 py-2 transition-colors"
          >
            Insider Circle <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}

      {/* Client-side filter + table */}
      <DashboardFilters
        startups={sorted}
        sectorNames={sectorNames}
        stages={stages}
        geos={geos}
        signalTypes={signalTypes}
        tier={session.tier}
      />
    </div>
  );
}
