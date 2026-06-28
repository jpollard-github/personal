import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Page } from "@playwright/test";
import type { PersonaDefinition } from "./persona-manifest";
import type { PersonaProfile } from "./persona-profile";
import { getPersonaJourneyOutputDir } from "./persona-report";
import type { JourneyExitState, JourneyScenarioDefinition, JourneyScenarioId } from "./persona-scenarios";
import { getJourneyScenarioDefinition } from "./persona-scenarios";
import type { SiteSurface } from "./site-surfaces";

export type JourneyBounceRisk = "low" | "medium" | "high";

export type PersonaJourneyPlan = {
  scenarioId: JourneyScenarioId;
  scenarioLabel: string;
  scenarioGoal: string;
  scenarioInfluences: string[];
  archetype: string;
  archetypeInfluences: string[];
  context: string;
  contextInfluences: string[];
  targetPageCount: number;
  maxPageCount: number;
  visitedSurfaceIds: string[];
  skippedSurfaceIds: string[];
  expectedRouteSurfaceIds: string[];
  missingExpectedRouteSurfaceIds: string[];
  expectedRouteWarnings: string[];
  skippedRouteReasons: JourneyRouteReason[];
  searchQueries: string[];
  bounceRisk: JourneyBounceRisk;
  bounceReasons: string[];
  nearBounceRoute?: string;
  success: boolean;
  matchedSuccessConditionLabels: string[];
  trustSignalHits: JourneyRouteReason[];
  goalSatisfactionEvidence: JourneyRouteReason[];
  exitState: JourneyExitState;
  journeyNotes: string[];
};

type JourneyConfidenceThreshold = "low" | "medium" | "high";

type JourneyConfidenceSettings = {
  threshold: JourneyConfidenceThreshold;
  minPages: number;
  maxPages: number;
  pageDelta: number;
  searchBias: number;
  requiredTrustSignals: number;
  orientationPenalty: number;
  easyAction: boolean;
};

const trustSignalSurfaceIds = ["home", "about", "work-with-me", "build-log", "writings", "updates"];
const noveltySurfaceIds = [
  "music",
  "arcade",
  "movies-tv",
  "twin-peaks-self",
  "games-between-two-lodges",
  "cats-beverly",
  "cats-thomas",
  "tiny-thoughts",
];

export type PersonaJourneySummary = {
  persona: string;
  personaSlug: string;
  generatedAt: string;
  scenarioId: JourneyScenarioId;
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
  missingExpectedRoutes: string[];
  expectedRouteWarnings: string[];
  skippedRouteReasons: JourneyRouteReason[];
  searchQueries: string[];
  bounceRisk: JourneyBounceRisk;
  bounceReasons: string[];
  nearBounceRoute?: string;
  success: boolean;
  matchedSuccessConditionLabels: string[];
  trustSignalHits: JourneyRouteReason[];
  goalSatisfactionEvidence: JourneyRouteReason[];
  exitState: JourneyExitState;
  journeyNotes: string[];
};

export type JourneyRouteReason = {
  surfaceId: string;
  label: string;
  route: string;
  reason: string;
};

type ArchetypeScenarioModifiers = {
  pageDelta: number;
  searchBias: number;
  curiosityDetours: number;
  technicalRooms: number;
  preferredSurfaceIds: string[];
  deEmphasizedSurfaceIds: string[];
  influenceNotes: string[];
};

type JourneyContextModifiers = {
  pageDelta: number;
  searchBias: number;
  trustBias: number;
  noveltyBias: number;
  preferredSurfaceIds: string[];
  deEmphasizedSurfaceIds: string[];
  influenceNotes: string[];
};

export async function runPersonaJourney(args: {
  page: Page;
  personaSlug: string;
  profile: PersonaProfile;
  definition: PersonaDefinition;
  publicSurfaces: SiteSurface[];
  scenarioId?: JourneyScenarioId;
  archetypeOverride?: string;
  contextOverride?: string;
}) {
  const {
    page,
    personaSlug,
    profile,
    definition,
    publicSurfaces,
    scenarioId = "first-visit",
    archetypeOverride,
    contextOverride,
  } = args;
  const scenario = getJourneyScenarioDefinition(scenarioId);
  const plan = planPersonaJourney({
    definition,
    profile,
    publicSurfaces,
    scenario,
    archetypeOverride,
    contextOverride,
  });
  const visitedSurfaces = plan.visitedSurfaceIds
    .map((surfaceId) => publicSurfaces.find((surface) => surface.id === surfaceId))
    .filter((surface): surface is SiteSurface => Boolean(surface));

  for (const [index, surface] of Array.from(visitedSurfaces.entries())) {
    await page.goto(surface.path, { waitUntil: "domcontentloaded" });

    if (surface.id === "search" && plan.searchQueries.length > 0) {
      const query = plan.searchQueries[Math.min(index, plan.searchQueries.length - 1)];
      await page.getByLabel("Search ArcadeGhosts").fill(query);
    }
  }

  return writePersonaJourneyReport({
    personaSlug,
    profile,
    plan,
    publicSurfaces,
  });
}

