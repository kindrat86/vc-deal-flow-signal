import Link from "next/link";
import { defineMetadata } from "@/lib/metadata";

export const metadata = defineMetadata({
  title: "Security Overview",
  description:
    "How VC Deal Flow Signal protects subscriber email, Stripe customer IDs, share-token endpoints, and admin tooling. HSTS preload, CSP, strict TLS, no-PII analytics, RFC 9116 disclosure contact.",
  path: "/security",
});

const SITE = "https://signals.gitdealflow.com";

export default function SecurityPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE}/security`,
    name: "Security Overview — VC Deal Flow Signal",
    description: metadata.description,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    license: "https://creativecommons.org/licenses/by/4.0/",
    publisher: { "@type": "Organization", "@id": "https://gitdealflow.com/#organization" },
  };

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="mb-8">
        <p className="text-sky-400 text-xs uppercase tracking-wider mb-2 font-semibold">Security</p>
        <h1 className="text-4xl font-bold text-gray-100 mb-3 leading-tight">How we protect subscriber data</h1>
        <p className="text-gray-300 text-base leading-relaxed">
          Public-data-only architecture means most of our security surface is small by design: we never see card numbers, never store passwords, and never collect sensitive personal categories. The controls below cover what we <em>do</em> handle: subscriber email, Stripe customer IDs, share tokens, and our own admin tooling.
        </p>
      </header>

      <section className="space-y-6 text-gray-200 text-sm leading-relaxed">
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
          <h2 className="text-base font-semibold text-gray-100 mb-2">Transport security</h2>
          <ul className="list-disc list-outside ml-5 space-y-1">
            <li>HSTS preload (<code className="text-emerald-400">max-age=63072000; includeSubDomains; preload</code>) — included in the Chromium HSTS preload list.</li>
            <li>TLS 1.2+ only; cipher suites curated by Vercel&apos;s edge.</li>
            <li>Strict CSP (<code className="text-emerald-400">default-src &apos;self&apos;</code>) with auditable allowlist for PostHog EU and inline scripts.</li>
            <li>X-Frame-Options: DENY (no embedding).</li>
            <li>Referrer-Policy: <code className="text-emerald-400">strict-origin-when-cross-origin</code>.</li>
            <li>Permissions-Policy blocks camera, microphone, geolocation site-wide.</li>
          </ul>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
          <h2 className="text-base font-semibold text-gray-100 mb-2">Email security</h2>
          <ul className="list-disc list-outside ml-5 space-y-1">
            <li>SPF, DKIM, DMARC <code className="text-emerald-400">p=quarantine</code> on the gitdealflow.com sending domain.</li>
            <li>MTA-STS policy at <Link href="/.well-known/mta-sts.txt" className="text-sky-400 hover:underline">/.well-known/mta-sts.txt</Link> — inbound mail <code className="text-emerald-400">enforce</code> mode.</li>
            <li>TLS-RPT reporting on <code className="text-emerald-400">_smtp._tls.gitdealflow.com</code>.</li>
            <li>Resend handles transactional sends; audience hygiene tracked in <code className="text-emerald-400">lib/excluded-emails.mjs</code>.</li>
          </ul>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
          <h2 className="text-base font-semibold text-gray-100 mb-2">Authentication & secrets</h2>
          <ul className="list-disc list-outside ml-5 space-y-1">
            <li>No user passwords. Free signups: email-only opt-in. Paid users: API keys (<code className="text-emerald-400">gdf_v2.cus_xxx.&lt;hmac&gt;</code>) bound to a Stripe customer ID.</li>
            <li>Share tokens are URL-safe random IDs scoped to a single resource, with no enumeration vector.</li>
            <li>Admin tools: hardware-key MFA on Vercel, Stripe, Resend, GitHub. No shared admin credentials.</li>
            <li>Operator x402 wallet uses Coinbase CDP Server Wallet v2 — Wallet Secret stored in Vercel encrypted env.</li>
          </ul>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
          <h2 className="text-base font-semibold text-gray-100 mb-2">Vulnerability disclosure</h2>
          <p className="mb-2">We follow the disclose.io core terms. Safe harbor for good-faith research, 72-hour acknowledgement SLA, attribution on the hall-of-fame page (or anonymous, your choice).</p>
          <ul className="list-disc list-outside ml-5 space-y-1">
            <li>Full policy: <Link href="/disclosure" className="text-sky-400 hover:underline">/disclosure</Link></li>
            <li>RFC 9116 contact: <Link href="/.well-known/security.txt" className="text-sky-400 hover:underline">/.well-known/security.txt</Link></li>
            <li>Machine-readable: <Link href="/.well-known/disclosure.json" className="text-emerald-400 hover:underline">/.well-known/disclosure.json</Link>, <Link href="/.well-known/security-policy.json" className="text-emerald-400 hover:underline">/.well-known/security-policy.json</Link></li>
          </ul>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
          <h2 className="text-base font-semibold text-gray-100 mb-2">Subprocessor controls</h2>
          <p className="mb-2">We rely on the SOC 2 Type II / ISO 27001 footprints of upstream processors for the foundation: Stripe (PCI-DSS Level 1), Vercel, Resend, PostHog EU, Hetzner. Full inventory and DPAs at <Link href="/subprocessors" className="text-sky-400 hover:underline">/subprocessors</Link>.</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
          <h2 className="text-base font-semibold text-gray-100 mb-2">Incident response</h2>
          <ul className="list-disc list-outside ml-5 space-y-1">
            <li>72-hour breach notification to subscribers (GDPR Art. 33).</li>
            <li>Public corrections log at <Link href="/corrections" className="text-sky-400 hover:underline">/corrections</Link>.</li>
            <li>Annual transparency report at <Link href="/transparency" className="text-sky-400 hover:underline">/transparency</Link> with a standing warrant canary.</li>
            <li>Status surface at <Link href="/uptime" className="text-sky-400 hover:underline">/uptime</Link>.</li>
          </ul>
        </div>
      </section>

      <footer className="mt-10 pt-6 border-t border-slate-800 text-sm text-gray-400">
        Report a vulnerability: <a className="text-sky-400 hover:underline" href="mailto:signal@gitdealflow.com?subject=Security%20disclosure">signal@gitdealflow.com</a>. Trust hub: <Link href="/trust" className="text-sky-400 hover:underline">/trust</Link>.
      </footer>
    </article>
  );
}
