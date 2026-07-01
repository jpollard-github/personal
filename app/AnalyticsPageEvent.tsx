"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "./lib/analytics";

type AnalyticsPageEventProps = {
  eventName: string;
  properties?: Record<string, unknown>;
};

export function AnalyticsPageEvent({
  eventName,
  properties,
}: AnalyticsPageEventProps) {
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    if (hasTrackedRef.current) {
      return;
    }

    hasTrackedRef.current = true;
    trackEvent(eventName, properties);
  }, [eventName, properties]);

  return null;
}
