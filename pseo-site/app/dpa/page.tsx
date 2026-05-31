import Link from "next/link";
import { defineMetadata } from "@/lib/metadata";

export const metadata = defineMetadata({
  title: "Data Processing Agreement (DPA)",
  description:
    "GDPR Article 28 Data Processing Agreement template for VC Deal Flow Signal subscribers. Counter-signed PDF available on request to signal@gitdealflow.com within 5 business days.",
  path: "/dpa",
});

const SITE = "https://signals.gitdealflow.com";
const EFFECTIVE = "2026-05-08";

export default function DpaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE}/dpa`,
    name: "Data Processing Agreement — VC Deal Flow Signal",
    description: metadata.description,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    license: "https://creativecommons.org/licenses/by/4.0/",
    dateModified: EFFECTIVE,
    mainEntity: {
      "@type": "DigitalDocument",
      name: "VC Deal Flow Signal — Data Processing Agreement (GDPR Art. 28)",
      datePublished: EFFECTIVE,
      dateModified: EFFECTIVE,
      version: "2026-05-08.f38",
      license: "https://creativecommons.org/licenses/by/4.0/",
      encoding: { "@type": "MediaObject", contentUrl: `${SITE}/.well-known/dpa.json`, encodingFormat: "application/json" },
    },
    publisher: { "@type": "Organization", "@id": "https://gitdealflow.com/#organization" },
  };

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="mb-8">
        <p className="text-sky-400 text-xs uppercase tracking-wider mb-2 font-semibold">Data Processing Agreement</p>
        <h1 className="text-4xl font-bold text-gray-100 mb-3 leading-tight">DPA — GDPR Article 28</h1>
        <p className="text-gray-400 text-sm">Effective {EFFECTIVE} · Version 2026-05-08.f38</p>
      </header>

      <section className="mb-8 rounded-xl border border-emerald-700/30 bg-emerald-950/20 p-5 sm:p-6 space-y-3">
        <p className="text-emerald-300 text-xs font-semibold uppercase tracking-[0.14em]">
          Start with the most-requested trust routes
        </p>
        <p className="text-gray-300 text-sm leading-relaxed">
          Legal reviewers reading the DPA usually want the processor list, the privacy summary, and the main security controls next.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/subprocessors" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500 transition-colors">
            Review subprocessors →
          </Link>
          <Link href="/privacy" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
            Read privacy policy →
          </Link>
          <Link href="/security" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
            Read security overview →
          </Link>
        </div>
      </section>

      <section className="mb-8 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5 text-gray-200 text-sm leading-relaxed">
        <p className="font-semibold text-emerald-300 mb-2">Need a counter-signed copy?</p>
        <p>
          Email <a className="text-sky-400 hover:underline" href="mailto:signal@gitdealflow.com?subject=DPA%20countersign%20request">signal@gitdealflow.com</a> with your company legal name, billing entity, and the email address of the signatory. We return a PDF counter-signed by the operator within 5 business days. Machine-readable pointer: <Link href="/.well-known/dpa.json" className="text-emerald-400 hover:underline">/.well-known/dpa.json</Link>.
        </p>
      </section>

      <section className="prose prose-invert prose-sm max-w-none space-y-6 text-gray-200">
        <h2 className="text-xl font-semibold text-gray-100">1 · Parties</h2>
        <p><strong>Controller</strong>: the paid subscriber identified on the relevant Stripe invoice. <strong>Processor</strong>: VC Deal Flow Signal (GitDealFlow), operating <Link href="/" className="text-sky-400 hover:underline">signals.gitdealflow.com</Link>. Contact: <a className="text-sky-400 hover:underline" href="mailto:signal@gitdealflow.com">signal@gitdealflow.com</a>.</p>

        <h2 className="text-xl font-semibold text-gray-100">2 · Subject matter & duration</h2>
        <p>The Processor will process Personal Data on behalf of the Controller for the lifetime of the paid subscription, plus a 12-month retention window for audit and reactivation. After that window the Processor will delete the Personal Data, subject to legal retention obligations (Stripe records retained 7 years for tax purposes).</p>

        <h2 className="text-xl font-semibold text-gray-100">3 · Nature & purpose of processing</h2>
        <ul className="list-disc list-outside ml-5 space-y-1">
          <li>Hosting (Vercel EU primary, US failover) and edge compute.</li>
          <li>Subscription billing, refunds, and tax reporting (Stripe).</li>
          <li>Transactional email — onboarding, weekly digest, drip sequences (Resend).</li>
          <li>Subscriber records and share tokens (PocketBase on Hetzner Helsinki).</li>
          <li>Pseudonymous product analytics, no PII (PostHog EU).</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-100">4 · Data categories & subjects</h2>
        <ul className="list-disc list-outside ml-5 space-y-1">
          <li><strong>Categories</strong>: email address, Stripe customer ID, share-token records, server-log metadata.</li>
          <li><strong>Subjects</strong>: paid and free subscribers of the Controller&apos;s organisation.</li>
          <li>No special categories under GDPR Art. 9 are processed.</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-100">5 · Processor obligations</h2>
        <ol className="list-decimal list-outside ml-5 space-y-1">
          <li>Process Personal Data only on documented instructions from the Controller (the subscription contract is the documented instruction).</li>
          <li>Ensure persons authorised to process the data have committed themselves to confidentiality.</li>
          <li>Implement appropriate technical and organisational measures (TOMs) — see <Link href="/security" className="text-sky-400 hover:underline">/security</Link> and <Link href="/.well-known/security-policy.json" className="text-emerald-400 hover:underline">security-policy.json</Link>.</li>
          <li>Engage subprocessors only with prior general authorisation and 30-day notice of additions — see <Link href="/.well-known/subprocessors.json" className="text-emerald-400 hover:underline">/.well-known/subprocessors.json</Link>.</li>
          <li>Assist the Controller in responding to data-subject requests (access, deletion, portability, etc.).</li>
          <li>Notify the Controller without undue delay (within 72 hours) of becoming aware of a Personal Data breach.</li>
          <li>At the Controller&apos;s choice, delete or return Personal Data after the end of services and delete existing copies, unless EU or Member State law requires retention.</li>
          <li>Make available all information necessary to demonstrate compliance with Art. 28; allow for and contribute to audits, including inspections, conducted by the Controller or another auditor mandated by the Controller.</li>
        </ol>

        <h2 className="text-xl font-semibold text-gray-100">6 · Subprocessors & international transfers</h2>
        <p>Current subprocessor list at <Link href="/subprocessors" className="text-sky-400 hover:underline">/subprocessors</Link>. Non-EEA transfers (Stripe US, Resend US, GitHub US, Coinbase US, Anthropic US) operate under EU Standard Contractual Clauses Module Two (Controller-to-Processor), Decision (EU) 2021/914.</p>

        <h2 className="text-xl font-semibold text-gray-100">7 · Audit rights</h2>
        <p>The Controller may audit the Processor&apos;s GDPR compliance once per calendar year on 30 days&apos; notice. The Processor will respond to written audit questionnaires within 30 days; on-site audits are available on commercially reasonable terms. Subprocessor SOC 2 / ISO 27001 reports satisfy audit obligations for the relevant subprocessor scope.</p>

        <h2 className="text-xl font-semibold text-gray-100">8 · Liability</h2>
        <p>Liability for breaches of this DPA is governed by the Terms of Service liability cap at <Link href="/terms" className="text-sky-400 hover:underline">/terms §6</Link>. Nothing in this DPA limits the Processor&apos;s direct liability under Art. 82 GDPR.</p>

        <h2 className="text-xl font-semibold text-gray-100">9 · Termination & deletion</h2>
        <p>On termination of the subscription, the Processor will delete or return the Personal Data within 30 days, except for billing records that must be retained for tax purposes (7 years per Greek and EU tax law). The Controller may request a deletion certificate.</p>

        <h2 className="text-xl font-semibold text-gray-100">10 · Governing law</h2>
        <p>This DPA is governed by Greek law and the EU GDPR. Disputes are subject to <Link href="/terms" className="text-sky-400 hover:underline">/terms §9</Link>.</p>
      </section>

      <footer className="mt-10 pt-6 border-t border-slate-800 text-sm text-gray-400">
        License: <a href="https://creativecommons.org/licenses/by/4.0/" className="text-sky-400 hover:underline">CC BY 4.0</a>. Trust hub: <Link href="/trust" className="text-sky-400 hover:underline">/trust</Link>.
      </footer>
    </article>
  );
}
