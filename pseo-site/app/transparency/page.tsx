import Link from "next/link";
import { defineMetadata } from "@/lib/metadata";
import { TrustConversionBlock } from "@/components/TrustConversionBlock";

export const metadata = defineMetadata({
  title: "Annual Transparency Report",
  description:
    "Annual disclosure of government data requests, content takedown demands, court orders, and breaches handled by VC Deal Flow Signal. Zero figures published explicitly. Standing warrant canary.",
  path: "/transparency",
});

const SITE = "https://signals.gitdealflow.com";

export default function TransparencyPage() {
  const ASOF = new Date().toISOString().slice(0, 10);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE}/transparency`,
    name: "Annual Transparency Report — VC Deal Flow Signal",
    description: metadata.description,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    license: "https://creativecommons.org/licenses/by/4.0/",
    dateModified: ASOF,
    mainEntity: {
      "@type": "Report",
      name: "VC Deal Flow Signal — Annual Transparency Report 2026",
      datePublished: ASOF,
      dateModified: ASOF,
      license: "https://creativecommons.org/licenses/by/4.0/",
      encoding: {
        "@type": "MediaObject",
        contentUrl: `${SITE}/.well-known/transparency.json`,
        encodingFormat: "application/json",
      },
    },
    publisher: { "@type": "Organization", "@id": "https://gitdealflow.com/#organization" },
  };

  const Cell = ({ label, value }: { label: string; value: number | string }) => (
    <div className="flex items-baseline justify-between py-1.5 border-b border-slate-800/60 text-sm">
      <span className="text-gray-300">{label}</span>
      <span className="font-mono text-emerald-400 text-base tabular-nums">{value}</span>
    </div>
  );

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="mb-8">
        <p className="text-sky-400 text-xs uppercase tracking-wider mb-2 font-semibold">Transparency</p>
        <h1 className="text-4xl font-bold text-gray-100 mb-3 leading-tight">Annual Transparency Report</h1>
        <p className="text-gray-400 text-sm">As of {ASOF} · Next refresh: 2027-01-15.</p>
      </header>

      <section className="mb-8 rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 text-amber-100 text-sm leading-relaxed">
        <p className="font-semibold mb-1">Standing warrant canary</p>
        <p>
          As of {ASOF}, VC Deal Flow Signal has never received a National Security Letter, FISA Court order, or any classified law-enforcement request. This statement will be <em>removed</em> (rather than altered or denied) if such a request is ever received.
        </p>
      </section>

      <section className="space-y-6">
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
          <h2 className="text-base font-semibold text-gray-100 mb-3">Calendar 2026 (live, year-to-date)</h2>
          <div className="space-y-1">
            <Cell label="Government data requests received" value={0} />
            <Cell label="Government data requests complied with" value={0} />
            <Cell label="Court orders received" value={0} />
            <Cell label="Content takedown demands received" value={0} />
            <Cell label="Subscriber accounts terminated for abuse / fraud" value={0} />
            <Cell label="Confirmed data breaches" value={0} />
            <Cell label="Subscribers affected by breaches" value={0} />
            <Cell label="Law-enforcement contact instances" value={0} />
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Public-data-only architecture: ranked entities are corporate GitHub orgs and public venture entities, sourced from public GitHub events + Wikidata + SSRN. Takedown requests would be evaluated under DMCA / GDPR Art. 17 / EU DSA depending on the claim.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
          <h2 className="text-base font-semibold text-gray-100 mb-3">Calendar 2025 (pre-launch)</h2>
          <p className="text-sm text-gray-300">
            Service launched on 2026-01-08. No operational data exists for calendar 2025.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
          <h2 className="text-base font-semibold text-gray-100 mb-3">Standing policies</h2>
          <ul className="list-disc list-outside ml-5 space-y-1.5 text-gray-200 text-sm">
            <li>We require valid legal process for any subscriber-data request and we challenge overbroad requests.</li>
            <li>We notify the affected user before complying — unless prohibited by court order or there is a clear and imminent risk of physical harm.</li>
            <li>Median content-takedown response time: 72 hours. Frameworks honored: DMCA, GDPR Art. 17 (right to erasure), EU Digital Services Act.</li>
            <li>Breach notification SLA: 72 hours from confirmed breach (GDPR Art. 33).</li>
            <li>Law-enforcement contact appeals: <a className="text-sky-400 hover:underline" href="mailto:signals@gitdealflow.com?subject=Data%20request%20appeal">signals@gitdealflow.com</a>.</li>
          </ul>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 text-sm text-gray-300">
          Machine-readable mirror: <Link href="/.well-known/transparency.json" className="text-emerald-400 hover:underline">/.well-known/transparency.json</Link>. Companion surfaces: <Link href="/disclosure" className="text-sky-400 hover:underline">/disclosure</Link>, <Link href="/security" className="text-sky-400 hover:underline">/security</Link>, <Link href="/.well-known/compliance.json" className="text-emerald-400 hover:underline">/.well-known/compliance.json</Link>.
        </div>
      </section>

      <TrustConversionBlock
        className="mt-10"
        dominant="digest"
        context="This is the integrity record. Here's the product it backs."
      />

      <footer className="mt-10 pt-6 border-t border-slate-800 text-sm text-gray-400">
        License: <a href="https://creativecommons.org/licenses/by/4.0/" className="text-sky-400 hover:underline">CC BY 4.0</a>. Trust hub: <Link href="/trust" className="text-sky-400 hover:underline">/trust</Link>.
      </footer>
    </article>
  );
}
