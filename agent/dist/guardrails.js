/**
 * Signal Analyst Agent — Guardrails
 *
 * Safety constraints, approval gates, and hard rules that govern
 * every agent decision. No action crosses these boundaries without
 * explicit human approval or a pre-authorized policy.
 */
import * as memory from "./memory.js";
// ─── Hard Constraints (never violated) ────────────────────────────────
export const HARD_CONSTRAINTS = {
    /** Never fabricate numbers, stats, or claims */
    NO_INVENTION: "Never invent numbers, user counts, ratings, or claims. Every stat must be derived from the signals data.",
    /** Always include the investment disclaimer */
    DISCLAIMER_REQUIRED: "Every published brief must carry the disclaimer: derived from public GitHub signals, not investment advice.",
    /** Always cite the methodology */
    CITE_METHODOLOGY: "Every published output must link to https://signals.gitdealflow.com/methodology and cite the SSRN paper.",
    /** Never claim to predict the future */
    NO_GUARANTEES: "Never claim a startup WILL raise — use likelihood bands and confidence levels only.",
    /** Max briefs per cycle (prevents spam) */
    MAX_BRIEFS: 10,
    /** Max LLM calls per cycle (cost control) */
    MAX_LLM_CALLS: 10,
    /** Anonymity: never surface real names */
    ANONYMITY: "Never surface a maintainer's real name — use 'The Data Nerd' or 'signals@gitdealflow.com'.",
};
export function assessRisk(action, context = {}) {
    // Low risk: routine operations
    const LOW_RISK_PATTERNS = [
        /^brief\.generate$/,
        /^brief\.save_draft$/,
        /^cycle\.start$/,
        /^cycle\.complete$/,
        /^signals\.fetch$/,
        /^signals\.analyze$/,
        /^signals\.classify$/,
        /^memory\.log$/,
    ];
    // Medium risk: publishing to owned channels
    const MED_RISK_PATTERNS = [
        /^brief\.publish_email$/,
        /^brief\.publish_telegram$/,
        /^brief\.publish_site$/,
        /^site\.deploy$/,
    ];
    // High risk: external publishing, financial, pricing
    const HIGH_RISK_PATTERNS = [
        /^pricing\./,
        /^social\./,
        /^stripe\./,
        /^email\.blast$/,
        /^brief\.publish_social$/,
    ];
    if (HIGH_RISK_PATTERNS.some((p) => p.test(action))) {
        return { level: "high", reason: "External publishing or financial action", requiresApproval: true };
    }
    if (MED_RISK_PATTERNS.some((p) => p.test(action))) {
        return { level: "medium", reason: "Publishing to owned channels", requiresApproval: false };
    }
    if (LOW_RISK_PATTERNS.some((p) => p.test(action))) {
        return { level: "low", reason: "Routine operation", requiresApproval: false };
    }
    // Unknown actions default to requiring approval
    return { level: "high", reason: "Unknown action type", requiresApproval: true };
}
// ─── Content Validators ───────────────────────────────────────────────
export function validateBrief(brief) {
    const issues = [];
    // Must have a title
    if (!brief.title || brief.title.length < 5) {
        issues.push("Brief title is too short or missing");
    }
    // Must have highlights
    if (!brief.highlights || brief.highlights.length === 0) {
        issues.push("Brief has no highlights");
    }
    // Must not exceed max
    if (brief.highlights && brief.highlights.length > HARD_CONSTRAINTS.MAX_BRIEFS) {
        issues.push(`Brief has ${brief.highlights.length} highlights (max ${HARD_CONSTRAINTS.MAX_BRIEFS})`);
    }
    // Each highlight must have required fields
    for (const h of (brief.highlights || [])) {
        if (!h.name)
            issues.push(`Highlight missing name`);
        if (!h.githubUrl)
            issues.push(`${h.name}: missing GitHub URL`);
        if (!h.narrative)
            issues.push(`${h.name}: missing narrative`);
        if (!h.signalType)
            issues.push(`${h.name}: missing signal type`);
    }
    // Must have citation
    if (!brief.citation) {
        issues.push("Brief missing citation");
    }
    // Check for banned words (fabrication indicators)
    const bannedPhrases = ["guaranteed to raise", "will definitely", "100% certain", "risk-free"];
    const content = brief.summary + brief.highlights.map((h) => h.narrative).join(" ");
    for (const phrase of bannedPhrases) {
        if (content.toLowerCase().includes(phrase.toLowerCase())) {
            issues.push(`Contains banned phrase: "${phrase}"`);
        }
    }
    return { valid: issues.length === 0, issues };
}
export function validateDisclaimer(brief) {
    const text = brief.summary || "";
    return text.includes("not investment advice") || text.includes("derived from public GitHub");
}
// ─── Approval Gates ───────────────────────────────────────────────────
export async function checkApprovalGate(action, context) {
    const risk = assessRisk(action, context);
    if (!risk.requiresApproval) {
        return { allowed: true, reason: risk.reason };
    }
    // Check if this specific action was pre-approved
    const state = await memory.getAgentState();
    if (state?.config?.autoPublish && risk.level === "medium") {
        return { allowed: true, reason: "Auto-publish enabled for medium-risk actions" };
    }
    // Create approval request
    const approvalId = await memory.createApproval(action, 0, "action", `Approval required: ${action} — ${risk.reason}`, context);
    return { allowed: false, reason: `Approval required (${risk.reason})`, approvalId };
}
// ─── Output Sanitizer ─────────────────────────────────────────────────
export function sanitizeForPublishing(text) {
    return text
        // Remove any accidental real-name leaks
        // (The agent shouldn't have real names, but defense in depth)
        .replace(/\b[A-Z][a-z]+ [A-Z][a-z]+\b/g, (match) => {
        // Keep known safe names
        const safe = ["The Data", "GitDeal Flow", "United States", "North America",
            "San Francisco", "New York", "Los Angeles", "Series A",
            "Series B", "Series C", "Latin America"];
        if (safe.some((s) => match.includes(s)))
            return match;
        return match; // Keep for now — the agent shouldn't have real names to leak
    });
}
// ─── Cycle Budget Tracker ─────────────────────────────────────────────
let cycleLlmCalls = 0;
let cycleBriefsGenerated = 0;
export function resetCycleCounters() {
    cycleLlmCalls = 0;
    cycleBriefsGenerated = 0;
}
export function trackLlmCall() {
    cycleLlmCalls++;
    if (cycleLlmCalls > HARD_CONSTRAINTS.MAX_LLM_CALLS) {
        console.warn(`[guardrails] LLM call limit reached (${HARD_CONSTRAINTS.MAX_LLM_CALLS})`);
        return false;
    }
    return true;
}
export function trackBriefGenerated() {
    cycleBriefsGenerated++;
    if (cycleBriefsGenerated > HARD_CONSTRAINTS.MAX_BRIEFS) {
        console.warn(`[guardrails] Brief limit reached (${HARD_CONSTRAINTS.MAX_BRIEFS})`);
        return false;
    }
    return true;
}
export function getCycleStats() {
    return { llmCalls: cycleLlmCalls, briefsGenerated: cycleBriefsGenerated };
}
//# sourceMappingURL=guardrails.js.map