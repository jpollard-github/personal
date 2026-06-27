import { createOgImage, ogImageContentType, ogImageSize } from "../og";

export const alt = "ArcadeGhosts movies and TV room";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function Image() {
  return createOgImage({
    eyebrow: "Movies & TV",
    title: "Screen signals that stuck around.",
    description: "Twin Peaks, Severance, horror, strange comedies, memory loops, and other resonant static.",
    footer: ["Twin Peaks", "Severance", "Horror", "ArcadeGhosts"],
    glow: "#ffcf6e",
  });
}
