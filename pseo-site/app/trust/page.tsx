import Link from "next/link";
import { defineMetadata } from "@/lib/metadata";

export const metadata = defineMetadata({
  title: "Trust Center — Privacy, Security, Compliance & Transparency",
  description:
    "Single page that links every trust-relevant surface VC Deal Flow Signal publishes: privacy policy, terms, security disclosure, DPA, subprocessor list, annual transparency report, and machine-readable mirrors at /.well-known/.",
  path: "/trust",
});

const SITE = "https://signals.gitdealflow.com";

const TRUST_SURFACES: Array<{
  group: string;
  rows: Array<{ name: string; html: string; machine?: string; summary: string }>;
}> = [
  {
    group: "Legal",
    rows: [
      {
        name: "Privacy Policy",
        html: "/privacy",
        summary:
          "What we collect, how long we keep it, who processes it on our behalf.",
      },
      {
        name: "Terms of Service",
        html: "/terms",
        summary:
          "Use rules for the website, dashboard, MCP server, and Agent Credits.",
      },
      {
        name: "Data Processing Agreement",
        html: "/dpa",
        machine: "/.well-known/dpa.json",
        summary:
          "GDPR Art. 28 DPA template; counter-signed copy on request.",
      },
    ],
  },
  {
    group: "Security",
    rows: [
      {
        name: "Security Overview",
        html: "/security",
        summary:
          "How we protect subscriber email, Stripe customer IDs, and share-token endpoints.",
      },
      {
        name: "Coordinated Vulnerability Disclosure",
        html: "/disclosure",
        machine: "/.well-known/disclosure.json",
        summary:
          "How to report, what's in scope, response SLA, safe harbor.",
      },
      {
        name: "security.txt (RFC 9116)",
        html: "/.well-known/security.txt",
        machine: "/.well-known/security-policy.json",
        summary: "Canonical disclosure contact + JSON mirror.",
      },
    ],
  },
  {
    group: "Compliance",
    rows: [
      {
        name: "Subprocessors",
        html: "/subprocessors",
        machine: "/.well-known/subprocessors.json",
        summary:
          "Stripe, Vercel, Resend, PocketBase/Hetzner, PostHog (EU), GitHub, Cloudflare, Anthropic, Coinbase. Roles + DPAs + regions.",
      },
      {
        name: "Compliance Posture",
        html: "/.well-known/compliance.json",
        summary:
          "GDPR, CCPA, HIPAA, PCI, SOC2 status; data-residency; retention.",
      },
      {
        name: "AI / Data-Use Policy",
        html: "/ai.txt",
        machine: "/.well-known/ai-policy.json",
        summary:
          "Per-bot rules; training-data posture; CC BY 4.0 license terms.",
      },
    ],
  },
  {
    group: "Transparency",
    rows: [
      {
        name: "Annual Transparency Report",
        html: "/transparency",
        machine: "/.well-known/transparency.json",
        summary:
          "Government data requests, takedown demands, breaches — published yearly with explicit zeros.",
      },
      {
        name: "Service Status",
        html: "/uptime",
        summary:
          "Live uptime + freshness signals + last-modified watermarks.",
      },
      {
        name: "Corrections Log",
        html: "/corrections",
        summary:
          "Public log of every signal correction we've issued and the rationale.",
      },
    ],
  },
  {
    group: "Email & Tracking",
    rows: [
      {
        name: "MTA-STS Policy",
        html: "/.well-known/mta-sts.txt",
        summary:
          "RFC 8461. Mail to @gitdealflow.com must be delivered over TLS or rejected.",
      },
      {
        name: "Do-Not-Track Compliance",
        html: "/.well-known/dnt-policy.txt",
        summary:
          "We honor the EFF DNT Policy v1.0 for any browser/agent that sends DNT: 1.",
      },
    ],
  },
];

export default function TrustPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE}/trust`,
    name: "Trust Center — VC Deal Flow Signal",
    description: metadata.description,
    inLanguage: "en-US",
    license: "https://creativecommons.org/licenses/by/4.0/",
    isAccessibleForFree: true,
    mainEntity: {
      "@type": "ItemList",
      name: "Trust surfaces",
      itemListElement: TRUST_SURFACES.flatMap((g, gi) =>
        g.rows.map((r, ri) => ({
          "@type": "ListItem",
          position: gi * 10 + ri + 1,
          item: {
            "@type": "DigitalDocument",
            name: r.name,
            url: `${SITE}${r.html}`,
            description: r.summary,
            ...(r.machine
              ? {
                  encoding: {
                    "@type": "MediaObject",
                    contentUrl: `${SITE}${r.machine}`,
                    encodingFormat: r.machine.endsWith(".txt")
                      ? "text/plain"
                      : "application/json",
                  },
                }
              : {}),
          },
        })),
      ),
    },
    publisher: {
      "@type": "Organization",
      "@id": "https://gitdealflow.com/#organization",
    },
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="mb-10">
        <p className="text-sky-400 text-xs uppercase tracking-wider mb-2 font-semibold">
          Trust Center
        </p>
        <h1 className="text-4xl font-bold text-gray-100 mb-4 leading-tight">
          Privacy, security, compliance — in one page
        </h1>
        <p className="text-gray-300 text-base leading-relaxed max-w-3xl">
          Every legal, security, and operational disclosure is published on
          this site as both a human page and a machine-readable mirror at
          a stable <code className="text-emerald-400 font-mono text-sm">/.well-known/</code> path.
          Procurement teams, AI agents, and security researchers can all
          start here.
        </p>
      </header>

      <div className="space-y-8">
        {TRUST_SURFACES.map((group) => (
          <section key={group.group}>
            <h2 className="text-xs uppercase tracking-wider text-emerald-400 font-semibold mb-3">
              {group.group}
            </h2>
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 divide-y divide-slate-800">
              {group.rows.map((row) => (
                <div key={row.name} className="p-4 sm:p-5">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-1">
                    <Link
                      href={row.html}
                      className="text-sky-400 hover:text-sky-300 underline-offset-2 hover:underline font-semibold"
                    >
                      {row.name}
                    </Link>
                    <span className="font-mono text-xs text-gray-500">
                      {row.html}
                    </span>
                    {row.machine && (
                      <Link
                        href={row.machine}
                        className="text-emerald-400 hover:text-emerald-300 text-xs font-mono"
                      >
                        {row.machine}
                      </Link>
                    )}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {row.summary}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <footer className="mt-12 pt-6 border-t border-slate-800 text-sm text-gray-400 leading-relaxed">
        Questions or DPA requests:{" "}
        <a
          href="mailto:signal@gitdealflow.com"
          className="text-sky-400 hover:text-sky-300 underline-offset-2 hover:underline"
        >
          signal@gitdealflow.com
        </a>
        . All written documents on this site are licensed under{" "}
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          className="text-sky-400 hover:text-sky-300 underline-offset-2 hover:underline"
        >
          CC BY 4.0
        </a>
        .
      </footer>
    </article>
  );
}
