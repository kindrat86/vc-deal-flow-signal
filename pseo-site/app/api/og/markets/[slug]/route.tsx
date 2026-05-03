import { ImageResponse } from "next/og";
import { getMarket } from "@/lib/markets";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_req: Request, ctx: RouteContext) {
  try {
    const { slug } = await ctx.params;
    const market = getMarket(slug);
    if (!market) {
      return fallbackCard();
    }

    const sorted = [...market.candidates]
      .sort((a, b) => b.impliedProbability - a.impliedProbability)
      .slice(0, 5);

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
              marginBottom: 22,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 16,
                fontWeight: 700,
                color: "#34d399",
                letterSpacing: 2,
              }}
            >
              GITDEALFLOW · OPEN PREDICTION MARKET
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "6px 14px",
                borderRadius: 999,
                background: "#34d39922",
                border: "1px solid #34d39966",
                color: "#34d399",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              Resolves {market.resolvesOn}
            </div>
          </div>

          {/* Question */}
          <div
            style={{
              display: "flex",
              fontSize: 44,
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: 22,
              letterSpacing: -1,
            }}
          >
            {market.question}
          </div>

          {/* Candidates list */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginBottom: 18,
            }}
          >
            {sorted.map((c, i) => {
              const pct = Math.round(c.impliedProbability * 100);
              const barW = Math.max(2, pct);
              return (
                <div
                  key={c.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      width: 28,
                      fontSize: 18,
                      color: "#64748b",
                      fontFamily: "monospace",
                    }}
                  >
                    #{i + 1}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      width: 240,
                      fontSize: 22,
                      fontWeight: 700,
                      color: "#f1f5f9",
                    }}
                  >
                    {c.displayName}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flex: 1,
                      height: 14,
                      background: "#1e293b",
                      borderRadius: 7,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        width: `${barW}%`,
                        height: "100%",
                        background:
                          "linear-gradient(90deg, #34d399 0%, #0ea5e9 100%)",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      width: 70,
                      fontSize: 26,
                      fontWeight: 800,
                      color: "#34d399",
                      justifyContent: "flex-end",
                    }}
                  >
                    {pct}%
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", flex: 1 }} />

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
              Implied odds from GitHub commit-velocity signals · Public methodology · CC BY 4.0
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{ display: "flex", fontSize: 14, color: "#94a3b8" }}
              >
                signals.gitdealflow.com/markets/{market.slug}
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#94a3b8",
                  fontFamily: "monospace",
                }}
              >
                /api/markets/{market.slug}.json
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          "Cache-Control": "public, max-age=600, s-maxage=1200",
        },
      },
    );
  } catch (error) {
    console.error("[og/markets] render failed:", error);
    return fallbackCard();
  }
}

function fallbackCard() {
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
          GitDealFlow · Markets
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "#fbbf24",
            marginTop: 16,
            fontWeight: 700,
          }}
        >
          Open prediction markets on startup funding events.
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
