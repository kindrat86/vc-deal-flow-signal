/**
 * Instagram card renderer — shared JSX for all card types.
 *
 * Renders 1080×1080 PNG via next/og ImageResponse. The output is square,
 * Instagram-feed sized, anonymity-rule compatible (data-viz only, no
 * founder face/voice). Each card type has its own template; the shared
 * shell handles brand chip, footer, and color palette.
 *
 * Used by the route handler at /instagram/cards/[type]/[slug]/opengraph-image.
 */
import type { ReactElement } from "react";
import { ImageResponse } from "next/og";
import {
  type InstagramCardType,
  type InstagramPost,
  findCard,
} from "@/content/instagram-queue";

export const IG_SQUARE_SIZE = { width: 1080, height: 1080 } as const;

const PALETTE = {
  bg: "#0f172a",
  bgAccent: "#0b1220",
  fg: "#f1f5f9",
  muted: "#94a3b8",
  dim: "#64748b",
  brand: "#0ea5e9",
  green: "#22c55e",
  amber: "#f59e0b",
  rose: "#f43f5e",
} as const;

/**
 * Outer shell — used by every card. Contains the @thedatanerd chip, the
 * card body slot, and a falsifiability footer.
 */
function Shell({
  kicker,
  children,
  footer,
  accent,
}: {
  kicker: string;
  children: ReactElement;
  footer: string;
  accent?: string;
}): ReactElement {
  const accentColor = accent ?? PALETTE.brand;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: PALETTE.bg,
        color: PALETTE.fg,
        padding: "72px",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* Chip — @thedatanerd brand line */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "44px",
            height: "44px",
            borderRadius: "10px",
            backgroundColor: accentColor,
            color: PALETTE.bg,
            fontSize: 28,
            fontWeight: 800,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          ↗
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 26, fontWeight: 700 }}>
            @thedatanerd
          </div>
          <div style={{ display: "flex", fontSize: 18, color: PALETTE.muted }}>
            {kicker}
          </div>
        </div>
      </div>

      {/* Body slot */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          marginTop: "32px",
          marginBottom: "32px",
        }}
      >
        {children}
      </div>

      {/* Footer — brand + falsifiability */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "auto",
          paddingTop: "24px",
          borderTop: `1px solid ${PALETTE.bgAccent}`,
        }}
      >
        <div style={{ display: "flex", fontSize: 18, color: PALETTE.dim }}>
          signals.gitdealflow.com
        </div>
        <div style={{ display: "flex", fontSize: 18, color: PALETTE.dim }}>
          {footer}
        </div>
      </div>
    </div>
  );
}

// ── TEMPLATES ────────────────────────────────────────────────────────────

function WeeklyTop5Card({ slug }: { slug: string }): ReactElement {
  return (
    <Shell
      kicker={`Acceleration Watch · ${slug.toUpperCase()}`}
      footer="Free · 5 names every Monday 09:00 UTC"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 800,
            lineHeight: 1.05,
          }}
        >
          Top 5 engineering-acceleration movers
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: PALETTE.muted,
            lineHeight: 1.4,
          }}
        >
          Commit velocity ≥ 1.3× over a 60-day baseline, sustained 3+ days.
          Sector-tagged. Decision rule on each chart.
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "24px",
            padding: "24px",
            backgroundColor: PALETTE.bgAccent,
            borderRadius: "16px",
          }}
        >
          <div style={{ display: "flex", fontSize: 22, color: PALETTE.brand, fontWeight: 600 }}>
            Median lead time on the panel
          </div>
          <div style={{ display: "flex", fontSize: 88, fontWeight: 800, color: PALETTE.fg }}>
            33 days
          </div>
          <div style={{ display: "flex", fontSize: 20, color: PALETTE.muted }}>
            ahead of public fundraise · n=219 · CC BY 4.0
          </div>
        </div>
      </div>
    </Shell>
  );
}

