"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Dilution stack calculator.
 *
 * Models up to 3 post-money SAFEs (YC 2018+) plus a priced Series A
 * with an option pool refresh. Simplifying assumptions called out in
 * the FAQ:
 *   - Each SAFE converts at its post-money cap (cap-binding case).
 *     Discount handling is omitted in v1 to keep the math legible —
 *     the SAFE calculator at /tools/safe-calculator handles cap-vs-
 *     discount conversion for a single SAFE.
 *   - Option pool target is post-round. v1 dilutes the entire pre-Series-A
 *     cap table evenly (founders + all SAFEs) — the YC standard "option
 *     pool comes out of pre-money" is an approximation; precise modeling
 *     requires the iterative SAFE-and-pool waterfall.
 *
 * Math:
 *   safe_pct_i = safe_amount_i / safe_cap_i        (post-money cap)
 *   safe_total = sum(safe_pct_i)
 *   series_post = pre + invest
 *   series_pct = invest / series_post
 *   pool_pct = pool_target_pct / 100
 *   founders_pct = 1 - safe_total - series_pct - pool_pct
 *
 * Founders' final % drives the band color. Negative = over-dilution
 * warning (the inputs imply more than 100% is allocated).
 *
 * Educational tool. Not legal or tax advice.
 */

const MAX_SAFES = 3;

interface SafeRow {
  amount: number;
  cap: number;
}

interface SeriesA {
  pre: number;
  invest: number;
  pool: number; // target % post-round
}

interface Inputs {
  safes: SafeRow[]; // length MAX_SAFES
  series: SeriesA;
}

const DEFAULTS: Inputs = {
  safes: [
    { amount: 500_000, cap: 5_000_000 },
    { amount: 1_000_000, cap: 10_000_000 },
    { amount: 0, cap: 0 },
  ],
  series: { pre: 20_000_000, invest: 5_000_000, pool: 10 },
};

