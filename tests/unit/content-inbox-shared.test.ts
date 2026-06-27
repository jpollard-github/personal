import assert from "node:assert/strict";
import test from "node:test";
import {
  emptyContentInboxItem,
  isContentInboxBucket,
  isContentInboxSource,
  isContentInboxStatus,
  normalizeInboxText,
  toContentInboxItem,
} from "../../app/lib/content-inbox-shared";

test("normalizeInboxText strips control characters and preserves paragraph spacing", () => {
  assert.equal(
    normalizeInboxText("  first\t\tline\u0000\n\n\nsecond line  "),
    "first line\n\nsecond line",
  );
});

test("content inbox validators accept supported values and reject unknown ones", () => {
  assert.equal(isContentInboxSource("chatgpt"), true);
  assert.equal(isContentInboxSource("magazine"), false);
  assert.equal(isContentInboxBucket("now"), true);
  assert.equal(isContentInboxBucket("memoir"), false);
  assert.equal(isContentInboxStatus("drafted"), true);
  assert.equal(isContentInboxStatus("queued"), false);
});

test("emptyContentInboxItem returns a usable default draft", () => {
  const item = emptyContentInboxItem();

  assert.equal(item.source, "chatgpt");
  assert.equal(item.bucket, "not-sure");
  assert.equal(item.status, "inbox");
  assert.match(item.id, /^inbox-|^[0-9a-f-]{20,}$/i);
});

test("toContentInboxItem converts nullable row fields into editor-safe strings", () => {
  const item = toContentInboxItem({
    id: "inbox-1",
    title: null,
    content: "A useful note",
    source: "chatgpt",
    bucket: "essay",
    notes: null,
    status: "inbox",
    created_at: "2026-06-27T00:00:00.000Z",
    updated_at: "2026-06-27T00:00:00.000Z",
  });

  assert.equal(item.title, "");
  assert.equal(item.notes, "");
  assert.equal(item.bucket, "essay");
});
