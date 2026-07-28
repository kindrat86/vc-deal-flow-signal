/**
 * Signal Analyst Agent — Scheduler
 *
 * Cron-based autonomous trigger. Runs the agent on a weekly cycle
 * (Sunday at 06:00 UTC for the Sunday Digest) plus a mid-week pulse
 * (Wednesday at 06:00 UTC) for breakout detection.
 *
 * Also supports manual triggers via the Agent HQ dashboard.
 */
export declare function startScheduler(): void;
export declare function stopScheduler(): void;
export declare function getSchedulerStatus(): {
    running: boolean;
    weeklyEnabled: boolean;
    midweekEnabled: boolean;
    isExecuting: boolean;
    nextWeeklyRun: Date;
    nextMidweekRun: Date;
};
/**
 * Trigger a manual cycle (from Agent HQ dashboard).
 */
export declare function triggerManualCycle(): Promise<{
    success: boolean;
    message: string;
}>;
//# sourceMappingURL=scheduler.d.ts.map