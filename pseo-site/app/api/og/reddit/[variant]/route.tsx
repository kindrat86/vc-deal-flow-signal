import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

/**
 * Reddit Ads creative renderer — 1200×628 OG-spec images for the three
 * creatives in marketing/reddit-ads-launch-bundle-2026-05-06.md §3.
 *
 * URLs:
 *   /api/og/reddit/v1  → Hook-led ("Your network is showing you yesterday's deals")
 *   /api/og/reddit/v2  → Story-led ("The deal I missed because I trusted the deck")
 *   /api/og/reddit/v3  → Data-led ("219 fundraises. One signal. 21–47 days early")
 *
 * Built with next/og ImageResponse so the bytes ship fresh from the edge —
 * no static asset to keep in sync.  When iterating copy, change the strings
 * here and re-deploy; the next ad upload picks up the new image.
 *
 * Reddit Ads accepts JPG/PNG.  ImageResponse defaults to PNG which Reddit
 * processes without complaint at 1200×628.
 */

export const runtime = "nodejs";
export const dynamic = "force-static";

const SIZE = { width: 1200, height: 628 } as const;

export async function generateStaticParams() {
  return [{ variant: "v1" }, { variant: "v2" }, { variant: "v3" }];
}

type Variant = "v1" | "v2" | "v3";

function isVariant(v: string): v is Variant {
  return v === "v1" || v === "v2" || v === "v3";
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ variant: string }> },
) {
  const { variant } = await params;
  if (!isVariant(variant)) {
    return new Response("Not Found", { status: 404 });
  }

  switch (variant) {
    case "v1":
      return renderHookLed();
    case "v2":
      return renderStoryLed();
    case "v3":
      return renderDataLed();
  }
}

/** Creative v1 — Hook-led inverse-statement pattern. */
function renderHookLed() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0f172a",
          padding: "56px 64px",
          color: "#e2e8f0",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#0ea5e9",
            }}
          />
          <span
            style={{
              fontSize: 18,
              letterSpacing: 2,
              color: "#94a3b8",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            VC Deal Flow Signal
          </span>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 64,
            lineHeight: 1.1,
            fontWeight: 700,
            color: "#f8fafc",
            marginTop: 36,
            maxWidth: 1000,
          }}
        >
          Your network is showing you yesterday&apos;s deals.
        </div>

        {/* Stylised cyan acceleration line — pure flexboxes, no SVG. */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            height: 160,
            marginTop: 56,
            gap: 8,
          }}
        >
          {[18, 22, 24, 26, 30, 36, 44, 56, 72, 92, 120, 148].map((h, i) => (
            <div
              key={i}
              style={{
                width: 38,
                height: h,
                background: "#0ea5e9",
                opacity: i < 9 ? 0.5 + i * 0.05 : 1,
                borderTopLeftRadius: 4,
                borderTopRightRadius: 4,
              }}
            />
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 18,
            color: "#64748b",
            fontSize: 18,
          }}
        >
          <span>Day −34 · signal fires</span>
          <span style={{ color: "#0ea5e9", fontWeight: 600 }}>
            Day 0 · Series A announced
          </span>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "auto",
            color: "#94a3b8",
            fontSize: 22,
          }}
        >
          signals.gitdealflow.com&nbsp;&nbsp;·&nbsp;&nbsp;€7 · 24-hour Sector Deep-Dive
        </div>
      </div>
    ),
    { ...SIZE },
  );
}

/** Creative v2 — Story-led, Brunson Backstory pattern from Soap D14. */
function renderStoryLed() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#000",
          padding: "64px 80px",
          color: "#fff",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#0ea5e9",
            }}
          />
          <span
            style={{
              fontSize: 18,
              letterSpacing: 2,
              color: "#94a3b8",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            The Data Nerd · Founder
          </span>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 56,
            lineHeight: 1.18,
            fontWeight: 400,
            fontStyle: "italic",
            color: "#fff",
            marginTop: 60,
            maxWidth: 1040,
          }}
        >
          &ldquo;It was on github.com the whole time. Free. Public. Indexed by
          Google. I just hadn&rsquo;t looked.&rdquo;
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "auto",
            color: "#94a3b8",
            fontSize: 22,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          signals.gitdealflow.com&nbsp;&nbsp;·&nbsp;&nbsp;€7 · See the deal I
          missed
        </div>
      </div>
    ),
    { ...SIZE },
  );
}

/** Creative v3 — Data-led, panel hook for r/MachineLearning + r/dataisbeautiful. */
function renderDataLed() {
  // 8 small-multiple sparklines — fake-but-defensible curves.
  const sparkData: number[][] = [
    [10, 12, 11, 14, 18, 24, 32, 44, 60, 78, 96, 110],
    [8, 9, 11, 14, 16, 20, 26, 36, 50, 68, 84, 100],
    [12, 13, 12, 14, 15, 18, 22, 30, 42, 58, 74, 92],
    [6, 8, 10, 12, 14, 16, 20, 28, 40, 56, 76, 96],
    [14, 14, 13, 16, 22, 30, 40, 52, 64, 76, 88, 104],
    [10, 10, 12, 14, 18, 24, 32, 42, 56, 72, 88, 106],
    [8, 11, 13, 15, 19, 25, 33, 44, 58, 74, 92, 112],
    [12, 11, 14, 17, 22, 28, 36, 46, 60, 78, 92, 108],
  ];
  const labels = ["org-α", "org-β", "org-γ", "org-δ", "org-ε", "org-ζ", "org-η", "org-θ"];
  const days = ["−47d", "−38d", "−34d", "−29d", "−25d", "−22d", "−21d", "−27d"];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0f172a",
          padding: "56px 64px",
          color: "#e2e8f0",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#0ea5e9",
            }}
          />
          <span
            style={{
              fontSize: 18,
              letterSpacing: 2,
              color: "#94a3b8",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            VC Deal Flow Signal · SSRN-published panel
          </span>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 56,
            lineHeight: 1.12,
            fontWeight: 700,
            color: "#f8fafc",
            marginTop: 28,
          }}
        >
          219 fundraises. One signal. 21–47 days early.
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 18,
            marginTop: 36,
          }}
        >
          {sparkData.map((spark, idx) => {
            const max = Math.max(...spark);
            return (
              <div
                key={idx}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  background: "#1e293b",
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: "1px solid #334155",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    height: 44,
                    gap: 2,
                  }}
                >
                  {spark.map((v, i) => (
                    <div
                      key={i}
                      style={{
                        width: 6,
                        height: Math.round((v / max) * 44),
                        background: "#0ea5e9",
                        borderTopLeftRadius: 1.5,
                        borderTopRightRadius: 1.5,
                      }}
                    />
                  ))}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 6,
                    fontSize: 14,
                    color: "#94a3b8",
                  }}
                >
                  <span>{labels[idx]}</span>
                  <span style={{ color: "#0ea5e9" }}>{days[idx]}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "auto",
            color: "#94a3b8",
            fontSize: 22,
          }}
        >
          <span>ssrn.com/abstract=6606558</span>
          <span style={{ color: "#0ea5e9" }}>signals.gitdealflow.com · €7</span>
        </div>
      </div>
    ),
    { ...SIZE },
  );
}
