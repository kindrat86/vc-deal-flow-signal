import { ImageResponse } from "next/og";
import { getAgentQueryBySlug } from "@/content/agent-queries";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "VC Deal Flow Signal, Answer";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const q = getAgentQueryBySlug(slug);

  const title = q?.h1 ?? "VC Deal Flow Signal, Answer";
  const tldr = q?.tldr ?? "";

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
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 20,
              color: "#0ea5e9",
              fontWeight: 600,
            }}
          >
            VC Deal Flow Signal
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 14,
              color: "#0ea5e9",
              backgroundColor: "rgba(14, 165, 233, 0.15)",
              border: "1px solid rgba(14, 165, 233, 0.4)",
              borderRadius: "999px",
              padding: "6px 14px",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontWeight: 600,
            }}
          >
            ANSWER · CITATION-READY
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 52,
            fontWeight: 700,
            lineHeight: 1.15,
            marginBottom: "28px",
          }}
        >
          {title}
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
          {tldr.length > 240 ? tldr.slice(0, 237) + "..." : tldr}
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
            signals.gitdealflow.com/answers/{slug}
          </div>
          <div style={{ display: "flex", fontSize: 16, color: "#475569" }}>
            CC-BY 4.0 · cite freely
          </div>
        </div>
      </div>
    ),
    size,
  );
}
