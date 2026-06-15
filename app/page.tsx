import Image from "next/image";
import Link from "next/link";
import { Guestbook } from "./Guestbook";
import { SectionHeading } from "./SectionHeading";
import { SignalBooth } from "./SignalBooth";
import { TinyThoughts } from "./TinyThoughts";
import {
  arcadeGames,
  beverlyAndLucindaPhotos,
  thomasJonesMissyCassPhotos,
  visualMedia,
} from "./site-data";
import { writings } from "./writings";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Signal Booth", href: "#signal-booth" },
  { label: "Tiny Thoughts", href: "#tiny-thoughts" },
  { label: "Arcade", href: "/arcade" },
  { label: "Movies & TV Shows", href: "/movies-tv" },
  { label: "Writing", href: "#writing" },
  { label: "Music", href: "#music" },
  { label: "Cats", href: "#cats" },
  { label: "Guestbook", href: "#guestbook" },
];

const githubRepoUrl = "https://github.com/jpollard-github/personal";

const projects = [
  {
    title: "Between Two Lodges",
    eyebrow: "Browser game",
    description:
      "A moody, original text adventure about coffee, woods, clues, dreams, and the kind of hallway that knows your name.",
    href: "/games/between-two-lodges/index.html",
    cta: "Play",
  },
  {
    title: "Codex Prompt Pack for VS Code",
    eyebrow: "VS Code extension",
    description:
      "Command palette helpers that turn selections, changed files, diffs, PRs, and repo metadata into compact Codex-ready prompts.",
    href: "https://github.com/jpollard-github/codex-vs-code-extension",
    cta: "View Repo",
  },
];

const music = [
  {
    title: "Reflective Resilience",
    embedUrl:
      "https://open.spotify.com/embed/playlist/01pnqPSqX1p0Wlr2nAvTX6?utm_source=generator&si=715ecc7f74494f58",
  },
  {
    title: "Arcode Ghosts After Midnight",
    embedUrl:
      "https://open.spotify.com/embed/playlist/5Ugcnm2Tsfea7Ww5gQpnu8?utm_source=generator&si=d94d276e65cb4555",
  },
  {
    title: "Love Me Tomorrow Radio",
    embedUrl:
      "https://open.spotify.com/embed/playlist/37i9dQZF1E8N7ryesPcRvq?utm_source=generator&si=4cbb222de7e2480e",
  },
  {
    title: "The Mountain Radio",
    embedUrl:
      "https://open.spotify.com/embed/playlist/37i9dQZF1E8EjBVdMRkm5J?utm_source=generator&si=f0f017613a7c4e1d",
  },
];

