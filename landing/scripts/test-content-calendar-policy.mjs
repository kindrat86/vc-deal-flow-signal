import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const calendar = readFileSync(
  resolve(import.meta.dirname, "../content-calendar.html"),
  "utf8",
);

test("content calendar uses only truthful, permission-safe earned distribution", () => {
  assert.match(calendar, /Evidence and outcome/);
  assert.match(calendar, /Placement ID/);
  assert.match(calendar, /UTM destination/);
  assert.match(calendar, /Company LinkedIn page \(approval only\)/);
  assert.match(calendar, /Founder-published HN only/);
  assert.doesNotMatch(calendar, /219 startup fundraises|3\.4x|@sipiteno/);
  assert.doesNotMatch(calendar, /<td>LinkedIn<\/td>/);
});
