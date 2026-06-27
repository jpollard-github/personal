import assert from "node:assert/strict";
import test from "node:test";
import {
  defaultContextRefreshProfile,
  normalizeContextRefreshLineList,
  normalizeContextRefreshProfileInput,
} from "../../app/lib/context-refresh";

test("normalizeContextRefreshLineList trims lines and removes blanks", () => {
  assert.deepEqual(
    normalizeContextRefreshLineList("  first  \n\nsecond\n third  "),
    ["first", "second", "third"],
  );
});

test("normalizeContextRefreshProfileInput falls back to durable defaults", () => {
  const profile = normalizeContextRefreshProfileInput({
    name: "  Jason Pollard  ",
    preferredName: "  Jason ",
    memoryCore: "\n",
    creativeThemes: ["  Weird web  ", " Nostalgia "],
    conversationPreferences: "Be direct\n\nAsk good questions",
  });

  assert.equal(profile.name, "Jason Pollard");
  assert.equal(profile.preferredName, "Jason");
  assert.deepEqual(profile.memoryCore, defaultContextRefreshProfile.memoryCore);
  assert.deepEqual(profile.creativeThemes, ["Weird web", "Nostalgia"]);
  assert.deepEqual(profile.conversationPreferences, [
    "Be direct",
    "Ask good questions",
  ]);
});
