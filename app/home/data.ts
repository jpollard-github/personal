import {
  arcadeGames,
  beverlyAndLucindaPhotos,
  thomasJonesMissyCassPhotos,
  visualMedia,
} from "../site-data";

export const navItems = [
  { label: "Start Here", href: "#start-here" },
  { label: "Now", href: "#now" },
  { label: "Projects", href: "#projects" },
  { label: "Writing", href: "#writing" },
  { label: "Search", href: "/search" },
  { label: "Fun & Games", href: "#fun-and-games" },
  { label: "About", href: "#about" },
  { label: "Work With Me", href: "/work-with-me" },
  { label: "Music", href: "/music" },
  { label: "Cats", href: "#cats" },
  { label: "Guestbook", href: "#guestbook" },
];

export const githubRepoUrl = "https://github.com/jpollard-github/personal";

export const surpriseMeLinks = [
  { href: "/writings/it-aint-over-till-its-over" },
  { href: "/writings/my-first-cat" },
  { href: "/games/between-two-lodges" },
  { href: "/twin-peaks-self" },
  { href: "/music" },
  { href: "/movies-tv" },
  { href: "/arcade" },
  { href: "/cats/beverly-and-lucinda" },
  { href: "/cats/thomas-jones-missy-cass" },
  { href: "/updates" },
  { href: "/#signal-booth" },
];

export const startHereCards = [
  {
    variant: "voice",
    glyph: "::",
    eyebrow: "Personal",
    title: "I want to know Jason",
    text: "Start with the human context: who I am, how I think, and why software, music, cats, stories, and strange little experiments all belong on the same site.",
    audience: "You want the person before the projects.",
    href: "/about",
    cta: "Meet Jason First",
  },
  {
    variant: "workbench",
    glyph: "[_]",
    eyebrow: "Projects",
    title: "I’m here for projects",
    text: "Go straight to the build log if you want proof of active work fast, then move outward into the broader projects and experiments still humming behind the site.",
    audience: "You want proof and shipped work first.",
    href: "/build-log",
    cta: "Start With Proof",
  },
  {
    variant: "workbench",
    glyph: ">>",
    eyebrow: "Professional",
    title: "I’m thinking about working with you",
    text: "If you are evaluating whether I can help, start with the practical path: what I do, how I work, and where to find proof of active building without digging through Search.",
    audience: "You want the trust path and next step.",
    href: "/work-with-me",
    cta: "See The Work Path",
  },
  {
    variant: "static",
    glyph: "~*",
    eyebrow: "Creative",
    title: "I want writing, music, cats, or weird rooms",
    text: "Take the warmer route through essays, songs, cat rooms, Twin Peaks atmosphere, arcade glow, and the parts of the site that make ArcadeGhosts feel haunted in a friendly way.",
    audience: "You want the site's odd little heartbeat.",
    href: "#writing",
    cta: "Follow The Strange Signal",
  },
];

export const funAndGamesCards = [
  {
    eyebrow: "Interactive",
    title: "Signal Booth",
    text: "A random oracle for people who communicate through arcade glow, cats, songs, road trips, odd films, and late-night notes.",
    href: "#signal-booth",
    cta: "Try it",
  },
  {
    eyebrow: "Reflection",
    title: "The Lodges Within",
    text: "A Twin Peaks-inspired self-guided journey for naming the room you are in and leaving with one usable next step.",
    href: "/twin-peaks-self",
    cta: "Enter",
  },
  {
    eyebrow: "Game",
    title: "Between Two Lodges",
    text: "A browser text adventure about coffee, woods, clues, dreams, recurring witnesses, and alternate endings.",
    href: "/games/between-two-lodges/",
    cta: "Play",
  },
];

export const aboutCards = [
  {
    eyebrow: "Field Guide",
    title: "Arcade Room",
    text: `${arcadeGames.length} favorite cabinets and the quarter-light nostalgia that still hums behind the projects.`,
    href: "/arcade",
    cta: "Open",
  },
  {
    eyebrow: "Taste Map",
    title: "Movies & TV",
    text: `${visualMedia.length} screen signals: Twin Peaks, Severance, horror, memory loops, strange comedies, and other resonant static.`,
    href: "/movies-tv",
    cta: "Browse",
  },
  {
    eyebrow: "Listening Room",
    title: "Music",
    text: "Synths, late-night tenderness, Music League, and songs for fluorescent weather.",
    href: "/music",
    cta: "Listen",
  },
  {
    eyebrow: "Side Projects",
    title: "Work With Me",
    text: "I occasionally take on small fixed-price projects involving web apps, automation, AI workflows, developer tooling, and practical problem solving.",
    href: "/work-with-me",
    cta: "Inquire",
  },
];

export const catCards = [
  {
    eyebrow: `${beverlyAndLucindaPhotos.length} photos`,
    title: "Beverly and Lucinda",
    text: "Tiny chaos professionals from 2025 to current: ping pong balls, Churu, bed visits, and meaningful eye contact.",
    href: "/cats/beverly-and-lucinda",
  },
  {
    eyebrow: `${thomasJonesMissyCassPhotos.length} photos`,
    title: "Thomas, Jones, Missy, and Cass",
    text: "A larger memory room from 2016 to 2025, with Thomas and the little orbit of cats around him.",
    href: "/cats/thomas-jones-missy-cass",
  },
];

export const resonanceLinks = [
  { href: "https://welcometotwinpeaks.com", label: "Twin Peaks fans" },
  { href: "https://nightride.fm/", label: "Synthwave and retro culture" },
  { href: "https://rateyourmusic.com", label: "Music discovery" },
  { href: "https://www.arcade-museum.com", label: "Arcade history and preservation" },
  { href: "https://longreads.com", label: "Curious minds and long-form ideas" },
  { href: "https://www.are.na", label: "Weird, beautiful internet projects" },
];
