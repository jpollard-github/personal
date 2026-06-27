import { track } from "@vercel/analytics/server";
import {
  normalizeAnalyticsEventName,
  normalizeAnalyticsProperties,
} from "./analytics-shared";

export async function trackServerEvent(
  name: string,
  properties?: Record<string, unknown>,
) {
  try {
    await track(
      normalizeAnalyticsEventName(name),
      normalizeAnalyticsProperties(properties),
    );
  } catch {
    // Ignore analytics failures so public writes do not fail.
  }
}
