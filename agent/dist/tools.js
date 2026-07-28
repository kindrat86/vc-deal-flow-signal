/**
 * Signal Analyst Agent — Tool Registry
 *
 * Defines every capability the agent can invoke. Tools are categorized as:
 * - read: safe, idempotent, no side effects (always auto-approved)
 * - action: has side effects but low risk (auto-approved in standard cycles)
 * - approval_required: high-risk actions that need human sign-off
 */
// ─── Tool Registry ────────────────────────────────────────────────────
export const TOOL_REGISTRY = new Map();
function register(tool) {
    TOOL_REGISTRY.set(tool.name, tool);
}
// ─── Read Tools (always safe) ─────────────────────────────────────────
register({
    name: "signals.fetch_latest",
    description: "Fetch the latest signals.json from signals.gitdealflow.com",
    category: "read",
    execute: async () => {
        try {
            const res = await fetch("https://signals.gitdealflow.com/api/signals.json", {
                headers: { "User-Agent": "gitdealflow-signal-analyst-agent/1.0" },
            });
            if (!res.ok)
                return { success: false, error: `HTTP ${res.status}` };
            const data = await res.json();
            return { success: true, data };
        }
        catch (err) {
            return { success: false, error: String(err) };
        }
    },
});
register({
    name: "signals.fetch_changelog",
    description: "Fetch the latest changelog for dataset freshness metadata",
    category: "read",
    execute: async () => {
        try {
            const res = await fetch("https://signals.gitdealflow.com/api/changelog.json", {
                headers: { "User-Agent": "gitdealflow-signal-analyst-agent/1.0" },
            });
            if (!res.ok)
                return { success: false, error: `HTTP ${res.status}` };
            const data = await res.json();
            return { success: true, data };
        }
        catch (err) {
            return { success: false, error: String(err) };
        }
    },
});
register({
    name: "signals.fetch_methodology",
    description: "Fetch the methodology for proper citation",
    category: "read",
    execute: async () => {
        try {
            const res = await fetch("https://signals.gitdealflow.com/llms-full.txt", {
                headers: { "User-Agent": "gitdealflow-signal-analyst-agent/1.0" },
            });
            if (!res.ok)
                return { success: false, error: `HTTP ${res.status}` };
            const text = await res.text();
            // Extract methodology section
            const start = text.indexOf("## Methodology");
            const end = text.indexOf("## Glossary", start);
            const methodology = start >= 0 ? text.slice(start, end > 0 ? end : undefined).trim() : text;
            return { success: true, data: { methodology, url: "https://signals.gitdealflow.com/methodology" } };
        }
        catch (err) {
            return { success: false, error: String(err) };
        }
    },
});
register({
    name: "supabase.query",
    description: "Query agent state from Supabase",
    category: "read",
    execute: async (_args) => {
        // Implemented via memory.ts directly; this is a pass-through
        return { success: true, data: { note: "Use memory.ts functions directly" } };
    },
});
// ─── Action Tools (side effects, low risk) ─────────────────────────────
register({
    name: "email.send_brief",
    description: "Send the weekly brief to subscribers via Resend",
    category: "action",
    execute: async (args) => {
        const { html, subject } = args;
        // Actual implementation in publisher.ts
        return { success: true, data: { queued: true, subject } };
    },
});
register({
    name: "telegram.post",
    description: "Post an update to the gitdealflow Telegram channel",
    category: "action",
    execute: async (args) => {
        const { message } = args;
        // Actual implementation in publisher.ts
        return { success: true, data: { queued: true, preview: message.slice(0, 100) } };
    },
});
register({
    name: "site.deploy_brief",
    description: "Deploy the latest brief to the signals site",
    category: "action",
    execute: async (_args) => {
        // Actual deployment handled by publisher.ts
        return { success: true, data: { note: "Deploy handled by publisher" } };
    },
});
// ─── Approval-Required Tools (high risk) ──────────────────────────────
register({
    name: "pricing.update",
    description: "Modify pricing or payment links",
    category: "approval_required",
    execute: async (_args) => {
        return { success: false, error: "Pricing changes require human approval. Request queued." };
    },
});
register({
    name: "social.publish",
    description: "Publish to Twitter/X, LinkedIn, Bluesky, Mastodon",
    category: "approval_required",
    execute: async (_args) => {
        return { success: false, error: "Social publishing requires human approval. Request queued." };
    },
});
// ─── Tool Helpers ─────────────────────────────────────────────────────
export function getTool(name) {
    return TOOL_REGISTRY.get(name);
}
export function getToolsByCategory(category) {
    return Array.from(TOOL_REGISTRY.values()).filter((t) => t.category === category);
}
export async function invokeTool(name, args = {}) {
    const tool = getTool(name);
    if (!tool)
        return { success: false, error: `Unknown tool: ${name}` };
    return tool.execute(args);
}
export function listTools() {
    return Array.from(TOOL_REGISTRY.values()).map((t) => ({
        name: t.name,
        description: t.description,
        category: t.category,
    }));
}
//# sourceMappingURL=tools.js.map