"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Runway calculator.
 *
 * Math:
 *   net_burn = gross_burn - monthly_revenue (floor at 0 for "infinite")
 *   added_burn = engineer_count × per_engineer_monthly_cost
 *   total_net_burn = net_burn + added_burn
 *   runway_months = cash / total_net_burn
 *   runway_end_date = today + runway_months
 *
 * Per-engineer cost convention used here: salary × 1.30 for taxes +
 * benefits, divided by 12. The user can override the salary; the 30%
 * loaded-cost multiplier stays constant and is called out in the FAQ.
 *
 * Educational tool. Not financial planning advice.
 */

interface Inputs {
  cash: number;
  monthlyBurn: number;
  monthlyRevenue: number;
  newHires: number;
  hireSalary: number;
}

const DEFAULTS: Inputs = {
  cash: 1_500_000,
  monthlyBurn: 80_000,
  monthlyRevenue: 10_000,
  newHires: 0,
  hireSalary: 150_000,
};

const LOADED_COST_MULTIPLIER = 1.3;

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
  if (n > 240) return "20+ years";
  if (n >= 24) {
    const years = Math.floor(n / 12);
    const months = Math.round(n % 12);
    return months > 0 ? `${years}y ${months}mo` : `${years} years`;
  }
  return `${n.toFixed(1)} months`;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

interface ComputedResult {
  netBurn: number;
  addedBurn: number;
  totalNetBurn: number;
  runwayMonths: number;
  runwayEndDate: Date | null;
  band: "danger" | "warning" | "safe" | "infinite";
  bandLabel: string;
}

function computeRunway(inputs: Inputs): ComputedResult {
  const grossBurn = Math.max(inputs.monthlyBurn, 0);
  const revenue = Math.max(inputs.monthlyRevenue, 0);
  const cash = Math.max(inputs.cash, 0);
  const hires = Math.max(Math.floor(inputs.newHires), 0);
  const salary = Math.max(inputs.hireSalary, 0);

  const netBurn = Math.max(grossBurn - revenue, 0);
  const addedBurn = (hires * salary * LOADED_COST_MULTIPLIER) / 12;
  const totalNetBurn = netBurn + addedBurn;

  let runwayMonths: number;
  let endDate: Date | null = null;
  let band: ComputedResult["band"];
  let bandLabel: string;

  if (totalNetBurn <= 0) {
    runwayMonths = Number.POSITIVE_INFINITY;
    band = "infinite";
    bandLabel = "Cashflow-positive";
  } else {
    runwayMonths = cash / totalNetBurn;
    const now = new Date();
    endDate = new Date(now.getFullYear(), now.getMonth() + Math.round(runwayMonths), 1);
    if (runwayMonths < 6) {
      band = "danger";
      bandLabel = "Critical — start fundraising now";
    } else if (runwayMonths < 12) {
      band = "warning";
      bandLabel = "Fundraise window opens here";
    } else {
      band = "safe";
      bandLabel = "Operating runway";
    }
  }

  return {
    netBurn,
    addedBurn,
    totalNetBurn,
    runwayMonths,
    runwayEndDate: endDate,
    band,
    bandLabel,
  };
}

