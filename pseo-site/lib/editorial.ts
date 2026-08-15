import rawOverrides from "@/content/editorial-overrides.json";

/**
 * Editorial override layer: lets a non-developer change a page's title,
 * description, noindex status, or keywords by editing ONE plain JSON file
 * (`content/editorial-overrides.json`) instead of the ~70 typed files in
 * `content/`. `defineMetadata()` applies these overrides at build time, so
 * they flow through the exact same canonical/OG/Twitter pipeline (and the
 * same `verify-no-regressions.ts` prebuild guard) as generated metadata.
 *
 * This replaces a hosted CMS (Sanity/Contentful), which was rejected because
 * it needs a human account, adds a paid vendor, and creates a second source
 * of truth that bypasses the content-as-code regression guard.
 */

export interface EditorialOverride {
  title?: string;
  description?: string;
  noindex?: boolean;
  keywords?: string[];
}

interface OverrideFile {
  overrides?: Record<string, EditorialOverride>;
}

const file = rawOverrides as unknown as OverrideFile;
const OVERRIDES: Record<string, EditorialOverride> = file.overrides ?? {};

export function getEditorialOverride(path: string): EditorialOverride | undefined {
  const key = path.startsWith("/") ? path : `/${path}`;
  return OVERRIDES[key];
}
