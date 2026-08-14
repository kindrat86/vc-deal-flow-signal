"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * SaaS magic number calculator.
 *
 *   magic_number = (current_quarter_arr - prior_quarter_arr) × 4
 *                  / quarterly_sales_marketing_spend
 *
 * The "× 4" annualizes the quarterly net-new-ARR delta so the ratio
 * compares full-year ARR added against the quarterly S&M spend.
 *
 * Bands (Bessemer / OpenView consensus, broadly adopted):
 *   > 1.5   Exceptional, invest more aggressively
 *   1.0-1.5 Good, continue investing
 *   0.75-1  OK, hold pace, watch trajectory
 *   < 0.75  Bad, cut spend and figure out why
 *
 * Undefined when S&M spend is zero (you can't measure efficiency on
 * zero input).
 *
 * Educational tool. Not financial planning advice.
 */

interface Inputs {
  priorQuarterArr: number;
  currentQuarterArr: number;
  quarterlySmSpend: number;
}

const DEFAULTS: Inputs = {
  priorQuarterArr: 2_000_000,
  currentQuarterArr: 2_500_000,
  quarterlySmSpend: 1_000_000,
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

function formatMultiple(n: number): string {
  if (!Number.isFinite(n)) return "n/a";
  if (n < 0) return n.toFixed(2);
  if (n >= 100) return ">99";
  return n.toFixed(2);
}

interface ComputedResult {
  netNewArr: number;
  annualizedNetNewArr: number;
  magicNumber: number;
  band: "exceptional" | "good" | "ok" | "bad" | "negative" | "undefined";
  bandLabel: string;
}

function computeMagicNumber(inputs: Inputs): ComputedResult {
  const prior = Math.max(inputs.priorQuarterArr, 0);
  const curr = Math.max(inputs.currentQuarterArr, 0);
  const spend = Math.max(inputs.quarterlySmSpend, 0);

  const netNewArr = curr - prior;
  const annualizedNetNewArr = netNewArr * 4;

  if (spend === 0) {
    return {
      netNewArr,
      annualizedNetNewArr,
      magicNumber: Number.NaN,
      band: "undefined",
      bandLabel:
        "Magic number is undefined when S&M spend is zero, there is no input to be efficient with.",
    };
  }

  const magicNumber = annualizedNetNewArr / spend;

  if (magicNumber < 0) {
    return {
      netNewArr,
      annualizedNetNewArr,
      magicNumber,
      band: "negative",
      bandLabel:
        "Negative magic number, ARR contracted while S&M spent. Spend is destroying value.",
    };
  }

  let band: ComputedResult["band"];
  let bandLabel: string;

  if (magicNumber > 1.5) {
    band = "exceptional";
    bandLabel = "Exceptional, invest more aggressively.";
  } else if (magicNumber >= 1.0) {
    band = "good";
    bandLabel = "Good, continue investing at this pace.";
  } else if (magicNumber >= 0.75) {
    band = "ok";
    bandLabel = "OK, hold pace, watch trajectory.";
  } else {
    band = "bad";
    bandLabel =
      "Bad, cut spend and find the bottleneck before investing more.";
  }

  return { netNewArr, annualizedNetNewArr, magicNumber, band, bandLabel };
}

const BAND_COLOR: Record<ComputedResult["band"], string> = {
  exceptional: "border-emerald-700/50 bg-emerald-950/30 text-emerald-200",
  good: "border-sky-700/50 bg-sky-950/30 text-sky-200",
  ok: "border-amber-700/50 bg-amber-950/30 text-amber-200",
  bad: "border-red-700/50 bg-red-950/30 text-red-200",
  negative: "border-red-700/50 bg-red-950/30 text-red-200",
  undefined: "border-slate-700 bg-slate-900/60 text-slate-300",
};

export function MagicNumberCalculator() {
  const router = useRouter();
  const params = useSearchParams();

  const [inputs, setInputs] = useState<Inputs>(() => ({
    priorQuarterArr: parseNumber(params.get("prior"), DEFAULTS.priorQuarterArr),
    currentQuarterArr: parseNumber(
      params.get("current"),
      DEFAULTS.currentQuarterArr,
    ),
    quarterlySmSpend: parseNumber(
      params.get("spend"),
      DEFAULTS.quarterlySmSpend,
    ),
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      const q = new URLSearchParams();
      q.set("prior", String(inputs.priorQuarterArr));
      q.set("current", String(inputs.currentQuarterArr));
      q.set("spend", String(inputs.quarterlySmSpend));
      router.replace(`?${q.toString()}`, { scroll: false });
    }, 250);
    return () => clearTimeout(timer);
  }, [inputs, router]);

  const result = useMemo(() => computeMagicNumber(inputs), [inputs]);

  const [copied, setCopied] = useState(false);
  const copyShareUrl = () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-100 mb-4">ARR</h2>
          <div className="space-y-4">
            <MoneyField
              label="Prior quarter ARR"
              value={inputs.priorQuarterArr}
              onChange={(v) =>
                setInputs((s) => ({ ...s, priorQuarterArr: v }))
              }
              hint="ARR at the END of the previous quarter."
            />
            <MoneyField
              label="Current quarter ARR"
              value={inputs.currentQuarterArr}
              onChange={(v) =>
                setInputs((s) => ({ ...s, currentQuarterArr: v }))
              }
              hint="ARR at the END of the current quarter."
            />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            S&amp;M spend
          </h2>
          <div className="space-y-4">
            <MoneyField
              label="Quarterly S&M spend"
              value={inputs.quarterlySmSpend}
              onChange={(v) =>
                setInputs((s) => ({ ...s, quarterlySmSpend: v }))
              }
              hint="Total sales + marketing spend across the current quarter."
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className={`rounded-lg border p-5 ${BAND_COLOR[result.band]}`}>
          <p className="text-xs uppercase tracking-wider font-medium opacity-80 mb-1">
            Magic number
          </p>
          <p className="text-3xl font-semibold mb-1">
            {formatMultiple(result.magicNumber)}
          </p>
          <p className="text-sm opacity-90">{result.bandLabel}</p>
        </div>

        <div className="mt-4 grid sm:grid-cols-3 gap-4">
          <ResultCard
            label="Net new ARR (qtr)"
            value={formatMoney(result.netNewArr)}
            sublabel="Current ARR minus prior ARR."
          />
          <ResultCard
            label="Annualized × 4"
            value={formatMoney(result.annualizedNetNewArr)}
            sublabel="The full-year run-rate added this quarter."
          />
          <ResultCard
            label="S&M spend"
            value={formatMoney(inputs.quarterlySmSpend)}
            sublabel="Quarterly sales + marketing input."
          />
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-slate-800 bg-slate-950/60 p-5 text-sm text-gray-400 space-y-2">
        <p>
          <span className="text-gray-300 font-medium">Bands:</span>{" "}
          {`>1.5 exceptional · 1-1.5 good · 0.75-1 OK · <0.75 bad.`}
          {" "}Bands tighten at growth stage (Series C+) and loosen at very
          early stage where quarterly noise dominates.
        </p>
        <p>
          <span className="text-gray-300 font-medium">Why this metric:</span>{" "}
          magic number is the canonical sales-efficiency ratio. It says: for
          every dollar of S&M, how much annualized ARR did the company add?
          Above 1.0 means S&M is paying for itself within a year. Below 0.75
          means each dollar produces less than 75 cents of annualized revenue
          and the spend probably needs to be reconsidered.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={copyShareUrl}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-signal-500 hover:bg-signal-600 text-slate-950 text-sm font-medium transition-colors"
        >
          {copied ? "Link copied" : "Copy share link"}
        </button>
        <p className="text-xs text-gray-500">
          The URL contains your inputs, share with your board, head of sales,
          or growth-stage investor.
        </p>
      </div>

      <p className="mt-6 text-xs text-gray-500 leading-relaxed">
        Educational tool. Real diligence pairs magic number with CAC payback,
        net dollar retention, gross margin, and burn multiple. Not financial
        planning advice.
      </p>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  hint?: string;
}

function MoneyField({ label, value, onChange, hint }: FieldProps) {
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
          step={10000}
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="w-full rounded-lg border border-slate-700 bg-slate-950/80 pl-7 pr-3 py-2.5 text-gray-100 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
        />
      </div>
      {hint ? <p className="text-xs text-gray-500 mt-1.5">{hint}</p> : null}
    </label>
  );
}

interface ResultCardProps {
  label: string;
  value: string;
  sublabel?: string;
}

function ResultCard({ label, value, sublabel }: ResultCardProps) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-2xl font-semibold text-gray-100">{value}</p>
      {sublabel ? (
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{sublabel}</p>
      ) : null}
    </div>
  );
}
