import Image from "next/image";

const navItems = ["About", "Projects", "Arcade", "Writing", "Music", "Cats", "Contact"];

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
    title: "Signal in the Static",
    eyebrow: "Product / experiment",
    description:
      "A small tool for turning messy notes into honest next steps, with room for uncertainty and excellent snacks.",
  },
  {
    title: "Diner Oracle",
    eyebrow: "Interactive fiction",
    description:
      "A conversational story engine where every booth has a secret and the coffee knows a little too much.",
  },
  {
    title: "Soft Launch Into the Void",
    eyebrow: "Essay series",
    description:
      "Field notes on making things, changing your mind, and remaining tender in highly optimized environments.",
  },
];

const writing = [
  "How to tell when a dream is asking for project management",
  "The case for leaving one friendly light on",
  "Notes from the emotional support command line",
];

const arcadeGames = [
  {
    title: "Galaga",
    image: "/images/arcade/galaga.jpg",
    sourceUrl: "https://en.wikipedia.org/wiki/Galaga",
  },
  {
    title: "Ms. Pac-Man",
    image: "/images/arcade/ms-pac-man.png",
    sourceUrl: "https://en.wikipedia.org/wiki/Ms._Pac-Man",
  },
  {
    title: "Mr. Do's Castle",
    image: "/images/arcade/mr-dos-castle.jpg",
    sourceUrl: "https://en.wikipedia.org/wiki/Mr._Do%27s_Castle",
  },
  {
    title: "Track and Field",
    image: "/images/arcade/track-and-field.png",
    sourceUrl: "https://en.wikipedia.org/wiki/Track_%26_Field_(video_game)",
  },
  {
    title: "Hyper Sports",
    image: "/images/arcade/hyper-sports.png",
    sourceUrl: "https://en.wikipedia.org/wiki/Hyper_Sports",
  },
  {
    title: "Donkey Kong",
    image: "/images/arcade/donkey-kong.jpg",
    sourceUrl: "https://en.wikipedia.org/wiki/Donkey_Kong_(arcade_game)",
  },
  {
    title: "Donkey Kong 3",
    image: "/images/arcade/donkey-kong-3.jpg",
    sourceUrl: "https://en.wikipedia.org/wiki/Donkey_Kong_3",
  },
  {
    title: "Robotron: 2084",
    image: "/images/arcade/robotron-2084.png",
    sourceUrl: "https://en.wikipedia.org/wiki/Robotron:_2084",
  },
  {
    title: "Tron",
    image: "/images/arcade/tron.png",
    sourceUrl: "https://en.wikipedia.org/wiki/Tron_(video_game)",
  },
  {
    title: "Major Havoc",
    image: "/images/arcade/major-havoc.png",
    sourceUrl: "https://en.wikipedia.org/wiki/Major_Havoc",
  },
  {
    title: "Dragon's Lair",
    image: "/images/arcade/dragons-lair.jpg",
    sourceUrl: "https://en.wikipedia.org/wiki/Dragon%27s_Lair_(1983_video_game)",
  },
  {
    title: "Karate Champ",
    image: "/images/arcade/karate-champ.png",
    sourceUrl: "https://en.wikipedia.org/wiki/Karate_Champ",
  },
  {
    title: "Vs. Excitebike",
    image: "/images/arcade/vs-excitebike.jpg",
    sourceUrl: "https://en.wikipedia.org/wiki/Vs._Excitebike",
  },
];

const music = [
  "Nocturnal synths for cleaning the kitchen at midnight",
  "Diner jukebox heartbreak with drum machines",
  "Forest ambience, tape hiss, and small hopeful chords",
];

const catPhotos = Array.from({ length: 23 }, (_, index) => {
  const photoNumber = index + 1;

  return {
    src: `/images/beverly-and-lucinda/BeverlyAndLucinda%20-%20${photoNumber}.jpeg`,
    alt: `Beverly and Lucinda photo ${photoNumber}`,
  };
});

