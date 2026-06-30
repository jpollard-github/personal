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

const desktopRoutes = [
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
};

type PacketOptions = {
  includePaths: string[];
  note?: string;
  summaryFile?: string;
  screenshotBaseUrl?: string;
  skipTests: boolean;
  skipScreenshots: boolean;
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
  "persona-results",
  "test-results",
];

async function main() {
  const options = parseArgs(process.argv.slice(2));
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

  await copyEntries(sourceEntries, "source", packetDir, context.copiedSources, context.missingOptionalPaths);
  await copyEntries(docsEntries, "docs", packetDir, context.copiedDocs, context.missingOptionalPaths, "docs");
  await copyEntries(testsEntries, "tests", packetDir, context.copiedTests, context.missingOptionalPaths, "tests");
  await copyEntries(
    publicContentEntries,
    "public-content",
    packetDir,
    context.copiedPublicContent,
    context.missingOptionalPaths,
    "public",
  );
  await copyEntries(reportEntries, "reports", packetDir, [], context.missingOptionalPaths);

  if (options.summaryFile) {
    const summarySource = path.resolve(repoRoot, options.summaryFile);
    const summaryExists = await pathExists(summarySource);
    if (summaryExists) {
      await copyFileToPacket(summarySource, path.join(packetDir, "reports", "codex-summary.md"));
    } else {
      context.missingOptionalPaths.push(options.summaryFile);
    }
  }

  await copyIncludedPaths(options.includePaths, packetDir, context);

  const checkResults = options.skipTests ? [] : await runChecks();
  await writeChecksReport(path.join(packetDir, "reports", "checks.txt"), checkResults, context);

  const screenshotResult = options.skipScreenshots
    ? { generated: [], skippedReason: "Skipped via --skip-screenshots." }
    : await generateScreenshots(packetDir, options);

  if (screenshotResult.generated.length > 0) {
    await ensureDir(path.join(packetDir, "screenshots"));
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

  await refreshLatestCopy(packetDir, latestDir);
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
    skipTests: false,
    skipScreenshots: false,
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

    if (arg === "--screenshot-base-url" && argv[index + 1]) {
      options.screenshotBaseUrl = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--skip-tests") {
      options.skipTests = true;
      continue;
    }

    if (arg === "--skip-screenshots") {
      options.skipScreenshots = true;
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
  }
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
    };
  }

  let localServer: Awaited<ReturnType<typeof resolveBaseUrlForScreenshots>>;
  try {
    localServer = await resolveBaseUrlForScreenshots(options);
  } catch (error) {
    return {
      generated: [],
      skippedReason: `Screenshot setup was skipped: ${(error as Error).message}`,
    };
  }
  if (!localServer.baseUrl) {
    return {
      generated: [],
      skippedReason: localServer.reason ?? "No base URL was available for screenshots.",
    };
  }

  const screenshotsDir = path.join(packetDir, "screenshots");
  await ensureDir(screenshotsDir);

  const routeOrder = options.mobile ? ["mobile", "desktop"] : ["desktop", "mobile"];
  const generated: string[] = [];
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
      for (const route of desktopRoutes) {
        const fileName = `${mode}-${routeToSlug(route)}.jpg`;
        const filePath = path.join(screenshotsDir, fileName);
        try {
          await page.goto(new URL(route, localServer.baseUrl).toString(), {
            waitUntil: "domcontentloaded",
            timeout: 45000,
          });
          try {
            await page.waitForLoadState("networkidle", { timeout: 5000 });
          } catch {
            // Some pages may keep background work alive; a screenshot is still useful.
          }
          await page.screenshot({
            path: filePath,
            fullPage: true,
            quality: 70,
            type: "jpeg",
          });
          generated.push(path.relative(packetDir, filePath));
        } catch (error) {
          const errorFile = path.join(
            packetDir,
            "reports",
            `${mode}-${routeToSlug(route)}-screenshot-error.txt`,
          );
          await fs.writeFile(errorFile, String(error), "utf8");
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
    };
  }

  return {
    generated,
    baseUrl: localServer.baseUrl,
  };
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
  }
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
    `- screenshot base URL: ${input.options.screenshotBaseUrl ?? process.env.SITE_REVIEW_BASE_URL ?? "(none)"}`,
    `- include paths: ${input.options.includePaths.length > 0 ? input.options.includePaths.join(", ") : "(none)"}`,
    `- summary file: ${input.options.summaryFile ?? "(none)"}`,
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
  const mobileBias = input.options.mobile
    ? "This packet was generated in mobile review mode, so start with the iPhone-style screenshots and tighten the first 1-2 screens before broad desktop polish."
    : "Start with the homepage and Work With Me flow, then use the screenshots and copied source/docs to trace any friction back to the implementation and content decisions.";

  const summaryLink = input.options.summaryFile ? "- `reports/codex-summary.md` if present." : "";

  const reviewLines = [
    "# ArcadeGhosts Site Review Packet",
    "",
    "## Start Here",
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

  await fs.writeFile(path.join(input.packetDir, "REVIEW.md"), `${reviewLines.join("\n")}\n`, "utf8");
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
