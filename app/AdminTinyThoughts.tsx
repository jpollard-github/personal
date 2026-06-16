"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type {
  TinyThought,
  TinyThoughtAttachment,
  TinyThoughtCategory,
  TinyThoughtInspiredByCategory,
} from "./lib/tiny-thoughts";

const categoryOptions: { value: TinyThoughtCategory; label: string }[] = [
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

const categoryLabels = new Map(categoryOptions.map((category) => [category.value, category.label]));

const inspiredByOptions: { value: TinyThoughtInspiredByCategory; label: string }[] = [
  { value: "article-link", label: "Article link" },
  { value: "song", label: "Song" },
  { value: "video", label: "Video" },
  { value: "conversation", label: "Conversation" },
  { value: "other", label: "Other" },
];

const inspiredByLabels = new Map(
  inspiredByOptions.map((category) => [category.value, category.label]),
);

type AttachmentDraft = {
  type: TinyThoughtAttachment["type"];
  url: string;
  title: string;
  file: File | null;
};

type TinyThoughtForm = {
  id: string;
  category: TinyThoughtCategory;
  content: string;
  inspiredByCategory: TinyThoughtInspiredByCategory;
  inspiredBy: string;
  attachments: TinyThoughtAttachment[];
};

const emptyForm: TinyThoughtForm = {
  id: "",
  category: "other" as TinyThoughtCategory,
  content: "",
  inspiredByCategory: "other" as TinyThoughtInspiredByCategory,
  inspiredBy: "",
  attachments: [],
};

const emptyAttachmentDraft: AttachmentDraft = {
  type: "link",
  url: "",
  title: "",
  file: null,
};

function countWords(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function renderLinkedText(text: string) {
  const parts = text.split(/(https?:\/\/[^\s<>"']+)/g);

  return parts.map((part, index) => {
    if (!/^https?:\/\//.test(part)) {
      return part;
    }

    try {
      const url = new URL(part);

      return (
        <a key={`${part}-${index}`} href={url.toString()} target="_blank" rel="noreferrer">
          {url.hostname.replace(/^www\./, "")}
        </a>
      );
    } catch {
      return part;
    }
  });
}

export function AdminTinyThoughts() {
  const [authenticated, setAuthenticated] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [thoughts, setThoughts] = useState<TinyThought[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [attachmentDraft, setAttachmentDraft] = useState(emptyAttachmentDraft);
  const [status, setStatus] = useState("Checking admin session...");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const wordCount = useMemo(() => countWords(form.content), [form.content]);
  const isEditing = Boolean(form.id);

  function validateAttachmentUrl(value: string) {
    try {
      const url = new URL(value);

      return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : "";
    } catch {
      return "";
    }
  }

  async function loadThoughts() {
    const response = await fetch("/api/admin/tiny-thoughts");

    if (!response.ok) {
      throw new Error("Unable to load tiny thoughts.");
    }

    const data = (await response.json()) as { thoughts: TinyThought[] };
    setThoughts(data.thoughts);
    setStatus(data.thoughts.length ? "" : "No tiny thoughts yet.");
  }

  useEffect(() => {
    async function loadSession() {
      const response = await fetch("/api/admin/session");
      const data = (await response.json()) as {
        authenticated: boolean;
        configured: boolean;
      };

      setAuthenticated(data.authenticated);
      setConfigured(data.configured);

      if (!data.configured) {
        setStatus("ADMIN_USERNAME or ADMIN_PASSWORD is not configured.");
        return;
      }

      if (data.authenticated) {
        await loadThoughts();
      } else {
        setStatus("Sign in from the admin dashboard to manage tiny thoughts.");
      }
    }

    loadSession().catch(() => setStatus("Tiny Thoughts admin is temporarily unavailable."));
  }, []);

  async function handleLogout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    setAuthenticated(false);
    setThoughts([]);
    setForm(emptyForm);
    setAttachmentDraft(emptyAttachmentDraft);
    setStatus("Signed out.");
  }

  function editThought(thought: TinyThought) {
    setForm({
      id: thought.id,
      category: thought.category,
      content: thought.content,
      inspiredByCategory: thought.inspiredByCategory,
      inspiredBy: thought.inspiredBy,
      attachments: thought.attachments,
    });
    setAttachmentDraft(emptyAttachmentDraft);
    setStatus("Editing tiny thought.");
  }

  async function uploadImageAttachment(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/tiny-thoughts/upload", {
      method: "POST",
      body: formData,
    });
    const data = (await response.json()) as {
      attachment?: TinyThoughtAttachment;
      error?: string;
    };

    if (!response.ok || !data.attachment || data.attachment.type !== "image") {
      throw new Error(data.error ?? "Unable to upload image.");
    }

    return data.attachment;
  }

  async function addAttachment() {
    if (attachmentDraft.type === "image") {
      if (!attachmentDraft.file) {
        setStatus("Choose an image file to upload.");
        return;
      }

      setUploadingAttachment(true);
      setStatus("Uploading image...");

      try {
        const attachment = await uploadImageAttachment(attachmentDraft.file);

        setForm((currentForm) => ({
          ...currentForm,
          attachments: [...currentForm.attachments, attachment].slice(0, 8),
        }));
        setAttachmentDraft(emptyAttachmentDraft);
        setStatus("Image uploaded to Vercel Blob.");
      } catch (error) {
        setStatus(error instanceof Error ? error.message : "Unable to upload image.");
      } finally {
        setUploadingAttachment(false);
      }

      return;
    }

    const url = validateAttachmentUrl(attachmentDraft.url);

    if (!url) {
      setStatus("Add an http or https URL for the attachment.");
      return;
    }

    const attachment: TinyThoughtAttachment = {
      type: "link",
      url,
      title: attachmentDraft.title.trim() || undefined,
    };

    setForm((currentForm) => ({
      ...currentForm,
      attachments: [...currentForm.attachments, attachment].slice(0, 8),
    }));
    setAttachmentDraft(emptyAttachmentDraft);
    setStatus("Attachment added.");
  }

  function removeAttachment(index: number) {
    setForm((currentForm) => ({
      ...currentForm,
      attachments: currentForm.attachments.filter((_, attachmentIndex) => attachmentIndex !== index),
    }));
  }

  async function saveThought(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusyId(form.id || "new");
    setStatus(isEditing ? "Updating tiny thought..." : "Saving tiny thought...");

    try {
      const response = await fetch("/api/admin/tiny-thoughts", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await response.json()) as { thought?: TinyThought; error?: string };

      if (!response.ok || !data.thought) {
        throw new Error(data.error ?? "Unable to save tiny thought.");
      }

      setThoughts((currentThoughts) => {
        const withoutSaved = currentThoughts.filter((thought) => thought.id !== data.thought!.id);

        return [data.thought!, ...withoutSaved].sort(
          (left, right) =>
            new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
        );
      });
      setForm(emptyForm);
      setAttachmentDraft(emptyAttachmentDraft);
      setStatus(isEditing ? "Tiny thought updated." : "Tiny thought saved.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save tiny thought.");
    } finally {
      setBusyId(null);
    }
  }

  async function deleteThought(id: string) {
    const confirmed = window.confirm("Delete this tiny thought permanently?");

    if (!confirmed) {
      return;
    }

    setBusyId(id);
    setStatus("Deleting tiny thought...");

    try {
      const response = await fetch("/api/admin/tiny-thoughts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to delete tiny thought.");
      }

      setThoughts((currentThoughts) => currentThoughts.filter((thought) => thought.id !== id));
      setForm((currentForm) => (currentForm.id === id ? emptyForm : currentForm));
      setAttachmentDraft((currentDraft) =>
        form.id === id ? emptyAttachmentDraft : currentDraft,
      );
      setStatus("Tiny thought deleted.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to delete tiny thought.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="admin-page">
      <section className="admin-shell">
        <div className="admin-heading">
          <p className="eyebrow">Admin</p>
          <h1>Tiny Thoughts</h1>
          <p>Create, edit, view, and delete short posts for the homepage.</p>
        </div>

        {!authenticated ? (
          <div className="admin-login">
            <p>This page requires an active admin session.</p>
            <Link className="admin-action-link" href="/admin" aria-disabled={!configured}>
              Open Admin Dashboard
            </Link>
          </div>
        ) : (
          <>
            <div className="admin-toolbar">
              <button type="button" onClick={loadThoughts}>
                Refresh
              </button>
              <button type="button" onClick={handleLogout}>
                Log Out
              </button>
            </div>

            <form className="admin-login tiny-thought-admin-form" onSubmit={saveThought}>
              <label>
                <span>Category</span>
                <select
                  value={form.category}
                  onChange={(event) =>
                    setForm((currentForm) => ({
                      ...currentForm,
                      category: event.target.value as TinyThoughtCategory,
                    }))
                  }
                >
                  {categoryOptions.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Thought</span>
                <textarea
                  required
                  value={form.content}
                  onChange={(event) =>
                    setForm((currentForm) => ({
                      ...currentForm,
                      content: event.target.value,
                    }))
                  }
                />
                <small className="guestbook-help">
                  {wordCount} words / 200 max. Emoji welcome.
                </small>
              </label>
              <label>
                <span>Inspired by category</span>
                <select
                  value={form.inspiredByCategory}
                  onChange={(event) =>
                    setForm((currentForm) => ({
                      ...currentForm,
                      inspiredByCategory: event.target.value as TinyThoughtInspiredByCategory,
                    }))
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
                  onChange={(event) =>
                    setForm((currentForm) => ({
                      ...currentForm,
                      inspiredBy: event.target.value,
                    }))
                  }
                />
              </label>
              <div className="tiny-thought-attachment-form">
                <label>
                  <span>Attachment type</span>
                  <select
                    value={attachmentDraft.type}
                    onChange={(event) =>
                      setAttachmentDraft((currentDraft) => ({
                        ...currentDraft,
                        type: event.target.value as TinyThoughtAttachment["type"],
                        url: "",
                        title: "",
                        file: null,
                      }))
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
                        onChange={(event) =>
                          setAttachmentDraft((currentDraft) => ({
                            ...currentDraft,
                            url: event.target.value,
                          }))
                        }
                      />
                    </label>
                    <label>
                      <span>Link title</span>
                      <input
                        type="text"
                        value={attachmentDraft.title}
                        maxLength={120}
                        placeholder="Optional display title"
                        onChange={(event) =>
                          setAttachmentDraft((currentDraft) => ({
                            ...currentDraft,
                            title: event.target.value,
                          }))
                        }
                      />
                    </label>
                  </>
                ) : (
                  <label>
                    <span>Image file</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/gif,image/webp"
                      onChange={(event) =>
                        setAttachmentDraft((currentDraft) => ({
                          ...currentDraft,
                          file: event.target.files?.[0] ?? null,
                        }))
                      }
                    />
                    <small className="guestbook-help">PNG, JPG, GIF, or WebP. 5 MB max.</small>
                  </label>
                )}
                <button
                  type="button"
                  onClick={addAttachment}
                  disabled={form.attachments.length >= 8 || uploadingAttachment}
                >
                  {attachmentDraft.type === "image"
                    ? uploadingAttachment
                      ? "Uploading..."
                      : "Upload Image"
                    : "Add Link"}
                </button>
              </div>
              {form.attachments.length ? (
                <ul className="tiny-thought-attachment-list">
                  {form.attachments.map((attachment, index) => (
                    <li key={`${attachment.type}-${attachment.url}-${index}`}>
                      <span>
                        {attachment.type === "image"
                          ? "Image"
                          : attachment.title || new URL(attachment.url).hostname.replace(/^www\./, "")}
                      </span>
                      <a href={attachment.url} target="_blank" rel="noreferrer">
                        {new URL(attachment.url).hostname.replace(/^www\./, "")}
                      </a>
                      <button type="button" onClick={() => removeAttachment(index)}>
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="admin-entry-actions">
                <button type="submit" disabled={Boolean(busyId)}>
                  {isEditing ? "Update Thought" : "Create Thought"}
                </button>
                {isEditing ? (
                  <button
                    type="button"
                    disabled={Boolean(busyId)}
                    onClick={() => {
                      setForm(emptyForm);
                      setAttachmentDraft(emptyAttachmentDraft);
                    }}
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
            </form>
          </>
        )}

        <p className="guestbook-status" aria-live="polite">
          {status}
        </p>

        {authenticated ? (
          <div className="admin-entry-list">
            {thoughts.map((thought) => (
              <article className="admin-entry" key={thought.id}>
                <div className="admin-entry-meta">
                  <span>{categoryLabels.get(thought.category) ?? "Other"}</span>
                  <time dateTime={thought.createdAt}>
                    {new Intl.DateTimeFormat("en", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    }).format(new Date(thought.createdAt))}
                  </time>
                </div>
                {thought.imageUrl ? (
                  <img src={thought.imageUrl} alt="" className="tiny-thought-admin-image" />
                ) : null}
                <p>{renderLinkedText(thought.content)}</p>
                {thought.inspiredBy ? (
                  <p className="tiny-thought-inspired">
                    Inspired by {inspiredByLabels.get(thought.inspiredByCategory) ?? "Other"}:{" "}
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
                          : attachment.title ||
                            new URL(attachment.url).hostname.replace(/^www\./, "")}
                      </a>
                    ))}
                  </div>
                ) : null}
                <div className="admin-entry-actions">
                  <button type="button" disabled={busyId === thought.id} onClick={() => editThought(thought)}>
                    Edit
                  </button>
                  <button
                    className="admin-danger"
                    type="button"
                    disabled={busyId === thought.id}
                    onClick={() => deleteThought(thought.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
