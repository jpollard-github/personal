import { execFile, spawn, type ChildProcess } from "node:child_process";
import { promises as fs } from "node:fs";
import net from "node:net";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const repoRoot = process.cwd();
const reviewPacketsRoot = path.join(repoRoot, "review-packets");
const packetTimestamp = new Date();
const packetDate = formatDate(packetTimestamp);
const packetTime = formatTime(packetTimestamp);

const defaultRoutes = [
  "/",
  "/about",
  "/work-with-me",
  "/music",
  "/writings",
  "/arcade",
  "/cats/beverly-and-lucinda",
  "/movies-tv",
  "/tiny-thoughts",
];

type CheckStatus = "pass" | "fail" | "unknown" | "skipped";

type CommandResult = {
  command: string;
  exitCode: number | null;
  stdout: string;
  stderr: string;
  error?: string;
};

type ScreenshotResult = {
  generated: string[];
  skippedReason?: string;
  baseUrl?: string;
  summary: ScreenshotSummaryEntry[];
  routeStatuses: RouteStatusEntry[];
};

type PacketOptions = {
  includePaths: string[];
  note?: string;
  summaryFile?: string;
  reportFile?: string;
  screenshotBaseUrl?: string;
  includePersonaScreenshots: boolean;
  includeScript: boolean;
  focus: string;
  routes?: string[];
  skipTests: boolean;
  skipScreenshots: boolean;
  viewportOnly: boolean;
  mobile: boolean;
};

type PacketContext = {
  missingOptionalPaths: string[];
  copiedExtraFiles: string[];
  copiedSources: string[];
  copiedDocs: string[];
  copiedTests: string[];
  copiedPublicContent: string[];
  checkSummaries: string[];
  checkStatus: CheckStatus;
};

type ProgressHandle = {
  stop: (detail?: string) => void;
};

type ScreenshotMode = "mobile" | "desktop";
type ScreenshotVariant = "full-page" | "viewport";
type ScreenshotStatus = "generated" | "failed" | "invalid";

type ScreenshotSummaryEntry = {
  route: string;
  mode: ScreenshotMode;
  variant: ScreenshotVariant;
  filePath: string;
  sizeBytes: number;
  status: ScreenshotStatus;
  error?: string;
  captureNote?: string;
  baseUrl: string;
};

type RouteStatusEntry = {
  route: string;
  mode: ScreenshotMode;
  httpStatus?: number;
  error?: string;
  baseUrl: string;
};

const maxSafeFullPageCaptureHeight = 15000;

type MobileReviewIndexEntry = {
  route: string;
  viewportScreenshotPath?: string;
  fullPageScreenshotPath?: string;
  viewportStatus: ScreenshotStatus | "missing";
  fullPageStatus: ScreenshotStatus | "missing";
  viewportSizeBytes: number;
  fullPageSizeBytes: number;
  httpStatus?: number;
  recommendedPriority: "critical" | "high" | "medium" | "low";
};

const suspiciousJpegSizeBytes = 10 * 1024;

const sourceEntries = [
  "README.md",
  "package.json",
  "app/page.tsx",
  "app/layout.tsx",
  "app/globals.css",
  "app/site-data.ts",
  "app/site-content",
  "app/home",
  "app/about",
  "app/work-with-me",
  "app/music",
  "app/writings",
  "app/arcade",
  "app/cats",
  "app/movies-tv",
  "app/twin-peaks-self",
  "app/tiny-thoughts",
  "app/updates",
  "app/search",
  "app/admin",
  "app/api",
  "app/lib",
  "playwright.config.ts",
  "playwright.personas.config.ts",
  "next.config.mjs",
  "tsconfig.json",
  ".vscode/ai-context.json",
  ".vscode/tasks.json",
];

const docsEntries = [
  "docs/README.md",
  "docs/TODO.md",
  "docs/MOBILE-TODO.md",
  "docs/ChatGPT-TODO.md",
  "docs/AI-TODO.md",
  "docs/AI-TODO-FIRST.md",
  "docs/CONTENT-TODO.md",
  "docs/PERSONA-TODO.md",
  "docs/PERSONA-TESTS-RESULTS-TODO.backup.md",
  "docs/PERSONA-DESIGN-PRINCIPLES.md",
  "docs/EDITORIAL-GUIDE.md",
  "docs/ADMIN-VISION.md",
  "docs/BUSINESS-FUNNEL.md",
  "docs/LEAD-GENERATION-TODO.md",
  "docs/REPO-ARCHITECTURE-NOTES.md",
  "docs/analytics",
];

const testsEntries = [
  "tests/unit",
  "tests/e2e",
  "tests/persona-testing",
];

const publicContentEntries = [
  "public/writings",
  "public/games",
];

const reportEntries = [
  "playwright-report",
  "test-results",
];

