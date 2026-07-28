/**
 * Signal Analyst Agent — Publisher
 *
 * Multi-channel delivery layer for agent-generated briefs.
 * Handles: email (Resend), Telegram, and site updates.
 * All publishing respects guardrails and logs decisions.
 */
import type { WeeklyBrief } from "./types.js";
export declare function publishEmail(brief: WeeklyBrief, _briefId: number): Promise<{
    success: boolean;
    error?: string;
}>;
export declare function publishTelegram(brief: WeeklyBrief, _briefId: number): Promise<{
    success: boolean;
    error?: string;
}>;
export interface PublishResult {
    email: {
        success: boolean;
        error?: string;
    };
    telegram: {
        success: boolean;
        error?: string;
    };
}
export declare function publishBrief(brief: WeeklyBrief, briefId: number, channels?: ("email" | "telegram")[]): Promise<PublishResult>;
export declare function previewPublish(brief: WeeklyBrief): Promise<{
    emailHtml: string;
    emailText: string;
    telegramMd: string;
    briefJson: WeeklyBrief;
}>;
//# sourceMappingURL=publisher.d.ts.map