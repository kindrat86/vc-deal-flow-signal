import Link from "next/link";
import { defineMetadata } from "@/lib/metadata";

export const metadata = defineMetadata({
  title: "Subprocessors",
  description:
    "Every third-party processor that handles VC Deal Flow Signal data: Stripe, Vercel, Resend, PocketBase/Hetzner, PostHog (EU), GitHub, Cloudflare, Anthropic, Coinbase. Roles, regions, certifications, DPAs.",
  path: "/subprocessors",
});

const SITE = "https://signals.gitdealflow.com";

interface SubprocessorRow {
  name: string;
  role: string;
  region: string;
  isPii: boolean;
  certs: string[];
  dpa: string;
  notes: string;
}

const ROWS: SubprocessorRow[] = [
  {
    name: "Stripe",
    role: "Payment processor + subscription billing",
    region: "EU + US",
    isPii: true,
    certs: ["PCI-DSS L1", "SOC 2 Type II", "ISO 27001"],
    dpa: "https://stripe.com/legal/dpa",
    notes: "Tokenises card data client-side; we never see PAN.",
  },
  {
    name: "Vercel",
    role: "Hosting, CDN, edge compute, log retention",
    region: "EU (fra1 primary), US (iad1 failover)",
    isPii: true,
    certs: ["SOC 2 Type II", "ISO 27001"],
    dpa: "https://vercel.com/legal/dpa",
    notes: "30-day log retention; no PII in app logs.",
  },
  {
    name: "Resend",
    role: "Transactional email + audience management",
    region: "US (Tigris primary)",
    isPii: true,
    certs: ["SOC 2 Type II"],
    dpa: "https://resend.com/legal/dpa",
    notes: "All weekly digest, drip and book-funnel email flows.",
  },
  {
    name: "PocketBase / Hetzner",
    role: "Subscriber records, share-tokens, scout sessions",
    region: "EU (Hetzner Helsinki)",
    isPii: true,
    certs: ["ISO 27001 (Hetzner)"],
    dpa: "https://www.hetzner.com/legal/data-processing-agreement",
    notes: "Single VPS with full-disk encryption + TLS-only.",
  },
  {
    name: "Coinbase Developer Platform",
    role: "x402 facilitator + CDP Server Wallet",
    region: "US",
    isPii: false,
    certs: ["SOC 1 Type II", "SOC 2 Type II"],
    dpa: "https://www.coinbase.com/legal/privacy",
    notes: "Used only by /api/agent/deep-signal/x402; agents pay, no human PII.",
  },
  {
    name: "PostHog (EU Cloud)",
    role: "Pseudonymous product analytics",
    region: "EU (Frankfurt)",
    isPii: false,
    certs: ["SOC 2 Type II"],
    dpa: "https://posthog.com/dpa",
    notes: "persistence: 'memory'; person_profiles: 'identified_only'.",
  },
  {
    name: "GitHub",
    role: "Source data — public commit/repo events",
    region: "US",
    isPii: false,
    certs: ["SOC 1 Type II", "SOC 2 Type II", "ISO 27001"],
    dpa: "https://docs.github.com/en/site-policy/privacy-policies",
    notes: "Public events API only; no private repo or OAuth-scoped data.",
  },
  {
    name: "Cloudflare",
    role: "Apex DNS + DDoS shield (gitdealflow.com)",
    region: "Global anycast",
    isPii: true,
    certs: ["SOC 2 Type II", "ISO 27001", "PCI-DSS"],
    dpa: "https://www.cloudflare.com/cloudflare-customer-dpa/",
    notes: "signals.gitdealflow.com is Vercel-direct, not Cloudflare-fronted.",
  },
  {
    name: "Anthropic",
    role: "LLM inference for /api/answer + /api/ask summarisation",
    region: "US",
    isPii: false,
    certs: ["SOC 2 Type II", "ISO 27001"],
    dpa: "https://www.anthropic.com/legal/dpa",
    notes: "Zero retention via API workspace; queries never used for training.",
  },
];

