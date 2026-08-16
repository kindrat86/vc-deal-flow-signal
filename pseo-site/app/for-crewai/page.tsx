import type { Metadata } from "next";
import { ForFrameworkPage } from "@/components/ForFrameworkPage";
import { getFrameworkPositioning } from "@/lib/for-framework-data";

const SITE = "https://signals.gitdealflow.com";
const fw = getFrameworkPositioning("crewai")!;

const TITLE =
  "GitDealFlow for CrewAI, Build a Role-Based VC Scouting Crew";
const DESCRIPTION =
  "Wire GitDealFlow into a CrewAI scout / analyst / skeptic crew. Three Python agents share live engineering-acceleration signals across 400+ venture-backed startups. Free A2A endpoint, no auth, no LLM lock-in.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "crewai vc deal flow",
    "crewai alternative data",
    "crewai venture capital agent",
    "multi-agent vc scouting",
    "crewai basetool github",
    "crewai studio vc",
  ],
  alternates: { canonical: "/for-crewai" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE}/for-crewai`,
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

export default function ForCrewAIPage() {
  return <ForFrameworkPage framework={fw} />;
}
