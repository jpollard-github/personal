import type { TinyThought } from "../lib/tiny-thoughts";
import {
  formatTinyThoughtDate,
  getUrlHost,
  renderLinkedText,
  tinyThoughtCategoryLabels,
  tinyThoughtInspiredByLabels,
} from "../lib/tiny-thought-display";

export function TinyThoughtAdminList({
  busyId,
  onDelete,
  onEdit,
  thoughts,
}: {
  busyId: string | null;
  onDelete: (id: string) => void;
  onEdit: (thought: TinyThought) => void;
  thoughts: TinyThought[];
}) {
  return (
    <div className="admin-entry-list">
      {thoughts.map((thought) => (
        <article className="admin-entry" key={thought.id}>
          <div className="admin-entry-meta">
            <span>{tinyThoughtCategoryLabels.get(thought.category) ?? "Other"}</span>
            <time dateTime={thought.createdAt}>{formatTinyThoughtDate(thought.createdAt, true)}</time>
          </div>
          {thought.imageUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={thought.imageUrl} alt="" className="tiny-thought-admin-image" />
            </>
          ) : null}
          <p>{renderLinkedText(thought.content)}</p>
          {thought.inspiredBy ? (
            <p className="tiny-thought-inspired">
              Inspired by {tinyThoughtInspiredByLabels.get(thought.inspiredByCategory) ?? "Other"}:{" "}
              {renderLinkedText(thought.inspiredBy)}
            </p>
          ) : null}
          {thought.attachments.length ? (
            <div className="tiny-thought-admin-attachments">
              {thought.attachments.map((attachment, index) => (
                <a
                  key={`${attachment.type}-${attachment.url}-${index}`}
                  href={attachment.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {attachment.type === "image"
                    ? `Image ${index + 1}`
                    : attachment.title || getUrlHost(attachment.url)}
                </a>
              ))}
            </div>
          ) : null}
          <div className="admin-entry-actions">
            <button type="button" disabled={busyId === thought.id} onClick={() => onEdit(thought)}>
              Edit
            </button>
            <button
              className="admin-danger"
              type="button"
              disabled={busyId === thought.id}
              onClick={() => onDelete(thought.id)}
            >
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
