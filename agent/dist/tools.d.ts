/**
 * Signal Analyst Agent — Tool Registry
 *
 * Defines every capability the agent can invoke. Tools are categorized as:
 * - read: safe, idempotent, no side effects (always auto-approved)
 * - action: has side effects but low risk (auto-approved in standard cycles)
 * - approval_required: high-risk actions that need human sign-off
 */
import type { ToolDefinition, ToolResult } from "./types.js";
export declare const TOOL_REGISTRY: Map<string, ToolDefinition>;
export declare function getTool(name: string): ToolDefinition | undefined;
export declare function getToolsByCategory(category: ToolDefinition["category"]): ToolDefinition[];
export declare function invokeTool(name: string, args?: Record<string, unknown>): Promise<ToolResult>;
export declare function listTools(): Array<{
    name: string;
    description: string;
    category: string;
}>;
//# sourceMappingURL=tools.d.ts.map