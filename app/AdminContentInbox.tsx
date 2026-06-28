"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  buildNowDraft,
  buildProjectDraft,
  buildTinyThoughtDraft,
  buildWritingDraft,
} from "./lib/content-inbox-drafts";
import {
  contentInboxBuckets,
  contentInboxSources,
  contentInboxStatuses,
  emptyContentInboxItem,
  type ContentInboxBucket,
  type ContentInboxItem,
  type ContentInboxSource,
  type ContentInboxStatus,
} from "./lib/content-inbox-shared";

const sourceLabels = new Map<ContentInboxSource, string>([
  ["chatgpt", "ChatGPT"],
  ["life-note", "Life note"],
  ["project-note", "Project note"],
  ["web-link", "Web link"],
  ["other", "Other"],
]);

const bucketLabels = new Map<ContentInboxBucket, string>([
  ["good-line", "Good line"],
  ["site-idea", "Site idea"],
  ["tiny-thought", "Tiny Thought"],
  ["essay", "Essay"],
  ["now", "Now"],
  ["project-update", "Project update"],
  ["not-sure", "Not sure yet"],
]);

const statusLabels = new Map<ContentInboxStatus, string>([
  ["inbox", "Inbox"],
  ["drafted", "Drafted"],
  ["archived", "Archived"],
]);

const tinyThoughtDraftStorageKey = "arcadeghosts-tiny-thought-draft";
const projectDraftStorageKey = "arcadeghosts-project-draft";
const nowDraftStorageKey = "arcadeghosts-now-draft";
const writingDraftStorageKey = "arcadeghosts-writing-draft";

function summarize(value: string, maxLength = 180) {
  const compact = value.replace(/\s+/g, " ").trim();

  if (compact.length <= maxLength) {
    return compact;
  }

  return `${compact.slice(0, maxLength - 3).trimEnd()}...`;
}

function fingerprint(item: ContentInboxItem) {
  return JSON.stringify(item);
}

