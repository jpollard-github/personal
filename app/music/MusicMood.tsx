import { musicInsights } from "../music-insights-data";
import { InsightHeading } from "./shared";

export function MusicMood() {
  return (
    <section className="music-insight-band" aria-labelledby="music-weather-title">
      <InsightHeading
        eyebrow="Emotional Color"
        id="music-weather-title"
        title="Mood reads, treated as texture rather than truth."
      >
        These summaries are interpretive pattern reads from genre tags and
        repeated listening, not claims about mental health.
      </InsightHeading>
      <div className="music-mood-grid">
        {musicInsights.moodReads.map((mood) => (
          <article className="music-mood-card" key={mood.title}>
            <h3>{mood.title}</h3>
            <strong>{mood.value}</strong>
            <p>{mood.description}</p>
            <div className="music-chip-row">
              {mood.evidence.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
