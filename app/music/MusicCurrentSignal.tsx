import { musicInsights } from "../music-insights-data";
import { InsightHeading, RankPanel, formatShortDate } from "./shared";

export function MusicCurrentSignal() {
  return (
    <section className="music-insight-band" aria-labelledby="music-current-title">
      <InsightHeading
        eyebrow="Current Signal"
        id="music-current-title"
        title="The recent room is brighter, glossier, and still carrying a little voltage."
      >
        Top artists, songs, and albums from{" "}
        {formatShortDate(musicInsights.recentWindow.start)} to{" "}
        {formatShortDate(musicInsights.recentWindow.end)}, ranked by play count
        with time as the tie-breaker.
      </InsightHeading>
      <div className="music-rank-grid">
        <RankPanel title="Artists" items={musicInsights.recentRankings.artists} />
        <RankPanel title="Songs" items={musicInsights.recentRankings.songs} />
        <RankPanel title="Albums" items={musicInsights.recentRankings.albums} />
      </div>
    </section>
  );
}
