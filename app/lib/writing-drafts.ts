export const writingDraftStatuses = ["draft", "shaping", "ready", "archived"] as const;

export type WritingDraftStatus = (typeof writingDraftStatuses)[number];

export type WritingDraft = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  notes: string;
  status: WritingDraftStatus;
  createdAt: string;
  updatedAt: string;
};

export type WritingDraftPublishBundle = {
  slug: string;
  markdown: string;
  entrySnippet: string;
  description: string;
};

export type WritingDraftRow = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  notes: string;
  status: WritingDraftStatus;
  created_at: string;
  updated_at: string;
};

function createDraftId() {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `draft-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function normalizeWritingDraftText(value: unknown, maxLength = 8000) {
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

export function normalizeWritingDraftSlug(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}

export function summarizeWritingDraftDescription(draft: Pick<WritingDraft, "summary" | "body">) {
  const preferred = normalizeWritingDraftText(draft.summary, 220);

  if (preferred) {
    return preferred;
  }

  return normalizeWritingDraftText(draft.body, 220)
    .replace(/\s+/g, " ")
    .slice(0, 180)
    .trimEnd();
}

export function createWritingDraftMarkdown(draft: Pick<WritingDraft, "title" | "body">) {
  return `**${draft.title}**\n\n${draft.body.trim()}\n`;
}

export function createWritingDraftEntrySnippet(
  draft: Pick<WritingDraft, "slug" | "title" | "summary"> & { description?: string },
) {
  const description = draft.description || summarizeWritingDraftDescription({ summary: draft.summary, body: "" });

  return `{
  slug: "${draft.slug}",
  title: ${JSON.stringify(draft.title)},
  description: ${JSON.stringify(description)},
  icon: "📝",
  related: [],
},`;
}

export function createWritingDraftPublishBundle(
  draft: Pick<WritingDraft, "slug" | "title" | "summary" | "body">,
): WritingDraftPublishBundle {
  const description = summarizeWritingDraftDescription(draft);

  return {
    slug: draft.slug,
    markdown: createWritingDraftMarkdown(draft),
    entrySnippet: createWritingDraftEntrySnippet({
      slug: draft.slug,
      title: draft.title,
      summary: draft.summary,
      description,
    }),
    description,
  };
}

export function isWritingDraftStatus(value: string): value is WritingDraftStatus {
  return writingDraftStatuses.includes(value as WritingDraftStatus);
}

export function emptyWritingDraft(): WritingDraft {
  const now = new Date().toISOString();

  return {
    id: createDraftId(),
    title: "",
    slug: "",
    summary: "",
    body: "",
    notes: "",
    status: "draft",
    createdAt: now,
    updatedAt: now,
  };
}

export function toWritingDraft(row: WritingDraftRow): WritingDraft {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    summary: row.summary,
    body: row.body,
    notes: row.notes,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