export default function SubprocessorsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE}/subprocessors`,
    name: "Subprocessor Registry — VC Deal Flow Signal",
    description: metadata.description,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    license: "https://creativecommons.org/licenses/by/4.0/",
    dateModified: new Date().toISOString().slice(0, 10),
    mainEntity: {
      "@type": "ItemList",
      name: "Subprocessors",
      itemListElement: ROWS.map((r, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Organization",
          name: r.name,
          description: r.role,
          areaServed: r.region,
          subjectOf: { "@type": "DigitalDocument", name: "Data Processing Agreement", url: r.dpa },
        },
      })),
      encoding: { "@type": "MediaObject", contentUrl: `${SITE}/.well-known/subprocessors.json`, encodingFormat: "application/json" },
    },
    publisher: { "@type": "Organization", "@id": "https://gitdealflow.com/#organization" },
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="mb-8">
        <p className="text-sky-400 text-xs uppercase tracking-wider mb-2 font-semibold">Subprocessors</p>
        <h1 className="text-4xl font-bold text-gray-100 mb-3 leading-tight">Who else handles your data</h1>
        <p className="text-gray-300 text-base leading-relaxed max-w-3xl">
          Every third-party processor we engage. Ordered by data-sensitivity tier. We will email all paid subscribers at least 30 days before adding a new subprocessor that processes subscriber PII.
        </p>
      </header>

      <section className="mb-8 rounded-xl border border-emerald-700/30 bg-emerald-950/20 p-5 sm:p-6 space-y-3">
        <p className="text-emerald-300 text-xs font-semibold uppercase tracking-[0.14em]">
          Start with the most-requested trust routes
        </p>
        <p className="text-gray-300 text-sm leading-relaxed max-w-3xl">
          Buyers who inspect processors usually want the legal wrapper, the live reliability surface, and the main security summary next.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/dpa" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500 transition-colors">
            Read the DPA →
          </Link>
          <Link href="/security" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
            Read security overview →
          </Link>
          <Link href="/uptime" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
            Check live uptime →
          </Link>
        </div>
      </section>

      <div className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-900/60 border-b border-slate-800">
              <th className="text-left px-4 py-3 font-semibold text-gray-100">Subprocessor</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-100 hidden sm:table-cell">Role</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-100">Region</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-100">PII?</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-100">DPA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {ROWS.map((r) => (
              <tr key={r.name} className="hover:bg-slate-900/40 transition-colors">
                <td className="px-4 py-3 align-top">
                  <div className="text-gray-100 font-semibold">{r.name}</div>
                  <div className="text-gray-400 text-xs mt-0.5 sm:hidden">{r.role}</div>
                  <div className="text-gray-500 text-xs mt-1 hidden sm:block">{r.notes}</div>
                  <div className="text-emerald-400/80 text-xs mt-1 font-mono hidden sm:block">{r.certs.join(" · ")}</div>
                </td>
                <td className="px-4 py-3 align-top hidden sm:table-cell text-gray-300">{r.role}</td>
                <td className="px-4 py-3 align-top text-gray-300 text-xs">{r.region}</td>
                <td className="px-4 py-3 align-top">
                  <span
                    className={
                      r.isPii
                        ? "inline-flex items-center px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 text-xs font-medium"
                        : "inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-medium"
                    }
                  >
                    {r.isPii ? "PII" : "no PII"}
                  </span>
                </td>
                <td className="px-4 py-3 align-top">
                  <a
                    href={r.dpa}
                    className="text-sky-400 hover:text-sky-300 underline-offset-2 hover:underline text-xs"
                    rel="external noopener"
                  >
                    DPA →
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="mt-8 pt-6 border-t border-slate-800 text-sm text-gray-400 leading-relaxed">
        Machine-readable: <Link href="/.well-known/subprocessors.json" className="text-emerald-400 hover:underline">/.well-known/subprocessors.json</Link>. Companion docs: <Link href="/dpa" className="text-sky-400 hover:underline">/dpa</Link>, <Link href="/.well-known/compliance.json" className="text-emerald-400 hover:underline">/.well-known/compliance.json</Link>. Questions: <a className="text-sky-400 hover:underline" href="mailto:signal@gitdealflow.com">signal@gitdealflow.com</a>.
      </footer>
    </article>
  );
}
