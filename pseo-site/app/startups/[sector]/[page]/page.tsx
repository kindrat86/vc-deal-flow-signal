import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getSectorDirectory,
  getAllSectorDirectoryPages,
  paginate,
  totalPagesFor,
  DIRECTORY_PAGE_SIZE,
} from "@/lib/directory";
import StartupDirectory from "@/components/StartupDirectory";
import { FRESH_YEAR_STR } from "@/lib/freshness-year";
import { withEditorialOverride } from "@/lib/metadata";

interface PageProps {
  params: Promise<{ sector: string; page: string }>;
}

export const dynamicParams = false;
export const revalidate = 604800;

export function generateStaticParams() {
  return getAllSectorDirectoryPages().map(({ slug, page }) => ({
    sector: slug,
    page: String(page),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { sector, page: pageStr } = await params;
  const page = Number(pageStr);
  const d = getSectorDirectory(sector);
  if (!d || !Number.isInteger(page) || page < 2) return {};

  const totalPages = totalPagesFor(d.startups.length);
  if (page > totalPages) return {};

  const title = `${d.name} Startups Directory, Page ${page} (${FRESH_YEAR_STR})`;
  const description = `Page ${page} of the ${d.name} startups directory: ${d.name.toLowerCase()} startups ranked ${page > 1 ? "positions " + ((page - 1) * DIRECTORY_PAGE_SIZE + 1) + " and beyond" : "by GitHub engineering acceleration"}, every company links to its live signal profile.`;

  return withEditorialOverride({
    title,
    description,
    openGraph: { title, description, type: "website", url: `/startups/${sector}/${page}` },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: `/startups/${sector}/${page}` },
  });
}

export default async function SectorDirectorySubPage({ params }: PageProps) {
  const { sector, page: pageStr } = await params;
  const page = Number(pageStr);
  const d = getSectorDirectory(sector);
  if (!d || !Number.isInteger(page) || page < 2) notFound();

  const totalPages = totalPagesFor(d.startups.length);
  if (page > totalPages) notFound();

  const pageStartups = paginate(d.startups, page, DIRECTORY_PAGE_SIZE);
  const startRank = (page - 1) * DIRECTORY_PAGE_SIZE + 1;

  return (
    <StartupDirectory
      title={`${d.name} Startups Directory, Page ${page}`}
      subtitle={`Page ${page} of ${totalPages}: ${d.name.toLowerCase()} startups ranked by GitHub engineering acceleration (${d.period.name}), positions ${startRank} and beyond. Every company links to its full signal profile.`}
      startups={pageStartups}
      page={page}
      totalPages={totalPages}
      periodName={d.period.name}
      totalCount={d.startups.length}
      basePath={`/startups/${sector}`}
      breadcrumb={[
        { label: "Home", href: "/" },
        { label: "Startup Directory", href: "/startups" },
        { label: d.name, href: `/startups/${sector}` },
        { label: `Page ${page}`, href: `/startups/${sector}/${page}` },
      ]}
      listName={`${d.name} startups, page ${page}`}
    />
  );
}
