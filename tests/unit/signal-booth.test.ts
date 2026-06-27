import assert from "node:assert/strict";
import test from "node:test";
import {
  getSignalBoothOptionsForMode,
  signalBoothOptions,
} from "../../app/signal-booth-data";

test("random mode returns the full signal list", () => {
  assert.equal(
    getSignalBoothOptionsForMode("random").length,
    signalBoothOptions.length,
  );
});

test("category modes return matching tagged signals", () => {
  const spookySignals = getSignalBoothOptionsForMode("spooky");
  const catSignals = getSignalBoothOptionsForMode("cat");
  const twinPeaksSignals = getSignalBoothOptionsForMode("twin-peaks");

  assert.ok(spookySignals.length > 0);
  assert.ok(catSignals.length > 0);
  assert.ok(twinPeaksSignals.length > 0);

  assert.ok(spookySignals.every((signal) => signal.modes.includes("spooky")));
  assert.ok(catSignals.every((signal) => signal.modes.includes("cat")));
  assert.ok(
    twinPeaksSignals.every((signal) => signal.modes.includes("twin-peaks")),
  );
});
