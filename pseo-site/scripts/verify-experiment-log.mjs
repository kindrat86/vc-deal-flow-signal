#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const file = path.resolve(process.cwd(), "docs/experiment-log.csv");
const required = [
  "experiment_id", "launched_at", "channel", "placement_type", "live_url",
  "platform_post_id", "utm_id", "hypothesis", "primary_metric", "baseline_value",
  "result_checked_at", "result_72h", "decision", "notes",
];
const lines = fs.readFileSync(file, "utf8").trimEnd().split("\n");
const header = lines[0].split(",");
if (header.join(",") !== required.join(",")) {
  throw new Error("experiment-log.csv header drifted. Use the canonical required fields.");
}
for (const [index, line] of lines.slice(1).entries()) {
  if (!line.trim()) continue;
  const values = line.split(",");
  if (values.length !== required.length) throw new Error(`row ${index + 2}: expected ${required.length} columns`);
  const row = Object.fromEntries(required.map((key, i) => [key, values[i].trim()]));
  for (const key of ["experiment_id", "launched_at", "channel", "live_url", "utm_id", "hypothesis", "primary_metric", "result_checked_at", "result_72h", "decision"]) {
    if (!row[key]) throw new Error(`row ${index + 2}: missing ${key}`);
  }
  if (!/^https:\/\//.test(row.live_url)) throw new Error(`row ${index + 2}: live_url must be https`);
  if (!/^[a-z0-9][a-z0-9-]{2,119}$/.test(row.utm_id)) throw new Error(`row ${index + 2}: utm_id must be a stable lowercase placement key`);
  const launched = Date.parse(row.launched_at);
  const checked = Date.parse(row.result_checked_at);
  if (!Number.isFinite(launched) || !Number.isFinite(checked) || checked - launched < 72 * 60 * 60 * 1000) {
    throw new Error(`row ${index + 2}: result_checked_at must be at least 72 hours after launched_at`);
  }
  if (!/^(winner|loser|inconclusive|stopped)$/.test(row.decision)) throw new Error(`row ${index + 2}: invalid decision`);
}
console.log(`[verify-experiment-log] PASS ${lines.length - 1} completed experiments`);
