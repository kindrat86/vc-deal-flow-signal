import type { Metadata } from "next";

/**
 * Central metadata helper. Every `page.tsx` should produce its `metadata`
 * export through this function so that title, description, canonical URL,
 * and OG/Twitter overrides are guaranteed to be set consistently and the
 * `scripts/verify-metadata.ts` postcheck has a single shape to validate.
 *
 * Why this exists (Audit 2026-05-08, gap "No central metadata() enforcement
 * helper"): manual `export const metadata = { ... }` per page meant a single
 * missed export shipped a soft-blank `<title>` (only the layout default
 * applied, no per-page disambiguation). The helper enforces title+description
 * presence at compile time via TS required props.
 */
export const SITE_BASE_URL = "https://signals.gitdealflow.com";
export const SITE_NAME = "VC Deal Flow Signal";

export interface DefineMetadataInput {
  /**
   * Page-specific title. The root layout's `metadata.title.template` appends
   * " | VC Deal Flow Signal", so do NOT include the suffix here.
   */
  title: string;
  /**
   * Search-engine description, 120-180 chars recommended. Reused as OG and
   * Twitter description unless overridden.
   */
  description: string;
  /**
   * Canonical path for this page, starting with "/". Used to construct
   * `alternates.canonical` and the OG URL. Pass exactly the path the page is
   * served at (e.g. "/methodology", "/predicted/2026-w19").
   */
  path: string;
  /** Override OG image URL. Defaults to the auto-generated /opengraph-image. */
  ogImage?: string;
  /** Override Twitter title. Defaults to `title`. */
  twitterTitle?: string;
  /** Override Twitter description. Defaults to `description`. */
  twitterDescription?: string;
  /** Page-specific keywords, additive to the layout-level keyword list. */
  keywords?: string[];
  /**
   * Locale-alternate URLs for hreflang. Map of BCP-47 locale → absolute URL.
   * Always include "x-default" if the page exists in multiple locales.
   */
  alternateLanguages?: Record<string, string>;
  /** Set to true to mark the page noindex (e.g. thin / user-specific pages). */
  noindex?: boolean;
  /**
   * Schema.org @type for the primary page entity. Used by tools that read
   * Next.js metadata to infer page intent. Pure metadata, not rendered.
   */
  type?: string;
  /**
   * ISO timestamp of last meaningful content change. Surfaces in OpenGraph
   * `article:modified_time` and Twitter card meta.
   */
  modifiedAt?: string;
}

function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (!path.startsWith("/")) path = "/" + path;
  return `${SITE_BASE_URL}${path}`;
}

/**
 * Produce a Next.js `Metadata` object with title, description, canonical,
 * OG, and Twitter all set from a single input. Use in any `page.tsx` like:
 *
 *     export const metadata = defineMetadata({
 *       title: "Methodology, Scout Score 2026",
 *       description: "How we compute Scout Score …",
 *       path: "/methodology",
 *     });
 *
 * Or for dynamic routes via generateMetadata:
 *
 *     export async function generateMetadata({ params }): Promise<Metadata> {
 *       const { slug } = await params;
 *       return defineMetadata({ title: `${slug}, Compare`, description: ..., path: `/compare/${slug}` });
 *     }
 */
export function defineMetadata(input: DefineMetadataInput): Metadata {
  const canonical = absoluteUrl(input.path);
  // OG/Twitter image resolution (audit 2026-07-20):
  // Previously this hard-coded `${canonical}/opengraph-image` as the default,
  // which only 200s on the ~33 routes that co-locate an `opengraph-image.tsx`.
  // On the 100+ routes without one (all trust/legal/E-E-A-T + most hubs),
  // that URL 404'd, every social / Slack / AI share of those pages showed a
  // broken image. Setting `openGraph.images` explicitly also SUPPRESSED
  // Next.js's file-convention inheritance, so those pages never fell back to
  // the root `app/opengraph-image`. Fix: only pin an image when the caller
  // passes an explicit override; otherwise omit it and let the file convention
  // supply the correct image, the route's own co-located card where present,
  // else the inherited root `/opengraph-image`.
  const ogImage = input.ogImage;
  const meta: Metadata = {
    title: input.title,
    description: input.description,
    alternates: {
      canonical,
      ...(input.alternateLanguages
        ? { languages: input.alternateLanguages }
        : {}),
    },
    openGraph: {
      title: input.title,
      description: input.description,
      url: canonical,
      siteName: SITE_NAME,
      type: "website",
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
      ...(input.modifiedAt ? { modifiedTime: input.modifiedAt } : {}),
    },
    twitter: {
      card: "summary_large_image",
      site: "@sipiteno",
      title: input.twitterTitle ?? input.title,
      description: input.twitterDescription ?? input.description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };

  if (input.keywords && input.keywords.length > 0) {
    meta.keywords = input.keywords;
  }

  if (input.noindex) {
    meta.robots = { index: false, follow: true };
  }

  if (input.type) {
    meta.other = {
      ...(meta.other ?? {}),
      "schema:about": input.type,
    };
  }

  return meta;
}

/**
 * Helper to construct the `alternateLanguages` map for hreflang-bearing pages.
 * Pass the canonical English path and a map of locale→localized-path; returns
 * a fully-qualified URL map suitable for `defineMetadata({alternateLanguages})`.
 */
export function buildAlternateLanguages(
  englishPath: string,
  localePaths: Record<string, string> = {},
): Record<string, string> {
  const out: Record<string, string> = {
    "en-US": absoluteUrl(englishPath),
    "x-default": absoluteUrl(englishPath),
  };
  for (const [loc, p] of Object.entries(localePaths)) {
    out[loc] = absoluteUrl(p);
  }
  return out;
}
