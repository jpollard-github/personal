function escapeXml(value: string) {
  return value.replace(/[<>&'"]/g, (character) => {
    switch (character) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return character;
    }
  });
}

type RssItem = {
  title: string;
  link: string;
  description: string;
  pubDate?: string;
  guid?: string;
};

type RssFeed = {
  title: string;
  link: string;
  description: string;
  items: RssItem[];
  lastBuildDate?: string;
};

export function renderRssFeed(feed: RssFeed) {
  const lastBuildDate =
    feed.lastBuildDate ??
    feed.items.find((item) => item.pubDate)?.pubDate ??
    new Date().toUTCString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(feed.title)}</title>
    <link>${escapeXml(feed.link)}</link>
    <description>${escapeXml(feed.description)}</description>
    <lastBuildDate>${escapeXml(lastBuildDate)}</lastBuildDate>
    ${feed.items
      .map(
        (item) => `<item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid>${escapeXml(item.guid ?? item.link)}</guid>
      <description>${escapeXml(item.description)}</description>
      ${item.pubDate ? `<pubDate>${escapeXml(item.pubDate)}</pubDate>` : ""}
    </item>`,
      )
      .join("\n")}
  </channel>
</rss>`;
}
