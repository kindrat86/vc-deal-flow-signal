import Link from "next/link";

export type CompanyProof = {
  name: string;
  portfolioEvidence: string;
  github: string;
  observation: string;
  question: string;
};

export type ProofAsset = {
  id: string;
  fund: string;
  generated: string;
  scope: string;
  why: string;
  companies: CompanyProof[];
  limitations: string;
  methodology: string;
};

export default function ProofAssetView({ asset }: { asset: ProofAsset }) {
  return (
    <main className="min-h-screen bg-slate-950 px-5 py-14 text-slate-100 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <header className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-signal-400">
            Prepared for {asset.fund}
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Public engineering watchlist
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Two portfolio companies with current, attributable public GitHub activity.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm text-slate-300">
            <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5">
              Generated {asset.generated}
            </span>
            <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5">
              {asset.scope}
            </span>
          </div>
        </header>

        <section className="mx-auto mt-12 max-w-3xl rounded-2xl border border-slate-700 bg-slate-900/80 p-6 text-left shadow-xl shadow-black/10 sm:p-8">
          <h2 className="text-xl font-semibold text-white">Why these two</h2>
          <p className="mt-3 leading-7 text-slate-300">{asset.why}</p>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          {asset.companies.map((company, index) => (
            <article
              className="rounded-2xl border border-slate-700 bg-slate-900 p-6 text-left shadow-xl shadow-black/10 sm:p-8"
              key={company.name}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-signal-500 font-bold text-slate-950">
                  {index + 1}
                </span>
                <h2 className="text-2xl font-semibold text-white">{company.name}</h2>
              </div>

              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-signal-400">
                    Public observation
                  </h3>
                  <p className="mt-2 leading-7 text-slate-300">{company.observation}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-signal-400">
                    Diligence question
                  </h3>
                  <p className="mt-2 leading-7 text-slate-300">{company.question}</p>
                </div>
                <div className="flex flex-wrap gap-3 border-t border-slate-800 pt-5 text-sm">
                  <a
                    className="rounded-lg border border-slate-700 px-3 py-2 font-medium text-sky-300 transition hover:border-sky-500 hover:text-sky-200"
                    href={company.portfolioEvidence}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Portfolio evidence
                  </a>
                  <a
                    className="rounded-lg border border-slate-700 px-3 py-2 font-medium text-sky-300 transition hover:border-sky-500 hover:text-sky-200"
                    href={company.github}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Public GitHub
                  </a>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="mx-auto mt-8 max-w-3xl rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 text-left sm:p-8">
          <h2 className="text-xl font-semibold text-amber-100">How to read this</h2>
          <p className="mt-3 leading-7 text-amber-50/90">{asset.limitations}</p>
          <p className="mt-4 text-sm text-amber-50/75">
            Prepared by GitDealFlow from public sources. No private data.
          </p>
        </section>

        <footer className="mt-10 text-center text-sm text-slate-400">
          <Link className="font-medium text-sky-300 hover:text-sky-200" href="/methodology">
            Read the methodology
          </Link>
          <span className="mx-3" aria-hidden="true">·</span>
          <Link className="font-medium text-sky-300 hover:text-sky-200" href="/about">
            About GitDealFlow
          </Link>
        </footer>
      </div>
    </main>
  );
}
