import type { MetadataRoute } from "next";
import { writings } from "./writings";
import { absoluteUrl } from "./seo";

const staticRoutes = [
  "",
  "/arcade",
  "/music",
  "/movies-tv",
  "/updates",
  "/twin-peaks-self",
  "/cats/beverly-and-lucinda",
  "/cats/thomas-jones-missy-cass",
  "/games/between-two-lodges/",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route || "/"),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...writings.map((writing) => ({
      url: absoluteUrl(`/writings/${writing.slug}`),
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
