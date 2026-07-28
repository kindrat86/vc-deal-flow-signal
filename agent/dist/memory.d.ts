/**
 * Signal Analyst Agent — Memory Layer
 *
 * Persists agent state, signal history, briefs, decisions, and approvals
 * in Supabase. Provides a clean async API for all persistence operations.
 */
import { SupabaseClient } from "@supabase/supabase-js";
import type { AgentState, AgentConfig, AgentApproval, EnrichedStartup, WeeklyBrief } from "./types.js";
export declare function getSupabase(): SupabaseClient | null;
export declare function isSupabaseAvailable(): boolean;
export declare function getAgentState(): Promise<AgentState | null>;
export declare function setAgentStatus(status: AgentState["status"], error?: string): Promise<void>;
export declare function updateAgentConfig(config: Partial<AgentConfig>): Promise<void>;
export declare function setNextRun(time: Date): Promise<void>;
export declare function startCycle(type: string): Promise<number>;
export declare function updateCycleStage(cycleId: number, stage: string, message: string, detail?: Record<string, unknown>): Promise<void>;
export declare function completeCycle(cycleId: number, signalsCount: number, newSignals: number, briefsCount: number): Promise<void>;
export declare function failCycle(cycleId: number, errorMessage: string): Promise<void>;
export declare function getLastSignalSnapshot(): Promise<Map<string, {
    score: number;
    signalType: string;
}>>;
export declare function upsertSignals(startups: EnrichedStartup[], period: string): Promise<{
    newCount: number;
    updatedCount: number;
}>;
export declare function saveBrief(brief: WeeklyBrief, cycle: string, status?: "draft" | "pending_approval" | "approved" | "published"): Promise<number>;
export declare function publishBrief(id: number, deliveryMethods: string[]): Promise<void>;
export declare function getRecentBriefs(limit?: number): Promise<Array<{
    id: number;
    cycle: string;
    title: string;
    status: string;
    published_at: string | null;
    created_at: string;
}>>;
export declare function logDecision(decisionType: string, action: string, detail?: {
    entityType?: string;
    entityId?: number;
    rationale?: string;
    extra?: Record<string, unknown>;
}): Promise<void>;
export declare function createApproval(approvalType: string, entityId: number, entityType: string, summary: string, detail?: Record<string, unknown>): Promise<number>;
export declare function getPendingApprovals(): Promise<AgentApproval[]>;
export declare function resolveApproval(id: number, approved: boolean): Promise<void>;
export declare function getLatestBrief(): Promise<WeeklyBrief | null>;
export declare function getTopSignals(limit?: number): Promise<EnrichedStartup[]>;
//# sourceMappingURL=memory.d.ts.map