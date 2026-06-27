import type { Metadata } from "next";
import Link from "next/link";
import { RelatedSignals } from "../RelatedSignals";
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

const relatedSignals = [
  {
    href: "/#tiny-thoughts",
    title: "Tiny Thoughts",
    description:
      "Shorter notes from the counter where a song, reaction, or sudden opinion can land without becoming a full essay.",
    reason: "Because music taste and quick observations often travel together.",
    cta: "Read smaller signals",
  },
  {
    href: "/movies-tv",
    title: "Movies & TV",
    description:
      "A parallel taste map full of atmospheric favorites, strange comedies, and recurring emotional weather.",
    reason: "Because the same sensibility shaping this listening room also shapes the screen obsessions.",
    cta: "Browse the taste map",
  },
  {
    href: "/#about",
    title: "About",
    description:
      "A fuller picture of the person behind the playlists, synth weather, and odd little listening fixations.",
    reason: "Because music is one of the clearest routes into the whole site's personality.",
    cta: "Read the field notes",
  },
];

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
        <RelatedSignals items={relatedSignals} title="A few nearby frequencies." />
      </section>
    </main>
  );
}
