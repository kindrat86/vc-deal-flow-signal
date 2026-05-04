import Link from "next/link";

export default function LaunchBanner() {
  return (
    <div className="bg-gradient-to-r from-sky-950 via-slate-950 to-emerald-950 border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs sm:text-sm">
        <span aria-hidden="true" className="text-amber-400">
          ★
        </span>
        <span className="text-gray-200">
          GitHub commit-velocity tracking, refreshed every Monday.
        </span>
        <Link
          href="https://gitdealflow.com/#signup"
          className="text-sky-400 hover:text-sky-300 font-medium underline decoration-dotted underline-offset-2"
        >
          Get the free Signal Report &rarr;
        </Link>
      </div>
    </div>
  );
}
