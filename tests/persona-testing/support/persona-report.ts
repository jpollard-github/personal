import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Page } from "@playwright/test";
import type { PersonaDefinition } from "./persona-manifest";
import type { PersonaProfile } from "./persona-profile";
import type { SiteSurface } from "./site-surfaces";

export function getPersonaResultsRoot() {
  return resolve(process.cwd(), "persona-results", "personas");
}

export function getPersonaOutputDir(personaSlug: string) {
  return resolve(getPersonaResultsRoot(), personaSlug);
}

export function getPersonaJourneyOutputDir(personaSlug: string) {
  return resolve(getPersonaOutputDir(personaSlug), "journeys");
}

export function getOverallAuditOutputDir() {
  return resolve(getPersonaResultsRoot(), "overall-audit");
}

export function getLegacyOverallAuditOutputDir() {
  return resolve(getPersonaResultsRoot(), "overall-persona");
}

export function getOverallJourneyOutputDir() {
  return resolve(getPersonaResultsRoot(), "overall-journeys");
}

export function getCombinedPersonaJourneyOutputDir() {
  return resolve(getPersonaResultsRoot(), "overall-personas-and-journeys");
}

export function getPersonaTestsResultsTodoPath() {
  return resolve(process.cwd(), "docs", "PERSONA-TESTS-RESULTS-TODO.backup.md");
}

export function shouldCapturePersonaScreenshots() {
  return process.env.PERSONA_CAPTURE_SCREENSHOTS === "1";
}

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
  confidenceThreshold?: "low" | "medium" | "high";
  defaultArchetype?: string;
  defaultScenario?: string;
  defaultContext?: string;
  verdict: PersonaVerdict;
  averages: {
    interest: number;
    weightedInterest: number;
    usability: number;
  };
  todos: PersonaTodoBuckets;
  observations: SurfaceObservation[];
};

export type JourneySummaryRecord = {
  persona: string;
  personaSlug: string;
  generatedAt: string;
  scenarioId: string;
  scenarioLabel: string;
  scenarioGoal: string;
  scenarioInfluences: string[];
  archetype: string;
  archetypeInfluences: string[];
  context: string;
  contextInfluences: string[];
  targetPageCount: number;
  maxPageCount: number;
  visitedRoutes: string[];
  skippedRoutes: string[];
  expectedRoutes: string[];
  // These fields currently track routes actually visited, not routes that were
  // clearly exposed on-page as strong next steps. Keep that nuance in mind when
  // interpreting flat trust-route metrics after UI cross-linking improvements.
  missingExpectedRoutes: string[];
  expectedRouteWarnings: string[];
  expectedRouteMisses: Array<{
    surfaceId: string;
    label: string;
    route: string;
    reason: string;
  }>;
  skippedRouteReasons: Array<{
    surfaceId: string;
    label: string;
    route: string;
    reason: string;
  }>;
  searchQueries: string[];
  searchRationale: string[];
  bounceRisk: "low" | "medium" | "high";
  bounceReasons: string[];
  nearBounceRoute?: string;
  journeyOutcome: "success" | "partial" | "failed";
  outcomeReasons: string[];
  success: boolean;
  successBoolean: boolean;
  matchedSuccessConditionLabels: string[];
  trustSignalHits: Array<{
    surfaceId: string;
    label: string;
    route: string;
    reason: string;
  }>;
  goalSatisfactionEvidence: Array<{
    surfaceId: string;
    label: string;
    route: string;
    reason: string;
  }>;
  routeCatalogWarnings: string[];
  adminRouteLeaks: string[];
  exitState: "leave" | "bookmark" | "contact" | "subscribe" | "return-later" | "continue-exploring";
  journeyNotes: string[];
  catalogCoverage: {
    totalJourneyEligibleRoutes: number;
    selectedJourneyEligibleRoutes: number;
    coverageRatio: number;
    journeyEligibleRoutes: string[];
    selectedRoutes: string[];
  };
};

export type PersonaJourneyAggregateSummary = {
  generatedAt: string;
  journeysReviewed: number;
  averageVisitedRouteCount: number;
  bounceRiskCounts: Record<"low" | "medium" | "high", number>;
  scenarioCounts: Record<string, number>;
  archetypeCounts: Record<string, number>;
  journeyOutcomesByScenario: Record<string, Record<"success" | "partial" | "failed", number>>;
  exitStateCounts: Record<string, number>;
  successCountByScenario: Record<string, number>;
  searchUsageByArchetype: Record<string, number>;
  commonSkippedReasons: Record<string, number>;
  goalEvidenceCounts: Record<string, number>;
  nearBounceRouteCounts: Record<string, number>;
  missingExpectedRouteCounts: Record<string, number>;
  expectedRouteMissCounts: Record<string, number>;
  trustSignalOutcomeCounts: Record<string, number>;
  routeCatalogWarnings: Record<string, number>;
  routesReferencedButMissingFromCatalog: string[];
  routesNeverSelected: string[];
  adminRouteLeaks: string[];
  catalogCoverage: {
    totalJourneyEligibleRoutes: number;
    routesSelectedAtLeastOnce: number;
    coverageRatio: number;
  };
  recommendedNextSiteImprovements: string[];
  productRecommendations?: ProductRecommendation[];
  journeySummaries: Array<
    JourneySummaryRecord & {
      reportPath: string;
      summaryPath: string;
    }
  >;
};

type AggregatePersonaSummary = Pick<
  PersonaReportSummary,
  | "persona"
  | "personaSlug"
  | "personaDescription"
  | "personaProfileMarkdown"
  | "confidenceThreshold"
  | "defaultArchetype"
  | "defaultScenario"
  | "defaultContext"
> & {
  averages?: PersonaReportSummary["averages"];
  topHighTodos?: string[];
  reportPath?: string;
  summaryPath?: string;
};

type ProductBacklogArea =
  | "Homepage"
  | "About"
  | "Projects"
  | "Build Log"
  | "Music"
  | "Writings"
  | "Tiny Thoughts"
  | "Cats"
  | "Twin Peaks"
  | "Arcade"
  | "Search"
  | "Navigation"
  | "Cross-linking"
  | "Overall UX";

type RecommendationPriority = "High Priority" | "Medium Priority" | "Low Priority";
type RecommendationConfidence = "High Confidence" | "Medium Confidence" | "Low Confidence";

type ProductRecommendation = {
  id: string;
  area: ProductBacklogArea;
  priority: RecommendationPriority;
  confidence: RecommendationConfidence;
  evidenceCount: number;
  personaCount: number;
  scenarioCount: number;
  affectedPersonas: string[];
  affectedScenarios: string[];
  suggestedImprovement: string;
  expectedBenefit: string;
  rationale: string;
  statusNote?: string;
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
  const screenshotPath = shouldCapturePersonaScreenshots()
    ? resolve(outputDir, `${surface.id}.png`)
    : undefined;

  if (screenshotPath) {
    await page.screenshot({ path: screenshotPath, fullPage: true });
  }

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
  const outputDir = getPersonaOutputDir(personaSlug);
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
  definition.confidenceThreshold
    ? `Confidence threshold: \`${definition.confidenceThreshold}\``
    : "Confidence threshold: not specified",
  definition.defaultArchetype ? `Default archetype: ${definition.defaultArchetype}` : "Default archetype: not specified",
  definition.defaultScenario ? `Scenario: ${definition.defaultScenario}` : "Scenario: not specified",
  definition.defaultContext ? `Context: ${definition.defaultContext}` : "Context: not specified",
  definition.preferredSurfaceIds?.length
    ? `Preferred surfaces: ${definition.preferredSurfaceIds.map((id) => `\`${id}\``).join(", ")}`
    : "Preferred surfaces: none explicitly listed",
  definition.ignoredSurfaceIds?.length
    ? `Ignored surfaces: ${definition.ignoredSurfaceIds.map((id) => `\`${id}\``).join(", ")}`
    : "Ignored surfaces: none explicitly listed",
])}

## Persona Field Groups

### Identity

${renderSectionGroup(profile.groupedSections.identity)}

### Behavior

${renderSectionGroup(profile.groupedSections.behavior)}

### Evaluation

${renderSectionGroup(profile.groupedSections.evaluation)}

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
    confidenceThreshold: definition.confidenceThreshold,
    defaultArchetype: definition.defaultArchetype,
    defaultScenario: definition.defaultScenario,
    defaultContext: definition.defaultContext,
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
  const personaSlug = "overall-audit";
  const outputDir = getOverallAuditOutputDir();
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
  const auditProductRecommendations = buildProductRecommendations({
    auditSummaries: summaries,
    journeySummaries: [],
    recurringTodos,
    surfaceStats,
  });
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

  const report = `# Overall Audit