export function RunwayCalculator() {
  const router = useRouter();
  const params = useSearchParams();

  const [inputs, setInputs] = useState<Inputs>(() => ({
    cash: parseNumber(params.get("cash"), DEFAULTS.cash),
    monthlyBurn: parseNumber(params.get("burn"), DEFAULTS.monthlyBurn),
    monthlyRevenue: parseNumber(params.get("rev"), DEFAULTS.monthlyRevenue),
    newHires: parseNumber(params.get("hires"), DEFAULTS.newHires),
    hireSalary: parseNumber(params.get("salary"), DEFAULTS.hireSalary),
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      const q = new URLSearchParams();
      q.set("cash", String(inputs.cash));
      q.set("burn", String(inputs.monthlyBurn));
      q.set("rev", String(inputs.monthlyRevenue));
      q.set("hires", String(inputs.newHires));
      q.set("salary", String(inputs.hireSalary));
      router.replace(`?${q.toString()}`, { scroll: false });
    }, 250);
    return () => clearTimeout(timer);
  }, [inputs, router]);

  const result = useMemo(() => computeRunway(inputs), [inputs]);

  const [copied, setCopied] = useState(false);
  const copyShareUrl = () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const bandColor =
    result.band === "danger"
      ? "border-red-700/50 bg-red-950/30 text-red-200"
      : result.band === "warning"
        ? "border-amber-700/50 bg-amber-950/30 text-amber-200"
        : result.band === "infinite"
          ? "border-emerald-700/50 bg-emerald-950/30 text-emerald-200"
          : "border-sky-700/50 bg-sky-950/30 text-sky-200";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-100 mb-4">Today</h2>
          <div className="space-y-4">
            <MoneyField
              label="Cash on hand"
              value={inputs.cash}
              onChange={(v) => setInputs((s) => ({ ...s, cash: v }))}
              hint="Total bank balance plus committed but unspent capital."
            />
            <MoneyField
              label="Gross monthly burn"
              value={inputs.monthlyBurn}
              onChange={(v) => setInputs((s) => ({ ...s, monthlyBurn: v }))}
              hint="Total cash out per month (salaries, infra, tools, marketing)."
            />
            <MoneyField
              label="Monthly revenue"
              value={inputs.monthlyRevenue}
              onChange={(v) =>
                setInputs((s) => ({ ...s, monthlyRevenue: v }))
              }
              hint="MRR or equivalent recurring inflow. 0 if pre-revenue."
            />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Scenario: new hires
          </h2>
          <div className="space-y-4">
            <NumberField
              label="New engineers to hire"
              value={inputs.newHires}
              onChange={(v) => setInputs((s) => ({ ...s, newHires: v }))}
              hint="How many full-time engineers you're modelling adding."
            />
            <MoneyField
              label="Avg base salary"
              value={inputs.hireSalary}
              onChange={(v) => setInputs((s) => ({ ...s, hireSalary: v }))}
              hint="Per-engineer base salary. Total cost loaded 30% for taxes + benefits."
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className={`rounded-lg border p-5 ${bandColor}`}>
          <p className="text-xs uppercase tracking-wider font-medium opacity-80 mb-1">
            Runway
          </p>
          <p className="text-3xl font-semibold mb-1">
            {formatMonths(result.runwayMonths)}
          </p>
          <p className="text-sm opacity-90">
            {result.bandLabel}
            {result.runwayEndDate
              ? ` — runs out around ${formatDate(result.runwayEndDate)}.`
              : "."}
          </p>
        </div>

        <div className="mt-4 grid sm:grid-cols-3 gap-4">
          <ResultCard
            label="Net monthly burn"
            value={formatMoney(result.netBurn)}
            sublabel="Gross burn minus current revenue."
          />
          <ResultCard
            label="Added burn from hires"
            value={
              result.addedBurn > 0 ? `+${formatMoney(result.addedBurn)}` : "—"
            }
            sublabel={
              inputs.newHires > 0
                ? `${inputs.newHires} × ${formatMoney(inputs.hireSalary)} × 1.3 / 12.`
                : "Add headcount to model the impact."
            }
          />
          <ResultCard
            label="Total net burn"
            value={
              result.totalNetBurn > 0 ? formatMoney(result.totalNetBurn) : "$0"
            }
            sublabel="What's actually consuming cash per month."
          />
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-slate-800 bg-slate-950/60 p-5 text-sm text-gray-400 space-y-2">
        <p>
          <span className="text-gray-300 font-medium">Fundraise rule of thumb:</span>{" "}
          start raising at 12 months of runway, close by 6 months. The "danger"
          band below 6 means you're negotiating from weakness.
        </p>
        <p>
          <span className="text-gray-300 font-medium">Loaded cost:</span> per-engineer
          monthly cost = salary × 1.3 / 12. The 1.3 multiplier covers
          employer-side taxes, healthcare, equipment, and tools — adjust the
          salary input if your loaded cost differs.
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
          The URL contains your inputs — share it with your co-founder or
          investor without retyping anything.
        </p>
      </div>

      <p className="mt-6 text-xs text-gray-500 leading-relaxed">
        Educational tool. Real runway calculations should account for
        seasonality, accruals, deferred revenue, payment-collection timing,
        and one-off expenses. Not financial planning advice — talk to your
        CFO or fractional finance lead.
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
