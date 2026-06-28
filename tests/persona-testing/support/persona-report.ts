import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Page } from "@playwright/test";
import type { PersonaDefinition } from "./persona-manifest";
import type { PersonaProfile } from "./persona-profile";
import type { SiteSurface } from "./site-surfaces";

export type SurfaceObservation = {
  surface: SiteSurface;
  status: "visited" | "skipped";
  reason?: string;
  title: string;
  headings: string[];
  excerpt: string;
  linkCount: number;
  buttonCount: number;
  inputCount: number;
  matchedTags: string[];
  interestScore: number;
  weightedInterestScore: number;
  usabilityScore: number;
  overwhelmLevel: "low" | "medium" | "high";
  notes: string[];
  personaPriority: "primary" | "secondary" | "ambient";
  screenshotPath?: string;
};

export type PersonaTodoBuckets = {
  high: string[];
  medium: string[];
  low: string[];
};

export type PersonaVerdict = {
  summary: string;
  fit: string;
  positives: string[];
  friction: string[];
};

export type PersonaReportSummary = {
  persona: string;
  personaSlug: string;
  generatedAt: string;
  personaDescription: string;
  personaProfileMarkdown: string;
  verdict: PersonaVerdict;
  averages: {
    interest: number;
    weightedInterest: number;
    usability: number;
  };
  todos: PersonaTodoBuckets;
  observations: SurfaceObservation[];
};

export async function inspectSurface(
  page: Page,
  surface: SiteSurface,
  profile: PersonaProfile,
  definition: PersonaDefinition,
  outputDir: string,
): Promise<SurfaceObservation> {
  mkdirSync(outputDir, { recursive: true });
  await page.goto(surface.path, { waitUntil: "domcontentloaded" });

  const title = await page.title();
  const headings = (await page.locator("h1, h2").allTextContents())
    .map((value) => normalizeWhitespace(value))
    .filter(Boolean)
    .slice(0, 8);

  const excerpt = normalizeWhitespace(
    await page
      .locator("main")
      .innerText()
      .catch(async () => page.locator("body").innerText()),
  ).slice(0, 600);

  const linkCount = await page.locator("a[href]").count();
  const buttonCount = await page.locator("button").count();
  const inputCount = await page.locator("input, textarea, select").count();
  const matchedTags = getMatchedTags(surface, profile, definition);
  const interestScore = clamp(1 + matchedTags.length, 1, 5);
  const personaPriority = getPersonaPriority(surface, definition, matchedTags);
  const weightedInterestScore = applyPersonaWeight(interestScore, personaPriority);
  const usabilityScore = scoreUsability({ headings, linkCount, buttonCount, inputCount, excerpt });
  const overwhelmLevel = computeOverwhelm({ linkCount, buttonCount, inputCount, excerpt });
  const screenshotPath = resolve(outputDir, `${surface.id}.png`);

  await page.screenshot({ path: screenshotPath, fullPage: true });

  return {
    surface,
    status: "visited",
    title,
    headings,
    excerpt,
    linkCount,
    buttonCount,
    inputCount,
    matchedTags,
    interestScore,
    weightedInterestScore,
    usabilityScore,
    overwhelmLevel,
    notes: buildNotes(surface, matchedTags, headings, overwhelmLevel, usabilityScore, personaPriority),
    personaPriority,
    screenshotPath,
  };
}

export function createSkippedObservation(surface: SiteSurface, reason: string): SurfaceObservation {
  return {
    surface,
    status: "skipped",
    reason,
    title: "",
    headings: [],
    excerpt: "",
    linkCount: 0,
    buttonCount: 0,
    inputCount: 0,
    matchedTags: [],
    interestScore: 0,
    weightedInterestScore: 0,
    usabilityScore: 0,
    overwhelmLevel: "low",
    notes: [reason],
    personaPriority: "ambient",
  };
}

