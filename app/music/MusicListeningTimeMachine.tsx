import { musicInsights } from "../music-insights-data";
import { ListeningTimeMachine } from "./ListeningTimeMachine";
import { InsightHeading } from "./shared";

export function MusicListeningTimeMachine() {
  return (
    <section className="music-insight-band" aria-labelledby="music-time-machine-title">
      <InsightHeading
        eyebrow="Jump To A Moment"
        id="music-time-machine-title"
        title="A listening time machine with five illuminated buttons."
      >
        Pick a spike, season, or mini-era and open a more specific room in the
        archive without reading the whole report straight through.
      </InsightHeading>
      <ListeningTimeMachine moments={musicInsights.listeningTimeMachine} />
    </section>
  );
}
