import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-gray-400 text-sm max-w-md">
            VC Deal Flow Signal tracks GitHub engineering acceleration as a
            leading indicator of startup momentum. Data is updated weekly.
          </p>
          <nav className="flex items-center gap-4 text-sm text-gray-500">
            <Link
              href="https://gitdealflow.com"
              className="hover:text-gray-300 transition-colors"
            >
              Main Site
            </Link>
            <a
              href="https://t.me/gitdealflow"
              className="hover:text-gray-300 transition-colors"
              rel="noopener noreferrer"
              target="_blank"
            >
              Telegram
            </a>
            <a
              href="https://x.com/data_nerd"
              className="hover:text-gray-300 transition-colors"
              rel="noopener noreferrer"
              target="_blank"
            >
              Twitter/X
            </a>
            <Link
              href="https://gitdealflow.com/privacy"
              className="hover:text-gray-300 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="https://gitdealflow.com/terms"
              className="hover:text-gray-300 transition-colors"
            >
              Terms
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