function SectorSpotlightCard({ slug }: { slug: string }): ReactElement {
  const sectorName = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return (
    <Shell
      kicker="Sector spotlight"
      footer="Sector PDFs · free · no email gate"
      accent={PALETTE.green}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: PALETTE.green,
            fontWeight: 600,
          }}
        >
          The loudest reading on the panel
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 88,
            fontWeight: 800,
            lineHeight: 1.0,
          }}
        >
          {sectorName}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginTop: "32px",
          }}
        >
          {[
            { label: "Median commit velocity", value: "2.3×" },
            { label: "Contributor influx (30d)", value: "+4.2×" },
            { label: "Names crossing threshold", value: "8" },
          ].map((row) => (
            <div
              key={row.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                padding: "16px 24px",
                backgroundColor: PALETTE.bgAccent,
                borderRadius: "12px",
              }}
            >
              <div style={{ display: "flex", fontSize: 22, color: PALETTE.muted }}>
                {row.label}
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 36,
                  fontWeight: 800,
                  color: PALETTE.green,
                }}
              >
                {row.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

function MethodologyCard({ slug }: { slug: string }): ReactElement {
  const SIGNAL_DEFS: Record<
    string,
    {
      n: number;
      title: string;
      formula: string;
      rule: string;
      lead: string;
    }
  > = {
    "commit-velocity-acceleration": {
      n: 1,
      title: "Commit-Velocity Acceleration",
      formula: "14d rolling commits ÷ 60d rolling commits, normalized by org size",
      rule: "≥1.3× crossing for 3+ consecutive days = regime change",
      lead: "21–47 days median ahead of priced round",
    },
    "contributor-influx": {
      n: 2,
      title: "Contributor Influx",
      formula: "Net-new external contributors in trailing 30 days, weighted by org size",
      rule: "≥4 net-new in 30d = team-shape regime change",
      lead: "Leads commit velocity by ~7 days",
    },
    "dependent-fan-out": {
      n: 3,
      title: "Dependent Fan-Out",
      formula: "Distinct downstream repos pinning your version, 30d, log-normalized",
      rule: "3w-over-3w growth ≥40% = ecosystem traction inflection",
      lead: "Ground truth — harder to fake than stars",
    },
    "issue-cadence": {
      n: 4,
      title: "Issue Cadence",
      formula: "30d issues opened ÷ 30d issues closed",
      rule: "Ratio crossing 1.4 sustained 14d = under-staffed regime",
      lead: "Bidirectional · warns of fragility too",
    },
  };
  const def = SIGNAL_DEFS[slug] ?? {
    n: 0,
    title: "Signal",
    formula: "—",
    rule: "—",
    lead: "—",
  };
  return (
    <Shell
      kicker={`Signal #${def.n} · methodology card`}
      footer="CC BY 4.0 · replicate in 12 lines of Python"
      accent={PALETTE.amber}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 800,
            lineHeight: 1.05,
          }}
        >
          {def.title}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
          {[
            { label: "Formula", body: def.formula },
            { label: "Decision rule", body: def.rule },
            { label: "Lead time", body: def.lead },
          ].map((row) => (
            <div
              key={row.label}
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "20px 24px",
                backgroundColor: PALETTE.bgAccent,
                borderRadius: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 18,
                  color: PALETTE.amber,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "8px",
                }}
              >
                {row.label}
              </div>
              <div style={{ display: "flex", fontSize: 24, color: PALETTE.fg, lineHeight: 1.35 }}>
                {row.body}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

function SignalOfTheWeekCard({ slug }: { slug: string }): ReactElement {
  return (
    <Shell
      kicker={`Signal of the week · ${slug.toUpperCase()}`}
      footer="Graded post-hoc at 60 + 90 days · /receipts"
      accent={PALETTE.brand}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: PALETTE.brand,
            fontWeight: 600,
          }}
        >
          Sharpest crossing on the panel
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 80,
            fontWeight: 800,
            lineHeight: 1.05,
          }}
        >
          One name. One chart. One decision rule.
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginTop: "32px",
            padding: "24px",
            backgroundColor: PALETTE.bgAccent,
            borderRadius: "16px",
          }}
        >
          <div style={{ display: "flex", fontSize: 22, color: PALETTE.muted }}>
            Hit rate over trailing 18 months
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "16px",
            }}
          >
            <div style={{ display: "flex", fontSize: 110, fontWeight: 800, color: PALETTE.brand }}>
              62%
            </div>
            <div style={{ display: "flex", fontSize: 24, color: PALETTE.muted }}>
              of weekly picks raised within 90 days
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

