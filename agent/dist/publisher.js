/**
 * Signal Analyst Agent — Publisher
 *
 * Multi-channel delivery layer for agent-generated briefs.
 * Handles: email (Resend), Telegram, and site updates.
 * All publishing respects guardrails and logs decisions.
 */
import { Resend } from "resend";
import * as memory from "./memory.js";
import * as guardrails from "./guardrails.js";
import { renderEmailHtml, renderPlainText, renderTelegramMd } from "./briefer.js";
// ─── Resend Client ─────────────────────────────────────────────────────
let resend = null;
function getResend() {
    if (resend)
        return resend;
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.warn("[publisher] No RESEND_API_KEY set — email delivery disabled");
        return null;
    }
    resend = new Resend(apiKey);
    return resend;
}
// ─── Resend Audience Auto-Detection ────────────────────────────────────
async function resolveAudienceId() {
    // 1. Explicit env var
    if (process.env.RESEND_AUDIENCE_ID) {
        console.log(`[publisher] Using RESEND_AUDIENCE_ID from env`);
        return process.env.RESEND_AUDIENCE_ID;
    }
    // 2. Auto-detect from Resend API
    const client = getResend();
    if (!client)
        return null;
    try {
        const response = await fetch("https://api.resend.com/audiences", {
            headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
        });
        if (!response.ok)
            return null;
        const body = (await response.json());
        const audiences = body.data || [];
        if (audiences.length === 0)
            return null;
        const id = audiences[0].id;
        console.log(`[publisher] Auto-detected Resend audience: ${audiences[0].name} (${id})`);
        return id;
    }
    catch {
        return null;
    }
}
// ─── Email Delivery ────────────────────────────────────────────────────
export async function publishEmail(brief, _briefId) {
    const risk = guardrails.assessRisk("brief.publish_email");
    if (risk.requiresApproval) {
        const gate = await guardrails.checkApprovalGate("brief.publish_email", { briefId: _briefId });
        if (!gate.allowed) {
            return { success: false, error: `Approval required: ${gate.reason}` };
        }
    }
    const client = getResend();
    if (!client) {
        return { success: false, error: "Resend not configured (set RESEND_API_KEY)" };
    }
    const html = renderEmailHtml(brief);
    const text = renderPlainText(brief);
    const subject = `🔍 ${brief.title}`;
    try {
        // Auto-detect Resend audience if not explicitly set
        const audienceId = await resolveAudienceId();
        if (audienceId) {
            // Use Resend Broadcasts API to send to the entire audience
            const { error } = await client.broadcasts.create({
                audienceId,
                from: "GitDealFlow Signals <signals@gitdealflow.com>",
                subject,
                html,
                text,
                name: `digest-${brief.period.replace(/\s+/g, "-").toLowerCase()}`,
            });
            if (error) {
                console.error("[publisher] Resend send error:", error);
                return { success: false, error: error.message };
            }
        }
        else {
            console.log("[publisher] No RESEND_AUDIENCE_ID set — dry run only");
            console.log(`[publisher] Would send: "${subject}" (${html.length} bytes HTML)`);
        }
        // Log the decision
        await memory.logDecision("publish_brief", "email_sent", {
            entityType: "brief",
            entityId: _briefId,
            rationale: `Published "${brief.title}" via email`,
            extra: {
                highlightCount: brief.highlights.length,
                period: brief.period,
                audienceId: audienceId || "dry-run",
            },
        });
        console.log(`[publisher] ✅ Email published: "${subject}"`);
        return { success: true };
    }
    catch (err) {
        console.error("[publisher] Email publish failed:", err);
        return { success: false, error: String(err) };
    }
}
// ─── Telegram Delivery ─────────────────────────────────────────────────
export async function publishTelegram(brief, _briefId) {
    const risk = guardrails.assessRisk("brief.publish_telegram");
    if (risk.requiresApproval) {
        const gate = await guardrails.checkApprovalGate("brief.publish_telegram", { briefId: _briefId });
        if (!gate.allowed) {
            return { success: false, error: `Approval required: ${gate.reason}` };
        }
    }
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!botToken || !chatId) {
        console.log("[publisher] Telegram not configured — skipping");
        return { success: false, error: "Telegram not configured (set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID)" };
    }
    const message = renderTelegramMd(brief);
    try {
        const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: "Markdown",
                disable_web_page_preview: false,
            }),
        });
        if (!res.ok) {
            const errBody = await res.text();
            console.error("[publisher] Telegram send error:", errBody);
            return { success: false, error: `Telegram API error: ${res.status}` };
        }
        await memory.logDecision("publish_brief", "telegram_sent", {
            entityType: "brief",
            entityId: _briefId,
            rationale: `Published "${brief.title}" to Telegram`,
        });
        console.log(`[publisher] ✅ Telegram message sent`);
        return { success: true };
    }
    catch (err) {
        console.error("[publisher] Telegram publish failed:", err);
        return { success: false, error: String(err) };
    }
}
export async function publishBrief(brief, briefId, channels) {
    const result = {
        email: { success: false, error: "Not attempted" },
        telegram: { success: false, error: "Not attempted" },
    };
    const targetChannels = channels || ["email"];
    if (targetChannels.includes("email")) {
        result.email = await publishEmail(brief, briefId);
    }
    if (targetChannels.includes("telegram")) {
        result.telegram = await publishTelegram(brief, briefId);
    }
    // Mark brief as published in memory
    const deliveryMethods = [];
    if (result.email.success)
        deliveryMethods.push("email");
    if (result.telegram.success)
        deliveryMethods.push("telegram");
    if (deliveryMethods.length > 0) {
        await memory.publishBrief(briefId, deliveryMethods);
    }
    return result;
}
// ─── Dry-Run / Preview ─────────────────────────────────────────────────
export async function previewPublish(brief) {
    return {
        emailHtml: renderEmailHtml(brief),
        emailText: renderPlainText(brief),
        telegramMd: renderTelegramMd(brief),
        briefJson: brief,
    };
}
//# sourceMappingURL=publisher.js.map