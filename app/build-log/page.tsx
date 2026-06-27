import type { Metadata } from "next";
import Link from "next/link";
import { TrackedLink } from "../TrackedLink";
import { getRecentBuildLogEntries, buildLogEntries } from "../lib/build-log";

export const metadata: Metadata = {
  title: "Build Log",
  description:
    "A running work log of recent ArcadeGhosts changes: shipped improvements, structural changes, editorial workflow updates, and performance passes.",
  alternates: {
    canonical: "/build-log",
  },
  openGraph: {
    title: "ArcadeGhosts Build Log",
    description:
      "Recent changes, experiments, fixes, and behind-the-scenes work shaping the site.",
    url: "/build-log",
  },
};

export default function BuildLogPage() {
  const highlighted = getRecentBuildLogEntries(3);

  return (
    <main className="updates-page">
      <section className="content-section updates-section build-log-section">
        <Link className="back-link" href="/#build-log">
          Back Home
        </Link>
        <div className="updates-header">
          <p className="eyebrow">Build Log</p>
          <h1>What changed behind the curtain.</h1>
          <p>
            A public work log for the site itself: shipped improvements, lighter
            assets, new editorial tools, stronger tests, and the occasional
            structural rearrangement of the neon forest.
          </p>
        </div>

        <div className="build-log-highlight" aria-label="Recent build log highlights">
          {highlighted.map((entry) => (
            <article className="build-log-highlight-card" key={entry.id}>
              <p className="card-eyebrow">{entry.category}</p>
              <h2>{entry.title}</h2>
              <p>{entry.summary}</p>
            </article>
          ))}
        </div>

        <div className="build-log-stream">
          {buildLogEntries.map((entry) => (
            <article className="build-log-card" key={entry.id}>
              <div className="update-meta">
                <span>{entry.category}</span>
                <time dateTime={entry.date}>{entry.date}</time>
              </div>
              <h2>{entry.title}</h2>
              <p>{entry.summary}</p>
              <ul className="build-log-points">
                {entry.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
              <p className="build-log-impact">
                <strong>Why it matters:</strong> {entry.impact}
              </p>
              {entry.href && entry.linkLabel ? (
                <TrackedLink
                  className="update-link"
                  href={entry.href}
                  trackingEvent="Build Log Link Clicked"
                  trackingProperties={{
                    entryId: entry.id,
                    destination: entry.href,
                    source: "build-log-page",
                  }}
                >
                  {entry.linkLabel}
                </TrackedLink>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
