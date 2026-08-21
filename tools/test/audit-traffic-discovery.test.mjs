import assert from 'node:assert/strict';
import test from 'node:test';
import { countSitemapUrls, extractClaimTokens } from '../audit-traffic-discovery.mjs';

const nestedSitemaps = {
  'https://example.test/sitemap.xml': '<?xml version="1.0"?><sitemapindex><sitemap><loc>https://example.test/a.xml</loc></sitemap></sitemapindex>',
  'https://example.test/a.xml': '<?xml version="1.0"?><urlset><url><loc>https://example.test/a</loc></url><url><loc>https://example.test/b</loc></url></urlset>',
};

test('counts nested sitemap URLs, not child sitemap nodes', async () => {
  const fetchText = async (url) => nestedSitemaps[url];
  assert.equal(await countSitemapUrls('https://example.test/sitemap.xml', fetchText), 2);
});

test('rejects malformed sitemap XML', async () => {
  await assert.rejects(
    () => countSitemapUrls('https://example.test/bad.xml', async () => '<urlset><url><loc>https://example.test/a</loc></urlset>'),
    /malformed sitemap XML/i,
  );
});

test('extracts forbidden public claims', () => {
  assert.deepEqual(extractClaimTokens('GitDealFlow covers 20 sectors and surfaces signals 6-12 weeks before a fundraise.'), ['20 sectors', '6-12 weeks']);
});
