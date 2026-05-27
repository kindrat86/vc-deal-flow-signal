"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Post-money SAFE calculator.
 *
 * Math (YC 2018+ post-money SAFE — the dominant US instrument):
 *   - cap_ownership = safe_amount / valuation_cap
 *     (post-money cap = effective company value the SAFE prices into)
 *   - discount_ownership = safe_amount / (next_round_post_money * (1 - discount))
 *     (only relevant if a priced round is modeled)
 *   - effective_ownership = max(cap_ownership, discount_ownership)
 *     (the SAFE-holder gets whichever is more favorable to them, i.e.
 *     the LOWER conversion price → the HIGHER ownership)
 *
 * Educational tool. Not legal or tax advice.
 */

interface Inputs {
  safeAmount: number;
  valuationCap: number;
  discountPercent: number;
  nextRoundPreMoney: number;
  nextRoundInvestment: number;
}

const DEFAULTS: Inputs = {
  safeAmount: 50_000,
  valuationCap: 5_000_000,
  discountPercent: 20,
  nextRoundPreMoney: 15_000_000,
  nextRoundInvestment: 3_000_000,
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

function formatPercent(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "0%";
  if (n < 0.01) return "<0.01%";
  return `${n.toFixed(2)}%`;
}

interface ComputedResult {
  capOwnership: number;
  discountOwnership: number;
  effectiveOwnership: number;
  effectiveValuation: number;
  conversionBasis: "cap" | "discount" | "tie";
  nextRoundPostMoney: number;
}

function computeSafe(inputs: Inputs): ComputedResult {
  const cap = Math.max(inputs.valuationCap, 1);
  const safeAmount = Math.max(inputs.safeAmount, 0);
  const discountFraction = Math.min(Math.max(inputs.discountPercent, 0), 99) / 100;
  const nextPost =
    Math.max(inputs.nextRoundPreMoney, 0) + Math.max(inputs.nextRoundInvestment, 0);

  const capOwnership = (safeAmount / cap) * 100;
  const discountValuation =
    nextPost > 0 ? nextPost * (1 - discountFraction) : 0;
  const discountOwnership =
    discountValuation > 0 ? (safeAmount / discountValuation) * 100 : 0;

  // SAFE-holder always converts at the price most favorable to them
  // → the higher resulting ownership %.
  let conversionBasis: ComputedResult["conversionBasis"] = "cap";
  let effectiveOwnership = capOwnership;
  let effectiveValuation = cap;

  if (discountOwnership > capOwnership) {
    conversionBasis = "discount";
    effectiveOwnership = discountOwnership;
    effectiveValuation = discountValuation;
  } else if (
    discountValuation > 0 &&
    Math.abs(discountOwnership - capOwnership) < 0.0001
  ) {
    conversionBasis = "tie";
  }

  return {
    capOwnership,
    discountOwnership,
    effectiveOwnership,
    effectiveValuation,
    conversionBasis,
    nextRoundPostMoney: nextPost,
  };
}

export function SafeCalculator() {
  const router = useRouter();
  const params = useSearchParams();

  const [inputs, setInputs] = useState<Inputs>(() => ({
    safeAmount: parseNumber(params.get("amount"), DEFAULTS.safeAmount),
    valuationCap: parseNumber(params.get("cap"), DEFAULTS.valuationCap),
    discountPercent: parseNumber(params.get("discount"), DEFAULTS.discountPercent),
    nextRoundPreMoney: parseNumber(params.get("pre"), DEFAULTS.nextRoundPreMoney),
    nextRoundInvestment: parseNumber(
      params.get("invest"),
      DEFAULTS.nextRoundInvestment,
    ),
  }));

  // Debounced URL sync — encodes the current state as ?amount=&cap=&...
  // so the result is a shareable link without losing the back-button.
  useEffect(() => {
    const timer = setTimeout(() => {
      const q = new URLSearchParams();
      q.set("amount", String(inputs.safeAmount));
      q.set("cap", String(inputs.valuationCap));
      q.set("discount", String(inputs.discountPercent));
      q.set("pre", String(inputs.nextRoundPreMoney));
      q.set("invest", String(inputs.nextRoundInvestment));
      router.replace(`?${q.toString()}`, { scroll: false });
    }, 250);
    return () => clearTimeout(timer);
  }, [inputs, router]);

  const result = useMemo(() => computeSafe(inputs), [inputs]);

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
            SAFE terms
          </h2>
          <div className="space-y-4">
            <MoneyField
              label="SAFE amount"
              value={inputs.safeAmount}
              onChange={(v) => setInputs((s) => ({ ...s, safeAmount: v }))}
              hint="How much you're investing via SAFE."
            />
            <MoneyField
              label="Valuation cap (post-money)"
              value={inputs.valuationCap}
              onChange={(v) => setInputs((s) => ({ ...s, valuationCap: v }))}
              hint="The cap sets the worst-case price you'll convert at."
            />
            <NumberField
              label="Discount"
              value={inputs.discountPercent}
              onChange={(v) =>
                setInputs((s) => ({ ...s, discountPercent: v }))
              }
              suffix="%"
              hint="Discount off the next round's price (e.g., 20% = pay 80%)."
            />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Next round (optional)
          </h2>
          <div className="space-y-4">
            <MoneyField
              label="Pre-money valuation"
              value={inputs.nextRoundPreMoney}
              onChange={(v) =>
                setInputs((s) => ({ ...s, nextRoundPreMoney: v }))
              }
              hint="The pre-money valuation of the next priced round."
            />
            <MoneyField
              label="Round size"
              value={inputs.nextRoundInvestment}
              onChange={(v) =>
                setInputs((s) => ({ ...s, nextRoundInvestment: v }))
              }
              hint="How much new equity money the next round raises."
            />
          </div>
        </div>
      </div>

      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        <ResultCard
          label="Your ownership"
          value={formatPercent(result.effectiveOwnership)}
          accent
        />
        <ResultCard
          label="Conversion basis"
          value={
            result.conversionBasis === "cap"
              ? "Cap"
              : result.conversionBasis === "discount"
                ? "Discount"
                : "Tie"
          }
          sublabel={
            result.conversionBasis === "cap"
              ? "Cap is binding — discount not enough."
              : result.conversionBasis === "discount"
                ? "Discount is binding — next round is below cap."
                : "Cap and discount give the same conversion."
          }
        />
        <ResultCard
          label="Effective valuation"
          value={formatMoney(result.effectiveValuation)}
          sublabel="The post-money valuation your SAFE prices into."
        />
      </div>

      <div className="mt-6 rounded-lg border border-slate-800 bg-slate-950/60 p-5 text-sm text-gray-400 space-y-2">
        <p>
          <span className="text-gray-300 font-medium">Cap-only ownership:</span>{" "}
          {formatPercent(result.capOwnership)} (assumes the cap binds — i.e.
          next round prices above the cap).
        </p>
        <p>
          <span className="text-gray-300 font-medium">
            Discount-only ownership:
          </span>{" "}
          {result.discountOwnership > 0
            ? `${formatPercent(result.discountOwnership)} (assumes only the discount applies — i.e. next round is below the cap).`
            : "n/a — model a next round above to compare."}
        </p>
        {result.nextRoundPostMoney > 0 ? (
          <p>
            <span className="text-gray-300 font-medium">
              Next round post-money:
            </span>{" "}
            {formatMoney(result.nextRoundPostMoney)}.
          </p>
        ) : null}
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
          The URL contains your inputs — anyone you send it to sees the same
          numbers.
        </p>
      </div>

      <p className="mt-6 text-xs text-gray-500 leading-relaxed">
        Educational tool. Models the YC 2018+ post-money SAFE. Pre-money
        SAFEs (the older variant) calculate differently and may also be
        subject to MFN, pro-rata, and most-favored-nation provisions. Not
        legal or tax advice — talk to your lawyer.
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

function NumberField({ label, value, onChange, suffix, hint }: FieldProps) {
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
          max={99}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="w-full rounded-lg border border-slate-700 bg-slate-950/80 pl-3 pr-8 py-2.5 text-gray-100 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
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
  accent?: boolean;
}

function ResultCard({ label, value, sublabel, accent }: ResultCardProps) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        accent
          ? "border-sky-700/50 bg-sky-950/30"
          : "border-slate-800 bg-slate-900"
      }`}
    >
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p
        className={`text-2xl font-semibold ${accent ? "text-sky-200" : "text-gray-100"}`}
      >
        {value}
      </p>
      {sublabel ? (
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{sublabel}</p>
      ) : null}
    </div>
  );
}
