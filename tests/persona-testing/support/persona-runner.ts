import type { Page } from "@playwright/test";
import { resolve } from "node:path";
import { getAdminCredentials } from "../../e2e/helpers/admin-env";
import { personaDefinitions } from "./persona-manifest";
import { loadPersonaProfile } from "./persona-profile";
import {
  createSkippedObservation,
  inspectSurface,
  writePersonaReport,
  type SurfaceObservation,
  type PersonaReportSummary,
} from "./persona-report";
import { adminSurfaces, getPublicPersonaSurfaces } from "./site-surfaces";

export async function runPersonaAudit(page: Page, personaSlug: string): Promise<PersonaReportSummary> {
  const personaProfilePath = resolve(
    process.cwd(),
    "tests",
    "persona-testing",
    personaSlug,
    "profile.md",
  );
  const profile = loadPersonaProfile(personaProfilePath);
  const definition = personaDefinitions.find((persona) => persona.slug === personaSlug);
  const outputDir = resolve(process.cwd(), "test-results", "personas", personaSlug);
  const observations: SurfaceObservation[] = [];
  const publicSurfaces = await getPublicPersonaSurfaces();

  if (!definition) {
    throw new Error(`Unknown persona slug: ${personaSlug}`);
  }

  for (const surface of publicSurfaces) {
    observations.push(await inspectSurface(page, surface, profile, definition, outputDir));
  }

  const credentials = getAdminCredentials();

  if (!credentials.username || !credentials.password) {
    for (const surface of adminSurfaces) {
      observations.push(
        createSkippedObservation(surface, "Skipped because ADMIN_USERNAME / ADMIN_PASSWORD were not configured."),
      );
    }
  } else {
    await loginAsAdmin(page, credentials.username, credentials.password);

    for (const surface of adminSurfaces) {
      observations.push(await inspectSurface(page, surface, profile, definition, outputDir));
    }
  }

  return writePersonaReport({
    personaSlug,
    profile,
    definition,
    observations,
  }).summary;
}

async function loginAsAdmin(page: Page, username: string, password: string) {
  await page.goto("/admin");
  await page.getByLabel("Username").fill(username);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Log In" }).click();
}
