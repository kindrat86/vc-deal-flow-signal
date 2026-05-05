#!/usr/bin/env node
// Generic LLM Marketplace submission watcher.
//
// Polls multiple submission tracks (GitHub issues, GitHub PRs, Zoho emails) and
// surfaces state changes. Idempotent — only acts on transitions, not steady state.
//
// Track config: tools/llm-marketplaces-watcher/tracks.json
// Runtime state: tools/llm-marketplaces-watcher/state.json
//
// Usage:
//   node tools/llm-marketplaces-watcher/check.mjs
//   node tools/llm-marketplaces-watcher/check.mjs --dry-run

import { ImapFlow } from "imapflow";
import { execSync } from "child_process";
import { readFileSync, writeFileSync, existsSync, appendFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..", "..");
const ENV_PATH = resolve(REPO_ROOT, "tools", ".env");
const TRACKS_PATH = resolve(__dirname, "tracks.json");
const STATE_PATH = resolve(__dirname, "state.json");
const MASTER_DOC = resolve(REPO_ROOT, "marketing", "llm-marketplaces", "MASTER.md");

try {
  const envFile = readFileSync(ENV_PATH, "utf-8");
  for (const line of envFile.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    const k = t.slice(0, i).trim();
    const v = t.slice(i + 1).trim().replace(/^["']|["']$/g, "");
    if (k && !process.env[k]) process.env[k] = v;
  }
} catch {}

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    if (a.startsWith("--")) {
      const [k, ...rest] = a.slice(2).split("=");
      return [k, rest.length ? rest.join("=") : true];
    }
    return [a, true];
  })
);
const DRY_RUN = !!args["dry-run"];

const tracks = JSON.parse(readFileSync(TRACKS_PATH, "utf-8")).tracks;
const state = existsSync(STATE_PATH)
  ? JSON.parse(readFileSync(STATE_PATH, "utf-8"))
  : { version: 1, trackStates: {}, processedEmailUids: {}, lastCheckedAt: null };

const transitions = [];
const errors = [];

function ghJson(cmd) {
  try {
    return JSON.parse(execSync(cmd, { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] }));
  } catch (err) {
    return { error: err.message };
  }
}

async function checkGitHubIssue(track) {
  const before = state.trackStates[track.id] || { status: track.status };
  const issue = ghJson(
    `gh issue view ${track.issueNumber} -R ${track.repo} --json state,labels,comments,title,url 2>&1`
  );
  if (issue.error) {
    errors.push({ track: track.id, error: issue.error });
    return;
  }

  let newStatus = before.status;
  let signal = null;

  for (const sig of track.acceptedSignals || []) {
    if (sig.type === "issue_state" && issue.state.toLowerCase() === sig.value) {
      newStatus = "accepted";
      signal = sig;
      break;
    }
    if (sig.type === "label" && (issue.labels || []).some((l) => l.name.toLowerCase() === sig.value.toLowerCase())) {
      newStatus = "accepted";
      signal = sig;
      break;
    }
    if (sig.type === "comment_contains" && (issue.comments || []).some((c) => c.body.toLowerCase().includes(sig.value.toLowerCase()))) {
      newStatus = "accepted";
      signal = sig;
      break;
    }
  }

  if (newStatus !== "accepted") {
    for (const sig of track.rejectedSignals || []) {
      if (sig.type === "label" && (issue.labels || []).some((l) => l.name.toLowerCase() === sig.value.toLowerCase())) {
        newStatus = "rejected";
        signal = sig;
        break;
      }
      if (sig.type === "comment_contains" && (issue.comments || []).some((c) => c.body.toLowerCase().includes(sig.value.toLowerCase()))) {
        newStatus = "rejected";
        signal = sig;
        break;
      }
    }
  }

  state.trackStates[track.id] = {
    ...before,
    status: newStatus,
    issueState: issue.state,
    issueUrl: issue.url,
    commentCount: (issue.comments || []).length,
    lastChecked: new Date().toISOString(),
  };

  if (newStatus !== before.status) {
    transitions.push({
      track: track.id,
      from: before.status,
      to: newStatus,
      signal,
      url: issue.url,
    });
  }
}

