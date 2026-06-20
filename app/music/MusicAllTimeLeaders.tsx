import { musicInsights } from "../music-insights-data";
import { InsightHeading, RankPanel } from "./shared";

export function MusicAllTimeLeaders() {
  return (
    <section className="music-insight-band" aria-labelledby="music-leaders-title">
      <InsightHeading
        eyebrow="All-Time Leaders"
        id="music-leaders-title"
        title="The heavy shelves, ranked by hours."
      >
        These are secondary to the story sections, but still useful for the
        record.
      </InsightHeading>
      <div className="music-rank-grid">
        <RankPanel title="Artists" items={musicInsights.allTime.artists} />
        <RankPanel title="Songs" items={musicInsights.allTime.songs} />
        <RankPanel title="Albums" items={musicInsights.allTime.albums} />
      </div>
    </section>
  );
}
