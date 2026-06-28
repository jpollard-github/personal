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
    id: "content-ops-clarity-pass",
    date: "2026-06-28",
    title: "Clarified content operations and separated reading from site work",
    summary:
      "Tightened the publishing workflow in the admin area and made the difference between Updates and Build Log much clearer for both visitors and future maintenance.",
    category: "Workflow",
    details: [
      "Added the editorial guide directly into the Content Inbox admin page as a collapsed reference panel below the existing instructions.",
      "Clarified the content docs so Content TODO owns the backlog, the Editorial Guide owns voice, and the low-friction flow owns the capture-to-draft workflow.",
      "Updated homepage, Updates, Build Log, and search copy so 'new things to read' and 'behind-the-scenes site work' stop blurring together.",
    ],
    impact:
      "Makes the site easier to publish from, easier to understand as a returning visitor, and less likely to confuse content freshness with technical or structural work.",
    href: "/updates",
    linkLabel: "See the fresh-reading stream",
  },
  {
    id: "publishing-ops-clarity-pass",
    date: "2026-06-28",
    title: "Turned the repo into a calmer publishing and maintenance system",
    summary:
      "Pulled the site further away from framework obsession and toward a clearer day-to-day rhythm for content, website improvements, operations, and review.",
    category: "Workflow",
    details: [
      "Added a docs hub, editorial guide, content backlog, admin vision, and repo architecture notes so the next work is easier to find and easier to prioritize.",
      "Improved public trust and discovery paths across the homepage, About, Build Log, Search, Movies & TV, and the Twin Peaks corner.",
      "Kept the persona framework stable while making the reports and TODOs more honest about what is a real website issue versus a planner artifact.",
    ],
    impact:
      "Makes the repo easier to live inside, gives publishing a clearer home, and turns the surrounding tooling into support structure instead of the main event.",
    href: "/#build-log",
    linkLabel: "See the latest work in context",
  },
  {
    id: "persona-journey-mode-v1",
    date: "2026-06-28",
    title: "Turned persona testing into a real journey system",
    summary:
      "Refactored the persona suite around reusable personas, archetypes, scenarios, and deterministic journey reports instead of one broad crawl interpreted the same way every time.",
    category: "Research",
    details: [
      "Moved persona profiles into a cleaner shared structure and added first-class archetypes like Wanderer, Builder, and Romantic.",
      "Added a representative fast journey suite so trust-seeking, return-oriented, technical, and personality-first visitors now take meaningfully different paths.",
      "Separated durable persona output from transient Playwright artifacts so longer reviews and ChatGPT handoff packets stop getting wiped.",
    ],
    impact:
      "Makes audience testing feel closer to real visits and turns the reports into something useful for design, structure, and editorial decisions instead of only route coverage.",
    href: "/build-log",
    linkLabel: "See the public work log",
  },
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
