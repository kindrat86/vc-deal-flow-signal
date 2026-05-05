import { ImageResponse } from "next/og";
import { pillars, getPostsInPillar } from "@/content/pillars";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "VC Deal Flow Signal — Topical Series";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pillar = pillars[slug];

  const headline = pillar ? pillar.name : "VC Deal Flow Signal";
  const subhead = pillar
    ? (pillar.description.length > 160
        ? pillar.description.slice(0, 157) + "..."
        : pillar.description)
    : "";
  const postCount = pillar ? getPostsInPillar(slug).length : 0;

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
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <div style={{ display: "flex", fontSize: 20, color: "#0ea5e9", fontWeight: 600 }}>
            VC Deal Flow Signal
          </div>
          <div style={{ display: "flex", fontSize: 18, color: "#64748b" }}>
            Topical Series
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 56, fontWeight: 700, lineHeight: 1.15, marginBottom: "20px" }}>
          {headline}
        </div>
        <div style={{ display: "flex", fontSize: 22, color: "#94a3b8", lineHeight: 1.4, maxWidth: "900px", marginBottom: "20px" }}>
          {subhead}
        </div>
        {postCount > 0 && (
          <div style={{ display: "flex", gap: "12px", alignItems: "baseline" }}>
            <div style={{ display: "flex", fontSize: 80, fontWeight: 800, color: "#0ea5e9" }}>{postCount}</div>
            <div style={{ display: "flex", fontSize: 18, color: "#64748b" }}>articles in this series</div>
          </div>
        )}
        <div style={{ display: "flex", marginTop: "auto", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 16, color: "#475569" }}>
            signals.gitdealflow.com/topics/{slug}
          </div>
          <div style={{ display: "flex", fontSize: 16, color: "#475569" }}>CC BY 4.0</div>
        </div>
      </div>
    ),
    size
  );
}
