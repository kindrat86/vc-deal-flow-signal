import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import script from "@/content/vsl-script.json";

export const dynamic = "force-static";

const SITE = "https://signals.gitdealflow.com";

// Brunson Expert Secrets §3 Ch 12 — the Perfect VSL. Anonymity rule: synthetic
// voice (Cartesia "Theo") + Remotion render — no founder face, voice, or name.
//
// Set VIDEO_ID once the workflow_dispatch render uploads to YouTube. Until
// then the page ships as the structured Brunson transcript: Hook → Big Domino
// → Three Secrets → Proof → Future Pace → Stack → Closes → Three Doors →
// Encore. Same arc as the video, optimised for skim-readers.
const VIDEO_ID: string | null = null;
const VIDEO_DURATION_ISO = "PT10M30S"; // sum of scene VOs at ~150wpm + animation buffer

export const metadata: Metadata = {
  title: script.headline + " — Video Sales Letter",
  description:
    "10-minute video sales letter. Single belief: GitHub commit-velocity acceleration is the most leading public signal in venture capital. 219-startup SSRN panel, 21–47 day median pre-deck lead band. €49/mo founding rate. Free Sunday digest. €7 First Look Pass.",
  alternates: { canonical: "/vsl" },
  openGraph: {
    title: script.headline,
    description: script.subhead,
    url: `${SITE}/vsl`,
    type: "video.other",
  },
  twitter: {
    card: "player",
    title: script.headline,
    description: script.subhead,
  },
};

const SCENES = script.scenes;

// Convenience accessors — typed lookups by scene id keep the page resilient
// if the script JSON adds/reorders scenes.
const sceneById = <T extends { id: string }>(arr: ReadonlyArray<T>, id: string) =>
  arr.find((s) => s.id === id);

type StackItem = { name: string; detail: string; value: string };
type Beat = { day: string; label: string; detail: string; win?: boolean };