Generated: ${new Date().toISOString()}

## Combined Verdict

Across all personas, the site reads as distinctive, personal, and interesting, but the strongest recurring friction is still first-visit density rather than lack of personality.

- Personas reviewed: \`${summaries.length}\`
- Average weighted site reflection score: \`${averageInterest.toFixed(1)}/5\`
- Average usability score: \`${averageUsability.toFixed(1)}/5\`

## Personas Most Aligned

${renderBullets(topFitPersonas)}

## Site Recommendations

${renderProductRecommendations(auditProductRecommendations.slice(0, 6))}

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
    productRecommendations: auditProductRecommendations,
    personaSummaries: summaries.map((summary) => ({
      persona: summary.persona,
      personaSlug: summary.personaSlug,
      personaDescription: summary.personaDescription,
      personaProfileMarkdown: summary.personaProfileMarkdown,
      confidenceThreshold: summary.confidenceThreshold,
      defaultArchetype: summary.defaultArchetype,
      defaultScenario: summary.defaultScenario,
      defaultContext: summary.defaultContext,
      averages: summary.averages,
      topHighTodos: summary.todos.high.slice(0, 3),
      reportPath: resolve(getPersonaOutputDir(summary.personaSlug), "report.md"),
      summaryPath: resolve(getPersonaOutputDir(summary.personaSlug), "summary.json"),
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

  writeCombinedPersonasAndJourneysPacket({ auditSummary: combinedSummary });

  return { outputDir, reportPath, summaryPath, bundlePath, csvPath, promptsPath };
}

export function writeOverallJourneyReport(summaries: JourneySummaryRecord[]) {
  const outputDir = getOverallJourneyOutputDir();
  mkdirSync(outputDir, { recursive: true });

  const reportPath = resolve(outputDir, "report.md");
  const summaryPath = resolve(outputDir, "summary.json");
  const bundlePath = resolve(outputDir, "journey-bundle.json");
  const csvPath = resolve(outputDir, "journey-summary.csv");
  const promptsPath = resolve(outputDir, "chatgpt-prompts.md");

  const aggregateSummaries = summaries.map((summary) => ({
    ...summary,
    reportPath: resolve(getPersonaJourneyOutputDir(summary.personaSlug), `${summary.scenarioId}.md`),
    summaryPath: resolve(getPersonaJourneyOutputDir(summary.personaSlug), `${summary.scenarioId}.json`),
  }));
  const averageVisitedRouteCount = average(summaries.map((summary) => summary.visitedRoutes.length));
  const bounceRiskCounts = {
    low: summaries.filter((summary) => summary.bounceRisk === "low").length,
    medium: summaries.filter((summary) => summary.bounceRisk === "medium").length,
    high: summaries.filter((summary) => summary.bounceRisk === "high").length,
  };
  const scenarioCounts = countBy(summaries.map((summary) => summary.scenarioLabel));
  const archetypeCounts = countBy(summaries.map((summary) => summary.archetype));
  const exitStateCounts = countBy(summaries.map((summary) => summary.exitState));
  const journeyOutcomesByScenario = aggregateJourneyOutcomesByScenario(summaries);
  const commonSkippedReasons = countBy(
    summaries.flatMap((summary) => summary.skippedRouteReasons.map((entry) => entry.reason)),
  );
  const trustSignalOutcomeCounts = countBy(
    summaries.flatMap((summary) => summary.trustSignalHits.map((entry) => entry.route)),
  );
  const goalEvidenceCounts = countBy(
    summaries.flatMap((summary) => summary.goalSatisfactionEvidence.map((entry) => entry.route)),
  );
  const nearBounceRouteCounts = countBy(
    summaries.flatMap((summary) => (summary.nearBounceRoute ? [summary.nearBounceRoute] : [])),
  );
  const successCountByScenario = countBy(
    summaries.filter((summary) => summary.success).map((summary) => summary.scenarioLabel),
  );
  const searchUsageByArchetype = countBy(
    summaries.flatMap((summary) => (summary.searchQueries.length ? [summary.archetype] : [])),
  );
  const missingExpectedRouteCounts = countBy(
    summaries.flatMap((summary) => summary.missingExpectedRoutes),
  );
  const expectedRouteMissCounts = countBy(
    summaries.flatMap((summary) => summary.expectedRouteMisses.map((entry) => entry.route)),
  );
  const routeCatalogWarnings = countBy(
    summaries.flatMap((summary) => summary.routeCatalogWarnings),
  );
  const routesReferencedButMissingFromCatalog = Array.from(
    new Set(
      summaries.flatMap((summary) =>
        summary.routeCatalogWarnings
          .filter((warning) => warning.includes("missing from the route catalog"))
          .map((warning) => warning.match(/`([^`]+)`/)?.[1] ?? warning),
      ),
    ),
  ).sort();
  const adminRouteLeaks = Array.from(
    new Set(summaries.flatMap((summary) => summary.adminRouteLeaks)),
  ).sort();
  const journeyEligibleRoutes = Array.from(
    new Set(summaries.flatMap((summary) => summary.catalogCoverage.journeyEligibleRoutes)),
  ).sort();
  const selectedRoutes = Array.from(
    new Set(summaries.flatMap((summary) => summary.catalogCoverage.selectedRoutes)),
  ).sort();
  const routesNeverSelected = journeyEligibleRoutes.filter((route) => !selectedRoutes.includes(route));
  const catalogCoverage = {
    totalJourneyEligibleRoutes: journeyEligibleRoutes.length,
    routesSelectedAtLeastOnce: selectedRoutes.length,
    coverageRatio: journeyEligibleRoutes.length === 0
      ? 0
      : Number((selectedRoutes.length / journeyEligibleRoutes.length).toFixed(3)),
  };
  const successfulJourneys = summaries.filter((summary) => summary.success).length;
  const partialOrFailedJourneys = summaries.filter((summary) => summary.journeyOutcome !== "success");
  const recommendedNextSiteImprovements = buildRecommendedJourneyImprovements({
    summaries,
    nearBounceRouteCounts,
    missingExpectedRouteCounts,
    expectedRouteMissCounts,
    commonSkippedReasons,
    searchUsageByArchetype,
    successfulJourneys,
    totalJourneys: summaries.length,
    routeCatalogWarnings,
    routesNeverSelected,
  });
  const productRecommendations = buildProductRecommendations({
    auditSummaries: readJsonIfExists(resolve(getOverallAuditOutputDir(), "summary.json"))?.personaSummaries ?? [],
    journeySummaries: summaries,
    recurringTodos: readJsonIfExists(resolve(getOverallAuditOutputDir(), "summary.json"))?.recurringTodos ?? {
      high: [],
      medium: [],
      low: [],
    },
    surfaceStats: readJsonIfExists(resolve(getOverallAuditOutputDir(), "summary.json"))?.surfaceStats ?? [],
  });

  const combinedSummary: PersonaJourneyAggregateSummary = {
    generatedAt: new Date().toISOString(),
    journeysReviewed: summaries.length,
    averageVisitedRouteCount,
    bounceRiskCounts,
    scenarioCounts,
    archetypeCounts,
    journeyOutcomesByScenario,
    exitStateCounts,
    successCountByScenario,
    searchUsageByArchetype,
    commonSkippedReasons,
    goalEvidenceCounts,
    nearBounceRouteCounts,
    missingExpectedRouteCounts,
    expectedRouteMissCounts,
    trustSignalOutcomeCounts,
    routeCatalogWarnings,
    routesReferencedButMissingFromCatalog,
    routesNeverSelected,
    adminRouteLeaks,
    catalogCoverage,
    recommendedNextSiteImprovements,
    productRecommendations,
    journeySummaries: aggregateSummaries,
  };

  const report = `# Overall Journeys

Generated: ${combinedSummary.generatedAt}

## Combined View

- Journeys reviewed: \`${combinedSummary.journeysReviewed}\`
- Average visited route count: \`${combinedSummary.averageVisitedRouteCount.toFixed(1)}\`
- Goal satisfied: \`${successfulJourneys}/${combinedSummary.journeysReviewed}\`
- Journey outcomes:
  - success: \`${aggregateSummaries.filter((summary) => summary.journeyOutcome === "success").length}\`
  - partial: \`${aggregateSummaries.filter((summary) => summary.journeyOutcome === "partial").length}\`
  - failed: \`${aggregateSummaries.filter((summary) => summary.journeyOutcome === "failed").length}\`
- Bounce risk counts:
  - low: \`${combinedSummary.bounceRiskCounts.low}\`
  - medium: \`${combinedSummary.bounceRiskCounts.medium}\`
  - high: \`${combinedSummary.bounceRiskCounts.high}\`

## Scenario Coverage

${renderBullets(
    Object.entries(combinedSummary.scenarioCounts).map(([label, count]) => `\`${label}\`: ${count}`),
  )}

