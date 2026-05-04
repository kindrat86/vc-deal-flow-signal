import { ImageResponse } from "next/og";
import { getSignalTypeData, getCurrentPeriod } from "@/lib/data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "VC Deal Flow Signal — Signal Type";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const d = getSignalTypeData(slug);
  const period = getCurrentPeriod();

  const headline = d
    ? `${d.name} — ${period.name}`
    : "VC Deal Flow Signal";
  const subhead = d
    ? `${d.totalAcrossSectors} startups currently classify under "${d.name.toLowerCase()}". ${d.description.length > 110 ? d.description.slice(0, 107) + "..." : d.description}`
    : "";

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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <div style={{ display: "flex", fontSize: 20, color: "#0ea5e9", fontWeight: 600 }}>
            VC Deal Flow Signal
          </div>
          <div style={{ display: "flex", fontSize: 18, color: "#64748b" }}>
            Signal Type
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 52,
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: "20px",
          }}
        >
          {headline}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "#94a3b8",
            lineHeight: 1.4,
            maxWidth: "900px",
          }}
        >
          {subhead}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "auto",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", fontSize: 16, color: "#475569" }}>
            signals.gitdealflow.com/signals/{slug}
          </div>
          <div style={{ display: "flex", fontSize: 16, color: "#475569" }}>
            CC BY 4.0
          </div>
        </div>
      </div>
    ),
    size
  );
}
