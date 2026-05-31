/**
 * OG card for /tools/dilution-stack?s1a=&s1c=&s2a=&s2c=&s3a=&s3c=&pre=&invest=&pool=
 *
 * 1200x630 PNG showing founder ownership % + cap-table mini-bars.
 * Math duplicated from components/DilutionStackCalculator.tsx.
 * Satori reminder: flex only, no display:grid.
 */

import { ImageResponse } from "next/og";

export const runtime = "nodejs";

const MAX_SAFES = 3;

const DEFAULTS = {
  safes: [
    { amount: 500_000, cap: 5_000_000 },
    { amount: 1_000_000, cap: 10_000_000 },
    { amount: 0, cap: 0 },
  ],
  series: { pre: 20_000_000, invest: 5_000_000, pool: 10 },
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

function formatPct(n: number): string {
  if (!Number.isFinite(n)) return "n/a";
  if (n < 0) return `${(n * 100).toFixed(2)}%`;
  if (n < 0.0001 && n > 0) return "<0.01%";
  return `${(n * 100).toFixed(2)}%`;
}

interface Band {
  key: "excellent" | "healthy" | "diluted" | "very-diluted" | "over-diluted";
  label: string;
  accent: string;
  background: string;
  border: string;
}

const BANDS: Record<Band["key"], Band> = {
  excellent: {
    key: "excellent",
    label: "Excellent",
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
  diluted: {
    key: "diluted",
    label: "Diluted",
    accent: "#fcd34d",
    background: "rgba(245, 158, 11, 0.12)",
    border: "rgba(245, 158, 11, 0.55)",
  },
  "very-diluted": {
    key: "very-diluted",
    label: "Very diluted",
    accent: "#fdba74",
    background: "rgba(249, 115, 22, 0.12)",
    border: "rgba(249, 115, 22, 0.55)",
  },
  "over-diluted": {
    key: "over-diluted",
    label: "Over-diluted",
    accent: "#fca5a5",
    background: "rgba(239, 68, 68, 0.12)",
    border: "rgba(239, 68, 68, 0.55)",
  },
};

const BAR_COLORS: Record<string, string> = {
  founders: "#38bdf8", // sky-400
  safe: "#a78bfa", // purple-400
  series: "#34d399", // emerald-400
  pool: "#fbbf24", // amber-400
};

interface RowDisplay {
  label: string;
  pct: number;
  color: string;
}

function compute(
  safes: Array<{ amount: number; cap: number }>,
  pre: number,
  invest: number,
  poolPct: number,
) {
  const validSafes = safes.filter((s) => s.amount > 0 && s.cap > 0);
  const safeRows: RowDisplay[] = validSafes.map((s, i) => ({
    label: `SAFE ${i + 1}`,
    pct: s.amount / s.cap,
    color: BAR_COLORS.safe,
  }));
  const safeTotal = safeRows.reduce((acc, r) => acc + r.pct, 0);

  const seriesPost = Math.max(pre, 0) + Math.max(invest, 0);
  const seriesPct = seriesPost > 0 ? Math.max(invest, 0) / seriesPost : 0;
  const pool = Math.min(Math.max(poolPct, 0), 100) / 100;
  const foundersPct = 1 - safeTotal - seriesPct - pool;

  const rows: RowDisplay[] = [
    { label: "Founders", pct: foundersPct, color: BAR_COLORS.founders },
    ...safeRows,
  ];
  if (seriesPct > 0) {
    rows.push({ label: "Series A", pct: seriesPct, color: BAR_COLORS.series });
  }
  if (pool > 0) {
    rows.push({ label: "Pool", pct: pool, color: BAR_COLORS.pool });
  }

  let band: Band;
  if (foundersPct < 0) band = BANDS["over-diluted"];
  else if (foundersPct >= 0.5) band = BANDS.excellent;
  else if (foundersPct >= 0.3) band = BANDS.healthy;
  else if (foundersPct >= 0.15) band = BANDS.diluted;
  else band = BANDS["very-diluted"];

  return { rows, foundersPct, band, seriesPost };
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const p = url.searchParams;

    const safes = Array.from({ length: MAX_SAFES }, (_, i) => ({
      amount: parseNum(
        p.get(`s${i + 1}a`),
        DEFAULTS.safes[i]?.amount ?? 0,
      ),
      cap: parseNum(p.get(`s${i + 1}c`), DEFAULTS.safes[i]?.cap ?? 0),
    }));
    const pre = parseNum(p.get("pre"), DEFAULTS.series.pre);
    const invest = parseNum(p.get("invest"), DEFAULTS.series.invest);
    const pool = parseNum(p.get("pool"), DEFAULTS.series.pool);

    const result = compute(safes, pre, invest, pool);
    const safeCount = safes.filter((s) => s.amount > 0 && s.cap > 0).length;

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
              marginBottom: 24,
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
              fontSize: 34,
              fontWeight: 800,
              lineHeight: 1.05,
              marginBottom: 18,
              letterSpacing: -1,
            }}
          >
            Dilution Stack · {safeCount} SAFE
            {safeCount === 1 ? "" : "s"} + Series A
          </div>

          {/* The big result */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: 24,
              borderRadius: 18,
              background: result.band.background,
              border: `2px solid ${result.band.border}`,
              marginBottom: 18,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 16,
                color: result.band.accent,
                fontWeight: 700,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Founders' final ownership
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 92,
                fontWeight: 800,
                color: result.band.accent,
                letterSpacing: -3,
                lineHeight: 1,
              }}
            >
              {formatPct(result.foundersPct)}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 18,
                color: "#cbd5e1",
                marginTop: 6,
              }}
            >
              Series A post-money: {formatMoney(result.seriesPost)} · option
              pool: {pool}%
            </div>
          </div>

          {/* Cap-table mini-bars */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              marginBottom: "auto",
            }}
          >
            {result.rows.map((row) => {
              const barWidth = Math.max(0, Math.min(100, row.pct * 100));
              return (
                <div
                  key={row.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      width: 110,
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#e2e8f0",
                    }}
                  >
                    {row.label}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flex: 1,
                      height: 12,
                      background: "rgba(255, 255, 255, 0.06)",
                      borderRadius: 6,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        width: `${barWidth}%`,
                        height: "100%",
                        background: row.color,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      width: 90,
                      fontSize: 16,
                      fontWeight: 700,
                      color: row.color,
                      justifyContent: "flex-end",
                    }}
                  >
                    {formatPct(row.pct)}
                  </div>
                </div>
              );
            })}
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
              Multi-SAFE + Series A + option pool · Free · URL-shareable
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 14,
                color: "#94a3b8",
              }}
            >
              signals.gitdealflow.com/tools/dilution-stack
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
    console.error("[og/tools/dilution-stack] render failed:", error);
    return fallback();
  }
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
          Dilution Stack Calculator
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
          Multi-SAFE + Series A · Free, URL-shareable
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
