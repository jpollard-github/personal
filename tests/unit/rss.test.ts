import assert from "node:assert/strict";
import test from "node:test";
import { renderRssFeed } from "../../app/lib/rss";

test("renderRssFeed escapes xml-sensitive characters", () => {
  const xml = renderRssFeed({
    title: `Arcade & Ghosts`,
    link: "https://arcadeghosts.org/feed.xml",
    description: `Signals with "quotes" & <angles>`,
    items: [
      {
        title: `Cats < Coffee`,
        link: "https://arcadeghosts.org/cats",
        description: `Warm & strange`,
      },
    ],
  });

  assert.match(xml, /Arcade &amp; Ghosts/);
  assert.match(xml, /Signals with &quot;quotes&quot; &amp; &lt;angles&gt;/);
  assert.match(xml, /Cats &lt; Coffee/);
});

test("renderRssFeed uses item guid when present", () => {
  const xml = renderRssFeed({
    title: "ArcadeGhosts Writing",
    link: "https://arcadeghosts.org/writings/rss.xml",
    description: "Essays and signals",
    items: [
      {
        title: "My Piece",
        link: "https://arcadeghosts.org/writings/my-piece",
        guid: "custom-guid",
        description: "One piece",
      },
    ],
  });

  assert.match(xml, /<guid>custom-guid<\/guid>/);
});
