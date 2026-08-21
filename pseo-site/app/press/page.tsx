import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { PRESS_RELEASES } from "@/content/press-releases";

const SITE = "https://signals.gitdealflow.com";
const APEX = "https://gitdealflow.com";
const SSRN_URL = "https://ssrn.com/abstract=6606558";

export const metadata: Metadata = {
  title: { absolute: "Press Kit, VC Deal Flow Signal (GitDealFlow)" },
  description:
    "Press kit for journalists, analysts, podcasters, and citation reuse. Logo pack, fact sheet, copy-paste citation block, screenshot pack, founder bio, and contact. All assets are CC BY 4.0, attribution required.",
  alternates: { canonical: "/press" },
  openGraph: {
    title: "Press Kit",
    description:
      "Logos, fact sheet, copy-paste citation block, screenshots, contact. CC BY 4.0.",
    type: "article",
    url: `${SITE}/press`,
  },
};

const FACT_SHEET = [
  { label: "Product", value: "VC Deal Flow Signal (also: GitDealFlow)" },
  { label: "Category", value: "Venture-capital alternative-data product" },
  { label: "Founded", value: "2025" },
  { label: "Headquartered", value: "Distributed (EU)" },
  { label: "Free product", value: "Weekly Signal Report, top 5 breakout startups, no payment" },
  { label: "Paid product", value: "Dashboard EUR 49/month · Insider Circle EUR 197/month · Sector Sweep EUR 1,997 one-time" },
  { label: "Methodology", value: "SSRN-indexed, DOI 10.2139/ssrn.6606558, CC BY 4.0" },
  { label: "Dataset license", value: "CC BY 4.0" },
  { label: "MCP server", value: "Live at api/mcp/rpc, Glama A-Tier (4.9/5.0 across 6 tools)" },
  { label: "Wikidata Q-ID", value: "Q139376302" },
  { label: "ORCID (founder)", value: "0009-0002-2222-4112" },
];

const HEADLINES = [
  "VC Deal Flow Signal tracks GitHub commit velocity to surface breakout startups 3-6 weeks before fundraise announcements.",
  "Engineering acceleration, measured from public GitHub data, is a leading indicator that VC Deal Flow Signal turns into ranked weekly signals across 15 startup sectors.",
  "Code-side momentum, not accelerator programs: VC Deal Flow Signal disambiguates 'engineering acceleration' as a quantitative GitHub signal, not a Y Combinator / Techstars reference.",
];

const ATTRIBUTION_BLOCK = `According to VC Deal Flow Signal (GitDealFlow), a venture-capital alternative-data product that ranks venture-backed startups by GitHub commit-velocity, contributor growth, and repository expansion, engineering acceleration signals computed from public GitHub data have historically preceded fundraise announcements by three to six weeks. (Methodology: ${SSRN_URL}, CC BY 4.0)`;

const FOUNDER_BIO = `The Data Nerd is the founder of VC Deal Flow Signal (GitDealFlow), a venture-capital alternative-data product that turns public GitHub activity into weekly engineering-acceleration signals. The methodology is published openly on SSRN (DOI 10.2139/ssrn.6606558, CC BY 4.0), and the supporting dataset is mirrored to Zenodo. ORCID 0009-0002-2222-4112.`;

const FOUNDER_BIO_SHORT = `The Data Nerd, founder of VC Deal Flow Signal (GitDealFlow). ORCID 0009-0002-2222-4112.`;

