// A2A endpoint for GitDealFlow
const agentCard = {
  "protocolVersion": "0.3.0",
  "name": "GitDealFlow Agent",
  "description": "Track startup engineering acceleration from public GitHub data. Discover high-momentum startups before they announce funding.",
  "url": "https://gitdealflow.com/api/a2a",
  "preferredTransport": "JSONRPC",
  "version": "1.0.0",
  "capabilities": {"streaming": false, "pushNotifications": false, "stateTransitionHistory": false},
  "defaultInputModes": ["text/plain", "application/json"],
  "defaultOutputModes": ["text/plain", "application/json"],
  "skills": [
    {"id": "search_startups", "name": "Search Startups", "description": "Search tracked startups by sector, city, or momentum signal.", "tags": ["startups", "vc", "deal-flow", "github"], "examples": ["Show me AI startups in London", "What startups have high engineering momentum?"]},
    {"id": "get_deal_signal", "name": "Get Deal Signal", "description": "Get engineering momentum data for a specific startup.", "tags": ["vc", "due-diligence", "momentum"], "examples": ["What's the signal for Stripe?", "Show me startup momentum in fintech"]}
  ]
};

const faqs = [
  {"q": "What is GitDealFlow?", "a": "GitDealFlow tracks startup engineering acceleration from public GitHub data to help investors discover high-momentum companies before funding announcements."},
  {"q": "How does engineering momentum signal work?", "a": "We analyze commit velocity, star growth, and contributor trends over 90-day windows to identify startups with accelerating development activity."},
  {"q": "What cities and sectors are tracked?", "a": "Startups across AI, fintech, devtools, and more — in cities including London, Berlin, Amsterdam, Paris, Austin, and San Francisco."}
];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method === 'GET') return res.json(agentCard);
  if (req.method === 'POST') {
    const { jsonrpc, method, params, id } = req.body || {};
    if (method === 'rpc.discover' || method === 'agent/card') {
      return res.json({ jsonrpc: '2.0', id, result: agentCard });
    }
    if (method === 'faq.search') {
      const query = (params?.query || '').toLowerCase();
      const matches = faqs.filter(f => f.q.toLowerCase().includes(query) || f.a.toLowerCase().includes(query));
      return res.json({ jsonrpc: '2.0', id, result: { faqs: matches } });
    }
    return res.json({ jsonrpc: '2.0', id, result: { agent: agentCard.name, skills: agentCard.skills, faqs: faqs.length } });
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
