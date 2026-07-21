// Route-level loading UI. A layout-shaped skeleton reads as "content is
// arriving" far better than a bare spinner, and it matches the site's dark
// slate palette + centered rhythm.
export default function Loading() {
  return (
    <div
      className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse"
      aria-busy="true"
      aria-label="Loading"
    >
      {/* kicker */}
      <div className="mx-auto h-3 w-40 rounded bg-slate-800/80" />
      {/* title */}
      <div className="mt-5 space-y-3">
        <div className="mx-auto h-8 w-11/12 rounded-lg bg-slate-800" />
        <div className="mx-auto h-8 w-3/4 rounded-lg bg-slate-800" />
      </div>
      {/* stat band */}
      <div className="mt-8 grid grid-cols-1 min-[440px]:grid-cols-3 gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-2">
            <div className="mx-auto h-2.5 w-24 rounded bg-slate-800" />
            <div className="mx-auto h-6 w-16 rounded bg-slate-700" />
          </div>
        ))}
      </div>
      {/* body lines */}
      <div className="mt-8 space-y-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-3.5 w-full max-w-[72ch] mx-auto rounded bg-slate-800/70" />
        ))}
        <div className="h-3.5 w-2/3 max-w-[72ch] mx-auto rounded bg-slate-800/70" />
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