## Archetype Coverage

${renderBullets(
    Object.entries(combinedSummary.archetypeCounts).map(([label, count]) => `\`${label}\`: ${count}`),
  )}

## Exit State Counts

${renderBullets(Object.entries(exitStateCounts).map(([label, count]) => `Exit \`${label}\`: ${count}`))}

## Journey Success Count By Scenario

${renderBullets(
    rankCountEntries(successCountByScenario).map(([label, count]) => `\`${label}\`: ${count} successful journey${count === 1 ? "" : "s"}`),
  )}

## Journey Outcomes By Scenario

${renderBullets(
    Object.entries(journeyOutcomesByScenario).map(
      ([label, counts]) =>
        `\`${label}\`: success ${counts.success}, partial ${counts.partial}, failed ${counts.failed}`,
    ),
  )}

## Partial / Failed Journeys

${renderBullets(
    partialOrFailedJourneys.length
      ? partialOrFailedJourneys.map(
          (summary) =>
            `\`${summary.persona}\` / \`${summary.scenarioLabel}\` -> \`${summary.journeyOutcome}\` (${summary.outcomeReasons.slice(0, 2).join(" ") || "No reasons recorded."})`,
        )
      : ["No representative journeys were partial or failed in this run."],
  )}

## Search Usage Count By Archetype

${renderBullets(
    rankCountEntries(searchUsageByArchetype).map(([label, count]) => `\`${label}\`: ${count} journey${count === 1 ? "" : "s"} used search`),
  )}

## Most Common Skipped-Route Reasons

${renderBullets(rankCountEntries(commonSkippedReasons).slice(0, 6).map(([reason, count]) => `${reason} (${count})`))}

## Most Common Goal Satisfaction Routes

${renderBullets(
    rankCountEntries(goalEvidenceCounts).slice(0, 6).map(([route, count]) => `\`${route}\` (${count})`),
  )}

## Most Common Near-Bounce Routes

${renderBullets(
    rankCountEntries(nearBounceRouteCounts).slice(0, 6).map(([route, count]) => `\`${route}\` (${count})`),
  )}

## Routes Most Often Expected But Missing

${renderBullets(
    rankCountEntries(missingExpectedRouteCounts).slice(0, 8).map(([route, count]) => `\`${route}\` (${count})`),
  )}

## Expected-Route Misses That Affected Outcome

${renderBullets(
    rankCountEntries(expectedRouteMissCounts).slice(0, 8).map(([route, count]) => `\`${route}\` (${count})`),
  )}

## Trust Signals That Most Often Changed Direction

${renderBullets(
    rankCountEntries(trustSignalOutcomeCounts).slice(0, 6).map(([route, count]) => `\`${route}\` (${count})`),
  )}

## Route Catalog Validation

${renderBullets([
    `Catalog coverage across representative journeys: ${catalogCoverage.routesSelectedAtLeastOnce}/${catalogCoverage.totalJourneyEligibleRoutes} eligible routes (${(catalogCoverage.coverageRatio * 100).toFixed(1)}%).`,
    ...rankCountEntries(routeCatalogWarnings).slice(0, 6).map(([warning, count]) => `${warning} (${count})`),
  ])}

## Routes Referenced But Missing From Catalog

${renderBullets(
    routesReferencedButMissingFromCatalog.length
      ? routesReferencedButMissingFromCatalog.map((routeId) => `\`${routeId}\``)
      : ["None."],
  )}

## Routes In Catalog Never Selected By Representative Journeys

${renderBullets(
    routesNeverSelected.length
      ? routesNeverSelected.map((route) => `\`${route}\``)
      : ["Every journey-eligible catalog route was selected at least once."],
  )}

## Recommended Next Site Improvements

${renderBullets(recommendedNextSiteImprovements)}

## Product-Ready Recommendations

${renderProductRecommendations(productRecommendations.slice(0, 6))}

## Journey Snapshots

