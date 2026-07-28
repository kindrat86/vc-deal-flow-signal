/**
 * Signal Analyst Agent — Guardrails
 *
 * Safety constraints, approval gates, and hard rules that govern
 * every agent decision. No action crosses these boundaries without
 * explicit human approval or a pre-authorized policy.
 */
import type { WeeklyBrief } from "./types.js";
export declare const HARD_CONSTRAINTS: {
    /** Never fabricate numbers, stats, or claims */
    readonly NO_INVENTION: "Never invent numbers, user counts, ratings, or claims. Every stat must be derived from the signals data.";
    /** Always include the investment disclaimer */
    readonly DISCLAIMER_REQUIRED: "Every published brief must carry the disclaimer: derived from public GitHub signals, not investment advice.";
    /** Always cite the methodology */
    readonly CITE_METHODOLOGY: "Every published output must link to https://signals.gitdealflow.com/methodology and cite the SSRN paper.";
    /** Never claim to predict the future */
    readonly NO_GUARANTEES: "Never claim a startup WILL raise — use likelihood bands and confidence levels only.";
    /** Max briefs per cycle (prevents spam) */
    readonly MAX_BRIEFS: 10;
    /** Max LLM calls per cycle (cost control) */
    readonly MAX_LLM_CALLS: 10;
    /** Anonymity: never surface real names */
    readonly ANONYMITY: "Never surface a maintainer's real name — use 'The Data Nerd' or 'signals@gitdealflow.com'.";
};
export type RiskLevel = "low" | "medium" | "high";
export interface RiskAssessment {
    level: RiskLevel;
    reason: string;
    requiresApproval: boolean;
}
export declare function assessRisk(action: string, context?: Record<string, unknown>): RiskAssessment;
export declare function validateBrief(brief: WeeklyBrief): {
    valid: boolean;
    issues: string[];
};
export declare function validateDisclaimer(brief: WeeklyBrief): boolean;
export declare function checkApprovalGate(action: string, context: Record<string, unknown>): Promise<{
    allowed: boolean;
    reason: string;
    approvalId?: number;
}>;
export declare function sanitizeForPublishing(text: string): string;
export declare function resetCycleCounters(): void;
export declare function trackLlmCall(): boolean;
export declare function trackBriefGenerated(): boolean;
export declare function getCycleStats(): {
    llmCalls: number;
    briefsGenerated: number;
};
//# sourceMappingURL=guardrails.d.ts.map