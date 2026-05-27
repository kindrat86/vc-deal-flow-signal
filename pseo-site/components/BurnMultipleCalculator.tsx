"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Burn-multiple calculator.
 *
 * Burn multiple is the SaaS efficiency metric popularised by David
 * Sacks: how many dollars of burn is the company consuming per dollar
 * of net new ARR? Lower is better.
 *
 *   burn_multiple = total_burn / net_new_arr
 *   net_new_arr   = ending_arr - starting_arr (floor at 0)
 *
 * Bands (Sacks 2020, broadly adopted by SaaS investors):
 *   < 1.0  Exceptional
 *   1-1.5  Great
 *   1.5-2  OK / typical
 *   2-3    Suspect
 *   > 3    Bad — most investors will pass
 *
 * If net new ARR is zero or negative, the multiple is undefined and the
 * UI explains the failure mode (the team consumed cash without growing
 * the revenue base).
 *
 * Educational tool. Not financial planning advice.
 */

interface Inputs {
  startingArr: number;
  endingArr: number;
  totalBurn: number;
  periodMonths: number;
}

const DEFAULTS: Inputs = {
  startingArr: 1_200_000,
  endingArr: 2_400_000,
  totalBurn: 1_500_000,
  periodMonths: 12,
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
  if (n < 0) return "n/a";
  if (n >= 100) return ">99×";
  return `${n.toFixed(2)}×`;
}

interface ComputedResult {
  netNewArr: number;
  burnMultiple: number;
  monthlyAvgBurn: number;
  band: "exceptional" | "great" | "ok" | "suspect" | "bad" | "undefined";
  bandLabel: string;
}

function computeBurnMultiple(inputs: Inputs): ComputedResult {
  const startArr = Math.max(inputs.startingArr, 0);
  const endArr = Math.max(inputs.endingArr, 0);
  const totalBurn = Math.max(inputs.totalBurn, 0);
  const months = Math.max(inputs.periodMonths, 1);

  const netNewArr = Math.max(endArr - startArr, 0);
  const monthlyAvgBurn = totalBurn / months;

  if (netNewArr === 0) {
    return {
      netNewArr,
      burnMultiple: Number.NaN,
      monthlyAvgBurn,
      band: "undefined",
      bandLabel:
        endArr < startArr
          ? "ARR shrank — burn multiple is undefined (the team consumed cash and the revenue base contracted)."
          : "Flat ARR — burn multiple is undefined (the team consumed cash without growing the revenue base).",
    };
  }

  const burnMultiple = totalBurn / netNewArr;
  let band: ComputedResult["band"];
  let bandLabel: string;

  if (burnMultiple < 1) {
    band = "exceptional";
    bandLabel = "Exceptional — top of class.";
  } else if (burnMultiple <= 1.5) {
    band = "great";
    bandLabel = "Great — investors will lean in.";
  } else if (burnMultiple <= 2) {
    band = "ok";
    bandLabel = "OK — typical for the stage.";
  } else if (burnMultiple <= 3) {
    band = "suspect";
    bandLabel = "Suspect — investors will dig into unit economics.";
  } else {
    band = "bad";
    bandLabel = "Bad — most growth-stage investors will pass.";
  }

  return {
    netNewArr,
    burnMultiple,
    monthlyAvgBurn,
    band,
    bandLabel,
  };
}

const BAND_COLOR: Record<ComputedResult["band"], string> = {
  exceptional: "border-emerald-700/50 bg-emerald-950/30 text-emerald-200",
  great: "border-sky-700/50 bg-sky-950/30 text-sky-200",
  ok: "border-amber-700/50 bg-amber-950/30 text-amber-200",
  suspect: "border-orange-700/50 bg-orange-950/30 text-orange-200",
  bad: "border-red-700/50 bg-red-950/30 text-red-200",
  undefined: "border-slate-700 bg-slate-900/60 text-slate-300",
};

