import { musicInsights } from "../music-insights-data";
import { InsightHeading } from "./shared";

export function MusicFixations() {
  return (
    <section className="music-insight-band" aria-labelledby="music-fixation-title">
      <InsightHeading
        eyebrow="Fixations"
        id="music-fixation-title"
        title="Tiny oddities from repeat days, album weeks, and format gravity."
      >
        The little statistical artifacts where a listening habit stops being
        casual and starts glowing.
      </InsightHeading>
      <div className="music-fixation-grid">
        {musicInsights.fixations.map((item) => (
          <article className="music-fixation-card" key={item.title}>
            <span>{item.title}</span>
            <strong>{item.value}</strong>
            <p>{item.meta}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
