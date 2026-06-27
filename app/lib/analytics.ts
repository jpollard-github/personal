"use client";

import { track } from "@vercel/analytics";
import {
  normalizeAnalyticsEventName,
  normalizeAnalyticsProperties,
} from "./analytics-shared";

export function trackEvent(name: string, properties?: Record<string, unknown>) {
  try {
    track(
      normalizeAnalyticsEventName(name),
      normalizeAnalyticsProperties(properties),
    );
  } catch {
    // Analytics should never block a user interaction.
  }
}
