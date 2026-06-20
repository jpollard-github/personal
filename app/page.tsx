import type { Metadata } from "next";
import { HomeAbout } from "./home/HomeAbout";
import { HomeCats } from "./home/HomeCats";
import { HomeFunAndGames } from "./home/HomeFunAndGames";
import { HomeGuestbook } from "./home/HomeGuestbook";
import { HomeHero } from "./home/HomeHero";
import { HomeIntroBand } from "./home/HomeIntroBand";
import { HomeNow } from "./home/HomeNow";
import { HomeProjects } from "./home/HomeProjects";
import { HomeTinyThoughts } from "./home/HomeTinyThoughts";
import { HomeWriting } from "./home/HomeWriting";
import { getPublicNowItems } from "./lib/now";
import { getPublicProjects } from "./lib/projects";
import { absoluteUrl, siteConfig } from "./seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Jason Pollard's Projects, Writing, Music, Cats, and Arcade Ghosts",
  description:
    "ArcadeGhosts is Jason Pollard's personal site for software projects, essays, music signals, cat photos, arcade nostalgia, and strange little experiments.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ArcadeGhosts | Jason Pollard",
    description:
      "Software projects, essays, music signals, cat photos, arcade nostalgia, and strange little experiments.",
    url: "/",
  },
};

export default async function Home() {
  const [nowItems, projects] = await Promise.all([
    getPublicNowItems(),
    getPublicProjects(),
  ]);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": absoluteUrl("/#jason-pollard"),
        name: siteConfig.author,
        url: siteConfig.url,
        sameAs: ["https://github.com/jpollard-github"],
        knowsAbout: [
          "Software development",
          "Artificial intelligence",
          "Arcade games",
          "Writing",
          "Music",
          "Cats",
          "Twin Peaks",
        ],
      },
      {
        "@type": "WebSite",
        "@id": absoluteUrl("/#website"),
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description,
        author: {
          "@id": absoluteUrl("/#jason-pollard"),
        },
      },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <a className="back-up-top" href="#top">
        Back Up Top
      </a>
      <HomeHero />
      <HomeIntroBand />
      <HomeNow items={nowItems} />
      <HomeProjects projects={projects} />
      <HomeWriting />
      <HomeTinyThoughts />
      <HomeFunAndGames />
      <HomeAbout />
      <HomeCats />
      <HomeGuestbook />
    </main>
  );
}
