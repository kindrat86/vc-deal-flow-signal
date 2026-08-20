"use client";

import { useState } from "react";

const SITE = "https://signals.gitdealflow.com";

interface WeeklyReportAmplificationProps {
  slug: string;
  title: string;
  date: string;
}

function quarterForDate(date: string): string {
  const parsed = new Date(`${date}T00:00:00Z`);
  const quarter = Math.floor(parsed.getUTCMonth() / 3) + 1;
  return `Q${quarter} ${parsed.getUTCFullYear()}`;
}

export default function WeeklyReportAmplification({
  slug,
  title,
  date,
}: WeeklyReportAmplificationProps) {
  const [copied, setCopied] = useState<"citation" | "embed" | null>(null);
  const sourceUrl = `${SITE}/blog/${slug}`;
  const period = quarterForDate(date);
  const citeText = `VC Deal Flow Signal (signals.gitdealflow.com), ${period} data. ${title}. ${sourceUrl}`;
  const embedCode = `<iframe src="${SITE}/embed/weekly" width="100%" height="560" frameborder="0" loading="lazy" title="Weekly engineering acceleration signals from VC Deal Flow Signal"></iframe>\n<p>Source: <a href="${sourceUrl}">${title}, VC Deal Flow Signal</a> · <a href="https://creativecommons.org/licenses/by/4.0/" rel="license">CC BY 4.0</a></p>`;
  const shareText = `This week’s engineering-acceleration findings: ${title}`;
  const shareHref = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(sourceUrl)}&via=sipiteno`;

  async function copy(value: string, kind: "citation" | "embed") {
    await navigator.clipboard.writeText(value);
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 2000);
  }

  return (
    <aside
      className="mt-10 rounded-xl border border-amber-500/40 bg-amber-950/25 p-5 sm:p-6"
      aria-label="Cite or embed this finding"
      data-weekly-report-amplification
    >
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-amber-300">
        Cite or embed this finding
      </p>
      <p className="mt-2 text-sm leading-relaxed text-gray-300">
        Reuse this report in a newsletter, research note, or blog post. It is licensed CC BY 4.0 with attribution.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => copy(citeText, "citation")}
          className="rounded-lg bg-amber-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition-colors hover:bg-amber-300"
        >
          {copied === "citation" ? "Citation copied" : "Copy citation"}
        </button>
        <a
          href={shareHref}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-amber-400/45 px-4 py-2.5 text-center text-sm font-semibold text-amber-200 transition-colors hover:border-amber-300 hover:text-amber-100"
        >
          Share on X
        </a>
      </div>

      <div className="mt-4 rounded-lg border border-slate-700 bg-slate-950/65 p-3">
        <p className="text-xs font-medium text-gray-300">Embed the live weekly leaderboard</p>
        <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-all text-[11px] leading-relaxed text-gray-400">
          {embedCode}
        </pre>
        <button
          type="button"
          onClick={() => copy(embedCode, "embed")}
          className="mt-3 rounded-md border border-slate-600 px-3 py-1.5 text-xs font-semibold text-gray-200 transition-colors hover:border-sky-400 hover:text-sky-300"
        >
          {copied === "embed" ? "Embed copied" : "Copy embed code"}
        </button>
      </div>
    </aside>
  );
}
