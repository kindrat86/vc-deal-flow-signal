import { ImageResponse } from "next/og";
import { fetchUserStars, isValidGithubUsername } from "@/lib/github-stars";
import { computeScoutScore, type ScoutScoreResult } from "@/lib/scout-score";

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

function fallbackCard(message: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0b1220 0%, #0f1b33 60%, #0b1220 100%)",
          color: "#f1f5f9",
          fontSize: 56,
          fontWeight: 800,
          letterSpacing: -1,
        }}
      >
        {message}
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: { "Cache-Control": "public, max-age=60, s-maxage=60" },
    },
  );
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  try {
    const { username: rawUsername } = await params;
    const username = String(rawUsername || "").trim();

    if (!isValidGithubUsername(username)) {
      return fallbackCard("Invalid username");
    }

    let result: ScoutScoreResult;
    try {
      const fetched = await fetchUserStars(username);
      result = computeScoutScore(fetched.stars);
    } catch {
      return fallbackCard("Receipts not found");
    }

    const rankColor = RANK_HEX[result.rank] || "#94a3b8";
    const rankLabel = RANK_LABEL[result.rank] || "SCOUT";
    const topThree = result.top_wins.slice(0, 3);

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            background: "linear-gradient(135deg, #0b1220 0%, #0f1b33 60%, #0b1220 100%)",
            padding: 56,
            color: "#f1f5f9",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 18,
                fontWeight: 700,
                color: "#0ea5e9",
                letterSpacing: 2,
              }}
            >
              GITDEALFLOW · RECEIPTS
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 16,
                color: "#64748b",
                letterSpacing: 1,
              }}
            >
              YOU SAW IT FIRST
            </div>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.05,
              marginBottom: 8,
              letterSpacing: -2,
            }}
          >
            @{username}
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: 28, marginBottom: 28 }}>
            <div
              style={{
                display: "flex",
                fontSize: 124,
                fontWeight: 800,
                lineHeight: 1,
                color: rankColor,
                letterSpacing: -4,
              }}
            >
              {result.score}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div
                style={{
                  display: "flex",
                  fontSize: 14,
                  color: "#64748b",
                  letterSpacing: 2,
                  fontWeight: 600,
                }}
              >
                SCOUT SCORE
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 28,
                  fontWeight: 700,
                  color: rankColor,
                  letterSpacing: 3,
                }}
              >
                {rankLabel}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
            <div
              style={{
                display: "flex",
                fontSize: 14,
                color: "#64748b",
                letterSpacing: 2,
                fontWeight: 600,
              }}
            >
              EARLY CALLS
            </div>
            {topThree.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  fontSize: 22,
                  color: "#94a3b8",
                  fontStyle: "italic",
                }}
              >
                No early calls in our database — yet.
              </div>
            ) : (
              topThree.map((w) => (
                <div
                  key={w.org}
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 14,
                    fontSize: 22,
                    color: "#e2e8f0",
                  }}
                >
                  <div style={{ display: "flex", color: "#34d399", fontFamily: "monospace", fontSize: 18, minWidth: 70 }}>
                    +{Math.round(w.points)}pts
                  </div>
                  <div style={{ display: "flex", fontWeight: 700 }}>{w.name}</div>
                  <div style={{ display: "flex", color: "#64748b", fontSize: 18 }}>
                    {Math.abs(w.months_early).toFixed(0)}mo early
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{ display: "flex", flex: 1 }} />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: 20,
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div style={{ display: "flex", fontSize: 18, color: "#94a3b8" }}>
              {result.matched_count} validated wins · {result.early_count} called early
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 20,
                fontWeight: 700,
                color: "#f1f5f9",
              }}
            >
              signals.gitdealflow.com/receipts
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          "Cache-Control": "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800",
        },
      },
    );
  } catch (error) {
    console.error("[og/receipts] render failed:", error);
    return fallbackCard("GitDealFlow · Receipts");
  }
}
