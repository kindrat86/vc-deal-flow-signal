#!/usr/bin/env node
// One-time setup: open a real (headed) browser pointed at x.com/login.
// You log in. As soon as the auth_token cookie appears, the script
// auto-saves the session and closes the browser — no Enter press required.
//
// Re-run this when the cron logs "reason=session-expired" — X's session
// cookies last roughly 30 days.

import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const STATE_PATH = path.join(HERE, '.x-state.json');
const AUTH_COOKIE = 'auth_token';
const POLL_MS = 1000;
const TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function main() {
  console.log('');
  console.log('STEP 1: A Chromium window will open in a moment.');
  console.log('STEP 2: Log into x.com inside THAT window (not in your terminal).');
  console.log('STEP 3: This script auto-detects when login succeeds and saves the');
  console.log('        session. You do NOT need to press Enter or come back here.');
  console.log('');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 },
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();
  await page.goto('https://x.com/login', { waitUntil: 'domcontentloaded' });

  console.log('Polling every 1s for x.com auth_token cookie (timeout 10min)...');
  const start = Date.now();
  while (Date.now() - start < TIMEOUT_MS) {
    const cookies = await context.cookies('https://x.com');
    const authCookie = cookies.find((c) => c.name === AUTH_COOKIE);
    if (authCookie && authCookie.value) {
      console.log(`Detected ${AUTH_COOKIE} cookie. Saving session...`);
      await context.storageState({ path: STATE_PATH });
      await browser.close();
      console.log(`Saved to ${STATE_PATH}`);
      console.log('You can now run:  node discover.mjs');
      return;
    }
    await sleep(POLL_MS);
  }

  await browser.close();
  console.error('');
  console.error('Timed out after 10 minutes without detecting auth_token.');
  console.error('Did you complete the x.com login in the Chromium window?');
  console.error('Re-run when ready.');
  process.exit(1);
}

main().catch((err) => {
  console.error('Setup failed:', err);
  process.exit(1);
});
