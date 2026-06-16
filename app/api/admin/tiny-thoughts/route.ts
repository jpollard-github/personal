import { randomUUID } from "crypto";
import { isAdminAuthenticated } from "../../../lib/admin-auth";
import { deleteTinyThoughtBlobs } from "../../../lib/blob";
import { getGuestbookSql } from "../../../lib/guestbook";
import {
  countWords,
  ensureTinyThoughtsTable,
  isTinyThoughtCategory,
  isTinyThoughtInspiredByCategory,
  normalizeTinyThoughtAttachments,
  normalizeTinyThoughtText,
  normalizeTinyThoughtUrl,
  toTinyThought,
  type TinyThoughtAttachment,
  type TinyThoughtRow,
} from "../../../lib/tiny-thoughts";

export const runtime = "nodejs";

const maxWords = 200;
const maxInspiredByLength = 240;

function isLikelyBlobUrl(value: string) {
  try {
    return new URL(value).hostname.endsWith(".blob.vercel-storage.com");
  } catch {
    return false;
  }
}

function imageUrls(attachments: TinyThoughtAttachment[]) {
  return attachments
    .filter((attachment): attachment is Extract<TinyThoughtAttachment, { type: "image" }> =>
      attachment.type === "image",
    )
    .map((attachment) => attachment.url)
    .filter(isLikelyBlobUrl);
}

async function deleteBlobImages(urls: string[]) {
  const uniqueUrls = Array.from(new Set(urls));

  if (!uniqueUrls.length) {
    return;
  }

  try {
    await deleteTinyThoughtBlobs(uniqueUrls);
  } catch (error) {
    console.error("Tiny Thoughts Blob cleanup failed", error);
  }
}

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "Admin login required." }, { status: 401 });
  }

  return null;
}

function getThoughtPayload(body: Record<string, unknown>) {
  const categoryValue =
    typeof body.category === "string" && isTinyThoughtCategory(body.category)
      ? body.category
      : "other";
  const inspiredByCategoryValue =
    typeof body.inspiredByCategory === "string" &&
    isTinyThoughtInspiredByCategory(body.inspiredByCategory)
      ? body.inspiredByCategory
      : "other";
  const content = normalizeTinyThoughtText(body.content);
  const inspiredBy = normalizeTinyThoughtText(body.inspiredBy);
  const legacyImageUrl = normalizeTinyThoughtUrl(body.imageUrl);
  const attachments = normalizeTinyThoughtAttachments(body.attachments);
  const hasImageAttachment = attachments.some((attachment) => attachment.type === "image");

  if (legacyImageUrl && !hasImageAttachment) {
    attachments.unshift({ type: "image", url: legacyImageUrl });
  }

  const imageUrl =
    attachments.find((attachment): attachment is Extract<TinyThoughtAttachment, { type: "image" }> =>
      attachment.type === "image",
    )?.url ?? "";
  const wordCount = countWords(content);

  return {
    category: categoryValue,
    content,
    imageUrl,
    attachments,
    inspiredByCategory: inspiredByCategoryValue,
    inspiredBy,
    wordCount,
  };
}

function validateThought(content: string, wordCount: number, inspiredBy: string) {
  if (!content) {
    return "Write a tiny thought before saving.";
  }

  if (wordCount > maxWords) {
    return `Tiny Thoughts should be ${maxWords} words or fewer. This one is ${wordCount}.`;
  }

  if (inspiredBy.length > maxInspiredByLength) {
    return `Inspired by should be ${maxInspiredByLength} characters or fewer.`;
  }

  return "";
}

