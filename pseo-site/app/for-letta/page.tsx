import type { Metadata } from "next";
import { ForFrameworkPage } from "@/components/ForFrameworkPage";
import { getFrameworkPositioning } from "@/lib/for-framework-data";

const SITE = "https://signals.gitdealflow.com";
const fw = getFrameworkPositioning("letta")!;

const TITLE =
  "GitDealFlow for Letta — Stateful VC Analyst Agents with Persistent Memory";
const DESCRIPTION =
  "Build a Letta agent that remembers every startup it has scouted. Wire GitDealFlow's A2A endpoint as a tool, get persistent watchlist memory across sessions. Five skills, 985+ startups, weekly refresh, no auth.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "letta vc agent",
    "memgpt vc deal flow",
    "stateful vc analyst",
    "letta tools",
    "persistent memory venture capital",
    "memgpt alternative data",
  ],
  alternates: { canonical: "/for-letta" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE}/for-letta`,
    type: "article",
    siteName: "VC Deal Flow Signal",
  },
  twitter: {
    card: "summary_large_image",
    site: "@data_nerd",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function ForLettaPage() {
  return <ForFrameworkPage framework={fw} />;
}
