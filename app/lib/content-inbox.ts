import { getGuestbookSql } from "./guestbook";
import { toContentInboxItem } from "./content-inbox-shared";
export {
  contentInboxBuckets,
  contentInboxSources,
  contentInboxStatuses,
  emptyContentInboxItem,
  isContentInboxBucket,
  isContentInboxSource,
  isContentInboxStatus,
  normalizeInboxText,
  toContentInboxItem,
  type ContentInboxBucket,
  type ContentInboxItem,
  type ContentInboxRow,
  type ContentInboxSource,
  type ContentInboxStatus,
} from "./content-inbox-shared";
import type { ContentInboxRow } from "./content-inbox-shared";

export async function ensureContentInboxTable() {
  const sql = getGuestbookSql();

  await sql`
    CREATE TABLE IF NOT EXISTS content_inbox_items (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL,
      source TEXT NOT NULL DEFAULT 'chatgpt' CHECK (
        source IN ('chatgpt', 'life-note', 'project-note', 'web-link', 'other')
      ),
      bucket TEXT NOT NULL DEFAULT 'not-sure' CHECK (
        bucket IN ('good-line', 'site-idea', 'tiny-thought', 'essay', 'project-update', 'not-sure')
      ),
      notes TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'inbox' CHECK (
        status IN ('inbox', 'drafted', 'archived')
      ),
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS content_inbox_items_status_created_at_idx
    ON content_inbox_items (status ASC, created_at DESC)
  `;
}

export async function getAdminContentInboxItems() {
  await ensureContentInboxTable();
  const sql = getGuestbookSql();
  const rows = await sql`
    SELECT
      id,
      title,
      content,
      source,
      bucket,
      notes,
      status,
      created_at,
      updated_at
    FROM content_inbox_items
    ORDER BY
      CASE status WHEN 'inbox' THEN 0 WHEN 'drafted' THEN 1 ELSE 2 END,
      updated_at DESC
  `;

  return (rows as ContentInboxRow[]).map(toContentInboxItem);
}
