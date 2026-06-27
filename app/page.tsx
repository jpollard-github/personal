import type { Metadata } from "next";
import { HomeAbout } from "./home/HomeAbout";
import { HomeCats } from "./home/HomeCats";
import { HomeFunAndGames } from "./home/HomeFunAndGames";
import { HomeGuestbook } from "./home/HomeGuestbook";
import { HomeBuildLog } from "./home/HomeBuildLog";
import { HomeHero } from "./home/HomeHero";
import { HomeHashScroller } from "./home/HomeHashScroller";
import { HomeIntroBand } from "./home/HomeIntroBand";
import { HomeNow } from "./home/HomeNow";
import { HomeProjects } from "./home/HomeProjects";
import { HomeRecentSignals } from "./home/HomeRecentSignals";
import { HomeSectionBridge } from "./home/HomeSectionBridge";
import { HomeSpotlight } from "./home/HomeSpotlight";
import { HomeStartHere } from "./home/HomeStartHere";
import { HomeTinyThoughts } from "./home/HomeTinyThoughts";
import { HomeWriting } from "./home/HomeWriting";
import { getPublicGuestbookEntries } from "./lib/guestbook";
import { getPublicHomeSpotlight } from "./lib/home-spotlight";
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
  const [nowItems, projects, guestbookEntries, customSpotlight] = await Promise.all([
    getPublicNowItems(),
    getPublicProjects(),
    getPublicGuestbookEntries(3).catch(() => []),
    getPublicHomeSpotlight().catch(() => null),
  ]);
  const featuredProject =
    projects.find((project) => project.status === "active") ?? projects[0] ?? null;
  const featuredWriting = writings[0] ?? null;
  const currentItem = nowItems[0] ?? null;
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
      <HomeIntroBand />
      <HomeHero />
      <HomeStartHere />
      <HomeSpotlight
        customSpotlight={customSpotlight}
        currentItem={currentItem}
        featuredProject={featuredProject}
        featuredWriting={featuredWriting}
      />
      <HomeSectionBridge
        eyebrow="Signal Check"
        text="If you like a quick proof of life before you dive deep, the site keeps a small public work log now."
        href="/build-log"
        linkLabel="See recent changes."
      />
      <HomeBuildLog />
      <HomeRecentSignals entries={guestbookEntries} />
      <HomeNow items={nowItems} />
      <HomeSectionBridge
        eyebrow="From The Counter"
        text="The next few rooms answer a simple question: what feels current, what is being built, and where the longer thoughts are going."
      />
      <HomeProjects projects={projects} />
      <HomeWriting />
      <HomeTinyThoughts />
      <HomeSectionBridge
        eyebrow="Wider Hallways"
        text="Once you have the practical and personal signal, the stranger side rooms are where the site loosens its tie."
        href="#fun-and-games"
        linkLabel="Follow the odd little heartbeat."
      />
      <HomeFunAndGames />
      <HomeAbout />
      <HomeCats />
      <HomeGuestbook />
    </main>
  );
}
