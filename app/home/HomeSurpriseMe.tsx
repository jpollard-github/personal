"use client";

import { startTransition } from "react";
import { surpriseMeLinks } from "./data";

function pickRandomLink() {
  return surpriseMeLinks[Math.floor(Math.random() * surpriseMeLinks.length)];
}

export function HomeSurpriseMe() {
  return (
    <button
      className="button tertiary"
      type="button"
      onClick={() =>
        startTransition(() => {
          window.location.href = pickRandomLink().href;
        })
      }
    >
      Surprise Me
    </button>
  );
}
