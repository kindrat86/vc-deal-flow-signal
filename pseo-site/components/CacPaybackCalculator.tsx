"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * CAC payback calculator.
 *
 *   CAC = sales_marketing_spend / new_customers_acquired
 *   ARPC_monthly = ARPC_annual / 12
 *   CAC_payback_months = CAC / (ARPC_monthly × gross_margin_pct)
 *
 * Bands (Bessemer / OpenView / a16z benchmarks):
 *   < 6 months   Exceptional, best-in-class PLG / infra SaaS
 *   6-12 months  Great, top quartile
 *   12-18 months Good, typical Series B+ enterprise SaaS
 *   18-24 months OK, acceptable at scale
 *   > 24 months  Bad, most growth-stage investors will pass
 *
 * Undefined when no new customers acquired or ARPC × GM is zero.
 *
 * Educational tool. Not financial planning advice.
 */

interface Inputs {
  smSpend: number;
  newCustomers: number;
  arpcAnnual: number;
  grossMarginPct: number;
}

const DEFAULTS: Inputs = {
  smSpend: 500_000,
  newCustomers: 50,
  arpcAnnual: 12_000,
  grossMarginPct: 75,
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
  if (!Number.isFinite(n)) return "n/a";
  if (n <= 0) return "0 months";
  if (n > 240) return ">20 years";
  if (n >= 24) {
    const years = Math.floor(n / 12);
    const months = Math.round(n % 12);
    return months > 0 ? `${years}y ${months}mo` : `${years} years`;
  }
  return `${n.toFixed(1)} months`;
}

interface ComputedResult {
  cac: number;
  arpcMonthly: number;
  grossContributionMonthly: number;
  paybackMonths: number;
  band:
    | "exceptional"
    | "great"
    | "good"
    | "ok"
    | "bad"
    | "undefined";
  bandLabel: string;
}

function computePayback(inputs: Inputs): ComputedResult {
  const spend = Math.max(inputs.smSpend, 0);
  const customers = Math.max(inputs.newCustomers, 0);
  const arpcAnnual = Math.max(inputs.arpcAnnual, 0);
  const gmPct = Math.min(Math.max(inputs.grossMarginPct, 0), 100);
  const gmFrac = gmPct / 100;

  if (customers === 0) {
    return {
      cac: Number.NaN,
      arpcMonthly: arpcAnnual / 12,
      grossContributionMonthly: 0,
      paybackMonths: Number.NaN,
      band: "undefined",
      bandLabel:
        "No new customers acquired, CAC is undefined (you can't compute cost per customer when you didn't acquire any).",
    };
  }

  const cac = spend / customers;
  const arpcMonthly = arpcAnnual / 12;
  const grossContributionMonthly = arpcMonthly * gmFrac;

  if (grossContributionMonthly <= 0) {
    return {
      cac,
      arpcMonthly,
      grossContributionMonthly,
      paybackMonths: Number.NaN,
      band: "undefined",
      bandLabel:
        "Gross contribution is zero or negative, CAC will never pay back. Fix unit economics (ARPC or gross margin) before judging payback.",
    };
  }

  const paybackMonths = cac / grossContributionMonthly;

  let band: ComputedResult["band"];
  let bandLabel: string;

  if (paybackMonths < 6) {
    band = "exceptional";
    bandLabel = "Exceptional, best-in-class PLG / infra SaaS territory.";
  } else if (paybackMonths < 12) {
    band = "great";
    bandLabel = "Great, top quartile, fund more.";
  } else if (paybackMonths < 18) {
    band = "good";
    bandLabel = "Good, typical Series B+ enterprise SaaS.";
  } else if (paybackMonths < 24) {
    band = "ok";
    bandLabel = "OK, acceptable at scale, watch trajectory.";
  } else {
    band = "bad";
    bandLabel =
      "Bad, most growth-stage investors will pass at >24-month payback.";
  }

  return {
    cac,
    arpcMonthly,
    grossContributionMonthly,
    paybackMonths,
    band,
    bandLabel,
  };
}

const BAND_COLOR: Record<ComputedResult["band"], string> = {
  exceptional: "border-emerald-700/50 bg-emerald-950/30 text-emerald-200",
  great: "border-sky-700/50 bg-sky-950/30 text-sky-200",
  good: "border-cyan-700/50 bg-cyan-950/30 text-cyan-200",
  ok: "border-amber-700/50 bg-amber-950/30 text-amber-200",
  bad: "border-red-700/50 bg-red-950/30 text-red-200",
  undefined: "border-slate-700 bg-slate-900/60 text-slate-300",
};

