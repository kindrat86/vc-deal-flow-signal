/**
 * OG card for /tools/magic-number-calculator?prior=&current=&spend=
 *
 * 1200x630 PNG showing the magic number + band color.
 * Math duplicated from components/MagicNumberCalculator.tsx.
 * Satori reminder: flex only, no display:grid.
 */

import { ImageResponse } from "next/og";

export const runtime = "nodejs";

const DEFAULTS = {
  priorQuarterArr: 2_000_000,
  currentQuarterArr: 2_500_000,
  quarterlySmSpend: 1_000_000,
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

function formatMultiple(n: number): string {
  if (!Number.isFinite(n)) return "n/a";
  if (n >= 100) return ">99";
  if (n <= -100) return "<-99";
  return n.toFixed(2);
}

interface Band {
  key: "exceptional" | "good" | "ok" | "bad" | "negative" | "undefined";
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
  good: {
    key: "good",
    label: "Good",
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
  bad: {
    key: "bad",
    label: "Bad",
    accent: "#fca5a5",
    background: "rgba(239, 68, 68, 0.12)",
    border: "rgba(239, 68, 68, 0.55)",
  },
  negative: {
    key: "negative",
    label: "Negative",
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

function compute(prior: number, current: number, spend: number) {
  const p = Math.max(prior, 0);
  const c = Math.max(current, 0);
  const s = Math.max(spend, 0);

  const netNewArr = c - p;
  const annualizedNetNewArr = netNewArr * 4;

  if (s === 0) {
    return {
      netNewArr,
      annualizedNetNewArr,
      magicNumber: Number.NaN,
      band: BANDS.undefined,
    };
  }

  const magicNumber = annualizedNetNewArr / s;

  if (magicNumber < 0) {
    return { netNewArr, annualizedNetNewArr, magicNumber, band: BANDS.negative };
  }

  const band =
    magicNumber > 1.5
      ? BANDS.exceptional
      : magicNumber >= 1.0
        ? BANDS.good
        : magicNumber >= 0.75
          ? BANDS.ok
          : BANDS.bad;

  return { netNewArr, annualizedNetNewArr, magicNumber, band };
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const p = url.searchParams;

    const inputs = {
      priorQuarterArr: parseNum(p.get("prior"), DEFAULTS.priorQuarterArr),
      currentQuarterArr: parseNum(p.get("current"), DEFAULTS.currentQuarterArr),
      quarterlySmSpend: parseNum(p.get("spend"), DEFAULTS.quarterlySmSpend),
    };

    const result = compute(
      inputs.priorQuarterArr,
      inputs.currentQuarterArr,
      inputs.quarterlySmSpend,
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
            Magic Number · SaaS sales efficiency
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
              Magic number
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
              {formatMultiple(result.magicNumber)}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 20,
                color: "#cbd5e1",
                marginTop: 10,
              }}
            >
              {Number.isFinite(result.magicNumber)
                ? `${formatMoney(result.annualizedNetNewArr)} annualized ARR / ${formatMoney(inputs.quarterlySmSpend)} S&M`
                : "S&M spend is zero, magic number undefined."}
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
            <InputChip
              label="Prior ARR"
              value={formatMoney(inputs.priorQuarterArr)}
            />
            <InputChip
              label="Current ARR"
              value={formatMoney(inputs.currentQuarterArr)}
            />
            <InputChip
              label="Qtr S&M"
              value={formatMoney(inputs.quarterlySmSpend)}
            />
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
              signals.gitdealflow.com/tools/magic-number-calculator
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
    console.error("[og/tools/magic-number] render failed:", error);
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
          Magic Number Calculator
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
          SaaS sales efficiency · Free, URL-shareable
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
