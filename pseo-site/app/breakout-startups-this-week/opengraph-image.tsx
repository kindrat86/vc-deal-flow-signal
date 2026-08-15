import { ImageResponse } from "next/og";
import {
  getAllSectors,
  getCurrentPeriod,
  getTopMoversThisWeek,
  getTotalTrackedThisWeek,
} from "@/lib/data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Breakout Startups This Week, VC Deal Flow Signal";

const BREAKOUT_VELOCITY_FLOOR = 30;
const BREAKOUT_CONTRIBUTOR_FLOOR = 8;

export default async function OGImage() {
  const period = getCurrentPeriod();
  const totalTracked = getTotalTrackedThisWeek();
  const sectorCount = getAllSectors().filter(
    (s) => s.periods[period.slug],
  ).length;

  const movers = getTopMoversThisWeek(25, 30);
  const qualified = movers.filter(
    (m) =>
      m.velocityChangePct >= BREAKOUT_VELOCITY_FLOOR &&
      m.contributors >= BREAKOUT_CONTRIBUTOR_FLOOR,
  );
  const breakouts = (qualified.length >= 5 ? qualified : movers).slice(0, 3);

  const accent = "#0ea5e9";
  const rankColor = (i: number) =>
    i === 0 ? "#fb7185" : i === 1 ? "#fbbf24" : "#34d399";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#0b1220",
          color: "#f1f5f9",
          padding: "56px",
          backgroundImage:
            "radial-gradient(circle at 85% 0%, rgba(251,113,133,0.18), transparent 55%), radial-gradient(circle at 0% 100%, rgba(14,165,233,0.20), transparent 50%), linear-gradient(135deg, #0b1220 0%, #0f1b33 55%, #0b1220 100%)",
        }}
      >
        {/* Header: brand + pill */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "36px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 24,
              color: accent,
              fontWeight: 700,
              letterSpacing: "0.01em",
            }}
          >
            VC Deal Flow Signal
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 15,
              color: "#fb7185",
              padding: "6px 16px",
              borderRadius: 999,
              border: "1px solid #fb7185",
              backgroundColor: "rgba(251,113,133,0.10)",
              textTransform: "uppercase",
              letterSpacing: "0.10em",
              fontWeight: 700,
            }}
          >
            Breakout Report
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            fontSize: 58,
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: "10px",
          }}
        >
          Breakout Startups
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 58,
            fontWeight: 800,
            lineHeight: 1.1,
            color: accent,
            marginBottom: "28px",
          }}
        >
          This Week
        </div>

        {/* Leaderboard: top 3 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            marginBottom: "auto",
          }}
        >
          {breakouts.map((m, i) => (
            <div
              key={m.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "18px",
                backgroundColor: "rgba(15,23,42,0.55)",
                borderRadius: 12,
                border: "1px solid rgba(148,163,184,0.18)",
                padding: "14px 22px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 30,
                  fontWeight: 800,
                  color: rankColor(i),
                  minWidth: "52px",
                }}
              >
                #{i + 1}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontSize: 30,
                    fontWeight: 700,
                    color: "#f1f5f9",
                  }}
                >
                  {m.name}
                </div>
                <div
                  style={{
                    display: "flex",
                    fontSize: 18,
                    color: "#94a3b8",
                  }}
                >
                  {m.sectorName} · {m.contributors} contributors
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 28,
                  fontWeight: 800,
                  color: rankColor(i),
                }}
              >
                {m.commitVelocityChange}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "30px",
            fontSize: 16,
            color: "#64748b",
          }}
        >
          <div style={{ display: "flex" }}>
            {totalTracked} startups · {sectorCount} sectors
          </div>
          <div style={{ display: "flex" }}>
            signals.gitdealflow.com · {period.name}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
