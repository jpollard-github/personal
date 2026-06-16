import { isAdminAuthenticated } from "../../../lib/admin-auth";
import { getGuestbookSql } from "../../../lib/guestbook";
import {
  contextRefreshVariants,
  countContextRefreshWords,
  createContextRefreshExport,
  ensureContextRefreshExportsTable,
  isContextRefreshVariant,
  normalizeContextRefreshContent,
  toContextRefreshExport,
  type ContextRefreshExportRow,
} from "../../../lib/context-refresh";

export const runtime = "nodejs";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Admin login required." }, { status: 401 });
  }

  return null;
}

export async function GET() {
  const unauthorized = await requireAdmin();

  if (unauthorized) {
    return unauthorized;
  }

  try {
    await ensureContextRefreshExportsTable();
    const sql = getGuestbookSql();
    const rows = await sql`
      SELECT
        id,
        filename,
        variant,
        redacted,
        content,
        word_count,
        created_at,
        updated_at,
        saved_at
      FROM context_refresh_exports
      ORDER BY updated_at DESC
      LIMIT 1
    `;

    return Response.json({
      export: rows.length
        ? toContextRefreshExport((rows as ContextRefreshExportRow[])[0])
        : null,
      variants: contextRefreshVariants,
    });
  } catch (error) {
    console.error("Admin context refresh GET failed", error);
    return Response.json(
      { error: "Context refresh export is unavailable." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdmin();

  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const variant =
      typeof body.variant === "string" && isContextRefreshVariant(body.variant)
        ? body.variant
        : "concise";
    const redacted = typeof body.redacted === "boolean" ? body.redacted : true;

    await ensureContextRefreshExportsTable();
    const created = await createContextRefreshExport({ variant, redacted });

    return Response.json({ ok: true, export: created });
  } catch (error) {
    console.error("Admin context refresh POST failed", error);
    return Response.json(
      { error: "Context refresh export could not be created." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  const unauthorized = await requireAdmin();

  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const id = typeof body.id === "string" ? body.id : "";
    const content = normalizeContextRefreshContent(body.content);

    if (!id) {
      return Response.json({ error: "Missing context refresh export id." }, { status: 400 });
    }

    if (!content) {
      return Response.json({ error: "Write export content before saving." }, { status: 400 });
    }

    await ensureContextRefreshExportsTable();
    const sql = getGuestbookSql();
    const rows = await sql`
      UPDATE context_refresh_exports
      SET
        content = ${content},
        word_count = ${countContextRefreshWords(content)},
        saved_at = now(),
        updated_at = now()
      WHERE id = ${id}
      RETURNING
        id,
        filename,
        variant,
        redacted,
        content,
        word_count,
        created_at,
        updated_at,
        saved_at
    `;

    if (!rows.length) {
      return Response.json(
        { error: "Context refresh export was not found." },
        { status: 404 },
      );
    }

    return Response.json({
      ok: true,
      export: toContextRefreshExport((rows as ContextRefreshExportRow[])[0]),
    });
  } catch (error) {
    console.error("Admin context refresh PUT failed", error);
    return Response.json(
      { error: "Context refresh export could not be saved." },
      { status: 500 },
    );
  }
}
