import Link from "next/link";
import { aboutCards } from "./data";

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

export function HomeAbout() {
  return (
    <section className="content-section about" id="about">
      <div className="about-copy" id="about-heading">
        <p className="eyebrow">About</p>
        <h2>Who I am and how I think.</h2>
        <p>
          I&apos;m Jason Pollard, a software developer, cat dad, music
          enthusiast, arcade wanderer, and lifelong collector of strange ideas.
          I build tools and experiments that are practical enough to use and
          personal enough to remember.
        </p>
        <p>
          I live in North Carolina&apos;s Triad region and spend a lot of time
          exploring the intersection of technology, creativity, nostalgia,
          personal growth, AI, writing, games, and stories that leave you
          wondering what was real and what wasn&apos;t.
        </p>
        <p>
          ArcadeGhosts exists because social profiles rarely capture the parts
          that matter: late-night conversations, favorite songs, forgotten
          arcade cabinets, weird dreams, cat rituals, and sudden
          self-understanding.
        </p>
        <ul className="about-preview-list">
          <li>Twin Peaks atmosphere</li>
          <li>Hidden meaning in songs and films</li>
          <li>Old arcades and forgotten cabinets</li>
          <li>Deep conversations and strange ideas</li>
        </ul>

        <p>
          ArcadeGhosts is ultimately an experiment in whether a collection of
          interests, stories, projects, music, photos, and ideas can attract
          the right conversations. If something here feels familiar, reach out.{" "}
          <Link href="/work-with-me">I occasionally take on small side projects too.</Link>
        </p>

        <p className="about-preview-link">
          <Link href="/about">Read the full About room</Link>
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
  );
}
