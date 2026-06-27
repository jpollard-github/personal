import { createOgImage, ogImageContentType, ogImageSize } from "../og";

export const alt = "ArcadeGhosts updates";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function Image() {
  return createOgImage({
    eyebrow: "Updates",
    title: "What changed in the booth.",
    description: "A running stream of new writings and fresh counter signals from ArcadeGhosts.",
    footer: ["Updates", "Writing", "Tiny Thoughts"],
    glow: "#ffcf6e",
  });
}
