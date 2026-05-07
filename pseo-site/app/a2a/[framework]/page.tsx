import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  A2A_FRAMEWORKS,
  getFramework,
  getAllFrameworkSlugs,
} from "@/lib/a2a-frameworks";

interface PageProps {
  params: Promise<{ framework: string }>;
}

export async function generateStaticParams() {
  return getAllFrameworkSlugs().map((framework) => ({ framework }));
}

export const dynamicParams = false;
export const revalidate = 604800;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { framework } = await params;
  const fw = getFramework(framework);
  if (!fw) return {};

  return {
    title: `Use GitDealFlow A2A with ${fw.name} — Free Startup Signals for Your AI`,
    description: `Wire ${fw.name} into the GitDealFlow A2A endpoint and let your AI query startup engineering signals (trending, sector, lookup, methodology) in real time. ${fw.tagline}. Free, no auth.`,
    alternates: { canonical: `/a2a/${fw.slug}` },
    openGraph: {
      title: `${fw.name} + GitDealFlow A2A`,
      description: `Crunchbase API: $20K/yr. GitDealFlow A2A: free. Plug ${fw.name} into our agent in 5 minutes.`,
      url: `/a2a/${fw.slug}`,
    },
  };
}

export default async function A2AFrameworkPage({ params }: PageProps) {
  const { framework } = await params;
  const fw = getFramework(framework);
  if (!fw) notFound();

  const others = A2A_FRAMEWORKS.filter((f) => f.slug !== fw.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        headline: `Use GitDealFlow A2A with ${fw.name}`,
        description: fw.description,
        url: `https://signals.gitdealflow.com/a2a/${fw.slug}`,
        author: {
          "@type": "Organization",
          name: "GitDealFlow",
          url: "https://gitdealflow.com",
        },
        about: {
          "@type": "SoftwareApplication",
          name: "GitDealFlow Signal Agent",
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Any",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://signals.gitdealflow.com" },
          { "@type": "ListItem", position: 2, name: "A2A Integrations", item: "https://signals.gitdealflow.com/a2a" },
          { "@type": "ListItem", position: 3, name: fw.name, item: `https://signals.gitdealflow.com/a2a/${fw.slug}` },
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
        <Link href="/" style={{ color: "#64748b" }}>Home</Link> ›{" "}
        <Link href="/a2a" style={{ color: "#64748b" }}>A2A Integrations</Link> ›{" "}
        <span>{fw.name}</span>
      </nav>

      <header style={{ marginBottom: 36 }}>
        <div
          style={{
            fontSize: 12,
            letterSpacing: 2,
            color: "#0ea5e9",
            fontWeight: 700,
            marginBottom: 12,
          }}
        >
          A2A INTEGRATION · {fw.status === "first-class-mcp" ? "MCP-NATIVE" : "CUSTOM TOOL"}
        </div>
        <h1
          style={{
            fontSize: 38,
            lineHeight: 1.15,
            margin: 0,
            letterSpacing: -1,
            color: "#0f172a",
          }}
        >
          Use GitDealFlow A2A with {fw.name}
        </h1>
        <p style={{ fontSize: 18, color: "#475569", marginTop: 14, lineHeight: 1.55 }}>
          {fw.tagline}. {fw.audience}.
        </p>
        <p
          style={{
            fontSize: 15,
            color: "#0f172a",
            background: "#fef3c7",
            border: "1px solid #fcd34d",
            padding: "12px 16px",
            borderRadius: 10,
            marginTop: 18,
            fontWeight: 600,
          }}
        >
          Crunchbase API: $20K/yr. GitDealFlow A2A: free, no signup.
        </p>
      </header>

      <section style={{ marginBottom: 40 }}>
        <p style={{ fontSize: 16, color: "#334155", lineHeight: 1.65 }}>{fw.description}</p>
      </section>

      {fw.installSnippet ? (
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 22, color: "#0f172a", letterSpacing: -0.3, marginBottom: 12 }}>
            Install
          </h2>
          <CodeBlock code={fw.installSnippet} />
        </section>
      ) : null}

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 22, color: "#0f172a", letterSpacing: -0.3, marginBottom: 12 }}>
          {fw.preferredApproach}
        </h2>
        <CodeBlock code={fw.preferredCode} />
      </section>

      {fw.alternativeApproach && fw.alternativeCode ? (
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 22, color: "#0f172a", letterSpacing: -0.3, marginBottom: 12 }}>
            {fw.alternativeApproach}
          </h2>
          <CodeBlock code={fw.alternativeCode} />
        </section>
      ) : null}

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 22, color: "#0f172a", letterSpacing: -0.3, marginBottom: 12 }}>
          What you can ask
        </h2>
        <ul style={{ color: "#475569", lineHeight: 1.7, paddingLeft: 20 }}>
          {fw.whatToAsk.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 22, color: "#0f172a", letterSpacing: -0.3, marginBottom: 12 }}>
          Gotchas
        </h2>
        <ul style={{ color: "#475569", lineHeight: 1.7, paddingLeft: 20 }}>
          {fw.gotchas.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 22, color: "#0f172a", letterSpacing: -0.3, marginBottom: 12 }}>
          References
        </h2>
        <ul style={{ color: "#475569", lineHeight: 1.7, paddingLeft: 20 }}>
          {fw.docsLinks.map((d) => (
            <li key={d.url}>
              <a href={d.url} style={{ color: "#0ea5e9" }} target="_blank" rel="noopener noreferrer">
                {d.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="https://signals.gitdealflow.com/.well-known/agent-card.json"
              style={{ color: "#0ea5e9" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              Our AgentCard (JSON)
            </a>
          </li>
          <li>
            <a
              href="https://ssrn.com/abstract=6606558"
              style={{ color: "#0ea5e9" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              Methodology paper (SSRN abstract=6606558)
            </a>
          </li>
        </ul>
      </section>

      <section
        style={{
          marginTop: 56,
          padding: 24,
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: 12,
        }}
      >
        <h3 style={{ margin: 0, fontSize: 18, color: "#0f172a" }}>
          Try it without setup
        </h3>
        <p style={{ color: "#475569", marginTop: 8, lineHeight: 1.55 }}>
          The <Link href="/a2a-demo" style={{ color: "#0ea5e9" }}>interactive playground</Link> lets you
          send live JSON-RPC requests against the A2A endpoint with no install, no auth. Pick a skill,
          hit send, see the response.
        </p>
        <p style={{ color: "#475569", marginTop: 8, lineHeight: 1.55 }}>
          Full launch story:{" "}
          <Link href="/blog/a2a-launched" style={{ color: "#0ea5e9" }}>
            I made my VC deal flow callable by Claude
          </Link>
          .
        </p>
      </section>

      <section style={{ marginTop: 40 }}>
        <h3 style={{ fontSize: 16, color: "#475569", marginBottom: 10 }}>
          Other framework integrations
        </h3>
        <ul style={{ display: "flex", flexWrap: "wrap", gap: 10, padding: 0, listStyle: "none" }}>
          {others.map((o) => (
            <li key={o.slug}>
              <Link
                href={`/a2a/${o.slug}`}
                style={{
                  display: "inline-block",
                  padding: "8px 14px",
                  borderRadius: 999,
                  border: "1px solid #cbd5e1",
                  color: "#475569",
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                {o.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre
      style={{
        background: "#0f172a",
        color: "#e2e8f0",
        padding: 18,
        borderRadius: 10,
        fontSize: 13,
        lineHeight: 1.6,
        overflowX: "auto",
        margin: 0,
        whiteSpace: "pre",
      }}
    >
      <code>{code}</code>
    </pre>
  );
}
