/**
 * Signal Analyst Agent — Agent HQ Server
 *
 * Express server providing:
 * - REST API for dashboard consumption
 * - Agent control endpoints (trigger, pause, approve)
 * - Static file serving for the Agent HQ web dashboard
 * - Health check endpoint
 */
declare const app: import("express-serve-static-core").Express;
export declare function startServer(port?: number): void;
export { app };
//# sourceMappingURL=server.d.ts.map