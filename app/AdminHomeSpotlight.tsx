"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  emptyHomeSpotlightQueueItem,
  type HomeSpotlightQueueItem,
  type HomeSpotlightRecord,
} from "./lib/home-spotlight";

const emptySpotlight: HomeSpotlightRecord = {
  id: "main",
  eyebrow: "Current Signal",
  title: "",
  text: "",
  linkLabel: "",
  linkHref: "#now",
  enabled: true,
};

function fingerprint(value: HomeSpotlightRecord) {
  return JSON.stringify(value);
}

export function AdminHomeSpotlight() {
  const [authenticated, setAuthenticated] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [spotlight, setSpotlight] = useState<HomeSpotlightRecord>(emptySpotlight);
  const [savedSpotlight, setSavedSpotlight] = useState<HomeSpotlightRecord>(emptySpotlight);
  const [queue, setQueue] = useState<HomeSpotlightQueueItem[]>([]);
  const [savedQueue, setSavedQueue] = useState<HomeSpotlightQueueItem[]>([]);
  const [status, setStatus] = useState("Checking admin session...");
  const [busy, setBusy] = useState(false);
  const dirty = useMemo(
    () =>
      fingerprint(spotlight) !== fingerprint(savedSpotlight) ||
      JSON.stringify(queue) !== JSON.stringify(savedQueue),
    [queue, savedQueue, savedSpotlight, spotlight],
  );

  async function loadSpotlight() {
    const response = await fetch("/api/admin/home-spotlight");

    if (!response.ok) {
      throw new Error("Unable to load home spotlight.");
    }

    const data = (await response.json()) as {
      spotlight: HomeSpotlightRecord;
      queue: HomeSpotlightQueueItem[];
    };
    setSpotlight(data.spotlight);
    setSavedSpotlight(data.spotlight);
    setQueue(data.queue);
    setSavedQueue(data.queue);
    setStatus("Home spotlight loaded.");
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
        await loadSpotlight();
      } else {
        setStatus("Sign in from the admin dashboard to edit the homepage spotlight.");
      }
    }

    loadSession().catch(() => setStatus("Home spotlight admin is temporarily unavailable."));
  }, []);

  async function handleLogout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    setAuthenticated(false);
    setStatus("Signed out.");
  }

  function updateField<K extends keyof HomeSpotlightRecord>(
    field: K,
    value: HomeSpotlightRecord[K],
  ) {
    setSpotlight((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateQueueItem<K extends keyof HomeSpotlightQueueItem>(
    id: string,
    field: K,
    value: HomeSpotlightQueueItem[K],
  ) {
    setQueue((currentQueue) =>
      currentQueue.map((item, index) =>
        item.id === id ? { ...item, [field]: value, displayOrder: index } : item,
      ),
    );
  }

  function addQueueItem() {
    setQueue((currentQueue) => [...currentQueue, emptyHomeSpotlightQueueItem(currentQueue.length)]);
    setStatus("Spotlight queue draft added.");
  }

  function deleteQueueItem(id: string) {
    setQueue((currentQueue) =>
      currentQueue
        .filter((item) => item.id !== id)
        .map((item, index) => ({ ...item, displayOrder: index })),
    );
    setStatus("Spotlight queue draft removed.");
  }

  async function saveSpotlight() {
    setBusy(true);
    setStatus("Saving spotlight...");

    try {
      const response = await fetch("/api/admin/home-spotlight", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spotlight, queue }),
      });
      const data = (await response.json()) as {
        spotlight?: HomeSpotlightRecord;
        queue?: HomeSpotlightQueueItem[];
        error?: string;
      };

      if (!response.ok || !data.spotlight || !data.queue) {
        throw new Error(data.error ?? "Unable to save spotlight.");
      }

      setSpotlight(data.spotlight);
      setSavedSpotlight(data.spotlight);
      setQueue(data.queue);
      setSavedQueue(data.queue);
      setStatus("Home spotlight saved.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save spotlight.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="admin-page">
      <section className="admin-shell projects-admin-shell">
        <div className="admin-heading">
          <p className="eyebrow">Admin</p>
          <h1>Homepage Spotlight</h1>
          <p>Control the curated spotlight near the top of the homepage.</p>
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
              <button type="button" onClick={loadSpotlight} disabled={busy}>
                Refresh
              </button>
              <button type="button" onClick={saveSpotlight} disabled={busy || !dirty}>
                {dirty ? "Save Spotlight" : "Saved"}
              </button>
              <button type="button" onClick={handleLogout} disabled={busy}>
                Log Out
              </button>
            </div>

            <div className="admin-entry">
              <div className="projects-admin-form">
                <label>
                  <span>Eyebrow</span>
                  <input
                    type="text"
                    value={spotlight.eyebrow}
                    onChange={(event) => updateField("eyebrow", event.target.value)}
                  />
                </label>
                <label>
                  <span>Link Label</span>
                  <input
                    type="text"
                    value={spotlight.linkLabel}
                    onChange={(event) => updateField("linkLabel", event.target.value)}
                  />
                </label>
                <label className="projects-admin-wide">
                  <span>Title</span>
                  <input
                    type="text"
                    value={spotlight.title}
                    onChange={(event) => updateField("title", event.target.value)}
                  />
                </label>
                <label className="projects-admin-wide">
                  <span>Text</span>
                  <textarea
                    value={spotlight.text}
                    onChange={(event) => updateField("text", event.target.value)}
                  />
                </label>
                <label className="projects-admin-wide">
                  <span>Link Href</span>
                  <input
                    type="text"
                    value={spotlight.linkHref}
                    placeholder="#now or /writings/..."
                    onChange={(event) => updateField("linkHref", event.target.value)}
                  />
                </label>
                <label className="projects-admin-checkbox">
                  <input
                    type="checkbox"
                    checked={spotlight.enabled}
                    onChange={(event) => updateField("enabled", event.target.checked)}
                  />
                  <span>Enable custom spotlight card</span>
                </label>
              </div>
            </div>

            <div className="admin-entry">
              <div className="admin-entry-meta">
                <span>Freshness</span>
              </div>
              <h2>Spotlight Queue</h2>
              <p>
                Add a few alternate spotlight cards here. If any queue items are enabled,
                the homepage rotates through them automatically on a day-by-day cadence.
              </p>
              <div className="admin-entry-actions">
                <button type="button" onClick={addQueueItem} disabled={busy}>
                  Add Queue Item
                </button>
              </div>
              <div className="admin-entry-list content-inbox-list">
                {queue.map((item, index) => (
                  <article className="admin-entry content-inbox-card" key={item.id}>
                    <div className="admin-entry-meta">
                      <span>Queue item {index + 1}</span>
                      <span>{item.enabled ? "enabled" : "disabled"}</span>
                    </div>
                    <div className="projects-admin-form">
                      <label>
                        <span>Eyebrow</span>
                        <input
                          type="text"
                          value={item.eyebrow}
                          onChange={(event) =>
                            updateQueueItem(item.id, "eyebrow", event.target.value)
                          }
                        />
                      </label>
                      <label>
                        <span>Link Label</span>
                        <input
                          type="text"
                          value={item.linkLabel}
                          onChange={(event) =>
                            updateQueueItem(item.id, "linkLabel", event.target.value)
                          }
                        />
                      </label>
                      <label className="projects-admin-wide">
                        <span>Title</span>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(event) =>
                            updateQueueItem(item.id, "title", event.target.value)
                          }
                        />
                      </label>
                      <label className="projects-admin-wide">
                        <span>Text</span>
                        <textarea
                          value={item.text}
                          onChange={(event) =>
                            updateQueueItem(item.id, "text", event.target.value)
                          }
                        />
                      </label>
                      <label className="projects-admin-wide">
                        <span>Link Href</span>
                        <input
                          type="text"
                          value={item.linkHref}
                          onChange={(event) =>
                            updateQueueItem(item.id, "linkHref", event.target.value)
                          }
                        />
                      </label>
                      <label className="projects-admin-checkbox">
                        <input
                          type="checkbox"
                          checked={item.enabled}
                          onChange={(event) =>
                            updateQueueItem(item.id, "enabled", event.target.checked)
                          }
                        />
                        <span>Enable this queue item</span>
                      </label>
                    </div>
                    <div className="admin-entry-actions">
                      <button
                        className="admin-danger"
                        type="button"
                        disabled={busy}
                        onClick={() => deleteQueueItem(item.id)}
                      >
                        Delete Queue Item
                      </button>
                    </div>
                  </article>
                ))}
              </div>
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
