import { ImageResponse } from "next/og";
import { parseBestSectorSlug, getSortedStartups } from "@/lib/data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "VC Deal Flow Signal — Best startups by sector";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const parsed = parseBestSectorSlug(slug);

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

  const { sector, year, snapshot } = parsed;
  let topStartups: Array<{ name: string; commitVelocityChange: string }> = [];
  try {
    topStartups = getSortedStartups(snapshot.startups)
      .slice(0, 3)
      .map((s) => ({
        name: s.name,
        commitVelocityChange: s.commitVelocityChange,
      }));
  } catch {
    topStartups = [];
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
            "linear-gradient(135deg, #0f172a 0%, #0b1226 100%)",
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
          VC Deal Flow Signal · Best of {year}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 60,
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: "20px",
          }}
        >
          Best {sector.name}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#94a3b8",
            marginBottom: "40px",
          }}
        >
          Startups {year} · ranked by GitHub commit-velocity acceleration
        </div>

        {topStartups.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "auto" }}>
            {topStartups.map((s, i) => (
              <div
                key={s.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  fontSize: 24,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    width: 40,
                    height: 40,
                    backgroundColor: "#0ea5e9",
                    color: "#0f172a",
                    borderRadius: 999,
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ display: "flex", fontWeight: 600 }}>{s.name}</div>
                <div style={{ display: "flex", color: "#22d3ee", fontWeight: 600 }}>
                  {s.commitVelocityChange}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <div
          style={{
            display: "flex",
            marginTop: topStartups.length > 0 ? "30px" : "auto",
            fontSize: 16,
            color: "#475569",
          }}
        >
          signals.gitdealflow.com/best/{slug}
        </div>
      </div>
    ),
    size
  );
}
