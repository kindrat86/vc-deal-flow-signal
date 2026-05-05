import { ImageResponse } from "next/og";
import { parseBestSectorSlug } from "@/lib/data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "VC Deal Flow Signal — Best Startups";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const parsed = parseBestSectorSlug(slug);

  const headline = parsed
    ? `Best ${parsed.sector.name} Startups ${parsed.year}`
    : "VC Deal Flow Signal";
  const subhead = parsed
    ? `Top engineering momentum across ${parsed.snapshot.startups.length} ${parsed.sector.name.toLowerCase()} startups, ${parsed.year}.`
    : "";
  const stat = parsed
    ? String(parsed.snapshot.startups.length)
    : "";
  const statLabel = parsed
    ? `${parsed.sector.name} startups`
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <div style={{ display: "flex", fontSize: 20, color: "#0ea5e9", fontWeight: 600 }}>
            VC Deal Flow Signal
          </div>
          <div style={{ display: "flex", fontSize: 18, color: "#64748b" }}>
            Best Startups · {parsed?.year ?? ""}
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
            signals.gitdealflow.com/best/{slug}
          </div>
          <div style={{ display: "flex", fontSize: 16, color: "#475569" }}>CC BY 4.0</div>
        </div>
      </div>
    ),
    size
  );
}
