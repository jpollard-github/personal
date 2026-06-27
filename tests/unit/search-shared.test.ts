import assert from "node:assert/strict";
import test from "node:test";
import { searchEntries, type SearchEntry } from "../../app/lib/search-shared";

const entries: SearchEntry[] = [
  {
    id: "writing-1",
    type: "writing",
    title: "Twin Peaks and Trying Again",
    description: "A reflection on signals, grief, and persistence.",
    href: "/writings/twin-peaks-and-trying-again",
    eyebrow: "Writing",
    cta: "Read writing",
    priority: 80,
    searchText: "twin peaks grief trying again reflection",
  },
  {
    id: "page-1",
    type: "page",
    title: "Music Room",
    description: "Playlists and listening archives.",
    href: "/music",
    eyebrow: "Listening room",
    cta: "Enter music room",
    priority: 90,
    searchText: "music playlists archive synth weather",
  },
  {
    id: "project-1",
    type: "project",
    title: "AI Session Kit",
    description: "Repo support for AI handoffs.",
    href: "https://github.com/example/ai-session-kit",
    eyebrow: "Project / active",
    cta: "Open project",
    priority: 70,
    searchText: "ai handoffs repo context session continuity",
  },
];

test("searchEntries returns featured entries in priority order for empty queries", () => {
  const results = searchEntries(entries, "   ");

  assert.deepEqual(
    results.map((entry) => entry.id),
    ["page-1", "writing-1", "project-1"],
  );
});

test("searchEntries ranks title matches above generic haystack matches", () => {
  const results = searchEntries(entries, "twin peaks");

  assert.equal(results[0]?.id, "writing-1");
});

test("searchEntries normalizes punctuation-heavy queries", () => {
  const results = searchEntries(entries, "AI!!! handoffs???");

  assert.equal(results[0]?.id, "project-1");
});

test("searchEntries returns no results when nothing matches", () => {
  const results = searchEntries(entries, "pinball wizard zebra");

  assert.deepEqual(results, []);
});
