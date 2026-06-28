import assert from "node:assert/strict";
import test from "node:test";
import { personaDefinitions } from "../persona-testing/support/persona-manifest";
import { parsePersonaMarkdown } from "../persona-testing/support/persona-profile";
import { planPersonaJourney } from "../persona-testing/support/persona-journey";
import { getJourneyScenarioDefinition } from "../persona-testing/support/persona-scenarios";
import type { SiteSurface } from "../persona-testing/support/site-surfaces";

const publicSurfaces: SiteSurface[] = [
  { id: "home", label: "Homepage", path: "/", area: "public", tags: ["projects", "curious"] },
  { id: "about", label: "About", path: "/about", area: "public", tags: ["thoughtful", "identity"] },
  { id: "work-with-me", label: "Work With Me", path: "/work-with-me", area: "public", tags: ["software", "trust"] },
  { id: "search", label: "Search", path: "/search", area: "public", tags: ["find", "orientation"] },
  { id: "updates", label: "Updates", path: "/updates", area: "public", tags: ["recent", "changes"] },
  { id: "build-log", label: "Build Log", path: "/build-log", area: "public", tags: ["software", "projects"] },
  { id: "writings", label: "Writings", path: "/writings", area: "public", tags: ["writing", "essay"] },
  { id: "tiny-thoughts", label: "Tiny Thoughts", path: "/tiny-thoughts", area: "public", tags: ["writing", "signals"] },
  { id: "cats-beverly", label: "Cats", path: "/cats/beverly-and-lucinda", area: "public", tags: ["cats", "warmth"] },
  { id: "music", label: "Music", path: "/music", area: "public", tags: ["music", "listening"] },
  { id: "error-preview-not-found", label: "404", path: "/error-preview/not-found", area: "public", tags: ["errors"] },
  { id: "admin-home", label: "Admin", path: "/admin", area: "admin", tags: ["admin"] },
];

test("hunter-like trust journey stays short and excludes admin/error pages", () => {
  const definition = personaDefinitions.find((persona) => persona.slug === "potential-client");
  assert.ok(definition);

  const profile = parsePersonaMarkdown(`# Potential Client\n\n## Behavior Fields\n\n### Search Behavior\n\nLikely searches:\n\n- pricing\n- automation\n- consulting\n`);
  const plan = planPersonaJourney({
    definition,
    profile,
    publicSurfaces,
    scenario: getJourneyScenarioDefinition("looking-for-trust"),
  });

  assert.equal(plan.visitedSurfaceIds[0], "home");
  assert.ok(plan.visitedSurfaceIds.length >= 4);
  assert.ok(plan.visitedSurfaceIds.length <= 5);
  assert.ok(!plan.visitedSurfaceIds.includes("admin-home"));
  assert.ok(!plan.visitedSurfaceIds.includes("error-preview-not-found"));
  assert.ok(plan.visitedSurfaceIds.includes("work-with-me"));
  assert.ok(plan.bounceRisk === "medium" || plan.bounceRisk === "high");
  assert.equal(plan.success, true);
  assert.ok(plan.exitState === "bookmark" || plan.exitState === "contact" || plan.exitState === "continue-exploring");
  assert.ok(plan.skippedRouteReasons.length > 0);
  assert.ok(plan.trustSignalHits.length > 0);
  assert.ok(plan.goalSatisfactionEvidence.length > 0);
  assert.ok(plan.bounceReasons.length > 0);
});

test("return-focused journey can start from updates and use search only when selected", () => {
  const definition = personaDefinitions.find((persona) => persona.slug === "rss-subscriber");
  assert.ok(definition);

  const profile = parsePersonaMarkdown(`# RSS Subscriber\n\n## Behavior Fields\n\n### Search Behavior\n\nLikely searches:\n\n- rss\n- updates\n- recent\n`);
  const plan = planPersonaJourney({
    definition,
    profile,
    publicSurfaces,
    scenario: getJourneyScenarioDefinition("deciding-whether-to-return"),
  });

  assert.equal(plan.visitedSurfaceIds[0], "updates");
  assert.ok(plan.visitedSurfaceIds.length >= 4);
  assert.ok(plan.visitedSurfaceIds.length <= 6);
  assert.ok(plan.searchQueries.length === 0 || plan.visitedSurfaceIds.includes("search"));
  assert.equal(plan.success, true);
  assert.equal(plan.exitState, "return-later");
  assert.ok(plan.goalSatisfactionEvidence.some((entry) => entry.route === "/updates"));
});

