import { SectionHeading } from "../SectionHeading";
import { TrackedLink } from "../TrackedLink";
import { writings } from "../writings";

export function HomeWriting() {
  const featuredWritings = writings.slice(0, 2);

  return (
    <section className="split-section" id="writing">
      <div>
        <SectionHeading eyebrow="Writing" title="Essays from the booth by the window.">
          Notes on technology, identity, attention, grief, comedy, and the
          suspiciously heroic act of trying again tomorrow.
        </SectionHeading>
        <div className="feed-links" aria-label="Writing subscriptions">
          <TrackedLink
            className="feed-link"
            href="/writings"
            trackingEvent="Writing Link Clicked"
            trackingProperties={{ destination: "/writings", source: "homepage-feed-links" }}
          >
            Open Writing Room
          </TrackedLink>
          <TrackedLink
            className="feed-link"
            href="/writings/rss.xml"
            trackingEvent="Writing Link Clicked"
            trackingProperties={{
              destination: "/writings/rss.xml",
              source: "homepage-feed-links",
            }}
          >
            Subscribe via RSS
          </TrackedLink>
        </div>
      </div>
      <div className="list-panel">
        {featuredWritings.map((writing) => (
          <TrackedLink
            href={`/writings/${writing.slug}`}
            key={writing.slug}
            trackingEvent="Writing Link Clicked"
            trackingProperties={{
              destination: `/writings/${writing.slug}`,
              source: "homepage-writing-preview",
              slug: writing.slug,
            }}
          >
            <span className="writing-icon" aria-hidden="true">
              {writing.icon}
            </span>
            <span>
              <span>{writing.title}</span>
              <small>{writing.description}</small>
            </span>
            <span aria-hidden="true">Read</span>
          </TrackedLink>
        ))}
        <TrackedLink
          className="list-panel-more"
          href="/writings"
          trackingEvent="Writing Link Clicked"
          trackingProperties={{ destination: "/writings", source: "homepage-writing-more" }}
        >
          See the full writing room
        </TrackedLink>
      </div>
    </section>
  );
}
