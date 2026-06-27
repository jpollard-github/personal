import { renderRssFeed } from "../../lib/rss";
import {
  getPublicTinyThoughts,
  tinyThoughtCategories,
  type TinyThoughtCategory,
} from "../../lib/tiny-thoughts";
import { absoluteUrl, siteConfig } from "../../seo";

const tinyThoughtCategoryNames = new Map<TinyThoughtCategory, string>(
  tinyThoughtCategories.map((category) => [category, category.replace(/-/g, " ")]),
);

export const runtime = "nodejs";

function summarizeThought(content: string) {
  const compact = content.replace(/\s+/g, " ").trim();

  if (compact.length <= 180) {
    return compact;
  }

  return `${compact.slice(0, 177).trimEnd()}...`;
}

export async function GET() {
  const thoughts = await getPublicTinyThoughts();
  const items = thoughts.map((thought) => ({
    title: `${tinyThoughtCategoryNames.get(thought.category) ?? "tiny thought"}: ${summarizeThought(thought.content).slice(0, 72)}`,
    link: absoluteUrl("/#tiny-thoughts"),
    guid: absoluteUrl(`/#tiny-thought-${thought.id}`),
    description: summarizeThought(thought.content),
    pubDate: new Date(thought.createdAt).toUTCString(),
  }));

  const body = renderRssFeed({
    title: `${siteConfig.name} Tiny Thoughts`,
    link: absoluteUrl("/tiny-thoughts/rss.xml"),
    description: "Short recurring notes, observations, jokes, and signals from the counter on ArcadeGhosts.",
    items,
  });

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=900, stale-while-revalidate=3600",
    },
  });
}
