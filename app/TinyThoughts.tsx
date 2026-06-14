"use client";

import { useEffect, useState } from "react";
import type { TinyThought } from "./lib/tiny-thoughts";

const categoryLabels = new Map([
  ["lesson", "Lesson learned"],
  ["observation", "Observation"],
  ["funny", "Funny experience"],
  ["opinion", "Opinion"],
  ["arcade", "Arcade"],
  ["music", "Music"],
  ["cat", "Cat"],
  ["twin-peaks", "Twin Peaks"],
  ["other", "Other"],
]);

const inspiredByLabels = new Map([
  ["article-link", "Article link"],
  ["song", "Song"],
  ["video", "Video"],
  ["conversation", "Conversation"],
  ["other", "Other"],
]);

function getUrlHost(value: string) {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return value;
  }
}

function renderLinkedText(text: string) {
  const parts = text.split(/(https?:\/\/[^\s<>"']+)/g);

  return parts.map((part, index) => {
    if (!/^https?:\/\//.test(part)) {
      return part;
    }

    try {
      const url = new URL(part);

      return (
        <a key={`${part}-${index}`} href={url.toString()} target="_blank" rel="noreferrer">
          {url.hostname.replace(/^www\./, "")}
        </a>
      );
    } catch {
      return part;
    }
  });
}

export function TinyThoughts() {
  const [thoughts, setThoughts] = useState<TinyThought[]>([]);
  const [status, setStatus] = useState("Loading tiny thoughts...");

  useEffect(() => {
    let isMounted = true;

    async function loadThoughts() {
      const response = await fetch("/api/tiny-thoughts");

      if (!response.ok) {
        throw new Error("Unable to load tiny thoughts.");
      }

      const data = (await response.json()) as { thoughts: TinyThought[] };

      if (isMounted) {
        setThoughts(data.thoughts);
        setStatus(data.thoughts.length ? "" : "No tiny thoughts yet.");
      }
    }

    loadThoughts().catch(() => {
      if (isMounted) {
        setStatus("Tiny thoughts are temporarily unavailable.");
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  if (status && !thoughts.length) {
    return <p className="tiny-thought-status">{status}</p>;
  }

  return (
    <div className="tiny-thought-grid">
      {thoughts.map((thought) => (
        <article className="tiny-thought-card" key={thought.id}>
          {thought.attachments
            .filter((attachment) => attachment.type === "image")
            .slice(0, 1)
            .map((attachment) => (
              <img
                key={attachment.url}
                src={attachment.url}
                alt=""
                className="tiny-thought-image"
                loading="lazy"
              />
            ))}
          <div className="tiny-thought-meta">
            <span>{categoryLabels.get(thought.category) ?? "Other"}</span>
            <time dateTime={thought.createdAt}>
              {new Intl.DateTimeFormat("en", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }).format(new Date(thought.createdAt))}
            </time>
          </div>
          <p>{renderLinkedText(thought.content)}</p>
          {thought.attachments.filter((attachment) => attachment.type === "image").length > 1 ? (
            <div className="tiny-thought-image-strip">
              {thought.attachments
                .filter((attachment) => attachment.type === "image")
                .slice(1)
                .map((attachment) => (
                  <img key={attachment.url} src={attachment.url} alt="" loading="lazy" />
                ))}
            </div>
          ) : null}
          {thought.inspiredBy ? (
            <p className="tiny-thought-inspired">
              Inspired by {inspiredByLabels.get(thought.inspiredByCategory) ?? "Other"}:{" "}
              {renderLinkedText(thought.inspiredBy)}
            </p>
          ) : null}
          {thought.attachments.some((attachment) => attachment.type === "link") ? (
            <div className="tiny-thought-attachments">
              {thought.attachments
                .filter((attachment) => attachment.type === "link")
                .map((attachment, index) => (
                  <a
                    key={`${attachment.url}-${index}`}
                    href={attachment.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {attachment.title || getUrlHost(attachment.url)}
                  </a>
                ))}
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}
