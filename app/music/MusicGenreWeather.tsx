import { musicInsights } from "../music-insights-data";
import { InsightHeading, barStyle, formatHours, formatNumber, percent, titleCase } from "./shared";

export function MusicGenreWeather() {
  return (
    <section className="music-insight-band" aria-labelledby="music-genre-title">
      <InsightHeading
        eyebrow="Genre Weather"
        id="music-genre-title"
        title="A tag cloud with metal weather systems and ambient pressure fronts."
      >
        Last.fm tags weighted by listening time for the top Spotify artists
        that could be matched.
      </InsightHeading>
      <div className="genre-weather-grid">
        {musicInsights.genres.map((genre) => (
          <article className="genre-weather-card" key={genre.name}>
            <h3>{titleCase(genre.name)}</h3>
            <div className="signal-meter">
              <span style={barStyle(percent(genre.hours, musicInsights.genres[0].hours))} />
            </div>
            <p>
              {formatHours(genre.hours)}h across {formatNumber(genre.artists)} artists
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
