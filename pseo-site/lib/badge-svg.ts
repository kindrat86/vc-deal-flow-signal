import "server-only";

export type ScoutRank = "curious" | "scout" | "sharp" | "elite" | "oracle";
export type MomentumTier = "cold" | "warming" | "hot" | "breakout";

export const RANK_HEX: Record<ScoutRank, string> = {
  curious: "#34d399",
  scout: "#38bdf8",
  sharp: "#c084fc",
  elite: "#fbbf24",
  oracle: "#fb7185",
};

export const TIER_HEX: Record<MomentumTier, string> = {
  cold: "#64748b",
  warming: "#38bdf8",
  hot: "#fbbf24",
  breakout: "#fb7185",
};

const LABEL_BG = "#1e293b";
const TEXT_LIGHT = "#f8fafc";
const TEXT_SHADOW = "rgba(0,0,0,0.25)";
const FONT_STACK = "Verdana,Geneva,DejaVu Sans,sans-serif";

interface BadgePieces {
  label: string;
  value: string;
  valueColor: string;
  href?: string;
  title?: string;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function approxTextWidth(text: string, fontSize: number): number {
  let w = 0;
  for (const ch of text) {
    if ("ilI|.,;:'\"".includes(ch)) w += 3;
    else if ("MWmw".includes(ch)) w += 9;
    else if (ch >= "0" && ch <= "9") w += 6.5;
    else if (ch === " ") w += 4;
    else w += 6.5;
  }
  return Math.ceil(w * (fontSize / 11));
}

function renderBadge({ label, value, valueColor, title }: BadgePieces): string {
  const fontSize = 11;
  const padX = 6;
  const labelText = escapeXml(label);
  const valueText = escapeXml(value);
  const labelWidth = approxTextWidth(label, fontSize) + padX * 2;
  const valueWidth = approxTextWidth(value, fontSize) + padX * 2;
  const totalWidth = labelWidth + valueWidth;
  const height = 20;

  const labelTextX = labelWidth / 2;
  const valueTextX = labelWidth + valueWidth / 2;
  const textY = 14;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${height}" viewBox="0 0 ${totalWidth} ${height}" role="img" aria-label="${escapeXml(label)}: ${escapeXml(value)}">
<title>${escapeXml(title || `${label}: ${value}`)}</title>
<linearGradient id="s" x2="0" y2="100%">
<stop offset="0" stop-color="#fff" stop-opacity=".08"/>
<stop offset="1" stop-opacity=".15"/>
</linearGradient>
<clipPath id="r"><rect width="${totalWidth}" height="${height}" rx="3" fill="#fff"/></clipPath>
<g clip-path="url(#r)">
<rect width="${labelWidth}" height="${height}" fill="${LABEL_BG}"/>
<rect x="${labelWidth}" width="${valueWidth}" height="${height}" fill="${valueColor}"/>
<rect width="${totalWidth}" height="${height}" fill="url(#s)"/>
</g>
<g fill="${TEXT_LIGHT}" text-anchor="middle" font-family="${FONT_STACK}" font-size="${fontSize}" font-weight="600">
<text x="${labelTextX}" y="${textY + 1}" fill="${TEXT_SHADOW}">${labelText}</text>
<text x="${labelTextX}" y="${textY}">${labelText}</text>
<text x="${valueTextX}" y="${textY + 1}" fill="${TEXT_SHADOW}">${valueText}</text>
<text x="${valueTextX}" y="${textY}">${valueText}</text>
</g>
</svg>`;
}

export interface ScoutBadgeInput {
  username: string;
  score: number;
  rank: ScoutRank;
}

export function renderScoutBadge({ username, score, rank }: ScoutBadgeInput): string {
  return renderBadge({
    label: "scout score",
    value: `${score} ${rank}`,
    valueColor: RANK_HEX[rank],
    title: `@${username}, Scout Score ${score} (${rank}) · gitdealflow`,
  });
}

export interface MomentumBadgeInput {
  org: string;
  repo: string;
  tier: MomentumTier;
  velocityChange?: string;
}

export function renderMomentumBadge({
  org,
  repo,
  tier,
  velocityChange,
}: MomentumBadgeInput): string {
  const valueText = velocityChange ? `${tier} ${velocityChange}` : tier;
  return renderBadge({
    label: "momentum",
    value: valueText,
    valueColor: TIER_HEX[tier],
    title: `${org}/${repo}, ${tier}${velocityChange ? ` (${velocityChange})` : ""} · gitdealflow`,
  });
}

export function renderPendingBadge(label: string, hint = "pending"): string {
  return renderBadge({
    label,
    value: hint,
    valueColor: "#475569",
    title: `${label}: ${hint} · gitdealflow`,
  });
}

// --- Curated-signal badge -------------------------------------------------
// Distinct from renderMomentumBadge (which reads the live GitHub-velocity
// scrape). This renders the *editorial* momentum from content/companies.ts
// `publicSignal.momentum`, so every curated company has a stable, embeddable
// badge regardless of whether it appears in the weekly live signal set.
export type CompanyMomentum =
  | "accelerating"
  | "steady"
  | "decelerating"
  | "unranked";

export const MOMENTUM_HEX: Record<CompanyMomentum, string> = {
  accelerating: "#34d399", // green, positive
  steady: "#38bdf8", // blue, neutral
  decelerating: "#64748b", // slate, cooling
  unranked: "#475569", // grey, no read
};

export interface SignalBadgeInput {
  name: string;
  momentum: CompanyMomentum;
}

export function renderSignalBadge({ name, momentum }: SignalBadgeInput): string {
  return renderBadge({
    label: "momentum",
    value: momentum,
    valueColor: MOMENTUM_HEX[momentum],
    title: `${name}, ${momentum} · gitdealflow`,
  });
}

export function tierFromVelocityChange(change: string): MomentumTier {
  const num = parseInt(change.replace(/[^0-9-]/g, ""), 10) || 0;
  if (num >= 200) return "breakout";
  if (num >= 50) return "hot";
  if (num >= -30) return "warming";
  return "cold";
}

const BUILTWITH_HEX = "#0ea5e9";

export interface BuiltWithBadgeInput {
  label?: string;
  variant?: "default" | "compact" | "long";
}

export function renderBuiltWithBadge({
  label,
  variant = "default",
}: BuiltWithBadgeInput = {}): string {
  const labelText = label ?? "built with";
  const value =
    variant === "compact"
      ? "gitdealflow"
      : variant === "long"
        ? "@gitdealflow/mcp-signal"
        : "gitdealflow MCP";
  return renderBadge({
    label: labelText,
    value,
    valueColor: BUILTWITH_HEX,
    title: `Built with ${value}, gitdealflow.com`,
  });
}

export function renderPoweredByBadge(): string {
  return renderBadge({
    label: "powered by",
    value: "gitdealflow signals",
    valueColor: BUILTWITH_HEX,
    title: "Powered by gitdealflow signals, gitdealflow.com",
  });
}
