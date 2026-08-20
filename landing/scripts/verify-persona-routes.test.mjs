import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { PERSONAS, verifyPersonaRoutes } from './verify-persona-routes.mjs';

function validPage(persona) {
  const filler = Array.from({ length: 130 }, (_, i) => `${persona.label} workflow evidence ${i}`).join(' ');
  return `<!doctype html><html lang="en"><head>
    <title>GitDealFlow for ${persona.label}</title>
    <meta name="description" content="Distribution landing page for ${persona.label}.">
    <link rel="canonical" href="https://gitdealflow.com/for/${persona.slug}">
  </head><body>
    <h1>GitDealFlow for ${persona.label}</h1>
    <p>${filler}</p>
    <a href="https://signals.gitdealflow.com/">Get the free weekly digest</a>
  </body></html>`;
}

function makeFixture() {
  const root = mkdtempSync(join(tmpdir(), 'gdf-personas-'));
  const links = [];
  const urls = [];
  for (const persona of PERSONAS) {
    const dir = join(root, 'for', persona.slug);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'index.html'), validPage(persona));
    links.push(`<a href="https://gitdealflow.com/for/${persona.slug}">${persona.label}</a>`);
    urls.push(`<url><loc>https://gitdealflow.com/for/${persona.slug}</loc></url>`);
  }
  writeFileSync(join(root, 'for', 'index.html'), `<!doctype html><html><body>${links.join('')}</body></html>`);
  writeFileSync(join(root, 'sitemap-pages.xml'), `<urlset>${urls.join('')}</urlset>`);
  return root;
}

test('accepts a complete set of substantive persona landing pages', () => {
  const root = makeFixture();
  const result = verifyPersonaRoutes(root);
  assert.equal(result.personaCount, 15);
  assert.equal(result.errors.length, 0);
});

test('fails closed when a persona route disappears', () => {
  const root = makeFixture();
  writeFileSync(join(root, 'for', 'family-offices', 'index.html'), '<!doctype html><title>404 Not Found</title><h1>Page Not Found</h1>');
  const result = verifyPersonaRoutes(root);
  assert.ok(result.errors.some((error) => error.includes('family-offices')));
  assert.ok(result.errors.some((error) => error.includes('substantive')));
});

test('fails when the hub or sitemap drops a persona URL', () => {
  const root = makeFixture();
  const missingUrl = 'https://gitdealflow.com/for/venture-scouts';
  writeFileSync(join(root, 'for', 'index.html'), '<!doctype html><html><body>incomplete hub</body></html>');
  writeFileSync(join(root, 'sitemap-pages.xml'), '<urlset></urlset>');
  const result = verifyPersonaRoutes(root);
  assert.ok(result.errors.some((error) => error.includes(`hub is missing ${missingUrl}`)));
  assert.ok(result.errors.some((error) => error.includes(`sitemap is missing ${missingUrl}`)));
});
