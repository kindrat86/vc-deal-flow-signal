#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const EXPECTED_REGISTRY_DESCRIPTION = /\b15 sectors\b/i;
const FORBIDDEN_REGISTRY_DESCRIPTION = /\b20 sectors\b/i;

export function buildReleaseSurfaceReport(surfaces) {
  const versions = [
    ["npm", surfaces.npmVersion],
    ...(surfaces.npmLockVersion ? [["npmLock", surfaces.npmLockVersion]] : []),
    ["initialize", surfaces.initializeVersion],
    ["mcpJson", surfaces.manifestVersion],
    ["serverCard", surfaces.serverCardVersion],
    ["registry", surfaces.registryVersion],
    ...(surfaces.stdioVersion ? [["stdio", surfaces.stdioVersion]] : []),
  ];
  const canonicalVersion = versions[0][1];
  const errors = versions
    .filter(([, version]) => !version)
    .map(([name]) => `${name} did not return a version`);
  for (const [name, version] of versions.slice(1)) {
    if (version && version !== canonicalVersion) {
      errors.push(`${name} version ${version} does not match npm ${canonicalVersion}`);
    }
  }
  const description = surfaces.registryDescription ?? "";
  if (!EXPECTED_REGISTRY_DESCRIPTION.test(description) || FORBIDDEN_REGISTRY_DESCRIPTION.test(description)) {
    errors.push("official registry description must state 15 sectors and not 20 sectors");
  }
  return { ok: errors.length === 0, errors, canonicalVersion };
}

function readVersion(source, label) {
  const match = source.match(/(?:const\s+SERVER_VERSION\s*=\s*|version:\s*|"version"\s*:\s*)["']([^"']+)["']/);
  if (!match) throw new Error(`cannot find version in ${label}`);
  return match[1];
}

export function sourceSurfaces(root) {
  const read = (rel) => readFileSync(join(root, rel), "utf8");
  const packageJson = JSON.parse(read("../mcp-server/package.json"));
  const packageLock = JSON.parse(read("../mcp-server/package-lock.json"));
  const registry = JSON.parse(read("../mcp-server/server.json"));
  const card = read("app/.well-known/mcp/server-card.json/route.ts");
  const manifest = read("app/.well-known/mcp.json/route.ts");
  const rpc = read("app/api/mcp/rpc/route.ts");
  const stdio = read("../mcp-server/src/server.ts");
  return {
    npmVersion: packageJson.version,
    npmLockVersion: packageLock.packages?.[""]?.version,
    initializeVersion: readVersion(rpc, "RPC route"),
    manifestVersion: readVersion(manifest, "mcp.json route"),
    serverCardVersion: readVersion(card, "server-card route"),
    registryVersion: registry.version,
    stdioVersion: readVersion(stdio, "stdio server"),
    registryDescription: registry.description,
  };
}

async function json(url, init) {
  const response = await fetch(url, init);
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`);
  return response.json();
}

function latestRegistryEntry(payload) {
  const entries = payload.servers ?? [];
  const active = entries.find((entry) => entry?._meta?.["io.modelcontextprotocol.registry/official"]?.isLatest) ?? entries.at(-1);
  if (!active?.server) throw new Error("official registry returned no server entry");
  return active.server;
}

export async function liveSurfaces() {
  const registryUrl = "https://registry.modelcontextprotocol.io/v0.1/servers?search=io.github.kindrat86/vc-deal-flow-signal";
  const initialize = {
    jsonrpc: "2.0", id: "release-integrity", method: "initialize",
    params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "release-integrity", version: "1" } },
  };
  const [npm, manifest, card, rpc, registryPayload] = await Promise.all([
    json("https://registry.npmjs.org/@gitdealflow%2Fmcp-signal/latest"),
    json("https://signals.gitdealflow.com/.well-known/mcp.json"),
    json("https://signals.gitdealflow.com/.well-known/mcp/server-card.json"),
    json("https://signals.gitdealflow.com/api/mcp/rpc", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(initialize) }),
    json(registryUrl),
  ]);
  const registry = latestRegistryEntry(registryPayload);
  return {
    npmVersion: npm.version,
    initializeVersion: rpc?.result?.serverInfo?.version,
    manifestVersion: manifest.version,
    serverCardVersion: card.version,
    registryVersion: registry.version,
    registryDescription: registry.description,
  };
}

async function main() {
  const here = dirname(fileURLToPath(import.meta.url));
  const mode = process.argv[2] ?? "source";
  const surfaces = mode === "live" ? await liveSurfaces() : sourceSurfaces(dirname(here));
  const report = buildReleaseSurfaceReport(surfaces);
  if (!report.ok) {
    console.error(`release-integrity FAILED (${mode}):\n${report.errors.map((error) => ` - ${error}`).join("\n")}`);
    process.exit(1);
  }
  console.log(`release-integrity OK (${mode}): ${report.canonicalVersion}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