const defaultCodexReportPath = "reports/codex-report.md";

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (!options.reportFile) {
    const defaultReportSource = path.join(repoRoot, defaultCodexReportPath);
    if (await pathExists(defaultReportSource)) {
      options.reportFile = defaultCodexReportPath;
    }
  }
  const datedDir = path.join(reviewPacketsRoot, packetDate);
  const packetDir = await ensureUniquePath(path.join(datedDir, `site-review-${packetTime}`));
  const latestDir = path.join(reviewPacketsRoot, "latest-site-review");
  const zipPath = await ensureUniquePath(
    path.join(reviewPacketsRoot, `arcadeghosts-site-review-${packetDate}-${packetTime}.zip`),
  );

  const context: PacketContext = {
    missingOptionalPaths: [],
    copiedExtraFiles: [],
    copiedSources: [],
    copiedDocs: [],
    copiedTests: [],
    copiedPublicContent: [],
    checkSummaries: [],
    checkStatus: "unknown",
  };

  await ensureDir(packetDir);
  await ensureDir(path.join(packetDir, "source"));
  await ensureDir(path.join(packetDir, "docs"));
  await ensureDir(path.join(packetDir, "tests"));
  await ensureDir(path.join(packetDir, "public-content"));
  await ensureDir(path.join(packetDir, "reports"));
  await ensureDir(path.join(packetDir, "extra"));

  logStep(`Creating review packet in ${packetDir}`);
  const sourceCount = await copyEntries(
    sourceEntries,
    "source",
    packetDir,
    context.copiedSources,
    context.missingOptionalPaths,
  );
  logStep(`Copied source files (${sourceCount} entries)`);
  if (options.includeScript) {
    logStep("Including packet script for self-review");
    await copyFileToPacket(
      path.join(repoRoot, "scripts", "create-review-packet.ts"),
      path.join(packetDir, "source", "scripts", "create-review-packet.ts"),
    );
  }
  const docsCount = await copyEntries(
    docsEntries,
    "docs",
    packetDir,
    context.copiedDocs,
    context.missingOptionalPaths,
    "docs",
  );
  logStep(`Copied docs (${docsCount} entries)`);
  const testsCount = await copyEntries(
    testsEntries,
    "tests",
    packetDir,
    context.copiedTests,
    context.missingOptionalPaths,
    "tests",
  );
  logStep(`Copied tests (${testsCount} entries)`);
  const publicCount = await copyEntries(
    publicContentEntries,
    "public-content",
    packetDir,
    context.copiedPublicContent,
    context.missingOptionalPaths,
    "public",
  );
  logStep(`Copied public content (${publicCount} entries)`);
  const reportCount = await copyEntries(reportEntries, "reports", packetDir, [], context.missingOptionalPaths);
  const personaReportCount = await copyPersonaReports(packetDir, context.missingOptionalPaths, options);
  logStep(`Copied existing reports (${reportCount + personaReportCount} entries)`);

  if (options.summaryFile) {
    logStep(`Including summary file: ${options.summaryFile}`);
    const summarySource = path.resolve(repoRoot, options.summaryFile);
    const summaryExists = await pathExists(summarySource);
    if (summaryExists) {
      await copyFileToPacket(summarySource, path.join(packetDir, "reports", "codex-summary.md"));
    } else {
      context.missingOptionalPaths.push(options.summaryFile);
    }
  }

  if (options.reportFile) {
    logStep(`Including report file: ${options.reportFile}`);
    const reportSource = path.resolve(repoRoot, options.reportFile);
    const reportExists = await pathExists(reportSource);
    if (reportExists) {
      await copyFileToPacket(reportSource, path.join(packetDir, "reports", "codex-report.md"));
    } else {
      context.missingOptionalPaths.push(options.reportFile);
    }
  }

  if (options.includePaths.length > 0) {
    logStep(`Including extra paths: ${options.includePaths.join(", ")}`);
  }
  const extraCount = await copyIncludedPaths(options.includePaths, packetDir, context);
  if (options.includePaths.length > 0) {
    logStep(`Copied extra files (${extraCount} entries)`);
  }

  const checkResults = options.skipTests ? [] : await runChecksWithProgress();
  await writeChecksReport(path.join(packetDir, "reports", "checks.txt"), checkResults, context);

  const screenshotResult = options.skipScreenshots
    ? { generated: [], skippedReason: "Skipped via --skip-screenshots.", summary: [], routeStatuses: [] }
    : await generateScreenshotsWithProgress(packetDir, options);
  await fs.writeFile(
    path.join(packetDir, "reports", "screenshot-summary.json"),
    `${JSON.stringify(screenshotResult.summary, null, 2)}\n`,
    "utf8",
  );
  await fs.writeFile(
    path.join(packetDir, "reports", "route-status.json"),
    `${JSON.stringify(screenshotResult.routeStatuses, null, 2)}\n`,
    "utf8",
  );
  if (options.mobile) {
    const mobileReviewIndex = buildMobileReviewIndex(screenshotResult, options);
    await fs.writeFile(
      path.join(packetDir, "reports", "mobile-review-index.json"),
      `${JSON.stringify(mobileReviewIndex, null, 2)}\n`,
      "utf8",
    );
    await writeMobileReview(packetDir, screenshotResult, options);
  }

  await writePacketInfo({
    packetDir,
    zipPath,
    latestDir,
    options,
    context,
    screenshotResult,
    checkResults,
  });
  await writeReview({
    packetDir,
    options,
    context,
    screenshotResult,
    checkResults,
  });

  logStep("Refreshing latest-site-review");
  await refreshLatestCopy(packetDir, latestDir);
  logStep("Creating zip archive");
  const createdZip = await zipPacketDirectory(packetDir, zipPath);

  console.log(`Packet folder: ${packetDir}`);
  console.log(`Latest packet: ${latestDir}`);
  if (createdZip) {
    console.log(`Zip archive: ${zipPath}`);
  } else {
    console.log("Zip archive: skipped (the `zip` command was unavailable)");
  }
}

function parseArgs(argv: string[]): PacketOptions {
  const options: PacketOptions = {
    includePaths: [],
    includePersonaScreenshots: false,
    includeScript: false,
    focus: "all",
    skipTests: false,
    skipScreenshots: false,
    viewportOnly: false,
    mobile: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--include" && argv[index + 1]) {
      options.includePaths = argv[index + 1]
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
      index += 1;
      continue;
    }

    if (arg === "--note" && argv[index + 1]) {
      options.note = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--summary-file" && argv[index + 1]) {
      options.summaryFile = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--report-file" && argv[index + 1]) {
      options.reportFile = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--screenshot-base-url" && argv[index + 1]) {
      options.screenshotBaseUrl = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--focus" && argv[index + 1]) {
      options.focus = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--routes" && argv[index + 1]) {
      options.routes = argv[index + 1]
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
      index += 1;
      continue;
    }

    if (arg === "--skip-tests") {
      options.skipTests = true;
      continue;
    }

    if (arg === "--include-persona-screenshots") {
      options.includePersonaScreenshots = true;
      continue;
    }

    if (arg === "--include-script") {
      options.includeScript = true;
      continue;
    }

    if (arg === "--skip-screenshots") {
      options.skipScreenshots = true;
      continue;
    }

    if (arg === "--viewport-only") {
      options.viewportOnly = true;
      continue;
    }

    if (arg === "--mobile") {
      options.mobile = true;
    }
  }

  return options;
}

function formatDate(value: Date) {
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
}

function formatTime(value: Date) {
  return `${String(value.getHours()).padStart(2, "0")}${String(value.getMinutes()).padStart(2, "0")}`;
}

async function ensureDir(targetDir: string) {
  await fs.mkdir(targetDir, { recursive: true });
}

async function pathExists(targetPath: string) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function copyEntries(
  entries: string[],
  packetSubdir: string,
  packetDir: string,
  copiedPaths: string[],
  missingPaths: string[],
  trimSourcePrefix?: string,
) {
  let copiedCount = 0;
  for (const entry of entries) {
    const sourcePath = path.join(repoRoot, entry);
    if (!(await pathExists(sourcePath))) {
      missingPaths.push(entry);
      continue;
    }

    const relativeTargetPath = trimSourcePrefix
      ? path.relative(trimSourcePrefix, entry)
      : entry;
    const targetPath = path.join(packetDir, packetSubdir, relativeTargetPath);
    const stats = await fs.stat(sourcePath);
    if (stats.isDirectory()) {
      await copyDirToPacket(sourcePath, targetPath);
    } else {
      await copyFileToPacket(sourcePath, targetPath);
    }
    copiedPaths.push(entry);
    copiedCount += 1;
  }
  return copiedCount;
}

async function copyFileToPacket(sourcePath: string, destinationPath: string) {
  await ensureDir(path.dirname(destinationPath));
  await fs.copyFile(sourcePath, destinationPath);
}

async function copyDirToPacket(sourcePath: string, destinationPath: string) {
  await ensureDir(path.dirname(destinationPath));
  await fs.cp(sourcePath, destinationPath, { recursive: true });
}

async function ensureUniquePath(targetPath: string) {
  if (!(await pathExists(targetPath))) {
    return targetPath;
  }

  const extension = path.extname(targetPath);
  const base = extension ? targetPath.slice(0, -extension.length) : targetPath;
  let attempt = 2;
  while (await pathExists(`${base}-${attempt}${extension}`)) {
    attempt += 1;
  }
  return `${base}-${attempt}${extension}`;
}

