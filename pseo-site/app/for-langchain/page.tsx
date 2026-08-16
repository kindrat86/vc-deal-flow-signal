import type { Metadata } from "next";
import { ForFrameworkPage } from "@/components/ForFrameworkPage";
import { getFrameworkPositioning } from "@/lib/for-framework-data";

const SITE = "https://signals.gitdealflow.com";
const fw = getFrameworkPositioning("langchain")!;

const TITLE =
  "GitDealFlow for LangChain, Wire VC Engineering Signals into Any Agent";
const DESCRIPTION =
  "Drop GitDealFlow signals into a LangChain agent in 20 lines of Python. Live commit-velocity data on 400+ venture-backed startups across 15 sectors. Free A2A endpoint, no auth. Works with ReAct, LangGraph, and langchain-mcp-adapters.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "langchain vc deal flow",
    "langchain alternative data",
    "langchain mcp server",
    "langchain agent vc signals",
    "langchain github commit velocity",
    "langgraph venture capital",
    "vc deal flow agent python",
  ],
  alternates: { canonical: "/for-langchain" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE}/for-langchain`,
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

export default function ForLangChainPage() {
  return <ForFrameworkPage framework={fw} />;
}