export function writePersonaReport(args: {
  personaSlug: string;
  profile: PersonaProfile;
  definition: PersonaDefinition;
  observations: SurfaceObservation[];
}) {
  const { personaSlug, profile, definition, observations } = args;
  const outputDir = resolve(process.cwd(), "test-results", "personas", personaSlug);
  mkdirSync(outputDir, { recursive: true });

  const reportPath = resolve(outputDir, "report.md");
  const summaryPath = resolve(outputDir, "summary.json");

  const publicObservations = observations.filter((observation) => observation.surface.area === "public");
  const adminObservations = observations.filter((observation) => observation.surface.area === "admin");
  const visitedPublic = publicObservations.filter((observation) => observation.status === "visited");
  const visitedAll = observations.filter((observation) => observation.status === "visited");
  const averageInterest = average(visitedPublic.map((observation) => observation.interestScore));
  const averageWeightedInterest = average(
    visitedPublic.map((observation) => observation.weightedInterestScore),
  );
  const averageUsability = average(visitedAll.map((observation) => observation.usabilityScore));
  const highOverwhelmCount = observations.filter((observation) => observation.overwhelmLevel === "high").length;
  const mediumOverwhelmCount = observations.filter((observation) => observation.overwhelmLevel === "medium").length;
  const verdict = buildVerdict(averageWeightedInterest, averageUsability, highOverwhelmCount, definition);
  const todos = buildTodos(observations, definition);

  const report = `# ${profile.name} Persona Audit

Generated: ${new Date().toISOString()}

## Verdict

${verdict.summary}

- Site reflection score: \`${averageInterest.toFixed(1)}/5\`
- Weighted reflection score: \`${averageWeightedInterest.toFixed(1)}/5\`
- Usability score: \`${averageUsability.toFixed(1)}/5\`
- High-overwhelm surfaces: \`${highOverwhelmCount}\`
- Medium-overwhelm surfaces: \`${mediumOverwhelmCount}\`

## Does The Site Feel Like It Fits This Persona?

${verdict.fit}

## Why It Likely Resonates

${renderBullets(verdict.positives)}

## Likely Friction

${renderBullets(verdict.friction)}

## Ranked TODOs

### High

${renderCheckboxes(todos.high)}

### Medium

${renderCheckboxes(todos.medium)}

### Low

${renderCheckboxes(todos.low)}

## Persona Priorities

${renderBullets([
  `Preferred tags: ${definition.preferredTags.map((tag) => `\`${tag}\``).join(", ")}`,
  definition.preferredSurfaceIds?.length
    ? `Preferred surfaces: ${definition.preferredSurfaceIds.map((id) => `\`${id}\``).join(", ")}`
    : "Preferred surfaces: none explicitly listed",
])}

## Public Surface Notes

${renderSurfaceObservations(publicObservations)}

## Admin Surface Notes

${renderSurfaceObservations(adminObservations)}

## Persona Keywords Used

${renderBullets(profile.keywords.slice(0, 20).map((keyword) => `\`${keyword}\``))}
`;

  writeFileSync(reportPath, report);

  const summary: PersonaReportSummary = {
    persona: profile.name,
    personaSlug,
    generatedAt: new Date().toISOString(),
    personaDescription: definition.description,
    personaProfileMarkdown: profile.markdown,
    verdict,
    averages: {
      interest: averageInterest,
      weightedInterest: averageWeightedInterest,
      usability: averageUsability,
    },
    todos,
    observations,
  };

  writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

  return { outputDir, reportPath, summaryPath, summary };
}

export function writeOverallPersonaReport(summaries: PersonaReportSummary[]) {
  const personaSlug = "overall-persona";
  const outputDir = resolve(process.cwd(), "test-results", "personas", personaSlug);
  mkdirSync(outputDir, { recursive: true });

  const reportPath = resolve(outputDir, "report.md");
  const summaryPath = resolve(outputDir, "summary.json");
  const bundlePath = resolve(outputDir, "persona-bundle.json");
  const csvPath = resolve(outputDir, "persona-summary.csv");
  const promptsPath = resolve(outputDir, "chatgpt-prompts.md");

  const averageInterest = average(summaries.map((summary) => summary.averages.weightedInterest));
  const averageUsability = average(summaries.map((summary) => summary.averages.usability));
  const allVisitedObservations = summaries.flatMap((summary) =>
    summary.observations.filter((observation) => observation.status === "visited"),
  );

  const surfaceStats = Array.from(groupBySurface(allVisitedObservations).entries())
    .map(([label, observations]) => ({
      label,
      averageInterest: average(observations.map((observation) => observation.weightedInterestScore)),
      averageUsability: average(observations.map((observation) => observation.usabilityScore)),
      highOverwhelmCount: observations.filter((observation) => observation.overwhelmLevel === "high").length,
      mediumOverwhelmCount: observations.filter((observation) => observation.overwhelmLevel === "medium").length,
      primaryPriorityCount: observations.filter((observation) => observation.personaPriority === "primary").length,
      secondaryPriorityCount: observations.filter((observation) => observation.personaPriority === "secondary").length,
      samplePaths: Array.from(new Set(observations.map((observation) => observation.surface.path))),
    }))
    .sort(
      (left, right) =>
        (right.highOverwhelmCount * 3 +
          right.primaryPriorityCount * 2 +
          right.secondaryPriorityCount) -
          (left.highOverwhelmCount * 3 +
            left.primaryPriorityCount * 2 +
            left.secondaryPriorityCount) ||
        left.averageUsability - right.averageUsability,
    );

  const recurringTodos = aggregateRecurringTodos(summaries);
  const topFitPersonas = [...summaries]
    .sort((left, right) => right.averages.weightedInterest - left.averages.weightedInterest)
    .slice(0, 5)
    .map(
      (summary) =>
        `\`${summary.persona}\` (${summary.averages.weightedInterest.toFixed(1)}/5 weighted interest)`,
    );

  const highestFrictionSurfaces = surfaceStats
    .filter((surface) => surface.highOverwhelmCount > 0 || surface.averageUsability < 4.5)
    .slice(0, 8);

  const report = `# Overall Persona Audit

Generated: ${new Date().toISOString()}

## Combined Verdict

Across all personas, the site reads as distinctive, personal, and interesting, but the strongest recurring friction is still first-visit density rather than lack of personality.

- Personas reviewed: \`${summaries.length}\`
- Average weighted site reflection score: \`${averageInterest.toFixed(1)}/5\`
- Average usability score: \`${averageUsability.toFixed(1)}/5\`

## Personas Most Aligned

${renderBullets(topFitPersonas)}

## Recurring High-Priority TODOs

${renderRankedTodos(recurringTodos.high)}

## Recurring Medium-Priority TODOs

${renderRankedTodos(recurringTodos.medium)}

## Recurring Low-Priority TODOs

${renderRankedTodos(recurringTodos.low)}

## Cross-Persona Friction Surfaces

${highestFrictionSurfaces
  .map(
    (surface) => `### ${surface.label}

