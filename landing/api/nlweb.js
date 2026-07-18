// NLWeb endpoint for GitDealFlow
const content = [
  {"@type": "Question", "name": "What is GitDealFlow?", "acceptedAnswer": "Track startup engineering acceleration from public GitHub data. Discover high-momentum startups before they announce funding.", "url": "https://gitdealflow.com/"},
  {"@type": "Question", "name": "How does engineering momentum work?", "acceptedAnswer": "We analyze GitHub commit velocity, star growth, and contributor trends over 90-day windows.", "url": "https://gitdealflow.com/"},
  {"@type": "Question", "name": "What sectors are tracked?", "acceptedAnswer": "AI, fintech, devtools, infrastructure, and more — across European and US startup hubs.", "url": "https://gitdealflow.com/"}
];
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  const query = req.method === 'POST' ? (req.body?.query || '').toLowerCase() : (req.query.query || '').toLowerCase();
  const matches = query ? content.filter(c => c.name.toLowerCase().includes(query) || c.acceptedAnswer.toLowerCase().includes(query)) : content;
  return res.json({
    '@context': 'https://schema.org', '@type': 'ItemList',
    'name': 'GitDealFlow Knowledge Base', 'description': 'Track startup engineering acceleration from public GitHub data. Discover high-momentum startups before they announce funding.',
    'numberOfItems': matches.length, 'itemListElement': matches
  });
}
