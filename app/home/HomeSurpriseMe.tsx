"use client";

import { startTransition } from "react";
import { trackEvent } from "../lib/analytics";
import { surpriseMeLinks } from "./data";

function pickRandomLink() {
  return surpriseMeLinks[Math.floor(Math.random() * surpriseMeLinks.length)];
}

export function HomeSurpriseMe() {
  return (
    <button
      className="button tertiary"
      type="button"
      onClick={() => {
        const destination = pickRandomLink().href;
        trackEvent("Surprise Me Clicked", { destination });
        startTransition(() => {
          window.location.href = destination;
        });
      }}
    >
      Surprise Me
    </button>
  );
}
