import assert from "node:assert/strict";
import test from "node:test";
import {
  normalizeSocialQuestConfidence,
  normalizeSocialQuestCount,
  normalizeSocialQuestDate,
  normalizeSocialQuestTags,
  normalizeSocialQuestText,
} from "../../app/lib/social-quest-log";

test("normalizeSocialQuestText trims control characters and preserves readable spacing", () => {
  assert.equal(
    normalizeSocialQuestText("  stayed\tfor the second half\u0000  "),
    "stayed for the second half",
  );
});

test("normalizeSocialQuestDate only accepts yyyy-mm-dd", () => {
  assert.equal(normalizeSocialQuestDate("2026-06-21"), "2026-06-21");
  assert.equal(normalizeSocialQuestDate("06/21/2026"), "");
});

test("normalizeSocialQuestCount clamps to the supported range", () => {
  assert.equal(normalizeSocialQuestCount(-4), 0);
  assert.equal(normalizeSocialQuestCount(120), 99);
  assert.equal(normalizeSocialQuestCount("7"), 7);
});

test("normalizeSocialQuestConfidence stays within the one-to-five scale", () => {
  assert.equal(normalizeSocialQuestConfidence(0), 1);
  assert.equal(normalizeSocialQuestConfidence(7), 5);
});

test("normalizeSocialQuestTags deduplicates and sluggifies tags", () => {
  assert.deepEqual(normalizeSocialQuestTags("Showed Up, showed up, Brave Move"), [
    "showed-up",
    "brave-move",
  ]);
});
