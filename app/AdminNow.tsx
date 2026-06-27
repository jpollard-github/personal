"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { NowItem } from "./lib/now";
import { consumeSessionDraft } from "./lib/session-draft";

const nowDraftStorageKey = "arcadeghosts-now-draft";

function emptyNowItem(): NowItem {
  return {
    id: crypto.randomUUID(),
    label: "",
    title: "",
    text: "",
  };
}

function nowFingerprint(items: NowItem[]) {
  return JSON.stringify(items);
}

export function AdminNow() {
  const [authenticated, setAuthenticated] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [items, setItems] = useState<NowItem[]>([]);
  const [savedItems, setSavedItems] = useState<NowItem[]>([]);
  const [status, setStatus] = useState("Checking admin session...");
  const [busy, setBusy] = useState(false);
  const dirty = useMemo(
    () => nowFingerprint(items) !== nowFingerprint(savedItems),
    [items, savedItems],
  );

  async function loadItems() {
    const response = await fetch("/api/admin/now");

    if (!response.ok) {
      throw new Error("Unable to load Now cards.");
    }

    const data = (await response.json()) as { items: NowItem[] };
    let nextItems = data.items;
    let nextStatus = data.items.length ? "Now cards loaded." : "No Now cards yet.";

    if (typeof window !== "undefined") {
      const imported = consumeSessionDraft<Partial<NowItem>>(window.sessionStorage, nowDraftStorageKey);

      if (imported.value) {
        const nextItem = {
          ...emptyNowItem(),
          ...imported.value,
          id: crypto.randomUUID(),
        };
        nextItems = [...data.items, nextItem];
        nextStatus = "Imported draft from Content Inbox. Save changes when you're ready.";
      } else if (imported.parseError) {
        nextStatus = "A Now draft was found but could not be imported cleanly.";
      }
    }

    setItems(nextItems);
    setSavedItems(data.items);
    setStatus(nextStatus);
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
        setStatus("Sign in from the admin dashboard to edit Now cards.");
      }
    }

    loadSession().catch(() => setStatus("Now admin is temporarily unavailable."));
  }, []);

  async function handleLogout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    setAuthenticated(false);
    setItems([]);
    setSavedItems([]);
    setStatus("Signed out.");
  }

  function updateItem(id: string, field: keyof NowItem, value: string) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  }

  function addItem() {
    setItems((currentItems) => [...currentItems, emptyNowItem()]);
    setStatus("New Now card draft added.");
  }

  function deleteItem(id: string) {
    const item = items.find((candidate) => candidate.id === id);
    const confirmed = window.confirm(
      `Delete ${item?.title || "this Now card"} from the draft list? Save changes to make it permanent.`,
    );

    if (!confirmed) {
      return;
    }

    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
    setStatus("Now card removed from draft list. Save changes to persist.");
  }

  async function saveItems() {
    setBusy(true);
    setStatus("Saving Now cards...");

    try {
      const response = await fetch("/api/admin/now", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = (await response.json()) as {
        items?: NowItem[];
        error?: string;
      };

      if (!response.ok || !data.items) {
        throw new Error(data.error ?? "Unable to save Now cards.");
      }

      setItems(data.items);
      setSavedItems(data.items);
      setStatus("Now cards saved.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save Now cards.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="admin-page">
      <section className="admin-shell projects-admin-shell">
        <div className="admin-heading">
          <p className="eyebrow">Admin</p>
          <h1>Edit Now</h1>
          <p>Create, edit, delete, and save the Now cards shown on the homepage.</p>
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
              <button type="button" onClick={addItem} disabled={busy}>
                Add Now Card
              </button>
              <button type="button" onClick={saveItems} disabled={busy || !dirty}>
                {dirty ? "Save Changes" : "Saved"}
              </button>
              <button type="button" onClick={handleLogout} disabled={busy}>
                Log Out
              </button>
            </div>

            <div className="admin-entry-list projects-admin-list">
              {items.map((item, index) => (
                <article className="admin-entry projects-admin-card" key={item.id}>
                  <div className="admin-entry-meta">
                    <span>Now card {index + 1}</span>
                  </div>

                  <div className="projects-admin-form">
                    <label>
                      <span>Label</span>
                      <input
                        type="text"
                        value={item.label}
                        placeholder="Building"
                        onChange={(event) =>
                          updateItem(item.id, "label", event.target.value)
                        }
                      />
                    </label>
                    <label>
                      <span>Title</span>
                      <input
                        type="text"
                        value={item.title}
                        placeholder="ArcadeGhosts as a living portfolio"
                        onChange={(event) =>
                          updateItem(item.id, "title", event.target.value)
                        }
                      />
                    </label>
                    <label className="projects-admin-wide">
                      <span>Text</span>
                      <textarea
                        value={item.text}
                        onChange={(event) =>
                          updateItem(item.id, "text", event.target.value)
                        }
                      />
                    </label>
                  </div>

                  <div className="admin-entry-actions">
                    <button
                      className="admin-danger"
                      type="button"
                      disabled={busy}
                      onClick={() => deleteItem(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
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
