import { ImageResponse } from "next/og";
import { getTop100, formatIsoWeekLabel } from "@/lib/top-100";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Top 100 GitHub-Signal Startups, Weekly Index";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const snap = getTop100(slug);
  const label = formatIsoWeekLabel(slug);
  const top3 = (snap?.rankings ?? []).slice(0, 3);

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
          padding: 60,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", color: "#64748b", fontSize: 22 }}>
          signals.gitdealflow.com, {label}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 800,
            marginTop: 18,
            lineHeight: 1.05,
            color: "#f8fafc",
          }}
        >
          Top 100 GitHub-Signal Startups
        </div>
        <div
          style={{
            display: "flex",
            color: "#94a3b8",
            fontSize: 28,
            marginTop: 14,
          }}
        >
          {snap
            ? `${snap.summary.totalRanked} distinct startups · ${snap.summary.sectorsCovered} sectors · top ${snap.summary.topSignalScore} / median ${snap.summary.medianSignalScore}`
            : "Composite leaderboard refreshed every Monday"}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 36,
            gap: 14,
          }}
        >
          {top3.map((r) => (
            <div
              key={r.rank}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                fontSize: 32,
                color: "#e2e8f0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontWeight: 800,
                  color: "#38bdf8",
                  width: 60,
                }}
              >
                #{r.rank}
              </div>
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  fontWeight: 700,
                  color: "#f8fafc",
                }}
              >
                {r.name}
              </div>
              <div
                style={{
                  display: "flex",
                  color: "#94a3b8",
                  fontSize: 26,
                }}
              >
                {r.sectorName}
              </div>
              <div
                style={{
                  display: "flex",
                  color: "#38bdf8",
                  fontWeight: 700,
                  width: 110,
                  justifyContent: "flex-end",
                }}
              >
                {r.signalScore}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "auto",
            color: "#64748b",
            fontSize: 20,
          }}
        >
          SignalScore = clamp(velocity%, -20, 150) + clamp(contrib%, 0, 150) +
          min(100, commits/10) + min(50, devs/2) · capped, weekly-stable
        </div>
      </div>
    ),
    { ...size },
  );
}
