import { getStartupPeriodData } from "@/lib/data";
import { renderBrandOG, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "VC Deal Flow Signal — Startup Snapshot";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string; period: string }>;
}) {
  const { slug, period } = await params;
  const data = getStartupPeriodData(slug, period);

  if (!data) {
    return renderBrandOG({
      kind: "Snapshot",
      title: "Startup Snapshot",
      footerLeft: `signals.gitdealflow.com/startup/${slug}/${period}`,
      accent: "#0ea5e9",
    });
  }

  const accent =
    data.entry.signalType === "BREAKOUT" ||
    data.entry.signalType === "ACCELERATING"
      ? "#22d3ee"
      : "#0ea5e9";

  return renderBrandOG({
    kind: data.entry.signalType,
    title: `${data.profile.name} — ${data.entry.periodName}`,
    subtitle: data.profile.description,
    stats: [
      { value: data.entry.commitVelocityChange, label: "Commit velocity Δ" },
      { value: data.entry.contributors, label: "Contributors" },
      { value: data.entry.commitVelocity14d ?? "—", label: "Commits / 14d" },
    ],
    footerLeft: `signals.gitdealflow.com/startup/${slug}/${period}`,
    footerRight: data.entry.periodName,
    accent,
  });
}
