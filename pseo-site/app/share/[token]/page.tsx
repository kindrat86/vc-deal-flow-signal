import type { Metadata } from "next";
import Link from "next/link";
import { verifyShareToken, type SharePayload } from "@/lib/share-token";
import { makeShareIntents } from "@/lib/share-url";

// Page mints a new share token for the chain-share CTA, must run at request
// time so the SECRET matches the runtime env (see feedback_hmac_share_tokens_force_dynamic).
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ token: string }>;
}

const PREVIEW_COOKIE = "gd_share_preview";
const PREVIEW_DAYS = 7;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { token } = await params;
  const safeToken = encodeURIComponent(token);
  const ogImage = `https://signals.gitdealflow.com/api/og/share/${safeToken}`;
  const title = "Your Signal Preview is Ready";
  const description =
    "Someone shared their VC engineering signal with you. Unlock 7-day extended preview of GitDealFlow's weekly breakouts.";
  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@sipiteno",
      title,
      description,
      images: [ogImage],
    },
  };
}

interface KindCopy {
  eyebrow: string;
  headline: string;
  body: (sharer: string, expiresAt: string) => string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
}

const KIND_COPY: Record<string, KindCopy> = {
  scout: {
    eyebrow: "SCOUT PROFILE SHARED · ACTIVATED",
    headline: "A scout shared their track record with you.",
    body: (sharer, expiresAt) =>
      `${sharer ? `@${sharer}` : "A scout"} just shared their GitHub Receipts with you. See which unicorns they called early, then build your own scout profile in 30 seconds, your ${PREVIEW_DAYS}-day extended preview is active until ${expiresAt}.`,
    primaryHref: "/receipts",
    primaryLabel: "Build my scout profile →",
    secondaryHref: "/leaderboard",
    secondaryLabel: "See the top 100",
  },
  predict: {
    eyebrow: "PREDICTION SHARED · ACTIVATED",
    headline: "Someone made a public call. Your turn.",
    body: (sharer, expiresAt) =>
      `${sharer ? `@${sharer}` : "A scout"} just locked in a prediction on whether a GitHub org raises in the next 6 months. We resolve every call automatically. Your ${PREVIEW_DAYS}-day extended preview is active until ${expiresAt}, make your own call.`,
    primaryHref: "/predict",
    primaryLabel: "Make my call →",
    secondaryHref: "/leaderboard",
    secondaryLabel: "See top scouts",
  },
  "signal-card": {
    eyebrow: "SIGNAL SHARED · ACTIVATED",
    headline: "You just unlocked this week's breakouts.",
    body: (_sharer, expiresAt) =>
      `Someone in your network shared a GitDealFlow signal with you. We tracked the top breakout startups by GitHub engineering acceleration this week, commit velocity, contributor growth, infrastructure buildouts. Your ${PREVIEW_DAYS}-day extended preview is active until ${expiresAt}.`,
    primaryHref: "/",
    primaryLabel: "See this week's breakouts →",
    secondaryHref: "/predict",
    secondaryLabel: "Predict next week",
  },
};

function copyFor(kind: string): KindCopy {
  return KIND_COPY[kind] ?? KIND_COPY["signal-card"];
}

