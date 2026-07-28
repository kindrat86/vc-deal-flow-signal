/**
 * Signal Analyst Agent — Main Entry Point
 *
 * Autonomous agent lifecycle:
 *   1. Monitor  — fetch latest signals, compute diffs
 *   2. Analyze  — score, rank, classify, select highlights
 *   3. Brief    — generate investor-ready briefs (template + optional LLM)
 *   4. Validate — run guardrails and content checks
 *   5. Publish  — deliver via email, Telegram, site update
 *   6. Sleep    — wait for next scheduled cycle
 *
 * Usage:
 *   npm start          — Run as long-lived daemon with scheduler
 *   npm run dev        — Development mode with file watching
 *   npm test           — Run a single cycle and exit (--once flag)
 */
import type { CycleType } from "./types.js";
/**
 * Run one full agent cycle: Monitor → Analyze → Brief → Validate → Publish
 */
export declare function runAgentCycle(type: CycleType): Promise<void>;
//# sourceMappingURL=index.d.ts.map