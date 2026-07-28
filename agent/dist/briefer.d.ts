/**
 * Signal Analyst Agent — Briefer
 *
 * Generates investor-ready briefs from structured signal data.
 * Uses a two-stage pipeline:
 *   1. Template-driven: deterministic, zero-cost, always available
 *   2. LLM-augmented: Claude API for narrative polish (optional, cost-controlled)
 */
import type { EnrichedStartup, StartupBrief, WeeklyBrief } from "./types.js";
export declare function buildStartupBrief(startup: EnrichedStartup, rank: number, useLLM?: boolean): Promise<StartupBrief>;
export declare function buildWeeklyBrief(highlights: EnrichedStartup[], summary: string, period: string, useLLM?: boolean): Promise<WeeklyBrief>;
export declare function renderEmailHtml(brief: WeeklyBrief): string;
export declare function renderPlainText(brief: WeeklyBrief): string;
export declare function renderTelegramMd(brief: WeeklyBrief): string;
//# sourceMappingURL=briefer.d.ts.map