async function checkEmailTrack(track, client) {
  const before = state.trackStates[track.id] || { status: track.status };
  const fromRe = new RegExp(track.fromRegex, "i");
  const subjectRe = new RegExp(track.subjectRegex, "i");
  const folders = ["INBOX", "Spam", "Newsletter", "Notification", "Archive"];
  const seenKey = `${track.id}`;
  const seen = new Set(state.processedEmailUids[seenKey] || []);
  const since = new Date(Date.now() - 60 * 86400e3); // 60d window

  for (const folder of folders) {
    let lock;
    try {
      lock = await client.getMailboxLock(folder);
    } catch {
      continue;
    }
    try {
      const ids = await client.search({ since });
      if (!ids || !ids.length) continue;
      for await (const msg of client.fetch(ids, { envelope: true, uid: true })) {
        if (seen.has(`${folder}#${msg.uid}`)) continue;
        const from = msg.envelope.from?.[0]?.address || "";
        const subject = msg.envelope.subject || "";
        if (!fromRe.test(from)) {
          seen.add(`${folder}#${msg.uid}`);
          continue;
        }
        if (!subjectRe.test(subject)) {
          seen.add(`${folder}#${msg.uid}`);
          continue;
        }
        const newStatus = (track.acceptanceKeywords || []).some((k) => subject.toLowerCase().includes(k))
          ? "accepted"
          : (track.rejectionKeywords || []).some((k) => subject.toLowerCase().includes(k))
          ? "rejected"
          : "responded";
        seen.add(`${folder}#${msg.uid}`);
        if (newStatus !== before.status) {
          transitions.push({
            track: track.id,
            from: before.status,
            to: newStatus,
            email: { folder, uid: msg.uid, from, subject, date: msg.envelope.date },
          });
          state.trackStates[track.id] = { ...before, status: newStatus, lastEmail: { from, subject, date: msg.envelope.date } };
        }
      }
    } finally {
      lock.release();
    }
  }
  state.processedEmailUids[seenKey] = Array.from(seen).slice(-500);
}

let imapClient = null;
const needsImap = tracks.some((t) => t.type === "email");

if (needsImap && process.env.ZOHO_EMAIL && process.env.ZOHO_APP_PASSWORD) {
  imapClient = new ImapFlow({
    host: process.env.ZOHO_IMAP_HOST || "imap.zoho.eu",
    port: Number(process.env.ZOHO_IMAP_PORT || 993),
    secure: true,
    auth: { user: process.env.ZOHO_EMAIL, pass: process.env.ZOHO_APP_PASSWORD },
    logger: false,
    socketTimeout: 30000,
    greetingTimeout: 10000,
  });
  imapClient.on("error", (err) => {
    errors.push({ stage: "imap-event", error: err?.message || String(err) });
  });
  try {
    await imapClient.connect();
  } catch (err) {
    errors.push({ stage: "imap", error: err.message });
    imapClient = null;
  }
}

for (const track of tracks) {
  try {
    if (track.type === "github_issue") {
      await checkGitHubIssue(track);
    } else if (track.type === "email" && imapClient) {
      await checkEmailTrack(track, imapClient);
    }
  } catch (err) {
    errors.push({ track: track.id, error: err.message });
  }
}

if (imapClient) {
  try { await imapClient.logout(); } catch {}
}

state.lastCheckedAt = new Date().toISOString();

if (!DRY_RUN && transitions.length > 0) {
  const lines = [];
  lines.push("");
  lines.push(`### Watcher transitions — ${state.lastCheckedAt}`);
  for (const t of transitions) {
    lines.push(`- **${t.track}**: ${t.from} → ${t.to}${t.url ? ` (${t.url})` : ""}`);
  }
  if (existsSync(MASTER_DOC)) {
    appendFileSync(MASTER_DOC, lines.join("\n") + "\n");
  }
}

if (!DRY_RUN) {
  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
}

console.log(
  JSON.stringify(
    {
      checkedAt: state.lastCheckedAt,
      tracksMonitored: tracks.length,
      transitionsCount: transitions.length,
      transitions,
      trackStates: state.trackStates,
      errors,
      dryRun: DRY_RUN,
    },
    null,
    2
  )
);
process.exit(0);