export function planPersonaJourney(args: {
  definition: PersonaDefinition;
  profile: PersonaProfile;
  publicSurfaces: SiteSurface[];
  scenario: JourneyScenarioDefinition;
  archetypeOverride?: string;
  contextOverride?: string;
}): PersonaJourneyPlan {
  const { definition, profile, publicSurfaces, scenario, archetypeOverride, contextOverride } = args;
  const archetype = archetypeOverride ?? definition.defaultArchetype ?? "Wanderer";
  const context = contextOverride ?? definition.defaultContext ?? "General browsing context.";
  const confidence = getJourneyConfidenceSettings(definition.confidenceThreshold);
  const eligibleSurfaces = publicSurfaces.filter((surface) => isJourneyEligibleSurface(surface));
  const archetypeModifiers = getArchetypeScenarioModifiers(archetype);
  const contextModifiers = getJourneyContextModifiers(context);
  const scenarioInfluences = describeScenarioInfluences(scenario);
  const targetPageCount = computeJourneyTargetPageCount(
    scenario,
    archetype,
    confidence,
    archetypeModifiers,
    contextModifiers,
  );
  const rankedSurfaces = eligibleSurfaces
    .map((surface) => ({
      surface,
      score: scoreSurfaceForJourney(
        surface,
        definition,
        scenario,
        archetype,
        confidence,
        archetypeModifiers,
        contextModifiers,
      ),
    }))
    .filter((entry) => entry.score > -50)
    .sort((left, right) => right.score - left.score || left.surface.label.localeCompare(right.surface.label));

  const visitedSurfaceIds: string[] = [];
  const selected = new Set<string>();
  const startSurface = eligibleSurfaces.find((surface) => surface.id === scenario.defaultStartSurfaceId)
    ?? eligibleSurfaces.find((surface) => surface.id === "home");

  if (startSurface) {
    visitedSurfaceIds.push(startSurface.id);
    selected.add(startSurface.id);
  }

  maybeIncludeSearchSurface({
    visitedSurfaceIds,
    selected,
    eligibleSurfaces,
    scenario,
    archetype,
    confidence,
    archetypeModifiers,
    contextModifiers,
  });

  for (const entry of rankedSurfaces) {
    if (visitedSurfaceIds.length >= targetPageCount) {
      break;
    }

    if (selected.has(entry.surface.id)) {
      continue;
    }

    visitedSurfaceIds.push(entry.surface.id);
    selected.add(entry.surface.id);
  }

  includeArchetypeDetours({
    visitedSurfaceIds,
    selected,
    rankedSurfaces,
    targetPageCount,
    archetypeModifiers,
  });

  const trustSignalCount = countJourneyTrustSignals(visitedSurfaceIds);
  const actionSurfaceId = maybeIncludeActionSurface({
    visitedSurfaceIds,
    selected,
    targetPageCount,
    scenario,
    confidence,
    trustSignalCount,
  });
  const successEvaluation = evaluateJourneySuccess(visitedSurfaceIds, scenario);
  const skippedSurfaceIds = eligibleSurfaces
    .map((surface) => surface.id)
    .filter((surfaceId) => !selected.has(surfaceId));
  const searchQueries = buildJourneySearchQueries(profile, definition, scenario, archetype, visitedSurfaceIds);
  const expectedRouteSurfaceIds = getExpectedRouteSurfaceIds(definition, scenario, archetype);
  const missingExpectedRouteSurfaceIds = expectedRouteSurfaceIds.filter(
    (surfaceId) => !visitedSurfaceIds.includes(surfaceId),
  );
  const expectedRouteWarnings = buildExpectedRouteWarnings(expectedRouteSurfaceIds, missingExpectedRouteSurfaceIds);
  const trustSignalHits = buildTrustSignalHits(visitedSurfaceIds, publicSurfaces, scenario);
  const goalSatisfactionEvidence = buildGoalSatisfactionEvidence(
    visitedSurfaceIds,
    publicSurfaces,
    scenario,
    successEvaluation.matchedSuccessConditionLabels,
  );
  const skippedRouteReasons = buildSkippedRouteReasons(
    skippedSurfaceIds,
    publicSurfaces,
    definition,
    scenario,
    archetype,
    confidence,
    contextModifiers,
  );
  const bounceAnalysis = computeJourneyBounceAnalysis(
    definition,
    scenario,
    archetype,
    confidence,
    contextModifiers,
    visitedSurfaceIds,
    searchQueries,
    trustSignalCount,
  );
  const resolvedExitState = decideJourneyExitState({
    scenario,
    bounceRisk: bounceAnalysis.risk,
    success: successEvaluation.success,
    visitedSurfaceIds,
  });
  const journeyNotes = buildJourneyNotes({
    definition,
    scenario,
    scenarioInfluences,
    archetype,
    archetypeInfluences: archetypeModifiers.influenceNotes,
    context,
    contextInfluences: contextModifiers.influenceNotes,
    targetPageCount,
    visitedSurfaceIds,
    expectedRouteSurfaceIds,
    missingExpectedRouteSurfaceIds,
    expectedRouteWarnings,
    searchQueries,
    bounceRisk: bounceAnalysis.risk,
    confidence,
    actionSurfaceId,
    trustSignalCount,
    success: successEvaluation.success,
    matchedSuccessConditionLabels: successEvaluation.matchedSuccessConditionLabels,
    trustSignalHits,
    goalSatisfactionEvidence,
    skippedRouteReasons,
    bounceReasons: bounceAnalysis.reasons,
    nearBounceRoute: bounceAnalysis.nearBounceRoute,
    exitState: resolvedExitState,
  });

  return {
    scenarioId: scenario.id,
    scenarioLabel: scenario.label,
    scenarioGoal: scenario.goal,
    scenarioInfluences,
    archetype,
    archetypeInfluences: archetypeModifiers.influenceNotes,
    context,
    contextInfluences: contextModifiers.influenceNotes,
    targetPageCount,
    maxPageCount: scenario.maxPages,
    visitedSurfaceIds,
    skippedSurfaceIds,
    expectedRouteSurfaceIds,
    missingExpectedRouteSurfaceIds,
    expectedRouteWarnings,
    skippedRouteReasons,
    searchQueries,
    bounceRisk: bounceAnalysis.risk,
    bounceReasons: bounceAnalysis.reasons,
    nearBounceRoute: bounceAnalysis.nearBounceRoute,
    success: successEvaluation.success,
    matchedSuccessConditionLabels: successEvaluation.matchedSuccessConditionLabels,
    trustSignalHits,
    goalSatisfactionEvidence,
    exitState: resolvedExitState,
    journeyNotes,
  };
}

function isJourneyEligibleSurface(surface: SiteSurface) {
  return surface.area === "public" && !surface.id.startsWith("error-preview");
}

function scoreSurfaceForJourney(
  surface: SiteSurface,
  definition: PersonaDefinition,
  scenario: JourneyScenarioDefinition,
  archetype: string,
  confidence: JourneyConfidenceSettings,
  archetypeModifiers: ArchetypeScenarioModifiers,
  contextModifiers: JourneyContextModifiers,
) {
  const normalizedArchetype = archetype.toLowerCase();
  let score = 0;

  if (surface.id === scenario.defaultStartSurfaceId) {
    score += 120;
  }

  const preferredIndex = definition.preferredSurfaceIds?.indexOf(surface.id) ?? -1;

  if (preferredIndex >= 0) {
    score += 100 - preferredIndex * 5;
  }

  if (definition.ignoredSurfaceIds?.includes(surface.id)) {
    score -= 120;
  }

  if (definition.deEmphasizedSurfaceIds?.includes(surface.id)) {
    score -= 30;
  }

  if (archetypeModifiers.deEmphasizedSurfaceIds.includes(surface.id)) {
    score -= 16;
  }

  if (contextModifiers.deEmphasizedSurfaceIds.includes(surface.id)) {
    score -= 22;
  }

  if (archetypeModifiers.preferredSurfaceIds.includes(surface.id)) {
    score += 18;
  }

  if (contextModifiers.preferredSurfaceIds.includes(surface.id)) {
    score += 24;
  }

  if (confidence.threshold === "high" && noveltySurfaceIds.includes(surface.id)) {
    score -= 18;
  }

  if (confidence.threshold === "low" && noveltySurfaceIds.includes(surface.id)) {
    score += 8;
  }

  for (const tag of surface.tags) {
    if (definition.preferredTags.includes(tag)) {
      score += 10;
    }
  }

  if (normalizedArchetype.includes("hunter")) {
    score += boostIf(surface.id, ["home", "search", "work-with-me", "build-log", "updates"], 35);
    score += boostIfTag(surface.tags, ["find", "orientation", "projects", "software"], 8);
  }

  if (normalizedArchetype.includes("reader")) {
    score += boostIf(surface.id, ["about", "writings", "tiny-thoughts"], 35);
    score += boostIfTag(surface.tags, ["writing", "thoughtful", "essay"], 8);
  }

  if (normalizedArchetype.includes("scanner")) {
    score += boostIf(surface.id, ["home", "about", "search", "updates", "work-with-me"], 25);
    score -= boostIfTag(surface.tags, ["detail"], 4);
  }

  if (normalizedArchetype.includes("wanderer")) {
    score += boostIf(surface.id, ["about", "music", "arcade", "twin-peaks-self", "cats-beverly", "cats-thomas"], 20);
    score += boostIf(surface.id, ["tiny-thoughts", "movies-tv", "games-between-two-lodges"], 14);
  }

  if (normalizedArchetype.includes("builder")) {
    score += boostIf(surface.id, ["build-log", "work-with-me", "search", "updates"], 30);
    score += boostIfTag(surface.tags, ["projects", "software", "discovery"], 8);
  }

  if (normalizedArchetype.includes("romantic")) {
    score += boostIf(surface.id, ["about", "cats-beverly", "cats-thomas", "writings", "music", "tiny-thoughts"], 25);
  }

  if (scenario.id === "looking-for-trust") {
    score += boostIf(surface.id, ["about", "work-with-me", "build-log", "writings", "updates"], 36);
  }

  if (scenario.id === "looking-for-something-specific") {
    score += boostIf(surface.id, ["search", "work-with-me", "build-log"], 44);
  }

  if (scenario.id === "deciding-whether-to-return" || scenario.id === "returning-after-time-away") {
    score += boostIf(surface.id, ["updates", "tiny-thoughts", "writings", "build-log", "music"], 42);
  }

  if (scenario.id === "low-attention-visit") {
    score += boostIf(surface.id, ["home", "about", "search", "work-with-me"], 34);
    if (surface.id.startsWith("writing-") || surface.id.startsWith("project-")) {
      score -= 24;
    }
  }

  if (scenario.id === "deep-browse") {
    score += boostIfTag(surface.tags, ["writing", "projects", "music", "twin"], 12);
    score += boostIf(surface.id, ["writings", "tiny-thoughts", "music", "twin-peaks-self", "arcade"], 16);
  }

  if (contextModifiers.trustBias > 0) {
    score += boostIf(surface.id, ["about", "build-log", "work-with-me", "writings", "updates"], contextModifiers.trustBias * 8);
  }

  if (contextModifiers.noveltyBias > 0) {
    score += boostIf(surface.id, noveltySurfaceIds, contextModifiers.noveltyBias * 6);
  }

  if (confidence.threshold === "high") {
    score += boostIf(surface.id, ["about", "build-log", "work-with-me", "writings", "updates"], 10);
  }

  if (confidence.threshold === "low" && normalizedArchetype.includes("wanderer")) {
    score += boostIf(surface.id, ["tiny-thoughts", "music", "arcade", "cats-beverly"], 10);
  }

  return score;
}

