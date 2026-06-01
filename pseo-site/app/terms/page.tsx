import Link from "next/link";
import { defineMetadata } from "@/lib/metadata";
import { DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";
import { TrustPageOutro } from "@/components/TrustPageOutro";

export const metadata = defineMetadata({
  title: "Terms of Service",
  description:
    "Use rules for the VC Deal Flow Signal website, dashboard, MCP server, Agent Credits, and Chrome extension. Plain-English summary first, formal terms below.",
  path: "/terms",
});

const SITE = "https://signals.gitdealflow.com";
const EFFECTIVE = "2026-05-08";

export default function TermsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE}/terms`,
    name: "Terms of Service — VC Deal Flow Signal",
    description: metadata.description,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    license: "https://creativecommons.org/licenses/by/4.0/",
    dateModified: EFFECTIVE,
    mainEntity: {
      "@type": "DigitalDocument",
      name: "VC Deal Flow Signal Terms of Service",
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
        <p className="text-sky-400 text-xs uppercase tracking-wider mb-2 font-semibold">Terms</p>
        <h1 className="text-4xl font-bold text-gray-100 mb-3 leading-tight">Terms of Service</h1>
        <p className="text-gray-400 text-sm">Effective {EFFECTIVE}.</p>
      </header>

      <section className="mb-8 rounded-xl border border-sky-700/30 bg-sky-950/20 p-5 sm:p-6">
        <p className="text-sky-300 text-xs font-semibold uppercase tracking-[0.14em] mb-2">For the buyer doing diligence</p>
        <p className="text-gray-200 text-sm leading-relaxed">
          Two lines decide this for most buyers: <strong>paid tiers are billed by Stripe and cancel in one click</strong>, and the signal is <strong>research output, not investment advice</strong>. Everything below is the standard wrapper around those two facts — no engineer required to read it.
        </p>
      </section>

      <section className="mb-8 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5">
        <h2 className="text-emerald-300 font-semibold mb-3">The short version</h2>
        <ul className="text-gray-200 text-sm leading-relaxed space-y-2 list-disc list-outside ml-5">
          <li>You can read, cite and link to anything on the site under <a href="https://creativecommons.org/licenses/by/4.0/" className="text-sky-400 hover:underline">CC BY 4.0</a>.</li>
          <li>Don&apos;t scrape past <code className="text-emerald-400">/.well-known/ai-policy.json</code> rate limits or republish at scale without attribution.</li>
          <li>Paid tiers are billed by Stripe; cancel any time from <Link href="/account" className="text-sky-400 hover:underline">/account</Link>.</li>
          <li>Signals are research output, not investment advice. We make no fitness-for-purpose warranty.</li>
          <li>Disputes governed by Greek law; venue: Athens. EU consumers retain Brussels I rights.</li>
        </ul>
      </section>

      <section className="prose prose-invert prose-sm max-w-none space-y-6 text-gray-200">
        <h2 className="text-xl font-semibold text-gray-100">1 · Acceptance</h2>
        <p>By using <Link href="/" className="text-sky-400 hover:underline">signals.gitdealflow.com</Link>, the dashboard, the MCP server, the Chrome extension, or the email digest, you agree to these Terms and to the <Link href="/privacy" className="text-sky-400 hover:underline">Privacy Policy</Link>.</p>

        <h2 className="text-xl font-semibold text-gray-100">2 · License to read, cite, build with</h2>
        <p>All written content, datasets, and JSON-LD output on this site is licensed under <a className="text-sky-400 hover:underline" href="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0</a>. Attribution: link back to <Link href="/" className="text-sky-400 hover:underline">signals.gitdealflow.com</Link> or cite using the BibTeX in <Link href="/citation-guide" className="text-sky-400 hover:underline">/citation-guide</Link>.</p>

        <h2 className="text-xl font-semibold text-gray-100">3 · Acceptable use</h2>
        <ul className="list-disc list-outside ml-5 space-y-1">
          <li>Honor <code className="text-emerald-400">robots.txt</code> and <code className="text-emerald-400">/.well-known/ai-policy.json</code> rate limits.</li>
          <li>Do not attempt to identify subscribers from share-token URLs.</li>
          <li>Do not bulk-republish ranked entity lists without attribution and a stable link.</li>
          <li>Do not abuse the free <code className="text-emerald-400">/api/answer</code> or <code className="text-emerald-400">/api/ask</code> endpoints (soft cap: 60 req/min/IP).</li>
          <li>Do not submit copyrighted or unlawful content via <code className="text-emerald-400">/api/crystal-ball/submit</code>.</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-100">4 · Paid tiers</h2>
        <p>Insider (€97/mo), Sharp (€497/mo), Sector Sweep (€1,997 one-time) and Agent Credits (€19 / 100 calls) are billed by Stripe. Refund policy: 14-day no-questions-asked for monthly subscriptions; one-time products refundable for 30 days if no significant value has been consumed (we read Stripe usage logs). Cancel any time from <Link href="/account" className="text-sky-400 hover:underline">/account</Link> or by emailing <a className="text-sky-400 hover:underline" href="mailto:signal@gitdealflow.com">signal@gitdealflow.com</a>.</p>

        <h2 className="text-xl font-semibold text-gray-100">5 · No investment advice</h2>
        <p>VC Deal Flow Signal is research-grade alternative-data output, not personalised financial or investment advice. Past commit-velocity and contributor-growth patterns do not guarantee future fundraise outcomes. You are solely responsible for any investment decision.</p>

        <h2 className="text-xl font-semibold text-gray-100">6 · Warranty disclaimer + liability cap</h2>
        <p>The service is provided &quot;as is&quot; without warranty. To the maximum extent permitted by law, our aggregate liability is capped at the greater of (a) €100 or (b) what you paid us in the preceding 12 months. Nothing in these terms limits our liability for fraud, gross negligence, or anything that cannot be limited by law.</p>

        <h2 className="text-xl font-semibold text-gray-100">7 · Indemnity</h2>
        <p>You will indemnify us against any third-party claim arising out of your unlawful use of the service, your scraping past published rate limits, or your republication of our content without attribution.</p>

        <h2 className="text-xl font-semibold text-gray-100">8 · Termination</h2>
        <p>We may suspend or terminate access for material breach of these Terms. We will give 7 days&apos; notice and a chance to cure, except for emergency security or fraud responses.</p>

        <h2 className="text-xl font-semibold text-gray-100">9 · Governing law</h2>
        <p>Greek law governs. Exclusive venue: courts of Athens. EU consumers retain mandatory consumer-protection rights and Brussels I jurisdiction options.</p>

        <h2 className="text-xl font-semibold text-gray-100">10 · Contact + changes</h2>
        <p>Questions: <a className="text-sky-400 hover:underline" href="mailto:signal@gitdealflow.com">signal@gitdealflow.com</a>. We will email all subscribers at least 30 days before any material change to these Terms; minor edits (typos, link updates) ship without notice. Version history at <Link href="/changelog" className="text-sky-400 hover:underline">/changelog</Link>.</p>
      </section>

      <TrustPageOutro acNote="I sell a signal, not a promise. That's why the terms are short, the liability is capped, the advice disclaimer is loud, and the exit is one click. If the math stops being useful, you leave — I'd rather lose the subscription than bury the off-ramp." />

      <footer className="mt-10 pt-6 border-t border-slate-800 text-sm text-gray-400">
        License: <a href="https://creativecommons.org/licenses/by/4.0/" className="text-sky-400 hover:underline">CC BY 4.0</a>. Trust hub: <Link href="/trust" className="text-sky-400 hover:underline">/trust</Link>.
      </footer>
    </article>
  );
}
