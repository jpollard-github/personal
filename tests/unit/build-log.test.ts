import assert from "node:assert/strict";
import test from "node:test";
import { buildLogEntries, getRecentBuildLogEntries } from "../../app/lib/build-log";

test("getRecentBuildLogEntries returns newest-first entries up to the requested limit", () => {
  const entries = getRecentBuildLogEntries(3);

  assert.equal(entries.length, 3);
  assert.ok(entries[0].date >= entries[1].date);
  assert.ok(entries[1].date >= entries[2].date);
});

test("build log entries include meaningful public-facing content", () => {
  for (const entry of buildLogEntries) {
    assert.ok(entry.title.length > 0);
    assert.ok(entry.summary.length > 0);
    assert.ok(entry.details.length > 0);
    assert.ok(entry.impact.length > 0);
  }
});
