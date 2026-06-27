import { createOgImage, ogImageContentType, ogImageSize } from "../og";

export const alt = "Work with Jason Pollard";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function Image() {
  return createOgImage({
    eyebrow: "Work With Me",
    title: "Small projects. Clear problems. Personal attention.",
    description: "Web apps, automation, AI workflows, developer tooling, and practical technical problem solving.",
    footer: ["Web apps", "Automation", "AI workflows"],
    glow: "#ff365f",
  });
}
