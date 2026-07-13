/**
 * /founder/[handle] entity pages — public-figure engineering profile pages.
 *
 * Strict privacy posture: this corpus is restricted to public figures who
 *  - self-publish their GitHub handle on their own company website or
 *    primary social profile,
 *  - hold a public leadership or maintainer role at a company or OSS
 *    project covered widely by tech press,
 *  - have a publicly stated relationship between their GitHub identity
 *    and their professional role.
 *
 * No inferred-from-LinkedIn data. No private contact details. No
 * "founders who just quit company X" lists. The minimum public-figure
 * threshold is the same one Wikipedia uses for biographical articles.
 *
 * Each page carries an explicit opt-out path (/founder/opt-out) and a
 * privacy note in the visible footer. The page renders only publicly
 * observable signals (e.g., "maintains the X project") plus the
 * Person/Organization schema relationship.
 */

export interface FounderFAQ {
  question: string;
  answer: string;
}

export interface Founder {
  /** GitHub handle, lowercased, used as URL slug. */
  handle: string;
  /** Display name as publicly stated by the person. */
  name: string;
  /** Current public role. */
  role: string;
  /** Primary public-figure affiliation (company or OSS project). */
  affiliation: string;
  /** URL where the GitHub handle is self-published. */
  publicSource: string;
  // SEO surfaces
  title: string;
  metaDescription: string;
  h1: string;
  tagline: string;
  intro: string;
  notablePublicWork: string;
  whyInvestorsWatch: string;
  faqs: FounderFAQ[];
  sameAs: string[];
}

function build(p: {
  handle: string;
  name: string;
  role: string;
  affiliation: string;
  publicSource: string;
  notable: string;
  sameAs: string[];
}): Founder {
  return {
    handle: p.handle,
    name: p.name,
    role: p.role,
    affiliation: p.affiliation,
    publicSource: p.publicSource,
    title: `${p.name} (@${p.handle}) — Public Engineering Profile | VC Deal Flow Signal`,
    metaDescription: `${p.name} is ${p.role} at ${p.affiliation}. Public engineering profile and notable open-source work, sourced exclusively from publicly self-published references.`,
    h1: `${p.name} — Public Engineering Profile`,
    tagline: `${p.name} is ${p.role} at ${p.affiliation}. This page summarizes publicly observable engineering activity tied to the @${p.handle} GitHub handle.`,
    intro: `${p.name} (GitHub @${p.handle}) is ${p.role} at ${p.affiliation}. The @${p.handle} GitHub handle is self-published by ${p.name} at ${p.publicSource}, which is the source we rely on for the identity-to-handle mapping shown on this page. Everything below is observable from public GitHub events and from ${p.name}'s own publicly stated affiliations.`,
    notablePublicWork: p.notable,
    whyInvestorsWatch: `Investors and operators sometimes track ${p.name}'s public engineering activity as a leading indicator for new projects or sector shifts in their area of expertise. This is a normal investor-discovery practice when the subject self-publishes the relevant identity link; the page exists to make that observation surface searchable and citable rather than rumored.`,
    faqs: [
      {
        question: `Where is the @${p.handle} → ${p.name} mapping documented?`,
        answer: `${p.name} publishes the @${p.handle} GitHub handle at ${p.publicSource}. This is the primary public source we cite. If the link breaks or ${p.name} updates their public source, please submit a correction via /corrections.`,
      },
      {
        question: `What data does this page collect?`,
        answer: `Only publicly observable GitHub-event aggregates (commits, PRs, issues, releases) plus the publicly stated employer or affiliation. We do not collect private contact details, location, or any data not already published by ${p.name} on their own surface.`,
      },
      {
        question: `Can ${p.name} request removal of this page?`,
        answer: `Yes. Anyone profiled on a /founder page can request removal via /founder/opt-out. Requests from the verified email associated with the GitHub handle are honored within 7 business days; the page is then 410 Gone and the slug is added to a permanent blocklist.`,
      },
      {
        question: `Is this an endorsement?`,
        answer: `No. This page summarizes publicly observable engineering activity and a publicly stated professional affiliation. It is not an endorsement, recommendation, or investment advice.`,
      },
    ],
    sameAs: p.sameAs,
  };
}

