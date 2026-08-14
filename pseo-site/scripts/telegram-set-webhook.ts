/**
 * One-shot Telegram webhook registration.
 *
 * Run this AFTER creating the bot in @BotFather and adding:
 *   TELEGRAM_BOT_TOKEN
 *   TELEGRAM_WEBHOOK_SECRET   (any random 32+ char string)
 * to .env.local (or `vercel env pull`).
 *
 * Usage:
 *   npx tsx pseo-site/scripts/telegram-set-webhook.ts
 *   npx tsx pseo-site/scripts/telegram-set-webhook.ts --url https://signals.gitdealflow.com/api/telegram
 *   npx tsx pseo-site/scripts/telegram-set-webhook.ts --info
 *
 * Idempotent, re-running just overwrites the existing webhook + commands.
 */

import {
  setWebhook,
  setMyCommands,
  getWebhookInfo,
} from "../lib/telegram/api-client";

const DEFAULT_URL = "https://signals.gitdealflow.com/api/telegram";

const COMMANDS = [
  { command: "start", description: "Start the bot and see commands" },
  { command: "help", description: "List all commands" },
  { command: "tools", description: "List the 8 free calculators" },
  { command: "glossary", description: "Browse the 62-term glossary" },
  { command: "define", description: "Define a VC term, e.g. /define safe" },
  {
    command: "safe",
    description: "SAFE calc: /safe <amount> <cap> [discount%] [next_pre] [next_invest]",
  },
  { command: "runway", description: "Runway: /runway <cash> <monthly_burn>" },
  { command: "burn", description: "Burn multiple: /burn <net_burn> <new_arr>" },
  { command: "magic", description: "Magic number: /magic <new_arr_q> <sm_spend>" },
  { command: "cac", description: "CAC payback: /cac <cac> <gm%> <arpa>" },
  { command: "ltv", description: "Customer LTV: /ltv <arpa> <gm%> <churn%>" },
  { command: "quick", description: "Quick ratio: /quick <gained_mrr> <lost_mrr>" },
  { command: "dilution", description: "Open dilution stack calculator" },
];

function arg(name: string): string | undefined {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx < 0) return undefined;
  return process.argv[idx + 1];
}

async function main() {
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.error("✖ TELEGRAM_BOT_TOKEN missing");
    process.exit(1);
  }
  if (process.argv.includes("--info")) {
    const info = await getWebhookInfo();
    console.log(JSON.stringify(info, null, 2));
    return;
  }
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!secret || secret.length < 16) {
    console.error(
      "✖ TELEGRAM_WEBHOOK_SECRET missing or too short (min 16 chars).",
    );
    console.error(
      "  Generate one with: node -e \"console.log(require('crypto').randomBytes(24).toString('hex'))\"",
    );
    process.exit(1);
  }

  const url = arg("url") ?? DEFAULT_URL;
  console.log(`→ Setting webhook → ${url}`);

  const wh = await setWebhook({
    url,
    secret_token: secret,
    allowed_updates: ["message", "inline_query"],
    drop_pending_updates: true,
  });
  console.log("  ", wh);

  console.log("→ Publishing command menu to BotFather");
  const cmd = await setMyCommands(COMMANDS);
  console.log("  ", cmd);

  console.log("✔ Done. Test by DM-ing /start to the bot.");
  console.log("  For inline mode, also enable it in @BotFather → /setinline.");
}

main().catch((e) => {
  console.error("✖", e);
  process.exit(1);
});
