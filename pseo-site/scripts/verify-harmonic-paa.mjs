#!/usr/bin/env node
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync("content/alternatives.ts", "utf8");
for (const question of [
  "How does Harmonic compare to Grata for deal sourcing?",
  "How does Harmonic compare to Eilla AI?",
  "How does Harmonic compare to SourceScrub?",
  "How does Harmonic compare to Synaptic?",
]) assert.ok(source.includes(question), `missing Harmonic comparison FAQ: ${question}`);
console.log("[verify-harmonic-paa] PASS");
