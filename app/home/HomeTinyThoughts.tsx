import { SectionHeading } from "../SectionHeading";
import { TinyThoughts } from "../TinyThoughts";

export function HomeTinyThoughts() {
  return (
    <section className="content-section tiny-thought-section" id="tiny-thoughts">
      <SectionHeading eyebrow="Tiny Thoughts" title="Short signals from the counter.">
        Quick observations, lessons learned, funny experiences, opinions, and
        small notes that do not need to become full essays.
      </SectionHeading>
      <TinyThoughts />
    </section>
  );
}
