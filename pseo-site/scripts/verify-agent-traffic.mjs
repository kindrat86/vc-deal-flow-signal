#!/usr/bin/env node
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

assert.ok(existsSync("lib/agent-traffic.ts"), "agent traffic capture module is missing");
const moduleSource = readFileSync("lib/agent-traffic.ts", "utf8");
assert.match(moduleSource, /export async function captureAgentRequest/);
assert.match(moduleSource, /event:\s*["']agent_request["']/);

for (const [file, surface] of [
  ["app/api/mcp/rpc/route.ts", "mcp"],
  ["app/api/a2a/route.ts", "a2a"],
  ["app/api/nlweb/route.ts", "nlweb"],
  ["app/api/agent/call/route.ts", "function_api"],
]) {
  const source = readFileSync(file, "utf8");
  assert.match(source, /import \{ captureAgentRequest \} from "@\/lib\/agent-traffic"/);
  assert.ok(source.includes(`await captureAgentRequest("${surface}", request);`), `${file} must await agent capture before parsing the request`);
}

console.log("[verify-agent-traffic] PASS");