function getJourneyConfidenceSettings(
  confidenceThreshold: PersonaDefinition["confidenceThreshold"],
): JourneyConfidenceSettings {
  if (confidenceThreshold === "low") {
    return {
      threshold: "low",
      minPages: 5,
      maxPages: 7,
      pageDelta: 1,
      searchBias: -2,
      requiredTrustSignals: 1,
      orientationPenalty: 0,
      easyAction: true,
    };
  }

  if (confidenceThreshold === "high") {
    return {
      threshold: "high",
      minPages: 2,
      maxPages: 5,
      pageDelta: -1,
      searchBias: 1,
      requiredTrustSignals: 2,
      orientationPenalty: 2,
      easyAction: false,
    };
  }

  return {
    threshold: "medium",
    minPages: 4,
    maxPages: 6,
    pageDelta: 0,
    searchBias: 0,
    requiredTrustSignals: 1,
    orientationPenalty: 1,
    easyAction: false,
  };
}

function computeJourneyTargetPageCount(
  scenario: JourneyScenarioDefinition,
  archetype: string,
  confidence: JourneyConfidenceSettings,
  archetypeModifiers: ArchetypeScenarioModifiers,
  contextModifiers: JourneyContextModifiers,
) {
  const normalizedArchetype = archetype.toLowerCase();
  let target =
    scenario.targetPages + confidence.pageDelta + archetypeModifiers.pageDelta + contextModifiers.pageDelta;

  if (scenario.deepBrowse) {
    target += 1;
  }

  if (scenario.lowAttention) {
    target -= 1;
  }

  if (normalizedArchetype.includes("wanderer") || normalizedArchetype.includes("reader")) {
    target += 1;
  }

  if (normalizedArchetype.includes("scanner")) {
    target -= 1;
  }

  if (normalizedArchetype.includes("romantic") && confidence.threshold === "low") {
    target += 1;
  }

  return clamp(target, confidence.minPages, Math.min(confidence.maxPages, scenario.maxPages));
}

function maybeIncludeSearchSurface(args: {
  visitedSurfaceIds: string[];
  selected: Set<string>;
  eligibleSurfaces: SiteSurface[];
  scenario: JourneyScenarioDefinition;
  archetype: string;
  confidence: JourneyConfidenceSettings;
  archetypeModifiers: ArchetypeScenarioModifiers;
  contextModifiers: JourneyContextModifiers;
}) {
  const { visitedSurfaceIds, selected, eligibleSurfaces, scenario, archetype, confidence, archetypeModifiers, contextModifiers } = args;

  if (!shouldUseSearchInJourney(scenario, archetype, confidence, archetypeModifiers, contextModifiers)) {
    return;
  }

  const searchSurface = eligibleSurfaces.find((surface) => surface.id === "search");

  if (!searchSurface || selected.has(searchSurface.id)) {
    return;
  }

  visitedSurfaceIds.push(searchSurface.id);
  selected.add(searchSurface.id);
}

function shouldUseSearchInJourney(
  scenario: JourneyScenarioDefinition,
  archetype: string,
  confidence: JourneyConfidenceSettings,
  archetypeModifiers: ArchetypeScenarioModifiers,
  contextModifiers: JourneyContextModifiers,
) {
  const normalizedArchetype = archetype.toLowerCase();
  let score = confidence.searchBias + archetypeModifiers.searchBias + contextModifiers.searchBias;

  if (scenario.prefersSearch) {
    score += 2;
  }

  if (scenario.trustFocused || scenario.lowAttention) {
    score += 1;
  }

  if (normalizedArchetype.includes("hunter") || normalizedArchetype.includes("builder")) {
    score += 2;
  }

  if (normalizedArchetype.includes("scanner")) {
    score += 1;
  }

  if (normalizedArchetype.includes("wanderer")) {
    score -= 2;
  }

  if (normalizedArchetype.includes("reader") || normalizedArchetype.includes("romantic")) {
    score -= 1;
  }

  if (scenario.returnFocused) {
    score -= 1;
  }

  return score >= 2;
}

