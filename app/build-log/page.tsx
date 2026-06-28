import type { Metadata } from "next";
import Link from "next/link";
import { TrackedLink } from "../TrackedLink";
import { getPublicBuildLogEntries } from "../lib/build-log";

const buildLogContextCards = [
  {
    eyebrow: "Human Context",
    title: "About Jason",
    text: "If you want the person behind the work log, this is the room that explains why the site sounds like this in the first place.",
    href: "/about",
    cta: "Read The About Room",
  },
  {
    eyebrow: "Next Step",
    title: "Work With Me",
    text: "If the work log makes you think, \"I need that kind of help,\" this is the practical path into scope, fit, and contact.",
    href: "/work-with-me",
    cta: "See How I Work",
  },
  {
    eyebrow: "Current Work",
    title: "Projects",
    text: "The build log shows the tuning. The workbench shows the broader set of things that are shipped, active, paused, and becoming.",
    href: "/#projects",
    cta: "Open The Workbench",
  },
];

export const metadata: Metadata = {
  title: "Build Log",
  description:
    "A running work log of recent ArcadeGhosts changes: shipped improvements, structural changes, editorial workflow updates, and performance passes behind the scenes.",
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
  const entries = getPublicBuildLogEntries();

  return (
    <main className="updates-page">
      <section className="content-section updates-section build-log-section">
        <Link className="back-link" href="/#build-log">
          Back Home
        </Link>
        <div className="updates-header">
          <p className="eyebrow">Build Log</p>
          <h1>Behind-the-scenes work on the site itself.</h1>
          <p>
            A public work log for the site itself: shipped improvements, lighter
            assets, new editorial tools, stronger tests, and the occasional
            structural rearrangement of the neon forest.
          </p>
          <p>
            This page is for site work and maintenance. If you want newly
            published writing and fresh signals to read, start with{" "}
            <Link href="/updates">Updates</Link>.
          </p>
          <p>
            If you are using this page as proof, the trust path is simple:
            About gives the human context, Projects shows the broader work, and
            Work With Me is the next step if you want help with something
            similar.
          </p>
          <p>
            If you want the person behind the work before you decide what any
            of this means, <Link href="/about">start with the human context on About</Link>.
          </p>
        </div>

        <div className="section-link-grid">
          {buildLogContextCards.map((card) => (
            <Link className="section-link-card" href={card.href} key={card.title}>
              <span className="card-eyebrow">{card.eyebrow}</span>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
              <span>{card.cta}</span>
            </Link>
          ))}
        </div>

        <div className="build-log-stream">
          {entries.map((entry) => (
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
