"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  projectPriorityOptions,
  projectStatuses,
  type ProjectStatus,
  type SiteProject,
} from "./lib/projects";

const statusLabels = new Map<ProjectStatus, string>([
  ["active", "Active"],
  ["paused", "Paused"],
  ["planning", "Planning"],
  ["shipped", "Shipped"],
  ["archived", "Archived"],
]);

function emptyProject(): SiteProject {
  return {
    id: crypto.randomUUID(),
    type: "",
    title: "",
    description: "",
    href: "",
    imageUrl: "",
    status: "planning",
    phase: "",
    nextAction: "None",
    blockers: "",
    priority: 3,
    lastUpdatedAt: new Date().toISOString().slice(0, 10),
    includeInContextRefresh: true,
  };
}

function projectFingerprint(projects: SiteProject[]) {
  return JSON.stringify(projects);
}

export function AdminProjects() {
  const [authenticated, setAuthenticated] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [projects, setProjects] = useState<SiteProject[]>([]);
  const [savedProjects, setSavedProjects] = useState<SiteProject[]>([]);
  const [status, setStatus] = useState("Checking admin session...");
  const [busy, setBusy] = useState(false);
  const [uploadingProjectId, setUploadingProjectId] = useState("");
  const uploading = Boolean(uploadingProjectId);
  const dirty = useMemo(
    () => projectFingerprint(projects) !== projectFingerprint(savedProjects),
    [projects, savedProjects],
  );

  async function loadProjects() {
    const response = await fetch("/api/admin/projects");

    if (!response.ok) {
      throw new Error("Unable to load projects.");
    }

    const data = (await response.json()) as { projects: SiteProject[] };

    setProjects(data.projects);
    setSavedProjects(data.projects);
    setStatus(data.projects.length ? "Projects loaded." : "No projects yet.");
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
        await loadProjects();
      } else {
        setStatus("Sign in from the admin dashboard to edit projects.");
      }
    }

    loadSession().catch(() => setStatus("Projects admin is temporarily unavailable."));
  }, []);

  async function handleLogout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    setAuthenticated(false);
    setProjects([]);
    setSavedProjects([]);
    setStatus("Signed out.");
  }

  function updateProject(
    id: string,
    field: keyof SiteProject,
    value: string | number | boolean,
  ) {
    setProjects((currentProjects) =>
      currentProjects.map((project) =>
        project.id === id ? { ...project, [field]: value } : project,
      ),
    );
  }

  function addProject() {
    setProjects((currentProjects) => [...currentProjects, emptyProject()]);
    setStatus("New project draft added.");
  }

  function deleteProject(id: string) {
    const project = projects.find((candidate) => candidate.id === id);
    const confirmed = window.confirm(
      `Delete ${project?.title || "this project"} from the draft list? Save changes to make it permanent.`,
    );

    if (!confirmed) {
      return;
    }

    setProjects((currentProjects) =>
      currentProjects.filter((project) => project.id !== id),
    );
    setStatus("Project removed from draft list. Save changes to persist.");
  }

  async function saveProjects() {
    setBusy(true);
    setStatus("Saving projects...");

    try {
      const response = await fetch("/api/admin/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projects }),
      });
      const data = (await response.json()) as {
        projects?: SiteProject[];
        error?: string;
      };

      if (!response.ok || !data.projects) {
        throw new Error(data.error ?? "Unable to save projects.");
      }

      setProjects(data.projects);
      setSavedProjects(data.projects);
      setStatus("Projects saved.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save projects.");
    } finally {
      setBusy(false);
    }
  }

  async function uploadProjectImage(projectId: string, file: File | null) {
    if (!file) {
      setStatus("Choose an image file to upload.");
      return;
    }

    setUploadingProjectId(projectId);
    setStatus("Uploading project image...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/projects/upload", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as {
        imageUrl?: string;
        error?: string;
      };

      if (!response.ok || !data.imageUrl) {
        throw new Error(data.error ?? "Unable to upload project image.");
      }

      updateProject(projectId, "imageUrl", data.imageUrl);
      setStatus("Project image uploaded. Save changes to persist.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to upload image.");
    } finally {
      setUploadingProjectId("");
    }
  }

  return (
    <main className="admin-page">
      <section className="admin-shell projects-admin-shell">
        <div className="admin-heading">
          <p className="eyebrow">Admin</p>
          <h1>Edit Projects</h1>
          <p>Create, edit, delete, and save the projects shown on the homepage.</p>
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
              <button type="button" onClick={loadProjects} disabled={busy || uploading}>
                Refresh
              </button>
              <button type="button" onClick={addProject} disabled={busy || uploading}>
                Add Project
              </button>
              <button type="button" onClick={saveProjects} disabled={busy || uploading || !dirty}>
                {dirty ? "Save Changes" : "Saved"}
              </button>
              <button type="button" onClick={handleLogout} disabled={busy || uploading}>
                Log Out
              </button>
            </div>

            <div className="admin-entry-list projects-admin-list">
              {projects.map((project, index) => (
                <article className="admin-entry projects-admin-card" key={project.id}>
                  <div className="admin-entry-meta">
                    <span>Project {index + 1}</span>
                    {project.lastUpdatedAt ? (
                      <time dateTime={project.lastUpdatedAt}>
                        Updated {project.lastUpdatedAt}
                      </time>
                    ) : null}
                  </div>

                  <div className="projects-admin-form">
                    <label>
                      <span>Type</span>
                      <input
                        type="text"
                        value={project.type}
                        placeholder="Dating product"
                        onChange={(event) =>
                          updateProject(project.id, "type", event.target.value)
                        }
                      />
                    </label>
                    <label>
                      <span>Title</span>
                      <input
                        type="text"
                        value={project.title}
                        placeholder="SoftSignal"
                        onChange={(event) =>
                          updateProject(project.id, "title", event.target.value)
                        }
                      />
                    </label>
                    <label className="projects-admin-wide">
                      <span>Description</span>
                      <textarea
                        value={project.description}
                        onChange={(event) =>
                          updateProject(project.id, "description", event.target.value)
                        }
                      />
                    </label>
                    <label className="projects-admin-wide">
                      <span>GitHub project or webpage</span>
                      <input
                        type="text"
                        value={project.href}
                        placeholder="https://github.com/... or /local-page"
                        onChange={(event) =>
                          updateProject(project.id, "href", event.target.value)
                        }
                      />
                    </label>
                    <div className="projects-admin-wide projects-admin-image-field">
                      <span>Project image</span>
                      {project.imageUrl ? (
                        <div className="projects-admin-image-preview">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={project.imageUrl}
                            alt={`${project.title || "Project"} preview`}
                            className="projects-admin-image"
                          />
                          <button
                            type="button"
                            disabled={busy || uploadingProjectId === project.id}
                            onClick={() => {
                              updateProject(project.id, "imageUrl", "");
                              setStatus("Project image removed from draft. Save changes to persist.");
                            }}
                          >
                            Remove Image
                          </button>
                        </div>
                      ) : null}
                      <label>
                        <span>Upload image file</span>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/gif,image/webp"
                          disabled={busy || uploadingProjectId === project.id}
                          onChange={(event) => {
                            uploadProjectImage(
                              project.id,
                              event.target.files?.[0] ?? null,
                            );
                            event.target.value = "";
                          }}
                        />
                        <small className="guestbook-help">PNG, JPG, GIF, or WebP. 5 MB max.</small>
                      </label>
                      {uploadingProjectId === project.id ? (
                        <small className="guestbook-help">Uploading...</small>
                      ) : null}
                    </div>
                    <label>
                      <span>Project status</span>
                      <select
                        value={project.status}
                        onChange={(event) =>
                          updateProject(
                            project.id,
                            "status",
                            event.target.value as ProjectStatus,
                          )
                        }
                      >
                        {projectStatuses.map((projectStatus) => (
                          <option key={projectStatus} value={projectStatus}>
                            {statusLabels.get(projectStatus)}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      <span>Phase</span>
                      <input
                        type="text"
                        value={project.phase}
                        onChange={(event) =>
                          updateProject(project.id, "phase", event.target.value)
                        }
                      />
                    </label>
                    <label>
                      <span>Next Action</span>
                      <input
                        type="text"
                        value={project.nextAction}
                        onChange={(event) =>
                          updateProject(project.id, "nextAction", event.target.value)
                        }
                      />
                    </label>
                    <label className="projects-admin-wide">
                      <span>Blockers</span>
                      <textarea
                        value={project.blockers}
                        placeholder="One blocker per line"
                        onChange={(event) =>
                          updateProject(project.id, "blockers", event.target.value)
                        }
                      />
                    </label>
                    <label>
                      <span>Priority</span>
                      <select
                        value={project.priority}
                        onChange={(event) =>
                          updateProject(project.id, "priority", Number(event.target.value))
                        }
                      >
                        {projectPriorityOptions.map((priority) => (
                          <option key={priority.value} value={priority.value}>
                            {priority.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      <span>Last Updated At</span>
                      <input
                        type="date"
                        value={project.lastUpdatedAt}
                        onChange={(event) =>
                          updateProject(project.id, "lastUpdatedAt", event.target.value)
                        }
                      />
                    </label>
                    <label className="projects-admin-checkbox">
                      <input
                        type="checkbox"
                        checked={project.includeInContextRefresh}
                        onChange={(event) =>
                          updateProject(
                            project.id,
                            "includeInContextRefresh",
                            event.target.checked,
                          )
                        }
                      />
                      <span>Include in Context Refresh</span>
                    </label>
                  </div>

                  <div className="admin-entry-actions">
                    <button
                      className="admin-danger"
                      type="button"
                      disabled={busy}
                      onClick={() => deleteProject(project.id)}
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
