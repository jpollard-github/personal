import type {
  TinyThoughtCategory,
  TinyThoughtInspiredByCategory,
} from "../lib/tiny-thoughts";
import { categoryOptions, inspiredByOptions, type AttachmentDraft, type TinyThoughtFormState } from "./shared";
import { TinyThoughtAttachmentEditor } from "./TinyThoughtAttachmentEditor";

export function TinyThoughtForm({
  attachmentDraft,
  busy,
  form,
  isEditing,
  onAddAttachment,
  onAttachmentFileChange,
  onAttachmentTitleChange,
  onAttachmentTypeChange,
  onAttachmentUrlChange,
  onCancel,
  onCategoryChange,
  onContentChange,
  onInspiredByCategoryChange,
  onInspiredByChange,
  onRemoveAttachment,
  onSubmit,
  uploadingAttachment,
  wordCount,
}: {
  attachmentDraft: AttachmentDraft;
  busy: boolean;
  form: TinyThoughtFormState;
  isEditing: boolean;
  onAddAttachment: () => void;
  onAttachmentFileChange: (file: File | null) => void;
  onAttachmentTitleChange: (value: string) => void;
  onAttachmentTypeChange: (type: "link" | "image") => void;
  onAttachmentUrlChange: (value: string) => void;
  onCancel: () => void;
  onCategoryChange: (value: TinyThoughtCategory) => void;
  onContentChange: (value: string) => void;
  onInspiredByCategoryChange: (value: TinyThoughtInspiredByCategory) => void;
  onInspiredByChange: (value: string) => void;
  onRemoveAttachment: (index: number) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  uploadingAttachment: boolean;
  wordCount: number;
}) {
  return (
    <form className="admin-login tiny-thought-admin-form" onSubmit={onSubmit}>
      <label>
        <span>Category</span>
        <select value={form.category} onChange={(event) => onCategoryChange(event.target.value as TinyThoughtCategory)}>
          {categoryOptions.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>Thought</span>
        <textarea required value={form.content} onChange={(event) => onContentChange(event.target.value)} />
        <small className="guestbook-help">{wordCount} words / 200 max. Emoji welcome.</small>
      </label>
      <label>
        <span>Inspired by category</span>
        <select
          value={form.inspiredByCategory}
          onChange={(event) =>
            onInspiredByCategoryChange(event.target.value as TinyThoughtInspiredByCategory)
          }
        >
          {inspiredByOptions.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>Inspired by</span>
        <input
          type="text"
          value={form.inspiredBy}
          maxLength={240}
          placeholder="Optional article, song, video, conversation, or note"
          onChange={(event) => onInspiredByChange(event.target.value)}
        />
      </label>
      <TinyThoughtAttachmentEditor
        attachmentDraft={attachmentDraft}
        attachments={form.attachments}
        onAddAttachment={onAddAttachment}
        onAttachmentFileChange={onAttachmentFileChange}
        onAttachmentTitleChange={onAttachmentTitleChange}
        onAttachmentTypeChange={onAttachmentTypeChange}
        onAttachmentUrlChange={onAttachmentUrlChange}
        onRemoveAttachment={onRemoveAttachment}
        uploadingAttachment={uploadingAttachment}
      />
      <div className="admin-entry-actions">
        <button type="submit" disabled={busy}>
          {isEditing ? "Update Thought" : "Create Thought"}
        </button>
        {isEditing ? (
          <button type="button" disabled={busy} onClick={onCancel}>
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
