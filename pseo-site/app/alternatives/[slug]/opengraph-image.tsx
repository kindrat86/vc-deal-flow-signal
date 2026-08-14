import { ImageResponse } from "next/og";
import { getAlternative } from "@/content/alternatives";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "VC Deal Flow Signal, Alternative comparison";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getAlternative(slug);

  if (!item) {
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
            "linear-gradient(135deg, #0f172a 0%, #050a1c 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "#0ea5e9",
            fontWeight: 700,
            marginBottom: "24px",
          }}
        >
          VC Deal Flow Signal · Alternative
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "30px",
            marginBottom: "40px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ display: "flex", fontSize: 38, color: "#94a3b8", fontWeight: 700 }}>
              {item.competitor}
            </div>
            <div style={{ display: "flex", fontSize: 14, color: "#64748b" }}>
              Existing tool
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 60, color: "#0ea5e9", fontWeight: 800 }}>
            ↔
          </div>
          <div style={{ display: "flex", flexDirection: "column", flex: 1, alignItems: "flex-end" }}>
            <div
              style={{
                display: "flex",
                fontSize: 38,
                color: "#22d3ee",
                fontWeight: 800,
              }}
            >
              GitDealFlow
            </div>
            <div style={{ display: "flex", fontSize: 14, color: "#64748b" }}>
              GitHub commit-velocity edge
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 30,
            fontWeight: 700,
            lineHeight: 1.25,
            color: "#f1f5f9",
          }}
        >
          {(item.tagline || item.h1 || "Alternative comparison").slice(0, 120)}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "auto",
            justifyContent: "space-between",
            fontSize: 16,
            color: "#475569",
          }}
        >
          <div style={{ display: "flex" }}>
            signals.gitdealflow.com/alternatives/{slug}
          </div>
          <div style={{ display: "flex", color: "#0ea5e9", fontWeight: 600 }}>
            Compare · Side-by-side
          </div>
        </div>
      </div>
    ),
    size
  );
}
