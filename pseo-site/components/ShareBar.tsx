"use client";

interface ShareBarProps {
  title: string;
  url: string;
}

export default function ShareBar({ title, url }: ShareBarProps) {
  const fullUrl = `https://signals.gitdealflow.com${url}`;
  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedTitle = encodeURIComponent(title);

  const twitterText = encodeURIComponent(
    `${title}\n\nGitHub engineering acceleration data for investors.\n`
  );

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm">
      <span className="text-gray-500 text-xs font-medium uppercase tracking-wider">
        Share
      </span>
      <a
        href={`https://x.com/intent/tweet?text=${twitterText}&url=${encodedUrl}&via=data_nerd`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border border-slate-700 bg-slate-800/50 px-3 py-1.5 text-xs text-gray-400 hover:text-sky-400 hover:border-sky-500/40 transition-colors"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Twitter/X
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border border-slate-700 bg-slate-800/50 px-3 py-1.5 text-xs text-gray-400 hover:text-sky-400 hover:border-sky-500/40 transition-colors"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
        LinkedIn
      </a>
      <button
        onClick={() => {
          navigator.clipboard.writeText(fullUrl);
          const btn = document.activeElement as HTMLButtonElement;
          const original = btn.textContent;
          btn.textContent = "Copied!";
          setTimeout(() => {
            btn.textContent = original;
          }, 2000);
        }}
        className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border border-slate-700 bg-slate-800/50 px-3 py-1.5 text-xs text-gray-400 hover:text-sky-400 hover:border-sky-500/40 transition-colors cursor-pointer"
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.04a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.34 8.374"
          />
        </svg>
        Copy Link
      </button>
    </div>
  );
}
