export type BuildLogEntry = {
  id: string;
  date: string;
  title: string;
  summary: string;
  category: string;
  details: string[];
  impact: string;
  public?: boolean;
  href?: string;
  linkLabel?: string;
};

export const buildLogEntries: BuildLogEntry[] = [
  {
    id: "image-optimization-pass",
    date: "2026-06-27",
    title: "Compressed image-heavy rooms and homepage art",
    summary:
      "Converted cat galleries, arcade posters, movie stills, the signal booth art set, and the neon diner hero to lighter WebP assets.",
    category: "Performance",
    details: [
      "Replaced heavy JPG and PNG files with WebP across multiple public rooms.",
      "Removed unused original assets once the site was switched over safely.",
      "Improved above-the-fold image loading for the biggest public collections.",
    ],
    impact:
      "Cuts page weight substantially on image-heavy routes and makes the site cheaper to browse on repeat visits.",
    href: "/movies-tv",
    linkLabel: "See one of the lighter rooms",
  },
  {
    id: "coverage-pass",
    date: "2026-06-27",
    title: "Expanded test coverage across public pages and editorial flows",
    summary:
      "Added stronger unit and end-to-end coverage for search, RSS, public routes, and Content Inbox draft handoffs.",
    category: "Quality",
    details: [
      "Added unit coverage for search ranking, RSS rendering, writing-draft publishing helpers, and inbox normalization.",
      "Added browser coverage for newer public rooms, feed endpoints, and admin draft-import flows.",
      "Reorganized unit tests into a dedicated tests/unit structure.",
    ],
    impact:
      "Makes it much easier to change the site without wondering whether a route, feed, or editor flow quietly broke.",
    href: "/search",
    linkLabel: "See one tested public surface",
  },
  {
    id: "content-inbox-handoffs",
    date: "2026-06-26",
    title: "Turned the Content Inbox into a real draft pipeline",
    summary:
      "Inbox items can now move into Tiny Thoughts, Projects, Now, and Writing Drafts instead of dying as static notes.",
    category: "Workflow",
    details: [
      "Added send-to-draft handoffs for multiple content destinations.",
      "Improved the draft import behavior on admin pages so imported items appear immediately and cleanly.",
      "Kept the workflow documented directly in the repo and on the admin surface.",
    ],
    impact:
      "Makes it easier to capture worthwhile fragments quickly and shape them later instead of losing them to inertia.",
    public: false,
  },
  {
    id: "spotlight-queue",
    date: "2026-06-26",
    title: "Added a rotating homepage spotlight queue",
    summary:
      "The homepage spotlight can now be curated as a small queue instead of one card you have to keep rewriting by hand.",
    category: "Homepage",
    details: [
      "Added a reusable queue behind the homepage spotlight.",
      "Made the top of the homepage feel more current without needing a full redesign every time.",
      "Kept the spotlight intentionally editorial rather than algorithmic.",
    ],
    impact:
      "Gives returning visitors a more alive first impression with less upkeep friction.",
    href: "/#spotlight",
    linkLabel: "Jump to the spotlight",
  },
  {
    id: "room-splitting",
    date: "2026-06-25",
    title: "Split crowded homepage sections into fuller dedicated rooms",
    summary:
      "Writing, About, and Tiny Thoughts now have their own pages while the homepage stays more preview-oriented and easier to scan.",
    category: "Structure",
    details: [
      "Moved content-heavy sections into their own destination pages.",
      "Kept homepage previews so discovery still starts from one place.",
      "Reduced scroll fatigue without flattening the site's personality.",
    ],
    impact:
      "Makes first visits feel more guided while still rewarding deeper wandering.",
    href: "/about",
    linkLabel: "Visit one of the fuller rooms",
  },
  {
    id: "discovery-layer",
    date: "2026-06-25",
    title: "Added search, updates, feeds, and stronger cross-linking",
    summary:
      "Built a better discovery layer so the site feels easier to revisit and easier to move around inside.",
    category: "Discovery",
    details: [
      "Added site search across writings, projects, Tiny Thoughts, games, and other public pages.",
      "Added updates and RSS routes for recurring content.",
      "Added related-link blocks so pages lead naturally into neighboring rooms.",
    ],
    impact:
      "Helps good content stay findable after the first visit instead of disappearing into the site map.",
    href: "/updates",
    linkLabel: "Browse recent changes",
  },
];

export function getPublicBuildLogEntries() {
  return buildLogEntries.filter((entry) => entry.public !== false);
}

export function getRecentBuildLogEntries(limit = 3) {
  return [...getPublicBuildLogEntries()]
    .sort((left, right) => right.date.localeCompare(left.date))
    .slice(0, limit);
}
