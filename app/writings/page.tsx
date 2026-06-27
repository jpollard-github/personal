import type { Metadata } from "next";
import Link from "next/link";
import { writings } from "../writings";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Essays and reflections from Jason Pollard on technology, attention, grief, identity, and trying again tomorrow.",
  alternates: {
    canonical: "/writings",
  },
  openGraph: {
    title: "ArcadeGhosts Writing",
    description:
      "Essays and reflections from Jason Pollard on technology, grief, attention, identity, and other useful signals.",
    url: "/writings",
  },
};

export default function WritingsIndexPage() {
  return (
    <main className="writing-index-page">
      <section className="content-section writing-index-section">
        <Link className="back-link" href="/#writing">
          Back Home
        </Link>
        <div className="writing-index-header">
          <p className="eyebrow">Writing</p>
          <h1>Essays from the booth by the window.</h1>
          <p>
            A quieter room for longer reflections on technology, identity,
            grief, attention, comedy, and the suspiciously heroic act of trying
            again tomorrow.
          </p>
          <div className="feed-links" aria-label="Writing subscriptions">
            <a className="feed-link" href="/writings/rss.xml">
              Subscribe via RSS
            </a>
            <Link className="feed-link" href="/updates">
              See recent updates
            </Link>
          </div>
        </div>
        <div className="writing-index-grid">
          {writings.map((writing) => (
            <article className="writing-index-card" key={writing.slug}>
              <p className="card-eyebrow">
                <span aria-hidden="true">{writing.icon}</span> Writing
              </p>
              <h2>{writing.title}</h2>
              <p>{writing.description}</p>
              <Link className="project-link" href={`/writings/${writing.slug}`}>
                Read piece
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
