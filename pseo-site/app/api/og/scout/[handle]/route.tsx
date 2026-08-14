import { ImageResponse } from "next/og";
import { getScoutByHandle } from "@/lib/pocketbase";

export const runtime = "nodejs";

const RANK_HEX: Record<string, string> = {
  curious: "#34d399",
  scout: "#38bdf8",
  sharp: "#c084fc",
  elite: "#fbbf24",
  oracle: "#fb7185",
};

const RANK_LABEL: Record<string, string> = {
  curious: "CURIOUS",
  scout: "SCOUT",
  sharp: "SHARP",
  elite: "ELITE",
  oracle: "ORACLE",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ handle: string }> },
) {
  try {
    const { handle } = await params;
    const scout = await getScoutByHandle(handle).catch(() => null);

    if (!scout) {
      return new ImageResponse(
        (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#0b1220",
              color: "#f1f5f9",
              fontSize: 64,
              fontWeight: 700,
            }}
          >
            Scout not found
          </div>
        ),
        { width: 1200, height: 630 },
      );
    }

    const accuracy =
      scout.correct_count + scout.wrong_count > 0
        ? Math.round(
            (1000 * scout.correct_count) /
              (scout.correct_count + scout.wrong_count),
          ) / 10
        : null;

    const rankColor = RANK_HEX[scout.rank] || "#94a3b8";
    const rankLabel = RANK_LABEL[scout.rank] || "SCOUT";

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
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 20,
                fontWeight: 700,
                color: "#0ea5e9",
                letterSpacing: 2,
              }}
            >
              GITDEALFLOW · SCOUT
            </div>
            {scout.founder_scout ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "6px 14px",
                  borderRadius: 999,
                  background: "rgba(52, 211, 153, 0.15)",
                  border: "1px solid rgba(52, 211, 153, 0.4)",
                  color: "#34d399",
                  fontSize: 18,
                  fontWeight: 600,
                  letterSpacing: 1,
                }}
              >
                FOUNDER SCOUT
              </div>
            ) : null}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 92,
              fontWeight: 800,
              lineHeight: 1.0,
              marginBottom: 12,
              letterSpacing: -2,
            }}
          >
            @{scout.handle}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 36,
              fontWeight: 700,
              color: rankColor,
              letterSpacing: 4,
              marginBottom: 48,
            }}
          >
            {rankLabel} RANK
          </div>

          <div style={{ display: "flex", gap: 40, marginBottom: 32 }}>
            <StatBlock label="POINTS" value={Math.round(scout.points).toString()} />
            <StatBlock
              label="ACCURACY"
              value={accuracy !== null ? `${accuracy}%` : "-"}
            />
            <StatBlock
              label="RESOLVED"
              value={String(scout.correct_count + scout.wrong_count)}
            />
            <StatBlock label="PENDING" value={String(scout.pending_count)} />
          </div>

          <div style={{ display: "flex", flex: 1 }} />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: 24,
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div style={{ display: "flex", fontSize: 20, color: "#94a3b8" }}>
              Spot the next Series A before any VC can.
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 22,
                fontWeight: 700,
                color: "#f1f5f9",
              }}
            >
              signals.gitdealflow.com/predict
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          "Cache-Control": "public, max-age=300, s-maxage=600",
        },
      },
    );
  } catch (error) {
    console.error("[og/scout] render failed:", error);
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(135deg, #0b1220 0%, #0f1b33 60%, #0b1220 100%)",
            color: "#f1f5f9",
            fontSize: 56,
            fontWeight: 800,
            letterSpacing: -1,
          }}
        >
          GitDealFlow · Scout
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          "Cache-Control": "public, max-age=60, s-maxage=60",
        },
      },
    );
  }
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div
        style={{
          display: "flex",
          fontSize: 14,
          color: "#64748b",
          letterSpacing: 2,
          fontWeight: 600,
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", fontSize: 52, fontWeight: 800, color: "#f1f5f9" }}>
        {value}
      </div>
    </div>
  );
}