function getArchetypeScenarioModifiers(archetype: string): ArchetypeScenarioModifiers {
  const normalizedArchetype = archetype.toLowerCase();
  const modifiers: ArchetypeScenarioModifiers = {
    pageDelta: 0,
    searchBias: 0,
    curiosityDetours: 0,
    technicalRooms: 0,
    preferredSurfaceIds: [],
    deEmphasizedSurfaceIds: [],
    influenceNotes: [],
  };

  if (normalizedArchetype.includes("scanner")) {
    modifiers.pageDelta -= 1;
    modifiers.preferredSurfaceIds.push("home", "about", "search", "updates");
    modifiers.influenceNotes.push("Scanner behavior keeps the route short and front-loads orientation rooms.");
  }

  if (normalizedArchetype.includes("hunter")) {
    modifiers.searchBias += 2;
    modifiers.preferredSurfaceIds.push("search", "work-with-me", "build-log");
    modifiers.deEmphasizedSurfaceIds.push("cats-beverly", "cats-thomas", "twin-peaks-self");
    modifiers.influenceNotes.push("Hunter behavior pulls direct-finding rooms like Search and proof rooms earlier.");
  }

  if (normalizedArchetype.includes("reader")) {
    modifiers.pageDelta += 1;
    modifiers.preferredSurfaceIds.push("about", "writings", "tiny-thoughts");
    modifiers.influenceNotes.push("Reader behavior gives more room to reflective pages like About and Writings.");
  }

  if (normalizedArchetype.includes("wanderer")) {
    modifiers.pageDelta += 1;
    modifiers.searchBias -= 1;
    modifiers.curiosityDetours += 1;
    modifiers.preferredSurfaceIds.push("music", "arcade", "tiny-thoughts", "twin-peaks-self", "cats-beverly");
    modifiers.influenceNotes.push("Wanderer behavior adds a curiosity detour instead of forcing the shortest path.");
  }

  if (normalizedArchetype.includes("builder")) {
    modifiers.searchBias += 1;
    modifiers.technicalRooms += 1;
    modifiers.preferredSurfaceIds.push("build-log", "work-with-me", "search");
    modifiers.deEmphasizedSurfaceIds.push("movies-tv", "cats-beverly", "cats-thomas");
    modifiers.influenceNotes.push("Builder behavior inserts technical proof rooms even when softer pages are available.");
  }

  if (normalizedArchetype.includes("romantic")) {
    modifiers.pageDelta += 1;
    modifiers.preferredSurfaceIds.push("about", "cats-beverly", "cats-thomas", "music", "tiny-thoughts");
    modifiers.influenceNotes.push("Romantic behavior prioritizes warmth, atmosphere, and human texture.");
  }

  return modifiers;
}

function getJourneyContextModifiers(context: string): JourneyContextModifiers {
  const normalized = context.toLowerCase();
  const modifiers: JourneyContextModifiers = {
    pageDelta: 0,
    searchBias: 0,
    trustBias: 0,
    noveltyBias: 0,
    preferredSurfaceIds: [],
    deEmphasizedSurfaceIds: [],
    influenceNotes: [],
  };

  if (
    /(busy|time pressure|time-pressure|decision-heavy|lunch break|short on time|low patience)/.test(normalized)
  ) {
    modifiers.pageDelta -= 1;
    modifiers.searchBias += 2;
    modifiers.preferredSurfaceIds.push("search", "work-with-me", "about", "updates");
    modifiers.deEmphasizedSurfaceIds.push("writings", "tiny-thoughts", "cats-beverly", "cats-thomas");
    modifiers.influenceNotes.push("Busy or time-pressured context pushes direct orientation and shorter routes.");
  }

  if (/(evening|late night|late-night|weekend|relaxed|enough time|quiet attention)/.test(normalized)) {
    modifiers.pageDelta += 1;
    modifiers.noveltyBias += 1;
    modifiers.preferredSurfaceIds.push("writings", "tiny-thoughts", "music", "cats-beverly", "cats-thomas");
    modifiers.influenceNotes.push("Slower evening-style context allows more wandering into reflective rooms.");
  }

  if (/(skeptical|skeptic|cautious|reduce risk|risk|unwilling to waste time)/.test(normalized)) {
    modifiers.trustBias += 2;
    modifiers.preferredSurfaceIds.push("about", "build-log", "work-with-me", "updates", "writings");
    modifiers.deEmphasizedSurfaceIds.push("arcade", "twin-peaks-self", "games-between-two-lodges");
    modifiers.influenceNotes.push("Cautious context pulls trust-building rooms forward and delays novelty.");
  }

  if (/(playful|exploratory|curious|emotionally open|looking for signal|looking for mood)/.test(normalized)) {
    modifiers.noveltyBias += 2;
    modifiers.preferredSurfaceIds.push("music", "arcade", "twin-peaks-self", "tiny-thoughts", "cats-beverly");
    modifiers.influenceNotes.push("Curious or playful context gives novelty rooms more permission to enter the route.");
  }

  if (/(calm|quiet|low appetite for chaos|warm|human|connection)/.test(normalized)) {
    modifiers.preferredSurfaceIds.push("about", "writings", "cats-beverly", "cats-thomas", "tiny-thoughts");
    modifiers.deEmphasizedSurfaceIds.push("search");
    modifiers.influenceNotes.push("Calm or connection-seeking context leans toward gentler, more human rooms.");
  }

  return modifiers;
}

function describeScenarioInfluences(scenario: JourneyScenarioDefinition) {
  if (scenario.id === "looking-for-trust") {
    return [
      "Trust scenario prioritizes About plus at least one proof room before novelty.",
      "Action routes matter only after confidence-building pages are visited.",
    ];
  }

  if (scenario.id === "looking-for-something-specific") {
    return [
      "Task-oriented scenario strongly favors Search and direct proof paths.",
      "Low-signal detours lose priority because the goal is completion, not atmosphere.",
    ];
  }

  if (scenario.id === "deciding-whether-to-return" || scenario.id === "returning-after-time-away") {
    return [
      "Return-oriented scenario favors freshness rooms like Updates, Build Log, and Tiny Thoughts.",
      "Static biography and novelty rooms get less weight than visible change.",
    ];
  }

  if (scenario.id === "low-attention-visit") {
    return [
      "Low-attention scenario pushes quick orientation and penalizes slow archival detours.",
      "The route is optimized to avoid bounce before interest deepens.",
    ];
  }

  if (scenario.id === "deep-browse") {
    return [
      "Deep-browse scenario rewards multi-room curiosity and allows slower atmospheric discoveries.",
      "Longer-form or mood-rich rooms gain weight because the visitor is willing to linger.",
    ];
  }

  return [
    "First-visit scenario prioritizes orientation so the visitor knows what this place is and where to go next.",
  ];
}

function includeArchetypeDetours(args: {
  visitedSurfaceIds: string[];
  selected: Set<string>;
  rankedSurfaces: Array<{ surface: SiteSurface; score: number }>;
  targetPageCount: number;
  archetypeModifiers: ArchetypeScenarioModifiers;
}) {
  const { visitedSurfaceIds, selected, rankedSurfaces, targetPageCount, archetypeModifiers } = args;

  if (archetypeModifiers.curiosityDetours > 0) {
    const curiosityCandidate = rankedSurfaces.find(
      (entry) => noveltySurfaceIds.includes(entry.surface.id) && !selected.has(entry.surface.id),
    );

    if (curiosityCandidate && visitedSurfaceIds.length < targetPageCount) {
      visitedSurfaceIds.push(curiosityCandidate.surface.id);
      selected.add(curiosityCandidate.surface.id);
    }
  }

  if (archetypeModifiers.technicalRooms > 0) {
    const technicalCandidate = rankedSurfaces.find(
      (entry) =>
        !selected.has(entry.surface.id) &&
        (entry.surface.id === "build-log" ||
          entry.surface.id === "work-with-me" ||
          entry.surface.id === "search" ||
          entry.surface.id.startsWith("project-") ||
          entry.surface.tags.some((tag) => ["software", "projects", "building", "discovery"].includes(tag))),
    );

    if (technicalCandidate && visitedSurfaceIds.length < targetPageCount) {
      visitedSurfaceIds.push(technicalCandidate.surface.id);
      selected.add(technicalCandidate.surface.id);
    }
  }
}

