import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getSectorDirectory,
  getAllDirectorySectors,
  paginate,
  totalPagesFor,
  DIRECTORY_PAGE_SIZE,
} from "@/lib/directory";
import StartupDirectory from "@/components/StartupDirectory";
import { FRESH_YEAR_STR } from "@/lib/freshness-year";

interface PageProps {
  params: Promise<{ sector: string }>;
}

export const dynamicParams = false;
export const revalidate = 604800;

export function generateStaticParams() {
  return getAllDirectorySectors().map((s) => ({ sector: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { sector } = await params;
  const d = getSectorDirectory(sector);
  if (!d) return {};

  const title = `${d.name} Startups Directory (${FRESH_YEAR_STR})`;
  const description = `Browse all ${d.startups.length} tracked ${d.name.toLowerCase()} startups ranked by GitHub engineering acceleration (${d.period.name}). Paginated, free, every company links to its live signal profile.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "website", url: `/startups/${sector}` },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: `/startups/${sector}` },
  };
}

export default async function SectorDirectoryPage({ params }: PageProps) {
  const { sector } = await params;
  const d = getSectorDirectory(sector);
  if (!d) notFound();

  const totalPages = totalPagesFor(d.startups.length);
  const pageStartups = paginate(d.startups, 1, DIRECTORY_PAGE_SIZE);

  return (
    <StartupDirectory
      title={`${d.name} Startups Directory`}
      subtitle={`All ${d.startups.length} tracked ${d.name.toLowerCase()} startups ranked by GitHub engineering acceleration (${d.period.name}), sorted by commit-velocity change. Every company links to its full signal profile.`}
      startups={pageStartups}
      page={1}
      totalPages={totalPages}
      basePath={`/startups/${sector}`}
      breadcrumb={[
        { label: "Home", href: "/" },
        { label: "Startup Directory", href: "/startups" },
        { label: d.name, href: `/startups/${sector}` },
      ]}
      listName={`${d.name} startups, page 1`}
    />
  );
}
