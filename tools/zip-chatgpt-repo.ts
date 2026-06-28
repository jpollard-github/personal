import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";

const execFileAsync = promisify(execFile);

const repoRoot = process.cwd();
const outputName = "personal-chatgpt-share.zip";
const outputPath = path.join(os.homedir(), outputName);

const excludes = [
  "node_modules/*",
  ".next/*",
  ".git/*",
  "test-results/*",
  "playwright-report/*",
  "out/*",
  "dist/*",
  ".vercel/*",
  ".env*",
  "*.log",
  ".DS_Store",
  "**/.DS_Store",
  "public/images/*",
  "merch/**/exports/*",
];

async function removeExistingArchive() {
  try {
    await fs.unlink(outputPath);
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code !== "ENOENT") {
      throw error;
    }
  }
}

async function main() {
  await removeExistingArchive();

  const args = ["-rq", outputPath, ".", "-x", ...excludes];
  const { stdout, stderr } = await execFileAsync("zip", args, {
    cwd: repoRoot,
    maxBuffer: 1024 * 1024 * 20,
  });

  if (stdout.trim()) {
    console.log(stdout.trim());
  }

  if (stderr.trim()) {
    console.error(stderr.trim());
  }

  const stats = await fs.stat(outputPath);
  console.log(
    `Created ${outputPath} (${Math.round((stats.size / (1024 * 1024)) * 10) / 10} MB)`,
  );
  console.log("Excluded:");
  for (const pattern of excludes) {
    console.log(`- ${pattern}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