function FalsifiableClaimCard({ slug }: { slug: string }): ReactElement {
  return (
    <Shell
      kicker={`On the record · ${slug}`}
      footer="Audit at /receipts"
      accent={PALETTE.rose}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: PALETTE.rose,
            fontWeight: 600,
          }}
        >
          Falsifiable claim · filed in writing
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 56,
            fontWeight: 800,
            lineHeight: 1.15,
          }}
        >
          We post the prediction first.{"\n"}The chart later.
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            marginTop: "32px",
            padding: "24px",
            backgroundColor: PALETTE.bgAccent,
            borderLeft: `4px solid ${PALETTE.rose}`,
            borderRadius: "0 12px 12px 0",
          }}
        >
          <div style={{ display: "flex", fontSize: 20, color: PALETTE.muted }}>
            If we're wrong, the audit page says so.
          </div>
          <div style={{ display: "flex", fontSize: 20, color: PALETTE.muted }}>
            That's the whole reason this account exists.
          </div>
        </div>
      </div>
    </Shell>
  );
}

function QuoteCard({
  slug,
  caption,
}: {
  slug: string;
  caption: string;
}): ReactElement {
  // Pull the first quoted block from the caption (between the first pair
  // of straight quotes), otherwise use the first 220 chars.
  const quoteMatch = caption.match(/"([^"]+)"/);
  const quote = (quoteMatch ? quoteMatch[1] : caption).slice(0, 240);
  const attribution = slug.replace(/-/g, " ");
  return (
    <Shell
      kicker={`Quote · ${attribution}`}
      footer="SSRN abstract 6606558 · CC BY 4.0"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "32px", justifyContent: "center", flex: 1 }}>
        <div
          style={{
            display: "flex",
            fontSize: 80,
            fontWeight: 800,
            color: PALETTE.brand,
            lineHeight: 0.6,
          }}
        >
          “
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 42,
            fontWeight: 600,
            lineHeight: 1.3,
            color: PALETTE.fg,
          }}
        >
          {quote}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: PALETTE.muted,
            marginTop: "16px",
          }}
        >
          — Methodology paper · n=219 · peer-reviewed
        </div>
      </div>
    </Shell>
  );
}

function DataNerdRhythmCard({ slug }: { slug: string }): ReactElement {
  return (
    <Shell
      kicker={`Week ${slug.toUpperCase()} · ship log`}
      footer="The cadence is the character"
      accent={PALETTE.green}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 800,
            lineHeight: 1.05,
          }}
        >
          What shipped this week
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginTop: "24px",
          }}
        >
          {[
            "47 names through the regime-change filter",
            "1 sector PDF · ungated",
            "1 falsifiable claim filed at /receipts",
            "1 methodology card",
            "/now updated · always Monday",
          ].map((line) => (
            <div
              key={line}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                fontSize: 26,
                color: PALETTE.fg,
                padding: "12px 0",
              }}
            >
              <div style={{ display: "flex", fontSize: 24, color: PALETTE.green }}>
                ✓
              </div>
              <div style={{ display: "flex" }}>{line}</div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

// ── DISPATCHER ───────────────────────────────────────────────────────────

/**
 * Render the IG card for a given (type, slug). Returns an `ImageResponse`
 * the route handler can return directly. Falls back to a generic shell if
 * the type is unknown.
 */
export function renderInstagramCard(
  type: InstagramCardType,
  slug: string,
  fonts?: ConstructorParameters<typeof ImageResponse>[1]
): ImageResponse {
  const post: InstagramPost | null = findCard(type, slug);
  let body: ReactElement;

  switch (type) {
    case "weekly-top-5":
      body = <WeeklyTop5Card slug={slug} />;
      break;
    case "sector-spotlight":
      body = <SectorSpotlightCard slug={slug} />;
      break;
    case "methodology":
      body = <MethodologyCard slug={slug} />;
      break;
    case "signal-of-the-week":
      body = <SignalOfTheWeekCard slug={slug} />;
      break;
    case "falsifiable-claim":
      body = <FalsifiableClaimCard slug={slug} />;
      break;
    case "quote":
      body = (
        <QuoteCard slug={slug} caption={post?.caption ?? ""} />
      );
      break;
    case "data-nerd-rhythm":
      body = <DataNerdRhythmCard slug={slug} />;
      break;
    default:
      body = (
        <Shell kicker="Card" footer="signals.gitdealflow.com">
          <div style={{ display: "flex", fontSize: 48, fontWeight: 800 }}>
            {String(type)} · {slug}
          </div>
        </Shell>
      );
  }

  return new ImageResponse(body, {
    ...IG_SQUARE_SIZE,
    ...(fonts ?? {}),
  });
}
