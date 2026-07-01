import posthog from "posthog-js";

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

if (projectToken) {
  posthog.init(projectToken, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    defaults: "2026-05-30",
    autocapture: false,
    capture_pageleave: true,
    capture_pageview: "history_change",
    disable_session_recording: true,
    disableDeviceModel: true,
    persistence: "memory",
    respect_dnt: true,
  });
}
