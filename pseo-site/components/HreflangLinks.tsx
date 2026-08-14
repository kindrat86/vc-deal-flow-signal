/**
 * Direct <link rel="alternate" hreflang> emitter.
 *
 * Why this exists: Next 16 silently drops metadata.alternates.languages
 * in production output. metadata.alternates.canonical works fine, so
 * the canonical is emitted exclusively from page metadata, this
 * component only renders the language alternates that Next drops.
 *
 * 2026-05-07: removed the duplicate <link rel="canonical"> the component
 * used to emit. Google Search Console flagged "Alternate page with proper
 * canonical tag" for every route that used HreflangLinks alongside
 * alternates.canonical in metadata, since two canonical tags shipped on
 * the same page. The `canonical` prop is retained for source-call-site
 * compatibility but no longer renders a tag.
 *
 * AUDITOR NOTE (2026-05-30): React 19 serializes the JSX prop `hrefLang`
 * literally as the camelCase attribute `hrefLang="…"` in the hoisted
 * <head> output, NOT as lowercase `hreflang`. This is correct and
 * spec-valid: HTML attribute names are ASCII case-insensitive (WHATWG
 * HTML §13.1.2.3), so every real HTML parser, Googlebot, Bing, Screaming
 * Frog, Ahrefs, Sitebulb, lowercases it during parsing and reads it as
 * `hreflang`. Do NOT "fix" this to lowercase: there is no clean way to
 * force it through React's serializer, and there is no SEO defect. The
 * only thing fooled is a naive regex like /hreflang="/ over raw HTML -
 * audit case-insensitively (e.g. `grep -i hreflang`) to detect these tags.
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
