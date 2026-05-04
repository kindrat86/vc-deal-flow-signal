// Renders <link rel="alternate" hreflang> tags directly into <head>.
//
// In Next.js 16, when the root layout has an explicit <head> or any page
// uses Server Components, metadata.alternates.languages can silently emit
// zero hreflang tags. This component bypasses that by rendering JSX.
// React emits camelCase `hrefLang` (HTML is case-insensitive, so verifying
// in production: `curl -s URL | grep -i hreflang`).
//
// See memory: feedback_next16_alternates_languages_drop.md

const APEX = "https://gitdealflow.com";
const SUB = "https://signals.gitdealflow.com";

// Locale → host pairs. Apex hosts the marketing landing; sub hosts the data
// product. English variants point to whichever host is the canonical for the
// current page (provided via `path` prop). All non-English variants currently
// point to the sub-domain — the apex is English-only.
const LOCALE_GROUPS = {
  apex: {
    primary: ["en", "en-US", "en-GB", "x-default"],
  },
  sub: {
    primary: ["en", "en-US", "en-GB", "x-default"],
    extras: [
      "ja",
      "zh",
      "de",
      "es",
      "fr",
      "pt",
      "ko",
      "hi",
      "ru",
      "it",
      "nl",
      "ar",
    ],
  },
} as const;

interface HreflangLinksProps {
  path: string; // e.g. "/", "/methodology", "/blog/foo"
  host?: "apex" | "sub";
}

export default function HreflangLinks({
  path,
  host = "sub",
}: HreflangLinksProps) {
  const cleanPath = path === "/" ? "" : path;
  const baseUrl = host === "apex" ? APEX : SUB;
  const canonical = `${baseUrl}${cleanPath || "/"}`;

  // Always include the four English variants pointing at the canonical host.
  const primary = LOCALE_GROUPS[host].primary.map((lang) => ({
    lang,
    href: canonical,
  }));

  // Sub-domain pages also surface the 12 non-English locales (currently
  // routed back to the same canonical URL — content negotiation lives in the
  // CDN/runtime layer, not URL paths). Apex pages omit non-English locales.
  const extras =
    host === "sub"
      ? LOCALE_GROUPS.sub.extras.map((lang) => ({
          lang,
          href: canonical,
        }))
      : [];

  const all = [...primary, ...extras];

  return (
    <>
      {all.map((entry) => (
        <link
          key={entry.lang}
          rel="alternate"
          hrefLang={entry.lang}
          href={entry.href}
        />
      ))}
    </>
  );
}
