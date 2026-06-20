import assert from "node:assert/strict";
import test from "node:test";
import {
  normalizeTinyThoughtAttachments,
  normalizeTinyThoughtText,
  normalizeTinyThoughtUrl,
} from "../app/lib/tiny-thoughts";

test("normalizeTinyThoughtText trims control characters and collapses spacing", () => {
  assert.equal(normalizeTinyThoughtText("  hello\t\tworld\u0000  "), "hello world");
});

test("normalizeTinyThoughtUrl accepts http and https only", () => {
  assert.equal(normalizeTinyThoughtUrl("https://arcadeghosts.org"), "https://arcadeghosts.org/");
  assert.equal(normalizeTinyThoughtUrl("ftp://arcadeghosts.org"), "");
});

test("normalizeTinyThoughtAttachments keeps only valid attachments and caps the list", () => {
  const attachments = normalizeTinyThoughtAttachments([
    { type: "image", url: "https://example.com/a.png" },
    { type: "link", url: "https://example.com/post", title: " Read this " },
    { type: "link", url: "javascript:alert(1)" },
  ]);

  assert.deepEqual(attachments, [
    { type: "image", url: "https://example.com/a.png" },
    { type: "link", url: "https://example.com/post", title: "Read this" },
  ]);
});
