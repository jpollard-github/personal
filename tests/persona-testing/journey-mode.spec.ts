import { expect, test } from "@playwright/test";
import { personaDefinitions } from "./support/persona-manifest";
import { runPersonaJourney } from "./support/persona-journey";
import { loadPersonaProfile } from "./support/persona-profile";
import { writeOverallJourneyReport, type JourneySummaryRecord } from "./support/persona-report";
import { getPublicPersonaSurfaces } from "./support/site-surfaces";

const summaries: JourneySummaryRecord[] = [];

const representativeJourneys = [
  { personaSlug: "potential-client", scenarioId: "looking-for-trust", expectedStart: "/", expectedExit: ["bookmark", "contact", "continue-exploring"] },
  { personaSlug: "potential-client", scenarioId: "looking-for-something-specific", expectedStart: "/", expectedExit: ["contact", "continue-exploring", "leave"] },
  { personaSlug: "ideal-partner", scenarioId: "first-visit", expectedStart: "/", expectedExit: ["continue-exploring", "bookmark"] },
  { personaSlug: "skeptic", scenarioId: "looking-for-trust", expectedStart: "/", expectedExit: ["bookmark", "leave", "continue-exploring"] },
  { personaSlug: "builder", scenarioId: "first-visit", expectedStart: "/", expectedExit: ["continue-exploring", "bookmark"] },
  { personaSlug: "twin-peaks-fan", scenarioId: "deep-browse", expectedStart: "/", expectedExit: ["continue-exploring", "bookmark"] },
  { personaSlug: "rss-subscriber", scenarioId: "deciding-whether-to-return", expectedStart: "/updates", expectedExit: ["return-later"] },
  { personaSlug: "returning-fan", scenarioId: "returning-after-time-away", expectedStart: "/updates", expectedExit: ["return-later", "continue-exploring"] },
  { personaSlug: "lonely-internet-person", scenarioId: "deep-browse", expectedStart: "/", expectedExit: ["continue-exploring", "bookmark"] },
  { personaSlug: "hiring-manager", scenarioId: "looking-for-trust", expectedStart: "/", expectedExit: ["bookmark", "contact", "continue-exploring"] },
] as const;

test.describe("persona journey mode", () => {
  for (const journey of representativeJourneys) {
    test(`${journey.personaSlug} / ${journey.scenarioId}`, async ({ page }) => {
      const definition = personaDefinitions.find((persona) => persona.slug === journey.personaSlug);

      expect(definition).toBeTruthy();

      const profile = loadPersonaProfile(`tests/persona-testing/personas/${journey.personaSlug}/profile.md`);
      const publicSurfaces = await getPublicPersonaSurfaces();
      const result = await runPersonaJourney({
        page,
        personaSlug: journey.personaSlug,
        profile,
        definition: definition!,
        publicSurfaces,
        scenarioId: journey.scenarioId,
      });

      summaries.push(result.summary);
      expect(result.summary.visitedRoutes.length).toBeGreaterThanOrEqual(3);
      expect(result.summary.visitedRoutes.length).toBeLessThanOrEqual(9);
      expect(result.summary.visitedRoutes[0]).toBe(journey.expectedStart);
      expect(result.summary.visitedRoutes).not.toContain("/admin");
      expect(result.summary.scenarioInfluences.length).toBeGreaterThan(0);
      expect(result.summary.archetypeInfluences.length).toBeGreaterThan(0);
      expect(result.summary.trustSignalHits.length + result.summary.goalSatisfactionEvidence.length).toBeGreaterThan(0);
      expect(result.summary.expectedRoutes.length).toBeGreaterThan(0);
      expect(journey.expectedExit).toContain(result.summary.exitState);
    });
  }

  test("journey: overall aggregate", async () => {
    const outputs = writeOverallJourneyReport(summaries);

    expect(summaries.length).toBe(representativeJourneys.length);
    expect(outputs.reportPath).toContain("persona-results/personas/overall-journeys/report.md");
  });
});
