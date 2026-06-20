import { SectionHeading } from "../SectionHeading";
import { catCards } from "./data";

export function HomeCats() {
  return (
    <section className="content-section cats-section" id="cats">
      <SectionHeading eyebrow="Cats" title="Cat rooms, no endless hallway.">
        The cat galleries have moved into their own rooms so the homepage can
        breathe again.
      </SectionHeading>
      <div className="section-link-grid">
        {catCards.map((card) => (
          <a className="section-link-card" href={card.href} key={card.title}>
            <span className="card-eyebrow">{card.eyebrow}</span>
            <h3>{card.title}</h3>
            <p>{card.text}</p>
            <span>Visit</span>
          </a>
        ))}
      </div>
    </section>
  );
}
