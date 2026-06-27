import type { Metadata } from "next";
import Link from "next/link";
import { formatTinyThoughtDate } from "../lib/tiny-thought-display";
import { getSiteUpdates } from "../lib/updates";

export const metadata: Metadata = {
  title: "Updates",
  description:
    "Recent writings and tiny thoughts from ArcadeGhosts collected in one running stream.",
  alternates: {
    canonical: "/updates",
  },
  openGraph: {
    title: "Updates",
    description:
      "Recent writings and tiny thoughts from ArcadeGhosts collected in one running stream.",
    url: "/updates",
  },
};

export const dynamic = "force-dynamic";

export default async function UpdatesPage() {
  const updates = await getSiteUpdates();

  return (
    <main className="updates-page">
      <section className="content-section updates-section">
        <Link className="back-link" href="/#top">
          Back Home
        </Link>
        <div className="updates-header">
          <p className="eyebrow">Updates</p>
          <h1>What changed in the booth.</h1>
          <p>
            A single stream for new essays and fresh counter signals, so return
            visits have somewhere obvious to begin.
          </p>
          <div className="feed-links" aria-label="Update subscriptions">
            <a className="feed-link" href="/writings/rss.xml">
              Writing RSS
            </a>
            <a className="feed-link" href="/tiny-thoughts/rss.xml">
              Tiny Thoughts RSS
            </a>
          </div>
        </div>

        <div className="updates-stream">
          {updates.map((update) => (
            <article className="update-card" key={update.id}>
              <div className="update-meta">
                <span>{update.eyebrow}</span>
                <time dateTime={update.createdAt}>
                  {formatTinyThoughtDate(update.createdAt, true)}
                </time>
              </div>
              <h2>
                <a href={update.href}>{update.title}</a>
              </h2>
              <p>{update.description}</p>
              <a className="update-link" href={update.href}>
                {update.type === "writing" ? "Read piece" : "Open signal"}
              </a>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
