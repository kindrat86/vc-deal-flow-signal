import { ImageResponse } from "next/og";
import { verifyShareToken } from "@/lib/share-token";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ token: string }>;
}

const KIND_COPY: Record<string, { eyebrow: string; headline: string; sub: string; accent: string }> = {
  scout: {
    eyebrow: "SCOUT PROFILE · SHARED",
    headline: "A scout shared their track record.",
    sub: "See which unicorns they called early — 7-day extended preview unlocked.",
    accent: "#34d399",
  },
  predict: {
    eyebrow: "PREDICTION · SHARED",
    headline: "Someone locked in a public call.",
    sub: "Will this GitHub org raise in 6 months? Your turn — make your own call.",
    accent: "#fbbf24",
  },
  "signal-card": {
    eyebrow: "WEEKLY BREAKOUTS · SHARED",
    headline: "This week's GitHub breakouts unlocked.",
    sub: "Top startups by engineering acceleration — commit velocity, contributor growth.",
    accent: "#0ea5e9",
  },
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { token } = await context.params;
    const payload = verifyShareToken(token);

    const copy = payload ? (KIND_COPY[payload.k] ?? KIND_COPY["signal-card"]) : null;
    const sharer = payload?.s && payload.s !== "anon" ? payload.s.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 40) : "";

    if (!copy) {
      return expiredCard();
    }

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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 36,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 18,
              fontWeight: 700,
              color: copy.accent,
              letterSpacing: 2,
            }}
          >
            {copy.eyebrow}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "6px 14px",
              borderRadius: 999,
              background: `${copy.accent}22`,
              border: `1px solid ${copy.accent}66`,
              color: copy.accent,
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            7-DAY PREVIEW
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.05,
            marginBottom: 22,
            letterSpacing: -2,
          }}
        >
          {copy.headline}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#cbd5e1",
            marginBottom: 24,
            letterSpacing: 0.2,
            lineHeight: 1.3,
          }}
        >
          {copy.sub}
        </div>

        {sharer ? (
          <div
            style={{
              display: "flex",
              fontSize: 20,
              color: "#94a3b8",
              marginBottom: 24,
              letterSpacing: 0.3,
            }}
          >
            Shared by @{sharer}
          </div>
        ) : null}

        <div style={{ display: "flex", flex: 1 }} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            paddingTop: 20,
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 18,
              fontWeight: 700,
              color: "#fbbf24",
            }}
          >
            Methodology: ssrn.com/abstract=6606558
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", fontSize: 16, color: "#94a3b8" }}>
              Anonymous attribution. Free Sunday digest.
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 18,
                fontWeight: 700,
                color: "#f1f5f9",
              }}
            >
              signals.gitdealflow.com
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
    console.error("[og/share/token] render failed:", error);
    return expiredCard();
  }
}

function expiredCard() {
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
          padding: 56,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 56,
            fontWeight: 800,
            letterSpacing: -1,
            marginBottom: 12,
          }}
        >
          GitDealFlow
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#94a3b8",
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          This share preview has expired.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 20,
            color: "#fbbf24",
            fontWeight: 700,
          }}
        >
          Free weekly digest at signals.gitdealflow.com
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: { "Cache-Control": "public, max-age=300, s-maxage=300" },
    },
  );
}
