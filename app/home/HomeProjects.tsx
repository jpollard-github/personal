"use client";

import { useEffect, useState } from "react";
import { SectionHeading } from "../SectionHeading";
import { TrackedLink } from "../TrackedLink";
import type { SiteProject } from "../lib/projects";
import { formatProjectDate, projectCta, projectStatusLabels } from "./project-helpers";

function projectSurfaceLabel(href: string) {
  if (!href) {
    return "";
  }

  try {
    const url = new URL(href);

    return url.hostname === "github.com" ? "External repo" : "External site";
  } catch {
    return "On this site";
  }
}

function meaningfulText(value: string) {
  const trimmed = value.trim();

  return trimmed && trimmed.toLowerCase() !== "none" ? trimmed : "";
}

function blockerLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && line.toLowerCase() !== "none");
}

export function HomeProjects({ projects }: { projects: SiteProject[] }) {
  const [liveProjects, setLiveProjects] = useState(projects);

  useEffect(() => {
    let isMounted = true;

    async function loadProjects() {
      const response = await fetch("/api/projects", { cache: "no-store" });

      if (!response.ok) {
        throw new Error("Unable to load projects.");
      }

      const data = (await response.json()) as { projects: SiteProject[] };

      if (isMounted) {
        setLiveProjects(data.projects);
      }
    }

    loadProjects().catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="content-section" id="projects">
      <SectionHeading eyebrow="Projects" title="Shipped, active, paused, and becoming.">
        The workbench: products, games, tools, and experiments with visible
        status so the site feels current instead of frozen in amber.
      </SectionHeading>
      <div className="card-grid">
        {liveProjects.map((project) => (
          <article className="project-card" key={project.title}>
            {project.imageUrl ? (
              <div className="project-image-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.imageUrl}
                  alt={`${project.title} project image`}
                  className="project-image"
                />
              </div>
            ) : null}
            <div className="project-card-meta">
              <p className="card-eyebrow">{project.type}</p>
              <span>{projectStatusLabels.get(project.status) ?? project.status}</span>
            </div>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="project-details" aria-label={`${project.title} details`}>
              <p>
                <strong>Where it lives:</strong> {projectSurfaceLabel(project.href) || "TBD"}
              </p>
              {project.phase ? (
                <p>
                  <strong>Current phase:</strong> {project.phase}
                </p>
              ) : null}
              {meaningfulText(project.nextAction) ? (
                <p>
                  <strong>Next move:</strong> {project.nextAction}
                </p>
              ) : null}
              {blockerLines(project.blockers).length ? (
                <div className="project-blockers">
                  <strong>
                    Current blocker{blockerLines(project.blockers).length > 1 ? "s" : ""}:
                  </strong>
                  <ul>
                    {blockerLines(project.blockers).map((blocker) => (
                      <li key={blocker}>{blocker}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
            {project.lastUpdatedAt ? (
              <p className="project-updated">
                Last updated {formatProjectDate(project.lastUpdatedAt)}
              </p>
            ) : null}
            {project.href ? (
              <TrackedLink
                className="project-link"
                href={project.href}
                target="_blank"
                rel="noreferrer"
                trackingEvent="Project Link Clicked"
                trackingProperties={{
                  projectId: project.id,
                  title: project.title,
                  destination: project.href,
                  status: project.status,
                  type: project.type,
                }}
              >
                {projectCta(project.href)}
              </TrackedLink>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
