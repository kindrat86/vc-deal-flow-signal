import type { Metadata } from "next";
import Link from "next/link";
import { LOCALES } from "@/content/locales";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import SeoCta from "@/components/SeoCta";

const SITE = "https://signals.gitdealflow.com";

export const metadata: Metadata = {
  title: "Translations &amp; Internationalization Policy",
  description:
    "Internationalization policy for VC Deal Flow Signal. We do not ship machine-translated marketing pages. Hand-curated landing pages exist in 6 languages; structured data carries multilingual labels; canonical content stays in English. hreflang map for crawlers.",
  alternates: { canonical: "/translations" },
  openGraph: {
    title: "Translations — VC Deal Flow Signal",
    description:
      "i18n policy: hand-curated locale landings, multilingual structured data, English-canonical content. hreflang map.",
    type: "article",
    url: `${SITE}/translations`,
  },
};

export default function TranslationsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE}/translations#page`,
        name: "Translations & Internationalization Policy",
        url: `${SITE}/translations`,
        inLanguage: "en-US",
        isPartOf: { "@id": `${SITE}/#website` },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", "[data-speakable]"],
        },
      },
      {
        "@type": "ItemList",
        "@id": `${SITE}/translations#locales`,
        numberOfItems: LOCALES.length,
        itemListElement: LOCALES.map((l, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE}/${l.code}`,
          name: `${l.display} (${l.nativeName.replace(/<[^>]+>/g, "")})`,
        })),
      },
    ],
  };

  return (
    <>
      <AgentMirrorLinks path="/translations" qaCategory="i18n" />
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
          <span>Translations</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Translations &amp; Internationalization Policy
        </h1>
        <p
          className="text-lg text-gray-300 mb-10 leading-relaxed"
          data-speakable
        >
          We deliberately do not ship machine-translated marketing pages.
          Bad translations hurt brand credibility, and Google penalizes
          thin/translated content. What we do ship: hand-curated short
          landings in six target locales, multilingual structured data on
          every page, and a complete hreflang map so crawlers can resolve
          locale variants without ambiguity.
        </p>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-white mb-4">
            Hand-curated locale landings
          </h2>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
            {LOCALES.map((l) => (
              <li key={l.code}>
                <Link
                  href={`/${l.code}`}
                  hrefLang={l.code}
                  className="block rounded-lg border border-slate-800 bg-slate-900/40 hover:bg-slate-900/60 p-4"
                >
                  <p
                    className="text-white font-medium"
                    dangerouslySetInnerHTML={{ __html: l.nativeName }}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {l.display} · /{l.code}
                  </p>
                  <p
                    className="text-xs text-gray-400 mt-1"
                    dangerouslySetInnerHTML={{ __html: l.region }}
                  />
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/"
                hrefLang="en"
                className="block rounded-lg border border-slate-800 bg-slate-900/40 hover:bg-slate-900/60 p-4"
              >
                <p className="text-white font-medium">English (canonical)</p>
                <p className="text-xs text-gray-400 mt-1">
                  en-US · / · all product pages
                </p>
              </Link>
            </li>
          </ul>
        </section>

        <section className="mb-10 rounded-lg border border-slate-800 bg-slate-900/40 p-6">
          <h2 className="text-lg font-semibold text-white mb-3">
            What we ship in every language
          </h2>
          <ul className="list-disc pl-5 text-sm text-gray-300 space-y-2">
            <li>
              <code className="font-mono text-sky-300">hreflang</code>{" "}
              declarations site-wide for {LOCALES.length + 2} variants
              (including <code className="font-mono text-sky-300">x-default</code>{" "}
              and English).
            </li>
            <li>
              JSON-LD <code className="font-mono text-sky-300">inLanguage</code>{" "}
              on every WebPage / Article / DefinedTerm.
            </li>
            <li>
              Multilingual labels on Organization (
              <code className="font-mono text-sky-300">availableLanguage</code>
              ) and ContactPoint.
            </li>
            <li>
              Per-locale <code className="font-mono text-sky-300">og:locale</code>{" "}
              on landing pages.
            </li>
          </ul>
        </section>

        <section className="mb-10 rounded-lg border border-slate-800 bg-slate-900/40 p-6">
          <h2 className="text-lg font-semibold text-white mb-3">
            What we do NOT ship
          </h2>
          <ul className="list-disc pl-5 text-sm text-gray-300 space-y-2">
            <li>
              Auto-translated full product pages, blog posts, or research
              findings. The methodology paper is published in English on
              SSRN; partial translations would create canonical ambiguity.
            </li>
            <li>
              Country subdomains or ccTLDs. Locale routing is at the path
              level (<code className="font-mono text-sky-300">/zh</code>,{" "}
              <code className="font-mono text-sky-300">/ja</code>, etc.) so
              link equity stays consolidated.
            </li>
            <li>
              Currency localization on pricing. Prices are quoted in EUR;
              Stripe handles charging in the customer&apos;s local currency
              at checkout.
            </li>
          </ul>
        </section>

        <SeoCta className="mt-10 mb-10" />

        <p className="text-xs text-gray-400 text-center">
          See also:{" "}
          <Link href="/standards" className="hover:text-gray-300">
            Standards
          </Link>{" "}
          ·{" "}
          <Link href="/citation-guide" className="hover:text-gray-300">
            Citation guide
          </Link>{" "}
          ·{" "}
          <Link href="/press" className="hover:text-gray-300">
            Press kit
          </Link>
        </p>
      </div>
    </>
  );
}
