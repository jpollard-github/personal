"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";
import type { SearchEntry } from "../lib/search-shared";
import { searchEntries } from "../lib/search-shared";

function isExternalLink(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

export function SearchPageClient({ entries }: { entries: SearchEntry[] }) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const results = searchEntries(entries, deferredQuery);
  const showingFeatured = !deferredQuery.trim();

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
              <a
                className="search-result-link"
                href={entry.href}
                target={isExternalLink(entry.href) ? "_blank" : undefined}
                rel={isExternalLink(entry.href) ? "noreferrer" : undefined}
              >
                {entry.cta}
              </a>
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