export default async function SharePage({ params }: PageProps) {
  const { token } = await params;
  const payload = verifyShareToken(token);

  // Next 16 disallows cookie writes from Page Server Components, the
  // gd_share_preview cookie is set client-side via ShareReceiptScript below.

  const valid = !!payload;
  const expiresAt = payload ? new Date(payload.e).toISOString().slice(0, 10) : "";
  const copy = valid ? copyFor(payload!.k) : null;

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 20px 80px" }}>
      <p style={{ fontSize: 12, letterSpacing: 2, color: "#0ea5e9", fontWeight: 700, marginBottom: 12 }}>
        {valid && copy ? copy.eyebrow : "SHARED PREVIEW · EXPIRED"}
      </p>

      {valid && copy ? (
        <>
          <h1 style={{ fontSize: 36, lineHeight: 1.15, color: "#f1f5f9", margin: 0, letterSpacing: -1 }}>
            {copy.headline}
          </h1>
          <p style={{ fontSize: 18, color: "#cbd5e1", marginTop: 18, lineHeight: 1.6 }}>
            {copy.body(safeSharer(payload), expiresAt)}
          </p>
          <PreviewActions copy={copy} />
          <ChainShareCta originalSharer={safeSharer(payload)} />
          <Footer />
          <ShareReceiptScript token={token} kind={payload!.k} />
        </>
      ) : (
        <>
          <h1 style={{ fontSize: 36, lineHeight: 1.15, color: "#f1f5f9", margin: 0, letterSpacing: -1 }}>
            This preview link expired.
          </h1>
          <p style={{ fontSize: 18, color: "#cbd5e1", marginTop: 18, lineHeight: 1.6 }}>
            Share links are valid for {PREVIEW_DAYS} days. The good news:
            anyone can sign up for free and get the same weekly breakouts in
            their inbox every Sunday.
          </p>
          <div style={{ marginTop: 28 }}>
            <Link
              href="/predict"
              style={{
                display: "inline-block",
                padding: "12px 22px",
                borderRadius: 10,
                background: "#0ea5e9",
                color: "#0c4a6e",
                fontWeight: 700,
                fontSize: 15,
                textDecoration: "none",
              }}
            >
              Get this Sunday&apos;s top 5 →
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

function safeSharer(payload: SharePayload | null): string {
  if (!payload || !payload.s) return "";
  if (payload.s === "anon") return "";
  return payload.s.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 40);
}

function ChainShareCta({ originalSharer }: { originalSharer: string }) {
  // Mint a fresh signal-card token at request time. Original sharer's identity
  // is preserved so the next-hop preview attributes back to the source.
  const { twitterIntent, linkedinIntent } = makeShareIntents({
    sharer: originalSharer || "anon",
    kind: "signal-card",
    text: "Worth a look: GitDealFlow tracks startup engineering acceleration on GitHub. Recipient gets a 7-day extended preview:",
  });
  return (
    <div
      style={{
        marginTop: 36,
        paddingTop: 24,
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <p
        style={{
          fontSize: 12,
          letterSpacing: 2,
          color: "#fbbf24",
          fontWeight: 700,
          marginBottom: 10,
        }}
      >
        PASS IT FORWARD
      </p>
      <p style={{ fontSize: 16, color: "#cbd5e1", marginTop: 0, marginBottom: 14, lineHeight: 1.55 }}>
        Know an investor who would want this signal? Pass them a fresh 7-day preview link.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        <a
          href={twitterIntent}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "10px 18px",
            borderRadius: 10,
            background: "#0f172a",
            border: "1px solid #334155",
            color: "#e2e8f0",
            fontWeight: 600,
            fontSize: 13,
            textDecoration: "none",
          }}
        >
          Forward via X
        </a>
        <a
          href={linkedinIntent}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "10px 18px",
            borderRadius: 10,
            background: "#0f172a",
            border: "1px solid #334155",
            color: "#e2e8f0",
            fontWeight: 600,
            fontSize: 13,
            textDecoration: "none",
          }}
        >
          Forward via LinkedIn
        </a>
      </div>
    </div>
  );
}

function PreviewActions({ copy }: { copy: KindCopy }) {
  return (
    <div style={{ marginTop: 32, display: "flex", flexWrap: "wrap", gap: 10 }}>
      <Link
        href={copy.primaryHref}
        style={{
          padding: "12px 20px",
          borderRadius: 10,
          background: "#0ea5e9",
          color: "#0c4a6e",
          fontWeight: 700,
          fontSize: 14,
          textDecoration: "none",
        }}
      >
        {copy.primaryLabel}
      </Link>
      <Link
        href={copy.secondaryHref}
        style={{
          padding: "12px 20px",
          borderRadius: 10,
          border: "1px solid #475569",
          color: "#e2e8f0",
          fontWeight: 600,
          fontSize: 14,
          textDecoration: "none",
        }}
      >
        {copy.secondaryLabel}
      </Link>
      <a
        href="https://gitdealflow.com/#signup"
        style={{
          padding: "12px 20px",
          borderRadius: 10,
          border: "1px solid #475569",
          color: "#e2e8f0",
          fontWeight: 600,
          fontSize: 14,
          textDecoration: "none",
        }}
      >
        Get Sunday&apos;s digest free
      </a>
    </div>
  );
}

function Footer() {
  return (
    <p style={{ fontSize: 13, color: "#64748b", marginTop: 36, lineHeight: 1.6 }}>
      Methodology paper:{" "}
      <a
        href="https://ssrn.com/abstract=6606558"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#7dd3fc" }}
      >
        SSRN abstract=6606558
      </a>{" "}
      · Anonymous attribution. The sharer&apos;s identity is not surfaced to you,
      and yours is not surfaced to them.
    </p>
  );
}

function ShareReceiptScript({ token, kind }: { token: string; kind: string }) {
  const safeToken = token.replace(/[^A-Za-z0-9._-]/g, "");
  const safeKind = kind.replace(/[^a-z-]/g, "");
  const cookieMaxAge = PREVIEW_DAYS * 24 * 60 * 60;
  const code = `(function(){try{document.cookie='${PREVIEW_COOKIE}=1; path=/; max-age=${cookieMaxAge}; SameSite=Lax';if(window.posthog){window.posthog.capture('signal_card_share_redeemed',{token_prefix:'${safeToken.slice(
    0,
    8,
  )}',kind:'${safeKind}'});}}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
