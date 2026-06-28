export type PersonaDefinition = {
  slug: string;
  name: string;
  description: string;
  preferredTags: string[];
  preferredSurfaceIds?: string[];
  deEmphasizedSurfaceIds?: string[];
};

export const personaDefinitions: PersonaDefinition[] = [
  {
    slug: "ideal-partner",
    name: "Your Ideal Partner",
    description: "A warm, curious, emotionally safe person evaluating whether the site feels grounded, interesting, and human.",
    preferredTags: ["cats", "writing", "thoughtful", "music", "identity", "curious", "home", "signals"],
    preferredSurfaceIds: ["home", "about", "writings", "tiny-thoughts", "cats-beverly", "cats-thomas", "music"],
    deEmphasizedSurfaceIds: ["admin-vercel", "admin-context-refresh"],
  },
  {
    slug: "fellow-programmer",
    name: "Fellow Programmer",
    description: "A technical peer looking for craftsmanship, interesting builds, architecture clues, and non-performative competence.",
    preferredTags: ["software", "projects", "ai", "building", "workflow", "search", "discovery"],
    preferredSurfaceIds: ["home", "work-with-me", "build-log", "search", "admin-projects", "admin-context-refresh", "admin-vercel"],
  },
  {
    slug: "reading-enthusiast",
    name: "Reading Enthusiast",
    description: "A thoughtful reader who cares about voice, essays, emotional depth, and whether the writing feels worth lingering with.",
    preferredTags: ["writing", "thoughtful", "curiosity", "identity", "home"],
    preferredSurfaceIds: ["writings", "writing-it-aint-over-till-its-over", "writing-my-first-cat", "about", "tiny-thoughts", "home"],
    deEmphasizedSurfaceIds: ["admin-projects", "admin-vercel"],
  },
  {
    slug: "local-coffee-bookstore-person",
    name: "Local Coffee / Bookstore Person",
    description: "A warm, reflective local visitor who likes bookstores, coffee shops, cats, and human texture more than software jargon.",
    preferredTags: ["cats", "writing", "identity", "home", "music", "thoughtful"],
    preferredSurfaceIds: ["home", "about", "writings", "cats-beverly", "cats-thomas", "music"],
    deEmphasizedSurfaceIds: ["admin-projects", "admin-vercel", "admin-context-refresh"],
  },
  {
    slug: "retro-arcade-friend",
    name: "Retro Arcade Friend",
    description: "A playful nostalgia-minded visitor who wants the games, music, imagery, and weirdness to feel fun rather than over-explained.",
    preferredTags: ["retro", "arcades", "games", "music", "weird", "surreal"],
    preferredSurfaceIds: ["arcade", "games-between-two-lodges", "movies-tv", "music", "home"],
    deEmphasizedSurfaceIds: ["work-with-me", "admin-projects"],
  },
  {
    slug: "curious-first-date-visitor",
    name: "Curious First-Date Visitor",
    description: "A cautious but curious person trying to decide whether the site makes Jason feel emotionally real, safe, and worth knowing.",
    preferredTags: ["cats", "writing", "identity", "thoughtful", "music", "home"],
    preferredSurfaceIds: ["home", "about", "writings", "cats-beverly", "cats-thomas", "music", "work-with-me"],
    deEmphasizedSurfaceIds: ["admin-vercel", "admin-context-refresh"],
  },
  {
    slug: "potential-client",
    name: "Potential Client",
    description: "Someone with a real software problem who wants competence, trust, clarity, and examples without needing to decode the whole site first.",
    preferredTags: ["software", "clear", "trust", "projects", "building"],
    preferredSurfaceIds: ["work-with-me", "home", "build-log", "search", "admin-side-hustle", "admin-projects"],
    deEmphasizedSurfaceIds: ["cats-beverly", "cats-thomas", "admin-vercel"],
  },
  {
    slug: "music-nerd",
    name: "Music Nerd",
    description: "A visitor who mainly cares about listening taste, curation quality, genre weirdness, and whether the music room rewards exploration.",
    preferredTags: ["music", "listening", "concerts", "weird"],
    preferredSurfaceIds: ["music", "movies-tv", "home", "tiny-thoughts"],
    deEmphasizedSurfaceIds: ["admin-projects", "work-with-me"],
  },
  {
    slug: "thoughtful-introvert",
    name: "Thoughtful Introvert",
    description: "A quiet, observant visitor drawn to calm depth, reflective writing, cats, personal rituals, and interfaces that do not shout.",
    preferredTags: ["thoughtful", "writing", "cats", "home", "signals", "identity"],
    preferredSurfaceIds: ["about", "writings", "tiny-thoughts", "cats-beverly", "cats-thomas", "home"],
    deEmphasizedSurfaceIds: ["admin-vercel", "admin-projects"],
  },
  {
    slug: "creative-technologist",
    name: "Creative Technologist",
    description: "Someone at the overlap of software, design, writing, and systems who wants to see whether the site has taste as well as implementation.",
    preferredTags: ["software", "writing", "ai", "search", "building", "projects", "curious"],
    preferredSurfaceIds: ["home", "build-log", "search", "work-with-me", "admin-content-inbox", "admin-context-refresh", "admin-vercel"],
  },
  {
    slug: "returning-fan",
    name: "Returning Fan",
    description: "A repeat visitor who already likes the site and wants clearer update loops, fresh rooms, and reasons to keep coming back.",
    preferredTags: ["recent", "changes", "projects", "writing", "signals", "building"],
    preferredSurfaceIds: ["home", "updates", "build-log", "writings", "tiny-thoughts", "music"],
    deEmphasizedSurfaceIds: ["admin-projects"],
  },
];
