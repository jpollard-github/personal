"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type {
  ContextRefreshExport,
  ContextRefreshVariant,
} from "./lib/context-refresh";

function countWords(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function formatDate(value: string) {
  if (!value) {
    return "Not saved yet";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function downloadMarkdown(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename || "ChatGPTContextRefresh.md";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function AdminContextRefresh() {
  const [authenticated, setAuthenticated] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [currentExport, setCurrentExport] = useState<ContextRefreshExport | null>(null);
  const [content, setContent] = useState("");
  const [savedContent, setSavedContent] = useState("");
  const [variant, setVariant] = useState<ContextRefreshVariant>("concise");
  const [redacted, setRedacted] = useState(true);
  const [status, setStatus] = useState("Checking admin session...");
  const [savedNoticeVisible, setSavedNoticeVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const wordCount = useMemo(() => countWords(content), [content]);
  const isDirty = Boolean(currentExport) && content !== savedContent;
  const overLimit = wordCount > 5000;

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
        setStatus("Create a ChatGPT context refresh file to start.");
      } else {
        setStatus("Sign in from the admin dashboard to manage context exports.");
      }
    }

    loadSession().catch(() => setStatus("Context Refresh Export admin is temporarily unavailable."));
  }, []);

  async function handleLogout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    setAuthenticated(false);
    setCurrentExport(null);
    setContent("");
    setSavedContent("");
    setStatus("Signed out.");
  }

  async function createExport(nextVariant = variant) {
    setBusy(true);
    setStatus("Creating context refresh export...");

    try {
      const response = await fetch("/api/admin/context-refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variant: nextVariant, redacted }),
      });
      const data = (await response.json()) as {
        export?: ContextRefreshExport;
        error?: string;
      };

      if (!response.ok || !data.export) {
        throw new Error(data.error ?? "Unable to create context refresh export.");
      }

      setCurrentExport(data.export);
      setContent(data.export.content);
      setSavedContent("");
      setVariant(data.export.variant);
      setRedacted(data.export.redacted);
      setStatus("Context refresh export created. Edit the Markdown, then save when ready.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to create export.");
    } finally {
      setBusy(false);
    }
  }

  async function saveExport() {
    if (!currentExport) {
      setStatus("Create an export before saving.");
      return;
    }

    setBusy(true);
    setStatus("Saving context refresh export...");

    try {
      const response = await fetch("/api/admin/context-refresh", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: currentExport.id, content }),
      });
      const data = (await response.json()) as {
        export?: ContextRefreshExport;
        error?: string;
      };

      if (!response.ok || !data.export) {
        throw new Error(data.error ?? "Unable to save context refresh export.");
      }

      setCurrentExport(data.export);
      setContent(data.export.content);
      setSavedContent(data.export.content);
      setSavedNoticeVisible(true);
      setStatus("Saved!");
      window.setTimeout(() => setSavedNoticeVisible(false), 2200);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save export.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="admin-page">
      <section className="admin-shell context-refresh-shell">
        <div className="admin-heading">
          <p className="eyebrow">Admin</p>
          <h1>Context Refresh Export</h1>
          <p>Create, edit, save, and download a Markdown context refresh for ChatGPT conversations.</p>
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
              <button type="button" onClick={handleLogout} disabled={busy}>
                Log Out
              </button>
            </div>

            <section className="admin-login context-refresh-controls">
              <label className="context-refresh-redaction">
                <input
                  type="checkbox"
                  checked={redacted}
                  onChange={(event) => setRedacted(event.target.checked)}
                />
                <span>Redact sensitive fields</span>
              </label>
              <p className="guestbook-help">
                Excludes or generalizes addresses, passwords, private names, financial details,
                medical details, API keys, and anything that should not be pasted into a chat.
              </p>
              <div className="context-refresh-create-grid">
                <button
                  type="button"
                  onClick={() => {
                    setVariant("concise");
                    createExport("concise");
                  }}
                  disabled={busy}
                >
                  <strong>Create ChatGPT Context Refresh File</strong>
                </button>
              </div>
            </section>

            {currentExport ? (
              <section className="admin-login context-refresh-editor">
                <div className="context-refresh-filebar">
                  <div>
                    <span>File</span>
                    <strong>{currentExport.filename}</strong>
                  </div>
                  <div>
                    <span>Saved</span>
                    <strong>{formatDate(currentExport.savedAt)}</strong>
                  </div>
                  <div>
                    <span>Words</span>
                    <strong className={overLimit ? "context-refresh-warning" : ""}>
                      {wordCount}
                    </strong>
                  </div>
                </div>

                {overLimit ? (
                  <p className="context-refresh-warning">
                    Warning: this export is over 5000 words. You can save it for now, but it may
                    be too long for a clean ChatGPT refresh.
                  </p>
                ) : null}

                <label>
                  <span>Markdown + YAML front matter</span>
                  <textarea
                    value={content}
                    spellCheck
                    onChange={(event) => setContent(event.target.value)}
                  />
                </label>

                <div className="admin-entry-actions">
                  <button type="button" onClick={saveExport} disabled={busy || !content}>
                    {isDirty ? "Save File" : "Saved"}
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadMarkdown(currentExport.filename, content)}
                    disabled={busy || !content}
                  >
                    Export
                  </button>
                </div>
              </section>
            ) : null}
          </>
        )}

        {savedNoticeVisible ? (
          <div className="context-refresh-toast" role="status" aria-live="polite">
            Saved!
          </div>
        ) : null}

        <p className="guestbook-status" aria-live="polite">
          {status}
        </p>
      </section>
    </main>
  );
}
