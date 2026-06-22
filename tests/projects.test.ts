import assert from "node:assert/strict";
import test from "node:test";
import {
  formatStoredProjectDate,
  normalizeProjectDate,
  normalizeProjectHref,
  normalizeProjectPriority,
  resolveProjectLastUpdatedAt,
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

test("formatStoredProjectDate normalizes stored date values", () => {
  assert.equal(formatStoredProjectDate("2026-06-20"), "2026-06-20");
  assert.equal(formatStoredProjectDate("2026-06-20T14:30:00.000Z"), "2026-06-20");
  assert.equal(formatStoredProjectDate(""), "");
});

test("formatStoredProjectDate uses the project timezone for timestamps", () => {
  assert.equal(formatStoredProjectDate("2026-06-22T01:30:00.000Z"), "2026-06-21");
});

test("resolveProjectLastUpdatedAt bumps unchanged save dates to today", () => {
  assert.equal(
    resolveProjectLastUpdatedAt({
      incomingLastUpdatedAt: "2026-06-20",
      existingLastUpdatedAt: "2026-06-20",
      now: new Date("2026-06-22T01:30:00.000Z"),
    }),
    "2026-06-21",
  );
});

test("resolveProjectLastUpdatedAt respects explicit manual overrides", () => {
  assert.equal(
    resolveProjectLastUpdatedAt({
      incomingLastUpdatedAt: "2026-06-15",
      existingLastUpdatedAt: "2026-06-20",
      now: new Date("2026-06-21T12:00:00.000Z"),
    }),
    "2026-06-15",
  );
});
