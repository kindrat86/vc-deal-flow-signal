import { ImageResponse } from "next/og";
import {
  getPredictionWeek,
  fmtLongDate,
  isPredictionOutcomeHit,
} from "@/lib/predictions";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "VC Deal Flow Signal — Acceleration Watch (weekly picks, graded post-hoc)";

export default async function OGImage({
  params,
}: {
  params: Promise<{ week: string }>;
}) {
  const { week: slug } = await params;
  const week = getPredictionWeek(slug);

  if (!week) {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            backgroundColor: "#0f172a",
            color: "#f1f5f9",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 48,
            fontWeight: 700,
          }}
        >
          VC Deal Flow Signal
        </div>
      ),
      size
    );
  }

  const hits = week.picks.filter((p) => isPredictionOutcomeHit(p.outcome)).length;
  const graded = week.picks.filter(
    (p) => p.outcome !== null && p.outcome !== "excluded",
  ).length;
  const pending = week.picks.filter((p) => p.outcome === null).length;
  const topPicks = week.picks.slice(0, 3);

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
          backgroundImage:
            "linear-gradient(135deg, #0f172a 0%, #0b1226 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "#34d399",
            fontWeight: 700,
            marginBottom: "30px",
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          Acceleration Watch · Public Bet
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 56,
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: "16px",
          }}
        >
          Week of {fmtLongDate(week.weekStart)}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "#94a3b8",
            marginBottom: "40px",
          }}
        >
          {week.picks.length} startups · graded {week.windowDays} days post-publish
        </div>

        <div style={{ display: "flex", gap: "40px", marginBottom: "30px" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 48, fontWeight: 800, color: "#34d399" }}>
              {hits}
            </div>
            <div style={{ display: "flex", fontSize: 16, color: "#94a3b8", marginTop: 4 }}>
              Hits
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 48, fontWeight: 800 }}>{graded}</div>
            <div style={{ display: "flex", fontSize: 16, color: "#94a3b8", marginTop: 4 }}>
              Graded
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 48, fontWeight: 800, color: "#fbbf24" }}>
              {pending}
            </div>
            <div style={{ display: "flex", fontSize: 16, color: "#94a3b8", marginTop: 4 }}>
              Pending
            </div>
          </div>
        </div>

        {topPicks.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "auto" }}>
            <div style={{ display: "flex", fontSize: 14, color: "#64748b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
              Top picks this week
            </div>
            {topPicks.map((p) => (
              <div
                key={p.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  fontSize: 22,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    width: 36,
                    height: 36,
                    backgroundColor: "#34d399",
                    color: "#0f172a",
                    borderRadius: 999,
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 16,
                  }}
                >
                  {p.rank}
                </div>
                <div style={{ display: "flex", fontWeight: 600 }}>{p.displayName}</div>
                <div style={{ display: "flex", color: "#22d3ee", fontWeight: 600 }}>
                  {p.commitVelocityChange}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <div
          style={{
            display: "flex",
            marginTop: topPicks.length > 0 ? "30px" : "auto",
            fontSize: 16,
            color: "#475569",
          }}
        >
          signals.gitdealflow.com/predicted/{slug}
        </div>
      </div>
    ),
    size
  );
}
