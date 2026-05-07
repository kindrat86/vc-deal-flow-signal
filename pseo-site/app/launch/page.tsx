import type { Metadata } from "next";
import Link from "next/link";
import { LAUNCHES } from "@/content/launches";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";

const SITE = "https://signals.gitdealflow.com";

export const metadata: Metadata = {
  title: "Launches — VC Deal Flow Signal",
  description:
    "Active and archived launches. Each entry is a 4-stage Product Launch Funnel: problem, broken solution, the fix, the open cart.",
  alternates: { canonical: "/launch" },
  openGraph: {
    title: "Launches — VC Deal Flow Signal",
    description:
      "Active and archived launches. Each entry is a 4-stage Product Launch Funnel: problem, broken solution, the fix, the open cart.",
    type: "article",
    url: `${SITE}/launch`,
  },
};

export const dynamic = "force-static";

export default function LaunchIndex() {
  const open = LAUNCHES.filter((l) => l.isOpen);
  const closed = LAUNCHES.filter((l) => !l.isOpen);

  return (
    <>
      <AgentMirrorLinks path="/launch" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-3">
          <p className="text-sky-400 text-xs font-medium uppercase tracking-wider">
            Product Launches · 4-stage funnels
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            Every launch, with the cart open or the window closed.
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            Each entry is a 4-stage Product Launch Funnel — problem, why current
            fixes fail, the fix I built, and the open cart. Permanent record so
            you can see the offer that was on the table when the window was
            open.
          </p>
        </header>

        {open.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
              Cart open
            </h2>
            <div className="grid gap-4">
              {open.map((l) => (
                <Link
                  key={l.slug}
                  href={`/launch/${l.slug}`}
                  className="group block rounded-xl border border-amber-700/40 bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950 p-6 hover:border-amber-500/60 transition-colors"
                >
                  <p className="text-amber-300 text-[11px] font-semibold uppercase tracking-wider mb-2">
                    Launch open · closes{" "}
                    {new Date(l.closesAt).toUTCString().replace(":00 GMT", " UTC")}
                  </p>
                  <h3 className="text-gray-100 font-bold text-xl leading-snug group-hover:text-amber-200 transition-colors">
                    {l.headline}
                  </h3>
                  <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                    {l.hook}
                  </p>
                  <p className="text-amber-300 text-sm mt-3 inline-flex items-center gap-1">
                    Read the launch <span aria-hidden>→</span>
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {closed.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
              Archive
            </h2>
            <div className="grid gap-3">
              {closed.map((l) => (
                <Link
                  key={l.slug}
                  href={`/launch/${l.slug}`}
                  className="block rounded-lg border border-slate-800 bg-slate-900/40 p-4 hover:border-slate-600 transition-colors"
                >
                  <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider mb-1">
                    Closed
                  </p>
                  <h3 className="text-gray-100 font-semibold text-base leading-snug">
                    {l.headline}
                  </h3>
                  <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">
                    {l.hook}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <p className="text-gray-400 text-sm border-t border-slate-800 pt-5">
          See every door at{" "}
          <Link
            href="/funnels"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
          >
            /funnels
          </Link>
          .
        </p>
      </div>
    </>
  );
}
