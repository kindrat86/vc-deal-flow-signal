import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export async function GET() {
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
          padding: 64,
          color: "#f1f5f9",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 20,
            fontWeight: 700,
            color: "#0ea5e9",
            letterSpacing: 2,
            marginBottom: 24,
          }}
        >
          GITDEALFLOW · BADGE BUILDER
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.05,
            marginBottom: 18,
            letterSpacing: -2,
          }}
        >
          Show off your taste in your README.
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#94a3b8",
            lineHeight: 1.35,
            marginBottom: 44,
          }}
        >
          Free shields.io-style SVG badges for any GitHub profile or repo.
          Auto-updates. No signup. No telemetry.
        </div>

        <div style={{ display: "flex", gap: 28, marginBottom: 36 }}>
          <FakeBadge label="scout score" value="72 elite" valueBg="#fbbf24" />
          <FakeBadge label="momentum" value="hot +120%" valueBg="#fb7185" />
        </div>

        <div style={{ display: "flex", flex: 1 }} />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 28,
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <div style={{ display: "flex", fontSize: 22, color: "#94a3b8" }}>
            Same pattern as Codecov, WakaTime, GitHub Stats.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 24,
              fontWeight: 700,
              color: "#f1f5f9",
            }}
          >
            signals.gitdealflow.com/badge-builder
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
}

function FakeBadge({
  label,
  value,
  valueBg,
}: {
  label: string;
  value: string;
  valueBg: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        height: 56,
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.35)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "#1e293b",
          color: "#f8fafc",
          padding: "0 22px",
          fontSize: 22,
          fontWeight: 600,
          letterSpacing: 0.5,
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: valueBg,
          color: "#0b1220",
          padding: "0 24px",
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: 0.5,
        }}
      >
        {value}
      </div>
    </div>
  );
}
