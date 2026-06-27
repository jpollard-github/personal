import assert from "node:assert/strict";
import test from "node:test";
import {
  normalizeAnalyticsEventName,
  normalizeAnalyticsProperties,
} from "../../app/lib/analytics-shared";

test("normalizeAnalyticsEventName trims and falls back when empty", () => {
  assert.equal(normalizeAnalyticsEventName("  Start Here Clicked  "), "Start Here Clicked");
  assert.equal(normalizeAnalyticsEventName("   "), "Unknown Event");
});

test("normalizeAnalyticsProperties keeps only flat analytics-safe values", () => {
  assert.deepEqual(
    normalizeAnalyticsProperties({
      source: "homepage",
      count: 3,
      enabled: true,
      nullable: null,
      nested: { no: "thanks" },
      fn: () => "nope",
      "": "empty key",
    }),
    {
      source: "homepage",
      count: 3,
      enabled: true,
      nullable: null,
    },
  );
});
