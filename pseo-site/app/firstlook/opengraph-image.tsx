import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "First Look Pass, €7. One sector. 24-hour deep dive.";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#0f172a",
          color: "#f1f5f9",
          padding: "60px",
        }}
      >
        {/* Brand */}
        <div
          style={{
            display: "flex",
            fontSize: 20,
            color: "#0ea5e9",
            fontWeight: 600,
            marginBottom: "32px",
          }}
        >
          VC Deal Flow Signal · First Look Pass
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            fontSize: 84,
            fontWeight: 700,
            lineHeight: 1.05,
            marginBottom: "20px",
            letterSpacing: "-0.02em",
          }}
        >
          €7. One sector.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 84,
            fontWeight: 700,
            lineHeight: 1.05,
            marginBottom: "32px",
            color: "#0ea5e9",
            letterSpacing: "-0.02em",
          }}
        >
          24-hour deep dive.
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "#94a3b8",
            marginBottom: "44px",
            maxWidth: "1000px",
            lineHeight: 1.4,
          }}
        >
          Pick any of 19 tracked sectors. Get top-25 ranked GitHub orgs, 14-day
          acceleration deltas, and three pre-Crunchbase breakouts, written.
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: "56px" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 48,
                fontWeight: 700,
                color: "#0ea5e9",
              }}
            >
              25
            </div>
            <div style={{ display: "flex", fontSize: 16, color: "#64748b" }}>
              Ranked GitHub orgs
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 48,
                fontWeight: 700,
                color: "#0ea5e9",
              }}
            >
              14d
            </div>
            <div style={{ display: "flex", fontSize: 16, color: "#64748b" }}>
              Acceleration delta
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 48,
                fontWeight: 700,
                color: "#0ea5e9",
              }}
            >
              3
            </div>
            <div style={{ display: "flex", fontSize: 16, color: "#64748b" }}>
              Pre-Crunchbase breakouts
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 48,
                fontWeight: 700,
                color: "#0ea5e9",
              }}
            >
              24h
            </div>
            <div style={{ display: "flex", fontSize: 16, color: "#64748b" }}>
              Turnaround
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          style={{
            display: "flex",
            marginTop: "auto",
            fontSize: 18,
            color: "#475569",
          }}
        >
          signals.gitdealflow.com/firstlook
        </div>
      </div>
    ),
    size
  );
}
