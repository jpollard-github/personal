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

function projectFingerprint(project: SiteProject) {
  return JSON.stringify(project);
}

function replaceProject(projects: SiteProject[], nextProject: SiteProject) {
  return projects.map((project) =>
    project.id === nextProject.id ? nextProject : project,
  );
}

function moveProject(
  projects: SiteProject[],
  draggedProjectId: string,
  targetProjectId: string,
) {
  const draggedIndex = projects.findIndex((project) => project.id === draggedProjectId);
  const targetIndex = projects.findIndex((project) => project.id === targetProjectId);

  if (
    draggedIndex === -1 ||
    targetIndex === -1 ||
    draggedIndex === targetIndex
  ) {
    return projects;
  }

  const nextProjects = [...projects];
  const [draggedProject] = nextProjects.splice(draggedIndex, 1);
  nextProjects.splice(targetIndex, 0, draggedProject);

  return nextProjects;
}

function addId(ids: string[], id: string) {
  return ids.includes(id) ? ids : [...ids, id];
}

function removeId(ids: string[], id: string) {
  return ids.filter((candidate) => candidate !== id);
}

export function AdminProjects() {
  const [authenticated, setAuthenticated] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [projects, setProjects] = useState<SiteProject[]>([]);
  const [savedProjects, setSavedProjects] = useState<SiteProject[]>([]);
  const [expandedProjectIds, setExpandedProjectIds] = useState<string[]>([]);
  const [status, setStatus] = useState("Checking admin session...");
  const [busy, setBusy] = useState(false);
  const [savingProjectIds, setSavingProjectIds] = useState<string[]>([]);
  const [deletingProjectIds, setDeletingProjectIds] = useState<string[]>([]);
  const [uploadingProjectId, setUploadingProjectId] = useState("");
  const [reordering, setReordering] = useState(false);
  const [draggedProjectId, setDraggedProjectId] = useState("");
  const [dropTargetProjectId, setDropTargetProjectId] = useState("");

  const savedProjectsById = useMemo(
    () => new Map(savedProjects.map((project) => [project.id, project])),
    [savedProjects],
  );
  const expandedProjectIdSet = useMemo(
    () => new Set(expandedProjectIds),
    [expandedProjectIds],
  );

  async function loadProjects() {
    const response = await fetch("/api/admin/projects");

    if (!response.ok) {
      throw new Error("Unable to load projects.");
    }

    const data = (await response.json()) as { projects: SiteProject[] };

    setProjects(data.projects);
    setSavedProjects(data.projects);
    setExpandedProjectIds([]);
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

  async function refreshProjects() {
    setBusy(true);
    setStatus("Refreshing projects...");

    try {
      await loadProjects();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to refresh projects.");
    } finally {
      setBusy(false);
    }
  }

  async function handleLogout() {
    setBusy(true);

    try {
      await fetch("/api/admin/session", { method: "DELETE" });
      setAuthenticated(false);
      setProjects([]);
      setSavedProjects([]);
      setExpandedProjectIds([]);
      setStatus("Signed out.");
    } finally {
      setBusy(false);
    }
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
    const project = emptyProject();

    setProjects((currentProjects) => [...currentProjects, project]);
    setExpandedProjectIds((currentIds) => addId(currentIds, project.id));
    setStatus("New project draft added. Save it when you're ready.");
  }

  function toggleProjectExpanded(projectId: string) {
    setExpandedProjectIds((currentIds) =>
      currentIds.includes(projectId)
        ? removeId(currentIds, projectId)
        : addId(currentIds, projectId),
    );
  }

  async function saveProject(projectId: string) {
    const project = projects.find((candidate) => candidate.id === projectId);

    if (!project) {
      return;
    }

    const isNewProject = !savedProjectsById.has(projectId);

    setSavingProjectIds((currentIds) => addId(currentIds, projectId));
    setStatus(isNewProject ? "Creating project..." : "Saving project...");

    try {
      const response = await fetch("/api/admin/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project }),
      });
      const data = (await response.json()) as {
        project?: SiteProject;
        projects?: SiteProject[];
        error?: string;
      };

      if (!response.ok || !data.project || !data.projects) {
        throw new Error(data.error ?? "Unable to save project.");
      }

      setProjects((currentProjects) => replaceProject(currentProjects, data.project!));
      setSavedProjects(data.projects);
      setStatus(isNewProject ? "Project created." : "Project saved.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save project.");
    } finally {
      setSavingProjectIds((currentIds) => removeId(currentIds, projectId));
    }
  }

  async function deleteProject(projectId: string) {
    const project = projects.find((candidate) => candidate.id === projectId);
    const isSavedProject = savedProjectsById.has(projectId);
    const confirmed = window.confirm(
      `Delete ${project?.title || "this project"}${isSavedProject ? " permanently" : " from the draft list"}?`,
    );

    if (!confirmed) {
      return;
    }

    if (!isSavedProject) {
      setProjects((currentProjects) =>
        currentProjects.filter((candidate) => candidate.id !== projectId),
      );
      setExpandedProjectIds((currentIds) => removeId(currentIds, projectId));
      setStatus("Unsaved project draft removed.");
      return;
    }

    setDeletingProjectIds((currentIds) => addId(currentIds, projectId));
    setStatus("Deleting project...");

    try {
      const response = await fetch("/api/admin/projects", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: projectId }),
      });
      const data = (await response.json()) as {
        projects?: SiteProject[];
        error?: string;
      };

      if (!response.ok || !data.projects) {
        throw new Error(data.error ?? "Unable to delete project.");
      }

      setProjects((currentProjects) =>
        currentProjects.filter((candidate) => candidate.id !== projectId),
      );
      setSavedProjects(data.projects);
      setExpandedProjectIds((currentIds) => removeId(currentIds, projectId));
      setStatus("Project deleted.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to delete project.");
    } finally {
      setDeletingProjectIds((currentIds) => removeId(currentIds, projectId));
    }
  }

  async function saveProjectOrder(nextProjects: SiteProject[], previousProjects: SiteProject[]) {
    const orderedIds = nextProjects
      .filter((project) => savedProjectsById.has(project.id))
      .map((project) => project.id);

    setReordering(true);
    setStatus("Saving project order...");

    try {
      const response = await fetch("/api/admin/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });
      const data = (await response.json()) as {
        projects?: SiteProject[];
        error?: string;
      };

      if (!response.ok || !data.projects) {
        throw new Error(data.error ?? "Unable to save project order.");
      }

      setSavedProjects(data.projects);
      setStatus("Project order saved.");
    } catch (error) {
      setProjects(previousProjects);
      setStatus(
        error instanceof Error ? error.message : "Unable to save project order.",
      );
    } finally {
      setReordering(false);
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
      setStatus("Project image uploaded. Save this project to persist the change.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to upload image.");
    } finally {
      setUploadingProjectId("");
    }
  }

  const isAnyProjectSaving = savingProjectIds.length > 0;

  return (
    <main className="admin-page">
      <section className="admin-shell projects-admin-shell">
        <div className="admin-heading">
          <p className="eyebrow">Admin</p>
          <h1>Edit Projects</h1>
          <p>Create, edit, delete, and reorder the projects shown on the homepage.</p>
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
              <button type="button" onClick={refreshProjects} disabled={busy || reordering}>
                Refresh
              </button>
              <button
                type="button"
                onClick={addProject}
                disabled={busy || reordering || isAnyProjectSaving}
              >
                Add Project
              </button>
              <button
                type="button"
                onClick={() => setExpandedProjectIds(projects.map((project) => project.id))}
                disabled={!projects.length || busy || reordering}
              >
                Expand All
              </button>
              <button
                type="button"
                onClick={() => setExpandedProjectIds([])}
                disabled={!expandedProjectIds.length || busy || reordering}
              >
                Collapse All
              </button>
              <button type="button" onClick={handleLogout} disabled={busy || reordering}>
                Log Out
              </button>
            </div>

            <p className="guestbook-help projects-admin-help">
              Drag collapsed saved cards to reorder them. New drafts need to be saved
              before they can be moved.
            </p>

            <div className="admin-entry-list projects-admin-list">
              {projects.map((project, index) => {
                const savedProject = savedProjectsById.get(project.id);
                const isExpanded = expandedProjectIdSet.has(project.id);
                const isSavedProject = Boolean(savedProject);
                const isDirty =
                  !savedProject ||
                  projectFingerprint(project) !== projectFingerprint(savedProject);
                const isSaving = savingProjectIds.includes(project.id);
                const isDeleting = deletingProjectIds.includes(project.id);
                const isUploading = uploadingProjectId === project.id;
                const canDrag =
                  isSavedProject &&
                  !isExpanded &&
                  !busy &&
                  !reordering &&
                  !isSaving &&
                  !isDeleting &&
                  !isUploading;
                const isDragged = draggedProjectId === project.id;
                const isDropTarget = dropTargetProjectId === project.id;
                const projectLabel = project.title.trim() || `Project ${index + 1}`;
                const projectType = project.type.trim() || "No type yet";
                const projectStatus = statusLabels.get(project.status) ?? "Unknown";
                const summaryDescription =
                  project.description.trim() || "No description yet.";

                return (
                  <article
                    className={[
                      "admin-entry",
                      "projects-admin-card",
                      !isExpanded ? "projects-admin-card-collapsed" : "",
                      isDragged ? "projects-admin-card-dragging" : "",
                      isDropTarget ? "projects-admin-card-drop-target" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    key={project.id}
                    onDragOver={(event) => {
                      if (!draggedProjectId || draggedProjectId === project.id || !canDrag) {
                        return;
                      }

                      event.preventDefault();
                      setDropTargetProjectId(project.id);
                    }}
                    onDrop={(event) => {
                      event.preventDefault();

                      if (!draggedProjectId || draggedProjectId === project.id || !isSavedProject) {
                        setDropTargetProjectId("");
                        return;
                      }

                      const draggedProject = projects.find(
                        (candidate) => candidate.id === draggedProjectId,
                      );

                      if (!draggedProject || !savedProjectsById.has(draggedProject.id)) {
                        setDraggedProjectId("");
                        setDropTargetProjectId("");
                        return;
                      }

                      const previousProjects = projects;
                      const nextProjects = moveProject(
                        projects,
                        draggedProjectId,
                        project.id,
                      );

                      if (nextProjects === projects) {
                        setDraggedProjectId("");
                        setDropTargetProjectId("");
                        return;
                      }

                      setProjects(nextProjects);
                      setDraggedProjectId("");
                      setDropTargetProjectId("");
                      void saveProjectOrder(nextProjects, previousProjects);
                    }}
                  >
                    <div className="projects-admin-summary">
                      <div className="projects-admin-summary-copy">
                        <div className="admin-entry-meta projects-admin-summary-meta">
                          <span>{projectLabel}</span>
                          {project.lastUpdatedAt ? (
                            <time dateTime={project.lastUpdatedAt}>
                              Updated {project.lastUpdatedAt}
                            </time>
                          ) : (
                            <time>No update date</time>
                          )}
                        </div>

                        <div className="projects-admin-summary-grid">
                          <p className="projects-admin-summary-title">{projectType}</p>
                          <p className="projects-admin-summary-subtitle">
                            {projectStatus} • Priority {project.priority}
                          </p>
                          <p className="projects-admin-summary-description">
                            {summaryDescription}
                          </p>
                        </div>

                        <div className="projects-admin-badges">
                          <span className="projects-admin-badge">
                            {isSavedProject ? "Saved" : "New Draft"}
                          </span>
                          {isDirty ? (
                            <span className="projects-admin-badge projects-admin-badge-alert">
                              Unsaved Changes
                            </span>
                          ) : null}
                          {!isExpanded ? (
                            <span className="projects-admin-badge">Collapsed</span>
                          ) : null}
                        </div>
                      </div>

                      <div className="admin-entry-actions projects-admin-actions">
                        <button
                          className="projects-admin-drag-handle"
                          type="button"
                          draggable={canDrag}
                          disabled={!canDrag}
                          aria-label={`Drag to reorder ${projectLabel}`}
                          onDragStart={(event) => {
                            if (!canDrag) {
                              event.preventDefault();
                              return;
                            }

                            event.dataTransfer.effectAllowed = "move";
                            event.dataTransfer.setData("text/plain", project.id);
                            setDraggedProjectId(project.id);
                          }}
                          onDragEnd={() => {
                            setDraggedProjectId("");
                            setDropTargetProjectId("");
                          }}
                        >
                          Move
                        </button>
                        <button
                          type="button"
                          disabled={busy || reordering || isSaving || isDeleting || isUploading || !isDirty}
                          onClick={() => void saveProject(project.id)}
                        >
                          {isSaving
                            ? "Saving..."
                            : isSavedProject
                              ? "Save Project"
                              : "Create Project"}
                        </button>
                        <button
                          type="button"
                          disabled={busy || reordering || isDeleting}
                          onClick={() => toggleProjectExpanded(project.id)}
                          aria-expanded={isExpanded}
                          aria-controls={`project-editor-${project.id}`}
                        >
                          {isExpanded ? "Collapse" : "Expand"}
                        </button>
                        <button
                          className="admin-danger"
                          type="button"
                          disabled={busy || reordering || isDeleting || isSaving}
                          onClick={() => void deleteProject(project.id)}
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>

                    {isExpanded ? (
                      <div className="projects-admin-form" id={`project-editor-${project.id}`}>
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
                                disabled={busy || isUploading || reordering}
                                onClick={() => {
                                  updateProject(project.id, "imageUrl", "");
                                  setStatus(
                                    "Project image removed from draft. Save this project to persist the change.",
                                  );
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
                              disabled={busy || isUploading || reordering}
                              onChange={(event) => {
                                void uploadProjectImage(
                                  project.id,
                                  event.target.files?.[0] ?? null,
                                );
                                event.target.value = "";
                              }}
                            />
                            <small className="guestbook-help">
                              PNG, JPG, GIF, or WebP. 5 MB max.
                            </small>
                          </label>
                          {isUploading ? (
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
                    ) : null}
                  </article>
                );
              })}
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
