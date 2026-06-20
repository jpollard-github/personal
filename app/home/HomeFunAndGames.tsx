import { SectionHeading } from "../SectionHeading";
import { SignalBooth } from "../SignalBooth";
import { funAndGamesCards } from "./data";

export function HomeFunAndGames() {
  return (
    <section className="content-section fun-games-section" id="fun-and-games">
      <SectionHeading eyebrow="Fun and Games" title="Oracles, rooms, and playable static.">
        The playful side of the site: interactive toys, symbolic journeys, and
        game-shaped paths through the neon forest.
      </SectionHeading>
      <div className="section-link-grid fun-games-grid">
        {funAndGamesCards.map((card) => (
          <a className="section-link-card" href={card.href} key={card.title}>
            <span className="card-eyebrow">{card.eyebrow}</span>
            <h3>{card.title}</h3>
            <p>{card.text}</p>
            <span>{card.cta}</span>
          </a>
        ))}
      </div>
      <section className="signal-booth-section" id="signal-booth">
        <SectionHeading eyebrow="Signal Booth" title="A random oracle for your people.">
          Two hundred signals pulled from the site&apos;s obsessions: arcade
          glow, cats, songs, road trips, comeback stories, weird films, AI
          tools, and late-night notes that might know where they belong.
        </SectionHeading>
        <SignalBooth />
      </section>
    </section>
  );
}
