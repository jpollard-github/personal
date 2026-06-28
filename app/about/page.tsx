import type { Metadata } from "next";
import Link from "next/link";
import { aboutCards, resonanceLinks } from "../home/data";

const aboutTrustCards = [
  {
    eyebrow: "Proof",
    title: "Build Log",
    text: "A public work log showing shipped improvements, editorial cleanup, test passes, and the behind-the-scenes tuning that keeps the site alive.",
    href: "/build-log",
    cta: "See Recent Changes",
  },
  {
    eyebrow: "Next Step",
    title: "Work With Me",
    text: "If you are wondering whether I can help with a software problem, this is the practical path from personality into scope, proof, and contact.",
    href: "/work-with-me",
    cta: "See The Work Path",
  },
  {
    eyebrow: "Current Work",
    title: "Projects",
    text: "Active, shipped, paused, and becoming: the workbench view of what I am building right now.",
    href: "/#projects",
    cta: "Open The Workbench",
  },
];

const aboutWarmCards = [
  {
    eyebrow: "Writing",
    title: "Writings",
    text: "Essays and reflections on grief, technology, comedy, attention, and the suspiciously brave act of trying again tomorrow.",
    href: "/writings",
    cta: "Read A Few Signals",
  },
  {
    eyebrow: "Music",
    title: "Music",
    text: "Synths, tenderness, playlists, Music League notes, and songs for fluorescent weather.",
    href: "/music",
    cta: "Step Into The Listening Room",
  },
  {
    eyebrow: "Cats",
    title: "Cats",
    text: "The softer household orbit: Beverly, Lucinda, Thomas, Jones, Missy, Cass, and the necessary cat evidence.",
    href: "/cats/beverly-and-lucinda",
    cta: "Visit The Cat Rooms",
  },
];

function AboutCardLink({
  href,
  title,
  eyebrow,
  text,
  cta,
}: {
  href: string;
  title: string;
  eyebrow: string;
  text: string;
  cta: string;
}) {
  const content = (
    <>
      <span className="card-eyebrow">{eyebrow}</span>
      <h3>{title}</h3>
      <p>{text}</p>
      <span>{cta}</span>
    </>
  );

  if (href.startsWith("/") || href.startsWith("#")) {
    return (
      <Link className="section-link-card" href={href}>
        {content}
      </Link>
    );
  }

  return (
    <a className="section-link-card" href={href}>
      {content}
    </a>
  );
}

export const metadata: Metadata = {
  title: "About",
  description:
    "Who Jason Pollard is, how he thinks, and the strange combination of software, music, arcades, cats, and ideas behind ArcadeGhosts.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Jason Pollard",
    description:
      "Software developer, cat dad, music enthusiast, arcade wanderer, and collector of strange ideas.",
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <main className="about-page">
      <section className="content-section about-page-section">
        <Link className="back-link" href="/#about">
          Back Home
        </Link>
        <div className="about-copy" id="about-heading">
          <p className="eyebrow">About</p>
          <h1>Who I am and how I think.</h1>
          <p>
            I&apos;m Jason Pollard, a software developer, cat dad, music
            enthusiast, arcade wanderer, and lifelong collector of strange
            ideas. I build tools and experiments that are practical enough to
            use and personal enough to remember, which is also the shortest
            explanation of what this site is trying to prove.
          </p>
          <p>
            I live in North Carolina&apos;s Triad region and spend a lot of time
            exploring the intersection of technology, creativity, nostalgia,
            personal growth, AI, writing, games, and stories that leave you
            wondering what was real and what wasn&apos;t.
          </p>
          <p>
            ArcadeGhosts exists because social profiles rarely capture the
            parts that matter: late-night conversations, favorite songs,
            forgotten arcade cabinets, weird dreams, cat rituals, and sudden
            self-understanding.
          </p>
          <p>
            If you are here professionally, the useful version is simple: I am
            both the person and the builder. If you want proof of active work,
            go to the Build Log and Projects. If you want the next step, go to
            Work With Me. If you want the warmer context first, keep following
            the side rooms.
          </p>

          <h3>If you want the practical trail first:</h3>
          <p>
            <Link href="/build-log">Build Log</Link> is the proof-of-active-work
            path. <Link href="/work-with-me">Work With Me</Link> is the
            practical next step if you think I might be able to help. This
            page is the human context that connects those two.
          </p>
          <div className="section-link-grid about-card-grid">
            {aboutTrustCards.map((card) => (
              <AboutCardLink
                cta={card.cta}
                eyebrow={card.eyebrow}
                href={card.href}
                key={card.title}
                text={card.text}
                title={card.title}
              />
            ))}
          </div>

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

          <h3>Some places on the internet that resonate with me:</h3>
          <div className="resonance-links">
            {resonanceLinks.map((link) => (
              <a href={link.href} key={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </div>

          <p>
            ArcadeGhosts is ultimately an experiment in whether a collection of
            interests, stories, projects, music, photos, and ideas can attract
            the right conversations. If something here feels familiar, reach
            out. <Link href="/work-with-me">I occasionally take on small side projects too.</Link>
          </p>

          <h3>If you want the warmer rooms first:</h3>
          <div className="section-link-grid about-card-grid">
            {aboutWarmCards.map((card) => (
              <AboutCardLink
                cta={card.cta}
                eyebrow={card.eyebrow}
                href={card.href}
                key={card.title}
                text={card.text}
                title={card.title}
              />
            ))}
          </div>

          <div className="section-link-grid about-card-grid">
            {aboutCards.map((card) => (
              <AboutCardLink
                cta={card.cta}
                eyebrow={card.eyebrow}
                href={card.href}
                key={card.title}
                text={card.text}
                title={card.title}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
