import { createOgImage, ogImageContentType, ogImageSize } from "../og";

export const alt = "ArcadeGhosts arcade room";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function Image() {
  return createOgImage({
    eyebrow: "Arcade Room",
    title: "Quarter-light nostalgia and favorite cabinets.",
    description: "A field guide to arcade games, memory, and the hum behind the whole site.",
    footer: ["Arcades", "Cabinets", "Nostalgia"],
    glow: "#29f0d4",
  });
}
