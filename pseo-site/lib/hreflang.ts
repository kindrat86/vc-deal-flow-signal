// Hreflang language map helpers.
//
// Returns a `lang -> URL` map used by <HreflangLinks/>. The product is
// English-only at content level; non-English locales currently route back
// to the canonical English URL. Search engines still get the locale signal,
// which they use for query-language ranking + featured-snippet eligibility.

const SUB = "https://signals.gitdealflow.com";

const NON_ENGLISH_LOCALES = [
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
] as const;

export function getHomepageHreflang(): Record<string, string> {
  const root = `${SUB}/`;
  return {
    en: root,
    "en-US": root,
    "en-GB": root,
    "x-default": root,
    ...Object.fromEntries(NON_ENGLISH_LOCALES.map((loc) => [loc, root])),
  };
}

export function getPageHreflang(path: string): Record<string, string> {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${SUB}${cleanPath}`;
  return {
    en: url,
    "en-US": url,
    "en-GB": url,
    "x-default": url,
    ...Object.fromEntries(NON_ENGLISH_LOCALES.map((loc) => [loc, url])),
  };
}
