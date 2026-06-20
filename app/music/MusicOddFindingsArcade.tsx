import { musicInsights } from "../music-insights-data";
import { InsightHeading } from "./shared";

export function MusicOddFindingsArcade() {
  return (
    <section className="music-insight-band" aria-labelledby="music-odd-arcade-title">
      <InsightHeading
        eyebrow="Odd Findings Arcade"
        id="music-odd-arcade-title"
        title="Collectible little warnings from the stranger corners of the archive."
      >
        Not every useful pattern needs a whole era. Some of them are just weird
        enough to deserve their own cabinet stickers.
      </InsightHeading>
      <div className="odd-arcade-grid">
        {musicInsights.oddFindingsArcade.map((card) => {
          const variant = "variant" in card ? card.variant : "";

          return (
            <article
              className={`odd-arcade-card${variant ? ` odd-arcade-card--${variant}` : ""}`}
              key={`${card.title}-${card.period}`}
            >
              <span>{card.title}</span>
              <h3>{card.subject}</h3>
              <p className="odd-arcade-period">{card.period}</p>
              <strong>{card.stat}</strong>
              <p>{card.explanation}</p>
              <a href={card.jumpHref}>Jump to related section</a>
            </article>
          );
        })}
      </div>
    </section>
  );
}
