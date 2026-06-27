import { neon } from "@neondatabase/serverless";

export const guestbookCategories = [
  "music",
  "arcade",
  "cat",
  "twin-peaks",
  "site-note",
  "other",
] as const;

export type GuestbookCategory = (typeof guestbookCategories)[number];

export type GuestbookEntry = {
  id: string;
  name: string;
  category: GuestbookCategory;
  message: string;
  createdAt: string;
};

export type AdminGuestbookEntry = GuestbookEntry & {
  email: string;
  notifyOwner: boolean;
  emailSent: boolean;
  status: "pending" | "approved" | "rejected";
};

export type GuestbookRow = {
  id: string;
  name: string | null;
  email?: string | null;
  category: GuestbookCategory;
  message: string;
  notify_owner?: boolean;
  email_sent?: boolean;
  status?: "pending" | "approved" | "rejected";
  created_at: string;
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return character;
    }
  });
}

const connectionString =
  process.env.DATABASE_URL ??
  process.env.STORAGE_DATABASE_URL ??
  process.env.POSTGRES_URL ??
  process.env.STORAGE_POSTGRES_URL ??
  process.env.POSTGRES_URL_NON_POOLING ??
  process.env.STORAGE_POSTGRES_URL_NON_POOLING ??
  process.env.STORAGE_DATABASE_URL_UNPOOLED ??
  process.env.NEON_DATABASE_URL;

export function getGuestbookSql() {
  if (!connectionString) {
    throw new Error(
      "Missing Neon connection string. Set DATABASE_URL, STORAGE_DATABASE_URL, POSTGRES_URL, STORAGE_POSTGRES_URL, POSTGRES_URL_NON_POOLING, STORAGE_POSTGRES_URL_NON_POOLING, or NEON_DATABASE_URL.",
    );
  }

  return neon(connectionString);
}

export async function ensureGuestbookTable() {
  const sql = getGuestbookSql();

  await sql`
    CREATE TABLE IF NOT EXISTS guestbook_entries (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 80),
      email TEXT,
      category TEXT NOT NULL CHECK (
        category IN ('music', 'arcade', 'cat', 'twin-peaks', 'site-note', 'other')
      ),
      message TEXT NOT NULL CHECK (char_length(message) BETWEEN 3 AND 500),
      notify_owner BOOLEAN NOT NULL DEFAULT false,
      email_sent BOOLEAN NOT NULL DEFAULT false,
      status TEXT NOT NULL DEFAULT 'pending' CHECK (
        status IN ('pending', 'approved', 'rejected')
      ),
      approved_at TIMESTAMPTZ,
      rejected_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await sql`
    ALTER TABLE guestbook_entries
    ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'approved'
  `;

  await sql`
    ALTER TABLE guestbook_entries
    ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ
  `;

  await sql`
    ALTER TABLE guestbook_entries
    ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ
  `;

  await sql`
    ALTER TABLE guestbook_entries
    ALTER COLUMN name SET NOT NULL
  `.catch(() => {
    // Existing legacy rows may have null names; new writes are validated in the API.
  });

  await sql`
    ALTER TABLE guestbook_entries
    DROP CONSTRAINT IF EXISTS guestbook_entries_name_check
  `;

  await sql`
    ALTER TABLE guestbook_entries
    ADD CONSTRAINT guestbook_entries_name_check
    CHECK (char_length(name) BETWEEN 1 AND 80)
    NOT VALID
  `.catch(() => {
    // Constraint already exists on previously migrated databases.
  });

  await sql`
    ALTER TABLE guestbook_entries
    ADD CONSTRAINT guestbook_entries_status_check
    CHECK (status IN ('pending', 'approved', 'rejected'))
  `.catch(() => {
    // Constraint already exists on previously migrated databases.
  });

  await sql`
    ALTER TABLE guestbook_entries
    DROP CONSTRAINT IF EXISTS guestbook_entries_message_check
  `;

  await sql`
    ALTER TABLE guestbook_entries
    ADD CONSTRAINT guestbook_entries_message_check
    CHECK (char_length(message) BETWEEN 3 AND 500)
    NOT VALID
  `.catch(() => {
    // Constraint already exists on previously migrated databases.
  });

  await sql`
    CREATE INDEX IF NOT EXISTS guestbook_entries_created_at_idx
    ON guestbook_entries (created_at DESC)
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS guestbook_rate_limits (
      ip_hash TEXT PRIMARY KEY,
      window_start TIMESTAMPTZ NOT NULL DEFAULT now(),
      submissions INTEGER NOT NULL DEFAULT 0,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS guestbook_rate_limits_updated_at_idx
    ON guestbook_rate_limits (updated_at DESC)
  `;
}

export function toGuestbookEntry(row: GuestbookRow): GuestbookEntry {
  return {
    id: row.id,
    name: escapeHtml(row.name?.trim() || "Mystery visitor"),
    category: row.category,
    message: escapeHtml(row.message),
    createdAt: row.created_at,
  };
}

export function toAdminGuestbookEntry(row: GuestbookRow): AdminGuestbookEntry {
  return {
    ...toGuestbookEntry(row),
    email: row.email?.trim() ?? "",
    notifyOwner: Boolean(row.notify_owner),
    emailSent: Boolean(row.email_sent),
    status: row.status ?? "pending",
  };
}

export async function getPublicGuestbookEntries(limit = 24) {
  await ensureGuestbookTable();
  const sql = getGuestbookSql();
  const rows = await sql`
    SELECT id, name, category, message, created_at
    FROM guestbook_entries
    WHERE status = 'approved'
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;

  return (rows as GuestbookRow[]).map(toGuestbookEntry);
}
