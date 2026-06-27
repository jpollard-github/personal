import { createOgImage, ogImageContentType, ogImageSize } from "./og";

export const alt = "ArcadeGhosts by Jason Pollard";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function Image() {
  return createOgImage({
    eyebrow: "ArcadeGhosts",
    title: "Useful tools with a strange little heartbeat.",
    description:
      "Projects, writing, cats, music, arcade nostalgia, and strange little experiments from the neon forest.",
    footer: ["Projects", "Writing", "Arcades", "Cats"],
    glow: "#29f0d4",
  });
}
