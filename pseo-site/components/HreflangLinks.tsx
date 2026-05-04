// Renders <link rel="alternate" hreflang> tags + canonical into <head>.
//
// In Next.js 16, when the root layout has an explicit <head> or any page
// uses Server Components, metadata.alternates.languages can silently emit
// zero hreflang tags. This component bypasses that by rendering JSX.
// React emits camelCase `hrefLang` (HTML is case-insensitive — verify with
// `curl -s URL | grep -i hreflang`).
//
// See memory: feedback_next16_alternates_languages_drop.md

interface HreflangLinksProps {
  /** Absolute canonical URL for this page. */
  canonical: string;
  /** lang code → URL map. Build from getHomepageHreflang() / getPageHreflang() in lib/hreflang. */
  languages: Record<string, string>;
}

export function HreflangLinks({ canonical, languages }: HreflangLinksProps) {
  return (
    <>
      <link rel="canonical" href={canonical} />
      {Object.entries(languages).map(([lang, href]) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={href} />
      ))}
    </>
  );
}

export default HreflangLinks;
