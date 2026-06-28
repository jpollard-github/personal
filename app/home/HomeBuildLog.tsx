import Link from "next/link";
import { TrackedLink } from "../TrackedLink";
import { SectionHeading } from "../SectionHeading";
import { getRecentBuildLogEntries } from "../lib/build-log";

export function HomeBuildLog() {
  const entries = getRecentBuildLogEntries(3);

  return (
    <section className="content-section build-log-preview-section" id="build-log">
      <SectionHeading eyebrow="Build Log" title="Behind-the-scenes work worth noticing.">
        The site is still actively being tuned. If you want the short version
        of what changed behind the scenes lately, start here. If you want new
        things to read instead, head to Updates.
      </SectionHeading>
      <div className="build-log-preview-list" aria-label="Recent build log entries">
        {entries.map((entry) => (
          <article className="build-log-preview-item" key={entry.id}>
            <div className="update-meta">
              <span>{entry.category}</span>
              <time dateTime={entry.date}>{entry.date}</time>
            </div>
            <div className="build-log-preview-copy">
              <h3>{entry.title}</h3>
              <p>{entry.summary}</p>
            </div>
          </article>
        ))}
      </div>
      <TrackedLink
        className="list-panel-more"
        href="/build-log"
        trackingEvent="Build Log Link Clicked"
        trackingProperties={{ source: "homepage-preview" }}
      >
        Open the full work log
      </TrackedLink>
    </section>
  );
}
