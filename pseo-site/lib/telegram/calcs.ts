/**
 * Telegram bot inline calculators.
 *
 * Pure functions mirroring the math in pseo-site/components/*Calculator.tsx
 * so the bot can compute results inside Telegram without redirecting to web.
 * Every formatter returns a short Markdown-V2-safe string ready for sendMessage.
 *
 * Educational only — not legal/tax/investment advice.
 */

const SITE = "https://signals.gitdealflow.com";

// ── shared formatters ──────────────────────────────────────────────────────

export function formatMoney(n: number): string {
  if (!Number.isFinite(n) || n === 0) return "$0";
  if (Math.abs(n) >= 1_000_000) {
    return `$${(n / 1_000_000).toLocaleString("en-US", { maximumFractionDigits: 2 })}M`;
  }
  if (Math.abs(n) >= 1_000) {
    return `$${(n / 1_000).toLocaleString("en-US", { maximumFractionDigits: 1 })}k`;
  }
  return `$${n.toLocaleString("en-US")}`;
}

export function formatPercent(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "0%";
  if (n < 0.01) return "<0.01%";
  return `${n.toFixed(2)}%`;
}

export function formatRatio(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return "n/a";
  return n.toFixed(digits);
}

function parseN(s: string | undefined, fallback = NaN): number {
  if (!s) return fallback;
  // Accept $5m, 5M, 5,000,000, 50k, 0.2, etc.
  const cleaned = s.replace(/[$,_\s]/g, "").trim();
  const m = cleaned.match(/^(-?[\d.]+)([kKmMbB])?%?$/);
  if (!m) {
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : fallback;
  }
  let n = Number(m[1]);
  if (!Number.isFinite(n)) return fallback;
  const suffix = m[2]?.toLowerCase();
  if (suffix === "k") n *= 1_000;
  else if (suffix === "m") n *= 1_000_000;
  else if (suffix === "b") n *= 1_000_000_000;
  return n;
}

// ── result type ────────────────────────────────────────────────────────────

export interface CalcResult {
  /** Markdown-V2 lines. The dispatcher escapes/wraps before send. */
  body: string;
  /** Deep link to the corresponding /tools/* page with prefilled query. */
  deepLink?: string;
}

interface UsageHelp {
  usage: string;
  example: string;
}

function helpReply(name: string, h: UsageHelp): CalcResult {
  return {
    body: [
      `*${name}*`,
      `Usage: \`${h.usage}\``,
      `Example: \`${h.example}\``,
    ].join("\n"),
  };
}

// ── /safe ──────────────────────────────────────────────────────────────────
// Args: <amount> <cap> [discount_pct] [next_pre] [next_invest]
// Math (post-money SAFE):
//   cap_ownership = amount / cap
//   discount_ownership = amount / (next_post * (1 - discount/100))
//   effective = max(cap, discount)

