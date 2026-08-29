import Link from "next/link";
import { defineMetadata } from "@/lib/metadata";
import { DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";
import { TrustPageOutro } from "@/components/TrustPageOutro";

export const metadata = defineMetadata({
  title: "Privacy Policy",
  description:
    "What VC Deal Flow Signal collects, how long we keep it, who processes it on our behalf, and how to exercise GDPR / CCPA rights. Plain-English summary first; precise terms below.",
  path: "/privacy",
});

const SITE = "https://signals.gitdealflow.com";
const EFFECTIVE = "2026-05-08";

export default function PrivacyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE}/privacy`,
    name: "Privacy Policy, VC Deal Flow Signal",
    description: metadata.description,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    license: "https://creativecommons.org/licenses/by/4.0/",
    dateModified: EFFECTIVE,
    mainEntity: {
      "@type": "DigitalDocument",
      name: "VC Deal Flow Signal Privacy Policy",
      datePublished: EFFECTIVE,
      dateModified: EFFECTIVE,
      version: "2026-05-08.f38",
      license: "https://creativecommons.org/licenses/by/4.0/",
    },
    author: DATA_NERD_AUTHOR_REF,
    publisher: { "@type": "Organization", "@id": "https://gitdealflow.com/#organization" },
  };

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="mb-8">
        <p className="text-sky-400 text-xs uppercase tracking-wider mb-2 font-semibold">Privacy</p>
        <h1 className="text-4xl font-bold text-gray-100 mb-3 leading-tight">Privacy Policy</h1>
        <p className="text-gray-400 text-sm">Effective {EFFECTIVE} · Plain English first, precise terms below.</p>
      </header>

      <section className="mb-8 rounded-xl border border-sky-700/30 bg-sky-950/20 p-5 sm:p-6">
        <p className="text-sky-300 text-xs font-semibold uppercase tracking-[0.14em] mb-2">For the buyer doing diligence</p>
        <p className="text-gray-200 text-sm leading-relaxed">
          Reviewing us for an investment committee or a procurement checklist? The one-line version: <strong>we rank public companies, not people</strong>: the only personal data we hold on <em>you</em> is the email you opted in with. No card numbers, no tracking pixels, nothing sold. Forward this page to legal; you won&apos;t need an engineer to clear it.
        </p>
      </section>

      <section className="mb-8 rounded-xl border border-emerald-700/30 bg-emerald-950/20 p-5 sm:p-6 space-y-3">
        <p className="text-emerald-300 text-xs font-semibold uppercase tracking-[0.14em]">
          Start with the most-requested trust routes
        </p>
        <p className="text-gray-300 text-sm leading-relaxed">
          Privacy readers usually want the processor list, the DPA, and the security summary that explains how the data is protected in practice.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/subprocessors" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500 transition-colors">
            Review subprocessors →
          </Link>
          <Link href="/dpa" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
            Read the DPA →
          </Link>
          <Link href="/security" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
            Read security overview →
          </Link>
        </div>
      </section>

      <section className="mb-8 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5">
        <h2 className="text-emerald-300 font-semibold mb-3">The short version</h2>
        <ul className="text-gray-200 text-sm leading-relaxed space-y-2 list-disc list-outside ml-5">
          <li><strong>We rank public companies, not people.</strong> Inputs are the public GitHub events API, Wikidata, and SSRN, not individual user activity.</li>
          <li><strong>Free subscribers</strong> give us only an email address; we use it to send the weekly digest and the optional drip sequence.</li>
          <li><strong>Paid subscribers</strong> add a Stripe customer ID; Stripe handles payment data, we never see card numbers.</li>
          <li><strong>Voluntary customer feedback</strong>, support messages, cancellation answers, and satisfaction responses are used only to improve GitDealFlow. An email address is optional except when you ask for support.</li>
          <li><strong>Pseudonymous analytics</strong> via PostHog EU, plus Google Analytics 4 for aggregated traffic. We set <em>one</em> first-party cookie on <code className="text-emerald-400">.gitdealflow.com</code> so the same visitor isn&apos;t double-counted across pages; GA4 sets its own measurement cookies. No advertising or retargeting pixels. We honor <Link href="/.well-known/dnt-policy.txt" className="text-sky-400 hover:underline">DNT: 1</Link> and Global Privacy Control by auto-opting-out.</li>
          <li><strong>No selling, no behavioural advertising,</strong> ever. CCPA "do-not-sell" is moot, there's nothing to sell.</li>
          <li><strong>Email <a className="text-sky-400 hover:underline" href="mailto:signals@gitdealflow.com">signals@gitdealflow.com</a></strong> for access, deletion, or DPA execution.</li>
        </ul>
      </section>

      <section className="prose prose-invert prose-sm max-w-none space-y-6 text-gray-200">
        <h2 className="text-xl font-semibold text-gray-100 mt-8">1 · Who we are</h2>
        <p>VC Deal Flow Signal (also "GitDealFlow", "we") operates the website at <Link href="/" className="text-sky-400 hover:underline">signals.gitdealflow.com</Link>, the dashboard, the MCP server <code className="text-emerald-400">@gitdealflow/mcp-signal</code>, the Chrome extension, and the weekly email digest. Contact: <a className="text-sky-400 hover:underline" href="mailto:signals@gitdealflow.com">signals@gitdealflow.com</a>. Founder identity and contact details: <Link href="/about" className="text-sky-400 hover:underline">/about</Link>.</p>

        <h2 className="text-xl font-semibold text-gray-100">2 · What we collect</h2>
        <p>Three categories, each with a different basis under GDPR Art. 6:</p>
        <ul className="list-disc list-outside ml-5 space-y-1">
          <li><strong>Subscriber data</strong>: email address (free + paid), Stripe customer ID (paid), share-token records (when you create a "share my receipts" link). Legal basis: contract (Art. 6(1)(b)) for paid; consent (Art. 6(1)(a)) for free email opt-in.</li>
          <li><strong>Server logs</strong>: request URL, IP, user-agent. Stored 30 days at Vercel (the hosting provider). Legal basis: legitimate interest (Art. 6(1)(f)) in operating the service.</li>
          <li><strong>Pseudonymous analytics</strong>: page-view counters, sector popularity. PostHog EU; person profiles are <em>identified-only</em> (anonymous visitors never get a profile). One first-party cookie (<code className="text-emerald-400">ph_*</code>) is set on <code className="text-emerald-400">.gitdealflow.com</code> to stitch pageviews from the same visitor across our own subdomains; this cookie carries an opaque ID, never a name or email. Legal basis: legitimate interest. Browsers sending DNT or GPC are excluded automatically.</li>
          <li><strong>Customer feedback</strong>: feature requests, support messages, cancellation answers, and satisfaction responses you submit voluntarily. The written answer is stored as an anonymous PostHog EU event and delivered to the GitDealFlow product inbox; an optional reply email is kept in the inbox only. Legal basis: consent or contract, depending on the request.</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-100">3 · What we do NOT collect</h2>
        <ul className="list-disc list-outside ml-5 space-y-1">
          <li>No payment card numbers (Stripe handles, PCI-DSS Level 1).</li>
          <li>No password fields, we authenticate paid features via API keys and Stripe magic links, not user-passwords.</li>
          <li>No sensitive categories (health, biometric, ethnic, political, etc.).</li>
          <li>No childrens' data, service not directed at users under 16.</li>
          <li>No cross-site tracking pixels.</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-100">4 · Subprocessors</h2>
        <p>We use a small set of third-party processors. Full list with roles, regions, certifications and DPAs: <Link href="/subprocessors" className="text-sky-400 hover:underline">/subprocessors</Link> (machine-readable: <Link href="/.well-known/subprocessors.json" className="text-emerald-400 hover:underline">/.well-known/subprocessors.json</Link>). Headline: Stripe (payments), Vercel (hosting EU primary), Resend (email), PocketBase on Hetzner Helsinki (subscriber DB), PostHog EU (analytics), Cloudflare (apex DNS).</p>

        <h2 className="text-xl font-semibold text-gray-100">5 · International transfers</h2>
        <p>Primary processing region is the EU (Vercel fra1, Hetzner Helsinki, PostHog Frankfurt). Failover and US-only subprocessors (Stripe, Resend, GitHub, Coinbase, Anthropic) operate under Standard Contractual Clauses Module Two. Details in <Link href="/.well-known/dpa.json" className="text-emerald-400 hover:underline">/.well-known/dpa.json</Link>.</p>

        <h2 className="text-xl font-semibold text-gray-100">6 · Retention</h2>
        <ul className="list-disc list-outside ml-5 space-y-1">
          <li>Subscriber email, until unsubscribe + 12 months (then deletion).</li>
          <li>Stripe customer record, lifetime of subscription + 7 years (tax law).</li>
          <li>Server logs, 30 days (Vercel default).</li>
          <li>Analytics events, 30 days, no PII.</li>
          <li>Customer feedback and satisfaction responses, 12 months; support threads, for the subscription term plus 12 months.</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-100">7 · Your rights</h2>
        <p>Under GDPR / UK-GDPR / CCPA you can ask us to access, correct, port, restrict, or delete your data. Email <a className="text-sky-400 hover:underline" href="mailto:signals@gitdealflow.com">signals@gitdealflow.com</a> with the address you signed up under; we'll respond within 30 days (typically 5 business days). Free unsubscribe is one click in any email footer.</p>

        <h2 className="text-xl font-semibold text-gray-100">8 · Security</h2>
        <p>HSTS preload, CSP, strict TLS, MFA on every admin tool. Vulnerability disclosure program at <Link href="/disclosure" className="text-sky-400 hover:underline">/disclosure</Link>; security contact in <Link href="/.well-known/security.txt" className="text-sky-400 hover:underline">/.well-known/security.txt</Link>. Breach notification SLA is 72 hours per GDPR Art. 33.</p>

        <h2 className="text-xl font-semibold text-gray-100">9 · Changes to this policy</h2>
        <p>We will email all subscribers at least 30 days before any change that materially expands what we collect or who processes it. Version history is published at <Link href="/changelog" className="text-sky-400 hover:underline">/changelog</Link>.</p>

        <h2 className="text-xl font-semibold text-gray-100">10 · Supervisory authority</h2>
        <p>If you believe we have mishandled your data, you may complain to your local data protection authority. Our default supervisory authority is the Hellenic Data Protection Authority (HDPA), since the operator is based in Greece.</p>
      </section>

      <TrustPageOutro institutional acNote="I hold as little of your data as the product can survive on. The same instinct that keeps my face off this site keeps your inbox off everyone else's: the less I keep, the less anyone can ever take, sell, or leak. We rank public companies, not you." />

      <footer className="mt-10 pt-6 border-t border-slate-800 text-sm text-gray-400">
        License: <a href="https://creativecommons.org/licenses/by/4.0/" className="text-sky-400 hover:underline">CC BY 4.0</a>. Contact: <a href="mailto:signals@gitdealflow.com" className="text-sky-400 hover:underline">signals@gitdealflow.com</a>. Trust hub: <Link href="/trust" className="text-sky-400 hover:underline">/trust</Link>.
      </footer>
    </article>
  );
}