- Average weighted interest: \`${surface.averageInterest.toFixed(1)}/5\`
- Average usability: \`${surface.averageUsability.toFixed(1)}/5\`
- High-overwhelm count: \`${surface.highOverwhelmCount}\`
- Medium-overwhelm count: \`${surface.mediumOverwhelmCount}\`
- Primary / secondary priority hits: \`${surface.primaryPriorityCount} / ${surface.secondaryPriorityCount}\`
- Paths: ${surface.samplePaths.map((path) => `\`${path}\``).join(", ")}
`,
  )
  .join("\n")}

## Persona-by-Persona Snapshot

${summaries
  .map(
    (summary) => `### ${summary.persona}

- Weighted interest: \`${summary.averages.weightedInterest.toFixed(1)}/5\`
- Usability: \`${summary.averages.usability.toFixed(1)}/5\`
- Top high TODOs:
${renderBullets(summary.todos.high.slice(0, 3))}
`,
  )
  .join("\n")}
`;

  const combinedSummary = {
    generatedAt: new Date().toISOString(),
    personasReviewed: summaries.length,
    averageInterest,
    averageUsability,
    recurringTodos,
    surfaceStats,
    personaSummaries: summaries.map((summary) => ({
      persona: summary.persona,
      personaSlug: summary.personaSlug,
      personaDescription: summary.personaDescription,
      personaProfileMarkdown: summary.personaProfileMarkdown,
      averages: summary.averages,
      topHighTodos: summary.todos.high.slice(0, 3),
      reportPath: resolve(process.cwd(), "test-results", "personas", summary.personaSlug, "report.md"),
      summaryPath: resolve(process.cwd(), "test-results", "personas", summary.personaSlug, "summary.json"),
    })),
  };

  writeFileSync(reportPath, report);
  writeFileSync(summaryPath, JSON.stringify(combinedSummary, null, 2));
  writeFileSync(csvPath, buildPersonaCsv(summaries));
  writeFileSync(bundlePath, JSON.stringify(buildPersonaBundle(summaries, combinedSummary), null, 2));
  writeFileSync(
    promptsPath,
    buildChatGptPrompts({
      csvFilename: "persona-summary.csv",
      jsonFilename: "persona-bundle.json",
      overallSummaryFilename: "summary.json",
    }),
  );

  return { outputDir, reportPath, summaryPath, bundlePath, csvPath, promptsPath };
}

function buildNotes(
  surface: SiteSurface,
  matchedTags: string[],
  headings: string[],
  overwhelmLevel: "low" | "medium" | "high",
  usabilityScore: number,
  personaPriority: "primary" | "secondary" | "ambient",
) {
  const notes: string[] = [];

  if (matchedTags.length > 0) {
    notes.push(`Resonance tags matched: ${matchedTags.join(", ")}.`);
  }

  if (personaPriority !== "ambient") {
    notes.push(`This surface is ${personaPriority} for this persona's stated interests.`);
  }

  if (headings.length > 0) {
    notes.push(`Primary visible headings feel scannable: ${headings.slice(0, 2).join(" / ")}.`);
  } else {
    notes.push("This surface may need a clearer heading or opening anchor.");
  }

  if (overwhelmLevel !== "low") {
    notes.push(`This page trends ${overwhelmLevel} in density for a first-time visitor.`);
  }

  if (surface.area === "admin") {
    notes.push("Admin relevance is lower emotionally, so clarity matters more than charm here.");
  }

  if (usabilityScore <= 2) {
    notes.push("This surface may benefit from a simpler first-glance path.");
  }

  return notes;
}

