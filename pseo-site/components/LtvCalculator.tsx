"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * LTV calculator with optional LTV:CAC ratio.
 *
 *   lifetime_months = 1 / (monthly_churn_pct / 100)
 *   ltv = (arpc_annual / 12) × (gm_pct / 100) × lifetime_months
 *
 *   if cac > 0:
 *     ltv_cac_ratio = ltv / cac
 *
 * LTV:CAC bands (industry consensus — SaaStr, ICONIQ, Bessemer):
 *   > 5×    Exceptional — under-investing in growth, raise spend
 *   3-5×    Healthy — the textbook target
 *   2-3×    OK — typical at growth stage, watch margin/churn
 *   1-2×    Suspect — each customer barely profitable
 *   < 1×    Bad — losing money per customer
 *
 * Undefined when monthly churn is zero (lifetime → infinity) — handled
 * with explicit messaging.
 *
 * Educational tool. Not financial planning advice.
 */

interface Inputs {
  arpcAnnual: number;
  grossMarginPct: number;
  monthlyChurnPct: number;
  cac: number;
}

const DEFAULTS: Inputs = {
  arpcAnnual: 12_000,
  grossMarginPct: 75,
  monthlyChurnPct: 2.0,
  cac: 0,
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

function formatMonths(n: number): string {
  if (!Number.isFinite(n)) return "∞ months";
  if (n <= 0) return "0 months";
  if (n > 240) return ">20 years";
  if (n >= 24) {
    const years = Math.floor(n / 12);
    const months = Math.round(n % 12);
    return months > 0 ? `${years}y ${months}mo` : `${years} years`;
  }
  return `${n.toFixed(1)} months`;
}

function formatRatio(n: number): string {
  if (!Number.isFinite(n)) return "n/a";
  if (n <= 0) return "n/a";
  if (n >= 100) return ">99×";
  return `${n.toFixed(2)}×`;
}

interface ComputedResult {
  lifetimeMonths: number;
  ltv: number;
  ratio: number;
  band:
    | "exceptional"
    | "healthy"
    | "ok"
    | "suspect"
    | "bad"
    | "undefined-churn"
    | "ratio-not-set";
  bandLabel: string;
}

function computeLtv(inputs: Inputs): ComputedResult {
  const arpc = Math.max(inputs.arpcAnnual, 0);
  const gm = Math.min(Math.max(inputs.grossMarginPct, 0), 100) / 100;
  const churn = Math.max(inputs.monthlyChurnPct, 0) / 100;
  const cac = Math.max(inputs.cac, 0);

  if (churn === 0) {
    return {
      lifetimeMonths: Number.POSITIVE_INFINITY,
      ltv: Number.POSITIVE_INFINITY,
      ratio: Number.POSITIVE_INFINITY,
      band: "undefined-churn",
      bandLabel:
        "Zero churn means infinite lifetime — LTV is undefined. Enter a non-zero monthly churn (even 0.5%) to get a meaningful number.",
    };
  }

  const lifetimeMonths = 1 / churn;
  const ltv = (arpc / 12) * gm * lifetimeMonths;

  if (cac === 0) {
    return {
      lifetimeMonths,
      ltv,
      ratio: 0,
      band: "ratio-not-set",
      bandLabel:
        "Enter your CAC above to see the LTV:CAC ratio with industry-standard bands.",
    };
  }

  const ratio = ltv / cac;

  let band: ComputedResult["band"];
  let bandLabel: string;

  if (ratio > 5) {
    band = "exceptional";
    bandLabel =
      "Exceptional — likely under-investing in growth. Consider raising spend.";
  } else if (ratio >= 3) {
    band = "healthy";
    bandLabel = "Healthy — the textbook target.";
  } else if (ratio >= 2) {
    band = "ok";
    bandLabel = "OK — typical at growth stage. Watch margin and churn.";
  } else if (ratio >= 1) {
    band = "suspect";
    bandLabel = "Suspect — each customer is barely profitable.";
  } else {
    band = "bad";
    bandLabel =
      "Bad — losing money per customer. Fix unit economics before scaling spend.";
  }

  return { lifetimeMonths, ltv, ratio, band, bandLabel };
}

const BAND_COLOR: Record<ComputedResult["band"], string> = {
  exceptional: "border-emerald-700/50 bg-emerald-950/30 text-emerald-200",
  healthy: "border-sky-700/50 bg-sky-950/30 text-sky-200",
  ok: "border-amber-700/50 bg-amber-950/30 text-amber-200",
  suspect: "border-orange-700/50 bg-orange-950/30 text-orange-200",
  bad: "border-red-700/50 bg-red-950/30 text-red-200",
  "undefined-churn": "border-slate-700 bg-slate-900/60 text-slate-300",
  "ratio-not-set": "border-slate-700 bg-slate-900/60 text-slate-300",
};

export function LtvCalculator() {
  const router = useRouter();
  const params = useSearchParams();

  const [inputs, setInputs] = useState<Inputs>(() => ({
    arpcAnnual: parseNumber(params.get("arpc"), DEFAULTS.arpcAnnual),
    grossMarginPct: parseNumber(params.get("gm"), DEFAULTS.grossMarginPct),
    monthlyChurnPct: parseNumber(params.get("churn"), DEFAULTS.monthlyChurnPct),
    cac: parseNumber(params.get("cac"), DEFAULTS.cac),
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      const q = new URLSearchParams();
      q.set("arpc", String(inputs.arpcAnnual));
      q.set("gm", String(inputs.grossMarginPct));
      q.set("churn", String(inputs.monthlyChurnPct));
      q.set("cac", String(inputs.cac));
      router.replace(`?${q.toString()}`, { scroll: false });
    }, 250);
    return () => clearTimeout(timer);
  }, [inputs, router]);

  const result = useMemo(() => computeLtv(inputs), [inputs]);

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
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Customer economics
          </h2>
          <div className="space-y-4">
            <MoneyField
              label="ARPC (annual)"
              value={inputs.arpcAnnual}
              onChange={(v) => setInputs((s) => ({ ...s, arpcAnnual: v }))}
              hint="Average annual revenue per customer."
            />
            <PercentField
              label="Gross margin"
              value={inputs.grossMarginPct}
              onChange={(v) =>
                setInputs((s) => ({ ...s, grossMarginPct: v }))
              }
              hint="Healthy SaaS sits at 70-80%."
            />
            <PercentField
              label="Monthly churn"
              value={inputs.monthlyChurnPct}
              onChange={(v) =>
                setInputs((s) => ({ ...s, monthlyChurnPct: v }))
              }
              step={0.1}
              hint="2% monthly = ~22% annual. 0.5% monthly = ~6% annual (best-in-class)."
            />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Acquisition (optional)
          </h2>
          <div className="space-y-4">
            <MoneyField
              label="CAC"
              value={inputs.cac}
              onChange={(v) => setInputs((s) => ({ ...s, cac: v }))}
              hint="Customer acquisition cost. Leave at 0 to compute LTV only."
            />
          </div>
          <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950/40 p-3 text-xs text-gray-500 leading-relaxed">
            Add a CAC to see the LTV:CAC ratio with industry-standard bands.
            Industry target is 3-5×; under 1× means losing money per customer.
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className={`rounded-lg border p-5 ${BAND_COLOR[result.band]}`}>
          <p className="text-xs uppercase tracking-wider font-medium opacity-80 mb-1">
            {inputs.cac > 0 ? "LTV:CAC ratio" : "LTV"}
          </p>
          <p className="text-3xl font-semibold mb-1">
            {inputs.cac > 0 ? formatRatio(result.ratio) : formatMoney(result.ltv)}
          </p>
          <p className="text-sm opacity-90">{result.bandLabel}</p>
        </div>

        <div className="mt-4 grid sm:grid-cols-3 gap-4">
          <ResultCard
            label="LTV"
            value={formatMoney(result.ltv)}
            sublabel="(ARPC/12) × GM% × lifetime months."
          />
          <ResultCard
            label="Customer lifetime"
            value={formatMonths(result.lifetimeMonths)}
            sublabel="1 / monthly churn rate."
          />
          <ResultCard
            label="LTV:CAC ratio"
            value={inputs.cac > 0 ? formatRatio(result.ratio) : "—"}
            sublabel={
              inputs.cac > 0
                ? "Industry target: 3-5×."
                : "Enter CAC to compute."
            }
          />
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-slate-800 bg-slate-950/60 p-5 text-sm text-gray-400 space-y-2">
        <p>
          <span className="text-gray-300 font-medium">LTV:CAC bands:</span>{" "}
          {`>5× exceptional · 3-5× healthy · 2-3× OK · 1-2× suspect · <1× bad.`}
          {" "}The conventional target is 3-5×. Above 5×, you are likely
          under-investing in growth and should raise spend; below 1×, each
          customer loses money and unit economics need fixing before scaling.
        </p>
        <p>
          <span className="text-gray-300 font-medium">Why gross margin matters:</span>{" "}
          LTV uses gross contribution, not raw revenue. A customer paying
          $12k/yr at 75% GM contributes $9k/yr of gross profit; at 40% GM
          only $4.8k/yr. The cost of revenue (hosting, support, payment
          processing, licensing) has to come out before LTV is meaningful.
        </p>
        <p>
          <span className="text-gray-300 font-medium">Churn is the lever:</span>{" "}
          dropping monthly churn from 3% to 1.5% doubles the LTV (lifetime
          goes from 33 months to 67 months). Churn improvements have more
          leverage than ARPC or margin improvements at most companies.
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
          The URL contains your inputs — drop into a board deck or investor
          update without retyping.
        </p>
      </div>

      <p className="mt-6 text-xs text-gray-500 leading-relaxed">
        Educational tool. Simple LTV formula assumes constant churn and ARPC
        — real lifetime values use cohort-by-cohort decay curves and net
        dollar retention. Use this for back-of-envelope; use cohort retention
        analysis for diligence. Not financial planning advice.
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
          step={1000}
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
