import type { TinyThoughtAttachment } from "../lib/tiny-thoughts";
import { getUrlHost } from "../lib/tiny-thought-display";
import type { AttachmentDraft } from "./shared";

export function TinyThoughtAttachmentEditor({
  attachmentDraft,
  attachments,
  onAddAttachment,
  onAttachmentFileChange,
  onAttachmentTitleChange,
  onAttachmentTypeChange,
  onAttachmentUrlChange,
  onRemoveAttachment,
  uploadingAttachment,
}: {
  attachmentDraft: AttachmentDraft;
  attachments: TinyThoughtAttachment[];
  onAddAttachment: () => void;
  onAttachmentFileChange: (file: File | null) => void;
  onAttachmentTitleChange: (value: string) => void;
  onAttachmentTypeChange: (type: TinyThoughtAttachment["type"]) => void;
  onAttachmentUrlChange: (value: string) => void;
  onRemoveAttachment: (index: number) => void;
  uploadingAttachment: boolean;
}) {
  return (
    <>
      <div className="tiny-thought-attachment-form">
        <label>
          <span>Attachment type</span>
          <select
            value={attachmentDraft.type}
            onChange={(event) =>
              onAttachmentTypeChange(event.target.value as TinyThoughtAttachment["type"])
            }
          >
            <option value="link">Link</option>
            <option value="image">Image</option>
          </select>
        </label>
        {attachmentDraft.type === "link" ? (
          <>
            <label>
              <span>Attachment URL</span>
              <input
                type="url"
                value={attachmentDraft.url}
                placeholder="https://"
                onChange={(event) => onAttachmentUrlChange(event.target.value)}
              />
            </label>
            <label>
              <span>Link title</span>
              <input
                type="text"
                value={attachmentDraft.title}
                maxLength={120}
                placeholder="Optional display title"
                onChange={(event) => onAttachmentTitleChange(event.target.value)}
              />
            </label>
          </>
        ) : (
          <label>
            <span>Image file</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/gif,image/webp"
              onChange={(event) => onAttachmentFileChange(event.target.files?.[0] ?? null)}
            />
            <small className="guestbook-help">PNG, JPG, GIF, or WebP. 5 MB max.</small>
          </label>
        )}
        <button type="button" onClick={onAddAttachment} disabled={attachments.length >= 8 || uploadingAttachment}>
          {attachmentDraft.type === "image"
            ? uploadingAttachment
              ? "Uploading..."
              : "Upload Image"
            : "Add Link"}
        </button>
      </div>
      {attachments.length ? (
        <ul className="tiny-thought-attachment-list">
          {attachments.map((attachment, index) => (
            <li key={`${attachment.type}-${attachment.url}-${index}`}>
              <span>
                {attachment.type === "image"
                  ? "Image"
                  : attachment.title || getUrlHost(attachment.url)}
              </span>
              <a href={attachment.url} target="_blank" rel="noreferrer">
                {getUrlHost(attachment.url)}
              </a>
              <button type="button" onClick={() => onRemoveAttachment(index)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}