function buildVerdict(
  interest: number,
  usability: number,
  highOverwhelmCount: number,
  definition: PersonaDefinition,
) {
  const summary =
    interest >= 3.5 && usability >= 3.2
      ? `This site likely reflects this persona fairly well, especially where it overlaps with ${definition.preferredTags
          .slice(0, 4)
          .join(", ")}.`
      : "This site shows some fit for this persona, but the connection is softened by density, orientation issues, or weak emphasis on this persona's priority rooms.";

  const fit =
    highOverwhelmCount > 2
      ? "Yes, but with a caveat: the personality fit is there more than the first-visit ease. This persona would probably like the world of the site while still wanting a calmer, clearer path through it."
      : "Yes. The site's room structure and personal tone overlap meaningfully with the person described in the profile.";

  const positives = [
    "The site feels authored and specific rather than generic.",
    `The strongest overlap for this persona is around: ${definition.preferredTags.slice(0, 5).join(", ")}.`,
    "Several rooms feel like real places with distinct tone instead of generic content buckets.",
  ];

  const friction = [
    "The site has many rooms, which can feel exciting but cognitively busy to a first-time visitor.",
    "Some pages are stronger as archives or experiments than as immediately legible invitations.",
    "The aggregate still needs better persona-sensitive ranking so structurally noisy pages do not always dominate the conversation.",
  ];

  return { summary, fit, positives, friction };
}

