import { SectionHeading } from "../SectionHeading";
import type { NowItem } from "../lib/now";

export function HomeNow({ items }: { items: NowItem[] }) {
  return (
    <section className="content-section now-section" id="now">
      <SectionHeading eyebrow="Now" title="What I&apos;m building and thinking about.">
        The current shape of the work: active projects, ideas that are still
        glowing, and the next practical moves that keep the whole thing alive.
      </SectionHeading>
      <div className="now-grid">
        {items.map((item) => (
          <article className="now-card" key={item.title}>
            <p className="card-eyebrow">{item.label}</p>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
