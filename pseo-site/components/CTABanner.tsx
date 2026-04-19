import Link from "next/link";

export default function CTABanner() {
  return (
    <div className="relative rounded-xl border border-slate-700 bg-slate-900 overflow-hidden">
      {/* Gradient border accent */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, #0ea5e9 40%, #6366f1 60%, transparent)",
        }}
      />
      <div className="px-6 py-8 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="max-w-xl">
            <h3 className="text-gray-100 font-semibold text-lg mb-2">
              See the full ranked list of 60+ startups across all sectors
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Get the free weekly engineering acceleration
              rankings, or unlock the full Dashboard for real-time tracking,
              sector filters, and founder contact data. Beta pricing: EUR 9.97
              per month.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="https://gitdealflow.com/#signup"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors"
            >
              Get the Report
            </Link>
            <Link
              href="https://gitdealflow.com/#pricing"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-600 hover:border-slate-500 text-gray-200 hover:text-white text-sm font-medium transition-colors"
            >
              Unlock the Dashboard
            </Link>
          </div>
        </div>
        <p className="text-gray-500 text-xs mt-5 pt-5 border-t border-slate-800">
          Want the signal while you browse Crunchbase?{" "}
          <a
            href="https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn"
            className="text-emerald-400 hover:text-emerald-300 font-medium"
            rel="noopener noreferrer"
            target="_blank"
          >
            Install the free Chrome extension &rarr;
          </a>
        </p>
      </div>
    </div>
  );
}