const contactLinks = [
  { label: "Email", href: "mailto:hello@example.com" },
  { label: "GitHub", href: "https://github.com/" },
  { label: "Newsletter", href: "https://example.com/" },
];

function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{children}</p>
    </div>
  );
}

export default function Home() {
  return (
    <main>
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
          <a className="brand" href="#top" aria-label="Home">
            <span className="brand-mark" />
            <span>Night Kitchen</span>
          </a>
          <div className="nav-links">
            {navItems.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`}>
                {item}
              </a>
            ))}
          </div>
        </nav>

        <div className="hero-content">
          <p className="eyebrow">Personal site / emotional roadside attraction</p>
          <h1>Warm dispatches from the neon forest.</h1>
          <p className="hero-copy">
            I make useful things with a strange little heartbeat: software,
            essays, songs, jokes with tiny fangs, and maps back to myself.
          </p>
          <div className="hero-actions" aria-label="Primary links">
            <a className="button primary" href="#projects">
              See Projects
            </a>
            <a className="button secondary" href="#contact">
              Send a Signal
            </a>
          </div>
        </div>
      </section>

      <section className="intro-band" aria-label="Site mood">
        <p>
          Equal parts diner coffee, haunted jukebox, field guide, and hopeful
          note found in a jacket pocket.
        </p>
      </section>

      <section className="content-section about" id="about">
        <SectionHeading eyebrow="About" title="Tender systems, odd weather.">
          I like building things that help people feel more capable, less alone,
          and slightly more amused by the machinery of being alive.
        </SectionHeading>
        <div className="about-grid">
          <div className="about-panel">
            <h3>Current frequency</h3>
            <p>
              Designing tools, writing essays, making music, and learning how to
              trust the quiet signal under the noise.
            </p>
          </div>
          <div className="about-panel">
            <h3>Operating principles</h3>
            <p>
              Be kind. Be specific. Keep a lantern nearby. Leave room for the
              joke and the feeling to both be true.
            </p>
          </div>
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

      <section className="content-section arcade-section" id="arcade">
        <SectionHeading eyebrow="Arcade" title="Quarter-light favorites.">
          I would spend hours in arcades, following cabinet glow from one
          obsession to the next. I even skipped art class upstairs from my
          favorite childhood arcade in Plattsburgh, NY, because sometimes the
          real curriculum was vector beams, joysticks, and the sound of another
          coin dropping.
        </SectionHeading>
        <div className="arcade-grid">
          {arcadeGames.map((game) => (
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

      <section className="split-section" id="writing">
        <SectionHeading eyebrow="Writing" title="Essays from the booth by the window.">
          Notes on technology, identity, attention, grief, comedy, and the
          suspiciously heroic act of trying again tomorrow.
        </SectionHeading>
        <div className="list-panel">
          {writing.map((item) => (
            <a href="#" key={item}>
              <span>{item}</span>
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
          {music.map((track, index) => (
            <article className="tape" key={track}>
              <span>0{index + 1}</span>
              <p>{track}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section cats-section" id="cats">
        <SectionHeading eyebrow="Cats" title="Beverly and Lucinda from 2025 to current">
          Beverly and Lucinda are beloved tiny chaos professionals who chase
          ping pong balls, get in the bed with me, eat lots of Churu, and
          practice suspiciously meaningful eye contact.
        </SectionHeading>
        <div className="cat-gallery" aria-label="Photos of Beverly and Lucinda">
          {catPhotos.map((photo) => (
            <figure className="cat-photo" key={photo.src}>
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 980px) 50vw, 33vw"
                className="cat-photo-image"
              />
            </figure>
          ))}
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div>
          <p className="eyebrow">Contact</p>
          <h2>Leave a message at the counter.</h2>
          <p>
            For collaborations, kind notes, strange ideas, playlists, and
            carefully scoped existential questions.
          </p>
        </div>
        <div className="contact-links">
          {contactLinks.map((link) => (
            <a key={link.label} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
