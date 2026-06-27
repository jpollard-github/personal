import assert from "node:assert/strict";
import test from "node:test";
import { formatHours, percent, titleCase } from "../../app/music/shared";

test("formatHours keeps one decimal place under 100 hours", () => {
  assert.equal(formatHours(75.94), "75.9");
});

test("percent keeps a visible minimum bar", () => {
  assert.equal(percent(0, 100), "2.00%");
  assert.equal(percent(50, 100), "50.00%");
});

test("titleCase capitalizes each word boundary", () => {
  assert.equal(titleCase("black metal"), "Black Metal");
});
