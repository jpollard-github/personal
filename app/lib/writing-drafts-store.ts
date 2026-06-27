import { getGuestbookSql } from "./guestbook";
import { toWritingDraft, type WritingDraftRow } from "./writing-drafts";

export async function ensureWritingDraftsTable() {
  const sql = getGuestbookSql();

  await sql`
    CREATE TABLE IF NOT EXISTS writing_drafts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL DEFAULT '',
      summary TEXT NOT NULL DEFAULT '',
      body TEXT NOT NULL,
      notes TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'draft' CHECK (
        status IN ('draft', 'shaping', 'ready', 'archived')
      ),
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS writing_drafts_status_updated_at_idx
    ON writing_drafts (status ASC, updated_at DESC)
  `;
}

export async function getAdminWritingDrafts() {
  await ensureWritingDraftsTable();
  const sql = getGuestbookSql();
  const rows = await sql`
    SELECT
      id,
      title,
      slug,
      summary,
      body,
      notes,
      status,
      created_at,
      updated_at
    FROM writing_drafts
    ORDER BY
      CASE status
        WHEN 'draft' THEN 0
        WHEN 'shaping' THEN 1
        WHEN 'ready' THEN 2
        ELSE 3
      END,
      updated_at DESC
  `;

  return (rows as WritingDraftRow[]).map(toWritingDraft);
}
