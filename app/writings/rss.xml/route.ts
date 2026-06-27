import { stat } from "node:fs/promises";
import path from "node:path";
import { renderRssFeed } from "../../lib/rss";
import { absoluteUrl, siteConfig } from "../../seo";
import { writings } from "../../writings";

export const runtime = "nodejs";

export async function GET() {
  const items = await Promise.all(
    writings.map(async (writing) => {
      const filePath = path.join(process.cwd(), "public", "writings", `${writing.slug}.md`);
      const fileStat = await stat(filePath);

      return {
        title: writing.title,
        link: absoluteUrl(`/writings/${writing.slug}`),
        guid: absoluteUrl(`/writings/${writing.slug}`),
        description: writing.description,
        pubDate: fileStat.mtime.toUTCString(),
      };
    }),
  );

  const body = renderRssFeed({
    title: `${siteConfig.name} Writing`,
    link: absoluteUrl("/writings/rss.xml"),
    description: "Essays and longer signals from Jason Pollard on ArcadeGhosts.",
    items,
  });

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
