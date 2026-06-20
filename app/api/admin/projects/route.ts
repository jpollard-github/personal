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
  seedDefaultProjectsIfEmpty,
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

async function selectProjectRows() {
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

  return rows as SiteProjectRow[];
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

export async function PATCH(request: Request) {
  const unauthorized = await requireAdminJson();

  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = await parseJsonBody(request);

    if (Array.isArray(body.orderedIds)) {
      await seedDefaultProjectsIfEmpty();
      const orderedIds = body.orderedIds
        .filter((value): value is string => typeof value === "string")
        .map((value) => normalizeProjectText(value, 120))
        .filter(Boolean);

      if (!orderedIds.length) {
        return jsonError("Project order is required.", 400);
      }

      if (new Set(orderedIds).size !== orderedIds.length) {
        return jsonError("Project order must not contain duplicate ids.", 400);
      }

      const sql = getGuestbookSql();
      const existingRows = await sql`
        SELECT id
        FROM site_projects
        ORDER BY display_order ASC, priority ASC, title ASC
      `;
      const existingIds = (existingRows as { id: string }[]).map((row) => row.id);

      if (
        existingIds.length !== orderedIds.length ||
        existingIds.some((id) => !orderedIds.includes(id))
      ) {
        return jsonError("Project order does not match the saved project list.", 400);
      }

      for (let index = 0; index < orderedIds.length; index += 1) {
        await sql`
          UPDATE site_projects
          SET display_order = ${index}, updated_at = now()
          WHERE id = ${orderedIds[index]}
        `;
      }

      return Response.json({
        ok: true,
        projects: (await selectProjectRows()).map(toSiteProject),
      });
    }

    const project = normalizeProject(body.project);

    if (!project) {
      return jsonError("Type, title, and description are required before saving.", 400);
    }

    await seedDefaultProjectsIfEmpty();
    const sql = getGuestbookSql();
    const existingRows = await sql`
      SELECT display_order
      FROM site_projects
      WHERE id = ${project.id}
      LIMIT 1
    `;
    const existingOrder = (existingRows as { display_order: number }[])[0]?.display_order;
    let displayOrder = existingOrder;

    if (displayOrder === undefined) {
      const countRows = await sql`
        SELECT COUNT(*)::int AS count
        FROM site_projects
      `;
      displayOrder = Number((countRows as { count: number }[])[0]?.count ?? 0);
    }

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
        ${displayOrder}
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
        updated_at = now()
    `;

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
      WHERE id = ${project.id}
      LIMIT 1
    `;
    const savedProject = (rows as SiteProjectRow[]).map(toSiteProject)[0];

    return Response.json({
      ok: true,
      project: savedProject,
      projects: (await selectProjectRows()).map(toSiteProject),
    });
  } catch (error) {
    return routeFailure("Admin projects PATCH failed", "Project could not be saved.", error);
  }
}

export async function DELETE(request: Request) {
  const unauthorized = await requireAdminJson();

  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = await parseJsonBody(request);
    const id = normalizeProjectText(body.id, 120);

    if (!id) {
      return jsonError("Project id is required.", 400);
    }

    await seedDefaultProjectsIfEmpty();
    const sql = getGuestbookSql();
    const countRows = await sql`
      SELECT COUNT(*)::int AS count
      FROM site_projects
    `;
    const savedCount = Number((countRows as { count: number }[])[0]?.count ?? 0);

    if (savedCount <= 1) {
      return jsonError("Keep at least one project in the list.", 400);
    }

    await sql`
      DELETE FROM site_projects
      WHERE id = ${id}
    `;

    const remainingRows = await selectProjectRows();

    for (let index = 0; index < remainingRows.length; index += 1) {
      await sql`
        UPDATE site_projects
        SET display_order = ${index}, updated_at = now()
        WHERE id = ${remainingRows[index].id}
      `;
    }

    return Response.json({
      ok: true,
      projects: (await selectProjectRows()).map(toSiteProject),
    });
  } catch (error) {
    return routeFailure("Admin projects DELETE failed", "Project could not be deleted.", error);
  }
}
