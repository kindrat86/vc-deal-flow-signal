import { ImageResponse } from "next/og";

/**
 * Per-route OG image for /firstlook.
 *
 * Auto-attached by Next.js to `<meta property="og:image">` and
 * `<meta name="twitter:image">` when /firstlook is shared. Closes the F1
 * audit gap (Pass VIII regression: page had openGraph block but no images).
 *
 * File-convention path means we do NOT need to edit page.tsx — Next.js
 * merges this image into the existing openGraph metadata at build time.
 */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "First Look Pass — €7 sector deep dive in 24 hours";

export default async function FirstLookOGImage() {
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
        {/* Brand */}
        <div
          style={{
            display: "flex",
            fontSize: 20,
            color: "#0ea5e9",
            fontWeight: 600,
            marginBottom: "30px",
          }}
        >
          VC Deal Flow Signal · First Look Pass
        </div>

        {/* Price tag */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 96,
              fontWeight: 800,
              color: "#0ea5e9",
              lineHeight: 1,
            }}
          >
            €7
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 18,
              color: "#94a3b8",
              lineHeight: 1.3,
            }}
          >
            <div style={{ display: "flex" }}>once · one sector</div>
            <div style={{ display: "flex" }}>24-hour deep dive</div>
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            fontSize: 44,
            fontWeight: 700,
            lineHeight: 1.15,
            marginBottom: "28px",
            maxWidth: "1000px",
          }}
        >
          Top 25 ranked GitHub orgs · 14-day acceleration deltas · 3 pre-Crunchbase breakouts
        </div>

        {/* Stack chips */}
        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
          {[
            "19 sectors",
            "Contributor maps",
            "Raw CSV",
            "Credited if you upgrade",
          ].map((chip) => (
            <div
              key={chip}
              style={{
                display: "flex",
                fontSize: 18,
                color: "#cbd5e1",
                backgroundColor: "#1e293b",
                padding: "8px 18px",
                borderRadius: "999px",
                border: "1px solid #334155",
              }}
            >
              {chip}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            marginTop: "auto",
            fontSize: 16,
            color: "#475569",
          }}
        >
          signals.gitdealflow.com/firstlook
        </div>
      </div>
    ),
    size
  );
}
