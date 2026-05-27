/**
 * OG card for /tools/cac-payback-calculator?spend=&customers=&arpc=&gm=
 *
 * 1200x630 PNG showing CAC payback months + band color.
 * Math duplicated from components/CacPaybackCalculator.tsx.
 * Satori reminder: flex only, no display:grid.
 */

import { ImageResponse } from "next/og";

export const runtime = "nodejs";

const DEFAULTS = {
  smSpend: 500_000,
  newCustomers: 50,
  arpcAnnual: 12_000,
  grossMarginPct: 75,
};

function parseNum(v: string | null, fallback: number): number {
  if (!v) return fallback;
  const n = Number(v.replace(/[^0-9.-]/g, ""));
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

interface Band {
  key: "exceptional" | "great" | "good" | "ok" | "bad" | "undefined";
  label: string;
  accent: string;
  background: string;
  border: string;
}

const BANDS: Record<Band["key"], Band> = {
  exceptional: {
    key: "exceptional",
    label: "Exceptional",
    accent: "#86efac",
    background: "rgba(34, 197, 94, 0.12)",
    border: "rgba(34, 197, 94, 0.55)",
  },
  great: {
    key: "great",
    label: "Great",
    accent: "#7dd3fc",
    background: "rgba(56, 189, 248, 0.12)",
    border: "rgba(56, 189, 248, 0.55)",
  },
  good: {
    key: "good",
    label: "Good",
    accent: "#67e8f9",
    background: "rgba(6, 182, 212, 0.12)",
    border: "rgba(6, 182, 212, 0.55)",
  },
  ok: {
    key: "ok",
    label: "OK",
    accent: "#fcd34d",
    background: "rgba(245, 158, 11, 0.12)",
    border: "rgba(245, 158, 11, 0.55)",
  },
  bad: {
    key: "bad",
    label: "Bad",
    accent: "#fca5a5",
    background: "rgba(239, 68, 68, 0.12)",
    border: "rgba(239, 68, 68, 0.55)",
  },
  undefined: {
    key: "undefined",
    label: "Undefined",
    accent: "#cbd5e1",
    background: "rgba(148, 163, 184, 0.12)",
    border: "rgba(148, 163, 184, 0.40)",
  },
};

function compute(
  spend: number,
  customers: number,
  arpcAnnual: number,
  gmPct: number,
) {
  const s = Math.max(spend, 0);
  const c = Math.max(customers, 0);
  const a = Math.max(arpcAnnual, 0);
  const g = Math.min(Math.max(gmPct, 0), 100) / 100;

  if (c === 0) {
    return {
      cac: Number.NaN,
      paybackMonths: Number.NaN,
      grossContribution: 0,
      band: BANDS.undefined,
    };
  }

  const cac = s / c;
  const arpcMonthly = a / 12;
  const grossContribution = arpcMonthly * g;

  if (grossContribution <= 0) {
    return {
      cac,
      paybackMonths: Number.NaN,
      grossContribution,
      band: BANDS.undefined,
    };
  }

  const paybackMonths = cac / grossContribution;
  const band =
    paybackMonths < 6
      ? BANDS.exceptional
      : paybackMonths < 12
        ? BANDS.great
        : paybackMonths < 18
          ? BANDS.good
          : paybackMonths < 24
            ? BANDS.ok
            : BANDS.bad;
  return { cac, paybackMonths, grossContribution, band };
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const p = url.searchParams;

    const inputs = {
      smSpend: parseNum(p.get("spend"), DEFAULTS.smSpend),
      newCustomers: parseNum(p.get("customers"), DEFAULTS.newCustomers),
      arpcAnnual: parseNum(p.get("arpc"), DEFAULTS.arpcAnnual),
      grossMarginPct: parseNum(p.get("gm"), DEFAULTS.grossMarginPct),
    };

    const result = compute(
      inputs.smSpend,
      inputs.newCustomers,
      inputs.arpcAnnual,
      inputs.grossMarginPct,
    );

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            background:
              "linear-gradient(135deg, #0b1220 0%, #0f1b33 60%, #0b1220 100%)",
            padding: 56,
            color: "#f1f5f9",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 28,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 16,
                fontWeight: 700,
                color: result.band.accent,
                letterSpacing: 2,
              }}
            >
              GITDEALFLOW · FREE TOOL
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "6px 14px",
                borderRadius: 999,
                background: result.band.background,
                border: `1px solid ${result.band.border}`,
                color: result.band.accent,
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              {result.band.label}
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              display: "flex",
              fontSize: 38,
              fontWeight: 800,
              lineHeight: 1.05,
              marginBottom: 32,
              letterSpacing: -1,
            }}
          >
            CAC Payback · Customer-acquisition-cost in months
          </div>

          {/* The big result */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: 32,
              borderRadius: 20,
              background: result.band.background,
              border: `2px solid ${result.band.border}`,
              marginBottom: 28,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 18,
                color: result.band.accent,
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              CAC payback
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 116,
                fontWeight: 800,
                color: result.band.accent,
                letterSpacing: -3,
                lineHeight: 1,
              }}
            >
              {formatMonths(result.paybackMonths)}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 20,
                color: "#cbd5e1",
                marginTop: 10,
              }}
            >
              {Number.isFinite(result.paybackMonths)
                ? `CAC ${formatMoney(result.cac)} / ${formatMoney(result.grossContribution)} monthly gross contribution`
                : "Unit economics don't compute — see the calculator for diagnosis."}
            </div>
          </div>

          {/* Inputs strip */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: "auto",
            }}
          >
            <InputChip label="S&M" value={formatMoney(inputs.smSpend)} />
            <InputChip
              label="Customers"
              value={String(inputs.newCustomers)}
            />
            <InputChip
              label="ARPC"
              value={`${formatMoney(inputs.arpcAnnual)}/yr`}
            />
            <InputChip label="GM" value={`${inputs.grossMarginPct}%`} />
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              paddingTop: 16,
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 16,
                fontWeight: 700,
                color: "#fbbf24",
              }}
            >
              Bessemer / OpenView bands · Free, no signup, URL-shareable
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 14,
                color: "#94a3b8",
              }}
            >
              signals.gitdealflow.com/tools/cac-payback-calculator
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          "Cache-Control": "public, max-age=600, s-maxage=86400",
        },
      },
    );
  } catch (error) {
    console.error("[og/tools/cac-payback] render failed:", error);
    return fallback();
  }
}

function InputChip({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "10px 16px",
        borderRadius: 10,
        background: "rgba(255, 255, 255, 0.04)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 12,
          color: "#94a3b8",
          textTransform: "uppercase",
          letterSpacing: 1,
          marginBottom: 2,
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 22,
          fontWeight: 700,
          color: "#e2e8f0",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function fallback() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #0b1220 0%, #0f1b33 60%, #0b1220 100%)",
          color: "#f1f5f9",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 56,
            fontWeight: 800,
            letterSpacing: -1,
          }}
        >
          CAC Payback Calculator
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "#7dd3fc",
            marginTop: 16,
            fontWeight: 700,
          }}
        >
          SaaS unit economics · Free, URL-shareable
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: { "Cache-Control": "public, max-age=60, s-maxage=60" },
    },
  );
}