function logStep(message: string) {
  console.log(`[site:review-packet] ${message}`);
}

function startProgress(message: string): ProgressHandle {
  process.stdout.write(`[site:review-packet] ${message}`);
  const interval = setInterval(() => {
    process.stdout.write(".");
  }, 1000);

  return {
    stop(detail?: string) {
      clearInterval(interval);
      process.stdout.write(detail ? ` ${detail}\n` : " done\n");
    },
  };
}

async function runChecks() {
  const packageJsonPath = path.join(repoRoot, "package.json");
  const rawPackageJson = await fs.readFile(packageJsonPath, "utf8");
  const packageJson = JSON.parse(rawPackageJson) as { scripts?: Record<string, string> };
  const scripts = packageJson.scripts ?? {};
  const commands: string[][] = [];

  if (scripts.lint) {
    commands.push(["run", "lint"]);
  }

  if (scripts["test:unit"]) {
    commands.push(["run", "test:unit"]);
  } else if (scripts.test) {
    commands.push(["test"]);
  }

  const results: CommandResult[] = [];
  for (const args of commands) {
    results.push(await runCommandCapture("npm", args));
  }
  return results;
}

async function runChecksWithProgress() {
  const progress = startProgress("Running lint/tests");
  try {
    const results = await runChecks();
    progress.stop("done");
    return results;
  } catch (error) {
    progress.stop("failed");
    throw error;
  }
}

async function runCommandCapture(command: string, args: string[]): Promise<CommandResult> {
  const commandLabel = [command, ...args].join(" ");
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd: repoRoot,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    child.stdout?.on("data", (chunk) => {
      stdout += String(chunk);
    });

    child.stderr?.on("data", (chunk) => {
      stderr += String(chunk);
    });

    child.on("error", (error) => {
      resolve({
        command: commandLabel,
        exitCode: null,
        stdout,
        stderr,
        error: error.message,
      });
    });

    child.on("close", (exitCode) => {
      resolve({
        command: commandLabel,
        exitCode,
        stdout,
        stderr,
      });
    });
  });
}

async function writeChecksReport(
  outputPath: string,
  checkResults: CommandResult[],
  context: PacketContext,
) {
  if (checkResults.length === 0) {
    context.checkStatus = "skipped";
    context.checkSummaries = ["Checks skipped via --skip-tests or no matching scripts were available."];
    await fs.writeFile(outputPath, "Checks were skipped.\n", "utf8");
    return;
  }

  const summaries: string[] = [];
  let overallStatus: CheckStatus = "pass";

  const blocks = checkResults.map((result) => {
    const status =
      result.error || result.exitCode === null
        ? "unknown"
        : result.exitCode === 0
          ? "pass"
          : "fail";

    if (status === "fail") {
      overallStatus = "fail";
    } else if (status === "unknown" && overallStatus !== "fail") {
      overallStatus = "unknown";
    }

    summaries.push(`${result.command}: ${status}${result.exitCode === null ? "" : ` (exit ${result.exitCode})`}`);

    return [
      `$ ${result.command}`,
      result.error ? `Error: ${result.error}` : `Exit code: ${result.exitCode ?? "unknown"}`,
      "",
      "STDOUT",
      result.stdout.trim() || "(no stdout)",
      "",
      "STDERR",
      result.stderr.trim() || "(no stderr)",
      "",
    ].join("\n");
  });

  context.checkStatus = overallStatus;
  context.checkSummaries = summaries;
  await fs.writeFile(outputPath, `${blocks.join("\n")}\n`, "utf8");
}

async function generateScreenshots(packetDir: string, options: PacketOptions): Promise<ScreenshotResult> {
  let playwright: typeof import("@playwright/test");
  try {
    playwright = await import("@playwright/test");
  } catch (error) {
    return {
      generated: [],
      skippedReason: `Playwright was not available for screenshots: ${(error as Error).message}`,
      summary: [],
      routeStatuses: [],
    };
  }

  let localServer: Awaited<ReturnType<typeof resolveBaseUrlForScreenshots>>;
  try {
    localServer = await resolveBaseUrlForScreenshots(options);
  } catch (error) {
    return {
      generated: [],
      skippedReason: `Screenshot setup was skipped: ${(error as Error).message}`,
      summary: [],
      routeStatuses: [],
    };
  }
  if (!localServer.baseUrl) {
    return {
      generated: [],
      skippedReason: localServer.reason ?? "No base URL was available for screenshots.",
      summary: [],
      routeStatuses: [],
    };
  }

  const screenshotsDir = path.join(packetDir, "screenshots");
  await ensureDir(screenshotsDir);
  const viewportDir = path.join(screenshotsDir, "viewport");
  const invalidScreenshotsDir = path.join(packetDir, "reports", "invalid-screenshots");

  const routeOrder: ScreenshotMode[] = options.mobile ? ["mobile", "desktop"] : ["desktop", "mobile"];
  const routes = options.routes && options.routes.length > 0 ? options.routes : defaultRoutes;
  const generated: string[] = [];
  const summary: ScreenshotSummaryEntry[] = [];
  const routeStatuses: RouteStatusEntry[] = [];
  const browser = await playwright.chromium.launch();

  try {
    for (const mode of routeOrder) {
      const useMobile = mode === "mobile";
      const context = await browser.newContext(
        useMobile
          ? {
              ...playwright.devices["iPhone 13"],
            }
          : {
              viewport: { width: 1440, height: 1080 },
            },
      );

      const page = await context.newPage();
      for (const route of routes) {
        const fileName = `${mode}-${routeToSlug(route)}.jpg`;
        const filePath = path.join(screenshotsDir, fileName);
        try {
          const response = await page.goto(new URL(route, localServer.baseUrl).toString(), {
            waitUntil: "domcontentloaded",
            timeout: 45000,
          });
          routeStatuses.push({
            route,
            mode,
            httpStatus: response?.status(),
            error: response && response.status() >= 400 ? `HTTP ${response.status()}` : undefined,
            baseUrl: localServer.baseUrl,
          });
          try {
            await page.waitForLoadState("networkidle", { timeout: 5000 });
          } catch {
            // Some pages may keep background work alive; a screenshot is still useful.
          }
          const fullPageResult = await captureAndValidateScreenshot({
            baseUrl: localServer.baseUrl,
            mode,
            packetDir,
            page,
            pathWithinPacket: path.join("screenshots", fileName),
            route,
            summary,
            variant: "full-page",
            invalidScreenshotsDir,
          });
          if (fullPageResult.status === "generated") {
            generated.push(fullPageResult.filePath);
          }

          if (options.viewportOnly) {
            await ensureDir(viewportDir);
            const viewportResult = await captureAndValidateScreenshot({
              baseUrl: localServer.baseUrl,
              mode,
              packetDir,
              page,
              pathWithinPacket: path.join("screenshots", "viewport", fileName),
              route,
              summary,
              variant: "viewport",
              invalidScreenshotsDir,
              screenshotOptions: {
                fullPage: false,
              },
            });
            if (viewportResult.status === "generated") {
              generated.push(viewportResult.filePath);
            }
          }
        } catch (error) {
          routeStatuses.push({
            route,
            mode,
            error: (error as Error).message,
            baseUrl: localServer.baseUrl,
          });
          const errorMessage = (error as Error).stack ?? String(error);
          await writeRouteErrorFile(packetDir, mode, route, errorMessage);
          summary.push({
            route,
            mode,
            variant: "full-page",
            filePath: path.join("screenshots", `${mode}-${routeToSlug(route)}.jpg`),
            sizeBytes: 0,
            status: "failed",
            error: errorMessage,
            baseUrl: localServer.baseUrl,
          });
          if (options.viewportOnly) {
            summary.push({
              route,
              mode,
              variant: "viewport",
              filePath: path.join("screenshots", "viewport", `${mode}-${routeToSlug(route)}.jpg`),
              sizeBytes: 0,
              status: "failed",
              error: errorMessage,
              baseUrl: localServer.baseUrl,
            });
          }
        }
      }
      await context.close();
    }
  } finally {
    await browser.close();
    await localServer.stop();
  }

  if (generated.length === 0) {
    return {
      generated,
      baseUrl: localServer.baseUrl,
      skippedReason:
        "Playwright was available, but no screenshots were captured successfully. See reports/*screenshot-error.txt.",
      summary,
      routeStatuses,
    };
  }

  return {
    generated,
    baseUrl: localServer.baseUrl,
    summary,
    routeStatuses,
  };
}

