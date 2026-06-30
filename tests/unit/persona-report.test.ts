import assert from "node:assert/strict";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
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
const personaTodoPath = resolve(process.cwd(), "docs", "PERSONA-TESTS-RESULTS-TODO.backup.md");

function cleanupAggregateOutputs() {
  for (const folderName of aggregateFolderNames) {
    rmSync(resolve(personasRoot, folderName), { recursive: true, force: true });
  }
}

function withPreservedAggregateOutputs(run: () => void) {
  const backupRoot = mkdtempSync(resolve(tmpdir(), "persona-report-test-"));
  const todoBackupPath = resolve(backupRoot, "PERSONA-TESTS-RESULTS-TODO.backup.md");

  try {
    for (const folderName of aggregateFolderNames) {
      const source = resolve(personasRoot, folderName);

      if (existsSync(source)) {
        cpSync(source, resolve(backupRoot, folderName), { recursive: true });
      }
    }

    if (existsSync(personaTodoPath)) {
      cpSync(personaTodoPath, todoBackupPath);
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

    if (existsSync(todoBackupPath)) {
      rmSync(personaTodoPath, { force: true });
      cpSync(todoBackupPath, personaTodoPath);
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
        expectedRouteMisses: [
          {
            surfaceId: "about",
            label: "About",
            route: "/about",
            reason: "Expected route was not visited during this journey.",
          },
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
        searchRationale: [
          "Professional evaluation makes search more plausible when the visitor is trying to reduce uncertainty.",
        ],
        bounceRisk: "medium",
        bounceReasons: ["First-visit trust burden raises the cost of any confusing or weakly oriented early page."],
        nearBounceRoute: "/",
        journeyOutcome: "partial",
        outcomeReasons: ["Trust-focused journey succeeded weakly without visiting `/about`."],
        success: true,
        successBoolean: true,
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
        routeCatalogWarnings: [],
        adminRouteLeaks: [],
        exitState: "bookmark",
        journeyNotes: ["Journey Mode v1 kept the visit short and practical."],
        catalogCoverage: {
          totalJourneyEligibleRoutes: 10,
          selectedJourneyEligibleRoutes: 4,
          coverageRatio: 0.4,
          journeyEligibleRoutes: ["/", "/about", "/work-with-me", "/search", "/updates", "/build-log"],
          selectedRoutes: ["/", "/work-with-me", "/search", "/build-log"],
        },
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
        expectedRouteMisses: [
          {
            surfaceId: "build-log",
            label: "Build Log",
            route: "/build-log",
            reason: "Expected route was not visited during this journey.",
          },
        ],
        skippedRoutes: ["/admin"],
        skippedRouteReasons: [],
        searchQueries: [],
        searchRationale: [],
        bounceRisk: "low",
        bounceReasons: ["Deep-browse or return-oriented intent gives the visitor more patience than a cold first visit."],
        journeyOutcome: "success",
        outcomeReasons: ["The journey satisfied the scenario goal and kept the expected trust or orientation anchors intact."],
        success: true,
        successBoolean: true,
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
        routeCatalogWarnings: [],
        adminRouteLeaks: [],
        exitState: "return-later",
        journeyNotes: ["Search was not part of this journey."],
        catalogCoverage: {
          totalJourneyEligibleRoutes: 10,
          selectedJourneyEligibleRoutes: 3,
          coverageRatio: 0.3,
          journeyEligibleRoutes: ["/updates", "/writings", "/tiny-thoughts", "/build-log"],
          selectedRoutes: ["/updates", "/writings", "/tiny-thoughts"],
        },
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
    assert.ok(existsSync(personaTodoPath));

    const todoDoc = readFileSync(personaTodoPath, "utf8");
    assert.match(todoDoc, /# PERSONA-TESTS-RESULTS-TODO\.backup\.md/);
    assert.match(todoDoc, /Website work starts here\./);
    assert.match(todoDoc, /Start with the highest-confidence active website items\./);
    assert.match(todoDoc, /Pick 1–3 website TODOs, implement them, then re-run `npm run test:users:fast`\./);
    assert.match(todoDoc, /## Recommended Work Order/);
    assert.match(todoDoc, /## First Implementation Batch/);
    assert.match(todoDoc, /## Retest Workflow/);
    assert.match(todoDoc, /## Retest Target/);
    assert.match(todoDoc, /## Trust Cluster/);
    assert.match(todoDoc, /## Homepage/);
    assert.match(todoDoc, /## Overall UX/);
    assert.match(todoDoc, /Acceptance criteria:/);
    assert.match(todoDoc, /Professional visitors do not have to rely on Search to connect personality, proof, and next step\./);

    const journeyReport = readFileSync(resolve(personasRoot, "overall-journeys", "report.md"), "utf8");
    assert.match(journeyReport, /Goal satisfied: `1\/1`/);
    assert.match(journeyReport, /Journey outcomes:/);
    assert.match(journeyReport, /success: `1`/);
    assert.match(journeyReport, /partial: `0`/);
    assert.match(journeyReport, /failed: `0`/);

    const auditSummary = JSON.parse(
      readFileSync(resolve(personasRoot, "overall-audit", "summary.json"), "utf8"),
    ) as {
      productRecommendations?: Array<{ area: string; confidence: string }>;
    };
    const journeySummary = JSON.parse(
      readFileSync(resolve(personasRoot, "overall-journeys", "summary.json"), "utf8"),
    ) as {
      productRecommendations?: Array<{ area: string; confidence: string }>;
    };

    assert.ok(Array.isArray(auditSummary.productRecommendations));
    assert.ok(Array.isArray(journeySummary.productRecommendations));
    assert.ok(
      journeySummary.productRecommendations?.every((item) =>
        ["High Confidence", "Medium Confidence", "Low Confidence"].includes(item.confidence),
      ),
    );
  });
});
