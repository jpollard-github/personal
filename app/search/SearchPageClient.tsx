"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useRef, useState } from "react";
import { TrackedLink } from "../TrackedLink";
import { trackEvent } from "../lib/analytics";
import type { SearchEntry } from "../lib/search-shared";
import { searchEntries } from "../lib/search-shared";

const quickLinks = [
  {
    eyebrow: "Professional",
    title: "Proof, trust, and next step",
    text: "If you are here with practical intent, skip the hallway and go straight to the trust path.",
    links: [
      { href: "/build-log", label: "Build Log" },
      { href: "/work-with-me", label: "Work With Me" },
      { href: "/about", label: "About" },
    ],
  },
  {
    eyebrow: "Returning",
    title: "Fresh things and living rooms",
    text: "If you already know the place a little, these are the fastest ways to see what is alive right now.",
    links: [
      { href: "/updates", label: "Updates" },
      { href: "/tiny-thoughts", label: "Tiny Thoughts" },
      { href: "/writings", label: "Writings" },
    ],
  },
  {
    eyebrow: "Weird",
    title: "Stranger corners",
    text: "Search is good for direct finding, but these are the rooms people usually mean when they want the odder heartbeat.",
    links: [
      { href: "/twin-peaks-self", label: "Twin Peaks Self" },
      { href: "/games/between-two-lodges", label: "Between Two Lodges" },
      { href: "/arcade", label: "Arcade" },
    ],
  },
];

function isExternalLink(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

export function SearchPageClient({ entries }: { entries: SearchEntry[] }) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const results = searchEntries(entries, deferredQuery);
  const showingFeatured = !deferredQuery.trim();
  const lastTrackedQuery = useRef("");

  useEffect(() => {
    const normalizedQuery = deferredQuery.trim();

    if (!normalizedQuery || normalizedQuery === lastTrackedQuery.current) {
      return;
    }

    lastTrackedQuery.current = normalizedQuery;
    trackEvent("Search Performed", {
      termCount: normalizedQuery.split(/\s+/).filter(Boolean).length,
      resultCount: results.length,
    });
  }, [deferredQuery, results.length]);

  return (
    <section className="content-section search-section">
      <Link className="back-link" href="/#top">
        Back Home
      </Link>
      <div className="search-header">
        <p className="eyebrow">Search</p>
        <h1>Find a room by signal instead of by hallway.</h1>
        <p>
          Search writings, projects, Tiny Thoughts, cat rooms, games, and other
          corners of ArcadeGhosts.
        </p>
        <p className="search-helper-copy">
          Search is best when you already have a signal in mind. If you just
          want a faster path, use the quick routes below instead of making
          Search do all the navigation work.
        </p>
      </div>

      <div className="search-shell">
        <label className="search-input-wrap" htmlFor="site-search">
          <span className="sr-only">Search ArcadeGhosts</span>
          <input
            id="site-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try: Twin Peaks, cats, AI, arcade, grief, playlists..."
            autoComplete="off"
          />
        </label>
        <p className="search-summary">
          {showingFeatured
            ? "Showing a featured mix of places to start."
            : `${results.length} result${results.length === 1 ? "" : "s"} for "${deferredQuery.trim()}".`}
        </p>
      </div>

      <div className="section-link-grid search-quick-links" aria-label="Quick routes">
        {quickLinks.map((group) => (
          <article className="section-link-card search-quick-link-card" key={group.title}>
            <span className="card-eyebrow">{group.eyebrow}</span>
            <h2>{group.title}</h2>
            <p>{group.text}</p>
            <div className="search-quick-link-row">
              {group.links.map((link) => (
                <TrackedLink
                  className="search-quick-link-chip"
                  href={link.href}
                  key={link.href}
                  trackingEvent="Search Quick Link Clicked"
                  trackingProperties={{
                    destination: link.href,
                    source: group.title,
                  }}
                >
                  {link.label}
                </TrackedLink>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="search-results" aria-live="polite">
        {results.length ? (
          results.map((entry) => (
            <article className="search-result-card" key={entry.id}>
              <div className="search-result-meta">
                <span>{entry.eyebrow}</span>
                <span>{entry.type.replace("-", " ")}</span>
              </div>
              <h2>{entry.title}</h2>
              <p>{entry.description}</p>
              <TrackedLink
                className="search-result-link"
                href={entry.href}
                target={isExternalLink(entry.href) ? "_blank" : undefined}
                rel={isExternalLink(entry.href) ? "noreferrer" : undefined}
                trackingEvent="Search Result Clicked"
                trackingProperties={{
                  resultId: entry.id,
                  resultType: entry.type,
                }}
              >
                {entry.cta}
              </TrackedLink>
            </article>
          ))
        ) : (
          <div className="search-empty">
            <h2>No exact signal match yet.</h2>
            <p>
              Try a broader word like <em>music</em>, <em>cats</em>,{" "}
              <em>writing</em>, <em>project</em>, or <em>Twin Peaks</em>.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