export default function VslPage() {
  const hookScene = sceneById(SCENES, "hook");
  const dominoScene = sceneById(SCENES, "big-domino");
  const secretsScene = sceneById(SCENES, "three-secrets");
  const proofScene = sceneById(SCENES, "proof");
  const futurePaceScene = sceneById(SCENES, "future-pace");
  const stackScene = sceneById(SCENES, "stack");
  const objectionsScene = sceneById(SCENES, "objections");
  const ctaScene = sceneById(SCENES, "cta");
  const encoreScene = sceneById(SCENES, "encore");

  const stackData = stackScene?.data as
    | { items: StackItem[]; totalValue: string; yourPrice: string }
    | undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "VideoObject",
        "@id": `${SITE}/vsl#video`,
        name: script.headline,
        description:
          "10-minute video sales letter. Single belief: GitHub commit-velocity acceleration is the most leading public signal in venture capital. Synthetic voice (Cartesia Theo) — no founder face, voice, or name.",
        // Falls back to site icon until the workflow_dispatch render uploads
        // the Remotion-rendered ThumbnailVsl still and we can swap in a CDN URL.
        thumbnailUrl: [`${SITE}/icon.png`],
        uploadDate: "2026-05-08T00:00:00.000Z",
        duration: VIDEO_DURATION_ISO,
        contentUrl: VIDEO_ID
          ? `https://www.youtube.com/watch?v=${VIDEO_ID}`
          : `${SITE}/vsl`,
        embedUrl: VIDEO_ID
          ? `https://www.youtube.com/embed/${VIDEO_ID}`
          : `${SITE}/vsl`,
        publisher: {
          "@type": "Organization",
          "@id": "https://gitdealflow.com/#organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        // Brunson sales-content surface — the script transcript is what
        // Google/agents should index.
        transcript: SCENES.filter((s) => s.vo)
          .map((s) => s.vo)
          .join("\n\n"),
        potentialAction: {
          "@type": "ViewAction",
          target: `${SITE}/firstlook`,
        },
      },
      {
        "@type": "WebPage",
        "@id": `${SITE}/vsl#webpage`,
        url: `${SITE}/vsl`,
        name: script.headline,
        primaryImageOfPage: { "@id": `${SITE}/vsl#video` },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["[data-speakable]", "h1", "h2"],
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: script.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          {
            "@type": "ListItem",
            position: 2,
            name: "Video Sales Letter",
            item: `${SITE}/vsl`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={`${SITE}/vsl`}
        languages={getHreflangLanguages("/vsl")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/vsl" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* HERO — video + headline */}
        <header className="space-y-6" data-speakable>
          <p className="text-xs uppercase tracking-[0.18em] text-amber-700 font-bold">
            Video Sales Letter · 10 minutes · synthetic voice
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
            {script.headline}
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            {script.subhead}
          </p>

          {/* Video frame — embeds YouTube once render lands. Placeholder
              card while the workflow is queued. */}
          <div className="aspect-video w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-xl">
            {VIDEO_ID ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?rel=0&modestbranding=1`}
                title={script.headline}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-4 px-6 text-center">
                <div className="text-amber-400 text-xs uppercase tracking-[0.2em] font-bold">
                  Written version below while the video finishes
                </div>
                <p className="text-slate-200 text-lg font-semibold max-w-md">
                  The whole case is written out below in plain English — the same arc as the video. Most readers prefer it: you can skim it in 10 minutes and jump straight to the offer.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                  <a
                    href="#read"
                    className="inline-flex items-center gap-1 rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-slate-900 hover:bg-amber-400 transition"
                  >
                    Prefer to read? Here&rsquo;s the 10-minute case →
                  </a>
                  <a
                    href="#offer"
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-slate-400 transition"
                  >
                    Skip to the offer →
                  </a>
                </div>
                <p className="text-slate-400 text-sm">
                  Anonymity rule: synthetic voice (Cartesia Theo) only. No founder face, voice, or name.
                </p>
              </div>
            )}
          </div>

          {/* Above-fold trial-close + CTA bar */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/firstlook"
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-3 text-base font-bold text-slate-900 hover:bg-amber-400 transition"
            >
              Try one sector for €7 →
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-base font-bold text-white hover:bg-emerald-500 transition"
            >
              Dashboard €49/mo →
            </Link>
            <a
              href="https://gitdealflow.com/#signup"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-slate-700 hover:border-slate-400 transition"
            >
              Free Sunday digest →
            </a>
          </div>
          <p className="text-xs text-slate-500">
            30-Day Signal-or-It&rsquo;s-Free Guarantee · Cancel anytime · Founding rate locked forever
          </p>
          <p className="text-sm text-slate-600 leading-relaxed border-l-2 border-amber-300 pl-3">
            <span className="font-semibold text-slate-700">No code required.</span>{" "}
            You never read a line of it. We do the reading and hand you the
            plain-English verdict — &ldquo;this team is suddenly shipping far
            more than usual,&rdquo; not a screen of statistics.
          </p>
        </header>

        {/* HOOK — Brunson rule: hook hard, lead with curiosity. */}
        {hookScene ? (
          <section id="read" className="scroll-mt-20 space-y-3 rounded-2xl border border-amber-200 bg-amber-50/60 p-6 sm:p-8">
            <h2 className="text-xs uppercase tracking-[0.18em] text-amber-700 font-bold">
              Hook · 0:00
            </h2>
            <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-snug">
              Imagine your inbox on a Tuesday morning, August 2026.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed">{hookScene.vo}</p>
            <p className="text-sm text-amber-800 font-semibold pt-1">
              Stick with me — what comes next is mathematically falsifiable, and the proof is sitting on a public preprint server.
            </p>
          </section>
        ) : null}

        {/* BIG DOMINO — Brunson Expert Secrets §2 Ch 6. */}
        {dominoScene ? (
          <section className="space-y-3 rounded-2xl border-2 border-emerald-300 bg-emerald-50/60 p-6 sm:p-8 shadow-md" data-speakable>
            <h2 className="text-xs uppercase tracking-[0.18em] text-emerald-700 font-bold">
              The single belief · 1:00
            </h2>
            <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-snug">
              If GitHub commit-velocity acceleration{" "}
              <mark className="bg-emerald-200/80 px-1 rounded">is the most leading public signal in venture capital,</mark>{" "}
              then every other deal-flow source — pitch decks, AngelList, Crunchbase, warm intros — is a lagging indicator.
            </p>
            <p className="text-base text-slate-600 italic">
              And that is the only thing this video is trying to prove.
            </p>
          </section>
        ) : null}

        {/* THREE SECRETS — Brunson DotCom §2 + Expert §2 Ch 11 (False Belief Patterns). */}
        {secretsScene ? (
          <section className="space-y-5">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Three things I had to unlearn
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">{secretsScene.vo}</p>
            <div className="grid gap-3 sm:grid-cols-1">
              {(secretsScene.data as { beats: Beat[] }).beats.map((b, i) => (
                <div
                  key={i}
                  className={`rounded-xl border p-5 ${
                    b.win
                      ? "border-emerald-300 bg-emerald-50/50"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 min-w-[60px] pt-0.5">
                      {b.day}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-lg font-bold text-slate-900">
                        {b.label}
                      </p>
                      <p className="text-sm text-slate-600">{b.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm font-semibold text-slate-700 italic pt-1">Make sense so far?</p>
          </section>
        ) : null}

        {/* PROOF — Brunson Expert Secrets §2 Ch 7 (Epiphany Bridge proof). */}
        {proofScene ? (
          <section className="space-y-5 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              What the SSRN paper actually shows
            </h2>
            <p className="text-base text-slate-700 leading-relaxed">{proofScene.vo}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {(proofScene.data as { beats: Beat[] }).beats.map((b, i) => (
                <div
                  key={i}
                  className={`rounded-lg border p-4 ${
                    b.win
                      ? "border-emerald-300 bg-emerald-50"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {b.day}
                  </p>
                  <p className="text-base font-bold text-slate-900 pt-1">
                    {b.label}
                  </p>
                  <p className="text-xs text-slate-600 pt-0.5">{b.detail}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              Replicate the panel:{" "}
              <a
                href="https://ssrn.com/abstract=6606558"
                className="underline hover:text-slate-700"
              >
                SSRN preprint
              </a>{" "}
              ·{" "}
              <Link href="/research" className="underline hover:text-slate-700">
                Research panel
              </Link>{" "}
              · CC-BY-4.0
            </p>
            <p className="text-sm font-semibold text-slate-700 italic">Still with me?</p>
          </section>
        ) : null}

        {/* FUTURE PACE — Brunson Expert Secrets §3 Ch 12 (Mental Movie). */}
        {futurePaceScene ? (
          <section className="space-y-5">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              A Tuesday morning, three months from now
            </h2>
            <p className="text-base text-slate-700 leading-relaxed">
              {futurePaceScene.vo}
            </p>
            <div className="space-y-2">
              {(futurePaceScene.data as { beats: Beat[] }).beats.map((b, i) => (
                <div key={i} className="flex items-start gap-4 rounded-lg border border-slate-200 bg-white p-4">
                  <div className="text-base font-mono font-bold text-amber-700 min-w-[60px]">
                    {b.day}
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-bold text-slate-900">{b.label}</p>
                    <p className="text-sm text-slate-600">{b.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* THE STACK — Brunson DotCom §3 Ch 12 + Expert §3 Ch 13 (Stack Slide). */}
        {stackData ? (
          <section className="space-y-4 rounded-2xl border-2 border-slate-300 bg-white p-6 sm:p-8 shadow-md">
            <div className="space-y-1 pb-3 border-b border-slate-200">
              <p className="text-xs uppercase tracking-[0.18em] font-bold text-slate-500">
                The stack
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                What €49/mo gets you.
              </h2>
            </div>
            <div className="space-y-2">
              {stackData.items.map((item, i) => {
                const isFree = item.value === "€0" || item.value === "Bonus";
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div
                        className={`mt-1.5 h-3 w-3 rounded-sm flex-shrink-0 ${
                          isFree ? "bg-emerald-500" : "bg-amber-500"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-bold text-slate-900">{item.name}</p>
                        <p className="text-sm text-slate-600 font-mono">{item.detail}</p>
                      </div>
                    </div>
                    <div
                      className={`font-mono font-bold text-base whitespace-nowrap ${
                        isFree ? "text-emerald-600" : "text-amber-700"
                      }`}
                    >
                      {item.value}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="rounded-lg border border-slate-300 bg-slate-50 px-5 py-3 flex items-center justify-between mt-4">
              <span className="text-base font-semibold text-slate-700">Total real value</span>
              <span className="text-2xl font-mono font-bold text-slate-900">
                {stackData.totalValue}
              </span>
            </div>
            <div className="rounded-lg border-2 border-emerald-400 bg-gradient-to-r from-emerald-100 to-emerald-50 px-5 py-4 flex items-center justify-between shadow-sm">
              <span className="text-lg font-bold text-emerald-800">Your price</span>
              <span className="text-3xl font-mono font-extrabold text-emerald-700 tracking-tight">
                {stackData.yourPrice}
              </span>
            </div>
            <p className="text-xs text-slate-500 italic pt-1">
              Locked at the founding rate. Forever.
            </p>
            {stackScene ? (
              <p className="text-base text-slate-700 leading-relaxed pt-3">{stackScene.vo}</p>
            ) : null}
          </section>
        ) : null}

        {/* OBJECTIONS / CLOSES — Brunson Expert Secrets §3 Ch 13 (Stack Closes). */}
        {objectionsScene ? (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Five questions you might be asking
            </h2>
            <p className="text-base text-slate-700 leading-relaxed">{objectionsScene.vo}</p>
            <div className="space-y-2">
              {(objectionsScene.data as { beats: Beat[] }).beats.map((b, i) => (
                <details
                  key={i}
                  className="group rounded-lg border border-slate-200 bg-white open:border-amber-300 open:bg-amber-50/50"
                >
                  <summary className="cursor-pointer list-none flex items-center justify-between gap-4 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-700 min-w-[36px]">
                        {b.day}
                      </span>
                      <span className="text-base font-bold text-slate-900">{b.label}</span>
                    </div>
                    <span className="text-slate-400 group-open:rotate-90 transition">→</span>
                  </summary>
                  <p className="px-4 pb-4 text-sm text-slate-600 pl-[64px]">{b.detail}</p>
                </details>
              ))}
            </div>
            <p className="text-sm font-semibold text-slate-700 italic">Make sense?</p>
          </section>
        ) : null}

        {/* THREE DOORS CTA — Brunson DotCom §1 Ch 2 (Value Ladder, all rungs visible). */}
        {ctaScene ? (
          <section id="offer" className="scroll-mt-20 space-y-5 rounded-2xl border-2 border-emerald-300 bg-emerald-50/40 p-6 sm:p-8" data-speakable>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.18em] font-bold text-emerald-700">
                Three doors
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Pick the rung that fits your cadence.
              </h2>
              <p className="text-sm text-slate-600 italic">The rest stay out of your way.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <a
                href="https://gitdealflow.com/#signup"
                className="rounded-xl border-2 border-slate-300 bg-white p-5 hover:border-slate-400 hover:bg-slate-50 transition"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Door #1
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1">Free</p>
                <p className="text-sm font-semibold text-slate-700 mt-2">Sunday digest</p>
                <p className="text-xs text-slate-500 mt-1">5 names a week. No commitment.</p>
              </a>
              <Link
                href="/firstlook"
                className="rounded-xl border-2 border-amber-400 bg-amber-50 p-5 hover:bg-amber-100 transition"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
                  Door #2
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1">€7 once</p>
                <p className="text-sm font-semibold text-slate-700 mt-2">First Look Pass</p>
                <p className="text-xs text-slate-500 mt-1">Pick a sector. 24-hour deep-dive. Credit toward Dashboard.</p>
              </Link>
              <Link
                href="/pricing"
                className="rounded-xl border-2 border-emerald-500 bg-emerald-100 p-5 hover:bg-emerald-200 transition shadow"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Door #3
                </p>
                <p className="text-2xl font-bold text-slate-900 mt-1">€49/mo</p>
                <p className="text-sm font-semibold text-slate-700 mt-2">Dashboard</p>
                <p className="text-xs text-slate-500 mt-1">Founding rate. Locked forever.</p>
              </Link>
            </div>
          </section>
        ) : null}

        {/* ENCORE — Brunson DotCom §3 Ch 12 (If-all-this-did close). */}
        {encoreScene ? (
          <section className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              If all this did was…
            </h2>
            <p className="text-base text-slate-700 leading-relaxed">{encoreScene.vo}</p>
            <div className="space-y-2 pt-2">
              {(encoreScene.data as { beats: Beat[] }).beats.map((b, i) => (
                <div
                  key={i}
                  className={`rounded-lg border p-4 ${
                    b.win
                      ? "border-emerald-300 bg-emerald-50"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <p className="text-base text-slate-900">
                    <span className="font-bold text-emerald-700 mr-2">If</span>
                    {b.label.replace(/^If\s+/i, "")} —{" "}
                    <span className="italic text-slate-600">would the €49/mo be worth it?</span>
                  </p>
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-700 font-semibold italic pt-2">
              That is the question I want you to answer.
            </p>
          </section>
        ) : null}

        {/* FAQ — Brunson DotCom §3 (objection pre-handling). */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">FAQ</h2>
          <div className="space-y-3">
            {script.faqs.map((f, i) => (
              <details
                key={i}
                className="rounded-lg border border-slate-200 bg-white"
              >
                <summary className="cursor-pointer list-none px-4 py-3 font-semibold text-slate-900 hover:bg-slate-50">
                  {f.q}
                </summary>
                <p className="px-4 pb-4 pt-1 text-sm text-slate-600 leading-relaxed">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* SISTER SURFACES — funnel-hub cross-links. */}
        <nav className="space-y-2 border-t border-slate-200 pt-8">
          <p className="text-xs uppercase tracking-[0.18em] font-bold text-slate-500">
            Same arc, other formats
          </p>
          <ul className="text-sm space-y-1">
            <li>
              <Link href="/walkthrough" className="text-emerald-700 hover:underline">
                /walkthrough
              </Link>{" "}
              <span className="text-slate-500">— the 12-minute written version with full Stack and FAQs.</span>
            </li>
            <li>
              <Link href="/walkthrough/5min" className="text-emerald-700 hover:underline">
                /walkthrough/5min
              </Link>{" "}
              <span className="text-slate-500">— condensed 5-minute frame.</span>
            </li>
            <li>
              <Link href="/watch" className="text-emerald-700 hover:underline">
                /watch
              </Link>{" "}
              <span className="text-slate-500">— silent 90-second visual demo.</span>
            </li>
            <li>
              <Link href="/state-of-github" className="text-emerald-700 hover:underline">
                /state-of-github
              </Link>{" "}
              <span className="text-slate-500">— monthly founder talk (synthetic-voice address).</span>
            </li>
            <li>
              <Link href="/predicted" className="text-emerald-700 hover:underline">
                /predicted
              </Link>{" "}
              <span className="text-slate-500">— weekly Acceleration Watch (90-second video).</span>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}