function countJourneyTrustSignals(visitedSurfaceIds: string[]) {
  return visitedSurfaceIds.filter((surfaceId) => trustSignalSurfaceIds.includes(surfaceId)).length;
}

function getExpectedRouteSurfaceIds(
  definition: PersonaDefinition,
  scenario: JourneyScenarioDefinition,
  archetype: string,
) {
  const normalizedArchetype = archetype.toLowerCase();
  const expected = new Set<string>();

  if (scenario.trustFocused) {
    ["about", "work-with-me", "build-log"].forEach((surfaceId) => expected.add(surfaceId));
  }

  if (scenario.returnFocused) {
    ["updates", "tiny-thoughts", "writings", "build-log"].forEach((surfaceId) => expected.add(surfaceId));
  }

  if (scenario.id === "looking-for-something-specific") {
    ["search", "work-with-me", "build-log"].forEach((surfaceId) => expected.add(surfaceId));
  }

  if (scenario.id === "first-visit") {
    ["home", "about"].forEach((surfaceId) => expected.add(surfaceId));
  }

  if (scenario.id === "deep-browse") {
    ["writings", "tiny-thoughts", "music", "twin-peaks-self", "arcade"].forEach((surfaceId) => expected.add(surfaceId));
  }

  if (normalizedArchetype.includes("romantic")) {
    ["about", "cats-beverly", "cats-thomas", "writings", "tiny-thoughts", "music", "twin-peaks-self"].forEach(
      (surfaceId) => expected.add(surfaceId),
    );
  }

  if (normalizedArchetype.includes("builder")) {
    ["build-log", "search", "work-with-me", "updates"].forEach((surfaceId) => expected.add(surfaceId));
  }

  if (normalizedArchetype.includes("hunter")) {
    ["search", "work-with-me"].forEach((surfaceId) => expected.add(surfaceId));
  }

  if (definition.preferredSurfaceIds?.length) {
    for (const surfaceId of definition.preferredSurfaceIds.slice(0, 3)) {
      expected.add(surfaceId);
    }
  }

  return Array.from(expected);
}

function buildExpectedRouteWarnings(
  expectedRouteSurfaceIds: string[],
  missingExpectedRouteSurfaceIds: string[],
) {
  if (expectedRouteSurfaceIds.length === 0) {
    return [];
  }

  if (missingExpectedRouteSurfaceIds.length === expectedRouteSurfaceIds.length) {
    return [
      `Expected-route warning: none of the likely route anchors were visited (${expectedRouteSurfaceIds.join(", ")}).`,
    ];
  }

  if (missingExpectedRouteSurfaceIds.length >= Math.max(3, Math.ceil(expectedRouteSurfaceIds.length * 0.6))) {
    return [
      `Expected-route warning: many likely route anchors were missed (${missingExpectedRouteSurfaceIds.join(", ")}).`,
    ];
  }

  return [];
}

function buildTrustSignalHits(
  visitedSurfaceIds: string[],
  publicSurfaces: SiteSurface[],
  scenario: JourneyScenarioDefinition,
): JourneyRouteReason[] {
  return visitedSurfaceIds
    .filter((surfaceId) => trustSignalSurfaceIds.includes(surfaceId))
    .map((surfaceId) => {
      const surface = publicSurfaces.find((entry) => entry.id === surfaceId);

      return {
        surfaceId,
        label: surface?.label ?? surfaceId,
        route: surface?.path ?? surfaceId,
        reason: trustSignalReason(surfaceId, scenario),
      };
    });
}

function trustSignalReason(surfaceId: string, scenario: JourneyScenarioDefinition) {
  if (surfaceId === "about") {
    return "Helped establish whether the person behind the site feels coherent and real.";
  }

  if (surfaceId === "build-log") {
    return "Provided proof of active building and visible iteration over time.";
  }

  if (surfaceId === "work-with-me") {
    return scenario.trustFocused
      ? "Turned general curiosity into a concrete sense of how working together might go."
      : "Offered a clearer action path once enough confidence had formed.";
  }

  if (surfaceId === "writings") {
    return "Added long-form voice and thoughtful proof that the tone is not manufactured.";
  }

  if (surfaceId === "updates") {
    return scenario.returnFocused
      ? "Showed that the site is still alive, which matters for return-oriented scenarios."
      : "Showed recent motion instead of a frozen portfolio.";
  }

  return "Contributed early orientation and trust.";
}

function evaluateJourneySuccess(visitedSurfaceIds: string[], scenario: JourneyScenarioDefinition) {
  const matchedSuccessConditionLabels = scenario.successConditions
    .filter((condition) => {
      const allOfPass = condition.allOf ? condition.allOf.every((surfaceId) => visitedSurfaceIds.includes(surfaceId)) : true;
      const anyOfPass = condition.anyOf ? condition.anyOf.some((surfaceId) => visitedSurfaceIds.includes(surfaceId)) : true;

      return allOfPass && anyOfPass;
    })
    .map((condition) => condition.label);

  return {
    success: matchedSuccessConditionLabels.length > 0,
    matchedSuccessConditionLabels,
  };
}

function buildGoalSatisfactionEvidence(
  visitedSurfaceIds: string[],
  publicSurfaces: SiteSurface[],
  scenario: JourneyScenarioDefinition,
  matchedSuccessConditionLabels: string[],
): JourneyRouteReason[] {
  const matchedConditions = scenario.successConditions.filter((condition) =>
    matchedSuccessConditionLabels.includes(condition.label),
  );
  const evidence = new Map<string, JourneyRouteReason>();

  for (const condition of matchedConditions) {
    const relatedSurfaceIds = [...(condition.allOf ?? []), ...(condition.anyOf ?? [])]
      .filter((surfaceId) => visitedSurfaceIds.includes(surfaceId));

    for (const surfaceId of relatedSurfaceIds) {
      const surface = publicSurfaces.find((entry) => entry.id === surfaceId);

      evidence.set(`${condition.label}:${surfaceId}`, {
        surfaceId,
        label: surface?.label ?? surfaceId,
        route: surface?.path ?? surfaceId,
        reason: `Helped satisfy the scenario goal "${scenario.goal}" via success condition "${condition.label}".`,
      });
    }
  }

  return Array.from(evidence.values());
}

function decideJourneyExitState(args: {
  scenario: JourneyScenarioDefinition;
  bounceRisk: JourneyBounceRisk;
  success: boolean;
  visitedSurfaceIds: string[];
}) {
  const { scenario, bounceRisk, success, visitedSurfaceIds } = args;

  if (!success) {
    return bounceRisk === "high" || scenario.lowAttention ? "leave" : scenario.fallbackExitState;
  }

  if (scenario.successExitState === "contact" && !visitedSurfaceIds.includes("work-with-me")) {
    return "continue-exploring";
  }

  if (scenario.successExitState === "subscribe" && !visitedSurfaceIds.includes("updates")) {
    return "return-later";
  }

  return scenario.successExitState;
}

