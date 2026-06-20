import { SectionHeading } from "../SectionHeading";
import { writings } from "../writings";

export function HomeWriting() {
  return (
    <section className="split-section" id="writing">
      <SectionHeading eyebrow="Writing" title="Essays from the booth by the window.">
        Notes on technology, identity, attention, grief, comedy, and the
        suspiciously heroic act of trying again tomorrow.
      </SectionHeading>
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