export async function GET() {
  const unauthorized = await requireAdmin();

  if (unauthorized) {
    return unauthorized;
  }

  try {
    await ensureTinyThoughtsTable();
    const sql = getGuestbookSql();
    const rows = await sql`
      SELECT
        id,
        category,
        content,
        image_url,
        attachments,
        inspired_by_category,
        inspired_by,
        created_at,
        updated_at
      FROM tiny_thoughts
      ORDER BY created_at DESC
      LIMIT 100
    `;

    return Response.json({
      thoughts: (rows as TinyThoughtRow[]).map(toTinyThought),
    });
  } catch (error) {
    console.error("Admin tiny thoughts GET failed", error);
    return Response.json(
      { error: "Tiny thoughts are unavailable." },
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
    const payload = getThoughtPayload(body);
    const error = validateThought(payload.content, payload.wordCount, payload.inspiredBy);

    if (error) {
      return Response.json({ error }, { status: 400 });
    }

    await ensureTinyThoughtsTable();
    const sql = getGuestbookSql();
    const rows = await sql`
      INSERT INTO tiny_thoughts (
        id,
        category,
        content,
        image_url,
        attachments,
        inspired_by_category,
        inspired_by
      )
      VALUES (
        ${randomUUID()},
        ${payload.category},
        ${payload.content},
        ${payload.imageUrl || null},
        ${JSON.stringify(payload.attachments)}::jsonb,
        ${payload.inspiredByCategory},
        ${payload.inspiredBy}
      )
      RETURNING
        id,
        category,
        content,
        image_url,
        attachments,
        inspired_by_category,
        inspired_by,
        created_at,
        updated_at
    `;

    return Response.json({
      ok: true,
      thought: toTinyThought((rows as TinyThoughtRow[])[0]),
    });
  } catch (error) {
    console.error("Admin tiny thoughts POST failed", error);
    return Response.json(
      { error: "Tiny thought could not be saved." },
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
    const payload = getThoughtPayload(body);
    const error = validateThought(payload.content, payload.wordCount, payload.inspiredBy);

    if (!id) {
      return Response.json({ error: "Missing tiny thought id." }, { status: 400 });
    }

    if (error) {
      return Response.json({ error }, { status: 400 });
    }

    await ensureTinyThoughtsTable();
    const sql = getGuestbookSql();
    const oldRows = await sql`
      SELECT
        id,
        category,
        content,
        image_url,
        attachments,
        inspired_by_category,
        inspired_by,
        created_at,
        updated_at
      FROM tiny_thoughts
      WHERE id = ${id}
      LIMIT 1
    `;

    if (!oldRows.length) {
      return Response.json({ error: "Tiny thought was not found." }, { status: 404 });
    }

    const oldThought = toTinyThought((oldRows as TinyThoughtRow[])[0]);
    const rows = await sql`
      UPDATE tiny_thoughts
      SET
        category = ${payload.category},
        content = ${payload.content},
        image_url = ${payload.imageUrl || null},
        attachments = ${JSON.stringify(payload.attachments)}::jsonb,
        inspired_by_category = ${payload.inspiredByCategory},
        inspired_by = ${payload.inspiredBy},
        updated_at = now()
      WHERE id = ${id}
      RETURNING
        id,
        category,
        content,
        image_url,
        attachments,
        inspired_by_category,
        inspired_by,
        created_at,
        updated_at
    `;

    if (!rows.length) {
      return Response.json({ error: "Tiny thought was not found." }, { status: 404 });
    }

    const savedThought = toTinyThought((rows as TinyThoughtRow[])[0]);
    const nextImageUrls = new Set(imageUrls(payload.attachments));
    const removedImageUrls = imageUrls(oldThought.attachments).filter(
      (url) => !nextImageUrls.has(url),
    );

    await deleteBlobImages(removedImageUrls);

    return Response.json({
      ok: true,
      thought: savedThought,
    });
  } catch (error) {
    console.error("Admin tiny thoughts PUT failed", error);
    return Response.json(
      { error: "Tiny thought could not be updated." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const unauthorized = await requireAdmin();

  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const id = typeof body.id === "string" ? body.id : "";

    if (!id) {
      return Response.json({ error: "Missing tiny thought id." }, { status: 400 });
    }

    await ensureTinyThoughtsTable();
    const sql = getGuestbookSql();
    const rows = await sql`
      DELETE FROM tiny_thoughts
      WHERE id = ${id}
      RETURNING
        id,
        category,
        content,
        image_url,
        attachments,
        inspired_by_category,
        inspired_by,
        created_at,
        updated_at
    `;

    if (!rows.length) {
      return Response.json({ error: "Tiny thought was not found." }, { status: 404 });
    }

    const deletedThought = toTinyThought((rows as TinyThoughtRow[])[0]);
    await deleteBlobImages(imageUrls(deletedThought.attachments));

    return Response.json({
      ok: true,
      thought: deletedThought,
      deleted: true,
    });
  } catch (error) {
    console.error("Admin tiny thoughts DELETE failed", error);
    return Response.json(
      { error: "Tiny thought could not be deleted." },
      { status: 500 },
    );
  }
}
