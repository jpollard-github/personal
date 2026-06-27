import {
  jsonError,
  parseJsonBody,
  requireAdminJson,
  routeFailure,
} from "../../../lib/admin-route";
import {
  ensureContentInboxTable,
  getAdminContentInboxItems,
} from "../../../lib/content-inbox";
import {
  emptyContentInboxItem,
  isContentInboxBucket,
  isContentInboxSource,
  isContentInboxStatus,
  normalizeInboxText,
  toContentInboxItem,
  type ContentInboxRow,
} from "../../../lib/content-inbox-shared";
import { getGuestbookSql } from "../../../lib/guestbook";

export const runtime = "nodejs";

function normalizeContentInboxItem(value: unknown) {
  const empty = emptyContentInboxItem();

  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Record<string, unknown>;
  const content = normalizeInboxText(candidate.content, 5000);

  if (!content) {
    return null;
  }

  return {
    id: normalizeInboxText(candidate.id, 120) || empty.id,
    title: normalizeInboxText(candidate.title, 140),
    content,
    source:
      typeof candidate.source === "string" && isContentInboxSource(candidate.source)
        ? candidate.source
        : empty.source,
    bucket:
      typeof candidate.bucket === "string" && isContentInboxBucket(candidate.bucket)
        ? candidate.bucket
        : empty.bucket,
    notes: normalizeInboxText(candidate.notes, 1600),
    status:
      typeof candidate.status === "string" && isContentInboxStatus(candidate.status)
        ? candidate.status
        : empty.status,
  };
}

export async function GET() {
  const unauthorized = await requireAdminJson();

  if (unauthorized) {
    return unauthorized;
  }

  try {
    return Response.json({ items: await getAdminContentInboxItems() });
  } catch (error) {
    return routeFailure("Admin content inbox GET failed", "Content inbox is unavailable.", error);
  }
}

export async function POST(request: Request) {
  const unauthorized = await requireAdminJson();

  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = await parseJsonBody(request);
    const item = normalizeContentInboxItem(body.item);

    if (!item) {
      return jsonError("Content is required before saving to the inbox.", 400);
    }

    await ensureContentInboxTable();
    const sql = getGuestbookSql();
    const rows = await sql`
      INSERT INTO content_inbox_items (
        id,
        title,
        content,
        source,
        bucket,
        notes,
        status
      )
      VALUES (
        ${item.id},
        ${item.title},
        ${item.content},
        ${item.source},
        ${item.bucket},
        ${item.notes},
        ${item.status}
      )
      RETURNING
        id,
        title,
        content,
        source,
        bucket,
        notes,
        status,
        created_at,
        updated_at
    `;

    return Response.json({
      ok: true,
      item: toContentInboxItem((rows as ContentInboxRow[])[0]),
      items: await getAdminContentInboxItems(),
    });
  } catch (error) {
    return routeFailure("Admin content inbox POST failed", "Content inbox item could not be created.", error);
  }
}

export async function PUT(request: Request) {
  const unauthorized = await requireAdminJson();

  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = await parseJsonBody(request);
    const item = normalizeContentInboxItem(body.item);

    if (!item) {
      return jsonError("Content is required before saving to the inbox.", 400);
    }

    await ensureContentInboxTable();
    const sql = getGuestbookSql();
    const rows = await sql`
      UPDATE content_inbox_items
      SET
        title = ${item.title},
        content = ${item.content},
        source = ${item.source},
        bucket = ${item.bucket},
        notes = ${item.notes},
        status = ${item.status},
        updated_at = now()
      WHERE id = ${item.id}
      RETURNING
        id,
        title,
        content,
        source,
        bucket,
        notes,
        status,
        created_at,
        updated_at
    `;

    if (!rows.length) {
      return jsonError("Inbox item was not found.", 404);
    }

    return Response.json({
      ok: true,
      item: toContentInboxItem((rows as ContentInboxRow[])[0]),
      items: await getAdminContentInboxItems(),
    });
  } catch (error) {
    return routeFailure("Admin content inbox PUT failed", "Content inbox item could not be updated.", error);
  }
}

export async function PATCH(request: Request) {
  const unauthorized = await requireAdminJson();

  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = await parseJsonBody(request);
    const id = normalizeInboxText(body.id, 120);
    const status =
      typeof body.status === "string" && isContentInboxStatus(body.status)
        ? body.status
        : "";

    if (!id || !status) {
      return jsonError("Inbox item id and status are required.", 400);
    }

    await ensureContentInboxTable();
    const sql = getGuestbookSql();
    const rows = await sql`
      UPDATE content_inbox_items
      SET status = ${status}, updated_at = now()
      WHERE id = ${id}
      RETURNING id
    `;

    if (!rows.length) {
      return jsonError("Inbox item was not found.", 404);
    }

    return Response.json({
      ok: true,
      items: await getAdminContentInboxItems(),
    });
  } catch (error) {
    return routeFailure("Admin content inbox PATCH failed", "Content inbox item could not be updated.", error);
  }
}

export async function DELETE(request: Request) {
  const unauthorized = await requireAdminJson();

  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = await parseJsonBody(request);
    const id = normalizeInboxText(body.id, 120);

    if (!id) {
      return jsonError("Inbox item id is required.", 400);
    }

    await ensureContentInboxTable();
    const sql = getGuestbookSql();
    const rows = await sql`
      DELETE FROM content_inbox_items
      WHERE id = ${id}
      RETURNING id
    `;

    if (!rows.length) {
      return jsonError("Inbox item was not found.", 404);
    }

    return Response.json({
      ok: true,
      items: await getAdminContentInboxItems(),
    });
  } catch (error) {
    return routeFailure("Admin content inbox DELETE failed", "Content inbox item could not be deleted.", error);
  }
}
