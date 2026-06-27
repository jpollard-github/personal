import Link from "next/link";
import { TrackedLink } from "../TrackedLink";
import { SectionHeading } from "../SectionHeading";
import { getRecentBuildLogEntries } from "../lib/build-log";

export function HomeBuildLog() {
  const entries = getRecentBuildLogEntries(3);

  return (
    <section className="content-section build-log-preview-section" id="build-log">
      <SectionHeading eyebrow="Build Log" title="Recent changes worth noticing.">
        The site is still actively being tuned. If you want the short version
        of what changed lately, start here and then wander outward.
      </SectionHeading>
      <div className="build-log-preview-grid">
        {entries.map((entry) => (
          <article className="build-log-preview-card" key={entry.id}>
            <div className="update-meta">
              <span>{entry.category}</span>
              <time dateTime={entry.date}>{entry.date}</time>
            </div>
            <h3>{entry.title}</h3>
            <p>{entry.summary}</p>
          </article>
        ))}
      </div>
      <TrackedLink
        className="list-panel-more"
        href="/build-log"
        trackingEvent="Build Log Link Clicked"
        trackingProperties={{ source: "homepage-preview" }}
      >
        Open the full build log
      </TrackedLink>
    </section>
  );
}
