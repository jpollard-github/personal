import assert from "node:assert/strict";
import test from "node:test";
import {
  buildNowDraft,
  buildProjectDraft,
  buildTinyThoughtDraft,
  buildWritingDraft,
} from "../../app/lib/content-inbox-drafts";
import { contentInboxBuckets, type ContentInboxItem } from "../../app/lib/content-inbox-shared";

function createInboxItem(overrides: Partial<ContentInboxItem> = {}): ContentInboxItem {
  return {
    id: "inbox-1",
    title: "AI Connections",
    content: "A note about how AI tools connect ideas.",
    source: "chatgpt",
    bucket: "now",
    notes: "Might belong in current focus.",
    status: "inbox",
    createdAt: "2026-06-27T00:00:00.000Z",
    updatedAt: "2026-06-27T00:00:00.000Z",
    ...overrides,
  };
}

test("content inbox buckets include now", () => {
  assert.ok(contentInboxBuckets.includes("now"));
});

test("buildNowDraft maps now bucket into a current label", () => {
  assert.deepEqual(buildNowDraft(createInboxItem()), {
    label: "Current",
    title: "AI Connections",
    text: "A note about how AI tools connect ideas.",
  });
});

test("buildProjectDraft keeps project update context", () => {
  const draft = buildProjectDraft(createInboxItem({ bucket: "project-update" }));

  assert.equal(draft.type, "Project update");
  assert.equal(draft.description, "A note about how AI tools connect ideas.");
  assert.equal(draft.phase, "Might belong in current focus.");
});

test("buildTinyThoughtDraft sets conversation inspiration for chatgpt content", () => {
  const draft = buildTinyThoughtDraft(createInboxItem());

  assert.equal(draft.content, "A note about how AI tools connect ideas.");
  assert.equal(draft.inspiredByCategory, "conversation");
  assert.equal(draft.inspiredBy, "AI Connections");
});

test("buildWritingDraft includes source and bucket in notes", () => {
  const draft = buildWritingDraft({
    item: createInboxItem(),
    sourceLabel: "ChatGPT",
    bucketLabel: "Now",
  });

  assert.equal(draft.title, "AI Connections");
  assert.match(draft.notes ?? "", /Source: ChatGPT/);
  assert.match(draft.notes ?? "", /Bucket: Now/);
});
