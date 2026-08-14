import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense, type ComponentType } from "react";
import { EmbedShell } from "@/components/EmbedShell";

import { SafeCalculator } from "@/components/SafeCalculator";
import { RunwayCalculator } from "@/components/RunwayCalculator";
import { BurnMultipleCalculator } from "@/components/BurnMultipleCalculator";
import { MagicNumberCalculator } from "@/components/MagicNumberCalculator";
import { CacPaybackCalculator } from "@/components/CacPaybackCalculator";
import { LtvCalculator } from "@/components/LtvCalculator";
import { DilutionStackCalculator } from "@/components/DilutionStackCalculator";
import { QuickRatioCalculator } from "@/components/QuickRatioCalculator";

const SITE = "https://signals.gitdealflow.com";

/**
 * Iframe-embeddable variants of every /tools/* calculator.
 *
 * Distribution lever: operator newsletters (Lenny's, FirstRound, Sacra,
 * etc.), founder blogs, and incubator portals can paste a single
 * `<iframe src="https://signals.gitdealflow.com/embed/tools/<slug>" ...>`
 * snippet into a post and get a working calculator with persistent
 * attribution. Substack / Beehiiv / Ghost / WordPress / Notion all
 * accept iframes; this turns the /tools ship from "another page on our
 * site" into a backlink-emitting widget that lives on third-party
 * properties.
 *
 * Architecture:
 *   - One dynamic route serves all 8 slugs via generateStaticParams so
 *     each calc embed gets its own URL and CDN cache entry.
 *   - The page reuses the same client calculator components as the
 *     standalone /tools/<slug> page, single source of truth for the
 *     math and UI. No duplicate vanilla-JS port to maintain.
 *   - Root layout's <NotInEmbed/> gate strips Header/Footer/banner/
 *     pixels for any `/embed/<widget>/...` path. The inline <style/>
 *     injected here is a no-FOUC backstop in case the page paints
 *     before hydration unmounts the chrome.
 *   - `robots: index=false` keeps the embed URLs out of Google search
 *     so they don't compete with the canonical /tools/<slug> pages
 *     for the same keywords.
 *   - Iframe-friendly headers (X-Frame-Options: ALLOWALL, CSP
 *     frame-ancestors *) are set at the route level in next.config.ts.
 */

interface ToolMeta {
  slug: string;
  name: string;
  description: string;
  defaultHeight: number;
  Component: ComponentType;
}

const TOOLS: Record<string, ToolMeta> = {
  "safe-calculator": {
    slug: "safe-calculator",
    name: "SAFE Calculator",
    description:
      "Post-money SAFE conversion math, cap vs discount, effective ownership at the next priced round.",
    defaultHeight: 620,
    Component: SafeCalculator,
  },
  "runway-calculator": {
    slug: "runway-calculator",
    name: "Runway Calculator",
    description:
      "Months of runway from cash and net burn, with optional headcount scenario modelling.",
    defaultHeight: 560,
    Component: RunwayCalculator,
  },
  "burn-multiple-calculator": {
    slug: "burn-multiple-calculator",
    name: "Burn Multiple Calculator",
    description:
      "Total burn divided by net new ARR, classified into the David Sacks bands.",
    defaultHeight: 520,
    Component: BurnMultipleCalculator,
  },
  "magic-number-calculator": {
    slug: "magic-number-calculator",
    name: "Magic Number Calculator",
    description:
      "Annualized net new ARR ÷ quarterly S&M spend, SaaS sales efficiency.",
    defaultHeight: 520,
    Component: MagicNumberCalculator,
  },
  "cac-payback-calculator": {
    slug: "cac-payback-calculator",
    name: "CAC Payback Calculator",
    description:
      "Months to recover customer acquisition cost from gross margin contribution.",
    defaultHeight: 520,
    Component: CacPaybackCalculator,
  },
  "ltv-calculator": {
    slug: "ltv-calculator",
    name: "LTV Calculator",
    description:
      "Customer lifetime value and LTV:CAC ratio with industry-standard bands.",
    defaultHeight: 540,
    Component: LtvCalculator,
  },
  "quick-ratio-calculator": {
    slug: "quick-ratio-calculator",
    name: "Quick Ratio Calculator",
    description:
      "(New + expansion ARR) ÷ (churned + contracted), SaaS growth efficiency.",
    defaultHeight: 520,
    Component: QuickRatioCalculator,
  },
  "dilution-stack": {
    slug: "dilution-stack",
    name: "Dilution Stack",
    description:
      "Up-to-three stacked post-money SAFEs converting at a priced Series A with option pool refresh.",
    defaultHeight: 760,
    Component: DilutionStackCalculator,
  },
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return Object.keys(TOOLS).map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = TOOLS[slug];
  if (!tool) return {};
  const url = `${SITE}/embed/tools/${slug}`;
  return {
    title: `${tool.name}, Embed`,
    description: `Embeddable ${tool.name} widget. ${tool.description} CC BY 4.0.`,
    alternates: { canonical: url },
    // Iframe surface, keep it out of search so it doesn't compete with
    // the canonical /tools/<slug> page for the same head terms.
    robots: { index: false, follow: false },
    openGraph: {
      title: `${tool.name}, Embed widget`,
      description: tool.description,
      url,
      type: "website",
    },
  };
}

const FOUC_STYLE = `
/* Belt-and-braces chrome hide: NotInEmbed unmounts Header/Footer/banner
   on hydration, but server-rendered HTML may paint chrome briefly. Hide
   every direct child of <body> except <main> so the iframe paint is
   widget-only from the first frame. Script tags inherit display:none
   and still execute. */
body > :not(main):not(script) { display: none !important; }
html, body { background: #0f172a; margin: 0; padding: 0; }
main { padding: 0 !important; margin: 0 !important; }
`.trim();

export default async function EmbedToolPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = TOOLS[slug];
  if (!tool) {
    notFound();
  }
  const { Component, name } = tool;

  return (
    <>
      <style
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: FOUC_STYLE }}
      />
      <EmbedShell toolSlug={slug} toolName={name}>
        <Suspense
          fallback={
            <div className="rounded-md border border-slate-800 bg-slate-900/60 p-4 text-xs text-gray-400">
              Loading calculator…
            </div>
          }
        >
          <Component />
        </Suspense>
      </EmbedShell>
    </>
  );
}
