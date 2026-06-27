import { createOgImage, ogImageContentType, ogImageSize } from "../og";

export const alt = "The Lodges Within";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function Image() {
  return createOgImage({
    eyebrow: "Twin Peaks-inspired reflection",
    title: "The Lodges Within",
    description: "A symbolic self-guided journey through clues, rooms, prompts, and one usable next step.",
    footer: ["Reflection", "Twin Peaks", "ArcadeGhosts"],
    glow: "#936cff",
  });
}
