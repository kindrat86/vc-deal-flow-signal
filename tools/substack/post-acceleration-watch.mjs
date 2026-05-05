#!/usr/bin/env node
// Renders the weekly Acceleration Watch post to a Substack draft via the
// /api/v1/drafts/<id> PUT endpoint. Builds the TipTap document directly from
// the predictions.json the pSEO site uses to render /predicted/<week>.
//
// PRECONDITIONS:
//   1. Substack publication "The Data Nerd" exists at gitdealflow.substack.com
//      (created 2026-05-03, see memory/feedback_substack_publication_now_live).
//   2. Cookie session for @thedatanerd2026 in the local Comet (or Chrome MCP)
//      browser. Steel datacenter IPs silent-drop on magic-link sign-in.
//   3. CANONICAL signals.gitdealflow.com/predicted/<week> page is live.
//
// USAGE:
//   1. Substack web UI: New post, copy draft ID from URL
//      (/publish/post/<DRAFT_ID>).
//   2. Open browser devtools console on the editor page, paste this script's
//      `runInBrowser()` body. (Or use Chrome MCP javascript_tool.)
//   3. Reload the editor — body renders as formatted TipTap doc.
//
// Sister script to tools/substack/post-top-100.mjs — same injection pattern,
// different data source + structure (predictions.json vs weekly/top-100).

const SLUG = process.argv[2] || '2026-w18';
const SITE = 'https://signals.gitdealflow.com';

console.log(`Acceleration Watch Substack injector for ${SLUG}.`);
console.log('');
console.log('This is a reference script. Execute via:');
console.log('  A) Chrome MCP javascript_tool with the runInBrowser() body below');
console.log('  B) Browser devtools console paste on the Substack editor page');
console.log('');
console.log(`Canonical URL: ${SITE}/predicted/${SLUG}`);
console.log('Data source: page JSON-LD (ItemList) on the canonical URL');
console.log('');
console.log('--- runInBrowser() body (paste in Substack editor devtools) ---');
console.log(`
const slug = '${SLUG}';
const draftId = parseInt(location.pathname.match(/post\\/(\\d+)/)[1]);
${runInBrowser.toString()}
runInBrowser({slug, draftId, site: '${SITE}'});
`);

// eslint-disable-next-line no-unused-vars
async function runInBrowser({ slug, draftId, site }) {
  const canonical = `${site}/predicted/${slug}`;

  // Fetch the rendered /predicted/<slug> page and extract the JSON-LD
  // ItemList — that's the same data the page renders.
  const r = await fetch(canonical);
  if (!r.ok) throw new Error(`canonical page status ${r.status}`);
  const html = await r.text();

  const ldMatch = html.match(
    /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/,
  );
  if (!ldMatch) throw new Error('JSON-LD not found on page');
  const ld = JSON.parse(ldMatch[1]);
  const graph = Array.isArray(ld['@graph']) ? ld['@graph'] : [ld];
  const itemList = graph.find((g) => g['@type'] === 'ItemList');
  if (!itemList) throw new Error('ItemList not found in JSON-LD');
  const picks = itemList.itemListElement;
  const weekName = (itemList.name || '').replace(/^Acceleration Watch — /, '');

  const text = (t, marks) =>
    marks ? { type: 'text', text: t, marks } : { type: 'text', text: t };
  const bold = (t) => text(t, [{ type: 'bold' }]);
  const link = (t, href) =>
    text(t, [{ type: 'link', attrs: { href, target: '_blank' } }]);
  const para = (...content) => ({
    type: 'paragraph',
    attrs: { textAlign: null },
    content: content.length ? content : [],
  });
  const heading = (lvl, t) => ({
    type: 'heading',
    attrs: { level: lvl, textAlign: null },
    content: [{ type: 'text', text: t }],
  });
  const ul = (items) => ({
    type: 'bulletList',
    content: items.map((it) => ({
      type: 'listItem',
      content: [para(...it)],
    })),
  });

  const fmtPick = (p) => [
    bold(`#${p.position} ${p.name}`),
    text(' — '),
    text(p.description || ''),
    text(' '),
    link('GitHub', p.url),
  ];

  const body = {
    type: 'doc',
    content: [
      para(bold(`Acceleration Watch — ${weekName}`)),
      para(
        text(
          '10 named startups whose GitHub engineering acceleration crossed the signal threshold the prior week. Each pick is graded post-hoc against public fundraise / acquisition / IPO news at 60 and 90 days. Methodology: ',
        ),
        link('ssrn.com/abstract=6606558', 'https://ssrn.com/abstract=6606558'),
        text('.'),
      ),
      heading(2, 'This week'),
      ul(picks.map(fmtPick)),
      heading(2, 'How grading works'),
      para(
        text(
          'No edits, no silent removals. The full archive lives at the canonical URL below; outcomes get appended as rows mature past their 60-day window.',
        ),
      ),
      para(link(canonical, canonical)),
      heading(2, 'Subscribe'),
      para(
        text('Free Sunday digest with five named startups every week — '),
        link('gitdealflow.com', 'https://gitdealflow.com/#signup'),
        text('. The 7-Day Deal Flow Reset Challenge teaches the underlying signals — '),
        link('signals.gitdealflow.com/challenge', 'https://signals.gitdealflow.com/challenge'),
        text('.'),
      ),
    ],
  };

  const put = await fetch(`/api/v1/drafts/${draftId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      draft_title: `Acceleration Watch — ${weekName}`,
      draft_subtitle:
        '10 named startups, graded post-hoc against public fundraise news at 60 and 90 days.',
      draft_body: JSON.stringify(body),
      type: 'newsletter',
      audience: 'everyone',
      canonical_url: canonical,
    }),
  });
  if (!put.ok) throw new Error(`PUT draft status ${put.status}`);
  console.log(`Draft ${draftId} updated. Reload the editor to see the body.`);
  return { ok: true, draftId, picks: picks.length };
}