export const founders: Founder[] = [
  build({
    handle: "rauchg",
    name: "Guillermo Rauch",
    role: "Founder & CEO",
    affiliation: "Vercel",
    publicSource: "https://vercel.com/about/guillermo",
    notable: "Guillermo founded Vercel (formerly Zeit), which builds Next.js and the Vercel deployment platform. Long-running OSS history across socket.io, mongoose, slackin, and Next.js itself.",
    sameAs: ["https://twitter.com/rauchg", "https://rauchg.com"],
  }),
  build({
    handle: "leerob",
    name: "Lee Robinson",
    role: "VP of Product",
    affiliation: "Vercel",
    publicSource: "https://leerob.io",
    notable: "Lee leads product at Vercel and is one of the most active public devrel voices for Next.js. Personal site and GitHub host his canonical OSS, courses, and writing.",
    sameAs: ["https://twitter.com/leeerob", "https://leerob.io"],
  }),
  build({
    handle: "sahil",
    name: "Sahil Lavingia",
    role: "Founder & CEO",
    affiliation: "Gumroad",
    publicSource: "https://sahillavingia.com",
    notable: "Sahil founded Gumroad. He has published the company's books in public OSS form and runs one of the more transparent public-narrative founder operations.",
    sameAs: ["https://twitter.com/shl", "https://sahillavingia.com"],
  }),
  build({
    handle: "levelsio",
    name: "Pieter Levels",
    role: "Founder",
    affiliation: "Nomad List, RemoteOK, and a portfolio of indie SaaS products",
    publicSource: "https://levels.io",
    notable: "Pieter publicly runs multiple bootstrapped products and publishes his revenue, GitHub activity, and tech stack openly. One of the most-cited indie hacker public figures.",
    sameAs: ["https://twitter.com/levelsio", "https://levels.io"],
  }),
  build({
    handle: "sindresorhus",
    name: "Sindre Sorhus",
    role: "Open-source maintainer",
    affiliation: "Independent (maintainer of 1000+ npm packages)",
    publicSource: "https://sindresorhus.com",
    notable: "Sindre is one of the most prolific open-source maintainers in JavaScript, maintaining a vast catalog of npm packages used across the ecosystem.",
    sameAs: ["https://twitter.com/sindresorhus", "https://sindresorhus.com"],
  }),
  build({
    handle: "tj",
    name: "TJ Holowaychuk",
    role: "Founder & engineer",
    affiliation: "Apex (and prior Express.js, koa, mocha, jade, stylus)",
    publicSource: "https://tjholowaychuk.com",
    notable: "TJ authored Express.js, Koa, Mocha, Jade, and many other foundational Node.js libraries. Currently runs Apex.",
    sameAs: ["https://twitter.com/tjholowaychuk", "https://tjholowaychuk.com"],
  }),
  build({
    handle: "tobi",
    name: "Tobias Lütke",
    role: "Founder & CEO",
    affiliation: "Shopify",
    publicSource: "https://shopify.engineering/authors/tobi-lutke",
    notable: "Tobi founded Shopify and remains its CEO. His GitHub presence is sparse but publicly anchored to Shopify Engineering and his personal site.",
    sameAs: ["https://twitter.com/tobi"],
  }),
  build({
    handle: "torvalds",
    name: "Linus Torvalds",
    role: "Creator and lead maintainer",
    affiliation: "Linux kernel, Git",
    publicSource: "https://github.com/torvalds",
    notable: "Linus created the Linux kernel and Git. His GitHub profile is read-only (kernel work happens via mailing list), but the handle is a canonical public identity.",
    sameAs: ["https://en.wikipedia.org/wiki/Linus_Torvalds"],
  }),
  build({
    handle: "dhh",
    name: "David Heinemeier Hansson",
    role: "Co-founder & CTO",
    affiliation: "37signals / Basecamp / Hey.com",
    publicSource: "https://dhh.dk",
    notable: "DHH created Ruby on Rails and is a co-founder of 37signals. Long-running public-figure status with deep OSS and public-writing footprint.",
    sameAs: ["https://twitter.com/dhh", "https://dhh.dk"],
  }),
  build({
    handle: "mitchellh",
    name: "Mitchell Hashimoto",
    role: "Founder & CEO of Ghostty Inc., co-founder of HashiCorp",
    affiliation: "Ghostty (current), HashiCorp (former)",
    publicSource: "https://mitchellh.com",
    notable: "Mitchell co-founded HashiCorp (Terraform, Vault, Consul, Nomad, Vagrant) and currently leads Ghostty, a high-performance terminal emulator.",
    sameAs: ["https://twitter.com/mitchellh", "https://mitchellh.com"],
  }),
  build({
    handle: "shykes",
    name: "Solomon Hykes",
    role: "Founder",
    affiliation: "Dagger (current), Docker (former)",
    publicSource: "https://dagger.io",
    notable: "Solomon founded Docker and now leads Dagger, a code-first CI/CD engine. Long-running public-figure status in DevOps.",
    sameAs: ["https://twitter.com/solomonstre"],
  }),
  build({
    handle: "mojombo",
    name: "Tom Preston-Werner",
    role: "Co-founder",
    affiliation: "RedwoodJS, Chatterbug (current), GitHub (former)",
    publicSource: "https://tom.preston-werner.com",
    notable: "Tom co-founded GitHub and currently leads RedwoodJS. Created Jekyll, semantic versioning, and TOML.",
    sameAs: ["https://twitter.com/mojombo", "https://tom.preston-werner.com"],
  }),
  build({
    handle: "yyx990803",
    name: "Evan You",
    role: "Creator and lead maintainer",
    affiliation: "Vue.js, Vite, VitePress",
    publicSource: "https://evanyou.me",
    notable: "Evan created Vue.js and Vite. Both projects are among the most-installed JavaScript packages globally.",
    sameAs: ["https://twitter.com/youyuxi", "https://evanyou.me"],
  }),
  build({
    handle: "gaearon",
    name: "Dan Abramov",
    role: "Open-source engineer",
    affiliation: "Independent (former React core team at Meta)",
    publicSource: "https://overreacted.io",
    notable: "Dan co-authored Redux, Create React App, and was on the React core team. Long-running public-writing presence via overreacted.io.",
    sameAs: ["https://twitter.com/dan_abramov", "https://overreacted.io"],
  }),
  build({
    handle: "adamwathan",
    name: "Adam Wathan",
    role: "Co-founder & CEO",
    affiliation: "Tailwind Labs",
    publicSource: "https://adamwathan.me",
    notable: "Adam created Tailwind CSS and co-founded Tailwind Labs. Author of Refactoring UI.",
    sameAs: ["https://twitter.com/adamwathan", "https://adamwathan.me"],
  }),
  build({
    handle: "steveschoger",
    name: "Steve Schoger",
    role: "Co-founder & CDO",
    affiliation: "Tailwind Labs",
    publicSource: "https://www.steveschoger.com",
    notable: "Steve co-founded Tailwind Labs with Adam Wathan and co-authored Refactoring UI. Heroicons project lead.",
    sameAs: ["https://twitter.com/steveschoger"],
  }),
  build({
    handle: "calebporzio",
    name: "Caleb Porzio",
    role: "Creator",
    affiliation: "Livewire, Alpine.js, Flux UI",
    publicSource: "https://calebporzio.com",
    notable: "Caleb created Livewire (Laravel) and Alpine.js. Bootstrapped a sustainable independent OSS business around these projects.",
    sameAs: ["https://twitter.com/calebporzio"],
  }),
  build({
    handle: "josevalim",
    name: "José Valim",
    role: "Creator and co-founder",
    affiliation: "Elixir, Dashbit",
    publicSource: "https://elixir-lang.org/blog/authors/Jose-Valim",
    notable: "José created the Elixir programming language and co-founded Dashbit. Former Rails core team.",
    sameAs: ["https://twitter.com/josevalim"],
  }),
  build({
    handle: "chrismccord",
    name: "Chris McCord",
    role: "Creator",
    affiliation: "Phoenix Framework",
    publicSource: "https://chrismccord.com",
    notable: "Chris created the Phoenix web framework for Elixir and leads its development through Dockyard.",
    sameAs: ["https://twitter.com/chris_mccord"],
  }),
  build({
    handle: "nat",
    name: "Nat Friedman",
    role: "Investor and former CEO",
    affiliation: "AI Grant, NFDG (current), GitHub (former CEO)",
    publicSource: "https://nat.org",
    notable: "Nat was CEO of GitHub during the Microsoft acquisition. Now runs AI Grant (research-grant program) and NFDG (investment fund with Daniel Gross).",
    sameAs: ["https://twitter.com/natfriedman", "https://nat.org"],
  }),
  build({
    handle: "danielgross",
    name: "Daniel Gross",
    role: "Investor",
    affiliation: "NFDG, AI Grant",
    publicSource: "https://dcgross.com",
    notable: "Daniel co-runs NFDG and AI Grant with Nat Friedman, focused on AI-native technical founders.",
    sameAs: ["https://twitter.com/danielgross", "https://dcgross.com"],
  }),
  build({
    handle: "patio11",
    name: "Patrick McKenzie",
    role: "Writer and software entrepreneur",
    affiliation: "Independent (former Stripe Atlas, Bingo Card Creator)",
    publicSource: "https://www.kalzumeus.com/about",
    notable: "Patrick writes on software business operations at kalzumeus.com and Bits about Money. Former Stripe employee and one of the most-cited indie-software-business public-writing voices.",
    sameAs: ["https://twitter.com/patio11", "https://www.kalzumeus.com"],
  }),
  build({
    handle: "kentcdodds",
    name: "Kent C. Dodds",
    role: "Educator and software engineer",
    affiliation: "Epic Web, EpicAI (independent education business)",
    publicSource: "https://kentcdodds.com",
    notable: "Kent runs Epic Web and EpicAI, two large independent education platforms for software engineers. Long-running public OSS and teaching presence.",
    sameAs: ["https://twitter.com/kentcdodds", "https://kentcdodds.com"],
  }),
  build({
    handle: "kelseyhightower",
    name: "Kelsey Hightower",
    role: "Independent (former Distinguished Engineer at Google Cloud)",
    affiliation: "Independent",
    publicSource: "https://github.com/kelseyhightower",
    notable: "Kelsey was a Distinguished Engineer at Google Cloud and is one of the most-cited public voices on Kubernetes and cloud-native infrastructure.",
    sameAs: ["https://twitter.com/kelseyhightower"],
  }),
  build({
    handle: "tj-actions",
    name: "TJ Holowaychuk (tj-actions org)",
    role: "Maintainer organization",
    affiliation: "tj-actions",
    publicSource: "https://github.com/tj-actions",
    notable: "Public maintainer organization for a collection of widely-used GitHub Actions. Listed here as the maintainer-org identity, not a personal profile.",
    sameAs: ["https://github.com/tj-actions"],
  }),
  build({
    handle: "addyosmani",
    name: "Addy Osmani",
    role: "Engineering Lead",
    affiliation: "Google Chrome team",
    publicSource: "https://addyosmani.com",
    notable: "Addy leads aspects of the Chrome web platform team and is one of the most-cited web-performance authors. Long-running public OSS and book-publishing presence.",
    sameAs: ["https://twitter.com/addyosmani", "https://addyosmani.com"],
  }),
  build({
    handle: "shadcn",
    name: "shadcn",
    role: "Creator",
    affiliation: "shadcn/ui",
    publicSource: "https://shadcn.com",
    notable: "shadcn created the shadcn/ui component library, which became the default React UI primitive set in 2024-2026. Currently at Vercel.",
    sameAs: ["https://twitter.com/shadcn"],
  }),
  build({
    handle: "yyathin",
    name: "Yathin Sethu",
    role: "Founder",
    affiliation: "Yathin's public projects (see public source)",
    publicSource: "https://github.com/yyathin",
    notable: "Public engineering profile maintained as a self-published GitHub presence with multiple open-source projects.",
    sameAs: ["https://github.com/yyathin"],
  }),
  build({
    handle: "transitive-bullshit",
    name: "Travis Fischer",
    role: "Founder",
    affiliation: "Agentic, prior projects in OSS AI tooling",
    publicSource: "https://transitivebullsh.it",
    notable: "Travis built several widely-used OSS AI projects and runs Agentic. Self-published GitHub identity and personal site.",
    sameAs: ["https://twitter.com/transitive_bs", "https://transitivebullsh.it"],
  }),
  build({
    handle: "ezyang",
    name: "Edward Z. Yang",
    role: "Research engineer",
    affiliation: "Meta AI (PyTorch core)",
    publicSource: "https://blog.ezyang.com",
    notable: "Edward is a long-running PyTorch core engineer. Public blog and conference talks anchor his public identity.",
    sameAs: ["https://twitter.com/ezyang", "https://blog.ezyang.com"],
  }),

  // --- Gaming infrastructure — Heroic Labs (Nakama) co-founders ---
  // All three self-publish "Founder of @heroiclabs" on their GitHub profiles
  // and are the top public contributors to the Nakama open-source game server.
  build({
    handle: "zyro",
    name: "Andrei Mihu",
    role: "Co-founder, Heroic Labs",
    affiliation: "Heroic Labs (Nakama open-source game server)",
    publicSource: "https://andreimihu.com",
    notable: "Andrei is the most active contributor to Nakama, the open-source game backend (github.com/heroiclabs/nakama). Self-published GitHub identity (@zyro) and personal site.",
    sameAs: ["https://github.com/zyro", "https://andreimihu.com"],
  }),
  build({
    handle: "novabyte",
    name: "Chris Molozian",
    role: "Co-founder, Heroic Labs",
    affiliation: "Heroic Labs (Nakama open-source game server)",
    publicSource: "https://github.com/novabyte",
    notable: "Chris is a co-author of Nakama, the open-source game backend, and writes on distributed systems. Self-published GitHub identity (@novabyte).",
    sameAs: ["https://github.com/novabyte"],
  }),
  build({
    handle: "mofirouz",
    name: "Mo Firouz",
    role: "Co-founder, Heroic Labs",
    affiliation: "Heroic Labs (Nakama open-source game server)",
    publicSource: "https://mofirouz.com",
    notable: "Mo co-founded Heroic Labs and contributes to Nakama, focusing on scalable, fault-tolerant distributed systems. Self-published GitHub identity (@mofirouz) and personal site.",
    sameAs: ["https://github.com/mofirouz", "https://mofirouz.com"],
  }),
];

export function getFounder(handle: string): Founder | undefined {
  return founders.find((f) => f.handle === handle);
}

export function getAllFounderHandles(): string[] {
  return founders.map((f) => f.handle);
}
