import { SectionHeading } from "../SectionHeading";
import { TinyThoughts } from "../TinyThoughts";

export function HomeTinyThoughts() {
  return (
    <section className="content-section tiny-thought-section" id="tiny-thoughts">
      <SectionHeading eyebrow="Tiny Thoughts" title="Short signals from the counter.">
        Quick observations, lessons learned, funny experiences, opinions, and
        small notes that do not need to become full essays. Fresh counter
        signals land here first.
      </SectionHeading>
      <div className="feed-links" aria-label="Tiny thought subscriptions">
        <a className="feed-link" href="/tiny-thoughts/rss.xml">
          Subscribe via RSS
        </a>
      </div>
      <TinyThoughts />
    </section>
  );
}
