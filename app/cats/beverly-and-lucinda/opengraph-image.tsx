import { createOgImage, ogImageContentType, ogImageSize } from "../../og";

export const alt = "Beverly and Lucinda cat room";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function Image() {
  return createOgImage({
    eyebrow: "Cats",
    title: "Beverly and Lucinda",
    description: "Current-day cat signals: ping pong balls, Churu, bed visits, and suspiciously meaningful eye contact.",
    footer: ["Cats", "Beverly", "Lucinda"],
    glow: "#29f0d4",
  });
}
