import type {
  TinyThought,
  TinyThoughtAttachment,
  TinyThoughtCategory,
  TinyThoughtInspiredByCategory,
} from "../lib/tiny-thoughts";

export const categoryOptions: { value: TinyThoughtCategory; label: string }[] = [
  { value: "lesson", label: "Lesson learned" },
  { value: "observation", label: "Observation" },
  { value: "funny", label: "Funny experience" },
  { value: "opinion", label: "Opinion" },
  { value: "arcade", label: "Arcade" },
  { value: "music", label: "Music" },
  { value: "cat", label: "Cat" },
  { value: "twin-peaks", label: "Twin Peaks" },
  { value: "other", label: "Other" },
];

export const inspiredByOptions: {
  value: TinyThoughtInspiredByCategory;
  label: string;
}[] = [
  { value: "article-link", label: "Article link" },
  { value: "song", label: "Song" },
  { value: "video", label: "Video" },
  { value: "conversation", label: "Conversation" },
  { value: "other", label: "Other" },
];

export type AttachmentDraft = {
  type: TinyThoughtAttachment["type"];
  url: string;
  title: string;
  file: File | null;
};

export type TinyThoughtFormState = {
  id: string;
  category: TinyThoughtCategory;
  content: string;
  inspiredByCategory: TinyThoughtInspiredByCategory;
  inspiredBy: string;
  attachments: TinyThoughtAttachment[];
};

export const emptyForm: TinyThoughtFormState = {
  id: "",
  category: "other",
  content: "",
  inspiredByCategory: "other",
  inspiredBy: "",
  attachments: [],
};

export const emptyAttachmentDraft: AttachmentDraft = {
  type: "link",
  url: "",
  title: "",
  file: null,
};

export function toTinyThoughtFormState(thought: TinyThought): TinyThoughtFormState {
  return {
    id: thought.id,
    category: thought.category,
    content: thought.content,
    inspiredByCategory: thought.inspiredByCategory,
    inspiredBy: thought.inspiredBy,
    attachments: thought.attachments,
  };
}
