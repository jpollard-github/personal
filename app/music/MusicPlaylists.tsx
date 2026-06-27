import Image from "next/image";
import { music } from "../music-data";

export function MusicPlaylists() {
  return (
    <>
      <div className="tape-row">
        {music.map((playlist) => (
          <article className="tape" key={playlist.title}>
            <h3>{playlist.title}</h3>
            <iframe
              title={`${playlist.title} Spotify playlist`}
              src={playlist.embedUrl}
              width="100%"
              height="352"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </article>
        ))}
      </div>
      <div className="music-league">
        <div>
          <h3>Music League</h3>
          <p>Music Leagues I&apos;ve either run or participated in.</p>
        </div>
        <div className="music-league-card">
          <a
            className="music-league-link"
            href="https://app.musicleague.com/user/8e855be976294ae0aedf7a0820572ffb/"
            target="_blank"
            rel="noreferrer"
            aria-label="Open Jason's Music League profile"
          >
            <Image
              src="/images/music-league.png"
              alt="Music League"
              fill
              unoptimized
              sizes="(max-width: 860px) 100vw, 520px"
              className="music-league-image"
            />
          </a>
          <a
            className="music-league-profile"
            href="https://app.musicleague.com/user/8e855be976294ae0aedf7a0820572ffb/"
            target="_blank"
            rel="noreferrer"
          >
            View Profile
          </a>
        </div>
      </div>
    </>
  );
}
