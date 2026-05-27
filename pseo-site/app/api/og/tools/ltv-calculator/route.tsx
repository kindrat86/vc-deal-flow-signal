/**
 * OG card for /tools/ltv-calculator?arpc=&gm=&churn=&cac=
 *
 * 1200x630 PNG. Shows LTV:CAC ratio prominently when CAC is set;
 * falls back to raw LTV otherwise. Math duplicated from
 * components/LtvCalculator.tsx.
 * Satori reminder: flex only, no display:grid.
 */

import { ImageResponse } from "next/og";

export const runtime = "nodejs";

const DEFAULTS = {
  arpcAnnual: 12_000,
  grossMarginPct: 75,
  monthlyChurnPct: 2.0,
  cac: 0,
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
  if (!Number.isFinite(n)) return "∞ months";
  if (n <= 0) return "0 months";
  if (n >= 24) {
    const years = Math.floor(n / 12);
    const months = Math.round(n % 12);
    return months > 0 ? `${years}y ${months}mo` : `${years} years`;
  }
  return `${n.toFixed(1)} months`;
}

function formatRatio(n: number): string {
  if (!Number.isFinite(n)) return "∞";
  if (n <= 0) return "n/a";
  if (n >= 100) return ">99×";
  return `${n.toFixed(2)}×`;
}

interface Band {
  key:
    | "exceptional"
    | "healthy"
    | "ok"
    | "suspect"
    | "bad"
    | "undefined-churn"
    | "ratio-not-set";
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
  healthy: {
    key: "healthy",
    label: "Healthy",
    accent: "#7dd3fc",
    background: "rgba(56, 189, 248, 0.12)",
    border: "rgba(56, 189, 248, 0.55)",
  },
  ok: {
    key: "ok",
    label: "OK",
    accent: "#fcd34d",
    background: "rgba(245, 158, 11, 0.12)",
    border: "rgba(245, 158, 11, 0.55)",
  },
  suspect: {
    key: "suspect",
    label: "Suspect",
    accent: "#fdba74",
    background: "rgba(249, 115, 22, 0.12)",
    border: "rgba(249, 115, 22, 0.55)",
  },
  bad: {
    key: "bad",
    label: "Bad",
    accent: "#fca5a5",
    background: "rgba(239, 68, 68, 0.12)",
    border: "rgba(239, 68, 68, 0.55)",
  },
  "undefined-churn": {
    key: "undefined-churn",
    label: "Zero churn",
    accent: "#cbd5e1",
    background: "rgba(148, 163, 184, 0.12)",
    border: "rgba(148, 163, 184, 0.40)",
  },
  "ratio-not-set": {
    key: "ratio-not-set",
    label: "LTV only",
    accent: "#7dd3fc",
    background: "rgba(56, 189, 248, 0.10)",
    border: "rgba(56, 189, 248, 0.40)",
  },
};

function compute(
  arpcAnnual: number,
  gmPct: number,
  monthlyChurnPct: number,
  cac: number,
) {
  const arpc = Math.max(arpcAnnual, 0);
  const gm = Math.min(Math.max(gmPct, 0), 100) / 100;
  const churn = Math.max(monthlyChurnPct, 0) / 100;
  const cacIn = Math.max(cac, 0);

  if (churn === 0) {
    return {
      lifetimeMonths: Number.POSITIVE_INFINITY,
      ltv: Number.POSITIVE_INFINITY,
      ratio: Number.POSITIVE_INFINITY,
      band: BANDS["undefined-churn"],
      cacSet: cacIn > 0,
    };
  }

  const lifetimeMonths = 1 / churn;
  const ltv = (arpc / 12) * gm * lifetimeMonths;

  if (cacIn === 0) {
    return {
      lifetimeMonths,
      ltv,
      ratio: 0,
      band: BANDS["ratio-not-set"],
      cacSet: false,
    };
  }

  const ratio = ltv / cacIn;
  const band =
    ratio > 5
      ? BANDS.exceptional
      : ratio >= 3
        ? BANDS.healthy
        : ratio >= 2
          ? BANDS.ok
          : ratio >= 1
            ? BANDS.suspect
            : BANDS.bad;
  return { lifetimeMonths, ltv, ratio, band, cacSet: true };
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const p = url.searchParams;

    const inputs = {
      arpcAnnual: parseNum(p.get("arpc"), DEFAULTS.arpcAnnual),
      grossMarginPct: parseNum(p.get("gm"), DEFAULTS.grossMarginPct),
      monthlyChurnPct: parseNum(p.get("churn"), DEFAULTS.monthlyChurnPct),
      cac: parseNum(p.get("cac"), DEFAULTS.cac),
    };

    const result = compute(
      inputs.arpcAnnual,
      inputs.grossMarginPct,
      inputs.monthlyChurnPct,
      inputs.cac,
    );

    const headlineLabel = result.cacSet ? "LTV:CAC ratio" : "LTV";
    const headlineValue = result.cacSet
      ? formatRatio(result.ratio)
      : formatMoney(result.ltv);
    const subtitle = result.cacSet
      ? `LTV ${formatMoney(result.ltv)} / CAC ${formatMoney(inputs.cac)} · lifetime ${formatMonths(result.lifetimeMonths)}`
      : `lifetime ${formatMonths(result.lifetimeMonths)} · gross margin ${inputs.grossMarginPct}%`;

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
            LTV Calculator · Customer lifetime value
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
              {headlineLabel}
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
              {headlineValue}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 20,
                color: "#cbd5e1",
                marginTop: 10,
              }}
            >
              {subtitle}
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
            <InputChip label="ARPC" value={`${formatMoney(inputs.arpcAnnual)}/yr`} />
            <InputChip label="GM" value={`${inputs.grossMarginPct}%`} />
            <InputChip label="Monthly churn" value={`${inputs.monthlyChurnPct}%`} />
            {inputs.cac > 0 ? (
              <InputChip label="CAC" value={formatMoney(inputs.cac)} />
            ) : null}
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
              ICONIQ / SaaStr / Bessemer LTV:CAC bands · Free · URL-shareable
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 14,
                color: "#94a3b8",
              }}
            >
              signals.gitdealflow.com/tools/ltv-calculator
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
    console.error("[og/tools/ltv-calculator] render failed:", error);
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
          LTV Calculator
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
          Customer lifetime value · Free, URL-shareable
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
