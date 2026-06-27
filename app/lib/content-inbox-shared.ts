export const contentInboxSources = [
  "chatgpt",
  "life-note",
  "project-note",
  "web-link",
  "other",
] as const;

export type ContentInboxSource = (typeof contentInboxSources)[number];

export const contentInboxBuckets = [
  "good-line",
  "site-idea",
  "tiny-thought",
  "essay",
  "now",
  "project-update",
  "not-sure",
] as const;

export type ContentInboxBucket = (typeof contentInboxBuckets)[number];

export const contentInboxStatuses = ["inbox", "drafted", "archived"] as const;

export type ContentInboxStatus = (typeof contentInboxStatuses)[number];

export type ContentInboxItem = {
  id: string;
  title: string;
  content: string;
  source: ContentInboxSource;
  bucket: ContentInboxBucket;
  notes: string;
  status: ContentInboxStatus;
  createdAt: string;
  updatedAt: string;
};

export type ContentInboxRow = {
  id: string;
  title: string | null;
  content: string;
  source: ContentInboxSource;
  bucket: ContentInboxBucket;
  notes: string | null;
  status: ContentInboxStatus;
  created_at: string;
  updated_at: string;
};

export function normalizeInboxText(value: unknown, maxLength = 4000) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .trim()
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .slice(0, maxLength);
}

export function isContentInboxSource(value: string): value is ContentInboxSource {
  return contentInboxSources.includes(value as ContentInboxSource);
}

export function isContentInboxBucket(value: string): value is ContentInboxBucket {
  return contentInboxBuckets.includes(value as ContentInboxBucket);
}

export function isContentInboxStatus(value: string): value is ContentInboxStatus {
  return contentInboxStatuses.includes(value as ContentInboxStatus);
}

export function emptyContentInboxItem(): ContentInboxItem {
  const now = new Date().toISOString();
  const id =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `inbox-${now}-${Math.random().toString(16).slice(2)}`;

  return {
    id,
    title: "",
    content: "",
    source: "chatgpt",
    bucket: "not-sure",
    notes: "",
    status: "inbox",
    createdAt: now,
    updatedAt: now,
  };
}

export function toContentInboxItem(row: ContentInboxRow): ContentInboxItem {
  return {
    id: row.id,
    title: row.title ?? "",
    content: row.content,
    source: row.source,
    bucket: row.bucket,
    notes: row.notes ?? "",
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
