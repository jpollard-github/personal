import { randomUUID } from "crypto";
import { isAdminAuthenticated } from "../../../lib/admin-auth";
import { revalidateNowViews } from "../../../lib/admin-revalidation";
import { getGuestbookSql } from "../../../lib/guestbook";
import {
  ensureNowItemsTable,
  getAdminNowItems,
  normalizeNowText,
  toNowItem,
  type NowItem,
  type NowItemRow,
} from "../../../lib/now";

export const runtime = "nodejs";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Admin login required." }, { status: 401 });
  }

  return null;
}

function normalizeNowItem(value: unknown): NowItem | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Record<string, unknown>;
  const label = normalizeNowText(candidate.label, 80);
  const title = normalizeNowText(candidate.title, 140);
  const text = normalizeNowText(candidate.text, 1000);

  if (!label || !title || !text) {
    return null;
  }

  return {
    id: normalizeNowText(candidate.id, 120) || randomUUID(),
    label,
    title,
    text,
  };
}

export async function GET() {
  const unauthorized = await requireAdmin();

  if (unauthorized) {
    return unauthorized;
  }

  try {
    return Response.json({ items: await getAdminNowItems() });
  } catch (error) {
    console.error("Admin Now GET failed", error);
    return Response.json({ error: "Now items are unavailable." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const unauthorized = await requireAdmin();

  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const rawItems = Array.isArray(body.items) ? body.items : [];
    const items = rawItems
      .map(normalizeNowItem)
      .filter((item): item is NowItem => Boolean(item));

    if (items.length !== rawItems.length) {
      return Response.json(
        { error: "Every Now card needs a label, title, and text before saving." },
        { status: 400 },
      );
    }

    if (!items.length) {
      return Response.json(
        { error: "Add at least one Now card before saving." },
        { status: 400 },
      );
    }

    if (new Set(items.map((item) => item.id)).size !== items.length) {
      return Response.json(
        { error: "Now card ids must be unique before saving." },
        { status: 400 },
      );
    }

    await ensureNowItemsTable();
    const sql = getGuestbookSql();
    const existingRows = await sql`
      SELECT id
      FROM site_now_items
    `;
    const savedIds = new Set(items.map((item) => item.id));

    for (let index = 0; index < items.length; index += 1) {
      const item = items[index];

      await sql`
        INSERT INTO site_now_items (
          id,
          label,
          title,
          body,
          display_order
        )
        VALUES (
          ${item.id},
          ${item.label},
          ${item.title},
          ${item.text},
          ${index}
        )
        ON CONFLICT (id)
        DO UPDATE SET
          label = EXCLUDED.label,
          title = EXCLUDED.title,
          body = EXCLUDED.body,
          display_order = EXCLUDED.display_order,
          updated_at = now()
      `;
    }

    for (const row of existingRows as { id: string }[]) {
      if (!savedIds.has(row.id)) {
        await sql`
          DELETE FROM site_now_items
          WHERE id = ${row.id}
        `;
      }
    }

    revalidateNowViews();

    const rows = await sql`
      SELECT
        id,
        label,
        title,
        body,
        display_order,
        created_at,
        updated_at
      FROM site_now_items
      ORDER BY display_order ASC, title ASC
    `;

    return Response.json({
      ok: true,
      items: (rows as NowItemRow[]).map(toNowItem),
    });
  } catch (error) {
    console.error("Admin Now PUT failed", error);
    return Response.json({ error: "Now cards could not be saved." }, { status: 500 });
  }
}
