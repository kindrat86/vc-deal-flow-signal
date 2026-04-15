import Link from "next/link";
import { getAllSectors, getCurrentPeriod } from "@/lib/data";

export default function NotFound() {
  const sectors = getAllSectors();
  const period = getCurrentPeriod();
  const activeSectors = sectors
    .filter((s) => s.periods[period.slug])
    .slice(0, 6);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <p className="text-sky-400 text-sm font-medium mb-3 uppercase tracking-wider">
        404
      </p>
      <h1 className="text-3xl font-bold text-gray-100 mb-4">
        Page not found
      </h1>
      <p className="text-gray-400 text-base mb-10 max-w-md mx-auto">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Try browsing our sector rankings instead.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
        {activeSectors.map((sector) => (
          <Link
            key={sector.slug}
            href={`/startups-to-watch/${sector.slug}-${period.slug}`}
            className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
          >
            <h2 className="text-gray-200 font-medium text-sm group-hover:text-sky-400 transition-colors">
              {sector.name}
            </h2>
          </Link>
        ))}
      </div>

      <div className="flex justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors"
        >
          All Sectors
        </Link>
        <Link
          href="/blog"
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 hover:border-slate-500 text-gray-300 text-sm font-medium transition-colors"
        >
          Read the Blog
        </Link>
      </div>
    </div>
  );
}
