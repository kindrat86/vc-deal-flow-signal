import type { Metadata } from "next";
import { ForFrameworkPage } from "@/components/ForFrameworkPage";
import { getFrameworkPositioning } from "@/lib/for-framework-data";

const SITE = "https://signals.gitdealflow.com";
const fw = getFrameworkPositioning("mastra")!;

const TITLE =
  "GitDealFlow for Mastra, Type-Safe VC Signal Agents in Your Next.js App";
const DESCRIPTION =
  "Drop GitDealFlow signals into a Mastra agent inside your Next.js or Hono codebase. First-class MCP via @gitdealflow/mcp-signal, edge-safe A2A fallback, Zod-validated tools. 350+ startups, refreshed weekly.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "mastra vc agent",
    "mastra mcp",
    "mastra typescript agent",
    "next.js vc deal flow",
    "mastra ai sdk",
    "mastra hono agent",
  ],
  alternates: { canonical: "/for-mastra" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE}/for-mastra`,
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

export default function ForMastraPage() {
  return <ForFrameworkPage framework={fw} />;
}
