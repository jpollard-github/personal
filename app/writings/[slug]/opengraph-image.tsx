import { createOgImage, ogImageContentType, ogImageSize } from "../../og";
import { writings } from "../../writings";

type ImageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const alt = "ArcadeGhosts writing";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default async function Image({ params }: ImageProps) {
  const { slug } = await params;
  const writing = writings.find((entry) => entry.slug === slug);

  if (!writing) {
    return createOgImage({
      eyebrow: "Writing",
      title: "ArcadeGhosts writing",
      description: "Essays and reflections from Jason Pollard.",
      footer: ["Writing", "Essays", "ArcadeGhosts"],
      glow: "#ff365f",
    });
  }

  return createOgImage({
    eyebrow: "Writing",
    title: writing.title,
    description: writing.description,
    footer: ["Writing", "Jason Pollard", "ArcadeGhosts"],
    glow: "#ff365f",
  });
}
