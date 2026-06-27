import { createOgImage, ogImageContentType, ogImageSize } from "../og";

export const alt = "Search ArcadeGhosts";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function Image() {
  return createOgImage({
    eyebrow: "Search",
    title: "Find the signal you were looking for.",
    description: "Search writings, projects, Tiny Thoughts, games, cats, music, and other rooms across ArcadeGhosts.",
    footer: ["Search", "Writing", "Projects", "Signals"],
    glow: "#29f0d4",
  });
}