async function generateScreenshotsWithProgress(packetDir: string, options: PacketOptions) {
  const progress = startProgress("Generating screenshots");
  try {
    const result = await generateScreenshots(packetDir, options);
    progress.stop(result.generated.length > 0 ? `${result.generated.length} captured` : "skipped");
    return result;
  } catch (error) {
    progress.stop("failed");
    throw error;
  }
}

async function captureAndValidateScreenshot(input: {
  baseUrl: string;
  mode: ScreenshotMode;
  packetDir: string;
  page: import("@playwright/test").Page;
  pathWithinPacket: string;
  route: string;
  summary: ScreenshotSummaryEntry[];
  variant: ScreenshotVariant;
  invalidScreenshotsDir: string;
  screenshotOptions?: {
    fullPage?: boolean;
  };
}) {
  const absolutePath = path.join(input.packetDir, input.pathWithinPacket);
  await ensureDir(path.dirname(absolutePath));
  const validation = await captureScreenshotWithRetry({
    filePath: absolutePath,
    fullPage: input.screenshotOptions?.fullPage ?? true,
    page: input.page,
    variant: input.variant,
  });
  if (validation.status === "generated") {
    const entry: ScreenshotSummaryEntry = {
      route: input.route,
      mode: input.mode,
      variant: input.variant,
      filePath: input.pathWithinPacket,
      sizeBytes: validation.sizeBytes,
      status: "generated",
      captureNote: validation.captureNote,
      baseUrl: input.baseUrl,
    };
    input.summary.push(entry);
    return entry;
  }

  await ensureDir(input.invalidScreenshotsDir);
  const movedPath = path.join(
    input.invalidScreenshotsDir,
    `${input.variant}-${input.mode}-${routeToSlug(input.route)}.jpg`,
  );

  if (await pathExists(absolutePath)) {
    await fs.rename(absolutePath, movedPath);
  }

  const errorMessage = validation.error ?? "Screenshot file was invalid.";
  await writeRouteErrorFile(input.packetDir, input.mode, input.route, `${input.variant}: ${errorMessage}`);

  const invalidEntry: ScreenshotSummaryEntry = {
    route: input.route,
    mode: input.mode,
    variant: input.variant,
    filePath: path.relative(input.packetDir, movedPath),
    sizeBytes: validation.sizeBytes,
    status: "invalid",
    error: errorMessage,
    baseUrl: input.baseUrl,
  };
  input.summary.push(invalidEntry);
  return invalidEntry;
}

async function captureScreenshotWithRetry(input: {
  filePath: string;
  fullPage: boolean;
  page: import("@playwright/test").Page;
  variant: ScreenshotVariant;
}) {
  let lastValidation = {
    status: "invalid" as const,
    sizeBytes: 0,
    error: "Screenshot file was not written.",
    captureNote: undefined as string | undefined,
  };

  for (let attempt = 0; attempt < 2; attempt += 1) {
    if (await pathExists(input.filePath)) {
      await fs.rm(input.filePath, { force: true });
    }

    await input.page.evaluate(() => window.scrollTo({ top: 0, left: 0, behavior: "instant" }));
    await input.page.waitForTimeout(attempt === 0 ? 150 : 450);
    await input.page.screenshot({
      path: input.filePath,
      fullPage: input.fullPage,
      quality: 70,
      type: "jpeg",
      animations: "disabled",
    });

    lastValidation = await validateScreenshotFile(input.filePath);
    if (lastValidation.status === "generated") {
      return lastValidation;
    }

    if (input.variant === "viewport") {
      break;
    }
  }

  if (input.fullPage && input.variant === "full-page") {
    const fallbackValidation = await captureTallPageFallback(input);
    if (fallbackValidation) {
      return fallbackValidation;
    }
  }

  return lastValidation;
}

async function captureTallPageFallback(input: {
  filePath: string;
  fullPage: boolean;
  page: import("@playwright/test").Page;
  variant: ScreenshotVariant;
}) {
  const dimensions = await input.page.evaluate(() => ({
    scrollHeight: Math.ceil(document.documentElement.scrollHeight),
    scrollWidth: Math.ceil(document.documentElement.scrollWidth),
  }));

  if (dimensions.scrollHeight <= maxSafeFullPageCaptureHeight) {
    return null;
  }

  const viewport = input.page.viewportSize();
  const width = Math.max(1, Math.min(dimensions.scrollWidth, viewport?.width ?? dimensions.scrollWidth));
  const height = Math.max(1, Math.min(dimensions.scrollHeight, maxSafeFullPageCaptureHeight));

  if (await pathExists(input.filePath)) {
    await fs.rm(input.filePath, { force: true });
  }

  await input.page.evaluate(() => window.scrollTo(0, 0));
  await input.page.waitForTimeout(250);
  await input.page.screenshot({
    path: input.filePath,
    fullPage: false,
    clip: {
      x: 0,
      y: 0,
      width,
      height,
    },
    quality: 70,
    type: "jpeg",
    animations: "disabled",
  });

  const validation = await validateScreenshotFile(input.filePath);
  if (validation.status !== "generated") {
    return null;
  }

  return {
    ...validation,
    captureNote: `Captured the first ${height}px of a ${dimensions.scrollHeight}px page to avoid full-page screenshot limits.`,
  };
}

