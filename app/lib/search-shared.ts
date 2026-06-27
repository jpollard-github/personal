export type SearchEntry = {
  id: string;
  type: "page" | "writing" | "project" | "tiny-thought";
  title: string;
  description: string;
  href: string;
  eyebrow: string;
  cta: string;
  priority: number;
  searchText: string;
};

function normalizeSearchText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s/-]+/g, " ").replace(/\s+/g, " ").trim();
}

export function searchEntries(entries: SearchEntry[], query: string) {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return [...entries].sort((left, right) => right.priority - left.priority).slice(0, 18);
  }

  const terms = normalizedQuery.split(" ").filter(Boolean);

  return entries
    .map((entry) => {
      const title = normalizeSearchText(entry.title);
      const description = normalizeSearchText(entry.description);
      const eyebrow = normalizeSearchText(entry.eyebrow);
      const haystack = normalizeSearchText(
        `${entry.title} ${entry.description} ${entry.eyebrow} ${entry.searchText}`,
      );
      let score = entry.priority;

      for (const term of terms) {
        if (title.includes(term)) {
          score += 16;
        }

        if (description.includes(term)) {
          score += 8;
        }

        if (eyebrow.includes(term)) {
          score += 6;
        }

        if (haystack.includes(term)) {
          score += 4;
        }
      }

      return {
        entry,
        score,
      };
    })
    .filter((item) => item.score > item.entry.priority)
    .sort((left, right) => right.score - left.score || right.entry.priority - left.entry.priority)
    .map((item) => item.entry);
}
