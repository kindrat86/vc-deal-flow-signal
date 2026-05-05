import { ImageResponse } from "next/og";
import { getStagePageData, getCurrentPeriod } from "@/lib/data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "VC Deal Flow Signal — Stage";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const d = getStagePageData(slug);
  const period = getCurrentPeriod();

  const headline = d
    ? `${d.name} Startups — ${period.name}`
    : "VC Deal Flow Signal";
  const subhead = d
    ? `${d.startups.length} ${d.name.toLowerCase()} startups across ${d.sectorBreakdown.length} sectors with breakout engineering signals.`
    : "";
  const stat = d ? String(d.startups.length) : "";
  const statLabel = d ? `${d.name.toLowerCase()} startups tracked` : "";

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
            Stage · {period.name}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 56, fontWeight: 700, lineHeight: 1.15, marginBottom: "20px" }}>
          {headline}
        </div>
        <div style={{ display: "flex", fontSize: 22, color: "#94a3b8", lineHeight: 1.4, maxWidth: "900px", marginBottom: "20px" }}>
          {subhead}
        </div>
        {stat && (
          <div style={{ display: "flex", gap: "12px", alignItems: "baseline" }}>
            <div style={{ display: "flex", fontSize: 80, fontWeight: 800, color: "#0ea5e9" }}>{stat}</div>
            <div style={{ display: "flex", fontSize: 18, color: "#64748b" }}>{statLabel}</div>
          </div>
        )}
        <div style={{ display: "flex", marginTop: "auto", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 16, color: "#475569" }}>
            signals.gitdealflow.com/stage/{slug}
          </div>
          <div style={{ display: "flex", fontSize: 16, color: "#475569" }}>CC BY 4.0</div>
        </div>
      </div>
    ),
    size
  );
}
