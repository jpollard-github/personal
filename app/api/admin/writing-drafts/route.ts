import { readdir } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "crypto";
import {
  jsonError,
  parseJsonBody,
  requireAdminJson,
  routeFailure,
} from "../../../lib/admin-route";
import { getGuestbookSql } from "../../../lib/guestbook";
import {
  isWritingDraftStatus,
  normalizeWritingDraftSlug,
  normalizeWritingDraftText,
  toWritingDraft,
  type WritingDraft,
  type WritingDraftRow,
} from "../../../lib/writing-drafts";
import {
  ensureWritingDraftsTable,
  getAdminWritingDrafts,
} from "../../../lib/writing-drafts-store";

export const runtime = "nodejs";

async function getExistingMarkdownSlugs() {
  const directory = path.join(process.cwd(), "public", "writings");
  const files = await readdir(directory).catch(() => []);

  return files
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/i, ""));
}

async function buildDraftsResponse() {
  return {
    drafts: await getAdminWritingDrafts(),
    markdownSlugs: await getExistingMarkdownSlugs(),
  };
}

function normalizeWritingDraft(value: unknown): WritingDraft | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Record<string, unknown>;
  const title = normalizeWritingDraftText(candidate.title, 180);
  const body = normalizeWritingDraftText(candidate.body, 16000);

  if (!title || !body) {
    return null;
  }

  return {
    id: normalizeWritingDraftText(candidate.id, 120) || randomUUID(),
    title,
    slug: normalizeWritingDraftSlug(candidate.slug || candidate.title),
    summary: normalizeWritingDraftText(candidate.summary, 400),
    body,
    notes: normalizeWritingDraftText(candidate.notes, 2000),
    status:
      typeof candidate.status === "string" && isWritingDraftStatus(candidate.status)
        ? candidate.status
        : "draft",
    createdAt: "",
    updatedAt: "",
  };
}

export async function GET() {
  const unauthorized = await requireAdminJson();

  if (unauthorized) {
    return unauthorized;
  }

  try {
    return Response.json(await buildDraftsResponse());
  } catch (error) {
    return routeFailure("Admin writing drafts GET failed", "Writing drafts are unavailable.", error);
  }
}

export async function PATCH(request: Request) {
  const unauthorized = await requireAdminJson();

  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = await parseJsonBody(request);
    const draft = normalizeWritingDraft(body.draft);

    if (!draft) {
      return jsonError("Every writing draft needs a title and body before saving.", 400);
    }

    await ensureWritingDraftsTable();
    const sql = getGuestbookSql();
    const rows = await sql`
      INSERT INTO writing_drafts (
        id,
        title,
        slug,
        summary,
        body,
        notes,
        status
      )
      VALUES (
        ${draft.id},
        ${draft.title},
        ${draft.slug},
        ${draft.summary},
        ${draft.body},
        ${draft.notes},
        ${draft.status}
      )
      ON CONFLICT (id)
      DO UPDATE SET
        title = EXCLUDED.title,
        slug = EXCLUDED.slug,
        summary = EXCLUDED.summary,
        body = EXCLUDED.body,
        notes = EXCLUDED.notes,
        status = EXCLUDED.status,
        updated_at = now()
      RETURNING
        id,
        title,
        slug,
        summary,
        body,
        notes,
        status,
        created_at,
        updated_at
    `;

    return Response.json({
      ok: true,
      draft: toWritingDraft((rows as WritingDraftRow[])[0]),
      ...(await buildDraftsResponse()),
    });
  } catch (error) {
    return routeFailure(
      "Admin writing drafts PATCH failed",
      "Writing draft could not be saved.",
      error,
    );
  }
}

export async function DELETE(request: Request) {
  const unauthorized = await requireAdminJson();

  if (unauthorized) {
    return unauthorized;
  }

  try {
    const body = await parseJsonBody(request);
    const id = normalizeWritingDraftText(body.id, 120);

    if (!id) {
      return jsonError("Writing draft id is required.", 400);
    }

    await ensureWritingDraftsTable();
    const sql = getGuestbookSql();
    const rows = await sql`
      DELETE FROM writing_drafts
      WHERE id = ${id}
      RETURNING id
    `;

    if (!rows.length) {
      return jsonError("Writing draft was not found.", 404);
    }

    return Response.json({
      ok: true,
      ...(await buildDraftsResponse()),
    });
  } catch (error) {
    return routeFailure(
      "Admin writing drafts DELETE failed",
      "Writing draft could not be deleted.",
      error,
    );
  }
}
