import { SectionHeading } from "../SectionHeading";
import { musicInsights } from "../music-insights-data";
import { StatCard, formatHours, formatNumber } from "./shared";

export function MusicConsole() {
  return (
    <>
      <SectionHeading eyebrow="Music" title="Songs for fluorescent weather.">
        Synths, small rituals, late-night tenderness, and melodies that look
        directly at the void before asking whether it wants fries.
      </SectionHeading>
      <section className="music-console" aria-labelledby="music-console-title">
        <div className="music-console-copy">
          <p className="music-console-kicker">Listening Memory Console</p>
          <h3 id="music-console-title">A private archive, tuned into public weather.</h3>
          <p>
            {formatHours(musicInsights.summary.totalHours)} hours across{" "}
            {formatNumber(musicInsights.summary.totalStreams)} plays from{" "}
            {musicInsights.sourceRange}. The rankings below favor time spent, so
            long obsessions get the gravity they deserve.
          </p>
        </div>
        <dl className="music-stat-grid" aria-label="Spotify listening summary">
          <StatCard label="Total hours" value={formatHours(musicInsights.summary.totalHours)} />
          <StatCard label="Total plays" value={formatNumber(musicInsights.summary.totalStreams)} />
          <StatCard
            label="Peak year"
            value={`${musicInsights.summary.peakYear}`}
            detail={`${formatHours(musicInsights.summary.peakYearHours)}h`}
          />
          <StatCard
            label="Genre matches"
            value={`${musicInsights.summary.genreMatches}/${musicInsights.summary.genreCandidates}`}
          />
        </dl>
      </section>
    </>
  );
}
