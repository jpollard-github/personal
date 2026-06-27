import type { Metadata } from "next";
import Link from "next/link";
import { TinyThoughts } from "../TinyThoughts";

export const metadata: Metadata = {
  title: "Tiny Thoughts",
  description:
    "Short signals from ArcadeGhosts: observations, lessons, funny moments, opinions, and small notes that do not need to become full essays.",
  alternates: {
    canonical: "/tiny-thoughts",
  },
  openGraph: {
    title: "Tiny Thoughts",
    description:
      "Short signals from ArcadeGhosts: observations, lessons, funny moments, opinions, and small notes.",
    url: "/tiny-thoughts",
  },
};

export default function TinyThoughtsPage() {
  return (
    <main className="writing-index-page">
      <section className="writing-index-section">
        <Link className="back-link" href="/#tiny-thoughts">
          Back Home
        </Link>
        <header className="writing-index-header">
          <p className="eyebrow">Tiny Thoughts</p>
          <h1>Short signals from the counter.</h1>
          <p>
            Quick observations, lessons, funny moments, opinions, and other
            small notes that are alive enough to publish without becoming full essays.
          </p>
          <div className="feed-links">
            <a className="feed-link" href="/tiny-thoughts/rss.xml">
              Subscribe via RSS
            </a>
          </div>
        </header>
        <TinyThoughts />
      </section>
    </main>
  );
}
