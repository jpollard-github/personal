import type { Metadata } from "next";
import { HomeAbout } from "./home/HomeAbout";
import { HomeCats } from "./home/HomeCats";
import { HomeFunAndGames } from "./home/HomeFunAndGames";
import { HomeGuestbook } from "./home/HomeGuestbook";
import { HomeHero } from "./home/HomeHero";
import { HomeHashScroller } from "./home/HomeHashScroller";
import { HomeIntroBand } from "./home/HomeIntroBand";
import { HomeNow } from "./home/HomeNow";
import { HomeProjects } from "./home/HomeProjects";
import { HomeRecentSignals } from "./home/HomeRecentSignals";
import { HomeStartHere } from "./home/HomeStartHere";
import { HomeTinyThoughts } from "./home/HomeTinyThoughts";
import { HomeWriting } from "./home/HomeWriting";
import { getPublicGuestbookEntries } from "./lib/guestbook";
import { getPublicNowItems } from "./lib/now";
import { getPublicProjects } from "./lib/projects";
import { absoluteUrl, siteConfig } from "./seo";
import { writings } from "./writings";

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
  const [nowItems, projects, guestbookEntries] = await Promise.all([
    getPublicNowItems(),
    getPublicProjects(),
    getPublicGuestbookEntries(3).catch(() => []),
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
      {
        "@type": "ItemList",
        "@id": absoluteUrl("/#project-list"),
        name: "Featured projects",
        itemListElement: projects.slice(0, 6).map((project, index) => ({
          "@type": project.href.startsWith("/") ? "SoftwareApplication" : "CreativeWork",
          position: index + 1,
          name: project.title,
          description: project.description,
          url: absoluteUrl(project.href || "/#projects"),
          applicationCategory: project.type,
          creativeWorkStatus: project.status,
        })),
      },
      {
        "@type": "Blog",
        "@id": absoluteUrl("/#writing-list"),
        name: "ArcadeGhosts writing",
        blogPost: writings.map((writing) => ({
          "@type": "BlogPosting",
          headline: writing.title,
          description: writing.description,
          url: absoluteUrl(`/writings/${writing.slug}`),
          author: {
            "@id": absoluteUrl("/#jason-pollard"),
          },
        })),
      },
    ],
  };

  return (
    <main>
      <HomeHashScroller />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <a className="back-up-top" href="#top">
        Back Up Top
      </a>
      <HomeHero />
      <HomeStartHere />
      <HomeIntroBand />
      <HomeRecentSignals entries={guestbookEntries} />
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