function buildTodos(observations: SurfaceObservation[], definition: PersonaDefinition) {
  const high: string[] = [];
  const medium: string[] = [];
  const low: string[] = [];
  const highDensityPages = observations.filter((observation) => observation.overwhelmLevel === "high");
  const lowInterestPages = observations.filter(
    (observation) =>
      observation.surface.area === "public" &&
      observation.status === "visited" &&
      observation.personaPriority !== "ambient" &&
      observation.weightedInterestScore <= 2.8,
  );
  const lowUsabilityPages = observations.filter(
    (observation) =>
      observation.status === "visited" &&
      observation.personaPriority === "primary" &&
      observation.usabilityScore <= 4,
  );
  const skippedAdminPages = observations.filter(
    (observation) => observation.surface.area === "admin" && observation.status === "skipped",
  );

  if (highDensityPages.length > 0) {
    high.push(
      `Reduce first-visit density on ${highDensityPages
        .slice(0, 3)
        .map((observation) => `\`${observation.surface.label}\``)
        .join(", ")} with stronger "start here" copy, section summaries, or progressive disclosure.`,
    );
  }

  if (lowUsabilityPages.length > 0) {
    high.push(
      `Tighten orientation on persona-priority surfaces like ${lowUsabilityPages
        .slice(0, 3)
        .map((observation) => `\`${observation.surface.label}\``)
        .join(", ")} by making the first heading, CTA, or purpose clearer.`,
    );
  }

  medium.push("Add a lightweight persona summary banner or \"if you're new here\" path on the homepage to reduce discovery fatigue.");
  medium.push("Thread more warm real-life texture into public rooms, such as coffee, North Carolina, conversation, or everyday rituals.");

  if (lowInterestPages.length > 0) {
    medium.push(
      `Give high-interest target rooms for this persona, especially ${lowInterestPages
        .slice(0, 2)
        .map((observation) => `\`${observation.surface.label}\``)
        .join(" and ")} a clearer emotional or curiosity hook near the top.`,
    );
  }

  if (definition.preferredSurfaceIds?.length) {
    low.push(
      `Keep checking whether these priority rooms stay strong for this persona: ${definition.preferredSurfaceIds
        .slice(0, 5)
        .map((surfaceId) => `\`${surfaceId}\``)
        .join(", ")}.`,
    );
  }

  low.push("Add optional persona profile headings like `Conversation starters` and `Visual preferences` for future persona files.");
  low.push("Capture one or two screenshot-based visual comments per page once AI summarization is added.");

  if (skippedAdminPages.length > 0) {
    low.push("Provide admin credentials in local test env when you want the full admin persona audit.");
  }

  return { high, medium, low };
}

function renderSurfaceObservations(observations: SurfaceObservation[]) {
  if (observations.length === 0) {
    return "- None.";
  }

  return observations
    .map((observation) => {
      if (observation.status === "skipped") {
        return `### ${observation.surface.label}\n\n- Skipped: ${observation.reason}`;
      }

      return `### ${observation.surface.label}

- Path: \`${observation.surface.path}\`
- Interest: \`${observation.interestScore}/5\`
- Weighted interest: \`${observation.weightedInterestScore.toFixed(1)}/5\`
- Usability: \`${observation.usabilityScore}/5\`
- Overwhelm: \`${observation.overwhelmLevel}\`
- Persona priority: \`${observation.personaPriority}\`
- Links / buttons / inputs: \`${observation.linkCount} / ${observation.buttonCount} / ${observation.inputCount}\`
- Notes:
${renderBullets(observation.notes)}
`;
    })
    .join("\n");
}

function renderBullets(items: string[]) {
  if (items.length === 0) {
    return "- None.";
  }

  return items.map((item) => `- ${item}`).join("\n");
}