function maybeIncludeActionSurface(args: {
  visitedSurfaceIds: string[];
  selected: Set<string>;
  targetPageCount: number;
  scenario: JourneyScenarioDefinition;
  confidence: JourneyConfidenceSettings;
  trustSignalCount: number;
}) {
  const { visitedSurfaceIds, selected, targetPageCount, scenario, confidence, trustSignalCount } = args;
  const actionSurfaceId = getActionSurfaceIdForScenario(scenario);

  if (!actionSurfaceId || selected.has(actionSurfaceId)) {
    return null;
  }

  const enoughTrustSignals =
    trustSignalCount >= confidence.requiredTrustSignals || (confidence.easyAction && trustSignalCount >= 1);

  if (!enoughTrustSignals) {
    return null;
  }

  if (visitedSurfaceIds.length < targetPageCount) {
    visitedSurfaceIds.push(actionSurfaceId);
    selected.add(actionSurfaceId);
    return actionSurfaceId;
  }

  for (let index = visitedSurfaceIds.length - 1; index >= 1; index -= 1) {
    const surfaceId = visitedSurfaceIds[index];

    if (surfaceId === "search" || surfaceId === actionSurfaceId || trustSignalSurfaceIds.includes(surfaceId)) {
      continue;
    }

    visitedSurfaceIds[index] = actionSurfaceId;
    selected.delete(surfaceId);
    selected.add(actionSurfaceId);
    return actionSurfaceId;
  }

  return null;
}

function getActionSurfaceIdForScenario(scenario: JourneyScenarioDefinition) {
  if (scenario.returnFocused) {
    return "updates";
  }

  if (scenario.trustFocused || scenario.id === "looking-for-something-specific") {
    return "work-with-me";
  }

  return null;
}

function boostIf(surfaceId: string, preferredIds: string[], amount: number) {
  return preferredIds.includes(surfaceId) ? amount : 0;
}

function boostIfTag(tags: string[], preferredTags: string[], amount: number) {
  return tags.some((tag) => preferredTags.includes(tag)) ? amount : 0;
}

function buildJourneySearchQueries(
  profile: PersonaProfile,
  definition: PersonaDefinition,
  scenario: JourneyScenarioDefinition,
  archetype: string,
  visitedSurfaceIds: string[],
) {
  if (!visitedSurfaceIds.includes("search")) {
    return [];
  }

  const explicitQueries = extractLikelySearches(profile.sectionMap["search behavior"] ?? "");

  if (explicitQueries.length > 0) {
    return explicitQueries.slice(0, 3);
  }

  const seeds = [...definition.preferredTags];

  if (scenario.trustFocused) {
    seeds.unshift("about", "projects", "build log");
  }

  if (scenario.returnFocused) {
    seeds.unshift("updates", "recent", "tiny thoughts");
  }

  if (scenario.prefersSearch || archetype.toLowerCase().includes("hunter")) {
    seeds.unshift("projects", "AI", "search");
  }

  return Array.from(new Set(seeds.filter(Boolean))).slice(0, 3);
}

function extractLikelySearches(sectionBody: string) {
  const lines = sectionBody
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const queries: string[] = [];
  let collect = false;

  for (const line of lines) {
    const normalized = line.toLowerCase();

    if (normalized.startsWith("likely searches")) {
      collect = true;
      continue;
    }

    if (!collect) {
      continue;
    }

    if (!line.startsWith("- ")) {
      if (queries.length > 0) {
        break;
      }

      continue;
    }

    queries.push(line.replace(/^- /, "").trim());
  }

  return queries;
}

function computeJourneyBounceAnalysis(
  definition: PersonaDefinition,
  scenario: JourneyScenarioDefinition,
  archetype: string,
  confidence: JourneyConfidenceSettings,
  contextModifiers: JourneyContextModifiers,
  visitedSurfaceIds: string[],
  searchQueries: string[],
  trustSignalCount: number,
): { risk: JourneyBounceRisk; reasons: string[]; nearBounceRoute?: string } {
  let score = confidence.orientationPenalty;
  const normalizedArchetype = archetype.toLowerCase();
  const reasons: string[] = [];

  if (normalizedArchetype.includes("scanner")) {
    score += 1;
    reasons.push("Scanner-like browsing increases impatience with weak first-glance orientation.");
  }

  if (normalizedArchetype.includes("reader") || normalizedArchetype.includes("romantic")) {
    score -= 1;
    reasons.push("Reader / romantic patience softens bounce pressure slightly.");
  }

  if (scenario.lowAttention) {
    score += 2;
    reasons.push("Low-attention context raises the chance of abandoning the journey early.");
  }

  if (scenario.trustFocused || scenario.id === "first-visit") {
    score += 1;
    reasons.push("First-visit trust burden raises the cost of any confusing or weakly oriented early page.");
  }

  if (scenario.deepBrowse || scenario.returnFocused) {
    score -= 1;
    reasons.push("Deep-browse or return-oriented intent gives the visitor more patience than a cold first visit.");
  }

  if (contextModifiers.pageDelta < 0) {
    score += 1;
    reasons.push("The stated context shortens patience, so each weak step costs more.");
  }

  if (contextModifiers.trustBias > 0 && trustSignalCount < confidence.requiredTrustSignals + 1) {
    score += 1;
    reasons.push("This context wanted stronger proof than the route delivered early on.");
  }

  if (contextModifiers.pageDelta > 0) {
    score -= 1;
    reasons.push("The context allows a little more patience than a rushed visit.");
  }

  if (confidence.threshold === "low") {
    score -= 1;
    reasons.push("Low confidence threshold makes this persona easier to win over.");
  }

  if (trustSignalCount < confidence.requiredTrustSignals) {
    score += confidence.requiredTrustSignals - trustSignalCount + 1;
    reasons.push(
      `The plan exposed only ${trustSignalCount} trust signal${trustSignalCount === 1 ? "" : "s"}, below the ${confidence.requiredTrustSignals} needed for this persona.`,
    );
  } else {
    score -= 1;
    reasons.push("The journey hit enough trust signals to reduce bounce pressure.");
  }

  if (searchQueries.length === 0 && (normalizedArchetype.includes("hunter") || normalizedArchetype.includes("builder"))) {
    score += 1;
    reasons.push("A hunter / builder path without search can feel slower than this persona prefers.");
  }

  if (
    visitedSurfaceIds.length <= 3 &&
    confidence.threshold === "high" &&
    trustSignalCount < confidence.requiredTrustSignals + 1
  ) {
    score += 1;
    reasons.push("A short early path with thin proof leaves a high-threshold persona unconvinced.");
  }

  if (visitedSurfaceIds.length >= 6 && confidence.threshold === "low") {
    score -= 1;
    reasons.push("The journey had enough depth for a forgiving persona to settle in.");
  }

  const nearBounceRoute = inferNearBounceRoute(visitedSurfaceIds, scenario, normalizedArchetype);

  if (score <= 0) {
    return { risk: "low", reasons, nearBounceRoute };
  }

  if (score <= 2) {
    return { risk: "medium", reasons, nearBounceRoute };
  }

  return { risk: "high", reasons, nearBounceRoute };
}

