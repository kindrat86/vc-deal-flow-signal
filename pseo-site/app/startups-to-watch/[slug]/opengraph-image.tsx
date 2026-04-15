import { ImageResponse } from "next/og";
import { parsePageSlug, getSortedStartups } from "@/lib/data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "VC Deal Flow Signal — Sector Rankings";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const parsed = parsePageSlug(slug);

  if (!parsed) {
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

  const { sector, period, snapshot } = parsed;
  const sorted = getSortedStartups(snapshot.startups);
  const top3 = sorted.slice(0, 3);

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
        {/* Top bar */}
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
            {period.name} Edition
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            fontSize: 52,
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: "16px",
          }}
        >
          {sector.name} Startups to Watch
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "#94a3b8",
            marginBottom: "40px",
          }}
        >
          {snapshot.startups.length} startups ranked by engineering acceleration
        </div>

        {/* Top 3 */}
        <div style={{ display: "flex", gap: "20px" }}>
          {top3.map((s, i) => (
            <div
              key={s.name}
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#1e293b",
                borderRadius: "12px",
                padding: "20px 24px",
                flex: 1,
                borderLeft: i === 0 ? "4px solid #0ea5e9" : "4px solid #334155",
              }}
            >
              <div style={{ display: "flex", fontSize: 14, color: "#64748b", marginBottom: "6px" }}>
                #{i + 1}
              </div>
              <div style={{ display: "flex", fontSize: 22, fontWeight: 600, marginBottom: "8px" }}>
                {s.name}
              </div>
              <div style={{ display: "flex", fontSize: 16, color: "#0ea5e9" }}>
                {s.commitVelocityChange} velocity · {s.contributors} contributors
              </div>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div
          style={{
            display: "flex",
            marginTop: "auto",
            fontSize: 16,
            color: "#475569",
          }}
        >
          signals.gitdealflow.com
        </div>
      </div>
    ),
    size
  );
}
