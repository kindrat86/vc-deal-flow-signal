/**
 * OG card for /tools (the index page itself).
 *
 * 1200x630 PNG showing the 8-calculator catalog as a share preview.
 * Currently the /tools index had no OG image so shares unfurled with
 * the default site card. This route closes that gap and matches the
 * per-tool OG pattern already shipped at /api/og/tools/[slug]/.
 *
 * Satori reminder: flex only, no display:grid.
 */

import { ImageResponse } from "next/og";

export const runtime = "nodejs";

interface ToolChip {
  name: string;
  tagline: string;
  accent: string;
}

const TOOLS: ToolChip[] = [
  { name: "SAFE", tagline: "Post-money conversion", accent: "#a78bfa" },
  { name: "Dilution Stack", tagline: "Multi-SAFE → Series A", accent: "#a78bfa" },
  { name: "Runway", tagline: "Cash / net-burn", accent: "#38bdf8" },
  { name: "Burn Multiple", tagline: "Sacks bands", accent: "#34d399" },
  { name: "Magic Number", tagline: "Sales efficiency", accent: "#34d399" },
  { name: "CAC Payback", tagline: "Per-customer months", accent: "#34d399" },
  { name: "LTV / LTV:CAC", tagline: "Customer lifetime", accent: "#34d399" },
  { name: "Quick Ratio", tagline: "Growth efficiency", accent: "#34d399" },
];

export async function GET() {
  try {
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
                color: "#38bdf8",
                letterSpacing: 2,
              }}
            >
              GITDEALFLOW · FREE TOOLS
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "6px 14px",
                borderRadius: 999,
                background: "rgba(56, 189, 248, 0.12)",
                border: "1px solid rgba(56, 189, 248, 0.55)",
                color: "#7dd3fc",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              8 calculators
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              display: "flex",
              fontSize: 56,
              fontWeight: 800,
              lineHeight: 1.0,
              marginBottom: 14,
              letterSpacing: -2,
            }}
          >
            Free VC + founder calculators
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: "#cbd5e1",
              marginBottom: 28,
              lineHeight: 1.3,
            }}
          >
            SAFE conversion · dilution · runway · the full SaaS
            efficiency suite. URL-shareable. No signup.
          </div>

          {/* Tool grid (4×2) */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              marginBottom: "auto",
            }}
          >
            {TOOLS.map((t) => (
              <div
                key={t.name}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: 256,
                  padding: "12px 16px",
                  borderRadius: 12,
                  background: "rgba(255, 255, 255, 0.04)",
                  border: `1px solid ${t.accent}40`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontSize: 18,
                    fontWeight: 700,
                    color: t.accent,
                    marginBottom: 2,
                  }}
                >
                  {t.name}
                </div>
                <div
                  style={{
                    display: "flex",
                    fontSize: 14,
                    color: "#94a3b8",
                  }}
                >
                  {t.tagline}
                </div>
              </div>
            ))}
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
              Each tool URL-shareable · per-share OG cards · CC BY 4.0
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 14,
                color: "#94a3b8",
              }}
            >
              signals.gitdealflow.com/tools
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          "Cache-Control": "public, max-age=3600, s-maxage=86400",
        },
      },
    );
  } catch (error) {
    console.error("[og/tools] render failed:", error);
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
            Free VC + founder tools
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
            8 calculators · URL-shareable · CC BY 4.0
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
}
