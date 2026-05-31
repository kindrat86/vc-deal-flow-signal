export type Dream100Status =
  | "engage"
  | "watch"
  | "hold"
  | "read"
  | "blocked";

export interface Dream100Voice {
  name: string;
  what: string;
  href?: string;
  status: Dream100Status;
  note?: string;
}

export interface Dream100Group {
  id: string;
  label: string;
  intro: string;
  items: Dream100Voice[];
}

export const STATUS_META: Record<
  Dream100Status,
  { short: string; long: string; tone: string }
> = {
  engage: {
    short: "Engage",
    long: "Active engagement layer — we comment, post, or integrate.",
    tone: "emerald",
  },
  watch: {
    short: "Watch",
    long: "Monitoring only — we read the signal, don't post.",
    tone: "sky",
  },
  hold: {
    short: "Hold",
    long: "Engagement paused. Listed for transparency.",
    tone: "amber",
  },
  read: {
    short: "Read",
    long: "Read-only consumption. No engagement layer (or we choose not to).",
    tone: "slate",
  },
  blocked: {
    short: "Blocked",
    long: "Cannot engage — platform constraint, anonymity rule, or policy.",
    tone: "rose",
  },
};

export const DREAM_100_GROUPS: Dream100Group[] = [
  {
    id: "substacks",
    label: "10 substacks we read",
    intro:
      "Long-form business writing the corp-dev, PE-operating-partner, and non-engineer tech-VP buyer reads to decide who's worth a meeting. Most are paywalled or comment-light — we consume, we don't dominate.",
    items: [
      {
        name: "Stratechery",
        what: "Ben Thompson's strategy, aggregation theory, platform dynamics. The canonical tech-into-business translator.",
        href: "https://stratechery.com",
        status: "read",
      },
      {
        name: "Not Boring",
        what: "Packy McCormick's capital narratives. The why-now of category creation, told as story for operator readers.",
        href: "https://www.notboring.co",
        status: "read",
      },
      {
        name: "The Diff",
        what: "Byrne Hobart on finance × tech for sophisticated allocators. Deal-relevant analysis.",
        href: "https://www.thediff.co",
        status: "read",
      },
      {
        name: "The Generalist",
        what: "Mario Gabriele's deep dives on the funds, founders, and frameworks shaping the next cycle.",
        href: "https://www.generalist.com",
        status: "read",
      },
      {
        name: "Growth Unhinged",
        what: "Kyle Poyar's GTM / PLG benchmarks for operators — is this real traction or hype?",
        href: "https://www.growthunhinged.com",
        status: "read",
      },
      {
        name: "Clouded Judgement",
        what: "Jamin Ball's public-SaaS metrics. The corp-dev / PE comps bible.",
        href: "https://cloudedjudgement.substack.com",
        status: "read",
      },
      {
        name: "Bits about Money",
        what: "Patrick McKenzie on how financial systems actually work — read it before any fintech thesis.",
        href: "https://www.bitsaboutmoney.com",
        status: "read",
      },
      {
        name: "Net Interest",
        what: "Marc Rubinstein's weekly on financials and markets for sophisticated investors.",
        href: "https://www.netinterest.co",
        status: "read",
      },
      {
        name: "Every",
        what: "Dan Shipper's AI-for-operators writing through a business lens.",
        href: "https://every.to",
        status: "read",
      },
      {
        name: "Platformer",
        what: "Casey Newton's reporting on the platforms and policy moves that reshape tech businesses.",
        href: "https://www.platformer.news",
        status: "read",
      },
    ],
  },
  {
    id: "podcasts",
    label: "10 podcasts we listen to",
    intro:
      "We don't run a podcast (anonymity rule). These are the conversations corp-dev, PE, and allocator buyers play in the car. Listen-only — no audio guesting, no founder voice on tape.",
    items: [
      {
        name: "Acquired",
        what: "Three-hour deep dives on the companies and deals that built the modern market.",
        status: "read",
      },
      {
        name: "Invest Like the Best",
        what: "Patrick O'Shaughnessy's investor roster. Where mental models compound.",
        status: "read",
      },
      {
        name: "Business Breakdowns",
        what: "Single-company business analyses — how a company actually makes money.",
        status: "read",
      },
      {
        name: "20VC",
        what: "Harry Stebbings on the operators and allocators behind the cap tables.",
        status: "read",
      },
      {
        name: "The Logan Bartlett Show",
        what: "Sharp questions, candid answers from operators and allocators.",
        status: "watch",
      },
      {
        name: "BG2 Pod",
        what: "Brad Gerstner + Bill Gurley on the macro narrative behind the next decade.",
        status: "read",
      },
      {
        name: "All-In",
        what: "Markets, deals, and business takes to a huge operator / investor audience.",
        status: "read",
      },
      {
        name: "Capital Allocators",
        what: "Ted Seides on how the people who allocate capital actually think.",
        status: "read",
      },
      {
        name: "Lenny's Podcast",
        what: "Product, growth, and business to the operators who buy.",
        status: "watch",
      },
      {
        name: "The Twenty Minute VC",
        what: "Short-form deal and operator commentary — the audio companion to 20VC.",
        status: "read",
      },
    ],
  },
  {
    id: "newsletters",
    label: "10 newsletters we filter through",
    intro:
      "High-density deal and market newsletters. Where new raises, mergers, and acquisitions surface for the buyer before they hit the wider press cycle.",
    items: [
      {
        name: "Axios Pro Rata",
        what: "Dan Primack's M&A and deals desk. The newsletter corp-dev and PE read first.",
        href: "https://www.axios.com/newsletters/axios-pro-rata",
        status: "read",
      },
      {
        name: "Newcomer",
        what: "Eric Newcomer's VC and deals insider reporting.",
        href: "https://www.newcomer.co",
        status: "read",
      },
      {
        name: "StrictlyVC",
        what: "Daily VC and deals digest for the funding community.",
        href: "https://www.strictlyvc.com",
        status: "read",
      },
      {
        name: "Fortune Term Sheet",
        what: "Fortune's daily M&A and deals briefing.",
        href: "https://fortune.com/newsletter/termsheet/",
        status: "read",
      },
      {
        name: "The Information",
        what: "Premium deal and tech-business reporting for corp-dev and PE readers.",
        href: "https://www.theinformation.com",
        status: "read",
      },
      {
        name: "Puck",
        what: "Insider money-and-power reporting on the people behind the deals.",
        href: "https://puck.news",
        status: "read",
      },
      {
        name: "Exit Five",
        what: "Dave Gerhardt's B2B operator and marketing-leader newsletter.",
        href: "https://www.exitfive.com",
        status: "watch",
      },
      {
        name: "CB Insights newsletter",
        what: "Market maps and deal-data briefings for corp-dev and strategy teams.",
        href: "https://www.cbinsights.com/newsletter",
        status: "watch",
      },
      {
        name: "Crunchbase Daily",
        what: "Daily funding and company-data digest.",
        href: "https://news.crunchbase.com",
        status: "read",
      },
      {
        name: "PitchBook News",
        what: "PE / VC deal-data reporting, corp-dev-native.",
        href: "https://pitchbook.com/news",
        status: "read",
      },
    ],
  },
  {
    id: "github-orgs",
    label: "10 market-map & research desks we cross-read",
    intro:
      "The deal-data and category-analyst desks the buyer uses to build a shortlist of who's worth a meeting. We'd pitch the data desks a complementary, translated signal; we read the analysts.",
    items: [
      {
        name: "CB Insights",
        what: "Market maps and deal data for corp-dev. We'd propose a complementary, business-framed acceleration chart.",
        href: "https://www.cbinsights.com",
        status: "engage",
      },
      {
        name: "PitchBook",
        what: "PE / VC deal data, corp-dev-native. We'd offer an angle they don't cover.",
        href: "https://pitchbook.com",
        status: "engage",
      },
      {
        name: "Sacra",
        what: "Private-company research written for buyers. A natural translated-data partner.",
        href: "https://sacra.com",
        status: "engage",
      },
      {
        name: "Public Comps",
        what: "SaaS comps for PE and corp-dev. We'd pair acceleration signal with their comps.",
        href: "https://publiccomps.com",
        status: "watch",
      },
      {
        name: "Meritech",
        what: "SaaS comps data, widely used by the buyer. Complementary-data target.",
        href: "https://www.meritechcapital.com",
        status: "watch",
      },
      {
        name: "Dealroom",
        what: "Market intelligence for buyers. Data-angle pitch.",
        href: "https://dealroom.co",
        status: "watch",
      },
      {
        name: "Contrary Research",
        what: "Private-company memos. A translated-signal source we'd contribute to.",
        href: "https://research.contrary.com",
        status: "watch",
      },
      {
        name: "Gartner",
        what: "Category analysts with a 'worth a meeting' lens for enterprise buyers. We read.",
        href: "https://www.gartner.com",
        status: "read",
      },
      {
        name: "Forrester",
        what: "Enterprise category analysis. We read the Waves, we don't pitch.",
        href: "https://www.forrester.com",
        status: "read",
      },
      {
        name: "Tracxn",
        what: "Private-market deal data. Complementary-signal target.",
        href: "https://tracxn.com",
        status: "watch",
      },
    ],
  },
  {
    id: "conferences",
    label: "10 conferences whose attendee lists we read",
    intro:
      "Where the corp-dev, PE, and operator crowd shows up offline. We don't speak (anonymity) — we read attendee lists and confirm momentum against who's in the room.",
    items: [
      {
        name: "SaaStr Annual",
        what: "The SaaS-exec watering hole. Where the operators who buy congregate.",
        status: "read",
      },
      {
        name: "Slush",
        what: "European founder / investor / operator gathering. Deal-adjacent attendee list.",
        status: "read",
      },
      {
        name: "Web Summit",
        what: "Broad tech-business audience — execs, investors, corp-dev.",
        status: "read",
      },
      {
        name: "Money20/20",
        what: "Fintech and payments dealmaking. Corp-dev and PE concentration.",
        status: "read",
      },
      {
        name: "Upfront Summit",
        what: "Invite-only LP / GP / operator gathering. The allocator attendee list is gold.",
        status: "watch",
      },
      {
        name: "ACG (Association for Corporate Growth)",
        what: "M&A and corporate-growth professionals — Marcus's literal trade body.",
        status: "watch",
      },
      {
        name: "Bessemer Cloud events",
        what: "Where the State of the Cloud benchmark crowd convenes.",
        status: "read",
      },
      {
        name: "Gartner Symposium",
        what: "Enterprise IT and strategy buyers. Category-analyst attendee base.",
        status: "read",
      },
      {
        name: "Forrester events",
        what: "Enterprise analyst and buyer gatherings.",
        status: "read",
      },
      {
        name: "NACD",
        what: "National Association of Corporate Directors — board and governance audience.",
        status: "read",
      },
    ],
  },
  {
    id: "books",
    label: "10 books that shaped how we read companies",
    intro:
      "The mental models behind the methodology — how operators, allocators, and acquirers read a company. None are about reading code; all are about reading a business.",
    items: [
      {
        name: "The Outsiders — William Thorndike",
        what: "Eight unconventional CEOs and the capital-allocation discipline that made them.",
        status: "read",
      },
      {
        name: "7 Powers — Hamilton Helmer",
        what: "The seven sources of durable competitive advantage. A buyer's moat checklist.",
        status: "read",
      },
      {
        name: "Competition Demystified — Bruce Greenwald",
        what: "Barriers to entry as the core of strategy. How to value a moat.",
        status: "read",
      },
      {
        name: "Expectations Investing — Michael Mauboussin",
        what: "Reading the expectations baked into price. Valuation as a corp-dev / PE lens.",
        status: "read",
      },
      {
        name: "Zero to One — Peter Thiel",
        what: "Why the next great company is found in monopoly, not competition.",
        status: "read",
      },
      {
        name: "The Cold Start Problem — Andrew Chen",
        what: "How network-effect businesses actually reach escape velocity.",
        status: "read",
      },
      {
        name: "Working Backwards — Colin Bryar & Bill Carr",
        what: "Amazon's operating playbook — how a disciplined operator scales.",
        status: "read",
      },
      {
        name: "High Growth Handbook — Elad Gil",
        what: "Operator / board business framing for scaling companies.",
        status: "read",
      },
      {
        name: "Venture Deals — Brad Feld & Jason Mendelson",
        what: "How venture financings actually work — the mechanics behind the cap table.",
        status: "read",
      },
      {
        name: "Super Founders — Ali Tamaseb",
        what: "Data-driven myth-busting on what actually predicts a billion-dollar company.",
        status: "read",
      },
    ],
  },
  {
    id: "frameworks",
    label: "10 PE / M&A / holdco operators we track",
    intro:
      "The buyers, operators, and capital allocators in Marcus's professional neighborhood. We read how they decide what's worth acquiring; we don't co-invest.",
    items: [
      {
        name: "Tiny (Andrew Wilkinson)",
        what: "Acquisitions and holdco with a corp-dev mindset — who's worth acquiring.",
        href: "https://www.tiny.com",
        status: "watch",
      },
      {
        name: "FJ Labs (Fabrice Grinda)",
        what: "Marketplace dealmaking and M&A at volume.",
        href: "https://www.fjlabs.com",
        status: "watch",
      },
      {
        name: "Altimeter (Brad Gerstner)",
        what: "Growth and public-markets capital — corp-dev-relevant theses.",
        href: "https://www.altimeter.com",
        status: "watch",
      },
      {
        name: "Colossus (Patrick O'Shaughnessy)",
        what: "Media and research network for sophisticated investor / PE audiences.",
        href: "https://www.joincolossus.com",
        status: "read",
      },
      {
        name: "8VC (Joe Lonsdale)",
        what: "Enterprise and PE-adjacent investing and company-building.",
        href: "https://www.8vc.com",
        status: "watch",
      },
      {
        name: "The Sweaty Startup (Nick Huber)",
        what: "Small-business acquisitions and operating to a large practitioner audience.",
        status: "watch",
      },
      {
        name: "Constellation Software",
        what: "The serial-acquirer playbook studied across PE and corp-dev.",
        href: "https://www.csisoftware.com",
        status: "read",
      },
      {
        name: "Thoma Bravo",
        what: "Software-focused private equity. A reference buyer in our category.",
        href: "https://www.thomabravo.com",
        status: "read",
      },
      {
        name: "Vista Equity Partners",
        what: "Enterprise-software private equity with a deep operating motion.",
        href: "https://www.vistaequitypartners.com",
        status: "read",
      },
      {
        name: "Permira",
        what: "Global private equity active in tech and software buyouts.",
        href: "https://www.permira.com",
        status: "read",
      },
    ],
  },
  {
    id: "communities",
    label: "10 communities where the conversation lives",
    intro:
      "Where operators, allocators, and acquirers actually talk. We listen and contribute in business language; we don't dominate. Target conversations, not people.",
    items: [
      {
        name: "SaaStr community",
        what: "The SaaS-exec watering hole. Operators who buy congregate here.",
        status: "watch",
      },
      {
        name: "Pavilion",
        what: "Revenue-leader community — CROs and GTM execs across thousands of companies.",
        status: "watch",
      },
      {
        name: "Chief",
        what: "Senior-executive women's network. Board- and operator-level conversation.",
        status: "watch",
      },
      {
        name: "On Deck",
        what: "Founder, operator, and angel community. Deal-adjacent peer network.",
        status: "watch",
      },
      {
        name: "Reforge",
        what: "Growth and product strategy programs for operators who buy tools.",
        status: "read",
      },
      {
        name: "r/PrivateEquity",
        what: "PE practitioner forum. We read; engagement is limited and product-shy here.",
        status: "watch",
        note:
          "Read-leaning — practitioner forum is wary of vendor self-promotion; contribute only in plain business language.",
      },
      {
        name: "Exit Five community",
        what: "Dave Gerhardt's B2B marketing-and-operator community.",
        status: "watch",
      },
      {
        name: "ACG chapters",
        what: "Association for Corporate Growth local chapters — M&A and corp-dev pros offline + online.",
        status: "read",
      },
      {
        name: "GP / LP Slack groups",
        what: "Private allocator-side conversation. Invite-only; we listen where we have access.",
        status: "watch",
        note:
          "Closed groups — read-only where invited; no product broadcasting (anonymity + norms).",
      },
      {
        name: "Carta Equity community",
        what: "Cap-table and equity-data conversation around Carta's research.",
        status: "read",
      },
    ],
  },
  {
    id: "linkedin-pages",
    label: "10 LinkedIn Company Pages on our weekly cadence",
    intro:
      "LinkedIn rule: a Company Page can only reply on other Company Pages' posts. So our layer here is the data desks and firms the buyer follows — not individuals. Cadence: 2× / week, 4-comment ceiling, manual posting only.",
    items: [
      {
        name: "Insight Partners",
        what: "Software-growth investor. ScaleUp / portfolio benchmark posts pull a corp-dev and PE-operator audience.",
        href: "https://www.linkedin.com/company/insight-partners/",
        status: "watch",
      },
      {
        name: "Index Ventures",
        what: "Global software / fintech investor. Page posts on category trends draw the buyer's feed.",
        href: "https://www.linkedin.com/company/index-ventures/",
        status: "watch",
      },
      {
        name: "Carta",
        what: "Cap-table data — Peter Walker's team posts the strongest startup-data threads on LinkedIn.",
        href: "https://www.linkedin.com/company/carta--inc-/",
        status: "read",
      },
      {
        name: "First Round Capital",
        what: "Seed investor and First Round Review publisher. Operator-grade posts the buyer reads.",
        href: "https://www.linkedin.com/company/first-round-capital/",
        status: "watch",
      },
      {
        name: "Bessemer Venture Partners",
        what: "State of the Cloud publisher. Benchmark reports drive cross-platform threads.",
        href: "https://www.linkedin.com/company/bessemer-venture-partners/",
        status: "read",
      },
      {
        name: "Andreessen Horowitz (a16z)",
        what: "Enterprise / business research reach. Page-level posts pull operator attention.",
        href: "https://www.linkedin.com/company/a16z/",
        status: "read",
      },
      {
        name: "Battery Ventures",
        what: "OpenCloud benchmark publisher. Enterprise-buyer audience.",
        href: "https://www.linkedin.com/company/battery-ventures/",
        status: "read",
      },
      {
        name: "ICONIQ Growth",
        what: "GTM / SaaS benchmarks for PE and corp-dev. High topic-fit.",
        href: "https://www.linkedin.com/company/iconiq-capital/",
        status: "watch",
      },
      {
        name: "SaaStr",
        what: "The SaaS-exec content engine. Demo / benchmark posts drive operator threads.",
        href: "https://www.linkedin.com/company/saastr/",
        status: "read",
      },
      {
        name: "Crunchbase",
        what: "Funding-data publishing arm. Pages here post the same trends we'd cite.",
        href: "https://www.linkedin.com/company/crunchbase/",
        status: "read",
      },
    ],
  },
  {
    id: "datasets",
    label: "10 public datasets we cross-reference",
    intro:
      "Where we triangulate the signal and translate it into business language. Every public dataset is a reproducibility check on the next 'worth a meeting' call.",
    items: [
      {
        name: "Crunchbase data",
        what: "Funding-event ground truth. The labels on our predictions.",
        status: "read",
      },
      {
        name: "PitchBook data",
        what: "PE / VC deal cadence by stage. A sanity check, never the sole source.",
        status: "read",
      },
      {
        name: "SEC EDGAR",
        what: "Public-company filings. Earnings and disclosure ground truth.",
        status: "read",
      },
      {
        name: "Carta benchmarks",
        what: "Cap-table and comp benchmarks. Business-framed startup-data baseline.",
        status: "read",
      },
      {
        name: "Bessemer State of the Cloud",
        what: "The cloud-business benchmark the buyer already trusts.",
        status: "read",
      },
      {
        name: "Meritech comps",
        what: "SaaS comps data widely used in corp-dev and PE valuation.",
        status: "read",
      },
      {
        name: "Public Comps dataset",
        what: "SaaS public-comps data for valuation cross-checks.",
        status: "read",
      },
      {
        name: "Dealroom data",
        what: "Private-market intelligence for buyers.",
        status: "read",
      },
      {
        name: "CB Insights data",
        what: "Market-map and deal data used to build buyer shortlists.",
        status: "read",
      },
      {
        name: "Our VC Deal Flow Signal dataset",
        what: "ssrn.com/abstract=6606558, mirrored on Kaggle / Zenodo (CC BY 4.0). The methodology that grounds every translated call.",
        href: "https://ssrn.com/abstract=6606558",
        status: "engage",
      },
    ],
  },
];

export const DREAM_100_TOTAL = DREAM_100_GROUPS.reduce(
  (n, g) => n + g.items.length,
  0,
);

export function dream100StatusCounts(): Record<Dream100Status, number> {
  const counts: Record<Dream100Status, number> = {
    engage: 0,
    watch: 0,
    hold: 0,
    read: 0,
    blocked: 0,
  };
  for (const g of DREAM_100_GROUPS) {
    for (const v of g.items) counts[v.status]++;
  }
  return counts;
}
