import { getGuestbookSql } from "./guestbook";

export const tinyThoughtCategories = [
  "lesson",
  "observation",
  "funny",
  "opinion",
  "arcade",
  "music",
  "cat",
  "twin-peaks",
  "other",
] as const;

export type TinyThoughtCategory = (typeof tinyThoughtCategories)[number];

export const tinyThoughtInspiredByCategories = [
  "article-link",
  "song",
  "video",
  "conversation",
  "other",
] as const;

export type TinyThoughtInspiredByCategory =
  (typeof tinyThoughtInspiredByCategories)[number];

export type TinyThoughtAttachment =
  | { type: "image"; url: string }
  | { type: "link"; url: string; title?: string };

export type TinyThought = {
  id: string;
  category: TinyThoughtCategory;
  content: string;
  imageUrl: string;
  attachments: TinyThoughtAttachment[];
  inspiredByCategory: TinyThoughtInspiredByCategory;
  inspiredBy: string;
  createdAt: string;
  updatedAt: string;
};

export type TinyThoughtRow = {
  id: string;
  category: TinyThoughtCategory;
  content: string;
  image_url: string | null;
  attachments: unknown;
  inspired_by_category: TinyThoughtInspiredByCategory | null;
  inspired_by: string | null;
  created_at: string;
  updated_at: string;
};

export function countWords(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

export function isTinyThoughtCategory(value: string): value is TinyThoughtCategory {
  return tinyThoughtCategories.includes(value as TinyThoughtCategory);
}

export function isTinyThoughtInspiredByCategory(
  value: string,
): value is TinyThoughtInspiredByCategory {
  return tinyThoughtInspiredByCategories.includes(
    value as TinyThoughtInspiredByCategory,
  );
}

export function normalizeTinyThoughtText(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .trim()
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n");
}

export function normalizeTinyThoughtUrl(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  const candidate = value.trim();

  if (!candidate) {
    return "";
  }

  try {
    const url = new URL(candidate);

    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : "";
  } catch {
    return "";
  }
}

export function normalizeTinyThoughtAttachments(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  const attachments: TinyThoughtAttachment[] = [];

  for (const item of value) {
    if (!item || typeof item !== "object") {
      continue;
    }

    const candidate = item as Record<string, unknown>;
    const type = candidate.type;
    const url = normalizeTinyThoughtUrl(candidate.url);

    if (!url || (type !== "image" && type !== "link")) {
      continue;
    }

    if (type === "image") {
      attachments.push({ type, url });
    } else {
      const title = normalizeTinyThoughtText(candidate.title).slice(0, 120);
      attachments.push(title ? { type, url, title } : { type, url });
    }

    if (attachments.length >= 8) {
      break;
    }
  }

  return attachments;
}

function rowAttachments(row: TinyThoughtRow) {
  const attachments = normalizeTinyThoughtAttachments(row.attachments);

  if (attachments.length || !row.image_url) {
    return attachments;
  }

  const imageUrl = normalizeTinyThoughtUrl(row.image_url);

  return imageUrl ? [{ type: "image" as const, url: imageUrl }] : [];
}

export async function ensureTinyThoughtsTable() {
  const sql = getGuestbookSql();

  await sql`
    CREATE TABLE IF NOT EXISTS tiny_thoughts (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL CHECK (
        category IN (
          'lesson',
          'observation',
          'funny',
          'opinion',
          'arcade',
          'music',
          'cat',
          'twin-peaks',
          'other'
        )
      ),
      content TEXT NOT NULL,
      image_url TEXT,
      attachments JSONB NOT NULL DEFAULT '[]'::jsonb,
      inspired_by_category TEXT NOT NULL DEFAULT 'other' CHECK (
        inspired_by_category IN (
          'article-link',
          'song',
          'video',
          'conversation',
          'other'
        )
      ),
      inspired_by TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await sql`
    ALTER TABLE tiny_thoughts
    ADD COLUMN IF NOT EXISTS attachments JSONB NOT NULL DEFAULT '[]'::jsonb
  `;

  await sql`
    ALTER TABLE tiny_thoughts
    ADD COLUMN IF NOT EXISTS inspired_by_category TEXT NOT NULL DEFAULT 'other'
  `;

  await sql`
    ALTER TABLE tiny_thoughts
    ADD COLUMN IF NOT EXISTS inspired_by TEXT NOT NULL DEFAULT ''
  `;

  await sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'tiny_thoughts_inspired_by_category_check'
      ) THEN
        ALTER TABLE tiny_thoughts
        ADD CONSTRAINT tiny_thoughts_inspired_by_category_check
        CHECK (
          inspired_by_category IN (
            'article-link',
            'song',
            'video',
            'conversation',
            'other'
          )
        );
      END IF;
    END
    $$
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS tiny_thoughts_created_at_idx
    ON tiny_thoughts (created_at DESC)
  `;
}

export function toTinyThought(row: TinyThoughtRow): TinyThought {
  const attachments = rowAttachments(row);
  const imageAttachment = attachments.find((attachment) => attachment.type === "image");

  return {
    id: row.id,
    category: row.category,
    content: row.content,
    imageUrl: imageAttachment?.url ?? row.image_url ?? "",
    attachments,
    inspiredByCategory: row.inspired_by_category ?? "other",
    inspiredBy: row.inspired_by ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
