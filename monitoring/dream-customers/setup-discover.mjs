#!/usr/bin/env node
// One-time setup: open a real (headed) browser, you log into x.com once,
// the script saves storage state (cookies + localStorage) so the daily
// discovery cron can reuse the session headlessly without a password,
// without API keys, and without holding open your main Chrome.
//
// Re-run this when the cron starts failing with "re-run setup" — X's
// session cookies last roughly 30 days.

import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const STATE_PATH = path.join(HERE, '.x-state.json');

function waitForEnter(prompt) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(prompt, () => { rl.close(); resolve(); });
  });
}

async function main() {
  console.log('Opening a clean Chromium window. Log into x.com / @TheDataNerd');
  console.log('there. When the home timeline loads, come back here and press Enter.');
  console.log('');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 },
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();
  await page.goto('https://x.com/login', { waitUntil: 'domcontentloaded' });

  await waitForEnter('Press Enter once you see your x.com home timeline... ');

  // Quick sanity: are we logged in? Cheapest check: presence of a SideNav link to /home.
  const sideNavHome = await page.locator('a[href="/home"][aria-label*="Home"]').first().count();
  if (sideNavHome === 0) {
    console.warn('Heads-up: home side-nav link not detected — session may not be saved correctly.');
    console.warn('Continuing anyway. If the cron fails with "re-run setup", come back here.');
  }

  await context.storageState({ path: STATE_PATH });
  await browser.close();

  console.log('');
  console.log(`Saved session to ${STATE_PATH}`);
  console.log('You can now run:  node discover.mjs   (or trigger the cron)');
}

main().catch((err) => {
  console.error('Setup failed:', err);
  process.exit(1);
});
