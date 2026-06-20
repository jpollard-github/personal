import { randomUUID } from "crypto";
import {
  jsonError,
  parseJsonBody,
  requireAdminJson,
  routeFailure,
} from "../../../lib/admin-route";
import { getGuestbookSql } from "../../../lib/guestbook";
import {
  ensureProjectsTable,
  getAdminProjects,
  isProjectStatus,
  normalizeProjectDate,
  normalizeProjectHref,
  normalizeProjectPriority,
  normalizeProjectText,
  toSiteProject,
  type SiteProject,
  type SiteProjectRow,
} from "../../../lib/projects";

export const runtime = "nodejs";

function normalizeProject(value: unknown): SiteProject | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Record<string, unknown>;
  const title = normalizeProjectText(candidate.title, 120);
  const type = normalizeProjectText(candidate.type, 120);
  const description = normalizeProjectText(candidate.description, 1200);
  const href = normalizeProjectHref(candidate.href);
  const imageUrl = normalizeProjectHref(candidate.imageUrl);
  const status =
    typeof candidate.status === "string" && isProjectStatus(candidate.status)
      ? candidate.status
      : "active";

  if (!title || !type || !description) {
    return null;
  }

  return {
    id: normalizeProjectText(candidate.id, 120) || randomUUID(),
    type,
    title,
    description,
    href,
    imageUrl,
    status,
    phase: normalizeProjectText(candidate.phase, 160),
    nextAction: normalizeProjectText(candidate.nextAction, 240) || "None",
    blockers: normalizeProjectText(candidate.blockers, 1200),
    priority: normalizeProjectPriority(candidate.priority),
    lastUpdatedAt: normalizeProjectDate(candidate.lastUpdatedAt),
    includeInContextRefresh:
      typeof candidate.includeInContextRefresh === "boolean"
        ? candidate.includeInContextRefresh
        : true,
  };
}

export async function GET() {
  const unauthorized = await requireAdminJson();

  if (unauthorized) {
    return unauthorized;
  }

  try {
    return Response.json({ projects: await getAdminProjects() });
  } catch (error) {
    return routeFailure("Admin projects GET failed", "Projects are unavailable.", error);
  }
}

export async function PUT(request: Request) {
  const unauthorized = await requireAdminJson();

  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = await parseJsonBody(request);
    const rawProjects = Array.isArray(body.projects) ? body.projects : [];
    const projects = rawProjects
      .map(normalizeProject)
      .filter((project): project is SiteProject => Boolean(project));

    if (projects.length !== rawProjects.length) {
      return jsonError("Every project needs a type, title, and description before saving.", 400);
    }

    if (!projects.length) {
      return jsonError("Add at least one project before saving.", 400);
    }

    if (new Set(projects.map((project) => project.id)).size !== projects.length) {
      return jsonError("Project ids must be unique before saving.", 400);
    }

    await ensureProjectsTable();
    const sql = getGuestbookSql();
    const existingRows = await sql`
      SELECT id
      FROM site_projects
    `;
    const savedIds = new Set(projects.map((project) => project.id));

    for (let index = 0; index < projects.length; index += 1) {
      const project = projects[index];

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
        ON CONFLICT (id)
        DO UPDATE SET
          type = EXCLUDED.type,
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          href = EXCLUDED.href,
          image_url = EXCLUDED.image_url,
          status = EXCLUDED.status,
          phase = EXCLUDED.phase,
          next_action = EXCLUDED.next_action,
          blockers = EXCLUDED.blockers,
          priority = EXCLUDED.priority,
          last_updated_at = EXCLUDED.last_updated_at,
          include_in_context_refresh = EXCLUDED.include_in_context_refresh,
          display_order = EXCLUDED.display_order,
          updated_at = now()
      `;
    }

    for (const row of existingRows as { id: string }[]) {
      if (!savedIds.has(row.id)) {
        await sql`
          DELETE FROM site_projects
          WHERE id = ${row.id}
        `;
      }
    }

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

    return Response.json({
      ok: true,
      projects: (rows as SiteProjectRow[]).map(toSiteProject),
    });
  } catch (error) {
    return routeFailure("Admin projects PUT failed", "Projects could not be saved.", error);
  }
}
