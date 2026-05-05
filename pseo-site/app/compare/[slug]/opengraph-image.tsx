import { ImageResponse } from "next/og";
import { getComparison } from "@/content/comparisons";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "VC Deal Flow Signal — Comparison guide";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const comp = getComparison(slug);

  if (!comp) {
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
          VC Deal Flow Signal · Compare
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
            marginBottom: "30px",
          }}
        >
          VC Deal Flow Signal · Comparison
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 48,
            fontWeight: 800,
            lineHeight: 1.18,
            marginBottom: "20px",
          }}
        >
          {(comp.h1 || comp.title || "Comparison").slice(0, 130)}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "#94a3b8",
            lineHeight: 1.45,
            maxWidth: "1080px",
          }}
        >
          {(comp.description || "").slice(0, 220)}
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
            signals.gitdealflow.com/compare/{slug}
          </div>
          <div style={{ display: "flex", color: "#0ea5e9", fontWeight: 600 }}>
            Side-by-side
          </div>
        </div>
      </div>
    ),
    size
  );
}
