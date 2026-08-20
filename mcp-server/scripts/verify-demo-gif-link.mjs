import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const readme = readFileSync(resolve(import.meta.dirname, "..", "README.md"), "utf8");
const expected = "https://raw.githubusercontent.com/kindrat86/vc-deal-flow-signal/main/marketing/launch-posts/mcp-demo-ph-30s.gif";

if (!readme.includes(expected)) {
  throw new Error("README must embed the public 30-second demo GIF.");
}

console.log("README embeds the public 30-second demo GIF.");
