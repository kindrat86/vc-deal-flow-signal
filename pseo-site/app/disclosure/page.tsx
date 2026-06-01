import Link from "next/link";
import { defineMetadata } from "@/lib/metadata";
import { DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";
import { TrustPageOutro } from "@/components/TrustPageOutro";

export const metadata = defineMetadata({
  title: "Coordinated Vulnerability Disclosure",
  description:
    "How to report security issues to VC Deal Flow Signal. Aligned with disclose.io core terms — safe harbor for good-faith research, 72-hour ack, attribution on the hall-of-fame page.",
  path: "/disclosure",
});

const SITE = "https://signals.gitdealflow.com";

export default function DisclosurePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE}/disclosure`,
    name: "Coordinated Vulnerability Disclosure — VC Deal Flow Signal",
    description: metadata.description,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    license: "https://creativecommons.org/licenses/by/4.0/",
    mainEntity: {
      "@type": "DigitalDocument",
      name: "Coordinated Vulnerability Disclosure Policy v1.0",
      license: "https://creativecommons.org/licenses/by/4.0/",
      encoding: { "@type": "MediaObject", contentUrl: `${SITE}/.well-known/disclosure.json`, encodingFormat: "application/json" },
    },
    author: DATA_NERD_AUTHOR_REF,
    publisher: { "@type": "Organization", "@id": "https://gitdealflow.com/#organization" },
  };

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="mb-8">
        <p className="text-sky-400 text-xs uppercase tracking-wider mb-2 font-semibold">Coordinated Disclosure</p>
        <h1 className="text-4xl font-bold text-gray-100 mb-3 leading-tight">Report a vulnerability</h1>
        <p className="text-gray-300 text-base leading-relaxed">
          We follow the <a className="text-sky-400 hover:underline" href="https://github.com/disclose/disclose.io/blob/master/data/core-terms.md">disclose.io core terms</a>. If you find a security issue affecting VC Deal Flow Signal in good faith and follow this policy, we will not pursue legal action.
        </p>
      </header>

      <section className="mb-8 rounded-xl border border-sky-700/30 bg-sky-950/20 p-5 sm:p-6">
        <p className="text-sky-300 text-xs font-semibold uppercase tracking-[0.14em] mb-2">Why a buyer should care</p>
        <p className="text-gray-200 text-sm leading-relaxed">
          You may never report a bug — but the existence of this page is the signal: a vendor that publishes a real disclosure policy, a safe harbor, named scope, and response SLAs is a vendor that has already thought about what happens when something breaks. Most six-person data shops haven&apos;t.
        </p>
      </section>

      <section className="mb-8 rounded-xl border border-emerald-700/30 bg-emerald-950/20 p-5 sm:p-6 space-y-3">
        <p className="text-emerald-300 text-xs font-semibold uppercase tracking-[0.14em]">
          Start with the most-requested trust routes
        </p>
        <p className="text-gray-300 text-sm leading-relaxed">
          Researchers and buyers reading disclosure policy usually want the main security summary, current service status, and the broader trust center next.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/security" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500 transition-colors">
            Read security overview →
          </Link>
          <Link href="/uptime" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
            Check live uptime →
          </Link>
          <Link href="/trust" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
            Open trust center →
          </Link>
        </div>
      </section>

      <section className="mb-8 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5 text-emerald-100 text-sm leading-relaxed">
        <p className="font-semibold mb-2">Quick path</p>
        <ol className="list-decimal list-outside ml-5 space-y-1">
          <li>Email{" "}
            <a className="text-sky-400 hover:underline" href="mailto:signal@gitdealflow.com?subject=Security%20disclosure">
              signal@gitdealflow.com
            </a>{" "}
            with subject prefix &quot;[security]&quot;.
          </li>
          <li>Include: brief title, scope (URL/host), reproduction steps, impact, and your handle for attribution if you want to be listed.</li>
          <li>We acknowledge within 72 hours and triage within 5 business days.</li>
        </ol>
      </section>

      <section className="space-y-6 text-gray-200 text-sm leading-relaxed">
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
          <h2 className="text-base font-semibold text-gray-100 mb-2">Safe harbor</h2>
          <p>
            We will not initiate legal action against researchers who in good faith follow this policy: do not access more data than necessary, avoid degrading service for other users, do not modify or destroy data, and give us reasonable time to respond before public disclosure (90 days, coordinated).
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
          <h2 className="text-base font-semibold text-gray-100 mb-2">In scope</h2>
          <ul className="list-disc list-outside ml-5 space-y-1">
            <li><code className="text-emerald-400">https://signals.gitdealflow.com</code> (apex + all subpaths)</li>
            <li><code className="text-emerald-400">https://gitdealflow.com</code> (apex + all subpaths)</li>
            <li><code className="text-emerald-400">https://gitdealflow-pb.fly.dev</code> (PocketBase backend)</li>
            <li><code className="text-emerald-400">@gitdealflow/mcp-signal</code> (npm package)</li>
            <li>The Chrome extension at <code className="text-emerald-400">hehkgipiamajnnlpkfhpeoeaoaogmknn</code></li>
          </ul>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
          <h2 className="text-base font-semibold text-gray-100 mb-2">Out of scope</h2>
          <ul className="list-disc list-outside ml-5 space-y-1 text-gray-300">
            <li>Subprocessor systems (Stripe, Vercel, Resend, etc.) — please report via their own programs</li>
            <li>Editorial findings on <code className="text-emerald-400">/content/*</code> SEO copy</li>
            <li>Self-XSS and clickjacking on pages without sensitive actions</li>
            <li>Issues that require physical access or social engineering</li>
            <li>Rate-limit-only issues without a security impact</li>
            <li>Reports from automated scanners without manual validation</li>
            <li>Best-practice nits on missing security headers for static asset paths</li>
          </ul>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
          <h2 className="text-base font-semibold text-gray-100 mb-2">High-priority categories</h2>
          <ul className="list-disc list-outside ml-5 space-y-1">
            <li>Auth / authz bypass on <code className="text-emerald-400">/api/account/*</code> or share-token endpoints</li>
            <li>SSRF via image proxies</li>
            <li>Stored XSS executable in an authenticated context</li>
            <li>Remote code execution / command injection</li>
            <li>Information disclosure of subscriber PII or Stripe metadata</li>
            <li>IDOR on share-token / receipts surfaces</li>
            <li>Subdomain takeover affecting any in-scope hostname</li>
          </ul>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
          <h2 className="text-base font-semibold text-gray-100 mb-2">Reward</h2>
          <p>
            Pre-revenue solo operation. We can&apos;t yet pay cash bounties, but for valid reports we offer:
          </p>
          <ul className="list-disc list-outside ml-5 space-y-1 mt-2">
            <li>Attribution on the public hall-of-fame at <Link href="/security/hall-of-fame" className="text-sky-400 hover:underline">/security/hall-of-fame</Link> (or anonymous, your choice)</li>
            <li>A free Sharp Tier subscription for the year following responsible disclosure</li>
            <li>A personal thank-you note from the founder</li>
          </ul>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
          <h2 className="text-base font-semibold text-gray-100 mb-2">Response SLAs</h2>
          <ul className="list-disc list-outside ml-5 space-y-1">
            <li>Acknowledgement: within 72 hours</li>
            <li>Triage decision: within 5 business days</li>
            <li>Median fix time: 14 business days for high/critical</li>
            <li>Public coordinated disclosure: 90 days from initial report</li>
          </ul>
        </div>
      </section>

      <TrustPageOutro acNote="I publish my methodology's misses every Tuesday. If you find a hole in the site, I'll treat it the same way: acknowledged fast, fixed in the open, credited if you want it. Same discipline, different surface." />

      <footer className="mt-10 pt-6 border-t border-slate-800 text-sm text-gray-400">
        Machine-readable: <Link href="/.well-known/disclosure.json" className="text-emerald-400 hover:underline">/.well-known/disclosure.json</Link>, <Link href="/.well-known/security.txt" className="text-sky-400 hover:underline">/.well-known/security.txt</Link>. Trust hub: <Link href="/trust" className="text-sky-400 hover:underline">/trust</Link>.
      </footer>
    </article>
  );
}