export function calcSafe(args: string[]): CalcResult {
  if (args.length < 2) {
    return helpReply("SAFE Calculator", {
      usage: "/safe <amount> <cap> [discount%] [next_pre] [next_invest]",
      example: "/safe 50k 5m 20 15m 3m",
    });
  }
  const amount = parseN(args[0]);
  const cap = parseN(args[1]);
  const discountPct = parseN(args[2], 0);
  const nextPre = parseN(args[3], 0);
  const nextInv = parseN(args[4], 0);

  if (!Number.isFinite(amount) || !Number.isFinite(cap) || cap <= 0) {
    return helpReply("SAFE Calculator (invalid input)", {
      usage: "/safe <amount> <cap> [discount%] [next_pre] [next_invest]",
      example: "/safe 50k 5m 20 15m 3m",
    });
  }

  const capOwn = (amount / cap) * 100;
  const nextPost = nextPre + nextInv;
  const discountFrac = Math.min(Math.max(discountPct, 0), 99) / 100;
  const discountVal = nextPost > 0 ? nextPost * (1 - discountFrac) : 0;
  const discountOwn = discountVal > 0 ? (amount / discountVal) * 100 : 0;
  const effective = Math.max(capOwn, discountOwn);
  const basis =
    discountOwn > capOwn
      ? "discount"
      : capOwn > discountOwn
        ? "cap"
        : "tie";

  const dl = new URL(`${SITE}/tools/safe-calculator`);
  dl.searchParams.set("amount", String(amount));
  dl.searchParams.set("cap", String(cap));
  if (discountPct > 0) dl.searchParams.set("discount", String(discountPct));
  if (nextPre > 0) dl.searchParams.set("pre", String(nextPre));
  if (nextInv > 0) dl.searchParams.set("invest", String(nextInv));

  const lines = [
    "*SAFE conversion*",
    `SAFE: ${formatMoney(amount)} @ ${formatMoney(cap)} cap${discountPct ? `, ${discountPct}% discount` : ""}`,
  ];
  if (nextPost > 0) {
    lines.push(`Next round: ${formatMoney(nextPre)} pre + ${formatMoney(nextInv)} = ${formatMoney(nextPost)} post`);
    lines.push("");
    lines.push(`Cap-only ownership: *${formatPercent(capOwn)}*`);
    lines.push(`Discount-only ownership: *${formatPercent(discountOwn)}*`);
    lines.push(`Effective (max): *${formatPercent(effective)}* — converts on *${basis}*`);
  } else {
    lines.push("");
    lines.push(`Cap-only ownership: *${formatPercent(capOwn)}*`);
    lines.push("_(add next-round pre + invest for full conversion math)_");
  }

  return { body: lines.join("\n"), deepLink: dl.toString() };
}

// ── /runway ────────────────────────────────────────────────────────────────
// Args: <cash> <monthly_burn>

export function calcRunway(args: string[]): CalcResult {
  if (args.length < 2) {
    return helpReply("Runway Calculator", {
      usage: "/runway <cash> <monthly_burn>",
      example: "/runway 2m 150k",
    });
  }
  const cash = parseN(args[0]);
  const burn = parseN(args[1]);
  if (!Number.isFinite(cash) || !Number.isFinite(burn) || burn <= 0) {
    return helpReply("Runway Calculator (invalid input)", {
      usage: "/runway <cash> <monthly_burn>",
      example: "/runway 2m 150k",
    });
  }
  const months = cash / burn;
  const zeroDate = new Date();
  zeroDate.setMonth(zeroDate.getMonth() + Math.floor(months));
  const dl = new URL(`${SITE}/tools/runway-calculator`);
  dl.searchParams.set("cash", String(cash));
  dl.searchParams.set("burn", String(burn));

  return {
    body: [
      "*Cash runway*",
      `Cash: ${formatMoney(cash)} / monthly burn: ${formatMoney(burn)}`,
      "",
      `Runway: *${months.toFixed(1)} months*`,
      `Cash-out: *${zeroDate.toISOString().slice(0, 7)}*`,
      months < 6 ? "_⚠ Under 6 months — typical fundraise zone_" : "",
    ]
      .filter(Boolean)
      .join("\n"),
    deepLink: dl.toString(),
  };
}

// ── /burn (burn multiple) ──────────────────────────────────────────────────
// Burn Multiple = Net Burn / Net New ARR

export function calcBurnMultiple(args: string[]): CalcResult {
  if (args.length < 2) {
    return helpReply("Burn Multiple", {
      usage: "/burn <net_burn> <net_new_arr>",
      example: "/burn 500k 1m",
    });
  }
  const burn = parseN(args[0]);
  const newArr = parseN(args[1]);
  if (!Number.isFinite(burn) || !Number.isFinite(newArr) || newArr <= 0) {
    return helpReply("Burn Multiple (invalid input)", {
      usage: "/burn <net_burn> <net_new_arr>",
      example: "/burn 500k 1m",
    });
  }
  const multiple = burn / newArr;
  const grade =
    multiple < 1
      ? "🟢 Amazing (<1)"
      : multiple < 1.5
        ? "🟢 Great (1–1.5)"
        : multiple < 2
          ? "🟡 OK (1.5–2)"
          : multiple < 3
            ? "🟠 Suspect (2–3)"
            : "🔴 Bad (3+)";

  return {
    body: [
      "*Burn Multiple*",
      `Net burn ${formatMoney(burn)} / Net new ARR ${formatMoney(newArr)}`,
      "",
      `Burn multiple: *${formatRatio(multiple)}x*`,
      `Grade: *${grade}*`,
      "_(Sacca / Sammut benchmark — efficiency of capital used to generate ARR)_",
    ].join("\n"),
    deepLink: `${SITE}/tools/burn-multiple-calculator`,
  };
}

