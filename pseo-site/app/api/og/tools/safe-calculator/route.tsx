/**
 * OG card for /tools/safe-calculator?amount=&cap=&discount=&pre=&invest=
 *
 * Renders the SAFE conversion result as a 1200x630 PNG. Each unique URL
 * gets its own preview card — when a user copies the share link and
 * posts it on Twitter / Slack / LinkedIn, the preview shows the actual
 * computed ownership percentage, not a generic image.
 *
 * Math is duplicated from components/SafeCalculator.tsx (kept inline
 * because next/og runs in a separate module graph and we want the OG
 * route to be self-contained).
 *
 * Satori reminder: NO display:grid — flex only (per feedback memory
 * after the Pass IX build trap).
 */

import { ImageResponse } from "next/og";

export const runtime = "nodejs";

const DEFAULTS = {
  safeAmount: 50_000,
  valuationCap: 5_000_000,
  discountPercent: 20,
  nextRoundPreMoney: 15_000_000,
  nextRoundInvestment: 3_000_000,
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

function formatPercent(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "0%";
  if (n < 0.01) return "<0.01%";
  return `${n.toFixed(2)}%`;
}

function compute(
  safeAmount: number,
  cap: number,
  discountPercent: number,
  preMoney: number,
  investment: number,
) {
  const safeAmt = Math.max(safeAmount, 0);
  const safeCap = Math.max(cap, 1);
  const discountFrac = Math.min(Math.max(discountPercent, 0), 99) / 100;
  const nextPost = Math.max(preMoney, 0) + Math.max(investment, 0);

  const capOwnership = (safeAmt / safeCap) * 100;
  const discountValuation = nextPost > 0 ? nextPost * (1 - discountFrac) : 0;
  const discountOwnership =
    discountValuation > 0 ? (safeAmt / discountValuation) * 100 : 0;

  let basis: "cap" | "discount" | "tie" = "cap";
  let effectiveOwnership = capOwnership;
  let effectiveValuation = safeCap;
  if (discountOwnership > capOwnership) {
    basis = "discount";
    effectiveOwnership = discountOwnership;
    effectiveValuation = discountValuation;
  } else if (
    discountValuation > 0 &&
    Math.abs(discountOwnership - capOwnership) < 0.0001
  ) {
    basis = "tie";
  }
  return { effectiveOwnership, effectiveValuation, basis, capOwnership, discountOwnership };
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const p = url.searchParams;

    const inputs = {
      safeAmount: parseNum(p.get("amount"), DEFAULTS.safeAmount),
      valuationCap: parseNum(p.get("cap"), DEFAULTS.valuationCap),
      discountPercent: parseNum(p.get("discount"), DEFAULTS.discountPercent),
      nextRoundPreMoney: parseNum(p.get("pre"), DEFAULTS.nextRoundPreMoney),
      nextRoundInvestment: parseNum(p.get("invest"), DEFAULTS.nextRoundInvestment),
    };

    const result = compute(
      inputs.safeAmount,
      inputs.valuationCap,
      inputs.discountPercent,
      inputs.nextRoundPreMoney,
      inputs.nextRoundInvestment,
    );

    const basisLabel =
      result.basis === "cap"
        ? "Cap binding"
        : result.basis === "discount"
          ? "Discount binding"
          : "Cap = Discount";

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
                color: "#38bdf8",
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
                background: "#38bdf822",
                border: "1px solid #38bdf866",
                color: "#38bdf8",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              {basisLabel}
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
            SAFE Calculator · Post-money conversion
          </div>

          {/* The big result */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: 32,
              borderRadius: 20,
              background: "rgba(56, 189, 248, 0.12)",
              border: "2px solid rgba(56, 189, 248, 0.55)",
              marginBottom: 28,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 18,
                color: "#7dd3fc",
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Your ownership at conversion
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 116,
                fontWeight: 800,
                color: "#7dd3fc",
                letterSpacing: -3,
                lineHeight: 1,
              }}
            >
              {formatPercent(result.effectiveOwnership)}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 20,
                color: "#cbd5e1",
                marginTop: 10,
              }}
            >
              Effective valuation: {formatMoney(result.effectiveValuation)}
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
            <InputChip label="SAFE" value={formatMoney(inputs.safeAmount)} />
            <InputChip
              label="Cap"
              value={formatMoney(inputs.valuationCap)}
            />
            <InputChip
              label="Discount"
              value={`${inputs.discountPercent}%`}
            />
            {inputs.nextRoundPreMoney > 0 ? (
              <InputChip
                label="Next pre-money"
                value={formatMoney(inputs.nextRoundPreMoney)}
              />
            ) : null}
            {inputs.nextRoundInvestment > 0 ? (
              <InputChip
                label="Next round size"
                value={formatMoney(inputs.nextRoundInvestment)}
              />
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
              YC 2018+ post-money SAFE · Free, no signup, URL-shareable
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 14,
                color: "#94a3b8",
              }}
            >
              signals.gitdealflow.com/tools/safe-calculator
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
    console.error("[og/tools/safe-calculator] render failed:", error);
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
          SAFE Calculator
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
          Post-money SAFE math · Free, URL-shareable
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
