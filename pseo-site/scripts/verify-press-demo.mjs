import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const page = readFileSync(resolve(root, "app/press/page.tsx"), "utf8");
const requiredMarkup = [
  'href="/press/mcp-demo-30s.gif"',
  'href="/press/mcp-demo-30s.mp4"',
  'href="/press/mcp-demo-proof-still-1280x800.png"',
  'MCP demo',
];
const requiredFiles = [
  "public/press/mcp-demo-30s.gif",
  "public/press/mcp-demo-30s.mp4",
  "public/press/mcp-demo-proof-still-1280x800.png",
];

for (const value of requiredMarkup) {
  if (!page.includes(value)) throw new Error(`Press page missing: ${value}`);
}
for (const file of requiredFiles) {
  if (!existsSync(resolve(root, file))) throw new Error(`Press asset missing: ${file}`);
}

console.log("Press demo assets are linked and present.");
