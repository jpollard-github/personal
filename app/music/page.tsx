import type { Metadata } from "next";
import Link from "next/link";
import { MusicAllTimeLeaders } from "./MusicAllTimeLeaders";
import { MusicConsole } from "./MusicConsole";
import { MusicCurrentSignal } from "./MusicCurrentSignal";
import { MusicEras } from "./MusicEras";
import { MusicFixations } from "./MusicFixations";
import { MusicGenreWeather } from "./MusicGenreWeather";
import { MusicListeningTimeMachine } from "./MusicListeningTimeMachine";
import { MusicMood } from "./MusicMood";
import { MusicMusicalDna } from "./MusicMusicalDna";
import { MusicOddFindingsArcade } from "./MusicOddFindingsArcade";
import { MusicPlaylists } from "./MusicPlaylists";
import { MusicSignalHistory } from "./MusicSignalHistory";

export const metadata: Metadata = {
  title: "Music, Playlists, and Music League",
  description:
    "Jason Pollard's listening room: synths, late-night tenderness, Spotify playlists, Music League, and songs for fluorescent weather.",
  alternates: {
    canonical: "/music",
  },
  openGraph: {
    title: "Music, Playlists, and Music League",
    description:
      "Synths, late-night tenderness, Spotify playlists, Music League, and songs for fluorescent weather.",
    url: "/music",
  },
};

export default function MusicPage() {
  return (
    <main className="collection-page" id="top">
      <a className="back-up-top" href="#top">
        Back Up Top
      </a>
      <Link className="back-link" href="/#about">
        Back Home
      </Link>
      <section className="content-section music-section collection-section">
        <MusicConsole />
        <MusicCurrentSignal />
        <MusicListeningTimeMachine />
        <MusicOddFindingsArcade />
        <MusicSignalHistory />
        <MusicGenreWeather />
        <MusicEras />
        <MusicMusicalDna />
        <MusicMood />
        <MusicAllTimeLeaders />
        <MusicFixations />
        <MusicPlaylists />
      </section>
    </main>
  );
}
