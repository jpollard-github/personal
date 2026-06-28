import { expect, test } from "@playwright/test";
import { personaDefinitions } from "./support/persona-manifest";
import { runPersonaAudit } from "./support/persona-runner";
import { writeOverallPersonaReport, type PersonaReportSummary } from "./support/persona-report";

const summaries: PersonaReportSummary[] = [];

test.describe.serial("persona audit suite", () => {
  for (const persona of personaDefinitions) {
    test(`persona: ${persona.slug}`, async ({ page }) => {
      const summary = await runPersonaAudit(page, persona.slug);
      summaries.push(summary);

      expect(summary.personaSlug).toBe(persona.slug);
      expect(summary.observations.length).toBeGreaterThan(10);
    });
  }

  test("persona: overall-audit aggregate", async () => {
    const outputs = writeOverallPersonaReport(summaries);

    expect(summaries.length).toBe(personaDefinitions.length);
    expect(outputs.reportPath).toContain("persona-results/personas/overall-audit/report.md");
  });
});
