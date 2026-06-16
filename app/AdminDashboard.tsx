"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("Checking admin session...");

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

      setStatus(data.authenticated ? "Signed in. Choose an admin tool." : "Sign in once to manage the site.");
    }

    loadSession().catch(() => setStatus("Admin dashboard is temporarily unavailable."));
  }, []);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Checking password...");

    const response = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = (await response.json()) as { error?: string };

    if (!response.ok) {
      setStatus(data.error ?? "Unable to sign in.");
      return;
    }

    setUsername("");
    setPassword("");
    setAuthenticated(true);
    setStatus("Signed in. Choose an admin tool.");
  }

  async function handleLogout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    setAuthenticated(false);
    setStatus("Signed out.");
  }

  return (
    <main className="admin-page">
      <section className="admin-shell">
        <div className="admin-heading">
          <p className="eyebrow">Admin</p>
          <h1>Dashboard</h1>
          <p>Sign in once, then jump to the site tools that need review or editing.</p>
        </div>

        {!authenticated ? (
          <form className="admin-login" onSubmit={handleLogin}>
            <label>
              <span>Username</span>
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                disabled={!configured}
                autoComplete="username"
              />
            </label>
            <label>
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={!configured}
                autoComplete="current-password"
              />
            </label>
            <button type="submit" disabled={!configured}>
              Log In
            </button>
          </form>
        ) : (
          <>
            <div className="admin-toolbar">
              <button type="button" onClick={handleLogout}>
                Log Out
              </button>
            </div>

            <div className="admin-entry-list admin-dashboard-grid">
              <article className="admin-entry">
                <div className="admin-entry-meta">
                  <span>Review</span>
                </div>
                <h2>Guestbook</h2>
                <p>Approve, reject, or delete submitted guestbook signals.</p>
                <Link className="admin-action-link" href="/admin/guestbook">
                  Open Guestbook Review
                </Link>
              </article>
              <article className="admin-entry">
                <div className="admin-entry-meta">
                  <span>Publish</span>
                </div>
                <h2>Tiny Thoughts</h2>
                <p>Create, edit, view, and delete short posts for the homepage.</p>
                <Link className="admin-action-link" href="/admin/tiny-thoughts">
                  Open Tiny Thoughts
                </Link>
              </article>
              <article className="admin-entry">
                <div className="admin-entry-meta">
                  <span>Edit</span>
                </div>
                <h2>Projects</h2>
                <p>Create, edit, delete, and save homepage project cards.</p>
                <Link className="admin-action-link" href="/admin/projects">
                  Open Edit Projects
                </Link>
              </article>
              <article className="admin-entry">
                <div className="admin-entry-meta">
                  <span>Export</span>
                </div>
                <h2>Context Refresh Export</h2>
                <p>Create, edit, save, and download Markdown context refresh files for ChatGPT.</p>
                <Link className="admin-action-link" href="/admin/context-refresh">
                  Open Context Refresh Export
                </Link>
              </article>
            </div>
          </>
        )}

        <p className="guestbook-status" aria-live="polite">
          {status}
        </p>
      </section>
    </main>
  );
}