export function AdminContentInbox({
  instructionsMarkdown = "",
  editorialGuideMarkdown = "",
}: {
  instructionsMarkdown?: string;
  editorialGuideMarkdown?: string;
}) {
  const [authenticated, setAuthenticated] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [items, setItems] = useState<ContentInboxItem[]>([]);
  const [form, setForm] = useState<ContentInboxItem>(emptyContentInboxItem());
  const [savedFingerprint, setSavedFingerprint] = useState(fingerprint(form));
  const [status, setStatus] = useState("Checking admin session...");
  const [busy, setBusy] = useState(false);
  const isEditing = useMemo(() => items.some((item) => item.id === form.id), [form.id, items]);
  const formDirty = fingerprint(form) !== savedFingerprint;

  async function loadItems() {
    const response = await fetch("/api/admin/content-inbox");

    if (!response.ok) {
      throw new Error("Unable to load content inbox.");
    }

    const data = (await response.json()) as { items: ContentInboxItem[] };
    setItems(data.items);
    setStatus(data.items.length ? "Inbox loaded." : "Inbox is empty.");
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
        await loadItems();
      } else {
        setStatus("Sign in from the admin dashboard to manage the content inbox.");
      }
    }

    loadSession().catch(() => setStatus("Content inbox is temporarily unavailable."));
  }, []);

  async function handleLogout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    setAuthenticated(false);
    setItems([]);
    setStatus("Signed out.");
  }

  function updateForm<K extends keyof ContentInboxItem>(field: K, value: ContentInboxItem[K]) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function resetForm() {
    const next = emptyContentInboxItem();
    setForm(next);
    setSavedFingerprint(fingerprint(next));
  }

  function editItem(item: ContentInboxItem) {
    setForm(item);
    setSavedFingerprint(fingerprint(item));
    setStatus("Editing inbox item.");
  }

  async function saveItem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setStatus(isEditing ? "Saving inbox item..." : "Capturing inbox item...");

    try {
      const response = await fetch("/api/admin/content-inbox", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item: form }),
      });
      const data = (await response.json()) as {
        items?: ContentInboxItem[];
        item?: ContentInboxItem;
        error?: string;
      };

      if (!response.ok || !data.items || !data.item) {
        throw new Error(data.error ?? "Unable to save inbox item.");
      }

      setItems(data.items);
      setForm(data.item);
      setSavedFingerprint(fingerprint(data.item));
      setStatus(isEditing ? "Inbox item saved." : "Inbox item captured.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save inbox item.");
    } finally {
      setBusy(false);
    }
  }

  async function updateItemStatus(id: string, nextStatus: ContentInboxStatus, message: string) {
    setBusy(true);
    setStatus(message);

    try {
      const response = await fetch("/api/admin/content-inbox", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      const data = (await response.json()) as { items?: ContentInboxItem[]; error?: string };

      if (!response.ok || !data.items) {
        throw new Error(data.error ?? "Unable to update inbox item.");
      }

      setItems(data.items);
      if (form.id === id) {
        const nextForm = { ...form, status: nextStatus };
        setForm(nextForm);
        setSavedFingerprint(fingerprint(nextForm));
      }
      setStatus(
        nextStatus === "archived"
          ? "Inbox item archived."
          : nextStatus === "drafted"
            ? "Inbox item marked drafted."
            : "Inbox item moved back to inbox.",
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to update inbox item.");
    } finally {
      setBusy(false);
    }
  }

  async function deleteItem(id: string) {
    const confirmed = window.confirm("Delete this inbox item permanently?");

    if (!confirmed) {
      return;
    }

    setBusy(true);
    setStatus("Deleting inbox item...");

    try {
      const response = await fetch("/api/admin/content-inbox", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = (await response.json()) as { items?: ContentInboxItem[]; error?: string };

      if (!response.ok || !data.items) {
        throw new Error(data.error ?? "Unable to delete inbox item.");
      }

      setItems(data.items);
      if (form.id === id) {
        resetForm();
      }
      setStatus("Inbox item deleted.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to delete inbox item.");
    } finally {
      setBusy(false);
    }
  }

  async function sendToTinyThought(item: ContentInboxItem) {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(
        tinyThoughtDraftStorageKey,
        JSON.stringify(buildTinyThoughtDraft(item)),
      );
    }

    await updateItemStatus(item.id, "drafted", "Preparing Tiny Thought draft...");
    window.location.href = "/admin/tiny-thoughts?draft=inbox";
  }

  async function sendToProjectDraft(item: ContentInboxItem) {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(
        projectDraftStorageKey,
        JSON.stringify(buildProjectDraft(item)),
      );
    }

    await updateItemStatus(item.id, "drafted", "Preparing project draft...");
    window.location.href = "/admin/projects?draft=inbox";
  }

  async function sendToNowDraft(item: ContentInboxItem) {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(
        nowDraftStorageKey,
        JSON.stringify(buildNowDraft(item)),
      );
    }

    await updateItemStatus(item.id, "drafted", "Preparing Now card draft...");
    window.location.href = "/admin/now?draft=inbox";
  }

  async function sendToWritingDraft(item: ContentInboxItem) {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(
        writingDraftStorageKey,
        JSON.stringify(
          buildWritingDraft({
            item,
            sourceLabel: sourceLabels.get(item.source) ?? item.source,
            bucketLabel: bucketLabels.get(item.bucket) ?? item.bucket,
          }),
        ),
      );
    }

    await updateItemStatus(item.id, "drafted", "Preparing writing draft...");
    window.location.href = "/admin/writing-drafts?draft=inbox";
  }

  const inboxCount = items.filter((item) => item.status === "inbox").length;
  const draftedCount = items.filter((item) => item.status === "drafted").length;
  const archivedCount = items.filter((item) => item.status === "archived").length;

  return (
    <main className="admin-page">
      <section className="admin-shell content-inbox-shell">
        <div className="admin-heading">
          <p className="eyebrow">Admin</p>
          <h1>Content Inbox</h1>
          <p>
            Capture fragments fast, bucket them without overthinking, and only
            turn the good ones into site-ready pieces later.
          </p>
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
              <button type="button" onClick={loadItems} disabled={busy}>
                Refresh
              </button>
              <button type="button" onClick={resetForm} disabled={busy}>
                New Capture
              </button>
              <button type="button" onClick={handleLogout} disabled={busy}>
                Log Out
              </button>
            </div>

            <details className="content-inbox-instructions admin-entry">
              <summary>
                <span>Instructions</span>
                <strong>Low-friction publishing flow</strong>
              </summary>
              <p className="content-inbox-instructions-note">
                This panel is sourced from <code>docs/low-friction-content-flow.md</code>, so updating that file updates the guidance shown here.
              </p>
              <pre className="content-inbox-instructions-body">
                {instructionsMarkdown.trim() || "Instructions are temporarily unavailable."}
              </pre>
            </details>

            <details className="content-inbox-instructions admin-entry">
              <summary>
                <span>Editorial Guide</span>
                <strong>Voice, tone, and publishing philosophy</strong>
              </summary>
              <p className="content-inbox-instructions-note">
                This panel is sourced from <code>docs/EDITORIAL-GUIDE.md</code>, so updating that
                file updates the guidance shown here.
              </p>
              <pre className="content-inbox-instructions-body">
                {editorialGuideMarkdown.trim() || "Editorial guide is temporarily unavailable."}
              </pre>
            </details>

            <div className="content-inbox-stats">
              <span>{inboxCount} inbox</span>
              <span>{draftedCount} drafted</span>
              <span>{archivedCount} archived</span>
            </div>

            <form className="admin-login content-inbox-form" onSubmit={saveItem}>
              <label>
                <span>Title or hook</span>
                <input
                  type="text"
                  value={form.title}
                  onChange={(event) => updateForm("title", event.target.value)}
                  placeholder="Optional: what is this about?"
                />
              </label>
              <label className="projects-admin-wide">
                <span>Captured fragment</span>
                <textarea
                  value={form.content}
                  onChange={(event) => updateForm("content", event.target.value)}
                  placeholder="Paste the useful paragraph, bullet list, idea, quote, or note here."
                />
              </label>
              <label>
                <span>Source</span>
                <select
                  value={form.source}
                  onChange={(event) =>
                    updateForm("source", event.target.value as ContentInboxSource)
                  }
                >
                  {contentInboxSources.map((source) => (
                    <option key={source} value={source}>
                      {sourceLabels.get(source)}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Bucket</span>
                <select
                  value={form.bucket}
                  onChange={(event) =>
                    updateForm("bucket", event.target.value as ContentInboxBucket)
                  }
                >
                  {contentInboxBuckets.map((bucket) => (
                    <option key={bucket} value={bucket}>
                      {bucketLabels.get(bucket)}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Status</span>
                <select
                  value={form.status}
                  onChange={(event) =>
                    updateForm("status", event.target.value as ContentInboxStatus)
                  }
                >
                  {contentInboxStatuses.map((itemStatus) => (
                    <option key={itemStatus} value={itemStatus}>
                      {statusLabels.get(itemStatus)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="projects-admin-wide">
                <span>Why keep this?</span>
                <textarea
                  value={form.notes}
                  onChange={(event) => updateForm("notes", event.target.value)}
                  placeholder="Optional note: why it matters, what it could become, or what needs cleanup."
                />
              </label>
              <div className="content-inbox-form-actions">
                <button type="submit" disabled={busy || !form.content.trim()}>
                  {busy ? "Saving..." : isEditing ? "Save Inbox Item" : "Capture Inbox Item"}
                </button>
                <button type="button" disabled={busy || !formDirty} onClick={resetForm}>
                  Reset
                </button>
              </div>
            </form>
          </>
        )}

        <p className="guestbook-status" aria-live="polite">
          {status}
        </p>

        {authenticated ? (
          <div className="admin-entry-list content-inbox-list">
            {items.map((item) => (
              <article className="admin-entry content-inbox-card" key={item.id}>
                <div className="admin-entry-meta">
                  <span>{bucketLabels.get(item.bucket) ?? item.bucket}</span>
                  <span>{sourceLabels.get(item.source) ?? item.source}</span>
                  <span>{statusLabels.get(item.status) ?? item.status}</span>
                </div>
                <h2>{item.title || "Untitled fragment"}</h2>
                <p>{summarize(item.content, 260)}</p>
                {item.notes ? <p className="content-inbox-notes">{item.notes}</p> : null}
                <div className="admin-entry-actions content-inbox-actions">
                  <button type="button" disabled={busy} onClick={() => editItem(item)}>
                    Edit
                  </button>
                  <button type="button" disabled={busy} onClick={() => void sendToTinyThought(item)}>
                    Send To Tiny Thought
                  </button>
                  <button type="button" disabled={busy} onClick={() => void sendToProjectDraft(item)}>
                    Send To Project Draft
                  </button>
                  <button type="button" disabled={busy} onClick={() => void sendToNowDraft(item)}>
                    Send To Now Draft
                  </button>
                  <button type="button" disabled={busy} onClick={() => void sendToWritingDraft(item)}>
                    Send To Writing Draft
                  </button>
                  {item.status !== "archived" ? (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void updateItemStatus(item.id, "archived", "Archiving inbox item...")}
                    >
                      Archive
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void updateItemStatus(item.id, "inbox", "Moving item back to inbox...")}
                    >
                      Return To Inbox
                    </button>
                  )}
                  <button
                    className="admin-danger"
                    type="button"
                    disabled={busy}
                    onClick={() => void deleteItem(item.id)}
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
