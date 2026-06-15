"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { AdminGuestbookEntry } from "./lib/guestbook";

const categoryLabels = new Map([
  ["music", "Music recommendation"],
  ["arcade", "Arcade memory"],
  ["cat", "Cat story"],
  ["twin-peaks", "Twin Peaks note"],
  ["site-note", "Site note"],
  ["other", "Something else"],
]);

export function AdminGuestbook() {
  const [authenticated, setAuthenticated] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [entries, setEntries] = useState<AdminGuestbookEntry[]>([]);
  const [status, setStatus] = useState("Checking admin session...");
  const [busyId, setBusyId] = useState<string | null>(null);

  async function loadPendingEntries() {
    const response = await fetch("/api/admin/guestbook");

    if (!response.ok) {
      throw new Error("Unable to load pending entries.");
    }

    const data = (await response.json()) as { entries: AdminGuestbookEntry[] };
    setEntries(data.entries);
    setStatus(data.entries.length ? "" : "No guestbook signals.");
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
        await loadPendingEntries();
      } else {
        setStatus("Sign in from the admin dashboard to review pending signals.");
      }
    }

    loadSession().catch(() => setStatus("Admin guestbook is temporarily unavailable."));
  }, []);

  async function handleLogout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    setAuthenticated(false);
    setEntries([]);
    setStatus("Signed out.");
  }

  async function moderateEntry(id: string, action: "approve" | "reject" | "delete") {
    if (action === "delete") {
      const confirmed = window.confirm(
        "Delete this guestbook entry permanently? This cannot be undone.",
      );

      if (!confirmed) {
        return;
      }
    }

    setBusyId(id);
    setStatus(
      action === "approve"
        ? "Approving signal..."
        : action === "reject"
          ? "Rejecting signal..."
          : "Deleting signal...",
    );

    try {
      const response = await fetch("/api/admin/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      const data = (await response.json()) as {
        emailSent?: boolean;
        emailConfigured?: boolean;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to moderate entry.");
      }

      setEntries((currentEntries) => currentEntries.filter((entry) => entry.id !== id));
      setStatus(
        action === "approve"
          ? data.emailSent
            ? "Approved and email sent."
            : data.emailConfigured === false
              ? "Approved. Email sending is not configured."
              : "Approved."
          : action === "reject"
            ? "Rejected."
            : "Deleted.",
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to moderate entry.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="admin-page">
      <section className="admin-shell">
        <div className="admin-heading">
          <p className="eyebrow">Admin</p>
          <h1>Guestbook Review</h1>
          <p>Approve, reject, or delete guestbook entries and optional email copies.</p>
        </div>

        {!authenticated ? (
          <div className="admin-login">
            <p>This page requires an active admin session.</p>
            <Link className="admin-action-link" href="/admin" aria-disabled={!configured}>
              Open Admin Dashboard
            </Link>
          </div>
        ) : (
          <div className="admin-toolbar">
            <button type="button" onClick={loadPendingEntries}>
              Refresh
            </button>
            <button type="button" onClick={handleLogout}>
              Log Out
            </button>
          </div>
        )}

        <p className="guestbook-status" aria-live="polite">
          {status}
        </p>

        {authenticated ? (
          <div className="admin-entry-list">
            {entries.map((entry) => (
              <article className="admin-entry" key={entry.id}>
                <div className="admin-entry-meta">
                  <span>{categoryLabels.get(entry.category) ?? "Signal"}</span>
                  <span>{entry.status}</span>
                  <time dateTime={entry.createdAt}>
                    {new Intl.DateTimeFormat("en", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }).format(new Date(entry.createdAt))}
                  </time>
                </div>
                <p>{entry.message}</p>
                <dl>
                  <div>
                    <dt>Name</dt>
                    <dd>{entry.name}</dd>
                  </div>
                  <div>
                    <dt>Email</dt>
                    <dd>{entry.email || "Not provided"}</dd>
                  </div>
                  <div>
                    <dt>Email Notice</dt>
                    <dd>{entry.emailSent ? "Sent" : "Not sent"}</dd>
                  </div>
                </dl>
                <div className="admin-entry-actions">
                  {entry.status === "pending" ? (
                    <>
                      <button
                        type="button"
                        disabled={busyId === entry.id}
                        onClick={() => moderateEntry(entry.id, "approve")}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        disabled={busyId === entry.id}
                        onClick={() => moderateEntry(entry.id, "reject")}
                      >
                        Reject
                      </button>
                    </>
                  ) : null}
                  <button
                    className="admin-danger"
                    type="button"
                    disabled={busyId === entry.id}
                    onClick={() => moderateEntry(entry.id, "delete")}
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
