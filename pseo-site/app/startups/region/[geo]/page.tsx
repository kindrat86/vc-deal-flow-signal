import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getRegionDirectory,
  getAllDirectoryRegions,
  paginate,
  totalPagesFor,
  DIRECTORY_PAGE_SIZE,
} from "@/lib/directory";
import StartupDirectory from "@/components/StartupDirectory";
import { FRESH_YEAR_STR } from "@/lib/freshness-year";

interface PageProps {
  params: Promise<{ geo: string }>;
}

export const dynamicParams = false;
export const revalidate = 604800;

export function generateStaticParams() {
  return getAllDirectoryRegions().map((r) => ({ geo: r.geoSlug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { geo } = await params;
  const d = getRegionDirectory(geo);
  if (!d) return {};

  const title = `${d.geoName} Startups Directory (${FRESH_YEAR_STR})`;
  const description = `Browse all ${d.startups.length} tracked ${d.geoName} startups ranked by GitHub engineering acceleration (${d.period.name}). Paginated, free, every company links to its live signal profile.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "website", url: `/startups/region/${geo}` },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: `/startups/region/${geo}` },
  };
}

export default async function RegionDirectoryPage({ params }: PageProps) {
  const { geo } = await params;
  const d = getRegionDirectory(geo);
  if (!d) notFound();

  const totalPages = totalPagesFor(d.startups.length);
  const pageStartups = paginate(d.startups, 1, DIRECTORY_PAGE_SIZE);

  return (
    <StartupDirectory
      title={`${d.geoName} Startups Directory`}
      subtitle={`All ${d.startups.length} tracked ${d.geoName} startups ranked by GitHub engineering acceleration (${d.period.name}), sorted by commit-velocity change. Every company links to its full signal profile.`}
      startups={pageStartups}
      page={1}
      totalPages={totalPages}
      periodName={d.period.name}
      totalCount={d.startups.length}
      basePath={`/startups/region/${geo}`}
      breadcrumb={[
        { label: "Home", href: "/" },
        { label: "Startup Directory", href: "/startups" },
        { label: d.geoName, href: `/startups/region/${geo}` },
      ]}
      listName={`${d.geoName} startups, page 1`}
    />
  );
}
