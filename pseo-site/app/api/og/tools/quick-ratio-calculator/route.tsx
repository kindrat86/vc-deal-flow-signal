/**
 * OG card for /tools/quick-ratio-calculator?new=&exp=&churn=&contract=
 *
 * 1200x630 PNG. Math duplicated from components/QuickRatioCalculator.tsx.
 * Satori reminder: flex only, no display:grid.
 */

import { ImageResponse } from "next/og";

export const runtime = "nodejs";

const DEFAULTS = {
  newArr: 800_000,
  expansionArr: 400_000,
  churnedArr: 200_000,
  contractedArr: 100_000,
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

function formatRatio(n: number): string {
  if (!Number.isFinite(n)) return "∞";
  if (n < 0) return "n/a";
  if (n >= 100) return ">99×";
  return `${n.toFixed(2)}×`;
}

interface Band {
  key:
    | "exceptional"
    | "healthy"
    | "ok"
    | "concerning"
    | "bad"
    | "infinite"
    | "undefined";
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
  concerning: {
    key: "concerning",
    label: "Concerning",
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
  infinite: {
    key: "infinite",
    label: "No losses yet",
    accent: "#86efac",
    background: "rgba(34, 197, 94, 0.12)",
    border: "rgba(34, 197, 94, 0.55)",
  },
  undefined: {
    key: "undefined",
    label: "No movement",
    accent: "#cbd5e1",
    background: "rgba(148, 163, 184, 0.12)",
    border: "rgba(148, 163, 184, 0.40)",
  },
};

function compute(
  newArr: number,
  expansion: number,
  churned: number,
  contracted: number,
) {
  const g = Math.max(newArr, 0) + Math.max(expansion, 0);
  const l = Math.max(churned, 0) + Math.max(contracted, 0);

  if (g === 0 && l === 0) {
    return {
      gained: g,
      lost: l,
      ratio: Number.NaN,
      band: BANDS.undefined,
    };
  }
  if (l === 0) {
    return {
      gained: g,
      lost: l,
      ratio: Number.POSITIVE_INFINITY,
      band: BANDS.infinite,
    };
  }

  const ratio = g / l;
  const band =
    ratio >= 4
      ? BANDS.exceptional
      : ratio >= 2
        ? BANDS.healthy
        : ratio >= 1.5
          ? BANDS.ok
          : ratio >= 1
            ? BANDS.concerning
            : BANDS.bad;
  return { gained: g, lost: l, ratio, band };
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const p = url.searchParams;

    const inputs = {
      newArr: parseNum(p.get("new"), DEFAULTS.newArr),
      expansionArr: parseNum(p.get("exp"), DEFAULTS.expansionArr),
      churnedArr: parseNum(p.get("churn"), DEFAULTS.churnedArr),
      contractedArr: parseNum(p.get("contract"), DEFAULTS.contractedArr),
    };

    const result = compute(
      inputs.newArr,
      inputs.expansionArr,
      inputs.churnedArr,
      inputs.contractedArr,
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
            Quick Ratio · SaaS growth efficiency
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
              Quick ratio
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
              {formatRatio(result.ratio)}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 20,
                color: "#cbd5e1",
                marginTop: 10,
              }}
            >
              {Number.isFinite(result.ratio) && result.lost > 0
                ? `${formatMoney(result.gained)} gained / ${formatMoney(result.lost)} lost`
                : result.gained > 0
                  ? `${formatMoney(result.gained)} gained · no losses recorded`
                  : "Enter at least one gain or loss to compute a ratio."}
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
            <InputChip label="New ARR" value={formatMoney(inputs.newArr)} />
            <InputChip
              label="Expansion"
              value={formatMoney(inputs.expansionArr)}
            />
            <InputChip
              label="Churned"
              value={formatMoney(inputs.churnedArr)}
            />
            <InputChip
              label="Contracted"
              value={formatMoney(inputs.contractedArr)}
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
              Kleiner Perkins / Mamoon Hamid bands · Free · URL-shareable
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 14,
                color: "#94a3b8",
              }}
            >
              signals.gitdealflow.com/tools/quick-ratio-calculator
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
    console.error("[og/tools/quick-ratio] render failed:", error);
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
          Quick Ratio Calculator
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
          SaaS growth efficiency · Free, URL-shareable
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
