import { SectionHeading } from "../SectionHeading";
import { writings } from "../writings";

export function HomeWriting() {
  return (
    <section className="split-section" id="writing">
      <div>
        <SectionHeading eyebrow="Writing" title="Essays from the booth by the window.">
          Notes on technology, identity, attention, grief, comedy, and the
          suspiciously heroic act of trying again tomorrow.
        </SectionHeading>
        <div className="feed-links" aria-label="Writing subscriptions">
          <a className="feed-link" href="/writings/rss.xml">
            Subscribe via RSS
          </a>
        </div>
      </div>
      <div className="list-panel">
        {writings.map((writing) => (
          <a href={`/writings/${writing.slug}`} key={writing.slug}>
            <span className="writing-icon" aria-hidden="true">
              {writing.icon}
            </span>
            <span>
              <span>{writing.title}</span>
              <small>{writing.description}</small>
            </span>
            <span aria-hidden="true">Read</span>
          </a>
        ))}
      </div>
    </section>
  );
}