function inferNearBounceRoute(
  visitedSurfaceIds: string[],
  scenario: JourneyScenarioDefinition,
  normalizedArchetype: string,
) {
  if (scenario.trustFocused && visitedSurfaceIds.includes("about")) {
    return "/about";
  }

  if ((normalizedArchetype.includes("hunter") || normalizedArchetype.includes("scanner")) && visitedSurfaceIds.includes("home")) {
    return "/";
  }

  if (visitedSurfaceIds.includes("search")) {
    return "/search";
  }

  return undefined;
}

function buildSkippedRouteReasons(
  skippedSurfaceIds: string[],
  publicSurfaces: SiteSurface[],
  definition: PersonaDefinition,
  scenario: JourneyScenarioDefinition,
  archetype: string,
  confidence: JourneyConfidenceSettings,
  contextModifiers: JourneyContextModifiers,
): JourneyRouteReason[] {
  const normalizedArchetype = archetype.toLowerCase();

  return skippedSurfaceIds.map((surfaceId) => {
    const surface = publicSurfaces.find((entry) => entry.id === surfaceId);

    return {
      surfaceId,
      label: surface?.label ?? surfaceId,
      route: surface?.path ?? surfaceId,
      reason: explainSkippedRoute(surfaceId, definition, scenario, normalizedArchetype, confidence, contextModifiers),
    };
  });
}

function explainSkippedRoute(
  surfaceId: string,
  definition: PersonaDefinition,
  scenario: JourneyScenarioDefinition,
  normalizedArchetype: string,
  confidence: JourneyConfidenceSettings,
  contextModifiers: JourneyContextModifiers,
) {
  if (definition.ignoredSurfaceIds?.includes(surfaceId)) {
    return "Explicitly deprioritized by this persona profile.";
  }

  if (definition.deEmphasizedSurfaceIds?.includes(surfaceId)) {
    return "Relevant eventually, but intentionally deprioritized for this visit.";
  }

  if (scenario.trustFocused && noveltySurfaceIds.includes(surfaceId)) {
    return "Skipped because this trust-focused journey preferred proof and orientation before novelty.";
  }

  if (scenario.returnFocused && !["updates", "writings", "tiny-thoughts", "build-log", "music"].includes(surfaceId)) {
    return "Skipped because this return-focused visit was looking for freshness, not broad exploration.";
  }

  if (confidence.threshold === "high" && noveltySurfaceIds.includes(surfaceId)) {
    return "Skipped because a high-threshold persona delays novelty until stronger trust is established.";
  }

  if (contextModifiers.deEmphasizedSurfaceIds.includes(surfaceId)) {
    return "Skipped because the stated context deprioritized this kind of room for this visit.";
  }

  if ((normalizedArchetype.includes("hunter") || normalizedArchetype.includes("builder")) && ["music", "cats-beverly", "cats-thomas", "twin-peaks-self"].includes(surfaceId)) {
    return "Skipped because this archetype was optimizing for the shortest path to useful proof.";
  }

  if (normalizedArchetype.includes("reader") && ["search", "work-with-me"].includes(surfaceId) && !scenario.trustFocused) {
    return "Skipped because this reader-leaning visit favored reflective rooms over direct action paths.";
  }

  return "Skipped because stronger scenario matches took the limited page budget first.";
}

function buildJourneyNotes(args: {
  definition: PersonaDefinition;
  scenario: JourneyScenarioDefinition;
  scenarioInfluences: string[];
  archetype: string;
  archetypeInfluences: string[];
  context: string;
  contextInfluences: string[];
  targetPageCount: number;
  visitedSurfaceIds: string[];
  expectedRouteSurfaceIds: string[];
  missingExpectedRouteSurfaceIds: string[];
  expectedRouteWarnings: string[];
  searchQueries: string[];
  bounceRisk: JourneyBounceRisk;
  confidence: JourneyConfidenceSettings;
  actionSurfaceId: string | null;
  trustSignalCount: number;
  success: boolean;
  matchedSuccessConditionLabels: string[];
  trustSignalHits: JourneyRouteReason[];
  goalSatisfactionEvidence: JourneyRouteReason[];
  skippedRouteReasons: JourneyRouteReason[];
  bounceReasons: string[];
  nearBounceRoute?: string;
  exitState: JourneyExitState;
}) {
  const {
    definition,
    scenario,
    scenarioInfluences,
    archetype,
    archetypeInfluences,
    context,
    contextInfluences,
    targetPageCount,
    visitedSurfaceIds,
    expectedRouteSurfaceIds,
    missingExpectedRouteSurfaceIds,
    expectedRouteWarnings,
    searchQueries,
    bounceRisk,
    confidence,
    actionSurfaceId,
    trustSignalCount,
    success,
    matchedSuccessConditionLabels,
    trustSignalHits,
    goalSatisfactionEvidence,
    skippedRouteReasons,
    bounceReasons,
    nearBounceRoute,
    exitState,
  } = args;
  const notes = [
    `Journey Mode v1 kept the visit to ${visitedSurfaceIds.length} public surfaces (target ${targetPageCount}, max ${scenario.maxPages}).`,
    `Scenario: ${scenario.label}.`,
    `Scenario goal: ${scenario.goal}.`,
    `Scenario influence: ${scenarioInfluences.join(" ")}`,
    `Archetype emphasis: ${archetype}.`,
    `Archetype influence: ${archetypeInfluences.join(" ")}`,
    `Context: ${context}.`,
    `Context influence: ${contextInfluences.join(" ")}`,
    `Confidence threshold: ${definition.confidenceThreshold ?? "not specified"}.`,
    `Confidence behavior: ${confidence.minPages}-${confidence.maxPages} pages, ${confidence.requiredTrustSignals} trust signal${confidence.requiredTrustSignals === 1 ? "" : "s"} required before stronger action.`,
  ];

  if (searchQueries.length > 0) {
    notes.push(`Search was included with likely queries: ${searchQueries.map((query) => `"${query}"`).join(", ")}.`);
  } else {
    notes.push("Search was not part of this journey.");
  }

  notes.push(`Trust signals encountered in-plan: ${trustSignalCount}.`);

  if (trustSignalHits.length > 0) {
    notes.push(
      `Trust shifted most on: ${trustSignalHits.map((hit) => `${hit.route} (${hit.reason})`).join("; ")}.`,
    );
  }

  if (actionSurfaceId) {
    notes.push(`Action surface reached: ${actionSurfaceId}.`);
  } else {
    notes.push("Action surface was not reached in this journey.");
  }

  notes.push(
    success
      ? `Scenario success conditions met: ${matchedSuccessConditionLabels.join(", ")}.`
      : "Scenario success conditions were not met.",
  );
  if (goalSatisfactionEvidence.length > 0) {
    notes.push(
      `Goal satisfaction came primarily from: ${goalSatisfactionEvidence
        .map((evidence) => `${evidence.route} (${evidence.reason})`)
        .join("; ")}.`,
    );
  }
  notes.push(`Exit state: ${exitState}.`);

  notes.push(`Estimated bounce risk for this journey: ${bounceRisk}.`);

  if (bounceReasons.length > 0) {
    notes.push(`Bounce reasoning: ${bounceReasons.join(" ")}`);
  }

  if (nearBounceRoute) {
    notes.push(`Near-bounce pressure centered on \`${nearBounceRoute}\`.`);
  }

  if (expectedRouteWarnings.length > 0) {
    notes.push(...expectedRouteWarnings);
  }

  if (missingExpectedRouteSurfaceIds.length > 0) {
    notes.push(
      `Expected but missing routes: ${missingExpectedRouteSurfaceIds.join(", ")} (from expected set ${expectedRouteSurfaceIds.join(", ")}).`,
    );
  }

  const topSkippedReasons = skippedRouteReasons.slice(0, 3);

  if (topSkippedReasons.length > 0) {
    notes.push(
      `Representative skipped routes: ${topSkippedReasons
        .map((entry) => `${entry.route} (${entry.reason})`)
        .join("; ")}.`,
    );
  }

  return notes;
}