// ── /magic (magic number) ──────────────────────────────────────────────────
// Magic Number = (New ARR this quarter × 4) / S&M spend last quarter

export function calcMagicNumber(args: string[]): CalcResult {
  if (args.length < 2) {
    return helpReply("Magic Number", {
      usage: "/magic <new_arr_quarter> <sm_spend_prior_quarter>",
      example: "/magic 250k 500k",
    });
  }
  const newArr = parseN(args[0]);
  const sm = parseN(args[1]);
  if (!Number.isFinite(newArr) || !Number.isFinite(sm) || sm <= 0) {
    return helpReply("Magic Number (invalid input)", {
      usage: "/magic <new_arr_quarter> <sm_spend_prior_quarter>",
      example: "/magic 250k 500k",
    });
  }
  const magic = (newArr * 4) / sm;
  const grade =
    magic >= 1.5
      ? "🟢 Step on the gas (≥1.5)"
      : magic >= 1
        ? "🟢 Spend more (1–1.5)"
        : magic >= 0.75
          ? "🟡 Hold (0.75–1)"
          : magic >= 0.5
            ? "🟠 Investigate (0.5–0.75)"
            : "🔴 Pull back (<0.5)";

  return {
    body: [
      "*Magic Number*",
      `New ARR ${formatMoney(newArr)} (annualized: ${formatMoney(newArr * 4)})`,
      `S&M spend prior quarter: ${formatMoney(sm)}`,
      "",
      `Magic number: *${formatRatio(magic)}*`,
      `Verdict: *${grade}*`,
    ].join("\n"),
    deepLink: `${SITE}/tools/magic-number`,
  };
}

// ── /cac (cac payback) ─────────────────────────────────────────────────────
// CAC Payback (months) = CAC / (ARPA × gross_margin)
// ARPA monthly; gross_margin as percent (e.g. 70 means 0.70)

export function calcCacPayback(args: string[]): CalcResult {
  if (args.length < 3) {
    return helpReply("CAC Payback", {
      usage: "/cac <cac> <gross_margin%> <monthly_arpa>",
      example: "/cac 1500 70 200",
    });
  }
  const cac = parseN(args[0]);
  const gm = parseN(args[1]);
  const arpa = parseN(args[2]);
  if (
    !Number.isFinite(cac) ||
    !Number.isFinite(gm) ||
    !Number.isFinite(arpa) ||
    arpa <= 0 ||
    gm <= 0
  ) {
    return helpReply("CAC Payback (invalid input)", {
      usage: "/cac <cac> <gross_margin%> <monthly_arpa>",
      example: "/cac 1500 70 200",
    });
  }
  const grossMargin = Math.min(Math.max(gm, 0), 100) / 100;
  const months = cac / (arpa * grossMargin);
  const grade =
    months <= 12
      ? "🟢 Healthy (≤12 mo)"
      : months <= 18
        ? "🟡 OK (12–18 mo)"
        : months <= 24
          ? "🟠 Slow (18–24 mo)"
          : "🔴 Long (24+ mo)";

  return {
    body: [
      "*CAC Payback*",
      `CAC ${formatMoney(cac)} · ARPA ${formatMoney(arpa)}/mo · GM ${gm}%`,
      "",
      `Payback: *${months.toFixed(1)} months*`,
      `Grade: *${grade}*`,
    ].join("\n"),
    deepLink: `${SITE}/tools/cac-payback-calculator`,
  };
}

// ── /ltv ───────────────────────────────────────────────────────────────────
// LTV = (ARPA × gross_margin) / monthly_churn

