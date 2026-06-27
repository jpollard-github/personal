import { createOgImage, ogImageContentType, ogImageSize } from "../../og";

export const alt = "Thomas, Jones, Missy, and Cass cat room";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function Image() {
  return createOgImage({
    eyebrow: "Cats",
    title: "Thomas, Jones, Missy, and Cass",
    description: "A longer cat memory room about companionship, grief, and the little orbit around Thomas.",
    footer: ["Cats", "Memory room", "ArcadeGhosts"],
    glow: "#ffcf6e",
  });
}
