import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentPeriod, getAllSectors, getSortedStartups } from "@/lib/data";
import { slugify } from "@/lib/slugify";
import A2APlayground from "./A2APlayground";

export const metadata: Metadata = {
  title: "Try the GitDealFlow A2A Agent — Live Playground",
  description:
    "Send live JSON-RPC 2.0 requests to the GitDealFlow Agent2Agent endpoint. No signup, no API key. Watch your call return startup engineering signals from public GitHub data.",
  alternates: { canonical: "/a2a-demo" },
  openGraph: {
    title: "Try the GitDealFlow A2A Agent — Live Playground",
    description:
      "Crunchbase API: $20K/yr. GitDealFlow A2A: free. Try it now.",
    type: "website",
    url: "/a2a-demo",
  },
};

export default function A2ADemoPage() {
  const period = getCurrentPeriod();
  const sectors = getAllSectors().filter((s) => s.periods[period.slug]);
  const allStartups = sectors.flatMap((s) =>
    s.periods[period.slug].startups.map((st) => ({
      ...st,
      _sectorName: s.name,
    }))
  );
  const top = getSortedStartups(allStartups).slice(0, 1)[0] as
    | (typeof allStartups)[number]
    | undefined;

  const sectorOptions = sectors.map((s) => ({ slug: s.slug, name: s.name }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/a2a-demo#webpage",
        url: "https://signals.gitdealflow.com/a2a-demo",
        name: "Try the GitDealFlow A2A Agent — Live Playground",
        description:
          "Interactive playground for the GitDealFlow Agent2Agent endpoint. Send live JSON-RPC 2.0 calls and receive startup engineering signals from public GitHub data.",
        isPartOf: {
          "@type": "WebSite",
          name: "VC Deal Flow Signal",
          url: "https://signals.gitdealflow.com",
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: "https://signals.gitdealflow.com/icon.png",
        },
        inLanguage: "en",
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://signals.gitdealflow.com/a2a-demo#agent",
        name: "GitDealFlow A2A Agent",
        applicationCategory: "DeveloperApplication",
        applicationSubCategory: "Agent2Agent endpoint",
        operatingSystem: "Web (any A2A-capable runtime)",
        url: "https://signals.gitdealflow.com/a2a-demo",
        downloadUrl:
          "https://signals.gitdealflow.com/.well-known/agent-card.json",
        softwareVersion: "1.0.0",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        featureList: [
          "get_trending_startups",
          "search_startups_by_sector",
          "get_startup_signal",
          "get_signals_summary",
          "get_methodology",
          "get_scout_receipts",
        ],
        provider: {
          "@type": "Organization",
          name: "GitDealFlow",
          url: "https://gitdealflow.com",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://signals.gitdealflow.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Developers",
            item: "https://signals.gitdealflow.com/developers",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "A2A Demo",
            item: "https://signals.gitdealflow.com/a2a-demo",
          },
        ],
      },
    ],
  };

  return (
    <main style={{ maxWidth: 880, margin: "0 auto", padding: "32px 20px 80px" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav style={{ fontSize: 14, color: "#64748b", marginBottom: 24 }}>
        <Link href="/" style={{ color: "#64748b" }}>
          Home
        </Link>
        {" › "}
        <Link href="/developers" style={{ color: "#64748b" }}>
          Developers
        </Link>
        {" › "}
        <span>A2A Demo</span>
      </nav>

      <header style={{ marginBottom: 40 }}>
        <div
          style={{
            fontSize: 12,
            letterSpacing: 2,
            color: "#0ea5e9",
            fontWeight: 700,
            marginBottom: 12,
          }}
        >
          AGENT2AGENT · LIVE
        </div>
        <h1
          style={{
            fontSize: 42,
            lineHeight: 1.1,
            margin: 0,
            letterSpacing: -1,
            color: "#0f172a",
          }}
        >
          Your AI can ask GitDealFlow about startups now.
        </h1>
        <p
          style={{
            fontSize: 18,
            color: "#475569",
            marginTop: 16,
            lineHeight: 1.55,
          }}
        >
          We publish a Google{" "}
          <a
            href="https://a2a-protocol.org/latest/specification/"
            style={{ color: "#0ea5e9" }}
          >
            Agent2Agent (A2A)
          </a>{" "}
          AgentCard at{" "}
          <code style={{ fontSize: 15 }}>
            /.well-known/agent-card.json
          </code>{" "}
          and a JSON-RPC 2.0 endpoint at <code style={{ fontSize: 15 }}>/api/a2a</code>.
          Five skills. Free. No auth. Try a call against the live endpoint below.
        </p>
        <p
          style={{
            fontSize: 16,
            color: "#0f172a",
            background: "#fef3c7",
            border: "1px solid #fcd34d",
            padding: "14px 18px",
            borderRadius: 10,
            marginTop: 20,
            fontWeight: 600,
          }}
        >
          Crunchbase API: $20K/yr. GitDealFlow A2A: free. No signup, no rate limit.
        </p>
      </header>

      <A2APlayground
        sectorOptions={sectorOptions}
        suggestedStartup={top?.name ?? "Roboflow"}
      />

      <section style={{ marginTop: 64 }}>
        <h2 style={{ fontSize: 28, color: "#0f172a", letterSpacing: -0.5 }}>
          Plug it into your runtime
        </h2>
        <p style={{ color: "#475569", marginTop: 8 }}>
          Three minutes per integration. The AgentCard URL is the only thing each
          runtime needs.
        </p>

        <div style={{ display: "grid", gap: 16, marginTop: 24 }}>
          <Snippet
            label="Claude Code / Cursor / Windsurf (any A2A-capable agent)"
            code={`Add the AgentCard URL to your agent registry:

https://signals.gitdealflow.com/.well-known/agent-card.json

Once registered, ask your AI:
  "Who's trending in fintech this week?"
  "Tell me about Roboflow's engineering signal."
  "What does breakout signal mean?"`}
          />
          <Snippet
            label="Raw curl"
            code={`curl -X POST https://signals.gitdealflow.com/api/a2a \\
  -H 'Content-Type: application/json' \\
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "message/send",
    "params": {
      "message": {
        "role": "user",
        "parts": [{ "kind": "text", "text": "trending startups" }]
      }
    }
  }'`}
          />
          <Snippet
            label="Structured skill invocation (data part)"
            code={`{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "message/send",
  "params": {
    "message": {
      "role": "user",
      "parts": [{
        "kind": "data",
        "data": {
          "skill": "search_startups_by_sector",
          "args": { "sector": "ai-ml" }
        }
      }]
    }
  }
}`}
          />
        </div>
      </section>

      {top ? (
        <section
          style={{
            marginTop: 64,
            padding: 32,
            background: "linear-gradient(135deg, #0b1220 0%, #0f1b33 60%, #0b1220 100%)",
            borderRadius: 16,
            color: "#f1f5f9",
          }}
        >
          <div
            style={{
              fontSize: 12,
              letterSpacing: 2,
              color: "#0ea5e9",
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            SIGNAL OF THE MOMENT · {period.name.toUpperCase()}
          </div>
          <div style={{ fontSize: 36, fontWeight: 800, marginBottom: 6 }}>
            {top.name}
          </div>
          <div style={{ color: "#94a3b8", fontSize: 15, marginBottom: 18 }}>
            {top._sectorName} · {top.signalType} · {top.commitVelocityChange} velocity
            change · {top.contributors} contributors
          </div>
          <p style={{ fontSize: 15, color: "#cbd5e1", lineHeight: 1.55 }}>
            {top.description}
          </p>
          <div style={{ marginTop: 24, display: "flex", flexWrap: "wrap", gap: 12 }}>
            <a
              href={`/api/og/signal-card?name=${encodeURIComponent(top.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "10px 18px",
                borderRadius: 10,
                background: "#0ea5e9",
                color: "#0b1220",
                fontWeight: 700,
                textDecoration: "none",
                fontSize: 14,
              }}
            >
              Get share card (PNG)
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                `${top.name} just hit ${top.commitVelocityChange} commit velocity change in ${top._sectorName}.\n\nFound via GitDealFlow's free A2A agent.\n\nCrunchbase API: $20K/yr. GitDealFlow A2A: free.`
              )}&url=${encodeURIComponent(
                `https://signals.gitdealflow.com/startup/${slugify(top.name)}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "10px 18px",
                borderRadius: 10,
                background: "transparent",
                color: "#f1f5f9",
                fontWeight: 700,
                textDecoration: "none",
                fontSize: 14,
                border: "1px solid #334155",
              }}
            >
              Tweet this signal
            </a>
            <Link
              href={`/startup/${slugify(top.name)}`}
              style={{
                padding: "10px 18px",
                borderRadius: 10,
                background: "transparent",
                color: "#94a3b8",
                fontWeight: 600,
                textDecoration: "none",
                fontSize: 14,
                border: "1px solid #334155",
              }}
            >
              Full profile →
            </Link>
          </div>
        </section>
      ) : null}

      <section style={{ marginTop: 64, fontSize: 15, color: "#475569" }}>
        <h2 style={{ fontSize: 22, color: "#0f172a", letterSpacing: -0.3 }}>
          What the agent does NOT do (yet)
        </h2>
        <ul style={{ marginTop: 12, lineHeight: 1.7 }}>
          <li>Streaming via <code>message/stream</code></li>
          <li>Task persistence and <code>tasks/get</code></li>
          <li>Push notifications</li>
          <li>Authenticated extended cards</li>
          <li>Custom watchlists or per-user predictions</li>
        </ul>
        <p style={{ marginTop: 16 }}>
          The first four are stubbed because we have not seen a paying customer ask
          for them yet. The fifth — predictions — is a separate product at{" "}
          <Link href="/predict" style={{ color: "#0ea5e9" }}>
            /predict
          </Link>
          . When it goes live as an A2A skill, that is when this gets really fun.
        </p>
      </section>
    </main>
  );
}

function Snippet({ label, code }: { label: string; code: string }) {
  return (
    <div>
      <div
        style={{
          fontSize: 12,
          letterSpacing: 1,
          color: "#475569",
          fontWeight: 700,
          marginBottom: 8,
        }}
      >
        {label.toUpperCase()}
      </div>
      <pre
        style={{
          background: "#0f172a",
          color: "#e2e8f0",
          padding: 18,
          borderRadius: 10,
          fontSize: 13,
          lineHeight: 1.55,
          overflowX: "auto",
          margin: 0,
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}
