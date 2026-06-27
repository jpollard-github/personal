import type {
  ContentInboxBucket,
  ContentInboxItem,
  ContentInboxSource,
} from "./content-inbox-shared";
import type { NowItem } from "./now";
import type { SiteProject } from "./projects";
import type { TinyThoughtFormState } from "../tiny-thought-admin/shared";
import type { WritingDraft } from "./writing-drafts";

export function buildTinyThoughtDraft(item: ContentInboxItem): Partial<TinyThoughtFormState> {
  return {
    content: item.content,
    category: "other",
    inspiredByCategory: item.source === "chatgpt" ? "conversation" : "other",
    inspiredBy: item.title || item.notes || "",
  };
}

export function buildProjectDraft(item: ContentInboxItem): Partial<SiteProject> {
  return {
    title: item.title || "Project update draft",
    type: item.bucket === "project-update" ? "Project update" : "Project",
    description: item.content,
    phase: item.notes,
    status: "active",
    nextAction: "None",
    blockers: "",
    priority: 3,
  };
}

export function buildNowDraft(item: ContentInboxItem): Partial<NowItem> {
  return {
    label:
      item.bucket === "project-update"
        ? "Updating"
        : item.bucket === "now"
          ? "Current"
          : "Noticing",
    title: item.title || "New Now card draft",
    text: item.content,
  };
}

export function buildWritingDraft(args: {
  item: ContentInboxItem;
  sourceLabel: string;
  bucketLabel: string;
}): Partial<WritingDraft> {
  const { item, sourceLabel, bucketLabel } = args;

  return {
    title: item.title || "Writing draft",
    slug: item.title || "",
    summary: item.notes,
    body: item.content,
    notes: `Imported from Content Inbox.\n\nSource: ${sourceLabel}\nBucket: ${bucketLabel}${item.notes ? `\n\nOriginal note:\n${item.notes}` : ""}`,
    status: "draft",
  };
}

export function shouldSuggestNowBucket(bucket: ContentInboxBucket, source: ContentInboxSource) {
  return bucket === "project-update" || bucket === "now" || source === "life-note";
}
