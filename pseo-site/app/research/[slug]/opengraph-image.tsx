import { ImageResponse } from "next/og";
import { getFindingBySlug } from "@/content/research-findings";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "VC Deal Flow Signal, SSRN-anchored research finding";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const finding = getFindingBySlug(slug);

  if (!finding) {
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

  const claim =
    finding.claim.length > 220
      ? finding.claim.slice(0, 217) + "..."
      : finding.claim;

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
            "linear-gradient(135deg, #0f172a 0%, #0b1226 60%, #051129 100%)",
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
          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: "#0ea5e9",
              fontWeight: 700,
              letterSpacing: 0.4,
            }}
          >
            VC Deal Flow Signal · Research
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 18,
              color: "#64748b",
              padding: "6px 12px",
              border: "1px solid #1e293b",
              borderRadius: 6,
            }}
          >
            {finding.section}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 44,
            fontWeight: 700,
            lineHeight: 1.18,
            marginBottom: "24px",
          }}
        >
          {claim}
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
          {finding.why.length > 200
            ? finding.why.slice(0, 197) + "..."
            : finding.why}
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
            signals.gitdealflow.com/research
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 16,
              color: "#0ea5e9",
              fontWeight: 600,
            }}
          >
            SSRN abstract=6606558 · CC BY 4.0
          </div>
        </div>
      </div>
    ),
    size
  );
}
