/**
 * Signal Analyst Agent — Analyst
 *
 * Core analysis engine. Scores every startup using the same transparent
 * algorithm as the MCP server, ranks them within sectors and globally,
 * classifies into tiers, and detects week-over-week changes.
 *
 * All scoring is deterministic — the same input always produces the same
 * output, making it auditable and citable.
 */
import type { Startup, SignalScore, EnrichedStartup } from "./types.js";
/**
 * Score a single startup using the transparent, auditable algorithm.
 * Same scoring as the MCP server's predict_funding / shortlist_signals.
 */
export declare function scoreStartup(s: Startup): SignalScore;
export type SignalTier = "breakout" | "accelerating" | "steady" | "cooling";
export declare function classifyTier(score: SignalScore): SignalTier;
export declare function enrichStartups(startups: Array<Startup & {
    sectorName: string;
    sectorSlug: string;
}>): Promise<EnrichedStartup[]>;
export declare function rankByScore(enriched: EnrichedStartup[]): EnrichedStartup[];
export declare function rankBySector(enriched: EnrichedStartup[]): Map<string, EnrichedStartup[]>;
export interface HighlightCriteria {
    maxCount: number;
    minScore: number;
    preferNew: boolean;
    preferSurging: boolean;
    diversityAcrossSectors: boolean;
}
export declare function selectHighlights(enriched: EnrichedStartup[], criteria?: Partial<HighlightCriteria>): EnrichedStartup[];
export declare function generateSummary(enriched: EnrichedStartup[], highlights: EnrichedStartup[]): string;
//# sourceMappingURL=analyst.d.ts.map