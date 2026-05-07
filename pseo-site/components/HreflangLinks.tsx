/**
 * Direct <link rel="alternate" hreflang> emitter.
 *
 * Why this exists: Next 16 silently drops metadata.alternates.languages
 * in production output. metadata.alternates.canonical works fine, so
 * the canonical is emitted exclusively from page metadata — this
 * component only renders the language alternates that Next drops.
 *
 * 2026-05-07: removed the duplicate <link rel="canonical"> the component
 * used to emit. Google Search Console flagged "Alternate page with proper
 * canonical tag" for every route that used HreflangLinks alongside
 * alternates.canonical in metadata, since two canonical tags shipped on
 * the same page. The `canonical` prop is retained for source-call-site
 * compatibility but no longer renders a tag.
 */

interface Props {
  /** Canonical URL for this page. Retained for backwards compatibility;
   *  canonical is emitted via metadata.alternates.canonical instead. */
  canonical?: string;
  /** Hreflang map: { "en": "https://…", "ja": "https://…/ja", "x-default": "https://…" } */
  languages: Record<string, string>;
}

export function HreflangLinks({ languages }: Props) {
  return (
    <>
      {Object.entries(languages).map(([lang, href]) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={href} />
      ))}
    </>
  );
}