export function BurnMultipleCalculator() {
  const router = useRouter();
  const params = useSearchParams();

  const [inputs, setInputs] = useState<Inputs>(() => ({
    startingArr: parseNumber(params.get("start"), DEFAULTS.startingArr),
    endingArr: parseNumber(params.get("end"), DEFAULTS.endingArr),
    totalBurn: parseNumber(params.get("burn"), DEFAULTS.totalBurn),
    periodMonths: parseNumber(params.get("months"), DEFAULTS.periodMonths),
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      const q = new URLSearchParams();
      q.set("start", String(inputs.startingArr));
      q.set("end", String(inputs.endingArr));
      q.set("burn", String(inputs.totalBurn));
      q.set("months", String(inputs.periodMonths));
      router.replace(`?${q.toString()}`, { scroll: false });
    }, 250);
    return () => clearTimeout(timer);
  }, [inputs, router]);

  const result = useMemo(() => computeBurnMultiple(inputs), [inputs]);

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
              label="Starting ARR"
              value={inputs.startingArr}
              onChange={(v) => setInputs((s) => ({ ...s, startingArr: v }))}
              hint="ARR at the beginning of the measurement period."
            />
            <MoneyField
              label="Ending ARR"
              value={inputs.endingArr}
              onChange={(v) => setInputs((s) => ({ ...s, endingArr: v }))}
              hint="ARR at the end of the measurement period."
            />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-100 mb-4">Burn</h2>
          <div className="space-y-4">
            <MoneyField
              label="Total burn (period)"
              value={inputs.totalBurn}
              onChange={(v) => setInputs((s) => ({ ...s, totalBurn: v }))}
              hint="Total cash consumed over the measurement period."
            />
            <NumberField
              label="Period length"
              value={inputs.periodMonths}
              onChange={(v) => setInputs((s) => ({ ...s, periodMonths: v }))}
              suffix="months"
              hint="Typical periods: 12 for annual, 4 for quarterly."
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className={`rounded-lg border p-5 ${BAND_COLOR[result.band]}`}>
          <p className="text-xs uppercase tracking-wider font-medium opacity-80 mb-1">
            Burn multiple
          </p>
          <p className="text-3xl font-semibold mb-1">
            {formatMultiple(result.burnMultiple)}
          </p>
          <p className="text-sm opacity-90">{result.bandLabel}</p>
        </div>

        <div className="mt-4 grid sm:grid-cols-3 gap-4">
          <ResultCard
            label="Net new ARR"
            value={formatMoney(result.netNewArr)}
            sublabel={
              inputs.endingArr >= inputs.startingArr
                ? "Ending ARR minus starting ARR."
                : "Floored at zero (ending < starting)."
            }
          />
          <ResultCard
            label="Total burn"
            value={formatMoney(inputs.totalBurn)}
            sublabel="Cash consumed over the measurement period."
          />
          <ResultCard
            label="Monthly avg burn"
            value={formatMoney(result.monthlyAvgBurn)}
            sublabel={`Total burn / ${inputs.periodMonths} months.`}
          />
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-slate-800 bg-slate-950/60 p-5 text-sm text-gray-400 space-y-2">
        <p>
          <span className="text-gray-300 font-medium">Sacks bands:</span>{" "}
          {`<1× exceptional · 1–1.5× great · 1.5–2× OK · 2–3× suspect · >3× bad.`}
          {" "}Bands tighten at growth stage and loosen at very early stage.
        </p>
        <p>
          <span className="text-gray-300 font-medium">Why this metric:</span>{" "}
          burn multiple is the SaaS-investor heuristic for capital
          efficiency. Lower means every dollar of burn produced more ARR.
          Always paired with growth rate — a 3× burn multiple at 200%
          year-on-year is different from 3× at 30%.
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
          The URL contains your inputs — share it with your board, co-founder,
          or prospective investor.
        </p>
      </div>

      <p className="mt-6 text-xs text-gray-500 leading-relaxed">
        Educational tool. Real efficiency analysis uses net dollar retention,
        gross margin, sales efficiency (magic number, CAC payback), and growth
        rate alongside burn multiple. Not financial planning advice.
      </p>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  hint?: string;
  suffix?: string;
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

function NumberField({ label, value, onChange, suffix, hint }: FieldProps) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1.5">
        {label}
      </span>
      <div className="relative">
        <input
          type="number"
          inputMode="numeric"
          min={1}
          step={1}
          value={value}
          onChange={(e) => onChange(Math.max(1, Number(e.target.value) || 1))}
          className="w-full rounded-lg border border-slate-700 bg-slate-950/80 pl-3 pr-20 py-2.5 text-gray-100 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
        />
        {suffix ? (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            {suffix}
          </span>
        ) : null}
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
