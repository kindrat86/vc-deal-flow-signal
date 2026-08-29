#!/usr/bin/env node
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const resultPages = [
  ['tools/runway-calculator.html', 'runway-calculator', 'results', 'class="card faq"', 'calculate', 'document.getElementById("results").classList.add("show")'],
  ['tools/burn-rate-analyzer.html', 'burn-rate-analyzer', 'results', 'class="card faq"', 'analyze', 'document.getElementById("results").classList.add("show")'],
  ['tools/deal-flow-funnel.html', 'deal-flow-funnel', 'results', 'class="card faq"', 'calculate', 'document.getElementById("results").classList.add("show")'],
  ['tools/investment-calculator/index.html', 'investment-calculator', 'result-card', 'class="powered-by"', 'calculate', "document.getElementById('result-card').classList.add('show')"],
];
const shared = [
  'id="gdf-tool-capture"',
  'id="gdf-tool-capture-form"',
  'https://signals.gitdealflow.com/api/subscribe',
  'utm_campaign',
  'new MutationObserver',
  'Check your inbox to confirm',
  'documented examples show the pattern 21 to 47 days before public fundraise announcements',
];
for (const [rel, source, resultId, afterResultAnchor, actionName, showNeedle] of resultPages) {
  const html = readFileSync(join(root, rel), 'utf8');
  const needles = [
    ...shared,
    `source:'${source}'`,
    `getElementById('${resultId}').classList.contains('show')`,
  ];
  const missing = needles.filter((n) => !html.includes(n));
  if (missing.length) {
    console.error(`[verify-tool-capture] ${rel} missing: ${missing.join(', ')}`);
    process.exit(1);
  }
  const result = html.indexOf(`id="${resultId}"`);
  const box = html.indexOf('id="gdf-tool-capture"');
  const after = html.indexOf(afterResultAnchor);
  if (result === -1 || box === -1 || after === -1 || !(result < box && box < after)) {
    console.error(`[verify-tool-capture] ${rel} capture must sit after its result and before the next section`);
    process.exit(1);
  }
  const action = html.indexOf(`function ${actionName}(`);
  const show = html.indexOf(showNeedle, action);
  const earlyObjectReturn = html.indexOf('\n  return {', action);
  if (action === -1 || show === -1 || (earlyObjectReturn !== -1 && earlyObjectReturn < show)) {
    console.error(`[verify-tool-capture] ${rel} result action must render and show ${resultId} before returning`);
    process.exit(1);
  }
}

// These routes carry calculator-shaped names but are currently static guides,
// not functioning calculators. Assert that they stay result-less so a future
// implementation cannot launch without joining the capture guard above.
const staticGuides = [
  'tools/cac-ltv-calculator.html',
  'tools/cap-table-simulator.html',
  'tools/churn-rate-calculator.html',
  'tools/growth-rate-calculator.html',
  'tools/startup-valuation-calculator.html',
];
for (const rel of staticGuides) {
  const html = readFileSync(join(root, rel), 'utf8');
  if (/function\s+calculate\s*\(|onclick=["']calculate\s*\(/.test(html)) {
    console.error(`[verify-tool-capture] ${rel} gained a result flow; add it to resultPages and inject capture`);
    process.exit(1);
  }
}

const existingCapturePages = [
  ['free/github-momentum-checker.html', 'id="gdf-capture"', "source:'momentum-checker'"],
  ['free/free-momentum-score-calculator.html', 'id="gdf-capture-form"', "source:'momentum-score-calculator'"],
];
for (const [rel, ...needles] of existingCapturePages) {
  const html = readFileSync(join(root, rel), 'utf8');
  for (const needle of [...needles, 'https://signals.gitdealflow.com/api/subscribe']) {
    if (!html.includes(needle)) {
      console.error(`[verify-tool-capture] ${rel} missing: ${needle}`);
      process.exit(1);
    }
  }
}

console.log(`[verify-tool-capture] OK: ${resultPages.length} result calculators + 2 momentum tools guarded; ${staticGuides.length} static guides classified`);
