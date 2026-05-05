import { ImageResponse } from "next/og";
import { pillars } from "@/content/pillars";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "VC Deal Flow Signal — Topical series";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pillar = pillars[slug];

  if (!pillar) {
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
          VC Deal Flow Signal · Topics
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
            "linear-gradient(135deg, #0f172a 0%, #0a1024 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "#0ea5e9",
            fontWeight: 700,
            marginBottom: "20px",
          }}
        >
          VC Deal Flow Signal · Topical Series
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 56,
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: "20px",
          }}
        >
          {pillar.name}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "#94a3b8",
            lineHeight: 1.45,
            maxWidth: "1080px",
            marginBottom: "30px",
          }}
        >
          {(pillar.description || "").slice(0, 220)}
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            marginBottom: "auto",
          }}
        >
          {(pillar.keywords || []).slice(0, 6).map((kw) => (
            <div
              key={kw}
              style={{
                display: "flex",
                padding: "6px 12px",
                fontSize: 14,
                color: "#cbd5e1",
                border: "1px solid #1e293b",
                borderRadius: 6,
                backgroundColor: "rgba(14,165,233,0.04)",
              }}
            >
              {kw}
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "30px",
            justifyContent: "space-between",
            fontSize: 16,
            color: "#475569",
          }}
        >
          <div style={{ display: "flex" }}>
            signals.gitdealflow.com/topics/{slug}
          </div>
          <div style={{ display: "flex", color: "#0ea5e9", fontWeight: 600 }}>
            Topic cluster
          </div>
        </div>
      </div>
    ),
    size
  );
}