export function CacPaybackCalculator() {
  const router = useRouter();
  const params = useSearchParams();

  const [inputs, setInputs] = useState<Inputs>(() => ({
    smSpend: parseNumber(params.get("spend"), DEFAULTS.smSpend),
    newCustomers: parseNumber(params.get("customers"), DEFAULTS.newCustomers),
    arpcAnnual: parseNumber(params.get("arpc"), DEFAULTS.arpcAnnual),
    grossMarginPct: parseNumber(params.get("gm"), DEFAULTS.grossMarginPct),
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      const q = new URLSearchParams();
      q.set("spend", String(inputs.smSpend));
      q.set("customers", String(inputs.newCustomers));
      q.set("arpc", String(inputs.arpcAnnual));
      q.set("gm", String(inputs.grossMarginPct));
      router.replace(`?${q.toString()}`, { scroll: false });
    }, 250);
    return () => clearTimeout(timer);
  }, [inputs, router]);

  const result = useMemo(() => computePayback(inputs), [inputs]);

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
            Acquisition
          </h2>
          <div className="space-y-4">
            <MoneyField
              label="S&M spend (period)"
              value={inputs.smSpend}
              onChange={(v) => setInputs((s) => ({ ...s, smSpend: v }))}
              hint="Total sales + marketing spend over the measurement period."
            />
            <NumberField
              label="New customers acquired"
              value={inputs.newCustomers}
              onChange={(v) => setInputs((s) => ({ ...s, newCustomers: v }))}
              hint="Net new paying customers acquired in the period."
            />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Unit economics
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
              hint="Healthy SaaS sits at 70-80%. Lower margins → longer payback."
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className={`rounded-lg border p-5 ${BAND_COLOR[result.band]}`}>
          <p className="text-xs uppercase tracking-wider font-medium opacity-80 mb-1">
            CAC payback
          </p>
          <p className="text-3xl font-semibold mb-1">
            {formatMonths(result.paybackMonths)}
          </p>
          <p className="text-sm opacity-90">{result.bandLabel}</p>
        </div>

        <div className="mt-4 grid sm:grid-cols-3 gap-4">
          <ResultCard
            label="CAC"
            value={Number.isFinite(result.cac) ? formatMoney(result.cac) : "n/a"}
            sublabel="S&M spend / new customers."
          />
          <ResultCard
            label="Monthly gross contribution"
            value={formatMoney(result.grossContributionMonthly)}
            sublabel="ARPC/12 × gross margin %."
          />
          <ResultCard
            label="ARPC (monthly)"
            value={formatMoney(result.arpcMonthly)}
            sublabel="Annual ARPC divided by 12."
          />
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-slate-800 bg-slate-950/60 p-5 text-sm text-gray-400 space-y-2">
        <p>
          <span className="text-gray-300 font-medium">Bands:</span>{" "}
          {`<6mo exceptional · 6-12 great · 12-18 good · 18-24 OK · >24 bad.`}
          {" "}Enterprise SaaS sits at the longer end; PLG / infra SaaS pulls
          to the shorter end.
        </p>
        <p>
          <span className="text-gray-300 font-medium">Why this metric:</span>{" "}
          CAC payback is the customer-level efficiency view, in the same family
          as magic number (cohort-level) and burn multiple (company-level).
          All three should be looked at together. A great burn multiple with
          25-month CAC payback means the company is efficient on average but
          relies on unhealthy long-tail customers; a great CAC payback with
          poor magic number means each customer is profitable but the GTM
          motion isn't scaling.
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
          The URL contains your inputs, drop into a board deck or investor
          update without retyping.
        </p>
      </div>

      <p className="mt-6 text-xs text-gray-500 leading-relaxed">
        Educational tool. Real diligence pairs CAC payback with net dollar
        retention, LTV/CAC, and churn cohorts. Not financial planning advice.
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

function NumberField({ label, value, onChange, hint }: FieldProps) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1.5">
        {label}
      </span>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2.5 text-gray-100 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
      />
      {hint ? <p className="text-xs text-gray-500 mt-1.5">{hint}</p> : null}
    </label>
  );
}

function PercentField({ label, value, onChange, hint }: FieldProps) {
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
          step={1}
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
