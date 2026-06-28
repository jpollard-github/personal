import { getPublicProjects } from "../../../app/lib/projects";
import { writings } from "../../../app/writings";

export type SiteSurface = {
  id: string;
  label: string;
  path: string;
  area: "public" | "admin";
  tags: string[];
};

export const basePublicSurfaces: SiteSurface[] = [
  { id: "home", label: "Homepage", path: "/", area: "public", tags: ["software", "writing", "curious", "projects"] },
  { id: "about", label: "About", path: "/about", area: "public", tags: ["thoughtful", "identity", "curious"] },
  { id: "work-with-me", label: "Work With Me", path: "/work-with-me", area: "public", tags: ["software", "clear", "trust", "projects"] },
  { id: "music", label: "Music", path: "/music", area: "public", tags: ["music", "concerts", "listening"] },
  { id: "arcade", label: "Arcade", path: "/arcade", area: "public", tags: ["retro", "arcades", "games"] },
  { id: "movies-tv", label: "Movies & TV", path: "/movies-tv", area: "public", tags: ["movies", "television", "weird"] },
  { id: "twin-peaks-self", label: "Twin Peaks Self", path: "/twin-peaks-self", area: "public", tags: ["twin", "peaks", "thoughtful"] },
  { id: "games-between-two-lodges", label: "Between Two Lodges", path: "/games/between-two-lodges", area: "public", tags: ["games", "twin", "peaks"] },
  { id: "cats-beverly", label: "Beverly And Lucinda", path: "/cats/beverly-and-lucinda", area: "public", tags: ["cats", "warmth", "home"] },
  { id: "cats-thomas", label: "Thomas Jones Missy Cass", path: "/cats/thomas-jones-missy-cass", area: "public", tags: ["cats", "warmth", "home"] },
  { id: "writings", label: "Writings", path: "/writings", area: "public", tags: ["writing", "thoughtful", "curiosity"] },
  { id: "tiny-thoughts", label: "Tiny Thoughts", path: "/tiny-thoughts", area: "public", tags: ["writing", "small", "signals"] },
  { id: "search", label: "Search", path: "/search", area: "public", tags: ["find", "orientation", "curiosity"] },
  { id: "updates", label: "Updates", path: "/updates", area: "public", tags: ["recent", "changes", "projects"] },
  { id: "build-log", label: "Build Log", path: "/build-log", area: "public", tags: ["building", "projects", "software"] },
  { id: "error-preview-not-found", label: "404 Preview", path: "/error-preview/not-found", area: "public", tags: ["errors", "tone", "surreal"] },
  { id: "error-preview-server-error", label: "500 Preview", path: "/error-preview/server-error", area: "public", tags: ["errors", "tone", "surreal"] },
];

export const adminSurfaces: SiteSurface[] = [
  { id: "admin-home", label: "Admin Dashboard", path: "/admin", area: "admin", tags: ["admin", "control", "orientation"] },
  { id: "admin-content-inbox", label: "Content Inbox", path: "/admin/content-inbox", area: "admin", tags: ["writing", "capture", "workflow"] },
  { id: "admin-projects", label: "Projects Admin", path: "/admin/projects", area: "admin", tags: ["projects", "editing", "software"] },
  { id: "admin-now", label: "Now Admin", path: "/admin/now", area: "admin", tags: ["current", "editing", "signals"] },
  { id: "admin-tiny-thoughts", label: "Tiny Thoughts Admin", path: "/admin/tiny-thoughts", area: "admin", tags: ["writing", "editing", "thoughts"] },
  { id: "admin-writing-drafts", label: "Writing Drafts Admin", path: "/admin/writing-drafts", area: "admin", tags: ["writing", "drafts", "editing"] },
  { id: "admin-home-spotlight", label: "Home Spotlight Admin", path: "/admin/home-spotlight", area: "admin", tags: ["homepage", "editing", "curation"] },
  { id: "admin-social-quest-log", label: "Social Quest Log Admin", path: "/admin/social-quest-log", area: "admin", tags: ["social", "tracking", "workflow"] },
  { id: "admin-context-refresh", label: "Context Refresh Admin", path: "/admin/context-refresh", area: "admin", tags: ["memory", "context", "ai"] },
  { id: "admin-guestbook", label: "Guestbook Admin", path: "/admin/guestbook", area: "admin", tags: ["guestbook", "review", "community"] },
  { id: "admin-error-previews", label: "Error Previews Admin", path: "/admin/error-previews", area: "admin", tags: ["errors", "quality", "review"] },
  { id: "admin-side-hustle", label: "Side Hustle Admin", path: "/admin/side-hustle", area: "admin", tags: ["work", "offers", "editing"] },
  { id: "admin-vercel", label: "Vercel Control Room", path: "/admin/vercel", area: "admin", tags: ["analytics", "deployment", "control"] },
];

export async function getPublicPersonaSurfaces() {
  const dynamicSurfaces = [
    ...getWritingDetailSurfaces(),
    ...(await getInternalProjectSurfaces()),
  ];

  return dedupeSurfaces([...basePublicSurfaces, ...dynamicSurfaces]);
}

function getWritingDetailSurfaces(): SiteSurface[] {
  return writings.map((writing) => ({
    id: `writing-${writing.slug}`,
    label: `Writing: ${writing.title}`,
    path: `/writings/${writing.slug}`,
    area: "public" as const,
    tags: ["writing", "essay", "thoughtful", "detail"],
  }));
}

async function getInternalProjectSurfaces(): Promise<SiteSurface[]> {
  const projects = await getPublicProjects().catch(() => []);

  return projects
    .filter((project) => project.href.startsWith("/"))
    .map((project) => ({
      id: `project-${project.id}`,
      label: `Project: ${project.title}`,
      path: project.href,
      area: "public" as const,
      tags: ["projects", "detail", "software", "discovery"],
    }));
}

function dedupeSurfaces(surfaces: SiteSurface[]) {
  const seen = new Set<string>();

  return surfaces.filter((surface) => {
    const key = `${surface.area}:${surface.path}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}
