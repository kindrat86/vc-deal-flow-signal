#!/usr/bin/env node
/**
 * GSC OAuth2 setup — one-time consent flow to authorize a REAL verified owner
 * (signal@gitdealflow.com) for the Search Console URL Inspection API.
 *
 * WHY THIS EXISTS: GSC's "Add user" UI only accepts real Google Account emails,
 * not service-account emails (*.iam.gserviceaccount.com), and a domain property
 * (sc-domain:) cannot delegate Owner to a service account at all. The URL
 * Inspection API authorizes against the property's owners/users, so the
 * reliable path is OAuth2 as the verified owner. This produces a long-lived
 * refresh token that `gsc-index-report.mjs` then uses headlessly.
 *
 * Zero npm dependencies: Node ≥18 global fetch + node:http loopback listener.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * SETUP (one-time, ~3 min):
 *   1. Cloud Console (project gitdealflow-monitoring) → APIs & Services →
 *      Credentials → Create Credentials → OAuth client ID.
 *        • If prompted, configure the OAuth consent screen first:
 *          User type "External", add signal@gitdealflow.com as a Test user
 *          (Testing mode is fine — refresh tokens issued in Testing for a
 *          Google-owned scope do not expire as long as the app stays in use).
 *        • Application type: **Desktop app**.
 *   2. Download the JSON → save it to:  tools/.gsc-oauth-client.json
 *      (gitignored). It looks like { "installed": { "client_id": …, … } }.
 *   3. Run:  node tools/gsc-oauth-setup.mjs
 *      A browser opens. Sign in AS signal@gitdealflow.com (the verified owner)
 *      and approve read-only Search Console access.
 *   4. The refresh token is written to tools/.gsc-oauth-token.json (gitignored).
 *      Then run:  node tools/gsc-index-report.mjs
 * ──────────────────────────────────────────────────────────────────────────
 */

import { createServer } from "node:http";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLIENT_PATH =
  process.env.GSC_OAUTH_CLIENT || resolve(__dirname, ".gsc-oauth-client.json");
const TOKEN_PATH = resolve(__dirname, ".gsc-oauth-token.json");
const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";

if (!existsSync(CLIENT_PATH)) {
  console.error(
    `\n❌ OAuth client secret not found at:\n   ${CLIENT_PATH}\n\n` +
      `Create a "Desktop app" OAuth client ID in Cloud Console, download the\n` +
      `JSON, and save it to that path. See the header of this file for the\n` +
      `3-minute walkthrough.\n`
  );
  process.exit(2);
}

const raw = JSON.parse(readFileSync(CLIENT_PATH, "utf8"));
const cfg = raw.installed || raw.web || raw;
const CLIENT_ID = cfg.client_id;
const CLIENT_SECRET = cfg.client_secret;
const AUTH_URI = cfg.auth_uri || "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_URI = cfg.token_uri || "https://oauth2.googleapis.com/token";

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    `\n❌ ${CLIENT_PATH} is missing client_id/client_secret. Is it a Desktop-app\n` +
      `OAuth client JSON? (Expected an "installed" object.)\n`
  );
  process.exit(2);
}

function openBrowser(url) {
  const cmd =
    process.platform === "darwin"
      ? "open"
      : process.platform === "win32"
        ? "start"
        : "xdg-open";
  try {
    spawn(cmd, [url], { stdio: "ignore", detached: true, shell: process.platform === "win32" }).unref();
  } catch {
    /* fall back to manual paste */
  }
}

// Loopback flow: Desktop-app clients may redirect to 127.0.0.1 on any port
// without pre-registering the URI. We listen on an OS-assigned free port.
const server = createServer(async (req, res) => {
  const u = new URL(req.url, "http://127.0.0.1");
  if (u.pathname !== "/") {
    res.writeHead(404).end();
    return;
  }
  const code = u.searchParams.get("code");
  const err = u.searchParams.get("error");
  if (err) {
    res.writeHead(200, { "Content-Type": "text/html" }).end(
      `<h2>Authorization failed</h2><p>${err}</p><p>You can close this tab.</p>`
    );
    console.error(`\n❌ Authorization denied: ${err}`);
    server.close();
    process.exit(1);
  }
  if (!code) {
    res.writeHead(400).end("missing code");
    return;
  }
  try {
    const redirectUri = `http://127.0.0.1:${server.address().port}`;
    const tok = await fetch(TOKEN_URI, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });
    const j = await tok.json();
    if (!tok.ok || !j.refresh_token) {
      res.writeHead(200, { "Content-Type": "text/html" }).end(
        `<h2>No refresh token returned</h2><p>${JSON.stringify(j)}</p>` +
          `<p>Re-run after revoking prior access, or ensure prompt=consent.</p>`
      );
      console.error(
        `\n❌ Token exchange returned no refresh_token (${tok.status}):\n` +
          JSON.stringify(j, null, 2) +
          `\n\nIf you've authorized this client before, revoke it at\n` +
          `https://myaccount.google.com/permissions and run again.\n`
      );
      server.close();
      process.exit(1);
    }
    writeFileSync(
      TOKEN_PATH,
      JSON.stringify(
        {
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          refresh_token: j.refresh_token,
          token_uri: TOKEN_URI,
          scope: SCOPE,
          obtained_at: new Date().toISOString(),
        },
        null,
        2
      )
    );
    res.writeHead(200, { "Content-Type": "text/html" }).end(
      `<h2>✅ Search Console access authorized</h2>` +
        `<p>Refresh token saved. You can close this tab and return to the terminal.</p>`
    );
    console.log(`\n✅ Refresh token written to ${TOKEN_PATH}`);
    console.log(`   Next:  node tools/gsc-index-report.mjs --all\n`);
    server.close();
    process.exit(0);
  } catch (e) {
    res.writeHead(500).end(String(e));
    console.error(`\n❌ ${e.stack || e.message}`);
    server.close();
    process.exit(1);
  }
});

server.listen(0, "127.0.0.1", () => {
  const port = server.address().port;
  const redirectUri = `http://127.0.0.1:${port}`;
  const authUrl =
    `${AUTH_URI}?` +
    new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: SCOPE,
      access_type: "offline",
      prompt: "consent",
    }).toString();

  console.log(`GSC OAuth2 setup`);
  console.log(`================`);
  console.log(`Listening on ${redirectUri} for the consent redirect.\n`);
  console.log(`Opening your browser. If it doesn't open, paste this URL:\n`);
  console.log(`  ${authUrl}\n`);
  console.log(`Sign in AS the verified owner (signal@gitdealflow.com) and approve.\n`);
  openBrowser(authUrl);
});