test("confidence threshold changes page count, search use, and bounce tolerance", () => {
  const lowConfidenceDefinition = {
    slug: "low-confidence-wanderer",
    name: "Low Confidence Wanderer",
    description: "A forgiving curiosity-led visitor.",
    preferredTags: ["music", "writing", "cats"],
    confidenceThreshold: "low" as const,
    defaultArchetype: "Wanderer",
    preferredSurfaceIds: ["about", "music", "tiny-thoughts", "cats-beverly", "writings"],
  };
  const highConfidenceDefinition = {
    slug: "high-confidence-builder",
    name: "High Confidence Builder",
    description: "A hard-to-win proof-seeking visitor.",
    preferredTags: ["software", "projects", "trust"],
    confidenceThreshold: "high" as const,
    defaultArchetype: "Builder -> Hunter",
    preferredSurfaceIds: ["work-with-me", "build-log", "about", "search", "updates"],
  };

  const lowProfile = parsePersonaMarkdown(`# Low Confidence Wanderer\n\n## Behavior Fields\n\n### Search Behavior\n\nLikely searches:\n\n- music\n- weird\n`);
  const highProfile = parsePersonaMarkdown(`# High Confidence Builder\n\n## Behavior Fields\n\n### Search Behavior\n\nLikely searches:\n\n- automation\n- build log\n- AI\n`);
  const scenario = getJourneyScenarioDefinition("first-visit");

  const lowPlan = planPersonaJourney({
    definition: lowConfidenceDefinition,
    profile: lowProfile,
    publicSurfaces,
    scenario,
  });
  const highPlan = planPersonaJourney({
    definition: highConfidenceDefinition,
    profile: highProfile,
    publicSurfaces,
    scenario,
  });

  assert.ok(lowPlan.visitedSurfaceIds.length >= 5);
  assert.ok(highPlan.visitedSurfaceIds.length <= 5);
  assert.ok(lowPlan.visitedSurfaceIds.length > highPlan.visitedSurfaceIds.length);
  assert.equal(lowPlan.searchQueries.length, 0);
  assert.ok(highPlan.searchQueries.length > 0);
  assert.ok(lowPlan.bounceRisk === "low" || lowPlan.bounceRisk === "medium");
  assert.ok(highPlan.bounceRisk === "medium" || highPlan.bounceRisk === "high");
  assert.ok(lowPlan.targetPageCount > highPlan.targetPageCount);
});

test("high-confidence trust journey reaches proof before action", () => {
  const definition = personaDefinitions.find((persona) => persona.slug === "skeptic");
  assert.ok(definition);

  const profile = parsePersonaMarkdown(`# Skeptic\n\n## Behavior Fields\n\n### Search Behavior\n\nLikely searches:\n\n- authenticity\n- build log\n- writing\n`);
  const plan = planPersonaJourney({
    definition,
    profile,
    publicSurfaces,
    scenario: getJourneyScenarioDefinition("looking-for-trust"),
  });

  const workWithMeIndex = plan.visitedSurfaceIds.indexOf("work-with-me");
  const trustPagesBeforeAction = plan.visitedSurfaceIds.filter((surfaceId) =>
    ["home", "about", "build-log", "writings", "updates"].includes(surfaceId),
  ).length;

  assert.ok(trustPagesBeforeAction >= 2);
  assert.ok(workWithMeIndex === -1 || workWithMeIndex > 0);
  assert.ok(plan.bounceRisk === "medium" || plan.bounceRisk === "high");
});

test("context changes route choice and reportable influences", () => {
  const definition = personaDefinitions.find((persona) => persona.slug === "potential-client");
  assert.ok(definition);

  const profile = parsePersonaMarkdown(`# Potential Client`);
  const scenario = getJourneyScenarioDefinition("first-visit");

  const rushedPlan = planPersonaJourney({
    definition,
    profile,
    publicSurfaces,
    scenario,
    contextOverride: "Busy, under time pressure, and trying to reduce risk quickly.",
  });

  const relaxedPlan = planPersonaJourney({
    definition,
    profile,
    publicSurfaces,
    scenario,
    contextOverride: "Evening curiosity, enough time to browse, playful and exploratory.",
  });

  assert.ok(rushedPlan.contextInfluences.some((note) => note.includes("time-pressured")));
  assert.ok(relaxedPlan.contextInfluences.some((note) => note.includes("evening-style")));
  assert.ok(rushedPlan.targetPageCount <= relaxedPlan.targetPageCount);
  assert.notDeepEqual(rushedPlan.visitedSurfaceIds, relaxedPlan.visitedSurfaceIds);
});