${aggregateSummaries
  .map(
    (summary) => `### ${summary.persona}

- Scenario: \`${summary.scenarioLabel}\`
- Goal: \`${summary.scenarioGoal}\`
- Scenario influences: ${summary.scenarioInfluences.slice(0, 2).join(" ")}
- Archetype: \`${summary.archetype}\`
- Archetype influences: ${summary.archetypeInfluences.slice(0, 2).join(" ")}
- Context influences: ${summary.contextInfluences.slice(0, 2).join(" ")}
- Target / max pages: \`${summary.targetPageCount} / ${summary.maxPageCount}\`
- Bounce risk: \`${summary.bounceRisk}\`
- Journey outcome: \`${summary.journeyOutcome}\`
- Success: \`${summary.success ? "yes" : "no"}\`
- Exit state: \`${summary.exitState}\`
- Near-bounce route: ${summary.nearBounceRoute ? `\`${summary.nearBounceRoute}\`` : "None"}
- Outcome reasons: ${summary.outcomeReasons.slice(0, 2).join(" ") || "None"}
- Why routes were skipped: ${summary.skippedRouteReasons.slice(0, 2).map((entry) => `\`${entry.route}\` (${entry.reason})`).join("; ") || "None"}
- Trust signals that mattered: ${summary.trustSignalHits.slice(0, 2).map((entry) => `\`${entry.route}\``).join(", ") || "None"}
- Goal satisfaction pages: ${summary.goalSatisfactionEvidence.slice(0, 2).map((entry) => `\`${entry.route}\``).join(", ") || "None"}
- Expected but missing routes: ${summary.missingExpectedRoutes.slice(0, 3).map((route) => `\`${route}\``).join(", ") || "None"}
- Route catalog warnings: ${summary.routeCatalogWarnings.slice(0, 2).join(" ") || "None"}
- Expected-route warnings: ${summary.expectedRouteWarnings.join(" ") || "None"}
- Visited routes: ${summary.visitedRoutes.map((route) => `\`${route}\``).join(", ")}
- Search queries: ${summary.searchQueries.length ? summary.searchQueries.map((query) => `\`${query}\``).join(", ") : "None"}
`,
  )
  .join("\n")}
`;

  writeFileSync(reportPath, report);
  writeFileSync(summaryPath, JSON.stringify(combinedSummary, null, 2));
  writeFileSync(bundlePath, JSON.stringify({ generatedAt: new Date().toISOString(), overall: combinedSummary }, null, 2));
  writeFileSync(csvPath, buildJourneyCsv(summaries));
  writeFileSync(promptsPath, buildJourneyChatGptPrompts());

  writeCombinedPersonasAndJourneysPacket({ journeySummary: combinedSummary });

  return { outputDir, reportPath, summaryPath, bundlePath, csvPath, promptsPath, summary: combinedSummary };
}

