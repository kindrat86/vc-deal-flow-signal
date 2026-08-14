/**
 * Server-side bot-crawl monitoring for signals.gitdealflow.com.
 *
 * Client-side PostHog (the __PHBOT detector in app/layout.tsx) can tag real
 * browser visitors, but it never sees AI/SEO crawlers: GPTBot, ClaudeBot,
 * PerplexityBot, Google-Extended etc. fetch HTML, llms.txt, qa.jsonl and
 * sitemaps WITHOUT executing JavaScript. This proxy captures those requests at
 * the network boundary and emits a `bot_crawl` event to PostHog so crawl
 * patterns (which bots, which files, how often) are visible in the analytics UI.
 *
 * Human traffic is untouched: the UA check is a cheap string scan and the
 * PostHog POST only runs for bot requests, so normal visitors pay zero added
 * latency. Bot requests are awaited (bounded to 1.5s) so the event is flushed
 * reliably; bots do not feel that latency.
 */
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const POSTHOG_KEY = 'phc_lyZCgvTpicjLzAO3rY2GhxuX5WUc5jQjP8ZVwwJqauX'
const POSTHOG_CAPTURE = 'https://eu.i.posthog.com/capture/'

// Specific crawlers -> friendly label. Order matters: most specific first
// (e.g. google-extended before googlebot).
const NAMED_BOTS: ReadonlyArray<readonly [string, string]> = [
  ['google-extended', 'Google-Extended'],
  ['googleother', 'GoogleOther'],
  ['googlebot', 'Googlebot'],
  ['gptbot', 'GPTBot'],
  ['oai-searchbot', 'OAI-SearchBot'],
  ['chatgpt-user', 'ChatGPT-User'],
  ['claudebot', 'ClaudeBot'],
  ['claude-web', 'Claude-Web'],
  ['anthropic-ai', 'Anthropic-AI'],
  ['perplexitybot', 'PerplexityBot'],
  ['bingbot', 'Bingbot'],
  ['ccbot', 'CCBot'],
  ['amazonbot', 'Amazonbot'],
  ['applebot-extended', 'Applebot-Extended'],
  ['applebot', 'Applebot'],
  ['meta-externalagent', 'Meta-ExternalAgent'],
  ['meta-externalfetcher', 'Meta-ExternalFetcher'],
  ['facebookexternalhit', 'FacebookExternalHit'],
  ['cohere-ai', 'Cohere-AI'],
  ['youbot', 'YouBot'],
  ['bytespider', 'Bytespider'],
  ['duckduckbot', 'DuckDuckBot'],
  ['petalbot', 'PetalBot'],
  ['yandex', 'YandexBot'],
  ['baiduspider', 'BaiduSpider'],
  ['sogou', 'SogouBot'],
  ['ahrefsbot', 'AhrefsBot'],
  ['semrushbot', 'SemrushBot'],
  ['mj12bot', 'MJ12bot'],
  ['dotbot', 'DotBot'],
  ['dataforseo', 'DataForSEO'],
  ['screaming frog', 'ScreamingFrog'],
  ['timpibot', 'Timpibot'],
  ['omgili', 'OmgiliBot'],
  ['diffbot', 'Diffbot'],
  ['linkedinbot', 'LinkedInBot'],
  ['twitterbot', 'TwitterBot'],
  ['redditbot', 'RedditBot'],
  ['telegrambot', 'TelegramBot'],
  ['slackbot', 'SlackBot'],
  ['discordbot', 'DiscordBot'],
]

// Generic markers for non-human clients we do not recognize by name.
const GENERIC_BOT_MARKERS: readonly string[] = [
  'bot/', 'bot;', 'bot)', '-bot', '_bot', 'bot ',
  'crawler', 'spider', 'scraper', 'slurp', 'archiver', 'indexer',
  'headless', 'phantomjs', 'selenium', 'puppeteer', 'playwright', 'cypress',
  'webdriver', 'curl/', 'wget/', 'python-requests', 'python-httpx', 'aiohttp',
  'axios/', 'go-http-client', 'java/', 'okhttp', 'libwww-perl', 'guzzlehttp',
  'postmanruntime', 'node-fetch', 'undici',
]

// Binary/static assets that are never worth logging as a "crawl".
const ASSET_EXT =
  /\.(png|jpe?g|gif|svg|webp|avif|ico|woff2?|ttf|otf|eot|css|js|mjs|map|webmanifest)$/i

function classifyBot(userAgent: string): string | null {
  const ua = userAgent.toLowerCase()
  for (const [marker, name] of NAMED_BOTS) {
    if (ua.includes(marker)) return name
  }
  for (const marker of GENERIC_BOT_MARKERS) {
    if (ua.includes(marker)) return 'GenericBot'
  }
  return null
}

async function captureBot(request: NextRequest, bot: string): Promise<void> {
  const ua = (request.headers.get('user-agent') || '').slice(0, 512)
  const url = request.nextUrl

  const payload = {
    api_key: POSTHOG_KEY,
    event: 'bot_crawl',
    distinct_id: bot,
    properties: {
      bot,
      host: url.host,
      path: url.pathname,
      method: request.method,
      user_agent: ua,
      $ip: request.headers.get('x-forwarded-for') || '',
      source: 'server-proxy',
    },
    timestamp: new Date().toISOString(),
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 1500)
  try {
    await fetch(POSTHOG_CAPTURE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
  } catch {
    // Monitoring is best-effort; never let it fail or slow the request.
  } finally {
    clearTimeout(timer)
  }
}

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  if (ASSET_EXT.test(path)) {
    return NextResponse.next()
  }

  const bot = classifyBot(request.headers.get('user-agent') || '')
  if (bot) {
    await captureBot(request, bot)
  }

  return NextResponse.next()
}

export const config = {
  // Run on everything except Next.js internals and favicon. Deliberately keeps
  // .txt/.xml/.json/.jsonl/.csv and all routes so llms.txt, qa.jsonl, sitemaps
  // and .well-known/* are captured (assets are skipped inside the handler).
  matcher: ['/((?!_next/|favicon.ico).*)'],
}
