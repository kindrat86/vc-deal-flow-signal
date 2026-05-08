import { ImageResponse } from "next/og";

export const runtime = "nodejs";

const ISBN = "979-8-9876543-1-7";

/**
 * Reader completion certificate as a 1200×630 PNG. Personalized via query
 * params (name, optional date). Renderable to any social card or download
 * button without ever storing reader-typed data on a server.
 *
 * Brunson Cart-Funnel Ch 18 application: the book delivers the value, the
 * certificate is the public-share artefact that closes the engagement loop
 * and seeds Dream-100 distribution (every shared cert is a small ad).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawName = (searchParams.get("name") || "").slice(0, 60).trim();
  const name = rawName || "Anonymous reader";
  const date = (searchParams.get("date") || new Date().toISOString().slice(0, 10)).slice(0, 10);

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
          color: "#f1f5f9",
          padding: 64,
          position: "relative",
        }}
      >
        {/* Top header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            fontSize: 18,
            color: "#94a3b8",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          <div style={{ display: "flex", color: "#0ea5e9", fontWeight: 700 }}>
            GITDEALFLOW · READER CREDENTIAL
          </div>
          <div style={{ display: "flex", color: "#94a3b8" }}>ISBN {ISBN}</div>
        </div>

        {/* Decorative rule */}
        <div
          style={{
            display: "flex",
            height: 2,
            background: "linear-gradient(90deg, #0ea5e9 0%, #fbbf24 100%)",
            marginTop: 24,
            marginBottom: 60,
          }}
        />

        {/* Body */}
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
              fontSize: 26,
              color: "#94a3b8",
              fontStyle: "italic",
              marginBottom: 18,
            }}
          >
            This credential confirms that
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 76,
              fontWeight: 800,
              letterSpacing: -1.5,
              lineHeight: 1.05,
              color: "#fbbf24",
              marginBottom: 26,
              maxWidth: 1050,
              wordBreak: "break-word",
            }}
          >
            {name}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: "#cbd5e1",
              lineHeight: 1.4,
              marginBottom: 12,
              maxWidth: 1050,
            }}
          >
            has finished all eleven chapters of
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 36,
              fontWeight: 700,
              color: "#f1f5f9",
              lineHeight: 1.2,
              maxWidth: 1050,
            }}
          >
            The 7 GitHub Signals That Predict Series A Rounds
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            paddingTop: 28,
            borderTop: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <div style={{ display: "flex", fontSize: 22, color: "#94a3b8" }}>
              including the SSRN-indexed methodology
            </div>
            <div style={{ display: "flex", fontSize: 22, color: "#94a3b8" }}>
              and the 90-minute replication appendix
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 6,
            }}
          >
            <div style={{ display: "flex", fontSize: 22, color: "#94a3b8" }}>
              {date}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 26,
                fontWeight: 700,
                color: "#0ea5e9",
              }}
            >
              signals.gitdealflow.com/book
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=604800, immutable",
      },
    },
  );
}
