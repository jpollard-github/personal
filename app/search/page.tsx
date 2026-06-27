import type { Metadata } from "next";
import { getSearchEntries } from "../lib/search";
import { SearchPageClient } from "./SearchPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search",
  description:
    "Search writings, projects, Tiny Thoughts, cat rooms, games, and signals across ArcadeGhosts.",
  alternates: {
    canonical: "/search",
  },
  openGraph: {
    title: "Search ArcadeGhosts",
    description:
      "Find writings, projects, Tiny Thoughts, games, music, and strange little signals across the site.",
    url: "/search",
  },
};

export default async function SearchPage() {
  const entries = await getSearchEntries();

  return (
    <main className="search-page">
      <SearchPageClient entries={entries} />
    </main>
  );
}
