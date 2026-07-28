/**
 * Signal Analyst Agent — Monitor
 *
 * Watches the signals.gitdealflow.com API for changes:
 * - New startups entering the tracked universe
 * - Signal type changes (e.g., steady → breakout)
 * - Acceleration score surges (delta > 15pts)
 *
 * Compares current snapshot against persisted state in Supabase.
 */
import type { SignalsData, Startup, SignalDiff } from "./types.js";
export declare function fetchSignalsData(): Promise<SignalsData>;
export declare function flattenStartups(data: SignalsData): Array<Startup & {
    sectorName: string;
    sectorSlug: string;
}>;
export declare function computeDiff(current: Array<Startup & {
    sectorName: string;
    sectorSlug: string;
}>): Promise<SignalDiff>;
export declare function detectBreakouts(diff: SignalDiff, startups: Array<Startup & {
    sectorName: string;
    sectorSlug: string;
}>): Array<{
    startup: Startup & {
        sectorName: string;
        sectorSlug: string;
    };
    reason: string;
}>;
//# sourceMappingURL=monitor.d.ts.map