export default function Home() {
  return (
    <main>
      <a className="back-up-top" href="#top">
        Back Up Top
      </a>
      <section className="hero" id="top">
        <Image
          src="/images/neon-forest-diner.png"
          alt="A neon-lit diner at the edge of a misty evergreen forest at night"
          fill
          priority
          sizes="100vw"
          className="hero-image"
        />
        <div className="hero-scrim" />
        <nav className="nav" aria-label="Main navigation">
          <div className="nav-links">
            {navItems.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </div>
          <a
            className="github-nav-link"
            href={githubRepoUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Open GitHub repository"
            title="GitHub repository"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path
                fill="currentColor"
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.65 7.65 0 0 1 8 3.87c.68 0 1.36.09 2 .26 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
              />
            </svg>
          </a>
        </nav>

        <div className="hero-content">
          <p className="eyebrow">Jason&apos;s site / emotional roadside attraction</p>
          <h1>Warm dispatches from the neon forest.</h1>
          <p className="hero-copy">
            I make useful things with a strange little heartbeat: software,
            essays, songs, jokes with tiny fangs, and maps back to myself.
          </p>
          <div className="hero-actions" aria-label="Primary links">
            <a className="button primary" href="#projects">
              See Projects
            </a>
            <a className="button secondary" href="#guestbook">
              Send a Signal
            </a>
          </div>
        </div>
      </section>

      <section className="intro-band" aria-label="Site mood">
        <p>
          Equal parts diner coffee, haunted jukebox, field guide, and hopeful
          note found in a jacket pocket.{" "}
          <Link
            className="admin-cup-link"
            href="/admin"
            aria-label="Open admin dashboard"
            title="Admin dashboard"
          >
            ☕
          </Link>
        </p>
      </section>

      <section className="content-section about" id="about">
        <div className="about-copy">
          <p className="eyebrow">About</p>
          <h2>Welcome to ArcadeGhosts.</h2>
          <p>
            I&apos;m Jason, a software developer, cat dad, music enthusiast,
            arcade wanderer, and lifelong collector of strange ideas.
          </p>
          <p>
            I built this site because social media profiles never seem to capture
            the things that actually matter. The interesting parts of life happen
            somewhere between a late-night conversation, a favorite song, a
            forgotten arcade cabinet, a weird dream, and a moment when you
            suddenly understand something about yourself.
          </p>
          <p>
            I live in North Carolina&apos;s Triad region and spend a lot of time
            exploring the intersection of technology, creativity, nostalgia, and
            personal growth. Some of my favorite things include classic arcades,
            80s music, horror movies, artificial intelligence, trivia nights, road
            trips, coding projects, and stories that leave you wondering what was
            real and what wasn&apos;t.
          </p>

          <h3>If you&apos;re the type of person who enjoys:</h3>
          <ul className="about-list">
            <li>The strange atmosphere of Twin Peaks</li>
            <li>Finding hidden meaning in songs and films</li>
            <li>Losing track of time in an old arcade</li>
            <li>Deep conversations that skip the small talk</li>
            <li>Learning for the sheer joy of learning</li>
            <li>Cats</li>
            <li>Building things just because they&apos;re interesting</li>
            <li>The feeling of discovering your people</li>
          </ul>
          <p>...then you&apos;ll probably feel at home here.</p>

          <h3>A few things that have shaped me:</h3>
          <ul className="about-list">
            <li>Exploring ideas through AI and technology</li>
            <li>Growing up around academics, archaeology, and curiosity</li>
            <li>Countless hours spent in arcades and game rooms</li>
            <li>
              Music ranging from Queen and Jefferson Starship to synthwave and
              modern discoveries
            </li>
            <li>
              The realization that life becomes much more interesting when you
              stop trying to fit into the wrong crowd
            </li>
          </ul>

          <p>
            You&apos;ll find photos, projects, music, arcade adventures, thoughts,
            experiments, and whatever else captures my attention.
          </p>

          <h3>Some places on the internet that resonate with me:</h3>
          <div className="resonance-links">
            <a href="https://welcometotwinpeaks.com" target="_blank" rel="noreferrer">
              Twin Peaks fans
            </a>
            <a href="https://nightride.fm/" target="_blank" rel="noreferrer">
              Synthwave and retro culture
            </a>
            <a href="https://rateyourmusic.com" target="_blank" rel="noreferrer">
              Music discovery
            </a>
            <a href="https://www.arcade-museum.com" target="_blank" rel="noreferrer">
              Arcade history and preservation
            </a>
            <a href="https://longreads.com" target="_blank" rel="noreferrer">
              Curious minds and long-form ideas
            </a>
            <a href="https://www.are.na" target="_blank" rel="noreferrer">
              Weird, beautiful internet projects
            </a>
          </div>

          <p>ArcadeGhosts is ultimately an experiment.</p>
          <p>Can a website still help people find each other?</p>
          <p>
            Can a collection of interests, stories, music, photos, and ideas
            attract the right conversations?
          </p>
          <p>I don&apos;t know.</p>
          <p>But if something here feels familiar, reach out.</p>
          <p>Maybe you&apos;re one of my people.</p>
        </div>
      </section>

      <section className="content-section" id="projects">
        <SectionHeading eyebrow="Projects" title="Things with knobs and souls.">
          A few editable placeholders for work that can be practical, poetic, or
          charmingly suspicious of false binaries.
        </SectionHeading>
        <div className="card-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.title}>
              <p className="card-eyebrow">{project.eyebrow}</p>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              {"href" in project ? (
                <a className="project-link" href={project.href}>
                  {project.cta}
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="content-section signal-booth-section" id="signal-booth">
        <SectionHeading eyebrow="Signal Booth" title="A random oracle for your people.">
          Two hundred signals pulled from the site&apos;s obsessions: arcade glow,
          cats, songs, road trips, comeback stories, weird films, AI tools, and
          late-night notes that might know where they belong.
        </SectionHeading>
        <SignalBooth />
      </section>

      <section className="content-section tiny-thought-section" id="tiny-thoughts">
        <SectionHeading eyebrow="Tiny Thoughts" title="Short signals from the counter.">
          Quick observations, lessons learned, funny experiences, opinions, and
          small notes that do not need to become full essays.
        </SectionHeading>
        <TinyThoughts />
      </section>

      <section className="content-section arcade-section" id="arcade">
        <SectionHeading eyebrow="Arcade" title="Quarter-light favorites.">
          I would spend hours in arcades, following cabinet glow from one
          obsession to the next. I even skipped art class upstairs from my
          favorite childhood arcade in Plattsburgh, NY, because sometimes the
          real curriculum was vector beams, joysticks, and the sound of another
          coin dropping.
        </SectionHeading>
        <div className="section-link-grid">
          <a className="section-link-card feature-card" href="/arcade">
            <span className="card-eyebrow">{arcadeGames.length} cabinets</span>
            <h3>Open the arcade room</h3>
            <p>
              Galaga, Robotron, Tron, Ms. Pac-Man, Dragon&apos;s Lair, and the
              rest of the cabinet glow now live on their own page.
            </p>
            <span>Enter</span>
          </a>
        </div>
      </section>

      <section className="content-section media-section" id="movies-tv">
        <SectionHeading eyebrow="Movies & TV" title="Movies & TV Shows.">
          Visual media that resonated.
        </SectionHeading>
        <div className="section-link-grid">
          <a className="section-link-card feature-card" href="/movies-tv">
            <span className="card-eyebrow">{visualMedia.length} signals</span>
            <h3>Open the screening room</h3>
            <p>
              Twin Peaks, Severance, horror, strange comedies, memory-loop
              movies, and other shows and films that stuck around.
            </p>
            <span>Watchlist</span>
          </a>
        </div>
      </section>

      <section className="split-section" id="writing">
        <SectionHeading eyebrow="Writing" title="Essays from the booth by the window.">
          Notes on technology, identity, attention, grief, comedy, and the
          suspiciously heroic act of trying again tomorrow.
        </SectionHeading>
        <div className="list-panel">
          {writings.map((writing) => (
            <a href={`/writings/${writing.slug}`} key={writing.slug}>
              <span className="writing-icon" aria-hidden="true">
                {writing.icon}
              </span>
              <span>
                <span>{writing.title}</span>
                <small>{writing.description}</small>
              </span>
              <span aria-hidden="true">Read</span>
            </a>
          ))}
        </div>
      </section>

      <section className="content-section music-section" id="music">
        <SectionHeading eyebrow="Music" title="Songs for fluorescent weather.">
          Synths, small rituals, late-night tenderness, and melodies that look
          directly at the void before asking whether it wants fries.
        </SectionHeading>
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
      </section>

      <section className="content-section cats-section" id="cats">
        <SectionHeading eyebrow="Cats" title="Cat rooms, no endless hallway.">
          The cat galleries have moved into their own rooms so the homepage can
          breathe again.
        </SectionHeading>
        <div className="section-link-grid">
          <a className="section-link-card" href="/cats/beverly-and-lucinda">
            <span className="card-eyebrow">
              {beverlyAndLucindaPhotos.length} photos
            </span>
            <h3>Beverly and Lucinda</h3>
            <p>
              Tiny chaos professionals from 2025 to current: ping pong balls,
              Churu, bed visits, and meaningful eye contact.
            </p>
            <span>Visit</span>
          </a>
          <a className="section-link-card" href="/cats/thomas-jones-missy-cass">
            <span className="card-eyebrow">
              {thomasJonesMissyCassPhotos.length} photos
            </span>
            <h3>Thomas, Jones, Missy, and Cass</h3>
            <p>
              A larger memory room from 2016 to 2025, with Thomas and the
              little orbit of cats around him.
            </p>
            <span>Visit</span>
          </a>
        </div>
      </section>

      <section className="content-section guestbook-section" id="guestbook">
        <SectionHeading eyebrow="Guestbook" title="Leave a signal for the wall.">
          Music recommendations, arcade memories, cat stories, Twin Peaks notes,
          site thoughts, and any other small transmission that feels like it
          belongs in the neon forest.
        </SectionHeading>
        <Guestbook />
      </section>
    </main>
  );
}
