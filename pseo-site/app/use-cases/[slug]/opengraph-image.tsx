import { ImageResponse } from "next/og";
import { getUseCase } from "@/content/use-cases";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "VC Deal Flow Signal — Use Case";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const uc = getUseCase(slug);

  const headline = uc ? uc.h1 : "VC Deal Flow Signal";
  const subhead = uc
    ? (uc.tagline.length > 160 ? uc.tagline.slice(0, 157) + "..." : uc.tagline)
    : "";
  const persona = uc ? uc.persona : "";

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
            For {persona}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 52, fontWeight: 700, lineHeight: 1.15, marginBottom: "20px" }}>
          {headline}
        </div>
        <div style={{ display: "flex", fontSize: 22, color: "#94a3b8", lineHeight: 1.4, maxWidth: "900px" }}>
          {subhead}
        </div>
        <div style={{ display: "flex", marginTop: "auto", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 16, color: "#475569" }}>
            signals.gitdealflow.com/use-cases/{slug}
          </div>
          <div style={{ display: "flex", fontSize: 16, color: "#475569" }}>CC BY 4.0</div>
        </div>
      </div>
    ),
    size
  );
}