function writeCombinedPersonasAndJourneysPacket(args: {
  auditSummary?: unknown;
  journeySummary?: PersonaJourneyAggregateSummary;
}) {
  const outputDir = getCombinedPersonaJourneyOutputDir();
  mkdirSync(outputDir, { recursive: true });

  const resolvedAuditSummary =
    args.auditSummary ??
    readJsonIfExists(resolve(getOverallAuditOutputDir(), "summary.json")) ??
    readJsonIfExists(resolve(getLegacyOverallAuditOutputDir(), "summary.json"));
  const resolvedJourneySummary =
    args.journeySummary ?? readJsonIfExists(resolve(getOverallJourneyOutputDir(), "summary.json"));

  const combined = {
    generatedAt: new Date().toISOString(),
    audit: resolvedAuditSummary ?? null,
    journeys: resolvedJourneySummary ?? null,
  };

  const report = `# Overall Personas And Journeys

Generated: ${combined.generatedAt}

## Included Artifacts

- Audit summary present: \`${combined.audit ? "yes" : "no"}\`
- Journey summary present: \`${combined.journeys ? "yes" : "no"}\`

## Recommended Review Order

1. Read \`../overall-audit/report.md\` for broad full-surface findings.
2. Read \`../overall-journeys/report.md\` for realistic path summaries.
3. Use \`combined-bundle.json\` plus the two folders above as the ChatGPT handoff packet.
`;

  writeFileSync(resolve(outputDir, "report.md"), report);
  writeFileSync(resolve(outputDir, "summary.json"), JSON.stringify(combined, null, 2));
  writeFileSync(resolve(outputDir, "combined-bundle.json"), JSON.stringify(combined, null, 2));
  writeFileSync(resolve(outputDir, "chatgpt-prompts.md"), buildCombinedChatGptPrompts());

  if (resolvedAuditSummary && resolvedJourneySummary) {
    writePersonaTestsResultsTodoDoc({
      auditSummary: resolvedAuditSummary as {
        recurringTodos?: unknown;
        surfaceStats?: unknown[];
        personaSummaries?: PersonaReportSummary[];
      },
      journeySummary: resolvedJourneySummary,
    });
  }
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

function renderSectionGroup(sections: PersonaProfile["groupedSections"]["identity"]) {
  if (sections.length === 0) {
    return "- None captured yet.";
  }

  return sections
    .map((section) => `#### ${section.heading}\n\n${section.body}`)
    .join("\n\n");
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
  if (definition.ignoredSurfaceIds?.includes(surface.id)) {
    return "ambient";
  }

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
      confidenceThreshold: summary.confidenceThreshold,
      defaultArchetype: summary.defaultArchetype,
      defaultScenario: summary.defaultScenario,
      defaultContext: summary.defaultContext,
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

function buildJourneyCsv(summaries: JourneySummaryRecord[]) {
  const rows = [
    [
      "persona_slug",
      "persona_name",
      "scenario_id",
      "scenario_label",
      "scenario_goal",
      "archetype",
      "target_pages",
      "max_pages",
      "bounce_risk",
      "journey_outcome",
      "success",
      "exit_state",
      "visited_routes",
      "search_queries",
    ],
    ...summaries.map((summary) => [
      summary.personaSlug,
      summary.persona,
      summary.scenarioId,
      summary.scenarioLabel,
      summary.scenarioGoal,
      summary.archetype,
      String(summary.targetPageCount),
      String(summary.maxPageCount),
      summary.bounceRisk,
      summary.journeyOutcome,
      summary.success ? "yes" : "no",
      summary.exitState,
      summary.visitedRoutes.join(" | "),
      summary.searchQueries.join(" | "),
    ]),
  ];

  return rows.map((row) => row.map(csvEscape).join(",")).join("\n");
}

function buildJourneyChatGptPrompts() {
  return `# ChatGPT Prompts For Journey Review

Use these prompts with the files in this folder:

- \`journey-summary.csv\`
- \`journey-bundle.json\`
- \`summary.json\`

## Prompt 1: Review Journey Realism

\`\`\`text
I am giving you deterministic journey outputs from a persona-testing system for my website.

Please do all of the following:
1. tell me which journeys feel emotionally and behaviorally plausible
2. tell me which journeys still feel too heuristic or repetitive
3. point out where scenario, archetype, or context is not visibly changing the route enough
4. suggest better route variations without replacing the deterministic approach
5. recommend the next 5 improvements for the journey engine
\`\`\`

## Prompt 2: Improve The Scenario Matrix

\`\`\`text
I am giving you a scenario matrix and journey outputs for a deterministic persona-testing system.

Please review:
1. whether the scenarios are reusable enough across personas
2. whether any scenarios overlap too much and should merge
3. which scenarios are missing
4. how context should change route choice more visibly
5. whether the journey outputs are giving enough signal for product decisions
\`\`\`
`;
}

function buildCombinedChatGptPrompts() {
  return `# ChatGPT Prompts For Combined Audit And Journey Review

Use the folders next to this packet:

- \`../overall-audit/\`
- \`../overall-journeys/\`
- this folder's \`combined-bundle.json\`

## Prompt 1: Compare Audit vs Journey Findings

\`\`\`text
I am giving you both full-surface audit outputs and deterministic journey outputs from a persona-testing system for my website.

Please do all of the following:
1. compare which findings appear in both audit mode and journey mode
2. identify which audit findings are probably structural and which journey findings feel behaviorally real
3. rank the top improvements I should make next
4. tell me whether the journey engine is producing meaningfully different behavior across personas yet
5. suggest the next deterministic improvements before adding more AI interpretation
\`\`\`
`;
}

function buildRecommendedJourneyImprovements(args: {
  summaries: JourneySummaryRecord[];
  nearBounceRouteCounts: Record<string, number>;
  missingExpectedRouteCounts: Record<string, number>;
  expectedRouteMissCounts: Record<string, number>;
  commonSkippedReasons: Record<string, number>;
  searchUsageByArchetype: Record<string, number>;
  successfulJourneys: number;
  totalJourneys: number;
  routeCatalogWarnings: Record<string, number>;
  routesNeverSelected: string[];
}) {
  const improvements: string[] = [];
  const topPartialOrFailed = args.summaries.find((summary) => summary.journeyOutcome !== "success");
  const topNearBounce = rankCountEntries(args.nearBounceRouteCounts)[0];
  const topMissingExpected = rankCountEntries(args.missingExpectedRouteCounts)[0];
  const topOutcomeMiss = rankCountEntries(args.expectedRouteMissCounts)[0];
  const topSkippedReason = rankCountEntries(args.commonSkippedReasons)[0];
  const topSearchArchetype = rankCountEntries(args.searchUsageByArchetype)[0];
  const topCatalogWarning = rankCountEntries(args.routeCatalogWarnings)[0];
  const topProfessionalTrustMiss =
    topPartialOrFailed
    && ["potential-client", "hiring-manager"].includes(topPartialOrFailed.personaSlug)
    && topPartialOrFailed.missingExpectedRoutes.includes("/about");

  if (topPartialOrFailed) {
    improvements.push(
      topProfessionalTrustMiss
        ? `Re-test \`${topPartialOrFailed.persona}\` / \`${topPartialOrFailed.scenarioLabel}\` carefully before forcing \`/about\` harder again, because this journey still resolves as \`${topPartialOrFailed.journeyOutcome}\` even after visible UI trust-path improvements.`
        : `Fix \`${topPartialOrFailed.persona}\` / \`${topPartialOrFailed.scenarioLabel}\` first, because it currently resolves as \`${topPartialOrFailed.journeyOutcome}\`.`,
    );
  }

  if (topNearBounce) {
    improvements.push(
      `Reduce friction around \`${topNearBounce[0]}\`, which most often carried near-bounce pressure in representative journeys.`,
    );
  }

  if (topOutcomeMiss) {
    improvements.push(
      `Strengthen \`${topOutcomeMiss[0]}\`, which most often affected journey outcomes rather than only appearing as a soft warning.`,
    );
  }

  if (topMissingExpected) {
    improvements.push(
      topMissingExpected[0] === "/about"
        ? "Treat repeated `/about` misses as a mixed signal: the route may still matter, but recent human review can justify pausing additional route forcing unless fresh evidence shows real discoverability friction."
        : `Strengthen the path toward \`${topMissingExpected[0]}\`, which was the most commonly expected-but-missed route anchor.`,
    );
  }

  if (topSkippedReason) {
    improvements.push(
      `Review whether "${topSkippedReason[0]}" reflects a real site issue or an overly aggressive planner heuristic.`,
    );
  }

  if (topSearchArchetype) {
    improvements.push(
      `Watch search-heavy behavior for \`${topSearchArchetype[0]}\` so journeys do not collapse into the same route shape too often.`,
    );
  }

  if (topCatalogWarning) {
    improvements.push(
      `Clean up route-catalog drift beginning with: ${topCatalogWarning[0]}.`,
    );
  }

  if (args.routesNeverSelected.length > 0) {
    improvements.push(
      `Review whether currently unselected eligible routes like \`${args.routesNeverSelected[0]}\` belong in the representative suite or should be deprioritized intentionally.`,
    );
  }

  if (args.successfulJourneys < args.totalJourneys) {
    improvements.push(
      "Investigate unsuccessful representative journeys and validate whether their expected-route warnings point to real orientation gaps.",
    );
  }

  if (improvements.length === 0) {
    improvements.push("Representative journeys are healthy right now; focus next on finer route realism rather than framework expansion.");
  }

  return improvements;
}

function renderProductRecommendations(items: ProductRecommendation[]) {
  if (items.length === 0) {
    return "- None strong enough yet.";
  }

  return items
    .map((item) => {
      const personas = summarizeNames(item.affectedPersonas, 4);
      const scenarios = summarizeNames(item.affectedScenarios, 3);

      return `- ${item.priority} · ${item.confidence} · Evidence count: \`${item.evidenceCount}\`
  Suggested improvement: ${item.suggestedImprovement}
  Expected benefit: ${item.expectedBenefit}
  Affected visitors: ${personas}; scenarios: ${scenarios}
  Why this is here: ${item.rationale}`;
    })
    .join("\n");
}

function isImplementedRecommendation(item: ProductRecommendation) {
  return item.statusNote?.startsWith("Implemented") || item.statusNote?.startsWith("Human review says");
}

function writePersonaTestsResultsTodoDoc(args: {
  auditSummary: {
    recurringTodos?: unknown;
    surfaceStats?: unknown[];
    personaSummaries?: AggregatePersonaSummary[];
  };
  journeySummary: PersonaJourneyAggregateSummary;
}) {
  const { auditSummary, journeySummary } = args;
  const recommendations = buildProductRecommendations({
    auditSummaries: auditSummary.personaSummaries ?? [],
    journeySummaries: journeySummary.journeySummaries ?? [],
    recurringTodos: normalizeRecurringTodos(auditSummary.recurringTodos),
    surfaceStats: normalizeSurfaceStats(auditSummary.surfaceStats),
  });
  const sections: ProductBacklogArea[] = [
    "Homepage",
    "About",
    "Projects",
    "Build Log",
    "Music",
    "Writings",
    "Tiny Thoughts",
    "Cats",
    "Twin Peaks",
    "Search",
    "Navigation",
    "Cross-linking",
    "Overall UX",
  ];

  const body = sections
    .map((area) => {
      const items = recommendations.filter((item) => item.area === area);

      if (items.length === 0) {
        return `## ${area}\n\n- [ ] No recurring action item is strong enough here yet.`;
      }

      return `## ${area}\n\n${items
        .map((item) => {
          const personas = summarizeNames(item.affectedPersonas, 4);
          const scenarios = summarizeNames(item.affectedScenarios, 3);
          const acceptanceCriteria = renderAcceptanceCriteria(area);
          const statusNote = item.statusNote ? `\n  Current note:\n  - ${item.statusNote}` : "";
          const checkbox = isImplementedRecommendation(item) ? "[x]" : "[ ]";

          return `- ${checkbox} ${item.priority} · ${item.confidence} · Evidence count: \`${item.evidenceCount}\`
  Affected visitors: ${personas}; scenarios: ${scenarios}
  Suggested improvement: ${item.suggestedImprovement}
  Expected benefit: ${item.expectedBenefit}${acceptanceCriteria ? `\n  Acceptance criteria:\n${acceptanceCriteria}` : ""}${statusNote}`;
        })
        .join("\n\n")}`;
    })
    .join("\n\n");

  const doc = `# PERSONA-TESTS-RESULTS-TODO.backup.md

Generated: ${new Date().toISOString()}

Website work starts here.

Framework work lives in \`docs/PERSONA-TODO.md\`.

Start with the highest-confidence active website items.

Pick 1–3 website TODOs, implement them, then re-run \`npm run test:users:fast\`.

Address high-confidence website TODOs before expanding the persona engine.

This is the canonical handoff from persona testing into ArcadeGhosts website work.

The goal is not to preserve every raw audit note. The goal is to turn repeated evidence into a practical product backlog that can be implemented, re-tested, and measured over time.

## Recommended Work Order

1. Search support without over-reliance
2. Twin Peaks cross-linking
3. Arcade / games visibility if still relevant
4. Retest after each small batch
5. Lower-confidence items only after retesting

## Current Status

- First website batch: completed
- Second trust-routing pass: completed
- Movies & TV reframing: completed
- Human review says the trust links are clearly exposed enough for real visitors.
- The deterministic trust-route metrics may still reflect planner expectations, route-budget behavior, and the difference between route visited versus route exposed.
- Pause additional \`/about\` route forcing unless future evidence shows a real discoverability problem.

## Current Focus

Keep the next pass focused on:

- Search support without over-reliance
- Twin Peaks cross-linking
- Arcade / games visibility if still relevant
- retest after each small batch

## First Implementation Batch

Recommended first batch:

- Homepage Start Here block
- About trust-hub links
- Trust Cluster links among About, Work With Me, and Build Log

This batch is intentionally small so results can be measured cleanly on the next persona rerun.

Status note:

- [x] Homepage Start Here / calmer first screen landed in the UI
- [x] About trust-hub links landed in the UI
- [x] Trust-cluster links among About, Work With Me, and Build Log landed in the UI
- [x] First website batch completed
- [ ] Deterministic trust-route metrics have not improved yet

## Second Trust-Routing Pass

- [x] Work With Me → About was strengthened
- [x] Build Log → About was strengthened
- [x] Homepage proof path now points toward \`/build-log\`
- [x] Human review says this path is clear
- [ ] Deterministic trust-route metrics have not improved yet

## Completed But No Longer Active

- Homepage Start Here / calmer first screen
- Trust cluster initial implementation
- Work With Me → About
- Build Log → About
- Movies & TV reframing

## Retest Workflow

1. Pick 1–3 website TODOs.
2. Implement them.
3. Run \`npm run test:users:fast\`.
4. Compare new results against prior results.
5. Update \`docs/PERSONA-TESTS-RESULTS-TODO.backup.md\`.
6. Only then consider framework changes.

## Retest Target

After the first implementation batch, run:

\`npm run test:users:fast\`

Expected improvements:

- lower homepage near-bounce pressure
- fewer \`/about\` expected-route misses
- stronger Potential Client / Hiring Manager trust journeys
- clearer professional path without relying entirely on Search
- improved confidence in \`docs/PERSONA-TESTS-RESULTS-TODO.backup.md\` priorities

Current read after this pass:

- The major homepage, trust-cluster, and Movies & TV UI work is implemented.
- Some deterministic recommendations may still reference already-completed work.
- When that happens, interpret them as "implemented but not yet reflected in deterministic metrics" unless fresh human review shows continued friction.

${body}

## Trust Cluster

The trust cluster is:

- About
- Work With Me
- Build Log
- Projects / Updates when relevant

Working definition:

- Professional visitors should not have to rely on Search to connect proof, personality, and next steps.

TODOs:

- [ ] Add visible cross-links between About, Work With Me, Build Log, and relevant Projects / Updates surfaces.
- [ ] Make each trust-cluster page explain why the other pages matter.
- [ ] Make it easy to move from personality to proof to next step without losing context.
- [ ] Professional visitors should not have to rely on Search to connect personality, proof, and next step.

Acceptance criteria:

- [ ] About, Work With Me, and Build Log cross-link visibly.
- [ ] Work With Me points to proof of active building.
- [ ] Build Log points to human context / About.
- [ ] About points to Work With Me without becoming salesy.
- [ ] Professional visitors do not have to rely on Search to connect personality, proof, and next step.
`;

  writeFileSync(getPersonaTestsResultsTodoPath(), doc);
}

function renderAcceptanceCriteria(area: ProductBacklogArea) {
  if (area === "Homepage") {
    return [
      "  - [ ] Homepage has one short plain-language summary of ArcadeGhosts.",
      "  - [ ] Homepage has a visible `Start Here` or `New here?` block.",
      "  - [ ] The block contains 3-5 clear paths.",
      "  - [ ] The paths include personal, professional, and creative entry points.",
      "  - [ ] The denser room grid appears after orientation, not before it.",
      "  - [ ] Persona tests should reduce homepage near-bounce pressure after implementation.",
      "  - [ ] Suggested paths include `I want to know Jason -> About`, `I'm here for projects -> Projects / Build Log`, `I'm thinking about working with you -> Work With Me`, and `I want writing, music, cats, or weird rooms -> Writings / Music / Cats / Twin Peaks`.",
    ].join("\n");
  }

  if (area === "About") {
    return [
      "  - [ ] About is easy to reach from homepage.",
      "  - [ ] About links to Writings, Cats, Music, Projects, Build Log, and Work With Me.",
      "  - [ ] About explains Jason as both person and builder.",
      "  - [ ] Professional visitors can move from About to proof or next-step pages.",
      "  - [ ] Personal visitors can move from About to warm or creative pages.",
    ].join("\n");
  }

  return "";
}

function buildProductRecommendations(args: {
  auditSummaries: AggregatePersonaSummary[];
  journeySummaries: JourneySummaryRecord[];
  recurringTodos: {
    high: Array<{ text: string; count: number }>;
    medium: Array<{ text: string; count: number }>;
    low: Array<{ text: string; count: number }>;
  };
  surfaceStats: Array<{
    label: string;
    averageInterest: number;
    averageUsability: number;
    highOverwhelmCount: number;
    mediumOverwhelmCount: number;
    primaryPriorityCount: number;
    secondaryPriorityCount: number;
    samplePaths: string[];
  }>;
}) {
  const { auditSummaries, journeySummaries, recurringTodos, surfaceStats } = args;
  const recommendations: ProductRecommendation[] = [];
  const journeyEligibleRoutes = Array.from(
    new Set(journeySummaries.flatMap((summary) => summary.catalogCoverage.journeyEligibleRoutes)),
  );
  const selectedRoutes = Array.from(
    new Set(journeySummaries.flatMap((summary) => summary.catalogCoverage.selectedRoutes)),
  );
  const routesNeverSelected = journeyEligibleRoutes.filter((route) => !selectedRoutes.includes(route));
  const homepageStats = surfaceStats.find((surface) => surface.samplePaths.includes("/"));
  const moviesStats = surfaceStats.find((surface) => surface.samplePaths.includes("/movies-tv"));
  const missingAboutJourneys = journeySummaries.filter(
    (summary) =>
      summary.missingExpectedRoutes.includes("/about")
      && (summary.scenarioLabel === "Looking For A Reason To Trust" || summary.journeyOutcome !== "success"),
  );
  const professionalPartials = journeySummaries.filter(
    (summary) =>
      summary.journeyOutcome !== "success"
      && ["potential-client", "hiring-manager"].includes(summary.personaSlug),
  );
  const searchHeavyJourneys = journeySummaries.filter((summary) => summary.searchQueries.length > 0);
  const emotionalJourneysMissingWarmth = journeySummaries.filter(
    (summary) =>
      ["Romantic", "Reader", "Wanderer"].some((label) => summary.archetype.includes(label))
      && !summary.visitedRoutes.some((route) =>
        ["/about", "/writings", "/tiny-thoughts", "/music", "/cats/beverly-and-lucinda", "/twin-peaks-self"].includes(route),
      ),
  );
  const buildLogTrustMisses = journeySummaries.filter(
    (summary) =>
      ["Looking For A Reason To Trust", "Looking For Something Specific"].includes(summary.scenarioLabel)
      && ["potential-client", "hiring-manager", "skeptic", "builder"].includes(summary.personaSlug)
      && summary.missingExpectedRoutes.includes("/build-log"),
  );
  const warmTextureTodo = recurringTodos.medium.find((item) => item.text.includes("Thread more warm real-life texture"));
  const startHereTodo = recurringTodos.medium.find((item) => item.text.includes('lightweight persona summary banner'));

  if (homepageStats || startHereTodo || warmTextureTodo) {
    const personas = new Set<string>();
    const scenarios = new Set<string>();

    for (const summary of journeySummaries.filter((summary) => summary.visitedRoutes.includes("/"))) {
      personas.add(summary.persona);
      scenarios.add(summary.scenarioLabel);
    }

    const evidenceCount =
      (homepageStats?.highOverwhelmCount ?? 0)
      + (journeyCountForRoute(journeySummaries, "/"))
      + (startHereTodo?.count ?? 0)
      + (warmTextureTodo?.count ?? 0);

    recommendations.push(makeRecommendation({
      id: "homepage-first-visit-frame",
      area: "Homepage",
      priority: "High Priority",
      evidenceCount,
      personaCount: personas.size || auditSummaries.length,
      scenarioCount: scenarios.size,
      affectedPersonas: Array.from(personas),
      affectedScenarios: Array.from(scenarios),
      suggestedImprovement:
        "Give the homepage a calmer first screen: one short site summary, two or three clear starting paths, one warm personal hook before the denser room grid, and a visible \"New here?\" or \"Start here\" block.",
      expectedBenefit:
        "Reduces first-visit fatigue, improves orientation, and helps both personal and professional visitors choose a path faster.",
      rationale:
        "Multiple visitors independently point to homepage density, weak first-step orientation, and a need for a clearer emotional entry point.",
      statusNote:
        "Implemented but not yet reflected in deterministic metrics. Human review says the first-screen path is clearer, so pause unless future evidence shows continued friction.",
    }));
  }

  if (missingAboutJourneys.length > 0) {
    recommendations.push(makeRecommendation({
      id: "about-trust-path",
      area: "About",
      priority: "High Priority",
      evidenceCount: missingAboutJourneys.length + professionalPartials.length,
      personaCount: new Set(missingAboutJourneys.map((summary) => summary.persona)).size,
      scenarioCount: new Set(missingAboutJourneys.map((summary) => summary.scenarioLabel)).size,
      affectedPersonas: Array.from(new Set(missingAboutJourneys.map((summary) => summary.persona))),
      affectedScenarios: Array.from(new Set(missingAboutJourneys.map((summary) => summary.scenarioLabel))),
      suggestedImprovement:
        "Make the About page easier to reach from the homepage, Work With Me, and Build Log; position it as the human trust hub; and add clear paths onward to writing, cats, music, projects, and Work With Me.",
      expectedBenefit:
        "Improves credibility for trust-seeking visitors and makes professional journeys feel more complete before they decide whether to continue.",
      rationale:
        "The same trust-oriented journeys keep forming only partial confidence when they never reach About.",
      statusNote:
        "Human review says this path is clear. Treat this as implemented but not yet reflected in deterministic metrics, and pause unless future evidence shows continued friction.",
    }));
  }

  if (buildLogTrustMisses.length > 0) {
    recommendations.push(makeRecommendation({
      id: "build-log-trust-proof",
      area: "Build Log",
      priority: "Medium Priority",
      evidenceCount: buildLogTrustMisses.length,
      personaCount: new Set(buildLogTrustMisses.map((summary) => summary.persona)).size,
      scenarioCount: new Set(buildLogTrustMisses.map((summary) => summary.scenarioLabel)).size,
      affectedPersonas: Array.from(new Set(buildLogTrustMisses.map((summary) => summary.persona))),
      affectedScenarios: Array.from(new Set(buildLogTrustMisses.map((summary) => summary.scenarioLabel))),
      suggestedImprovement:
        "Make Build Log easier to discover from professional trust paths, cross-link it with About and Work With Me, and clarify near the top why it matters as evidence of real iteration.",
      expectedBenefit:
        "Helps proof-seeking visitors reach a concrete credibility signal sooner without forcing everything through Search.",
      rationale:
        "Professional and trust-oriented journeys repeatedly expect Build Log to help confirm credibility, but that proof path is still too easy to miss.",
      statusNote:
        "Human review says this path is clear enough now. Keep it out of top active work unless later evidence shows it is genuinely weak.",
    }));
  }

  if (professionalPartials.length > 0) {
    recommendations.push(makeRecommendation({
      id: "professional-trust-crosslinks",
      area: "Cross-linking",
      priority: "High Priority",
      evidenceCount: professionalPartials.length * 2,
      personaCount: new Set(professionalPartials.map((summary) => summary.persona)).size,
      scenarioCount: new Set(professionalPartials.map((summary) => summary.scenarioLabel)).size,
      affectedPersonas: Array.from(new Set(professionalPartials.map((summary) => summary.persona))),
      affectedScenarios: Array.from(new Set(professionalPartials.map((summary) => summary.scenarioLabel))),
      suggestedImprovement:
        "Treat About, Work With Me, and Build Log as one trust cluster with visible cross-links, and make each page explain why the others matter so proof, personality, and next steps reinforce each other.",
      expectedBenefit:
        "Makes client and hiring-manager journeys feel more coherent and lowers the odds of a technically impressive but emotionally incomplete visit.",
      rationale:
        "Professional trust journeys are no longer failing silently; they are explicitly landing as partial when the trust cluster is incomplete.",
      statusNote:
        "Implemented but not yet reflected in deterministic metrics. Human review says this trust cluster is clear, so pause unless future evidence shows continued friction.",
    }));
  }

  if (moviesStats && moviesStats.highOverwhelmCount >= 8) {
    recommendations.push(makeRecommendation({
      id: "movies-tv-first-screen",
      area: "Overall UX",
      priority: "Medium Priority",
      evidenceCount: moviesStats.highOverwhelmCount,
      personaCount: Math.min(auditSummaries.length, moviesStats.highOverwhelmCount),
      scenarioCount: 0,
      affectedPersonas: auditSummaries.map((summary) => summary.persona),
      affectedScenarios: [],
      suggestedImprovement:
        "Reframe the Movies & TV page so its top section explains why the room exists before dropping visitors into dense content, and make the opening feel more intentionally paced.",
      expectedBenefit:
        "Prevents a non-core room from feeling as busy as the homepage and makes the site feel more intentionally paced overall.",
      rationale:
        "This room repeatedly shows up as high-density without offering clear first-visit payoff for most audiences.",
      statusNote:
        "Implemented but not yet reflected in deterministic metrics. Pause unless future evidence shows continued friction.",
    }));
  }

  if (searchHeavyJourneys.length >= 3) {
    recommendations.push(makeRecommendation({
      id: "search-support-not-crutch",
      area: "Search",
      priority: "Medium Priority",
      evidenceCount: searchHeavyJourneys.length,
      personaCount: new Set(searchHeavyJourneys.map((summary) => summary.persona)).size,
      scenarioCount: new Set(searchHeavyJourneys.map((summary) => summary.scenarioLabel)).size,
      affectedPersonas: Array.from(new Set(searchHeavyJourneys.map((summary) => summary.persona))),
      affectedScenarios: Array.from(new Set(searchHeavyJourneys.map((summary) => summary.scenarioLabel))),
      suggestedImprovement:
        "Keep Search strong for direct-finding visitors, but pair it with clearer suggested routes on the homepage and professional pages so it is not the only fast path.",
      expectedBenefit:
        "Preserves efficiency for task-focused visitors while reducing over-reliance on search as a substitute for navigation.",
      rationale:
        "Search is useful, but recurring journeys show it stepping in where clearer route framing should probably do some of the work.",
    }));
  }

  const twinPeaksMisses = journeySummaries.filter((summary) =>
    summary.missingExpectedRoutes.includes("/games/between-two-lodges")
    || summary.missingExpectedRoutes.includes("/twin-peaks-self"),
  );

  if (twinPeaksMisses.length > 0) {
    recommendations.push(makeRecommendation({
      id: "twin-peaks-crosslinking",
      area: "Twin Peaks",
      priority: "Low Priority",
      evidenceCount: twinPeaksMisses.length,
      personaCount: new Set(twinPeaksMisses.map((summary) => summary.persona)).size,
      scenarioCount: new Set(twinPeaksMisses.map((summary) => summary.scenarioLabel)).size,
      affectedPersonas: Array.from(new Set(twinPeaksMisses.map((summary) => summary.persona))),
      affectedScenarios: Array.from(new Set(twinPeaksMisses.map((summary) => summary.scenarioLabel))),
      suggestedImprovement:
        "Add clearer links between Twin Peaks Self and Between Two Lodges so mood-led visitors can discover the whole Twin Peaks corner more easily.",
      expectedBenefit:
        "Improves payoff for niche visitors without raising first-visit complexity for everyone else.",
      rationale:
        "The Twin Peaks slice is interesting once found, but representative journeys do not naturally reach all of it yet.",
    }));
  }

  const arcadeOrGameNeverSelected = routesNeverSelected.filter((route) =>
    ["/arcade", "/games/between-two-lodges"].includes(route),
  );

  if (arcadeOrGameNeverSelected.length > 0) {
    recommendations.push(makeRecommendation({
      id: "arcade-games-visibility",
      area: "Arcade",
      priority: "Low Priority",
      evidenceCount: arcadeOrGameNeverSelected.length,
      personaCount: 0,
      scenarioCount: 0,
      affectedPersonas: [],
      affectedScenarios: [],
      suggestedImprovement:
        "Review whether Arcade and Between Two Lodges should stay intentionally niche or get one stronger path from Search, Movies & TV, or the homepage's weirder routes.",
      expectedBenefit:
        "Clarifies whether these rooms should be more discoverable or simply remain rewarding side paths for people who find them.",
      rationale:
        "Some eligible weird or game routes are still not selected by representative journeys, which may reflect either niche intent or a discoverability gap.",
    }));
  }

  if (emotionalJourneysMissingWarmth.length > 0) {
    recommendations.push(makeRecommendation({
      id: "warmth-route-orientation",
      area: "Navigation",
      priority: "Medium Priority",
      evidenceCount: emotionalJourneysMissingWarmth.length,
      personaCount: new Set(emotionalJourneysMissingWarmth.map((summary) => summary.persona)).size,
      scenarioCount: new Set(emotionalJourneysMissingWarmth.map((summary) => summary.scenarioLabel)).size,
      affectedPersonas: Array.from(new Set(emotionalJourneysMissingWarmth.map((summary) => summary.persona))),
      affectedScenarios: Array.from(new Set(emotionalJourneysMissingWarmth.map((summary) => summary.scenarioLabel))),
      suggestedImprovement:
        "Strengthen links from the homepage and About into warmer personality rooms like Writings, Tiny Thoughts, Cats, Music, and Twin Peaks Self.",
      expectedBenefit:
        "Makes emotionally led journeys feel intentionally guided instead of requiring visitors to infer where the human texture lives.",
      rationale:
        "Several personality-first journeys still succeed only partially when they do not naturally encounter the warmer rooms they were implicitly looking for.",
    }));
  }

  return recommendations
    .sort(compareRecommendations)
    .slice(0, 12);
}

function makeRecommendation(args: Omit<ProductRecommendation, "confidence">) {
  return {
    ...args,
    confidence: computeRecommendationConfidence(args.evidenceCount, args.personaCount, args.scenarioCount),
  };
}

function computeRecommendationConfidence(
  evidenceCount: number,
  personaCount: number,
  scenarioCount: number,
): RecommendationConfidence {
  const score = evidenceCount + personaCount * 2 + scenarioCount;

  if (score >= 18) {
    return "High Confidence";
  }

  if (score >= 8) {
    return "Medium Confidence";
  }

  return "Low Confidence";
}

function compareRecommendations(left: ProductRecommendation, right: ProductRecommendation) {
  const priorityWeight = (priority: RecommendationPriority) =>
    priority === "High Priority" ? 3 : priority === "Medium Priority" ? 2 : 1;
  const confidenceWeight = (confidence: RecommendationConfidence) =>
    confidence === "High Confidence" ? 3 : confidence === "Medium Confidence" ? 2 : 1;

  return (
    priorityWeight(right.priority) - priorityWeight(left.priority)
    || confidenceWeight(right.confidence) - confidenceWeight(left.confidence)
    || right.evidenceCount - left.evidenceCount
    || left.area.localeCompare(right.area)
  );
}

function journeyCountForRoute(summaries: JourneySummaryRecord[], route: string) {
  return summaries.filter((summary) => summary.nearBounceRoute === route || summary.visitedRoutes.includes(route)).length;
}

function summarizeNames(items: string[], limit: number) {
  const unique = Array.from(new Set(items.filter(Boolean)));

  if (unique.length === 0) {
    return "No specific visitors captured yet";
  }

  if (unique.length <= limit) {
    return unique.map((item) => `\`${item}\``).join(", ");
  }

  const shown = unique.slice(0, limit).map((item) => `\`${item}\``).join(", ");
  return `${shown}, and ${unique.length - limit} more`;
}

function normalizeRecurringTodos(input: unknown) {
  const fallback = { high: [], medium: [], low: [] } as {
    high: Array<{ text: string; count: number }>;
    medium: Array<{ text: string; count: number }>;
    low: Array<{ text: string; count: number }>;
  };

  if (!input || typeof input !== "object") {
    return fallback;
  }

  const record = input as Record<string, unknown>;

  return {
    high: Array.isArray(record.high) ? record.high as Array<{ text: string; count: number }> : [],
    medium: Array.isArray(record.medium) ? record.medium as Array<{ text: string; count: number }> : [],
    low: Array.isArray(record.low) ? record.low as Array<{ text: string; count: number }> : [],
  };
}

function normalizeSurfaceStats(input: unknown) {
  return Array.isArray(input) ? input as Array<{
    label: string;
    averageInterest: number;
    averageUsability: number;
    highOverwhelmCount: number;
    mediumOverwhelmCount: number;
    primaryPriorityCount: number;
    secondaryPriorityCount: number;
    samplePaths: string[];
  }> : [];
}

function readJsonIfExists(filePath: string) {
  if (!existsSync(filePath)) {
    return null;
  }

  return JSON.parse(readFileSync(filePath, "utf8"));
}

export function readCombinedPersonasAndJourneysSummary() {
 return readJsonIfExists(
    resolve(getCombinedPersonaJourneyOutputDir(), "summary.json"),
  );
}

function aggregateJourneyOutcomesByScenario(summaries: JourneySummaryRecord[]) {
  const counts: Record<string, Record<"success" | "partial" | "failed", number>> = {};

  for (const summary of summaries) {
    counts[summary.scenarioLabel] ??= { success: 0, partial: 0, failed: 0 };
    counts[summary.scenarioLabel][summary.journeyOutcome] += 1;
  }

  return counts;
}

function countBy(values: string[]) {
  const counts: Record<string, number> = {};

  for (const value of values) {
    counts[value] = (counts[value] ?? 0) + 1;
  }

  return counts;
}

function rankCountEntries(counts: Record<string, number>) {
  return Object.entries(counts).sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]));
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
