import { SectionHeading } from "../SectionHeading";
import { TrackedLink } from "../TrackedLink";
import type { HomeSpotlightRecord } from "../lib/home-spotlight";
import type { NowItem } from "../lib/now";
import type { SiteProject } from "../lib/projects";
import type { WritingEntry } from "../writings";

type HomeSpotlightProps = {
  customSpotlight?: HomeSpotlightRecord | null;
  currentItem?: NowItem | null;
  featuredProject?: SiteProject | null;
  featuredWriting?: WritingEntry | null;
};

function SpotlightLink({ href, label }: { href: string; label: string }) {
  return (
    <TrackedLink
      href={href}
      trackingEvent="Spotlight Link Clicked"
      trackingProperties={{ destination: href, label }}
    >
      {label}
    </TrackedLink>
  );
}

export function HomeSpotlight({
  customSpotlight,
  currentItem,
  featuredProject,
  featuredWriting,
}: HomeSpotlightProps) {
  if (!customSpotlight && !currentItem && !featuredProject && !featuredWriting) {
    return null;
  }

  return (
    <section className="content-section spotlight-section" id="spotlight">
      <SectionHeading eyebrow="Spotlight" title="One good place to begin right now.">
        A smaller, more curated snapshot near the top so the homepage feels
        guided before it becomes sprawling.
      </SectionHeading>
      <div className="spotlight-grid">
        {customSpotlight?.enabled ? (
          <article className="spotlight-card spotlight-card-current">
            <p className="card-eyebrow">{customSpotlight.eyebrow}</p>
            <h3>{customSpotlight.title}</h3>
            <p>{customSpotlight.text}</p>
            <SpotlightLink
              href={customSpotlight.linkHref}
              label={customSpotlight.linkLabel}
            />
          </article>
        ) : currentItem ? (
          <article className="spotlight-card spotlight-card-current">
            <p className="card-eyebrow">Current Signal</p>
            <h3>{currentItem.title}</h3>
            <p>{currentItem.text}</p>
            <TrackedLink
              href="#now"
              trackingEvent="Spotlight Link Clicked"
              trackingProperties={{ destination: "#now", label: "See what is active" }}
            >
              See what is active
            </TrackedLink>
          </article>
        ) : null}
        {featuredProject ? (
          <article className="spotlight-card spotlight-card-project">
            <p className="card-eyebrow">Featured Project</p>
            <h3>{featuredProject.title}</h3>
            <p>{featuredProject.description}</p>
            <SpotlightLink
              href={featuredProject.href || "#projects"}
              label={featuredProject.href?.startsWith("/") ? "Visit project" : "Open project"}
            />
          </article>
        ) : null}
        {featuredWriting ? (
          <article className="spotlight-card spotlight-card-writing">
            <p className="card-eyebrow">Featured Writing</p>
            <h3>{featuredWriting.title}</h3>
            <p>{featuredWriting.description}</p>
            <TrackedLink
              href={`/writings/${featuredWriting.slug}`}
              trackingEvent="Spotlight Link Clicked"
              trackingProperties={{
                destination: `/writings/${featuredWriting.slug}`,
                label: "Read the piece",
              }}
            >
              Read the piece
            </TrackedLink>
          </article>
        ) : null}
      </div>
    </section>
  );
}
