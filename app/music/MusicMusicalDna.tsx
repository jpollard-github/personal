import { musicInsights } from "../music-insights-data";
import { InsightHeading, RankPanel } from "./shared";

export function MusicMusicalDna() {
  return (
    <section className="music-insight-band" aria-labelledby="music-dna-title">
      <InsightHeading
        eyebrow="Musical DNA"
        id="music-dna-title"
        title="Foundations, growth arcs, disappearances, comforts, and discoveries."
      >
        Artist-level fingerprints from the full Spotify export.
      </InsightHeading>
      <div className="music-dna-grid">
        {musicInsights.musicalDna.map((panel) => (
          <RankPanel key={panel.title} title={panel.title} items={panel.items} />
        ))}
      </div>
    </section>
  );
}