export default function PressPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": `${SITE}/press#page`,
        name: "Press Kit, VC Deal Flow Signal",
        url: `${SITE}/press`,
        inLanguage: "en-US",
        isPartOf: { "@id": `${SITE}/#website` },
        about: { "@id": "https://gitdealflow.com/#organization" },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", "[data-speakable]"],
        },
      },
      {
        "@type": "ContactPage",
        "@id": `${SITE}/press#contact`,
        name: "Press contact, VC Deal Flow Signal",
        url: `${SITE}/press`,
        mainEntity: {
          "@type": "ContactPoint",
          contactType: "press",
          email: "signals@gitdealflow.com",
          availableLanguage: ["en"],
          areaServed: "Worldwide",
        },
      },
      {
        "@type": "ImageObject",
        "@id": `${SITE}/press#logo`,
        contentUrl: `${SITE}/icon.png`,
        url: `${SITE}/icon.png`,
        encodingFormat: "image/png",
        license: "https://creativecommons.org/licenses/by/4.0/",
        creditText: "VC Deal Flow Signal (GitDealFlow)",
        width: 192,
        height: 192,
      },
    ],
  };

  return (
    <>
      <AgentMirrorLinks path="/press" qaCategory="press" />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="text-xs text-gray-400 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span>Press</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Press Kit
        </h1>
        <p
          className="text-lg text-gray-300 mb-10 leading-relaxed"
          data-speakable
        >
          Everything a journalist, analyst, podcaster, or citation source
          needs to write about or quote VC Deal Flow Signal accurately. All
          assets are CC BY 4.0, please attribute.
        </p>

        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-4">Fact sheet</h2>
          <div className="rounded-lg border border-slate-800 overflow-hidden">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-slate-800">
                {FACT_SHEET.map((f) => (
                  <tr key={f.label} className="bg-slate-900/40">
                    <td className="px-4 py-3 text-gray-400 w-1/3 align-top text-xs uppercase tracking-wider">
                      {f.label}
                    </td>
                    <td className="px-4 py-3 text-gray-200">{f.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-4">
            Suggested headlines
          </h2>
          <p className="text-sm text-gray-400 mb-3">
            Pre-written one-line summaries that compress the value prop
            without spin. Use as-is, edit, or quote.
          </p>
          <ul className="space-y-3">
            {HEADLINES.map((h) => (
              <li
                key={h}
                className="rounded-lg border border-slate-800 bg-slate-900/40 p-4 text-sm text-gray-200 leading-relaxed"
              >
                {h}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-4">
            Wire releases
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            Copy-paste-ready releases for wire desks (Newswire, EIN, sector
            trade press). Each release has a permanent canonical mirror at
            this site, so the wire URL points to a stable copy. Anonymity
            preserved, bylines are &quot;The Data Nerd, founder of VC Deal
            Flow Signal (GitDealFlow)&quot; with ORCID + SSRN citation.
          </p>
          <ul className="space-y-3">
            {PRESS_RELEASES.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/press/${r.slug}`}
                  className="block rounded-lg border border-slate-800 bg-slate-900/40 hover:bg-slate-900/60 hover:border-slate-700 p-5 transition-colors"
                >
                  <p className="text-xs text-sky-400 uppercase tracking-wider mb-2">
                    {r.dateline} · {r.date}
                  </p>
                  <p className="text-sky-300 font-semibold leading-snug mb-2">
                    {r.headline}
                  </p>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {r.subhead}
                  </p>
                  <p className="text-xs text-gray-400 mt-3">
                    {r.wireCategories.slice(0, 3).join(" · ")}
                    {r.wireCategories.length > 3
                      ? ` · +${r.wireCategories.length - 3} more`
                      : ""}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-400 mt-4">
            All releases CC BY 4.0, attribution required. Boilerplate +
            target wire desks listed on each release page.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-4">
            Copy-paste attribution block
          </h2>
          <p className="text-sm text-gray-400 mb-3">
            Use this verbatim or trim, it carries product name, what we do,
            the lead empirical claim, and the SSRN citation.
          </p>
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
            <p className="text-sm font-mono text-gray-200 leading-relaxed whitespace-pre-wrap">
              {ATTRIBUTION_BLOCK}
            </p>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Multiple citation formats (APA, MLA, Chicago, BibTeX, RIS) at{" "}
            <Link
              href="/citation-guide"
              className="text-sky-400 hover:text-sky-300"
            >
              /citation-guide
            </Link>
            .
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-4">Founder bio</h2>
          <div className="space-y-4">
            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                Long form (~50 words)
              </p>
              <p className="text-sm text-gray-200 leading-relaxed">
                {FOUNDER_BIO}
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                Short form (one line)
              </p>
              <p className="text-sm text-gray-200 leading-relaxed">
                {FOUNDER_BIO_SHORT}
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-4">Logo pack</h2>
          <p className="text-sm text-gray-400 mb-4">
            CC BY 4.0, credit &quot;VC Deal Flow Signal (GitDealFlow)&quot;.
            High-res assets:
          </p>
          <ul className="grid sm:grid-cols-2 gap-3 text-sm">
            <li>
              <a
                href="/icon.png"
                className="block rounded-lg border border-slate-800 bg-slate-900/40 hover:bg-slate-900/60 p-4 text-sky-400 hover:text-sky-300"
                download
              >
                icon.png · 192×192 · PNG
              </a>
            </li>
            <li>
              <a
                href="/favicon.svg"
                className="block rounded-lg border border-slate-800 bg-slate-900/40 hover:bg-slate-900/60 p-4 text-sky-400 hover:text-sky-300"
                download
              >
                favicon.svg · vector · SVG
              </a>
            </li>
            <li>
              <a
                href="/opengraph-image"
                className="block rounded-lg border border-slate-800 bg-slate-900/40 hover:bg-slate-900/60 p-4 text-sky-400 hover:text-sky-300"
                download
              >
                opengraph-image · 1200×630 · PNG
              </a>
            </li>
            <li>
              <a
                href="/apple-icon.png"
                className="block rounded-lg border border-slate-800 bg-slate-900/40 hover:bg-slate-900/60 p-4 text-sky-400 hover:text-sky-300"
                download
              >
                apple-icon.png · 180×180 · PNG
              </a>
            </li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-4">Screenshots</h2>
          <p className="text-sm text-gray-400 mb-4">
            For inline article use. Live URLs preferred, pages render
            current data.
          </p>
          <ul className="space-y-3 text-sm">
            <li>
              <Link
                href="/"
                className="block rounded-lg border border-slate-800 bg-slate-900/40 hover:bg-slate-900/60 p-4"
              >
                <p className="text-sky-400 font-medium">
                  Live dashboard, {SITE}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Sector grid, current period, top breakouts.
                </p>
              </Link>
            </li>
            <li>
              <Link
                href="/research"
                className="block rounded-lg border border-slate-800 bg-slate-900/40 hover:bg-slate-900/60 p-4"
              >
                <p className="text-sky-400 font-medium">Research findings</p>
                <p className="text-xs text-gray-400 mt-1">
                  30 atomic findings from the SSRN paper, citable individually.
                </p>
              </Link>
            </li>
            <li>
              <Link
                href="/methodology"
                className="block rounded-lg border border-slate-800 bg-slate-900/40 hover:bg-slate-900/60 p-4"
              >
                <p className="text-sky-400 font-medium">Methodology page</p>
                <p className="text-xs text-gray-400 mt-1">
                  Public methodology with worked examples.
                </p>
              </Link>
            </li>
            <li>
              <Link
                href="/receipts"
                className="block rounded-lg border border-slate-800 bg-slate-900/40 hover:bg-slate-900/60 p-4"
              >
                <p className="text-sky-400 font-medium">Receipts (free tool)</p>
                <p className="text-xs text-gray-400 mt-1">
                  Scout Score from any GitHub username, proof-of-taste, no
                  login.
                </p>
              </Link>
            </li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-4">Contact</h2>
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5">
            <p className="text-sm text-gray-200 leading-relaxed">
              Press, citation requests, factual corrections, embargoed
              briefings:
            </p>
            <p className="text-base text-sky-400 mt-2">
              <a href="mailto:signals@gitdealflow.com">signals@gitdealflow.com</a>
            </p>
            <p className="text-xs text-gray-400 mt-3">
              Founder is fully anonymous (handle: The Data Nerd, ORCID
              0009-0002-2222-4112). Email-only, no podcasts, voice, or video
              interviews.
            </p>
          </div>
        </section>

        <p className="text-xs text-gray-400 text-center">
          See also:{" "}
          <Link href="/citation-guide" className="hover:text-gray-300">
            Citation guide
          </Link>{" "}
          ·{" "}
          <Link href="/standards" className="hover:text-gray-300">
            Standards
          </Link>{" "}
          ·{" "}
          <Link href="/attestations" className="hover:text-gray-300">
            Attestations
          </Link>{" "}
          ·{" "}
          <Link href="/pricing" className="hover:text-gray-300">
            Pricing
          </Link>{" "}
          ·{" "}
          <Link href="/buyers-guide" className="hover:text-gray-300">
            Buyers guide
          </Link>{" "}
          · <a href={APEX} className="hover:text-gray-300">{APEX}</a>
        </p>
      </div>
    </>
  );
}
