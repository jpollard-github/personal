import { isAdminAuthenticated } from "../../../lib/admin-auth";
import { revalidatePath } from "next/cache";
import { getGuestbookSql } from "../../../lib/guestbook";
import {
  getAdminHomeSpotlight,
  emptyHomeSpotlightQueueItem,
  normalizeHomeSpotlightHref,
  normalizeHomeSpotlightText,
  ensureHomeSpotlightTable,
  type HomeSpotlightQueueItem,
  type HomeSpotlightRecord,
} from "../../../lib/home-spotlight";

export const runtime = "nodejs";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Admin login required." }, { status: 401 });
  }

  return null;
}

function normalizeHomeSpotlight(value: unknown): HomeSpotlightRecord | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Record<string, unknown>;
  const eyebrow = normalizeHomeSpotlightText(candidate.eyebrow, 80);
  const title = normalizeHomeSpotlightText(candidate.title, 180);
  const text = normalizeHomeSpotlightText(candidate.text, 800);
  const linkLabel = normalizeHomeSpotlightText(candidate.linkLabel, 80);
  const linkHref = normalizeHomeSpotlightHref(candidate.linkHref);
  const enabled = typeof candidate.enabled === "boolean" ? candidate.enabled : false;

  if (!eyebrow || !title || !text || !linkLabel || !linkHref) {
    return null;
  }

  return {
    id: "main",
    eyebrow,
    title,
    text,
    linkLabel,
    linkHref,
    enabled,
  };
}

function normalizeHomeSpotlightQueueItem(
  value: unknown,
  index: number,
): HomeSpotlightQueueItem | null {
  const normalized = normalizeHomeSpotlight(value);

  if (!normalized) {
    return null;
  }

  return {
    ...emptyHomeSpotlightQueueItem(index),
    ...normalized,
    id:
      (typeof (value as { id?: unknown })?.id === "string" &&
      normalizeHomeSpotlightText((value as { id?: unknown }).id, 120))
        || emptyHomeSpotlightQueueItem(index).id,
    displayOrder: index,
  };
}

export async function GET() {
  const unauthorized = await requireAdmin();

  if (unauthorized) {
    return unauthorized;
  }

  try {
    return Response.json(await getAdminHomeSpotlight());
  } catch (error) {
    console.error("Admin home spotlight GET failed", error);
    return Response.json({ error: "Home spotlight is unavailable." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const unauthorized = await requireAdmin();

  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const spotlight = normalizeHomeSpotlight(body.spotlight);
    const rawQueue = Array.isArray(body.queue) ? body.queue : [];
    const queue = rawQueue
      .map((item, index) => normalizeHomeSpotlightQueueItem(item, index))
      .filter((item): item is HomeSpotlightQueueItem => Boolean(item));

    if (queue.length !== rawQueue.length) {
      return Response.json(
        {
          error:
            "Every spotlight queue item needs an eyebrow, title, text, link label, and link href before saving.",
        },
        { status: 400 },
      );
    }

    if (!spotlight) {
      return Response.json(
        { error: "Eyebrow, title, text, link label, and link href are required." },
        { status: 400 },
      );
    }

    await ensureHomeSpotlightTable();
    const sql = getGuestbookSql();

    await sql`
      INSERT INTO home_spotlight (
        id,
        eyebrow,
        title,
        body,
        link_label,
        link_href,
        enabled,
        updated_at
      )
      VALUES (
        'main',
        ${spotlight.eyebrow},
        ${spotlight.title},
        ${spotlight.text},
        ${spotlight.linkLabel},
        ${spotlight.linkHref},
        ${spotlight.enabled},
        now()
      )
      ON CONFLICT (id)
      DO UPDATE SET
        eyebrow = EXCLUDED.eyebrow,
        title = EXCLUDED.title,
        body = EXCLUDED.body,
        link_label = EXCLUDED.link_label,
        link_href = EXCLUDED.link_href,
        enabled = EXCLUDED.enabled,
        updated_at = now()
    `;

    await sql`
      DELETE FROM home_spotlight_queue
    `;

    for (let index = 0; index < queue.length; index += 1) {
      const item = queue[index];

      await sql`
        INSERT INTO home_spotlight_queue (
          id,
          eyebrow,
          title,
          body,
          link_label,
          link_href,
          enabled,
          display_order,
          updated_at
        )
        VALUES (
          ${item.id},
          ${item.eyebrow},
          ${item.title},
          ${item.text},
          ${item.linkLabel},
          ${item.linkHref},
          ${item.enabled},
          ${index},
          now()
        )
      `;
    }

    revalidatePath("/");

    return Response.json({
      ok: true,
      ...(await getAdminHomeSpotlight()),
    });
  } catch (error) {
    console.error("Admin home spotlight PUT failed", error);
    return Response.json({ error: "Home spotlight could not be saved." }, { status: 500 });
  }
}
