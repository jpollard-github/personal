import { getGuestbookSql } from "./guestbook";

export const projectStatuses = [
  "active",
  "paused",
  "planning",
  "shipped",
  "archived",
] as const;

export const projectDateTimeZone = "America/New_York";

export type ProjectStatus = (typeof projectStatuses)[number];

export const projectPriorityOptions = [
  { value: 1, label: "Highest - 1" },
  { value: 2, label: "High - 2" },
  { value: 3, label: "Medium - 3" },
  { value: 4, label: "Low - 4" },
  { value: 5, label: "Meh - 5" },
] as const;

export type SiteProject = {
  id: string;
  type: string;
  title: string;
  description: string;
  href: string;
  imageUrl: string;
  status: ProjectStatus;
  phase: string;
  nextAction: string;
  blockers: string;
  priority: number;
  lastUpdatedAt: string;
  includeInContextRefresh: boolean;
};

export type SiteProjectRow = {
  id: string;
  type: string;
  title: string;
  description: string;
  href: string;
  image_url: string | null;
  status: ProjectStatus;
  phase: string | null;
  next_action: string | null;
  blockers: string | null;
  priority: number | null;
  last_updated_at: string | null;
  include_in_context_refresh: boolean | null;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export const defaultProjects: SiteProject[] = [
  {
    id: "between-two-lodges",
    type: "Browser game",
    title: "Between Two Lodges",
    description:
      "A moody, original text adventure about coffee, woods, clues, dreams, and the kind of hallway that knows your name.",
    href: "/games/between-two-lodges",
    imageUrl: "",
    status: "active",
    phase: "",
    nextAction: "None",
    blockers: "",
    priority: 2,
    lastUpdatedAt: "",
    includeInContextRefresh: true,
  },
  {
    id: "codex-prompt-pack-for-vs-code",
    type: "VS Code extension",
    title: "Codex Prompt Pack for VS Code",
    description:
      "Command palette helpers that turn selections, changed files, diffs, PRs, and repo metadata into compact Codex-ready prompts.",
    href: "https://github.com/jpollard-github/codex-vs-code-extension",
    imageUrl: "",
    status: "active",
    phase: "",
    nextAction: "None",
    blockers: "",
    priority: 3,
    lastUpdatedAt: "",
    includeInContextRefresh: true,
  },
  {
    id: "softsignal",
    type: "Dating product",
    title: "SoftSignal",
    description:
      "A dating product built around emotional resonance: prompts, short signals, memory, writing, mood, and resonance scoring before photos.",
    href: "https://github.com/jpollard-github/softsignal",
    imageUrl: "",
    status: "planning",
    phase: "",
    nextAction: "None",
    blockers: "",
    priority: 1,
    lastUpdatedAt: "",
    includeInContextRefresh: true,
  },
];

export function isProjectStatus(value: string): value is ProjectStatus {
  return projectStatuses.includes(value as ProjectStatus);
}

export function normalizeProjectText(value: unknown, maxLength = 1200) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .trim()
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .slice(0, maxLength);
}

export function normalizeProjectHref(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  const candidate = value.trim();

  if (!candidate) {
    return "";
  }

  if (candidate.startsWith("/") && !candidate.startsWith("//")) {
    return candidate;
  }

  try {
    const url = new URL(candidate);

    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : "";
  } catch {
    return "";
  }
}

export function normalizeProjectDate(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  const candidate = value.trim();

  if (!candidate) {
    return "";
  }

  return /^\d{4}-\d{2}-\d{2}$/.test(candidate) ? candidate : "";
}

export function formatStoredProjectDate(value: unknown) {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    const normalized = normalizeProjectDate(value);

    if (normalized) {
      return normalized;
    }
  }

  const parsed = new Date(String(value));

  return Number.isNaN(parsed.getTime()) ? "" : formatProjectDateInTimeZone(parsed);
}

export function currentProjectDate(now = new Date()) {
  return formatProjectDateInTimeZone(now);
}

function formatProjectDateInTimeZone(value: Date) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: projectDateTimeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(value);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return year && month && day ? `${year}-${month}-${day}` : "";
}

export function resolveProjectLastUpdatedAt({
  incomingLastUpdatedAt,
  existingLastUpdatedAt,
  now = new Date(),
}: {
  incomingLastUpdatedAt: string;
  existingLastUpdatedAt?: string | null;
  now?: Date;
}) {
  const existing = formatStoredProjectDate(existingLastUpdatedAt);

  if (incomingLastUpdatedAt && incomingLastUpdatedAt !== existing) {
    return incomingLastUpdatedAt;
  }

  return currentProjectDate(now);
}