export function calcLtv(args: string[]): CalcResult {
  if (args.length < 3) {
    return helpReply("LTV Calculator", {
      usage: "/ltv <monthly_arpa> <gross_margin%> <monthly_churn%>",
      example: "/ltv 200 70 2",
    });
  }
  const arpa = parseN(args[0]);
  const gm = parseN(args[1]);
  const churn = parseN(args[2]);
  if (
    !Number.isFinite(arpa) ||
    !Number.isFinite(gm) ||
    !Number.isFinite(churn) ||
    churn <= 0 ||
    gm <= 0
  ) {
    return helpReply("LTV Calculator (invalid input)", {
      usage: "/ltv <monthly_arpa> <gross_margin%> <monthly_churn%>",
      example: "/ltv 200 70 2",
    });
  }
  const grossMargin = Math.min(Math.max(gm, 0), 100) / 100;
  const churnFrac = Math.min(Math.max(churn, 0.01), 100) / 100;
  const ltv = (arpa * grossMargin) / churnFrac;

  return {
    body: [
      "*Customer LTV*",
      `ARPA ${formatMoney(arpa)}/mo · GM ${gm}% · Churn ${churn}%/mo`,
      "",
      `LTV: *${formatMoney(ltv)}*`,
      "_(Pair with CAC for LTV:CAC ratio — healthy SaaS ≥3x)_",
    ].join("\n"),
    deepLink: `${SITE}/tools/ltv-calculator`,
  };
}

// ── /quick (quick ratio) ───────────────────────────────────────────────────
// Quick Ratio = New + Expansion MRR / Churned + Contraction MRR

export function calcQuickRatio(args: string[]): CalcResult {
  if (args.length < 2) {
    return helpReply("Quick Ratio", {
      usage: "/quick <new+expansion_mrr> <churned+contraction_mrr>",
      example: "/quick 100k 25k",
    });
  }
  const grew = parseN(args[0]);
  const lost = parseN(args[1]);
  if (!Number.isFinite(grew) || !Number.isFinite(lost) || lost <= 0) {
    return helpReply("Quick Ratio (invalid input)", {
      usage: "/quick <new+expansion_mrr> <churned+contraction_mrr>",
      example: "/quick 100k 25k",
    });
  }
  const ratio = grew / lost;
  const grade =
    ratio >= 4
      ? "🟢 Excellent (≥4)"
      : ratio >= 2
        ? "🟢 Healthy (2–4)"
        : ratio >= 1
          ? "🟡 Growing slowly (1–2)"
          : "🔴 Shrinking (<1)";

  return {
    body: [
      "*Quick Ratio*",
      `Gained ${formatMoney(grew)} · Lost ${formatMoney(lost)}`,
      "",
      `Quick ratio: *${formatRatio(ratio)}x*`,
      `Grade: *${grade}*`,
    ].join("\n"),
    deepLink: `${SITE}/tools/quick-ratio-calculator`,
  };
}

// ── /dilution (deep-link only — too many args for chat) ────────────────────

export function calcDilutionStack(): CalcResult {
  return {
    body: [
      "*Dilution Stack*",
      "Multi-SAFE + Series A stacks have too many inputs for chat.",
      "Open the full calculator in the browser:",
    ].join("\n"),
    deepLink: `${SITE}/tools/dilution-stack`,
  };
}

// ── /tools list ────────────────────────────────────────────────────────────

export const TOOLS_INDEX = [
  { cmd: "/safe", name: "SAFE Calculator", url: `${SITE}/tools/safe-calculator` },
  { cmd: "/runway", name: "Runway", url: `${SITE}/tools/runway-calculator` },
  { cmd: "/burn", name: "Burn Multiple", url: `${SITE}/tools/burn-multiple-calculator` },
  { cmd: "/magic", name: "Magic Number", url: `${SITE}/tools/magic-number` },
  { cmd: "/cac", name: "CAC Payback", url: `${SITE}/tools/cac-payback-calculator` },
  { cmd: "/ltv", name: "Customer LTV", url: `${SITE}/tools/ltv-calculator` },
  { cmd: "/quick", name: "Quick Ratio", url: `${SITE}/tools/quick-ratio-calculator` },
  { cmd: "/dilution", name: "Dilution Stack", url: `${SITE}/tools/dilution-stack` },
] as const;
