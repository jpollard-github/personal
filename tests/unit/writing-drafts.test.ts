import assert from "node:assert/strict";
import test from "node:test";
import {
  createWritingDraftEntrySnippet,
  createWritingDraftMarkdown,
  createWritingDraftPublishBundle,
  normalizeWritingDraftSlug,
  normalizeWritingDraftText,
  summarizeWritingDraftDescription,
} from "../../app/lib/writing-drafts";

test("normalizeWritingDraftSlug sluggifies and trims punctuation", () => {
  assert.equal(
    normalizeWritingDraftSlug("  AI, Connections! & Coffee  "),
    "ai-connections-coffee",
  );
});

test("normalizeWritingDraftText removes control characters and preserves paragraph breaks", () => {
  assert.equal(
    normalizeWritingDraftText("  one\t\tday\u0000\n\n\nsecond line  "),
    "one day\n\nsecond line",
  );
});

test("summarizeWritingDraftDescription prefers summary over body", () => {
  assert.equal(
    summarizeWritingDraftDescription({
      summary: "Short summary",
      body: "Longer body that should not be needed.",
    } as const),
    "Short summary",
  );
});

test("createWritingDraftMarkdown formats title and body", () => {
  assert.equal(
    createWritingDraftMarkdown({
      title: "AI Connections",
      body: "A longer note.",
    }),
    "**AI Connections**\n\nA longer note.\n",
  );
});

test("createWritingDraftEntrySnippet produces a usable metadata snippet", () => {
  const snippet = createWritingDraftEntrySnippet({
    slug: "ai-connections",
    title: "AI Connections",
    summary: "A short note.",
  });

  assert.match(snippet, /slug: "ai-connections"/);
  assert.match(snippet, /title: "AI Connections"/);
  assert.match(snippet, /icon: "📝"/);
});

test("createWritingDraftPublishBundle keeps slug, markdown, and derived description aligned", () => {
  const bundle = createWritingDraftPublishBundle({
    slug: "ai-connections",
    title: "AI Connections",
    summary: "",
    body: "A useful reflection on connected tools and ideas.",
  });

  assert.equal(bundle.slug, "ai-connections");
  assert.match(bundle.markdown, /\*\*AI Connections\*\*/);
  assert.match(bundle.entrySnippet, /slug: "ai-connections"/);
  assert.match(bundle.description, /useful reflection/i);
});