async function validateScreenshotFile(filePath: string) {
  if (!(await pathExists(filePath))) {
    return {
      status: "invalid" as const,
      sizeBytes: 0,
      error: "Screenshot file was not written.",
    };
  }

  const stats = await fs.stat(filePath);
  if (stats.size <= 0) {
    return {
      status: "invalid" as const,
      sizeBytes: stats.size,
      error: "Screenshot file was 0 bytes.",
    };
  }

  const extension = path.extname(filePath).toLowerCase();
  if ((extension === ".jpg" || extension === ".jpeg") && stats.size < suspiciousJpegSizeBytes) {
    return {
      status: "invalid" as const,
      sizeBytes: stats.size,
      error: `Screenshot file was suspiciously small (${stats.size} bytes).`,
    };
  }

  return {
    status: "generated" as const,
    sizeBytes: stats.size,
  };
}

async function writeRouteErrorFile(packetDir: string, mode: ScreenshotMode, route: string, message: string) {
  const errorFile = path.join(packetDir, "reports", `${mode}-${routeToSlug(route)}-screenshot-error.txt`);
  await fs.writeFile(errorFile, `${message}\n`, "utf8");
}

async function resolveBaseUrlForScreenshots(options: PacketOptions) {
  if (options.screenshotBaseUrl) {
    return {
      baseUrl: options.screenshotBaseUrl,
      reason: "Using --screenshot-base-url.",
      stop: async () => {},
    };
  }

  const envBaseUrl = process.env.SITE_REVIEW_BASE_URL;
  if (envBaseUrl) {
    return {
      baseUrl: envBaseUrl,
      reason: "Using SITE_REVIEW_BASE_URL.",
      stop: async () => {},
    };
  }

  const existingLocalBaseUrl = await findExistingLocalBaseUrl();
  if (existingLocalBaseUrl) {
    return {
      baseUrl: existingLocalBaseUrl,
      reason: "Using an already-running local dev server.",
      stop: async () => {},
    };
  }

  const port = await findFreePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const child = spawn(getNpmCommand(), ["run", "dev", "--", "--hostname", "127.0.0.1", "--port", String(port)], {
    cwd: repoRoot,
    env: process.env,
    stdio: ["ignore", "pipe", "pipe"],
  });

  let stdout = "";
  let stderr = "";
  child.stdout?.on("data", (chunk) => {
    stdout += String(chunk);
  });
  child.stderr?.on("data", (chunk) => {
    stderr += String(chunk);
  });

  const stop = async () => {
    if (child.exitCode === null) {
      child.kill("SIGTERM");
      await onceClosed(child);
    }
  };

  const ready = await waitForUrl(baseUrl, 120000);
  if (!ready) {
    await stop();
    return {
      baseUrl: undefined,
      reason: `Local dev server did not become ready at ${baseUrl}. stdout:\n${truncate(stdout)}\n\nstderr:\n${truncate(stderr)}`,
      stop: async () => {},
    };
  }

  return {
    baseUrl,
    reason: "Started local dev server for screenshots.",
    stop,
  };
}

async function findExistingLocalBaseUrl() {
  const candidates = ["http://127.0.0.1:3000", "http://127.0.0.1:3001", "http://localhost:3000"];

  for (const candidate of candidates) {
    try {
      const response = await fetch(candidate, { redirect: "manual" });
      if (response.ok && response.headers.get("x-powered-by")?.toLowerCase().includes("next.js")) {
        return candidate;
      }
    } catch {
      // keep probing
    }
  }

  return undefined;
}

async function waitForUrl(url: string, timeoutMs: number) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return true;
      }
    } catch {
      // keep polling
    }
    await sleep(1000);
  }
  return false;
}

async function onceClosed(child: ChildProcess) {
  return new Promise<void>((resolve) => {
    child.once("close", () => resolve());
  });
}

async function findFreePort() {
  return new Promise<number>((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        reject(new Error("Unable to determine a free port."));
        return;
      }
      const { port } = address;
      server.close(() => resolve(port));
    });
    server.on("error", (error) => {
      reject(new Error(`Unable to bind a local screenshot port in this environment: ${(error as Error).message}`));
    });
  });
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getNpmCommand() {
  return process.platform === "win32" ? "npm.cmd" : "npm";
}

function truncate(value: string, maxLength = 4000) {
  return value.length <= maxLength ? value : `${value.slice(0, maxLength)}\n...truncated...`;
}

