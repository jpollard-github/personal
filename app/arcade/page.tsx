import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "../SectionHeading";
import { arcadeGames } from "../site-data";

export const metadata: Metadata = {
  title: "Arcade Favorites and Classic Cabinet Games",
  description:
    "Jason Pollard's favorite arcade cabinets, classic games, cabinet artwork, and quarter-light nostalgia collected on ArcadeGhosts.",
  alternates: {
    canonical: "/arcade",
  },
  openGraph: {
    title: "Arcade Favorites and Classic Cabinet Games",
    description:
      "Classic arcade cabinet glow, favorite games, and quarter-light nostalgia from ArcadeGhosts.",
    url: "/arcade",
  },
};

export default function ArcadePage() {
  return (
    <main className="collection-page" id="top">
      <a className="back-up-top" href="#top">
        Back Up Top
      </a>
      <Link className="back-link" href="/">
        Back Home
      </Link>
      <section className="content-section arcade-section collection-section">
        <SectionHeading eyebrow="Arcade" title="Quarter-light favorites.">
          I would spend hours in arcades, following cabinet glow from one
          obsession to the next. This room keeps the cabinets together without
          making the homepage scroll forever.
        </SectionHeading>
        <div className="arcade-grid">
          {arcadeGames.map((game, index) => (
            <article className="arcade-card" key={game.title}>
              <a
                className="arcade-image-link"
                href={game.sourceUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`${game.title} image source`}
              >
                <Image
                  src={game.image}
                  alt={`${game.title} arcade artwork`}
                  fill
                  priority={index < 3}
                  unoptimized
                  sizes="(max-width: 640px) 50vw, (max-width: 980px) 33vw, 20vw"
                  className="arcade-image"
                />
              </a>
              <div className="arcade-card-copy">
                <h3>{game.title}</h3>
                <a href={game.sourceUrl} target="_blank" rel="noreferrer">
                  Source
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
