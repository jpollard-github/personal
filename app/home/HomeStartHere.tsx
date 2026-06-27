import { SectionHeading } from "../SectionHeading";
import { TrackedLink } from "../TrackedLink";
import { startHereCards } from "./data";

export function HomeStartHere() {
  return (
    <section className="content-section start-here-section" id="start-here">
      <SectionHeading eyebrow="Start Here" title="Three good doors into ArcadeGhosts.">
        If we just met, choose the part of the site that sounds most like your
        kind of conversation and start there.
      </SectionHeading>
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
              variant: card.variant,
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
            <small>{card.audience}</small>
            <span>{card.cta}</span>
          </TrackedLink>
        ))}
      </div>
    </section>
  );
}
