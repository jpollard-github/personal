import assert from "node:assert/strict";
import { cpSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";
import {
  getPersonaResultsRoot,
  readCombinedPersonasAndJourneysSummary,
  writeOverallJourneyReport,
  writeOverallPersonaReport,
  type JourneySummaryRecord,
  type PersonaReportSummary,
} from "../persona-testing/support/persona-report";

const personasRoot = getPersonaResultsRoot();
const aggregateFolderNames = [
  "overall-audit",
  "overall-persona",
  "overall-journeys",
  "overall-personas-and-journeys",
] as const;

function cleanupAggregateOutputs() {
  for (const folderName of aggregateFolderNames) {
    rmSync(resolve(personasRoot, folderName), { recursive: true, force: true });
  }
}

function withPreservedAggregateOutputs(run: () => void) {
  const backupRoot = mkdtempSync(resolve(tmpdir(), "persona-report-test-"));

  try {
    for (const folderName of aggregateFolderNames) {
      const source = resolve(personasRoot, folderName);

      if (existsSync(source)) {
        cpSync(source, resolve(backupRoot, folderName), { recursive: true });
      }
    }

    run();
  } finally {
    cleanupAggregateOutputs();

    for (const folderName of aggregateFolderNames) {
      const backup = resolve(backupRoot, folderName);

      if (existsSync(backup)) {
        cpSync(backup, resolve(personasRoot, folderName), { recursive: true });
      }
    }

    rmSync(backupRoot, { recursive: true, force: true });
  }
}

test("combined packet keeps a legacy audit summary when journeys rerun", () => {
  withPreservedAggregateOutputs(() => {
    cleanupAggregateOutputs();

    const legacyAuditDir = resolve(personasRoot, "overall-persona");
    mkdirSync(legacyAuditDir, { recursive: true });
    writeFileSync(
      resolve(legacyAuditDir, "summary.json"),
      JSON.stringify({ generatedAt: "2026-06-28T00:00:00.000Z", personasReviewed: 17, source: "legacy-audit" }, null, 2),
    );

    const journeys: JourneySummaryRecord[] = [
      {
        persona: "Potential Client",
        personaSlug: "potential-client",
        generatedAt: "2026-06-28T00:00:00.000Z",
        scenarioId: "looking-for-trust",
        scenarioLabel: "Looking For A Reason To Trust",
        scenarioGoal: "Build confidence",
        scenarioInfluences: [
          "Trust scenario prioritizes About plus at least one proof room before novelty.",
        ],
        archetype: "Hunter -> Builder",
        archetypeInfluences: ["Hunter behavior pulls direct-finding rooms like Search and proof rooms earlier."],
        context: "Busy and evaluating risk.",
        contextInfluences: ["Busy or time-pressured context pushes direct orientation and shorter routes."],
        targetPageCount: 5,
        maxPageCount: 7,
        visitedRoutes: ["/", "/work-with-me", "/search", "/build-log"],
        expectedRoutes: ["/about", "/work-with-me", "/build-log"],
        missingExpectedRoutes: ["/about"],
        expectedRouteWarnings: [
          "Journey missed expected routes: /about.",
        ],
        skippedRoutes: ["/admin", "/cats/beverly-and-lucinda"],
        skippedRouteReasons: [
          {
            surfaceId: "cats-beverly",
            label: "Cats",
            route: "/cats/beverly-and-lucinda",
            reason: "Skipped because this trust-focused journey preferred proof and orientation before novelty.",
          },
        ],
        searchQueries: ["automation", "pricing"],
        bounceRisk: "medium",
        bounceReasons: ["First-visit trust burden raises the cost of any confusing or weakly oriented early page."],
        nearBounceRoute: "/",
        success: true,
        matchedSuccessConditionLabels: ["Build log plus work-with-me visited"],
        trustSignalHits: [
          {
            surfaceId: "build-log",
            label: "Build Log",
            route: "/build-log",
            reason: "Provided proof of active building and visible iteration over time.",
          },
        ],
        goalSatisfactionEvidence: [
          {
            surfaceId: "build-log",
            label: "Build Log",
            route: "/build-log",
            reason: "Helped satisfy the scenario goal \"Build confidence\" via success condition \"Build log plus work-with-me visited\".",
          },
        ],
        exitState: "bookmark",
        journeyNotes: ["Journey Mode v1 kept the visit short and practical."],
      },
    ];

    writeOverallJourneyReport(journeys);

    const combined = readCombinedPersonasAndJourneysSummary() as {
      audit: { source?: string } | null;
      journeys: { journeysReviewed: number } | null;
    } | null;

    assert.ok(combined);
    assert.equal(combined.audit?.source, "legacy-audit");
    assert.equal(combined.journeys?.journeysReviewed, 1);
  });
});

test("combined packet includes journey summary when audit reruns later", () => {
  withPreservedAggregateOutputs(() => {
    cleanupAggregateOutputs();

    const journeys: JourneySummaryRecord[] = [
      {
        persona: "RSS Subscriber",
        personaSlug: "rss-subscriber",
        generatedAt: "2026-06-28T00:00:00.000Z",
        scenarioId: "deciding-whether-to-return",
        scenarioLabel: "Deciding Whether To Return",
        scenarioGoal: "Assess freshness",
        scenarioInfluences: [
          "Return-oriented scenario favors freshness rooms like Updates, Build Log, and Tiny Thoughts.",
        ],
        archetype: "Hunter -> Reader",
        archetypeInfluences: ["Reader behavior gives more room to reflective pages like About and Writings."],
        context: "Focused and already mildly interested.",
        contextInfluences: [],
        targetPageCount: 4,
        maxPageCount: 6,
        visitedRoutes: ["/updates", "/writings", "/tiny-thoughts"],
        expectedRoutes: ["/updates", "/writings", "/tiny-thoughts", "/build-log"],
        missingExpectedRoutes: ["/build-log"],
        expectedRouteWarnings: [
          "Journey missed expected routes: /build-log.",
        ],
        skippedRoutes: ["/admin"],
        skippedRouteReasons: [],
        searchQueries: [],
        bounceRisk: "low",
        bounceReasons: ["Deep-browse or return-oriented intent gives the visitor more patience than a cold first visit."],
        success: true,
        matchedSuccessConditionLabels: ["Updates plus one living room"],
        trustSignalHits: [
          {
            surfaceId: "updates",
            label: "Updates",
            route: "/updates",
            reason: "Showed that the site is still alive, which matters for return-oriented scenarios.",
          },
        ],
        goalSatisfactionEvidence: [
          {
            surfaceId: "updates",
            label: "Updates",
            route: "/updates",
            reason: "Helped satisfy the scenario goal \"Assess freshness\" via success condition \"Updates plus one living room\".",
          },
        ],
        exitState: "return-later",
        journeyNotes: ["Search was not part of this journey."],
      },
    ];

    writeOverallJourneyReport(journeys);

    const personaSummaries: PersonaReportSummary[] = [
      {
        persona: "Potential Client",
        personaSlug: "potential-client",
        generatedAt: "2026-06-28T00:00:00.000Z",
        personaDescription: "A pragmatic person evaluating whether Jason can help with a real problem.",
        personaProfileMarkdown: "# Potential Client",
        confidenceThreshold: "medium",
        defaultArchetype: "Hunter -> Builder",
        defaultScenario: "Looking For A Reason To Trust",
        defaultContext: "Busy and trying to reduce risk.",
        verdict: {
          summary: "The site feels credible.",
          fit: "This persona sees practical value here.",
          positives: ["Concrete examples."],
          friction: ["Could be easier to skim."],
        },
        averages: {
          interest: 4.2,
          weightedInterest: 4.4,
          usability: 4.1,
        },
        todos: {
          high: ["Clarify the fastest path from homepage to proof."],
          medium: ["Tighten first-visit orientation."],
          low: ["Keep recent updates visible."],
        },
        observations: [],
      },
    ];

    writeOverallPersonaReport(personaSummaries);

    const combined = readCombinedPersonasAndJourneysSummary() as {
      audit: { personasReviewed: number } | null;
      journeys: { journeysReviewed: number } | null;
    } | null;

    assert.ok(combined);
    assert.equal(combined.audit?.personasReviewed, 1);
    assert.equal(combined.journeys?.journeysReviewed, 1);
    assert.ok(existsSync(resolve(personasRoot, "overall-audit", "summary.json")));
  });
});
