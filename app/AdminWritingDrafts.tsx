"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  emptyWritingDraft,
  writingDraftStatuses,
  type WritingDraft,
  type WritingDraftStatus,
} from "./lib/writing-drafts";
import { writings } from "./writings";

const writingDraftStorageKey = "arcadeghosts-writing-draft";

const statusLabels = new Map<WritingDraftStatus, string>([
  ["draft", "Draft"],
  ["shaping", "Shaping"],
  ["ready", "Ready"],
  ["archived", "Archived"],
]);

type PublishResult = {
  slug: string;
  description: string;
  markdownPath: string;
  metadataPath: string;
  entrySnippet: string;
  entryExists: boolean;
  overwritten: boolean;
};

function fingerprint(draft: WritingDraft) {
  return JSON.stringify(draft);
}

function findPublishedWriting(slug: string) {
  const normalized = slug.trim().toLowerCase();

  if (!normalized) {
    return null;
  }

  return writings.find((writing) => writing.slug === normalized) ?? null;
}

export function AdminWritingDrafts() {
  const [authenticated, setAuthenticated] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [drafts, setDrafts] = useState<WritingDraft[]>([]);
  const [form, setForm] = useState<WritingDraft>(emptyWritingDraft());
  const [savedFingerprint, setSavedFingerprint] = useState(fingerprint(form));
  const [status, setStatus] = useState("Checking admin session...");
  const [busy, setBusy] = useState(false);
  const [publishResult, setPublishResult] = useState<PublishResult | null>(null);
  const [markdownSlugs, setMarkdownSlugs] = useState<string[]>([]);
  const isEditing = useMemo(() => drafts.some((draft) => draft.id === form.id), [drafts, form.id]);
  const dirty = fingerprint(form) !== savedFingerprint;
  const publishedWriting = useMemo(() => findPublishedWriting(form.slug), [form.slug]);
  const markdownExists = useMemo(() => {
    const normalized = form.slug.trim().toLowerCase();

    return normalized ? markdownSlugs.includes(normalized) : false;
  }, [form.slug, markdownSlugs]);

  async function loadDrafts() {
    const response = await fetch("/api/admin/writing-drafts");

    if (!response.ok) {
      throw new Error("Unable to load writing drafts.");
    }

    const data = (await response.json()) as {
      drafts: WritingDraft[];
      markdownSlugs?: string[];
    };
    setDrafts(data.drafts);
    setMarkdownSlugs(data.markdownSlugs ?? []);
    setStatus(data.drafts.length ? "Writing drafts loaded." : "No writing drafts yet.");
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
        await loadDrafts();
      } else {
        setStatus("Sign in from the admin dashboard to edit writing drafts.");
      }
    }

    loadSession().catch(() => setStatus("Writing drafts admin is temporarily unavailable."));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const rawDraft = window.sessionStorage.getItem(writingDraftStorageKey);

    if (!rawDraft) {
      return;
    }

    try {
      const parsed = JSON.parse(rawDraft) as Partial<WritingDraft>;
      const nextDraft = {
        ...emptyWritingDraft(),
        ...parsed,
        id: crypto.randomUUID(),
      };

      queueMicrotask(() => {
        setForm(nextDraft);
        setSavedFingerprint(fingerprint(nextDraft));
        setStatus("Imported draft from Content Inbox. Shape it, then save when ready.");
      });
    } catch {
      queueMicrotask(() => {
        setStatus("A writing draft was found in session storage but could not be imported cleanly.");
      });
    } finally {
      window.sessionStorage.removeItem(writingDraftStorageKey);
    }
  }, []);

  async function handleLogout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    setAuthenticated(false);
    setDrafts([]);
    setStatus("Signed out.");
  }

  function updateField<K extends keyof WritingDraft>(field: K, value: WritingDraft[K]) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function resetForm() {
    const nextDraft = emptyWritingDraft();
    setForm(nextDraft);
    setSavedFingerprint(fingerprint(nextDraft));
    setPublishResult(null);
    setStatus("New writing draft started.");
  }

  function editDraft(draft: WritingDraft) {
    setForm(draft);
    setSavedFingerprint(fingerprint(draft));
    setPublishResult(null);
    setStatus("Editing writing draft.");
  }

  async function saveDraft(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setStatus(isEditing ? "Saving writing draft..." : "Creating writing draft...");

    try {
      const response = await fetch("/api/admin/writing-drafts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft: form }),
      });
      const data = (await response.json()) as {
        draft?: WritingDraft;
        drafts?: WritingDraft[];
        markdownSlugs?: string[];
        error?: string;
      };

      if (!response.ok || !data.draft || !data.drafts) {
        throw new Error(data.error ?? "Unable to save writing draft.");
      }

      setDrafts(data.drafts);
      setMarkdownSlugs(data.markdownSlugs ?? []);
      setForm(data.draft);
      setSavedFingerprint(fingerprint(data.draft));
      setPublishResult(null);
      setStatus(isEditing ? "Writing draft saved." : "Writing draft created.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save writing draft.");
    } finally {
      setBusy(false);
    }
  }

  async function deleteDraft(id: string) {
    const confirmed = window.confirm("Delete this writing draft?");

    if (!confirmed) {
      return;
    }

    setBusy(true);
    setStatus("Deleting writing draft...");

    try {
      const response = await fetch("/api/admin/writing-drafts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = (await response.json()) as {
        drafts?: WritingDraft[];
        markdownSlugs?: string[];
        error?: string;
      };

      if (!response.ok || !data.drafts) {
        throw new Error(data.error ?? "Unable to delete writing draft.");
      }

      setDrafts(data.drafts);
      setMarkdownSlugs(data.markdownSlugs ?? []);
      if (form.id === id) {
        resetForm();
      }
      setStatus("Writing draft deleted.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to delete writing draft.");
    } finally {
      setBusy(false);
    }
  }

  async function exportDraftToWriting(overwrite = false) {
    setBusy(true);
    setStatus(overwrite ? "Overwriting writing markdown..." : "Exporting writing markdown...");

    try {
      const response = await fetch("/api/admin/writing-drafts/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draft: form, overwrite }),
      });
      const data = (await response.json()) as PublishResult & { error?: string };

      if (response.status === 409) {
        const confirmed = window.confirm(
          `${data.error}\n\nOverwrite the existing markdown file with this draft instead?`,
        );

        if (confirmed) {
          await exportDraftToWriting(true);
        } else {
          setStatus("Writing export canceled.");
        }
        return;
      }

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to export writing.");
      }

      setPublishResult(data);
      setStatus(
        data.entryExists
          ? "Writing markdown exported. A metadata entry already exists, so review it before changing anything."
          : "Writing markdown exported. Paste the generated entry into app/writings.ts when ready.",
      );

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(data.entrySnippet).catch(() => undefined);
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to export writing.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="admin-page">
      <section className="admin-shell content-inbox-shell">
        <div className="admin-heading">
          <p className="eyebrow">Admin</p>
          <h1>Writing Drafts</h1>
          <p>Shape longer-form ideas before they earn a real writing slot on the public site.</p>
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
              <button type="button" onClick={loadDrafts} disabled={busy}>
                Refresh
              </button>
              <button type="button" onClick={resetForm} disabled={busy}>
                New Draft
              </button>
              <button type="button" onClick={handleLogout} disabled={busy}>
                Log Out
              </button>
            </div>

            <form className="admin-login content-inbox-form" onSubmit={saveDraft}>
              <label>
                <span>Title</span>
                <input
                  type="text"
                  value={form.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  placeholder="What is this piece trying to become?"
                />
              </label>
              <label>
                <span>Slug</span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(event) => updateField("slug", event.target.value)}
                  placeholder="optional-writing-slug"
                />
              </label>
              <label>
                <span>Status</span>
                <select
                  value={form.status}
                  onChange={(event) =>
                    updateField("status", event.target.value as WritingDraftStatus)
                  }
                >
                  {writingDraftStatuses.map((draftStatus) => (
                    <option key={draftStatus} value={draftStatus}>
                      {statusLabels.get(draftStatus)}
                    </option>
                  ))}
                </select>
              </label>
              {publishedWriting ? (
                <div className="projects-admin-wide admin-entry writing-draft-match">
                  <div className="admin-entry-meta">
                    <span>Published match</span>
                    <span>{publishedWriting.slug}</span>
                  </div>
                  <h2>{publishedWriting.title}</h2>
                  <p>
                    This slug already exists in the public writings list. Editing this draft will not
                    update the public entry automatically, but you can review the live piece here.
                  </p>
                  <div className="admin-entry-actions">
                    <Link
                      className="admin-action-link"
                      href={`/writings/${publishedWriting.slug}`}
                      target="_blank"
                    >
                      Open Published Writing
                    </Link>
                  </div>
                </div>
              ) : null}
              {markdownExists ? (
                <div className="projects-admin-wide admin-entry writing-draft-match">
                  <div className="admin-entry-meta">
                    <span>Markdown file exists</span>
                    <span>{`${form.slug}.md`}</span>
                  </div>
                  <p>
                    A markdown file already exists at <code>{`public/writings/${form.slug}.md`}</code>.
                    Exporting again will ask whether you want to overwrite it.
                  </p>
                </div>
              ) : null}
              <label className="projects-admin-wide">
                <span>Summary</span>
                <textarea
                  value={form.summary}
                  onChange={(event) => updateField("summary", event.target.value)}
                  placeholder="Optional: one-paragraph summary of the piece."
                />
              </label>
              <label className="projects-admin-wide">
                <span>Body</span>
                <textarea
                  value={form.body}
                  onChange={(event) => updateField("body", event.target.value)}
                  placeholder="Draft the fuller idea here."
                />
              </label>
              <label className="projects-admin-wide">
                <span>Notes</span>
                <textarea
                  value={form.notes}
                  onChange={(event) => updateField("notes", event.target.value)}
                  placeholder="Why it matters, what it still needs, or where it might live."
                />
              </label>
              <div className="content-inbox-form-actions">
                <button type="submit" disabled={busy || !form.title.trim() || !form.body.trim()}>
                  {busy ? "Saving..." : isEditing ? "Save Writing Draft" : "Create Writing Draft"}
                </button>
                <button type="button" disabled={busy || !dirty} onClick={resetForm}>
                  Reset
                </button>
                <button
                  type="button"
                  disabled={busy || !form.title.trim() || !form.slug.trim() || !form.body.trim()}
                  onClick={() => void exportDraftToWriting()}
                >
                  Export Publish Bundle
                </button>
              </div>
            </form>

            {publishResult ? (
              <div className="admin-entry writing-draft-publish">
                <div className="admin-entry-meta">
                  <span>Publish prep</span>
                  <span>{publishResult.slug}</span>
                </div>
                <h2>Writing export ready</h2>
                <p>
                  Markdown was written to <code>{publishResult.markdownPath}</code>.
                  Paste the snippet below into <code>{publishResult.metadataPath}</code> when you want
                  this piece to appear in the public writings list.
                </p>
                <p>
                  {publishResult.entryExists
                    ? "An entry with this slug already appears to exist in app/writings.ts, so review before pasting."
                    : "The metadata snippet was copied to your clipboard when possible."}
                </p>
                {publishedWriting ? (
                  <p>
                    A public writing already exists at{" "}
                    <code>{`/writings/${publishedWriting.slug}`}</code>. Review that piece before replacing
                    any metadata or markdown.
                  </p>
                ) : null}
                <textarea
                  readOnly
                  value={publishResult.entrySnippet}
                  aria-label="Writing entry snippet"
                />
              </div>
            ) : null}
          </>
        )}

        <p className="guestbook-status" aria-live="polite">
          {status}
        </p>

        {authenticated ? (
          <div className="admin-entry-list content-inbox-list">
            {drafts.map((draft) => (
              <article className="admin-entry content-inbox-card" key={draft.id}>
                <div className="admin-entry-meta">
                  <span>{statusLabels.get(draft.status) ?? draft.status}</span>
                  <span>{draft.slug || "no slug yet"}</span>
                  {findPublishedWriting(draft.slug) ? <span>published match</span> : null}
                  {draft.slug && markdownSlugs.includes(draft.slug.trim().toLowerCase()) ? (
                    <span>markdown exists</span>
                  ) : null}
                </div>
                <h2>{draft.title}</h2>
                {draft.summary ? <p>{draft.summary}</p> : null}
                <p>{draft.body.slice(0, 280)}{draft.body.length > 280 ? "..." : ""}</p>
                {draft.notes ? <p className="content-inbox-notes">{draft.notes}</p> : null}
                <div className="admin-entry-actions content-inbox-actions">
                  <button type="button" disabled={busy} onClick={() => editDraft(draft)}>
                    Edit
                  </button>
                  {findPublishedWriting(draft.slug) ? (
                    <Link
                      className="admin-action-link"
                      href={`/writings/${draft.slug}`}
                      target="_blank"
                    >
                      Open Published Writing
                    </Link>
                  ) : null}
                  <button
                    className="admin-danger"
                    type="button"
                    disabled={busy}
                    onClick={() => void deleteDraft(draft.id)}
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