export function normalizeProjectPriority(value: unknown) {
  const numberValue =
    typeof value === "number" ? value : Number.parseInt(String(value ?? ""), 10);

  if (!Number.isFinite(numberValue)) {
    return 3;
  }

  return Math.max(1, Math.min(5, Math.round(numberValue)));
}

export function toSiteProject(row: SiteProjectRow): SiteProject {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    description: row.description,
    href: row.href,
    imageUrl: row.image_url ?? "",
    status: row.status,
    phase: row.phase ?? "",
    nextAction: row.next_action?.trim() || "None",
    blockers: row.blockers ?? "",
    priority: normalizeProjectPriority(row.priority),
    lastUpdatedAt: formatStoredProjectDate(row.last_updated_at),
    includeInContextRefresh: row.include_in_context_refresh ?? true,
  };
}

export async function ensureProjectsTable() {
  const sql = getGuestbookSql();

  await sql`
    CREATE TABLE IF NOT EXISTS site_projects (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      href TEXT NOT NULL DEFAULT '',
      image_url TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'active' CHECK (
        status IN ('active', 'paused', 'planning', 'shipped', 'archived')
      ),
      phase TEXT NOT NULL DEFAULT '',
      next_action TEXT NOT NULL DEFAULT 'None',
      blockers TEXT NOT NULL DEFAULT '',
      priority INTEGER NOT NULL DEFAULT 3,
      last_updated_at DATE,
      include_in_context_refresh BOOLEAN NOT NULL DEFAULT true,
      display_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await sql`
    ALTER TABLE site_projects
    ADD COLUMN IF NOT EXISTS include_in_context_refresh BOOLEAN NOT NULL DEFAULT true
  `;

  await sql`
    ALTER TABLE site_projects
    ADD COLUMN IF NOT EXISTS image_url TEXT NOT NULL DEFAULT ''
  `;

  await sql`
    ALTER TABLE site_projects
    ALTER COLUMN next_action SET DEFAULT 'None'
  `;

  await sql`
    ALTER TABLE site_projects
    ALTER COLUMN priority SET DEFAULT 3
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS site_projects_display_order_idx
    ON site_projects (display_order ASC)
  `;
}

export async function seedDefaultProjectsIfEmpty() {
  await ensureProjectsTable();
  const sql = getGuestbookSql();
  const countRows = await sql`
    SELECT COUNT(*)::int AS count
    FROM site_projects
  `;
  const count = Number((countRows as { count: number }[])[0]?.count ?? 0);

  if (count > 0) {
    return;
  }

  for (let index = 0; index < defaultProjects.length; index += 1) {
    const project = defaultProjects[index];

    await sql`
      INSERT INTO site_projects (
        id,
        type,
        title,
        description,
        href,
        image_url,
        status,
        phase,
        next_action,
        blockers,
        priority,
        last_updated_at,
        include_in_context_refresh,
        display_order
      )
      VALUES (
        ${project.id},
        ${project.type},
        ${project.title},
        ${project.description},
        ${project.href},
        ${project.imageUrl},
        ${project.status},
        ${project.phase},
        ${project.nextAction},
        ${project.blockers},
        ${project.priority},
        ${project.lastUpdatedAt || null},
        ${project.includeInContextRefresh},
        ${index}
      )
    `;
  }
}

export async function getPublicProjects() {
  return loadStoredPublicProjects().catch(() => defaultProjects);
}

async function loadStoredPublicProjects() {
  await ensureProjectsTable();
  const sql = getGuestbookSql();
  const rows = await sql`
    SELECT
      id,
      type,
      title,
      description,
      href,
      image_url,
      status,
      phase,
      next_action,
      blockers,
      priority,
      last_updated_at,
      include_in_context_refresh,
      display_order,
      created_at,
      updated_at
    FROM site_projects
    ORDER BY display_order ASC, priority ASC, title ASC
  `;

  const projects = (rows as SiteProjectRow[]).map(toSiteProject);

  return projects.length ? projects : defaultProjects;
}

export async function getAdminProjects() {
  await ensureProjectsTable();
  const sql = getGuestbookSql();
  const rows = await sql`
    SELECT
      id,
      type,
      title,
      description,
      href,
      image_url,
      status,
      phase,
      next_action,
      blockers,
      priority,
      last_updated_at,
      include_in_context_refresh,
      display_order,
      created_at,
      updated_at
    FROM site_projects
    ORDER BY display_order ASC, priority ASC, title ASC
  `;

  const projects = (rows as SiteProjectRow[]).map(toSiteProject);

  return projects.length ? projects : defaultProjects;
}

export async function getContextRefreshProjects() {
  const projects = await getAdminProjects();

  return projects.filter((project) => project.includeInContextRefresh);
}
