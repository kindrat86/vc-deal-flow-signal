import { ImageResponse } from "next/og";
import { getStartupProfile } from "@/lib/data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "VC Deal Flow Signal, Startup engineering acceleration";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const profile = getStartupProfile(slug);

  if (!profile) {
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

  const latest = profile.history[0];
  const accent =
    latest.signalType === "BREAKOUT" || latest.signalType === "ACCELERATING"
      ? "#22d3ee"
      : "#0ea5e9";

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
            "radial-gradient(circle at 80% 0%, rgba(14,165,233,0.18), transparent 60%), radial-gradient(circle at 0% 100%, rgba(34,211,238,0.12), transparent 50%)",
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
              color: accent,
              fontWeight: 700,
            }}
          >
            VC Deal Flow Signal · Startup
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 16,
              color: "#cbd5e1",
              padding: "6px 12px",
              borderRadius: 999,
              border: `1px solid ${accent}`,
              backgroundColor: "rgba(14,165,233,0.10)",
              fontWeight: 600,
            }}
          >
            {latest.signalType}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 800,
            marginBottom: "10px",
            lineHeight: 1.1,
          }}
        >
          {profile.name}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "#94a3b8",
            marginBottom: "40px",
            maxWidth: "1080px",
          }}
        >
          {(profile.description || "").length > 160
            ? profile.description.slice(0, 157) + "..."
            : profile.description || "GitHub engineering acceleration profile"}
        </div>

        <div style={{ display: "flex", gap: "32px", marginTop: "auto" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 44,
                fontWeight: 700,
                color: accent,
              }}
            >
              {latest.commitVelocityChange}
            </div>
            <div style={{ display: "flex", fontSize: 16, color: "#64748b" }}>
              Commit velocity Δ
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 44,
                fontWeight: 700,
                color: accent,
              }}
            >
              {latest.contributors}
            </div>
            <div style={{ display: "flex", fontSize: 16, color: "#64748b" }}>
              Contributors
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 44,
                fontWeight: 700,
                color: accent,
              }}
            >
              {latest.commitVelocity14d ?? "-"}
            </div>
            <div style={{ display: "flex", fontSize: 16, color: "#64748b" }}>
              Commits / 14d
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "30px",
            justifyContent: "space-between",
            fontSize: 14,
            color: "#475569",
          }}
        >
          <div style={{ display: "flex" }}>
            signals.gitdealflow.com/startup/{slug}
          </div>
          <div style={{ display: "flex" }}>{latest.periodName || ""}</div>
        </div>
      </div>
    ),
    size
  );
}
