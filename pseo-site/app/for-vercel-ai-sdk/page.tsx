import type { Metadata } from "next";
import { ForFrameworkPage } from "@/components/ForFrameworkPage";
import { getFrameworkPositioning } from "@/lib/for-framework-data";

const SITE = "https://signals.gitdealflow.com";
const fw = getFrameworkPositioning("vercel-ai-sdk")!;

const TITLE =
  "GitDealFlow for the Vercel AI SDK, Ship VC Signal Features in Next.js";
const DESCRIPTION =
  "Drop GitDealFlow into a Vercel AI SDK tool() with Zod-validated args. Server Components, Route Handlers, Server Actions, AI Gateway routing, all five skills, edge-safe, free A2A endpoint, no auth.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "vercel ai sdk vc",
    "vercel ai sdk tool",
    "vercel ai sdk mcp",
    "next.js vc deal flow",
    "ai gateway vc signals",
    "vercel ai sdk agent",
    "next.js server component ai",
  ],
  alternates: { canonical: "/for-vercel-ai-sdk" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE}/for-vercel-ai-sdk`,
    type: "article",
    siteName: "VC Deal Flow Signal",
  },
  twitter: {
    card: "summary_large_image",
    site: "@sipiteno",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function ForVercelAISDKPage() {
  return <ForFrameworkPage framework={fw} />;
}
