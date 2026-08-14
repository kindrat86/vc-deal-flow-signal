/**
 * Shared hreflang resolver for any canonical English page.
 *
 * Given an English path (e.g. "/methodology"), returns a `languages` map for
 * Next.js `metadata.alternates.languages` that includes:
 *   - en-US → canonical English URL
 *   - x-default → canonical English URL
 *   - one entry per locale that has a translated stub for this topic
 *
 * Pages that don't correspond to a locale topic still get the en-US +
 * x-default entries, that tells Google there is no localized variant and
 * the English URL is canonical for all locales.
 *
 * Mirroring is one-way (English canonical advertises locale variants when
 * they exist; locale stubs already advertise the full hreflang map via
 * their own metadata). Together this satisfies Google's mutual-link
 * requirement.
 */

import { LOCALE_TOPICS } from "@/content/locale-topics";
import { JA_FINDINGS } from "@/content/ja-research";
import { LOCALES } from "@/content/locales";

const SITE = "https://signals.gitdealflow.com";

/**
 * Map English canonical paths to the locale-topics.ts `topic` key. The
 * topic key is also the URL segment under /[locale]/, so /methodology in
 * English maps to /ja/methodology in Japanese.
 *
 * Most topic keys equal the URL segment, but some diverge:
 *   - English `/citation-guide` ↔ ja `/ja/citations` (topic key: citations)
 *
 * Topics that have no English canonical (ja-only deep pages, e.g. pricing)
 * are NOT listed here, they still render at /ja/<topic> via the
 * [locale]/[topic] route, but they advertise no English alternate.
 */
const PATH_TO_TOPIC: Record<string, string> = {
  "/methodology": "methodology",
  "/glossary": "glossary",
  "/faq": "faq",
  "/signals": "signals",
  "/research": "research",
  "/citation-guide": "citations",
  "/about": "about",
  "/pricing": "pricing",
};

/**
 * Inverse of PATH_TO_TOPIC. Used by the i18n sitemap and by per-locale
 * pages that need to point back at the English canonical.
 *
 * For ja-only topics with no English counterpart (pricing), enUrl is
 * undefined and the sitemap entry becomes a self-canonical for /ja.
 */
const TOPIC_TO_EN_PATH: Record<string, string | undefined> = {
  methodology: "/methodology",
  glossary: "/glossary",
  faq: "/faq",
  signals: "/signals",
  research: "/research",
  citations: "/citation-guide",
  about: "/about",
  pricing: "/pricing",
};

export function topicEnPath(topic: string): string | undefined {
  return TOPIC_TO_EN_PATH[topic];
}

export function getHreflangLanguages(
  englishPath: string,
): Record<string, string> {
  const canonical = `${SITE}${englishPath}`;
  const out: Record<string, string> = {
    "en-US": canonical,
    en: canonical,
    "x-default": canonical,
  };
  const topic = PATH_TO_TOPIC[englishPath];
  if (topic) {
    for (const lt of LOCALE_TOPICS.filter((t) => t.topic === topic)) {
      out[lt.locale] = `${SITE}/${lt.locale}/${topic}`;
    }
  }
  return out;
}

/**
 * Site-wide hreflang for pages that have NO localized variants. Always
 * advertises x-default + en + en-US. This is what `app/layout.tsx`
 * provides as the default. Per-page metadata can override.
 */
export const DEFAULT_HREFLANG_LANGUAGES: Record<string, string> = {
  "en-US": SITE,
  en: SITE,
  "x-default": SITE,
};

/**
 * Hreflang map for the English homepage `/`. Reciprocates every locale
 * stub at `/[locale]` (rendered by app/[locale]/page.tsx). Keeps Google's
 * bidirectional confirmation green, without this, /sitemap-i18n.xml
 * advertises locale alternates that the homepage doesn't acknowledge.
 */
export function getHomepageHreflang(): Record<string, string> {
  const out: Record<string, string> = {
    "en-US": SITE,
    en: SITE,
    "x-default": SITE,
  };
  for (const l of LOCALES) {
    out[l.code] = `${SITE}/${l.code}`;
  }
  return out;
}

/**
 * Used by /sitemap-i18n.xml to emit xhtml:link rel=alternate hreflang
 * for every URL that has localized variants.
 *
 * For topics that have an English canonical, enUrl points to it
 * (e.g. /citation-guide for the citations topic). For ja-only topics
 * with no English counterpart (pricing), enUrl is the ja URL itself
 * and the alternates list omits English.
 */
export function getI18nSitemapEntries(): {
  enUrl: string;
  alternates: { hreflang: string; href: string }[];
}[] {
  const topics = Array.from(new Set(LOCALE_TOPICS.map((t) => t.topic)));
  const fromTopics = topics.map((topic) => {
    const enPath = TOPIC_TO_EN_PATH[topic];
    const enUrl = enPath
      ? `${SITE}${enPath}`
      : // ja-only, pin entry against /ja/<topic> as the self-canonical
        `${SITE}/ja/${topic}`;
    const alternates: { hreflang: string; href: string }[] = [];
    if (enPath) {
      alternates.push(
        { hreflang: "en", href: enUrl },
        { hreflang: "en-US", href: enUrl },
        { hreflang: "x-default", href: enUrl },
      );
    }
    for (const lt of LOCALE_TOPICS.filter((t) => t.topic === topic)) {
      alternates.push({
        hreflang: lt.locale,
        href: `${SITE}/${lt.locale}/${topic}`,
      });
    }
    return { enUrl, alternates };
  });

  // Research findings with ja translations. Each gets a reciprocal entry
  // pointing English /research/<slug> at /ja/research/<slug>.
  const fromFindings = JA_FINDINGS.map(({ slug }) => {
    const enUrl = `${SITE}/research/${slug}`;
    return {
      enUrl,
      alternates: [
        { hreflang: "en", href: enUrl },
        { hreflang: "en-US", href: enUrl },
        { hreflang: "x-default", href: enUrl },
        { hreflang: "ja", href: `${SITE}/ja/research/${slug}` },
      ],
    };
  });

  return [...fromTopics, ...fromFindings];
}
