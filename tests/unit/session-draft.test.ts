import assert from "node:assert/strict";
import test from "node:test";
import { consumeSessionDraft, type StorageLike } from "../../app/lib/session-draft";

function createStorage(values: Record<string, string>): StorageLike {
  const store = new Map(Object.entries(values));

  return {
    getItem(key: string) {
      return store.get(key) ?? null;
    },
    removeItem(key: string) {
      store.delete(key);
    },
  };
}

test("consumeSessionDraft returns parsed data and removes it", () => {
  const storage = createStorage({
    draft: JSON.stringify({ title: "AI Connections" }),
  });

  const result = consumeSessionDraft<{ title: string }>(storage, "draft");

  assert.equal(result.hadValue, true);
  assert.equal(result.parseError, false);
  assert.deepEqual(result.value, { title: "AI Connections" });
  assert.equal(storage.getItem("draft"), null);
});

test("consumeSessionDraft reports parse errors and clears the invalid value", () => {
  const storage = createStorage({
    draft: "{not json}",
  });

  const result = consumeSessionDraft(storage, "draft");

  assert.equal(result.hadValue, true);
  assert.equal(result.parseError, true);
  assert.equal(result.value, null);
  assert.equal(storage.getItem("draft"), null);
});
