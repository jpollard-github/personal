import assert from "node:assert/strict";
import test from "node:test";
import {
  normalizeProjectDate,
  normalizeProjectHref,
  normalizeProjectPriority,
} from "../app/lib/projects";

test("normalizeProjectHref accepts safe paths and https urls", () => {
  assert.equal(normalizeProjectHref("/games/example"), "/games/example");
  assert.equal(normalizeProjectHref("https://github.com/jpollard-github/personal"), "https://github.com/jpollard-github/personal");
});

test("normalizeProjectHref rejects unsupported schemes", () => {
  assert.equal(normalizeProjectHref("javascript:alert(1)"), "");
});

test("normalizeProjectDate only accepts yyyy-mm-dd", () => {
  assert.equal(normalizeProjectDate("2026-06-20"), "2026-06-20");
  assert.equal(normalizeProjectDate("06/20/2026"), "");
});

test("normalizeProjectPriority clamps into the supported range", () => {
  assert.equal(normalizeProjectPriority(0), 1);
  assert.equal(normalizeProjectPriority(9), 5);
  assert.equal(normalizeProjectPriority("3"), 3);
});
