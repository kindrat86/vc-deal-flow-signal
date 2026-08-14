import { ImageResponse } from "next/og";
import { getCurrentPeriod, getAllSectors, getSortedStartups } from "@/lib/data";
import { slugify } from "@/lib/slugify";

export const runtime = "nodejs";

const SIGNAL_COLOR: Record<string, string> = {
  breakout: "#fb7185",
  acceleration: "#fbbf24",
  steady: "#34d399",
  cooling: "#94a3b8",
};

function pickColor(signalType: string): string {
  const slug = signalType.toLowerCase().replace(/\s+/g, "-");
  for (const key of Object.keys(SIGNAL_COLOR)) {
    if (slug.includes(key)) return SIGNAL_COLOR[key];
  }
  return "#0ea5e9";
}

// ─── Launch-day branch ─────────────────────────────────────────────────────
// `?template=launch` renders a Product Hunt launch card. Auto-expires at PT
// midnight on Apr 27 (08:00 UTC; PDT is UTC-7) and falls back to the standard
// signal card after that. Keeps shareable cards meaningful post-launch without
// touching scheduled tasks.
const LAUNCH_END_UTC = "2026-04-27T07:00:00Z";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const requestedName = url.searchParams.get("name");
    const template = url.searchParams.get("template");

    if (template === "launch" && Date.now() < Date.parse(LAUNCH_END_UTC)) {
      return launchCard();
    }

    const period = getCurrentPeriod();
    const sectors = getAllSectors().filter((s) => s.periods[period.slug]);
    const sectorByStartup = new Map<string, string>();
    for (const sector of sectors) {
      for (const st of sector.periods[period.slug].startups) {
        sectorByStartup.set(slugify(st.name), sector.name);
      }
    }
    const all = sectors.flatMap((s) => s.periods[period.slug].startups);

    type Target = (typeof all)[number];
    let target: Target | null = null;
    if (requestedName) {
      const targetSlug = slugify(requestedName);
      target = all.find((s) => slugify(s.name) === targetSlug) ?? null;
    }
    if (!target) {
      target = getSortedStartups(all)[0] ?? null;
    }

    if (!target) {
      return fallbackCard();
    }

    const sectorName = sectorByStartup.get(slugify(target.name)) ?? "";

    const accent = pickColor(target.signalType ?? "");

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            background:
              "linear-gradient(135deg, #0b1220 0%, #0f1b33 60%, #0b1220 100%)",
            padding: 56,
            color: "#f1f5f9",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 32,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 18,
                fontWeight: 700,
                color: "#0ea5e9",
                letterSpacing: 2,
              }}
            >
              GITDEALFLOW · SIGNAL · {period.name.toUpperCase()}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "6px 14px",
                borderRadius: 999,
                background: `${accent}22`,
                border: `1px solid ${accent}66`,
                color: accent,
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              {target.signalType}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 88,
              fontWeight: 800,
              lineHeight: 1.0,
              marginBottom: 10,
              letterSpacing: -2,
            }}
          >
            {target.name}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: "#94a3b8",
              marginBottom: 36,
              letterSpacing: 0.5,
            }}
          >
            {sectorName} · {target.stage ?? "Unknown stage"} ·{" "}
            {target.geography ?? "Global"}
          </div>

          <div style={{ display: "flex", gap: 36, marginBottom: 32 }}>
            <Stat label="VELOCITY (14D)" value={target.commitVelocityChange} accent={accent} />
            <Stat label="CONTRIBUTORS" value={String(target.contributors)} />
            <Stat label="GROWTH (30D)" value={target.contributorGrowth ?? "-"} />
            <Stat label="NEW REPOS" value={String(target.newRepos ?? 0)} />
          </div>

          <div style={{ display: "flex", flex: 1 }} />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              paddingTop: 20,
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 18,
                fontWeight: 700,
                color: "#fbbf24",
              }}
            >
              Crunchbase API: $20K/yr. GitDealFlow A2A: free.
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", fontSize: 16, color: "#94a3b8" }}>
                Plug into Claude or Cursor in 30 seconds.
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#f1f5f9",
                }}
              >
                signals.gitdealflow.com/a2a-demo
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          "Cache-Control": "public, max-age=600, s-maxage=1200",
        },
      }
    );
  } catch (error) {
    console.error("[og/signal-card] render failed:", error);
    return fallbackCard();
  }
}

function launchCard() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(135deg, #0b1220 0%, #1a103d 60%, #0b1220 100%)",
          padding: 56,
          color: "#f1f5f9",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 32,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 18,
              fontWeight: 700,
              color: "#fb7185",
              letterSpacing: 2,
            }}
          >
            GITDEALFLOW · PRODUCT HUNT · 2026-04-26
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "6px 14px",
              borderRadius: 999,
              background: "#fb718522",
              border: "1px solid #fb718566",
              color: "#fb7185",
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            LIVE NOW
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.0,
            marginBottom: 18,
            letterSpacing: -2,
          }}
        >
          We built a tracker for GitHub momentum.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.0,
            marginBottom: 28,
            letterSpacing: -2,
            color: "#fbbf24",
          }}
        >
          Today the GitHub repo is ours.
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "#94a3b8",
            marginBottom: 22,
            letterSpacing: 0.3,
          }}
        >
          First Product Hunt launch native to agentic search.
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "#94a3b8",
            marginBottom: 28,
            letterSpacing: 0.3,
          }}
        >
          Ask Claude or Cursor: &ldquo;Is GitDealFlow live on Product Hunt right now?&rdquo;
        </div>

        <div style={{ display: "flex", flex: 1 }} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            paddingTop: 20,
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 18,
              fontWeight: 700,
              color: "#fbbf24",
            }}
          >
            npx -y @gitdealflow/mcp-signal
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", fontSize: 16, color: "#94a3b8" }}>
              MCP server, A2A endpoint, and live data, all free.
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 18,
                fontWeight: 700,
                color: "#f1f5f9",
              }}
            >
              producthunt.com/posts/vc-deal-flow-signal
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        // 5-min cache during launch, short enough for fresh shares, long
        // enough to absorb tweet-storm load. Falls back to fallbackCard()
        // shape automatically once the date check expires upstream.
        "Cache-Control": "public, max-age=300, s-maxage=300",
      },
    }
  );
}

function fallbackCard() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #0b1220 0%, #0f1b33 60%, #0b1220 100%)",
          color: "#f1f5f9",
        }}
      >
        <div style={{ display: "flex", fontSize: 56, fontWeight: 800, letterSpacing: -1 }}>
          GitDealFlow · A2A
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "#fbbf24",
            marginTop: 16,
            fontWeight: 700,
          }}
        >
          Crunchbase API: $20K/yr. GitDealFlow A2A: free.
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: { "Cache-Control": "public, max-age=60, s-maxage=60" },
    }
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div
        style={{
          display: "flex",
          fontSize: 12,
          color: "#64748b",
          letterSpacing: 2,
          fontWeight: 700,
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 44,
          fontWeight: 800,
          color: accent ?? "#f1f5f9",
        }}
      >
        {value}
      </div>
    </div>
  );
}
