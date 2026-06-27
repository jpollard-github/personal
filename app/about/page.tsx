import type { Metadata } from "next";
import Link from "next/link";
import { aboutCards, resonanceLinks } from "../home/data";

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
            use and personal enough to remember.
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
