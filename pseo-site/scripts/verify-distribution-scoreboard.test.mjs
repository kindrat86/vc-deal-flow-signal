import assert from "node:assert/strict";
import { validateScoreboard } from "./verify-distribution-scoreboard.mjs";

const HEADER = [
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
].join(",");

const VALID_ROW = [
  "2026-08-20",
  "r/datasets readers",
  "Reddit",
  "1000",
  "50",
  "15",
  "5.00%",
  "1.50%",
  "Reddit post insights",
  "2026-08-20T09:00:00Z",
  "open data",
  "/book",
  "datasets-story-1",
  "https://reddit.com/r/datasets/example",
  "live",
  "",
  "/research",
  "",
  "Review comments",
  "",
  "",
].join(",");

assert.deepEqual(validateScoreboard(`${HEADER}\n${VALID_ROW}\n`), []);

const invalidRate = VALID_ROW.replace("5.00%", "6.00%");
assert.match(
  validateScoreboard(`${HEADER}\n${invalidRate}\n`).join("\n"),
  /platform_engagement_rate/,
);

const missingPlatformMetric = HEADER.replace(",platform_impressions", "");
assert.match(
  validateScoreboard(`${missingPlatformMetric}\n${VALID_ROW}\n`).join("\n"),
  /platform_impressions/,
);

console.log("[verify-distribution-scoreboard.test] PASS");
