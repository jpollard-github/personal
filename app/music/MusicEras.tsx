import { musicInsights } from "../music-insights-data";
import { InsightHeading } from "./shared";

export function MusicEras() {
  return (
    <section className="music-insight-band" aria-labelledby="music-era-title">
      <InsightHeading
        eyebrow="Eras"
        id="music-era-title"
        title="Chapters where one sound briefly ran the building."
      >
        These are the months where an artist, album, or genre suddenly
        dominated the listening archive.
      </InsightHeading>
      <div className="music-era-grid">
        {musicInsights.eras.map((era) => (
          <article className="music-era-card" key={`${era.title}-${era.period}`}>
            <div className="music-era-meta">
              <span>{era.period}</span>
              <span>{era.type}</span>
              <span>{era.metric}</span>
              <span>{era.share}</span>
            </div>
            <h3>{era.title}</h3>
            <p>{era.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
