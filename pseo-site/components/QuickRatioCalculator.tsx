"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * SaaS quick ratio calculator.
 *
 *   quick_ratio = (new_arr + expansion_arr) / (churned_arr + contracted_arr)
 *
 * The quick ratio is the SaaS growth-efficiency metric originated by
 * Mamoon Hamid (Kleiner Perkins). It expresses "how many dollars of
 * gross new ARR are you adding for every dollar of ARR you're losing".
 * Higher is better. >4 is best-in-class; <1 means the business is
 * shrinking.
 *
 * Bands:
 *   ≥ 4   Exceptional — best-in-class growth efficiency
 *   2-4   Healthy — top quartile
 *   1.5-2 OK — typical at scale
 *   1-1.5 Concerning — net churn is dominating growth
 *   < 1   Bad — net ARR is shrinking
 *
 * Undefined when there are no losses (churned + contracted = 0) —
 * the ratio is technically infinite but doesn't carry information at
 * very early stage.
 *
 * Educational tool. Not financial planning advice.
 */

interface Inputs {
  newArr: number;
  expansionArr: number;
  churnedArr: number;
  contractedArr: number;
}

const DEFAULTS: Inputs = {
  newArr: 800_000,
  expansionArr: 400_000,
  churnedArr: 200_000,
  contractedArr: 100_000,
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

function formatRatio(n: number): string {
  if (!Number.isFinite(n)) return "∞";
  if (n < 0) return "n/a";
  if (n >= 100) return ">99×";
  return `${n.toFixed(2)}×`;
}

interface ComputedResult {
  gainedArr: number;
  lostArr: number;
  netNewArr: number;
  quickRatio: number;
  band:
    | "exceptional"
    | "healthy"
    | "ok"
    | "concerning"
    | "bad"
    | "infinite"
    | "undefined";
  bandLabel: string;
}

function computeQuickRatio(inputs: Inputs): ComputedResult {
  const newArr = Math.max(inputs.newArr, 0);
  const expansion = Math.max(inputs.expansionArr, 0);
  const churned = Math.max(inputs.churnedArr, 0);
  const contracted = Math.max(inputs.contractedArr, 0);

  const gainedArr = newArr + expansion;
  const lostArr = churned + contracted;
  const netNewArr = gainedArr - lostArr;

  if (gainedArr === 0 && lostArr === 0) {
    return {
      gainedArr,
      lostArr,
      netNewArr,
      quickRatio: Number.NaN,
      band: "undefined",
      bandLabel:
        "No ARR movement — enter at least one gain or loss to compute a ratio.",
    };
  }

  if (lostArr === 0) {
    return {
      gainedArr,
      lostArr,
      netNewArr,
      quickRatio: Number.POSITIVE_INFINITY,
      band: "infinite",
      bandLabel:
        "No ARR losses this period — the ratio is technically infinite. Common at very early stage; less informative as you scale.",
    };
  }

  const quickRatio = gainedArr / lostArr;

  let band: ComputedResult["band"];
  let bandLabel: string;

  if (quickRatio >= 4) {
    band = "exceptional";
    bandLabel = "Exceptional — best-in-class growth efficiency.";
  } else if (quickRatio >= 2) {
    band = "healthy";
    bandLabel = "Healthy — top quartile.";
  } else if (quickRatio >= 1.5) {
    band = "ok";
    bandLabel = "OK — typical at scale.";
  } else if (quickRatio >= 1) {
    band = "concerning";
    bandLabel =
      "Concerning — net churn is dominating growth. Investors will dig in.";
  } else {
    band = "bad";
    bandLabel =
      "Bad — net ARR is shrinking. Fix retention before scaling acquisition.";
  }

  return { gainedArr, lostArr, netNewArr, quickRatio, band, bandLabel };
}

const BAND_COLOR: Record<ComputedResult["band"], string> = {
  exceptional: "border-emerald-700/50 bg-emerald-950/30 text-emerald-200",
  healthy: "border-sky-700/50 bg-sky-950/30 text-sky-200",
  ok: "border-amber-700/50 bg-amber-950/30 text-amber-200",
  concerning: "border-orange-700/50 bg-orange-950/30 text-orange-200",
  bad: "border-red-700/50 bg-red-950/30 text-red-200",
  infinite: "border-emerald-700/50 bg-emerald-950/30 text-emerald-200",
  undefined: "border-slate-700 bg-slate-900/60 text-slate-300",
};

export function QuickRatioCalculator() {
  const router = useRouter();
  const params = useSearchParams();

  const [inputs, setInputs] = useState<Inputs>(() => ({
    newArr: parseNumber(params.get("new"), DEFAULTS.newArr),
    expansionArr: parseNumber(params.get("exp"), DEFAULTS.expansionArr),
    churnedArr: parseNumber(params.get("churn"), DEFAULTS.churnedArr),
    contractedArr: parseNumber(params.get("contract"), DEFAULTS.contractedArr),
  }));

  useEffect(() => {
    const timer = setTimeout(() => {
      const q = new URLSearchParams();
      q.set("new", String(inputs.newArr));
      q.set("exp", String(inputs.expansionArr));
      q.set("churn", String(inputs.churnedArr));
      q.set("contract", String(inputs.contractedArr));
      router.replace(`?${q.toString()}`, { scroll: false });
    }, 250);
    return () => clearTimeout(timer);
  }, [inputs, router]);

  const result = useMemo(() => computeQuickRatio(inputs), [inputs]);

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
            ARR gained
          </h2>
          <div className="space-y-4">
            <MoneyField
              label="New customer ARR"
              value={inputs.newArr}
              onChange={(v) => setInputs((s) => ({ ...s, newArr: v }))}
              hint="ARR from net new customers acquired in the period."
            />
            <MoneyField
              label="Expansion ARR"
              value={inputs.expansionArr}
              onChange={(v) => setInputs((s) => ({ ...s, expansionArr: v }))}
              hint="ARR uplift from existing customers (upsells, cross-sells, seat growth)."
            />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            ARR lost
          </h2>
          <div className="space-y-4">
            <MoneyField
              label="Churned ARR"
              value={inputs.churnedArr}
              onChange={(v) => setInputs((s) => ({ ...s, churnedArr: v }))}
              hint="ARR from customers who cancelled in the period."
            />
            <MoneyField
              label="Contracted ARR"
              value={inputs.contractedArr}
              onChange={(v) =>
                setInputs((s) => ({ ...s, contractedArr: v }))
              }
              hint="ARR lost from existing customers who downgraded but didn't cancel."
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className={`rounded-lg border p-5 ${BAND_COLOR[result.band]}`}>
          <p className="text-xs uppercase tracking-wider font-medium opacity-80 mb-1">
            Quick ratio
          </p>
          <p className="text-3xl font-semibold mb-1">
            {formatRatio(result.quickRatio)}
          </p>
          <p className="text-sm opacity-90">{result.bandLabel}</p>
        </div>

        <div className="mt-4 grid sm:grid-cols-3 gap-4">
          <ResultCard
            label="ARR gained"
            value={formatMoney(result.gainedArr)}
            sublabel="New + expansion ARR."
          />
          <ResultCard
            label="ARR lost"
            value={formatMoney(result.lostArr)}
            sublabel="Churned + contracted ARR."
          />
          <ResultCard
            label="Net new ARR"
            value={formatMoney(result.netNewArr)}
            sublabel="Gained minus lost. Negative = shrinking."
          />
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-slate-800 bg-slate-950/60 p-5 text-sm text-gray-400 space-y-2">
        <p>
          <span className="text-gray-300 font-medium">Bands:</span>{" "}
          {`≥4 exceptional · 2-4 healthy · 1.5-2 OK · 1-1.5 concerning · <1 bad.`}
          {" "}Originated by Mamoon Hamid at Kleiner Perkins; broadly adopted
          by SaaS investors as a single-number readout of growth efficiency.
        </p>
        <p>
          <span className="text-gray-300 font-medium">Why this metric:</span>{" "}
          quick ratio captures the gross-flows view of growth that NDR
          (net dollar retention) compresses into a single ratio. Two
          companies with the same NDR can have very different quick ratios —
          the one with higher quick ratio is growing through acquisition AND
          retention; the one with lower quick ratio is barely staying ahead
          of its own churn.
        </p>
        <p>
          <span className="text-gray-300 font-medium">Period choice:</span>{" "}
          monthly for early stage, quarterly at scale. Annual smooths over
          short-term churn dynamics that you want to see.
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
          The URL contains your inputs — drop into a board deck or investor
          update without retyping.
        </p>
      </div>

      <p className="mt-6 text-xs text-gray-500 leading-relaxed">
        Educational tool. Real diligence pairs quick ratio with NDR, gross
        retention, and cohort retention curves. Not financial planning advice.
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
