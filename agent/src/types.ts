/**
 * Signal Analyst Agent — Shared Types
 * Central type definitions consumed by all agent modules.
 */

// ─── Startup Signal (from signals.gitdealflow.com API) ────────────────
export interface Startup {
  name: string;
  description: string;
  stage: string;
  geography: string;
  commitVelocity14d: number;
  commitVelocityChange: string;
  contributors: number;
  contributorGrowth: string;
  newRepos: number;
  signalType: string;
  githubUrl: string;
  websiteUrl?: string;
  linkedinUrl?: string;
  profileUrl?: string;
}

export interface Sector {
  slug: string;
  name: string;
  description: string;
  startupCount: number;
  startups: Startup[];
  url: string;
}

export interface SignalsData {
  meta: {
    period: { name: string };
    citation: string;
  };
  trending: Startup[];
  sectors: Sector[];
}

// ─── Scoring (mirrors MCP server's scoreStartup()) ──────────────────
export interface ScoreBreakdown {
  velocity: number;
  contributorGrowth: number;
  newRepos: number;
  signalType: number;
  total: number;
}

export interface SignalScore {
  accelerationScore: number; // 0-100
  raiseLikelihood: "high" | "elevated" | "moderate" | "low";
  estimatedWindow: string;
  confidence: "high" | "moderate" | "low";
  breakdown: ScoreBreakdown;
  velocityChangePct: number | null;
  contributorGrowthPct: number | null;
}

// ─── Enriched Startup (scored + historical context) ──────────────────
export interface EnrichedStartup extends Startup {
  score: SignalScore;
  sectorName: string;
  sectorSlug: string;
  // Week-over-week deltas (null if first time seen)
  scoreDelta: number | null;
  isNew: boolean;
  isSurging: boolean;
}

// ─── Brief ───────────────────────────────────────────────────────────
export interface StartupBrief {
  rank: number;
  name: string;
  sector: string;
  stage: string;
  geography: string;
  signalType: string;
  accelerationScore: number;
  raiseLikelihood: string;
  commitVelocity14d: number;
  commitVelocityChange: string;
  contributors: number;
  contributorGrowth: string;
  newRepos: number;
  githubUrl: string;
  websiteUrl?: string;
  // Narrative (LLM-generated or template)
  narrative: string;
  // Metadata
  isNew: boolean;
  isSurging: boolean;
  scoreDelta: number | null;
}

export interface WeeklyBrief {
  title: string;
  period: string;
  summary: string;
  highlights: StartupBrief[];
  methodologyUrl: string;
  citation: string;
  generatedAt: string;
}

// ─── Agent State ─────────────────────────────────────────────────────
export type AgentStatus = "idle" | "running" | "paused" | "error";
export type CycleType = "weekly" | "midweek" | "manual";

export interface AgentState {
  id: number;
  status: AgentStatus;
  cycle: string;
  lastRunAt: string | null;
  nextRunAt: string | null;
  lastError: string | null;
  config: AgentConfig;
}

export interface AgentConfig {
  autoPublish: boolean;
  requireApprovalForNewStartups: boolean;
  maxBriefsPerCycle: number;
  maxLlmCallsPerCycle: number;
  deliveryChannels: ("email" | "telegram")[];
  pausedUntil: string | null;
}

// ─── Cycle Log ───────────────────────────────────────────────────────
export type CycleStage = "started" | "monitoring" | "analyzing" | "briefing" | "publishing" | "completed" | "failed";

export interface CycleLog {
  id: number;
  cycleType: CycleType;
  status: CycleStage;
  signalsCount: number;
  newSignals: number;
  briefsCount: number;
  startedAt: string;
  completedAt: string | null;
  errorMessage: string | null;
  log: CycleLogEntry[];
}

export interface CycleLogEntry {
  stage: CycleStage;
  timestamp: string;
  message: string;
  detail?: Record<string, unknown>;
}

// ─── Decision ────────────────────────────────────────────────────────
export interface AgentDecision {
  id: number;
  decisionType: string;
  entityType: string | null;
  entityId: number | null;
  action: string;
  rationale: string | null;
  detail: Record<string, unknown> | null;
  createdAt: string;
}

// ─── Approval ────────────────────────────────────────────────────────
export interface AgentApproval {
  id: number;
  approvalType: string;
  entityId: number;
  entityType: string;
  summary: string;
  detail: Record<string, unknown> | null;
  status: "pending" | "approved" | "rejected";
  resolvedAt: string | null;
  createdAt: string;
}

// ─── Tool Definition ─────────────────────────────────────────────────
export interface ToolDefinition {
  name: string;
  description: string;
  category: "read" | "action" | "approval_required";
  execute: (args: Record<string, unknown>) => Promise<ToolResult>;
}

export interface ToolResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

// ─── Monitor Diff ────────────────────────────────────────────────────
export interface SignalDiff {
  newStartups: Startup[];
  removedStartups: Startup[];
  signalTypeChanges: Array<{ name: string; old: string; new: string }>;
  scoreSurges: Array<{ name: string; oldScore: number; newScore: number; delta: number }>;
  totalBefore: number;
  totalAfter: number;
}