function parseNumber(value: string | null, fallback: number): number {
  if (!value) return fallback;
  const n = Number(value.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

function formatMoney(n: number): string {
  if (!Number.isFinite(n) || n === 0) return "$0";
  if (Math.abs(n) >= 1_000_000) {
    return `$${(n / 1_000_000).toLocaleString("en-US", { maximumFractionDigits: 2 })}M`;
  }
  if (Math.abs(n) >= 1_000) {
    return `$${(n / 1_000).toLocaleString("en-US", { maximumFractionDigits: 1 })}k`;
  }
  return `$${n.toLocaleString("en-US")}`;
}

function formatPct(n: number): string {
  if (!Number.isFinite(n)) return "n/a";
  if (n <= 0) return "0%";
  if (n < 0.01) return "<0.01%";
  return `${(n * 100).toFixed(2)}%`;
}

function formatPctSigned(n: number): string {
  if (!Number.isFinite(n)) return "n/a";
  if (n < 0) return `${(n * 100).toFixed(2)}%`;
  if (n < 0.01 && n > 0) return "<0.01%";
  return `${(n * 100).toFixed(2)}%`;
}

interface CapTableRow {
  holder: string;
  pct: number;
  amount?: number;
}

interface ComputedResult {
  capTable: CapTableRow[];
  totalAllocated: number;
  foundersPct: number;
  seriesPostMoney: number;
  band:
    | "excellent"
    | "healthy"
    | "diluted"
    | "very-diluted"
    | "over-diluted";
  bandLabel: string;
}

function computeDilution(inputs: Inputs): ComputedResult {
  const validSafes = inputs.safes
    .map((s, i) => ({ ...s, index: i }))
    .filter((s) => s.amount > 0 && s.cap > 0);

  const safeRows = validSafes.map((s) => ({
    holder: `SAFE ${s.index + 1} (${formatMoney(s.amount)} on ${formatMoney(s.cap)} cap)`,
    pct: s.amount / s.cap,
    amount: s.amount,
  }));

  const safeTotal = safeRows.reduce((acc, r) => acc + r.pct, 0);

  const seriesPost =
    Math.max(inputs.series.pre, 0) + Math.max(inputs.series.invest, 0);
  const seriesPct =
    seriesPost > 0 ? Math.max(inputs.series.invest, 0) / seriesPost : 0;
  const poolPct = Math.min(Math.max(inputs.series.pool, 0), 100) / 100;
  const foundersPct = 1 - safeTotal - seriesPct - poolPct;
  const totalAllocated = safeTotal + seriesPct + poolPct + Math.max(foundersPct, 0);

  const capTable: CapTableRow[] = [
    { holder: "Founders (common)", pct: foundersPct },
    ...safeRows,
  ];
  if (seriesPct > 0) {
    capTable.push({
      holder: `Series A (${formatMoney(inputs.series.invest)} @ ${formatMoney(seriesPost)} post)`,
      pct: seriesPct,
      amount: inputs.series.invest,
    });
  }
  if (poolPct > 0) {
    capTable.push({
      holder: "Option pool (target post-round)",
      pct: poolPct,
    });
  }

  let band: ComputedResult["band"];
  let bandLabel: string;

  if (foundersPct < 0) {
    band = "over-diluted";
    bandLabel =
      "Over-diluted — inputs imply more than 100% allocated. Check cap sizes, SAFE amounts, and option pool target.";
  } else if (foundersPct >= 0.5) {
    band = "excellent";
    bandLabel = `Excellent — founders retain ${formatPct(foundersPct)} after Series A.`;
  } else if (foundersPct >= 0.3) {
    band = "healthy";
    bandLabel = `Healthy — typical post-Series-A position with ${formatPct(foundersPct)} founder ownership.`;
  } else if (foundersPct >= 0.15) {
    band = "diluted";
    bandLabel = `Diluted — ${formatPct(foundersPct)} is on the low end for post-Series-A founders.`;
  } else {
    band = "very-diluted";
    bandLabel = `Very diluted — ${formatPct(foundersPct)} founder ownership leaves little room for Series B+ dilution.`;
  }

  return {
    capTable,
    totalAllocated,
    foundersPct,
    seriesPostMoney: seriesPost,
    band,
    bandLabel,
  };
}

const BAND_COLOR: Record<ComputedResult["band"], string> = {
  excellent: "border-emerald-700/50 bg-emerald-950/30 text-emerald-200",
  healthy: "border-sky-700/50 bg-sky-950/30 text-sky-200",
  diluted: "border-amber-700/50 bg-amber-950/30 text-amber-200",
  "very-diluted": "border-orange-700/50 bg-orange-950/30 text-orange-200",
  "over-diluted": "border-red-700/50 bg-red-950/30 text-red-200",
};

const ROW_BAR_COLOR: Record<string, string> = {
  Founders: "bg-sky-500/70",
  SAFE: "bg-purple-500/70",
  "Series A": "bg-emerald-500/70",
  "Option pool": "bg-amber-500/70",
};

function barColor(holder: string): string {
  if (holder.startsWith("Founders")) return ROW_BAR_COLOR.Founders;
  if (holder.startsWith("SAFE")) return ROW_BAR_COLOR.SAFE;
  if (holder.startsWith("Series A")) return ROW_BAR_COLOR["Series A"];
  if (holder.startsWith("Option pool")) return ROW_BAR_COLOR["Option pool"];
  return "bg-slate-500/70";
}

export function DilutionStackCalculator() {
  const router = useRouter();
  const params = useSearchParams();

  const [inputs, setInputs] = useState<Inputs>(() => {
    const safes = Array.from({ length: MAX_SAFES }, (_, i) => ({
      amount: parseNumber(
        params.get(`s${i + 1}a`),
        DEFAULTS.safes[i]?.amount ?? 0,
      ),
      cap: parseNumber(
        params.get(`s${i + 1}c`),
        DEFAULTS.safes[i]?.cap ?? 0,
      ),
    }));
    return {
      safes,
      series: {
        pre: parseNumber(params.get("pre"), DEFAULTS.series.pre),
        invest: parseNumber(params.get("invest"), DEFAULTS.series.invest),
        pool: parseNumber(params.get("pool"), DEFAULTS.series.pool),
      },
    };
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      const q = new URLSearchParams();
      inputs.safes.forEach((s, i) => {
        q.set(`s${i + 1}a`, String(s.amount));
        q.set(`s${i + 1}c`, String(s.cap));
      });
      q.set("pre", String(inputs.series.pre));
      q.set("invest", String(inputs.series.invest));
      q.set("pool", String(inputs.series.pool));
      router.replace(`?${q.toString()}`, { scroll: false });
    }, 250);
    return () => clearTimeout(timer);
  }, [inputs, router]);

  const result = useMemo(() => computeDilution(inputs), [inputs]);

  const [copied, setCopied] = useState(false);
  const copyShareUrl = () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const updateSafe = (idx: number, field: "amount" | "cap", value: number) => {
    setInputs((s) => {
      const safes = s.safes.map((row, i) =>
        i === idx ? { ...row, [field]: value } : row,
      );
      return { ...s, safes };
    });
  };

  const updateSeries = (field: keyof SeriesA, value: number) => {
    setInputs((s) => ({ ...s, series: { ...s.series, [field]: value } }));
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-100 mb-4">SAFEs</h2>
          <p className="text-xs text-gray-500 leading-relaxed mb-4">
            Up to {MAX_SAFES} stacked post-money SAFEs. Each converts at its
            own cap. Leave unused rows at 0.
          </p>
          <div className="space-y-3">
            {inputs.safes.map((s, i) => (
              <div
                key={i}
                className="grid grid-cols-2 gap-3 rounded-lg border border-slate-800 bg-slate-950/40 p-3"
              >
                <MoneyField
                  label={`SAFE ${i + 1} amount`}
                  value={s.amount}
                  onChange={(v) => updateSafe(i, "amount", v)}
                  step={50_000}
                />
                <MoneyField
                  label="Post-money cap"
                  value={s.cap}
                  onChange={(v) => updateSafe(i, "cap", v)}
                  step={500_000}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Series A
          </h2>
          <p className="text-xs text-gray-500 leading-relaxed mb-4">
            The priced round all SAFEs convert into. Option pool refresh
            target is taken from the post-round cap table.
          </p>
          <div className="space-y-4">
            <MoneyField
              label="Pre-money valuation"
              value={inputs.series.pre}
              onChange={(v) => updateSeries("pre", v)}
              step={1_000_000}
            />
            <MoneyField
              label="Investment"
              value={inputs.series.invest}
              onChange={(v) => updateSeries("invest", v)}
              step={500_000}
            />
            <PercentField
              label="Option pool target (post-round)"
              value={inputs.series.pool}
              onChange={(v) => updateSeries("pool", v)}
              step={0.5}
              hint="Investors typically push for 10-15% post-round. Lower means more dilution headroom for future rounds."
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className={`rounded-lg border p-5 ${BAND_COLOR[result.band]}`}>
          <p className="text-xs uppercase tracking-wider font-medium opacity-80 mb-1">
            Founders' final ownership
          </p>
          <p className="text-3xl font-semibold mb-1">
            {formatPctSigned(result.foundersPct)}
          </p>
          <p className="text-sm opacity-90">{result.bandLabel}</p>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
            Cap table at close
          </h3>
          <div className="space-y-2">
            {result.capTable.map((row) => (
              <div
                key={row.holder}
                className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/60 p-3"
              >
                <div className="flex-1 text-sm text-gray-200 font-medium truncate">
                  {row.holder}
                </div>
                <div className="flex-[2] h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${barColor(row.holder)}`}
                    style={{
                      width: `${Math.max(0, Math.min(100, row.pct * 100))}%`,
                    }}
                  />
                </div>
                <div className="w-20 text-right text-sm font-semibold text-gray-100 tabular-nums">
                  {formatPctSigned(row.pct)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-slate-800 bg-slate-950/60 p-5 text-sm text-gray-400 space-y-2">
        <p>
          <span className="text-gray-300 font-medium">v1 assumptions:</span>{" "}
          each SAFE converts at its post-money cap (cap-binding). Discount
          handling omitted — for cap-vs-discount math on a single SAFE see
          the dedicated{" "}
          <a
            href="/tools/safe-calculator"
            className="text-sky-400 hover:text-sky-300"
          >
            SAFE calculator
          </a>
          . Option pool dilutes the pre-Series-A cap table evenly. Real
          pre-money pool refresh is iterative — use this for back-of-envelope,
          confirm with your lawyer or finance lead before signing term sheets.
        </p>
        <p>
          <span className="text-gray-300 font-medium">Reading the bands:</span>{" "}
          ≥50% founders is exceptional retention. 30-50% is the typical
          post-Series-A target. 15-30% is dilution-heavy. Below 15% leaves
          little room for Series B+ dilution. Negative means the inputs imply
          over-allocation — check that SAFE caps + Series A + option pool
          don't sum past 100%.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={copyShareUrl}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors"
        >
          {copied ? "Link copied" : "Copy share link"}
        </button>
        <p className="text-xs text-gray-500">
          The URL contains every SAFE row + the Series A — drop into a board
          deck or co-founder conversation without retyping.
        </p>
      </div>

      <p className="mt-6 text-xs text-gray-500 leading-relaxed">
        Educational tool. Real dilution math depends on the precise SAFE
        documents (post-money vs pre-money, MFN, pro-rata, side letters),
        the actual option pool waterfall, and any anti-dilution provisions.
        Not legal or tax advice — talk to your lawyer.
      </p>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  hint?: string;
  step?: number;
}

function MoneyField({ label, value, onChange, hint, step = 1000 }: FieldProps) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1.5">
        {label}
      </span>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
          $
        </span>
        <input
          type="number"
          inputMode="decimal"
          min={0}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="w-full rounded-lg border border-slate-700 bg-slate-950/80 pl-7 pr-3 py-2.5 text-gray-100 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
        />
      </div>
      {hint ? <p className="text-xs text-gray-500 mt-1.5">{hint}</p> : null}
    </label>
  );
}

function PercentField({ label, value, onChange, hint, step = 1 }: FieldProps) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1.5">
        {label}
      </span>
      <div className="relative">
        <input
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="w-full rounded-lg border border-slate-700 bg-slate-950/80 pl-3 pr-8 py-2.5 text-gray-100 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
          %
        </span>
      </div>
      {hint ? <p className="text-xs text-gray-500 mt-1.5">{hint}</p> : null}
    </label>
  );
}