function routeToSlug(route: string) {
  if (route === "/") {
    return "home";
  }
  return route.replace(/^\//, "").replace(/\//g, "-");
}

async function copyIncludedPaths(optionsIncludePaths: string[], packetDir: string, context: PacketContext) {
  let copiedCount = 0;
  for (const includePath of optionsIncludePaths) {
    const resolvedPath = path.resolve(repoRoot, includePath);
    if (!(await pathExists(resolvedPath))) {
      context.missingOptionalPaths.push(includePath);
      continue;
    }

    const relativePath = resolvedPath.startsWith(repoRoot + path.sep)
      ? path.relative(repoRoot, resolvedPath)
      : path.join("external", path.basename(resolvedPath));
    const destinationPath = path.join(packetDir, "extra", relativePath);
    const stats = await fs.stat(resolvedPath);

    if (stats.isDirectory()) {
      await copyDirToPacket(resolvedPath, destinationPath);
    } else {
      await copyFileToPacket(resolvedPath, destinationPath);
    }

    context.copiedExtraFiles.push(relativePath);
    copiedCount += 1;
  }
  return copiedCount;
}

async function copyPersonaReports(
  packetDir: string,
  missingPaths: string[],
  options: PacketOptions,
) {
  const personaResultsRoot = path.join(repoRoot, "persona-results");
  if (!(await pathExists(personaResultsRoot))) {
    missingPaths.push("persona-results");
    return 0;
  }

  const reportsRoot = path.join(packetDir, "reports", "persona-results");
  await ensureDir(reportsRoot);

  if (options.includePersonaScreenshots) {
    await copyDirToPacket(personaResultsRoot, reportsRoot);
    return 1;
  }

  let copiedCount = 0;
  const personasRoot = path.join(personaResultsRoot, "personas");
  if (await pathExists(personasRoot)) {
    const personaNames = await fs.readdir(personasRoot);
    for (const personaName of personaNames) {
      const personaDir = path.join(personasRoot, personaName);
      const stats = await fs.stat(personaDir);
      if (!stats.isDirectory()) {
        continue;
      }

      const entryNames = await fs.readdir(personaDir);
      for (const entryName of entryNames) {
        if (entryName !== "report.md" && entryName !== "summary.json") {
          continue;
        }

        const sourcePath = path.join(personaDir, entryName);
        const destinationPath = path.join(reportsRoot, "personas", personaName, entryName);
        await copyFileToPacket(sourcePath, destinationPath);
        copiedCount += 1;
      }
    }
  }

  const aggregateDirs = [
    "overall-audit",
    "overall-journeys",
    "overall-persona",
    "overall-personas-and-journeys",
  ];

  for (const dirName of aggregateDirs) {
    const sourcePath = path.join(personaResultsRoot, "personas", dirName);
    if (!(await pathExists(sourcePath))) {
      continue;
    }

    const destinationPath = path.join(reportsRoot, "personas", dirName);
    await copyDirToPacket(sourcePath, destinationPath);
    copiedCount += 1;
  }

  return copiedCount;
}

async function writePacketInfo(input: {
  packetDir: string;
  zipPath: string;
  latestDir: string;
  options: PacketOptions;
  context: PacketContext;
  screenshotResult: ScreenshotResult;
  checkResults: CommandResult[];
}) {
  const lines = [
    "ArcadeGhosts Review Packet",
    "",
    `Created: ${new Date().toISOString()}`,
    `Packet folder: ${input.packetDir}`,
    `Latest mirror: ${input.latestDir}`,
    `Zip path: ${input.zipPath}`,
    "",
    "Options",
    `- mobile: ${input.options.mobile ? "yes" : "no"}`,
    `- skip tests: ${input.options.skipTests ? "yes" : "no"}`,
    `- skip screenshots: ${input.options.skipScreenshots ? "yes" : "no"}`,
    `- include persona screenshots: ${input.options.includePersonaScreenshots ? "yes" : "no"}`,
    `- include script: ${input.options.includeScript ? "yes" : "no"}`,
    `- viewport only: ${input.options.viewportOnly ? "yes" : "no"}`,
    `- focus: ${input.options.focus}`,
    `- routes: ${input.options.routes && input.options.routes.length > 0 ? input.options.routes.join(", ") : "(default)"}`,
    `- screenshot base URL: ${input.options.screenshotBaseUrl ?? process.env.SITE_REVIEW_BASE_URL ?? "(none)"}`,
    `- include paths: ${input.options.includePaths.length > 0 ? input.options.includePaths.join(", ") : "(none)"}`,
    `- summary file: ${input.options.summaryFile ?? "(none)"}`,
    `- report file: ${input.options.reportFile ?? "(none)"}`,
    `- note: ${input.options.note ?? "(none)"}`,
    "",
    "Checks",
    `- overall status: ${input.context.checkStatus}`,
    ...input.context.checkSummaries.map((line) => `- ${line}`),
    "",
    "Screenshots",
    `- base URL: ${input.screenshotResult.baseUrl ?? "(none)"}`,
    `- generated count: ${input.screenshotResult.generated.length}`,
    `- status: ${input.screenshotResult.generated.length > 0 ? "generated" : input.screenshotResult.skippedReason ?? "not generated"}`,
    "",
    "Missing Optional Files",
    ...(input.context.missingOptionalPaths.length > 0
      ? input.context.missingOptionalPaths.map((entry) => `- ${entry}`)
      : ["- (none)"]),
    "",
    "Extra Included Files",
    ...(input.context.copiedExtraFiles.length > 0
      ? input.context.copiedExtraFiles.map((entry) => `- ${entry}`)
      : ["- (none)"]),
    "",
    "Commands Run",
    ...(input.checkResults.length > 0
      ? input.checkResults.map((result) => `- ${result.command}`)
      : ["- (none)"]),
  ];

  await fs.writeFile(path.join(input.packetDir, "PACKET-INFO.txt"), `${lines.join("\n")}\n`, "utf8");
}

async function writeReview(input: {
  packetDir: string;
  options: PacketOptions;
  context: PacketContext;
  screenshotResult: ScreenshotResult;
  checkResults: CommandResult[];
}) {
  const hasMobileTodo = await pathExists(path.join(input.packetDir, "docs", "MOBILE-TODO.md"));
  const hasMobileReview = await pathExists(path.join(input.packetDir, "MOBILE-REVIEW.md"));
  const mobileBias = input.options.mobile
    ? "This packet was generated in mobile review mode. Start with `mobile-home`, review the first viewport before full-page scrolling, and tighten the opening mobile experience before broad desktop polish."
    : "Start with the homepage and Work With Me flow, then use the screenshots and copied source/docs to trace any friction back to the implementation and content decisions.";

  const summaryLink = input.options.summaryFile ? "- `reports/codex-summary.md` if present." : "";
  const reportLink = input.options.reportFile ? "- `reports/codex-report.md` if present." : "";
  const screenshotProblems = input.screenshotResult.summary.filter((entry) => entry.status !== "generated");
  const screenshotTable = buildScreenshotMarkdownTable(input.screenshotResult.summary);
  const routeStatusIssues = input.screenshotResult.routeStatuses.filter(
    (entry) => entry.error || (entry.httpStatus !== undefined && entry.httpStatus >= 400),
  );
  const routeStatusLines =
    routeStatusIssues.length > 0
      ? routeStatusIssues.map((entry) => {
          const statusLabel = entry.httpStatus ? `HTTP ${entry.httpStatus}` : "no HTTP status";
          return `- ${entry.mode} ${entry.route}: ${statusLabel}${entry.error ? `; ${entry.error}` : ""}`;
        })
      : ["- No route errors recorded during screenshot capture."];
  const reviewTheseFirst = input.options.mobile
    ? [
        "1. `screenshots/viewport/mobile-home.jpg`",
        "2. `screenshots/viewport/mobile-work-with-me.jpg`",
        "3. `screenshots/viewport/mobile-about.jpg`",
        "4. `MOBILE-REVIEW.md`",
        "5. `reports/mobile-review-index.json`",
      ]
    : [
        "1. `screenshots/desktop-home.jpg`",
        "2. `screenshots/desktop-work-with-me.jpg`",
        "3. `screenshots/desktop-about.jpg`",
      ];
  const startHereItems = input.options.mobile
    ? [
        ...(hasMobileTodo ? ["`docs/MOBILE-TODO.md`"] : []),
        ...(hasMobileReview ? ["`MOBILE-REVIEW.md`"] : []),
        "`screenshots/viewport/mobile-home.jpg` and `screenshots/viewport/mobile-work-with-me.jpg`",
        "`REVIEW.md`",
      ]
    : ["`REVIEW.md`", "`screenshots/desktop-home.jpg`", "`screenshots/desktop-work-with-me.jpg`"];
  const startHereLines = startHereItems.map((item, index) => `${index + 1}. ${item}`);

  const reviewLines = [
    "# ArcadeGhosts Site Review Packet",
    "",
    "## Start Here",
    ...startHereLines,
    "",
    mobileBias,
    "Review the homepage first, then verify whether the site quickly communicates who Jason is, what kind of people should keep exploring, and where a potential client or collaborator should go next.",
    "",
    "## Current Focus",
    "- mobile/iPhone readability",
    "- homepage first impression",
    "- navigation clarity",
    "- “Find my people” emotional signal",
    "- work-with-me conversion path",
    "- music/writing/cats/arcade personality pages",
    "- admin/content workflow sanity",
    "- SEO/OpenGraph basics",
    "- performance/accessibility risks",
    "",
    ...(input.options.mobile
      ? [
          "## Mobile First Pass",
          "- Start with `mobile-home`.",
          "- Review the first viewport before any full-page scrolling.",
          "- Check header/nav wrapping.",
          "- Check hero headline size.",
          "- Check CTA/button tap targets.",
          "- Check horizontal overflow.",
          "- Check whether the top section communicates clearly within 10 seconds.",
          "",
        ]
      : []),
    "## Packet Layout",
    "- `source/` holds core Next.js app files, route folders, config, and editor context files.",
    "- `docs/` holds project guidance, priorities, architecture notes, and analytics docs.",
    "- `tests/` holds unit, e2e, and persona-testing materials.",
    "- `public-content/` holds public writing and game content included in the site.",
    "- `reports/` holds check output, copied local reports, and optional Codex summary notes.",
    "- `screenshots/` holds generated desktop/mobile captures when screenshot generation succeeds.",
    "- `extra/` holds anything explicitly added with `--include`.",
    "",
    "## Suggested Review Order",
    "1. Home mobile",
    "2. Home desktop",
    "3. Work With Me mobile",
    "4. Music page",
    "5. Writings page and one writing detail page",
    "6. Cats and arcade pages",
    "7. Search/tiny thoughts/updates",
    "8. Admin/content workflow files",
    "9. Tests/persona testing",
    "",
    "## ChatGPT Review Prompt",
    "```text",
    "Please review this ArcadeGhosts personal website packet. Focus first on mobile/iPhone UX, then emotional clarity, navigation, content hierarchy, performance/accessibility risks, and whether the site helps Jason find compatible people, creative collaborators, and potential clients without feeling too cluttered or self-indulgent. Give prioritized fixes, quick wins, and suggested Codex tasks.",
    "```",
    "",
    "## Codex Follow-Up Prompt Template",
    "```text",
    "Using the latest review packet and ChatGPT feedback, implement the top priority fixes. Keep changes small and reviewable. Update TODO docs where appropriate. Run tests. Then run `npm run site:review-packet -- --summary-file <your-summary-file> --mobile` and report the new packet path.",
    "```",
    "",
    "## Recommended Commands",
    "```bash",
    "npm run site:review-packet -- --screenshot-base-url https://arcadeghosts.org --mobile --skip-tests",
    "npm run site:review-packet -- --screenshot-base-url https://arcadeghosts.org --mobile --viewport-only --skip-tests",
    "npm run site:review-packet -- --mobile",
    "npm run site:review-packet -- --mobile --summary-file reports/latest-codex-summary.md",
    "```",
    "- Use `--skip-tests` for quick visual packets from production.",
    "- Do not use `--skip-tests` after code changes unless intentionally doing a screenshot-only packet.",
    "- Run tests before asking ChatGPT to review implementation correctness.",
    "",
    "## Known Review Themes",
    "- Mobile currently needs serious attention.",
    "- Prioritize readability, spacing, tap targets, section order, and reducing visual clutter.",
    "- Preserve the weird/retro/Twin Peaks/arcade/cat personality. Do not sand it into a generic portfolio.",
    "- Make the homepage easier to understand in 10 seconds.",
    "- Make “Work With Me” easy to find but not overpowering.",
    "- Separate “personal signal” from “business conversion” enough that both work.",
    "- Use persona testing as a review input, not as fake certainty.",
    "- Prefer small iterative changes over giant redesigns.",
    "",
    "## Codex/User Note",
    input.options.note ?? "No additional note was provided.",
    "",
    "## Packet Focus",
    `Packet focus: \`${input.options.focus}\``,
    "",
    "## Checks",
    `Overall status: ${input.context.checkStatus}`,
    ...(input.context.checkSummaries.length > 0
      ? input.context.checkSummaries.map((line) => `- ${line}`)
      : ["- No checks were run."]),
    "",
    "See `reports/checks.txt` for full command output.",
    "",
    "## Screenshots",
    ...(input.screenshotResult.generated.length > 0
      ? input.screenshotResult.generated.map((entry) => `- ${entry}`)
      : [`- ${input.screenshotResult.skippedReason ?? "Screenshots were not generated."}`]),
    "",
    "## Review These First",
    ...reviewTheseFirst,
    "",
    ...(screenshotProblems.length > 0
      ? ["Warning: Some screenshots were invalid and should not be used for visual review.", ""]
      : []),
    "## Screenshot Summary",
    screenshotTable,
    "",
    "See `reports/screenshot-summary.json` for the full JSON report.",
    "",
    "## Screenshot Problems",
    ...(screenshotProblems.length > 0
      ? screenshotProblems.map((entry) =>
          `- ${entry.variant} ${entry.mode} ${entry.route}: ${entry.error ?? entry.status} (${entry.filePath})`,
        )
      : ["- None"]),
    "",
    "## Route Status",
    ...routeStatusLines,
    "",
    "See `reports/route-status.json` for the full JSON report.",
    "",
    "## Missing Files",
    ...(input.context.missingOptionalPaths.length > 0
      ? input.context.missingOptionalPaths.map((entry) => `- ${entry}`)
      : ["- None"]),
    "",
    "## Extra Included Files",
    ...(input.context.copiedExtraFiles.length > 0
      ? input.context.copiedExtraFiles.map((entry) => `- ${entry}`)
      : ["- None"]),
  ];

  if (summaryLink) {
    reviewLines.splice(reviewLines.indexOf("## Screenshots"), 0, "## Codex Summary", summaryLink, "");
  }

  if (reportLink) {
    reviewLines.splice(
      reviewLines.indexOf("## Screenshots"),
      0,
      "## Codex Implementation Report",
      reportLink,
      "",
    );
  }

  await fs.writeFile(path.join(input.packetDir, "REVIEW.md"), `${reviewLines.join("\n")}\n`, "utf8");
}

function buildScreenshotMarkdownTable(entries: ScreenshotSummaryEntry[]) {
  if (entries.length === 0) {
    return "No screenshots were captured.";
  }

  const lines = [
    "| Mode | Variant | Route | Status | Size | File | Note |",
    "| --- | --- | --- | --- | ---: | --- | --- |",
  ];

  for (const entry of entries) {
    lines.push(
      `| ${entry.mode} | ${entry.variant} | \`${entry.route}\` | ${entry.status} | ${formatBytes(
        entry.sizeBytes,
      )} | \`${entry.filePath}\` | ${entry.captureNote ?? ""} |`,
    );
  }

  return lines.join("\n");
}

function formatBytes(value: number) {
  if (value >= 1024 * 1024) {
    return `${(value / (1024 * 1024)).toFixed(1)} MB`;
  }

  if (value >= 1024) {
    return `${Math.round(value / 1024)} KB`;
  }

  return `${value} B`;
}

function buildMobileReviewIndex(screenshotResult: ScreenshotResult, options: PacketOptions): MobileReviewIndexEntry[] {
  const routes = options.routes && options.routes.length > 0 ? options.routes : defaultRoutes;

  return routes.map((route) => {
    const viewportEntry = screenshotResult.summary.find(
      (entry) => entry.route === route && entry.mode === "mobile" && entry.variant === "viewport",
    );
    const fullPageEntry = screenshotResult.summary.find(
      (entry) => entry.route === route && entry.mode === "mobile" && entry.variant === "full-page",
    );
    const routeStatus = screenshotResult.routeStatuses.find(
      (entry) => entry.route === route && entry.mode === "mobile",
    );

    return {
      route,
      viewportScreenshotPath: viewportEntry?.filePath,
      fullPageScreenshotPath: fullPageEntry?.filePath,
      viewportStatus: viewportEntry?.status ?? "missing",
      fullPageStatus: fullPageEntry?.status ?? "missing",
      viewportSizeBytes: viewportEntry?.sizeBytes ?? 0,
      fullPageSizeBytes: fullPageEntry?.sizeBytes ?? 0,
      httpStatus: routeStatus?.httpStatus,
      recommendedPriority: getMobilePriority(route),
    };
  });
}

function getMobilePriority(route: string): "critical" | "high" | "medium" | "low" {
  if (route === "/") {
    return "critical";
  }

  if (route === "/work-with-me" || route === "/about") {
    return "high";
  }

  if (
    route === "/music" ||
    route === "/writings" ||
    route === "/arcade" ||
    route === "/cats/beverly-and-lucinda"
  ) {
    return "medium";
  }

  return "low";
}

async function writeMobileReview(packetDir: string, screenshotResult: ScreenshotResult, options: PacketOptions) {
  const mobileIndex = buildMobileReviewIndex(screenshotResult, options);
  const focusLabel =
    options.focus === "all"
      ? "General mobile review across the key public pages."
      : `Current focus: \`${options.focus}\`. Bias review and fix recommendations toward that area first.`;
  const priorityOrder = prioritizeMobileRoutes(mobileIndex, options.focus);

  const prioritizedScreenshotLines = priorityOrder.flatMap((entry) => {
    const lines: string[] = [`- \`${entry.route}\` (${entry.recommendedPriority})`];
    lines.push(`  viewport: ${formatScreenshotRef(entry.viewportScreenshotPath, entry.viewportStatus)}`);
    lines.push(`  full-page: ${formatScreenshotRef(entry.fullPageScreenshotPath, entry.fullPageStatus)}`);
    return lines;
  });

  const sourceHints = [
    "source/app/page.tsx",
    "source/app/home",
    "source/app/globals.css",
    "source/app/work-with-me",
    "source/app/about",
    "source/app/music",
    "source/app/writings",
    "source/app/layout.tsx",
  ];
  const presentHints = await filterExistingPacketPaths(packetDir, sourceHints);
  const hasMobileTodo = await pathExists(path.join(packetDir, "docs", "MOBILE-TODO.md"));

  const lines = [
    "# Mobile Review",
    "",
    "## Start Here",
    ...(hasMobileTodo ? ["1. `docs/MOBILE-TODO.md`", "2. `screenshots/viewport/mobile-home.jpg`"] : ["1. `screenshots/viewport/mobile-home.jpg`"]),
    ...(hasMobileTodo ? ["3. `screenshots/viewport/mobile-work-with-me.jpg`", "4. `MOBILE-REVIEW.md`"] : ["2. `screenshots/viewport/mobile-work-with-me.jpg`", "3. `MOBILE-REVIEW.md`"]),
    "Review the first viewport before scrolling, then compare it to `mobile-work-with-me`, `mobile-about`, `mobile-music`, and `mobile-writings`.",
    focusLabel,
    "",
    "## Priority Screenshots",
    ...prioritizedScreenshotLines,
    "",
    "## First-Viewport Checklist",
    "- Is the header/nav wrapping awkwardly?",
    "- Is the hero headline readable without feeling oversized?",
    "- Are the primary CTA/button tap targets comfortably tappable?",
    "- Is there any horizontal overflow?",
    "- Does the top section communicate clearly within 10 seconds?",
    "",
    "## Full-Page Scrolling Checklist",
    "- Does spacing stay consistent as you scroll?",
    "- Do section transitions feel intentional rather than crowded?",
    "- Are long blocks of copy still readable on mobile?",
    "- Do cards, tiles, and media keep a sensible width and rhythm?",
    "- Does the page remain navigable without fatigue?",
    "",
    "## Mobile Bug Log Template",
    "1. Route:",
    "2. Screenshot:",
    "3. Problem:",
    "4. Why it matters:",
    "5. Likely source:",
    "6. Smallest safe fix:",
    "",
    "## Codex Prompt Template",
    "```text",
    "Using the latest mobile review packet, fix the highest-priority mobile issues first. Start with mobile-home and mobile-work-with-me. Keep changes small and reviewable. Re-run tests unless this is intentionally a screenshot-only pass. Then generate a new packet with `npm run site:review-packet -- --screenshot-base-url https://arcadeghosts.org --mobile --viewport-only --skip-tests --include-script --focus mobile-home` and report the new packet path.",
    "```",
    "",
    "## Codex Implementation Report",
    ...(options.reportFile
      ? ["- `reports/codex-report.md` if present.", ""]
      : options.summaryFile
        ? ["- `reports/codex-summary.md` if present.", ""]
        : ["No Codex implementation report was attached.", ""]),
    "## Likely Source Hints",
    ...(presentHints.length > 0 ? presentHints.map((entry) => `- \`${entry}\``) : ["- No matching source hints were found in this packet."]),
  ];

  await fs.writeFile(path.join(packetDir, "MOBILE-REVIEW.md"), `${lines.join("\n")}\n`, "utf8");
}

function prioritizeMobileRoutes(entries: MobileReviewIndexEntry[], focus: string) {
  const rank = (entry: MobileReviewIndexEntry) => {
    if (focus !== "all" && normalizeFocusLabel(entry.route).includes(normalizeFocusLabel(focus))) {
      return -10;
    }

    if (entry.route === "/") {
      return 0;
    }
    if (entry.route === "/work-with-me") {
      return 1;
    }
    if (entry.route === "/about") {
      return 2;
    }
    if (entry.route === "/music") {
      return 3;
    }
    if (entry.route === "/writings") {
      return 4;
    }
    return 10;
  };

  return [...entries].sort((left, right) => rank(left) - rank(right)).slice(0, 7);
}

function normalizeFocusLabel(value: string) {
  return value.replace(/^\//, "").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
}

function formatScreenshotRef(pathValue: string | undefined, status: string) {
  if (!pathValue) {
    return `missing (${status})`;
  }
  if (status !== "generated") {
    return `${pathValue} (${status})`;
  }
  return pathValue;
}

async function filterExistingPacketPaths(packetDir: string, candidates: string[]) {
  const existing: string[] = [];
  for (const candidate of candidates) {
    if (await pathExists(path.join(packetDir, candidate))) {
      existing.push(candidate);
    }
  }
  return existing;
}

async function refreshLatestCopy(packetDir: string, latestDir: string) {
  await fs.rm(latestDir, { recursive: true, force: true });
  await fs.cp(packetDir, latestDir, { recursive: true });
}

async function zipPacketDirectory(packetDir: string, zipPath: string) {
  try {
    await execFileAsync("zip", ["-qr", zipPath, path.basename(packetDir)], {
      cwd: path.dirname(packetDir),
      maxBuffer: 1024 * 1024 * 20,
    });
    return true;
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
