/**
 * One-off backfill: add `websiteUrl` to every existing startup in data/startups.json
 * by fetching GitHub's `/orgs/{login}` endpoint and reading the `blog` field.
 *
 * Keeps the full `fetch-github-data.ts` pipeline untouched. That crawler only
 * processes a rotating 5-sector slice per day, so backfilling URLs across all
 * ~369 existing records via the main pipeline would take multiple full runs.
 *
 * Usage: npx tsx scripts/backfill-blog-urls.ts
 */

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

interface StartupRecord {
  name: string;
  githubUrl: string;
  websiteUrl?: string;
  [k: string]: unknown;
}
interface SectorSnapshot {
  intro: string;
  startups: StartupRecord[];
  faqs: unknown[];
}
interface Sector {
  slug: string;
  name: string;
  description: string;
  relatedSlugs: string[];
  periods: Record<string, SectorSnapshot>;
}
interface DataFile {
  periods: { slug: string; name: string; current: boolean }[];
  sectors: Sector[];
}

function getGitHubToken(): string {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  try {
    const t = execSync("gh auth token", { encoding: "utf8" }).trim();
    if (t) return t;
  } catch {}
  throw new Error("No GitHub token. Set GITHUB_TOKEN or log in with gh CLI.");
}

const GITHUB_TOKEN = getGitHubToken();

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function normalizeBlog(raw: string | null | undefined, orgLogin: string): string | undefined {
  if (!raw) return undefined;
  let v = raw.trim();
  if (!v || v === "-") return undefined;
  if (!/^https?:\/\//i.test(v)) v = `https://${v}`;
  try {
    const u = new URL(v);
    if (u.hostname.toLowerCase() === `${orgLogin.toLowerCase()}.github.io`) return undefined;
    u.hostname = u.hostname.toLowerCase();
    let out = u.toString();
    if (u.pathname === "/" && !u.search && !u.hash) out = out.replace(/\/$/, "");
    return out;
  } catch {
    return undefined;
  }
}

async function fetchOrgBlog(orgLogin: string): Promise<string | undefined> {
  const url = `https://api.github.com/orgs/${encodeURIComponent(orgLogin)}`;
  const headers = {
    Authorization: `token ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "vc-deal-flow-signal-backfill",
  };
  const res = await fetch(url, { headers });
  if (res.status === 404) return undefined;
  if (res.status === 403) {
    const reset = res.headers.get("x-ratelimit-reset");
    throw new Error(`Rate-limited (reset at ${reset})`);
  }
  if (!res.ok) return undefined;
  const d = (await res.json()) as { blog?: string | null };
  return normalizeBlog(d.blog, orgLogin);
}

async function main() {
  const dataPath = path.join(process.cwd(), "data", "startups.json");
  const raw = fs.readFileSync(dataPath, "utf8");
  const data = JSON.parse(raw) as DataFile;

  const allStartups: StartupRecord[] = [];
  for (const sector of data.sectors) {
    for (const snap of Object.values(sector.periods)) {
      for (const s of snap.startups) allStartups.push(s);
    }
  }

  const uniqueNames = Array.from(new Set(allStartups.map((s) => s.name)));
  console.log(`Found ${uniqueNames.length} unique startups across ${allStartups.length} record occurrences`);

  const blogByName: Record<string, string | undefined> = {};
  let resolved = 0, skipped = 0, errors = 0;

  for (let i = 0; i < uniqueNames.length; i++) {
    const name = uniqueNames[i];
    const existing = allStartups.find((s) => s.name === name);
    if (existing?.websiteUrl) {
      blogByName[name] = existing.websiteUrl;
      skipped++;
      continue;
    }
    try {
      const blog = await fetchOrgBlog(name);
      blogByName[name] = blog;
      if (blog) {
        resolved++;
        console.log(`  [${i + 1}/${uniqueNames.length}] ${name} → ${blog}`);
      } else {
        console.log(`  [${i + 1}/${uniqueNames.length}] ${name} → (no blog)`);
      }
    } catch (e) {
      errors++;
      console.error(`  [${i + 1}/${uniqueNames.length}] ${name} → ERROR:`, (e as Error).message);
      if ((e as Error).message.startsWith("Rate-limited")) {
        console.error("Stopping early — rerun after rate limit resets.");
        break;
      }
    }
    await sleep(200);
  }

  for (const sector of data.sectors) {
    for (const snap of Object.values(sector.periods)) {
      for (const s of snap.startups) {
        const blog = blogByName[s.name];
        if (blog) s.websiteUrl = blog;
      }
    }
  }

  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf8");
  console.log(`\nDone. ${resolved} newly resolved, ${skipped} already had websiteUrl, ${errors} errors, ${uniqueNames.length - resolved - skipped - errors} had no blog field.`);
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