function renderCheckboxes(items: string[]) {
  if (items.length === 0) {
    return "- [ ] Nothing queued here yet.";
  }

  return items.map((item) => `- [ ] ${item}`).join("\n");
}

function renderRankedTodos(items: Array<{ text: string; count: number }>) {
  if (items.length === 0) {
    return "- [ ] Nothing recurring enough yet.";
  }

  return items.map((item) => `- [ ] (${item.count}) ${item.text}`).join("\n");
}

function aggregateRecurringTodos(summaries: PersonaReportSummary[]) {
  return {
    high: rankTodoCounts(summaries.flatMap((summary) => summary.todos.high)),
    medium: rankTodoCounts(summaries.flatMap((summary) => summary.todos.medium)),
    low: rankTodoCounts(summaries.flatMap((summary) => summary.todos.low)),
  };
}

function rankTodoCounts(items: string[]) {
  const counts = new Map<string, number>();

  for (const item of items) {
    const key = normalizeTodoTheme(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([text, count]) => ({ text, count }))
    .sort((left, right) => right.count - left.count || left.text.localeCompare(right.text));
}

function normalizeTodoTheme(item: string) {
  if (item.includes("Reduce first-visit density")) {
    return 'Reduce first-visit density on key public rooms with stronger "start here" copy, section summaries, or progressive disclosure.';
  }

  if (item.includes('Add a lightweight persona summary banner')) {
    return 'Add a lightweight persona summary banner or "if you\'re new here" path on the homepage to reduce discovery fatigue.';
  }

  if (item.includes("Thread more warm real-life texture")) {
    return "Thread more warm real-life texture into public rooms, such as coffee, North Carolina, conversation, or everyday rituals.";
  }

  if (item.includes("Capture one or two screenshot-based visual comments")) {
    return "Capture one or two screenshot-based visual comments per page once AI summarization is added.";
  }

  if (item.includes("Add optional persona profile headings")) {
    return "Add optional persona profile headings like `Conversation starters` and `Visual preferences` for future persona files.";
  }

  return item;
}

function groupBySurface(observations: SurfaceObservation[]) {
  const grouped = new Map<string, SurfaceObservation[]>();

  for (const observation of observations) {
    const key = observation.surface.label;
    const existing = grouped.get(key) ?? [];
    existing.push(observation);
    grouped.set(key, existing);
  }

  return grouped;
}

function getMatchedTags(surface: SiteSurface, profile: PersonaProfile, definition: PersonaDefinition) {
  const corpus = `${profile.fullText}\n${profile.keywords.join(" ")}\n${definition.preferredTags.join(" ")}`.toLowerCase();
  return surface.tags.filter((tag) => corpus.includes(tag.toLowerCase()));
}

function getPersonaPriority(
  surface: SiteSurface,
  definition: PersonaDefinition,
  matchedTags: string[],
): "primary" | "secondary" | "ambient" {
  if (definition.preferredSurfaceIds?.includes(surface.id)) {
    return "primary";
  }

  const preferredTagMatches = matchedTags.filter((tag) => definition.preferredTags.includes(tag)).length;

  if (preferredTagMatches >= 2) {
    return "primary";
  }

  if (preferredTagMatches >= 1) {
    return "secondary";
  }

  return "ambient";
}

function applyPersonaWeight(score: number, priority: "primary" | "secondary" | "ambient") {
  if (priority === "primary") {
    return clamp(score + 0.8, 1, 5);
  }

  if (priority === "secondary") {
    return clamp(score + 0.3, 1, 5);
  }

  return score;
}

function buildPersonaCsv(summaries: PersonaReportSummary[]) {
  const rows = [
    [
      "persona_slug",
      "persona_name",
      "persona_description",
      "weighted_interest",
      "interest",
      "usability",
      "top_high_todo_1",
      "top_high_todo_2",
      "top_medium_todo_1",
    ],
    ...summaries.map((summary) => [
      summary.personaSlug,
      summary.persona,
      summary.personaDescription,
      summary.averages.weightedInterest.toFixed(2),
      summary.averages.interest.toFixed(2),
      summary.averages.usability.toFixed(2),
      summary.todos.high[0] ?? "",
      summary.todos.high[1] ?? "",
      summary.todos.medium[0] ?? "",
    ]),
  ];

  return rows.map((row) => row.map(csvEscape).join(",")).join("\n");
}

function csvEscape(value: string) {
  const normalized = String(value ?? "");
  return /[",\n]/.test(normalized) ? `"${normalized.replace(/"/g, '""')}"` : normalized;
}

function buildPersonaBundle(summaries: PersonaReportSummary[], combinedSummary: unknown) {
  return {
    generatedAt: new Date().toISOString(),
    overall: combinedSummary,
    personas: summaries.map((summary) => ({
      persona: summary.persona,
      personaSlug: summary.personaSlug,
      personaDescription: summary.personaDescription,
      personaProfileMarkdown: summary.personaProfileMarkdown,
      averages: summary.averages,
      verdict: summary.verdict,
      todos: summary.todos,
      observations: summary.observations,
    })),
  };
}

function buildChatGptPrompts(args: {
  csvFilename: string;
  jsonFilename: string;
  overallSummaryFilename: string;
}) {
  return `# ChatGPT Prompts For Persona Review

Use these prompts with the files in this folder:

- \`${args.csvFilename}\`
- \`${args.jsonFilename}\`
- \`${args.overallSummaryFilename}\`

## Prompt 1: Improve The Personas

\`\`\`text
I am giving you a CSV and JSON bundle from a persona-testing system for my personal website.

Please do all of the following:
1. Review the full persona texts for clarity, realism, distinctiveness, and overlap.
2. Suggest improvements to each persona so they feel more behaviorally specific.
3. Identify personas that are too similar and should be merged, split, or sharpened.
4. Suggest 5-10 additional personas that would reveal useful website feedback blind spots.
5. Preserve the existing markdown template format when suggesting edits.

Use the JSON bundle as the main source of truth because it includes the full persona markdown and the test outputs.
\`\`\`

## Prompt 2: Review The Findings

\`\`\`text
I am giving you persona-testing outputs for my website.

Using the CSV, the overall summary JSON, and the full JSON bundle:
1. tell me which findings seem truly persona-specific
2. tell me which findings are mostly structural / heuristic artifacts
3. rank the top 10 website improvements by likely real-world value
4. suggest which pages need the most editorial reframing versus design simplification
5. point out any places where the scoring system itself seems biased or too simplistic

Please be critical and specific.
\`\`\`

## Prompt 3: Suggest Better Scoring

\`\`\`text
I have a Playwright-based persona testing system for my site that currently produces weighted interest, usability, and recurring TODOs.

Please review the attached outputs and propose:
1. a better scoring model
2. better persona-specific weighting ideas
3. better aggregation logic across personas
4. a better schema for machine-readable outputs
5. where AI would genuinely help versus where deterministic heuristics are better

If helpful, suggest concrete fields, formulas, and JSON schema changes.
\`\`\`
`;
}

function computeOverwhelm(args: {
  linkCount: number;
  buttonCount: number;
  inputCount: number;
  excerpt: string;
}) {
  const signal = args.linkCount + args.buttonCount + args.inputCount + Math.floor(args.excerpt.length / 500);

  if (signal >= 40) {
    return "high";
  }

  if (signal >= 22) {
    return "medium";
  }

  return "low";
}

function scoreUsability(args: {
  headings: string[];
  linkCount: number;
  buttonCount: number;
  inputCount: number;
  excerpt: string;
}) {
  let score = 5;

  if (args.headings.length === 0) {
    score -= 2;
  }

  if (args.linkCount + args.buttonCount + args.inputCount > 45) {
    score -= 1;
  }

  if (args.excerpt.length < 80) {
    score -= 1;
  }

  return clamp(score, 1, 5);
}

function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}
