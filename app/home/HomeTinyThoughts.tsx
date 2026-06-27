import { SectionHeading } from "../SectionHeading";
import { TrackedLink } from "../TrackedLink";
import { TinyThoughts } from "../TinyThoughts";

export function HomeTinyThoughts() {
  return (
    <section className="content-section tiny-thought-section" id="tiny-thoughts">
      <SectionHeading eyebrow="Tiny Thoughts" title="Short signals from the counter.">
        Quick observations, lessons learned, funny experiences, opinions, and
        small notes that do not need to become full essays. Fresh counter
        signals land here first, but the fuller archive lives in its own room now.
      </SectionHeading>
      <div className="feed-links" aria-label="Tiny thought subscriptions">
        <TrackedLink
          className="feed-link"
          href="/tiny-thoughts"
          trackingEvent="Tiny Thoughts Link Clicked"
          trackingProperties={{ destination: "/tiny-thoughts", source: "homepage-feed-links" }}
        >
          Visit Tiny Thoughts Room
        </TrackedLink>
        <TrackedLink
          className="feed-link"
          href="/tiny-thoughts/rss.xml"
          trackingEvent="Tiny Thoughts Link Clicked"
          trackingProperties={{
            destination: "/tiny-thoughts/rss.xml",
            source: "homepage-feed-links",
          }}
        >
          Subscribe via RSS
        </TrackedLink>
      </div>
      <TinyThoughts limit={4} />
      <TrackedLink
        className="list-panel-more"
        href="/tiny-thoughts"
        trackingEvent="Tiny Thoughts Link Clicked"
        trackingProperties={{ destination: "/tiny-thoughts", source: "homepage-more-link" }}
      >
        Browse the full Tiny Thoughts archive
      </TrackedLink>
    </section>
  );
}
