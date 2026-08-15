import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getRegionDirectory,
  getAllRegionDirectoryPages,
  paginate,
  totalPagesFor,
  DIRECTORY_PAGE_SIZE,
} from "@/lib/directory";
import StartupDirectory from "@/components/StartupDirectory";
import { FRESH_YEAR_STR } from "@/lib/freshness-year";

interface PageProps {
  params: Promise<{ geo: string; page: string }>;
}

export const dynamicParams = false;
export const revalidate = 604800;

export function generateStaticParams() {
  return getAllRegionDirectoryPages().map(({ geo, page }) => ({
    geo,
    page: String(page),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { geo, page: pageStr } = await params;
  const page = Number(pageStr);
  const d = getRegionDirectory(geo);
  if (!d || !Number.isInteger(page) || page < 2) return {};

  const totalPages = totalPagesFor(d.startups.length);
  if (page > totalPages) return {};

  const title = `${d.geoName} Startups Directory, Page ${page} (${FRESH_YEAR_STR})`;
  const description = `Page ${page} of the ${d.geoName} startups directory: tracked ${d.geoName} startups ranked by GitHub engineering acceleration, every company links to its live signal profile.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "website", url: `/startups/region/${geo}/${page}` },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: `/startups/region/${geo}/${page}` },
  };
}

export default async function RegionDirectorySubPage({ params }: PageProps) {
  const { geo, page: pageStr } = await params;
  const page = Number(pageStr);
  const d = getRegionDirectory(geo);
  if (!d || !Number.isInteger(page) || page < 2) notFound();

  const totalPages = totalPagesFor(d.startups.length);
  if (page > totalPages) notFound();

  const pageStartups = paginate(d.startups, page, DIRECTORY_PAGE_SIZE);
  const startRank = (page - 1) * DIRECTORY_PAGE_SIZE + 1;

  return (
    <StartupDirectory
      title={`${d.geoName} Startups Directory, Page ${page}`}
      subtitle={`Page ${page} of ${totalPages}: ${d.geoName} startups ranked by GitHub engineering acceleration (${d.period.name}), positions ${startRank} and beyond. Every company links to its full signal profile.`}
      startups={pageStartups}
      page={page}
      totalPages={totalPages}
      basePath={`/startups/region/${geo}`}
      breadcrumb={[
        { label: "Home", href: "/" },
        { label: "Startup Directory", href: "/startups" },
        { label: d.geoName, href: `/startups/region/${geo}` },
        { label: `Page ${page}`, href: `/startups/region/${geo}/${page}` },
      ]}
      listName={`${d.geoName} startups, page ${page}`}
    />
  );
}
