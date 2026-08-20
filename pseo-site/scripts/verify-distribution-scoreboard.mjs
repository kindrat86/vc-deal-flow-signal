#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const REQUIRED_COLUMNS = [
  "date",
  "target",
  "platform",
  "platform_impressions",
  "platform_engagements",
  "platform_link_clicks",
  "platform_engagement_rate",
  "platform_click_through_rate",
  "platform_metrics_source",
  "platform_metrics_checked_at",
  "context",
  "page_sent",
  "snippet_used",
  "thread_or_url",
  "status",
  "result",
  "follow_up_page",
  "follow_up_due",
  "next_move",
  "notes",
  "response_type",
];

function parseCsvLine(line) {
  const cells = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"') {
      if (quoted && line[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === "," && !quoted) {
      cells.push(cell.trim());
      cell = "";
    } else {
      cell += char;
    }
  }
  cells.push(cell.trim());
  return cells;
}

function parseNumber(value) {
  const normalized = String(value || "").trim();
  if (!normalized) return null;
  if (!/^\d+(?:\.\d+)?$/.test(normalized)) return Number.NaN;
  return Number(normalized);
}

function parsePercent(value) {
  const normalized = String(value || "").trim();
  if (!normalized) return null;
  const match = normalized.match(/^(\d+(?:\.\d+)?)%$/);
  return match ? Number(match[1]) : Number.NaN;
}

function hasValue(...values) {
  return values.some((value) => String(value || "").trim() !== "");
}

function expectedPercent(numerator, denominator) {
  return Number(((numerator / denominator) * 100).toFixed(2));
}

export function validateScoreboard(csv) {
  const lines = String(csv || "").split(/\r?\n/).filter((line) => line.trim());
  const errors = [];
  if (!lines.length) return ["Scoreboard is empty."];

  const header = parseCsvLine(lines[0]);
  const columns = new Map(header.map((column, index) => [column, index]));
  for (const required of REQUIRED_COLUMNS) {
    if (!columns.has(required)) errors.push(`Missing required column: ${required}`);
  }
  if (errors.length) return errors;

  for (let lineNumber = 2; lineNumber <= lines.length; lineNumber += 1) {
    const cells = parseCsvLine(lines[lineNumber - 1]);
    if (cells.length !== header.length) {
      errors.push(`Row ${lineNumber}: expected ${header.length} columns, found ${cells.length}.`);
      continue;
    }
    const row = Object.fromEntries(header.map((column, index) => [column, cells[index]]));
    const impressions = parseNumber(row.platform_impressions);
    const engagements = parseNumber(row.platform_engagements);
    const clicks = parseNumber(row.platform_link_clicks);
    const engagementRate = parsePercent(row.platform_engagement_rate);
    const clickThroughRate = parsePercent(row.platform_click_through_rate);

    for (const [field, value] of [["platform_impressions", impressions], ["platform_engagements", engagements], ["platform_link_clicks", clicks]]) {
      if (Number.isNaN(value) || (value !== null && value < 0)) errors.push(`Row ${lineNumber}: ${field} must be a non-negative number.`);
    }
    for (const [field, value] of [["platform_engagement_rate", engagementRate], ["platform_click_through_rate", clickThroughRate]]) {
      if (Number.isNaN(value) || (value !== null && (value < 0 || value > 100))) errors.push(`Row ${lineNumber}: ${field} must be a percentage from 0% to 100%.`);
    }

    const hasMetrics = hasValue(row.platform_impressions, row.platform_engagements, row.platform_link_clicks, row.platform_engagement_rate, row.platform_click_through_rate);
    if (hasMetrics && !String(row.platform_metrics_source || "").trim()) errors.push(`Row ${lineNumber}: platform_metrics_source is required when platform metrics are present.`);
    if (hasMetrics && !/^\d{4}-\d{2}-\d{2}T/.test(String(row.platform_metrics_checked_at || ""))) errors.push(`Row ${lineNumber}: platform_metrics_checked_at must be an ISO timestamp when platform metrics are present.`);
    if (impressions !== null && engagements !== null && engagements > impressions) errors.push(`Row ${lineNumber}: platform_engagements cannot exceed platform_impressions.`);
    if (impressions !== null && clicks !== null && clicks > impressions) errors.push(`Row ${lineNumber}: platform_link_clicks cannot exceed platform_impressions.`);
    if (impressions && engagements !== null && engagementRate !== null && engagementRate !== expectedPercent(engagements, impressions)) errors.push(`Row ${lineNumber}: platform_engagement_rate must equal engagements ÷ impressions, rounded to two decimals.`);
    if (impressions && clicks !== null && clickThroughRate !== null && clickThroughRate !== expectedPercent(clicks, impressions)) errors.push(`Row ${lineNumber}: platform_click_through_rate must equal link clicks ÷ impressions, rounded to two decimals.`);
  }
  return errors;
}

function main() {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const file = process.argv[2] || path.join(scriptDir, "..", "docs", "distribution-scoreboard-2026-05-26.csv");
  const errors = validateScoreboard(fs.readFileSync(file, "utf8"));
  if (errors.length) {
    console.error(`[verify-distribution-scoreboard] FAIL ${path.relative(process.cwd(), file)}`);
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }
  console.log(`[verify-distribution-scoreboard] PASS ${path.relative(process.cwd(), file)}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
