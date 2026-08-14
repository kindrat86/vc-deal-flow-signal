import { ImageResponse } from "next/og";
import { getUseCase } from "@/content/use-cases";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "VC Deal Flow Signal, Use case workflow";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const uc = getUseCase(slug);

  if (!uc) {
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
          VC Deal Flow Signal · Use Case
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
            "linear-gradient(135deg, #0f172a 0%, #0a1224 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: "#0ea5e9",
              fontWeight: 700,
            }}
          >
            VC Deal Flow Signal · Use Case
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 16,
              color: "#cbd5e1",
              padding: "6px 12px",
              border: "1px solid #1e293b",
              borderRadius: 999,
              backgroundColor: "rgba(14,165,233,0.08)",
              fontWeight: 600,
            }}
          >
            For {uc.persona}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 50,
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: "20px",
          }}
        >
          {(uc.h1 || uc.title || "").slice(0, 110)}
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
          {(uc.tagline || uc.description || "").slice(0, 200)}
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
            signals.gitdealflow.com/use-cases/{slug}
          </div>
          <div style={{ display: "flex", color: "#0ea5e9", fontWeight: 600 }}>
            Workflow guide
          </div>
        </div>
      </div>
    ),
    size
  );
}
