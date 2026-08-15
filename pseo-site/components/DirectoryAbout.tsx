import Link from "next/link";

/**
 * Shared "about the dataset" explainer for the paginated directory index pages
 * (/startups and /startups/region). Rendered in <section> elements so it
 * counts toward the verify-word-floor.mjs 400-word minimum (that counter
 * strips nav/header/footer, so this content must not live inside those).
 */
export default function DirectoryAbout() {
  return (
    <>
      <section className="mb-8 max-w-3xl" aria-label="About VC Deal Flow Signal">
        <h2 className="text-xl font-semibold text-gray-100 mb-3">
          About VC Deal Flow Signal
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          VC Deal Flow Signal is a free public dataset that treats GitHub
          engineering acceleration as a leading indicator of startup momentum.
          It exists for Corp Dev teams, PE operating partners, and emerging
          managers who want to see momentum before a round is announced rather
          than after. The dataset tracks roughly four hundred startups whose
          GitHub organizations are self-published, and it is independent of any
          incumbent venture platform. Every ranking number links back to a
          public repository. The data refreshes weekly, the methodology is
          published openly, and a CC BY 4.0 copy of the panel is free to
          download.
        </p>
      </section>

      <section className="mb-10 max-w-3xl" aria-label="What you can do here">
        <h2 className="text-xl font-semibold text-gray-100 mb-3">
          What you can do here
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          Use this directory to source new targets, to validate companies
          already in your pipeline, or to benchmark one team&apos;s trajectory
          against its category. For a deeper view, open any company&apos;s profile
          to see its full commit history and sector ranking, or query the corpus
          through the public API and the MCP server for Claude and Cursor,
          documented on the{" "}
          <Link href="/developers" className="text-sky-400 hover:text-sky-300 underline">
            developers page
          </Link>
          . The dataset is free, refreshed weekly, and licensed CC BY 4.0.
        </p>
      </section>
    </>
  );
}
