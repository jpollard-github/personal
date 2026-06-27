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
  { label: "Fun & Games", href: "#fun-and-games" },
  { label: "About", href: "#about" },
  { label: "Work With Me", href: "/work-with-me" },
  { label: "Music", href: "/music" },
  { label: "Cats", href: "#cats" },
  { label: "Guestbook", href: "#guestbook" },
];

export const githubRepoUrl = "https://github.com/jpollard-github/personal";

export const startHereCards = [
  {
    variant: "workbench",
    glyph: "[_]",
    eyebrow: "Workbench",
    title: "See Projects",
    text: "Useful software, active experiments, and practical little systems with enough context to tell what is shipped, what is moving, and what still has sawdust on it.",
    audience: "Start here if you want the builder version of me first.",
    href: "#projects",
    cta: "Step Into The Workbench",
  },
  {
    variant: "voice",
    glyph: "//",
    eyebrow: "Voice",
    title: "Read Writing",
    text: "Essays and reflections on grief, attention, technology, comedy, identity, and the suspiciously brave act of trying again tomorrow.",
    audience: "Start here if you want the person behind the projects.",
    href: "#writing",
    cta: "Read A Few Signals",
  },
  {
    variant: "static",
    glyph: "~*",
    eyebrow: "Static",
    title: "Try Something Strange",
    text: "Interactive toys, symbolic journeys, a browser game, and other small rooms for people who like a little meaning hiding in the static.",
    audience: "Start here if you want the site's odd little heartbeat.",
    href: "#fun-and-games",
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
