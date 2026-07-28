/**
 * Signal Analyst Agent — Briefer
 *
 * Generates investor-ready briefs from structured signal data.
 * Uses a two-stage pipeline:
 *   1. Template-driven: deterministic, zero-cost, always available
 *   2. LLM-augmented: Claude API for narrative polish (optional, cost-controlled)
 */
import { Anthropic } from "@anthropic-ai/sdk";
import * as guardrails from "./guardrails.js";
// ─── LLM Client ────────────────────────────────────────────────────────
let anthropic = null;
function getAnthropic() {
    if (anthropic)
        return anthropic;
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        console.log("[briefer] No ANTHROPIC_API_KEY set — using template-only mode (no LLM)");
        return null;
    }
    anthropic = new Anthropic({ apiKey });
    return anthropic;
}
// ─── Template-Driven Briefs (zero LLM cost) ────────────────────────────
function templateNarrative(s) {
    const velChange = s.commitVelocityChange || "0%";
    const conGrowth = s.contributorGrowth || "0%";
    const score = s.score.accelerationScore;
    const tier = s.score.raiseLikelihood;
    const parts = [];
    // Signal type explainer
    const signalHuman = s.signalType.toLowerCase();
    if (signalHuman.includes("deploy") || signalHuman.includes("spike")) {
        parts.push(`Commit velocity surged ${velChange} in the last 14 days`);
    }
    else if (signalHuman.includes("hiring") || signalHuman.includes("burst")) {
        parts.push(`Engineering team expanded ${conGrowth} in new contributors`);
    }
    else if (signalHuman.includes("infrastructure") || signalHuman.includes("buildout")) {
        parts.push(`Created ${s.newRepos} new public repos in 30 days, signaling infrastructure expansion`);
    }
    else if (signalHuman.includes("migration")) {
        parts.push(`Framework migration detected, suggesting production-scale maturation`);
    }
    else {
        parts.push(`Engineering acceleration: ${velChange} commit velocity change, ${conGrowth} contributor growth`);
    }
    // Activity context
    parts.push(`${s.commitVelocity14d} commits from ${s.contributors} contributors in the trailing window`);
    // Tier interpretation
    if (tier === "high") {
        parts.push(`Acceleration score ${score}/100 — high raise likelihood within 3-6 months`);
    }
    else if (tier === "elevated") {
        parts.push(`Acceleration score ${score}/100 — elevated raise likelihood within 6-9 months`);
    }
    else if (tier === "moderate") {
        parts.push(`Acceleration score ${score}/100 — moderate signal, worth monitoring`);
    }
    // New/surging context
    if (s.isNew) {
        parts.push(`New to the tracked universe this week`);
    }
    if (s.isSurging && s.scoreDelta) {
        parts.push(`Score surged +${s.scoreDelta}pts week-over-week`);
    }
    return parts.join(". ") + ".";
}
// ─── LLM-Augmented Narratives (optional) ───────────────────────────────
async function llmNarrative(s) {
    const client = getAnthropic();
    if (!client)
        return null;
    if (!guardrails.trackLlmCall()) {
        return null; // Budget exceeded
    }
    try {
        const prompt = `You are an analyst at GitDealFlow, briefing a VC investor. Write a 3-sentence note about this startup's engineering acceleration signals. Be specific, reference their metrics, and explain why an investor should pay attention. Never claim they WILL raise or guarantee anything. Use "may", "suggests", "indicates" language.

Startup: ${s.name}
Sector: ${s.sectorName}
Stage: ${s.stage || "Unknown"}
Signal: ${s.signalType}
Commit velocity (14d): ${s.commitVelocity14d} (${s.commitVelocityChange})
Contributors: ${s.contributors} (${s.contributorGrowth})
New repos (30d): ${s.newRepos}
GitHub: ${s.githubUrl}
Score: ${s.score.accelerationScore}/100 (${s.score.raiseLikelihood} raise likelihood)
${s.isNew ? "NEW to tracked universe" : ""}
${s.isSurging ? `Score surged +${s.scoreDelta}pts this week` : ""}

Write exactly 3 sentences. No preamble, no sign-off.`;
        const response = await client.messages.create({
            model: "claude-haiku-3-5-sonnet-20241022", // fallback to haiku for cost
            max_tokens: 200,
            temperature: 0.5,
            messages: [{ role: "user", content: prompt }],
        });
        const text = response.content
            .filter((block) => block.type === "text")
            .map((block) => block.text)
            .join(" ")
            .trim();
        if (text && text.length > 20)
            return text;
        return null;
    }
    catch (err) {
        console.warn(`[briefer] LLM call failed for ${s.name}:`, err);
        return null;
    }
}
// ─── Brief Builder ─────────────────────────────────────────────────────
export async function buildStartupBrief(startup, rank, useLLM = false) {
    let narrative;
    if (useLLM) {
        const llmResult = await llmNarrative(startup);
        narrative = llmResult || templateNarrative(startup);
    }
    else {
        narrative = templateNarrative(startup);
    }
    return {
        rank,
        name: startup.name,
        sector: startup.sectorName,
        stage: startup.stage || "Unknown",
        geography: startup.geography || "Unknown",
        signalType: startup.signalType,
        accelerationScore: startup.score.accelerationScore,
        raiseLikelihood: startup.score.raiseLikelihood,
        commitVelocity14d: startup.commitVelocity14d,
        commitVelocityChange: startup.commitVelocityChange || "0%",
        contributors: startup.contributors,
        contributorGrowth: startup.contributorGrowth || "0%",
        newRepos: startup.newRepos,
        githubUrl: startup.githubUrl,
        websiteUrl: startup.websiteUrl,
        narrative,
        isNew: startup.isNew,
        isSurging: startup.isSurging,
        scoreDelta: startup.scoreDelta,
    };
}
export async function buildWeeklyBrief(highlights, summary, period, useLLM = false) {
    guardrails.resetCycleCounters();
    const briefs = [];
    for (let i = 0; i < highlights.length; i++) {
        if (!guardrails.trackBriefGenerated())
            break;
        const brief = await buildStartupBrief(highlights[i], i + 1, useLLM);
        briefs.push(brief);
    }
    return {
        title: `GitDealFlow Sunday Digest — ${period}`,
        period,
        summary,
        highlights: briefs,
        methodologyUrl: "https://signals.gitdealflow.com/methodology",
        citation: "VC Deal Flow Signal (signals.gitdealflow.com), engineering acceleration data.",
        generatedAt: new Date().toISOString(),
    };
}
// ─── HTML Email Rendering ──────────────────────────────────────────────
export function renderEmailHtml(brief) {
    const highlightsHtml = brief.highlights
        .map((h, i) => `
    <div style="margin-bottom: 28px; padding-bottom: 24px; border-bottom: 1px solid #1e293b;">
      <div style="display: flex; align-items: baseline; gap: 8px; margin-bottom: 6px;">
        <span style="font-size: 20px; font-weight: 700; color: #ff6b1a;">#${h.rank}</span>
        <span style="font-size: 18px; font-weight: 700; color: #f1f5f9;">${h.name}</span>
        <span style="font-size: 12px; color: #94a3b8; background: #1e293b; padding: 2px 8px; border-radius: 4px;">${h.sector}</span>
      </div>
      <div style="margin-bottom: 8px; font-size: 13px; color: #64748b;">
        ${h.stage} · ${h.geography} · ${h.signalType}
      </div>
      <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1; margin: 0 0 12px 0;">
        ${h.narrative}
      </p>
      <div style="display: flex; gap: 16px; font-size: 12px; color: #64748b;">
        <span>🏷️ ${h.commitVelocity14d} commits</span>
        <span>👥 ${h.contributors} contributors</span>
        ${h.newRepos > 0 ? `<span>📦 ${h.newRepos} new repos</span>` : ""}
        <span>📊 Score: ${h.accelerationScore}/100 (${h.raiseLikelihood})</span>
        ${h.isNew ? '<span style="color: #ff6b1a; font-weight: 600;">🆕 NEW</span>' : ""}
        ${h.isSurging ? `<span style="color: #ff6b1a; font-weight: 600;">⚡ +${h.scoreDelta}pts</span>` : ""}
      </div>
      <div style="margin-top: 10px;">
        <a href="${h.githubUrl}" style="color: #ff6b1a; font-size: 13px; text-decoration: none;">GitHub →</a>
        ${h.websiteUrl ? `&nbsp;&nbsp;<a href="${h.websiteUrl}" style="color: #94a3b8; font-size: 13px; text-decoration: none;">Website →</a>` : ""}
      </div>
    </div>`)
        .join("\n");
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark">
  <style>
    body { margin: 0; padding: 0; background: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; }
    a { color: #ff6b1a; }
  </style>
</head>
<body style="background: #0f172a; padding: 40px 20px;">
  <div style="max-width: 620px; margin: 0 auto; background: #0f172a;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid #1e293b;">
      <div style="font-size: 24px; font-weight: 800; color: #f1f5f9; letter-spacing: -0.5px;">
        GitDealFlow <span style="color: #ff6b1a;">Sunday Digest</span>
      </div>
      <div style="font-size: 13px; color: #64748b; margin-top: 6px;">${brief.period}</div>
    </div>

    <!-- Summary -->
    <p style="font-size: 15px; line-height: 1.7; color: #94a3b8; margin: 0 0 28px 0;">
      ${brief.summary}
    </p>

    <!-- Highlights -->
    ${highlightsHtml}

    <!-- Footer -->
    <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #1e293b; font-size: 12px; color: #475569; text-align: center;">
      <p style="margin: 0 0 8px 0;">
        Derived from public GitHub engineering-acceleration signals.
        <strong>This is not investment advice.</strong>
      </p>
      <p style="margin: 0 0 4px 0;">
        <a href="${brief.methodologyUrl}" style="color: #475569;">Methodology</a> ·
        <a href="https://signals.gitdealflow.com" style="color: #475569;">Dashboard</a> ·
        <a href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6606558" style="color: #475569;">SSRN Paper</a>
      </p>
      <p style="margin: 8px 0 0 0; color: #334155;">
        Generated autonomously by the GitDealFlow Signal Analyst Agent.
      </p>
    </div>
  </div>
</body>
</html>`;
}
// ─── Plain Text Rendering ──────────────────────────────────────────────
export function renderPlainText(brief) {
    const header = `GitDealFlow Sunday Digest — ${brief.period}\n${"=".repeat(50)}\n\n`;
    const summary = `${brief.summary}\n\n`;
    const highlights = brief.highlights
        .map((h) => `#${h.rank} ${h.name} — ${h.sector} (${h.stage})\n` +
        `Signal: ${h.signalType} | Score: ${h.accelerationScore}/100 (${h.raiseLikelihood})\n` +
        `Commits: ${h.commitVelocity14d} (${h.commitVelocityChange}) | Contributors: ${h.contributors} (${h.contributorGrowth})\n` +
        `${h.narrative}\n` +
        `GitHub: ${h.githubUrl}${h.websiteUrl ? ` | Website: ${h.websiteUrl}` : ""}\n` +
        `${h.isNew ? "🆕 NEW | " : ""}${h.isSurging ? `⚡ +${h.scoreDelta}pts | ` : ""}\n`)
        .join("\n");
    const footer = `\n${"-".repeat(50)}\n` +
        `Methodology: ${brief.methodologyUrl}\n` +
        `Citation: ${brief.citation}\n` +
        `Generated: ${brief.generatedAt}\n` +
        `Disclaimer: Derived from public GitHub signals. Not investment advice.\n`;
    return header + summary + highlights + footer;
}
// ─── Telegram Markdown Rendering ───────────────────────────────────────
export function renderTelegramMd(brief) {
    const header = `📡 *GitDealFlow Digest — ${brief.period}*\n\n${brief.summary}\n`;
    const highlights = brief.highlights
        .map((h) => `\n🔹 *#${h.rank} ${h.name}* — ${h.sector}\n` +
        `_${h.signalType}_ | Score: *${h.accelerationScore}/100*\n` +
        `${h.narrative.slice(0, 300)}\n` +
        `[GitHub](${h.githubUrl})`)
        .join("\n");
    const footer = `\n\n—\n` +
        `[Methodology](${brief.methodologyUrl}) · ` +
        `[Dashboard](https://signals.gitdealflow.com)\n` +
        `_Not investment advice. Generated autonomously._`;
    return header + highlights + footer;
}
//# sourceMappingURL=briefer.js.map