import { TrackedLink } from "../TrackedLink";

export function HomeIntroBand() {
  return (
    <section className="intro-band" aria-label="Site mood">
      <p>
        A living portfolio for software, writing, and strange little
        experiments.{" "}
        <TrackedLink
          href="/build-log"
          trackingEvent="Intro Band Link Clicked"
          trackingProperties={{ destination: "/build-log" }}
        >
          Work log
        </TrackedLink>
        .{" "}
        <TrackedLink
          href="/updates"
          trackingEvent="Intro Band Link Clicked"
          trackingProperties={{ destination: "/updates" }}
        >
          New writing & signals
        </TrackedLink>
        .{" "}
        <TrackedLink
          href="/search"
          trackingEvent="Intro Band Link Clicked"
          trackingProperties={{ destination: "/search" }}
        >
          Site search
        </TrackedLink>
        .{" "}
        <TrackedLink
          href="/writings/rss.xml"
          trackingEvent="Intro Band Link Clicked"
          trackingProperties={{ destination: "/writings/rss.xml" }}
        >
          Writing RSS
        </TrackedLink>
        .{" "}
        <TrackedLink
          href="/tiny-thoughts/rss.xml"
          trackingEvent="Intro Band Link Clicked"
          trackingProperties={{ destination: "/tiny-thoughts/rss.xml" }}
        >
          Tiny Thoughts RSS
        </TrackedLink>
        .
      </p>
    </section>
  );
}
