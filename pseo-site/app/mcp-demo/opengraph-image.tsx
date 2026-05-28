import { ImageResponse } from "next/og";

/**
 * Static poster / OG image for /mcp-demo.
 *
 * Replaces the previous 1.9 MB animated `mcp-demo.gif`, which was doing
 * quadruple duty as the <video> poster, the Open Graph image, the Twitter
 * card, and the JSON-LD thumbnail. A poster/thumbnail should be a light
 * *static* frame — an animated GIF of that size forced every visitor and
 * every social-preview crawler to download ~1.9 MB for a still, hurting LCP
 * and producing blank/oversized previews on platforms that reject large or
 * animated OG images.
 *
 * Generated via next/og (same Satori pipeline as the root opengraph-image
 * and the /api/og/* card routes). 1280×720 to match the declared video
 * dimensions so the poster fills the player with no letterboxing.
 *
 * Satori reminder: flex only, no display:grid.
 */

export const size = { width: 1280, height: 720 };
export const contentType = "image/png";
export const alt = "VC Deal Flow Signal MCP Server — Claude Desktop Demo";

export default function McpDemoPoster() {
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
          padding: "72px",
        }}
      >
        {/* Brand */}
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "#0ea5e9",
            fontWeight: 600,
            marginBottom: "auto",
          }}
        >
          VC Deal Flow Signal
        </div>

        {/* Center: play glyph + title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "32px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 112,
              height: 112,
              borderRadius: 56,
              backgroundColor: "#0ea5e9",
              flexShrink: 0,
            }}
          >
            {/* Play triangle (left-padded so it reads centered) */}
            <div
              style={{
                display: "flex",
                width: 0,
                height: 0,
                marginLeft: 8,
                borderTop: "26px solid transparent",
                borderBottom: "26px solid transparent",
                borderLeft: "42px solid #0f172a",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex", fontSize: 60, fontWeight: 700, lineHeight: 1.1 }}>
              MCP Server Demo
            </div>
            <div style={{ display: "flex", fontSize: 32, color: "#94a3b8", marginTop: 8 }}>
              Running live inside Claude Desktop
            </div>
          </div>
        </div>

        {/* Feature row */}
        <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
          {["Trending startups", "Sector signal search", "Deep-signal lookup"].map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                fontSize: 20,
                color: "#cbd5e1",
                backgroundColor: "#1e293b",
                borderRadius: 10,
                padding: "10px 18px",
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div
          style={{
            display: "flex",
            marginTop: "auto",
            fontSize: 20,
            color: "#475569",
          }}
        >
          signals.gitdealflow.com/mcp-demo · 72s · free, no API key
        </div>
      </div>
    ),
    size
  );
}
