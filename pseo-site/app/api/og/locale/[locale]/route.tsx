import { ImageResponse } from "next/og";
import { getLocaleByCode } from "@/content/locales";

export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

interface RouteContext {
  params: Promise<{ locale: string }>;
}

// Per-locale OG headline (~5-7 words). Hand-written, native-fluent.
// Used on the OG image; the long-form intro stays on the page itself.
//
// Arabic note: Satori (the Vercel renderer behind ImageResponse) parses
// fonts via opentype.js, which does not yet support GSUB lookupType 5 /
// substFormat 3. EVERY production Arabic font (Noto Sans Arabic, Noto
// Naskh Arabic, Cairo, Tajawal, Amiri…) relies on these contextual
// substitutions because Arabic letters take 4 positional forms.
// Until Satori adds support upstream (vercel/satori#... open), the `ar`
// OG card uses a Latin transliteration. The page itself remains fully
// Arabic with dir="rtl" — this fallback only affects the social card.
const LOCALE_HEADLINE: Record<string, string> = {
  zh: "GitHub 工程加速的早期 VC 信号",
  ja: "ベンチャー資金調達の3〜6週間前の GitHub シグナル",
  de: "GitHub-Signale 3–6 Wochen vor Finanzierungs-runden",
  es: "Señales GitHub que preceden rondas de financiación",
  fr: "Signaux GitHub précédant les levées de fonds",
  pt: "Sinais GitHub antes de anúncios de captação",
  ko: "펀드레이즈 3~6주 전의 GitHub 시그널",
  hi: "फ़ंडरेज़ से पहले GitHub इंजीनियरिंग सिग्नल",
  ru: "GitHub-сигналы за 3–6 недель до раунда",
  it: "Segnali GitHub prima delle raccolte fondi",
  nl: "GitHub-signalen vóór financierings-aankondigingen",
  ar: "GitHub signals 3-6 weeks before fundraises",
};

const LOCALE_TAGLINE: Record<string, string> = {
  zh: "VC Deal Flow Signal · SSRN-indexed",
  ja: "VC Deal Flow Signal · SSRN 掲載",
  de: "VC Deal Flow Signal · SSRN-indiziert",
  es: "VC Deal Flow Signal · indexado en SSRN",
  fr: "VC Deal Flow Signal · indexé sur SSRN",
  pt: "VC Deal Flow Signal · indexado no SSRN",
  ko: "VC Deal Flow Signal · SSRN 등재",
  hi: "VC Deal Flow Signal · SSRN पर अनुक्रमित",
  ru: "VC Deal Flow Signal · индексировано в SSRN",
  it: "VC Deal Flow Signal · indicizzato su SSRN",
  nl: "VC Deal Flow Signal · SSRN-geïndexeerd",
  ar: "VC Deal Flow Signal · SSRN-indexed",
};

export async function GET(_req: Request, ctx: RouteContext) {
  const { locale } = await ctx.params;
  const meta = getLocaleByCode(locale);
  const headline = LOCALE_HEADLINE[locale] ?? "VC Deal Flow Signal";
  const tagline = LOCALE_TAGLINE[locale] ?? "VC Deal Flow Signal · SSRN-indexed";
  // Arabic chip uses a Latin transliteration; native script in Satori
  // would crash the renderer (see top-of-file note on GSUB lookupType 5).
  // Page content itself remains fully Arabic with dir="rtl" — only the
  // social card stays LTR until Satori supports Arabic shaping.
  const nativeName = locale === "ar" ? "Arabic" : meta?.nativeName ?? locale;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #020617 0%, #0f172a 100%)",
          padding: 80,
          color: "white",
          fontFamily: "system-ui, -apple-system, sans-serif",
          textAlign: "left",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              fontSize: 32,
              opacity: 0.6,
              letterSpacing: 1,
            }}
          >
            {SITE.replace(/^https?:\/\//, "")}
          </div>
          <div
            style={{
              fontSize: 28,
              padding: "6px 16px",
              borderRadius: 999,
              background: "rgba(14, 165, 233, 0.15)",
              color: "#7dd3fc",
              border: "1px solid rgba(14, 165, 233, 0.4)",
            }}
          >
            {nativeName}
          </div>
        </div>
        <div
          style={{
            fontSize: 60,
            fontWeight: 700,
            lineHeight: 1.2,
            display: "flex",
          }}
        >
          {headline}
        </div>
        <div
          style={{
            fontSize: 28,
            opacity: 0.7,
            display: "flex",
          }}
        >
          {tagline}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
