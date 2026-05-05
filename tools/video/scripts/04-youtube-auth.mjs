#!/usr/bin/env node
// One-time OAuth dance for YouTube uploads. Spins up a local loopback server,
// asks Google to redirect back with the auth code, exchanges for a refresh
// token, and writes it to .yt-token.json (gitignored). Subsequent uploads
// use the refresh token only.
//
// Google deprecated the "paste-the-code" OOB flow in 2022 for new clients;
// loopback redirects are now the only desktop-app option.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createServer } from "node:http";
import { URL } from "node:url";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { google } from "googleapis";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CREDS = path.join(ROOT, ".yt-credentials.json");
const TOKEN = path.join(ROOT, ".yt-token.json");

if (!existsSync(CREDS)) {
  throw new Error(`missing ${CREDS}`);
}

const cfg = JSON.parse(readFileSync(CREDS, "utf8")).installed;

const server = createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");
  if (error) {
    res.statusCode = 400;
    res.end(`OAuth error: ${error}. You can close this tab.`);
    console.error(`\nOAuth error: ${error}`);
    server.close();
    process.exit(1);
  }
  if (!code) {
    res.statusCode = 400;
    res.end("Missing ?code= in callback. You can close this tab.");
    return;
  }
  try {
    const { tokens } = await oauth2Client.getToken(code);
    writeFileSync(TOKEN, JSON.stringify(tokens, null, 2));
    res.end(
      "<html><body style='font-family:system-ui;padding:60px;background:#020617;color:#f3f4f6'>" +
      "<h1 style='color:#34d399'>YouTube auth successful</h1>" +
      "<p>You can close this tab and return to the terminal.</p>" +
      "</body></html>"
    );
    console.log(`\n✓ refresh_token saved → ${TOKEN}`);
    console.log(`  refresh_token present: ${tokens.refresh_token ? "yes" : "NO — re-run with prompt=consent"}`);
    console.log(`\nReady. Run \`npm run upload\` to publish the predicted-90s video.`);
    server.close();
    process.exit(0);
  } catch (e) {
    res.statusCode = 500;
    res.end(`Token exchange failed: ${e.message}`);
    console.error(`\nToken exchange failed: ${e.message}`);
    server.close();
    process.exit(1);
  }
});

const oauth2Client = new google.auth.OAuth2(cfg.client_id, cfg.client_secret);

server.listen(0, "127.0.0.1", () => {
  const port = server.address().port;
  const redirectUri = `http://127.0.0.1:${port}`;
  oauth2Client.redirectUri = redirectUri;

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    redirect_uri: redirectUri,
    scope: [
      "https://www.googleapis.com/auth/youtube.upload",
      // youtube.force-ssl covers videos.update (privacy flips, metadata edits)
      // and thumbnails.set in addition to youtube.upload's insert.
      "https://www.googleapis.com/auth/youtube.force-ssl",
    ],
  });

  console.log("\nWaiting for OAuth callback on", redirectUri);
  console.log("\n1. Open this URL in your browser:\n");
  console.log(`   ${url}\n`);
  console.log("2. Approve YouTube access on the GitDealFlow channel");
  console.log("3. Google redirects back to localhost — this script captures the code automatically.");
  console.log("\n(If the browser shows 'site can't be reached', the server already closed because the code arrived. Check terminal.)");
});

// Safety: stop after 5 minutes
setTimeout(() => {
  console.error("\nTimed out waiting for OAuth callback after 5 min.");
  server.close();
  process.exit(1);
}, 5 * 60 * 1000);
