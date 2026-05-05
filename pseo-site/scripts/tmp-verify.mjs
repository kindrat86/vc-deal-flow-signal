const urls = [
  'https://signals.gitdealflow.com/sitemap.xml',
  'https://signals.gitdealflow.com/sitemap/core.xml',
  'https://signals.gitdealflow.com/sitemap/sectors.xml',
  'https://signals.gitdealflow.com/sitemap/crossings.xml',
  'https://signals.gitdealflow.com/sitemap/startups.xml',
  'https://signals.gitdealflow.com/sitemap/content.xml',
  'https://signals.gitdealflow.com/news-sitemap.xml',
  'https://signals.gitdealflow.com/stage/seed/signal/hiring-burst',
  'https://signals.gitdealflow.com/stage/seed/edtech',
  'https://signals.gitdealflow.com/jsonld/stage/seed',
  'https://signals.gitdealflow.com/startups-to-watch/ai-ml-q2-2026/feed.xml',
];
(async () => {
  for (const u of urls) {
    try {
      const r = await fetch(u);
      const ct = r.headers.get('content-type') || '';
      const text = await r.text();
      const locs = (text.match(/<loc>/g) || []).length;
      console.log(r.status, ct.slice(0,40), 'locs=' + locs, u);
    } catch (e) {
      console.log('ERR', u, e.message);
    }
  }
  const r = await fetch('https://signals.gitdealflow.com/stage/seed');
  console.log('link:', r.headers.get('link'));
  console.log('x-robots-tag:', r.headers.get('x-robots-tag'));
})();
