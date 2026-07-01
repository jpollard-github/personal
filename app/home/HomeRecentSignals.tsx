"use client";

import { useEffect, useState } from "react";
import { TrackedLink } from "../TrackedLink";
import { guestbookCategories } from "../lib/guestbook";
import type { GuestbookEntry, GuestbookCategory } from "../lib/guestbook";

const guestbookCategoryLabels = new Map<GuestbookCategory, string>(
  guestbookCategories.map((category) => [category, category.replace(/-/g, " ")]),
);

function summarizeMessage(message: string) {
  if (message.length <= 140) {
    return message;
  }

  return `${message.slice(0, 137).trimEnd()}...`;
}

export function HomeRecentSignals({ entries }: { entries: GuestbookEntry[] }) {
  const [liveEntries, setLiveEntries] = useState(entries);

  useEffect(() => {
    let isMounted = true;

    async function loadEntries() {
      const response = await fetch("/api/guestbook", { cache: "no-store" });

      if (!response.ok) {
        throw new Error("Unable to load recent signals.");
      }

      const data = (await response.json()) as { entries: GuestbookEntry[] };

      if (isMounted) {
        setLiveEntries(data.entries.slice(0, 3));
      }
    }

    loadEntries().catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, []);

  if (!liveEntries.length) {
    return null;
  }

  return (
    <section className="content-section recent-signals-section" id="recent-signals">
      <div className="recent-signals-heading">
        <p className="eyebrow">Recent Signals</p>
        <h2>A few notes already on the wall.</h2>
        <p>
          Small transmissions from visitors so the site feels inhabited before
          you make it all the way to the guestbook.
        </p>
      </div>
      <div className="recent-signals-grid">
        {liveEntries.map((entry) => (
          <article className="recent-signal-card" key={entry.id}>
            <div>
              <span>{guestbookCategoryLabels.get(entry.category) ?? "other"}</span>
              <strong>{entry.name}</strong>
            </div>
            <p>{summarizeMessage(entry.message)}</p>
            <TrackedLink
              href="#guestbook"
              trackingEvent="guestbook_click"
              trackingProperties={{
                surface: "recent_signals",
                source: "home",
              }}
            >
              Leave your own signal
            </TrackedLink>
          </article>
        ))}
      </div>
    </section>
  );
}
