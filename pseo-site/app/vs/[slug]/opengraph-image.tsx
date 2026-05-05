import { ImageResponse } from "next/og";
import { competitors, getCompetitorVsPair } from "@/content/competitor-vs";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "VC Deal Flow Signal — Vendor head-to-head";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pair = getCompetitorVsPair(slug);
  const a = pair ? competitors[pair.a] : undefined;
  const b = pair ? competitors[pair.b] : undefined;

  if (!pair || !a || !b) {
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
            "linear-gradient(135deg, #0f172a 0%, #050a1c 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "#0ea5e9",
            fontWeight: 700,
            marginBottom: "20px",
          }}
        >
          VC Deal Flow Signal · Head-to-head
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "40px",
            marginBottom: "40px",
          }}
        >
          <div style={{ display: "flex", fontSize: 56, fontWeight: 800, flex: 1 }}>
            {a.name}
          </div>
          <div style={{ display: "flex", fontSize: 36, color: "#0ea5e9", fontWeight: 700 }}>
            vs
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 56,
              fontWeight: 800,
              flex: 1,
              justifyContent: "flex-end",
            }}
          >
            {b.name}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "40px",
            marginBottom: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              padding: "20px",
              border: "1px solid #1e293b",
              borderRadius: 12,
              backgroundColor: "rgba(14,165,233,0.04)",
            }}
          >
            <div style={{ display: "flex", fontSize: 14, color: "#94a3b8", marginBottom: 6 }}>
              Signal type
            </div>
            <div style={{ display: "flex", fontSize: 18, color: "#cbd5e1" }}>
              {(a.signalType || "—").slice(0, 60)}
            </div>
            <div style={{ display: "flex", fontSize: 14, color: "#94a3b8", marginTop: 14, marginBottom: 6 }}>
              Lead time
            </div>
            <div style={{ display: "flex", fontSize: 18, color: "#cbd5e1" }}>
              {(a.leadTime || "—").slice(0, 50)}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              padding: "20px",
              border: "1px solid #1e293b",
              borderRadius: 12,
              backgroundColor: "rgba(34,211,238,0.04)",
            }}
          >
            <div style={{ display: "flex", fontSize: 14, color: "#94a3b8", marginBottom: 6 }}>
              Signal type
            </div>
            <div style={{ display: "flex", fontSize: 18, color: "#cbd5e1" }}>
              {(b.signalType || "—").slice(0, 60)}
            </div>
            <div style={{ display: "flex", fontSize: 14, color: "#94a3b8", marginTop: 14, marginBottom: 6 }}>
              Lead time
            </div>
            <div style={{ display: "flex", fontSize: 18, color: "#cbd5e1" }}>
              {(b.leadTime || "—").slice(0, 50)}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "30px",
            justifyContent: "space-between",
            fontSize: 16,
            color: "#475569",
          }}
        >
          <div style={{ display: "flex" }}>signals.gitdealflow.com/vs/{slug}</div>
          <div style={{ display: "flex", color: "#0ea5e9", fontWeight: 600 }}>
            Independent comparison
          </div>
        </div>
      </div>
    ),
    size
  );
}
