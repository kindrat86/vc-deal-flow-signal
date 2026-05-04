import { ImageResponse } from "next/og";
import { getCompetitorVsPair, competitors } from "@/content/competitor-vs";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "VC Deal Flow Signal — Head-to-Head";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vs = getCompetitorVsPair(slug);

  let headline = "VC Deal Flow Signal";
  let subhead = "";
  if (vs) {
    const a = competitors[vs.a]?.name ?? vs.a;
    const b = competitors[vs.b]?.name ?? vs.b;
    headline = `${a} vs ${b}`;
    subhead = vs.verdict.length > 160 ? vs.verdict.slice(0, 157) + "..." : vs.verdict;
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
            Head-to-Head
          </div>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 56,
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
            signals.gitdealflow.com/vs/{slug}
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
