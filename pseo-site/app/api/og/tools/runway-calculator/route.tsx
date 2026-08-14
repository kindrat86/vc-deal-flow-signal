/**
 * OG card for /tools/runway-calculator?cash=&burn=&rev=&hires=&salary=
 *
 * 1200x630 PNG showing months of runway + band color (danger / warning /
 * safe / infinite). Each shared URL gets its own preview.
 *
 * Math duplicated from components/RunwayCalculator.tsx, see the same
 * note on the SAFE OG route.
 *
 * Satori reminder: flex only, no display:grid.
 */

import { ImageResponse } from "next/og";

export const runtime = "nodejs";

const DEFAULTS = {
  cash: 1_500_000,
  monthlyBurn: 80_000,
  monthlyRevenue: 10_000,
  newHires: 0,
  hireSalary: 150_000,
};

const LOADED_COST_MULTIPLIER = 1.3;

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

interface Band {
  key: "danger" | "warning" | "safe" | "infinite";
  label: string;
  accent: string;
  background: string;
  border: string;
}

const BANDS: Record<Band["key"], Band> = {
  danger: {
    key: "danger",
    label: "Critical, start fundraising now",
    accent: "#fca5a5",
    background: "rgba(239, 68, 68, 0.12)",
    border: "rgba(239, 68, 68, 0.55)",
  },
  warning: {
    key: "warning",
    label: "Fundraise window opens here",
    accent: "#fcd34d",
    background: "rgba(245, 158, 11, 0.12)",
    border: "rgba(245, 158, 11, 0.55)",
  },
  safe: {
    key: "safe",
    label: "Operating runway",
    accent: "#7dd3fc",
    background: "rgba(56, 189, 248, 0.12)",
    border: "rgba(56, 189, 248, 0.55)",
  },
  infinite: {
    key: "infinite",
    label: "Cashflow-positive",
    accent: "#86efac",
    background: "rgba(34, 197, 94, 0.12)",
    border: "rgba(34, 197, 94, 0.55)",
  },
};

function compute(
  cash: number,
  monthlyBurn: number,
  monthlyRevenue: number,
  hires: number,
  salary: number,
) {
  const grossBurn = Math.max(monthlyBurn, 0);
  const revenue = Math.max(monthlyRevenue, 0);
  const c = Math.max(cash, 0);
  const h = Math.max(Math.floor(hires), 0);
  const s = Math.max(salary, 0);

  const netBurn = Math.max(grossBurn - revenue, 0);
  const addedBurn = (h * s * LOADED_COST_MULTIPLIER) / 12;
  const totalNetBurn = netBurn + addedBurn;

  if (totalNetBurn <= 0) {
    return {
      runwayMonths: Number.POSITIVE_INFINITY,
      band: BANDS.infinite,
      totalNetBurn,
      addedBurn,
      netBurn,
    };
  }
  const runwayMonths = c / totalNetBurn;
  const band =
    runwayMonths < 6
      ? BANDS.danger
      : runwayMonths < 12
        ? BANDS.warning
        : BANDS.safe;
  return { runwayMonths, band, totalNetBurn, addedBurn, netBurn };
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const p = url.searchParams;

    const inputs = {
      cash: parseNum(p.get("cash"), DEFAULTS.cash),
      monthlyBurn: parseNum(p.get("burn"), DEFAULTS.monthlyBurn),
      monthlyRevenue: parseNum(p.get("rev"), DEFAULTS.monthlyRevenue),
      newHires: parseNum(p.get("hires"), DEFAULTS.newHires),
      hireSalary: parseNum(p.get("salary"), DEFAULTS.hireSalary),
    };

    const result = compute(
      inputs.cash,
      inputs.monthlyBurn,
      inputs.monthlyRevenue,
      inputs.newHires,
      inputs.hireSalary,
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
            Runway Calculator
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
              Months of runway
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
              {formatMonths(result.runwayMonths)}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 20,
                color: "#cbd5e1",
                marginTop: 10,
              }}
            >
              {Number.isFinite(result.runwayMonths)
                ? `Net burn ${formatMoney(result.totalNetBurn)}/mo${result.addedBurn > 0 ? ` (incl ${formatMoney(result.addedBurn)} new hires)` : ""}`
                : "Monthly revenue covers the burn, no runway clock."}
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
            <InputChip label="Cash" value={formatMoney(inputs.cash)} />
            <InputChip
              label="Gross burn"
              value={`${formatMoney(inputs.monthlyBurn)}/mo`}
            />
            {inputs.monthlyRevenue > 0 ? (
              <InputChip
                label="Revenue"
                value={`${formatMoney(inputs.monthlyRevenue)}/mo`}
              />
            ) : null}
            {inputs.newHires > 0 ? (
              <InputChip
                label="New hires"
                value={`${inputs.newHires} × ${formatMoney(inputs.hireSalary)}`}
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
              Cash / net-burn · headcount scenario · URL-shareable
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 14,
                color: "#94a3b8",
              }}
            >
              signals.gitdealflow.com/tools/runway-calculator
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
    console.error("[og/tools/runway-calculator] render failed:", error);
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
          Runway Calculator
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
          Cash / net-burn · Free, URL-shareable
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
