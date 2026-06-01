import type { Metadata } from "next";
import Link from "next/link";
import { A2A_FRAMEWORKS } from "@/lib/a2a-frameworks";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";

export const metadata: Metadata = {
  title: "GitDealFlow A2A — Free Startup Signals for Your AI Agent",
  description:
    "Plug GitDealFlow's startup engineering signals into Claude Code, Cursor, OpenAI Agents SDK, LangChain, and Vercel AI SDK via the Agent2Agent protocol. Free, no auth, no rate limit.",
  alternates: { canonical: "/a2a" },
  openGraph: {
    title: "GitDealFlow A2A — Free Startup Signals for Your AI",
    description:
      "Crunchbase API: $20K/yr. GitDealFlow A2A: free. AgentCard, JSON-RPC endpoint, and 5 framework recipes.",
  },
};

export default function A2AHubPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "GitDealFlow Signal Agent",
        description:
          "An Agent2Agent (A2A) protocol agent exposing startup engineering signals from public GitHub data. Five free skills, no auth.",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Any",
        url: "https://signals.gitdealflow.com/a2a",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is the GitDealFlow A2A agent?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "GitDealFlow publishes a Google Agent2Agent (A2A) AgentCard at /.well-known/agent-card.json and a JSON-RPC 2.0 endpoint at /api/a2a. Other AI agents discover the AgentCard, parse the five available skills (trending startups, sector search, single-startup lookup, dataset summary, methodology), and call the endpoint over HTTP. Free, no auth, no signup.",
            },
          },
          {
            "@type": "Question",
            name: "How does this differ from a paid VC API like Crunchbase or PitchBook?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Paid APIs from Crunchbase, PitchBook, Harmonic.ai, and similar incumbents typically cost $20,000+ per year and require a sales call. The GitDealFlow A2A agent is free, no contract, and callable directly from any A2A-aware agent runtime. The data is different — we focus on engineering acceleration signals from public GitHub activity, while incumbents focus on funding history and team data — but for the question 'who is shipping fast right now,' our data is more direct and more current.",
            },
          },
          {
            "@type": "Question",
            name: "Which agent frameworks support A2A?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Google Agent Builder and Gemini Enterprise have first-class A2A support. Claude Code, Cursor, and Windsurf integrate via MCP today (our MCP server exposes the same five skills). LangChain, OpenAI Agents SDK, and Vercel AI SDK can call A2A endpoints via custom HTTP tools. Each integration is documented at /a2a/[framework] with a working code recipe.",
            },
          },
          {
            "@type": "Question",
            name: "What are the five skills?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "get_trending_startups returns the top 20 startups across all sectors. search_startups_by_sector returns every tracked startup in one of 19 active sectors. get_startup_signal returns a full profile for a single named startup. get_signals_summary returns dataset metadata (period, sector count, refresh date, citation). get_methodology returns the canonical methodology text. All five are read-only, idempotent, and free.",
            },
          },
          {
            "@type": "Question",
            name: "Is there a rate limit?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No application-layer rate limit. The upstream CDN absorbs typical agent traffic. If you hit the endpoint with 100 requests per second from a tight loop, the CDN may briefly throttle — add a 100ms sleep between calls in batch jobs.",
            },
          },
        ],
      },
      {
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/a2a#webpage",
        url: "https://signals.gitdealflow.com/a2a",
        name: "A2A Hub — VC Deal Flow Signal as an Agent2Agent agent",
        description:
          "Google A2A AgentCard + JSON-RPC stub. Five free skills exposed to any A2A-compatible orchestrator without auth or signup.",
        inLanguage: "en-US",
        isPartOf: { "@id": "https://signals.gitdealflow.com/#website" },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", ".speakable", "[data-agent-summary]"],
        },
      },
    ],
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 20px 80px" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav style={{ fontSize: 14, color: "#64748b", marginBottom: 24 }}>
        <Link href="/" style={{ color: "#64748b" }}>Home</Link> ›{" "}
        <Link href="/developers" style={{ color: "#64748b" }}>Developers</Link> ›{" "}
        <span>A2A</span>
      </nav>

      <header style={{ marginBottom: 48 }}>
        <div
          style={{
            fontSize: 12,
            letterSpacing: 2,
            color: "#0ea5e9",
            fontWeight: 700,
            marginBottom: 12,
          }}
        >
          AGENT2AGENT · LIVE · FREE
        </div>
        <h1
          style={{
            fontSize: 44,
            lineHeight: 1.1,
            margin: 0,
            letterSpacing: -1.5,
            color: "#0f172a",
          }}
        >
          GitDealFlow speaks A2A.
        </h1>
        <p style={{ fontSize: 19, color: "#475569", marginTop: 16, lineHeight: 1.55 }}>
          Five free skills callable by any Agent2Agent-aware runtime. AgentCard auto-discoverable at{" "}
          <code style={{ fontSize: 16 }}>/.well-known/agent-card.json</code>. JSON-RPC 2.0 endpoint
          at <code style={{ fontSize: 16 }}>/api/a2a</code>.
        </p>
        <p
          style={{
            fontSize: 17,
            color: "#0f172a",
            background: "#fef3c7",
            border: "1px solid #fcd34d",
            padding: "14px 18px",
            borderRadius: 10,
            marginTop: 22,
            fontWeight: 700,
          }}
        >
          Crunchbase API: $20K/yr. GitDealFlow A2A: free, no signup.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 22 }}>
          <Link
            href="/a2a-demo"
            style={{
              padding: "12px 20px",
              borderRadius: 10,
              background: "#0f172a",
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Try the live playground →
          </Link>
          <a
            href="https://signals.gitdealflow.com/.well-known/agent-card.json"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "12px 20px",
              borderRadius: 10,
              border: "1px solid #cbd5e1",
              color: "#475569",
              fontSize: 14,
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            View AgentCard
          </a>
          <Link
            href="/blog/a2a-launched"
            style={{
              padding: "12px 20px",
              borderRadius: 10,
              border: "1px solid #cbd5e1",
              color: "#475569",
              fontSize: 14,
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Launch story
          </Link>
        </div>
      </header>

      <section style={{ marginBottom: 56 }}>
        <h2 style={{ fontSize: 26, color: "#0f172a", letterSpacing: -0.5, marginBottom: 18 }}>
          Framework recipes
        </h2>
        <p style={{ color: "#475569", marginBottom: 24, lineHeight: 1.55 }}>
          Each page is a working integration: install steps, the recommended code path, an alternative
          path, what to ask, and gotchas. Pick the runtime you already use.
        </p>
        <div
          style={{
            display: "grid",
            gap: 14,
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          }}
        >
          {A2A_FRAMEWORKS.map((fw) => (
            <Link
              key={fw.slug}
              href={`/a2a/${fw.slug}`}
              style={{
                padding: 20,
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                background: "#fff",
                color: "inherit",
                textDecoration: "none",
                display: "block",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: 1.5,
                  color: fw.status === "first-class-mcp" ? "#16a34a" : "#0ea5e9",
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                {fw.status === "first-class-mcp" ? "MCP-NATIVE" : "CUSTOM TOOL"}
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>
                {fw.name}
              </div>
              <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.5 }}>{fw.tagline}</div>
            </Link>
          ))}
        </div>
      </section>

      <section
        style={{
          padding: 28,
          background: "linear-gradient(135deg, #0b1220 0%, #0f1b33 60%, #0b1220 100%)",
          borderRadius: 16,
          color: "#f1f5f9",
          marginBottom: 48,
        }}
      >
        <h2 style={{ fontSize: 22, margin: 0, marginBottom: 16, color: "#f1f5f9" }}>
          The 30-second curl
        </h2>
        <pre
          style={{
            background: "#020617",
            padding: 18,
            borderRadius: 10,
            fontSize: 13,
            lineHeight: 1.55,
            overflowX: "auto",
            color: "#a7f3d0",
            margin: 0,
          }}
        >
          <code>{`curl -X POST https://signals.gitdealflow.com/api/a2a \\
  -H 'Content-Type: application/json' \\
  -d '{"jsonrpc":"2.0","id":1,"method":"message/send","params":{"message":{"role":"user","parts":[{"kind":"text","text":"trending"}]}}}'`}</code>
        </pre>
        <p style={{ color: "#94a3b8", fontSize: 14, marginTop: 14, lineHeight: 1.55 }}>
          Returns a Task with status.state="completed" and 20 startups in the artifact data part.
          Each row carries commit velocity, contributor growth, signal classification, and a GitHub
          URL. No auth header. That is the point.
        </p>
      </section>

      <section
        style={{
          padding: 28,
          border: "1px solid #e2e8f0",
          borderRadius: 16,
          background: "#f8fafc",
          marginBottom: 48,
        }}
      >
        <h2 style={{ fontSize: 22, color: "#0f172a", letterSpacing: -0.3, margin: 0 }}>
          When your agent wants the deep signal
        </h2>
        <p style={{ color: "#475569", marginTop: 12, lineHeight: 1.7, fontSize: 15 }}>
          The five A2A skills above stay free, forever, no auth. When you wire the signal into a
          production agent and want the full per-startup deep read on every call, there is a paid
          lane built for machines:{" "}
          <strong style={{ color: "#0f172a" }}>€19 for 100 deep-signal calls (€0.19 each)</strong>.
          Pay with a credit pack, or pay per call in USDC on Base via x402 — no contract, no sales
          call, credits never expire.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 20 }}>
          <Link
            href="/agents/credits"
            style={{
              padding: "12px 20px",
              borderRadius: 10,
              background: "#0ea5e9",
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Get agent credits — €19 / 100 calls →
          </Link>
          <Link
            href="/for-builders"
            style={{
              padding: "12px 20px",
              borderRadius: 10,
              border: "1px solid #cbd5e1",
              color: "#475569",
              fontSize: 14,
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            For builders: the full picture →
          </Link>
        </div>
        <p style={{ color: "#64748b", fontSize: 13.5, marginTop: 18, lineHeight: 1.6 }}>
          Not wiring an agent? You are a human who invests.{" "}
          <Link href="/#signup" style={{ color: "#0ea5e9", fontWeight: 600 }}>
            Get the free Sunday digest
          </Link>{" "}
          or{" "}
          <Link href="/firstlook" style={{ color: "#0ea5e9", fontWeight: 600 }}>
            grab a €7 First Look
          </Link>{" "}
          — same signals, read for you instead of your code.
        </p>
      </section>

      <section style={{ marginBottom: 32, fontSize: 15, color: "#475569" }}>
        <h2 style={{ fontSize: 22, color: "#0f172a", letterSpacing: -0.3 }}>What is A2A?</h2>
        <p style={{ marginTop: 12, lineHeight: 1.7 }}>
          The{" "}
          <a href="https://a2a-protocol.org/latest/specification/" style={{ color: "#0ea5e9" }}>
            Agent2Agent (A2A) protocol
          </a>{" "}
          is an open standard from Google for agent-to-agent communication. Each agent publishes a
          JSON AgentCard describing its skills, plus a JSON-RPC 2.0 endpoint that other agents call
          to send messages and receive task results. By April 2026 it had passed 22,000 GitHub stars
          and 150+ organizations onboard.
        </p>
        <p style={{ marginTop: 12, lineHeight: 1.7 }}>
          A2A is complementary to MCP. MCP exposes tools to a single AI assistant (Claude Desktop,
          Cursor, Windsurf). A2A lets agents call other agents across the network. We ship both
          because the audiences are different. The five skills, the data, and the methodology are
          identical — only the transport differs.
        </p>
        <p style={{ marginTop: 12, lineHeight: 1.7 }}>
          The full launch story is at{" "}
          <Link href="/blog/a2a-launched" style={{ color: "#0ea5e9" }}>
            /blog/a2a-launched
          </Link>
          . The methodology paper is on SSRN at{" "}
          <a href="https://ssrn.com/abstract=6606558" style={{ color: "#0ea5e9" }}>
            abstract=6606558
          </a>
          .
        </p>
      </section>

      <div style={{ marginTop: 8 }}>
        <DataNerdSignoff variant="compact" />
      </div>
    </div>
  );
}
