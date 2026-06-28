import { readFileSync } from "node:fs";

export type PersonaSection = {
  heading: string;
  body: string;
};

export type PersonaSectionGroup = {
  identity: PersonaSection[];
  behavior: PersonaSection[];
  evaluation: PersonaSection[];
  other: PersonaSection[];
};

export type PersonaProfile = {
  name: string;
  sections: PersonaSection[];
  sectionMap: Record<string, string>;
  groupedSections: PersonaSectionGroup;
  fullText: string;
  markdown: string;
  keywords: string[];
};

const STOP_WORDS = new Set([
  "about",
  "after",
  "again",
  "also",
  "because",
  "been",
  "both",
  "come",
  "does",
  "dont",
  "each",
  "feel",
  "from",
  "have",
  "hers",
  "herself",
  "into",
  "isnt",
  "just",
  "likely",
  "little",
  "looks",
  "make",
  "more",
  "most",
  "much",
  "need",
  "other",
  "over",
  "probably",
  "really",
  "same",
  "shes",
  "should",
  "since",
  "some",
  "someone",
  "sometimes",
  "still",
  "that",
  "their",
  "them",
  "then",
  "there",
  "these",
  "they",
  "thing",
  "this",
  "through",
  "very",
  "want",
  "wants",
  "what",
  "when",
  "where",
  "which",
  "while",
  "with",
  "would",
  "your",
  "youre",
]);

export function loadPersonaProfile(filePath: string): PersonaProfile {
  return parsePersonaMarkdown(readFileSync(filePath, "utf8"));
}

export function parsePersonaMarkdown(markdown: string): PersonaProfile {
  const lines = markdown.split(/\r?\n/);
  const name = lines.find((line) => line.startsWith("# "))?.replace(/^# /, "").trim() ?? "Persona";
  const sections: PersonaSection[] = [];
  let currentHeading = "Overview";
  let currentLines: string[] = [];

  for (const line of lines.slice(1)) {
    if (/^#{2,3}\s+/.test(line)) {
      pushSection(sections, currentHeading, currentLines);
      currentHeading = line.replace(/^#{2,3}\s+/, "").trim();
      currentLines = [];
      continue;
    }

    currentLines.push(line);
  }

  pushSection(sections, currentHeading, currentLines);

  const fullText = sections.map((section) => section.body).join("\n").trim();

  return {
    name,
    sections,
    sectionMap: buildSectionMap(sections),
    groupedSections: groupSections(sections),
    fullText,
    markdown,
    keywords: extractKeywords(markdown),
  };
}

function pushSection(sections: PersonaSection[], heading: string, lines: string[]) {
  const body = lines.join("\n").trim();

  if (!body) {
    return;
  }

  sections.push({ heading, body });
}

function buildSectionMap(sections: PersonaSection[]) {
  return Object.fromEntries(
    sections.map((section) => [normalizeHeading(section.heading), section.body]),
  );
}

function groupSections(sections: PersonaSection[]): PersonaSectionGroup {
  const grouped: PersonaSectionGroup = {
    identity: [],
    behavior: [],
    evaluation: [],
    other: [],
  };

  for (const section of sections) {
    const normalized = normalizeHeading(section.heading);

    if (IDENTITY_HEADINGS.has(normalized)) {
      grouped.identity.push(section);
      continue;
    }

    if (BEHAVIOR_HEADINGS.has(normalized)) {
      grouped.behavior.push(section);
      continue;
    }

    if (EVALUATION_HEADINGS.has(normalized)) {
      grouped.evaluation.push(section);
      continue;
    }

    grouped.other.push(section);
  }

  return grouped;
}

function normalizeHeading(heading: string) {
  return heading.trim().toLowerCase();
}

const IDENTITY_HEADINGS = new Set([
  "identity fields",
  "identity",
  "background",
  "values",
  "emotional needs",
  "trust signals",
  "red flags",
]);

const BEHAVIOR_HEADINGS = new Set([
  "behavior fields",
  "behavior",
  "preferred rooms",
  "ignored rooms",
  "first-visit behavior",
  "default archetype",
  "scenario",
  "context",
  "return triggers",
]);

const EVALUATION_HEADINGS = new Set([
  "evaluation fields",
  "evaluation",
  "reflection",
  "success",
  "failure",
]);

function extractKeywords(markdown: string) {
  const counts = new Map<string, number>();

  for (const rawWord of markdown.toLowerCase().match(/[a-z][a-z-]{2,}/g) ?? []) {
    const word = rawWord.replace(/^-+|-+$/g, "");

    if (word.length < 4 || STOP_WORDS.has(word)) {
      continue;
    }

    counts.set(word, (counts.get(word) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, 40)
    .map(([word]) => word);
}
