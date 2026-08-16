import { ImageResponse } from "next/og";
import { getAllSectors, getCurrentPeriod } from "@/lib/data";
import { panelClaimFloor } from "@/lib/canonical-claims";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "VC Deal Flow Signal, Startup Engineering Acceleration Tracker";

export default async function OGImage() {
  const sectors = getAllSectors();
  const period = getCurrentPeriod();
  const activeSectors = sectors.filter(
    (s) => Object.keys(s.periods).length > 0
  );
  const totalStartups = activeSectors.reduce(
    (sum, s) =>
      sum +
      Object.values(s.periods).reduce(
        (ps, snap) => ps + snap.startups.length,
        0
      ),
    0
  );
  const panelClaim = panelClaimFloor(totalStartups);

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
            marginBottom: "50px",
          }}
        >
          VC Deal Flow Signal
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            fontSize: 56,
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: "20px",
          }}
        >
          Startup Engineering Signals by Sector
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "#94a3b8",
            marginBottom: "50px",
          }}
        >
          Spot breakout startups before they hit your inbox
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: "40px" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 44, fontWeight: 700, color: "#0ea5e9" }}>
              {activeSectors.length}
            </div>
            <div style={{ display: "flex", fontSize: 16, color: "#64748b" }}>Sectors tracked</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 44, fontWeight: 700, color: "#0ea5e9" }}>

              {panelClaimFloor(totalStartups)}
            </div>
            <div style={{ display: "flex", fontSize: 16, color: "#64748b" }}>Startup signals</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 44, fontWeight: 700, color: "#0ea5e9" }}>
              Weekly
            </div>
            <div style={{ display: "flex", fontSize: 16, color: "#64748b" }}>Data refresh</div>
          </div>
        </div>

        {/* Bottom */}
        <div
          style={{
            display: "flex",
            marginTop: "auto",
            fontSize: 16,
            color: "#475569",
          }}
        >
          signals.gitdealflow.com · {period.name}
        </div>
      </div>
    ),
    size
  );
}
