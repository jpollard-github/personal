"use client";

import posthog from "posthog-js";
import {
  normalizeAnalyticsEventName,
  normalizeAnalyticsProperties,
} from "./analytics-shared";

function getViewportProperties() {
  if (typeof window === "undefined") {
    return undefined;
  }

  return {
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
  };
}

export function capturePostHogEvent(
  name: string,
  properties?: Record<string, unknown>,
) {
  if (!process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN) {
    return;
  }

  try {
    posthog.capture(
      normalizeAnalyticsEventName(name),
      normalizeAnalyticsProperties(
        {
          ...properties,
          ...getViewportProperties(),
        },
        8,
      ),
    );
  } catch {
    // Analytics should never block a user interaction.
  }
}
