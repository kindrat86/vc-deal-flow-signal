const BASE_URL = "https://signals.gitdealflow.com";

export async function GET() {
  const manifest = {
    name: "VC Deal Flow Signal, GitHub Momentum Tracking for Investors",
    short_name: "GitDealFlow",
    description:
      "GitHub commit-velocity tracking across 20 startup sectors. Code-side momentum signals, surface venture-backed startups 3-6 weeks before fundraise.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    lang: "en-US",
    dir: "ltr",
    theme_color: "#020617",
    background_color: "#020617",
    categories: ["business", "finance", "productivity", "news"],
    icons: [
      {
        src: `${BASE_URL}/icon.png`,
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: `${BASE_URL}/icon.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: `${BASE_URL}/apple-icon.png`,
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
    screenshots: [
      {
        src: `${BASE_URL}/opengraph-image`,
        sizes: "1200x630",
        type: "image/png",
        form_factor: "wide",
        label: "VC Deal Flow Signal, Startup Engineering Acceleration Tracker",
      },
    ],
    shortcuts: [
      {
        name: "Trending Startups",
        short_name: "Trending",
        url: "/trending",
        description: "Top 20 startups by commit-velocity acceleration this week.",
      },
      {
        name: "Receipts",
        short_name: "Receipts",
        url: "/receipts",
        description: "Free Scout Score for any GitHub username.",
      },
      {
        name: "Predict",
        short_name: "Predict",
        url: "/predict",
        description: "Forward-looking Scout prediction game.",
      },
      {
        name: "Methodology",
        short_name: "Methodology",
        url: "/methodology",
        description: "How signals are computed.",
      },
    ],
    related_applications: [
      {
        platform: "play",
        url: "https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn",
        id: "com.gitdealflow.chrome",
      },
    ],
    prefer_related_applications: false,
  };

  return Response.json(manifest, {
    headers: {
      "Content-Type": "application/manifest+json; charset=utf-8",
      "Cache-Control": "s-maxage=86400, stale-while-revalidate=3600",
    },
  });
}