function writePersonaJourneyReport(args: {
  personaSlug: string;
  profile: PersonaProfile;
  plan: PersonaJourneyPlan;
  publicSurfaces: SiteSurface[];
}) {
  const { personaSlug, profile, plan, publicSurfaces } = args;
  const outputDir = getPersonaJourneyOutputDir(personaSlug);
  const fileStem = plan.scenarioId;
  const reportPath = resolve(outputDir, `${fileStem}.md`);
  const summaryPath = resolve(outputDir, `${fileStem}.json`);

  mkdirSync(outputDir, { recursive: true });

  const surfaceLabel = (surfaceId: string) =>
    publicSurfaces.find((surface) => surface.id === surfaceId)?.label ?? surfaceId;
  const visitedRoutes = plan.visitedSurfaceIds.map((surfaceId) => {
    const surface = publicSurfaces.find((entry) => entry.id === surfaceId);

    return surface?.path ?? surfaceId;
  });
  const skippedRoutes = plan.skippedSurfaceIds.map((surfaceId) => {
    const surface = publicSurfaces.find((entry) => entry.id === surfaceId);

    return surface?.path ?? surfaceId;
  });

  const report = `# ${profile.name} Journey Report

Generated: ${new Date().toISOString()}

## Journey Setup

- Scenario: \`${plan.scenarioLabel}\`
- Goal: \`${plan.scenarioGoal}\`
- Archetype: \`${plan.archetype}\`
- Context: ${plan.context}
- Target / max pages: \`${plan.targetPageCount} / ${plan.maxPageCount}\`
- Bounce risk: \`${plan.bounceRisk}\`
- Success: \`${plan.success ? "yes" : "no"}\`
- Exit state: \`${plan.exitState}\`

## Scenario Influences

${renderJourneyBullets(plan.scenarioInfluences)}

## Archetype Influences

${renderJourneyBullets(plan.archetypeInfluences)}

## Context Influences

${renderJourneyBullets(plan.contextInfluences)}

## Expected Route Checks

${renderJourneyBullets([
    `Expected routes: ${plan.expectedRouteSurfaceIds.length ? plan.expectedRouteSurfaceIds.map((surfaceId) => `\`${surfaceId}\``).join(", ") : "None"}`,
    `Missing expected routes: ${plan.missingExpectedRouteSurfaceIds.length ? plan.missingExpectedRouteSurfaceIds.map((surfaceId) => `\`${surfaceId}\``).join(", ") : "None"}`,
    ...plan.expectedRouteWarnings,
  ])}

## Trust Signals That Changed The Journey

${renderJourneyBullets(
    plan.trustSignalHits.length
      ? plan.trustSignalHits.map((hit) => `\`${hit.route}\` - ${hit.reason}`)
      : ["No trust-signal hits were recorded."],
  )}

## Goal Satisfaction Evidence

${renderJourneyBullets(
    plan.goalSatisfactionEvidence.length
      ? plan.goalSatisfactionEvidence.map((evidence) => `\`${evidence.route}\` - ${evidence.reason}`)
      : ["No page clearly satisfied the scenario goal."],
  )}

## Success Conditions Met

${renderJourneyBullets(
    plan.matchedSuccessConditionLabels.length
      ? plan.matchedSuccessConditionLabels.map((label) => `Matched: ${label}`)
      : ["No success conditions matched."],
  )}

## Visited Path

${renderJourneyBullets(
    plan.visitedSurfaceIds.map((surfaceId, index) => `${index + 1}. ${surfaceLabel(surfaceId)}`),
  )}

## Skipped Routes

${renderJourneyBullets(
    plan.skippedRouteReasons.map((entry) => `Skipped: \`${entry.route}\` - ${entry.reason}`),
  )}

## Search Queries

${renderJourneyBullets(
    plan.searchQueries.length ? plan.searchQueries.map((query) => `Query: \`${query}\``) : ["No search queries used."],
  )}

## Bounce Analysis

${renderJourneyBullets([
    ...(plan.nearBounceRoute ? [`Near-bounce route: \`${plan.nearBounceRoute}\``] : []),
    ...plan.bounceReasons,
  ])}

## Journey Notes

${renderJourneyBullets(plan.journeyNotes)}
`;

  const summary: PersonaJourneySummary = {
    persona: profile.name,
    personaSlug,
    generatedAt: new Date().toISOString(),
    scenarioId: plan.scenarioId,
    scenarioLabel: plan.scenarioLabel,
    scenarioGoal: plan.scenarioGoal,
    scenarioInfluences: plan.scenarioInfluences,
    archetype: plan.archetype,
    archetypeInfluences: plan.archetypeInfluences,
    context: plan.context,
    contextInfluences: plan.contextInfluences,
    targetPageCount: plan.targetPageCount,
    maxPageCount: plan.maxPageCount,
    visitedRoutes,
    skippedRoutes,
    expectedRoutes: plan.expectedRouteSurfaceIds.map((surfaceId) => {
      const surface = publicSurfaces.find((entry) => entry.id === surfaceId);

      return surface?.path ?? surfaceId;
    }),
    missingExpectedRoutes: plan.missingExpectedRouteSurfaceIds.map((surfaceId) => {
      const surface = publicSurfaces.find((entry) => entry.id === surfaceId);

      return surface?.path ?? surfaceId;
    }),
    expectedRouteWarnings: plan.expectedRouteWarnings,
    skippedRouteReasons: plan.skippedRouteReasons,
    searchQueries: plan.searchQueries,
    bounceRisk: plan.bounceRisk,
    bounceReasons: plan.bounceReasons,
    nearBounceRoute: plan.nearBounceRoute,
    success: plan.success,
    matchedSuccessConditionLabels: plan.matchedSuccessConditionLabels,
    trustSignalHits: plan.trustSignalHits,
    goalSatisfactionEvidence: plan.goalSatisfactionEvidence,
    exitState: plan.exitState,
    journeyNotes: plan.journeyNotes,
  };

  writeFileSync(reportPath, report);
  writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

  return { outputDir, reportPath, summaryPath, summary };
}

function renderJourneyBullets(items: string[]) {
  return items.length ? items.map((item) => `- ${item}`).join("\n") : "- None";
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
