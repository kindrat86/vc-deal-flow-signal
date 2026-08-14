/**
 * FreshnessWatermark, visible "Last verified: YYYY-MM-DD" line on pSEO pages.
 *
 * Why: Google's freshness algorithm reads <time> elements and visible date
 * mentions. Our /.well-known/freshness.json carries cadence metadata for AI
 * agents, but the *rendered HTML body* of pSEO pages had no per-page freshness
 * watermark, which means classic crawlers had no on-page signal that the
 * data is current. This component fixes that gap.
 *
 * Single source of truth: getDataLastModified() (from @/lib/data) reads the
 * mtime of data/startups.json, with a 2024-01-01 floor to avoid Vercel's
 * 2018-mtime quirk. Pass an explicit `date` to override (e.g. for non-startup
 * surfaces that have their own data file).
 *
 * Variants:
 *  - "compact", single line, used inline in headers / metadata strips.
 *  - "full"   , labelled box with cadence note, used at section bottoms.
 */
import { getDataLastModified } from "@/lib/data";

export interface FreshnessWatermarkProps {
  /** Override the last-verified date. Defaults to startups.json mtime. */
  date?: Date;
  /** Surface label (e.g. "Sector data", "Signal panel"). Default: "Data". */
  surface?: string;
  /** Visual variant. */
  variant?: "compact" | "full";
  /** Refresh cadence note for "full" variant. Default: weekly. */
  cadence?: string;
  className?: string;
}

export default function FreshnessWatermark({
  date,
  surface = "Data",
  variant = "compact",
  cadence = "Refreshed weekly (Mondays ~09:00 UTC).",
  className = "",
}: FreshnessWatermarkProps) {
  const d = date ?? getDataLastModified();
  const iso = d.toISOString();
  const day = iso.slice(0, 10);

  if (variant === "full") {
    return (
      <aside
        className={`mt-6 rounded-md border border-slate-800 bg-slate-900/60 p-3 text-xs text-gray-400 ${className}`}
        aria-label="Freshness watermark"
      >
        <p>
          <strong className="text-gray-300">{surface} last verified:</strong>{" "}
          <time dateTime={iso}>{day}</time>. {cadence}{" "}
          <a
            href="/.well-known/freshness.json"
            className="text-sky-400 hover:underline"
          >
            Cadence manifest
          </a>
          .
        </p>
      </aside>
    );
  }

  return (
    <p
      className={`text-xs text-gray-500 ${className}`}
      aria-label="Freshness watermark"
    >
      {surface} last verified: <time dateTime={iso}>{day}</time>
    </p>
  );
}
