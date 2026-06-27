import { createOgImage, ogImageContentType, ogImageSize } from "../og";

export const alt = "ArcadeGhosts music room";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function Image() {
  return createOgImage({
    eyebrow: "Music",
    title: "Playlists, synth weather, and listening history.",
    description: "Jason Pollard's listening room for Music League, playlists, moods, eras, and fluorescent-weather favorites.",
    footer: ["Music", "Playlists", "Listening room"],
    glow: "#29f0d4",
  });
}
