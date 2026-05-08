import { ImageResponse } from "next/og";

export const runtime = "nodejs";

const MAX_QUOTE_LEN = 240;
const MAX_CHAPTER_LEN = 80;

/**
 * Quote-card OG image. Per-chapter shareable artefact: the reader picks any
 * sentence from any chapter, hits "share this insight", and we render a
 * 1200×630 PNG with the quote, chapter label, and book attribution.
 *
 * The query string is the only state — `q` is the quote, `c` is the chapter
 * label. Both are length-clamped to keep the cache key bounded and to fit
 * the layout. Cache for a week — same params hash to same image.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawQuote = (searchParams.get("q") || "").slice(0, MAX_QUOTE_LEN).trim();
  const rawChapter = (searchParams.get("c") || "").slice(0, MAX_CHAPTER_LEN).trim();

  const quote =
    rawQuote ||
    "Engineering acceleration leads. The deck lags by 21 to 47 days.";
  const chapter = rawChapter || "From the methodology book";

  // Dynamic font sizing: longer quotes shrink one tier so the layout stays
  // balanced without hard-truncating.
  const len = quote.length;
  const quoteFontSize = len > 180 ? 40 : len > 120 ? 48 : len > 60 ? 56 : 64;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(135deg, #0b1220 0%, #0c1a2e 60%, #0b1220 100%)",
          color: "#f1f5f9",
          padding: 64,
          position: "relative",
        }}
      >
        {/* Top tag */}
        <div
          style={{
            display: "flex",
            fontSize: 18,
            fontWeight: 700,
            color: "#0ea5e9",
            letterSpacing: 2.2,
            textTransform: "uppercase",
            marginBottom: 36,
          }}
        >
          GITDEALFLOW · METHODOLOGY BOOK
        </div>

        {/* Big quote mark */}
        <div
          style={{
            display: "flex",
            fontSize: 120,
            color: "#0ea5e9",
            opacity: 0.35,
            lineHeight: 0.9,
            marginBottom: -20,
          }}
        >
          “
        </div>

        {/* Quote */}
        <div
          style={{
            display: "flex",
            fontSize: quoteFontSize,
            fontWeight: 700,
            lineHeight: 1.18,
            letterSpacing: -1,
            color: "#f1f5f9",
            maxWidth: 1050,
            flex: 1,
          }}
        >
          {quote}
        </div>

        {/* Chapter attribution */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            paddingTop: 28,
            borderTop: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: "#94a3b8",
            }}
          >
            — {chapter}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 6,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 22,
                color: "#cbd5e1",
              }}
            >
              The 7 GitHub Signals That Predict Series A Rounds
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 22,
                fontWeight: 700,
                color: "#fbbf24",
              }}
            >
              signals.gitdealflow.com/book
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=604800, immutable",
      },
    },
  );
}
