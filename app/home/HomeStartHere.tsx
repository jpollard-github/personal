import { SectionHeading } from "../SectionHeading";
import { TrackedLink } from "../TrackedLink";
import { startHereCards } from "./data";

export function HomeStartHere() {
  return (
    <section className="content-section start-here-section" id="start-here">
      <SectionHeading eyebrow="New Here?" title="Start with one good door into ArcadeGhosts.">
        ArcadeGhosts is my personal site for software projects, writing,
        music, cats, and strange little experiments. If we just met, choose
        the path that sounds most like your kind of conversation and start
        there.
      </SectionHeading>
      <p className="start-here-kicker">
        Choose a lane: personal context, proof of active work, practical next
        step, or the warmer strange stuff.
      </p>
      <div className="start-here-grid" aria-label="Recommended first paths">
        {startHereCards.map((card) => (
          <TrackedLink
            className={`start-here-card start-here-card-${card.variant}`}
            href={card.href}
            key={card.title}
            trackingEvent="Start Here Card Clicked"
            trackingProperties={{
              title: card.title,
              destination: card.href,
            }}
          >
            <div className="start-here-card-topline">
              <span className="start-here-glyph" aria-hidden="true">
                {card.glyph}
              </span>
              <span className="card-eyebrow">{card.eyebrow}</span>
            </div>
            <h3>{card.title}</h3>
            <p>{card.text}</p>
            <small>
              <span className="start-here-audience-label">Best for:</span>{" "}
              {card.audience}
            </small>
            <span>{card.cta}</span>
          </TrackedLink>
        ))}
      </div>
    </section>
  );
}
