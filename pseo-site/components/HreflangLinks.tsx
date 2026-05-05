/**
 * Direct <link rel="alternate" hreflang> emitter.
 *
 * Why this exists: Next 16 silently drops metadata.alternates.languages
 * in production output. metadata.alternates.canonical works, but the
 * language map is gone — same hidden-failure class as alternates.types
 * for non-RSS MIMEs (documented in memory). Rendering <link> directly
 * inside the page tree works because Next hoists head-level link tags
 * automatically.
 *
 * Pass a Record<hreflang, absoluteUrl>. Output is one <link> per entry
 * plus an x-default if the caller provides it. No client JS, no React
 * state — just typed JSX.
 */

interface Props {
  /** Canonical absolute URL for this page (rel="canonical"). Optional —
   * omit when called from a parent layout where the per-page metadata
   * already emits a canonical (Next 16 metadata.alternates.canonical
   * works correctly; only languages drops). */
  canonical?: string;
  /** Hreflang map: { "en": "https://…", "ja": "https://…/ja", "x-default": "https://…" } */
  languages: Record<string, string>;
}

export function HreflangLinks({ canonical, languages }: Props) {
  return (
    <>
      {canonical ? <link rel="canonical" href={canonical} /> : null}
      {Object.entries(languages).map(([lang, href]) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={href} />
      ))}
    </>
  );
}
