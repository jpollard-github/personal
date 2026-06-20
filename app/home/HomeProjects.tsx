import { SectionHeading } from "../SectionHeading";
import type { SiteProject } from "../lib/projects";
import { formatProjectDate, projectCta, projectStatusLabels } from "./project-helpers";

export function HomeProjects({ projects }: { projects: SiteProject[] }) {
  return (
    <section className="content-section" id="projects">
      <SectionHeading eyebrow="Projects" title="Shipped, active, paused, and becoming.">
        The workbench: products, games, tools, and experiments with visible
        status so the site feels current instead of frozen in amber.
      </SectionHeading>
      <div className="card-grid">
        {projects.map((project) => (
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
            {project.lastUpdatedAt ? (
              <p className="project-updated">
                Last updated {formatProjectDate(project.lastUpdatedAt)}
              </p>
            ) : null}
            {project.href ? (
              <a className="project-link" href={project.href} target="_blank" rel="noreferrer">
                {projectCta(project.href)}
              </a>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
